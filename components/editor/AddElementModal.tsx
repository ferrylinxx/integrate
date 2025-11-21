"use client";

import { useState } from 'react';
import { X, Upload } from 'lucide-react';

// ============================================
// MODAL PARA CONFIGURAR NUEVO ELEMENTO
// ============================================

interface AddElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementType: string;
  elementSubtype: string;
  onConfirm: (config: any) => void;
}

export function AddElementModal({
  isOpen,
  onClose,
  elementType,
  elementSubtype,
  onConfirm,
}: AddElementModalProps) {
  const [config, setConfig] = useState<any>({
    content: '',
    fontSize: '16px',
    fontWeight: 400,
    color: '#FFFFFF',
    fontFamily: 'Poppins, sans-serif',
    textAlign: 'left',
    width: 400,
    height: 300,
    backgroundColor: 'transparent',
    borderRadius: '8px',
    url: '',
  });

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(config);
    onClose();
  };

  const renderTextConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-xs mb-2">Contenido del texto</label>
        <textarea
          value={config.content}
          onChange={(e) => setConfig({ ...config, content: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          rows={3}
          placeholder="Escribe tu texto aquí..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-xs mb-2">Fuente</label>
          <select
            value={config.fontFamily}
            onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          >
            <option value="Poppins, sans-serif">Poppins</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="Roboto, sans-serif">Roboto</option>
            <option value="Inter, sans-serif">Inter</option>
          </select>
        </div>

        <div>
          <label className="block text-white text-xs mb-2">Tamaño</label>
          <input
            type="number"
            value={parseInt(config.fontSize)}
            onChange={(e) => setConfig({ ...config, fontSize: `${e.target.value}px` })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            min="8"
            max="72"
          />
        </div>

        <div>
          <label className="block text-white text-xs mb-2">Peso</label>
          <select
            value={config.fontWeight}
            onChange={(e) => setConfig({ ...config, fontWeight: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          >
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="600">SemiBold (600)</option>
            <option value="700">Bold (700)</option>
          </select>
        </div>

        <div>
          <label className="block text-white text-xs mb-2">Color</label>
          <input
            type="color"
            value={config.color}
            onChange={(e) => setConfig({ ...config, color: e.target.value })}
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const renderImageConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-xs mb-2">URL de la imagen</label>
        <input
          type="text"
          value={config.url}
          onChange={(e) => setConfig({ ...config, url: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="text-center">
        <p className="text-white/50 text-xs mb-2">o</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-all mx-auto">
          <Upload className="w-4 h-4" />
          Subir imagen
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-xs mb-2">Ancho (px)</label>
          <input
            type="number"
            value={config.width}
            onChange={(e) => setConfig({ ...config, width: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            min="50"
            max="1000"
          />
        </div>

        <div>
          <label className="block text-white text-xs mb-2">Alto (px)</label>
          <input
            type="number"
            value={config.height}
            onChange={(e) => setConfig({ ...config, height: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            min="50"
            max="1000"
          />
        </div>
      </div>
    </div>
  );

  const renderButtonConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-xs mb-2">Texto del botón</label>
        <input
          type="text"
          value={config.content}
          onChange={(e) => setConfig({ ...config, content: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          placeholder="Click aquí"
        />
      </div>

      <div>
        <label className="block text-white text-xs mb-2">URL de destino</label>
        <input
          type="text"
          value={config.url}
          onChange={(e) => setConfig({ ...config, url: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
          placeholder="https://ejemplo.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-xs mb-2">Color de fondo</label>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-white text-xs mb-2">Color de texto</label>
          <input
            type="color"
            value={config.color}
            onChange={(e) => setConfig({ ...config, color: e.target.value })}
            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const renderHTMLConfig = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-xs mb-2">Código HTML/CSS</label>
        <textarea
          value={config.content}
          onChange={(e) => setConfig({ ...config, content: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono"
          rows={10}
          placeholder="<div>Tu código HTML aquí...</div>"
        />
      </div>
    </div>
  );

  const getTitle = () => {
    const titles: Record<string, string> = {
      h1: 'Añadir Título H1',
      h2: 'Añadir Título H2',
      h3: 'Añadir Título H3',
      paragraph: 'Añadir Párrafo',
      image: 'Añadir Imagen',
      video: 'Añadir Video',
      button: 'Añadir Botón',
      html: 'Añadir HTML Personalizado',
    };
    return titles[elementSubtype] || 'Añadir Elemento';
  };

  const renderConfig = () => {
    if (elementType === 'text') return renderTextConfig();
    if (elementSubtype === 'image') return renderImageConfig();
    if (elementSubtype === 'button') return renderButtonConfig();
    if (elementSubtype === 'html') return renderHTMLConfig();
    return <div className="text-white/50 text-sm">Configuración no disponible</div>;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-black/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-lg">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {renderConfig()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/30"
          >
            Crear Elemento
          </button>
        </div>
      </div>
    </div>
  );
}

