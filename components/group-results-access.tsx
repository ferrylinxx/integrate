"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Users, Loader2, Lock, X } from "lucide-react";
import { getAllGroups } from "@/lib/supabase";
import { Group } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth-context";
import { AdminLoginForm } from "./admin/admin-login-form";

/**
 * Componente optimizado para acceder a resultados de grupo
 * Se muestra debajo del QR code en la landing page
 * REQUIERE autenticación de administrador
 *
 * MEJORAS v2.0:
 * - Input siempre visible (sin necesidad de expandir)
 * - Autocompletado inteligente en tiempo real
 * - Carga lazy de grupos solo cuando se necesita
 * - Navegación instantánea con Enter o clic
 * - Filtrado de sugerencias mientras escribes
 */
export function GroupResultsAccess() {
  const [groupCode, setGroupCode] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Cargar grupos solo una vez cuando el componente se monta (si está autenticado)
  useEffect(() => {
    if (isAuthenticated && groups.length === 0 && !loading) {
      loadGroups();
    }
  }, [isAuthenticated]);

  const loadGroups = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const { data } = await getAllGroups();
      if (data) {
        setGroups(data);
      }
    } catch (error) {
      console.error("Error loading groups:", error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Encontrar la mejor sugerencia basada en lo que escribe el usuario
  // Busca tanto por código como por nombre de grupo
  useEffect(() => {
    if (!groupCode.trim() || !isAuthenticated) {
      setSuggestion("");
      return;
    }

    const searchTerm = groupCode.trim().toUpperCase();

    // Primero buscar por código (prioridad)
    let match = groups.find((group) =>
      group.code.toUpperCase().startsWith(searchTerm)
    );

    // Si no encuentra por código, buscar por nombre
    if (!match) {
      match = groups.find((group) =>
        group.name?.toUpperCase().startsWith(searchTerm)
      );
    }

    if (match) {
      // Si coincide con el código, mostrar el código
      if (match.code.toUpperCase().startsWith(searchTerm) && match.code.toUpperCase() !== searchTerm) {
        setSuggestion(match.code);
      }
      // Si coincide con el nombre, mostrar el código del grupo encontrado
      else if (match.name?.toUpperCase().startsWith(searchTerm) && match.name.toUpperCase() !== searchTerm) {
        setSuggestion(match.name);
      } else {
        setSuggestion("");
      }
    } else {
      setSuggestion("");
    }
  }, [groupCode, groups, isAuthenticated]);

  const navigateToResult = useCallback((code: string) => {
    if (navigating) return;

    // Verificar autenticación antes de navegar
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setNavigating(true);
    router.push(`/resultado/${code}`);
  }, [navigating, isAuthenticated, router]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (groupCode.trim()) {
      const searchTerm = groupCode.trim().toUpperCase();

      // Buscar si el texto ingresado coincide con un nombre de grupo
      const matchByName = groups.find((group) =>
        group.name?.toUpperCase() === searchTerm
      );

      // Si encuentra por nombre, navegar con el código del grupo
      if (matchByName) {
        navigateToResult(matchByName.code);
      } else {
        // Si no, asumir que es un código y navegar directamente
        navigateToResult(groupCode.trim());
      }
    }
  }, [groupCode, groups, navigateToResult]);

  const handleInputFocus = useCallback(() => {
    // Si no está autenticado, mostrar modal de login
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Cargar grupos si aún no se han cargado
    if (groups.length === 0 && !loading) {
      loadGroups();
    }
  }, [isAuthenticated, groups.length, loading, loadGroups]);

  // Manejar tecla Tab para autocompletar
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault();

      const searchTerm = groupCode.trim().toUpperCase();

      // Buscar el grupo que coincide
      const match = groups.find((group) =>
        group.code.toUpperCase().startsWith(searchTerm) ||
        group.name?.toUpperCase().startsWith(searchTerm)
      );

      if (match) {
        // Si autocompletó por nombre, poner el nombre completo
        // Si autocompletó por código, poner el código completo
        if (match.name?.toUpperCase().startsWith(searchTerm)) {
          setGroupCode(match.name);
        } else {
          setGroupCode(match.code);
        }
      } else {
        setGroupCode(suggestion);
      }

      setSuggestion("");
    }
  }, [suggestion, groupCode, groups]);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginModal(false);
    // Cargar grupos después del login
    if (groups.length === 0) {
      loadGroups();
    }
  }, [groups.length, loadGroups]);

  const handleCloseModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return (
    <>
      <motion.div
        className="mt-6 w-full max-w-[200px] mx-auto"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          delay: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Formulario siempre visible - con autocompletado inline */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative">
            {/* Input con fondo */}
            <div
              className="absolute inset-0 rounded-full backdrop-blur-md"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                zIndex: 0,
              }}
            />

            {/* Texto de sugerencia (ghost text) encima del fondo */}
            {suggestion && (
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-xs font-mono"
                style={{
                  color: "rgba(255, 255, 255, 0.3)",
                  zIndex: 1,
                }}
              >
                <span style={{ visibility: "hidden" }}>{groupCode}</span>
                <span>{suggestion.slice(groupCode.length)}</span>
              </div>
            )}

            {/* Input transparente encima de todo */}
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={isAuthenticated ? "Código o nombre" : "Resultados"}
              className="relative w-full px-3 py-2 pr-9 rounded-full border border-white/10 focus:border-white/30 outline-none text-white placeholder-white/30 text-xs transition-all duration-300 bg-transparent"
              style={{
                zIndex: 2,
              }}
              disabled={!isAuthenticated}
              autoComplete="off"
            />

            {/* Icono de búsqueda o loading - más pequeño */}
            <div
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2"
              style={{ zIndex: 3 }}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 text-white/30 animate-spin" />
              ) : !isAuthenticated ? (
                <Lock className="w-3.5 h-3.5 text-white/30" />
              ) : (
                <Search className="w-3.5 h-3.5 text-white/30" />
              )}
            </div>

            {/* Botón de submit (invisible pero funcional con Enter) */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
              disabled={!groupCode.trim() || navigating || !isAuthenticated}
              aria-label="Buscar"
            />
          </div>

          {/* Hint de Tab para autocompletar */}
          {suggestion && !navigating && (
            <motion.p
              className="absolute -bottom-4 left-0 right-0 text-center text-[8px] text-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tab ↹
            </motion.p>
          )}

          {/* Indicador de navegación - más sutil */}
          {navigating && (
            <motion.div
              className="absolute -bottom-6 left-0 right-0 text-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-[10px] text-white/40 flex items-center justify-center gap-1.5">
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                Cargando...
              </p>
            </motion.div>
          )}
        </motion.form>

      </motion.div>

      {/* Modal de Login */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-md"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative rounded-2xl border border-white/20 p-8 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(44, 36, 142, 0.95) 0%, rgba(142, 35, 93, 0.95) 100%)",
                }}
              >
                {/* Botón cerrar */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5 text-white/60 hover:text-white/90" />
                </button>

                {/* Título */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Acceso Restringido
                  </h2>
                  <p className="text-white/70 text-sm">
                    Inicia sesión como administrador para acceder a los resultados
                  </p>
                </div>

                {/* Formulario de login */}
                <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

