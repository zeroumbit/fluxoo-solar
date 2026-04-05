import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
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

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Supabase Client Setup
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 2. Public / Static filters
  if (path.startsWith('/_next') || path.includes('/favicon.ico') || path.includes('/public/')) {
    return supabaseResponse
  }

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register')

  // 3. Redirection Logic (Fase 2)

  // Deslogado -> Login
  if (!user && !isAuthRoute && path !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Logado acessando rota de auth -> Select Company ou Dashboard
  if (user && isAuthRoute) {
    // Super Admin sempre vai para /super-admin/dashboard, nunca para /select-company
    if (isSuperAdmin(user)) {
      return NextResponse.redirect(new URL('/super-admin/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  // 4. RBAC Check (Fase 2 - Regra 5)
  if (user && !isAuthRoute && path !== '/unauthorized') {
    const activeTenantId = user.user_metadata?.active_tenant_id || user.app_metadata?.active_tenant_id
    const activeTenantType = user.user_metadata?.active_tenant_type || user.app_metadata?.active_tenant_type

    // REGRA DE OURO: Se o usuário estiver no /select-company mas só tiver 1 empresa, redireciona automático
    // OU se estiver tentando acessar o dashboard sem tenant ativo.
    const isDashboardPath = ['/super-admin', '/integrator', '/engineering', '/reseller', '/dashboard'].some(p => path.startsWith(p))
    const isSelectCompanyPath = path === '/select-company'

    if (!isSuperAdmin(user) && (isSelectCompanyPath || (isDashboardPath && !activeTenantId) || path === '/')) {
        const { data: memberships } = await supabase
            .from('tenant_user_memberships')
            .select('tenant_id, role, tenants(type)')
            .eq('user_id', user.id)
            .eq('is_active', true)

        const typedMemberships = memberships as any[]

        if (typedMemberships?.length === 1) {
            const m = typedMemberships[0]
            const type = m.tenants.type

            // Se o que estamos tentando selecionar for DIFERENTE do que já está ativo (ou se não tem nada ativo)
            if (m.tenant_id !== activeTenantId) {
                await supabase.auth.updateUser({
                    data: {
                        active_tenant_id: m.tenant_id,
                        active_role: m.role,
                        active_tenant_type: type
                    }
                })
            }

            const routeMap: Record<string, string> = {
                'INTEGRATOR': '/integrator/dashboard',
                'ENGINEERING_FIRM': '/engineering/dashboard',
                'RESELLER': '/reseller/dashboard'
            }
            
            if (routeMap[type] && path !== routeMap[type]) {
                return NextResponse.redirect(new URL(routeMap[type], request.url))
            }
        }
    }

    // SUPER ADMIN: Só pode acessar rotas /super-admin/*
    if (isSuperAdmin(user)) {
      const isSuperAdminPath = path.startsWith('/super-admin/')
      if (!isSuperAdminPath && !isSelectCompanyPath) {
        return NextResponse.redirect(new URL('/super-admin/dashboard', request.url))
      }
      return supabaseResponse
    }

    // Validação de correspondência Tipo x Rota
    const typeToPathMap: Record<string, string> = {
        'SUPER_ADMIN': '/super-admin',
        'INTEGRATOR': '/integrator',
        'ENGINEERING_FIRM': '/engineering',
        'RESELLER': '/reseller'
    }

    if (activeTenantType && isDashboardPath) {
        const expectedPrefix = typeToPathMap[activeTenantType]
        if (expectedPrefix && !path.startsWith(expectedPrefix)) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }
}

  return supabaseResponse
}
