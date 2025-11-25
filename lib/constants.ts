import { AreaData, AnswerValue } from "./types";

// Colores oficiales de Integrate para cada área
export const INTEGRATE_COLORS = {
  estrategia: '#4D4DFF',      // Azul brillante - Área 1
  estructura: '#763AD6',      // Morado oscuro - Área 2
  orientacio: '#8E235D',      // Magenta oscuro - Área 3
  eficacia: '#E65B3E',        // Naranja rojizo - Área 4
  recursos: '#F08726',        // Naranja - Área 5
  persones: '#D91D5C',        // Rosa/Fucsia - Área 6
} as const;

// Array de colores por área (para mapear fácilmente)
export const AREA_COLORS = [
  INTEGRATE_COLORS.estrategia,   // Área 1
  INTEGRATE_COLORS.estructura,   // Área 2
  INTEGRATE_COLORS.orientacio,   // Área 3
  INTEGRATE_COLORS.eficacia,     // Área 4
  INTEGRATE_COLORS.recursos,     // Área 5
  INTEGRATE_COLORS.persones,     // Área 6
] as const;

// Paleta de colores según el valor (1-4)
export const VALUE_COLORS: Record<AnswerValue, string> = {
  1: "#E53935", // Rojo
  2: "#FB8C00", // Naranja
  3: "#FDD835", // Amarillo
  4: "#43A047", // Verde
};

// Nombres de las áreas (6 áreas del modelo INTEGRATE 2.0)
export const AREA_NAMES = [
  "Área 1: Estrategia",
  "Área 2: Estructura",
  "Área 3: Orientación",
  "Área 4: Eficacia",
  "Área 5: Recursos",
  "Área 6: Personas",
];

// Nombres de las sub-áreas del modelo INTEGRATE 2.0 (24 sub-áreas totales)
export const SUB_AREA_NAMES = [
  // Área 0 - Estrategia (índices 0-3)
  "Visión/Misión/Valores",
  "Stakeholders",
  "Calidad",
  "Proyectos",

  // Área 1 - Estructura (índices 4-7)
  "Liderazgo",
  "Roles",
  "Procesos",
  "Riesgos",

  // Área 2 - Orientación a Resultados (índices 8-11)
  "Compromiso",
  "Políticas/Prácticas",
  "Imagen corporativa",
  "Indicadores",

  // Área 3 - Eficacia (índices 12-15)
  "Trabajo en equipo",
  "Seguimiento",
  "Retroalimentación",
  "Mejora continua",

  // Área 4 - Recursos (índices 16-19)
  "Financieros",
  "Tecnología",
  "Comunicación",
  "Logística",

  // Área 5 - Personas (índices 20-23)
  "Selección",
  "Desarrollo",
  "Salario emocional",
  "Motivación",
] as const;

// Nombres de sub-áreas organizados por área (para acceso más fácil)
export const SUB_AREA_NAMES_BY_AREA = [
  // Área 0 - Estrategia
  ["Visión/Misión/Valores", "Stakeholders", "Calidad", "Proyectos"],
  // Área 1 - Estructura
  ["Liderazgo", "Roles", "Procesos", "Riesgos"],
  // Área 2 - Orientación a Resultados
  ["Compromiso", "Políticas/Prácticas", "Imagen corporativa", "Indicadores"],
  // Área 3 - Eficacia
  ["Trabajo en equipo", "Seguimiento", "Retroalimentación", "Mejora continua"],
  // Área 4 - Recursos
  ["Financieros", "Tecnología", "Comunicación", "Logística"],
  // Área 5 - Personas
  ["Selección", "Desarrollo", "Salario emocional", "Motivación"],
] as const;

