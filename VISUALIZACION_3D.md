# 🎲 Documentación Técnica - Visualización 3D del CUBO

## Descripción General

La visualización 3D del CUBO utiliza **Three.js** a través de **React Three Fiber** para renderizar un cubo interactivo que representa las 24 respuestas del test de nivel.

## Arquitectura

### Componentes Principales

#### 1. `Cube3D` (`components/cube-3d.tsx`)

Componente principal que exporta el Canvas de Three.js con el cubo renderizado.

**Props:**
- `data: AnswerValue[]` - Array de 24 valores (1-4) que representan las respuestas

**Características:**
- Canvas con configuración de cámara optimizada
- Iluminación ambiental y direccional
- Controles de órbita (OrbitControls)
- Suspense para carga progresiva

#### 2. `Cube` (componente interno)

Componente que renderiza el cubo completo con sus 6 caras.

**Características:**
- Rotación automática suave (0.1 rad/s)
- Distribución de las 24 respuestas en 6 caras
- Referencia al grupo para animación

#### 3. `CubeFace` (componente interno)

Componente que renderiza una cara individual del cubo con su grid 2×2.

**Props:**
- `position: [x, y, z]` - Posición de la cara en el espacio 3D
- `rotation: [x, y, z]` - Rotación de la cara (en radianes)
- `values: AnswerValue[]` - Array de 4 valores para el grid 2×2
- `areaName: string` - Nombre del área para el label

