import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie } from "hono/cookie";
import { createSupabaseClient, createSupabaseAdminClient } from "./supabase";

interface Usuario {
    id: number;
    mocha_user_id: string | null;
    auth_user_id: string | null;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

type Variables = {
    currentUser: Usuario;
    supabase: any;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use("/*", cors({
    origin: (origin) => origin || "http://localhost:5173",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
}));

// Middleware to check authentication
const authMiddleware = async (c: any, next: any) => {
    const authHeader = c.req.header("Authorization");
    let token = authHeader?.replace("Bearer ", "");

    if (!token) {
        token = getCookie(c, "sb-access-token");
    }

    if (!token) {
        return c.json({ error: "Not authenticated" }, 401);
    }

    const supabase = createSupabaseClient(c.env);

    // Verify token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return c.json({ error: "Invalid token" }, 401);
    }

    // Get user from public.usuarios
    const { data: usuario, error: dbError } = await supabase
        .from("usuarios")
        .select("*")
        .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
        .eq("is_active", true)
        .maybeSingle();

    if (dbError || !usuario) {
        return c.json({ error: "User not found in database" }, 401);
    }

    // Link auth user if not linked
    if (!usuario.auth_user_id) {
        await supabase.from("usuarios").update({ auth_user_id: user.id }).eq("id", usuario.id);
        usuario.auth_user_id = user.id;
    }

    c.set("currentUser", usuario as Usuario);
    c.set("supabase", supabase);
    await next();
};

// ... (Admin Middleware remains unchanged)

// Teacher: Get courses
app.get("/api/teacher/cursos", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");

    if (usuario.rol !== "maestro") return c.json({ error: "Forbidden" }, 403);

    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .eq("id_maestro", usuario.id)
        .eq("is_active", true)
        .order("nombre_curso")
        .order("seccion");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Admin Middleware
const adminMiddleware = async (c: any, next: any) => {
    const usuario = c.get("currentUser");
    if (usuario.rol !== "administrador") {
        return c.json({ error: "Forbidden" }, 403);
    }
    await next();
};

// Get current user
app.get("/api/users/me", authMiddleware, async (c) => {
    const usuario = c.get("currentUser");
    return c.json(usuario);
});

// Users management
app.get("/api/usuarios", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase
        .from("usuarios")
        .select("id, nombre, apellido, email, rol, is_active, created_at")
        .order("apellido", { ascending: true })
        .order("nombre", { ascending: true });

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

app.post("/api/usuarios", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const supabaseAdmin = createSupabaseAdminClient(c.env);
    const body = await c.req.json();
    const { nombre, apellido, email, rol, password } = body;

    if (!nombre || !apellido || !email || !rol || !password) {
        return c.json({ error: "Faltan campos requeridos (incluyendo contraseña)" }, 400);
    }

    // 1. Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nombre, apellido, rol }
    });

    if (authError) {
        return c.json({ error: `Error creando usuario en Auth: ${authError.message}` }, 400);
    }

    if (!authUser.user) {
        return c.json({ error: "No se pudo crear el usuario en Auth" }, 500);
    }

    // 2. Create user in public.usuarios linked to Auth user
    const { data, error } = await supabase
        .from("usuarios")
        .insert({
            nombre,
            apellido,
            email,
            rol,
            auth_user_id: authUser.user.id,
            is_active: true
        })
        .select()
        .single();

    if (error) {
        // Rollback Auth user creation if DB insert fails
        await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
        return c.json({ error: `Error guardando perfil: ${error.message}` }, 400);
    }

    return c.json({ id: data.id, success: true }, 201);
});

app.put("/api/usuarios/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const supabaseAdmin = createSupabaseAdminClient(c.env);
    const id = c.req.param("id");
    const body = await c.req.json();
    const { nombre, apellido, email, rol, password } = body;

    // Get current user profile to find auth_user_id
    const { data: currentUserProfile } = await supabase.from("usuarios").select("auth_user_id").eq("id", id).single();

    if (currentUserProfile?.auth_user_id) {
        // Update Auth user
        const updates: any = {
            email,
            user_metadata: { nombre, apellido, rol }
        };
        if (password) {
            updates.password = password;
        }

        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            currentUserProfile.auth_user_id,
            updates
        );

        if (authError) {
            return c.json({ error: `Error actualizando Auth: ${authError.message}` }, 400);
        }
    }

    // Update public profile
    const { error } = await supabase
        .from("usuarios")
        .update({ nombre, apellido, email, rol, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

app.delete("/api/usuarios/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const supabaseAdmin = createSupabaseAdminClient(c.env);
    const id = c.req.param("id");
    const currentUser = c.get("currentUser");

    if (Number(id) === currentUser.id) {
        return c.json({ error: "No puedes eliminar tu propia cuenta" }, 400);
    }

    // Get auth_user_id before deleting
    const { data: userToDelete } = await supabase.from("usuarios").select("auth_user_id").eq("id", id).single();

    // 0. Unassign teacher from any courses (active or inactive) to avoid FK violation
    await supabase
        .from("cursos")
        .update({ id_maestro: null })
        .eq("id_maestro", id);

    // Try to delete from public.usuarios
    const { error } = await supabase.from("usuarios").delete().eq("id", id);

    if (error) {
        // Check for Foreign Key violation (Postgres error code 23503)
        if (error.code === '23503') {
            return c.json({ error: "No se puede eliminar el usuario porque tiene registros asociados (cursos, evaluaciones, etc.). Desactívelo en su lugar." }, 400);
        }
        return c.json({ error: error.message }, 400);
    }

    // Delete from Supabase Auth only if DB delete succeeded
    if (userToDelete?.auth_user_id) {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userToDelete.auth_user_id);
        if (authError) {
            console.error("Error deleting auth user:", authError);
        }
    }

    return c.json({ success: true });
});

