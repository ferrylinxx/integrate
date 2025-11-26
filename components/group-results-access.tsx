"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Users, Loader2, Lock, X } from "lucide-react";
import { getAllGroups } from "@/lib/supabase";
import { Group } from "@/lib/supabase/types";
import { useAuth } from "@/lib/auth-context";
import { AdminLoginForm } from "./admin/admin-login-form";

/**
 * Componente sutil para acceder a resultados de grupo
 * Se muestra debajo del QR code en la landing page
 * REQUIERE autenticación de administrador
 */
export function GroupResultsAccess() {
  const [groupCode, setGroupCode] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Cargar grupos cuando se expande
  useEffect(() => {
    if (isExpanded && groups.length === 0 && !loading) {
      loadGroups();
    }
  }, [isExpanded]);

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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (groupCode.trim() && !navigating) {
      // Verificar autenticación antes de navegar
      if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
      }

      setNavigating(true);
      // Redirigir a la página de resultados (funciona para grupo o participante)
      router.push(`/resultado/${groupCode.trim()}`);
    }
  }, [groupCode, navigating, isAuthenticated, router]);

  const handleGroupClick = useCallback((e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!navigating) {
      // Verificar autenticación antes de navegar
      if (!isAuthenticated) {
        setShowLoginModal(true);
        return;
      }

      setNavigating(true);
      router.push(`/resultado/${code}`);
    }
  }, [navigating, isAuthenticated, router]);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Verificar autenticación antes de expandir
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setIsExpanded(true);
  }, [isAuthenticated]);

  const handleCollapse = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(false);
    setGroupCode("");
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginModal(false);
    setIsExpanded(true);
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
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {/* Botón para expandir */}
        {!isExpanded ? (
          <motion.button
            onClick={handleExpand}
            type="button"
            className="group flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Lock className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
            <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">
              Acceder a resultados {!isAuthenticated && "(requiere login)"}
            </span>
          </motion.button>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              placeholder="Código de grupo"
              className="px-4 py-2 pr-10 rounded-full backdrop-blur-md border border-white/20 focus:border-white/40 outline-none text-white placeholder-white/40 text-sm transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
                minWidth: "200px",
              }}
              autoFocus
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          </div>

          <motion.button
            type="submit"
            className="p-2 rounded-full backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{
              background: groupCode.trim()
                ? "linear-gradient(135deg, #2C248E 0%, #8E235D 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
            }}
            disabled={!groupCode.trim() || navigating}
            whileHover={groupCode.trim() && !navigating ? { scale: 1.1 } : {}}
            whileTap={groupCode.trim() && !navigating ? { scale: 0.9 } : {}}
          >
            {navigating ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 text-white" />
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleCollapse}
            className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancelar
          </motion.button>
        </motion.form>
      )}

      {/* Sugerencias de grupos */}
      <AnimatePresence>
        {isExpanded && groups.length > 0 && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-white/40 text-center mb-2">
              Grupos disponibles:
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {groups.map((group, index) => (
                <motion.button
                  key={group.id}
                  onClick={(e) => handleGroupClick(e, group.code)}
                  type="button"
                  disabled={navigating}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
                  }}
                  whileHover={!navigating ? { scale: 1.05 } : {}}
                  whileTap={!navigating ? { scale: 0.95 } : {}}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {navigating ? (
                    <Loader2 className="w-3 h-3 text-white/40 animate-spin" />
                  ) : (
                    <Users className="w-3 h-3 text-white/40 group-hover:text-white/70 transition-colors" />
                  )}
                  <span className="text-xs text-white/60 group-hover:text-white/90 transition-colors font-medium">
                    {group.code}
                  </span>
                  <span className="text-xs text-white/30 group-hover:text-white/50 transition-colors">
                    {group.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Texto de ayuda sutil */}
      {isExpanded && groups.length === 0 && !loading && (
        <motion.p
          className="text-xs text-white/30 text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Introduce el código de tu grupo para ver los resultados
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

