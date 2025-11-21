"use client";

import { useMemo } from "react";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES, AREA_COLORS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Target, Lightbulb } from "lucide-react";

interface CubeRecommendationsProps {
  answers: AnswerValue[];
}

// Recomendaciones específicas por área
const AREA_RECOMMENDATIONS = {
  0: { // Estrategia
    icon: "📊",
    recommendations: [
      "Desarrolla un plan estratégico claro con objetivos medibles",
      "Realiza análisis FODA periódicos para identificar oportunidades",
      "Establece KPIs para monitorear el progreso estratégico",
      "Involucra al equipo en la definición de la visión y misión"
    ]
  },
  1: { // Estructura
    icon: "🏗️",
    recommendations: [
      "Revisa y optimiza los procesos organizacionales",
      "Define roles y responsabilidades claramente",
      "Implementa sistemas de gestión de calidad",
      "Mejora la comunicación entre departamentos"
    ]
  },
  2: { // Orientación
    icon: "🎯",
    recommendations: [
      "Alinea los objetivos individuales con los organizacionales",
      "Establece prioridades claras y comunícalas efectivamente",
      "Implementa sistemas de seguimiento de objetivos",
      "Fomenta una cultura orientada a resultados"
    ]
  },
  3: { // Eficacia
    icon: "⚡",
    recommendations: [
      "Optimiza los procesos para mejorar la productividad",
      "Implementa herramientas de automatización donde sea posible",
      "Establece métricas de eficiencia y monitoréalas regularmente",
      "Capacita al equipo en metodologías ágiles"
    ]
  },
  4: { // Recursos
    icon: "💰",
    recommendations: [
      "Optimiza la asignación de recursos según prioridades",
      "Implementa sistemas de control presupuestario",
      "Busca oportunidades de ahorro sin comprometer la calidad",
      "Invierte en tecnología que mejore la eficiencia"
    ]
  },
  5: { // Personas
    icon: "👥",
    recommendations: [
      "Desarrolla programas de capacitación y desarrollo",
      "Implementa sistemas de reconocimiento y motivación",
      "Fomenta un ambiente de trabajo positivo y colaborativo",
      "Realiza evaluaciones de desempeño periódicas y constructivas"
    ]
  }
};

export function CubeRecommendations({ answers }: CubeRecommendationsProps) {
  const analysis = useMemo(() => {
    // Dividir las 24 respuestas en 6 áreas de 4 valores cada una
    const areas = [];
    for (let i = 0; i < 6; i++) {
      const areaValues = answers.slice(i * 4, (i + 1) * 4);
      const average = areaValues.reduce((sum, val) => sum + val, 0) / areaValues.length;
      areas.push({
        index: i,
        name: AREA_NAMES[i],
        shortName: AREA_NAMES[i].split(": ")[1],
        average: Number(average.toFixed(2)),
        values: areaValues,
        color: AREA_COLORS[i],
        icon: AREA_RECOMMENDATIONS[i as keyof typeof AREA_RECOMMENDATIONS].icon
      });
    }

    // Identificar áreas que necesitan atención (promedio < 2.5)
    const areasNeedingAttention = areas.filter(area => area.average < 2.5);
    
    // Identificar áreas críticas (promedio < 2.0)
    const criticalAreas = areas.filter(area => area.average < 2.0);

    // Calcular promedio general
    const overallAverage = areas.reduce((sum, area) => sum + area.average, 0) / areas.length;

    return {
      areas,
      areasNeedingAttention,
      criticalAreas,
      overallAverage: Number(overallAverage.toFixed(2))
    };
  }, [answers]);

  // Si no hay áreas que necesiten atención, no mostrar el componente
  if (analysis.areasNeedingAttention.length === 0) {
    return (
      <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-green-900">¡Excelente Desempeño!</CardTitle>
              <CardDescription>
                Todas tus áreas están en buen nivel. Sigue así.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700">
            Tu promedio general es <span className="font-bold text-lg">{analysis.overallAverage}</span> / 4.00.
            Continúa manteniendo este nivel de excelencia en todas las áreas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-orange-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Lightbulb className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <CardTitle className="text-orange-900">Recomendaciones Personalizadas</CardTitle>
            <CardDescription>
              Áreas de oportunidad identificadas: {analysis.areasNeedingAttention.length}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Áreas críticas (si las hay) */}
        {analysis.criticalAreas.length > 0 && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-red-900">Atención Prioritaria</h3>
            </div>
            <p className="text-sm text-red-700 mb-3">
              Las siguientes áreas requieren atención inmediata (promedio &lt; 2.0):
            </p>
            <div className="space-y-2">
              {analysis.criticalAreas.map((area) => (
                <div
                  key={area.index}
                  className="flex items-center gap-2 text-sm font-semibold text-red-800"
                >
                  <span className="text-lg">{area.icon}</span>
                  <span>{area.shortName}</span>
                  <span className="ml-auto text-red-600">{area.average} / 4.00</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones por área */}
        {analysis.areasNeedingAttention.map((area) => (
          <div
            key={area.index}
            className="p-5 rounded-lg border-2 hover:shadow-md transition-shadow"
            style={{
              backgroundColor: `${area.color}10`,
              borderColor: `${area.color}40`
            }}
          >
            {/* Header del área */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg shadow-md flex items-center justify-center text-xl"
                  style={{ backgroundColor: area.color }}
                >
                  {area.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{area.shortName}</h3>
                  <p className="text-xs text-gray-600">Promedio: {area.average} / 4.00</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold text-orange-600">
                  {area.average < 2.0 ? "Crítico" : "Mejorar"}
                </span>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Acciones recomendadas:</p>
              {AREA_RECOMMENDATIONS[area.index as keyof typeof AREA_RECOMMENDATIONS].recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-700 bg-white/60 p-2 rounded"
                >
                  <span className="text-orange-600 font-bold flex-shrink-0">{idx + 1}.</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Mensaje motivacional */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 text-center font-medium">
            💪 <span className="font-bold">Recuerda:</span> Cada área de mejora es una oportunidad de crecimiento.
            Implementa estas recomendaciones gradualmente y verás resultados positivos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