// Courses
app.get("/api/cursos", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase
        .from("cursos")
        .select("*, usuarios(nombre, apellido)")
        .eq("is_active", true)
        .order("nombre_curso")
        .order("seccion");

    if (error) return c.json({ error: error.message }, 500);

    const results = data.map((curso: any) => ({
        ...curso,
        maestro_nombre: curso.usuarios ? `${curso.usuarios.nombre} ${curso.usuarios.apellido}` : null
    }));

    return c.json(results);
});

app.post("/api/cursos", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const body = await c.req.json();
    const { nombre_curso, nivel, seccion, id_maestro, descripcion, anio_escolar } = body;

    const { data, error } = await supabase
        .from("cursos")
        .insert({
            nombre_curso, nivel, seccion, id_maestro: id_maestro || null,
            descripcion, anio_escolar
        })
        .select()
        .single();

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ id: data.id, success: true }, 201);
});

app.put("/api/cursos/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");
    const body = await c.req.json();

    const { error } = await supabase
        .from("cursos")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

app.delete("/api/cursos/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");

    // Hard delete to free up the teacher FK
    const { error } = await supabase
        .from("cursos")
        .delete()
        .eq("id", id);

    if (error) {
        // If hard delete fails (e.g. has students), fallback to soft delete but warn or handle
        // For now, let's try soft delete if hard fails, but ideally we want hard delete.
        // Actually, if it has students, hard delete will fail due to FK from estudiantes_cursos.
        // We should probably cascade or soft delete.
        // But the user wants to delete the teacher.
        // If we soft delete, the teacher is still referenced.
        // We should set id_maestro to NULL if we soft delete?

        console.error("Hard delete failed, trying soft delete with nullifying teacher", error);

        const { error: softError } = await supabase
            .from("cursos")
            .update({ is_active: false, id_maestro: null, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (softError) return c.json({ error: softError.message }, 400);
    }

    return c.json({ success: true });
});

// Categories
app.get("/api/categorias-indicadores", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase
        .from("categorias_indicadores")
        .select("*")
        .order("created_at");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

app.post("/api/categorias-indicadores", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const body = await c.req.json();

    const { data, error } = await supabase
        .from("categorias_indicadores")
        .insert(body)
        .select()
        .single();

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ id: data.id, success: true }, 201);
});

// Indicators
app.get("/api/indicadores", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const curso = c.req.query("curso");
    const categoria = c.req.query("categoria");

    let query = supabase
        .from("indicadores")
        .select("*, categorias_indicadores(nombre_categoria)")
        .eq("is_active", true);

    if (curso) query = query.ilike("niveles_aplicables", `%${curso}%`);
    if (categoria) query = query.eq("id_categoria", categoria);

    query = query.order("orden").order("id");

    const { data, error } = await query;
    if (error) return c.json({ error: error.message }, 500);

    const results = data.map((i: any) => ({
        ...i,
        nombre_categoria: i.categorias_indicadores?.nombre_categoria
    }));

    return c.json(results);
});

app.post("/api/indicadores", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const body = await c.req.json();

    const { data, error } = await supabase
        .from("indicadores")
        .insert(body)
        .select()
        .single();

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ id: data.id, success: true }, 201);
});

app.put("/api/indicadores/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");
    const body = await c.req.json();

    const { error } = await supabase
        .from("indicadores")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

app.delete("/api/indicadores/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");

    const { error } = await supabase
        .from("indicadores")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);


    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

// Helper to parse dates
function parseDate(dateStr: string | null): string | null {
    if (!dateStr) return null;

    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    // Try handling DD/MM/YYYY or DD-MM-YYYY
    if (dateStr.includes('/') || dateStr.includes('-')) {
        const separator = dateStr.includes('/') ? '/' : '-';
        const parts = dateStr.split(separator);
        if (parts.length === 3) {
            // Check if it looks like DD/MM/YYYY (day <= 31, month <= 12)
            // If last part is 4 digits, it's year.
            if (parts[2].length === 4) {
                // DD/MM/YYYY -> YYYY-MM-DD
                return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
        }
    }

    // Fallback to JS Date parsing
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }

    return null; // Invalid date, save as null
}

app.get("/api/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");

    // Fetch students
    const { data: estudiantes, error } = await supabase
        .from("estudiantes")
        .select("*")
        .eq("is_active", true)
        .order("nombre")
        .order("apellido");

    if (error) return c.json({ error: error.message }, 500);

    // Fetch courses manually to avoid FK dependency error if constraint is missing
    const { data: cursos } = await supabase
        .from("cursos")
        .select("id, nombre_curso, seccion");

    const cursosMap = new Map(cursos?.map((c: any) => [c.id, c]) || []);

    const results = estudiantes.map((e: any) => {
        const curso: any = e.id_curso_actual ? cursosMap.get(e.id_curso_actual) : null;
        return {
            ...e,
            curso_nombre: curso?.nombre_curso,
            curso_seccion: curso?.seccion
        };
    });

    return c.json(results);
});

app.post("/api/estudiantes", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const body = await c.req.json();

    const { data, error } = await supabase
        .from("estudiantes")
        .insert(body)
        .select()
        .single();

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ id: data.id, success: true }, 201);
});

