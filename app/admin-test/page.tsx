"use client";

import { SupabaseTest } from "@/components/supabase-test";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function AdminTestPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Panel de Pruebas - Supabase
            </h1>
            <p className="text-gray-600 mt-2">
              Verifica la configuración de Supabase antes de continuar
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Button>
        </div>

        {/* Test de conexión */}
        <SupabaseTest />

        {/* Instrucciones */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Instrucciones de Configuración
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-bold text-lg mb-2">1. Configurar Supabase</h3>
              <p className="text-sm">
                Sigue las instrucciones en el archivo{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  SUPABASE_SETUP.md
                </code>{" "}
                para crear tu proyecto en Supabase.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">2. Crear archivo .env.local</h3>
              <p className="text-sm mb-2">
                Crea un archivo <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> en la raíz del proyecto con:
              </p>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">3. Crear las tablas</h3>
              <p className="text-sm">
                Ejecuta el SQL proporcionado en{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  SUPABASE_SETUP.md
                </code>{" "}
                en el SQL Editor de Supabase.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">4. Reiniciar el servidor</h3>
              <p className="text-sm">
                Detén el servidor (Ctrl+C) y vuelve a ejecutar{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">5. Probar la conexión</h3>
              <p className="text-sm">
                Haz clic en el botón "Probar Conexión" arriba para verificar que todo funciona.
              </p>
            </div>
          </div>
        </div>

        {/* Estado actual */}
        <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-yellow-900 mb-2">
            ⚠️ Estado Actual
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>✅ Dependencias de Supabase instaladas</li>
            <li>✅ Cliente de Supabase configurado</li>
            <li>✅ Funciones de API creadas (grupos y submissions)</li>
            <li>✅ Tipos de TypeScript definidos</li>
            <li className="font-bold">
              ⏳ Pendiente: Configurar variables de entorno (.env.local)
            </li>
            <li className="font-bold">
              ⏳ Pendiente: Crear tablas en Supabase
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

