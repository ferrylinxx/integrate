"use client";

import { useState } from 'react';
import { 
  Plus, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Square, 
  Circle, 
  Minus,
  MousePointer2,
  Link as LinkIcon,
  CheckSquare,
  Table,
  BarChart3,
  Hash,
  Box,
  Code,
  Sparkles
} from 'lucide-react';

// ============================================
// MENÚ DESPLEGABLE PARA AÑADIR ELEMENTOS
// ============================================

interface AddElementMenuProps {
  onAddElement: (type: string, subtype?: string) => void;
}

export function AddElementMenu({ onAddElement }: AddElementMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'text',
      name: 'Texto',
      icon: Type,
      color: 'blue',
      items: [
        { id: 'h1', name: 'Título H1', icon: Type },
        { id: 'h2', name: 'Título H2', icon: Type },
        { id: 'h3', name: 'Título H3', icon: Type },
        { id: 'paragraph', name: 'Párrafo', icon: Type },
      ],
    },
    {
      id: 'visual',
      name: 'Elementos Visuales',
      icon: ImageIcon,
      color: 'purple',
      items: [
        { id: 'image', name: 'Imagen', icon: ImageIcon },
        { id: 'video', name: 'Video', icon: Video },
        { id: 'rectangle', name: 'Rectángulo', icon: Square },
        { id: 'circle', name: 'Círculo', icon: Circle },
        { id: 'separator', name: 'Separador', icon: Minus },
      ],
    },
    {
      id: 'interactive',
      name: 'Interactivos',
      icon: MousePointer2,
      color: 'green',
      items: [
        { id: 'button', name: 'Botón', icon: MousePointer2 },
        { id: 'link', name: 'Link', icon: LinkIcon },
        { id: 'checkbox', name: 'Checkbox', icon: CheckSquare },
      ],
    },
    {
      id: 'data',
      name: 'Datos',
      icon: BarChart3,
      color: 'orange',
      items: [
        { id: 'table', name: 'Tabla', icon: Table },
        { id: 'chart', name: 'Gráfico', icon: BarChart3 },
        { id: 'metric', name: 'Métrica', icon: Hash },
      ],
    },
    {
      id: 'custom',
      name: 'Componentes Personalizados',
      icon: Box,
      color: 'pink',
      items: [
        { id: 'cube', name: 'Cubo 3D', icon: Box },
        { id: 'cell', name: 'Celda de Sub-área', icon: Square },
      ],
    },
    {
      id: 'html',
      name: 'HTML Personalizado',
      icon: Code,
      color: 'red',
      items: [
        { id: 'html', name: 'Editor HTML/CSS', icon: Code },
      ],
    },
  ];

  const handleAddElement = (categoryId: string, itemId: string) => {
    // ➕ CORREGIDO: Mapear categoryId al tipo correcto
    let elementType = '';

    if (categoryId === 'text') {
      elementType = 'text';
    } else if (categoryId === 'visual') {
      // Para elementos visuales, el tipo depende del item
      if (itemId === 'image') elementType = 'image';
      else if (itemId === 'video') elementType = 'video';
      else elementType = 'shape'; // rectangle, circle, separator
    } else if (categoryId === 'interactive') {
      elementType = 'button'; // Todos los interactivos son botones por ahora
    } else if (categoryId === 'data') {
      elementType = itemId; // table, chart, metric
    } else if (categoryId === 'custom') {
      elementType = 'custom'; // cube, cell
    } else if (categoryId === 'html') {
      elementType = 'html';
    }

    onAddElement(elementType, itemId);
    setIsOpen(false);
    setActiveCategory(null);
  };

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
          isOpen
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
        title="Añadir nuevo elemento"
      >
        <Plus className="w-4 h-4" />
        Añadir
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="p-2">
            <div className="text-white/50 text-xs font-medium px-3 py-2">
              Selecciona un elemento
            </div>
            
            {/* Categorías */}
            <div className="space-y-1">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <div key={category.id}>
                    {/* Botón de categoría */}
                    <button
                      onClick={() => setActiveCategory(isActive ? null : category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                      <span className="flex-1 text-left">{category.name}</span>
                      <span className={`text-xs transition-transform ${isActive ? 'rotate-90' : ''}`}>
                        ›
                      </span>
                    </button>

                    {/* Subitems */}
                    {isActive && (
                      <div className="ml-4 mt-1 space-y-1">
                        {category.items.map((item) => {
                          const ItemIcon = item.icon;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleAddElement(category.id, item.id)}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/70 hover:bg-white/5 hover:text-white transition-all"
                            >
                              <ItemIcon className="w-3 h-3" />
                              <span>{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el menú */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setActiveCategory(null);
          }}
        />
      )}
    </div>
  );
}

