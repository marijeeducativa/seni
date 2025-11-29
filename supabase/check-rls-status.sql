-- ============================================
-- VERIFICAR ESTADO DE RLS
-- Ejecuta este script para ver qué tablas tienen RLS
-- ============================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('indicadores', 'categorias_indicadores', 'cursos', 'estudiantes', 'usuarios')
ORDER BY tablename;

-- Ver las políticas existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
