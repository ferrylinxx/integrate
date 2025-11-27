"use client";

import { TableHealth, STATUS_CONFIG } from "@/lib/status/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Database, CheckCircle2, XCircle } from "lucide-react";

interface DatabaseStatusProps {
  tables: TableHealth[];
  loading?: boolean;
}

export function DatabaseStatus({ tables, loading }: DatabaseStatusProps) {
  if (loading) {
    return (
      <Card className="border border-white/20 shadow-2xl"
            style={{
              background: 'rgba(217, 29, 92, 0.08)',
              backdropFilter: 'blur(30px) saturate(180%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">🗄️ Tablas de Base de Datos</CardTitle>
          <CardDescription className="text-gray-400">Estado y validación de las tablas de Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <span className="ml-3 text-gray-300">Validando tablas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRecords = tables.reduce((acc, table) => acc + table.recordCount, 0);

  return (
    <Card className="border border-white/20 shadow-2xl hover:shadow-[0_0_30px_rgba(217,29,92,0.3)] transition-all duration-300"
          style={{
            background: 'rgba(217, 29, 92, 0.08)',
            backdropFilter: 'blur(30px) saturate(180%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">🗄️ Tablas de Base de Datos</CardTitle>
        <CardDescription className="text-gray-400">Estado y validación de las tablas de Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table, index) => {
            const config = STATUS_CONFIG[table.status];

            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-white/20 transition-all hover:shadow-[0_0_20px_rgba(217,29,92,0.3)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px) saturate(180%)'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-purple-400" />
                    <span className="font-bold text-white">{table.name}</span>
                  </div>
                  <span className="text-xl">{config.icon}</span>
                </div>

                <div className="space-y-2">
                  {/* Número de registros */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Registros:</span>
                    <span className="font-semibold text-white">
                      {table.recordCount.toLocaleString()}
                    </span>
                  </div>

                  {/* Estructura válida */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Estructura:</span>
                    <span className="flex items-center gap-1">
                      {table.structureValid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 font-semibold">Válida</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-400" />
                          <span className="text-red-400 font-semibold">Inválida</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Error si existe */}
                  {table.error && (
                    <div className="text-xs text-red-400 mt-2 p-2 rounded border border-red-400/30"
                         style={{
                           background: 'rgba(229, 57, 53, 0.1)',
                           backdropFilter: 'blur(10px)'
                         }}>
                      ❌ {table.error}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="mt-4 p-4 rounded-lg border border-white/20"
             style={{
               background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.15), rgba(33, 150, 243, 0.15))',
               backdropFilter: 'blur(20px) saturate(180%)'
             }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total de Tablas</div>
              <div className="text-2xl font-bold text-white">{tables.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Total de Registros</div>
              <div className="text-2xl font-bold text-white">
                {totalRecords.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Tablas Válidas</div>
              <div className="text-2xl font-bold text-green-400">
                {tables.filter(t => t.structureValid).length}/{tables.length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