**Características:**
- Grid 2×2 con gap de 0.04 unidades
- Fondo gris claro (#f0f0f0)
- Labels al hacer hover
- Colores según la paleta definida

### Hook de Detección WebGL

#### `useWebGLSupport` (`lib/hooks/use-webgl-support.ts`)

Hook personalizado que detecta si el navegador soporta WebGL.

**Retorno:**
- `boolean` - `true` si WebGL está soportado, `false` en caso contrario

**Implementación:**
```typescript
export function useWebGLSupport(): boolean {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || 
                 canvas.getContext("experimental-webgl");
      setIsSupported(!!gl);
    } catch (e) {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}
```

## Mapeo de Datos

### Estructura del Cubo

El cubo tiene 6 caras, cada una representando un área de evaluación:

```
        ┌─────────────┐
        │   Área 3    │  (Superior, Y+)
        │   (8-11)    │
┌───────┼─────────────┼───────┬─────────────┐
│ Área 6│   Área 1    │ Área 5│   Área 2    │
│(20-23)│   (0-3)     │(16-19)│   (4-7)     │
└───────┼─────────────┼───────┴─────────────┘
        │   Área 4    │  (Inferior, Y-)
        │  (12-15)    │
        └─────────────┘
```

### Distribución de Respuestas

| Cara | Posición 3D | Rotación | Área | Índices |
|------|-------------|----------|------|---------|
| Frontal | `[0, 0, 0.5]` | `[0, 0, 0]` | Área 1 | 0-3 |
| Trasera | `[0, 0, -0.5]` | `[0, π, 0]` | Área 2 | 4-7 |
| Superior | `[0, 0.5, 0]` | `[-π/2, 0, 0]` | Área 3 | 8-11 |
| Inferior | `[0, -0.5, 0]` | `[π/2, 0, 0]` | Área 4 | 12-15 |
| Derecha | `[0.5, 0, 0]` | `[0, π/2, 0]` | Área 5 | 16-19 |
| Izquierda | `[-0.5, 0, 0]` | `[0, -π/2, 0]` | Área 6 | 20-23 |

### Grid 2×2 por Cara

Cada cara tiene 4 celdas distribuidas así:

```
┌─────────┬─────────┐
│ Índice 0│ Índice 1│  (Capa 1 | Capa 2)
│  Top-L  │  Top-R  │
├─────────┼─────────┤
│ Índice 2│ Índice 3│  (Capa 3 | Capa 4)
│  Bot-L  │  Bot-R  │
└─────────┴─────────┘
```

**Posiciones relativas:**
- Top-Left: `[-0.26, 0.26]`
- Top-Right: `[0.26, 0.26]`
- Bottom-Left: `[-0.26, -0.26]`
- Bottom-Right: `[0.26, -0.26]`

## Configuración de Three.js

### Canvas

```typescript
<Canvas
  camera={{ position: [2, 2, 2], fov: 50 }}
  gl={{ antialias: true }}
>
```

**Parámetros:**
- **Camera position**: `[2, 2, 2]` - Vista isométrica del cubo
- **FOV**: `50` - Campo de visión óptimo para visualización
- **Antialias**: `true` - Suavizado de bordes

### Iluminación

```typescript
<ambientLight intensity={0.6} />
<directionalLight position={[5, 5, 5]} intensity={0.8} />
<directionalLight position={[-5, -5, -5]} intensity={0.3} />
```

**Configuración:**
- **Luz ambiental**: Iluminación base uniforme (60%)
- **Luz direccional 1**: Luz principal desde arriba-derecha (80%)
- **Luz direccional 2**: Luz de relleno desde abajo-izquierda (30%)

### Controles de Órbita

```typescript
<OrbitControls
  enableZoom={true}
  enablePan={false}
  minDistance={2}
  maxDistance={5}
  autoRotate={false}
/>
```

**Parámetros:**
- **enableZoom**: Permite zoom con rueda del mouse
- **enablePan**: Deshabilitado (no se puede desplazar)
- **minDistance**: Zoom mínimo (2 unidades)
- **maxDistance**: Zoom máximo (5 unidades)
- **autoRotate**: Deshabilitado (la rotación automática se maneja en el componente Cube)

## Animación

### Rotación Automática

```typescript
useFrame((state, delta) => {
  if (groupRef.current) {
    groupRef.current.rotation.y += delta * 0.1;
  }
});
```

**Características:**
- Rotación en el eje Y (vertical)
- Velocidad: 0.1 radianes por segundo
- Se detiene al interactuar con OrbitControls
- Suave y continua

## Interactividad

### Hover sobre Caras

Cada cara detecta cuando el mouse está sobre ella y muestra un label con el nombre del área:

```typescript
const [hovered, setHovered] = useState(false);

<mesh
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
>
```

### Labels HTML

Los labels se renderizan usando el componente `Html` de `@react-three/drei`:

```typescript
{hovered && (
  <Html position={[0, 0, 0.1]} center>
    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
      {areaName}
    </div>
  </Html>
)}
```

## Optimización

### Rendimiento

1. **Geometrías simples**: Uso de `planeGeometry` en lugar de geometrías complejas
2. **Materiales estándar**: `meshStandardMaterial` con buen balance calidad/rendimiento
3. **Suspense**: Carga progresiva del componente 3D
4. **Refs**: Uso de `useRef` para evitar re-renders innecesarios

### Compatibilidad

- **Detección de WebGL**: Fallback automático a vista 2D
- **Navegadores soportados**: Chrome 56+, Firefox 51+, Safari 11+, Edge 79+
- **Dispositivos móviles**: Funciona con touch para rotación

## Personalización

### Cambiar Colores

Los colores se definen en `lib/constants.ts`:

```typescript
export const VALUE_COLORS: Record<AnswerValue, string> = {
  1: "#E53935", // Rojo
  2: "#FB8C00", // Naranja
  3: "#FDD835", // Amarillo
  4: "#43A047", // Verde
};
```

### Ajustar Velocidad de Rotación

En `components/cube-3d.tsx`, línea de `useFrame`:

```typescript
groupRef.current.rotation.y += delta * 0.1; // Cambiar 0.1 por otro valor
```

### Modificar Posición de Cámara

En el componente `Cube3D`:

```typescript
<Canvas
  camera={{ position: [2, 2, 2], fov: 50 }} // Cambiar [x, y, z]
>
```

### Ajustar Iluminación

Modificar las intensidades en el componente `Cube3D`:

```typescript
<ambientLight intensity={0.6} /> // Cambiar 0.6
<directionalLight position={[5, 5, 5]} intensity={0.8} /> // Cambiar 0.8
```

## Solución de Problemas

### El cubo no se muestra

1. Verificar que WebGL esté soportado en el navegador
2. Abrir la consola del navegador para ver errores
3. Verificar que las dependencias estén instaladas correctamente

### Rendimiento lento

1. Reducir la intensidad de las luces
2. Deshabilitar antialias en el Canvas
3. Reducir la velocidad de rotación automática

### Labels no se muestran

1. Verificar que Tailwind CSS esté cargado correctamente
2. Comprobar que el componente `Html` de drei esté importado

## Dependencias

```json
{
  "three": "^0.170.0",
  "@react-three/fiber": "^8.18.5",
  "@react-three/drei": "^9.119.1"
}
```

## Referencias

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [WebGL Fundamentals](https://webglfundamentals.org/)

---

**Última actualización**: 2025-10-27

