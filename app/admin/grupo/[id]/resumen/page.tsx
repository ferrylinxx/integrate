"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGroupById, getGroupAreaSums, getGroupStats } from "@/lib/supabase";
import { Group } from "@/lib/supabase/types";
import { SummaryCube3D, SummaryCube3DRef } from "@/components/summary-cube-3d";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Loader2, AlertCircle, BarChart3, Info } from "lucide-react";
import { AREA_NAMES } from "@/lib/constants";

export default function GroupSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
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
        // Cargar grupo
        const { data: groupData, error: groupError } = await getGroupById(groupId);
        if (groupError || !groupData) {
          throw new Error(groupError?.message || "Grupo no encontrado");
        }
        setGroup(groupData);

        // Cargar sumas por área
        const { data: sumsData, error: sumsError } = await getGroupAreaSums(groupId);
        if (sumsError || !sumsData) {
          throw new Error(sumsError?.message || "No se pudieron cargar las sumas");
        }
        setAreaSums(sumsData);

        // Cargar estadísticas
        const { data: statsData } = await getGroupStats(groupId);
        setStats(statsData || { totalSubmissions: 0, averageScore: 0 });

      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupId]);

  const handleExportImage = async (quality: "hd" | "4k") => {
    const canvas = cube3DRef.current?.getCanvas();
    if (!canvas) {
      alert("No se pudo acceder al canvas del cubo 3D");
      return;
    }

    const width = quality === "4k" ? 3840 : 1920;
    const height = quality === "4k" ? 2160 : 1080;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(canvas, 0, 0, width, height);

    tempCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cubo-resumen-${group?.code}-${quality}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto" />
          <p className="text-xl font-semibold text-gray-700">Cargando cubo resumen...</p>
        </div>
      </main>
    );
  }

  if (error || !areaSums) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="max-w-md border-2 border-red-200">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <p className="text-xl font-semibold text-red-700">Error al cargar</p>
              <p className="text-gray-600">{error || "No hay datos disponibles"}</p>
              <Button onClick={() => router.push(`/admin/grupo/${groupId}`)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <Card className="border-2 border-pink-200 shadow-xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-600">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/grupo/${groupId}`)}
                  className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Cubo Resumen - Sumas por Área
                  </h1>
                  <p className="text-pink-100 mt-1">
                    {group?.name} ({group?.code})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white/20 text-white border-white/40">
                  {stats?.totalSubmissions} participantes
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button onClick={() => router.push("/")} className="hover:text-blue-600 transition-colors">
            Inicio
          </button>
          <span>/</span>
          <button onClick={() => router.push("/admin")} className="hover:text-blue-600 transition-colors">
            Administración
          </button>
          <span>/</span>
          <button onClick={() => router.push(`/admin/grupo/${groupId}`)} className="hover:text-blue-600 transition-colors">
            Detalles del Grupo
          </button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Cubo Resumen</span>
        </div>

        {/* Cubo 3D */}
        <Card className="border-2 border-pink-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b-2 border-pink-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-pink-900">Visualización 3D</CardTitle>
                  <CardDescription>
                    Cada cara muestra la suma promedio de las 4 preguntas de esa área
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportImage("hd")}
                  className="border-pink-300 hover:bg-pink-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  HD
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportImage("4k")}
                  className="border-pink-300 hover:bg-pink-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  4K
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-pink-500 animate-spin" />
                  </div>
                }
              >
                <SummaryCube3D ref={cube3DRef} data={areaSums} mode="sums" />
              </Suspense>
            </div>
          </CardContent>
        </Card>

        {/* Leyenda de Colores */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle>Leyenda de Colores</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#E53935] shadow-md"></div>
                <div>
                  <p className="font-semibold text-gray-900">Rojo</p>
                  <p className="text-sm text-gray-600">0 - 4</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#FB8C00] shadow-md"></div>
                <div>
                  <p className="font-semibold text-gray-900">Naranja</p>
                  <p className="text-sm text-gray-600">5 - 8</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#FDD835] shadow-md"></div>
                <div>
                  <p className="font-semibold text-gray-900">Amarillo</p>
                  <p className="text-sm text-gray-600">9 - 12</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#43A047] shadow-md"></div>
                <div>
                  <p className="font-semibold text-gray-900">Verde</p>
                  <p className="text-sm text-gray-600">13 - 16</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Nota:</strong> Los valores representan la suma promedio de las 4 preguntas de cada área.
              Cada pregunta tiene un valor de 1-4, por lo que el máximo por área es 16.
            </p>
          </CardContent>
        </Card>

        {/* Tabla de Sumas */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>Sumas Promedio por Área</CardTitle>
            <CardDescription>
              Suma promedio de las 4 preguntas de cada área entre los {stats?.totalSubmissions} participantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {AREA_NAMES.map((areaName, areaIndex) => {
                const sum = areaSums[areaIndex];
                const percentage = (sum / 16) * 100;

                return (
                  <div
                    key={areaIndex}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{areaName}</h3>
                      <p className="text-sm text-gray-600">
                        Suma de 4 preguntas (máximo: 16)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">{sum.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{percentage.toFixed(0)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

