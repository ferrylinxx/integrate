/**
 * Colores oficiales de Integrate
 * Cada color corresponde a una de las 6 áreas de competencia
 */

export const INTEGRATE_COLORS = {
  estrategia: '#2C248E',      // Azul oscuro - Área 1
  estructura: '#412761',      // Morado oscuro - Área 2
  orientacio: '#8E235D',      // Magenta oscuro - Área 3
  eficacia: '#E65B3E',        // Naranja rojizo - Área 4
  recursos: '#F08726',        // Naranja - Área 5
  persones: '#D91D5C',        // Rosa/Fucsia - Área 6
} as const;

/**
 * Array de colores en orden de las áreas (1-6)
 * Útil para mapear colores a las 24 preguntas
 */
export const AREA_COLORS = [
  INTEGRATE_COLORS.estrategia,   // Área 1: Preguntas 1-4
  INTEGRATE_COLORS.estructura,   // Área 2: Preguntas 5-8
  INTEGRATE_COLORS.orientacio,   // Área 3: Preguntas 9-12
  INTEGRATE_COLORS.eficacia,     // Área 4: Preguntas 13-16
  INTEGRATE_COLORS.recursos,     // Área 5: Preguntas 17-20
  INTEGRATE_COLORS.persones,     // Área 6: Preguntas 21-24
] as const;

/**
 * Obtener el color de una pregunta específica (1-24)
 */
export function getQuestionColor(questionNumber: number): string {
  const areaIndex = Math.floor((questionNumber - 1) / 4);
  return AREA_COLORS[areaIndex] || INTEGRATE_COLORS.estrategia;
}

/**
 * Obtener el color de un área específica (1-6)
 */
export function getAreaColor(areaNumber: number): string {
  return AREA_COLORS[areaNumber - 1] || INTEGRATE_COLORS.estrategia;
}

/**
 * Colores para los valores de respuesta (1-4)
 * Mantenemos el esquema de colores original para las respuestas
 */
export const ANSWER_COLORS = {
  1: '#E53935', // Rojo
  2: '#FB8C00', // Naranja
  3: '#FDD835', // Amarillo
  4: '#43A047', // Verde
} as const;

/**
 * Gradientes para el diseño general de la app
 * Basados en los colores de Integrate
 */
export const GRADIENTS = {
  primary: `linear-gradient(135deg, ${INTEGRATE_COLORS.estrategia} 0%, ${INTEGRATE_COLORS.persones} 100%)`,
  header: `linear-gradient(to right, ${INTEGRATE_COLORS.estrategia}, ${INTEGRATE_COLORS.estructura}, ${INTEGRATE_COLORS.persones})`,
  admin: `linear-gradient(to right, ${INTEGRATE_COLORS.estructura}, ${INTEGRATE_COLORS.orientacio})`,
} as const;

