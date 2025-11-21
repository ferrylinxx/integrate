"use client";

import { useState } from "react";
import { testConnection } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function SupabaseTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const response = await testConnection();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle>Prueba de Conexión a Supabase</CardTitle>
        <CardDescription>
          Verifica que la conexión a la base de datos esté funcionando correctamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleTest}
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Probando conexión...
            </>
          ) : (
            "Probar Conexión"
          )}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-lg border-2 ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p
                className={`font-semibold ${
                  result.success ? "text-green-900" : "text-red-900"
                }`}
              >
                {result.success ? "✅ Conexión exitosa" : "❌ Error de conexión"}
              </p>
            </div>
            <p
              className={`mt-2 text-sm ${
                result.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {result.message}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_URL || "No configurada"}
          </p>
          <p>
            <strong>Anon Key:</strong>{" "}
            {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
              : "No configurada"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

