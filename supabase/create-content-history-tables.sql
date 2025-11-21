-- =====================================================
-- TABLAS DE HISTORIAL PARA CMS MULTI-PÁGINA
-- =====================================================
-- Estas tablas almacenan el historial de cambios de contenido
-- para las 4 páginas del sistema CMS Multi-Página
-- =====================================================

-- Tabla de historial para test_content
CREATE TABLE IF NOT EXISTS test_content_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES test_content(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_html BOOLEAN DEFAULT false,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW(),
  change_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para test_content_history
CREATE INDEX IF NOT EXISTS idx_test_content_history_content_id ON test_content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_test_content_history_changed_at ON test_content_history(changed_at DESC);

-- Tabla de historial para results_content
CREATE TABLE IF NOT EXISTS results_content_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES results_content(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_html BOOLEAN DEFAULT false,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW(),
  change_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para results_content_history
CREATE INDEX IF NOT EXISTS idx_results_content_history_content_id ON results_content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_results_content_history_changed_at ON results_content_history(changed_at DESC);

-- Tabla de historial para admin_content
CREATE TABLE IF NOT EXISTS admin_content_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES admin_content(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_html BOOLEAN DEFAULT false,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW(),
  change_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para admin_content_history
CREATE INDEX IF NOT EXISTS idx_admin_content_history_content_id ON admin_content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_admin_content_history_changed_at ON admin_content_history(changed_at DESC);

-- Tabla de historial para code_entry_content
CREATE TABLE IF NOT EXISTS code_entry_content_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES code_entry_content(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_html BOOLEAN DEFAULT false,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW(),
  change_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para code_entry_content_history
CREATE INDEX IF NOT EXISTS idx_code_entry_content_history_content_id ON code_entry_content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_code_entry_content_history_changed_at ON code_entry_content_history(changed_at DESC);

-- =====================================================
-- POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas de historial
ALTER TABLE test_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE results_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_entry_content_history ENABLE ROW LEVEL SECURITY;

-- Políticas para test_content_history
DROP POLICY IF EXISTS "Allow public read access to test_content_history" ON test_content_history;
CREATE POLICY "Allow public read access to test_content_history"
  ON test_content_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on test_content_history" ON test_content_history;
CREATE POLICY "Allow all operations on test_content_history"
  ON test_content_history FOR ALL
  USING (true);

-- Políticas para results_content_history
DROP POLICY IF EXISTS "Allow public read access to results_content_history" ON results_content_history;
CREATE POLICY "Allow public read access to results_content_history"
  ON results_content_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on results_content_history" ON results_content_history;
CREATE POLICY "Allow all operations on results_content_history"
  ON results_content_history FOR ALL
  USING (true);

-- Políticas para admin_content_history
DROP POLICY IF EXISTS "Allow public read access to admin_content_history" ON admin_content_history;
CREATE POLICY "Allow public read access to admin_content_history"
  ON admin_content_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on admin_content_history" ON admin_content_history;
CREATE POLICY "Allow all operations on admin_content_history"
  ON admin_content_history FOR ALL
  USING (true);

-- Políticas para code_entry_content_history
DROP POLICY IF EXISTS "Allow public read access to code_entry_content_history" ON code_entry_content_history;
CREATE POLICY "Allow public read access to code_entry_content_history"
  ON code_entry_content_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow all operations on code_entry_content_history" ON code_entry_content_history;
CREATE POLICY "Allow all operations on code_entry_content_history"
  ON code_entry_content_history FOR ALL
  USING (true);

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE test_content_history IS 'Historial de cambios del contenido de la página de Test';
COMMENT ON TABLE results_content_history IS 'Historial de cambios del contenido de la página de Resultados';
COMMENT ON TABLE admin_content_history IS 'Historial de cambios del contenido del Panel de Admin';
COMMENT ON TABLE code_entry_content_history IS 'Historial de cambios del contenido de la página de Entrada de Código';

COMMENT ON COLUMN test_content_history.content_id IS 'Referencia al contenido original en test_content';
COMMENT ON COLUMN test_content_history.changed_by IS 'Email del administrador que realizó el cambio';
COMMENT ON COLUMN test_content_history.change_description IS 'Descripción opcional del cambio realizado';

