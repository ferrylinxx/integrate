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
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle>🔧 Servicios Principales</CardTitle>
          <CardDescription>Estado de los servicios críticos del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Verificando servicios...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle>🔧 Servicios Principales</CardTitle>
        <CardDescription>Estado de los servicios críticos del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, index) => {
            const config = STATUS_CONFIG[service.status];
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${config.border} ${config.bg} transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  {/* Nombre y Estado */}
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{config.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {service.name}
                      </div>
                      {service.message && (
                        <div className="text-sm text-gray-600 mt-1">
                          {service.message}
                        </div>
                      )}
                      {service.error && (
                        <div className="text-sm text-red-600 mt-1">
                          ❌ {service.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Métricas */}
                  <div className="flex items-center gap-6">
                    {/* Latencia */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Latencia</div>
                      <div className={`text-sm font-bold ${
                        service.latency < 100 ? 'text-green-600' :
                        service.latency < 500 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {service.latency}ms
                      </div>
                    </div>

                    {/* Uptime */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Uptime</div>
                      <div className={`text-sm font-bold ${
                        service.uptime >= 99 ? 'text-green-600' :
                        service.uptime >= 95 ? 'text-yellow-600' :
                        'text-red-600'
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
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {services.filter(s => s.status === 'operational').length} de {services.length} servicios operativos
            </span>
            <span className="text-gray-500">
              Latencia promedio: {Math.round(services.reduce((acc, s) => acc + s.latency, 0) / services.length)}ms
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

