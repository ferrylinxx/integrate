"use client";

import { User } from "lucide-react";
import { AnswerValue } from "@/lib/types";
import { AREA_COLORS, AREA_NAMES } from "@/lib/constants";
import { useEditable, useEditableStyles } from "@/lib/editor/hooks";
import { EditableText } from "@/components/editor/EditableText";
import { EditorWrapper } from "@/components/editor"; // ➕ NUEVO: Para drag & drop de elementos internos
import { useEditorStore } from "@/lib/editor/store"; // ➕ NUEVO: Para detectar modo editor

interface MapaDeSituacionProps {
  answers: AnswerValue[];
  selectedArea: number | null;
  selectedSubArea: number | null;
  onAreaClick: (areaIndex: number) => void;
  onSubAreaClick: (subAreaIndex: number) => void;
  groupMembers?: string[]; // Nombres de los miembros del equipo
  selectedMember: string | null; // Miembro seleccionado (null = EQUIPO completo)
  onMemberChange: (member: string | null) => void;
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

// Función para obtener gradiente basado en porcentaje
const getGradientBackground = (baseColor: string, percentage: number): string => {
  const opacity = Math.max(0.3, percentage / 100);
  return `linear-gradient(135deg, ${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, ${baseColor}${Math.round(opacity * 0.6 * 255).toString(16).padStart(2, '0')} 100%)`;
};

export function MapaDeSituacion({
  answers,
  selectedArea,
  selectedSubArea,
  onAreaClick,
  onSubAreaClick,
  groupMembers = [],
  selectedMember,
  onMemberChange,
}: MapaDeSituacionProps) {
  // ==========================================
  // HOOKS DEL EDITOR
  // ==========================================
  const { isEditorActive, isSelected, editableProps } = useEditable('mapaDeSituacion');
  const styles = useEditableStyles('mapaDeSituacion');

  // Calcular niveles por sub-área (24 sub-áreas)
  const subAreaLevels = answers.map(value => getLevel(value));

  return (
    <div
      className="h-full flex flex-col"
      style={{ padding: styles.layout?.padding || '32px' }}
      {...editableProps}
    >
      {/* Header con título */}
      <div className="mb-4 relative">
        {/* Título movible con drag & drop */}
        <EditorWrapper
          componentId="mapaDeSituacion.title"
          path="components.mapaDeSituacion.title.layout"
          enableDrag={true}
          enableResize={false}
          initialPosition={{ x: 0, y: 0 }}
        >
          <EditableText
            value={styles.title?.content || 'MAPA DE SITUACIÓN'}
            path="components.mapaDeSituacion.title.content"
            as="h2"
            className="mb-1"
            style={{
              fontFamily: styles.title?.fontFamily || 'Poppins, sans-serif',
              fontSize: styles.title?.fontSize || '20px',
              fontWeight: styles.title?.fontWeight || 600,
              color: styles.title?.color || '#FFFFFF',
              opacity: styles.title?.opacity || 1,
              letterSpacing: styles.title?.letterSpacing || '0.5px',
              lineHeight: styles.title?.lineHeight || '1.2',
              textAlign: styles.title?.textAlign || 'left',
              textTransform: styles.title?.textTransform || 'uppercase',
            }}
          />
        </EditorWrapper>

        {/* Subtítulo movible con drag & drop */}
        <EditorWrapper
          componentId="mapaDeSituacion.subtitle"
          path="components.mapaDeSituacion.subtitle.layout"
          enableDrag={true}
          enableResize={false}
          initialPosition={{ x: 0, y: 30 }}
        >
          <EditableText
            value={styles.subtitle?.content || 'DE LAS 6 ÁREAS DE LA ORGANIZACIÓN'}
            path="components.mapaDeSituacion.subtitle.content"
            as="p"
            style={{
              fontFamily: styles.subtitle?.fontFamily || 'Poppins, sans-serif',
              fontSize: styles.subtitle?.fontSize || '14px',
              fontWeight: styles.subtitle?.fontWeight || 300,
              color: styles.subtitle?.color || '#FFFFFF',
              opacity: styles.subtitle?.opacity || 0.7,
              lineHeight: styles.subtitle?.lineHeight || '1.4',
              textAlign: styles.subtitle?.textAlign || 'left',
              textTransform: styles.subtitle?.textTransform || 'uppercase',
            }}
          />
        </EditorWrapper>
      </div>

      {/* Botones de selección: EQUIPO + Personas */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {/* Botón EQUIPO - MOVIBLE CON DRAG & DROP */}
        <EditorWrapper
          componentId="mapaDeSituacion.equipoButton"
          path="components.mapaDeSituacion.equipoButton.layout"
          enableDrag={true}
          enableResize={false}
          initialPosition={{ x: 0, y: 0 }}
        >
          <button
            onClick={() => onMemberChange(null)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all ${
              selectedMember === null
                ? 'text-white shadow-lg'
                : 'text-white/70 hover:bg-white/10'
            }`}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600, // SemiBold
              // Efecto Glass cuando está activo
              background: selectedMember === null
                ? 'linear-gradient(-45deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)'
                : 'transparent',
              border: '0.5px solid transparent',
              backgroundImage: selectedMember === null
                ? 'linear-gradient(-45deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%), linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)'
                : 'linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: selectedMember === null ? 'padding-box, border-box' : 'border-box',
            }}
          >
            <User className="w-4 h-4" />
            EQUIPO
          </button>
        </EditorWrapper>

        {/* Botones de personas - CADA UNO MOVIBLE CON DRAG & DROP */}
        {groupMembers.map((member, index) => (
          <EditorWrapper
            key={index}
            componentId={`mapaDeSituacion.memberButton.${index}`}
            path={`components.mapaDeSituacion.memberButtons.${index}.layout`}
            enableDrag={true}
            enableResize={false}
            initialPosition={{ x: 100 + (index * 120), y: 0 }} // Espaciados horizontalmente
          >
            <button
              onClick={() => onMemberChange(member)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all ${
                selectedMember === member
                  ? 'text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10'
              }`}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600, // SemiBold
                // Efecto Glass cuando está activo
                background: selectedMember === member
                  ? 'linear-gradient(-45deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)'
                  : 'transparent',
                border: '0.5px solid transparent',
                backgroundImage: selectedMember === member
                  ? 'linear-gradient(-45deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%), linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)'
                  : 'linear-gradient(30deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: selectedMember === member ? 'padding-box, border-box' : 'border-box',
              }}
            >
              <User className="w-3 h-3" />
              {member}
            </button>
          </EditorWrapper>
        ))}
      </div>

      {/* Contenedor del cubo y leyenda */}
      <div className="flex-1 flex items-center gap-6 pl-4">
        {/* Leyenda de áreas a la izquierda - MOVIBLE CON DRAG & DROP */}
        <EditorWrapper
          componentId="mapaDeSituacion.legend"
          path="components.mapaDeSituacion.legend.layout"
          enableDrag={true}
          enableResize={false}
          initialPosition={{ x: 0, y: 0 }}
        >
          <div className="flex flex-col gap-3">
            {AREA_NAMES.map((areaName, index) => {
              const rgb = hexToRgb(AREA_COLORS[index]);
              return (
                <button
                  key={index}
                  onClick={() => onAreaClick(index)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    selectedArea === index
                      ? 'bg-white/10 scale-105'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Bola de color con gradiente -90deg */}
                  <div
                    className="w-3 h-3 rounded-full transition-transform duration-300 hover:scale-110"
                    style={{
                      background: `linear-gradient(-90deg, rgba(${rgb.r},${rgb.g},${rgb.b},0.5) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},1) 86%)`,
                    }}
                  />
                  <span
                    className="text-xs text-white/80 whitespace-nowrap"
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600, // SemiBold
                      fontSize: '11px',
                    }}
                  >
                    {areaName}
                  </span>
                </button>
              );
            })}
          </div>
        </EditorWrapper>
      </div>
    </div>
  );
}