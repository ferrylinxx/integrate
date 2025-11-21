"use client";

import { CustomElement } from '@/lib/editor/types';
import { EditorWrapper } from './EditorWrapper';

// ============================================
// RENDERIZADOR DE ELEMENTOS PERSONALIZADOS
// ============================================

interface CustomElementRendererProps {
  element: CustomElement;
}

export function CustomElementRenderer({ element }: CustomElementRendererProps) {
  // ➕ DEBUG: Log del elemento que se está renderizando
  console.log('🎨 CustomElementRenderer - Renderizando elemento:', {
    id: element.id,
    type: element.type,
    subtype: element.subtype,
    visible: element.visible,
    position: element.layout.position,
    content: element.content,
  });

  if (!element.visible) {
    console.log('⚠️ Elemento no visible:', element.id);
    return null;
  }

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return renderText();
      case 'image':
        return renderImage();
      case 'video':
        return renderVideo();
      case 'button':
        return renderButton();
      case 'html':
        return renderHTML();
      case 'shape':
        return renderShape();
      case 'table':
        return renderTable();
      case 'chart':
        return renderChart();
      case 'metric':
        return renderMetric();
      case 'custom':
        return renderCustom();
      default:
        console.error('❌ Tipo no soportado:', element.type);
        return (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-white">
            <div className="font-bold">⚠️ Tipo no soportado: {element.type}</div>
            <div className="text-xs mt-2">Subtype: {element.subtype}</div>
          </div>
        );
    }
  };

  const renderText = () => {
    const Tag = element.subtype === 'h1' ? 'h1' : element.subtype === 'h2' ? 'h2' : element.subtype === 'h3' ? 'h3' : 'p';
    
    return (
      <Tag
        style={{
          fontFamily: element.styles.fontFamily || 'Poppins, sans-serif',
          fontSize: element.styles.fontSize || '16px',
          fontWeight: element.styles.fontWeight || 400,
          color: element.styles.color || '#FFFFFF',
          textAlign: element.styles.textAlign || 'left',
          margin: 0,
          padding: 0,
        }}
      >
        {element.content}
      </Tag>
    );
  };

  const renderImage = () => {
    if (!element.content) {
      return (
        <div
          className="flex items-center justify-center bg-white/5 border border-white/10 rounded-lg"
          style={{
            width: element.layout.size?.width || 400,
            height: element.layout.size?.height || 300,
          }}
        >
          <span className="text-white/50 text-sm">Sin imagen</span>
        </div>
      );
    }

    return (
      <img
        src={element.content}
        alt="Custom element"
        style={{
          width: element.layout.size?.width || 400,
          height: element.layout.size?.height || 300,
          objectFit: 'cover',
          borderRadius: element.styles.borderRadius || '8px',
          opacity: element.styles.opacity || 1,
        }}
      />
    );
  };

  const renderVideo = () => {
    if (!element.content) {
      return (
        <div
          className="flex items-center justify-center bg-white/5 border border-white/10 rounded-lg"
          style={{
            width: element.layout.size?.width || 640,
            height: element.layout.size?.height || 360,
          }}
        >
          <span className="text-white/50 text-sm">Sin video</span>
        </div>
      );
    }

    // Detectar si es YouTube o Vimeo
    const isYouTube = element.content.includes('youtube.com') || element.content.includes('youtu.be');
    const isVimeo = element.content.includes('vimeo.com');

    if (isYouTube || isVimeo) {
      return (
        <iframe
          src={element.content}
          style={{
            width: element.layout.size?.width || 640,
            height: element.layout.size?.height || 360,
            borderRadius: element.styles.borderRadius || '8px',
            border: 'none',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <video
        src={element.content}
        controls
        style={{
          width: element.layout.size?.width || 640,
          height: element.layout.size?.height || 360,
          borderRadius: element.styles.borderRadius || '8px',
        }}
      />
    );
  };

  const renderButton = () => {
    const handleClick = () => {
      if (element.content?.url) {
        window.open(element.content.url, '_blank');
      }
    };

    return (
      <button
        onClick={handleClick}
        className="px-6 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
        style={{
          backgroundColor: element.styles.backgroundColor || '#3B82F6',
          color: element.styles.color || '#FFFFFF',
          borderRadius: element.styles.borderRadius || '8px',
          fontFamily: element.styles.fontFamily || 'Poppins, sans-serif',
          fontSize: element.styles.fontSize || '14px',
          fontWeight: element.styles.fontWeight || 600,
        }}
      >
        {element.content?.text || 'Botón'}
      </button>
    );
  };

  const renderHTML = () => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: element.content }}
        style={{
          width: element.layout.size?.width || 400,
          height: element.layout.size?.height || 300,
        }}
      />
    );
  };

  const renderShape = () => {
    const isCircle = element.subtype === 'circle';
    const isSeparator = element.subtype === 'separator';

    if (isSeparator) {
      return (
        <div
          style={{
            width: element.layout.size?.width || 200,
            height: element.layout.size?.height || 2,
            backgroundColor: element.styles.backgroundColor || '#FFFFFF',
            opacity: element.styles.opacity || 0.3,
          }}
        />
      );
    }

    return (
      <div
        style={{
          width: element.layout.size?.width || 100,
          height: element.layout.size?.height || 100,
          backgroundColor: element.styles.backgroundColor || '#3B82F6',
          borderRadius: isCircle ? '50%' : (element.styles.borderRadius || '8px'),
          opacity: element.styles.opacity || 1,
        }}
      />
    );
  };

  const renderTable = () => {
    return (
      <div
        className="bg-white/5 border border-white/10 rounded-lg p-4"
        style={{
          width: element.layout.size?.width || 400,
          height: element.layout.size?.height || 300,
        }}
      >
        <div className="text-white/50 text-sm text-center">
          📊 Tabla (próximamente)
        </div>
      </div>
    );
  };

  const renderChart = () => {
    return (
      <div
        className="bg-white/5 border border-white/10 rounded-lg p-4"
        style={{
          width: element.layout.size?.width || 400,
          height: element.layout.size?.height || 300,
        }}
      >
        <div className="text-white/50 text-sm text-center">
          📈 Gráfico (próximamente)
        </div>
      </div>
    );
  };

  const renderMetric = () => {
    return (
      <div className="text-center">
        <div
          className="font-bold"
          style={{
            fontSize: element.styles.fontSize || '48px',
            color: element.styles.color || '#FFFFFF',
            fontFamily: element.styles.fontFamily || 'Poppins, sans-serif',
          }}
        >
          {element.content?.value || '0'}
        </div>
        <div
          className="text-white/50 mt-2"
          style={{
            fontSize: '14px',
            fontFamily: element.styles.fontFamily || 'Poppins, sans-serif',
          }}
        >
          {element.content?.label || 'Métrica'}
        </div>
      </div>
    );
  };

  const renderCustom = () => {
    return (
      <div
        className="bg-white/5 border border-white/10 rounded-lg p-4"
        style={{
          width: element.layout.size?.width || 200,
          height: element.layout.size?.height || 200,
        }}
      >
        <div className="text-white/50 text-sm text-center">
          🎯 Componente personalizado: {element.subtype}
        </div>
      </div>
    );
  };

  return (
    <EditorWrapper
      componentId={element.id}
      path={`customElements.${element.id}`}
      enableDrag={!element.locked}
      enableResize={element.type !== 'text'}
      initialPosition={element.layout.position}
      initialSize={element.layout.size}
    >
      {renderContent()}
    </EditorWrapper>
  );
}

