import { EditorConfig } from './types';

// ============================================
// CONFIGURACIÓN POR DEFECTO DEL EDITOR
// ============================================

export const DEFAULT_CONFIG: EditorConfig = {
  version: "1.0.0",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // ============================================
  // CONFIGURACIÓN GLOBAL
  // ============================================
  global: {
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "#0a0a1a",
    primaryColor: "#FFFFFF",
  },
  
  // ============================================
  // CONFIGURACIÓN POR COMPONENTE
  // ============================================
  components: {
    // ========================================
    // MAPA DE SITUACIÓN (Cubo 3D)
    // ========================================
    mapaDeSituacion: {
      title: {
        content: "MAPA DE SITUACIÓN",
        fontFamily: "Poppins, sans-serif",
        fontSize: "20px",
        fontWeight: 600,
        color: "#FFFFFF",
        opacity: 1,
        letterSpacing: "0.5px",
        lineHeight: "1.2",
        textAlign: "left",
        textTransform: "uppercase",
        // ➕ NUEVO: Layout para drag & drop del título
        layout: {
          position: { x: 0, y: 0 },
        },
      },
      subtitle: {
        content: "DE LAS 6 ÁREAS DE LA ORGANIZACIÓN",
        fontFamily: "Poppins, sans-serif",
        fontSize: "14px",
        fontWeight: 300,
        color: "#FFFFFF",
        opacity: 0.7,
        lineHeight: "1.4",
        textAlign: "left",
        textTransform: "uppercase",
        // ➕ NUEVO: Layout para drag & drop del subtítulo
        layout: {
          position: { x: 0, y: 30 },
        },
      },
      layout: {
        padding: "32px",
        gap: "24px",
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 600,
          height: 500,
        },
      },
      legend: {
        ballSize: "12px",
        fontSize: "11px",
        gap: "12px",
        gradientAngle: -90,
        ballOpacity: 1,
        // ➕ NUEVO: Layout para drag & drop de la leyenda completa
        layout: {
          position: { x: 0, y: 0 },
        },
      },
      // ➕ NUEVO: Botón EQUIPO
      equipoButton: {
        layout: {
          position: { x: 0, y: 0 },
        },
      },
      // ➕ NUEVO: Botones de miembros (array dinámico)
      memberButtons: [] as Array<{ layout: { position: { x: number; y: number } } }>,
      buttons: {
        borderRadius: "20px",
        padding: "8px 16px",
        paddingX: "16px", // ➕ NUEVO
        paddingY: "8px", // ➕ NUEVO
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: "transparent", // ➕ NUEVO
        textColor: "#FFFFFF", // ➕ NUEVO
        borderWidth: "1px", // ➕ NUEVO
        borderColor: "rgba(255,255,255,0.2)", // ➕ NUEVO
        glassEffect: {
          angle: -45,
          stops: [
            { color: "rgba(255,255,255,0.6)", position: 0, opacity: 0.6 }, // ➕ opacity
            { color: "rgba(255,255,255,0.2)", position: 100, opacity: 0.2 }, // ➕ opacity
          ],
        },
        glassOpacity: 1, // ➕ NUEVO
        boxShadow: { // ➕ NUEVO
          x: 0,
          y: 2,
          blur: 8,
          spread: 0,
          color: "#000000",
          opacity: 0.1,
        },
      },
    },
    
    // ========================================
    // VISTA GENERAL (Cruz desplegada)
    // ========================================
    vistaGeneral: {
      title: {
        content: "VISTA GENERAL",
        fontFamily: "Poppins, sans-serif", // ➕ NUEVO
        fontSize: "20px",
        fontWeight: 600,
        color: "#FFFFFF",
        opacity: 1,
        lineHeight: "1.2", // ➕ NUEVO
        textAlign: "left", // ➕ NUEVO
        textTransform: "uppercase", // ➕ NUEVO
      },
      layout: {
        padding: "32px",
        gap: "24px",
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 800,
          height: 600,
        },
      },
      cells: {
        size: 60,
        borderWidth: "0.5px",
        borderRadius: "4px",
        gap: "4px",
        // ➕ NUEVO: Controles avanzados de celdas
        gradientOpacity: 1,
        hoverIntensity: 0.8,
        enableHoverAnimation: true,
      },
      filters: {
        buttonHeight: "32px",
        buttonPadding: "8px 16px",
        gap: "8px",
      },
      legends: {
        ballSize: "12px",
        fontSize: "11px",
        gap: "12px",
        ballOpacity: 1, // ➕ NUEVO
      },
    },
    
    // ========================================
    // VISTA ÁREA (Cuadrado 2x2)
    // ========================================
    vistaArea: {
      title: {
        content: "",
        fontFamily: "Poppins, sans-serif", // ➕ NUEVO
        fontSize: "18px",
        fontWeight: 600,
        color: "#FFFFFF",
        opacity: 1,
        lineHeight: "1.2", // ➕ NUEVO
        textAlign: "left", // ➕ NUEVO
        textTransform: "uppercase", // ➕ NUEVO
      },
      layout: {
        padding: "32px",
        gap: "24px",
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 600,
          height: 500,
        },
      },
      cells: {
        size: 120,
        borderWidth: "0.5px",
        borderRadius: "4px",
        gap: "12px",
        // ➕ NUEVO: Controles avanzados de celdas
        gradientOpacity: 1,
        hoverIntensity: 0.8,
        enableHoverAnimation: true,
      },
      backButton: {
        borderRadius: "20px",
        padding: "8px 16px",
        paddingX: "16px", // ➕ NUEVO
        paddingY: "8px", // ➕ NUEVO
        fontSize: "12px",
        fontWeight: 600,
        backgroundColor: "transparent", // ➕ NUEVO
        textColor: "#FFFFFF", // ➕ NUEVO
        borderWidth: "1px", // ➕ NUEVO
        borderColor: "rgba(255,255,255,0.2)", // ➕ NUEVO
        glassEffect: {
          angle: -45,
          stops: [
            { color: "rgba(255,255,255,0.6)", position: 0, opacity: 0.6 },
            { color: "rgba(255,255,255,0.2)", position: 100, opacity: 0.2 },
          ],
        },
        glassOpacity: 1, // ➕ NUEVO
        boxShadow: { // ➕ NUEVO
          x: 0,
          y: 2,
          blur: 8,
          spread: 0,
          color: "#000000",
          opacity: 0.1,
        },
      },
    },
    
    // ========================================
    // PANEL INFERIOR
    // ========================================
    panelInferior: {
      layout: {
        padding: "32px",
        gap: "32px",
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 1200,
          height: 200,
        },
      },
      separator: {
        height: "4px",
        gradient: {
          angle: 90,
          stops: [
            { color: "rgba(255,255,255,0.75)", position: 0, opacity: 0.75 }, // ➕ opacity
            { color: "rgba(255,255,255,0.75)", position: 39, opacity: 0.75 }, // ➕ opacity
            { color: "rgba(255,255,255,0.9)", position: 73, opacity: 0.9 }, // ➕ opacity
            { color: "rgba(255,255,255,1)", position: 100, opacity: 1 }, // ➕ opacity
          ],
        },
      },
      content: {
        fontSize: "14px",
        lineHeight: "1.6",
        columnGap: "32px",
      },
    },

    // ========================================
    // CUBO 3D (Componente Independiente)
    // ========================================
    cubo3D: {
      size: 280,
      perspective: 1200,
      borderWidth: "0.5px",
      borderColor: "rgba(255,255,255,0.2)",
      faceOpacity: 0.95,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      animationSpeed: 20,
      enableAnimation: true,
      enableShadows: true,
      // Layout para drag & drop del cubo 3D independiente
      layout: {
        position: { x: 600, y: 200 },
        size: { width: 280, height: 280 },
      },
    },
  },

  // ============================================
  // ELEMENTOS PERSONALIZADOS
  // ============================================
  customElements: [], // Array vacío por defecto, se llena cuando el usuario añade elementos
};

