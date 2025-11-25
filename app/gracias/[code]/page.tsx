"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { VersionBadge } from "@/components/version-badge";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function GraciasPage() {
  const params = useParams();
  const code = params.code as string;

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Version Badge */}
      <VersionBadge position="top-right" size="sm" />

      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#2C248E]/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#8E235D]/10 to-transparent rounded-full blur-3xl"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Card principal */}
        <Card className="border-2 shadow-2xl overflow-hidden"
              style={{ borderColor: '#2C248E' }}>
          <CardContent className="p-8 md:p-12 text-center relative">
            {/* Decoración interna */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2C248E]/5 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#8E235D]/5 to-transparent rounded-full blur-2xl"></div>

            {/* Icono de éxito */}
            <div className="flex justify-center mb-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative p-4 rounded-full shadow-lg"
                     style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                  <CheckCircle2 className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#2C248E] via-[#412761] to-[#8E235D] bg-clip-text text-transparent">
              ¡Gracias por completar el test!
            </h1>

            {/* Mensaje */}
            <p className="text-lg md:text-xl text-gray-700 mb-2">
              Tus respuestas han sido guardadas exitosamente.
            </p>
            <p className="text-base text-gray-600 mb-8">
              Tu código de participante: <span className="font-mono font-bold text-[#2C248E]">{code}</span>
            </p>

            {/* Separador decorativo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <Sparkles className="h-5 w-5 text-[#F08726]" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            {/* Mensaje final */}
            <div className="p-6 rounded-lg"
                 style={{ background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.05) 0%, rgba(142, 35, 93, 0.03) 100%)' }}>
              <p className="text-gray-700 leading-relaxed">
                Tu participación ha sido registrada correctamente. El facilitador compartirá los resultados del equipo cuando estén disponibles.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>INTEGRATE 2.0 · Diagnóstico Organizativo</p>
        </div>
      </div>
    </main>
  );
}

