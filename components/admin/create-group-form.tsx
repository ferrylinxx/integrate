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
    <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ borderColor: '#2C248E' }}>
      <CardHeader className="border-b-2 py-8 relative overflow-hidden"
                  style={{
                    borderBottomColor: '#2C248E',
                    background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.05) 0%, rgba(142, 35, 93, 0.03) 100%)'
                  }}>
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#2C248E]/10 to-transparent rounded-full blur-xl"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 rounded-xl shadow-md transform hover:rotate-6 transition-transform duration-300"
               style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}>
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Crear Nuevo Grupo
            </CardTitle>
            <CardDescription className="mt-2 text-base text-gray-700 font-medium">
              Genera un código único para que los participantes realicen el test
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="groupName" className="text-base font-bold text-gray-800">
              Nombre del Grupo
            </Label>
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
              className="h-12 border-2 border-gray-300 focus:border-[#2C248E] text-base"
            />
            <p className="text-sm text-gray-600 font-medium">
              💡 Este nombre te ayudará a identificar el grupo en el panel
            </p>
          </div>

          <Button
            type="submit"
            disabled={isCreating || !name.trim()}
            className="w-full h-12 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
            style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creando grupo...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Crear Grupo
              </>
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800 font-semibold">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 space-y-4 shadow-md">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <p className="text-base text-green-900 font-bold">
                  ¡Grupo creado exitosamente!
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-green-800 font-semibold">
                  <strong>Nombre:</strong> {success.name}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-green-700 font-bold mb-2">Código del grupo:</p>
                    <div className="bg-white border-2 border-green-400 rounded-xl p-4 shadow-sm">
                      <p className="text-3xl font-mono font-bold text-center text-gray-900">
                        {success.code}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleCopyCode}
                    size="sm"
                    className="h-12 px-5 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Copiar
                  </Button>
                </div>
                <p className="text-sm text-green-700 font-medium">
                  📋 Comparte este código con los participantes para que puedan acceder al test
                </p>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

