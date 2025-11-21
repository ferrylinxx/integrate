"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES, VALUE_COLORS, SUB_AREA_NAMES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BarChartResultsProps {
  answers: AnswerValue[];
}

export function BarChartResults({ answers }: BarChartResultsProps) {
  // Preparar datos para el gráfico
  const data = useMemo(() => {
    return answers.map((value, index) => {
      const areaIndex = Math.floor(index / 4);
      const questionInArea = (index % 4) + 1;
      
      return {
        name: `P${index + 1}`,
        fullName: SUB_AREA_NAMES[index],
        area: AREA_NAMES[areaIndex],
        areaShort: `Área ${areaIndex + 1}`,
        questionNumber: questionInArea,
        valor: value,
        color: VALUE_COLORS[value],
      };
    });
  }, [answers]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 rounded-lg shadow-lg p-3 max-w-xs">
          <p className="font-bold text-gray-900 mb-1">{data.areaShort}</p>
          <p className="text-sm text-gray-700 mb-2">{data.fullName}</p>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: data.color }}
            />
            <p className="text-sm font-semibold">
              Nivel: {data.valor}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Agrupar datos por área para mostrar separadores visuales
  const groupedData = useMemo(() => {
    const groups: { [key: string]: typeof data } = {};
    data.forEach((item) => {
      if (!groups[item.areaShort]) {
        groups[item.areaShort] = [];
      }
      groups[item.areaShort].push(item);
    });
    return groups;
  }, [data]);

  return (
    <Card className="w-full border-2 border-indigo-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl text-indigo-900">Gráfico de Barras - Detalle por Pregunta</CardTitle>
            <CardDescription className="mt-1">
              Visualización individual de las 24 preguntas agrupadas por área
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#374151", fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tick={{ fill: "#374151", fontSize: 12 }}
              label={{
                value: "Nivel",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#374151", fontWeight: 600 },
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
            <Bar dataKey="valor" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Leyenda de áreas */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Áreas Evaluadas:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.entries(groupedData).map(([areaShort, questions], index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
              >
                <p className="text-xs font-bold text-blue-900 mb-1">{areaShort}</p>
                <p className="text-xs text-gray-600">
                  {questions.length} preguntas (P{questions[0].name.slice(1)} - P{questions[questions.length - 1].name.slice(1)})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda de colores */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Escala de Niveles:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([1, 2, 3, 4] as AnswerValue[]).map((level) => (
              <div
                key={level}
                className="flex items-center gap-2 p-2 rounded-lg border-2"
                style={{ borderColor: VALUE_COLORS[level] }}
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: VALUE_COLORS[level] }}
                />
                <span className="text-sm font-semibold text-gray-700">
                  Nivel {level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

