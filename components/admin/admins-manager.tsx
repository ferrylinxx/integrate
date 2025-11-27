"use client";

import { useState, useEffect } from "react";
import { createAdmin, getAllAdmins, deleteAdmin } from "@/lib/supabase";
import { Admin } from "@/lib/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserPlus,
  Trash2,
  Mail,
  User,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
} from "lucide-react";

export function AdminsManager() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAllAdmins();
      if (error) throw error;
      setAdmins(data || []);
    } catch (err) {
      console.error("Error loading admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      if (!name || !email || !password) {
        throw new Error("Todos los campos son obligatorios");
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const { data, error } = await createAdmin(email, password, name);

      if (error || !data) {
        throw new Error(error?.message || "Error al crear administrador");
      }

      setSuccess("Administrador creado exitosamente");
      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      
      // Recargar lista
      await loadAdmins();
    } catch (err) {
      console.error("Create admin error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = async (id: string, adminEmail: string) => {
    if (!confirm(`¿Estás seguro de eliminar al administrador ${adminEmail}?`)) {
      return;
    }

    try {
      const { error } = await deleteAdmin(id);
      if (error) throw error;

      setSuccess("Administrador eliminado exitosamente");
      await loadAdmins();
    } catch (err) {
      console.error("Delete admin error:", err);
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  if (loading) {
    return (
      <Card className="border border-white/10 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(217, 29, 92, 0.15) 0%, rgba(230, 91, 62, 0.1) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" style={{ filter: 'brightness(1.5)' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/10 shadow-2xl"
           style={{
             background: 'linear-gradient(135deg, rgba(217, 29, 92, 0.15) 0%, rgba(230, 91, 62, 0.1) 100%)',
             backdropFilter: 'blur(10px)'
           }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl shadow-lg"
               style={{
                 background: 'linear-gradient(135deg, #D91D5C 0%, #E65B3E 100%)',
                 boxShadow: '0 4px 20px rgba(217, 29, 92, 0.4)'
               }}>
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Gestión de Administradores
            </h2>
            <p className="text-gray-300 font-medium mt-1">
              {admins.length} {admins.length === 1 ? 'administrador' : 'administradores'} en total
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
            setSuccess(null);
          }}
          className="h-12 px-6 rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(217,29,92,0.5)] transform hover:scale-105 transition-all font-bold text-white"
          style={{
            background: showForm
              ? 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
              : 'linear-gradient(135deg, #D91D5C 0%, #E65B3E 100%)'
          }}
        >
          <UserPlus className="h-5 w-5 mr-2" />
          {showForm ? "Cancelar" : "Nuevo Administrador"}
        </Button>
      </div>

      {/* Alertas mejoradas */}
      {error && (
        <Alert className="border border-red-400/30 shadow-2xl rounded-xl animate-shake"
               style={{
                 background: 'rgba(229, 57, 53, 0.15)',
                 backdropFilter: 'blur(10px)'
               }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg"
                 style={{ background: 'rgba(229, 57, 53, 0.3)' }}>
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <AlertDescription className="text-red-200 font-semibold">{error}</AlertDescription>
          </div>
        </Alert>
      )}

      {success && (
        <Alert className="border border-green-400/30 shadow-2xl rounded-xl animate-slide-in"
               style={{
                 background: 'rgba(67, 160, 71, 0.15)',
                 backdropFilter: 'blur(10px)'
               }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg"
                 style={{ background: 'rgba(67, 160, 71, 0.3)' }}>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <AlertDescription className="text-green-200 font-semibold">{success}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Formulario mejorado */}
      {showForm && (
        <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-slide-in"
              style={{
                background: 'linear-gradient(135deg, rgba(217, 29, 92, 0.15) 0%, rgba(240, 135, 38, 0.1) 100%)',
                backdropFilter: 'blur(10px)'
              }}>
          <CardHeader className="border-b border-white/10 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl shadow-lg"
                   style={{
                     background: 'linear-gradient(135deg, #D91D5C 0%, #F08726 100%)',
                     boxShadow: '0 4px 20px rgba(217, 29, 92, 0.4)'
                   }}>
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Crear Nuevo Administrador
                </CardTitle>
                <CardDescription className="mt-1 text-base font-medium text-gray-300">
                  Completa los datos del nuevo administrador
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              {/* Nombre */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-bold text-gray-200">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 text-base border border-white/20 rounded-xl focus:border-purple-400 bg-white/5 text-white placeholder:text-gray-400 transition-all"
                    style={{ backdropFilter: 'blur(5px)' }}
                    required
                    disabled={creating}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-bold text-gray-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 text-base border border-white/20 rounded-xl focus:border-purple-400 bg-white/5 text-white placeholder:text-gray-400 transition-all"
                    style={{ backdropFilter: 'blur(5px)' }}
                    required
                    disabled={creating}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-bold text-gray-200">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 text-base border border-white/20 rounded-xl focus:border-purple-400 bg-white/5 text-white placeholder:text-gray-400 transition-all"
                    style={{ backdropFilter: 'blur(5px)' }}
                    required
                    disabled={creating}
                    minLength={6}
                  />
                </div>
              </div>

              {/* Botón mejorado */}
              <Button
                type="submit"
                disabled={creating}
                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(217,29,92,0.5)] transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-white"
                style={{ background: 'linear-gradient(135deg, #D91D5C 0%, #F08726 100%)' }}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Creando administrador...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-6 w-6" />
                    Crear Administrador
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de administradores mejorada */}
      <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(217, 29, 92, 0.15) 0%, rgba(240, 135, 38, 0.1) 100%)',
              backdropFilter: 'blur(10px)'
            }}>
        <CardHeader className="border-b border-white/10 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl shadow-lg"
                 style={{
                   background: 'linear-gradient(135deg, #D91D5C 0%, #F08726 100%)',
                   boxShadow: '0 4px 20px rgba(217, 29, 92, 0.4)'
                 }}>
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-white">
                Administradores Actuales
              </CardTitle>
              <CardDescription className="mt-1 text-base font-medium text-gray-300">
                {admins.length} {admins.length === 1 ? 'administrador' : 'administradores'} con acceso al sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {admins.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-6 rounded-full mb-4"
                   style={{ background: 'rgba(217, 29, 92, 0.2)' }}>
                <Shield className="h-16 w-16 text-purple-400" />
              </div>
              <p className="text-gray-300 font-semibold text-lg">No hay administradores</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {admins.map((admin, index) => (
                <div
                  key={admin.id}
                  className="group border border-white/20 rounded-2xl p-6 hover:border-pink-400/50 hover:shadow-[0_0_30px_rgba(217,29,92,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                  style={{
                    background: 'linear-gradient(135deg, rgba(217, 29, 92, 0.1) 0%, rgba(230, 91, 62, 0.08) 100%)',
                    backdropFilter: 'blur(10px)',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-4 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform"
                           style={{
                             background: 'linear-gradient(135deg, #D91D5C 0%, #E65B3E 100%)',
                             boxShadow: '0 4px 20px rgba(217, 29, 92, 0.4)'
                           }}>
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
                          {admin.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-300 mb-2">
                          <Mail className="h-4 w-4 text-pink-400" />
                          <span className="text-sm font-medium">{admin.email}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 w-fit"
                             style={{
                               background: 'rgba(217, 29, 92, 0.15)',
                               backdropFilter: 'blur(5px)'
                             }}>
                          <span className="text-xs text-gray-400 font-medium">Creado:</span>
                          <span className="text-xs font-bold text-gray-200">
                            {new Date(admin.created_at).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      disabled={admins.length === 1}
                      title={admins.length === 1 ? "No puedes eliminar el último administrador" : "Eliminar administrador"}
                      className="h-12 px-6 rounded-xl text-white shadow-lg hover:shadow-[0_0_25px_rgba(229,57,53,0.5)] transform hover:scale-105 transition-all font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                      style={{ background: 'linear-gradient(135deg, #E53935 0%, #EC407A 100%)' }}
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}

