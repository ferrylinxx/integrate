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
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Filtrar grupos en tiempo real mientras el usuario escribe
  const filteredGroups = useMemo(() => {
    if (!groupCode.trim()) return groups;

    const searchTerm = groupCode.trim().toUpperCase();
    return groups.filter(
      (group) =>
        group.code.toUpperCase().includes(searchTerm) ||
        group.name?.toUpperCase().includes(searchTerm)
    );
  }, [groupCode, groups]);

  // Mostrar sugerencias cuando hay texto y grupos disponibles
  useEffect(() => {
    setShowSuggestions(groupCode.trim().length > 0 && filteredGroups.length > 0);
  }, [groupCode, filteredGroups]);

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
      navigateToResult(groupCode.trim());
    }
  }, [groupCode, navigateToResult]);

  const handleGroupClick = useCallback((e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigateToResult(code);
  }, [navigateToResult]);

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
        className="mt-8 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Formulario siempre visible - optimizado */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              onFocus={handleInputFocus}
              placeholder={isAuthenticated ? "Código de grupo o participante" : "Acceder a resultados (requiere login)"}
              className="w-full px-4 py-3 pr-12 rounded-full backdrop-blur-md border border-white/20 focus:border-white/40 outline-none text-white placeholder-white/40 text-sm transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
              }}
              disabled={!isAuthenticated}
            />

            {/* Icono de búsqueda o loading */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loading ? (
                <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
              ) : !isAuthenticated ? (
                <Lock className="w-4 h-4 text-white/40" />
              ) : (
                <Search className="w-4 h-4 text-white/40" />
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

          {/* Indicador de navegación */}
          {navigating && (
            <motion.div
              className="absolute -bottom-8 left-0 right-0 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs text-white/60 flex items-center justify-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Cargando resultados...
              </p>
            </motion.div>
          )}
        </motion.form>

        {/* Sugerencias filtradas en tiempo real */}
        <AnimatePresence>
          {showSuggestions && !navigating && (
            <motion.div
              className="mt-4 space-y-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs text-white/40 text-center mb-2">
                {filteredGroups.length === 1 ? "Grupo encontrado:" : `${filteredGroups.length} grupos encontrados:`}
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto max-h-40 overflow-y-auto">
                {filteredGroups.slice(0, 10).map((group, index) => (
                  <motion.button
                    key={group.id}
                    onClick={(e) => handleGroupClick(e, group.code)}
                    type="button"
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 hover:border-[#2C248E] transition-all duration-200 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                    }}
                    whileHover={{ scale: 1.05, background: "linear-gradient(135deg, rgba(44, 36, 142, 0.2) 0%, rgba(142, 35, 93, 0.2) 100%)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Users className="w-3 h-3 text-white/40 group-hover:text-white/70 transition-colors" />
                    <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors font-medium">
                      {group.code}
                    </span>
                    {group.name && (
                      <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                        {group.name}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Texto de ayuda cuando no hay sugerencias */}
        {isAuthenticated && !showSuggestions && !loading && groupCode.trim().length > 0 && (
          <motion.p
            className="text-xs text-white/30 text-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No se encontraron grupos. Presiona Enter para buscar.
          </motion.p>
        )}

        {/* Hint de uso */}
        {isAuthenticated && !groupCode.trim() && groups.length > 0 && (
          <motion.p
            className="text-xs text-white/30 text-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {groups.length} {groups.length === 1 ? "grupo disponible" : "grupos disponibles"}
          </motion.p>
        )}
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

