import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CommentsService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Busca comentários de um item do checklist (Regra 3).
   */
  async findByChecklistItem(itemId: string, hasTenant: boolean) {
    const admin = this.supabase.getAdminClient();
    let query = admin
      .from('checklist_comments')
      .select('*')
      .eq('item_id', itemId)
      .order('created_at', { ascending: true });

    // Cliente final (sem tenant logado) nunca vê comentários internos (Regra 3)
    if (!hasTenant) {
        query = query.eq('is_internal', false);
    }

    const { data, error } = await query;
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  /**
   * Envio de comentário no checklist (Regra 3).
   */
  async createComment(itemId: string, dto: any, currentUserId: string, hasTenant: boolean) {
    const admin = this.supabase.getAdminClient();

    // 1. Cliente final nunca pode postar como interno
    let isInternal = dto.isInternal;
    if (!hasTenant) isInternal = false;

    // 2. Registrar comentário
    const { data: userProfile } = await admin.from('user_profiles').select('name').eq('id', currentUserId).single();

    const { data: comment, error } = await admin
      .from('checklist_comments')
      .insert({
        item_id: itemId,
        author_id: currentUserId,
        author_name: userProfile?.name || 'Sistema',
        content: dto.content,
        is_internal: isInternal,
      })
      .select()
      .single();

    if (error) throw new BadRequestException(`Erro checklist comment: ${error.message}`);
    return comment;
  }
}
