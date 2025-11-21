"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getGroupById,
  getSubmissionsByGroup,
  getGroupStats,
  getGroupAverages,
  getGroupAreaSums
} from "@/lib/supabase";
import { deleteSubmission } from "@/lib/supabase/submissions";
import { Group, Submission } from "@/lib/supabase/types";
import { ProtectedRoute } from "@/components/protected-route";
import { GroupRadarChart } from "@/components/admin/group-radar-chart";
import { GroupBarChart } from "@/components/admin/group-bar-chart";
import { VersionBadge } from "@/components/version-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Users,
  Calendar,
  TrendingUp,
  Loader2,
  AlertCircle,
  Eye,
  Copy,
  CheckCircle2,
  BarChart3,
  Box,
  Trash2
} from "lucide-react";
import { AREA_NAMES } from "@/lib/constants";

interface GroupStats {
  totalSubmissions: number;
  averageScore: number;
  completionDate: string | null;
}

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<GroupStats | null>(null);
  const [averages, setAverages] = useState<number[] | null>(null);
  const [areaSums, setAreaSums] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingParticipant, setDeletingParticipant] = useState<string | null>(null);

  useEffect(() => {
    const loadGroupData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar datos del grupo
        const { data: groupData, error: groupError } = await getGroupById(groupId);

        if (groupError || !groupData) {
          throw new Error(groupError?.message || "Grupo no encontrado");
        }

        setGroup(groupData);

        // Cargar submissions del grupo
        const { data: submissionsData, error: submissionsError } = await getSubmissionsByGroup(groupId);

        if (submissionsError) {
          throw new Error(submissionsError.message);
        }

        setSubmissions(submissionsData || []);

        // Cargar estadísticas
        const { data: statsData } = await getGroupStats(groupId);
        setStats(statsData || { totalSubmissions: 0, averageScore: 0, completionDate: null });

        // Cargar promedios para cubo de grupo
        const { data: averagesData } = await getGroupAverages(groupId);
        setAverages(averagesData);

        // Cargar sumas por área para cubo resumen
        const { data: sumsData } = await getGroupAreaSums(groupId);
        setAreaSums(sumsData);

      } catch (err) {
        console.error("Error loading group data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleViewResult = (participantCode: string) => {
    router.push(`/resultado/${participantCode}`);
  };

  const handleViewGroupCube = () => {
    router.push(`/admin/grupo/${groupId}/cubo`);
  };

  const handleViewSummaryCube = () => {
    router.push(`/admin/grupo/${groupId}/resumen`);
  };

  const handleDeleteParticipant = async (participantCode: string, userName: string | null) => {
    // Confirmación antes de eliminar
    const confirmMessage = userName
      ? `¿Estás seguro de que deseas eliminar al participante "${userName}"?\n\nCódigo: ${participantCode}\n\nEsta acción no se puede deshacer.`
      : `¿Estás seguro de que deseas eliminar al participante con código "${participantCode}"?\n\nEsta acción no se puede deshacer.`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingParticipant(participantCode);

    try {
      // Eliminar la submission
      const { success, error } = await deleteSubmission(participantCode);

      if (!success || error) {
        throw new Error(error?.message || "Error al eliminar el participante");
      }

      // Recargar todos los datos del grupo para actualizar métricas
      const { data: submissionsData, error: submissionsError } = await getSubmissionsByGroup(groupId);

      if (submissionsError) {
        throw new Error(submissionsError.message);
      }

      setSubmissions(submissionsData || []);

      // Recargar estadísticas
      const { data: statsData } = await getGroupStats(groupId);
      setStats(statsData || { totalSubmissions: 0, averageScore: 0, completionDate: null });

      // Recargar promedios para cubo de grupo
      const { data: averagesData } = await getGroupAverages(groupId);
      setAverages(averagesData);

      // Recargar sumas por área para cubo resumen
      const { data: sumsData } = await getGroupAreaSums(groupId);
      setAreaSums(sumsData);

      // Mostrar mensaje de éxito
      alert(`Participante eliminado exitosamente.\n\nTodas las métricas del grupo han sido recalculadas.`);

    } catch (err) {
      console.error("Error deleting participant:", err);
      alert(`Error al eliminar el participante:\n\n${err instanceof Error ? err.message : "Error desconocido"}`);
    } finally {
      setDeletingParticipant(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="text-center space-y-4">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto" />
            <p className="text-xl font-semibold text-gray-700">Cargando datos del grupo...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="max-w-md border-2 border-red-200">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <p className="text-xl font-semibold text-red-700">Error al cargar</p>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => router.push("/admin")} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <Card className="border-2 border-indigo-200 shadow-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {group?.name || "Detalles del Grupo"}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-indigo-100">
                      Código: <span className="font-mono font-bold">{group?.code}</span>
                    </p>
                    {group && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(group.code)}
                        className="h-6 px-2 text-white hover:bg-white/20"
                      >
                        {copiedCode === group.code ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <VersionBadge position="navbar" size="md" className="bg-white/20 backdrop-blur-sm border-white/40" />
            </div>
          </CardContent>
        </Card>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => router.push("/")}
            className="hover:text-blue-600 transition-colors"
          >
            Inicio
          </button>
          <span>/</span>
          <button
            onClick={() => router.push("/admin")}
            className="hover:text-blue-600 transition-colors"
          >
            Administración
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Detalles del Grupo</span>
        </div>

        {/* Estadísticas del Grupo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Participantes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">
                {stats?.totalSubmissions || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total de respuestas</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Promedio</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                {stats?.averageScore.toFixed(2) || "0.00"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Puntuación media</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Última Actividad</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-purple-600">
                {stats?.completionDate 
                  ? new Date(stats.completionDate).toLocaleDateString("es-ES")
                  : "Sin actividad"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Fecha más reciente</p>
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
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Necesitas al menos 1 participante
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
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Necesitas al menos 1 participante
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
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
            <CardTitle className="text-2xl text-purple-900">
              Lista de Participantes ({submissions.length})
            </CardTitle>
            <CardDescription>
              Todas las respuestas recibidas para este grupo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No hay participantes aún</p>
                <p className="text-sm text-gray-500 mt-2">
                  Comparte el código del grupo para que los participantes realicen el test
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission, index) => {
                  const totalScore = submission.answers.reduce((sum, val) => sum + val, 0);
                  const averageScore = totalScore / submission.answers.length;
                  const percentage = (averageScore / 4) * 100;

                  return (
                    <div
                      key={submission.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                            <span className="text-purple-700 font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            {/* Nombre de usuario como identificador principal */}
                            {submission.user_name ? (
                              <>
                                <p className="text-base font-bold text-gray-900 mb-1">
                                  👤 {submission.user_name}
                                </p>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-gray-500">Código:</span>
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {submission.participant_code}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyCode(submission.participant_code)}
                                    className="h-5 px-1"
                                  >
                                    {copiedCode === submission.participant_code ? (
                                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-700">Participante</span>
                                <Badge variant="outline" className="font-mono">
                                  {submission.participant_code}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyCode(submission.participant_code)}
                                  className="h-6 px-2"
                                >
                                  {copiedCode === submission.participant_code ? (
                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            )}
                            <p className="text-sm text-gray-500">
                              📅 {new Date(submission.timestamp).toLocaleString("es-ES")}
                            </p>
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
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResult(submission.participant_code)}
                              className="border-blue-300 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteParticipant(submission.participant_code, submission.user_name)}
                              disabled={deletingParticipant === submission.participant_code}
                              className="border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              {deletingParticipant === submission.participant_code ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
    </ProtectedRoute>
  );
}

