"use client";

import { X, Lightbulb, Target, Rocket } from "lucide-react";
import { AREA_COLORS, AREA_NAMES, SUB_AREA_NAMES } from "@/lib/constants";
import { AnswerValue } from "@/lib/types";
import { useEditable, useEditableStyles } from "@/lib/editor/hooks";
import { EditableText } from "@/components/editor/EditableText";

interface PanelInferiorProps {
  subAreaIndex: number | null;
  areaIndex: number | null;
  value: number;
  answers: AnswerValue[];
  onClose: () => void;
}

// Función para convertir HEX a RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Función para calcular el nivel según el valor individual (0-4)
const getLevel = (value: number): 'critico' | 'desarrollo' | 'solido' | 'ejemplar' => {
  const percentage = (value / 4) * 100;
  if (percentage < 25) return 'critico';
  if (percentage < 50) return 'desarrollo';
  if (percentage < 75) return 'solido';
  return 'ejemplar';
};

// Función para obtener el gradiente del separador desplegable (4 paradas)
const getSeparadorGradient = (areaColor: string): string => {
  const rgb = hexToRgb(areaColor);
  const { r, g, b } = rgb;

  // Ubicación 0%: #FFFFFF opacidad 75%
  // Ubicación 39%: (color cara) opacidad 75%
  // Ubicación 73%: #FFFFFF opacidad 90%
  // Ubicación 100%: (color cara) opacidad 100%
  return `linear-gradient(90deg,
    rgba(255,255,255,0.75) 0%,
    rgba(${r},${g},${b},0.75) 39%,
    rgba(255,255,255,0.9) 73%,
    rgba(${r},${g},${b},1) 100%
  )`;
};

// Función para calcular el promedio de un área (4 sub-áreas)
const getAreaAverage = (answers: AnswerValue[], areaIndex: number): number => {
  const startIndex = areaIndex * 4;
  const areaAnswers = answers.slice(startIndex, startIndex + 4);
  const sum = areaAnswers.reduce((acc, val) => acc + val, 0);
  return sum / 4;
};

// Función para obtener el nombre del nivel en español
const getLevelName = (level: string): string => {
  switch (level) {
    case 'critico': return 'CRÍTICO';
    case 'desarrollo': return 'DESARROLLO';
    case 'solido': return 'SÓLIDO';
    case 'ejemplar': return 'EJEMPLAR';
    default: return 'DESCONOCIDO';
  }
};

// Función para obtener el color según el nivel
const getLevelColor = (level: string): string => {
  switch (level) {
    case 'critico': return '#DC2626';
    case 'desarrollo': return '#F59E0B';
    case 'solido': return '#10B981';
    case 'ejemplar': return '#3B82F6';
    default: return '#374151';
  }
};

