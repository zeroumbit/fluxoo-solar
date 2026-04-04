import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Listar notificações do usuário respeitando RLS.
   */
  async findAll(userId: string) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async markAsRead(id: string, userId: string) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    const admin = this.supabase.getAdminClient();
    const { error } = await admin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }

  /**
   * Criação programática de notificação interna (Trigger real-time).
   */
  async createNotification(userId: string, tenantId: string, type: string, title: string, content: string, metadata: any = {}) {
     const admin = this.supabase.getAdminClient();
     const { data, error } = await admin
        .from('notifications')
        .insert({
            user_id: userId,
            tenant_id: tenantId,
            type,
            title,
            content,
            metadata
        })
        .select()
        .single();

     if (error) throw new BadRequestException(error.message);
     return data;
  }
}
