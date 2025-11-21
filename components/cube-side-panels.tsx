"use client";

import { AREA_COLORS, VALUE_COLORS } from "@/lib/constants";

const AREA_INFO = [
  { name: "Estrategia", icon: "📊", color: AREA_COLORS[0] },
  { name: "Estructura", icon: "🏗️", color: AREA_COLORS[1] },
  { name: "Orientación", icon: "🎯", color: AREA_COLORS[2] },
  { name: "Eficacia", icon: "⚡", color: AREA_COLORS[3] },
  { name: "Recursos", icon: "💰", color: AREA_COLORS[4] },
  { name: "Personas", icon: "👥", color: AREA_COLORS[5] },
];

const VALUE_INFO = [
  { value: 1, color: VALUE_COLORS[1], label: "Bajo" },
  { value: 2, color: VALUE_COLORS[2], label: "Medio-Bajo" },
  { value: 3, color: VALUE_COLORS[3], label: "Medio-Alto" },
  { value: 4, color: VALUE_COLORS[4], label: "Alto" },
];

export function CubeSidePanels() {
  return (
    <>
      {/* Panel izquierdo - Áreas INTEGRATE */}
      <div className="absolute left-4 md:left-6 top-[50%] -translate-y-1/2 w-28 md:w-32 lg:w-36 pointer-events-none z-10">
        <div
          className="rounded-3xl p-3 md:p-3.5 flex flex-col gap-2"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(60px) saturate(180%)',
            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <h3 className="text-[10px] md:text-xs font-semibold text-gray-700 text-center tracking-tight mb-0.5">
            Áreas
          </h3>
          <div className="space-y-1.5">
            {AREA_INFO.map((area, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 p-1.5 rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '0.5px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: area.color,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <span className="text-xs">{area.icon}</span>
                </div>
                <p className="font-semibold text-gray-800 text-[8px] md:text-[9px] leading-tight flex-1 min-w-0">
                  {area.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho - Escala de Valores */}
      <div className="absolute right-4 md:right-6 top-[50%] -translate-y-1/2 w-28 md:w-32 lg:w-36 pointer-events-none z-10">
        <div
          className="rounded-3xl p-3 md:p-3.5 flex flex-col gap-2"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(60px) saturate(180%)',
            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
          }}
        >
          <h3 className="text-[10px] md:text-xs font-semibold text-gray-700 text-center tracking-tight mb-0.5">
            Escala
          </h3>
          <div className="space-y-1.5">
            {VALUE_INFO.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 p-1.5 rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.5))',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '0.5px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
                }}
              >
                <div
                  className="w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center font-bold text-white text-[10px] md:text-xs flex-shrink-0"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {item.value}
                </div>
                <p className="font-semibold text-gray-800 text-[8px] md:text-[9px] leading-tight flex-1 min-w-0">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

