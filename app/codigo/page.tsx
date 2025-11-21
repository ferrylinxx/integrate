"use client";

import { GroupCodeForm } from "@/components/group-code-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IntegrateLogo } from "@/components/integrate-logo";
import { VersionBadge } from "@/components/version-badge";
import { Shield, Lock, Sparkles } from "lucide-react";
import { CodeEntryContentLoader, getContent, RenderContent, getContentWithHtml } from "@/components/code-entry-content-loader";

export default function CodigoPage() {
  return (
    <CodeEntryContentLoader>
      {({ content }) => (
        <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
          {/* Version Badge - Top Right */}
          <VersionBadge position="top-right" size="sm" />

          <div className="w-full max-w-2xl">
            {/* Header mejorado */}
            <div className="text-center mb-12">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <IntegrateLogo size="lg" priority className="mx-auto" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#2C248E] via-[#412761] to-[#8E235D] bg-clip-text text-transparent">
                <RenderContent {...getContentWithHtml(content, "01_Header.Título Principal.titulo", "Test de Áreas Sensibles")} />
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-semibold">
                <RenderContent {...getContentWithHtml(content, "01_Header.Título Principal.subtitulo", "Diagnóstico Organizativo · Modelo INTEGRATE 2.0")} />
              </p>
            </div>

            {/* Card principal mejorado */}
            <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ borderColor: '#2C248E' }}>
              <CardHeader className="text-center py-10 border-b-2 relative overflow-hidden"
                          style={{
                            borderBottomColor: '#2C248E',
                            background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.05) 0%, rgba(142, 35, 93, 0.03) 100%)'
                          }}>
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2C248E]/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#8E235D]/10 to-transparent rounded-full blur-2xl"></div>

                <div className="flex justify-center mb-5 relative z-10">
                  <div className="p-4 rounded-2xl shadow-lg transform hover:rotate-6 transition-transform duration-300"
                       style={{ background: 'linear-gradient(135deg, #2C248E 0%, #412761 50%, #8E235D 100%)' }}>
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mb-2 relative z-10" style={{ color: '#2C248E' }}>
                  <RenderContent {...getContentWithHtml(content, "02_Card.Encabezado.titulo", "Acceso al Test")} />
                </CardTitle>
                <CardDescription className="text-base text-gray-700 mt-3 font-medium relative z-10">
                  <RenderContent {...getContentWithHtml(content, "02_Card.Encabezado.descripcion", "Introduce el código de grupo proporcionado por tu facilitador")} />
                </CardDescription>
              </CardHeader>

              <CardContent className="p-10">
                <GroupCodeForm />

                {/* Información de privacidad mejorada */}
                <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <RenderContent {...getContentWithHtml(content, "03_Privacidad.Información.titulo", "Privacidad garantizada")} />
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <RenderContent {...getContentWithHtml(content, "03_Privacidad.Información.descripcion", "Tus respuestas son <span class=\"font-semibold\">completamente anónimas</span> y se utilizan únicamente para el diagnóstico organizativo. Cumplimos con el <span class=\"font-semibold\">RGPD</span> y no almacenamos datos personales identificables.")} />
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer mejorado */}
            <div className="text-center mt-8 text-sm text-gray-600 font-medium">
              <p>Powered by <span className="font-bold bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">Integrate</span></p>
            </div>
          </div>
        </main>
      )}
    </CodeEntryContentLoader>
  );
}

