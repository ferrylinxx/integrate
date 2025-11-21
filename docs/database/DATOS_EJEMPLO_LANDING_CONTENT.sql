-- ============================================================================
-- DATOS DE EJEMPLO - TABLA: landing_content
-- ============================================================================
-- Sistema: Test de Áreas Sensibles - Modelo INTEGRATE 2.0
-- Propósito: Contenido inicial para la landing page
-- Total de registros: ~45 campos
-- ============================================================================

-- IMPORTANTE: Ejecutar este script DESPUÉS de crear las tablas

-- ============================================================================
-- CATEGORÍA: 00_Navegación
-- ============================================================================

INSERT INTO public.landing_content (category, section_name, field_name, field_label, content, is_html, display_order) VALUES
('00_Navegación', 'Menú Principal', 'version_badge', 'Badge de Versión', '<p><strong>v1.7.0 · (Beta)</strong></p>', true, 0),
('00_Navegación', 'Menú Principal', 'link_admin', 'Botón: Admin', 'Admin', false, 1),
('00_Navegación', 'Menú Principal', 'boton_comenzar', 'Botón: Hacer Test', 'Hacer Test', false, 2);


-- ============================================================================
-- CATEGORÍA: 01_Portada
-- ============================================================================

INSERT INTO public.landing_content (category, section_name, field_name, field_label, content, is_html, display_order) VALUES
('01_Portada', 'Hero Principal', 'badge', 'Etiqueta Superior (Badge)', 'Modelo INTEGRATE 2.0 · Diagnóstico Organizativo', false, 1),
('01_Portada', 'Hero Principal', 'titulo', 'Título Principal', 'Descubre las Áreas Sensibles de tu Organización', false, 2),
('01_Portada', 'Hero Principal', 'subtitulo', 'Descripción / Subtítulo', 'Diagnóstico organizativo basado en el modelo INTEGRATE 2.0. Identifica fortalezas y oportunidades de mejora en 6 dimensiones clave.', false, 3),
('01_Portada', 'Hero Principal', 'frase_inspiradora', 'Frase Inspiradora (Caja Destacada)', 'Este test ayuda a comprender cómo funciona el sistema, no a juzgarlo.', false, 4),
('01_Portada', 'Hero Principal', 'boton_principal', 'Texto del Botón Principal', 'Comenzar Test', false, 5);


-- ============================================================================
-- CATEGORÍA: 02_Estadísticas
-- ============================================================================

INSERT INTO public.landing_content (category, section_name, field_name, field_label, content, is_html, display_order) VALUES
('02_Estadísticas', 'Números del Proyecto', 'organizaciones_numero', 'Número de Organizaciones', '150+', false, 10),
('02_Estadísticas', 'Números del Proyecto', 'organizaciones_texto', 'Texto: Organizaciones', 'Organizaciones Analizadas', false, 11),
('02_Estadísticas', 'Números del Proyecto', 'participantes_numero', 'Número de Participantes', '5,000+', false, 12),
('02_Estadísticas', 'Números del Proyecto', 'participantes_texto', 'Texto: Participantes', 'Participantes Activos', false, 13),
('02_Estadísticas', 'Números del Proyecto', 'areas_numero', 'Número de Áreas', '6', false, 14),
('02_Estadísticas', 'Números del Proyecto', 'areas_texto', 'Texto: Áreas', 'Áreas de Diagnóstico', false, 15);


-- ============================================================================
-- CATEGORÍA: 04_Áreas_INTEGRATE
-- ============================================================================

INSERT INTO public.landing_content (category, section_name, field_name, field_label, content, is_html, display_order) VALUES
-- Encabezado de sección
('04_Áreas_INTEGRATE', 'Encabezado de Sección', 'titulo', 'Título de la Sección', '6 Áreas × 4 Subáreas', false, 20),
('04_Áreas_INTEGRATE', 'Encabezado de Sección', 'subtitulo', 'Subtítulo de la Sección', 'El modelo INTEGRATE 2.0 evalúa tu organización en 6 dimensiones fundamentales, cada una con 4 aspectos específicos.', false, 21),

