'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleTenantStatus(tenantId: string, activate: boolean) {
  const supabase = await createClient()

  // Verifica se o usuário é Super Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Não autenticado' }
  }

  const { data: membership } = await supabase
    .from('tenant_user_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('tenant_id', process.env.SUPER_ADMIN_TENANT_ID || '')
    .single()

  if (membership?.role !== 'SUPER_ADMIN') {
    return { error: 'Sem permissão' }
  }

  // Atualiza o status do tenant via RPC (bypass RLS com SECURITY DEFINER)
  const { error } = await supabase.rpc('super_admin_toggle_tenant_status', {
    p_tenant_id: tenantId,
    p_is_active: activate,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/super-admin/tenants')
  return { success: true }
}
