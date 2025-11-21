"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES } from "@/lib/constants";

interface InteractiveCube3DProps {
  answers: (AnswerValue | null)[];
  onFaceClick: (areaIndex: number) => void;
  hideLabels?: boolean; // Ocultar labels cuando modal está abierto
}

// Colores según el progreso del área
const getProgressColor = (answeredCount: number): string => {
  if (answeredCount === 0) return "#9CA3AF"; // Gris - Sin empezar
  if (answeredCount < 4) return "#F59E0B"; // Naranja - En progreso
  return "#10B981"; // Verde - Completo
};

// Componente para una cara del cubo interactiva
function InteractiveCubeFace({
  position,
  rotation,
  areaIndex,
  areaName,
  answeredCount,
  onClick,
  hideLabel,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  areaIndex: number;
  areaName: string;
  answeredCount: number;
  onClick: () => void;
  hideLabel?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const progressColor = getProgressColor(answeredCount);
  const displayColor = hovered ? "#3B82F6" : progressColor; // Azul al hover

  // Crear gradiente de textura para la cara
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Gradiente radial desde el centro
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, displayColor);
      gradient.addColorStop(1, new THREE.Color(displayColor).multiplyScalar(0.7).getStyle());
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [displayColor]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(true);
    setTimeout(() => setClicked(false), 300);
    onClick();
  };

  // Animación de pulso al hacer clic y hover
  useFrame((state) => {
    if (meshRef.current) {
      if (clicked) {
        const scale = 1 + Math.sin(Date.now() * 0.02) * 0.05;
        meshRef.current.scale.set(scale, scale, 1);
      } else if (hovered) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.02;
        meshRef.current.scale.set(scale, scale, 1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }

    // Animación de glow
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = hovered ? 0.3 : 0.15;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Glow effect detrás de la cara */}
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <planeGeometry args={[1.1, 1.1]} />
        <meshBasicMaterial
          color={displayColor}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cara principal clickeable */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[0.95, 0.95]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={hovered ? 0.98 : 0.92}
          roughness={0.2}
          metalness={0.3}
          emissive={displayColor}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Borde decorativo */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.95, 0.95)]} />
        <lineBasicMaterial
          color={hovered ? "#ffffff" : displayColor}
          transparent
          opacity={hovered ? 0.8 : 0.4}
          linewidth={2}
        />
      </lineSegments>

      {/* Label con nombre del área y progreso */}
      {!hideLabel && (
        <Html position={[0, 0, 0.01]} center zIndexRange={[0, 0]}>
          <div
            className="bg-white/98 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-2xl border-2 pointer-events-none transition-all duration-300"
            style={{
              borderColor: displayColor,
              boxShadow: hovered ? `0 0 20px ${displayColor}40` : undefined
            }}
          >
            <p className="text-sm font-bold text-gray-900 whitespace-nowrap text-center">
              {areaName.split(":")[0]}
            </p>
            <p className="text-xs text-gray-600 text-center mt-1 font-semibold">
              {answeredCount}/4 completadas
            </p>
          </div>
        </Html>
      )}

      {/* Borde de la cara */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.PlaneGeometry(0.95, 0.95)]}
        />
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
    </group>
  );
}

