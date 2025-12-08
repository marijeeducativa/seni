import { supabase } from '../supabase'
import { CATEGORIES_SEED, INDICATORS_SEED } from './seed-data';

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
    console.log('[getEstudiantes] Starting...')

    try {
        const { data: estudiantes, error } = await supabase
            .from('estudiantes')
            .select('*')
            // .eq('is_active', true)
            .order('nombre')
            .order('apellido')

        if (error) {
            console.error('[getEstudiantes] Error fetching estudiantes:', error)
            throw error
        }

        console.log('[getEstudiantes] Estudiantes received:', estudiantes?.length)

        // Fetch courses
        const { data: cursos, error: cursosError } = await supabase
            .from('cursos')
            .select('id, nombre_curso, seccion')

        if (cursosError) {
            console.error('[getEstudiantes] Error fetching cursos:', cursosError)
        }

        console.log('[getEstudiantes] Cursos received:', cursos?.length)

        const cursosMap = new Map(cursos?.map((c: any) => [c.id, c]) || [])

        return estudiantes.map((e: any) => {
            const curso: any = e.id_curso_actual ? cursosMap.get(e.id_curso_actual) : null
            return {
                ...e,
                curso_nombre: curso?.nombre_curso,
                curso_seccion: curso?.seccion
            }
        })
    } catch (error) {
        console.error('[getEstudiantes] Catch error:', error)
        throw error
    }
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

export async function createEstudiantesBulk(estudiantes: any[]) {
    // 1. Get course info to set grado_nivel
    const courseIds = [...new Set(estudiantes.map(e => e.id_curso_actual).filter(Boolean))]
    let courseMap = new Map()

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from('cursos')
            .select('id, nombre_curso, seccion')
            .in('id', courseIds)

        courses?.forEach((c: any) => {
            courseMap.set(c.id, `${c.nombre_curso}${c.seccion ? ` - Sección ${c.seccion}` : ''}`)
        })
    }

    // 2. Prepare data
    const studentsToInsert = estudiantes.map(est => ({
        nombre: est.nombre,
        apellido: est.apellido,
        genero: est.genero,
        fecha_nacimiento: est.fecha_nacimiento,
        nombre_tutor: est.nombre_tutor,
        telefono_tutor: est.telefono_tutor,
        email_tutor: est.email_tutor,
        direccion_tutor: est.direccion_tutor,
        grado_nivel: est.id_curso_actual ? courseMap.get(est.id_curso_actual) : null,
        id_curso_actual: est.id_curso_actual,
        is_active: true
    }))

    // 3. Insert students
    const { data, error } = await supabase
        .from('estudiantes')
        .insert(studentsToInsert)
        .select()

    if (error) throw error

    // 4. Create enrollments
    const enrollments = data
        .filter((s: any) => s.id_curso_actual)
        .map((s: any) => ({
            id_estudiante: s.id,
            id_curso: s.id_curso_actual,
            fecha_inscripcion: new Date().toISOString()
        }))

    if (enrollments.length > 0) {
        const { error: enrollError } = await supabase
            .from('estudiantes_cursos')
            .insert(enrollments)

        if (enrollError) console.error('Error enrolling students:', enrollError)
    }

    return data
}

export async function enrollEstudiante(id_estudiante: number, id_curso: number) {
    const { error } = await supabase
        .from('estudiantes_cursos')
        .insert({
            id_estudiante,
            id_curso,
            fecha_inscripcion: new Date().toISOString()
        })

    if (error) throw error
}

