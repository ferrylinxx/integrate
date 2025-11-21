"use client";

import { useMemo } from "react";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Lightbulb, Target, Award, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

// Mensajes de feedback personalizados por área y rango de puntuación
export const AREA_FEEDBACK: Record<number, Record<string, { title: string; message: string; actions: string[] }>> = {
  0: { // Estrategia
    "low": {
      title: "Estrategia necesita atención urgente",
      message: "La planificación estratégica requiere desarrollo inmediato. Sin una estrategia clara, la organización carece de dirección.",
      actions: [
        "Definir visión y misión organizacional clara",
        "Establecer objetivos SMART a corto y largo plazo",
        "Realizar análisis FODA completo",
        "Crear plan estratégico con métricas medibles"
      ]
    },
    "medium": {
      title: "Estrategia en desarrollo",
      message: "Existe una base estratégica, pero necesita fortalecerse para guiar efectivamente a la organización.",
      actions: [
        "Revisar y actualizar la estrategia actual",
        "Alinear objetivos departamentales con la estrategia",
        "Mejorar comunicación de la estrategia al equipo",
        "Implementar sistema de seguimiento de KPIs"
      ]
    },
    "good": {
      title: "Estrategia sólida",
      message: "La organización cuenta con una estrategia bien definida que guía las decisiones y acciones.",
      actions: [
        "Mantener revisiones periódicas de la estrategia",
        "Fomentar innovación estratégica",
        "Compartir mejores prácticas con otras áreas",
        "Preparar planes de contingencia"
      ]
    }
  },
  1: { // Estructura
    "low": {
      title: "Estructura organizacional deficiente",
      message: "La falta de estructura clara genera confusión, duplicación de esfuerzos y baja eficiencia operativa.",
      actions: [
        "Definir organigrama claro con roles y responsabilidades",
        "Establecer procesos documentados para tareas clave",
        "Crear canales de comunicación formales",
        "Implementar sistema de gestión de proyectos"
      ]
    },
    "medium": {
      title: "Estructura en proceso de mejora",
      message: "Existe una estructura básica, pero requiere optimización para mejorar la eficiencia organizacional.",
      actions: [
        "Revisar y optimizar procesos existentes",
        "Clarificar líneas de reporte y autoridad",
        "Eliminar redundancias en la estructura",
        "Mejorar documentación de procedimientos"
      ]
    },
    "good": {
      title: "Estructura bien organizada",
      message: "La organización cuenta con una estructura clara que facilita la operación eficiente y la colaboración.",
      actions: [
        "Mantener flexibilidad para adaptarse a cambios",
        "Revisar periódicamente la efectividad de la estructura",
        "Fomentar colaboración entre departamentos",
        "Documentar y compartir mejores prácticas"
      ]
    }
  },
  2: { // Orientación
    "low": {
      title: "Orientación y enfoque dispersos",
      message: "La falta de orientación clara resulta en esfuerzos descoordinados y recursos mal utilizados.",
      actions: [
        "Definir prioridades organizacionales claras",
        "Establecer criterios de toma de decisiones",
        "Alinear proyectos con objetivos estratégicos",
        "Crear sistema de priorización de iniciativas"
      ]
    },
    "medium": {
      title: "Orientación parcialmente definida",
      message: "Existe cierta orientación, pero necesita mayor claridad y consistencia en su aplicación.",
      actions: [
        "Reforzar comunicación de prioridades",
        "Mejorar alineación entre áreas",
        "Establecer métricas de progreso claras",
        "Revisar regularmente el enfoque estratégico"
      ]
    },
    "good": {
      title: "Orientación clara y efectiva",
      message: "La organización mantiene un enfoque claro que guía las decisiones y maximiza el impacto.",
      actions: [
        "Mantener comunicación constante de prioridades",
        "Adaptar orientación según cambios del entorno",
        "Celebrar logros alineados con la orientación",
        "Fomentar innovación dentro del enfoque definido"
      ]
    }
  },
  3: { // Eficacia
    "low": {
      title: "Eficacia operativa muy baja",
      message: "Los resultados no cumplen expectativas. Se requiere intervención inmediata para mejorar la efectividad.",
      actions: [
        "Identificar y eliminar cuellos de botella",
        "Establecer métricas de desempeño claras",
        "Implementar metodologías de mejora continua",
        "Capacitar al equipo en gestión de resultados"
      ]
    },
    "medium": {
      title: "Eficacia moderada con margen de mejora",
      message: "Se logran algunos resultados, pero hay oportunidades significativas para aumentar la efectividad.",
      actions: [
        "Optimizar procesos críticos",
        "Mejorar seguimiento de indicadores",
        "Implementar ciclos de retroalimentación",
        "Reducir desperdicios y retrabajos"
      ]
    },
    "good": {
      title: "Alta eficacia operativa",
      message: "La organización logra consistentemente sus objetivos y genera resultados de calidad.",
      actions: [
        "Mantener estándares de excelencia",
        "Buscar oportunidades de optimización continua",
        "Compartir mejores prácticas internamente",
        "Establecer nuevos desafíos de desempeño"
      ]
    }
  },
  4: { // Recursos
    "low": {
      title: "Gestión de recursos crítica",
      message: "Los recursos no se gestionan adecuadamente, generando desperdicios y limitando el potencial organizacional.",
      actions: [
        "Realizar inventario completo de recursos",
        "Implementar sistema de control presupuestario",
        "Optimizar asignación de recursos",
        "Establecer políticas de uso eficiente"
      ]
    },
    "medium": {
      title: "Gestión de recursos mejorable",
      message: "Existe gestión básica de recursos, pero se puede optimizar para mayor eficiencia y efectividad.",
      actions: [
        "Mejorar planificación de recursos",
        "Implementar herramientas de seguimiento",
        "Reducir costos innecesarios",
        "Capacitar en gestión eficiente de recursos"
      ]
    },
    "good": {
      title: "Excelente gestión de recursos",
      message: "Los recursos se gestionan eficientemente, maximizando su valor y minimizando desperdicios.",
      actions: [
        "Mantener disciplina en gestión de recursos",
        "Buscar oportunidades de optimización",
        "Invertir en recursos estratégicos",
        "Compartir mejores prácticas de gestión"
      ]
    }
  },
  5: { // Personas
    "low": {
      title: "Gestión de personas requiere atención urgente",
      message: "El talento humano no está siendo desarrollado ni aprovechado adecuadamente, afectando el desempeño general.",
      actions: [
        "Implementar programa de desarrollo de talento",
        "Mejorar comunicación y liderazgo",
        "Crear plan de capacitación estructurado",
        "Establecer sistema de reconocimiento y motivación"
      ]
    },
    "medium": {
      title: "Gestión de personas en desarrollo",
      message: "Existe atención al talento humano, pero se requiere mayor inversión en desarrollo y bienestar.",
      actions: [
        "Fortalecer programas de capacitación",
        "Mejorar clima organizacional",
        "Implementar planes de carrera",
        "Aumentar retroalimentación y coaching"
      ]
    },
    "good": {
      title: "Excelente gestión del talento",
      message: "El equipo está comprometido, desarrollado y motivado, siendo el principal activo de la organización.",
      actions: [
        "Mantener inversión en desarrollo continuo",
        "Fomentar cultura de innovación y aprendizaje",
        "Reconocer y retener talento clave",
        "Promover liderazgo interno"
      ]
    }
  }
};

