"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Users, Loader2 } from "lucide-react";
import { getAllGroups } from "@/lib/supabase";
import { Group } from "@/lib/supabase/types";

/**
 * Componente sutil para acceder a resultados de grupo
 * Se muestra debajo del QR code en la landing page
 */
export function GroupResultsAccess() {
  const [groupCode, setGroupCode] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();

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
      setNavigating(true);
      // Redirigir a la página de resultados (funciona para grupo o participante)
      router.push(`/resultado/${groupCode.trim()}`);
    }
  }, [groupCode, navigating, router]);

  const handleGroupClick = useCallback((e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!navigating) {
      setNavigating(true);
      router.push(`/resultado/${code}`);
    }
  }, [navigating, router]);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(true);
  }, []);

  const handleCollapse = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(false);
    setGroupCode("");
  }, []);

  return (
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
          <Search className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
          <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">
            Acceder a resultados
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
  );
}

