"use client";

import { GroupCodeForm } from "@/components/group-code-form";
import { Card, CardContent } from "@/components/ui/card";
import { VersionBadge } from "@/components/version-badge";
import { CodeEntryContentLoader, RenderContent, getContentWithHtml } from "@/components/code-entry-content-loader";

export default function CodigoPage() {
  return (
    <CodeEntryContentLoader>
      {({ content }) => (
        <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.03) 0%, rgba(65, 39, 97, 0.05) 25%, rgba(142, 35, 93, 0.04) 50%, rgba(230, 91, 62, 0.03) 75%, rgba(240, 135, 38, 0.04) 100%)'
              }}>
          {/* Patrón de fondo sutil */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(44, 36, 142, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Version Badge - Top Right */}
          <VersionBadge position="top-right" size="sm" />

          <div className="w-full max-w-xl relative z-10">
            {/* Header limpio y moderno */}
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#2C248E] via-[#412761] to-[#8E235D] bg-clip-text text-transparent">
                <RenderContent {...getContentWithHtml(content, "01_Header.Título Principal.titulo", "Test de Áreas Sensibles")} />
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                <RenderContent {...getContentWithHtml(content, "01_Header.Título Principal.subtitulo", "Diagnóstico Organizativo · Modelo INTEGRATE 2.0")} />
              </p>
            </div>

            {/* Card principal - Diseño limpio */}
            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95 overflow-hidden">
              <CardContent className="p-6 md:p-8">
                {/* Título del card */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#2C248E' }}>
                    <RenderContent {...getContentWithHtml(content, "02_Card.Encabezado.titulo", "Acceso al Test")} />
                  </h2>
                  <p className="text-sm md:text-base text-gray-600">
                    <RenderContent {...getContentWithHtml(content, "02_Card.Encabezado.descripcion", "Introduce el código de grupo proporcionado por tu facilitador")} />
                  </p>
                </div>

                {/* Formulario */}
                <GroupCodeForm />

                {/* Información de privacidad - Diseño minimalista */}
                <div className="mt-6 p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed text-center">
                    <RenderContent {...getContentWithHtml(content, "03_Privacidad.Información.descripcion", "Tus respuestas son <span class=\"font-semibold\">completamente anónimas</span> y se utilizan únicamente para el diagnóstico organizativo. Cumplimos con el <span class=\"font-semibold\">RGPD</span>.")} />
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer minimalista */}
            <div className="text-center mt-6 text-xs text-gray-500">
              <p>Powered by <span className="font-semibold bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">Integrate</span></p>
            </div>
          </div>
        </main>
      )}
    </CodeEntryContentLoader>
  );
}