-- Área 1: Estrategia
('04_Áreas_INTEGRATE', 'Área 1: Estrategia', 'titulo', 'Título del Área', 'Estrategia', false, 22),
('04_Áreas_INTEGRATE', 'Área 1: Estrategia', 'descripcion', 'Descripción del Área', 'Visión, misión, objetivos y planificación estratégica de la organización.', false, 23),

-- Área 2: Estructura
('04_Áreas_INTEGRATE', 'Área 2: Estructura', 'titulo', 'Título del Área', 'Estructura', false, 24),
('04_Áreas_INTEGRATE', 'Área 2: Estructura', 'descripcion', 'Descripción del Área', 'Organización interna, roles, responsabilidades y sistemas de coordinación.', false, 25),

-- Área 3: Orientación
('04_Áreas_INTEGRATE', 'Área 3: Orientación', 'titulo', 'Título del Área', 'Orientación', false, 26),
('04_Áreas_INTEGRATE', 'Área 3: Orientación', 'descripcion', 'Descripción del Área', 'Enfoque al cliente, innovación y adaptación al mercado.', false, 27),

-- Área 4: Eficacia
('04_Áreas_INTEGRATE', 'Área 4: Eficacia', 'titulo', 'Título del Área', 'Eficacia', false, 28),
('04_Áreas_INTEGRATE', 'Área 4: Eficacia', 'descripcion', 'Descripción del Área', 'Procesos, calidad, productividad y resultados operativos.', false, 29),

-- Área 5: Recursos
('04_Áreas_INTEGRATE', 'Área 5: Recursos', 'titulo', 'Título del Área', 'Recursos', false, 30),
('04_Áreas_INTEGRATE', 'Área 5: Recursos', 'descripcion', 'Descripción del Área', 'Gestión de recursos financieros, tecnológicos y materiales.', false, 31),

-- Área 6: Personas
('04_Áreas_INTEGRATE', 'Área 6: Personas', 'titulo', 'Título del Área', 'Personas', false, 32),
('04_Áreas_INTEGRATE', 'Área 6: Personas', 'descripcion', 'Descripción del Área', 'Talento, cultura organizacional, liderazgo y desarrollo del equipo.', false, 33);


-- ============================================================================
-- CATEGORÍA: 05_Perspectivas
-- ============================================================================

INSERT INTO public.landing_content (category, section_name, field_name, field_label, content, is_html, display_order) VALUES
-- Encabezado
('05_Perspectivas', 'Encabezado de Sección', 'titulo', 'Título de la Sección', 'Comité Directivo vs Equipos Operativos', false, 40),
('05_Perspectivas', 'Encabezado de Sección', 'descripcion', 'Descripción de la Sección', 'Compara la visión estratégica del comité directivo con la experiencia real de los equipos operativos.', false, 41),

-- Visión Directiva
('05_Perspectivas', 'Visión Directiva', 'titulo', 'Título de la Perspectiva', 'Visión Directiva', false, 42),
('05_Perspectivas', 'Visión Directiva', 'descripcion', 'Descripción de la Perspectiva', 'Cómo el comité directivo percibe el funcionamiento de la organización.', false, 43),

-- Experiencia Operativa
('05_Perspectivas', 'Experiencia Operativa', 'titulo', 'Título de la Perspectiva', 'Experiencia Operativa', false, 44),
('05_Perspectivas', 'Experiencia Operativa', 'descripcion', 'Descripción de la Perspectiva', 'La realidad del día a día según los equipos que ejecutan las operaciones.', false, 45);


-- ============================================================================
-- CATEGORÍA: 06_Llamada_a_Acción
-- ============================================================================

