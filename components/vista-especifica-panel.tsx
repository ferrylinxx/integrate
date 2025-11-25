"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_NAMES, AREA_COLORS, SUB_AREA_NAMES_BY_AREA, getGradientBackground, AREA_ICONS, LEVEL_ICONS } from "@/lib/constants";
import { CircularProgress } from "@/components/circular-progress";
import { Tooltip } from "@/components/tooltip";
import { CONTENIDO_ESTRATEGIA, CONTENIDO_ESTRUCTURA, CONTENIDO_RESULTADOS, CONTENIDO_EFICACIA, CONTENIDO_RECURSOS, CONTENIDO_PERSONAS, getNivelKey } from "@/lib/contenido-interpretativo";

interface VistaEspecificaPanelProps {
  areaIndex: number | null;
  subAreaIndex: number | null;
  answers: AnswerValue[];
  darkMode?: boolean; // Nueva prop para modo oscuro (cubo-vista)
  onBack?: () => void; // Nueva prop para botón de volver
}

// CRÍTICO: 0-25% | DESARROLLO: 25-50% | SÓLIDO: 50-75% | EJEMPLAR: 75-100%
const getLevel = (percentage: number): { label: string; color: string; key: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' } => {
  if (percentage <= 25) return { label: 'CRÍTICO', color: '#DC2626', key: 'critico' };
  if (percentage <= 50) return { label: 'DESARROLLO', color: '#F59E0B', key: 'desarrollo' };
  if (percentage <= 75) return { label: 'SÓLIDO', color: '#10B981', key: 'solido' };
  return { label: 'EJEMPLAR', color: '#3B82F6', key: 'ejemplar' };
};

