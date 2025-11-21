"use client";

import { APP_VERSION_LABEL } from "@/lib/version";
import { cn } from "@/lib/utils";

interface VersionBadgeProps {
  position?: "navbar" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VersionBadge({ 
  position = "navbar", 
  size = "sm",
  className 
}: VersionBadgeProps) {
  // Estilos base
  const baseStyles = "inline-flex items-center rounded-full bg-gradient-to-r from-[#2C248E]/10 to-[#8E235D]/10 border border-[#2C248E]/20 transition-all duration-300 hover:shadow-md";
  
  // Estilos de tamaño
  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  // Estilos de posición
  const positionStyles = {
    navbar: "",
    "top-right": "fixed top-4 right-4 z-50",
    "top-left": "fixed top-4 left-4 z-50",
    "bottom-right": "fixed bottom-4 right-4 z-50",
    "bottom-left": "fixed bottom-4 left-4 z-50"
  };

  // Visibilidad responsive
  const responsiveStyles = position === "navbar" 
    ? "hidden sm:flex" 
    : "flex";

  return (
    <div 
      className={cn(
        baseStyles,
        sizeStyles[size],
        positionStyles[position],
        responsiveStyles,
        className
      )}
    >
      <span className="font-bold bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">
        {APP_VERSION_LABEL}
      </span>
    </div>
  );
}

