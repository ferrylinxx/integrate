"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { VersionBadge } from "@/components/version-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si ya está autenticado
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

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
      router.push("/admin");
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center p-4">
      {/* Version Badge - Top Right */}
      <VersionBadge position="top-right" size="sm" />

      <Card className="w-full max-w-md border-2 shadow-2xl hover:shadow-3xl transition-all duration-300"
            style={{ borderColor: '#2C248E' }}>
        <CardHeader className="space-y-4 text-white rounded-t-xl relative overflow-hidden py-10"
                    style={{ background: 'linear-gradient(135deg, #2C248E 0%, #412761 50%, #8E235D 100%)' }}>
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-center relative z-10">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Lock className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center relative z-10">
            Panel de Administración
          </CardTitle>
          <CardDescription className="text-center text-white/90 text-base font-medium relative z-10">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8 pb-8 px-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 font-semibold text-base">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-300 focus:border-[#2C248E] text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-800 font-semibold text-base">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 border-2 border-gray-300 focus:border-[#2C248E] text-base"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-2 shadow-md">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-6 text-lg border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #D91D5C 100%)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-6 w-6" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl shadow-sm">
            <p className="text-sm text-gray-800 text-center leading-relaxed">
              <strong className="text-blue-900">Nota:</strong> Solo los administradores autorizados pueden acceder.
              <br />
              Para crear nuevos administradores, inicia sesión y ve al panel de admin.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

