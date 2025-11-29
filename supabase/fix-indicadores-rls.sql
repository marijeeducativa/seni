-- ============================================
-- VERIFICAR Y RECREAR POLÍTICAS DE INDICADORES
-- Ejecuta este script en Supabase SQL Editor
-- ============================================

-- Primero, eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver indicadores" ON indicadores;
DROP POLICY IF EXISTS "Administradores pueden crear indicadores" ON indicadores;
DROP POLICY IF EXISTS "Administradores pueden actualizar indicadores" ON indicadores;
DROP POLICY IF EXISTS "Administradores pueden eliminar indicadores" ON indicadores;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver categorias" ON categorias_indicadores;
DROP POLICY IF EXISTS "Administradores pueden crear categorias" ON categorias_indicadores;

-- INDICADORES: Permitir lectura a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden ver indicadores"
ON indicadores FOR SELECT
TO authenticated
USING (true);

-- INDICADORES: Permitir insertar a administradores
CREATE POLICY "Administradores pueden crear indicadores"
ON indicadores FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.auth_user_id = auth.uid()
    AND usuarios.rol = 'administrador'
    AND usuarios.is_active = true
  )
);

-- INDICADORES: Permitir actualizar a administradores
CREATE POLICY "Administradores pueden actualizar indicadores"
ON indicadores FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.auth_user_id = auth.uid()
    AND usuarios.rol = 'administrador'
    AND usuarios.is_active = true
  )
);

-- INDICADORES: Permitir eliminar a administradores
CREATE POLICY "Administradores pueden eliminar indicadores"
ON indicadores FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.auth_user_id = auth.uid()
    AND usuarios.rol = 'administrador'
    AND usuarios.is_active = true
  )
);

-- CATEGORIAS INDICADORES: Permitir lectura a usuarios autenticados
CREATE POLICY "Usuarios autenticados pueden ver categorias"
ON categorias_indicadores FOR SELECT
TO authenticated
USING (true);

-- CATEGORIAS INDICADORES: Permitir insertar a administradores
CREATE POLICY "Administradores pueden crear categorias"
ON categorias_indicadores FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.auth_user_id = auth.uid()
    AND usuarios.rol = 'administrador'
    AND usuarios.is_active = true
  )
);
