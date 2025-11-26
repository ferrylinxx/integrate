"use client";

import { useState } from "react";
import { loginAdmin } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";

interface AdminLoginFormProps {
  onLoginSuccess?: () => void;
}

/**
 * Formulario de login de administrador
 * Puede usarse en modales o páginas
 */
export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Por favor ingresa email y contraseña");
      }

      const { data, error } = await loginAdmin(email, password);

      if (error || !data) {
        throw new Error(error?.message || "Credenciales incorrectas");
      }

      login(data);
      
      // Llamar callback de éxito
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="modal-email" className="text-white font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            id="modal-email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/40"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="modal-password" className="text-white font-medium">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            id="modal-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-white/40"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-purple-900 hover:bg-white/90 font-bold py-5 shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Iniciar Sesión
          </>
        )}
      </Button>

      {/* Info */}
      <p className="text-xs text-white/60 text-center mt-4">
        Solo administradores autorizados pueden acceder a los resultados
      </p>
    </form>
  );
}

