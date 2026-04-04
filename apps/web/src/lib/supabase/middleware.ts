import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run on static assets or favicon
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/favicon.ico') ||
    request.nextUrl.pathname.includes('/public/')
  ) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect all routes except auth routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register') ||
                      request.nextUrl.pathname.startsWith('/forgot-password')

  // Redirection logic
  if (!user && !isAuthRoute && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/select-company', request.url))
  }

  // Handle redirect matching user's active tenant if on select-company
  // but if the user has only 1 tenant and lands here, it should redirect 
  // (Handling this in Middleware vs Client Page)

  return supabaseResponse
}
