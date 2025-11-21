-- Script para crear la tabla de administradores y sus políticas RLS

-- Crear tabla de administradores si no existe
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Allow public read access to admins" ON admins;
DROP POLICY IF EXISTS "Allow public insert access to admins" ON admins;
DROP POLICY IF EXISTS "Allow public update access to admins" ON admins;
DROP POLICY IF EXISTS "Allow public delete access to admins" ON admins;

-- Crear políticas permisivas (para desarrollo)
-- NOTA: En producción, estas políticas deberían ser más restrictivas

-- Permitir lectura pública (para login)
CREATE POLICY "Allow public read access to admins"
ON admins FOR SELECT
USING (true);

-- Permitir inserción pública (para registro)
CREATE POLICY "Allow public insert access to admins"
ON admins FOR INSERT
WITH CHECK (true);

-- Permitir actualización pública
CREATE POLICY "Allow public update access to admins"
ON admins FOR UPDATE
USING (true);

-- Permitir eliminación pública
CREATE POLICY "Allow public delete access to admins"
ON admins FOR DELETE
USING (true);

