"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_NAMES, AREA_COLORS, getGradientBackground, AREA_ICONS, LEVEL_ICONS, SUB_AREA_NAMES_BY_AREA } from "@/lib/constants";
import { CircularProgress } from "@/components/circular-progress";
import { Tooltip } from "@/components/tooltip";
import { CONTENIDO_ESTRATEGIA, CONTENIDO_ESTRUCTURA, CONTENIDO_RESULTADOS, CONTENIDO_EFICACIA, CONTENIDO_RECURSOS, CONTENIDO_PERSONAS, getNivelKey } from "@/lib/contenido-interpretativo";

interface VistaGlobalPanelProps {
  areaIndex: number;
  answers: AnswerValue[];
}

const getLevel = (percentage: number): { label: string; color: string; key: 'critico' | 'desarrollo' | 'solido' | 'ejemplar' } => {
  if (percentage < 25) return { label: 'CRÍTICO', color: '#DC2626', key: 'critico' };
  if (percentage < 50) return { label: 'DESARROLLO', color: '#F59E0B', key: 'desarrollo' };
  if (percentage < 75) return { label: 'SÓLIDO', color: '#10B981', key: 'solido' };
  return { label: 'EJEMPLAR', color: '#3B82F6', key: 'ejemplar' };
};

export function VistaGlobalPanel({ areaIndex, answers }: VistaGlobalPanelProps) {
  // Calcular promedio del área
  const startIndex = areaIndex * 4;
  const areaAnswers = answers.slice(startIndex, startIndex + 4);
  const average = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;
  const percentage = (average / 4) * 100;
  const level = getLevel(percentage);
  const areaName = AREA_NAMES[areaIndex].replace('Área 1: ', '').replace('Área 2: ', '').replace('Área 3: ', '').replace('Área 4: ', '').replace('Área 5: ', '').replace('Área 6: ', '');

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
  const contenidoDisponible = contenidoArea !== null;

  return (
    <div>
      {/* Título con icono */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-3xl">{AREA_ICONS[areaIndex as keyof typeof AREA_ICONS]}</span>
        <h3 className="text-base font-bold text-gray-900 uppercase">
          ÁREA COMPLETA
        </h3>
      </div>

      {/* Sección superior: Cubo isométrico + Progreso circular */}
      <div className="flex gap-4 mb-4">
        {/* Cubo isométrico mejorado con gradientes */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
            <defs>
              {/* Gradiente para cara frontal */}
              <linearGradient id={`grad-front-${areaIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={areaColor} stopOpacity="1" />
                <stop offset="100%" stopColor={areaColor} stopOpacity="0.8" />
              </linearGradient>

              {/* Gradiente para cara derecha */}
              <linearGradient id={`grad-right-${areaIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={areaColor} stopOpacity="0.7" />
                <stop offset="100%" stopColor={areaColor} stopOpacity="0.5" />
              </linearGradient>
            </defs>

            {/* Cara frontal con gradiente */}
            <polygon
              points="50,30 85,50 50,70 15,50"
              fill={`url(#grad-front-${areaIndex})`}
              stroke="#000"
              strokeWidth="2"
            />
            {/* Cara derecha con gradiente */}
            <polygon
              points="50,30 85,50 85,85 50,65"
              fill={`url(#grad-right-${areaIndex})`}
              stroke="#000"
              strokeWidth="2"
            />
            {/* Cara izquierda */}
            <polygon
              points="50,30 15,50 15,85 50,65"
              fill={areaColor}
              fillOpacity="0.5"
              stroke="#000"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Progreso circular */}
        <div className="flex-shrink-0">
          <Tooltip
            content={
              <div>
                <div className="font-bold mb-1">Diagnóstico del Área</div>
                <div className="space-y-1 text-xs">
                  <div>• Promedio: {average.toFixed(2)} / 4.0</div>
                  <div>• Nivel: {level.label}</div>
                  <div>• Porcentaje: {percentage.toFixed(1)}%</div>
                </div>
              </div>
            }
          >
            <div className="cursor-help">
              <CircularProgress
                percentage={percentage}
                color={areaColor}
                size={80}
                strokeWidth={8}
                showLabel={true}
              />
            </div>
          </Tooltip>
        </div>

        {/* Información */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-gray-600">ÁREA:</span>
            <span className="text-sm font-bold text-gray-900 uppercase">{areaName}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-gray-600">DIAGNÓSTICO:</span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold uppercase shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{
                background: getGradientBackground(areaColor, percentage),
                color: '#fff',
                boxShadow: `0 4px 6px -1px ${areaColor}40`
              }}
            >
              <span className="text-lg">{LEVEL_ICONS[level.key]}</span>
              <span>{level.label}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div
        className="h-1 w-full rounded-full my-4"
        style={{
          background: `linear-gradient(to right, ${areaColor}, transparent)`
        }}
      ></div>

      {/* Sección: PROPÓSITO DEL ÁREA (solo si hay contenido disponible) */}
      {contenidoDisponible && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🎯</span>
            <span>PROPÓSITO DEL ÁREA:</span>
          </h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {contenidoArea!.proposito}
            </p>
          </div>
        </div>
      )}

      {/* Sección: VISIÓN GENERAL DEL ÁREA */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>🔍</span>
          <span>VISIÓN GENERAL:</span>
        </h4>
        <div className="border border-gray-300 rounded-lg p-4 min-h-[60px] bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            El área de <strong>{areaName}</strong> presenta un nivel <strong>{level.label.toLowerCase()}</strong> con un <strong>{percentage.toFixed(1)}%</strong> de cumplimiento promedio.
            {contenidoDisponible && (
              <span> Esta área es fundamental para conectar propósito, dirección y decisiones, generando sentido compartido y resultados tangibles.</span>
            )}
          </p>
        </div>
      </div>

      {/* Sección: DESGLOSE POR SUB-ÁREAS */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>📊</span>
          <span>DESGLOSE POR SUB-ÁREAS:</span>
        </h4>
        <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white shadow-sm">
          <div className="space-y-3">
            {areaAnswers.map((value, index) => {
              const subAreaPercentage = (value / 4) * 100;
              const subAreaLevel = getLevel(subAreaPercentage);
              const subAreaName = SUB_AREA_NAMES_BY_AREA[areaIndex][index];

              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{subAreaName}</span>
                      <span className="text-xs font-bold" style={{ color: areaColor }}>
                        {subAreaPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${subAreaPercentage}%`,
                          background: getGradientBackground(areaColor, subAreaPercentage)
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm">{LEVEL_ICONS[subAreaLevel.key]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sección: RUTA FORMATIVA (solo si hay contenido disponible) */}
      {contenidoDisponible && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>🗺️</span>
            <span>RUTA FORMATIVA ASOCIADA:</span>
          </h4>
          <div className="border border-gray-300 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="font-bold" style={{ color: areaColor }}>{contenidoArea!.rutaFormativa}</strong>
              <br />
              <span className="text-xs text-gray-600 italic mt-1 block">
                Esta ruta formativa te acompañará en el fortalecimiento de las capacidades de tu organización en esta área.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Sección: PRÓXIMOS PASOS RECOMENDADOS */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span>💡</span>
          <span>PRÓXIMOS PASOS RECOMENDADOS:</span>
        </h4>
        <div className="border border-gray-300 rounded-lg p-4 min-h-[60px] bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <ul className="list-none space-y-2 text-sm text-gray-700">
            <li className="flex gap-2 items-start">
              <span className="flex-shrink-0" style={{ color: areaColor }}>▸</span>
              <span>Revisar en detalle cada sub-área usando la Vista Específica</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="flex-shrink-0" style={{ color: areaColor }}>▸</span>
              <span>Priorizar las sub-áreas con menor puntuación para intervención inmediata</span>
            </li>
            <li className="flex gap-2 items-start">
              <span className="flex-shrink-0" style={{ color: areaColor }}>▸</span>
              <span>Explorar las oportunidades de mejora específicas de cada sub-área</span>
            </li>
            {contenidoDisponible && (
              <li className="flex gap-2 items-start">
                <span className="flex-shrink-0" style={{ color: areaColor }}>▸</span>
                <span>Considerar la ruta formativa &quot;{contenidoArea!.rutaFormativa}&quot; para un acompañamiento estructurado</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

