import { Injectable, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ProjectStatusPolicyService, ProjectStatus } from './project-status-policy.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly statusPolicy: ProjectStatusPolicyService
  ) {}

  /**
   * Atualização de Status com Validação Centralizada (Regra 5).
   */
  async updateStatus(id: string, newStatus: ProjectStatus, currentUserId: string, activeTenantId: string, userRole: string) {
    const admin = this.supabase.getAdminClient();

    // 1. Buscar projeto atual (usando admin para ver owner_tenant_id)
    const { data: project, error: pError } = await admin
      .from('projects')
      .select('status, owner_tenant_id, delegated_engineering_tenant_id')
      .eq('id', id)
      .single();

    if (pError || !project) throw new BadRequestException('Projeto não encontrado.');

    // 2. Validar permissão de transição
    const isOwnerTenant = project.owner_tenant_id === activeTenantId;
    const isDelegatedEngineering = project.delegated_engineering_tenant_id === activeTenantId;

    this.statusPolicy.validateTransition(
      project.status as ProjectStatus,
      newStatus,
      userRole,
      isOwnerTenant,
      isDelegatedEngineering
    );

    // 3. Executar transição
    const { error: updateError } = await admin
        .from('projects')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

    if (updateError) throw updateError;

    // 4. Registrar evento de sistema na Timeline (Regra 1 e 5)
    await admin.from('project_messages').insert({
        project_id: id,
        sender_id: currentUserId,
        sender_name: 'Sistema',
        content: `Status alterado de ${project.status} para ${newStatus}.`,
        visibility_layer: 'B2C_PUBLIC', // Público para que todos vejam a mudança
        is_system_event: true,
    });

    return { success: true, newStatus };
  }

  /**
   * Delegação para Empresa de Engenharia (Regra 7).
   */
  async delegateToEngineering(id: string, delegatedTenantId: string, activeTenantId: string, userRole: string) {
    const admin = this.supabase.getAdminClient();

    // 1. Validar se quem delega é a integradora dona
    const { data: project } = await admin.from('projects').select('owner_tenant_id').eq('id', id).single();
    if (project?.owner_tenant_id !== activeTenantId || !['OWNER', 'MANAGER'].includes(userRole)) {
        throw new ForbiddenException('Apenas a Integradora (Owner/Manager) pode delegar este projeto.');
    }

    // 2. Validar se o alvo é uma empresa de engenharia
    const { data: engineeringTenant } = await admin.from('tenants').select('type').eq('id', delegatedTenantId).single();
    if (engineeringTenant?.type !== 'ENGINEERING_FIRM') {
        throw new BadRequestException('O destinatário deve ser uma empresa de engenharia vinculada.');
    }

    // 3. Registrar delegação
    const { error } = await admin
        .from('projects')
        .update({ delegated_engineering_tenant_id: delegatedTenantId })
        .eq('id', id);

    if (error) throw error;

    // 4. Registrar evento de sistema na timeline
    await admin.from('project_messages').insert({
        project_id: id,
        sender_name: 'Sistema',
        content: 'Projeto delegado para empresa de engenharia terceirizada.',
        visibility_layer: 'TECHNICAL_INTERNAL',
        is_system_event: true,
    });

    return { success: true };
  }

  // Métodos list (findAll) e findOne do checkpoint anterior devem ser mantidos/mesclados:
  async findAll(status?: string, search?: string) {
    const admin = this.supabase.getAdminClient();
    let query = admin.from('projects').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) throw new BadRequestException('Projeto não encontrado.');
    return data;
  }

  async create(dto: any, activeTenantId: string, currentUserId: string) {
    const admin = this.supabase.getAdminClient();

    const { data, error } = await admin
      .from('projects')
      .insert({
        ...dto,
        owner_tenant_id: activeTenantId,
        created_by: currentUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  /**
   * Projetos recebidos pela engenharia (delegados por integradoras).
   */
  async getReceivedByEngineering(activeTenantId: string, filters?: { status?: string; search?: string }) {
    const admin = this.supabase.getAdminClient();

    let query = admin
      .from('projects')
      .select(`
        *,
        integrator:tenants!owner_tenant_id(id, name, fantasy_name, type),
        client:clients(*)
      `)
      .eq('delegated_engineering_tenant_id', activeTenantId);

    // Filtro por status
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    // Busca por código ou nome da integradora
    if (filters?.search) {
      query = query.or(`code.ilike.%${filters.search}%,title.ilike.%${filters.search}%`);
    }

    const { data: projects, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error('Erro ao buscar projetos recebidos:', error);
      throw new BadRequestException(error.message);
    }

    return projects || [];
  }

  /**
   * Estatísticas para dashboard de engenharia.
   */
  async getEngineeringStats(activeTenantId: string) {
    const admin = this.supabase.getAdminClient();

    // Buscar todos os projetos delegados
    const { data: projects, error } = await admin
      .from('projects')
      .select('id, status, total_value_cents, deadline, created_at, title, type')
      .eq('delegated_engineering_tenant_id', activeTenantId);

    if (error) {
      this.logger.error('Erro ao buscar estatísticas:', error);
      throw new BadRequestException(error.message);
    }

    const allProjects = projects || [];
    const now = new Date();

    // Contagem por status
    const statusCounts = allProjects.reduce((acc, p) => {
      const status = p.status || 'UNKNOWN';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Projetos ativos (não completados/cancelados)
    const activeProjects = allProjects.filter(
      p => !['COMPLETED', 'CANCELED', 'REJECTED'].includes(p.status)
    );

    // Projetos atrasados (deadline passado e não completo)
    const delayedProjects = allProjects.filter(p => {
      if (!p.deadline) return false;
      if (['COMPLETED', 'CANCELED', 'REJECTED'].includes(p.status)) return false;
      return new Date(p.deadline) < now;
    });

    // Valor total dos projetos ativos
    const totalActiveValue = activeProjects.reduce(
      (acc, p) => acc + (p.total_value_cents || 0), 0
    );

    // Valor recebido (10% do valor dos projetos - taxa de engenharia)
    const engineeringFeePercent = 0.10;
    const totalReceivable = Math.floor(totalActiveValue * engineeringFeePercent);

    // Faturamento aberto (projetos em DESIGNING, REVIEW, APPROVED)
    const openBillingProjects = activeProjects.filter(
      p => ['DESIGNING', 'REVIEW', 'APPROVED', 'PENDING'].includes(p.status)
    );
    const openBillingValue = openBillingProjects.reduce(
      (acc, p) => acc + (p.total_value_cents || 0), 0
    );

    // Projetos por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentProjects = allProjects.filter(
      p => new Date(p.created_at) >= sixMonthsAgo
    );

    const monthlyActivity = recentProjects.reduce((acc, p) => {
      const date = new Date(p.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) acc[key] = 0;
      acc[key]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      total_projects: allProjects.length,
      active_projects: activeProjects.length,
      delayed_projects: delayedProjects.length,
      delayed_project_ids: delayedProjects.map(p => p.id),
      total_value_cents: totalActiveValue,
      total_receivable_cents: totalReceivable,
      open_billing_cents: openBillingValue,
      status_counts: statusCounts,
      monthly_activity: monthlyActivity,
      projects_by_type: allProjects.reduce((acc, p) => {
        const type = p.type || 'SOLAR';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