export async function unenrollEstudiante(id_estudiante: number, id_curso: number) {
    const { error } = await supabase
        .from('estudiantes_cursos')
        .delete()
        .eq('id_estudiante', id_estudiante)
        .eq('id_curso', id_curso)

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

// ==================== EVALUACIONES ====================

export async function getEvaluaciones(estudianteId: number, periodo?: string) {
    let query = supabase
        .from('evaluaciones')
        .select('*')
        .eq('id_estudiante', estudianteId)

    if (periodo) {
        query = query.eq('periodo_evaluacion', periodo)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform to map if needed, but returning array is standard
    // The component expects a map: { [indicadorId]: valor }
    if (periodo) {
        const map: Record<number, string> = {}
        data?.forEach((ev: any) => {
            map[ev.id_indicador] = ev.valor_evaluacion
        })
        return map
    }

    return data
}

export async function saveEvaluacion(evaluacion: any) {
    // Check if exists first to update or insert
    const { data: existing } = await supabase
        .from('evaluaciones')
        .select('id')
        .eq('id_estudiante', evaluacion.id_estudiante)
        .eq('id_indicador', evaluacion.id_indicador)
        .eq('periodo_evaluacion', evaluacion.periodo_evaluacion)
        .maybeSingle()

    let result
    if (existing) {
        if (evaluacion.valor_evaluacion === null) {
            // Delete if null
            result = await supabase
                .from('evaluaciones')
                .delete()
                .eq('id', existing.id)
        } else {
            // Update
            result = await supabase
                .from('evaluaciones')
                .update({
                    valor_evaluacion: evaluacion.valor_evaluacion,
                    comentario: evaluacion.comentario,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id)
        }
    } else {
        if (evaluacion.valor_evaluacion === null) return // Don't insert nulls

        // Insert
        result = await supabase
            .from('evaluaciones')
            .insert({
                id_estudiante: evaluacion.id_estudiante,
                id_indicador: evaluacion.id_indicador,
                periodo_evaluacion: evaluacion.periodo_evaluacion,
                valor_evaluacion: evaluacion.valor_evaluacion,
                comentario: evaluacion.comentario
            })
    }

    if (result.error) throw result.error
}

// ==================== OBSERVACIONES ====================

export async function getObservaciones(estudianteId: number) {
    const { data, error } = await supabase
        .from('observaciones_periodicas')
        .select('*')
        .eq('id_estudiante', estudianteId)

    if (error) throw error
    return data
}

export async function saveObservacion(observacion: any) {
    const { data: existing } = await supabase
        .from('observaciones_periodicas')
        .select('id')
        .eq('id_estudiante', observacion.id_estudiante)
        .eq('periodo_evaluacion', observacion.periodo_evaluacion)
        .maybeSingle()

    let result
    if (existing) {
        result = await supabase
            .from('observaciones_periodicas')
            .update({
                cualidades_destacar: observacion.cualidades_destacar,
                necesita_apoyo: observacion.necesita_apoyo,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
    } else {
        result = await supabase
            .from('observaciones_periodicas')
            .insert({
                id_estudiante: observacion.id_estudiante,
                periodo_evaluacion: observacion.periodo_evaluacion,
                cualidades_destacar: observacion.cualidades_destacar,
                necesita_apoyo: observacion.necesita_apoyo
            })
    }

    if (result.error) throw result.error
}

// ==================== CONFIGURACIÓN CENTRO ====================

export async function getConfiguracionCentro() {
    const { data, error } = await supabase
        .from('configuracion_centro')
        .select('*')
        .maybeSingle()

    if (error) throw error
    return data
}

export async function saveConfiguracionCentro(config: any) {
    const { data: existing } = await supabase
        .from('configuracion_centro')
        .select('id')
        .maybeSingle()

    let result
    if (existing) {
        result = await supabase
            .from('configuracion_centro')
            .update({
                nombre_centro: config.nombre_centro,
                codigo_centro: config.codigo_centro,
                direccion: config.direccion,
                telefono: config.telefono,
                email: config.email,
                regional: config.regional,
                distrito: config.distrito,
                logo_minerd_url: config.logo_minerd_url,
                logo_centro_url: config.logo_centro_url,
                director_nombre: config.director_nombre,
                anio_escolar_actual: config.anio_escolar_actual,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
    } else {
        result = await supabase
            .from('configuracion_centro')
            .insert({
                nombre_centro: config.nombre_centro,
                codigo_centro: config.codigo_centro,
                direccion: config.direccion,
                telefono: config.telefono,
                email: config.email,
                regional: config.regional,
                distrito: config.distrito,
                logo_minerd_url: config.logo_minerd_url,
                logo_centro_url: config.logo_centro_url,
                director_nombre: config.director_nombre,
                anio_escolar_actual: config.anio_escolar_actual
            })
    }

    if (result.error) throw result.error
}



export async function seedIndicadores() {
    try {
        console.log("Starting indicator seeding process...");
        let insertedCount = 0;

        // 1. Create Categories
        const categoryMap: Record<string, number> = {};

        for (const cat of CATEGORIES_SEED) {
            // Check if category exists
            const { data: existing } = await supabase
                .from('categorias_indicadores')
                .select('id')
                .eq('nombre_categoria', cat.nombre)
                .single();

            if (existing) {
                categoryMap[cat.nombre] = existing.id;
            } else {
                const { data: newCat, error } = await supabase
                    .from('categorias_indicadores')
                    .insert({ nombre_categoria: cat.nombre, descripcion: cat.descripcion })
                    .select()
                    .single();

                if (error) throw error;
                if (newCat) categoryMap[cat.nombre] = newCat.id;
            }
        }

        // 2. Insert Indicators
        for (const ind of INDICATORS_SEED) {
            const catId = categoryMap[ind.cat];
            if (!catId) continue;

            // Check if indicator exists
            const { data: existing } = await supabase
                .from('indicadores')
                .select('id')
                .eq('descripcion', ind.desc)
                .eq('niveles_aplicables', ind.nivel)
                .single();

            if (!existing) {
                const { error } = await supabase
                    .from('indicadores')
                    .insert({
                        descripcion: ind.desc,
                        id_categoria: catId,
                        niveles_aplicables: ind.nivel,
                        tipo_evaluacion: 'cualitativa',
                        orden: ind.orden
                    });

                if (error) {
                    console.error(`Error inserting indicator: ${ind.desc}`, error);
                } else {
                    insertedCount++;
                }
            }
        }

        return { success: true, count: insertedCount };
    } catch (error) {
        console.error("Error seeding indicators:", error);
        throw error;
    }
}

export async function getBoletinData(estudianteId: number) {
    // ... (existing getBoletinData)
    // 1. Get student info
    const { data: estudiante, error: estError } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('id', estudianteId)
        .single()

    if (estError) throw estError

    // 1.1 Get course info manually to avoid FK issues
    let cursoData = null;
    if (estudiante.id_curso_actual) {
        const { data: curso, error: cursoError } = await supabase
            .from('cursos')
            .select(`
                *,
                usuarios (
                    nombre,
                    apellido
                )
            `)
            .eq('id', estudiante.id_curso_actual)
            .single()

        if (!cursoError) {
            cursoData = curso;
        }
    }

    // 2. Get center config
    const { data: config } = await supabase
        .from('configuracion_centro')
        .select('*')
        .maybeSingle()

    // 3. Get indicators for the course
    // Logic similar to getIndicadores but we need to filter by course name
    let cursoNombre = cursoData?.nombre_curso

    // Handle Párvulo I levels
    if (['Párvulo I', 'Parvulo I', 'Párvulo 1', 'Parvulo 1'].includes(cursoNombre) && estudiante.nivel_parvulo) {
        cursoNombre = estudiante.nivel_parvulo
    }

    const { data: indicadores } = await supabase
        .from('indicadores')
        .select('*, categorias_indicadores(nombre_categoria)')
        .eq('is_active', true)
        .ilike('niveles_aplicables', `%${cursoNombre}%`)
        .order('orden')
        .order('id')

    // Transform indicators to include category name directly
    const indicadoresFormatted = indicadores?.map((i: any) => ({
        ...i,
        nombre_categoria: i.categorias_indicadores?.nombre_categoria
    })) || []

    // 4. Get evaluations
    const { data: evaluaciones } = await supabase
        .from('evaluaciones')
        .select('*')
        .eq('id_estudiante', estudianteId)

    config: config || {},
        indicadores: indicadoresFormatted,
            evaluaciones: evaluacionesMap,
                observaciones: observacionesMap
}
}
