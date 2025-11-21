"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const TUTORIAL_STEPS = [
  {
    title: "¡Bienvenido al Cubo 3D INTEGRATE!",
    description: "Este cubo interactivo visualiza tus resultados en las 6 áreas de competencia del modelo INTEGRATE 2.0.",
    icon: "🎯",
    tips: [
      "Cada cara del cubo representa un área diferente",
      "Los colores indican el nivel de desempeño",
      "Puedes interactuar con el cubo de múltiples formas"
    ]
  },
  {
    title: "Cómo Rotar el Cubo",
    description: "Explora todas las caras del cubo para ver tus resultados completos.",
    icon: "🔄",
    tips: [
      "Arrastra con el mouse para rotar el cubo",
      "Usa la rueda del mouse para hacer zoom",
      "El cubo rota automáticamente (puedes pausarlo)"
    ]
  },
  {
    title: "Información Detallada",
    description: "Pasa el mouse sobre cualquier cara para ver información detallada.",
    icon: "💡",
    tips: [
      "Verás el nombre del área",
      "El promedio de puntuación de esa área",
      "Los valores individuales de las 4 capas"
    ]
  },
  {
    title: "Interpretación de Colores",
    description: "Los colores te ayudan a identificar rápidamente tu nivel de desempeño.",
    icon: "🎨",
    tips: [
      "🔴 Rojo (1): Requiere atención inmediata",
      "🟠 Naranja (2): Necesita mejora",
      "🟡 Amarillo (3): Buen desempeño",
      "🟢 Verde (4): Excelente desempeño"
    ]
  },
  {
    title: "Herramientas Disponibles",
    description: "Aprovecha todas las funcionalidades para analizar tus resultados.",
    icon: "🛠️",
    tips: [
      "Botón de Pausa/Play para controlar la rotación",
      "Botón de Información (ℹ️) para ver la leyenda completa",
      "Botón de Exportar para guardar una imagen del cubo",
      "Vista 2D alternativa para ver todas las áreas a la vez"
    ]
  }
];

export function CubeTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Verificar si es la primera vez que el usuario ve el cubo
    const hasSeenTutorial = localStorage.getItem("cube-tutorial-seen");
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("cube-tutorial-seen", "true");
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <>
      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black/70 z-[100] backdrop-blur-sm" />

      {/* Modal del tutorial */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <div className="text-6xl mb-4">{step.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-blue-100">{step.description}</p>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-8">
            <div className="space-y-4">
              {step.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm flex-1">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
            {/* Indicador de progreso */}
            <div className="flex justify-center gap-2 mb-6">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-8 bg-blue-600"
                      : index < currentStep
                      ? "w-2 bg-blue-400"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <div className="text-sm text-gray-600 font-medium">
                {currentStep + 1} de {TUTORIAL_STEPS.length}
              </div>

              <Button
                onClick={handleNext}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLastStep ? (
                  <>
                    <Check className="h-4 w-4" />
                    ¡Entendido!
                  </>
                ) : (
                  <>
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Botón de saltar */}
            {!isLastStep && (
              <div className="text-center mt-4">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Saltar tutorial
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

