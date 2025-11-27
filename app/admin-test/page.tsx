"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Home, RefreshCw, Activity, Database, Zap, BarChart3, Download, Shield } from "lucide-react";
import { IntegrateLogo } from "@/components/integrate-logo";
import { VersionBadge } from "@/components/version-badge";
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
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "database" | "tests">("overview");

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

  // Exportar reporte en JSON
  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      version: "4.9.0",
      overallStatus: getOverallStatus(),
      uptime: getAverageUptime(),
      services,
      tables,
      functionalities
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integrate-status-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
    <main className="min-h-screen relative overflow-hidden pb-16">
      {/* Fondo negro base */}
      <div className="fixed inset-0 bg-[#0a0a0f]" style={{ zIndex: 0 }}></div>

      {/* Video de fondo */}
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/fondo-landing.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Patrón de cuadrícula sutil en el fondo */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 2
      }}></div>

      <div className="relative max-w-[95%] 2xl:max-w-[1800px] mx-auto px-4 py-10 space-y-10" style={{ zIndex: 10 }}>
        {/* Logo y versión */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <IntegrateLogo size="md" priority />
          </div>
          <VersionBadge position="navbar" size="md" />
        </div>

        {/* Header con Liquid Glass de Apple */}
        <Card className="border border-white/20 shadow-2xl hover:shadow-[0_0_30px_rgba(44,36,142,0.3)] transition-all duration-300"
              style={{
                background: 'rgba(44, 36, 142, 0.08)',
                backdropFilter: 'blur(30px) saturate(180%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#D91D5C] bg-clip-text text-transparent">
                  🟢 Estado del Sistema
                </h1>
                <p className="text-gray-300 mt-2 text-lg font-medium">
                  Monitoreo en tiempo real de todos los servicios de INTEGRATE
                </p>
                <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-white/20 inline-flex"
                     style={{
                       background: 'rgba(44, 36, 142, 0.08)',
                       backdropFilter: 'blur(30px) saturate(180%)'
                     }}>
                  <Activity className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-semibold text-gray-200">
                    {getOverallStatus() === 'operational' ? 'Todos los sistemas operativos' : 'Algunos sistemas con problemas'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={exportReport}
                  variant="outline"
                  className="border border-blue-400/30 hover:border-blue-400 text-blue-300 hover:text-blue-200 transition-all duration-300 h-11"
                  style={{
                    background: 'rgba(33, 150, 243, 0.08)',
                    backdropFilter: 'blur(30px) saturate(180%)'
                  }}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar Reporte
                </Button>
                <Button
                  onClick={runAllTests}
                  disabled={loading}
                  variant="outline"
                  className="border border-green-400/30 hover:border-green-400 text-green-300 hover:text-green-200 transition-all duration-300 h-11"
                  style={{
                    background: 'rgba(67, 160, 71, 0.08)',
                    backdropFilter: 'blur(30px) saturate(180%)'
                  }}
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="border border-white/20 hover:border-[#2C248E] text-gray-300 hover:text-white transition-all duration-300 h-11"
                  style={{
                    background: 'rgba(44, 36, 142, 0.08)',
                    backdropFilter: 'blur(30px) saturate(180%)'
                  }}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Inicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs con Liquid Glass de Apple */}
        <Card className="border border-white/20 shadow-2xl hover:shadow-[0_0_30px_rgba(44,36,142,0.2)] transition-shadow duration-300"
              style={{
                background: 'rgba(44, 36, 142, 0.08)',
                backdropFilter: 'blur(30px) saturate(180%)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-8 py-4 font-bold text-base transition-all duration-300 ${
                activeTab === "overview"
                  ? "border-b-4 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              style={activeTab === "overview" ? {
                borderBottomColor: '#2C248E',
                background: 'rgba(44, 36, 142, 0.15)',
                backdropFilter: 'blur(30px) saturate(180%)',
                boxShadow: '0 4px 20px rgba(44, 36, 142, 0.3)'
              } : {}}
            >
              <BarChart3 className="h-5 w-5 inline mr-2" />
              Resumen
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 px-8 py-4 font-bold text-base transition-all duration-300 ${
                activeTab === "services"
                  ? "border-b-4 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              style={activeTab === "services" ? {
                borderBottomColor: '#8E235D',
                background: 'rgba(142, 35, 93, 0.15)',
                backdropFilter: 'blur(30px) saturate(180%)',
                boxShadow: '0 4px 20px rgba(142, 35, 93, 0.3)'
              } : {}}
            >
              <Shield className="h-5 w-5 inline mr-2" />
              Servicios
            </button>
            <button
              onClick={() => setActiveTab("database")}
              className={`flex-1 px-8 py-4 font-bold text-base transition-all duration-300 ${
                activeTab === "database"
                  ? "border-b-4 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              style={activeTab === "database" ? {
                borderBottomColor: '#D91D5C',
                background: 'rgba(217, 29, 92, 0.15)',
                backdropFilter: 'blur(30px) saturate(180%)',
                boxShadow: '0 4px 20px rgba(217, 29, 92, 0.3)'
              } : {}}
            >
              <Database className="h-5 w-5 inline mr-2" />
              Base de Datos
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`flex-1 px-8 py-4 font-bold text-base transition-all duration-300 ${
                activeTab === "tests"
                  ? "border-b-4 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              style={activeTab === "tests" ? {
                borderBottomColor: '#F08726',
                background: 'rgba(240, 135, 38, 0.15)',
                backdropFilter: 'blur(30px) saturate(180%)',
                boxShadow: '0 4px 20px rgba(240, 135, 38, 0.3)'
              } : {}}
            >
              <Zap className="h-5 w-5 inline mr-2" />
              Tests Funcionales
            </button>
          </div>
        </Card>

        {/* Contenido según tab activo */}
        <div>
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Resumen General */}
              <StatusOverview
                overallStatus={getOverallStatus()}
                uptime={getAverageUptime()}
                lastUpdate={lastUpdate}
                version="4.9.0"
              />

              {/* Grid de métricas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Servicios */}
                <Card className="border border-white/20 shadow-xl hover:shadow-[0_0_20px_rgba(44,36,142,0.3)] transition-all duration-300"
                      style={{
                        background: 'rgba(44, 36, 142, 0.08)',
                        backdropFilter: 'blur(30px) saturate(180%)'
                      }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Shield className="h-8 w-8 text-blue-400" />
                      <span className="text-3xl font-bold text-white">
                        {services.filter(s => s.status === 'operational').length}/{services.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200">Servicios Operativos</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Latencia promedio: {services.length > 0 ? Math.round(services.reduce((acc, s) => acc + s.latency, 0) / services.length) : 0}ms
                    </p>
                  </CardContent>
                </Card>

                {/* Base de Datos */}
                <Card className="border border-white/20 shadow-xl hover:shadow-[0_0_20px_rgba(142,35,93,0.3)] transition-all duration-300"
                      style={{
                        background: 'rgba(142, 35, 93, 0.08)',
                        backdropFilter: 'blur(30px) saturate(180%)'
                      }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Database className="h-8 w-8 text-purple-400" />
                      <span className="text-3xl font-bold text-white">
                        {tables.filter(t => t.structureValid).length}/{tables.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200">Tablas Válidas</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Total: {tables.reduce((acc, t) => acc + t.recordCount, 0).toLocaleString()} registros
                    </p>
                  </CardContent>
                </Card>

                {/* Tests Funcionales */}
                <Card className="border border-white/20 shadow-xl hover:shadow-[0_0_20px_rgba(217,29,92,0.3)] transition-all duration-300"
                      style={{
                        background: 'rgba(217, 29, 92, 0.08)',
                        backdropFilter: 'blur(30px) saturate(180%)'
                      }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Zap className="h-8 w-8 text-pink-400" />
                      <span className="text-3xl font-bold text-white">
                        {functionalities.filter(f => f.status === 'operational').length}/{functionalities.length}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-200">Tests Pasados</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Funcionalidades críticas
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <ServiceStatus services={services} loading={loading} />
          )}

          {activeTab === "database" && (
            <DatabaseStatus tables={tables} loading={loading} />
          )}

          {activeTab === "tests" && (
            <FunctionalityTests
              tests={functionalities}
              loading={loading}
              onRunTests={runAllTests}
            />
          )}
        </div>

        {/* Controles de Auto-refresh con estilo Liquid Glass */}
        <Card className="border border-white/20 shadow-xl"
              style={{
                background: 'rgba(44, 36, 142, 0.08)',
                backdropFilter: 'blur(30px) saturate(180%)'
              }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className={`h-5 w-5 text-gray-300 ${autoRefresh ? 'animate-spin' : ''}`} />
                <span className="text-sm text-gray-300">
                  Auto-actualización: <span className="font-semibold text-white">{autoRefresh ? 'Activada (cada 30s)' : 'Desactivada'}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
                </span>
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  size="sm"
                  className="border border-white/20"
                  style={{
                    background: autoRefresh ? 'rgba(67, 160, 71, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(30px) saturate(180%)'
                  }}
                >
                  {autoRefresh ? '⏸️ Pausar' : '▶️ Reanudar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer minimalista con estilo oscuro */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm text-gray-400">© 2025 Integrate - Sistema de Evaluación de Áreas Sensibles</p>
          <p className="text-xs text-gray-500 mt-1">v4.9.0 - Status Page</p>
        </div>
      </div>
    </main>
  );
}

