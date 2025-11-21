"use client";

import { useEffect, useRef, useState, ForwardedRef } from "react";
import { FacePosition, Cube3DRef } from "./cube-3d";
import { AREA_FEEDBACK } from "./results-insights";
import { AREA_COLORS } from "@/lib/constants";
import { AnswerValue } from "@/lib/types";

// Información de las áreas INTEGRATE
const AREA_INFO = [
  { name: "Estrategia", shortName: "EST", icon: "📊" },
  { name: "Estructura", shortName: "ETC", icon: "🏗️" },
  { name: "Orientación", shortName: "ORI", icon: "🎯" },
  { name: "Eficacia", shortName: "EFI", icon: "⚡" },
  { name: "Recursos", shortName: "REC", icon: "💰" },
  { name: "Personas", shortName: "PER", icon: "👥" },
];

interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  visible: boolean;
  areaIndex: number;
  average: number;
  areaName: string;
  areaShortName: string;
  areaIcon: string;
  feedback: {
    title: string;
    message: string;
    actions: string[];
  };
}

interface ConnectorLinesProps {
  cubeContainerRef: React.RefObject<HTMLDivElement | null>;
  cube3DRef: ForwardedRef<Cube3DRef>;
  answers: AnswerValue[];
  selectedAreaIndex: number | null;
  onAreaClick?: (areaIndex: number) => void;
}

