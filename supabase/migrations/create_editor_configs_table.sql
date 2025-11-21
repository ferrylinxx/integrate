-- ============================================
-- TABLA: editor_configs
-- Descripción: Almacena las configuraciones del editor visual
-- ============================================

CREATE TABLE IF NOT EXISTS editor_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por user_id
CREATE INDEX IF NOT EXISTS idx_editor_configs_user_id ON editor_configs(user_id);

-- Comentarios
COMMENT ON TABLE editor_configs IS 'Configuraciones del editor visual para cada usuario';
COMMENT ON COLUMN editor_configs.user_id IS 'Identificador único del usuario (puede ser email, ID, etc.)';
COMMENT ON COLUMN editor_configs.config IS 'Configuración completa del editor en formato JSON';
COMMENT ON COLUMN editor_configs.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN editor_configs.updated_at IS 'Fecha de última actualización';

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- ============================================

-- Habilitar Row Level Security
ALTER TABLE editor_configs ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden leer su propia configuración
CREATE POLICY "Users can read their own config"
  ON editor_configs
  FOR SELECT
  USING (true); -- Por ahora permitir lectura a todos (ajustar según autenticación)

-- Política: Los usuarios pueden insertar su propia configuración
CREATE POLICY "Users can insert their own config"
  ON editor_configs
  FOR INSERT
  WITH CHECK (true); -- Por ahora permitir inserción a todos (ajustar según autenticación)

-- Política: Los usuarios pueden actualizar su propia configuración
CREATE POLICY "Users can update their own config"
  ON editor_configs
  FOR UPDATE
  USING (true); -- Por ahora permitir actualización a todos (ajustar según autenticación)

-- ============================================
-- FUNCIÓN: Actualizar updated_at automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_editor_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_update_editor_configs_updated_at
  BEFORE UPDATE ON editor_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_editor_configs_updated_at();

