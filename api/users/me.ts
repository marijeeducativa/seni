import { createClient } from '@supabase/supabase-js'

export default async function handler(req: Request): Promise<Response> {
  try {
    // Check environment variables inside the handler
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables:', {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      })
      return new Response(JSON.stringify({
        error: 'Server configuration error: Missing Supabase credentials'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Create Supabase client inside the handler
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')
    let token = authHeader?.replace('Bearer ', '')

    if (!token) {
      const cookies = req.headers.get('Cookie')
      const tokenMatch = cookies?.match(/sb-access-token=([^;]+)/)
      token = tokenMatch?.[1]
    }

    if (!token) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('Verifying user token...')
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error('Token verification failed:', error?.message)
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('Fetching user profile for:', user.email)
    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .select('*')
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .eq('is_active', true)
      .maybeSingle()

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(JSON.stringify({
        error: 'Database error: ' + dbError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!usuario) {
      console.error('User not found in database for:', user.email)
      return new Response(JSON.stringify({ error: 'User not found in database' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Update auth_user_id if not set
    if (!usuario.auth_user_id) {
      console.log('Linking auth user to profile...')
      await supabase
        .from('usuarios')
        .update({ auth_user_id: user.id })
        .eq('id', usuario.id)
    }

    console.log('User authenticated successfully:', usuario.email)
    return new Response(JSON.stringify(usuario), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('API /users/me error:', error)
    return new Response(JSON.stringify({
      error: error.message || 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}