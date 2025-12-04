"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

// Colores INTEGRATE oficiales para cada cara
const CUBE_FACES = [
  { name: 'Estrategia', color: '#4D4DFF', position: [0, 0, 1.5] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
  { name: 'Estructura', color: '#763AD6', position: [0, 0, -1.5] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
  { name: 'Orientación', color: '#8E235D', position: [0, 1.5, 0] as [number, number, number], rotation: [-Math.PI / 2, 0, 0] as [number, number, number] },
  { name: 'Eficacia', color: '#E65B3E', position: [0, -1.5, 0] as [number, number, number], rotation: [Math.PI / 2, 0, 0] as [number, number, number] },
  { name: 'Recursos', color: '#F08726', position: [1.5, 0, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
  { name: 'Personas', color: '#D91D5C', position: [-1.5, 0, 0] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
];

interface CubeFaceProps {
  name: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  crystallized: number; // 0-1 progreso de cristalización
}

// Cara del cubo con efecto glass morphism mejorado
function CubeFace({ name, color, position, rotation, crystallized }: CubeFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animación de aparición de la cara
  const { opacity, glassOpacity } = useSpring({
    opacity: crystallized,
    glassOpacity: crystallized * 0.15,
    config: { mass: 1, tension: 80, friction: 26 }
  });

  return (
    <animated.group position={position} rotation={rotation}>
      {/* Cara principal con glass morphism mejorado */}
      <animated.mesh ref={meshRef}>
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

      {/* Efecto de brillo prismático en el borde */}
      <animated.lineSegments position={[0, 0, 0.03]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.0, 3.0)]} />
        <animated.lineBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={opacity.to(o => o * 0.3)}
        />
      </animated.lineSegments>
    </animated.group>
  );
}

// Partículas que convergen para formar el cubo (efecto cristalización)
function CrystallizationParticles({
  progress,
  onComplete
}: {
  progress: number;
  onComplete?: () => void;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 150;

  // Generar posiciones iniciales (dispersas) y finales (en el cubo)
  const { initialPositions, finalPositions, colors } = useMemo(() => {
    const initial: number[] = [];
    const final: number[] = [];
    const cols: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Posición inicial: esfera grande alrededor
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 + Math.random() * 4;
      initial.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      // Posición final: superficie del cubo
      const face = Math.floor(Math.random() * 6);
      let x = 0, y = 0, z = 0;
      const size = 1.5;
      const offset = (Math.random() - 0.5) * 2.8;
      const offset2 = (Math.random() - 0.5) * 2.8;

      switch(face) {
        case 0: x = offset; y = offset2; z = size; break;  // Frente
        case 1: x = offset; y = offset2; z = -size; break; // Atrás
        case 2: x = offset; y = size; z = offset2; break;  // Arriba
        case 3: x = offset; y = -size; z = offset2; break; // Abajo
        case 4: x = size; y = offset; z = offset2; break;  // Derecha
        case 5: x = -size; y = offset; z = offset2; break; // Izquierda
      }
      final.push(x, y, z);

      // Color basado en la cara
      const faceColor = new THREE.Color(CUBE_FACES[face].color);
      cols.push(faceColor.r, faceColor.g, faceColor.b);
    }

    return {
      initialPositions: new Float32Array(initial),
      finalPositions: new Float32Array(final),
      colors: new Float32Array(cols)
    };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount * 3; i++) {
        // Interpolar entre posición inicial y final
        positions[i] = initialPositions[i] + (finalPositions[i] - initialPositions[i]) * progress;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;

      // Fade out cuando se completa
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = progress < 0.95 ? 0.8 : (1 - progress) * 16;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={initialPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Cubo rotando con animación de entrada
function RotatingCube({
  scale = 1,
  crystallized
}: {
  scale?: number;
  crystallized: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Animación suave de escala con react-spring
  const { animatedScale } = useSpring({
    animatedScale: scale * crystallized,
    config: {
      mass: 2,
      tension: 80,
      friction: 30,
      clamp: true,
    }
  });

  useFrame((state, delta) => {
    if (groupRef.current && crystallized > 0.5) {
      timeRef.current += delta;
      // Rotación suave en Y con leve oscilación en X
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.5) * 0.1;
    }
  });

  return (
    <animated.group ref={groupRef} scale={animatedScale}>
      {CUBE_FACES.map((face, index) => (
        <CubeFace key={index} {...face} crystallized={crystallized} />
      ))}

      {/* Bordes del cubo con efecto brillante */}
      <animated.lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3, 3, 3)]} />
        <animated.lineBasicMaterial
          color="white"
          opacity={crystallized * 0.4}
          transparent
        />
      </animated.lineSegments>
    </animated.group>
  );
}

interface InteractiveCubeHeroProps {
  disableManualRotation?: boolean;
  scale?: number;
}

export function InteractiveCubeHero({ disableManualRotation = false, scale = 1 }: InteractiveCubeHeroProps) {
  // Estado para la animación de cristalización (0 = disperso, 1 = formado)
  const [crystallized, setCrystallized] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Iniciar animación de cristalización al montar
  useEffect(() => {
    // Delay inicial antes de empezar
    const startDelay = setTimeout(() => {
      // Animación progresiva de cristalización
      const duration = 2000; // 2 segundos
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing: easeOutExpo para efecto dramático
        const eased = 1 - Math.pow(1 - progress, 3);
        setCrystallized(eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimationComplete(true);
        }
      };

      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(startDelay);
  }, []);

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
          {/* ⚡ ILUMINACIÓN OPTIMIZADA: De 15+ luces a 4 estratégicas */}

          {/* 1. Luz ambiente suave */}
          <ambientLight intensity={0.6} />

          {/* 2. Luz direccional principal (sol) */}
          <directionalLight
            position={[5, 8, 10]}
            intensity={1.8}
            color="#ffffff"
          />

          {/* 3. Luz de relleno (fill light) */}
          <directionalLight
            position={[-5, -3, -5]}
            intensity={0.5}
            color="#a8c8ff"
          />

          {/* 4. Luz trasera para transmisión del vidrio */}
          <pointLight
            position={[0, 0, -8]}
            intensity={2.5}
            color="#ffffff"
          />

          {/* 💫 ENVIRONMENT MAP para reflejos realistas */}
          <Environment preset="city" />

          {/* 💎 Partículas de cristalización */}
          {!animationComplete && (
            <CrystallizationParticles progress={crystallized} />
          )}

          {/* 🎲 Cubo principal */}
          <RotatingCube scale={scale} crystallized={crystallized} />

          {/* 🔲 SOMBRA PROYECTADA DINÁMICA */}
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.4 * crystallized}
            scale={8}
            blur={2.5}
            far={4}
            color="#1a1a2e"
          />
        </Canvas>
      </div>
    </div>
  );
}