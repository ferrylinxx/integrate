"use client";

import { useMemo } from "react";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

interface EnhancedProgressBarProps {
  answers: (AnswerValue | null)[];
}

// Colores INTEGRATE para cada área
const AREA_COLORS = [
  '#2C248E', // Área 1 - Morado primario
  '#8E235D', // Área 2 - Magenta
  '#E65B3E', // Área 3 - Naranja rojizo
  '#F08726', // Área 4 - Naranja
  '#D91D5C', // Área 5 - Rosa
  '#412761', // Área 6 - Morado oscuro
];

export function EnhancedProgressBar({ answers }: EnhancedProgressBarProps) {
  // Calcular progreso total
  const totalProgress = useMemo(() => {
    const answeredCount = answers.filter(a => a !== null).length;
    return (answeredCount / answers.length) * 100;
  }, [answers]);

  // Calcular progreso por área
  const areaProgress = useMemo(() => {
    return AREA_NAMES.map((_, areaIndex) => {
      const startIndex = areaIndex * 4;
      const areaAnswers = answers.slice(startIndex, startIndex + 4);
      const answeredCount = areaAnswers.filter(a => a !== null).length;
      return {
        completed: answeredCount === 4,
        count: answeredCount,
        total: 4,
        color: AREA_COLORS[areaIndex],
      };
    });
  }, [answers]);

  const answeredCount = useMemo(() =>
    answers.filter(a => a !== null).length,
    [answers]
  );

  return (
    <div className="space-y-3 md:space-y-5">
      {/* Barra de progreso principal - Versión móvil compacta */}
      <div className="space-y-2 md:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h3
              className="text-sm md:text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #E65B3E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Progreso
            </h3>
            <span className="text-[10px] md:text-sm text-gray-600 font-medium">
              {answeredCount}/{answers.length}
            </span>
          </div>
          <span
            className="text-xl md:text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #E65B3E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {Math.round(totalProgress)}%
          </span>
        </div>

        {/* Barra de progreso con gradiente */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 md:h-5 overflow-hidden shadow-inner">
            <div
              className="h-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{
                width: `${totalProgress}%`,
                background: 'linear-gradient(90deg, #2C248E 0%, #412761 16%, #8E235D 33%, #E65B3E 50%, #F08726 66%, #D91D5C 83%, #2C248E 100%)',
                backgroundSize: '200% 100%',
                animation: totalProgress > 0 ? 'shimmer 3s linear infinite' : 'none'
              }}
            >
              {/* Efecto de brillo */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                  animation: 'slide 2s linear infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mini indicadores por área - Optimizado para móvil */}
      <div className="grid grid-cols-6 gap-2 md:gap-2">
        {areaProgress.map((area, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="relative">
              {area.completed ? (
                <div
                  className="w-7 h-7 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                  style={{ background: area.color }}
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              ) : (
                <div className="relative">
                  <div
                    className="w-7 h-7 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center transition-all group-hover:scale-110"
                    style={{
                      borderColor: area.count > 0 ? area.color : '#d1d5db',
                      borderWidth: '2px'
                    }}
                  >
                    {area.count > 0 && (
                      <span
                        className="text-[10px] md:text-xs font-bold"
                        style={{ color: area.color }}
                      >
                        {area.count}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[9px] md:text-[10px] font-semibold text-gray-700 text-center">
              A{index + 1}
            </span>
            <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(area.count / area.total) * 100}%`,
                  background: area.completed ? '#10b981' : area.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje motivacional - Compacto en móvil */}
      {totalProgress === 100 ? (
        <div
          className="border-2 rounded-lg md:rounded-xl p-2 md:p-4 text-center shadow-lg animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            borderColor: '#10b981'
          }}
        >
          <p className="text-xs md:text-base font-bold text-green-700 flex items-center justify-center gap-1 md:gap-2">
            <Sparkles className="h-3 w-3 md:h-5 md:w-5" />
            <span>¡Completado!</span>
            <Sparkles className="h-3 w-3 md:h-5 md:w-5" />
          </p>
        </div>
      ) : totalProgress >= 50 ? (
        <div
          className="border-2 rounded-lg md:rounded-xl p-2 md:p-4 text-center shadow-md"
          style={{
            background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.1) 0%, rgba(142, 35, 93, 0.05) 100%)',
            borderColor: '#8E235D'
          }}
        >
          <p
            className="text-xs md:text-base font-bold"
            style={{ color: '#8E235D' }}
          >
            💪 ¡Vas muy bien!
          </p>
        </div>
      ) : totalProgress > 0 ? (
        <div
          className="border-2 rounded-lg md:rounded-xl p-2 md:p-4 text-center shadow-md"
          style={{
            background: 'linear-gradient(135deg, rgba(240, 135, 38, 0.1) 0%, rgba(230, 91, 62, 0.05) 100%)',
            borderColor: '#F08726'
          }}
        >
          <p
            className="text-xs md:text-base font-bold"
            style={{ color: '#E65B3E' }}
          >
            🚀 ¡Buen comienzo!
          </p>
        </div>
      ) : null}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

