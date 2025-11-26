"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getGroupByCode,
  getSubmissionsByGroup,
  getGroupStats,
  getGroupAverages,
  getGroupAreaSums
} from "@/lib/supabase";
import { Group, Submission } from "@/lib/supabase/types";
import { GroupRadarChart } from "@/components/admin/group-radar-chart";
import { GroupBarChart } from "@/components/admin/group-bar-chart";
import { VersionBadge } from "@/components/version-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, TrendingUp, Box, BarChart3, Eye, Loader2, AlertCircle } from "lucide-react";
import { AREA_NAMES } from "@/lib/constants";

/**
 * Página pública de resultados de grupo (acceso por código)
 * Similar a /admin/grupo/[id] pero sin autenticación
 */
export default function GrupoPublicoPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<{ totalSubmissions: number; averageScore: number; completionDate: string | null } | null>(null);
  const [averages, setAverages] = useState<number[] | null>(null);
  const [areaSums, setAreaSums] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        // Obtener grupo por código
        const { data: groupData, error: groupError } = await getGroupByCode(code);

        if (groupError || !groupData) {
          setError("Grupo no encontrado");
          setLoading(false);
          return;
        }

        setGroup(groupData);

        // Cargar submissions del grupo
        const { data: submissionsData } = await getSubmissionsByGroup(groupData.id);
        setSubmissions(submissionsData || []);

        // Cargar estadísticas
        const { data: statsData } = await getGroupStats(groupData.id);
        setStats(statsData || { totalSubmissions: 0, averageScore: 0, completionDate: null });

        // Cargar promedios para cubo de grupo
        const { data: averagesData } = await getGroupAverages(groupData.id);
        setAverages(averagesData);

        // Cargar sumas por área para cubo resumen
        const { data: sumsData } = await getGroupAreaSums(groupData.id);
        setAreaSums(sumsData);

      } catch (err) {
        console.error("Error loading group data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [code]);

  const handleViewGroupCube = () => {
    if (group) {
      router.push(`/grupo/${code}/cubo`);
    }
  };

  const handleViewSummaryCube = () => {
    if (group) {
      router.push(`/grupo/${code}/resumen`);
    }
  };

  const handleViewResult = (participantCode: string) => {
    router.push(`/resultado/${participantCode}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600" />
          <p className="text-xl font-semibold text-gray-700">Cargando resultados del grupo...</p>
        </div>
      </main>
    );
  }

  if (error || !group) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
        <Card className="max-w-md border-2 shadow-2xl" style={{ borderColor: '#E65B3E' }}>
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            <div className="p-6 rounded-3xl w-28 h-28 mx-auto flex items-center justify-center shadow-xl"
                 style={{ background: 'linear-gradient(135deg, #E65B3E 0%, #D91D5C 100%)' }}>
              <AlertCircle className="h-14 w-14 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#E65B3E] to-[#D91D5C] bg-clip-text text-transparent">
              Código no encontrado
            </h2>
            <p className="text-gray-700 font-semibold text-lg">
              No se encontraron resultados para el código:
            </p>
            <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200">
              <span className="font-mono font-bold text-xl" style={{ color: '#E65B3E' }}>{code}</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300"
              style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}
            >
              Volver al inicio
            </button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <VersionBadge position="top-right" size="sm" />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <Card className="border-2 border-indigo-200 shadow-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {group.name || "Detalles del Grupo"}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-white/80 text-sm">Código:</span>
                    <span className="font-mono font-bold text-white bg-white/20 px-3 py-1 rounded-lg">
                      {group.code}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-blue-900">Participantes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {stats?.totalSubmissions || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total de respuestas</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-green-900">Promedio</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.averageScore.toFixed(2) || "0.00"}
                </p>
                <p className="text-sm text-gray-600 mt-1">Puntuación media</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-purple-900">Última Actividad</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-purple-600">
                  {formatDate(stats?.completionDate || null)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Fecha más reciente</p>
              </CardContent>
            </Card>
          </div>

          {/* Botones de Visualización */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-indigo-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Box className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>Cubo de Grupo (Promedios)</CardTitle>
                    <CardDescription>
                      Visualiza el cubo 3D con promedios por pregunta
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleViewGroupCube}
                  disabled={!averages || submissions.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Box className="h-4 w-4 mr-2" />
                  Ver Cubo de Promedios
                </Button>
                {submissions.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    No hay respuestas disponibles
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle>Cubo Resumen (Áreas)</CardTitle>
                    <CardDescription>
                      Visualiza el cubo 3D con sumas por área
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleViewSummaryCube}
                  disabled={!areaSums || submissions.length === 0}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Cubo Resumen
                </Button>
                {submissions.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    No hay respuestas disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gráficos del Grupo */}
          {averages && submissions.length > 0 && (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Análisis del Grupo</h2>
                <p className="text-gray-600">
                  Visualización de los promedios del grupo en diferentes formatos
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Radar */}
                <GroupRadarChart averages={averages} />

                {/* Gráfico de Barras */}
                <GroupBarChart averages={averages} />
              </div>
            </div>
          )}

          {/* Lista de Participantes */}
          {submissions.length > 0 && (
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Participantes del Grupo</CardTitle>
                <CardDescription>
                  Lista de todas las respuestas recibidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission, index) => {
                    const answers = submission.answers as number[];
                    const totalScore = answers.reduce((sum, val) => sum + val, 0);
                    const averageScore = totalScore / answers.length;
                    const percentage = ((averageScore - 1) / 3) * 100;

                    return (
                      <div
                        key={submission.participant_code}
                        className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                        style={{ borderColor: '#E0E7FF' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-300">
                                #{index + 1}
                              </Badge>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {submission.user_name || `Participante ${index + 1}`}
                                </p>
                                <p className="text-sm text-gray-500 font-mono">
                                  {submission.participant_code}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                {averageScore.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {percentage.toFixed(0)}%
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResult(submission.participant_code)}
                              className="border-blue-300 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );

