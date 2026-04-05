'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SUPER_ADMIN } from '@/constants/super-admin'
import type { User } from '@supabase/supabase-js'

function isSuperAdmin(user: User | null): boolean {
  if (!user) return false
  return (
    user.email === SUPER_ADMIN.EMAIL ||
    user.id === SUPER_ADMIN.UID ||
    user.app_metadata?.active_tenant_type === 'SUPER_ADMIN'
  )
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=' + error.message)
  }

  revalidatePath('/', 'layout')

  // 1. Super Admin vai direto para /super-admin/dashboard
  if (isSuperAdmin(data.user)) {
    redirect('/super-admin/dashboard')
  }

  // 2. Se já tem tenant ativo nos metadados, vai direto
  const metadata = data.user!.user_metadata;
  const activeTenantId = metadata?.active_tenant_id
  const activeTenantType = metadata?.active_tenant_type

  if (activeTenantId && activeTenantType) {
    const routeMap: Record<string, string> = {
      'INTEGRATOR': '/integrator/dashboard',
      'ENGINEERING_FIRM': '/engineering/dashboard',
      'RESELLER': '/reseller/dashboard'
    };
    if (routeMap[activeTenantType]) {
      redirect(routeMap[activeTenantType]);
    }
  }

  // 3. Busca o tenant do usuário e redireciona direto ao dashboard
  const { data: memberships } = await supabase
    .from('tenant_user_memberships')
    .select('tenant_id, role, tenants(type)')
    .eq('user_id', data.user!.id)
    .eq('is_active', true);

  const typedMemberships = memberships as any[];

  if (typedMemberships && typedMemberships.length > 0) {
    // Pega o primeiro tenant ativo (se tiver múltiplos, pega o primeiro)
    const m = typedMemberships[0];
    const type = m.tenants.type;

    // Atualizar os metadados da sessão para persistir a escolha
    await supabase.auth.updateUser({
      data: {
        active_tenant_id: m.tenant_id,
        active_role: m.role,
        active_tenant_type: type
      }
    });

    const routeMap: Record<string, string> = {
      'INTEGRATOR': '/integrator/dashboard',
      'ENGINEERING_FIRM': '/engineering/dashboard',
      'RESELLER': '/reseller/dashboard'
    };

    if (routeMap[type]) {
      redirect(routeMap[type]);
    }
  }

  // Se não encontrou nenhum tenant, vai para página de erro
  redirect('/login?error=Nenhuma+empresa+encontrada.+Contate+o+suporte.')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=' + error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check your email for confirmation')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
