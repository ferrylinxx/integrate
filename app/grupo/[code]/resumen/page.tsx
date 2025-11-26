"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGroupByCode, getGroupAreaSums, getGroupStats } from "@/lib/supabase";
import { Group } from "@/lib/supabase/types";
import { SummaryCube3D, SummaryCube3DRef } from "@/components/summary-cube-3d";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, AlertCircle, BarChart3 } from "lucide-react";

/**
 * Página pública del cubo resumen (sumas por área)
 */
export default function GrupoResumenPublicoPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  const cube3DRef = useRef<SummaryCube3DRef>(null);

  const [group, setGroup] = useState<Group | null>(null);
  const [areaSums, setAreaSums] = useState<number[] | null>(null);
  const [stats, setStats] = useState<{ totalSubmissions: number; averageScore: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar grupo por código
        const { data: groupData, error: groupError } = await getGroupByCode(code);
        if (groupError || !groupData) {
          throw new Error(groupError?.message || "Grupo no encontrado");
        }
        setGroup(groupData);

        // Cargar sumas por área
        const { data: sumsData, error: sumsError } = await getGroupAreaSums(groupData.id);
        if (sumsError || !sumsData) {
          throw new Error(sumsError?.message || "No se pudieron cargar las sumas");
        }
        setAreaSums(sumsData);

        // Cargar estadísticas
        const { data: statsData } = await getGroupStats(groupData.id);
        setStats(statsData || { totalSubmissions: 0, averageScore: 0 });

      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [code]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-indigo-600" />
          <p className="text-xl font-semibold text-gray-700">Cargando cubo resumen...</p>
        </div>
      </main>
    );
  }

  if (error || !group || !areaSums) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <Card className="max-w-md border-2 border-red-300">
          <CardContent className="pt-10 pb-10 text-center space-y-4">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold text-red-700">Error</h2>
            <p className="text-gray-700">{error || "No se pudieron cargar los datos"}</p>
            <Button onClick={() => router.push(`/grupo/${code}`)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <Card className="border-2 border-pink-200 shadow-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/grupo/${code}`)}
                  className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Cubo Resumen (Áreas)
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    {group.name} - {stats?.totalSubmissions || 0} participantes
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/40 text-lg px-4 py-2">
                <BarChart3 className="h-5 w-5 mr-2" />
                Promedio: {stats?.averageScore.toFixed(2)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cubo 3D */}
        <Card className="border-2 border-pink-200">
          <CardHeader>
            <CardTitle className="text-2xl">Visualización 3D</CardTitle>
            <CardDescription>
              Cubo interactivo con las sumas del grupo por área de competencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-white" />
                </div>
              }>
                <SummaryCube3D ref={cube3DRef} areaSums={areaSums} />
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

