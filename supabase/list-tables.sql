-- ============================================
-- LISTAR TODAS LAS TABLAS
-- Ejecuta esto para ver qué tablas existen
-- ============================================

SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
