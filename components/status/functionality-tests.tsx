"use client";

import { FunctionalityTest, STATUS_CONFIG } from "@/lib/status/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, CheckCircle2, XCircle, Clock } from "lucide-react";

interface FunctionalityTestsProps {
  tests: FunctionalityTest[];
  loading?: boolean;
  onRunTests?: () => void;
}

export function FunctionalityTests({ tests, loading, onRunTests }: FunctionalityTestsProps) {
  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatLastRun = (date?: Date) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `hace ${diff}s`;
    if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
    return `hace ${Math.floor(diff / 86400)}d`;
  };

  return (
    <Card className="border-2 border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>⚡ Funcionalidades Críticas</CardTitle>
            <CardDescription>Tests end-to-end de las funcionalidades principales</CardDescription>
          </div>
          {onRunTests && (
            <Button
              onClick={onRunTests}
              disabled={loading}
              className="gap-2"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Ejecutar Tests
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            <span className="ml-3 text-gray-600">Ejecutando tests funcionales...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((test, index) => {
              const config = STATUS_CONFIG[test.status];
              
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${config.border} ${config.bg} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    {/* Información del Test */}
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl mt-1">{config.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-lg">
                          {test.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {test.description}
                        </div>
                        {test.error && (
                          <div className="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
                            ❌ {test.error}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Métricas */}
                    <div className="flex items-center gap-4 ml-4">
                      {/* Duración */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Clock className="h-3 w-3" />
                          <span>Duración</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatDuration(test.duration)}
                        </div>
                      </div>

                      {/* Última Ejecución */}
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Última ejecución</div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatLastRun(test.lastRun)}
                        </div>
                      </div>

                      {/* Badge de Estado */}
                      <div className={`px-3 py-1 rounded-full ${config.badge} text-white text-xs font-semibold whitespace-nowrap`}>
                        {config.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resumen */}
        {!loading && tests.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {tests.filter(t => t.status === 'operational').length} de {tests.length} tests pasados
              </span>
              {tests.every(t => t.status === 'operational') && (
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Todas las funcionalidades operativas
                </span>
              )}
              {tests.some(t => t.status === 'down') && (
                <span className="flex items-center gap-1 text-red-600 font-semibold">
                  <XCircle className="h-4 w-4" />
                  Algunas funcionalidades con problemas
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

