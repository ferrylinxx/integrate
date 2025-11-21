"use client";

import { useRef, forwardRef, useImperativeHandle, Suspense, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { AnswerValue } from "@/lib/types";
import { VALUE_COLORS, AREA_NAMES, AREA_COLORS, SUB_AREA_NAMES_BY_AREA } from "@/lib/constants";

interface Cube3DProps {
  data: AnswerValue[];
  autoRotate?: boolean;
  onAutoRotateChange?: (autoRotate: boolean) => void;
  onOrbitChange?: () => void;
  onFaceClick?: (areaIndex: number) => void;
  onCellClick?: (areaIndex: number, subAreaIndex: number) => void;
}

// Componente de partículas que emergen al hacer clic
interface Particle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  color: string;
}

function ClickParticles({ particles }: { particles: Particle[] }) {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    particlesRef.current.children.forEach((child, index) => {
      const particle = particles[index];
      if (!particle) return;

      // Actualizar posición
      child.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Aplicar gravedad
      particle.velocity.y -= delta * 2;

      // Reducir vida
      particle.life -= delta;

      // Actualizar opacidad basada en vida
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, particle.life);
    });
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle) => (
        <mesh key={particle.id} position={particle.position}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={particle.life} />
        </mesh>
      ))}
    </group>
  );
}

export interface FacePosition {
  x: number;
  y: number;
  visible: boolean;
  areaIndex: number;
}

export interface Cube3DRef {
  getCanvas: () => HTMLCanvasElement | null;
  getFacePositions: () => FacePosition[];
  rotateTo: (areaIndex: number) => void;
  resetZoom: () => void;
}

// Función para convertir hex a RGB
function hex2rgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Función para calcular el porcentaje de cumplimiento basado en el valor (1-4)
function calculatePercentage(value: number): number {
  // Valor en escala 1-4 → Porcentaje 0-100%
  return (value / 4) * 100;
}

// TAREA 2: Función para crear degradados basados en porcentaje de cumplimiento
// El gradiente va desde translúcido (arriba, no cumplido) hasta el color del área (abajo, cumplido)
// Más color = mejor desempeño, más translúcido = peor desempeño
function createGradientTexture(areaColor: string, value: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;  // Alta resolución para degradados suaves
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Calcular porcentaje de cumplimiento
  const percentage = calculatePercentage(value);

  // Convertir color del área a RGB
  const rgb = hex2rgb(areaColor);

  // Aumentar saturación del color del área (multiplicar por 1.1, limitar a 255)
  const saturatedRgb = {
    r: Math.min(Math.round(rgb.r * 1.1), 255),
    g: Math.min(Math.round(rgb.g * 1.1), 255),
    b: Math.min(Math.round(rgb.b * 1.1), 255)
  };

  // Crear gradiente vertical (de arriba hacia abajo)
  // ARRIBA = translúcido (no cumplido), ABAJO = color del área (cumplido)
  const gradient = ctx.createLinearGradient(0, 0, 0, 512);

  // Calcular el punto de transición basado en el porcentaje
  // El color del área ocupa el percentage% desde ABAJO
  // La parte translúcida ocupa el (100-percentage)% desde ARRIBA
  const translucentStop = (100 - percentage) / 100;

  if (percentage < 100) {
    // Crear un degradado MÁS AGRESIVO y visible
    // Parte superior: MUY translúcido (representa lo "no cumplido")
    gradient.addColorStop(0, `rgba(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}, 0.05)`);

    // Transición MÁS AGRESIVA para que el degradado sea muy visible
    const blendZone = 0.35; // Zona de transición más amplia para efecto más dramático
    const blendStart = Math.max(0, translucentStop - blendZone / 2);
    const blendEnd = Math.min(1, translucentStop + blendZone / 2);

    // Inicio de la transición: muy translúcido
    if (blendStart > 0) {
      gradient.addColorStop(blendStart, `rgba(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}, 0.1)`);
    }

    // Punto medio de la transición: opacidad media
    gradient.addColorStop(translucentStop, `rgba(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}, 0.5)`);

    // Fin de la transición: opacidad alta
    if (blendEnd < 1) {
      gradient.addColorStop(blendEnd, `rgba(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}, 0.85)`);
    }

    // Parte inferior: color del área saturado y MUY OPACO (representa lo "cumplido")
    gradient.addColorStop(1, `rgba(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}, 0.98)`);
  } else {
    // 100% cumplimiento: todo el color del área saturado y muy opaco
    gradient.addColorStop(0, `rgba(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}, 0.98)`);
    gradient.addColorStop(1, `rgba(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b}, 0.98)`);
  }

  // Aplicar gradiente
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  // Crear textura de Three.js con mejor calidad
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}

