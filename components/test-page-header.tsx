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
      <CardContent className="pt-4 pb-4">
        <div className="space-y-3">
          {/* Fila 1: Título y código de grupo */}
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
                <span className="hidden sm:inline">
                  <RenderContent {...getContentWithHtml(content, "01_Header.Navegación.boton_inicio", "Inicio")} />
                </span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: '#2C248E' }}
                >
                  <RenderContent {...getContentWithHtml(content, "01_Header.Título.principal", "Cuestionario de Evaluación")} />
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Grupo: <span className="font-semibold" style={{ color: '#8E235D' }}>{groupCode}</span>
                </p>
              </div>
              <VersionBadge position="navbar" size="sm" />
            </div>

            {/* Indicador de guardado automático */}
            <AutoSaveIndicator
              lastSaved={lastSaved}
              isSaving={isSaving}
            />
          </div>

          {/* Fila 2: Botón descartar borrador */}
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onDiscardDraft}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                <RenderContent {...getContentWithHtml(content, "02_Acciones.Botones.descartar_borrador", "Descartar borrador")} />
              </span>
              <span className="sm:hidden">
                <RenderContent {...getContentWithHtml(content, "02_Acciones.Botones.descartar_corto", "Descartar")} />
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