app.put("/api/estudiantes/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");
    const body = await c.req.json();

    const { error } = await supabase
        .from("estudiantes")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

app.delete("/api/estudiantes/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");

    const { error } = await supabase
        .from("estudiantes")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

// Bulk upload students
app.post("/api/estudiantes/bulk", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { estudiantes } = await c.req.json();

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
        return c.json({ error: "Array required and must not be empty" }, 400);
    }

    // 1. Fetch course info once for all students
    const courseIds = [...new Set(estudiantes.map((e: any) => e.id_curso_actual).filter(Boolean))];
    let courseMap = new Map();

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from("cursos")
            .select("id, nombre_curso, seccion")
            .in("id", courseIds);

        courses?.forEach((c: any) => {
            courseMap.set(c.id, `${c.nombre_curso}${c.seccion ? ` - Sección ${c.seccion}` : ''}`);
        });
    }

    // 2. Prepare data for bulk insert
    const studentsToInsert = estudiantes.map((est: any) => ({
        nombre: est.nombre,
        apellido: est.apellido,
        genero: est.genero,
        fecha_nacimiento: parseDate(est.fecha_nacimiento),
        nombre_tutor: est.nombre_tutor,
        telefono_tutor: est.telefono_tutor,
        email_tutor: est.email_tutor,
        direccion_tutor: est.direccion_tutor,
        grado_nivel: est.id_curso_actual ? courseMap.get(est.id_curso_actual) : null,
        id_curso_actual: est.id_curso_actual,
        is_active: true
    }));

    // 3. Bulk insert students
    const { data: createdStudents, error: createError } = await supabase
        .from("estudiantes")
        .insert(studentsToInsert)
        .select();

    if (createError) {
        console.error("Bulk insert error:", createError);
        return c.json({ error: `Error al guardar estudiantes: ${createError.message}. Verifique los datos.` }, 500);
    }

    // 4. Bulk insert enrollments
    const enrollments = createdStudents
        .filter((s: any) => s.id_curso_actual)
        .map((s: any) => ({
            id_estudiante: s.id,
            id_curso: s.id_curso_actual,
            fecha_inscripcion: new Date().toISOString()
        }));

    if (enrollments.length > 0) {
        const { error: enrollError } = await supabase
            .from("estudiantes_cursos")
            .insert(enrollments);

        if (enrollError) {
            console.error("Error enrolling students:", enrollError);
        }
    }

    return c.json({ success: true, count: createdStudents.length }, 201);
});

// Stats
app.get("/api/stats", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { count: usuarios } = await supabase.from("usuarios").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: estudiantes } = await supabase.from("estudiantes").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: cursos } = await supabase.from("cursos").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: evaluaciones } = await supabase.from("evaluaciones").select("*", { count: "exact", head: true });

    return c.json({ usuarios, estudiantes, cursos, evaluaciones });
});

// Teacher: Get courses
app.get("/api/teacher/cursos", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");

    if (usuario.rol !== "maestro") return c.json({ error: "Forbidden" }, 403);

    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .eq("id_maestro", usuario.id)
        .eq("is_active", true)
        .order("nombre_curso")
        .order("seccion");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Teacher: Get students in course
app.get("/api/teacher/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const cursoId = c.req.param("id");

    if (usuario.rol === "maestro") {
        const { data } = await supabase.from("cursos").select("id").eq("id", cursoId).eq("id_maestro", usuario.id).single();
        if (!data) return c.json({ error: "Forbidden" }, 403);
    }

    const { data, error } = await supabase
        .from("estudiantes")
        .select("*, estudiantes_cursos!inner(fecha_inscripcion)")
        .eq("estudiantes_cursos.id_curso", cursoId)
        .eq("is_active", true)
        .order("nombre")
        .order("apellido");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Enroll student
app.post("/api/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const cursoId = c.req.param("id");
    const { id_estudiante } = await c.req.json();

    const { error } = await supabase
        .from("estudiantes_cursos")
        .insert({ id_estudiante, id_curso: cursoId });

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true }, 201);
});

// Remove student from course
app.delete("/api/cursos/:cursoId/estudiantes/:estudianteId", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { cursoId, estudianteId } = c.req.param();

    const { error } = await supabase
        .from("estudiantes_cursos")
        .delete()
        .eq("id_estudiante", estudianteId)
        .eq("id_curso", cursoId);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});



app.put("/api/estudiantes/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");
    const body = await c.req.json();

    const { error } = await supabase
        .from("estudiantes")
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

