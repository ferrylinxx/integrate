"use client";

import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RadarChartResultsProps {
  answers: AnswerValue[];
}

export function RadarChartResults({ answers }: RadarChartResultsProps) {
  // Calcular promedio por área
  const data = useMemo(() => {
    return AREA_NAMES.map((areaName, areaIndex) => {
      const startIndex = areaIndex * 4;
      const areaAnswers = answers.slice(startIndex, startIndex + 4);
      const average = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;

      return {
        area: areaName.split(":")[1].trim(), // Solo el nombre sin "Área X:"
        fullName: areaName,
        puntuacion: Number(average.toFixed(2)),
        maxPuntuacion: 4,
      };
    });
  }, [answers]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const scores = data.map(d => d.puntuacion);
    return {
      max: Math.max(...scores),
      min: Math.min(...scores),
      avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
    };
  }, [data]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-3">
          <p className="font-bold text-gray-900 mb-1">{data.fullName}</p>
          <p className="text-sm text-blue-600">
            Puntuación: <span className="font-bold">{data.puntuacion}</span> / 4
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full border-2 border-purple-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl text-purple-900">Gráfico de Radar - Resumen por Áreas</CardTitle>
            <CardDescription className="mt-1">
              Visualización del promedio de puntuación en cada una de las 6 áreas evaluadas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Estadísticas clave */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-medium text-green-700 mb-1">Máximo</p>
            <p className="text-2xl font-bold text-green-600">{stats.max}</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-700 mb-1">Promedio</p>
            <p className="text-2xl font-bold text-blue-600">{stats.avg}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs font-medium text-orange-700 mb-1">Mínimo</p>
            <p className="text-2xl font-bold text-orange-600">{stats.min}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={450}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" strokeWidth={1.5} />
            <PolarAngleAxis
              dataKey="area"
              tick={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 4]}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickCount={5}
            />
            <Radar
              name="Puntuación"
              dataKey="puntuacion"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.5}
              strokeWidth={3}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Leyenda de colores */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-md transition-shadow"
            >
              <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700 truncate">
                  {item.area}
                </p>
                <p className="text-xs text-purple-600 font-bold">
                  {item.puntuacion} / 4
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

