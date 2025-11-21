"use client";

import { useEditorStore } from '@/lib/editor/store';
import { get } from '@/lib/editor/utils';
import { CubeConfig } from '@/lib/editor/types';

// ============================================
// EDITOR DE PROPIEDADES DEL CUBO 3D
// ============================================

export function CubeEditor() {
  const config = useEditorStore((state) => state.config);
  const updateConfig = useEditorStore((state) => state.updateConfig);
  
  // Obtener configuración del cubo
  const basePath = 'components.mapaDeSituacion';
  const cubeConfig = get(config, `${basePath}.cube`) as CubeConfig;
  
  return (
    <div className="space-y-6">
      {/* ========================================
          TAMAÑO DEL CUBO
      ======================================== */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Tamaño del Cubo
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Tamaño: {cubeConfig.size}px
          </label>
          <input
            type="range"
            min="200"
            max="400"
            step="10"
            value={cubeConfig.size}
            onChange={(e) => updateConfig(`${basePath}.cube.size`, parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>200px</span>
            <span>300px</span>
            <span>400px</span>
          </div>
        </div>
      </div>
      
      {/* ========================================
          PERSPECTIVA
      ======================================== */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Perspectiva 3D
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Perspectiva: {cubeConfig.perspective}px
          </label>
          <input
            type="range"
            min="800"
            max="2000"
            step="100"
            value={cubeConfig.perspective}
            onChange={(e) => updateConfig(`${basePath}.cube.perspective`, parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>800px</span>
            <span>1400px</span>
            <span>2000px</span>
          </div>
        </div>
        
        <p className="text-white/50 text-xs">
          Valores más bajos = perspectiva más pronunciada
        </p>
      </div>
      
      {/* ========================================
          BORDE
      ======================================== */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Borde de las Caras
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Grosor: {cubeConfig.borderWidth}
          </label>
          <select
            value={cubeConfig.borderWidth}
            onChange={(e) => updateConfig(`${basePath}.cube.borderWidth`, e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="0px">Sin borde</option>
            <option value="0.5px">0.5px (Fino)</option>
            <option value="1px">1px (Normal)</option>
            <option value="1.5px">1.5px (Medio)</option>
            <option value="2px">2px (Grueso)</option>
          </select>
        </div>
      </div>
      
      {/* ========================================
          OPACIDAD DE CARAS
      ======================================== */}
      <div className="space-y-3 pt-6 border-t border-white/10">
        <h4 className="text-white font-semibold text-xs uppercase tracking-wide">
          Opacidad de las Caras
        </h4>
        
        <div>
          <label className="text-white/70 text-xs mb-1 block">
            Opacidad: {Math.round(cubeConfig.faceOpacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={cubeConfig.faceOpacity * 100}
            onChange={(e) => updateConfig(`${basePath}.cube.faceOpacity`, parseInt(e.target.value) / 100)}
            className="w-full"
          />
          <div className="flex justify-between text-white/30 text-xs mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      {/* ========================================
          INFORMACIÓN
      ======================================== */}
      <div className="pt-6 border-t border-white/10">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-blue-400 text-xs leading-relaxed">
            <strong>💡 Tip:</strong> Ajusta la perspectiva para cambiar la profundidad 
            del efecto 3D. Valores más altos hacen que el cubo se vea más plano.
          </p>
        </div>
      </div>
    </div>
  );
}

