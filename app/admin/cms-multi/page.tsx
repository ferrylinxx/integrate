"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, ClipboardCheck, BarChart3, KeyRound, Home, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { IntegrateLogo } from "@/components/integrate-logo";
import { VersionBadge } from "@/components/version-badge";
import { CMSPageEditor } from "@/components/cms-page-editor";

// Configuración de iconos y colores para cada tipo de página
const PAGE_CONFIGS = {
  landing: {
    icon: Home,
    color: "#2C248E",
    bgColor: "rgba(44, 36, 142, 0.1)",
    borderColor: "#2C248E",
    label: "Landing Page",
    description: "Página principal de bienvenida"
  },
  test: {
    icon: ClipboardCheck,
    color: "#412761",
    bgColor: "rgba(65, 39, 97, 0.1)",
    borderColor: "#412761",
    label: "Página de Test",
    description: "Cuestionario de evaluación"
  },
  results: {
    icon: BarChart3,
    color: "#8E235D",
    bgColor: "rgba(142, 35, 93, 0.1)",
    borderColor: "#8E235D",
    label: "Página de Resultados",
    description: "Visualización de resultados"
  },
  admin: {
    icon: Sparkles,
    color: "#E65B3E",
    bgColor: "rgba(230, 91, 62, 0.1)",
    borderColor: "#E65B3E",
    label: "Panel de Admin",
    description: "Gestión de grupos y administradores"
  },
  code_entry: {
    icon: KeyRound,
    color: "#F08726",
    bgColor: "rgba(240, 135, 38, 0.1)",
    borderColor: "#F08726",
    label: "Entrada de Código",
    description: "Acceso al test con código de grupo"
  }
};

export default function CMSMultiPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("landing");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const currentConfig = PAGE_CONFIGS[activeTab as keyof typeof PAGE_CONFIGS];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 pb-16">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6">
        {/* Header Mejorado con Logo INTEGRATE */}
        <div className="relative overflow-hidden rounded-3xl border-2 shadow-2xl"
             style={{
               borderColor: '#2C248E',
               background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.1) 0%, rgba(142, 35, 93, 0.06) 100%)'
             }}>
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/60"></div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <IntegrateLogo size="lg" priority />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#D91D5C] bg-clip-text text-transparent">
                    CMS Multi-Página
                  </h1>
                  <p className="text-gray-700 mt-2 font-medium">
                    Gestiona el contenido de todas las páginas desde un solo lugar
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  className="gap-2 border-2 hover:scale-105 transition-transform"
                  style={{ borderColor: '#2C248E', color: '#2C248E' }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Panel
                </Button>
                <VersionBadge position="navbar" size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs mejoradas con diseño profesional */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative overflow-hidden rounded-2xl border-2 shadow-xl mb-6"
               style={{
                 borderColor: '#2C248E',
                 background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.08) 0%, rgba(142, 35, 93, 0.04) 100%)'
               }}>
            <div className="absolute inset-0 backdrop-blur-sm bg-white/70"></div>
            <div className="relative z-10 p-4">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-transparent p-0">
                {Object.entries(PAGE_CONFIGS).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = activeTab === key;
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 data-[state=active]:shadow-lg"
                      style={{
                        borderColor: isActive ? config.borderColor : 'transparent',
                        background: isActive
                          ? `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`
                          : 'rgba(255, 255, 255, 0.5)',
                        color: isActive ? 'white' : config.color
                      }}
                    >
                      <div className="flex flex-col items-center gap-2 py-3 px-2">
                        <Icon className="h-5 w-5" />
                        <span className="text-xs md:text-sm font-semibold text-center leading-tight">
                          {config.label}
                        </span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Banner informativo de la página activa */}
          <div className="relative overflow-hidden rounded-2xl border-2 shadow-lg mb-6"
               style={{
                 borderColor: currentConfig.borderColor,
                 background: `linear-gradient(135deg, ${currentConfig.bgColor} 0%, rgba(255,255,255,0.8) 100%)`
               }}>
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl shadow-lg"
                     style={{ background: `linear-gradient(135deg, ${currentConfig.color} 0%, ${currentConfig.color}dd 100%)` }}>
                  {(() => {
                    const Icon = currentConfig.icon;
                    return <Icon className="h-6 w-6 text-white" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold"
                      style={{ color: currentConfig.color }}>
                    {currentConfig.label}
                  </h2>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    {currentConfig.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {Object.entries(PAGE_CONFIGS).map(([key, config]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <CMSPageEditor
                pageType={key as any}
                pageTitle={config.label}
                pageDescription={config.description}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Información de ayuda mejorada */}
        <div className="relative overflow-hidden rounded-2xl border-2 shadow-lg"
             style={{
               borderColor: '#2C248E',
               background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.05) 0%, rgba(142, 35, 93, 0.03) 100%)'
             }}>
          <div className="absolute inset-0 backdrop-blur-sm bg-white/70"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-[#2C248E] to-[#8E235D]">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">
                  💡 Guía del Sistema CMS Multi-Página
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-gray-200">
                    <span className="text-lg">📄</span>
                    <span><strong>Gestión por páginas:</strong> Cada pestaña gestiona el contenido de una página específica de la aplicación</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-gray-200">
                    <span className="text-lg">⚡</span>
                    <span><strong>Actualización en tiempo real:</strong> Los cambios se guardan en Supabase y se reflejan inmediatamente en las páginas</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-gray-200">
                    <span className="text-lg">💻</span>
                    <span><strong>Editor HTML:</strong> Activa el checkbox &quot;Contenido HTML&quot; y luego &quot;Editar código HTML&quot; para escribir HTML manualmente</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-gray-200">
                    <span className="text-lg">👁️</span>
                    <span><strong>Campos activos/inactivos:</strong> Los campos inactivos no se mostrarán en la página correspondiente</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-gray-200">
                    <span className="text-lg">🔢</span>
                    <span><strong>Orden de visualización:</strong> El campo &quot;display_order&quot; controla el orden en que aparecen los elementos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