// Abreviaciones cortas para espacios reducidos
export const SUB_AREA_SHORT_NAMES = [
  // Área 0 - Estrategia
  "VMV", "Stake", "Calid", "Proy",
  // Área 1 - Estructura
  "Lider", "Roles", "Proc", "Riesg",
  // Área 2 - Orientación a Resultados
  "Compr", "Polít", "Imagen", "Indic",
  // Área 3 - Eficacia
  "Equipo", "Segui", "Retro", "Mejora",
  // Área 4 - Recursos
  "Finan", "Tecno", "Comun", "Logís",
  // Área 5 - Personas
  "Selec", "Desar", "Sal.Em", "Motiv",
] as const;

// Etiquetas de las preguntas (4 por área) - DEPRECATED: Usar SUB_AREA_NAMES en su lugar
export const QUESTION_LABELS = [
  "Capa 1",
  "Capa 2",
  "Capa 3",
  "Capa 4",
];

// Preguntas completas del modelo INTEGRATE 2.0 (24 preguntas)
export const INTEGRATE_QUESTIONS = [
  // ÁREA 1: ESTRATEGIA → Ruta 1: Visión & Impacto Real
  "¿Nuestros valores y nuestra misión son conocidos por todo el equipo y guían realmente las decisiones estratégicas?",
  "¿Recogemos de forma habitual el feedback de nuestros clientes, usuarios o grupos de interés e incorporamos sus aportaciones a la mejora de los proyectos?",
  "¿Disponemos de estándares o criterios de calidad claros y compartidos que orientan el trabajo diario y la toma de decisiones?",
  "¿Los proyectos activos reflejan nuestra visión y prioridades estratégicas, y se revisan periódicamente según los resultados?",

  // ÁREA 2: ESTRUCTURA → Ruta 2: Liderar con Claridad
  "¿Los liderazgos dentro de la organización son visibles, coherentes con los valores y fomentan la confianza y la corresponsabilidad?",
  "¿Cada persona conoce su rol, sus responsabilidades y cómo su trabajo contribuye a los objetivos globales de la organización?",
  "¿Los procesos de trabajo están documentados, se revisan de forma periódica y son conocidos por todo el equipo?",
  "¿Disponemos de protocolos claros para anticipar y gestionar riesgos o imprevistos operativos, aprendiendo de las incidencias?",

  // ÁREA 3: ORIENTACIÓN A RESULTADOS → Ruta 3: Del KPI al Impacto
  "¿Los resultados alcanzados reflejan el compromiso y la implicación real de los equipos, más allá del cumplimiento formal de las tareas?",
  "¿Nuestras políticas internas y prácticas de gestión son coherentes con los valores y el propósito corporativo?",
  "¿La imagen que proyectamos como organización es coherente con nuestra cultura interna y con la manera en que trabajamos?",
  "¿Usamos indicadores para mejorar y aprender, más que solo para controlar o fiscalizar los resultados?",

  // ÁREA 4: EFICACIA → Ruta 4: Equipos de Alto Rendimiento
  "¿Nuestro equipo trabaja desde la confianza, la comunicación abierta y la colaboración real entre áreas?",
  "¿Hacemos seguimiento regular de los objetivos y proyectos, compartiendo información de manera transparente y constructiva?",
  "¿Damos y recibimos feedback de forma habitual y constructiva, para mejorar el rendimiento y el clima de trabajo?",
  "¿Aprendemos de los errores, revisamos procesos e incorporamos nuevas prácticas para mejorar nuestra eficacia colectiva?",

  // ÁREA 5: RECURSOS → Ruta 5: Activa tu Sistema Operativo
  "¿El presupuesto se gestiona con transparencia, criterios compartidos y alineación con los objetivos estratégicos?",
  "¿Las herramientas digitales y tecnológicas que utilizamos realmente nos facilitan el trabajo y reducen la carga operativa?",
  "¿La información circula de forma fluida, clara y a tiempo entre personas, equipos y niveles de decisión?",
  "¿El entorno físico y las condiciones logísticas favorecen la colaboración, la eficiencia y el bienestar en el trabajo?",

  // ÁREA 6: PERSONAS → Ruta 6: Talento, Emoción & Desarrollo
  "¿Los procesos de selección tienen en cuenta las competencias, los valores y el encaje con la cultura organizativa, más allá del perfil técnico?",
  "¿La organización ofrece oportunidades reales de crecimiento profesional y aprendizaje continuo?",
  "¿El entorno de trabajo reconoce el esfuerzo, cuida el bienestar y fomenta la conciliación y la satisfacción personal?",
  "¿Nos sentimos motivados, implicados y con un propósito claro en nuestro trabajo diario?",
] as const;

