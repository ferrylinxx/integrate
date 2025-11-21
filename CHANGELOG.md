# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.3.1] - 2025-10-29

### ✨ Añadido
- **Paneles laterales con efecto liquid glass**: Guías fijas en los lados del cubo con efecto glassmorphism transparente
  - Panel izquierdo: Áreas INTEGRATE con iconos y colores
  - Panel derecho: Escala de valores (1-4) con código de colores
  - Diseño responsive con diferentes tamaños para móvil, tablet y desktop
  - Efecto backdrop-blur para transparencia tipo "liquid glass"

- **📱 Gestos táctiles mejorados para móviles**:
  - Soporte optimizado para pinch-to-zoom (dos dedos)
  - Rotación táctil mejorada con un dedo
  - Configuración de velocidad de zoom y rotación optimizada
  - Damping suave para mejor experiencia de usuario

### 🔧 Modificado
- Actualizado `components/cube-3d.tsx`: Añadidos controles táctiles mejorados
- Actualizado `components/interactive-cube-3d.tsx`: Añadidos controles táctiles mejorados
- Actualizado `components/results-cube-section.tsx`: Integración de paneles laterales y nuevo icono de gestos táctiles
- Mejorada la sección de instrucciones con 4 columnas incluyendo gestos táctiles

### 🗑️ Eliminado
- **Efecto bloom en caras con alta puntuación**: Removido el efecto emissive y halo de brillo de las caras del cubo para una visualización más limpia
  - Eliminada la lógica de `hasHighScore` y `glowIntensity`
  - Removido el mesh adicional de brillo para caras con puntuación >= 3.5

---

## [1.3.0] - Versiones anteriores

Ver commits anteriores para historial completo de cambios.

