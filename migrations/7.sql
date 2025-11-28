
-- Add genero field to estudiantes table
ALTER TABLE estudiantes ADD COLUMN genero TEXT;

-- Create configuracion_centro table for school settings
CREATE TABLE configuracion_centro (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_centro TEXT,
  codigo_centro TEXT,
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  regional TEXT,
  distrito TEXT,
  logo_minerd_url TEXT,
  logo_centro_url TEXT,
  director_nombre TEXT,
  anio_escolar_actual TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration row
INSERT INTO configuracion_centro (nombre_centro, anio_escolar_actual) 
VALUES ('Centro Educativo', '2024-2025');
