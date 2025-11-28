import z from "zod";

export const UsuarioSchema = z.object({
  id: z.number(),
  mocha_user_id: z.string().nullable(),
  nombre: z.string(),
  apellido: z.string(),
  email: z.string().email(),
  rol: z.enum(["administrador", "maestro"]),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Usuario = z.infer<typeof UsuarioSchema>;

export const EstudianteSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
  fecha_nacimiento: z.string().nullable(),
  grado_nivel: z.string().nullable(),
  nombre_tutor: z.string().nullable(),
  telefono_tutor: z.string().nullable(),
  email_tutor: z.string().nullable(),
  direccion_tutor: z.string().nullable(),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Estudiante = z.infer<typeof EstudianteSchema>;

export const CursoSchema = z.object({
  id: z.number(),
  nombre_curso: z.string(),
  nivel: z.string(),
  id_maestro: z.number().nullable(),
  descripcion: z.string().nullable(),
  anio_escolar: z.string().nullable(),
  is_active: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Curso = z.infer<typeof CursoSchema>;

export interface AuthUser {
  id: string;
  email: string;
  rol: string;
  nombre: string;
  apellido: string;
  usuarioId: number;
  google_user_data: {
    name?: string | null;
    picture?: string | null;
  };
}