// Componente para una cara del cubo - VERSIÓN SIMPLIFICADA (una sola cara por área)
function CubeFace({
  position,
  rotation,
  values,
  areaName,
  areaIndex,
  onFaceClick,
  onCellClick,
  explosionOffset = 0,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  values: AnswerValue[];
  areaName: string;
  areaIndex: number;
  onFaceClick?: (areaIndex: number, position: THREE.Vector3) => void;
  onCellClick?: (areaIndex: number, subAreaIndex: number) => void;
  explosionOffset?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const areaColor = AREA_COLORS[areaIndex];

  // Calcular el promedio de las 4 sub-áreas
  const averageValue = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Crear textura de gradiente basada en el promedio del área
  const faceGradientTexture = useMemo(() => {
    return createGradientTexture(areaColor, averageValue);
  }, [averageValue, areaColor]);

  // Animar explosión
  useFrame(() => {
    if (groupRef.current) {
      // Calcular offset de explosión basado en la normal de la cara
      const normal = new THREE.Vector3(0, 0, 1);
      const explosionDistance = explosionOffset * 0.3;

      // Aplicar offset en la dirección de la normal
      const targetPosition = new THREE.Vector3(...position);
      targetPosition.add(normal.multiplyScalar(explosionDistance));

      // Interpolar suavemente
      groupRef.current.position.lerp(targetPosition, 0.1);
    }
  });

  // Estado para detectar clicks vs arrastres
  const mouseDownTimeRef = useRef<number>(0);
  const mouseDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Cara única con gradiente basado en el promedio */}
      <mesh
        ref={meshRef}
        onPointerDown={(e) => {
          // Guardar tiempo y posición del mouse al hacer click
          mouseDownTimeRef.current = Date.now();
          mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          e.stopPropagation();

          // Calcular tiempo transcurrido y distancia movida
          const timeDiff = Date.now() - mouseDownTimeRef.current;
          const distanceMoved = Math.sqrt(
            Math.pow(e.clientX - mouseDownPosRef.current.x, 2) +
            Math.pow(e.clientY - mouseDownPosRef.current.y, 2)
          );

          console.log('🖱️ PointerUp - Tiempo:', timeDiff, 'ms, Distancia:', distanceMoved, 'px');

          // Solo disparar click si fue rápido (<500ms) y sin mucho movimiento (<10px)
          // Valores más permisivos para permitir clicks normales
          if (timeDiff < 500 && distanceMoved < 10) {
            console.log('✅ Click válido detectado en área:', areaIndex);
            // Obtener posición mundial del mesh
            const worldPos = new THREE.Vector3();
            meshRef.current?.getWorldPosition(worldPos);
            onFaceClick?.(areaIndex, worldPos);
          } else {
            console.log('❌ Click ignorado (arrastre detectado)');
          }
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={faceGradientTexture}
          transparent
          opacity={0.98}
          roughness={0.3}
          metalness={0.4}
          emissive="#000000"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Etiqueta del área */}
      <Suspense fallback={null}>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
          outlineOpacity={0.9}
          maxWidth={0.9}
          textAlign="center"
        >
          {areaName.replace('Área 1: ', '').replace('Área 2: ', '').replace('Área 3: ', '').replace('Área 4: ', '').replace('Área 5: ', '').replace('Área 6: ', '')}
        </Text>
      </Suspense>
    </group>
  );
}