export function PanelInferior({ subAreaIndex, areaIndex, value, answers, onClose }: PanelInferiorProps) {
  // ==========================================
  // HOOKS DEL EDITOR
  // ==========================================
  const { isEditorActive, isSelected, editableProps } = useEditable('panelInferior');
  const styles = useEditableStyles('panelInferior');

  // Determinar si es vista de área completa o sub-área
  const isAreaView = subAreaIndex === null && areaIndex !== null;

  let displayAreaIndex: number;
  let displayValue: number;
  let displayName: string;
  let displayTitle: string;

  if (isAreaView && areaIndex !== null) {
    // Vista de área completa
    displayAreaIndex = areaIndex;
    displayValue = getAreaAverage(answers, areaIndex);
    displayName = AREA_NAMES[areaIndex] || `Área ${areaIndex + 1}`;
    displayTitle = 'ÁREA COMPLETA';
  } else if (subAreaIndex !== null) {
    // Vista de sub-área
    displayAreaIndex = Math.floor(subAreaIndex / 4);
    displayValue = value;
    displayName = SUB_AREA_NAMES[subAreaIndex] || `Sub-área ${subAreaIndex + 1}`;
    displayTitle = `SUB ÁREA ${displayName.toUpperCase()}`;
  } else {
    return null;
  }

  const areaColor = AREA_COLORS[displayAreaIndex];
  const level = getLevel(displayValue);
  const levelName = getLevelName(level);
  const levelColor = getLevelColor(level);
  const percentage = (displayValue / 4) * 100;

  // Contenido específico según el nivel y tipo de vista
  const getContentByLevel = () => {
    if (isAreaView) {
      // Contenido para vista de área completa
      return {
        desglose: [
          { name: 'Logística', value: 2.5 },
          { name: 'Comunicación', value: 3.0 },
          { name: 'Tecnología', value: 2.8 },
        ],
        visionGeneral: `El área de ${displayName} presenta un nivel ${levelName.toLowerCase()} con un ${percentage.toFixed(0)}% de cumplimiento promedio. Esta área es fundamental para conectar propósito, dirección y decisiones, generando sentido compartido y resultados tangibles.`,
        proposito: `Optimizar el uso de herramientas, tiempo y conocimiento para potenciar la autonomía, la colaboración y la sostenibilidad del sistema organizativo.`,
        proximosPasos: [
          'Revisar en detalle cada sub-área usando la Vista Específica',
          'Priorizar las sub-áreas con menor puntuación para mejoras',
          'Explorar las oportunidades de mejora específicas de cada sub-área',
          'Considerar la ruta formativa "Activa tu Sistema Operativo" para un acompañamiento estructurado',
        ],
        rutaFormativa: 'Activa tu Sistema Operativo',
      };
    } else {
      // Contenido para vista de sub-área
      switch (level) {
        case 'critico':
          return {
            queSeObserva: 'Optimizar el uso de herramientas, tiempo y conocimiento para potenciar la autonomía, la colaboración y la sostenibilidad del sistema organizativo.',
            comoInterpretarlo: [
              'Revisar en detalle cada sub-área usando la Vista Específica',
              'Priorizar las sub-áreas con menor puntuación para mejoras',
              'Explorar las oportunidades de mejora específicas de cada sub-área',
              'Considerar la ruta formativa "Activa tu Sistema Operativo" para un acompañamiento estructurado',
            ],
            comoTeAcompana: 'INTEGRATE impulsa la gestión del conocimiento como eje de coherencia entre experiencia, innovación y resultados.',
          };
        case 'desarrollo':
          return {
            queSeObserva: 'Optimizar el uso de herramientas, tiempo y conocimiento para potenciar la autonomía, la colaboración y la sostenibilidad del sistema organizativo.',
            comoInterpretarlo: [
              'Revisar en detalle cada sub-área usando la Vista Específica',
              'Priorizar las sub-áreas con menor puntuación para mejoras',
              'Explorar las oportunidades de mejora específicas de cada sub-área',
              'Considerar la ruta formativa "Activa tu Sistema Operativo" para un acompañamiento estructurado',
            ],
            comoTeAcompana: 'INTEGRATE impulsa la gestión del conocimiento como eje de coherencia entre experiencia, innovación y resultados.',
          };
        case 'solido':
          return {
            queSeObserva: 'Optimizar el uso de herramientas, tiempo y conocimiento para potenciar la autonomía, la colaboración y la sostenibilidad del sistema organizativo.',
            comoInterpretarlo: [
              'Revisar en detalle cada sub-área usando la Vista Específica',
              'Priorizar las sub-áreas con menor puntuación para mejoras',
              'Explorar las oportunidades de mejora específicas de cada sub-área',
              'Considerar la ruta formativa "Activa tu Sistema Operativo" para un acompañamiento estructurado',
            ],
            comoTeAcompana: 'INTEGRATE impulsa la gestión del conocimiento como eje de coherencia entre experiencia, innovación y resultados.',
          };
        case 'ejemplar':
          return {
            queSeObserva: 'Optimizar el uso de herramientas, tiempo y conocimiento para potenciar la autonomía, la colaboración y la sostenibilidad del sistema organizativo.',
            comoInterpretarlo: [
              'Mantener y consolidar las mejores prácticas identificadas',
              'Compartir el conocimiento con otras áreas de la organización',
              'Explorar oportunidades de innovación continua',
              'Considerar la ruta formativa "Activa tu Sistema Operativo" para un acompañamiento estructurado',
            ],
            comoTeAcompana: 'INTEGRATE impulsa la gestión del conocimiento como eje de coherencia entre experiencia, innovación y resultados.',
          };
      }
    }
  };

  const content = getContentByLevel();

  return (
    <div
      className="bg-[#0a0a1a] animate-in slide-in-from-bottom duration-300"
      {...editableProps}
    >
      {/* Separador desplegable con gradiente de 4 paradas */}
      <div
        className="h-1"
        style={{
          background: getSeparadorGradient(areaColor),
        }}
      />

      <div style={{ padding: styles.layout?.padding || '32px' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2
                className="text-xl text-white"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600, // SemiBold
                }}
              >
                {displayTitle}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="text-sm text-white/70"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600, // SemiBold
                }}
              >
                ÁREA:
              </span>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: areaColor }}
                />
                <span
                  className="text-sm"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600, // SemiBold
                    color: areaColor,
                  }}
                >
                  {AREA_NAMES[displayAreaIndex]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Diagnóstico */}
        <div className="mb-8 flex items-center gap-4">
          <span
            className="text-sm text-white/70"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600, // SemiBold
            }}
          >
            DIAGNÓSTICO:
          </span>
        <span
          className="text-lg font-bold px-4 py-1 rounded"
          style={{ backgroundColor: levelColor, color: 'white' }}
        >
          {levelName} {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Contenido según el tipo de vista */}
      {isAreaView && 'desglose' in content ? (
        // Vista de área completa
        <div className="grid grid-cols-3 gap-8">
          {/* Columna 1: Desglose por sub-áreas */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-[#F08726]" />
              <h4 className="text-sm font-bold text-white">DESGLOSE POR SUB ÁREAS</h4>
            </div>
            <div className="space-y-3">
              {content.desglose.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F08726]" />
                    <span className="text-sm text-white/70">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Columna 2: Visión general */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#F08726]" />
              <h4 className="text-sm font-bold text-white">VISIÓN GENERAL:</h4>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              {content.visionGeneral}
            </p>
            <div className="mt-6">
              <h5 className="text-xs font-bold text-[#F08726] mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                PROPÓSITO DEL ÁREA:
              </h5>
              <p className="text-sm text-white/70 leading-relaxed">
                {content.proposito}
              </p>
            </div>
          </div>

          {/* Columna 3: Próximos pasos y ruta formativa */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-[#F08726]" />
              <h4 className="text-sm font-bold text-white">PRÓXIMOS PASOS RECOMENDADOS:</h4>
            </div>
            <ul className="space-y-2 mb-6">
              {content.proximosPasos.map((paso, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#F08726] text-xs mt-0.5">•</span>
                  <span className="text-sm text-white/70 leading-relaxed">{paso}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-[#F08726]/10 rounded-lg border border-[#F08726]/20">
              <h5 className="text-xs font-bold text-[#F08726] mb-2 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                RUTA FORMATIVA ASOCIADA:
              </h5>
              <p className="text-sm text-white font-medium">{content.rutaFormativa}</p>
            </div>
          </div>
        </div>
      ) : 'queSeObserva' in content ? (
        // Vista de sub-área
        <div className="grid grid-cols-3 gap-8">
          {/* Columna 1: Qué se observa */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-[#F08726]" />
              <h4 className="text-sm font-bold text-white">QUÉ SE OBSERVA</h4>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {content.queSeObserva}
            </p>
          </div>

          {/* Columna 2: Cómo interpretarlo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#F08726]" />
              <h4 className="text-sm font-bold text-white">CÓMO INTERPRETARLO</h4>
            </div>
            <ul className="space-y-2">
              {content.comoInterpretarlo.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#F08726] text-xs mt-0.5">•</span>
                  <span className="text-sm text-white/70 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Cómo te acompaña INTEGRATE */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-5 h-5 text-[#F08726]" />
              <h4 className="text-sm font-bold text-white">CÓMO TE ACOMPAÑA INTEGRATE</h4>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {content.comoTeAcompana}
            </p>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}

