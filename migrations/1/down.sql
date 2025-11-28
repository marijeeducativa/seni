
DROP INDEX IF EXISTS idx_boletines_periodo;
DROP INDEX IF EXISTS idx_boletines_estudiante;
DROP TABLE IF EXISTS boletines_generados;

DROP INDEX IF EXISTS idx_evaluaciones_estado;
DROP INDEX IF EXISTS idx_evaluaciones_periodo;
DROP INDEX IF EXISTS idx_evaluaciones_maestro;
DROP INDEX IF EXISTS idx_evaluaciones_estudiante;
DROP TABLE IF EXISTS evaluaciones;

DROP INDEX IF EXISTS idx_indicadores_categoria;
DROP TABLE IF EXISTS indicadores;

DROP INDEX IF EXISTS idx_estudiantes_cursos_curso;
DROP INDEX IF EXISTS idx_estudiantes_cursos_estudiante;
DROP TABLE IF EXISTS estudiantes_cursos;

DROP INDEX IF EXISTS idx_cursos_maestro;
DROP INDEX IF EXISTS idx_cursos_nivel;
DROP TABLE IF EXISTS cursos;

DROP INDEX IF EXISTS idx_estudiantes_apellido;
DROP INDEX IF EXISTS idx_estudiantes_grado;
DROP TABLE IF EXISTS estudiantes;

DROP TABLE IF EXISTS categorias_indicadores;

DROP INDEX IF EXISTS idx_usuarios_rol;
DROP INDEX IF EXISTS idx_usuarios_mocha_user_id;
DROP INDEX IF EXISTS idx_usuarios_email;
DROP TABLE IF EXISTS usuarios;