app.delete("/api/estudiantes/:id", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const id = c.req.param("id");

    const { error } = await supabase
        .from("estudiantes")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("id", id);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

// Bulk upload students
app.post("/api/estudiantes/bulk", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { estudiantes } = await c.req.json();

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
        return c.json({ error: "Array required and must not be empty" }, 400);
    }

    // 1. Fetch course info once for all students
    const courseIds = [...new Set(estudiantes.map((e: any) => e.id_curso_actual).filter(Boolean))];
    let courseMap = new Map();

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from("cursos")
            .select("id, nombre_curso, seccion")
            .in("id", courseIds);

        courses?.forEach((c: any) => {
            courseMap.set(c.id, `${c.nombre_curso}${c.seccion ? ` - Sección ${c.seccion}` : ''}`);
        });
    }

    // 2. Prepare data for bulk insert
    const studentsToInsert = estudiantes.map((est: any) => ({
        nombre: est.nombre,
        apellido: est.apellido,
        genero: est.genero,
        fecha_nacimiento: parseDate(est.fecha_nacimiento),
        nombre_tutor: est.nombre_tutor,
        telefono_tutor: est.telefono_tutor,
        email_tutor: est.email_tutor,
        direccion_tutor: est.direccion_tutor,
        grado_nivel: est.id_curso_actual ? courseMap.get(est.id_curso_actual) : null,
        id_curso_actual: est.id_curso_actual,
        is_active: true
    }));

    // 3. Bulk insert students
    const { data: createdStudents, error: createError } = await supabase
        .from("estudiantes")
        .insert(studentsToInsert)
        .select();

    if (createError) {
        console.error("Bulk insert error:", createError);
        return c.json({ error: `Error al guardar estudiantes: ${createError.message}. Verifique los datos.` }, 500);
    }

    // 4. Bulk insert enrollments
    const enrollments = createdStudents
        .filter((s: any) => s.id_curso_actual)
        .map((s: any) => ({
            id_estudiante: s.id,
            id_curso: s.id_curso_actual,
            fecha_inscripcion: new Date().toISOString()
        }));

    if (enrollments.length > 0) {
        const { error: enrollError } = await supabase
            .from("estudiantes_cursos")
            .insert(enrollments);

        if (enrollError) {
            console.error("Error enrolling students:", enrollError);
        }
    }

    return c.json({ success: true, count: createdStudents.length }, 201);
});

// Stats
app.get("/api/stats", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { count: usuarios } = await supabase.from("usuarios").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: estudiantes } = await supabase.from("estudiantes").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: cursos } = await supabase.from("cursos").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: evaluaciones } = await supabase.from("evaluaciones").select("*", { count: "exact", head: true });

    return c.json({ usuarios, estudiantes, cursos, evaluaciones });
});

// Teacher: Get courses
app.get("/api/teacher/cursos", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");

    if (usuario.rol !== "maestro") return c.json({ error: "Forbidden" }, 403);

    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .eq("id_maestro", usuario.id)
        .eq("is_active", true)
        .order("nombre_curso")
        .order("seccion");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Teacher: Get students in course
app.get("/api/teacher/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const cursoId = c.req.param("id");

    if (usuario.rol === "maestro") {
        const { data } = await supabase.from("cursos").select("id").eq("id", cursoId).eq("id_maestro", usuario.id).single();
        if (!data) return c.json({ error: "Forbidden" }, 403);
    }

    const { data, error } = await supabase
        .from("estudiantes")
        .select("*, estudiantes_cursos!inner(fecha_inscripcion)")
        .eq("estudiantes_cursos.id_curso", cursoId)
        .eq("is_active", true)
        .order("nombre")
        .order("apellido");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Enroll student
app.post("/api/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const cursoId = c.req.param("id");
    const { id_estudiante } = await c.req.json();

    const { error } = await supabase
        .from("estudiantes_cursos")
        .insert({ id_estudiante, id_curso: cursoId });

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true }, 201);
});

// Remove student from course
app.delete("/api/cursos/:cursoId/estudiantes/:estudianteId", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { cursoId, estudianteId } = c.req.param();

    const { error } = await supabase
        .from("estudiantes_cursos")
        .delete()
        .eq("id_estudiante", estudianteId)
        .eq("id_curso", cursoId);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

// Get indicators for student

// Teacher: Save evaluation (upsert)
app.post("/api/teacher/evaluaciones", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const body = await c.req.json();

    if (usuario.rol !== "maestro") {
        return c.json({ error: "Forbidden" }, 403);
    }

    const { id_estudiante, id_indicador, periodo_evaluacion, valor_evaluacion } = body;

    // Check if evaluation exists
    const { data: existing } = await supabase
        .from("evaluaciones")
        .select("id")
        .eq("id_estudiante", id_estudiante)
        .eq("id_indicador", id_indicador)
        .eq("periodo_evaluacion", periodo_evaluacion)
        .eq("id_maestro", usuario.id)
        .maybeSingle();

    if (existing) {
        // Update existing
        const { error } = await supabase
            .from("evaluaciones")
            .update({
                valor_evaluacion,
                fecha_evaluacion: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq("id", existing.id);

        if (error) return c.json({ error: error.message }, 400);
        return c.json({ success: true, id: existing.id });
    } else {
        // Insert new
        const { data, error } = await supabase
            .from("evaluaciones")
            .insert({
                id_estudiante,
                id_maestro: usuario.id,
                id_indicador,
                periodo_evaluacion,
                valor_evaluacion,
                fecha_evaluacion: new Date().toISOString(),
                estado: "completado"
            })
            .select()
            .single();

        if (error) return c.json({ error: error.message }, 400);
        return c.json({ success: true, id: data.id }, 201);
    }
});

// Teacher: Get evaluations for a student by period
app.get("/api/teacher/estudiantes/:id/evaluaciones", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const estudianteId = c.req.param("id");
    const periodo = c.req.query("periodo");

    if (usuario.rol !== "maestro") {
        return c.json({ error: "Forbidden" }, 403);
    }

    if (!periodo) {
        return c.json({ error: "periodo query parameter required" }, 400);
    }

    // Verify teacher has access to this student
    const { data: student } = await supabase
        .from("estudiantes")
        .select("id, estudiantes_cursos!inner(id_curso, cursos!inner(id_maestro))")
        .eq("id", estudianteId)
        .eq("estudiantes_cursos.cursos.id_maestro", usuario.id)
        .maybeSingle();

    if (!student) {
        return c.json({ error: "Student not found or access denied" }, 404);
    }

    // Get evaluations for this student and period
    const { data, error } = await supabase
        .from("evaluaciones")
        .select("id, id_indicador, valor_evaluacion, comentario, fecha_evaluacion")
        .eq("id_estudiante", estudianteId)
        .eq("periodo_evaluacion", periodo)
        .eq("id_maestro", usuario.id);

    if (error) return c.json({ error: error.message }, 500);

    // Transform to a map of {indicador_id: valor}
    const evaluacionesMap: Record<number, string> = {};
    data?.forEach((ev: any) => {
        evaluacionesMap[ev.id_indicador] = ev.valor_evaluacion;
    });

    return c.json(evaluacionesMap);
});

// Teacher: Get/Save observations for a student
app.get("/api/teacher/estudiantes/:id/observaciones", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const estudianteId = c.req.param("id");

    if (usuario.rol !== "maestro") {
        return c.json({ error: "Forbidden" }, 403);
    }

    // Verify teacher has access to this student
    const { data: student } = await supabase
        .from("estudiantes")
        .select("id, estudiantes_cursos!inner(id_curso, cursos!inner(id_maestro))")
        .eq("id", estudianteId)
        .eq("estudiantes_cursos.cursos.id_maestro", usuario.id)
        .maybeSingle();

    if (!student) {
        return c.json({ error: "Student not found or access denied" }, 404);
    }

    // Get all observations for this student
    const { data, error } = await supabase
        .from("observaciones_periodicas")
        .select("*")
        .eq("id_estudiante", estudianteId)
        .eq("id_maestro", usuario.id);

    if (error) return c.json({ error: error.message }, 500);

    // Transform to a map of {periodo: {cualidades_destacar, necesita_apoyo}}
    const observacionesMap: Record<string, any> = {};
    data?.forEach((obs: any) => {
        observacionesMap[obs.periodo_evaluacion] = {
            cualidades_destacar: obs.cualidades_destacar,
            necesita_apoyo: obs.necesita_apoyo
        };
    });

    return c.json(observacionesMap);
});

