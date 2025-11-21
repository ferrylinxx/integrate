"use client";

import { InteractiveCubeHero } from "@/components/interactive-cube-hero";
import { LandingContentLoader, getContentWithHtml, RenderContent } from "@/components/landing-content-loader";
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calcular progreso de scroll suave (0 a 1)
      const progress = Math.min(scrollY / (windowHeight * 0.7), 1);
      setScrollProgress(progress);

      // Activar transición cuando el usuario hace scroll más de 50px
      setScrolled(scrollY > 50);
    };

    // Ejecutar una vez al cargar
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LandingContentLoader>
      {({ content }) => (
        <main className="relative overflow-x-hidden">
          {/* Video de fondo con overlay oscuro */}
          <div className="fixed inset-0 z-0">
            {/* Video de fondo */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/fondo-landing.mp4" type="video/mp4" />
            </video>

            {/* Overlay oscuro con gradiente INTEGRATE para mantener legibilidad */}
            <div className="absolute inset-0"
                 style={{
                   background: `
                     radial-gradient(ellipse 800px 600px at 50% 100%, rgba(184, 98, 27, 0.4) 0%, transparent 50%),
                     radial-gradient(ellipse 700px 500px at 0% 100%, rgba(74, 27, 61, 0.5) 0%, transparent 50%),
                     radial-gradient(ellipse 900px 700px at 100% 50%, rgba(44, 27, 71, 0.4) 0%, transparent 50%),
                     linear-gradient(180deg, rgba(10, 10, 31, 0.7) 0%, rgba(26, 26, 46, 0.8) 100%)
                   `
                 }}
            />
          </div>

          {/* Contenedor con altura mínima para scroll - REDUCIDO */}
          <div className="relative" style={{ minHeight: '100vh' }}>
            {/* CUBO GRANDE - PANTALLA INICIAL (Fade Out al hacer scroll) */}
            <div
              className="fixed inset-0 z-10 flex items-center justify-center"
              style={{
                opacity: scrolled ? 0 : 1,
                pointerEvents: scrolled ? 'none' : 'auto',
                transition: 'opacity 0.8s ease-out',
              }}
            >
              <div className="w-full max-w-2xl h-[350px] md:h-[450px]">
                <InteractiveCubeHero scale={0.8} />
              </div>
            </div>

            {/* CUBO PEQUEÑO - ARRIBA CENTRO (Fade In al hacer scroll) */}
            <div
              className="fixed top-2 left-1/2 md:top-4 z-50"
              style={{
                opacity: scrolled ? 1 : 0,
                transform: 'translateX(-50%)',
                transition: 'opacity 0.8s ease-out',
                pointerEvents: scrolled ? 'auto' : 'none',
              }}
            >
              {/* Contenedor más grande para evitar recortes del cubo al rotar */}
              <div className="w-32 h-32 md:w-36 md:h-36" style={{ overflow: 'visible' }}>
                <InteractiveCubeHero scale={0.35} />
              </div>
            </div>

            {/* PANTALLA 2: Cubo pequeño + contenido (después del scroll) - REDUCIDO */}
            <section
              className="relative z-10 flex flex-col items-center justify-start px-4 pt-40 md:pt-48 pb-8"
              style={{
                marginTop: '80vh',
                opacity: scrollProgress,
                transform: `translateY(${(1 - scrollProgress) * 50}px)`,
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              }}
            >
              {/* Efecto de brillo de fondo */}
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                  opacity: scrollProgress * 0.5,
                }}
              >
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(142, 35, 93, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                />
              </div>

              {/* Título principal con animación escalonada */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-6 max-w-4xl leading-tight mt-8"
                style={{
                  opacity: Math.max(0, (scrollProgress - 0.2) * 2),
                  transform: `translateY(${Math.max(0, (1 - scrollProgress) * 30)}px)`,
                  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s',
                }}
              >
                <RenderContent {...getContentWithHtml(content, "01_Portada.Hero Principal.titulo", "Descubre las áreas sensibles de tu organización")} />
              </h1>

              {/* Subtítulo/Descripción con animación */}
              <p
                className="text-base md:text-lg text-white/70 text-center mb-12 max-w-3xl leading-relaxed px-4"
                style={{
                  opacity: Math.max(0, (scrollProgress - 0.3) * 2),
                  transform: `translateY(${Math.max(0, (1 - scrollProgress) * 20)}px)`,
                  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
                }}
              >
                <RenderContent {...getContentWithHtml(content, "01_Portada.Hero Principal.subtitulo", "Diagnóstico organizativo basado en el modelo INTEGRATE 2.0. Identifica fortalezas y oportunidades de mejora en 6 dimensiones clave.")} />
              </p>

              {/* QR Code con animación de zoom */}
              <div
                className="transition-all duration-500 transform hover:scale-110 relative group"
                style={{
                  opacity: Math.max(0, (scrollProgress - 0.4) * 2),
                  transform: `scale(${0.8 + Math.min(scrollProgress, 1) * 0.2}) rotateZ(${(1 - scrollProgress) * 10}deg)`,
                  transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s',
                }}
              >
                <QRCode
                  value="https://integrate.fgarola.es/codigo"
                  size={160}
                  level="H"
                  fgColor="#ffffff"
                  bgColor="transparent"
                  className="relative z-10"
                />

                {/* Borde animado */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#2C248E]/30 transition-all duration-500" />
              </div>
            </section>
          </div>

          {/* Indicador de scroll mejorado (solo visible en pantalla inicial) */}
          <div
            className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-30"
            style={{
              opacity: 1 - scrollProgress,
              transform: `translateX(-50%) translateY(${scrollProgress * 50}px)`,
              transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
              pointerEvents: scrolled ? 'none' : 'auto',
            }}
          >
            <div className="flex flex-col items-center gap-3">
              {/* Texto con efecto de brillo */}
              <p className="text-white/90 text-base font-bold tracking-wide animate-pulse">
                Desliza para descubrir
              </p>

              {/* Icono de flecha animado con círculo */}
              <div className="relative">
                {/* Círculo pulsante de fondo */}
                <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />

                {/* Círculo sólido */}
                <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full p-4 border-2 border-white/30">
                  <svg
                    className="w-8 h-8 text-white animate-bounce"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Estilos de animación personalizados */}
          <style jsx>{`
            @keyframes gradientShift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            @keyframes sparkle {
              0%, 100% { opacity: 0; transform: scale(0); }
              50% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </main>
      )}
    </LandingContentLoader>
  );
}
