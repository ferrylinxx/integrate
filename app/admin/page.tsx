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
          <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 pb-16">
            <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
              {/* Logo y versión */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <IntegrateLogo size="md" priority />
                </div>
                <VersionBadge position="navbar" size="md" />
              </div>

              {/* Header mejorado */}
              <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300"
                    style={{ borderColor: '#2C248E' }}>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">
                        <RenderContent {...getContentWithHtml(content, "01_Header.Título.principal", "Panel de Administración")} />
                      </h1>
                      <p className="text-gray-700 mt-2 text-lg font-medium">
                        <RenderContent {...getContentWithHtml(content, "01_Header.Título.descripcion", "Gestiona grupos y visualiza resultados del Test de Áreas Sensibles")} />
                      </p>
                  {admin && (
                    <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 inline-flex">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-800">{admin.name} • {admin.email}</span>
                    </div>
                  )}
                </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => router.push("/admin/cms-multi")}
                        variant="outline"
                        className="border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600 hover:text-purple-700 transition-all duration-300 h-11"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.cms_multi", "CMS Multi-Página")} />
                      </Button>
                      <Button
                        onClick={() => router.push("/admin/cms")}
                        variant="outline"
                        className="border-2 border-green-300 hover:border-green-500 hover:bg-green-50 text-green-600 hover:text-green-700 transition-all duration-300 h-11"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.cms_landing", "CMS Landing")} />
                      </Button>
                      <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="border-2 border-gray-300 hover:border-[#2C248E] hover:bg-blue-50 transition-all duration-300 h-11"
                      >
                        <Home className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.inicio", "Inicio")} />
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-2 border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300 h-11"
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        <RenderContent {...getContentWithHtml(content, "02_Botones.Navegación.cerrar_sesion", "Cerrar Sesión")} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs mejorados */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    style={{ borderColor: '#2C248E' }}>
                <div className="flex border-b-2" style={{ borderBottomColor: '#2C248E' }}>
                  <button
                    onClick={() => setActiveTab("groups")}
                    className={`flex-1 px-8 py-4 font-bold text-base transition-all duration-300 ${
                      activeTab === "groups"
                        ? "border-b-4 text-white"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    style={activeTab === "groups" ? {
                      borderBottomColor: '#2C248E',
                      background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.1) 0%, rgba(142, 35, 93, 0.05) 100%)'
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
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    style={activeTab === "admins" ? {
                      borderBottomColor: '#8E235D',
                      background: 'linear-gradient(135deg, rgba(142, 35, 93, 0.1) 0%, rgba(217, 29, 92, 0.05) 100%)'
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

              {/* Footer minimalista */}
              <div className="text-center pt-8 pb-4">
                <p className="text-sm text-gray-500">© 2025 Integrate - Test de Nivel CUBO</p>
              </div>
            </div>
          </main>
        )}
      </AdminContentLoader>
    </ProtectedRoute>
  );
}

