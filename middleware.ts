import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin/* routes
  if (pathname.startsWith('/admin')) {
    // Allow login page without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Create a Supabase client from the request
    let supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            const response = NextResponse.next()
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
            return response
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Redirect to login if no session
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
