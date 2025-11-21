"use client";

import { useResultsContent } from "@/lib/hooks/use-results-content";
import { getContent, getContentWithHtml } from "@/lib/hooks/use-page-content";
import { Loader2 } from "lucide-react";

interface ResultsContentLoaderProps {
  children: (data: { content: ReturnType<typeof useResultsContent>["content"] }) => React.ReactNode;
}

export function ResultsContentLoader({ children }: ResultsContentLoaderProps) {
  const { content, loading, error } = useResultsContent("es");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#2C248E] mx-auto" />
          <p className="text-lg text-gray-600 font-medium">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading results content:", error);
    // Continuar con contenido de fallback
  }

  return <>{children({ content })}</>;
}

export function RenderContent({ content, isHtml, className = "" }: { content: string; isHtml?: boolean; className?: string }) {
  if (isHtml) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <span className={className}>{content}</span>;
}

export { getContent, getContentWithHtml };

