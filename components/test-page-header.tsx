"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AutoSaveIndicator } from "@/components/auto-save-indicator";
import { VersionBadge } from "@/components/version-badge";
import { Trash2, Home } from "lucide-react";
import { ContentMap, getContentWithHtml } from "@/lib/hooks/use-page-content";

interface TestPageHeaderProps {
  groupCode: string;
  lastSaved: number | null;
  isSaving: boolean;
  onDiscardDraft: () => void;
  onGoHome: () => void;
  content: ContentMap;
}

function RenderContent({ content, isHtml }: { content: string; isHtml?: boolean }) {
  if (isHtml) {
    return <span dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <span>{content}</span>;
}

export const TestPageHeader = memo(function TestPageHeader({
  groupCode,
  lastSaved,
  isSaving,
  onDiscardDraft,
  onGoHome,
  content,
}: TestPageHeaderProps) {
  return (
    <Card
      className="sticky top-0 z-40 shadow-md border-b-2 bg-white/95 backdrop-blur-sm"
      style={{ borderBottomColor: '#2C248E' }}
    >
      <CardContent className="pt-2 pb-2 md:pt-4 md:pb-4 px-3 md:px-6">
        {/* Versión móvil compacta */}
        <div className="md:hidden space-y-2">
          {/* Fila 1: Título y guardado */}
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-base font-bold" style={{ color: '#2C248E' }}>
              <RenderContent {...getContentWithHtml(content, "01_Header.Título.principal", "Cuestionario")} />
            </h1>
            <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
          </div>

          {/* Fila 2: Código y botones */}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-600">
              <span className="font-semibold" style={{ color: '#8E235D' }}>{groupCode}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoHome}
                className="h-7 px-2 text-xs"
                style={{ color: '#2C248E' }}
              >
                Inicio
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDiscardDraft}
                className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                Descartar
              </Button>
            </div>
          </div>
        </div>

        {/* Versión desktop */}
        <div className="hidden md:block space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoHome}
                className="gap-2"
                style={{ color: '#2C248E' }}
              >
                <Home className="h-4 w-4" />
                <span>
                  <RenderContent {...getContentWithHtml(content, "01_Header.Navegación.boton_inicio", "Inicio")} />
                </span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#2C248E' }}>
                  <RenderContent {...getContentWithHtml(content, "01_Header.Título.principal", "Cuestionario de Evaluación")} />
                </h1>
                <p className="text-sm text-gray-600">
                  Grupo: <span className="font-semibold" style={{ color: '#8E235D' }}>{groupCode}</span>
                </p>
              </div>
              <VersionBadge position="navbar" size="sm" />
            </div>
            <AutoSaveIndicator lastSaved={lastSaved} isSaving={isSaving} />
          </div>
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onDiscardDraft}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="h-4 w-4" />
              <span>
                <RenderContent {...getContentWithHtml(content, "02_Acciones.Botones.descartar_borrador", "Descartar borrador")} />
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