export function CubeConnectorLines({ cubeContainerRef, cube3DRef, answers, selectedAreaIndex, onAreaClick }: ConnectorLinesProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [lines, setLines] = useState<LineData[]>([]);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateLines = () => {
      if (!cubeContainerRef.current) return;

      // Manejar ForwardedRef
      const cube3D = typeof cube3DRef === 'function' ? null : cube3DRef?.current;
      if (!cube3D) return;

      const cubeContainer = cubeContainerRef.current;

      // Obtener el contenedor relativo (el div con className="relative")
      const relativeContainer = cubeContainer.closest('.relative');
      if (!relativeContainer) return;

      const containerRect = relativeContainer.getBoundingClientRect();
      const cubeRect = cubeContainer.getBoundingClientRect();

      // Obtener las posiciones de las caras del cubo 3D
      const facePositions = cube3D.getFacePositions();
      if (!facePositions || facePositions.length === 0) return;

      // Obtener las leyendas de áreas (columna izquierda)
      const areaLegends = document.querySelectorAll('[data-area-legend]');

      const newLines: LineData[] = [];

      areaLegends.forEach((legend, index) => {
        const legendRect = legend.getBoundingClientRect();
        const facePos = facePositions[index];

        if (!facePos) return;

        // Calcular promedio del área
        const startIndex = index * 4;
        const areaAnswers = answers.slice(startIndex, startIndex + 4);
        const average = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;

        // Determinar rango de puntuación
        let scoreRange: "low" | "medium" | "good";
        if (average < 2.0) {
          scoreRange = "low";
        } else if (average < 3.0) {
          scoreRange = "medium";
        } else {
          scoreRange = "good";
        }

        // Obtener feedback personalizado
        const feedback = AREA_FEEDBACK[index][scoreRange];

        // COORDENADAS RELATIVAS AL CONTENEDOR (para position: absolute)
        // Restar la posición del contenedor relativo para obtener coordenadas relativas
        const x1 = cubeRect.left - containerRect.left + facePos.x;
        const y1 = cubeRect.top - containerRect.top + facePos.y;

        const x2 = legendRect.right - containerRect.left + 5;
        const y2 = legendRect.top - containerRect.top + legendRect.height / 2;

        const color = AREA_COLORS[index] || "#CCCCCC";
        const areaInfo = AREA_INFO[index];

        newLines.push({
          x1,
          y1,
          x2,
          y2,
          color,
          visible: facePos.visible,
          areaIndex: index,
          average,
          areaName: areaInfo.name,
          areaShortName: areaInfo.shortName,
          areaIcon: areaInfo.icon,
          feedback
        });
      });

      setLines(newLines);
    };

    // Actualizar líneas al montar y cuando cambie el tamaño de la ventana
    updateLines();
    window.addEventListener('resize', updateLines);

    // Actualizar cada 50ms para mantener las líneas sincronizadas
    const interval = setInterval(updateLines, 50);

    return () => {
      window.removeEventListener('resize', updateLines);
      clearInterval(interval);
    };
  }, [cubeContainerRef, cube3DRef, answers]);

  return (
    <>
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          {/* Gradiente para las líneas */}
          {lines.map((line, index) => (
            <linearGradient key={`gradient-${index}`} id={`line-gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={line.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={line.color} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>

        {lines.map((line, index) => {
          // Solo mostrar líneas de caras visibles
          if (!line.visible) return null;

          const isHovered = hoveredLineIndex === index;

          return (
            <g key={index}>
              {/* Línea con sombra (efecto de profundidad) */}
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#000000"
                strokeWidth={isHovered ? 5 : 3}
                strokeOpacity={0.1}
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Línea principal con gradiente - RESALTADA AL HOVER */}
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={`url(#line-gradient-${index})`}
                strokeWidth={isHovered ? 4 : 2}
                strokeLinecap="round"
                className="transition-all duration-300"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${line.color})` : 'none'
                }}
              />

              {/* Punto en la cara del cubo - MÁS GRANDE Y VISIBLE CON ANIMACIÓN */}
              <circle
                cx={line.x1}
                cy={line.y1}
                r={isHovered ? 10 : 8}
                fill={line.color}
                fillOpacity={1}
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.3))"
                className="transition-all duration-300"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 12px ${line.color})` : 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))'
                }}
              />
              {/* Anillo exterior para mayor visibilidad - PULSA AL HOVER */}
              <circle
                cx={line.x1}
                cy={line.y1}
                r={isHovered ? 14 : 11}
                fill="none"
                stroke={line.color}
                strokeWidth={isHovered ? 3 : 2}
                strokeOpacity={isHovered ? 0.8 : 0.5}
                className="transition-all duration-300"
              />

              {/* Punto en la leyenda - MÁS GRANDE CON ANIMACIÓN */}
              <circle
                cx={line.x2}
                cy={line.y2}
                r={isHovered ? 8 : 6}
                fill={line.color}
                fillOpacity={1}
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                className="transition-all duration-300"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 10px ${line.color})` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Etiquetas en las caras del cubo */}
      {lines.map((line, index) => {
        if (!line.visible) return null;

        const isHovered = hoveredLineIndex === index;

        return (
          <div
            key={`label-${index}`}
            className="absolute pointer-events-none z-15"
            style={{
              left: `${line.x1}px`,
              top: `${line.x1 < line.x2 ? line.y1 - 35 : line.y1 + 25}px`,
              transform: 'translate(-50%, 0)',
            }}
          >
            <div
              className={`px-2 py-1 rounded-lg flex items-center gap-1.5 transition-all duration-300 ${
                isHovered ? 'scale-110 shadow-xl' : 'shadow-md'
              }`}
              style={{
                backgroundColor: line.color,
                opacity: isHovered ? 1 : 0.9,
                boxShadow: isHovered ? `0 0 20px ${line.color}` : '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <span className="text-base">{line.areaIcon}</span>
              <span className="text-white text-xs font-bold tracking-wide">
                {line.areaShortName}
              </span>
            </div>
          </div>
        );
      })}

      {/* Información contextual flotante */}
      {lines.map((line, index) => {
        const isHovered = hoveredLineIndex === index;
        const isSelected = selectedAreaIndex === line.areaIndex;
        const showPanel = isHovered || isSelected;

        // Log para depuración cuando hay un área seleccionada
        if (isSelected) {
          console.log(`📍 Area ${line.areaIndex} (${line.areaName}) - visible: ${line.visible}, showPanel: ${showPanel}`);
        }

        // Solo mostrar indicador de caras visibles, PERO mostrar panel si está seleccionado
        if (!line.visible && !isSelected) return null;

        // Calcular posición del tooltip (punto medio de la línea)
        const tooltipX = (line.x1 + line.x2) / 2;
        const tooltipY = (line.y1 + line.y2) / 2;

        return (
          <div
            key={`tooltip-${index}`}
            className="absolute pointer-events-auto z-20 group"
            style={{
              left: `${tooltipX}px`,
              top: `${tooltipY}px`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredLineIndex(index)}
            onMouseLeave={() => setHoveredLineIndex(null)}
            onClick={() => onAreaClick?.(line.areaIndex)}
          >
            {/* Indicador de información - MÁS GRANDE Y VISIBLE */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                showPanel ? 'scale-125 shadow-2xl' : 'hover:scale-110 hover:shadow-xl'
              }`}
              style={{
                backgroundColor: line.color,
                boxShadow: showPanel ? `0 0 24px ${line.color}` : '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-white text-sm font-bold">
                {line.average.toFixed(1)}
              </span>
            </div>

            {/* Tooltip con información detallada (aparece al hacer hover o al seleccionar) */}
            <div
              className={`absolute left-1/2 top-full mt-3 -translate-x-1/2 w-96 bg-white rounded-2xl shadow-2xl p-5 transition-all duration-300 border-2 ${
                showPanel ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              style={{ borderColor: line.color }}
            >
              {/* NUEVO: Icono + Nombre del Área (DESTACADO) */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b-2" style={{ borderColor: line.color }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: line.color }}
                >
                  <span className="text-2xl">{line.areaIcon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold" style={{ color: line.color }}>
                    {line.areaName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Área {line.areaIndex + 1} - INTEGRATE 2.0
                  </p>
                </div>
              </div>

              {/* Promedio del Área */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Promedio del área:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: line.color }}>
                      {line.average.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">/ 4.0</span>
                  </div>
                </div>
              </div>

              {/* Título del Feedback */}
              <div className="mb-3">
                <h4 className="font-bold text-base" style={{ color: line.color }}>
                  {line.feedback.title}
                </h4>
              </div>

              {/* Mensaje */}
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {line.feedback.message}
              </p>

              {/* Acciones recomendadas */}
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  Acciones recomendadas:
                </p>
                {line.feedback.actions.slice(0, 2).map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: line.color }}
                    />
                    <p className="text-sm text-gray-700 leading-relaxed flex-1">
                      {action}
                    </p>
                  </div>
                ))}
              </div>

              {/* Flecha del tooltip */}
              <div
                className="absolute left-1/2 bottom-full -translate-x-1/2 w-0 h-0 border-[10px] border-transparent"
                style={{ borderBottomColor: line.color }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

