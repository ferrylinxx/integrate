"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, RefreshCw } from "lucide-react";
import { StatusOverview } from "@/components/status/status-overview";
import { ServiceStatus } from "@/components/status/service-status";
import { DatabaseStatus } from "@/components/status/database-status";
import { FunctionalityTests } from "@/components/status/functionality-tests";
import {
  runAllServiceTests,
  validateAllTables,
  runAllFunctionalityTests,
} from "@/lib/status/tests";
import { ServiceHealth, TableHealth, FunctionalityTest, ServiceStatus as StatusType } from "@/lib/status/types";

export default function AdminTestPage() {
  const router = useRouter();

  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [tables, setTables] = useState<TableHealth[]>([]);
  const [functionalities, setFunctionalities] = useState<FunctionalityTest[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Calcular estado general
  const getOverallStatus = (): StatusType => {
    const allItems = [...services, ...tables, ...functionalities];

    if (allItems.some(item => item.status === 'down')) return 'down';
    if (allItems.some(item => item.status === 'degraded')) return 'degraded';
    if (allItems.some(item => item.status === 'maintenance')) return 'maintenance';
    return 'operational';
  };

  // Calcular uptime promedio
  const getAverageUptime = (): number => {
    if (services.length === 0) return 100;
    const total = services.reduce((acc, s) => acc + s.uptime, 0);
    return total / services.length;
  };

  // Ejecutar todos los tests
  const runAllTests = async () => {
    setLoading(true);

    try {
      const [servicesResult, tablesResult, functionalitiesResult] = await Promise.all([
        runAllServiceTests(),
        validateAllTables(),
        runAllFunctionalityTests(),
      ]);

      setServices(servicesResult);
      setTables(tablesResult);
      setFunctionalities(functionalitiesResult);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    runAllTests();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      runAllTests();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              🟢 Estado del Sistema
            </h1>
            <p className="text-gray-600 mt-2">
              Monitoreo en tiempo real de todos los servicios de INTEGRATE
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={runAllTests}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Button>
          </div>
        </div>

        {/* Resumen General */}
        <StatusOverview
          overallStatus={getOverallStatus()}
          uptime={getAverageUptime()}
          lastUpdate={lastUpdate}
          version="4.8.0"
        />

        {/* Servicios Principales */}
        <ServiceStatus services={services} loading={loading} />

        {/* Tablas de Base de Datos */}
        <DatabaseStatus tables={tables} loading={loading} />

        {/* Funcionalidades Críticas */}
        <FunctionalityTests
          tests={functionalities}
          loading={loading}
          onRunTests={runAllTests}
        />

        {/* Controles de Auto-refresh */}
        <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-200">
          <span className="text-sm text-gray-600">
            🔄 Auto-actualización: {autoRefresh ? 'Activada (cada 30s)' : 'Desactivada'}
          </span>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            size="sm"
          >
            {autoRefresh ? '⏸️ Pausar' : '▶️ Reanudar'}
          </Button>
        </div>

        {/* Footer con información */}
        <div className="text-center text-sm text-gray-500 pb-8">
          <p>
            Última actualización: {lastUpdate.toLocaleString('es-ES')}
          </p>
          <p className="mt-1">
            INTEGRATE v4.8.0 - Sistema de Evaluación de Áreas Sensibles
          </p>
        </div>
      </div>
    </main>
  );
}

