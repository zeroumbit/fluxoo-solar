import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  // 4. RBAC Check (Fase 2 - Regra 5)
  if (user && !isAuthRoute && path !== '/select-company' && path !== '/unauthorized') {
    const activeTenantType = user.app_metadata?.active_tenant_type
    const activeTenantId = user.app_metadata?.active_tenant_id

    // Se estiver em uma rota de dashboard mas sem tenant ativo
    const isDashboardPath = ['/super-admin', '/integrator', '/engineering', '/reseller'].some(p => path.startsWith(p))
    
    if (isDashboardPath && !activeTenantId) {
        return NextResponse.redirect(new URL('/select-company', request.url))
    }

    // Validação de correspondência Tipo x Rota
    const typeToPathMap: Record<string, string> = {
        'SUPER_ADMIN': '/super-admin',
        'INTEGRATOR': '/integrator',
        'ENGINEERING_FIRM': '/engineering',
        'RESELLER': '/reseller'
    }

    if (activeTenantType) {
        const expectedPrefix = typeToPathMap[activeTenantType]
        if (expectedPrefix && !path.startsWith(expectedPrefix) && isDashboardPath) {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }
  }

  return supabaseResponse
}
