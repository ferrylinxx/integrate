"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, Key, Loader2, CheckCircle2, AlertCircle, User } from "lucide-react";

export function GroupCodeForm() {
  const [groupCode, setGroupCode] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isUserNameFocused, setIsUserNameFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar código de grupo
    if (!groupCode.trim()) {
      setError("Por favor, ingresa un código de grupo");
      return;
    }

    // Validar nombre de usuario
    if (!userName.trim()) {
      setUserNameError("Por favor, ingresa tu nombre");
      return;
    }

    if (userName.trim().length < 2) {
      setUserNameError("El nombre debe tener al menos 2 caracteres");
      return;
    }

    if (userName.trim().length > 50) {
      setUserNameError("El nombre no puede tener más de 50 caracteres");
      return;
    }

    setIsLoading(true);

    // Simular validación con delay para mostrar animación
    await new Promise(resolve => setTimeout(resolve, 800));

    // Guardar en sessionStorage para usar en la página de test
    sessionStorage.setItem("currentGroupCode", groupCode.trim());
    sessionStorage.setItem("currentUserName", userName.trim());
    router.push("/test");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Campo de Código de Grupo */}
      <div className="space-y-3">
        <Label
          htmlFor="groupCode"
          className="text-base font-semibold text-gray-700 flex items-center gap-2"
        >
          <Key className="w-5 h-5 text-purple-600" />
          Código de Grupo
        </Label>

        <div className="relative group">
          <Input
            id="groupCode"
            type="text"
            placeholder="Ej: ABC123XYZ"
            value={groupCode}
            onChange={(e) => {
              setGroupCode(e.target.value.toUpperCase());
              setError("");
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            className={`
              h-16 text-2xl font-bold text-center tracking-widest uppercase
              border-2 rounded-2xl transition-all duration-300
              ${error
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : isFocused
                  ? "border-purple-500 bg-purple-50 focus:ring-4 focus:ring-purple-100"
                  : "border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal
            `}
          />

          {/* Icono de estado */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {error && (
              <AlertCircle className="w-6 h-6 text-red-500 animate-shake" />
            )}
            {groupCode && !error && !isLoading && (
              <CheckCircle2 className="w-6 h-6 text-green-500 animate-scale-in" />
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200 animate-slide-down">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {groupCode && !error && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200 animate-slide-down">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">Código válido • Listo para comenzar</p>
          </div>
        )}
      </div>

      {/* Campo de Nombre de Usuario */}
      <div className="space-y-3">
        <Label
          htmlFor="userName"
          className="text-base font-semibold text-gray-700 flex items-center gap-2"
        >
          <User className="w-5 h-5 text-purple-600" />
          Tu Nombre
        </Label>

        <div className="relative group">
          <Input
            id="userName"
            type="text"
            placeholder="Ej: María García"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              setUserNameError("");
            }}
            onFocus={() => setIsUserNameFocused(true)}
            onBlur={() => setIsUserNameFocused(false)}
            disabled={isLoading}
            maxLength={50}
            className={`
              h-16 text-xl font-medium text-center
              border-2 rounded-2xl transition-all duration-300
              ${userNameError
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : isUserNameFocused
                  ? "border-purple-500 bg-purple-50 focus:ring-4 focus:ring-purple-100"
                  : "border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              }
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              placeholder:text-gray-400 placeholder:font-normal
            `}
          />

          {/* Icono de estado */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {userNameError && (
              <AlertCircle className="w-6 h-6 text-red-500 animate-shake" />
            )}
            {userName && !userNameError && !isLoading && userName.length >= 2 && (
              <CheckCircle2 className="w-6 h-6 text-green-500 animate-scale-in" />
            )}
          </div>
        </div>

        {userNameError && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200 animate-slide-down">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{userNameError}</p>
          </div>
        )}

        {userName && !userNameError && userName.length >= 2 && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200 animate-slide-down">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">Nombre válido</p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || !groupCode.trim() || !userName.trim() || userName.trim().length < 2}
        className="w-full h-16 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
        style={{
          background: isLoading || !groupCode.trim() || !userName.trim() || userName.trim().length < 2
            ? '#9ca3af'
            : 'linear-gradient(135deg, #2C248E 0%, #D91D5C 100%)'
        }}
      >
        {/* Efecto de brillo animado */}
        {!isLoading && groupCode.trim() && userName.trim() && userName.trim().length >= 2 && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
        )}

        <span className="relative flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Validando datos...
            </>
          ) : (
            <>
              Empezar Test
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </span>
      </Button>


    </form>
  );
}

