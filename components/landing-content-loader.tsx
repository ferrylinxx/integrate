"use client";

import { useLandingContent, getContent, getContentWithHtml } from "@/lib/hooks/use-landing-content";
import { Loader2 } from "lucide-react";

interface LandingContentLoaderProps {
  children: (content: ReturnType<typeof useLandingContent>) => React.ReactNode;
}

/**
 * Componente wrapper que carga el contenido de la landing page
 * y muestra un loading state mientras se carga
 */
export function LandingContentLoader({ children }: LandingContentLoaderProps) {
  const contentData = useLandingContent("es");
  const { loading, error } = contentData;

  // Loading state con colores INTEGRATE
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
           style={{
             background: `
               radial-gradient(ellipse 800px 600px at 50% 100%, rgba(184, 98, 27, 0.3) 0%, transparent 50%),
               radial-gradient(ellipse 700px 500px at 0% 100%, rgba(74, 27, 61, 0.4) 0%, transparent 50%),
               radial-gradient(ellipse 900px 700px at 100% 50%, rgba(44, 27, 71, 0.3) 0%, transparent 50%),
               linear-gradient(180deg, #0A0A1F 0%, #1A1A2E 100%)
             `
           }}>
        {/* Patrón de cuadrícula sutil */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        <div className="text-center space-y-8 relative z-10">
          {/* Spinner con gradiente INTEGRATE */}
          <div className="relative inline-block">
            {/* Círculo de fondo con glow */}
            <div className="absolute inset-0 rounded-full blur-2xl opacity-50"
                 style={{
                   background: 'radial-gradient(circle, rgba(142, 35, 93, 0.6) 0%, rgba(44, 36, 142, 0.4) 50%, transparent 70%)'
                 }}></div>

            {/* Spinner principal */}
            <div className="relative h-24 w-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                   style={{
                     borderTopColor: '#2C248E',
                     borderRightColor: '#8E235D',
                     borderBottomColor: '#F08726',
                     borderLeftColor: '#E65B3E',
                     animationDuration: '1.5s'
                   }}></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent animate-spin"
                   style={{
                     borderTopColor: '#E65B3E',
                     borderRightColor: '#2C248E',
                     borderBottomColor: '#8E235D',
                     borderLeftColor: '#F08726',
                     animationDuration: '2s',
                     animationDirection: 'reverse'
                   }}></div>
            </div>
          </div>

          {/* Texto "Cargando INTEGRATE" con gradiente */}
          <div className="space-y-3">
            <p className="text-3xl font-extrabold">
              <span className="text-white">Cargando </span>
              <span className="bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#F08726] bg-clip-text text-transparent animate-pulse">
                INTEGRATE
              </span>
            </p>
            <p className="text-sm text-white/60 font-medium tracking-wide">
              Preparando la experiencia de diagnóstico organizativo
            </p>
          </div>

          {/* Barra de progreso animada */}
          <div className="w-64 h-1 mx-auto bg-white/10 rounded-full overflow-hidden">
            <div className="h-full rounded-full animate-pulse"
                 style={{
                   background: 'linear-gradient(90deg, #2C248E 0%, #8E235D 50%, #F08726 100%)',
                   animation: 'shimmer 2s infinite',
                   backgroundSize: '200% 100%'
                 }}></div>
          </div>
        </div>

        {/* Animación de shimmer */}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    );
  }

  // Error state (muestra la página con fallback content)
  if (error) {
    console.warn("Error al cargar contenido, usando fallback:", error);
  }

  return <>{children(contentData)}</>;
}

/**
 * Componente helper para renderizar contenido que puede ser HTML
 * @param content - Contenido a renderizar
 * @param isHtml - Si el contenido es HTML
 */
export function RenderContent({ content, isHtml, className = "" }: { content: string; isHtml?: boolean; className?: string }) {
  if (isHtml) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <span className={className}>{content}</span>;
}

export { getContent, getContentWithHtml };