// Componente principal del cubo interactivo
function InteractiveCube({
  answers,
  onFaceClick,
  hideLabels,
}: {
  answers: (AnswerValue | null)[];
  onFaceClick: (areaIndex: number) => void;
  hideLabels?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [targetRotation, setTargetRotation] = useState<THREE.Euler | null>(null);

  // Animación de rotación suave
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (targetRotation) {
        // Interpolar hacia la rotación objetivo
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotation.x,
          0.1
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotation.y,
          0.1
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          targetRotation.z,
          0.1
        );

        // Si está cerca del objetivo, detener la animación
        const distance = Math.abs(
          groupRef.current.rotation.y - targetRotation.y
        );
        if (distance < 0.01) {
          setTargetRotation(null);
        }
      } else {
        // Rotación automática lenta cuando no hay objetivo
        groupRef.current.rotation.y += delta * 0.1;
      }
    }
  });

  // Calcular cuántas preguntas están respondidas por área
  const getAnsweredCount = (areaIndex: number): number => {
    const startIndex = areaIndex * 4;
    const areaAnswers = answers.slice(startIndex, startIndex + 4);
    return areaAnswers.filter((a) => a !== null).length;
  };

  // Manejar clic en una cara
  const handleFaceClick = (areaIndex: number, faceRotation: THREE.Euler) => {
    setTargetRotation(faceRotation.clone());
    onFaceClick(areaIndex);
  };

  // Definir las 6 caras con sus rotaciones objetivo
  const faces = [
    {
      // Cara frontal (Área 1)
      position: [0, 0, 0.5] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      targetRotation: new THREE.Euler(0, 0, 0),
      areaIndex: 0,
    },
    {
      // Cara trasera (Área 2)
      position: [0, 0, -0.5] as [number, number, number],
      rotation: [0, Math.PI, 0] as [number, number, number],
      targetRotation: new THREE.Euler(0, Math.PI, 0),
      areaIndex: 1,
    },
    {
      // Cara superior (Área 3)
      position: [0, 0.5, 0] as [number, number, number],
      rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
      targetRotation: new THREE.Euler(-Math.PI / 2, 0, 0),
      areaIndex: 2,
    },
    {
      // Cara inferior (Área 4)
      position: [0, -0.5, 0] as [number, number, number],
      rotation: [Math.PI / 2, 0, 0] as [number, number, number],
      targetRotation: new THREE.Euler(Math.PI / 2, 0, 0),
      areaIndex: 3,
    },
    {
      // Cara derecha (Área 5)
      position: [0.5, 0, 0] as [number, number, number],
      rotation: [0, Math.PI / 2, 0] as [number, number, number],
      targetRotation: new THREE.Euler(0, Math.PI / 2, 0),
      areaIndex: 4,
    },
    {
      // Cara izquierda (Área 6)
      position: [-0.5, 0, 0] as [number, number, number],
      rotation: [0, -Math.PI / 2, 0] as [number, number, number],
      targetRotation: new THREE.Euler(0, -Math.PI / 2, 0),
      areaIndex: 5,
    },
  ];

  return (
    <group ref={groupRef}>
      {faces.map((face) => (
        <InteractiveCubeFace
          key={face.areaIndex}
          position={face.position}
          rotation={face.rotation}
          areaIndex={face.areaIndex}
          areaName={AREA_NAMES[face.areaIndex]}
          answeredCount={getAnsweredCount(face.areaIndex)}
          onClick={() => handleFaceClick(face.areaIndex, face.targetRotation)}
          hideLabel={hideLabels}
        />
      ))}
    </group>
  );
}

// Componente de fondo animado
function AnimatedBackground() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -3]} scale={[10, 10, 1]}>
      <planeGeometry />
      <meshBasicMaterial
        color="#f0f4ff"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Componente exportado con Canvas
export function InteractiveCube3D({ answers, onFaceClick, hideLabels }: InteractiveCube3DProps) {
  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-xl overflow-hidden shadow-2xl border border-gray-200 relative">
      {/* Efecto de brillo en las esquinas */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-indigo-400/10 pointer-events-none" />

      <Canvas
        camera={{ position: [2.5, 2.5, 2.5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        shadows="soft"
      >
        {/* Iluminación avanzada */}
        <ambientLight intensity={0.5} />

        {/* Luz principal con sombras suaves */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />

        {/* Luces de relleno */}
        <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#a5b4fc" />
        <pointLight position={[0, 3, 0]} intensity={0.6} color="#ffffff" distance={10} />
        <pointLight position={[3, 0, 3]} intensity={0.4} color="#60a5fa" distance={8} />
        <pointLight position={[-3, 0, -3]} intensity={0.4} color="#818cf8" distance={8} />

        {/* Luz de acento */}
        <spotLight
          position={[0, 6, 0]}
          angle={0.4}
          penumbra={1}
          intensity={0.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Rim light para resaltar bordes */}
        <directionalLight position={[0, 0, -5]} intensity={0.5} color="#c7d2fe" />

        {/* Environment map para reflejos realistas */}
        <Environment preset="city" />

        {/* Fondo animado */}
        <AnimatedBackground />

        {/* Cubo interactivo con Float para animación suave */}
        <Float
          speed={1.5}
          rotationIntensity={0.2}
          floatIntensity={0.3}
          floatingRange={[-0.1, 0.1]}
        >
          <InteractiveCube answers={answers} onFaceClick={onFaceClick} hideLabels={hideLabels} />
        </Float>

        {/* Controles de órbita mejorados con gestos táctiles */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2.5}
          maxDistance={6}
          autoRotate={false}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={1.2}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
      </Canvas>
    </div>
  );
}

