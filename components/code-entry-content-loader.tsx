"use client";

import { useCodeEntryContent } from "@/lib/hooks/use-code-entry-content";
import { getContent, getContentWithHtml } from "@/lib/hooks/use-page-content";
import { Loader2 } from "lucide-react";

interface CodeEntryContentLoaderProps {
  children: (data: { content: ReturnType<typeof useCodeEntryContent>["content"] }) => React.ReactNode;
}

export function CodeEntryContentLoader({ children }: CodeEntryContentLoaderProps) {
  const { content, loading, error } = useCodeEntryContent("es");

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
    console.error("Error loading code entry content:", error);
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