INSERT INTO public.landing_content (category, section_name, field_name, field_label, content, is_html, display_order) VALUES
('06_Llamada_a_Acción', 'CTA Final', 'titulo', 'Título del CTA', '¿Listo para Comprender tu Organización?', false, 50),
('06_Llamada_a_Acción', 'CTA Final', 'descripcion', 'Descripción del CTA', 'Realiza el test INTEGRATE 2.0 y obtén un diagnóstico completo de las áreas sensibles de tu organización.', false, 51),
('06_Llamada_a_Acción', 'CTA Final', 'frase_catalan', 'Frase en Catalán', '"Entendre el sistema és el primer pas per millorar-lo."', false, 52),
('06_Llamada_a_Acción', 'CTA Final', 'boton', 'Texto del Botón', 'Comenzar Diagnóstico', false, 53);


-- ============================================================================
-- CATEGORÍA: 07_Footer
-- ============================================================================

INSERT INTO public.landing_content (category, section_name, field_name, field_label, content, is_html, display_order) VALUES
-- Descripción del Proyecto
('07_Footer', 'Descripción del Proyecto', 'descripcion', 'Descripción del Proyecto', 'Test de Áreas Sensibles (AS) - Diagnóstico organizativo mediante el modelo INTEGRATE 2.0.', false, 60),
('07_Footer', 'Descripción del Proyecto', 'frase_catalan', 'Frase en Catalán', '"Entendre el sistema és el primer pas per millorar-lo."', false, 61),

-- Enlaces Rápidos
('07_Footer', 'Enlaces Rápidos', 'titulo_seccion', 'Título de la Sección', 'Enlaces Rápidos', false, 62),
('07_Footer', 'Enlaces Rápidos', 'link_test', 'Link: Hacer Test', 'Hacer Test', false, 63),
('07_Footer', 'Enlaces Rápidos', 'link_admin', 'Link: Panel de Administración', 'Panel de Administración', false, 64),

-- Información
('07_Footer', 'Información', 'titulo_seccion', 'Título de la Sección', 'Información', false, 65),
('07_Footer', 'Información', 'info_1', 'Info 1: Fase THINK', 'Fase THINK - Diagnóstico', false, 66),
('07_Footer', 'Información', 'info_2', 'Info 2: Áreas', '6 Áreas × 4 Subáreas', false, 67),
('07_Footer', 'Información', 'info_3', 'Info 3: RGPD', 'RGPD Compliant', false, 68),
('07_Footer', 'Información', 'info_4', 'Info 4: Powered by', 'Powered by Integrate', false, 69),

-- Legal
('07_Footer', 'Legal', 'titulo_seccion', 'Título de la Sección', 'Legal', false, 70),
('07_Footer', 'Legal', 'link_privacidad', 'Link: Política de Privacidad', 'Política de Privacidad', false, 71),
('07_Footer', 'Legal', 'link_cookies', 'Link: Política de Cookies', 'Política de Cookies', false, 72),
('07_Footer', 'Legal', 'link_rgpd', 'Link: Protección de Datos', 'Protección de Datos (RGPD)', false, 73),

-- Copyright
('07_Footer', 'Copyright', 'texto', 'Texto de Copyright', '<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>© 2025 Integrate - Test de Áreas Sensibles · Modelo INTEGRATE 2.0</title>
</head>
<body>
  <p>© 2025 Integrate - Test de Áreas Sensibles · Modelo INTEGRATE 2.0 (Desarrollado por 
    <a href="https://tecnofgb.com/" target="_blank" rel="noopener">Ferran Garola Bonilla</a>)
  </p>
</body>
</html>', true, 74);


-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Contar registros insertados
SELECT 
    category,
    COUNT(*) as total_campos
FROM public.landing_content
GROUP BY category
ORDER BY category;

-- Resultado esperado:
-- 00_Navegación: 3 campos
-- 01_Portada: 5 campos
-- 02_Estadísticas: 6 campos
-- 04_Áreas_INTEGRATE: 14 campos
-- 05_Perspectivas: 6 campos
-- 06_Llamada_a_Acción: 4 campos
-- 07_Footer: 14 campos
-- TOTAL: ~52 campos

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================

