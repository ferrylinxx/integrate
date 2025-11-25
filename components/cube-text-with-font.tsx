"use client";

import { Text } from "@react-three/drei";
import { Suspense } from "react";

interface CubeTextProps {
  position: [number, number, number];
  fontSize: number;
  color: string;
  children: string;
  maxWidth?: number;
  letterSpacing?: number;
}

export function CubeText({ position, fontSize, color, children, maxWidth = 0.9, letterSpacing }: CubeTextProps) {
  return (
    <Suspense fallback={null}>
      <Text
        position={position}
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Poppins-Bold.woff2"
        letterSpacing={letterSpacing}
        maxWidth={maxWidth}
        textAlign="center"
      >
        {children}
      </Text>
    </Suspense>
  );
}

