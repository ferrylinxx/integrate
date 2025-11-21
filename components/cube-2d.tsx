"use client";

import { AnswerValue } from "@/lib/types";
import { VALUE_COLORS, AREA_NAMES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Cube2DProps {
  data: AnswerValue[];
}

export function Cube2D({ data }: Cube2DProps) {
  // Dividir los 24 valores en 6 áreas de 4 valores cada una
  const areas = Array.from({ length: 6 }, (_, i) => ({
    areaNumber: i + 1,
    areaName: AREA_NAMES[i],
    values: data.slice(i * 4, (i + 1) * 4),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {areas.map((area) => (
        <Card key={area.areaNumber}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{area.areaName}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Grid 2x2 para las 4 capas */}
            <div className="grid grid-cols-2 gap-2">
              {area.values.map((value, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-md flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: VALUE_COLORS[value] }}
                >
                  {value}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

