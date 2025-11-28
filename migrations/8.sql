
CREATE TABLE observaciones_periodicas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_estudiante INTEGER NOT NULL,
  id_maestro INTEGER NOT NULL,
  periodo_evaluacion TEXT NOT NULL,
  cualidades_destacar TEXT,
  necesita_apoyo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_observaciones_estudiante_periodo ON observaciones_periodicas(id_estudiante, periodo_evaluacion);
