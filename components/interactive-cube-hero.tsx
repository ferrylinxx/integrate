"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

const CUBE_FACES = [
  { name: 'Estrategia', icon: '📊', color: '#2C248E', position: [0, 0, 1.5] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
  { name: 'Estructura', icon: '🏗️', color: '#412761', position: [0, 0, -1.5] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
  { name: 'Orientación', icon: '🎯', color: '#8E235D', position: [0, 1.5, 0] as [number, number, number], rotation: [-Math.PI / 2, 0, 0] as [number, number, number] },
  { name: 'Eficacia', icon: '⚡', color: '#E65B3E', position: [0, -1.5, 0] as [number, number, number], rotation: [Math.PI / 2, 0, 0] as [number, number, number] },
  { name: 'Recursos', icon: '💰', color: '#f0882631', position: [1.5, 0, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
  { name: 'Personas', icon: '👥', color: '#D91D5C', position: [-1.5, 0, 0] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
];

interface CubeFaceProps {
  name: string;
  icon: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

function CubeFace({ name, icon, color, position, rotation }: CubeFaceProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Cara con efecto "liquid glass" ultra-transparente estilo Apple */}
      <mesh>
        <planeGeometry args={[2.95, 2.95]} />
        <meshPhysicalMaterial
          color={color}
          transparent={true}
          opacity={0.08}
          metalness={0.05}
          roughness={0.05}
          transmission={0.98}
          thickness={1.2}
          ior={1.52}
          emissive={color}
          emissiveIntensity={0.25}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
          reflectivity={0.9}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Borde brillante con efecto glow para glassmorphism */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(2.95, 2.95)]} />
        <lineBasicMaterial
          color={color}
          transparent={true}
          opacity={0.8}
          linewidth={3}
        />
      </lineSegments>

      {/* Segundo borde con glow más suave */}
      <lineSegments position={[0, 0, 0.02]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.0, 3.0)]} />
        <lineBasicMaterial
          color="#ffffff"
          transparent={true}
          opacity={0.3}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}

function RotatingCube({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Animación suave de escala con react-spring - SIN REBOTES
  const { animatedScale } = useSpring({
    animatedScale: scale,
    config: {
      mass: 2,
      tension: 60,
      friction: 40,
      clamp: true, // Evita overshooting
      precision: 0.0001
    }
  });

  useFrame(() => {
    if (groupRef.current) {
      // Rotación continua MÁS LENTA solo en eje Y (vista recta)
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <animated.group ref={groupRef} scale={animatedScale}>
      {CUBE_FACES.map((face, index) => (
        <CubeFace key={index} {...face} />
      ))}

      {/* Bordes del cubo con efecto brillante */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3, 3, 3)]} />
        <lineBasicMaterial color="white" opacity={0.3} transparent />
      </lineSegments>
    </animated.group>
  );
}

interface InteractiveCubeHeroProps {
  disableManualRotation?: boolean;
  scale?: number;
}

export function InteractiveCubeHero({ disableManualRotation = false, scale = 1 }: InteractiveCubeHeroProps) {

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '400px' }}>


      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Canvas 3D con React Three Fiber */}
      <div className="w-full h-full" style={{ minHeight: '400px' }}>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          {/* Iluminación ultra-mejorada para efecto "liquid glass" profesional */}

          {/* Luz ambiente base */}
          <ambientLight intensity={1.2} />

          {/* Luces direccionales para reflejos y profundidad */}
          <directionalLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[-10, 10, 10]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[10, -10, 10]} intensity={1.8} color="#ffffff" />
          <directionalLight position={[-10, -10, 10]} intensity={1.5} color="#ffffff" />

          {/* Luces de color INTEGRATE para tinte sutil */}
          <pointLight position={[8, 8, 8]} intensity={1.5} color="#2C248E" />
          <pointLight position={[-8, 8, 8]} intensity={1.5} color="#8E235D" />
          <pointLight position={[8, -8, 8]} intensity={1.5} color="#F08726" />
          <pointLight position={[-8, -8, 8]} intensity={1.5} color="#E65B3E" />

          {/* Luces traseras CRÍTICAS para efecto de transmisión de vidrio */}
          <pointLight position={[0, 0, -15]} intensity={4.0} color="#ffffff" />
          <pointLight position={[5, 5, -12]} intensity={3.0} color="#ffffff" />
          <pointLight position={[-5, -5, -12]} intensity={3.0} color="#ffffff" />

          {/* Spotlight superior para brillo */}
          <spotLight position={[0, 20, 15]} angle={0.5} penumbra={1} intensity={2.5} color="#ffffff" />

          {/* Luces laterales para reflejos en bordes */}
          <pointLight position={[15, 0, 0]} intensity={2.0} color="#ffffff" />
          <pointLight position={[-15, 0, 0]} intensity={2.0} color="#ffffff" />
          <pointLight position={[0, 15, 0]} intensity={2.0} color="#ffffff" />
          <pointLight position={[0, -15, 0]} intensity={2.0} color="#ffffff" />

          <RotatingCube scale={scale} />
        </Canvas>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}