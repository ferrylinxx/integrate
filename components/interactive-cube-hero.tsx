"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

// Colores INTEGRATE oficiales para cada cara
// 🔮 Orden alternativo: Pares opuestos simultáneos (Frente+Atrás, Arriba+Abajo, Izq+Der)
const CUBE_FACES = [
  { name: 'Estrategia', color: '#4D4DFF', position: [0, 0, 1.5] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], entryFrom: [0, 5, 8] as [number, number, number], delay: 0 },
  { name: 'Estructura', color: '#763AD6', position: [0, 0, -1.5] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number], entryFrom: [0, -5, -8] as [number, number, number], delay: 0 },
  { name: 'Orientación', color: '#8E235D', position: [0, 1.5, 0] as [number, number, number], rotation: [-Math.PI / 2, 0, 0] as [number, number, number], entryFrom: [5, 8, 0] as [number, number, number], delay: 300 },
  { name: 'Eficacia', color: '#E65B3E', position: [0, -1.5, 0] as [number, number, number], rotation: [Math.PI / 2, 0, 0] as [number, number, number], entryFrom: [-5, -8, 0] as [number, number, number], delay: 300 },
  { name: 'Recursos', color: '#F08726', position: [1.5, 0, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number], entryFrom: [8, 0, 5] as [number, number, number], delay: 600 },
  { name: 'Personas', color: '#D91D5C', position: [-1.5, 0, 0] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number], entryFrom: [-8, 0, -5] as [number, number, number], delay: 600 },
];

// 🎬 Componente para Camera Shake
function CameraShake({ intensity, decay }: { intensity: number; decay: number }) {
  const { camera } = useThree();
  const initialPos = useRef(camera.position.clone());
  const shakeRef = useRef(intensity);

  useFrame(() => {
    if (shakeRef.current > 0.001) {
      camera.position.x = initialPos.current.x + (Math.random() - 0.5) * shakeRef.current;
      camera.position.y = initialPos.current.y + (Math.random() - 0.5) * shakeRef.current;
      shakeRef.current *= decay;
    } else {
      camera.position.copy(initialPos.current);
    }
  });

  return null;
}

interface CubeFaceProps {
  name: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  entryFrom: [number, number, number];
  delay: number;
  shouldAnimate: boolean;
  onLanded?: () => void;
}

// 🎯 Función para interpolar trayectoria curva (Arc)
function getArcPosition(
  from: [number, number, number],
  to: [number, number, number],
  progress: number
): [number, number, number] {
  // Interpolación lineal base
  const x = from[0] + (to[0] - from[0]) * progress;
  const y = from[1] + (to[1] - from[1]) * progress;
  const z = from[2] + (to[2] - from[2]) * progress;

  // Añadir arco parabólico (más alto en el medio)
  const arcHeight = 2.5;
  const arc = Math.sin(progress * Math.PI) * arcHeight;

  return [x, y + arc * 0.5, z];
}

// Cara del cubo con efecto glass morphism y entrada con arco
function CubeFace({ name, color, position, rotation, entryFrom, delay, shouldAnimate, onLanded }: CubeFaceProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [triggered, setTriggered] = useState(false);
  const [landed, setLanded] = useState(false);
  const progressRef = useRef(0);
  const startTimeRef = useRef(0);

  // Trigger de la animación con delay
  useEffect(() => {
    if (shouldAnimate && !triggered) {
      const timer = setTimeout(() => {
        setTriggered(true);
        startTimeRef.current = Date.now();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, delay, triggered]);

  // 🎯 Animación con trayectoria curva (Arc) + 💎 Materialización gradual
  useFrame(() => {
    if (triggered && !landed && groupRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      const duration = 800; // ms
      const progress = Math.min(elapsed / duration, 1);

      // Easing: easeOutBack para rebote sutil
      const eased = 1 - Math.pow(1 - progress, 3);
      progressRef.current = eased;

      // Aplicar posición con arco
      const arcPos = getArcPosition(entryFrom, position, eased);
      groupRef.current.position.set(arcPos[0], arcPos[1], arcPos[2]);

      // 💎 Materialización: escala crece durante el vuelo
      const scale = 0.3 + eased * 0.7;
      groupRef.current.scale.setScalar(scale);

      if (progress >= 1) {
        setLanded(true);
        onLanded?.();
      }
    }
  });

  // Opacidad animada para materialización
  const { opacity, glassOpacity } = useSpring({
    opacity: landed ? 1 : triggered ? 0.7 : 0,
    glassOpacity: landed ? 0.15 : triggered ? 0.08 : 0,
    config: { mass: 1, tension: 200, friction: 20 }
  });

  return (
    <animated.group
      ref={groupRef}
      rotation={rotation}
      position={entryFrom}
      scale={0.3}
    >
      {/* Cara principal con glass morphism mejorado */}
      <animated.mesh>
        <planeGeometry args={[2.95, 2.95]} />
        <animated.meshPhysicalMaterial
          color={color}
          transparent={true}
          opacity={glassOpacity}
          metalness={0.1}
          roughness={0.05}
          transmission={0.92}
          thickness={2.0}
          ior={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          reflectivity={0.8}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
          attenuationColor={new THREE.Color(color)}
          attenuationDistance={0.5}
        />
      </animated.mesh>

      {/* Borde interior con glow del color del área */}
      <animated.lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.9, 2.9)]} />
        <animated.lineBasicMaterial
          color={color}
          transparent={true}
          opacity={opacity.to(o => o * 0.6)}
        />
      </animated.lineSegments>

      {/* Borde exterior blanco brillante */}
      <animated.lineSegments position={[0, 0, 0.02]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.95, 2.95)]} />
        <animated.lineBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={opacity.to(o => o * 0.9)}
        />
      </animated.lineSegments>
    </animated.group>
  );
}