// Bulk upload students
app.post("/api/estudiantes/bulk", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { estudiantes } = await c.req.json();

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
        return c.json({ error: "Array required and must not be empty" }, 400);
    }

    // 1. Fetch course info once for all students
    const courseIds = [...new Set(estudiantes.map((e: any) => e.id_curso_actual).filter(Boolean))];
    let courseMap = new Map();

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from("cursos")
            .select("id, nombre_curso, seccion")
            .in("id", courseIds);

        courses?.forEach((c: any) => {
            courseMap.set(c.id, `${c.nombre_curso}${c.seccion ? ` - Sección ${c.seccion}` : ''}`);
        });
    }

    // 2. Prepare data for bulk insert
    const studentsToInsert = estudiantes.map((est: any) => ({
        nombre: est.nombre,
        apellido: est.apellido,
        genero: est.genero,
        fecha_nacimiento: parseDate(est.fecha_nacimiento),
        nombre_tutor: est.nombre_tutor,
        telefono_tutor: est.telefono_tutor,
        email_tutor: est.email_tutor,
        direccion_tutor: est.direccion_tutor,
        grado_nivel: est.id_curso_actual ? courseMap.get(est.id_curso_actual) : null,
        id_curso_actual: est.id_curso_actual,
        is_active: true
    }));

    // 3. Bulk insert students
    const { data: createdStudents, error: createError } = await supabase
        .from("estudiantes")
        .insert(studentsToInsert)
        .select();

    if (createError) {
        console.error("Bulk insert error:", createError);
        return c.json({ error: `Error al guardar estudiantes: ${createError.message}. Verifique los datos.` }, 500);
    }

    // 4. Bulk insert enrollments
    const enrollments = createdStudents
        .filter((s: any) => s.id_curso_actual)
        .map((s: any) => ({
            id_estudiante: s.id,
            id_curso: s.id_curso_actual,
            fecha_inscripcion: new Date().toISOString()
        }));

    if (enrollments.length > 0) {
        const { error: enrollError } = await supabase
            .from("estudiantes_cursos")
            .insert(enrollments);

        if (enrollError) {
            console.error("Error enrolling students:", enrollError);
        }
    }

    return c.json({ success: true, count: createdStudents.length }, 201);
});

// Stats
app.get("/api/stats", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { count: usuarios } = await supabase.from("usuarios").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: estudiantes } = await supabase.from("estudiantes").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: cursos } = await supabase.from("cursos").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: evaluaciones } = await supabase.from("evaluaciones").select("*", { count: "exact", head: true });

    return c.json({ usuarios, estudiantes, cursos, evaluaciones });
});

// Teacher: Get courses
app.get("/api/teacher/cursos", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");

    if (usuario.rol !== "maestro") return c.json({ error: "Forbidden" }, 403);

    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .eq("id_maestro", usuario.id)
        .eq("is_active", true)
        .order("nombre_curso")
        .order("seccion");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Teacher: Get students in course
app.get("/api/teacher/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const cursoId = c.req.param("id");

    if (usuario.rol === "maestro") {
        const { data } = await supabase.from("cursos").select("id").eq("id", cursoId).eq("id_maestro", usuario.id).single();
        if (!data) return c.json({ error: "Forbidden" }, 403);
    }

    const { data, error } = await supabase
        .from("estudiantes")
        .select("*, estudiantes_cursos!inner(fecha_inscripcion)")
        .eq("estudiantes_cursos.id_curso", cursoId)
        .eq("is_active", true)
        .order("nombre")
        .order("apellido");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Enroll student
app.post("/api/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const cursoId = c.req.param("id");
    const { id_estudiante } = await c.req.json();

    const { error } = await supabase
        .from("estudiantes_cursos")
        .insert({ id_estudiante, id_curso: cursoId });

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true }, 201);
});

