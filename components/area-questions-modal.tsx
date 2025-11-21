"use client";

import { useState, useEffect } from "react";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES, SUB_AREA_NAMES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

interface AreaQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaIndex: number;
  currentAnswers: (AnswerValue | null)[];
  onSave: (areaIndex: number, answers: (AnswerValue | null)[]) => void;
}

// Colores INTEGRATE por área
const AREA_COLORS = [
  { primary: '#2C248E', secondary: '#412761', gradient: 'linear-gradient(135deg, #2C248E 0%, #412761 100%)' },
  { primary: '#8E235D', secondary: '#D91D5C', gradient: 'linear-gradient(135deg, #8E235D 0%, #D91D5C 100%)' },
  { primary: '#E65B3E', secondary: '#F08726', gradient: 'linear-gradient(135deg, #E65B3E 0%, #F08726 100%)' },
  { primary: '#F08726', secondary: '#E65B3E', gradient: 'linear-gradient(135deg, #F08726 0%, #E65B3E 100%)' },
  { primary: '#D91D5C', secondary: '#8E235D', gradient: 'linear-gradient(135deg, #D91D5C 0%, #8E235D 100%)' },
  { primary: '#412761', secondary: '#2C248E', gradient: 'linear-gradient(135deg, #412761 0%, #2C248E 100%)' },
];

export function AreaQuestionsModal({
  open,
  onOpenChange,
  areaIndex,
  currentAnswers,
  onSave,
}: AreaQuestionsModalProps) {
  // Estado local para las respuestas del área actual
  const [localAnswers, setLocalAnswers] = useState<(AnswerValue | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  // Inicializar respuestas locales cuando se abre el modal
  useEffect(() => {
    if (open) {
      const startIndex = areaIndex * 4;
      const areaAnswers = currentAnswers.slice(startIndex, startIndex + 4);
      setLocalAnswers(areaAnswers);
    }
  }, [open, areaIndex, currentAnswers]);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    const newAnswers = [...localAnswers];
    newAnswers[questionIndex] = parseInt(value) as AnswerValue;
    setLocalAnswers(newAnswers);
  };

  const handleSave = () => {
    onSave(areaIndex, localAnswers);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const areaName = AREA_NAMES[areaIndex];
  const answeredCount = localAnswers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === 4;
  const areaColor = AREA_COLORS[areaIndex % AREA_COLORS.length];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader
          className="space-y-3 pb-4 border-b-2"
          style={{ borderBottomColor: areaColor.primary }}
        >
          <DialogTitle
            className="text-xl md:text-2xl font-bold flex items-center gap-2"
            style={{ color: areaColor.primary }}
          >
            <span>Área {areaIndex + 1}:</span>
            <span>{areaName}</span>
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base flex items-center justify-between">
            <span className="text-gray-600">Responde las 4 preguntas de esta área</span>
            <span
              className="font-bold text-base md:text-lg px-3 py-1 rounded-full text-white"
              style={{ background: areaColor.gradient }}
            >
              {answeredCount}/4
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 md:space-y-5 py-2">
          {[0, 1, 2, 3].map((questionIndex) => {
            const globalQuestionIndex = areaIndex * 4 + questionIndex;
            const questionLabel = SUB_AREA_NAMES[globalQuestionIndex];
            const currentValue = localAnswers[questionIndex];
            const isAnswered = currentValue !== null;

            return (
              <Card
                key={questionIndex}
                className={`transition-all duration-300 border-2 ${
                  isAnswered
                    ? "shadow-lg"
                    : "hover:shadow-md"
                }`}
                style={{
                  borderColor: isAnswered ? '#10b981' : '#e5e7eb',
                  background: isAnswered ? 'rgba(16, 185, 129, 0.05)' : 'white'
                }}
              >
                <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
                  <div className="flex items-start gap-2 md:gap-3 mb-4">
                    {isAnswered ? (
                      <div
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: '#10b981' }}
                      >
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      </div>
                    ) : (
                      <div
                        className="w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ borderColor: areaColor.primary }}
                      >
                        <span
                          className="text-xs md:text-sm font-bold"
                          style={{ color: areaColor.primary }}
                        >
                          {questionIndex + 1}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <Label className="text-sm md:text-base font-semibold text-gray-900 leading-relaxed">
                        {questionLabel}
                      </Label>
                    </div>
                  </div>

                  {/* Opciones de respuesta optimizadas para móvil */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3 ml-0 md:ml-9">
                    {([1, 2, 3, 4] as AnswerValue[]).map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group transform hover:scale-102 active:scale-95"
                        style={{
                          borderColor: currentValue === value ? areaColor.primary : '#e5e7eb',
                          background: currentValue === value ? `${areaColor.primary}15` : 'white',
                          minHeight: '52px' // Táctil optimizado
                        }}
                      >
                        <div
                          className="w-5 h-5 md:w-4 md:h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0"
                          style={{
                            borderColor: currentValue === value ? areaColor.primary : '#9ca3af',
                            background: currentValue === value ? areaColor.gradient : 'transparent'
                          }}
                        >
                          {currentValue === value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name={`question-${globalQuestionIndex}`}
                          value={value}
                          checked={currentValue === value}
                          onChange={() =>
                            handleAnswerChange(questionIndex, value.toString())
                          }
                          className="sr-only"
                        />
                        <span
                          className="flex-1 text-sm md:text-base font-bold"
                          style={{
                            color: currentValue === value ? areaColor.primary : '#6b7280'
                          }}
                        >
                          Nivel {value}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Mensaje de estado */}
        {allAnswered ? (
          <div
            className="border-2 rounded-xl p-3 md:p-4 mt-4 text-center shadow-md"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              borderColor: '#10b981'
            }}
          >
            <p className="text-sm md:text-base font-bold text-green-700 flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span>¡Perfecto! Todas las preguntas completadas</span>
            </p>
          </div>
        ) : (
          <div
            className="border-2 rounded-xl p-3 md:p-4 mt-4 text-center"
            style={{
              background: `${areaColor.primary}10`,
              borderColor: areaColor.primary
            }}
          >
            <p
              className="text-sm md:text-base font-bold"
              style={{ color: areaColor.primary }}
            >
              ⚠️ Completa las {4 - answeredCount} preguntas restantes para guardar
            </p>
          </div>
        )}

        <DialogFooter className="gap-2 md:gap-3 mt-4 md:mt-6 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={handleCancel}
            size="lg"
            className="w-full sm:w-auto sm:min-w-[120px] border-2"
            style={{
              borderColor: areaColor.primary,
              color: areaColor.primary,
              minHeight: '48px'
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!allAnswered}
            size="lg"
            className="w-full sm:w-auto sm:min-w-[200px] text-white font-bold disabled:opacity-50"
            style={{
              background: allAnswered ? areaColor.gradient : '#9ca3af',
              minHeight: '48px'
            }}
          >
            {allAnswered ? (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Guardar y continuar</span>
                <span className="sm:hidden">Guardar</span>
              </>
            ) : (
              <>
                Guardar ({answeredCount}/4)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

