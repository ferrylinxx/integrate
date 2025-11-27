"use client";

import { ServiceHealth, STATUS_CONFIG } from "@/lib/status/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ServiceStatusProps {
  services: ServiceHealth[];
  loading?: boolean;
}

export function ServiceStatus({ services, loading }: ServiceStatusProps) {
  if (loading) {
    return (
      <Card className="border border-white/20 shadow-2xl"
            style={{
              background: 'rgba(44, 36, 142, 0.08)',
              backdropFilter: 'blur(30px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">🔧 Servicios Principales</CardTitle>
          <CardDescription className="text-gray-400">Estado de los servicios críticos del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-3 text-gray-300">Verificando servicios...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-white/20 shadow-2xl hover:shadow-[0_0_30px_rgba(142,35,93,0.3)] transition-all duration-300"
          style={{
            background: 'rgba(142, 35, 93, 0.08)',
            backdropFilter: 'blur(30px) saturate(180%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">🔧 Servicios Principales</CardTitle>
        <CardDescription className="text-gray-400">Estado de los servicios críticos del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, index) => {
            const config = STATUS_CONFIG[service.status];

            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-white/20 transition-all hover:shadow-[0_0_20px_rgba(142,35,93,0.3)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px) saturate(180%)'
                }}
              >
                <div className="flex items-center justify-between">
                  {/* Nombre y Estado */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{config.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white">
                        {service.name}
                      </div>
                      {service.message && (
                        <div className="text-sm text-gray-400 mt-1">
                          {service.message}
                        </div>
                      )}
                      {service.error && (
                        <div className="text-sm text-red-400 mt-1 p-2 rounded border border-red-400/30"
                             style={{
                               background: 'rgba(229, 57, 53, 0.1)',
                               backdropFilter: 'blur(10px)'
                             }}>
                          ❌ {service.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="flex items-center gap-6">
                    {/* Latencia */}
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Latencia</div>
                      <div className={`text-sm font-bold ${
                        service.latency < 100 ? 'text-green-400' :
                        service.latency < 500 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {service.latency}ms
                      </div>
                    </div>

                    {/* Uptime */}
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Uptime</div>
                      <div className={`text-sm font-bold ${
                        service.uptime >= 99 ? 'text-green-400' :
                        service.uptime >= 95 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {service.uptime.toFixed(1)}%
                      </div>
                    </div>

                    {/* Badge de Estado */}
                    <div className={`px-3 py-1 rounded-full ${config.badge} text-white text-xs font-semibold`}>
                      {config.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="mt-4 p-3 rounded-lg border border-white/20"
             style={{
               background: 'rgba(255, 255, 255, 0.05)',
               backdropFilter: 'blur(20px) saturate(180%)'
             }}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">
              {services.filter(s => s.status === 'operational').length} de {services.length} servicios operativos
            </span>
            <span className="text-gray-400">
              Latencia promedio: {Math.round(services.reduce((acc, s) => acc + s.latency, 0) / services.length)}ms
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

