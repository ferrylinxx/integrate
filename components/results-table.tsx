"use client";

import { AnswerValue } from "@/lib/types";
import { VALUE_COLORS, AREA_NAMES, QUESTION_LABELS } from "@/lib/constants";

interface ResultsTableProps {
  data: AnswerValue[];
}

export function ResultsTable({ data }: ResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Área</th>
            {QUESTION_LABELS.map((label, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2 text-center">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AREA_NAMES.map((areaName, areaIndex) => {
            const startIndex = areaIndex * 4;
            const areaValues = data.slice(startIndex, startIndex + 4);

            return (
              <tr key={areaIndex}>
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  {areaName}
                </td>
                {areaValues.map((value, qIndex) => (
                  <td
                    key={qIndex}
                    className="border border-gray-300 px-4 py-2 text-center font-bold text-white"
                    style={{ backgroundColor: VALUE_COLORS[value] }}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

