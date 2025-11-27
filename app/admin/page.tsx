"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateGroupForm } from "@/components/admin/create-group-form";
import { GroupsList } from "@/components/admin/groups-list";
import { AdminsManager } from "@/components/admin/admins-manager";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";
import { IntegrateLogo } from "@/components/integrate-logo";
import { VersionBadge } from "@/components/version-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Shield, LogOut, User, Users as UsersIcon, FileText } from "lucide-react";
import { AdminContentLoader, getContentWithHtml, RenderContent } from "@/components/admin-content-loader";

export default function AdminPage() {
  const router = useRouter();
  const { admin, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<"groups" | "admins">("groups");

  const handleGroupCreated = () => {
    // Incrementar el trigger para refrescar la lista
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <ProtectedRoute>
      <AdminContentLoader>
        {({ content }) => (
          <main className="min-h-screen bg-[#0a0a0f] relative overflow-hidden pb-16">
            {/* Video de fondo */}
            <div className="fixed inset-0 overflow-hidden" style={{ zIndex: -1 }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              >
                <source src="/fondo-landing.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Patrón de cuadrícula sutil en el fondo */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>

            <div className="relative max-w-[95%] 2xl:max-w-[1800px] mx-auto px-4 py-10 space-y-10">
              {/* Logo y versión */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <IntegrateLogo size="md" priority />
                </div>
                <VersionBadge position="navbar" size="md" />
              </div>

              {/* Header mejorado con estilo oscuro */}
              <Card className="border border-white/10 shadow-2xl hover:shadow-[0_0_30px_rgba(44,36,142,0.3)] transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.15) 0%, rgba(142, 35, 93, 0.1) 100%)',
                      backdropFilter: 'blur(10px)'
                    }}>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#D91D5C] bg-clip-text text-transparent">
                        <RenderContent {...getContentWithHtml(content, "01_Header.Título.principal", "Panel de Administración")} />
                      </h1>
                      <p className="text-gray-300 mt-2 text-lg font-medium">
                        <RenderContent {...getContentWithHtml(content, "01_Header.Título.descripcion", "Gestiona grupos y visualiza resultados del Test de Áreas Sensibles")} />
                      </p>
                  {admin && (
                    <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg border border-white/20 inline-flex"
                         style={{
                           background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.2) 0%, rgba(142, 35, 93, 0.15) 100%)',
                           backdropFilter: 'blur(5px)'
                         }}>
                      <User className="h-5 w-5 text-[#2C248E]" style={{ filter: 'brightness(1.5)' }} />
                      <span className="text-sm font-semibold text-gray-200">{admin.name} • {admin.email}</span>
                    </div>
                  )}
                </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => router.push("/admin/cms-multi")}
                        variant="outline"
                        className="border border-purple-400/30 hover:border-purple-400 text-purple-300 hover:text-purple-200 transition-all duration-300 h-11"
                        style={{
                          background: 'rgba(142, 35, 93, 0.1)',
                          backdropFilter: 'blur(5px)'
                        }}
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.cms_multi", "CMS Multi-Página")} />
                      </Button>
                      <Button
                        onClick={() => router.push("/admin/cms")}
                        variant="outline"
                        className="border border-green-400/30 hover:border-green-400 text-green-300 hover:text-green-200 transition-all duration-300 h-11"
                        style={{
                          background: 'rgba(67, 160, 71, 0.1)',
                          backdropFilter: 'blur(5px)'
                        }}
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.cms_landing", "CMS Landing")} />
                      </Button>
                      <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="border border-white/20 hover:border-[#2C248E] text-gray-300 hover:text-white transition-all duration-300 h-11"
                        style={{
                          background: 'rgba(44, 36, 142, 0.1)',
                          backdropFilter: 'blur(5px)'
                        }}
                      >
                        <Home className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.inicio", "Inicio")} />
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border border-red-400/30 hover:border-red-400 text-red-300 hover:text-red-200 transition-all duration-300 h-11"
                        style={{
                          background: 'rgba(229, 57, 53, 0.1)',
                          backdropFilter: 'blur(5px)'
                        }}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.cerrar_sesion", "Cerrar Sesión")} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs mejorados con estilo oscuro */}
              <Card className="border border-white/10 shadow-2xl hover:shadow-[0_0_30px_rgba(44,36,142,0.2)] transition-shadow duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.1) 0%, rgba(142, 35, 93, 0.08) 100%)',
                      backdropFilter: 'blur(10px)'
                    }}>
                <div className="flex border-b border-white/10">
                  <button
                    onClick={() => setActiveTab("groups")}
                    className={`flex-1 px-8 py-4 font-bold text-base transition-all duration-300 ${
                      activeTab === "groups"
                        ? "border-b-4 text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                    style={activeTab === "groups" ? {
                      borderBottomColor: '#2C248E',
                      background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.3) 0%, rgba(142, 35, 93, 0.2) 100%)',
                      boxShadow: '0 4px 20px rgba(44, 36, 142, 0.3)'
                    } : {}}
                  >
                    <Shield className="h-5 w-5 inline mr-2" />
                    <RenderContent {...getContentWithHtml(content, "03_Tabs.Navegación.grupos", "Grupos")} />
                  </button>
                  <button
                    onClick={() => setActiveTab("admins")}
                    className={`flex-1 px-8 py-4 font-bold text-base transition-all duration-300 ${
                      activeTab === "admins"
                        ? "border-b-4 text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                    style={activeTab === "admins" ? {
                      borderBottomColor: '#8E235D',
                      background: 'linear-gradient(135deg, rgba(142, 35, 93, 0.3) 0%, rgba(217, 29, 92, 0.2) 100%)',
                      boxShadow: '0 4px 20px rgba(142, 35, 93, 0.3)'
                    } : {}}
                  >
                    <UsersIcon className="h-5 w-5 inline mr-2" />
                    <RenderContent {...getContentWithHtml(content, "03_Tabs.Navegación.administradores", "Administradores")} />
                  </button>
                </div>
              </Card>

              {/* Contenido según tab activo */}
              <div>
                {activeTab === "groups" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CreateGroupForm onGroupCreated={handleGroupCreated} />
                    <GroupsList refreshTrigger={refreshTrigger} />
                  </div>
                ) : (
                  <AdminsManager />
                )}
              </div>

              {/* Footer minimalista con estilo oscuro */}
              <div className="text-center pt-8 pb-4">
                <p className="text-sm text-gray-400">© 2025 Integrate - Test de Nivel CUBO</p>
              </div>
            </div>
          </main>
        )}
      </AdminContentLoader>
    </ProtectedRoute>
  );
}

