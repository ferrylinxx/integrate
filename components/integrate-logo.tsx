import Image from "next/image";
import { cn } from "@/lib/utils";

interface IntegrateLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  xs: { width: 80, height: 21 },    // Para navbar pequeño
  sm: { width: 120, height: 32 },   // Para navbar normal
  md: { width: 160, height: 43 },   // Para headers
  lg: { width: 240, height: 64 },   // Para landing sections
  xl: { width: 320, height: 85 },   // Para hero section
  "2xl": { width: 400, height: 107 }, // Para hero principal
};

export function IntegrateLogo({ 
  size = "md", 
  className,
  priority = false 
}: IntegrateLogoProps) {
  const dimensions = sizeMap[size];

  return (
    <div className={cn("relative", className)}>
      <Image
        src="/logo/Integrate_logo gris + color.png"
        alt="Integrate Logo"
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        className="object-contain"
      />
    </div>
  );
}

