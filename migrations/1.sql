
-- Tabla de usuarios adicionales (complementa la autenticación de Mocha)
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mocha_user_id TEXT UNIQUE,
  nombre TEXT,
  apellido TEXT,
  email TEXT NOT NULL UNIQUE,
  rol TEXT NOT NULL CHECK (rol IN ('administrador', 'maestro')),
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_mocha_user_id ON usuarios(mocha_user_id);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- Tabla de categorías de indicadores
CREATE TABLE categorias_indicadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_categoria TEXT NOT NULL,
  descripcion TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de estudiantes
CREATE TABLE estudiantes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  fecha_nacimiento DATE,
  grado_nivel TEXT,
  nombre_tutor TEXT,
  telefono_tutor TEXT,
  email_tutor TEXT,
  direccion_tutor TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_estudiantes_grado ON estudiantes(grado_nivel);
CREATE INDEX idx_estudiantes_apellido ON estudiantes(apellido);

-- Tabla de cursos
CREATE TABLE cursos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_curso TEXT NOT NULL,
  nivel TEXT NOT NULL,
  id_maestro INTEGER,
  descripcion TEXT,
  anio_escolar TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cursos_nivel ON cursos(nivel);
CREATE INDEX idx_cursos_maestro ON cursos(id_maestro);

-- Tabla pivote: Estudiantes en Cursos
CREATE TABLE estudiantes_cursos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_estudiante INTEGER NOT NULL,
  id_curso INTEGER NOT NULL,
  fecha_inscripcion DATE DEFAULT CURRENT_DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_estudiantes_cursos_estudiante ON estudiantes_cursos(id_estudiante);
CREATE INDEX idx_estudiantes_cursos_curso ON estudiantes_cursos(id_curso);

-- Tabla de indicadores de evaluación
CREATE TABLE indicadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  descripcion TEXT NOT NULL,
  id_categoria INTEGER,
  niveles_aplicables TEXT,
  tipo_evaluacion TEXT,
  orden INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_indicadores_categoria ON indicadores(id_categoria);

-- Tabla de evaluaciones
CREATE TABLE evaluaciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_estudiante INTEGER NOT NULL,
  id_maestro INTEGER NOT NULL,
  id_indicador INTEGER NOT NULL,
  periodo_evaluacion TEXT NOT NULL,
  valor_evaluacion TEXT,
  comentario TEXT,
  estado TEXT DEFAULT 'borrador',
  fecha_evaluacion DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evaluaciones_estudiante ON evaluaciones(id_estudiante);
CREATE INDEX idx_evaluaciones_maestro ON evaluaciones(id_maestro);
CREATE INDEX idx_evaluaciones_periodo ON evaluaciones(periodo_evaluacion);
CREATE INDEX idx_evaluaciones_estado ON evaluaciones(estado);

-- Tabla de boletines generados
CREATE TABLE boletines_generados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_estudiante INTEGER NOT NULL,
  periodo_evaluacion TEXT NOT NULL,
  ruta_archivo_pdf TEXT,
  datos_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_boletines_estudiante ON boletines_generados(id_estudiante);
CREATE INDEX idx_boletines_periodo ON boletines_generados(periodo_evaluacion);
