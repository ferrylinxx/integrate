"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, RefreshCw, Search, Edit2, Check, X, FileText, Award, BarChart3, Star, Target, Eye, Megaphone, Link as LinkIcon, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { IntegrateLogo } from "@/components/integrate-logo";
import { invalidateContentCache } from "@/lib/hooks/use-landing-content";
import { RichTextEditor } from "@/components/rich-text-editor";
import { ContentHistory } from "@/components/content-history";

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

// Helper para obtener ícono y color por categoría
const getCategoryConfig = (category: string) => {
  const configs: Record<string, { icon: any; color: string; bgColor: string; borderColor: string; label: string }> = {
    "00_Navegación": {
      icon: Menu,
      color: "#2C248E",
      bgColor: "rgba(44, 36, 142, 0.1)",
      borderColor: "#2C248E",
      label: "Menú de Navegación"
    },
    "01_Portada": {
      icon: FileText,
      color: "#412761",
      bgColor: "rgba(65, 39, 97, 0.1)",
      borderColor: "#412761",
      label: "Portada / Hero"
    },
    "02_Estadísticas": {
      icon: BarChart3,
      color: "#8E235D",
      bgColor: "rgba(142, 35, 93, 0.1)",
      borderColor: "#8E235D",
      label: "Estadísticas"
    },
    "03_Características": {
      icon: Star,
      color: "#D91D5C",
      bgColor: "rgba(217, 29, 92, 0.1)",
      borderColor: "#D91D5C",
      label: "Características"
    },
    "04_Áreas_INTEGRATE": {
      icon: Target,
      color: "#E65B3E",
      bgColor: "rgba(230, 91, 62, 0.1)",
      borderColor: "#E65B3E",
      label: "Áreas INTEGRATE"
    },
    "05_Perspectivas": {
      icon: Eye,
      color: "#F08726",
      bgColor: "rgba(240, 135, 38, 0.1)",
      borderColor: "#F08726",
      label: "Perspectivas"
    },
    "06_Llamada_a_Acción": {
      icon: Megaphone,
      color: "#2C248E",
      bgColor: "rgba(44, 36, 142, 0.1)",
      borderColor: "#2C248E",
      label: "Llamada a Acción"
    },
    "07_Footer": {
      icon: LinkIcon,
      color: "#8E235D",
      bgColor: "rgba(142, 35, 93, 0.1)",
      borderColor: "#8E235D",
      label: "Footer / Pie de Página"
    }
  };

  return configs[category] || {
    icon: FileText,
    color: "#2C248E",
    bgColor: "rgba(44, 36, 142, 0.1)",
    borderColor: "#2C248E",
    label: category
  };
};