// Componente principal del cubo 3D
function Cube({
  data,
  autoRotate = true,
  onFacePositionsUpdate,
  targetRotationRef,
  isAnimatingRef,
  groupRef,
  onFaceClick,
  onCellClick,
  userInteractingRef
}: {
  data: AnswerValue[];
  autoRotate?: boolean;
  onFacePositionsUpdate?: (positions: FacePosition[]) => void;
  targetRotationRef?: React.MutableRefObject<THREE.Euler | null>;
  isAnimatingRef?: React.MutableRefObject<boolean>;
  groupRef?: React.MutableRefObject<THREE.Group | null>;
  onFaceClick?: (areaIndex: number) => void;
  onCellClick?: (areaIndex: number, subAreaIndex: number) => void;
  userInteractingRef?: React.MutableRefObject<boolean>;
}) {
  const localGroupRef = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const clickStartTimeRef = useRef<number>(0);
  const clickStartPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Estados para animaciones
  const [exploded, setExploded] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const explosionProgress = useRef(0);

  // Usar groupRef pasado como prop o el local
  const activeGroupRef = groupRef || localGroupRef;

  // Función para crear partículas al hacer clic
  const createParticles = (position: THREE.Vector3, color: string) => {
    const newParticles: Particle[] = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 0.5 + Math.random() * 0.5;

      newParticles.push({
        id: Date.now() + i,
        position: position.clone(),
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.random() * speed + 0.5,
          Math.sin(angle) * speed
        ),
        life: 1,
        color: color
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Limpiar partículas muertas después de 2 segundos
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id < Date.now() - 2000));
    }, 2000);
  };

  // Manejar clic en cara con efectos
  const handleFaceClickWithEffects = (areaIndex: number, position: THREE.Vector3) => {
    console.log('🖱️ Click en cara detectado:', areaIndex);

    // Crear partículas
    const color = AREA_COLORS[areaIndex];
    createParticles(position, color);

    // Activar efecto de explosión
    setExploded(true);
    explosionProgress.current = 0;

    // Desactivar explosión después de 0.5 segundos
    setTimeout(() => {
      setExploded(false);
    }, 500);

    // Llamar al callback original
    onFaceClick?.(areaIndex);
  };

  // Rotación automática suave (solo si autoRotate está activado)
  useFrame((state, delta) => {
    if (activeGroupRef.current) {
      // Animar efecto de explosión
      if (exploded) {
        explosionProgress.current = Math.min(explosionProgress.current + delta * 4, 1);
      } else if (explosionProgress.current > 0) {
        explosionProgress.current = Math.max(explosionProgress.current - delta * 4, 0);
      }

      // Si hay una rotación objetivo, interpolar hacia ella usando CUATERNIONES
      if (targetRotationRef?.current) {
        if (isAnimatingRef) {
          isAnimatingRef.current = true; // Marcar que estamos animando
        }

        // Convertir rotaciones Euler a Cuaterniones para interpolación suave
        const currentQuaternion = new THREE.Quaternion();
        currentQuaternion.setFromEuler(activeGroupRef.current.rotation);

        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromEuler(targetRotationRef.current);

        // Interpolar usando SLERP (Spherical Linear Interpolation)
        // Esto evita problemas de gimbal lock y rotaciones erráticas
        currentQuaternion.slerp(targetQuaternion, 0.1);

        // Aplicar la rotación interpolada al grupo
        activeGroupRef.current.quaternion.copy(currentQuaternion);

        // Calcular distancia angular entre cuaterniones
        const dotProduct = currentQuaternion.dot(targetQuaternion);
        const angularDistance = 2 * Math.acos(Math.min(Math.abs(dotProduct), 1));

        // Si está cerca del objetivo (menos de 0.01 radianes ≈ 0.57 grados), detener la animación
        if (angularDistance < 0.01) {
          console.log('🎯 Rotation animation completed');
          console.log('   Final rotation:', activeGroupRef.current.rotation);
          targetRotationRef.current = null;
          if (isAnimatingRef) {
            isAnimatingRef.current = false; // Animación completada
          }
        }
      } else {
        if (isAnimatingRef) {
          isAnimatingRef.current = false; // No hay animación activa
        }

        if (autoRotate) {
          // Rotación automática solo si no hay objetivo
          activeGroupRef.current.rotation.y += delta * 0.1;
        }
      }
    }

    // Calcular posiciones de las caras y su visibilidad
    if (activeGroupRef.current && onFacePositionsUpdate) {
      const facePositions: FacePosition[] = [];
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);

      faces.forEach((face, index) => {
        // Crear un vector para la posición de la cara en el espacio del mundo
        const faceWorldPos = new THREE.Vector3(...face.position);
        faceWorldPos.applyMatrix4(activeGroupRef.current!.matrixWorld);

        // Proyectar a coordenadas de pantalla
        const projected = faceWorldPos.clone().project(camera);
        const x = (projected.x * 0.5 + 0.5) * size.width;
        const y = (-(projected.y * 0.5) + 0.5) * size.height;

        // Calcular la normal de la cara en el espacio del mundo
        const faceNormal = new THREE.Vector3(0, 0, 1);
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationFromEuler(new THREE.Euler(...face.rotation));
        faceNormal.applyMatrix4(rotationMatrix);
        faceNormal.applyMatrix4(activeGroupRef.current!.matrixWorld);
        faceNormal.normalize();

        // Calcular vector desde la cara hacia la cámara
        const toCameraVector = new THREE.Vector3();
        toCameraVector.subVectors(camera.position, faceWorldPos).normalize();

        // La cara es visible si su normal apunta hacia la cámara
        const dotProduct = faceNormal.dot(toCameraVector);
        const visible = dotProduct > 0;

        facePositions.push({
          x,
          y,
          visible,
          areaIndex: index
        });
      });

      onFacePositionsUpdate(facePositions);
    }
  });

  // Dividir los 24 valores en 6 áreas de 4 valores cada una
  const faces = [
    {
      // Cara frontal (Área 1)
      position: [0, 0, 0.5] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      values: data.slice(0, 4),
      areaName: AREA_NAMES[0],
    },
    {
      // Cara trasera (Área 2)
      position: [0, 0, -0.5] as [number, number, number],
      rotation: [0, Math.PI, 0] as [number, number, number],
      values: data.slice(4, 8),
      areaName: AREA_NAMES[1],
    },
    {
      // Cara superior (Área 3)
      position: [0, 0.5, 0] as [number, number, number],
      rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
      values: data.slice(8, 12),
      areaName: AREA_NAMES[2],
    },
    {
      // Cara inferior (Área 4)
      position: [0, -0.5, 0] as [number, number, number],
      rotation: [Math.PI / 2, 0, 0] as [number, number, number],
      values: data.slice(12, 16),
      areaName: AREA_NAMES[3],
    },
    {
      // Cara derecha (Área 5)
      position: [0.5, 0, 0] as [number, number, number],
      rotation: [0, Math.PI / 2, 0] as [number, number, number],
      values: data.slice(16, 20),
      areaName: AREA_NAMES[4],
    },
    {
      // Cara izquierda (Área 6)
      position: [-0.5, 0, 0] as [number, number, number],
      rotation: [0, -Math.PI / 2, 0] as [number, number, number],
      values: data.slice(20, 24),
      areaName: AREA_NAMES[5],
    },
  ];

  return (
    <>
      <group ref={activeGroupRef}>
        {faces.map((face, index) => (
          <CubeFace
            key={index}
            {...face}
            areaIndex={index}
            onFaceClick={handleFaceClickWithEffects}
            onCellClick={onCellClick}
            explosionOffset={explosionProgress.current}
          />
        ))}
      </group>

      {/* Partículas de clic */}
      {particles.length > 0 && <ClickParticles particles={particles} />}
    </>
  );
}

