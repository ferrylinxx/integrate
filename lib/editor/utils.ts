import { EditorConfig, GradientConfig } from './types';

// ============================================
// UTILIDADES PARA EL EDITOR
// ============================================

/**
 * Obtener valor de un objeto usando path con notación de punto
 * Ejemplo: get(obj, 'components.mapaDeSituacion.title.fontSize')
 */
export function get(obj: any, path: string): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined) {
      return undefined;
    }
    result = result[key];
  }
  
  return result;
}

/**
 * Establecer valor en un objeto usando path con notación de punto
 * Ejemplo: set(obj, 'components.mapaDeSituacion.title.fontSize', '24px')
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  
  let current = obj;
  for (const key of keys) {
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
}

/**
 * Clonar profundamente un objeto
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merge profundo de dos objetos
 */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue as any);
    } else {
      result[key] = sourceValue as any;
    }
  }
  
  return result;
}

/**
 * Generar CSS de gradiente desde configuración
 */
export function gradientToCSS(gradient: GradientConfig): string {
  const stops = gradient.stops
    .map(stop => `${stop.color} ${stop.position}%`)
    .join(', ');
  
  return `linear-gradient(${gradient.angle}deg, ${stops})`;
}

/**
 * Parsear CSS de gradiente a configuración
 */
export function cssToGradient(css: string): GradientConfig | null {
  // Regex para extraer ángulo y stops
  const match = css.match(/linear-gradient\((-?\d+)deg,\s*(.+)\)/);
  if (!match) return null;
  
  const angle = parseInt(match[1]);
  const stopsStr = match[2];
  
  // Parsear stops
  const stopMatches = stopsStr.matchAll(/rgba?\([^)]+\)\s+(\d+)%/g);
  const stops = Array.from(stopMatches).map(m => ({
    color: m[0].split(' ')[0],
    position: parseInt(m[1]),
  }));
  
  return { angle, stops };
}

/**
 * Validar que un color sea válido (hex, rgb, rgba)
 */
export function isValidColor(color: string): boolean {
  // Hex
  if (/^#[0-9A-F]{6}$/i.test(color)) return true;
  
  // RGB
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color)) return true;
  
  // RGBA
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i.test(color)) return true;
  
  return false;
}

/**
 * Convertir HEX a RGBA
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(255,255,255,${alpha})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Extraer RGB de un color
 */
export function extractRGB(color: string): { r: number; g: number; b: number } | null {
  // Hex
  const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16),
    };
  }
  
  // RGB/RGBA
  const rgbMatch = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(color);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }
  
  return null;
}

/**
 * Formatear tamaño (agregar 'px' si es número)
 */
export function formatSize(value: string | number): string {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
}

/**
 * Parsear tamaño (extraer número)
 */
export function parseSize(value: string): number {
  const match = value.match(/^(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generar ID único
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formatear fecha
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Comparar dos configuraciones
 */
export function configsAreEqual(a: EditorConfig, b: EditorConfig): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

