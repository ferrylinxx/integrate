"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { AREA_NAMES, INTEGRATE_COLORS } from "@/lib/constants";
import { Activity } from "lucide-react";

interface GroupRadarChartProps {
  averages: number[]; // 24 valores (promedios por pregunta)
}

export function GroupRadarChart({ averages }: GroupRadarChartProps) {
  // Calcular promedios por área
  const areaAverages = AREA_NAMES.map((name, index) => {
    const startIndex = index * 4;
    const areaValues = averages.slice(startIndex, startIndex + 4);
    const average = areaValues.reduce((sum, val) => sum + val, 0) / 4;
    
    return {
      area: name,
      promedio: Number(average.toFixed(2)),
    };
  });

  return (
    <Card className="border-2 border-purple-300 shadow-lg">
      <CardHeader className="border-b-2 border-purple-200" style={{ background: 'linear-gradient(to right, #f3f0ff, #fce7f3)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#f3e8ff' }}>
            <Activity className="h-6 w-6" style={{ color: INTEGRATE_COLORS.estrategia }} />
          </div>
          <div>
            <CardTitle className="text-2xl" style={{ color: INTEGRATE_COLORS.estrategia }}>Gráfico Radar del Grupo</CardTitle>
            <CardDescription>
              Visualización de los promedios del grupo por área de competencia
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={areaAverages}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis 
              dataKey="area" 
              tick={{ fill: "#374151", fontSize: 12 }}
              tickLine={{ stroke: "#9ca3af" }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 4]} 
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickCount={5}
            />
            <Radar
              name="Promedio del Grupo"
              dataKey="promedio"
              stroke={INTEGRATE_COLORS.persones}
              fill={INTEGRATE_COLORS.persones}
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: `2px solid ${INTEGRATE_COLORS.persones}`,
                borderRadius: "8px",
                padding: "12px",
              }}
              formatter={(value: number) => [`${value.toFixed(2)} / 4.00`, "Promedio"]}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        {/* Leyenda de interpretación */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <h4 className="font-bold text-purple-900 mb-2">Interpretación:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
            <div>• <strong>0.0 - 1.0:</strong> Muy bajo</div>
            <div>• <strong>1.1 - 2.0:</strong> Bajo</div>
            <div>• <strong>2.1 - 3.0:</strong> Medio</div>
            <div>• <strong>3.1 - 4.0:</strong> Alto</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

