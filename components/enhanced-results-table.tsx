"use client";

import { useMemo } from "react";
import { AnswerValue } from "@/lib/types";
import { AREA_NAMES, QUESTION_LABELS, VALUE_COLORS } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, MinusCircle, XCircle } from "lucide-react";

interface EnhancedResultsTableProps {
  data: AnswerValue[];
}

export function EnhancedResultsTable({ data }: EnhancedResultsTableProps) {
  // Agrupar datos por área
  const groupedData = useMemo(() => {
    return AREA_NAMES.map((areaName, areaIndex) => {
      const startIndex = areaIndex * 4;
      const questions = QUESTION_LABELS.slice(startIndex, startIndex + 4).map((label, qIndex) => ({
        label,
        value: data[startIndex + qIndex],
        globalIndex: startIndex + qIndex,
      }));
      
      const average = questions.reduce((sum, q) => sum + q.value, 0) / 4;
      
      return {
        areaName,
        shortName: areaName.split(":")[1].trim(),
        questions,
        average: Number(average.toFixed(2)),
      };
    });
  }, [data]);

  // Función para obtener icono según valor
  const getIcon = (value: AnswerValue) => {
    switch (value) {
      case 4:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 3:
        return <MinusCircle className="h-5 w-5 text-yellow-600" />;
      case 2:
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 1:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  // Función para obtener badge según valor
  const getBadge = (value: AnswerValue) => {
    const configs = {
      4: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", label: "Excelente" },
      3: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300", label: "Bueno" },
      2: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", label: "Regular" },
      1: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", label: "Bajo" },
    };
    
    const config = configs[value];
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 ${config.bg} ${config.border}`}>
        {getIcon(value)}
        <span className={`text-sm font-bold ${config.text}`}>{value}</span>
        <span className={`text-xs font-medium ${config.text}`}>({config.label})</span>
      </div>
    );
  };

  return (
    <Card className="w-full border-2 border-gray-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl text-gray-900">Tabla Detallada de Resultados</CardTitle>
            <CardDescription className="mt-1">
              Desglose completo de todas las respuestas por área y pregunta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {groupedData.map((area, areaIndex) => (
            <div
              key={areaIndex}
              className="border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header del área */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{area.areaName}</h3>
                    <p className="text-sm text-gray-600 mt-1">4 preguntas evaluadas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-600">Promedio del Área</p>
                    <p className="text-3xl font-bold text-blue-600">{area.average}</p>
                  </div>
                </div>
              </div>

              {/* Preguntas del área */}
              <div className="divide-y divide-gray-200">
                {area.questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">
                            {qIndex + 1}
                          </span>
                          <p className="text-sm text-gray-700 font-medium">
                            {question.label}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 md:ml-4">
                        {getBadge(question.value)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Leyenda de Niveles:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { value: 4, label: "Excelente", color: "green" },
              { value: 3, label: "Bueno", color: "yellow" },
              { value: 2, label: "Regular", color: "orange" },
              { value: 1, label: "Bajo", color: "red" },
            ] as const).map((item) => (
              <div
                key={item.value}
                className={`flex items-center gap-2 p-2 rounded-lg bg-${item.color}-50 border border-${item.color}-200`}
              >
                {getIcon(item.value as AnswerValue)}
                <div>
                  <p className={`text-xs font-bold text-${item.color}-700`}>Nivel {item.value}</p>
                  <p className={`text-xs text-${item.color}-600`}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