// Remove student from course
app.delete("/api/cursos/:cursoId/estudiantes/:estudianteId", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { cursoId, estudianteId } = c.req.param();

    const { error } = await supabase
        .from("estudiantes_cursos")
        .delete()
        .eq("id_estudiante", estudianteId)
        .eq("id_curso", cursoId);

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true });
});

// Get indicators for student
app.get("/api/teacher/estudiantes/:id/indicadores", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const estudianteId = c.req.param("id");

    if (usuario.rol !== "maestro") return c.json({ error: "Forbidden" }, 403);

    // Get the student's current course to filter indicators
    const { data: studentData, error: studentError } = await supabase
        .from("estudiantes")
        .select("id_curso_actual, nivel_parvulo")
        .eq("id", estudianteId)
        .single();

    if (studentError) return c.json({ error: studentError.message }, 500);
    if (!studentData || !studentData.id_curso_actual) {
        return c.json({ error: "Student or course not found for indicator filtering" }, 404);
    }

    // Fetch course details separately to avoid ambiguous relationship error
    const { data: curso, error: cursoError } = await supabase
        .from("cursos")
        .select("nombre_curso, nivel")
        .eq("id", studentData.id_curso_actual)
        .single();

    if (cursoError || !curso) {
        return c.json({ error: "Course details not found" }, 404);
    }

    // Fetch all active indicators and filter in memory for better matching
    const { data, error } = await supabase
        .from("indicadores")
        .select("*, categorias_indicadores(nombre_categoria)")
        .eq("is_active", true)
        .order("orden")
        .order("id");
    if (error) return c.json({ error: error.message }, 500);

    // Helper to normalize strings for comparison (remove accents, lowercase)
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const cursoNivelNorm = normalize(curso.nivel);
    const cursoNombreNorm = normalize(curso.nombre_curso);
    const studentNivelParvuloNorm = studentData.nivel_parvulo ? normalize(studentData.nivel_parvulo) : "";

    const createRegex = (s: string) => new RegExp(`\\b${escapeRegExp(s)}\\b`);
    const cursoNivelRegex = createRegex(cursoNivelNorm);
    const cursoNombreRegex = createRegex(cursoNombreNorm);

    // Create tags for student level to handle "Nivel 1" -> "Etapa 1" mapping
    const studentTags: string[] = [];
    if (studentNivelParvuloNorm) {
        studentTags.push(studentNivelParvuloNorm);
        if (studentNivelParvuloNorm.includes("nivel 1")) {
            studentTags.push("etapa 1");
            studentTags.push("parvulo i - etapa 1");
        } else if (studentNivelParvuloNorm.includes("nivel 2")) {
            studentTags.push("etapa 2");
            studentTags.push("parvulo i - etapa 2");
        }
    }

    const filteredData = data.filter((i: any) => {
        if (!i.niveles_aplicables) return false;
        const niveles = normalize(i.niveles_aplicables);
        const nivelesArray = niveles.split(/[,/]/).map((n: string) => n.trim());

        // Explicitly exclude conflicting levels for Párvulo I
        if (studentTags.some(t => t.includes("nivel 1") || t.includes("etapa 1"))) {
            if (niveles.includes("nivel 2") || niveles.includes("etapa 2")) return false;
        }
        if (studentTags.some(t => t.includes("nivel 2") || t.includes("etapa 2"))) {
            if (niveles.includes("nivel 1") || niveles.includes("etapa 1")) return false;
        }

        const match = nivelesArray.some((n: string) => {
            const nRegex = createRegex(n);

            // Check course match
            if (cursoNivelRegex.test(n) || nRegex.test(cursoNivelNorm) ||
                cursoNombreRegex.test(n) || nRegex.test(cursoNombreNorm)) {
                return true;
            }

            // Check student tags match
            return studentTags.some(tag => {
                const tagRegex = createRegex(tag);
                return tagRegex.test(n) || nRegex.test(tag);
            });
        });

        return match;
    });

    // Deduplicate indicators based on description
    const uniqueIndicators = new Map();
    filteredData.forEach((i: any) => {
        const desc = normalize(i.descripcion);
        if (!uniqueIndicators.has(desc)) {
            uniqueIndicators.set(desc, i);
        }
    });

    const results = Array.from(uniqueIndicators.values()).map((i: any) => ({
        ...i,
        nombre_categoria: i.categorias_indicadores?.nombre_categoria
    }));

    results.sort((a: any, b: any) => (a.nombre_categoria || "").localeCompare(b.nombre_categoria || "") || a.orden - b.orden);

    return c.json(results);
});

