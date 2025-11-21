"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Edit2, Save, X, RefreshCw, Eye, EyeOff, FileText, Clock } from "lucide-react";
import { invalidateContentCache } from "@/lib/hooks/use-landing-content";
import { invalidatePageContentCache } from "@/lib/hooks/use-page-content";
import { RichTextEditor } from "@/components/rich-text-editor";
import { MultiPageContentHistory } from "@/components/multi-page-content-history";
import { ContentHistory } from "@/components/content-history";
import { useAuth } from "@/lib/auth-context";

interface ContentItem {
  id: string;
  category: string;
  section_name: string;
  field_name: string;
  field_label: string;
  content: string;
  language: string;
  display_order: number;
  is_active: boolean;
  is_html: boolean;
  updated_at: string;
}

interface CMSPageEditorProps {
  pageType: "landing" | "test" | "results" | "admin" | "code_entry";
  pageTitle: string;
  pageDescription: string;
}

// Mapeo de tipos de página a nombres de tabla
const PAGE_TABLE_MAP: Record<string, string> = {
  landing: "landing_content",
  test: "test_content",
  results: "results_content",
  admin: "admin_content",
  code_entry: "code_entry_content",
};

// Mapeo de tipos de página a tablas de historial
const HISTORY_TABLE_MAP: Record<string, string> = {
  landing: "content_history",
  test: "test_content_history",
  results: "results_content_history",
  admin: "admin_content_history",
  code_entry: "code_entry_content_history",
};

// Configuración de colores por categoría
const getCategoryColor = (category: string): { color: string; bgColor: string; borderColor: string } => {
  const colors: Record<string, { color: string; bgColor: string; borderColor: string }> = {
    "01_Header": { color: "#2C248E", bgColor: "rgba(44, 36, 142, 0.1)", borderColor: "#2C248E" },
    "02_Card": { color: "#412761", bgColor: "rgba(65, 39, 97, 0.1)", borderColor: "#412761" },
    "03_Visualización": { color: "#8E235D", bgColor: "rgba(142, 35, 93, 0.1)", borderColor: "#8E235D" },
    "04_Tabs": { color: "#D91D5C", bgColor: "rgba(217, 29, 92, 0.1)", borderColor: "#D91D5C" },
    "05_Acciones": { color: "#E65B3E", bgColor: "rgba(230, 91, 62, 0.1)", borderColor: "#E65B3E" },
    "06_Footer": { color: "#F08726", bgColor: "rgba(240, 135, 38, 0.1)", borderColor: "#F08726" },
  };
  return colors[category] || { color: "#2C248E", bgColor: "rgba(44, 36, 142, 0.1)", borderColor: "#2C248E" };
};

