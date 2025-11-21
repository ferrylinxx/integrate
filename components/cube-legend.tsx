"use client";

import { useState } from "react";
import { Info, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AREA_COLORS, VALUE_COLORS } from "@/lib/constants";

const AREA_INFO = [
  { name: "Estrategia", icon: "📊", color: AREA_COLORS[0], description: "Planificación y visión estratégica" },
  { name: "Estructura", icon: "🏗️", color: AREA_COLORS[1], description: "Organización y procesos" },
  { name: "Orientación", icon: "🎯", color: AREA_COLORS[2], description: "Enfoque y dirección" },
  { name: "Eficacia", icon: "⚡", color: AREA_COLORS[3], description: "Resultados y efectividad" },
  { name: "Recursos", icon: "💰", color: AREA_COLORS[4], description: "Gestión de recursos" },
  { name: "Personas", icon: "👥", color: AREA_COLORS[5], description: "Talento y equipo" },
];

const VALUE_INFO = [
  { value: 1, color: VALUE_COLORS[1], label: "Bajo", description: "Requiere atención inmediata" },
  { value: 2, color: VALUE_COLORS[2], label: "Medio-Bajo", description: "Necesita mejora" },
  { value: 3, color: VALUE_COLORS[3], label: "Medio-Alto", description: "Buen desempeño" },
  { value: 4, color: VALUE_COLORS[4], label: "Alto", description: "Excelente desempeño" },
];

export function CubeLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante para abrir/cerrar */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-2 border-white"
        title={isOpen ? "Cerrar leyenda" : "Abrir leyenda"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Info className="h-6 w-6 text-white" />
        )}
      </Button>

      {/* Panel de leyenda */}
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel lateral */}
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="h-6 w-6" />
                  <h2 className="text-xl font-bold">Guía del Cubo 3D</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Sección: Áreas INTEGRATE */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                  Áreas INTEGRATE 2.0
                </h3>
                <div className="space-y-3">
                  {AREA_INFO.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-10 h-10 rounded-lg shadow-md flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: area.color }}
                      >
                        <span className="text-xl">{area.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{area.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{area.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección: Escala de Valores */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                  Escala de Valores
                </h3>
                <div className="space-y-3">
                  {VALUE_INFO.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border-2 border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div
                        className="w-12 h-12 rounded-lg shadow-md flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.value}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección: Cómo Interpretar */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600" />
                  Cómo Interpretar el Cubo
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="font-semibold text-blue-900 mb-2">🎯 Cada cara representa un área</p>
                    <p className="text-xs">El cubo tiene 6 caras, una por cada área de competencia del modelo INTEGRATE 2.0.</p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <p className="font-semibold text-indigo-900 mb-2">📊 Grid 2×2 en cada cara</p>
                    <p className="text-xs">Cada cara tiene 4 celdas que representan las 4 capas o dimensiones de esa área.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <p className="font-semibold text-purple-900 mb-2">🎨 Colores indican nivel</p>
                    <p className="text-xs">El color de cada celda indica el nivel de desempeño: rojo (bajo) a verde (alto).</p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-200">
                    <p className="font-semibold text-pink-900 mb-2">🖱️ Interactúa con el cubo</p>
                    <p className="text-xs">Arrastra para rotar, usa la rueda para zoom, y pasa el mouse sobre las caras para ver detalles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

