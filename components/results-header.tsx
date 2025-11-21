"use client";

import { useMemo, useState } from "react";
import { AnswerValue } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Home, Calendar, TrendingUp, Award } from "lucide-react";

interface ResultsHeaderProps {
  participantCode: string;
  answers: AnswerValue[];
  timestamp: number;
  onGoHome: () => void;
  userName?: string | null;
}

export function ResultsHeader({ participantCode, answers, timestamp, onGoHome, userName }: ResultsHeaderProps) {
  const [copied, setCopied] = useState(false);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = answers.reduce((sum, val) => sum + val, 0);
    const average = total / answers.length;
    const maxScore = 4;
    const percentage = (average / maxScore) * 100;
    
    // Determinar nivel
    let level = "";
    let levelColor = "";
    let levelBg = "";
    
    if (percentage >= 90) {
      level = "Excelente";
      levelColor = "text-green-700";
      levelBg = "bg-green-100 border-green-300";
    } else if (percentage >= 75) {
      level = "Muy Bueno";
      levelColor = "text-blue-700";
      levelBg = "bg-blue-100 border-blue-300";
    } else if (percentage >= 60) {
      level = "Bueno";
      levelColor = "text-yellow-700";
      levelBg = "bg-yellow-100 border-yellow-300";
    } else if (percentage >= 50) {
      level = "Regular";
      levelColor = "text-orange-700";
      levelBg = "bg-orange-100 border-orange-300";
    } else {
      level = "Necesita Mejorar";
      levelColor = "text-red-700";
      levelBg = "bg-red-100 border-red-300";
    }

    return {
      average: average.toFixed(2),
      percentage: percentage.toFixed(1),
      level,
      levelColor,
      levelBg,
      total,
      maxPossible: answers.length * maxScore,
    };
  }, [answers]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(participantCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date(timestamp).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI0IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
      
      <div className="relative px-4 py-8 md:px-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoHome}
              className="gap-2 text-white/90 hover:text-white hover:bg-white/10"
            >
              <Home className="h-4 w-4" />
              Inicio
            </Button>
            <span>/</span>
            <span className="text-white font-medium">Resultados</span>
          </div>

          {/* Título principal */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              {userName ? `Resultados de ${userName}` : "Resultados del Test"}
            </h1>
            <p className="text-lg text-white/90">
              Evaluación de Competencias Profesionales
            </p>
          </div>

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Código de participante */}
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {userName ? "Código de Respuesta" : "Código de Participante"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl font-bold text-gray-900 font-mono">
                      {participantCode}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fecha de completitud */}
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm font-medium">Fecha de Completitud</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formattedDate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Puntuación promedio */}
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm font-medium">Puntuación Promedio</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {stats.average}
                    </span>
                    <span className="text-lg text-gray-600">/ 4.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen ejecutivo */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-xl">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nivel alcanzado */}
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-600">Nivel Alcanzado</p>
                  <div className={`inline-block px-6 py-3 rounded-full border-2 ${stats.levelBg}`}>
                    <span className={`text-xl font-bold ${stats.levelColor}`}>
                      {stats.level}
                    </span>
                  </div>
                </div>

                {/* Porcentaje */}
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-600">Porcentaje de Logro</p>
                  <div className="relative">
                    <div className="text-4xl font-bold text-blue-600">
                      {stats.percentage}%
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-1000 ease-out"
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Puntos totales */}
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
                  <div className="text-4xl font-bold text-gray-900">
                    {stats.total}
                    <span className="text-xl text-gray-500 ml-1">/ {stats.maxPossible}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

