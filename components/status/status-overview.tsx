"use client";

import { ServiceStatus, STATUS_CONFIG } from "@/lib/status/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusOverviewProps {
  overallStatus: ServiceStatus;
  uptime: number;
  lastUpdate: Date;
  version?: string;
}

export function StatusOverview({ 
  overallStatus, 
  uptime, 
  lastUpdate,
  version = "4.8.0"
}: StatusOverviewProps) {
  const config = STATUS_CONFIG[overallStatus];
  
  const getStatusMessage = () => {
    switch (overallStatus) {
      case 'operational':
        return 'Todos los sistemas operativos';
      case 'degraded':
        return 'Algunos sistemas con problemas';
      case 'down':
        return 'Sistemas no disponibles';
      case 'maintenance':
        return 'Mantenimiento programado';
    }
  };

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diff < 60) return `hace ${diff} segundos`;
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
    return `hace ${Math.floor(diff / 3600)} horas`;
  };

  return (
    <Card className={`border-2 ${config.border}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{config.icon}</span>
            <div>
              <CardTitle className="text-3xl font-bold">
                INTEGRATE - Estado del Sistema
              </CardTitle>
              <p className={`text-lg ${config.text} font-semibold mt-1`}>
                {getStatusMessage()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Versión</div>
            <div className="text-2xl font-bold text-gray-900">{version}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Estado General */}
          <div className={`p-4 rounded-lg ${config.bg} border ${config.border}`}>
            <div className="text-sm text-gray-600 mb-1">Estado General</div>
            <div className={`text-xl font-bold ${config.text}`}>
              {config.label}
            </div>
          </div>

          {/* Uptime */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Uptime (30 días)</div>
            <div className="text-xl font-bold text-blue-900">
              {uptime.toFixed(2)}%
            </div>
          </div>

          {/* Última Actualización */}
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Última Verificación</div>
            <div className="text-xl font-bold text-purple-900">
              {formatLastUpdate()}
            </div>
          </div>

          {/* Leyenda */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Leyenda</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span>🟢</span>
                <span>Operativo</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🟡</span>
                <span>Degradado</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔴</span>
                <span>Caído</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

