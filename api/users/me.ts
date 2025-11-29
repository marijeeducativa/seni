import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 })
    }

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

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .select('*')
      .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
      .eq('is_active', true)
      .maybeSingle()

    if (dbError || !usuario) {
      return new Response(JSON.stringify({ error: 'User not found in database' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Update auth_user_id if not set
    if (!usuario.auth_user_id) {
      await supabase
        .from('usuarios')
        .update({ auth_user_id: user.id })
        .eq('id', usuario.id)
    }

    return new Response(JSON.stringify(usuario), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('API /users/me error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}