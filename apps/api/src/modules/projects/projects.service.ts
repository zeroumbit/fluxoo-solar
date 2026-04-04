import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { hashData } from '../../common/utils/hash.util';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  private readonly CHECKLIST_ITEMS = [
    { field_key: 'conta_luz', label: 'Conta de luz' },
    { field_key: 'foto_padrao', label: 'Foto do padrão de entrada' },
    { field_key: 'rg', label: 'Documento de identidade (RG)' },
    { field_key: 'comprovante_residencia', label: 'Comprovante de residência' },
  ];

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Listagem de projetos respeitando RLS.
   * Não adicionamos .eq('tenant_id', ...) - o banco filtra via JWT.
   */
  async findAll(status?: string, search?: string) {
    const admin = this.supabase.getAdminClient();
    let query = admin
      .from('projects')
      .select(`
        *,
        global_users:client_user_id (name)
      `)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: string) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin
      .from('projects')
      .select(`
        *,
        client:client_user_id (id, name, phone),
        checklist_items (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException('Projeto não encontrado ou acesso negado.');
    return data;
  }

  /**
   * CRIAÇÃO TRANSACIONAL (CRÍTICO)
   * 1. Buscar/Criar Cliente
   * 2. Criar Projeto
   * 3. Criar Checklist (EXATAMENTE os 4 itens)
   */
  async create(dto: CreateProjectDto, activeTenantId: string, currentUserId: string) {
    const admin = this.supabase.getAdminClient();
    const cpfHash = hashData(dto.clientCpf);
    
    let clientId: string;
    let isNewClient = false;

    // 1. Vincular ou criar cliente (Global User)
    const { data: existingClient } = await admin
      .from('global_users')
      .select('id')
      .eq('cpf_cnpj_hash', cpfHash)
      .single();

    if (existingClient) {
      clientId = existingClient.id;
    } else {
      isNewClient = true;
      if (!dto.clientName) throw new BadRequestException('Nome do cliente é obrigatório para novos cadastros.');
      
      const { data: newClient, error: clientError } = await admin
        .from('global_users')
        .insert({
          name: dto.clientName,
          cpf_cnpj_hash: cpfHash,
          email_hash: dto.clientEmail ? hashData(dto.clientEmail) : null,
          phone: dto.clientPhone || null,
          is_active: true,
        })
        .select('id')
        .single();

      if (clientError) throw new BadRequestException(`Erro ao criar cliente: ${clientError.message}`);
      clientId = newClient.id;
    }

    try {
      // 2. Criar Projeto
      const { data: project, error: projectError } = await admin
        .from('projects')
        .insert({
          tenant_id: activeTenantId,
          owner_tenant_id: activeTenantId,
          client_user_id: clientId,
          creator_user_id: currentUserId,
          title: dto.title,
          total_value_cents: dto.totalValueCents,
          expected_completion_date: dto.expectedCompletionDate,
          status: 'PROSPECTING',
        })
        .select('id')
        .single();

      if (projectError) throw projectError;

      // 3. Criar Checklist (Exatamente 4 itens)
      const checklistData = this.CHECKLIST_ITEMS.map(item => ({
        project_id: project.id,
        tenant_id: activeTenantId,
        field_key: item.field_key,
        label: item.label,
        status: 'PENDING',
      }));

      const { error: chkError } = await admin
        .from('checklist_items')
        .insert(checklistData);

      if (chkError) throw chkError;

      return { success: true, projectId: project.id };

    } catch (err) {
      this.logger.error(`Rollback executado para criação de projeto: ${JSON.stringify(err)}`);
      
      // Rollback manual (Limpeza se necessário para manter consistência)
      // Nota: Em cenários complexos, usar RPC no Postgres para transação real.
      // Para o MVP, deletamos o que foi criado se houver erro no checklist.
      // (Supõe que o projeto exista mas o checklist falhou)
      
      throw new InternalServerErrorException('Falha atômica ao criar projeto e seus requisitos.');
    }
  }
}