export function CMSPageEditor({ pageType, pageTitle, pageDescription }: CMSPageEditorProps) {
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editIsHtml, setEditIsHtml] = useState(false);
  const [useRawHtml, setUseRawHtml] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  const tableName = PAGE_TABLE_MAP[pageType];
  const historyTableName = HISTORY_TABLE_MAP[pageType];

  // Cargar contenido
  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("language", "es")
        .order("category", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error(`Error al cargar contenido de ${pageType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageType]);

  // Guardar cambios
  const handleSave = async (item: ContentItem) => {
    try {
      setSaving(true);

      // 1. Guardar versión anterior en historial
      const { error: historyError } = await supabase
        .from(historyTableName)
        .insert({
          content_id: item.id,
          content: item.content,
          is_html: item.is_html,
          changed_by: user?.email || 'admin@integrate.com',
          changed_at: new Date().toISOString(),
          change_description: `Actualización de ${item.field_label}`
        });

      if (historyError) {
        console.error("Error al guardar historial:", historyError);
        // Continuar aunque falle el historial
      }

      // 2. Actualizar contenido
      const { error } = await supabase
        .from(tableName)
        .update({
          content: editValue,
          is_html: editIsHtml,
          updated_at: new Date().toISOString()
        })
        .eq("id", item.id);

      if (error) throw error;

      // 3. Invalidar cache
      if (pageType === "landing") {
        invalidateContentCache();
      } else {
        invalidatePageContentCache(pageType as any);
      }

      // 4. Actualizar estado local
      setContent(prev => prev.map(c =>
        c.id === item.id ? { ...c, content: editValue, is_html: editIsHtml, updated_at: new Date().toISOString() } : c
      ));

      setEditingId(null);
      setEditValue("");
      setEditIsHtml(false);
      setUseRawHtml(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
    setEditIsHtml(false);
    setUseRawHtml(false);
  };

  // Iniciar edición
  const startEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditValue(item.content);
    setEditIsHtml(item.is_html || false);
    setUseRawHtml(false);
  };

  // Restaurar desde historial
  const handleRestore = async (itemId: string, content: string, isHtml: boolean) => {
    try {
      setSaving(true);
      const item = filteredContent.find(c => c.id === itemId);
      if (!item) return;

      // Guardar versión actual en historial antes de restaurar
      await supabase
        .from(historyTableName)
        .insert({
          content_id: item.id,
          content: item.content,
          is_html: item.is_html,
          changed_by: user?.email || 'admin@integrate.com',
          changed_at: new Date().toISOString(),
          change_description: `Antes de restaurar versión anterior`
        });

      // Actualizar con contenido restaurado
      const { error } = await supabase
        .from(tableName)
        .update({
          content: content,
          is_html: isHtml,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId);

      if (error) throw error;

      // Invalidar cache
      if (pageType === "landing") {
        invalidateContentCache();
      } else {
        invalidatePageContentCache(pageType as any);
      }

      // Actualizar estado local
      setContent(prev => prev.map(c =>
        c.id === itemId ? { ...c, content, is_html: isHtml, updated_at: new Date().toISOString() } : c
      ));

      alert("✅ Versión restaurada exitosamente");
    } catch (error) {
      console.error("Error al restaurar:", error);
      alert("Error al restaurar la versión");
    } finally {
      setSaving(false);
    }
  };

  // Filtrar contenido
  const filteredContent = content.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.field_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive = filterActive === null || item.is_active === filterActive;

    return matchesSearch && matchesActive;
  });

  // Agrupar por categoría
  const groupedContent = filteredContent.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-lg">Cargando contenido...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 shadow-md" style={{ borderColor: '#8E235D' }}>
        <CardHeader className="bg-gradient-to-r from-[#8E235D] to-[#E65B3E] text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <FileText className="h-6 w-6" />
            {pageTitle}
          </CardTitle>
          <CardDescription className="text-white/90">
            {pageDescription}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Buscar por categoría, sección, campo o contenido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterActive === null ? "default" : "outline"}
                onClick={() => setFilterActive(null)}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={filterActive === true ? "default" : "outline"}
                onClick={() => setFilterActive(true)}
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Activos
              </Button>
              <Button
                variant={filterActive === false ? "default" : "outline"}
                onClick={() => setFilterActive(false)}
                size="sm"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Inactivos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contenido agrupado por categoría con diseño profesional */}
      {Object.entries(groupedContent).map(([category, items]) => {
        const config = getCategoryColor(category);

        return (
          <div key={category}
               className="relative overflow-hidden rounded-2xl border-2 shadow-xl transition-all hover:shadow-2xl"
               style={{ borderColor: config.borderColor }}>
            {/* Backdrop blur effect */}
            <div className="absolute inset-0 backdrop-blur-sm"
                 style={{ background: `linear-gradient(135deg, ${config.bgColor} 0%, rgba(255,255,255,0.8) 100%)` }}></div>

            {/* Header de la categoría */}
            <div className="relative z-10 p-6 border-b-2"
                 style={{ borderColor: config.borderColor + '30' }}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl shadow-lg"
                     style={{ background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)` }}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold"
                      style={{ color: config.color }}>
                    {category}
                  </h2>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    {items.length} {items.length === 1 ? "campo" : "campos"}
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido de los campos */}
            <div className="relative z-10 p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 border-2 rounded-xl transition-all hover:shadow-lg"
                    style={{
                      borderColor: config.borderColor + '40',
                      background: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Label className="text-base font-bold"
                                   style={{ color: config.color }}>
                              {item.field_label}
                            </Label>
                            {item.is_html && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                                    style={{ background: config.color }}>
                                HTML
                              </span>
                            )}
                            {!item.is_active && (
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-400 text-white">
                                Inactivo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Campo técnico: <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-xs">{item.field_name}</code>
                          </p>
                        </div>
                        {editingId === item.id ? (
                          <div className="space-y-3">
                            {/* Checkbox para activar/desactivar HTML */}
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                              <input
                                type="checkbox"
                                id={`html-${item.id}`}
                                checked={editIsHtml}
                                onChange={(e) => {
                                  setEditIsHtml(e.target.checked);
                                  if (!e.target.checked) {
                                    setUseRawHtml(false);
                                  }
                                }}
                                className="w-4 h-4 rounded"
                                style={{ accentColor: config.color }}
                              />
                              <label
                                htmlFor={`html-${item.id}`}
                                className="text-sm font-semibold cursor-pointer"
                                style={{ color: config.color }}
                              >
                                📝 Usar Editor Rich Text (HTML)
                              </label>
                            </div>

                            {/* Toggle entre editor visual y código HTML */}
                            {editIsHtml && (
                              <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                <input
                                  type="checkbox"
                                  id={`raw-${item.id}`}
                                  checked={useRawHtml}
                                  onChange={(e) => setUseRawHtml(e.target.checked)}
                                  className="w-4 h-4 rounded"
                                  style={{ accentColor: '#F08726' }}
                                />
                                <label
                                  htmlFor={`raw-${item.id}`}
                                  className="text-sm font-semibold cursor-pointer text-orange-700"
                                >
                                  💻 Editar código HTML directamente
                                </label>
                              </div>
                            )}

                            {/* Editor según el modo seleccionado */}
                            {editIsHtml ? (
                              useRawHtml ? (
                                <div className="space-y-3">
                                  <Textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    rows={8}
                                    className="font-mono text-sm border-2"
                                    style={{ borderColor: config.borderColor }}
                                    placeholder="<h1>Tu HTML aquí</h1>"
                                  />
                                  {/* Vista previa del HTML */}
                                  <div className="border-2 rounded-lg p-4 bg-white"
                                       style={{ borderColor: config.borderColor + '40' }}>
                                    <p className="text-xs font-semibold mb-2"
                                       style={{ color: config.color }}>
                                      👁️ Vista previa:
                                    </p>
                                    <div
                                      className="prose prose-sm max-w-none"
                                      dangerouslySetInnerHTML={{ __html: editValue }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <RichTextEditor
                                  content={editValue}
                                  onChange={setEditValue}
                                  color={config.color}
                                  borderColor={config.borderColor}
                                />
                              )
                            ) : (
                              <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full font-medium text-base border-2 rounded-lg p-3 min-h-[150px]"
                                style={{ borderColor: config.borderColor }}
                                placeholder="Escribe el contenido aquí..."
                              />
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {item.is_html ? (
                              <div className="text-gray-900 font-medium text-base leading-relaxed bg-white/50 p-3 rounded-lg border"
                                   style={{ borderColor: config.borderColor + '20' }}
                                   dangerouslySetInnerHTML={{ __html: item.content }}
                              />
                            ) : (
                              <p className="text-gray-900 font-medium text-base leading-relaxed bg-white/50 p-3 rounded-lg border"
                                 style={{ borderColor: config.borderColor + '20' }}>
                                {item.content}
                              </p>
                            )}
                            {item.is_html && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="px-2 py-1 rounded-full font-semibold text-white"
                                      style={{ background: config.color }}>
                                  HTML
                                </span>
                                <span className="text-gray-500">Este campo contiene código HTML</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Última actualización - Mejorada */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border"
                             style={{ borderColor: config.borderColor + '20' }}>
                          <Clock className="h-3.5 w-3.5" style={{ color: config.color }} />
                          <span className="font-medium">
                            Última actualización: {new Date(item.updated_at).toLocaleString("es-ES", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {editingId === item.id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSave(item)}
                              disabled={saving}
                              className="gap-2 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                            >
                              <Save className="h-4 w-4" />
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancel}
                              disabled={saving}
                              className="border-2 hover:bg-red-50 font-semibold"
                              style={{ borderColor: '#ef4444', color: '#ef4444' }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(item)}
                              className="gap-2 border-2 font-semibold hover:shadow-lg transition-all"
                              style={{ borderColor: config.borderColor, color: config.color }}
                            >
                              <Edit2 className="h-4 w-4" />
                              Editar
                            </Button>
                            {/* Botón de historial */}
                            {pageType === "landing" ? (
                              <ContentHistory
                                contentId={item.id}
                                fieldLabel={item.field_label}
                                color={config.color}
                                onRestore={(content, isHtml) => handleRestore(item.id, content, isHtml)}
                              />
                            ) : (
                              <MultiPageContentHistory
                                contentId={item.id}
                                fieldLabel={item.field_label}
                                pageType={pageType}
                                color={config.color}
                                onRestore={(content, isHtml) => handleRestore(item.id, content, isHtml)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {filteredContent.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl border-2 shadow-lg"
             style={{ borderColor: '#2C248E' }}>
          <div className="absolute inset-0 backdrop-blur-sm bg-white/70"></div>
          <div className="relative z-10 p-12 text-center">
            <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 font-semibold text-lg">
              No se encontraron campos que coincidan con los filtros
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
