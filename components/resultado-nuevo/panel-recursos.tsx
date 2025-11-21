"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_COLORS } from "@/lib/constants";

interface PanelRecursosProps {
  answers: AnswerValue[];
  selectedArea: number | null;
  selectedSubArea: number | null;
}

// Función para calcular el promedio de un área (4 sub-áreas)
const getAreaAverage = (answers: AnswerValue[], areaIndex: number): number => {
  const startIndex = areaIndex * 4;
  const areaAnswers = answers.slice(startIndex, startIndex + 4);
  const sum = areaAnswers.reduce((acc, val) => acc + val, 0);
  return sum / 4;
};

// Función para obtener el color según el porcentaje
const getGradientForPercentage = (percentage: number, baseColor: string): string => {
  const opacity = Math.max(0.3, percentage / 100);
  return `linear-gradient(135deg, ${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${baseColor}${Math.round(opacity * 0.6 * 255).toString(16).padStart(2, '0')} 100%)`;
};

export function PanelRecursos({ answers, selectedArea, selectedSubArea }: PanelRecursosProps) {
  // Definir las categorías de recursos
  const recursos = [
    {
      id: 'comp-global',
      label: 'COMP. GLOBAL',
      description: '',
      areas: [0, 1, 2, 3, 4, 5], // Todas las áreas
      gradient: 'linear-gradient(180deg, rgba(44, 36, 142, 0.1) 0%, rgba(44, 36, 142, 0.4) 100%)',
    },
    {
      id: 'costos',
      label: 'COSTOS',
      description: '',
      areas: [4], // Recursos
      gradient: 'linear-gradient(180deg, rgba(240, 135, 38, 0.1) 0%, rgba(240, 135, 38, 0.6) 100%)',
    },
    {
      id: 'financieros',
      label: 'FINANCIEROS',
      description: '',
      areas: [4], // Recursos
      gradient: 'linear-gradient(180deg, rgba(240, 135, 38, 0.3) 0%, rgba(240, 135, 38, 0.8) 100%)',
    },
    {
      id: 'inversion',
      label: 'INVERSIÓN',
      description: '',
      areas: [0, 2], // Estrategia y Orientación
      gradient: 'linear-gradient(180deg, rgba(142, 35, 93, 0.1) 0%, rgba(142, 35, 93, 0.4) 100%)',
    },
  ];

  // Calcular el valor para cada recurso
  const getRecursoValue = (recurso: typeof recursos[0]): number => {
    const relevantAreas = recurso.areas;
    const values = relevantAreas.map(areaIndex => getAreaAverage(answers, areaIndex));
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">RECURSOS</h2>
      </div>

      {/* Grid de 2x2 para las tarjetas de recursos */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {recursos.map((recurso) => {
          const value = getRecursoValue(recurso);
          const percentage = (value / 4) * 100;

          return (
            <div
              key={recurso.id}
              className="relative overflow-hidden rounded-lg border border-white/10 transition-all duration-300 hover:border-white/20 cursor-pointer"
              style={{
                background: recurso.gradient,
                minHeight: '180px',
              }}
            >
              {/* Contenido */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {recurso.label}
                  </h3>

                  {/* Valor grande */}
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-white">
                      {value.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