// Bulk upload students
app.post("/api/estudiantes/bulk", authMiddleware, adminMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { estudiantes } = await c.req.json();

    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
        return c.json({ error: "Array required and must not be empty" }, 400);
    }

    // 1. Fetch course info once for all students
    const courseIds = [...new Set(estudiantes.map((e: any) => e.id_curso_actual).filter(Boolean))];
    let courseMap = new Map();

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from("cursos")
            .select("id, nombre_curso, seccion")
            .in("id", courseIds);

        courses?.forEach((c: any) => {
            courseMap.set(c.id, `${c.nombre_curso}${c.seccion ? ` - Sección ${c.seccion}` : ''} `);
        });
    }

    // 2. Prepare data for bulk insert
    const studentsToInsert = estudiantes.map((est: any) => ({
        nombre: est.nombre,
        apellido: est.apellido,
        genero: est.genero,
        fecha_nacimiento: parseDate(est.fecha_nacimiento),
        nombre_tutor: est.nombre_tutor,
        telefono_tutor: est.telefono_tutor,
        email_tutor: est.email_tutor,
        direccion_tutor: est.direccion_tutor,
        grado_nivel: est.id_curso_actual ? courseMap.get(est.id_curso_actual) : null,
        id_curso_actual: est.id_curso_actual,
        is_active: true
    }));

    // 3. Bulk insert students
    const { data: createdStudents, error: createError } = await supabase
        .from("estudiantes")
        .insert(studentsToInsert)
        .select();

    if (createError) {
        console.error("Bulk insert error:", createError);
        return c.json({ error: `Error al guardar estudiantes: ${createError.message}. Verifique los datos.` }, 500);
    }

    // 4. Bulk insert enrollments
    const enrollments = createdStudents
        .filter((s: any) => s.id_curso_actual)
        .map((s: any) => ({
            id_estudiante: s.id,
            id_curso: s.id_curso_actual,
            fecha_inscripcion: new Date().toISOString()
        }));

    if (enrollments.length > 0) {
        const { error: enrollError } = await supabase
            .from("estudiantes_cursos")
            .insert(enrollments);

        if (enrollError) {
            console.error("Error enrolling students:", enrollError);
        }
    }

    return c.json({ success: true, count: createdStudents.length }, 201);
});

// Stats
app.get("/api/stats", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const { count: usuarios } = await supabase.from("usuarios").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: estudiantes } = await supabase.from("estudiantes").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: cursos } = await supabase.from("cursos").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: evaluaciones } = await supabase.from("evaluaciones").select("*", { count: "exact", head: true });

    return c.json({ usuarios, estudiantes, cursos, evaluaciones });
});

