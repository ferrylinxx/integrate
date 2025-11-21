"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { AREA_COLORS } from "@/lib/constants";

interface GroupCube3DProps {
  data: number[]; // 24 valores (promedios por pregunta)
  mode: "averages"; // Modo de visualización
}

export interface GroupCube3DRef {
  getCanvas: () => HTMLCanvasElement | null;
}

// Función para obtener color según el promedio (0-4)
function getColorFromAverage(value: number): string {
  if (value <= 1) return "#E53935"; // Rojo
  if (value <= 2) return "#FB8C00"; // Naranja
  if (value <= 3) return "#FDD835"; // Amarillo
  return "#43A047"; // Verde
}

function GroupCubeGeometry({ data }: { data: number[] }) {
  const cubeSize = 4;
  const gap = 0.05;
  const quadrantSize = (cubeSize - gap) / 2;

  // Mapeo de caras (igual que en el cubo individual)
  const faceMapping = [
    { face: "front", areaIndex: 0, rotation: [0, 0, 0], position: [0, 0, cubeSize / 2] },
    { face: "back", areaIndex: 1, rotation: [0, Math.PI, 0], position: [0, 0, -cubeSize / 2] },
    { face: "right", areaIndex: 2, rotation: [0, Math.PI / 2, 0], position: [cubeSize / 2, 0, 0] },
    { face: "left", areaIndex: 3, rotation: [0, -Math.PI / 2, 0], position: [-cubeSize / 2, 0, 0] },
    { face: "top", areaIndex: 4, rotation: [-Math.PI / 2, 0, 0], position: [0, cubeSize / 2, 0] },
    { face: "bottom", areaIndex: 5, rotation: [Math.PI / 2, 0, 0], position: [0, -cubeSize / 2, 0] },
  ];

  // Posiciones de los cuadrantes dentro de cada cara
  const quadrantPositions = [
    [-quadrantSize / 2 - gap / 2, quadrantSize / 2 + gap / 2, 0], // Top-left
    [quadrantSize / 2 + gap / 2, quadrantSize / 2 + gap / 2, 0],  // Top-right
    [-quadrantSize / 2 - gap / 2, -quadrantSize / 2 - gap / 2, 0], // Bottom-left
    [quadrantSize / 2 + gap / 2, -quadrantSize / 2 - gap / 2, 0],  // Bottom-right
  ];

  return (
    <group>
      {faceMapping.map(({ areaIndex, rotation, position }) => {
        const startIndex = areaIndex * 4;
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
                opacity={0.3}
                transparent
                roughness={0.8}
              />
            </mesh>

            {quadrantPositions.map((quadPos, quadIndex) => {
              const questionIndex = startIndex + quadIndex;
              const value = data[questionIndex];
              const color = getColorFromAverage(value);

              return (
                <mesh key={quadIndex} position={quadPos as [number, number, number]}>
                  <boxGeometry args={[quadrantSize, quadrantSize, 0.1]} />
                  <meshStandardMaterial
                    color={color}
                    roughness={0.3}
                    metalness={0.6}
                    emissive={color}
                    emissiveIntensity={0.2}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Bordes del cubo */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)]} />
        <lineBasicMaterial color="#1e293b" linewidth={2} />
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
        autoRotateSpeed={1}
      />

      {/* Luces */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <directionalLight position={[-10, -10, -10]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      <pointLight position={[0, -10, 0]} intensity={0.3} />
      <spotLight position={[5, 5, 5]} intensity={0.4} angle={0.3} penumbra={1} />

      {/* Cubo */}
      <GroupCubeGeometry data={data} />

      {/* Fondo */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </>
  );
}

function CanvasAccessor({ canvasRef }: { canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }) {
  const threeCanvas = useRef<HTMLCanvasElement>(null);

  // Actualizar la referencia cuando el canvas esté disponible
  if (threeCanvas.current && !canvasRef.current) {
    canvasRef.current = threeCanvas.current;
  }

  return null;
}

export const GroupCube3D = forwardRef<GroupCube3DRef, GroupCube3DProps>(
  function GroupCube3D({ data, mode }, ref) {
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

