"use client";

import { InteractiveCubeHero } from "@/components/interactive-cube-hero";
import { LandingContentLoader, getContentWithHtml, RenderContent } from "@/components/landing-content-loader";
import { FloatingParticles } from "@/components/floating-particles";
import { GroupResultsAccess } from "@/components/group-results-access";
import QRCode from "react-qr-code";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Framer Motion scroll hooks para parallax
  const { scrollYProgress } = useScroll();
  const cubeScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.5]);
  const cubeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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
        <main className="relative overflow-x-hidden overflow-y-auto">
          {/* Video de fondo sin overlay - completamente visible */}
          <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1 }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/fondo-landing.mp4" type="video/mp4" />
            </video>

            {/* Partículas flotantes sobre el video */}
            <FloatingParticles count={40} />
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
              className="fixed top-2 left-1/2 md:top-4 z-20"
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
              className="relative z-30 flex flex-col items-center justify-start px-4 pt-48 md:pt-56 pb-8"
              style={{
                marginTop: '80vh',
                opacity: scrollProgress,
                transform: `translateY(${(1 - scrollProgress) * 50}px)`,
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              }}
            >
              {/* Efecto de brillo de fondo animado con Framer Motion */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: scrollProgress * 0.5 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(142, 35, 93, 0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Título principal con animación Framer Motion */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-6 max-w-4xl leading-tight mt-20"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <RenderContent {...getContentWithHtml(content, "01_Portada.Hero Principal.titulo", "Descubre las áreas sensibles de tu organización")} />
              </motion.h1>

              {/* Subtítulo/Descripción con animación Framer Motion */}
              <motion.p
                className="text-base md:text-lg text-white/70 text-center mb-16 max-w-3xl leading-relaxed px-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <RenderContent {...getContentWithHtml(content, "01_Portada.Hero Principal.subtitulo", "Diagnóstico organizativo basado en el modelo INTEGRATE 2.0. Identifica fortalezas y oportunidades de mejora en 6 dimensiones clave.")} />
              </motion.p>

              {/* QR Code con animación Framer Motion mejorada */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.9,
                  delay: 0.6,
                  ease: [0.34, 1.56, 0.64, 1], // Bounce effect
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow effect animado */}
                <motion.div
                  className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(circle, rgba(44, 36, 142, 0.6) 0%, transparent 70%)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <QRCode
                  value="https://integrate.fgarola.es/codigo"
                  size={160}
                  level="H"
                  fgColor="#ffffff"
                  bgColor="transparent"
                  className="relative z-10"
                />

                {/* Borde animado con gradiente */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent"
                  whileHover={{
                    borderColor: 'rgba(44, 36, 142, 0.5)',
                    boxShadow: '0 0 20px rgba(44, 36, 142, 0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Acceso directo a resultados por código de grupo */}
              <GroupResultsAccess />
            </section>
          </div>

          {/* Indicador de scroll mejorado con Framer Motion */}
          <motion.div
            className="fixed bottom-12 left-1/2 z-30"
            style={{
              x: "-50%",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: scrolled ? 0 : 1,
              y: scrolled ? 50 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-col items-center gap-3"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Texto con efecto de brillo */}
              <motion.p
                className="text-white/90 text-base font-bold tracking-wide"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Desliza para descubrir
              </motion.p>

              {/* Icono de flecha animado con círculo */}
              <div className="relative">
                {/* Círculo pulsante de fondo */}
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />

                {/* Círculo sólido */}
                <motion.div
                  className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-full p-4 border-2 border-white/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{
                      y: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </motion.svg>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

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
