"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllGroups, deleteGroup, getGroupStats } from "@/lib/supabase";
import { Group } from "@/lib/supabase/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  Copy,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";

interface GroupWithStats extends Group {
  stats?: {
    totalSubmissions: number;
    averageScore: number;
    completionDate: string | null;
  };
}

interface GroupsListProps {
  refreshTrigger?: number;
}

export function GroupsList({ refreshTrigger }: GroupsListProps) {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getAllGroups();

      if (fetchError || !data) {
        throw new Error(fetchError?.message || "Error al cargar grupos");
      }

      // Cargar estadísticas para cada grupo
      const groupsWithStats = await Promise.all(
        data.map(async (group) => {
          const { data: stats } = await getGroupStats(group.id);
          return {
            ...group,
            stats: stats || { totalSubmissions: 0, averageScore: 0, completionDate: null },
          };
        })
      );

      setGroups(groupsWithStats);
    } catch (err) {
      console.error("Error loading groups:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [refreshTrigger]);

  const handleDelete = async (groupId: string, groupName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el grupo "${groupName}"?\n\nEsto eliminará también todas las respuestas asociadas.`)) {
      return;
    }

    setDeletingId(groupId);

    try {
      const { error: deleteError } = await deleteGroup(groupId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Recargar lista
      await loadGroups();
    } catch (err) {
      console.error("Error deleting group:", err);
      alert(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleViewGroup = (groupId: string) => {
    router.push(`/admin/grupo/${groupId}`);
  };

  if (loading) {
    return (
      <Card className="border-2 border-white/20 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.25) 0%, rgba(142, 35, 93, 0.2) 100%)',
              backdropFilter: 'blur(20px)'
            }}>
        <CardContent className="pt-20 pb-20">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-purple-400" style={{ filter: 'brightness(1.8) drop-shadow(0 0 10px rgba(142, 35, 93, 0.8))' }} />
              <div className="absolute inset-0 h-16 w-16 animate-ping text-purple-400 opacity-20">
                <Loader2 className="h-16 w-16" />
              </div>
            </div>
            <p className="text-white text-xl font-black">Cargando grupos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-red-400/40 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.25) 0%, rgba(211, 47, 47, 0.2) 100%)',
              backdropFilter: 'blur(20px)'
            }}>
        <CardContent className="pt-20 pb-20">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="p-5 rounded-2xl bg-red-500/30">
              <AlertCircle className="h-16 w-16 text-red-300" />
            </div>
            <p className="text-red-100 text-lg font-bold text-center max-w-md">{error}</p>
            <Button
              onClick={loadGroups}
              className="h-14 px-8 font-black text-base shadow-xl hover:shadow-[0_0_30px_rgba(44,36,142,0.7)] transform hover:scale-105 transition-all duration-300 text-white"
              style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}
            >
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="border-2 border-white/20 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.25) 0%, rgba(142, 35, 93, 0.2) 100%)',
              backdropFilter: 'blur(20px)'
            }}>
        <CardContent className="pt-20 pb-20">
          <div className="text-center space-y-6">
            <div className="inline-flex p-6 rounded-3xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 shadow-2xl">
              <Users className="h-20 w-20 text-purple-300" style={{ filter: 'drop-shadow(0 0 10px rgba(142, 35, 93, 0.8))' }} />
            </div>
            <div>
              <p className="text-white font-black text-2xl">No hay grupos creados</p>
              <p className="text-gray-200 text-lg font-semibold mt-3">
                Crea tu primer grupo usando el formulario de la izquierda
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-white/20 shadow-2xl hover:shadow-[0_0_50px_rgba(142,35,93,0.5)] transition-all duration-500 group"
          style={{
            background: 'linear-gradient(135deg, rgba(142, 35, 93, 0.25) 0%, rgba(217, 29, 92, 0.2) 50%, rgba(230, 91, 62, 0.15) 100%)',
            backdropFilter: 'blur(20px)'
          }}>
      <CardHeader className="border-b border-white/20 py-10 relative overflow-hidden">
        {/* Decoraciones de fondo animadas */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#8E235D]/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#D91D5C]/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Línea decorativa superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D91D5C] to-transparent opacity-60"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500"
                 style={{
                   background: 'linear-gradient(135deg, #8E235D 0%, #D91D5C 50%, #E65B3E 100%)',
                   boxShadow: '0 8px 32px rgba(142, 35, 93, 0.6), 0 0 0 1px rgba(255,255,255,0.1) inset'
                 }}>
              <Users className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-white drop-shadow-lg bg-gradient-to-r from-white via-pink-200 to-orange-200 bg-clip-text text-transparent">
                Grupos Activos
              </CardTitle>
              <CardDescription className="mt-2 text-lg text-gray-200 font-bold drop-shadow">
                {groups.length} {groups.length === 1 ? "grupo" : "grupos"} en total
              </CardDescription>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 shadow-lg"
               style={{
                 background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.2) 0%, rgba(142, 35, 93, 0.15) 100%)',
                 backdropFilter: 'blur(5px)'
               }}>
            <span className="text-sm font-bold text-gray-200">
              {groups.reduce((sum, g) => sum + (g.stats?.totalSubmissions || 0), 0)} respuestas
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-10">
        <div className="grid grid-cols-1 gap-8">
          {groups.map((group, index) => (
            <div
              key={group.id}
              className="group/card border-2 border-white/30 rounded-2xl p-8 hover:shadow-[0_0_40px_rgba(142,35,93,0.5)] transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.01] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.2) 0%, rgba(142, 35, 93, 0.15) 50%, rgba(217, 29, 92, 0.1) 100%)',
                backdropFilter: 'blur(15px)',
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Decoraciones de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-500/15 to-transparent rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

              {/* Línea decorativa superior */}
              <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-[#2C248E] via-[#D91D5C] to-[#E65B3E] group-hover/card:w-full transition-all duration-700"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex-1 space-y-5">
                  {/* Nombre y badge de estado */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-black text-white drop-shadow-lg group-hover/card:text-transparent group-hover/card:bg-gradient-to-r group-hover/card:from-purple-200 group-hover/card:to-pink-200 group-hover/card:bg-clip-text transition-all duration-300">
                        {group.name || "Sin nombre"}
                      </h3>
                      {group.stats && group.stats.totalSubmissions > 0 ? (
                        <span className="px-4 py-2 rounded-xl text-sm font-black shadow-xl transform group-hover/card:scale-110 transition-transform duration-300"
                              style={{
                                background: 'linear-gradient(135deg, rgba(67, 160, 71, 0.3) 0%, rgba(56, 142, 60, 0.25) 100%)',
                                color: '#A5D6A7',
                                border: '2px solid rgba(129, 199, 132, 0.4)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 20px rgba(67, 160, 71, 0.3)'
                              }}>
                          ✓ Activo
                        </span>
                      ) : (
                        <span className="px-4 py-2 rounded-xl text-sm font-black shadow-xl"
                              style={{
                                background: 'rgba(158, 158, 158, 0.25)',
                                color: '#E0E0E0',
                                border: '2px solid rgba(189, 189, 189, 0.4)',
                                backdropFilter: 'blur(10px)'
                              }}>
                          ○ Nuevo
                        </span>
                      )}
                    </div>

                    {/* Código del grupo */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 border-white/30 group-hover/card:border-purple-400/50 transition-all duration-300"
                           style={{
                             background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.3) 0%, rgba(142, 35, 93, 0.25) 100%)',
                             backdropFilter: 'blur(10px)'
                           }}>
                        <span className="text-xs text-purple-300 uppercase font-black tracking-wider">Código</span>
                        <span className="font-mono text-xl font-black text-white drop-shadow-lg">
                          {group.code}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(group.code)}
                        className="h-12 w-12 p-0 hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg"
                        title="Copiar código"
                      >
                        {copiedCode === group.code ? (
                          <CheckCircle2 className="h-6 w-6 text-green-400 animate-pulse" />
                        ) : (
                          <Copy className="h-6 w-6 text-purple-300" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Estadísticas mejoradas */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-blue-400/30 shadow-lg transform group-hover/card:scale-105 transition-transform duration-300"
                         style={{
                           background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(25, 118, 210, 0.2) 100%)',
                           backdropFilter: 'blur(10px)'
                         }}>
                      <div className="p-2 rounded-lg bg-blue-500/30">
                        <Users className="h-6 w-6 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-200 font-bold uppercase">Participantes</p>
                        <p className="text-lg text-white font-black">{group.stats?.totalSubmissions || 0}</p>
                      </div>
                    </div>

                    {group.stats && group.stats.totalSubmissions > 0 && (
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-green-400/30 shadow-lg transform group-hover/card:scale-105 transition-transform duration-300"
                           style={{
                             background: 'linear-gradient(135deg, rgba(67, 160, 71, 0.25) 0%, rgba(56, 142, 60, 0.2) 100%)',
                             backdropFilter: 'blur(10px)'
                           }}>
                        <div className="p-2 rounded-lg bg-green-500/30">
                          <TrendingUp className="h-6 w-6 text-green-300" />
                        </div>
                        <div>
                          <p className="text-xs text-green-200 font-bold uppercase">Promedio</p>
                          <p className="text-lg text-white font-black">{group.stats.averageScore.toFixed(1)}/4</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-purple-400/30 shadow-lg transform group-hover/card:scale-105 transition-transform duration-300"
                         style={{
                           background: 'linear-gradient(135deg, rgba(142, 35, 93, 0.25) 0%, rgba(123, 31, 162, 0.2) 100%)',
                           backdropFilter: 'blur(10px)'
                         }}>
                      <div className="p-2 rounded-lg bg-purple-500/30">
                        <Calendar className="h-6 w-6 text-purple-300" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-200 font-bold uppercase">Creado</p>
                        <p className="text-sm text-white font-black">
                          {new Date(group.created_at).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Acciones mejoradas */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => handleViewGroup(group.id)}
                    className="h-14 px-6 font-black text-base shadow-xl hover:shadow-[0_0_30px_rgba(44,36,142,0.7)] transform hover:scale-105 transition-all duration-300 text-white relative overflow-hidden group/btn"
                    style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #D91D5C 100%)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                    <Eye className="h-6 w-6 mr-2 relative z-10" />
                    <span className="relative z-10">Ver Detalles</span>
                  </Button>
                  <Button
                    onClick={() => handleDelete(group.id, group.name || group.code)}
                    disabled={deletingId === group.id}
                    variant="outline"
                    className="h-14 px-6 border-2 border-red-400/40 hover:border-red-400 text-red-200 hover:text-red-100 font-black text-base shadow-xl hover:shadow-[0_0_30px_rgba(229,57,53,0.6)] transform hover:scale-105 transition-all duration-300 disabled:transform-none disabled:opacity-50 relative overflow-hidden group/btn"
                    style={{
                      background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.2) 0%, rgba(211, 47, 47, 0.15) 100%)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                    {deletingId === group.id ? (
                      <>
                        <Loader2 className="h-6 w-6 mr-2 animate-spin relative z-10" />
                        <span className="relative z-10">Eliminando...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-6 w-6 mr-2 relative z-10" />
                        <span className="relative z-10">Eliminar</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

