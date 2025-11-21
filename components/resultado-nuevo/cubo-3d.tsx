"use client";

import { AnswerValue } from "@/lib/types";
import { AREA_COLORS, AREA_NAMES } from "@/lib/constants";
import { useEditableStyles } from "@/lib/editor/hooks";
import { EditorWrapper } from "@/components/editor";

interface Cubo3DProps {
  answers: AnswerValue[];
  selectedMember: string | null;
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

export function Cubo3D({ answers, selectedMember }: Cubo3DProps) {
  const styles = useEditableStyles('components.cubo3D');

  // Calcular promedios por área (0-4)
  const areaAverages = AREA_NAMES.map((_, areaIndex) => {
    // Filtrar respuestas del área actual
    const areaAnswers = answers.filter(a => a.areaIndex === areaIndex);
    
    // Si hay un miembro seleccionado, filtrar solo sus respuestas
    const filteredAnswers = selectedMember
      ? areaAnswers.filter(a => a.memberName === selectedMember)
      : areaAnswers;

    if (filteredAnswers.length === 0) return 0;

    // Calcular promedio
    const sum = filteredAnswers.reduce((acc, a) => acc + a.value, 0);
    return sum / filteredAnswers.length;
  });

  // Función para obtener el gradiente de una cara basado en el promedio del área
  const getFaceGradient = (areaIndex: number, baseColor: string): string => {
    const average = areaAverages[areaIndex];
    const percentage = (average / 4) * 100; // Convertir a porcentaje (0-100)
    const opacity = Math.max(0.3, percentage / 100);
    return `linear-gradient(135deg, ${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${baseColor}${Math.round(opacity * 0.6 * 255).toString(16).padStart(2, '0')} 100%)`;
  };

  return (
    <EditorWrapper
      componentId="cubo3D"
      path="components.cubo3D.layout"
      enableDrag={true}
      enableResize={true}
      initialPosition={{ x: 600, y: 200 }}
      initialSize={{ width: styles.size || 280, height: styles.size || 280 }}
      minWidth={200}
      minHeight={200}
      maxWidth={500}
      maxHeight={500}
    >
      <div className="relative flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
        <div
          className="relative"
          style={{
            perspective: `${styles.perspective || 1200}px`,
            pointerEvents: 'none',
          }}
        >
          <div
            className="relative animate-spin-slow"
            style={{
              width: `${styles.size || 280}px`,
              height: `${styles.size || 280}px`,
              transformStyle: 'preserve-3d',
              animation: `rotateCube ${styles.animationSpeed || 20}s infinite linear`,
              pointerEvents: 'none',
            }}
          >
            {/* Cara frontal - ESTRUCTURA (área 1, índice 1) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: getFaceGradient(1, '#F08726'),
                transform: `translateZ(${(styles.size || 280) / 2}px)`,
                opacity: styles.faceOpacity || 0.95,
                border: `${styles.borderWidth || '0.5px'} solid rgba(255,255,255,0.2)`,
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              <span
                className="text-white text-lg"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300,
                  opacity: 0.7,
                }}
              >
                ESTRUCTURA
              </span>
            </div>

            {/* Cara trasera - PERSONAS (área 5, índice 5) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: getFaceGradient(5, '#3B82F6'),
                transform: `translateZ(-${(styles.size || 280) / 2}px) rotateY(180deg)`,
                opacity: styles.faceOpacity || 0.95,
                border: `${styles.borderWidth || '0.5px'} solid rgba(255,255,255,0.2)`,
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              <span
                className="text-white text-lg"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300,
                  opacity: 0.7,
                }}
              >
                PERSONAS
              </span>
            </div>

            {/* Cara superior - ESTRATEGIA (área 0, índice 0) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: getFaceGradient(0, '#E65B3E'),
                transform: `rotateX(90deg) translateZ(${(styles.size || 280) / 2}px)`,
                opacity: styles.faceOpacity || 0.95,
                border: `${styles.borderWidth || '0.5px'} solid rgba(255,255,255,0.2)`,
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              <span
                className="text-white text-lg"
                style={{
                  transform: 'rotateX(0deg)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300,
                  opacity: 0.7,
                }}
              >
                ESTRATEGIA
              </span>
            </div>

            {/* Cara inferior - EFICACIA (área 3, índice 3) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: getFaceGradient(3, '#10B981'),
                transform: `rotateX(-90deg) translateZ(${(styles.size || 280) / 2}px)`,
                opacity: styles.faceOpacity || 0.95,
                border: `${styles.borderWidth || '0.5px'} solid rgba(255,255,255,0.2)`,
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              <span
                className="text-white text-lg"
                style={{
                  transform: 'rotateX(0deg)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300,
                  opacity: 0.7,
                }}
              >
                EFICACIA
              </span>
            </div>

            {/* Cara derecha - ORIENTACIÓN (área 2, índice 2) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: getFaceGradient(2, '#8E235D'),
                transform: `rotateY(90deg) translateZ(${(styles.size || 280) / 2}px)`,
                opacity: styles.faceOpacity || 0.95,
                border: `${styles.borderWidth || '0.5px'} solid rgba(255,255,255,0.2)`,
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              <span
                className="text-white text-lg"
                style={{
                  transform: 'rotateY(0deg)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300,
                  opacity: 0.7,
                }}
              >
                ORIENTACIÓN
              </span>
            </div>

            {/* Cara izquierda - RECURSOS (área 4, índice 4) */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: getFaceGradient(4, '#F59E0B'),
                transform: `rotateY(-90deg) translateZ(${(styles.size || 280) / 2}px)`,
                opacity: styles.faceOpacity || 0.95,
                border: `${styles.borderWidth || '0.5px'} solid rgba(255,255,255,0.2)`,
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}
            >
              <span
                className="text-white text-lg"
                style={{
                  transform: 'rotateY(0deg)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 300,
                  opacity: 0.7,
                }}
              >
                RECURSOS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para la animación */}
      <style jsx>{`
        @keyframes rotateCube {
          0% {
            transform: rotateX(-20deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(-20deg) rotateY(360deg);
          }
        }
      `}</style>
    </EditorWrapper>
  );
}

