-- ============================================
-- DESHABILITAR RLS TEMPORALMENTE
-- ADVERTENCIA: Esto permite acceso completo a las tablas
-- Solo para desarrollo/testing
-- ============================================

-- Deshabilitar RLS en todas las tablas principales
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE cursos DISABLE ROW LEVEL SECURITY;
ALTER TABLE estudiantes DISABLE ROW LEVEL SECURITY;
ALTER TABLE indicadores DISABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_indicadores DISABLE ROW LEVEL SECURITY;
ALTER TABLE estudiantes_cursos DISABLE ROW LEVEL SECURITY;
ALTER TABLE evaluaciones DISABLE ROW LEVEL SECURITY;

-- Verificar que se deshabilitó
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('indicadores', 'categorias_indicadores', 'cursos', 'estudiantes', 'usuarios')
ORDER BY tablename;
