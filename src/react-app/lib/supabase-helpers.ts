import { supabase } from '../supabase'

// ==================== AUTH ====================

// Helper to get current authenticated user from Supabase
export async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return null
    }

    const { data: usuario } = await supabase
        .from('usuarios')
        .select('*')
        .or(`auth_user_id.eq.${session.user.id},email.eq.${session.user.email}`)
        .eq('is_active', true)
        .maybeSingle()

    // Link auth user if not linked
    if (usuario && !usuario.auth_user_id) {
        await supabase
            .from('usuarios')
            .update({ auth_user_id: session.user.id })
            .eq('id', usuario.id)
    }

    return usuario
}

// Helper to check if user is admin
export async function isAdmin() {
    const user = await getCurrentUser()
    return user?.rol === 'administrador'
}

// ==================== USUARIOS ====================

export async function getUsuarios() {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('apellido', { ascending: true })
        .order('nombre', { ascending: true })

    if (error) throw error
    return data
}

export async function createUsuario(usuario: any) {
    // Note: Creating users with auth requires service role key
    // For now, we'll just create the profile and let admin set password separately
    const { data, error } = await supabase
        .from('usuarios')
        .insert({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol,
            is_active: true
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateUsuario(id: number, usuario: any) {
    const { data, error } = await supabase
        .from('usuarios')
        .update({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteUsuario(id: number) {
    // Soft delete
    const { error } = await supabase
        .from('usuarios')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw error
}

// ==================== CURSOS ====================

export async function getCursos() {
    console.log('[getCursos] Fetching cursos...')
    const { data, error } = await supabase
        .from('cursos')
        .select('*, usuarios(nombre, apellido)')
        .eq('is_active', true)
        .order('nombre_curso')
        .order('seccion')

    if (error) {
        console.error('[getCursos] Error:', error)
        throw error
    }

    console.log('[getCursos] Data received:', data)

    return data.map((curso: any) => ({
        ...curso,
        maestro_nombre: curso.usuarios ? `${curso.usuarios.nombre} ${curso.usuarios.apellido}` : null
    }))
}

export async function createCurso(curso: any) {
    const { data, error } = await supabase
        .from('cursos')
        .insert({
            nombre_curso: curso.nombre_curso,
            nivel: curso.nivel,
            seccion: curso.seccion,
            id_maestro: curso.id_maestro || null,
            descripcion: curso.descripcion,
            anio_escolar: curso.anio_escolar,
            is_active: true
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateCurso(id: number, curso: any) {
    const { data, error } = await supabase
        .from('cursos')
        .update({
            ...curso,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteCurso(id: number) {
    // Try hard delete first
    const { error: hardError } = await supabase
        .from('cursos')
        .delete()
        .eq('id', id)

    if (hardError) {
        // If hard delete fails (has students), do soft delete
        const { error: softError } = await supabase
            .from('cursos')
            .update({
                is_active: false,
                id_maestro: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (softError) throw softError
    }
}

// ==================== ESTUDIANTES ====================

export async function getEstudiantes() {
    const { data: estudiantes, error } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('is_active', true)
        .order('nombre')
        .order('apellido')

    if (error) throw error

    // Fetch courses
    const { data: cursos } = await supabase
        .from('cursos')
        .select('id, nombre_curso, seccion')

    const cursosMap = new Map(cursos?.map((c: any) => [c.id, c]) || [])

    return estudiantes.map((e: any) => {
        const curso: any = e.id_curso_actual ? cursosMap.get(e.id_curso_actual) : null
        return {
            ...e,
            curso_nombre: curso?.nombre_curso,
            curso_seccion: curso?.seccion
        }
    })
}

export async function createEstudiante(estudiante: any) {
    const { data, error } = await supabase
        .from('estudiantes')
        .insert({
            ...estudiante,
            is_active: true
        })
        .select()
        .single()

    if (error) throw error

    // Enroll in course if specified
    if (data.id_curso_actual) {
        await supabase
            .from('estudiantes_cursos')
            .insert({
                id_estudiante: data.id,
                id_curso: data.id_curso_actual,
                fecha_inscripcion: new Date().toISOString()
            })
    }

    return data
}

export async function updateEstudiante(id: number, estudiante: any) {
    const { data, error } = await supabase
        .from('estudiantes')
        .update({
            ...estudiante,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteEstudiante(id: number) {
    // Soft delete
    const { error } = await supabase
        .from('estudiantes')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw error
}

// ==================== INDICADORES ====================

export async function getIndicadores(curso?: string, categoria?: string) {
    let query = supabase
        .from('indicadores')
        .select('*, categorias_indicadores(nombre_categoria)')
        .eq('is_active', true)

    if (curso) {
        query = query.ilike('niveles_aplicables', `%${curso}%`)
    }
    if (categoria) {
        query = query.eq('id_categoria', categoria)
    }

    query = query.order('orden').order('id')

    const { data, error } = await query

    if (error) throw error

    return data.map((i: any) => ({
        ...i,
        nombre_categoria: i.categorias_indicadores?.nombre_categoria
    }))
}

export async function createIndicador(indicador: any) {
    const { data, error } = await supabase
        .from('indicadores')
        .insert({
            ...indicador,
            is_active: true
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateIndicador(id: number, indicador: any) {
    const { data, error } = await supabase
        .from('indicadores')
        .update({
            ...indicador,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteIndicador(id: number) {
    // Soft delete
    const { error } = await supabase
        .from('indicadores')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

    if (error) throw error
}

// ==================== CATEGORIAS ====================

export async function getCategorias() {
    const { data, error } = await supabase
        .from('categorias_indicadores')
        .select('*')
        .order('created_at')

    if (error) throw error
    return data
}

export async function createCategoria(categoria: any) {
    const { data, error } = await supabase
        .from('categorias_indicadores')
        .insert(categoria)
        .select()
        .single()

    if (error) throw error
    return data
}

// ==================== STATS ====================

export async function getStats() {
    const [usuarios, estudiantes, cursos, evaluaciones] = await Promise.all([
        supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('estudiantes').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('cursos').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('evaluaciones').select('*', { count: 'exact', head: true })
    ])

    return {
        usuarios: usuarios.count || 0,
        estudiantes: estudiantes.count || 0,
        cursos: cursos.count || 0,
        evaluaciones: evaluaciones.count || 0
    }
}