// Estructura completa de las áreas con sus preguntas
export const AREAS: AreaData[] = AREA_NAMES.map((name, index) => ({
  areaNumber: index + 1,
  areaName: name,
  questions: Array.from({ length: 4 }, (_, qIndex) => {
    const globalIndex = index * 4 + qIndex;
    return {
      questionNumber: qIndex + 1,
      label: INTEGRATE_QUESTIONS[globalIndex],
    };
  }),
}));

// Función helper para convertir hex a RGB
function hex2rgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Función para generar degradado CSS basado en porcentaje
// Más color = mejor desempeño, más oscuro = peor desempeño
// El degradado va de azul oscuro/negro (arriba, no cumplido) a color vibrante (abajo, cumplido)
export function getGradientBackground(baseColor: string, percentage: number): string {
  const rgb = hex2rgb(baseColor);

  // Aumentar saturación del color (multiplicar por 1.2 para más vibración)
  const saturatedRgb = {
    r: Math.min(Math.round(rgb.r * 1.2), 255),
    g: Math.min(Math.round(rgb.g * 1.2), 255),
    b: Math.min(Math.round(rgb.b * 1.2), 255)
  };

  // Colores base para el degradado (SIN grayBeige para eliminar el blanco)
  const darkBlue = 'rgb(10, 15, 30)';        // Azul oscuro casi negro (top)
  const mediumDark = 'rgb(25, 35, 55)';      // Azul oscuro medio

  // Normalizar percentage (0-100)
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));

  if (normalizedPercentage === 0) {
    // 0% cumplimiento: todo oscuro
    return `linear-gradient(to bottom, ${darkBlue} 0%, ${mediumDark} 100%)`;
  } else if (normalizedPercentage === 100) {
    // 100% cumplimiento: todo el color saturado
    return `rgb(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b})`;
  } else {
    // Calcular puntos de parada del degradado
    // El color debe ocupar el percentage% desde ABAJO
    // Transición directa de azul oscuro a color vibrante (SIN gris beige)

    // Punto donde empieza el color vibrante (directamente proporcional al porcentaje)
    const colorStartPoint = 100 - normalizedPercentage;

    // Punto donde empieza la transición (azul medio)
    // Zona de transición más corta para evitar el efecto blanquecino
    const transitionPoint = Math.max(0, colorStartPoint - 10);

    // Punto donde termina el azul oscuro puro
    const darkEndPoint = Math.max(0, transitionPoint - 5);

    // Crear gradiente con transición directa de azul a color (sin gris beige)
    return `linear-gradient(
      to bottom,
      ${darkBlue} 0%,
      ${darkBlue} ${darkEndPoint}%,
      ${mediumDark} ${transitionPoint}%,
      rgb(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}) ${colorStartPoint}%,
      rgb(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}) 100%
    )`;
  }
}

// Iconos para niveles de desempeño
export const LEVEL_ICONS = {
  critico: '🔴',
  desarrollo: '🟠',
  solido: '🟢',
  ejemplar: '🔵'
} as const;

// Iconos para las 6 áreas de INTEGRATE
export const AREA_ICONS = {
  0: '🎯', // Estrategia
  1: '🏗️', // Estructura
  2: '📊', // Orientación a Resultados
  3: '⚡', // Eficacia
  4: '💰', // Recursos
  5: '👥'  // Personas
} as const;

// Total de preguntas
export const TOTAL_QUESTIONS = 24;

// Clave de localStorage
export const STORAGE_KEY = "tnc-submissions";