interface ResultsInsightsProps {
  answers: AnswerValue[];
}

export function ResultsInsights({ answers }: ResultsInsightsProps) {
  const analysis = useMemo(() => {
    // Calcular promedio por área
    const areaAverages = AREA_NAMES.map((areaName, areaIndex) => {
      const startIndex = areaIndex * 4;
      const areaAnswers = answers.slice(startIndex, startIndex + 4);
      const average = areaAnswers.reduce((sum, val) => sum + val, 0) / 4;

      // Determinar rango de puntuación
      let scoreRange: "low" | "medium" | "good";
      if (average < 2.0) {
        scoreRange = "low";
      } else if (average < 3.0) {
        scoreRange = "medium";
      } else {
        scoreRange = "good";
      }

      // Obtener feedback personalizado
      const feedback = AREA_FEEDBACK[areaIndex][scoreRange];

      return {
        name: areaName,
        shortName: areaName.split(":")[1].trim(),
        average: Number(average.toFixed(2)),
        index: areaIndex,
        scoreRange,
        feedback,
      };
    });

    // Ordenar por promedio
    const sorted = [...areaAverages].sort((a, b) => b.average - a.average);
    
    // Identificar fortalezas (top 3)
    const strengths = sorted.slice(0, 3);
    
    // Identificar áreas de mejora (bottom 3)
    const improvements = sorted.slice(-3).reverse();
    
    // Calcular promedio general
    const overallAverage = areaAverages.reduce((sum, area) => sum + area.average, 0) / areaAverages.length;

    // Generar recomendaciones
    const recommendations = [];
    
    if (overallAverage >= 3.5) {
      recommendations.push({
        icon: Award,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        title: "Excelente Desempeño",
        text: "Tus resultados son sobresalientes. Continúa desarrollando tus fortalezas y considera compartir tu conocimiento con otros.",
      });
    } else if (overallAverage >= 3.0) {
      recommendations.push({
        icon: Target,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        title: "Buen Desempeño",
        text: "Tienes una base sólida. Enfócate en las áreas de mejora identificadas para alcanzar la excelencia.",
      });
    } else if (overallAverage >= 2.5) {
      recommendations.push({
        icon: TrendingUp,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        title: "Desempeño Moderado",
        text: "Hay oportunidades claras de crecimiento. Prioriza el desarrollo en las áreas identificadas como mejorables.",
      });
    } else {
      recommendations.push({
        icon: AlertCircle,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        title: "Oportunidad de Desarrollo",
        text: "Se recomienda un plan de desarrollo enfocado. Considera buscar mentoría o capacitación en las áreas clave.",
      });
    }

    // Recomendaciones específicas por área
    improvements.forEach((area) => {
      if (area.average < 2.5) {
        recommendations.push({
          icon: Lightbulb,
          color: "text-purple-600",
          bg: "bg-purple-50",
          border: "border-purple-200",
          title: `Desarrollar: ${area.shortName}`,
          text: `Esta área requiere atención prioritaria. Considera establecer objetivos específicos y medibles para mejorar.`,
        });
      }
    });

    return {
      strengths,
      improvements,
      recommendations,
      overallAverage: Number(overallAverage.toFixed(2)),
    };
  }, [answers]);

  return (
    <div className="space-y-6">
      {/* Título de la sección */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Análisis de Resultados</h2>
        <p className="text-gray-600">
          Insights personalizados basados en tu evaluación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fortalezas */}
        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-900">Fortalezas Identificadas</CardTitle>
                <CardDescription>Áreas donde destacas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {analysis.strengths.map((strength, index) => (
                <div
                  key={strength.index}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{strength.shortName}</p>
                      <p className="text-xs text-gray-600">Área {strength.index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{strength.average}</p>
                    <p className="text-xs text-gray-600">/ 4.00</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Áreas de mejora */}
        <Card className="border-2 border-orange-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-orange-900">Áreas de Mejora</CardTitle>
                <CardDescription>Oportunidades de desarrollo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {analysis.improvements.map((improvement, index) => (
                <div
                  key={improvement.index}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{improvement.shortName}</p>
                      <p className="text-xs text-gray-600">Área {improvement.index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">{improvement.average}</p>
                    <p className="text-xs text-gray-600">/ 4.00</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-blue-900">Recomendaciones Personalizadas</CardTitle>
              <CardDescription>Sugerencias basadas en tus resultados</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${rec.bg} ${rec.border} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${rec.bg}`}>
                      <Icon className={`h-5 w-5 ${rec.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold mb-1 ${rec.color}`}>{rec.title}</h4>
                      <p className="text-sm text-gray-700">{rec.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Detallado por Área - NUEVO */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-purple-900">Plan de Acción por Área</CardTitle>
              <CardDescription>Recomendaciones específicas para cada área INTEGRATE</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {analysis.improvements.map((area) => {
              // Determinar color e icono según el rango
              const getStatusConfig = (range: string) => {
                switch (range) {
                  case "low":
                    return {
                      icon: AlertTriangle,
                      color: "text-red-600",
                      bg: "bg-red-50",
                      border: "border-red-200",
                      badgeBg: "bg-red-100",
                      badgeText: "text-red-700"
                    };
                  case "medium":
                    return {
                      icon: AlertCircle,
                      color: "text-yellow-600",
                      bg: "bg-yellow-50",
                      border: "border-yellow-200",
                      badgeBg: "bg-yellow-100",
                      badgeText: "text-yellow-700"
                    };
                  default:
                    return {
                      icon: CheckCircle2,
                      color: "text-green-600",
                      bg: "bg-green-50",
                      border: "border-green-200",
                      badgeBg: "bg-green-100",
                      badgeText: "text-green-700"
                    };
                }
              };

              const config = getStatusConfig(area.scoreRange);
              const Icon = config.icon;

              return (
                <div
                  key={area.index}
                  className={`p-5 rounded-xl border-2 ${config.border} ${config.bg} hover:shadow-lg transition-all`}
                >
                  {/* Header del área */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${config.badgeBg}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold text-lg ${config.color}`}>
                            {area.shortName}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}>
                            Área {area.index + 1}
                          </span>
                        </div>
                        <p className={`text-sm font-semibold ${config.color}`}>
                          {area.feedback.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-3xl font-bold ${config.color}`}>{area.average}</p>
                      <p className="text-xs text-gray-600">/ 4.00</p>
                    </div>
                  </div>

                  {/* Mensaje de feedback */}
                  <div className="mb-4 p-3 bg-white/50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {area.feedback.message}
                    </p>
                  </div>

                  {/* Acciones recomendadas */}
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-purple-600" />
                      Acciones Recomendadas:
                    </h5>
                    <ul className="space-y-2">
                      {area.feedback.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full ${config.badgeBg} ${config.badgeText} flex items-center justify-center text-xs font-bold`}>
                            {idx + 1}
                          </span>
                          <span className="flex-1">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

