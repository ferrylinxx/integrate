-- ============================================
-- SEED DATA PARA SISTEMA CMS MULTI-PÁGINA
-- INTEGRATE 2.0 - Versión 2.2.0
-- ============================================

-- TEST_CONTENT
INSERT INTO public.test_content (category, section_name, field_name, field_label, content, language, display_order, is_active, is_html) VALUES
('01_Header', 'Navegación', 'boton_inicio', 'Botón Inicio', 'Inicio', 'es', 1, true, false),
('01_Header', 'Título', 'principal', 'Título Principal', 'Cuestionario de Evaluación', 'es', 2, true, false),
('02_Acciones', 'Botones', 'descartar_borrador', 'Botón Descartar Borrador', 'Descartar borrador', 'es', 3, true, false),
('02_Acciones', 'Botones', 'descartar_corto', 'Botón Descartar Corto', 'Descartar', 'es', 4, true, false)
ON CONFLICT (category, section_name, field_name, language) DO NOTHING;

-- RESULTS_CONTENT
INSERT INTO public.results_content (category, section_name, field_name, field_label, content, language, display_order, is_active, is_html) VALUES
('01_Header', 'Título', 'principal', 'Título Principal', 'Resultados del Diagnóstico', 'es', 1, true, false),
('01_Header', 'Título', 'subtitulo', 'Subtítulo', 'Análisis de Áreas Sensibles INTEGRATE 2.0', 'es', 2, true, false),
('02_Resumen', 'Métricas', 'puntuacion_promedio', 'Puntuación Promedio', 'Puntuación Promedio', 'es', 3, true, false),
('03_Visualización', 'Cubo', 'titulo', 'Título Visualización', 'Visualización de Resultados', 'es', 6, true, false),
('05_Acciones', 'Botones', 'volver_inicio', 'Botón Volver', 'Volver al Inicio', 'es', 11, true, false)
ON CONFLICT (category, section_name, field_name, language) DO NOTHING;

-- ADMIN_CONTENT
INSERT INTO public.admin_content (category, section_name, field_name, field_label, content, language, display_order, is_active, is_html) VALUES
('01_Header', 'Título', 'principal', 'Título Principal', 'Panel de Administración', 'es', 1, true, false),
('01_Header', 'Título', 'descripcion', 'Descripción', 'Gestiona grupos y visualiza resultados del <strong>Test de Áreas Sensibles</strong> INTEGRATE 2.0', 'es', 2, true, true),
('02_Botones', 'Navegación', 'cms_multi', 'Botón CMS Multi', 'CMS Multi-Página', 'es', 3, true, false),
('02_Botones', 'Navegación', 'cms_landing', 'Botón CMS Landing', 'CMS Landing', 'es', 4, true, false),
('02_Botones', 'Navegación', 'inicio', 'Botón Inicio', 'Inicio', 'es', 5, true, false),
('02_Botones', 'Navegación', 'cerrar_sesion', 'Botón Cerrar Sesión', 'Cerrar Sesión', 'es', 6, true, false),
('03_Tabs', 'Navegación', 'grupos', 'Tab Grupos', 'Grupos', 'es', 7, true, false),
('03_Tabs', 'Navegación', 'administradores', 'Tab Administradores', 'Administradores', 'es', 8, true, false)
ON CONFLICT (category, section_name, field_name, language) DO NOTHING;

-- CODE_ENTRY_CONTENT
INSERT INTO public.code_entry_content (category, section_name, field_name, field_label, content, language, display_order, is_active, is_html) VALUES
('01_Header', 'Título Principal', 'titulo', 'Título Principal', 'Test de Áreas Sensibles', 'es', 1, true, false),
('01_Header', 'Título Principal', 'subtitulo', 'Subtítulo', 'Diagnóstico Organizativo · Modelo INTEGRATE 2.0', 'es', 2, true, false),
('02_Card', 'Encabezado', 'titulo', 'Título Card', '<h2>Acceso al Test</h2>', 'es', 3, true, true),
('02_Card', 'Encabezado', 'descripcion', 'Descripción Card', 'Introduce el código de grupo proporcionado por tu facilitador', 'es', 4, true, false),
('03_Privacidad', 'Información', 'titulo', 'Título Privacidad', 'Privacidad garantizada', 'es', 5, true, false),
('03_Privacidad', 'Información', 'descripcion', 'Descripción Privacidad', 'Tus respuestas son <span class="font-semibold">completamente anónimas</span> y se utilizan únicamente para el diagnóstico organizativo. Cumplimos con el <span class="font-semibold">RGPD</span> y no almacenamos datos personales identificables.', 'es', 6, true, true)
ON CONFLICT (category, section_name, field_name, language) DO NOTHING;

