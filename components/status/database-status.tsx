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
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle>🗄️ Tablas de Base de Datos</CardTitle>
          <CardDescription>Estado y validación de las tablas de Supabase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="ml-3 text-gray-600">Validando tablas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRecords = tables.reduce((acc, table) => acc + table.recordCount, 0);

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader>
        <CardTitle>🗄️ Tablas de Base de Datos</CardTitle>
        <CardDescription>Estado y validación de las tablas de Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((table, index) => {
            const config = STATUS_CONFIG[table.status];
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${config.border} ${config.bg} transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className={`h-5 w-5 ${config.text}`} />
                    <span className="font-bold text-gray-900">{table.name}</span>
                  </div>
                  <span className="text-xl">{config.icon}</span>
                </div>

                <div className="space-y-2">
                  {/* Número de registros */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Registros:</span>
                    <span className="font-semibold text-gray-900">
                      {table.recordCount.toLocaleString()}
                    </span>
                  </div>

                  {/* Estructura válida */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estructura:</span>
                    <span className="flex items-center gap-1">
                      {table.structureValid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-semibold">Válida</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 font-semibold">Inválida</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Error si existe */}
                  {table.error && (
                    <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded border border-red-200">
                      ❌ {table.error}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total de Tablas</div>
              <div className="text-2xl font-bold text-gray-900">{tables.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total de Registros</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalRecords.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Tablas Válidas</div>
              <div className="text-2xl font-bold text-green-600">
                {tables.filter(t => t.structureValid).length}/{tables.length}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

