"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, CheckCircle2, XCircle, FileText, Database } from "lucide-react";

export default function FigmaSyncPage() {
  const [fileKey, setFileKey] = useState("");
  const [tableName, setTableName] = useState("landing_content");
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSync = async () => {
    if (!fileKey.trim()) {
      alert("Por favor ingresa el File Key de Figma");
      return;
    }

    setSyncing(true);
    setResult(null);

    try {
      const response = await fetch("/api/figma/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileKey: fileKey.trim(),
          tableName: tableName.trim(),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Error desconocido",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sincronización con Figma
          </h1>
          <p className="text-gray-600">
            Importa contenido desde tus diseños de Figma directamente a Supabase
          </p>
        </div>

        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Configuración de Sincronización
            </CardTitle>
            <CardDescription>
              Ingresa el File Key de tu archivo de Figma para sincronizar el contenido
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File Key de Figma</label>
              <Input
                placeholder="Ej: abc123def456ghi789"
                value={fileKey}
                onChange={(e) => setFileKey(e.target.value)}
                disabled={syncing}
              />
              <p className="text-xs text-gray-500">
                Encuentra el File Key en la URL de tu archivo: figma.com/file/<strong>FILE_KEY</strong>/nombre
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tabla de Destino</label>
              <Input
                placeholder="landing_content"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                disabled={syncing}
              />
            </div>

            <Button
              onClick={handleSync}
              disabled={syncing || !fileKey.trim()}
              className="w-full"
              size="lg"
            >
              {syncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Sincronizar Contenido
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Resultado de la Sincronización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>

              {result.data && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.data.itemsProcessed}
                      </div>
                      <div className="text-sm text-gray-600">Procesados</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {result.data.itemsCreated}
                      </div>
                      <div className="text-sm text-gray-600">Creados</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {result.data.itemsUpdated}
                      </div>
                      <div className="text-sm text-gray-600">Actualizados</div>
                    </div>
                  </div>

                  {result.data.errors && result.data.errors.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-red-600">Errores encontrados:</h4>
                      <div className="bg-red-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                        {result.data.errors.map((error: string, index: number) => (
                          <div key={index} className="text-sm text-red-700 mb-1">
                            • {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instrucciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Convención de Nombres en Figma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Los nodos de texto en Figma deben seguir este formato:</p>
              <code className="block bg-white p-2 rounded border text-sm">
                category/section_name/field_name
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Para contenido HTML, añade <code className="bg-white px-1 rounded">[HTML]</code> al final
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">Ejemplos:</p>
              <div className="space-y-1 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  ✅ <code>01_Portada/Hero Principal/titulo</code>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  ✅ <code>07_Footer/Copyright/texto [HTML]</code>
                </div>
                <div className="bg-red-50 p-2 rounded text-red-700">
                  ❌ <code>Titulo Principal</code> (falta estructura)
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                📖 Para más información, consulta la{" "}
                <a href="/docs/FIGMA_SYNC_GUIDE.md" className="underline font-semibold">
                  Guía Completa de Sincronización
                </a>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

