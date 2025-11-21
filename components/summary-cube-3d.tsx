"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { AREA_COLORS } from "@/lib/constants";

interface SummaryCube3DProps {
  data: number[]; // 6 valores (sumas por área)
  mode: "sums"; // Modo de visualización
}

export interface SummaryCube3DRef {
  getCanvas: () => HTMLCanvasElement | null;
}

// Función para obtener color según la suma (0-16, ya que son 4 preguntas de 1-4)
function getColorFromSum(value: number): string {
  if (value <= 4) return "#E53935"; // Rojo (muy bajo)
  if (value <= 8) return "#FB8C00"; // Naranja (bajo)
  if (value <= 12) return "#FDD835"; // Amarillo (medio)
  return "#43A047"; // Verde (alto)
}

function SummaryCubeGeometry({ data }: { data: number[] }) {
  const cubeSize = 4;

  // Mapeo de caras
  const faceMapping = [
    { face: "front", areaIndex: 0, rotation: [0, 0, 0], position: [0, 0, cubeSize / 2] },
    { face: "back", areaIndex: 1, rotation: [0, Math.PI, 0], position: [0, 0, -cubeSize / 2] },
    { face: "right", areaIndex: 2, rotation: [0, Math.PI / 2, 0], position: [cubeSize / 2, 0, 0] },
    { face: "left", areaIndex: 3, rotation: [0, -Math.PI / 2, 0], position: [-cubeSize / 2, 0, 0] },
    { face: "top", areaIndex: 4, rotation: [-Math.PI / 2, 0, 0], position: [0, cubeSize / 2, 0] },
    { face: "bottom", areaIndex: 5, rotation: [Math.PI / 2, 0, 0], position: [0, -cubeSize / 2, 0] },
  ];

  return (
    <group>
      {faceMapping.map(({ areaIndex, rotation, position }) => {
        const value = data[areaIndex];
        const color = getColorFromSum(value);
        const areaColor = AREA_COLORS[areaIndex];

        return (
          <group
            key={areaIndex}
            rotation={rotation as [number, number, number]}
            position={position as [number, number, number]}
          >
            {/* Fondo de la cara con color del área */}
            <mesh position={[0, 0, -0.06]}>
              <planeGeometry args={[cubeSize, cubeSize]} />
              <meshStandardMaterial
                color={areaColor}
                opacity={0.4}
                transparent
                roughness={0.8}
              />
            </mesh>

            {/* Cara principal con color según suma */}
            <mesh>
              <planeGeometry args={[cubeSize, cubeSize]} />
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.6}
                emissive={color}
                emissiveIntensity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        );
      })}

      {/* Bordes del cubo */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
        <lineBasicMaterial color="#1e293b" linewidth={3} />
      </lineSegments>
    </group>
  );
}

function Scene({ data }: { data: number[] }) {
  return (
    <>
      {/* Cámara */}
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />

      {/* Controles */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
        autoRotate={true}
        autoRotateSpeed={1.5}
      />

      {/* Luces */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      <pointLight position={[0, -10, 0]} intensity={0.3} />
      <spotLight position={[5, 5, 5]} intensity={0.4} angle={0.3} penumbra={1} />

      {/* Cubo */}
      <SummaryCubeGeometry data={data} />

      {/* Fondo */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </>
  );
}

export const SummaryCube3D = forwardRef<SummaryCube3DRef, SummaryCube3DProps>(
  function SummaryCube3D({ data, mode }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    return (
      <div className="w-full h-full">
        <Canvas
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: true,
          }}
          onCreated={({ gl }) => {
            canvasRef.current = gl.domElement;
          }}
        >
          <Scene data={data} />
        </Canvas>
      </div>
    );
  }
);