// Teacher: Get courses
// Teacher: Get courses
app.get("/api/teacher/cursos", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");

    if (usuario.rol !== "maestro") return c.json({ error: "Forbidden" }, 403);

    const { data, error } = await supabase
        .from("cursos")
        .select("*")
        .eq("id_maestro", usuario.id)
        .eq("is_active", true)
        .order("nombre_curso")
        .order("seccion");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Teacher: Get students in course
app.get("/api/teacher/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const cursoId = c.req.param("id");

    if (usuario.rol === "maestro") {
        const { data } = await supabase.from("cursos").select("id").eq("id", cursoId).eq("id_maestro", usuario.id).single();
        if (!data) return c.json({ error: "Forbidden" }, 403);
    }

    const { data, error } = await supabase
        .from("estudiantes")
        .select("*, estudiantes_cursos!inner(fecha_inscripcion)")
        .eq("estudiantes_cursos.id_curso", cursoId)
        .eq("is_active", true)
        .order("nombre")
        .order("apellido");

    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

// Enroll student
app.post("/api/cursos/:id/estudiantes", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const cursoId = c.req.param("id");
    const { id_estudiante } = await c.req.json();

    const { error } = await supabase
        .from("estudiantes_cursos")
        .insert({ id_estudiante, id_curso: cursoId });

    if (error) return c.json({ error: error.message }, 400);
    return c.json({ success: true }, 201);
});



// Generate student bulletin
app.get("/api/teacher/estudiantes/:estudianteId/boletin", authMiddleware, async (c) => {
    const supabase = c.get("supabase");
    const usuario = c.get("currentUser");
    const estudianteId = c.req.param("estudianteId");

    if (usuario.rol !== "maestro") return c.json({ error: "Forbidden" }, 403);

    try {
        // 1. Fetch student data
        const { data: estudiante, error: estudianteError } = await supabase
            .from("estudiantes")
            .select("*")
            .eq("id", estudianteId)
            .single();

        if (estudianteError) throw estudianteError;
        if (!estudiante) return c.json({ error: "Student not found" }, 404);

        // Fetch course details separately
        const { data: curso, error: cursoError } = await supabase
            .from("cursos")
            .select(`
                *,
                maestros:usuarios(nombre, apellido)
            `)
            .eq("id", estudiante.id_curso_actual)
            .single();

        if (cursoError) throw cursoError;
        if (!curso) return c.json({ error: "Course not found" }, 404);

        // Check ownership
        if (curso.id_maestro !== usuario.id) return c.json({ error: "Forbidden: Not your student" }, 403);

        // Attach course to student object for compatibility with existing logic
        estudiante.cursos = curso;
        const maestro = curso.maestros;

        // 2. Fetch school configuration
        const { data: config, error: configError } = await supabase
            .from("configuracion_centro")
            .select("*")
            .single();

        if (configError) throw configError;

        // 3. Fetch all active indicators and filter them based on student's course/level
        const { data: indicadores, error: indicadoresError } = await supabase
            .from("indicadores")
            .select("*, categorias_indicadores(nombre_categoria)")
            .eq("is_active", true)
            .order("orden")
            .order("id");

        if (indicadoresError) throw indicadoresError;

        // Helper to normalize strings for comparison (remove accents, lowercase)
        const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const createRegex = (s: string) => new RegExp(`\\b${escapeRegExp(s)}\\b`);

        const cursoNivelNorm = estudiante.cursos?.nivel ? normalize(estudiante.cursos.nivel) : "";
        const cursoNombreNorm = estudiante.cursos?.nombre_curso ? normalize(estudiante.cursos.nombre_curso) : "";
        const studentNivelParvuloNorm = estudiante.nivel_parvulo ? normalize(estudiante.nivel_parvulo) : "";

        const cursoNivelRegex = createRegex(cursoNivelNorm);
        const cursoNombreRegex = createRegex(cursoNombreNorm);

        // Create tags for student level to handle "Nivel 1" -> "Etapa 1" mapping
        const studentTags: string[] = [];
        if (studentNivelParvuloNorm) {
            studentTags.push(studentNivelParvuloNorm);
            if (studentNivelParvuloNorm.includes("nivel 1")) {
                studentTags.push("etapa 1");
                studentTags.push("parvulo i - etapa 1");
            } else if (studentNivelParvuloNorm.includes("nivel 2")) {
                studentTags.push("etapa 2");
                studentTags.push("parvulo i - etapa 2");
            }
        }

        const filteredIndicadoresRaw = indicadores.filter((i: any) => {
            if (!i.niveles_aplicables) return false;
            const niveles = normalize(i.niveles_aplicables);
            const nivelesArray = niveles.split(/[,/]/).map((n: string) => n.trim());

            // Explicitly exclude conflicting levels for Párvulo I
            if (studentTags.some(t => t.includes("nivel 1") || t.includes("etapa 1"))) {
                if (niveles.includes("nivel 2") || niveles.includes("etapa 2")) return false;
            }
            if (studentTags.some(t => t.includes("nivel 2") || t.includes("etapa 2"))) {
                if (niveles.includes("nivel 1") || niveles.includes("etapa 1")) return false;
            }

            const match = nivelesArray.some((n: string) => {
                const nRegex = createRegex(n);

                // Check course match
                if (cursoNivelRegex.test(n) || nRegex.test(cursoNivelNorm) ||
                    cursoNombreRegex.test(n) || nRegex.test(cursoNombreNorm)) {
                    return true;
                }

                // Check student tags match
                return studentTags.some(tag => {
                    const tagRegex = createRegex(tag);
                    return tagRegex.test(n) || nRegex.test(tag);
                });
            });
            return match;
        });

        // Deduplicate indicators based on description
        const uniqueIndicators = new Map();
        filteredIndicadoresRaw.forEach((i: any) => {
            const desc = normalize(i.descripcion);
            if (!uniqueIndicators.has(desc)) {
                uniqueIndicators.set(desc, i);
            }
        });

        const filteredIndicadores = Array.from(uniqueIndicators.values());


        const formattedIndicadores = filteredIndicadores.map((i: any) => ({
            id: i.id,
            descripcion: i.descripcion,
            nombre_categoria: i.categorias_indicadores?.nombre_categoria,
            orden: i.orden
        }));
        formattedIndicadores.sort((a: any, b: any) => (a.categoria || "").localeCompare(b.categoria || "") || a.orden - b.orden);

        // 4. Fetch evaluations for the student
        const { data: evaluaciones, error: evaluacionesError } = await supabase
            .from("evaluaciones")
            .select("id_indicador, periodo_evaluacion, valor_evaluacion")
            .eq("id_estudiante", estudianteId);

        if (evaluacionesError) throw evaluacionesError;

        // 5. Fetch observations for the student
        const { data: observaciones, error: observacionesError } = await supabase
            .from("observaciones_periodicas")
            .select("periodo_evaluacion, cualidades_destacar, necesita_apoyo")
            .eq("id_estudiante", estudianteId);

        if (observacionesError) throw observacionesError;

        const observacionesPorPeriodo: Record<string, { generales: string, necesita_apoyo: string }> = {
            "1er Período": { generales: "", necesita_apoyo: "" },
            "2do Período": { generales: "", necesita_apoyo: "" },
            "3er Período": { generales: "", necesita_apoyo: "" }
        };
        observaciones?.forEach((obs: any) => {
            if (observacionesPorPeriodo[obs.periodo_evaluacion]) {
                observacionesPorPeriodo[obs.periodo_evaluacion] = {
                    generales: obs.cualidades_destacar || "",
                    necesita_apoyo: obs.necesita_apoyo || ""
                };
            }
        });

        const evaluacionesPorPeriodo: Record<string, Record<number, string>> = {
            "1er Período": {}, "2do Período": {}, "3er Período": {}
        };
        evaluaciones?.forEach((ev: any) => {
            if (ev.valor_evaluacion) {
                if (!evaluacionesPorPeriodo[ev.periodo_evaluacion]) evaluacionesPorPeriodo[ev.periodo_evaluacion] = {};
                evaluacionesPorPeriodo[ev.periodo_evaluacion][ev.id_indicador] = ev.valor_evaluacion;
            }
        });

        return c.json({
            estudiante: {
                ...estudiante,
                curso: estudiante.cursos?.nombre_curso,
                seccion: estudiante.cursos?.seccion,
                anio_escolar: estudiante.cursos?.anio_escolar
            },
            maestro,
            config,
            indicadores: formattedIndicadores,
            evaluaciones: evaluacionesPorPeriodo,
            observaciones: observacionesPorPeriodo
        });
    } catch (error: any) {
        console.error("Error generating bulletin:", error);
        return c.json({ error: error.message || "Internal Server Error" }, 500);
    }
});

export default app;