export function VistaEspecificaPanel({ areaIndex, subAreaIndex, answers, darkMode = false, onBack }: VistaEspecificaPanelProps) {
  // Validación: si areaIndex o subAreaIndex son null, mostrar mensaje de error
  if (areaIndex === null || subAreaIndex === null) {
    return (
      <div className={`${darkMode ? 'bg-white/5 text-white' : 'bg-white'} border-4 border-gray-900 rounded-lg p-6`}>
        <div className="flex items-center justify-center h-64">
          <p className={darkMode ? 'text-white/60' : 'text-gray-600'}>
            Error: No se ha seleccionado un área válida
          </p>
        </div>
      </div>
    );
  }

  const answerIndex = areaIndex * 4 + subAreaIndex;
  const value = answers[answerIndex];
  const percentage = (value / 4) * 100;
  const level = getLevel(percentage);
  const areaName = AREA_NAMES[areaIndex].replace('Área 1: ', '').replace('Área 2: ', '').replace('Área 3: ', '').replace('Área 4: ', '').replace('Área 5: ', '').replace('Área 6: ', '');
  const subAreaName = SUB_AREA_NAMES_BY_AREA[areaIndex][subAreaIndex];

  // Usar el color corporativo del área en lugar del color genérico de nivel
  const areaColor = AREA_COLORS[areaIndex];

  // Obtener contenido interpretativo según el área
  const getContenidoArea = () => {
    if (areaIndex === 0) return CONTENIDO_ESTRATEGIA;
    if (areaIndex === 1) return CONTENIDO_ESTRUCTURA;
    if (areaIndex === 2) return CONTENIDO_RESULTADOS;
    if (areaIndex === 3) return CONTENIDO_EFICACIA;
    if (areaIndex === 4) return CONTENIDO_RECURSOS;
    if (areaIndex === 5) return CONTENIDO_PERSONAS;
    return null;
  };

  const contenidoArea = getContenidoArea();
  const contenidoDisponible = contenidoArea && contenidoArea.subAreas[subAreaIndex];
  const nivelKey = getNivelKey(value);
  const contenido = contenidoDisponible ? contenidoArea.subAreas[subAreaIndex].niveles[nivelKey] : null;

  return (
    <div className="space-y-6">
      {/* Botón volver arriba a la izquierda */}
      {onBack && (
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            darkMode
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          aria-label="Volver"
        >
          <span className="text-sm">←</span>
          <span className="text-[10px] font-medium">Volver</span>
        </button>
      )}

      {/* SECCIÓN SUPERIOR: Cubo 2x2 */}
      <div>
        {/* Cubo 2x2 grande */}
        <div className="grid grid-cols-2 gap-1.5 w-full aspect-square max-w-[220px] mx-auto">
          {[0, 1, 2, 3].map((index) => {
            const subAnswerIndex = areaIndex * 4 + index;
            const subValue = answers[subAnswerIndex];
            const subPercentage = (subValue / 4) * 100;
            const subName = SUB_AREA_NAMES_BY_AREA[areaIndex][index];

            return (
              <div
                key={index}
                className={`
                  border-2 rounded-lg transition-all duration-300 cursor-pointer relative
                  ${darkMode ? 'border-white/30' : 'border-gray-400'}
                  ${subAreaIndex === index ? 'ring-2 ring-white/50 scale-105' : 'opacity-70 hover:opacity-100'}
                `}
                style={{
                  background: getGradientBackground(areaColor, subPercentage),
                  minHeight: '90px'
                }}
              >
                {/* Nombre de la subárea */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5">
                  <span
                    className={`text-[10px] font-bold ${darkMode ? 'text-white' : 'text-white'}`}
                    style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.7)'
                    }}
                  >
                    {subName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN INFERIOR: ÁREA COMPLETA - MÁS GRANDE Y MÁS ABAJO */}
      <div className={`border rounded-lg p-6 ${darkMode ? 'border-white/20 bg-white/5' : 'border-gray-300 bg-white'}`} style={{ marginTop: '200px' }}>

        {/* Título - MÁS GRANDE */}
        <h3 className={`text-lg font-bold uppercase mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          ÁREA COMPLETA
        </h3>

        {/* Header: Área + Diagnóstico - MÁS GRANDE */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-sm font-semibold ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>ÁREA:</span>
            <span className="text-base font-bold uppercase" style={{ color: areaColor }}>{areaName}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-sm font-semibold ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>DIAGNÓSTICO:</span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold uppercase"
              style={{
                background: getGradientBackground(areaColor, percentage),
                color: '#fff'
              }}
            >
              <span className="text-base">{LEVEL_ICONS[level.key]}</span>
              <span>{level.label} {percentage.toFixed(0)}%</span>
            </span>
          </div>
        </div>

        {/* Separador */}
        <div
          className="h-1 w-full rounded-full mb-4"
          style={{
            background: `linear-gradient(to right, ${areaColor}, transparent)`
          }}
        ></div>

        {/* Sección: DEFINICIÓN (solo si hay contenido disponible) - MÁS GRANDE */}
        {contenidoDisponible && (
          <div className="mb-3">
            <h4 className={`text-sm font-bold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-base">📖</span>
              <span>DEFINICIÓN:</span>
            </h4>
            <div className={`border rounded-lg p-3 shadow-sm ${
              darkMode
                ? 'border-white/20 bg-white/5'
                : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white'
            }`}>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                {contenidoArea!.subAreas[subAreaIndex].definicion}
              </p>
            </div>
          </div>
        )}

        {/* Sección: QUE SE OBSERVA - MÁS GRANDE */}
        <div className="mb-3">
          <h4 className={`text-sm font-bold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-base">🔍</span>
            <span>QUÉ SE OBSERVA:</span>
          </h4>
          <div className={`border rounded-lg p-3 min-h-[80px] shadow-sm hover:shadow-md transition-shadow duration-200 ${
            darkMode
              ? 'border-white/20 bg-white/5'
              : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white'
          }`}>
            {contenido ? (
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                {contenido.queSeObserva}
              </p>
            ) : (
              <ul className={`list-none space-y-1.5 text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                <li className="flex gap-2 items-start">
                  <span className="text-red-600 flex-shrink-0 text-sm">🔻</span>
                  <span>Falta de claridad en la {subAreaName.toLowerCase()}</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-red-600 flex-shrink-0 text-sm">🔻</span>
                  <span>Necesidad de alineación estratégica</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-red-600 flex-shrink-0 text-sm">🔻</span>
                  <span>Comunicación insuficiente</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Sección: CÓMO INTERPRETARLO (solo si hay contenido disponible) - MÁS GRANDE */}
        {contenido && (
          <div className="mb-3">
            <h4 className={`text-sm font-bold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-base">💭</span>
              <span>CÓMO INTERPRETARLO:</span>
            </h4>
            <div className={`border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 ${
              darkMode
                ? 'border-white/20 bg-white/5'
                : 'border-gray-300 bg-gradient-to-br from-purple-50 to-white'
            }`}>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                {contenido.comoInterpretarlo}
              </p>
            </div>
          </div>
        )}

        {/* Sección: CÓMO TE ACOMPAÑA INTEGRATE (solo si hay contenido disponible) - MÁS GRANDE */}
        {contenido && (
          <div className="mb-3">
            <h4 className={`text-sm font-bold mb-2 flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-base">🤝</span>
              <span>CÓMO TE ACOMPAÑA INTEGRATE:</span>
            </h4>
            <div className={`border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200 ${
              darkMode
                ? 'border-white/20 bg-white/5'
                : 'border-gray-300 bg-gradient-to-br from-green-50 to-white'
            }`}>
              <p className={`text-[10px] leading-relaxed ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                {contenido.comoTeAcompanaIntegrate}
              </p>
            </div>
          </div>
        )}

        {/* Sección: OPORTUNIDADES DE MEJORA */}
        <div>
          <h4 className={`text-[10px] font-bold mb-1.5 flex items-center gap-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-xs">💡</span>
            <span>OPORTUNIDADES DE MEJORA:</span>
          </h4>
          <div className={`border rounded-lg p-2 min-h-[60px] shadow-sm hover:shadow-md transition-shadow duration-200 ${
            darkMode
              ? 'border-white/20 bg-white/5'
              : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white'
          }`}>
            {contenido ? (
              <ul className={`list-none space-y-1 text-[10px] ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                {contenido.oportunidadesDeMejora.map((oportunidad, index) => (
                  <li key={index} className="flex gap-1.5 items-start">
                    <span className="flex-shrink-0 text-xs" style={{ color: areaColor }}>▸</span>
                    <span className="leading-relaxed">{oportunidad}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={`space-y-1 text-[10px] ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                <p className="flex gap-1.5 items-start">
                  <span className="flex-shrink-0">•</span>
                  <span>Definir y comunicar claramente la {subAreaName.toLowerCase()}</span>
                </p>
                <p className="flex gap-1.5 items-start">
                  <span className="flex-shrink-0">•</span>
                  <span>Establecer métricas de seguimiento</span>
                </p>
                <p className="flex gap-1.5 items-start">
                  <span className="flex-shrink-0">•</span>
                  <span>Capacitar al equipo en la implementación</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente separado que muestra ÁREA COMPLETA o SUB-ÁREA según el estado
export function AreaCompletaPanel({
  areaIndex,
  subAreaIndex,
  answers,
  darkMode = false,
  onSubAreaClick,
  onBack
}: VistaEspecificaPanelProps & { onSubAreaClick?: (subAreaIndex: number) => void }) {
  // Validación
  if (areaIndex === null) {
    return null;
  }

  // Determinar si es vista de área completa o sub-área
  const isAreaView = subAreaIndex === null;

  // Calcular valores según el tipo de vista
  let value: number;
  let percentage: number;
  let displayTitle: string;
  let displayName: string;

  if (isAreaView) {
    // Vista de área completa: calcular promedio del área
    const startIndex = areaIndex * 4;
    const areaAnswers = answers.slice(startIndex, startIndex + 4);
    value = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;
    percentage = (value / 4) * 100;
    displayTitle = 'ÁREA COMPLETA';
    displayName = AREA_NAMES[areaIndex].replace('Área 1: ', '').replace('Área 2: ', '').replace('Área 3: ', '').replace('Área 4: ', '').replace('Área 5: ', '').replace('Área 6: ', '');
  } else {
    // Vista de sub-área
    const answerIndex = areaIndex * 4 + subAreaIndex!;
    value = answers[answerIndex];
    percentage = (value / 4) * 100;
    const subAreaName = SUB_AREA_NAMES_BY_AREA[areaIndex][subAreaIndex!];
    displayTitle = `SUB ÁREA ${subAreaName.toUpperCase()}`;
    displayName = AREA_NAMES[areaIndex].replace('Área 1: ', '').replace('Área 2: ', '').replace('Área 3: ', '').replace('Área 4: ', '').replace('Área 5: ', '').replace('Área 6: ', '');
  }

  const level = getLevel(percentage);
  const areaColor = AREA_COLORS[areaIndex];

  // Obtener contenido interpretativo
  const getContenidoArea = () => {
    if (areaIndex === 0) return CONTENIDO_ESTRATEGIA;
    if (areaIndex === 1) return CONTENIDO_ESTRUCTURA;
    if (areaIndex === 2) return CONTENIDO_RESULTADOS;
    if (areaIndex === 3) return CONTENIDO_EFICACIA;
    if (areaIndex === 4) return CONTENIDO_RECURSOS;
    if (areaIndex === 5) return CONTENIDO_PERSONAS;
    return null;
  };

  const contenidoArea = getContenidoArea();
  const contenidoDisponible = !isAreaView && contenidoArea && subAreaIndex !== null && contenidoArea.subAreas[subAreaIndex];
  const nivelKey = getNivelKey(value);
  const contenido = contenidoDisponible ? contenidoArea.subAreas[subAreaIndex!].niveles[nivelKey] : null;

  // Contenido de nivel de área (para vista de área completa)
  // Solo disponible si el área tiene la propiedad 'niveles' definida
  const contenidoAreaNivel = isAreaView && contenidoArea && contenidoArea.niveles ? contenidoArea.niveles[nivelKey] : null;

  return (
    <div className={`border rounded-lg p-6 mb-0 ${darkMode ? 'border-white/20 bg-white/5' : 'border-gray-300 bg-white'}`} style={{ marginTop: '30px' }}>
      {/* Header con título y botón volver/cerrar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {displayTitle}
        </h3>
        {onBack && (
          <button
            onClick={onBack}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            {isAreaView ? 'CERRAR' : 'VOLVER'}
          </button>
        )}
      </div>

      {/* Header Superior: Diferente según vista */}
      {isAreaView ? (
        // VISTA DE ÁREA COMPLETA: Grid completo con desglose
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[auto_auto_auto_1fr] gap-6 mb-4 items-start">
            {/* Columna 1: ÁREA + DIAGNÓSTICO */}
            <div className="space-y-2.5 min-w-[140px]">
              {/* ÁREA */}
              <div>
                <div className="mb-0">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-white' : 'text-gray-600'}`}>ÁREA:</span>
                </div>
                <span className="text-base font-bold uppercase block" style={{ color: areaColor }}>{displayName}</span>
              </div>

              {/* DIAGNÓSTICO */}
              <div>
                <div className="mb-0">
                  <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-white' : 'text-gray-600'}`}>DIAGNÓSTICO:</span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-2xl font-bold uppercase"
                  style={{ color: areaColor }}
                >
                  {level.label} {percentage.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Columna 2: DESGLOSE POR SUB ÁREAS */}
            <div className="min-w-[240px]">
              <h4 className={`text-xs font-semibold uppercase mb-3 ${darkMode ? 'text-white' : 'text-gray-600'}`}>
                DESGLOSE POR SUB ÁREAS
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[0, 1, 2, 3].map((index) => {
                  const subAnswerIndex = areaIndex * 4 + index;
                  const subValue = answers[subAnswerIndex];
                  const subPercentage = (subValue / 4) * 100;
                  const subName = SUB_AREA_NAMES_BY_AREA[areaIndex][index];

                  const content = (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-sm flex-shrink-0 border-2 ${darkMode ? 'border-white/40' : 'border-gray-400'}`}
                        style={{ background: getGradientBackground(areaColor, subPercentage) }}
                      ></div>
                      <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                        {subName}
                      </span>
                    </div>
                  );

                  // Hacer clickeable si hay callback
                  if (onSubAreaClick) {
                    return (
                      <button
                        key={index}
                        onClick={() => onSubAreaClick(index)}
                        className="text-left hover:bg-white/10 p-1 rounded transition-colors"
                      >
                        {content}
                      </button>
                    );
                  }

                  return <div key={index}>{content}</div>;
                })}
              </div>
            </div>

            {/* Línea vertical separadora */}
            <div className={`w-px self-stretch ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`}></div>

            {/* Columna 3: VISIÓN GENERAL */}
            <div className="flex-1">
              <h4 className={`text-xs font-semibold uppercase mb-3 ${darkMode ? 'text-white' : 'text-gray-600'}`}>
                VISIÓN GENERAL:
              </h4>
              <p className={`text-base leading-relaxed ${darkMode ? 'text-white' : 'text-gray-600'}`}>
                El área de {displayName} presenta un nivel {level.label.toLowerCase()} con un {percentage.toFixed(0)}% de cumplimiento promedio. Esta área es fundamental para conectar propósito, dirección y decisiones, generando sentido compartido y resultados tangibles.
              </p>
            </div>
          </div>
          {/* Separador */}
          <div className={`h-px w-full mb-5 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
        </>
      ) : (
        // VISTA DE SUB-ÁREA: Header simplificado
        <>
          <div className="mb-4 space-y-3">
            {/* ÁREA */}
            <div>
              <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>ÁREA:</span>
              <div className="mt-1">
                <span className="text-base font-bold uppercase" style={{ color: areaColor }}>{displayName}</span>
              </div>
            </div>

            {/* DIAGNÓSTICO */}
            <div>
              <span className={`text-xs font-semibold uppercase ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>DIAGNÓSTICO:</span>
              <div className="mt-1">
                <span
                  className="text-2xl font-bold uppercase"
                  style={{ color: areaColor }}
                >
                  {level.label} {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          {/* Separador */}
          <div className={`h-px w-full mb-5 ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
        </>
      )}

      {/* Tres Columnas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1 */}
        <div>
          <h4 className={`text-sm font-bold mb-2.5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-base" style={{ color: areaColor }}>
              {isAreaView ? '🎯' : '👁️'}
            </span>
            <span style={{ color: areaColor }}>
              {isAreaView ? 'PROPÓSITO DEL ÁREA:' : 'QUÉ SE OBSERVA'}
            </span>
          </h4>
          {isAreaView ? (
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {contenidoAreaNivel?.propositoArea || contenidoArea?.proposito || ''}
            </p>
          ) : contenidoDisponible ? (
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {contenido?.queSeObserva || contenidoArea.subAreas[subAreaIndex!].definicion}
            </p>
          ) : null}
        </div>

        {/* Columna 2 */}
        <div>
          <h4 className={`text-sm font-bold mb-2.5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-base" style={{ color: areaColor }}>
              {isAreaView ? '⚡' : '📖'}
            </span>
            <span style={{ color: areaColor }}>
              {isAreaView ? 'PRÓXIMOS PASOS RECOMENDADOS:' : 'CÓMO INTERPRETARLO'}
            </span>
          </h4>
          {isAreaView ? (
            <ul className="space-y-1.5">
              {(contenidoAreaNivel?.proximosPasos || []).map((paso, idx) => (
                <li key={idx} className={`text-sm flex items-start gap-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  <span className="text-xs mt-1">•</span>
                  <span className="flex-1 leading-relaxed">{paso}</span>
                </li>
              ))}
            </ul>
          ) : contenido && contenido.oportunidades && contenido.oportunidades.length > 0 ? (
            <ul className="space-y-1.5">
              {contenido.oportunidades.map((oportunidad, idx) => (
                <li key={idx} className={`text-sm flex items-start gap-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  <span className="text-xs mt-1">•</span>
                  <span className="flex-1 leading-relaxed">{oportunidad}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-500'}`}>
              No hay recomendaciones disponibles para este nivel.
            </p>
          )}
        </div>

        {/* Columna 3 */}
        <div>
          <h4 className={`text-sm font-bold mb-2.5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-base" style={{ color: areaColor }}>
              {isAreaView ? '🎓' : '🤝'}
            </span>
            <span style={{ color: areaColor }}>
              {isAreaView ? 'RUTA FORMATIVA ASOCIADA:' : 'CÓMO TE ACOMPAÑA INTEGRATE'}
            </span>
          </h4>
          {isAreaView ? (
            <div className={`p-4 rounded-lg border-2 ${darkMode ? 'bg-white/5 border-white/20' : 'bg-gray-50 border-gray-300'}`}>
              <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {contenidoArea?.rutaFormativa || ''}
              </p>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
                {contenidoAreaNivel?.rutaFormativaDescripcion || ''}
              </p>
            </div>
          ) : contenido && contenido.interpretacion ? (
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              {contenido.interpretacion}
            </p>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-500'}`}>
              INTEGRATE impulsa la gestión del conocimiento como eje de coherencia entre experiencia, innovación y resultados.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
