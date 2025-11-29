import { createClient } from '@supabase/supabase-js'

export const config = {
  maxDuration: 10, // Maximum execution time in seconds
}

export default async function handler(req: Request): Promise<Response> {
  const startTime = Date.now()

  try {
    console.log('[1] Handler started')

    // Check environment variables
    const hasUrl = !!process.env.SUPABASE_URL
    const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('[2] Environment check:', { hasUrl, hasKey })

    if (!hasUrl || !hasKey) {
      return new Response(JSON.stringify({
        error: 'Missing environment variables',
        hasUrl,
        hasKey
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 })
    }

    console.log('[3] Creating Supabase client...')
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    console.log('[4] Supabase client created')

    // Get token
    const authHeader = req.headers.get('Authorization')
    let token = authHeader?.replace('Bearer ', '')

    if (!token) {
      const cookies = req.headers.get('Cookie')
      const tokenMatch = cookies?.match(/sb-access-token=([^;]+)/)
      token = tokenMatch?.[1]
    }

    if (!token) {
      console.log('[5] No token provided')
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('[6] Verifying token...')
    const authResult = await Promise.race([
      supabase.auth.getUser(token),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Auth timeout')), 5000)
      )
    ]) as any

    const { data: { user }, error } = authResult

    if (error || !user) {
      console.log('[7] Token verification failed:', error?.message)
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('[8] Token verified, fetching user profile...')
    const dbResult = await Promise.race([
      supabase
        .from('usuarios')
        .select('*')
        .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
        .eq('is_active', true)
        .maybeSingle(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]) as any

    const { data: usuario, error: dbError } = dbResult

    if (dbError) {
      console.log('[9] Database error:', dbError.message)
      return new Response(JSON.stringify({
        error: 'Database error',
        message: dbError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!usuario) {
      console.log('[10] User not found')
      return new Response(JSON.stringify({ error: 'User not found in database' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Update auth_user_id if not set
    if (!usuario.auth_user_id) {
      console.log('[11] Linking auth user...')
      await supabase
        .from('usuarios')
        .update({ auth_user_id: user.id })
        .eq('id', usuario.id)
    }

    const duration = Date.now() - startTime
    console.log('[12] Success! Duration:', duration, 'ms')

    return new Response(JSON.stringify(usuario), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.error('[ERROR] Handler failed after', duration, 'ms:', error.message)
    console.error('[ERROR] Stack:', error.stack)

    return new Response(JSON.stringify({
      error: error.message || 'Internal Server Error',
      duration: duration + 'ms'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}