export default function CMSPage() {
  const router = useRouter();
  const { admin, isAuthenticated, isLoading: authLoading } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editIsHtml, setEditIsHtml] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Proteger la ruta
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar contenido
  const fetchContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("landing_content")
        .select("*")
        .eq("language", "es")
        .order("category", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error("Error al cargar contenido:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchContent();
    }
  }, [isAuthenticated]);

  // Restaurar desde historial
  const handleRestore = async (itemId: string, restoredContent: string, isHtml: boolean) => {
    try {
      setSaving(true);

      // Actualizar contenido
      // @ts-ignore - Supabase type inference issue
      const { error } = await supabase
        .from("landing_content")
        .update({
          content: restoredContent,
          is_html: isHtml,
          updated_at: new Date().toISOString()
        })
        .eq("id", itemId)
        .select();

      if (error) throw error;

      // Actualizar estado local
      setContent(content.map(c =>
        c.id === itemId ? {
          ...c,
          content: restoredContent,
          is_html: isHtml,
          updated_at: new Date().toISOString()
        } : c
      ));

      // Invalidar caché
      invalidateContentCache();

      // Recargar contenido
      await loadContent();

      setSuccessMessage("✅ Versión restaurada exitosamente.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error al restaurar:", error);
      alert("Error al restaurar la versión");
    } finally {
      setSaving(false);
    }
  };

  // Guardar cambio
  const handleSave = async (item: ContentItem) => {
    try {
      setSaving(true);
      console.log("💾 Guardando cambio...", {
        id: item.id,
        field: item.field_label,
        oldContent: item.content,
        newContent: editValue,
        isHtml: editIsHtml
      });

      // 1. Guardar en historial ANTES de actualizar
      const { error: historyError } = await supabase
        .from("content_history")
        .insert({
          content_id: item.id,
          content: item.content, // Contenido ANTERIOR
          is_html: item.is_html,
          changed_by: admin?.email || 'Desconocido',
          change_description: `Cambio desde CMS`
        });

      if (historyError) {
        console.warn("⚠️ Error al guardar historial:", historyError);
        // No bloqueamos el guardado si falla el historial
      } else {
        console.log("✅ Historial guardado");
      }

      // 2. Actualizar contenido
      console.log("📝 Actualizando contenido en Supabase...");
      const { error, data: updateData } = await supabase
        .from("landing_content")
        .update({
          content: editValue,
          is_html: editIsHtml,
          updated_at: new Date().toISOString()
        })
        .eq("id", item.id)
        .select();

      if (error) {
        console.error("❌ Error al actualizar:", error);
        throw error;
      }

      console.log("✅ Contenido actualizado en Supabase:", updateData);

      // 3. Actualizar estado local
      setContent(content.map(c =>
        c.id === item.id ? {
          ...c,
          content: editValue,
          is_html: editIsHtml,
          updated_at: new Date().toISOString()
        } : c
      ));
      console.log("✅ Estado local actualizado");

      // 4. ⚡ INVALIDAR CACHÉ para que la landing page se actualice
      console.log("🔄 Invalidando caché...");
      invalidateContentCache();

      setEditingId(null);
      setSuccessMessage("✅ Cambio guardado exitosamente. La landing page se actualizará en unos segundos.");
      setTimeout(() => setSuccessMessage(""), 5000);

      console.log("✅ Guardado completado exitosamente");
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("Error al guardar el cambio: " + (error as any).message);
    } finally {
      setSaving(false);
    }
  };

  // Filtrar contenido
  const filteredContent = content.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.section_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.field_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar por categoría
  const groupedContent = filteredContent.reduce((acc, item) => {
    const groupKey = `${item.category} - ${item.section_name}`;
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8"
          style={{ background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.03) 0%, rgba(255,255,255,1) 30%, rgba(142, 35, 93, 0.02) 60%, rgba(255,255,255,1) 100%)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Mejorado con Logo INTEGRATE */}
        <div className="relative overflow-hidden rounded-3xl border-2 shadow-2xl"
             style={{
               borderColor: '#2C248E',
               background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.1) 0%, rgba(142, 35, 93, 0.06) 100%)'
             }}>
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 backdrop-blur-xl bg-white/60"></div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <IntegrateLogo size="lg" priority />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#2C248E] via-[#8E235D] to-[#D91D5C] bg-clip-text text-transparent">
                    CMS - Gestión de Contenido
                  </h1>
                  <p className="text-gray-700 mt-2 font-medium">
                    Edita todos los textos de la landing page sin modificar código
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push("/admin")}
                className="gap-2 border-2 hover:scale-105 transition-transform"
                style={{ borderColor: '#2C248E', color: '#2C248E' }}
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Panel
              </Button>
            </div>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="relative overflow-hidden rounded-2xl border-2 shadow-lg"
               style={{
                 borderColor: '#10b981',
                 background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)'
               }}>
            <div className="absolute inset-0 backdrop-blur-sm bg-white/60"></div>
            <div className="relative z-10 p-4 flex items-center gap-3">
              <Check className="h-6 w-6 text-green-600" />
              <span className="text-green-800 font-semibold">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Barra de búsqueda y acciones mejorada */}
        <div className="relative overflow-hidden rounded-2xl border-2 shadow-xl"
             style={{
               borderColor: '#2C248E',
               background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.08) 0%, rgba(142, 35, 93, 0.04) 100%)'
             }}>
          <div className="absolute inset-0 backdrop-blur-sm bg-white/70"></div>
          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: '#2C248E' }} />
                <Input
                  placeholder="🔍 Buscar por categoría, sección, etiqueta o contenido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-2 focus:ring-2"
                  style={{ borderColor: '#2C248E20' }}
                />
              </div>
              <Button
                onClick={fetchContent}
                className="gap-2 h-12 px-6 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}
              >
                <RefreshCw className="h-5 w-5" />
                Recargar Contenido
              </Button>
            </div>

            {/* Estadísticas */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: '#2C248E' }} />
                <span>Total: <strong>{content.length}</strong> campos</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" style={{ color: '#8E235D' }} />
                <span>Mostrando: <strong>{filteredContent.length}</strong> resultados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido agrupado por sección */}
        {loading ? (
          <div className="relative overflow-hidden rounded-2xl border-2 shadow-xl"
               style={{
                 borderColor: '#2C248E',
                 background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.05) 0%, rgba(142, 35, 93, 0.03) 100%)'
               }}>
            <div className="absolute inset-0 backdrop-blur-sm bg-white/70"></div>
            <div className="relative z-10 py-12 text-center">
              <div className="h-12 w-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                   style={{ borderColor: '#2C248E' }} />
              <p className="text-gray-700 font-semibold">Cargando contenido...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedContent).map(([groupKey, items]) => {
              // Extraer categoría del groupKey (formato: "01_Portada - Hero Principal")
              const category = groupKey.split(" - ")[0];
              const sectionName = groupKey.split(" - ")[1] || "";
              const config = getCategoryConfig(category);
              const Icon = config.icon;

              return (
                <div key={groupKey}
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
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold"
                            style={{ color: config.color }}>
                          {config.label}
                        </h2>
                        <p className="text-sm font-medium text-gray-600 mt-1">
                          {sectionName} • {items.length} {items.length === 1 ? "campo" : "campos"}
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
                                <Label className="text-base font-bold"
                                       style={{ color: config.color }}>
                                  {item.field_label}
                                </Label>
                                <p className="text-xs text-gray-500 mt-1">
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
                                      onChange={(e) => setEditIsHtml(e.target.checked)}
                                      className="w-4 h-4 rounded"
                                      style={{ accentColor: config.color }}
                                    />
                                    <label htmlFor={`html-${item.id}`} className="text-sm font-semibold cursor-pointer"
                                           style={{ color: config.color }}>
                                      📝 Usar Editor Rich Text (HTML)
                                    </label>
                                  </div>

                                  {/* Editor Rich Text o Textarea simple */}
                                  {editIsHtml ? (
                                    <RichTextEditor
                                      content={editValue}
                                      onChange={setEditValue}
                                      color={config.color}
                                      borderColor={config.borderColor}
                                    />
                                  ) : (
                                    <textarea
                                      value={editValue}
                                      onChange={(e) => setEditValue(e.target.value)}
                                      className="w-full font-medium text-base border-2 rounded-lg p-3 min-h-[150px]"
                                      style={{ borderColor: config.borderColor }}
                                      placeholder="Escribe el contenido aquí..."
                                      autoFocus
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

                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Última actualización: {new Date(item.updated_at).toLocaleString("es-ES")}
                              </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              {editingId === item.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSave(item)}
                                    disabled={saving}
                                    className="gap-2 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                  >
                                    <Check className="h-4 w-4" />
                                    Guardar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingId(null)}
                                    disabled={saving}
                                    className="border-2 hover:bg-red-50"
                                    style={{ borderColor: '#ef4444', color: '#ef4444' }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingId(item.id);
                                      setEditValue(item.content);
                                      setEditIsHtml(item.is_html || false);
                                    }}
                                    className="gap-2 border-2 font-semibold hover:shadow-lg transition-all"
                                    style={{ borderColor: config.borderColor, color: config.color }}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    Editar
                                  </Button>
                                  <ContentHistory
                                    contentId={item.id}
                                    fieldLabel={item.field_label}
                                    color={config.color}
                                    onRestore={(content, isHtml) => handleRestore(item.id, content, isHtml)}
                                  />
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
          </div>
        )}
      </div>
    </main>
  );
}

