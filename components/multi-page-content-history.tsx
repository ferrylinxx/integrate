"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Button } from './ui/button';
import { Clock, RotateCcw, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface HistoryEntry {
  id: string;
  content: string;
  is_html: boolean;
  changed_by: string | null;
  change_description: string | null;
  created_at: string;
}

interface MultiPageContentHistoryProps {
  contentId: string;
  fieldLabel: string;
  pageType: 'landing' | 'test' | 'results' | 'admin' | 'code_entry';
  color?: string;
  onRestore?: (content: string, isHtml: boolean) => void;
}

// Mapeo de pageType a tabla de historial
const HISTORY_TABLE_MAP = {
  landing: 'content_history',
  test: 'test_content_history',
  results: 'results_content_history',
  admin: 'admin_content_history',
  code_entry: 'code_entry_content_history'
};

export function MultiPageContentHistory({ 
  contentId, 
  fieldLabel, 
  pageType, 
  color = '#2C248E', 
  onRestore 
}: MultiPageContentHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState<{ content: string; isHtml: boolean } | null>(null);

  const historyTable = HISTORY_TABLE_MAP[pageType];

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(historyTable)
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, contentId]);

  const handleRestore = async (entry: HistoryEntry) => {
    if (confirm('¿Estás seguro de que quieres restaurar esta versión?')) {
      if (onRestore) {
        onRestore(entry.content, entry.is_html);
        setIsOpen(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return formatDate(dateString);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 border-2 hover:scale-105 transition-transform"
        style={{ borderColor: color, color: color }}
      >
        <Clock className="h-4 w-4" />
        Historial
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color }}>
              <Clock className="h-6 w-6" />
              Historial de Versiones: {fieldLabel}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: color }}></div>
              <p className="mt-4 text-gray-600 font-medium">Cargando historial...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-20 w-20 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-600 font-semibold text-lg">No hay versiones anteriores</p>
              <p className="text-sm text-gray-500 mt-2">Los cambios se guardarán automáticamente en el historial</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="border-2 rounded-xl p-5 hover:shadow-lg transition-all"
                  style={{ 
                    borderColor: index === 0 ? color : '#e5e7eb',
                    background: index === 0 ? `${color}08` : 'white'
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg" style={{ color: index === 0 ? color : '#1f2937' }}>
                          {index === 0 ? '📌 Versión Actual' : `📄 Versión ${history.length - index}`}
                        </span>
                        {entry.is_html && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                                style={{ backgroundColor: color }}>
                            HTML
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-700">
                        ⏰ {getRelativeTime(entry.created_at)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {formatDate(entry.created_at)}
                      </p>
                      {entry.changed_by && (
                        <p className="text-xs text-gray-600 mt-1 font-medium">
                          👤 Por: {entry.changed_by}
                        </p>
                      )}
                      {entry.change_description && (
                        <p className="text-sm text-gray-700 mt-2 italic bg-gray-50 p-2 rounded border-l-4"
                           style={{ borderColor: color }}>
                          💬 "{entry.change_description}"
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewContent({ content: entry.content, isHtml: entry.is_html })}
                        className="gap-2 hover:scale-105 transition-transform"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      {index !== 0 && (
                        <Button
                          size="sm"
                          onClick={() => handleRestore(entry)}
                          className="gap-2 text-white hover:scale-105 transition-transform shadow-md"
                          style={{ backgroundColor: color }}
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restaurar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono text-gray-700 max-h-40 overflow-y-auto border-2 border-gray-200">
                    {entry.is_html ? (
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: entry.content }} />
                    ) : (
                      <p className="whitespace-pre-wrap">{entry.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      {previewContent && (
        <Dialog open={!!previewContent} onOpenChange={() => setPreviewContent(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl" style={{ color }}>
                <Eye className="h-6 w-6" />
                Vista Previa del Contenido
              </DialogTitle>
            </DialogHeader>
            <div className="bg-white rounded-xl p-6 border-2 shadow-inner" style={{ borderColor: color }}>
              {previewContent.isHtml ? (
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewContent.content }} />
              ) : (
                <p className="whitespace-pre-wrap text-gray-900">{previewContent.content}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                onClick={() => setPreviewContent(null)} 
                variant="outline"
                className="hover:scale-105 transition-transform"
              >
                Cerrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

