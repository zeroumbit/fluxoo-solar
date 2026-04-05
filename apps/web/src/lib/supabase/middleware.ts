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

  // Helper para redirecionar mas preservar cookies (ex: auth tokens renovados ou tenant metadata)
  const redirectWithCookies = (url: URL | string) => {
    const response = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value)
    })
    return response
  }

  // Deslogado -> Login
  if (!user && !isAuthRoute && path !== '/') {
    return redirectWithCookies(new URL('/login', request.url))
  }

  // Logado acessando rota de auth -> Dashboard
  if (user && isAuthRoute) {
    // Super Admin sempre vai para /super-admin/dashboard
    if (isSuperAdmin(user)) {
      return redirectWithCookies(new URL('/super-admin/dashboard', request.url))
    }
    // Demais usuários: busca tenant e redireciona
    const activeTenantId = user.user_metadata?.active_tenant_id || user.app_metadata?.active_tenant_id
    const activeTenantType = user.user_metadata?.active_tenant_type || user.app_metadata?.active_tenant_type

    if (activeTenantId && activeTenantType) {
      const routeMap: Record<string, string> = {
        'INTEGRATOR': '/integrator/dashboard',
        'ENGINEERING_FIRM': '/engineering/dashboard',
        'RESELLER': '/reseller/dashboard'
      }
      if (routeMap[activeTenantType]) {
        return redirectWithCookies(new URL(routeMap[activeTenantType], request.url))
      }
    }

    // Busca o tenant ativo
    const { data: memberships } = await supabase
      .from('tenant_user_memberships')
      .select('tenant_id, role, tenants(type)')
      .eq('user_id', user.id)
      .eq('is_active', true)

    const typedMemberships = memberships as any[]

    if (typedMemberships && typedMemberships.length > 0) {
      const m = typedMemberships[0]
      const type = m.tenants.type

      await supabase.auth.updateUser({
        data: {
          active_tenant_id: m.tenant_id,
          active_role: m.role,
          active_tenant_type: type
        }
      })

      const routeMap: Record<string, string> = {
        'INTEGRATOR': '/integrator/dashboard',
        'ENGINEERING_FIRM': '/engineering/dashboard',
        'RESELLER': '/reseller/dashboard'
      }

      if (routeMap[type]) {
        return redirectWithCookies(new URL(routeMap[type], request.url))
      }
    }

    // Sem tenant encontrado -> login
    return redirectWithCookies(new URL('/login', request.url))
  }

  // 4. RBAC Check (Fase 2 - Regra 5)
  if (user && !isAuthRoute && path !== '/unauthorized') {
    const activeTenantId = user.user_metadata?.active_tenant_id || user.app_metadata?.active_tenant_id
    const activeTenantType = user.user_metadata?.active_tenant_type || user.app_metadata?.active_tenant_type

    // Se tentar acessar dashboard sem tenant ativo, busca e redireciona
    const isDashboardPath = ['/super-admin', '/integrator', '/engineering', '/reseller', '/dashboard'].some(p => path.startsWith(p))
    const isRootPath = path === '/'

    if (!isSuperAdmin(user) && (isDashboardPath && !activeTenantId) || isRootPath) {
        const { data: memberships } = await supabase
            .from('tenant_user_memberships')
            .select('tenant_id, role, tenants(type)')
            .eq('user_id', user.id)
            .eq('is_active', true)

        const typedMemberships = memberships as any[]

        if (typedMemberships && typedMemberships.length > 0) {
            const m = typedMemberships[0]
            const type = m.tenants.type

            if (m.tenant_id !== activeTenantId || type !== activeTenantType) {
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

            if (routeMap[type]) {
                return redirectWithCookies(new URL(routeMap[type], request.url))
            }
        }

        // Sem tenant -> login com erro
        return redirectWithCookies(new URL('/login?error=Nenhuma+empresa+encontrada', request.url))
    }

    // SUPER ADMIN: Só pode acessar rotas /super-admin/*
    if (isSuperAdmin(user)) {
      const isSuperAdminPath = path.startsWith('/super-admin/')
      if (!isSuperAdminPath && !path.startsWith('/logout')) {
        return redirectWithCookies(new URL('/super-admin/dashboard', request.url))
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
            return redirectWithCookies(new URL('/unauthorized', request.url))
        }
    }
}

  return supabaseResponse
}