// ✨ Bordes progresivos que aparecen cuando las caras aterrizan
function ProgressiveEdges({ facesLanded }: { facesLanded: number }) {
  // Los bordes aparecen gradualmente según cuántas caras han aterrizado
  const opacity = Math.min(facesLanded / 6, 1) * 0.5;

  const { animatedOpacity } = useSpring({
    animatedOpacity: opacity,
    config: { mass: 1, tension: 120, friction: 20 }
  });

  if (facesLanded === 0) return null;

  return (
    <animated.lineSegments>
      <edgesGeometry args={[new THREE.BoxGeometry(3, 3, 3)]} />
      <animated.lineBasicMaterial
        color="white"
        transparent
        opacity={animatedOpacity}
      />
    </animated.lineSegments>
  );
}

// Cubo rotando con animación de entrada Building Blocks mejorada
function RotatingCube({
  scale = 1,
  shouldAnimate,
  onFaceLanded,
  onAllFacesLanded
}: {
  scale?: number;
  shouldAnimate: boolean;
  onFaceLanded?: () => void;
  onAllFacesLanded?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const [facesLanded, setFacesLanded] = useState(0);
  const [canRotate, setCanRotate] = useState(false);

  // Callback cuando una cara aterriza
  const handleFaceLanded = () => {
    setFacesLanded(prev => {
      const newCount = prev + 1;
      if (newCount >= 6) {
        setTimeout(() => {
          setCanRotate(true);
          onAllFacesLanded?.();
        }, 200);
      }
      onFaceLanded?.();
      return newCount;
    });
  };

  // Animación de escala del grupo
  const { animatedScale } = useSpring({
    animatedScale: scale,
    config: { mass: 1, tension: 120, friction: 20 }
  });

  useFrame((state, delta) => {
    if (groupRef.current && canRotate) {
      timeRef.current += delta;
      // Rotación suave en Y con leve oscilación en X
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.5) * 0.1;
    }
  });

  return (
    <animated.group ref={groupRef} scale={animatedScale}>
      {CUBE_FACES.map((face, index) => (
        <CubeFace
          key={index}
          {...face}
          shouldAnimate={shouldAnimate}
          onLanded={handleFaceLanded}
        />
      ))}

      {/* ✨ Bordes progresivos - aparecen gradualmente */}
      <ProgressiveEdges facesLanded={facesLanded} />
    </animated.group>
  );
}

interface InteractiveCubeHeroProps {
  disableManualRotation?: boolean;
  scale?: number;
}

export function InteractiveCubeHero({ disableManualRotation = false, scale = 1 }: InteractiveCubeHeroProps) {
  // Estado para iniciar la animación Building Blocks
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [triggerShake, setTriggerShake] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  // Iniciar animación después de un pequeño delay
  useEffect(() => {
    const timer = setTimeout(() => setShouldAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // 🎬 Camera shake cuando aterrizan las caras
  const handleFaceLanded = () => {
    setShakeIntensity(0.03); // Shake sutil
    setTriggerShake(true);
  };

  // Reset shake después de cada uso
  useEffect(() => {
    if (triggerShake) {
      const timer = setTimeout(() => setTriggerShake(false), 100);
      return () => clearTimeout(timer);
    }
  }, [triggerShake]);

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '400px' }}>
      {/* Canvas 3D con React Three Fiber */}
      <div className="w-full h-full" style={{ minHeight: '400px' }}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          {/* 🎬 Camera Shake sutil */}
          {triggerShake && <CameraShake intensity={shakeIntensity} decay={0.92} />}

          {/* ⚡ ILUMINACIÓN OPTIMIZADA */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 10]} intensity={1.8} color="#ffffff" />
          <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#a8c8ff" />
          <pointLight position={[0, 0, -8]} intensity={2.5} color="#ffffff" />

          {/* 💫 ENVIRONMENT MAP para reflejos realistas */}
          <Environment preset="city" />

          {/* 🎲 Cubo principal con Building Blocks mejorado */}
          <RotatingCube
            scale={scale}
            shouldAnimate={shouldAnimate}
            onFaceLanded={handleFaceLanded}
            onAllFacesLanded={() => setAnimationComplete(true)}
          />
        </Canvas>
      </div>
    </div>
  );
}