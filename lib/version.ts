/**
 * Información de versión de la aplicación INTEGRATE 2.0
 *
 * Versionado Semántico (SemVer): MAJOR.MINOR.PATCH
 * - MAJOR: Cambios incompatibles con versiones anteriores
 * - MINOR: Nueva funcionalidad compatible con versiones anteriores
 * - PATCH: Correcciones de bugs compatibles con versiones anteriores
 *
 * IMPORTANTE: Actualizar esta versión antes de hacer build de Docker
 */

export const APP_VERSION = "2.7.0";
export const APP_VERSION_LABEL = "v2.7.0 · Estable";
export const APP_BUILD_DATE = new Date().toISOString();

/**
 * Historial de versiones
 */
export const VERSION_HISTORY = [
  {
    version: "2.7.0",
    date: "2025-01-19",
    changes: [
      "Rediseño completo del bloque ÁREA COMPLETA",
      "Nueva estructura de layout con 3 columnas (ÁREA/DIAGNÓSTICO, DESGLOSE, VISIÓN GENERAL)",
      "Cuadrados con gradiente y borde en DESGLOSE POR SUB ÁREAS",
      "Línea separadora vertical entre secciones",
      "Mejora de espaciados y alineaciones",
      "Textos en blanco puro para mejor legibilidad",
      "Optimización de degradados sin color beige intermedio",
    ],
  },
  {
    version: "2.2.0",
    date: "2025-01-17",
    changes: [
      "Indicador de versión añadido en todas las páginas internas",
      "Sistema CMS multi-página implementado",
      "Nuevas tablas de contenido: test_content, results_content, admin_content, code_entry_content",
      "Panel de administración CMS con tabs para cada página",
      "Hooks genéricos para gestión de contenido por página",
      "Datos iniciales (seed data) para todas las tablas CMS",
      "Componente VersionBadge reutilizable",
    ],
  },
  {
    version: "2.1.0",
    date: "2025-01-16",
    changes: [
      "Eliminación del cubo 3D interactivo (simplificación)",
      "Vista de lista como única opción de visualización",
      "Optimización mobile-first completa del test",
      "Aplicación de colores INTEGRATE en toda la experiencia",
      "Mejora de rendimiento en dispositivos móviles",
      "Botones táctiles optimizados (≥48px)",
      "Animaciones y transiciones suaves",
    ],
  },
  {
    version: "2.0.0",
    date: "2025-01-15",
    changes: [
      "Campo de nombre de usuario añadido",
      "QR code reducido y simplificado",
      "Logo corregido en Docker",
      "Scripts de versionado implementados",
      "Funcionalidad de eliminar participantes",
      "Mejora en visualización de nombres de usuario",
    ],
  },
  {
    version: "1.3.0",
    date: "2025-01-10",
    changes: [
      "Versión inicial de producción",
      "Sistema de test INTEGRATE completo",
      "Panel de administración",
      "Visualización de resultados con cubo 3D",
    ],
  },
];

/**
 * Obtener información de versión formateada
 */
export function getVersionInfo() {
  return {
    version: APP_VERSION,
    label: APP_VERSION_LABEL,
    buildDate: APP_BUILD_DATE,
  };
}

