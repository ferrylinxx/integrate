"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { AREA_NAMES, AREA_COLORS, INTEGRATE_COLORS } from "@/lib/constants";
import { BarChart3 } from "lucide-react";

interface GroupBarChartProps {
  averages: number[]; // 24 valores (promedios por pregunta)
}

// Función para obtener color según el promedio
function getColorFromAverage(value: number): string {
  if (value <= 1) return "#E53935"; // Rojo
  if (value <= 2) return "#FB8C00"; // Naranja
  if (value <= 3) return "#FDD835"; // Amarillo
  return "#43A047"; // Verde
}

export function GroupBarChart({ averages }: GroupBarChartProps) {
  // Calcular promedios por área
  const areaAverages = AREA_NAMES.map((name, index) => {
    const startIndex = index * 4;
    const areaValues = averages.slice(startIndex, startIndex + 4);
    const average = areaValues.reduce((sum, val) => sum + val, 0) / 4;

    return {
      area: name.length > 20 ? name.substring(0, 20) + "..." : name,
      fullArea: name,
      promedio: Number(average.toFixed(2)),
      color: AREA_COLORS[index], // Usar color del área de Integrate
    };
  });

  return (
    <Card className="border-2 border-purple-300 shadow-lg">
      <CardHeader className="border-b-2 border-purple-200" style={{ background: 'linear-gradient(to right, #f3f0ff, #fce7f3)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#f3e8ff' }}>
            <BarChart3 className="h-6 w-6" style={{ color: INTEGRATE_COLORS.orientacio }} />
          </div>
          <div>
            <CardTitle className="text-2xl" style={{ color: INTEGRATE_COLORS.orientacio }}>Gráfico de Barras del Grupo</CardTitle>
            <CardDescription>
              Comparación de promedios del grupo por área de competencia
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={areaAverages}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="area" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: "#374151", fontSize: 11 }}
              interval={0}
            />
            <YAxis 
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tick={{ fill: "#374151", fontSize: 12 }}
              label={{ 
                value: "Promedio", 
                angle: -90, 
                position: "insideLeft",
                style: { fill: "#374151", fontSize: 14, fontWeight: "bold" }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid #3b82f6",
                borderRadius: "8px",
                padding: "12px",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value.toFixed(2)} / 4.00`,
                props.payload.fullArea
              ]}
              labelFormatter={(label) => ""}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
              formatter={() => "Promedio del Grupo"}
            />
            <Bar 
              dataKey="promedio" 
              name="Promedio del Grupo"
              radius={[8, 8, 0, 0]}
            >
              {areaAverages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Leyenda de colores */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h4 className="font-bold text-blue-900 mb-3">Leyenda de Colores:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#E53935]"></div>
              <span className="text-sm text-blue-800">0.0 - 1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#FB8C00]"></div>
              <span className="text-sm text-blue-800">1.1 - 2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#FDD835]"></div>
              <span className="text-sm text-blue-800">2.1 - 3.0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#43A047]"></div>
              <span className="text-sm text-blue-800">3.1 - 4.0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

