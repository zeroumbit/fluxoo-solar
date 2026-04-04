import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MessagesService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Listagem de mensagens da timeline respeitando visibilidade (Regra 2).
   */
  async findByProject(projectId: string, activeTenantType: string) {
    const admin = this.supabase.getAdminClient();
    let query = admin
      .from('project_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    // Filtragem por camada (Conceito Regra 2) - B2C_PUBLIC é visível para todos.
    // Se o usuário for cliente/usuário global (não tiver tenant_type), ele só vê B2C_PUBLIC.
    if (!activeTenantType) {
        query = query.eq('visibility_layer', 'B2C_PUBLIC');
    }

    const { data, error } = await query;
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  /**
   * Envio de mensagem com validação de camada (Regra 2).
   */
  async createMessage(projectId: string, dto: any, currentUserId: string, activeRole: string, activeTenantId: string) {
    const admin = this.supabase.getAdminClient();

    // 1. Validar se camada é permitida para quem envia (Conceitos)
    if (activeTenantId && dto.visibility_layer === 'TECHNICAL_INTERNAL') {
        const { data: project } = await admin.from('projects').select('owner_tenant_id, delegated_engineering_tenant_id').eq('id', projectId).single();
        if (project?.owner_tenant_id !== activeTenantId && project?.delegated_engineering_tenant_id !== activeTenantId) {
            throw new ForbiddenException('Apenas equipes do projeto podem enviar mensagens técnicas.');
        }
    }

    // 2. Registrar mensagem
    const { data: userProfile } = await admin.from('user_profiles').select('name').eq('id', currentUserId).single();

    const { data: message, error } = await admin
      .from('project_messages')
      .insert({
        project_id: projectId,
        sender_id: currentUserId,
        sender_name: userProfile?.name || 'Sistema',
        content: dto.content,
        visibility_layer: dto.visibility_layer,
        attachment_url: dto.attachmentUrl || null,
        is_system_event: false
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return message;
  }
}
