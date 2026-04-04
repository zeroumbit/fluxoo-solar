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
  async findAll() { /* ... */ }
  async findOne(id: string) { /* ... */ }
}
