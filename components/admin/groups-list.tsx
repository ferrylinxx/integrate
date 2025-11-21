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
      <Card className="border-2 shadow-lg" style={{ borderColor: '#2C248E' }}>
        <CardContent className="pt-16 pb-16">
          <div className="flex flex-col items-center justify-center space-y-5">
            <Loader2 className="h-12 w-12 animate-spin" style={{ color: '#2C248E' }} />
            <p className="text-gray-800 text-base font-semibold">Cargando grupos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 shadow-lg" style={{ borderColor: '#E65B3E' }}>
        <CardContent className="pt-16 pb-16">
          <div className="flex flex-col items-center justify-center space-y-5">
            <AlertCircle className="h-12 w-12 text-red-600" />
            <p className="text-red-800 text-base font-semibold">{error}</p>
            <Button
              onClick={loadGroups}
              size="sm"
              className="h-10 px-6 font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
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
      <Card className="border-2 shadow-lg" style={{ borderColor: '#2C248E' }}>
        <CardContent className="pt-16 pb-16">
          <div className="text-center space-y-5">
            <Users className="h-16 w-16 mx-auto" style={{ color: '#2C248E' }} />
            <div>
              <p className="text-gray-900 font-bold text-lg">No hay grupos creados</p>
              <p className="text-gray-700 text-base font-medium mt-2">
                Crea tu primer grupo usando el formulario de la izquierda
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={{ borderColor: '#2C248E' }}>
      <CardHeader className="border-b-2 py-8 relative overflow-hidden"
                  style={{
                    borderBottomColor: '#2C248E',
                    background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.05) 0%, rgba(142, 35, 93, 0.03) 100%)'
                  }}>
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#8E235D]/10 to-transparent rounded-full blur-xl"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl shadow-md transform hover:rotate-6 transition-transform duration-300"
                 style={{ background: 'linear-gradient(135deg, #8E235D 0%, #D91D5C 100%)' }}>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Grupos Activos
              </CardTitle>
              <CardDescription className="mt-2 text-base text-gray-700 font-medium">
                {groups.length} {groups.length === 1 ? "grupo" : "grupos"} en total
              </CardDescription>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-blue-200 shadow-sm">
            <span className="text-sm font-bold text-gray-800">
              {groups.reduce((sum, g) => sum + (g.stats?.totalSubmissions || 0), 0)} respuestas
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white transform hover:-translate-y-1"
              style={{ borderColor: '#2C248E' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex-1 space-y-4">
                  {/* Nombre y código */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {group.name || "Sin nombre"}
                      </h3>
                      {group.stats && group.stats.totalSubmissions > 0 ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold shadow-sm">
                          ✓ Activo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold shadow-sm">
                          ○ Nuevo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl shadow-sm">
                        <span className="text-xs text-gray-600 uppercase font-bold">Código</span>
                        <span className="font-mono text-base font-bold text-gray-900">
                          {group.code}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(group.code)}
                        className="h-10 w-10 p-0 hover:bg-blue-100 rounded-lg transition-colors duration-300"
                        title="Copiar código"
                      >
                        {copiedCode === group.code ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-600" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="flex flex-wrap items-center gap-5 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-800 font-semibold">{group.stats?.totalSubmissions || 0} participantes</span>
                    </div>
                    {group.stats && group.stats.totalSubmissions > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="text-gray-800 font-semibold">Promedio: {group.stats.averageScore.toFixed(1)}/4</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="text-gray-800 font-semibold">
                        {new Date(group.created_at).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleViewGroup(group.id)}
                    size="sm"
                    className="h-11 px-5 font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Ver Detalles
                  </Button>
                  <Button
                    onClick={() => handleDelete(group.id, group.name || group.code)}
                    disabled={deletingId === group.id}
                    size="sm"
                    variant="outline"
                    className="h-11 px-5 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:transform-none"
                  >
                    {deletingId === group.id ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-5 w-5 mr-2" />
                        Eliminar
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

