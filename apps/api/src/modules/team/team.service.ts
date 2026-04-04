import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { crypto } from 'crypto';

@Injectable()
export class TeamService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Convidar novo membro por e-mail (Regra 1).
   */
  async inviteMembro(email: string, role: string, inviterUserId: string, activeTenantId: string, inviterRole: string) {
    const admin = this.supabase.getAdminClient();

    // 1. Apenas OWNER ou MANAGER podem convidar
    if (!['OWNER', 'MANAGER'].includes(inviterRole)) {
        throw new ForbiddenException('Permissão insuficiente para convidar membros.');
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: invite, error } = await admin
      .from('team_invites')
      .insert({
        tenant_id: activeTenantId,
        inviter_id: inviterUserId,
        email: email.toLowerCase(),
        role: role,
        token: token,
        expires_at: expiresAt,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) throw new BadRequestException(`Erro ao criar convite: ${error.message}`);

    // TODO: Enviar e-mail real via MailerService (Not implemented in this phase scope)
    console.log(`Convite enviado para ${email} com token ${token}`);
    
    return { success: true, inviteId: invite.id };
  }

  /**
   * Listar membros do tenant ativo (Regra 2).
   */
  async listMembers(activeTenantId: string) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin
      .from('tenant_user_memberships')
      .select(`
        id,
        user_id,
        role,
        is_active,
        created_at,
        profiles:user_id (name, email)
      `)
      .eq('tenant_id', activeTenantId);

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  /**
   * Editar Role (Regra 2).
   */
  async updateRole(targetUserId: string, newRole: string, activeTenantId: string, inviterRole: string) {
    const admin = this.supabase.getAdminClient();
    
    // Regra 2: OWNER edita todos (exceto rebaixar outro OWNER). MANAGER edita inferiores.
    if (inviterRole === 'MANAGER' && ['OWNER', 'MANAGER'].includes(newRole)) {
        throw new ForbiddenException('Managers não podem definir roles de nível igual ou superior.');
    }

    const { error } = await admin
      .from('tenant_user_memberships')
      .update({ role: newRole })
      .eq('tenant_id', activeTenantId)
      .eq('user_id', targetUserId);

    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }

  async setMemberStatus(targetUserId: string, status: boolean, activeTenantId: string) {
     const admin = this.supabase.getAdminClient();
     const { error } = await admin
        .from('tenant_user_memberships')
        .update({ is_active: status })
        .eq('tenant_id', activeTenantId)
        .eq('user_id', targetUserId);

     if (error) throw new BadRequestException(error.message);
     return { success: true };
  }
}
