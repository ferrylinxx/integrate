// Tipos para el sistema de estado

export type ServiceStatus = 'operational' | 'degraded' | 'down' | 'maintenance';

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  latency: number;
  uptime: number;
  lastCheck: Date;
  message?: string;
  error?: string;
}

export interface TableHealth {
  name: string;
  status: ServiceStatus;
  recordCount: number;
  structureValid: boolean;
  lastModified?: Date;
  error?: string;
}

export interface FunctionalityTest {
  name: string;
  description: string;
  status: ServiceStatus;
  lastRun?: Date;
  duration?: number;
  error?: string;
}

export interface SystemStatus {
  overall: ServiceStatus;
  uptime: number;
  lastUpdate: Date;
  services: ServiceHealth[];
  tables: TableHealth[];
  functionalities: FunctionalityTest[];
}

export const STATUS_CONFIG = {
  operational: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    icon: '🟢',
    badge: 'bg-green-500',
    label: 'Operativo'
  },
  degraded: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-900',
    icon: '🟡',
    badge: 'bg-yellow-500',
    label: 'Degradado'
  },
  down: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    icon: '🔴',
    badge: 'bg-red-500',
    label: 'Caído'
  },
  maintenance: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
    icon: '⚪',
    badge: 'bg-gray-500',
    label: 'Mantenimiento'
  }
} as const;

