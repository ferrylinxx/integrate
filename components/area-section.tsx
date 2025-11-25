"use client";

import { memo } from "react";
import { AreaData, AnswerValue } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface AreaSectionProps {
  area: AreaData;
  answers: (AnswerValue | null)[];
  onAnswerChange: (questionIndex: number, value: AnswerValue) => void;
}

// Colores INTEGRATE por área
const AREA_COLORS = [
  { primary: '#2C248E', secondary: '#412761', gradient: 'linear-gradient(135deg, #2C248E 0%, #412761 100%)' }, // Área 1
  { primary: '#8E235D', secondary: '#D91D5C', gradient: 'linear-gradient(135deg, #8E235D 0%, #D91D5C 100%)' }, // Área 2
  { primary: '#E65B3E', secondary: '#F08726', gradient: 'linear-gradient(135deg, #E65B3E 0%, #F08726 100%)' }, // Área 3
  { primary: '#F08726', secondary: '#E65B3E', gradient: 'linear-gradient(135deg, #F08726 0%, #E65B3E 100%)' }, // Área 4
  { primary: '#D91D5C', secondary: '#8E235D', gradient: 'linear-gradient(135deg, #D91D5C 0%, #8E235D 100%)' }, // Área 5
  { primary: '#412761', secondary: '#2C248E', gradient: 'linear-gradient(135deg, #412761 0%, #2C248E 100%)' }, // Área 6
];

export const AreaSection = memo(function AreaSection({ area, answers, onAnswerChange }: AreaSectionProps) {
  const startIndex = (area.areaNumber - 1) * 4;
  const areaAnswers = answers.slice(startIndex, startIndex + 4);
  const completedCount = areaAnswers.filter(a => a !== null).length;
  const isComplete = completedCount === 4;
  const areaColor = AREA_COLORS[(area.areaNumber - 1) % AREA_COLORS.length];

  return (
    <Card
      className={`transition-all duration-300 border-2 ${
        isComplete
          ? 'bg-green-50/50 shadow-lg'
          : 'hover:shadow-md'
      }`}
      style={{
        borderColor: isComplete ? '#10b981' : areaColor.primary,
      }}
    >
      <CardHeader className="pb-2 md:pb-4 pt-3 md:pt-6">
        <div className="flex items-center justify-between gap-2">
          <CardTitle
            className="flex items-center gap-1.5 md:gap-2 text-sm md:text-lg"
            style={{
              color: isComplete ? '#10b981' : areaColor.primary
            }}
          >
            <span className="font-bold">Área {area.areaNumber}:</span>
            <span className="hidden sm:inline">{area.areaName}</span>
            <span className="sm:hidden text-xs">{area.areaName}</span>
            {isComplete && (
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500 animate-bounce" />
            )}
          </CardTitle>
          <span
            className="text-xs md:text-base font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shrink-0"
            style={{
              background: isComplete ? '#10b981' : areaColor.gradient,
              color: 'white'
            }}
          >
            {completedCount}/4
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 pb-4 md:pb-6">
        {area.questions.map((question, qIndex) => {
          const globalIndex = startIndex + qIndex;
          const currentValue = answers[globalIndex];

          return (
            <div key={qIndex} className="space-y-2 md:space-y-3">
              <Label className="text-xs md:text-base font-semibold flex items-start gap-1.5 md:gap-2 leading-relaxed">
                <span
                  className="font-bold shrink-0 mt-0.5"
                  style={{ color: areaColor.primary }}
                >
                  P{qIndex + 1}.
                </span>
                <span className="text-gray-800">{question.label}</span>
              </Label>

              {/* Opciones de respuesta - Optimizadas para móvil */}
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {([1, 2, 3, 4] as AnswerValue[]).map((value) => (
                  <label
                    key={value}
                    className={`
                      flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 cursor-pointer
                      px-2 py-3 md:px-4 md:py-2.5 rounded-lg md:rounded-xl border-2
                      transition-all duration-200 transform active:scale-95
                      ${currentValue === value
                        ? 'shadow-lg scale-105'
                        : 'hover:scale-102'
                      }
                    `}
                    style={{
                      borderColor: currentValue === value ? areaColor.primary : '#e5e7eb',
                      background: currentValue === value
                        ? `${areaColor.primary}15`
                        : 'white',
                      minHeight: '56px', // Área táctil óptima para móvil
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${globalIndex}`}
                      value={value}
                      checked={currentValue === value}
                      onChange={() => onAnswerChange(globalIndex, value)}
                      className="sr-only"
                    />
                    <div
                      className={`
                        w-5 h-5 md:w-4 md:h-4 rounded-full border-2
                        flex items-center justify-center transition-all
                      `}
                      style={{
                        borderColor: currentValue === value ? areaColor.primary : '#9ca3af',
                        background: currentValue === value ? areaColor.gradient : 'transparent'
                      }}
                    >
                      {currentValue === value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span
                      className="text-sm md:text-sm font-bold"
                      style={{
                        color: currentValue === value ? areaColor.primary : '#6b7280'
                      }}
                    >
                      {value}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

