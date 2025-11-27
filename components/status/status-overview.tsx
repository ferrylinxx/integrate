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
  version = "4.9.0"
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
    <Card className="border border-white/20 shadow-2xl hover:shadow-[0_0_30px_rgba(44,36,142,0.3)] transition-all duration-300"
          style={{
            background: 'rgba(44, 36, 142, 0.08)',
            backdropFilter: 'blur(30px) saturate(180%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{config.icon}</span>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#D91D5C] bg-clip-text text-transparent">
                Estado General del Sistema
              </CardTitle>
              <p className="text-lg text-gray-300 font-semibold mt-1">
                {getStatusMessage()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Versión</div>
            <div className="text-2xl font-bold text-white">{version}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Estado General */}
          <div className="p-4 rounded-lg border border-white/20"
               style={{
                 background: overallStatus === 'operational'
                   ? 'rgba(67, 160, 71, 0.15)'
                   : overallStatus === 'degraded'
                   ? 'rgba(255, 193, 7, 0.15)'
                   : 'rgba(229, 57, 53, 0.15)',
                 backdropFilter: 'blur(20px) saturate(180%)'
               }}>
            <div className="text-sm text-gray-400 mb-1">Estado General</div>
            <div className="text-xl font-bold text-white">
              {config.label}
            </div>
          </div>

          {/* Uptime */}
          <div className="p-4 rounded-lg border border-white/20"
               style={{
                 background: 'rgba(33, 150, 243, 0.15)',
                 backdropFilter: 'blur(20px) saturate(180%)'
               }}>
            <div className="text-sm text-gray-400 mb-1">Uptime (30 días)</div>
            <div className="text-xl font-bold text-blue-300">
              {uptime.toFixed(2)}%
            </div>
          </div>

          {/* Última Actualización */}
          <div className="p-4 rounded-lg border border-white/20"
               style={{
                 background: 'rgba(156, 39, 176, 0.15)',
                 backdropFilter: 'blur(20px) saturate(180%)'
               }}>
            <div className="text-sm text-gray-400 mb-1">Última Verificación</div>
            <div className="text-xl font-bold text-purple-300">
              {formatLastUpdate()}
            </div>
          </div>

          {/* Leyenda */}
          <div className="p-4 rounded-lg border border-white/20"
               style={{
                 background: 'rgba(255, 255, 255, 0.05)',
                 backdropFilter: 'blur(20px) saturate(180%)'
               }}>
            <div className="text-sm text-gray-400 mb-2">Leyenda</div>
            <div className="space-y-1 text-xs text-gray-300">
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