// Componente exportado con Canvas
// Componente para controlar el zoom de la cámara
function CameraZoom({ targetZoom, onZoomComplete }: { targetZoom: number; onZoomComplete?: () => void }) {
  const { camera } = useThree();
  const currentZoom = useRef(2.5);
  const hasCompleted = useRef(false);

  useFrame(() => {
    // Interpolar suavemente hacia el zoom objetivo
    currentZoom.current += (targetZoom - currentZoom.current) * 0.1;

    // Actualizar posición de la cámara manteniendo la dirección
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();

    const distance = currentZoom.current;
    camera.position.set(
      direction.x * -distance,
      direction.y * -distance,
      direction.z * -distance
    );

    // Verificar si llegamos al objetivo
    if (Math.abs(currentZoom.current - targetZoom) < 0.01 && !hasCompleted.current) {
      hasCompleted.current = true;
      onZoomComplete?.();
    }
  });

  return null;
}

// Componente interno para acceder al canvas
function CanvasAccessor({ onCanvasReady }: { onCanvasReady: (canvas: HTMLCanvasElement) => void }) {
  const { gl } = useThree();

  useRef(() => {
    onCanvasReady(gl.domElement);
  }).current;

  return null;
}

export const Cube3D = forwardRef<Cube3DRef, Cube3DProps>(({ data, autoRotate = true, onAutoRotateChange, onOrbitChange, onFaceClick, onCellClick }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const facePositionsRef = useRef<FacePosition[]>([]);
  const targetRotationRef = useRef<THREE.Euler | null>(null);
  const orbitControlsRef = useRef<any>(null);
  const isAnimatingRef = useRef<boolean>(false); // Flag para saber si estamos animando
  const userInteractingRef = useRef<boolean>(false); // Flag para saber si el usuario está interactuando
  const groupRef = useRef<THREE.Group | null>(null); // Referencia al grupo del cubo
  const [cameraZoom, setCameraZoom] = useState(2.5); // Estado para el zoom de la cámara

  // Definir las rotaciones objetivo para cada cara (área)
  // IMPORTANTE: Estas son las rotaciones INVERSAS de las caras para rotar el cubo hacia ellas
  // Cara con rotación [a, b, c] → Rotar cubo [-a, -b, -c] para verla de frente
  const faceRotations = [
    new THREE.Euler(0, 0, 0),             // Área 0 (Estrategia) - Cara frontal [0, 0, 0]
    new THREE.Euler(0, Math.PI, 0),       // Área 1 (Estructura) - Cara trasera [0, π, 0]
    new THREE.Euler(Math.PI / 2, 0, 0),   // Área 2 (Orientación) - Cara superior [-π/2, 0, 0] → rotar [π/2, 0, 0]
    new THREE.Euler(-Math.PI / 2, 0, 0),  // Área 3 (Eficacia) - Cara inferior [π/2, 0, 0] → rotar [-π/2, 0, 0]
    new THREE.Euler(0, -Math.PI / 2, 0),  // Área 4 (Recursos) - Cara derecha [0, π/2, 0] → rotar [0, -π/2, 0]
    new THREE.Euler(0, Math.PI / 2, 0),   // Área 5 (Personas) - Cara izquierda [0, -π/2, 0] → rotar [0, π/2, 0]
  ];

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getFacePositions: () => facePositionsRef.current,
    rotateTo: (areaIndex: number) => {
      if (areaIndex >= 0 && areaIndex < 6) {
        console.log(`🎯 Cube3D.rotateTo called for area ${areaIndex}`);

        // Log de la rotación actual del cubo (antes de cambiar)
        if (groupRef.current) {
          console.log(`   Current rotation:`, {
            x: groupRef.current.rotation.x,
            y: groupRef.current.rotation.y,
            z: groupRef.current.rotation.z
          });
        }

        console.log(`   Target rotation:`, {
          x: faceRotations[areaIndex].x,
          y: faceRotations[areaIndex].y,
          z: faceRotations[areaIndex].z
        });

        // Detener auto-rotación
        if (onAutoRotateChange) {
          onAutoRotateChange(false);
          console.log('   ⏸️ Auto-rotation stopped');
        }

        // Establecer rotación objetivo (crear una NUEVA instancia para evitar referencias)
        targetRotationRef.current = faceRotations[areaIndex].clone();
        console.log('   ✅ Target rotation set');

        // Hacer zoom a la cara seleccionada
        setCameraZoom(1.8);
        console.log('   🔍 Zooming to face');
      } else {
        console.warn(`⚠️ Invalid area index: ${areaIndex}`);
      }
    },
    resetZoom: () => {
      console.log('🔍 Resetting zoom to default');
      setCameraZoom(2.5);
    },
  }));

  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };

  const handleFacePositionsUpdate = (positions: FacePosition[]) => {
    facePositionsRef.current = positions;
  };

  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px]">
      {/* AJUSTE 2: Reducida altura de 650px/850px/1000px a 500px/600px/700px */}
      <Canvas
        camera={{ position: [2, 2, 2], fov: 50 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,  // Mejor mapeo de tonos
          toneMappingExposure: 1.2,                  // Exposición ajustada
          alpha: true                                 // Habilitar transparencia
        }}
        style={{ background: 'transparent' }}
      >
        <CanvasAccessor onCanvasReady={handleCanvasReady} />

        {/* TAREA 3: Iluminación Mejorada y Profesional */}
        {/* Luz ambiental suave para iluminación base */}
        <ambientLight intensity={0.7} color="#ffffff" />

        {/* Luz hemisférica para simular ambiente natural */}
        <hemisphereLight
          skyColor="#b8d4ff"      // Azul cielo suave
          groundColor="#8b7355"   // Tierra cálida
          intensity={0.6}
        />

        {/* Luz direccional principal con sombras suaves */}
        <directionalLight
          position={[8, 8, 8]}
          intensity={1.0}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Luz direccional de relleno para suavizar sombras */}
        <directionalLight
          position={[-6, -6, -6]}
          intensity={0.4}
          color="#e8f4ff"
        />

        {/* Luces puntuales para resaltar bordes */}
        <pointLight position={[3, 3, 3]} intensity={0.5} color="#ffffff" />
        <pointLight position={[-3, -3, -3]} intensity={0.3} color="#a8d8ff" />

        {/* Luz spot para efecto dramático */}
        <spotLight
          position={[0, 10, 0]}
          intensity={0.6}
          angle={0.4}
          penumbra={1}
          color="#ffffff"
          castShadow
        />

        {/* Cubo envuelto en Suspense para evitar errores de carga */}
        <Suspense fallback={null}>
          <Cube
            data={data}
            autoRotate={autoRotate}
            onFacePositionsUpdate={handleFacePositionsUpdate}
            targetRotationRef={targetRotationRef}
            isAnimatingRef={isAnimatingRef}
            groupRef={groupRef}
            onFaceClick={onFaceClick}
            onCellClick={onCellClick}
            userInteractingRef={userInteractingRef}
          />
        </Suspense>

        {/* Control de zoom de cámara */}
        <CameraZoom targetZoom={cameraZoom} />

        {/* Controles de órbita (rotación con mouse y gestos táctiles mejorados) */}
        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={1}
          zoomSpeed={1.2}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
          onStart={() => {
            // Usuario empezó a interactuar (mouse down / touch start)
            userInteractingRef.current = true;
            console.log('👆 User started interacting with controls');

            // Si hay una animación en curso, cancelarla
            if (targetRotationRef.current) {
              console.log('⏹️ Cancelling animation due to user interaction');
              targetRotationRef.current = null;
              isAnimatingRef.current = false;
            }

            // Resetear zoom al interactuar
            setCameraZoom(2.5);
          }}
          onEnd={() => {
            // Usuario terminó de interactuar (mouse up / touch end)
            userInteractingRef.current = false;
            console.log('👋 User stopped interacting with controls');

            // Notificar al componente padre que el usuario rotó manualmente
            if (onOrbitChange) {
              onOrbitChange();
            }
          }}
        />

        {/* TAREA 3: Efectos de Postprocesamiento Mejorados */}
        <EffectComposer>
          {/* Profundidad de campo sutil para efecto profesional */}
          <DepthOfField
            focusDistance={0.01}
            focalLength={0.04}
            bokehScale={1.2}
            height={480}
          />

          {/* Bloom mejorado para efectos de brillo más atractivos */}
          <Bloom
            intensity={0.5}           // Aumentado para mayor brillo
            luminanceThreshold={0.85} // Reducido para más áreas con brillo
            luminanceSmoothing={0.95}
            height={400}              // Mayor resolución
            mipmapBlur={true}         // Blur más suave
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
});

Cube3D.displayName = "Cube3D";

