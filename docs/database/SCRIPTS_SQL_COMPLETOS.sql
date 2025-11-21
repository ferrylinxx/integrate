-- ============================================================================
-- SCRIPTS SQL COMPLETOS - BASE DE DATOS INTEGRATE 2.0
-- ============================================================================
-- Sistema: Test de Áreas Sensibles - Modelo INTEGRATE 2.0
-- Base de Datos: PostgreSQL (Supabase)
-- Fecha: 30 de octubre de 2025
-- ============================================================================

-- ============================================================================
-- 1. HABILITAR EXTENSIONES NECESARIAS
-- ============================================================================

-- Extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extensión para funciones de seguridad (RLS)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
-- 2. CREAR TABLAS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLA: admins
-- Propósito: Almacena usuarios administradores del sistema
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.admins IS 'Usuarios administradores del sistema';
COMMENT ON COLUMN public.admins.id IS 'Identificador único del administrador';
COMMENT ON COLUMN public.admins.email IS 'Email del administrador (usado para login)';
COMMENT ON COLUMN public.admins.password_hash IS 'Hash de la contraseña (bcrypt)';
COMMENT ON COLUMN public.admins.name IS 'Nombre completo del administrador';


-- ----------------------------------------------------------------------------
-- TABLA: groups
-- Propósito: Almacena grupos/organizaciones que realizan el test
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES public.admins(id)
);

COMMENT ON TABLE public.groups IS 'Grupos u organizaciones que realizan el test';
COMMENT ON COLUMN public.groups.id IS 'Identificador único del grupo';
COMMENT ON COLUMN public.groups.code IS 'Código único del grupo (ej: "ORG2024")';
COMMENT ON COLUMN public.groups.name IS 'Nombre descriptivo del grupo/organización';
COMMENT ON COLUMN public.groups.created_by IS 'ID del admin que creó el grupo';


-- ----------------------------------------------------------------------------
-- TABLA: submissions
-- Propósito: Almacena respuestas individuales de participantes
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    participant_code VARCHAR(20) NOT NULL UNIQUE,
    answers INTEGER[] NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.submissions IS 'Respuestas individuales de participantes del test';
COMMENT ON COLUMN public.submissions.id IS 'Identificador único de la respuesta';
COMMENT ON COLUMN public.submissions.group_id IS 'Grupo al que pertenece el participante';
COMMENT ON COLUMN public.submissions.participant_code IS 'Código único del participante';
COMMENT ON COLUMN public.submissions.answers IS 'Array de 24 respuestas (valores 1-5)';
COMMENT ON COLUMN public.submissions.timestamp IS 'Fecha y hora de envío';


-- ----------------------------------------------------------------------------
-- TABLA: landing_content
-- Propósito: Contenido editable de la landing page
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.landing_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    section_name TEXT NOT NULL,
    field_name TEXT NOT NULL,
    field_label TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT DEFAULT 'es',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_html BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(category, section_name, field_name, language)
);

COMMENT ON TABLE public.landing_content IS 'Contenido editable de la landing page';
COMMENT ON COLUMN public.landing_content.category IS 'Categoría del contenido (ej: "01_Portada")';
COMMENT ON COLUMN public.landing_content.section_name IS 'Nombre de la sección (ej: "Hero Principal")';
COMMENT ON COLUMN public.landing_content.field_name IS 'Nombre del campo (ej: "titulo")';
COMMENT ON COLUMN public.landing_content.field_label IS 'Etiqueta descriptiva para el CMS';
COMMENT ON COLUMN public.landing_content.content IS 'Contenido del campo (texto o HTML)';
COMMENT ON COLUMN public.landing_content.is_html IS 'Si el contenido debe renderizarse como HTML';


