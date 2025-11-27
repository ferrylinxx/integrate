"use client";

import { useState } from "react";
import { createGroup } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, Plus, Copy, Sparkles, AlertCircle } from "lucide-react";

interface CreateGroupFormProps {
  onGroupCreated?: () => void;
}

export function CreateGroupForm({ onGroupCreated }: CreateGroupFormProps) {
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ code: string; name: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("El nombre del grupo es obligatorio");
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: createError } = await createGroup(name.trim());

      if (createError || !data) {
        throw new Error(createError?.message || "Error al crear el grupo");
      }

      setSuccess({ code: data.code, name: data.name || "" });
      setName("");
      
      // Llamar callback si existe
      if (onGroupCreated) {
        onGroupCreated();
      }

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyCode = () => {
    if (success) {
      navigator.clipboard.writeText(success.code);
      alert("¡Código copiado al portapapeles!");
    }
  };

  return (
    <Card className="border border-white/20 shadow-2xl hover:shadow-[0_0_40px_rgba(44,36,142,0.5)] transition-all duration-500 group"
          style={{
            background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.25) 0%, rgba(142, 35, 93, 0.2) 50%, rgba(217, 29, 92, 0.15) 100%)',
            backdropFilter: 'blur(20px)'
          }}>
      <CardHeader className="border-b border-white/20 py-10 relative overflow-hidden">
        {/* Decoraciones de fondo animadas */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2C248E]/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#D91D5C]/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Líneas decorativas */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2C248E] to-transparent opacity-50"></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="p-4 rounded-2xl shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"
               style={{
                 background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #D91D5C 100%)',
                 boxShadow: '0 8px 32px rgba(44, 36, 142, 0.6), 0 0 0 1px rgba(255,255,255,0.1) inset'
               }}>
            <Plus className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-white drop-shadow-lg bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Crear Nuevo Grupo
            </CardTitle>
            <CardDescription className="mt-2 text-lg text-gray-200 font-semibold drop-shadow">
              Genera un código único para que los participantes realicen el test
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <Label htmlFor="groupName" className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Nombre del Grupo
            </Label>
            <div className="relative group">
              <Input
                id="groupName"
                type="text"
                placeholder="Ej: Equipo Marketing 2024"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                disabled={isCreating}
                className="h-16 border-2 border-white/30 focus:border-purple-400 text-lg font-semibold bg-white/10 text-white placeholder:text-gray-400 rounded-xl transition-all duration-300 group-hover:border-white/50 shadow-lg"
                style={{ backdropFilter: 'blur(10px)' }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-blue-400/30"
                 style={{ background: 'rgba(33, 150, 243, 0.1)', backdropFilter: 'blur(5px)' }}>
              <span className="text-2xl">💡</span>
              <p className="text-sm text-blue-200 font-semibold">
                Este nombre te ayudará a identificar el grupo en el panel
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isCreating || !name.trim()}
            className="w-full h-16 font-black text-lg shadow-2xl hover:shadow-[0_0_40px_rgba(44,36,142,0.7)] transform hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:transform-none text-white relative overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #D91D5C 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            {isCreating ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Creando grupo...
              </>
            ) : (
              <>
                <Plus className="mr-3 h-6 w-6" />
                Crear Grupo
              </>
            )}
          </Button>

          {error && (
            <div className="border-2 border-red-400/40 rounded-2xl p-5 shadow-2xl animate-shake"
                 style={{
                   background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.25) 0%, rgba(211, 47, 47, 0.2) 100%)',
                   backdropFilter: 'blur(15px)'
                 }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/30">
                  <AlertCircle className="h-6 w-6 text-red-300 flex-shrink-0" />
                </div>
                <p className="text-base text-red-100 font-bold">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="border-2 border-green-400/40 rounded-2xl p-8 space-y-6 shadow-2xl animate-slide-in relative overflow-hidden"
                 style={{
                   background: 'linear-gradient(135deg, rgba(67, 160, 71, 0.3) 0%, rgba(56, 142, 60, 0.25) 100%)',
                   backdropFilter: 'blur(15px)'
                 }}>
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-3xl"></div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl bg-green-500/40 shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-200" />
                </div>
                <p className="text-xl text-green-100 font-black">
                  ¡Grupo creado exitosamente!
                </p>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-green-400/30"
                     style={{ background: 'rgba(67, 160, 71, 0.15)' }}>
                  <Sparkles className="h-5 w-5 text-green-300" />
                  <p className="text-base text-green-100 font-bold">
                    <strong className="text-green-200">Nombre:</strong> {success.name}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-base text-green-200 font-black flex items-center gap-2">
                    <Copy className="h-5 w-5" />
                    Código del grupo:
                  </p>
                  <div className="border-2 border-green-400/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                       style={{
                         background: 'linear-gradient(135deg, rgba(67, 160, 71, 0.2) 0%, rgba(46, 125, 50, 0.15) 100%)',
                         backdropFilter: 'blur(10px)'
                       }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0"></div>
                    <p className="text-5xl font-mono font-black text-center text-white drop-shadow-lg tracking-wider relative z-10">
                      {success.code}
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCopyCode}
                    className="w-full h-14 font-black text-base shadow-xl hover:shadow-[0_0_30px_rgba(67,160,71,0.6)] transform hover:scale-105 transition-all duration-300 text-white"
                    style={{ background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)' }}
                  >
                    <Copy className="h-6 w-6 mr-3" />
                    Copiar Código
                  </Button>
                </div>

                <div className="flex items-start gap-3 px-5 py-4 rounded-xl border border-blue-400/30"
                     style={{ background: 'rgba(33, 150, 243, 0.15)', backdropFilter: 'blur(5px)' }}>
                  <span className="text-3xl">📋</span>
                  <p className="text-sm text-blue-100 font-semibold leading-relaxed">
                    Comparte este código con los participantes para que puedan acceder al test
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