-- ----------------------------------------------------------------------------
-- TABLA: content_history
-- Propósito: Historial de cambios del contenido
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.content_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL REFERENCES public.landing_content(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_html BOOLEAN DEFAULT false,
    changed_by TEXT,
    change_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.content_history IS 'Historial de cambios del contenido de la landing page';
COMMENT ON COLUMN public.content_history.content_id IS 'ID del contenido modificado';
COMMENT ON COLUMN public.content_history.content IS 'Contenido ANTERIOR (antes del cambio)';
COMMENT ON COLUMN public.content_history.changed_by IS 'Email del usuario que hizo el cambio';


-- ============================================================================
-- 3. CREAR ÍNDICES
-- ============================================================================

-- Índices para groups
CREATE INDEX IF NOT EXISTS idx_groups_code ON public.groups(code);

-- Índices para submissions
CREATE INDEX IF NOT EXISTS idx_submissions_group_id ON public.submissions(group_id);
CREATE INDEX IF NOT EXISTS idx_submissions_participant_code ON public.submissions(participant_code);

-- Índices para landing_content
CREATE INDEX IF NOT EXISTS idx_landing_content_category ON public.landing_content(category);
CREATE INDEX IF NOT EXISTS idx_landing_content_language ON public.landing_content(language);
CREATE INDEX IF NOT EXISTS idx_landing_content_order ON public.landing_content(display_order);
CREATE INDEX IF NOT EXISTS idx_landing_content_active ON public.landing_content(is_active);

-- Índices para content_history
CREATE INDEX IF NOT EXISTS idx_content_history_content_id ON public.content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_content_history_created_at ON public.content_history(created_at DESC);


-- ============================================================================
-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_history ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- 5. CREAR POLÍTICAS RLS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Políticas para: admins
-- ----------------------------------------------------------------------------

CREATE POLICY "Allow public read access to admins"
    ON public.admins FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert access to admins"
    ON public.admins FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update access to admins"
    ON public.admins FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete access to admins"
    ON public.admins FOR DELETE
    USING (true);


-- ----------------------------------------------------------------------------
-- Políticas para: groups
-- ----------------------------------------------------------------------------

CREATE POLICY "Allow public read access to groups"
    ON public.groups FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to groups"
    ON public.groups FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update to groups"
    ON public.groups FOR UPDATE
    USING (true);

CREATE POLICY "Allow public delete to groups"
    ON public.groups FOR DELETE
    USING (true);


-- ----------------------------------------------------------------------------
-- Políticas para: submissions
-- ----------------------------------------------------------------------------

CREATE POLICY "Allow public read access to submissions"
    ON public.submissions FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert to submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public delete to submissions"
    ON public.submissions FOR DELETE
    USING (true);


-- ----------------------------------------------------------------------------
-- Políticas para: landing_content
-- ----------------------------------------------------------------------------

CREATE POLICY "Allow public read access"
    ON public.landing_content FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow public insert access"
    ON public.landing_content FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public update access"
    ON public.landing_content FOR UPDATE
    USING (true)
    WITH CHECK (true);


-- ----------------------------------------------------------------------------
-- Políticas para: content_history
-- ----------------------------------------------------------------------------

CREATE POLICY "Permitir lectura pública de historial"
    ON public.content_history FOR SELECT
    USING (true);

CREATE POLICY "Permitir inserción de historial"
    ON public.content_history FOR INSERT
    WITH CHECK (true);


-- ============================================================================
-- 6. DATOS DE EJEMPLO (OPCIONAL)
-- ============================================================================

-- Insertar un administrador de ejemplo
-- NOTA: La contraseña debe ser hasheada con bcrypt antes de insertar
-- INSERT INTO public.admins (email, password_hash, name) VALUES
-- ('admin@integrate.com', '$2a$10$...hash...', 'Administrador Principal');

-- Insertar grupos de ejemplo
-- INSERT INTO public.groups (code, name) VALUES
-- ('ORG2024', 'Empresa Ejemplo S.L.'),
-- ('TEAM001', 'Equipo de Marketing');


-- ============================================================================
-- 7. FUNCIONES ÚTILES (OPCIONAL)
-- ============================================================================

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para landing_content
CREATE TRIGGER update_landing_content_updated_at
    BEFORE UPDATE ON public.landing_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

