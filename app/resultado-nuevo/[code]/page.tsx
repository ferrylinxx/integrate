"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Submission } from "@/lib/types";
import { getSubmission, getMockSubmission } from "@/lib/storage";
import { getSubmissionByCode, getGroupById, getSubmissionsByGroup } from "@/lib/supabase";
import { MapaDeSituacion } from "@/components/resultado-nuevo/mapa-de-situacion";
import { Cubo3D } from "@/components/resultado-nuevo/cubo-3d"; // ➕ NUEVO: Cubo 3D independiente
import { VistaGeneral } from "@/components/resultado-nuevo/vista-general";
import { VistaArea } from "@/components/resultado-nuevo/vista-area";
import { PanelRecursos } from "@/components/resultado-nuevo/panel-recursos";
import { PanelInferior } from "@/components/resultado-nuevo/panel-inferior";
import { AREA_NAMES } from "@/lib/constants";
import { EditorProvider } from "@/components/editor/EditorProvider";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { EditorWrapper, CustomElementRenderer } from "@/components/editor"; // ➕ CustomElementRenderer
import { useEditorStore } from "@/lib/editor/store";
import "@/components/editor/editor.css";

type FilterLevel = 'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null;

/**
 * Componente interno que renderiza el contenido con layout dual:
 * - Modo NORMAL: Grid de 2 columnas (layout original)
 * - Modo EDITOR: Posicionamiento absoluto con drag & drop
 */
function DashboardContent({
  submission,
  selectedArea,
  selectedSubArea,
  setSelectedArea,
  setSelectedSubArea,
  filterLevel,
  setFilterLevel,
  groupMembers,
  selectedMember,
  setSelectedMember
}: any) {
  const { isEditorActive, config } = useEditorStore(); // ➕ NUEVO: Obtener config
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  // Obtener dimensiones de la ventana de forma segura (solo en cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateSize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Props comunes para MapaDeSituacion
  const mapaDeSituacionProps = {
    answers: submission.answers,
    selectedArea,
    selectedSubArea,
    onAreaClick: setSelectedArea,
    onSubAreaClick: setSelectedSubArea,
    groupMembers,
    selectedMember,
    onMemberChange: setSelectedMember,
  };

  // Props comunes para VistaArea
  const vistaAreaProps = {
    answers: submission.answers,
    selectedArea,
    selectedSubArea,
    onClose: () => setSelectedArea(null),
    onSubAreaClick: setSelectedSubArea,
  };

  // Props comunes para VistaGeneral
  const vistaGeneralProps = {
    answers: submission.answers,
    filterLevel,
    onFilterChange: setFilterLevel,
    onSubAreaClick: setSelectedSubArea,
  };

  // Props comunes para PanelInferior
  const panelInferiorProps = {
    subAreaIndex: selectedSubArea,
    areaIndex: selectedArea,
    value: submission.answers[selectedSubArea],
    answers: submission.answers,
    onClose: () => setSelectedSubArea(null),
  };

  // ========================================
  // MODO NORMAL: Layout Grid Original o Posiciones Personalizadas
  // ========================================
  if (!isEditorActive) {
    // ➕ NUEVO: Detectar si hay posiciones personalizadas
    const mapaPos = config.components?.mapaDeSituacion?.layout?.position || { x: 0, y: 0 };
    const mapaSize = config.components?.mapaDeSituacion?.layout?.size || { width: windowSize.width / 2, height: windowSize.height - 64 };
    const vistaGeneralPos = config.components?.vistaGeneral?.layout?.position || { x: windowSize.width / 2, y: 0 };
    const vistaGeneralSize = config.components?.vistaGeneral?.layout?.size || { width: windowSize.width / 2, height: windowSize.height - 64 };
    const vistaAreaPos = config.components?.vistaArea?.layout?.position || { x: 0, y: 0 };
    const vistaAreaSize = config.components?.vistaArea?.layout?.size || { width: windowSize.width / 2, height: windowSize.height - 64 };
    const panelInferiorPos = config.components?.panelInferior?.layout?.position || { x: 0, y: windowSize.height - 200 };
    const panelInferiorSize = config.components?.panelInferior?.layout?.size || { width: windowSize.width, height: 200 };

    // Verificar si hay posiciones personalizadas (diferentes a las del grid original)
    const hasCustomPositions =
      mapaPos.x !== 0 ||
      mapaPos.y !== 0 ||
      vistaGeneralPos.x !== windowSize.width / 2 ||
      vistaGeneralPos.y !== 0;

    // ➕ NUEVO: Si hay posiciones personalizadas, usar posicionamiento absoluto
    if (hasCustomPositions) {
      return (
        <div className="h-screen flex flex-col pt-16 relative">
          <div className="flex-1 relative bg-[#0a0a1a] overflow-hidden">
            {/* Columna izquierda: Mapa de Situación o Vista Área */}
            {selectedArea !== null ? (
              <div
                style={{
                  position: 'absolute',
                  left: `${vistaAreaPos.x}px`,
                  top: `${vistaAreaPos.y}px`,
                  width: `${vistaAreaSize.width}px`,
                  height: `${vistaAreaSize.height}px`,
                }}
              >
                <VistaArea {...vistaAreaProps} />
              </div>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  left: `${mapaPos.x}px`,
                  top: `${mapaPos.y}px`,
                  width: `${mapaSize.width}px`,
                  height: `${mapaSize.height}px`,
                }}
              >
                <MapaDeSituacion {...mapaDeSituacionProps} />
              </div>
            )}

            {/* Columna derecha: Vista General */}
            <div
              style={{
                position: 'absolute',
                left: `${vistaGeneralPos.x}px`,
                top: `${vistaGeneralPos.y}px`,
                width: `${vistaGeneralSize.width}px`,
                height: `${vistaGeneralSize.height}px`,
              }}
            >
              <VistaGeneral {...vistaGeneralProps} />
            </div>

            {/* Panel Inferior */}
            {selectedSubArea !== null && (
              <div
                style={{
                  position: 'absolute',
                  left: `${panelInferiorPos.x}px`,
                  top: `${panelInferiorPos.y}px`,
                  width: `${panelInferiorSize.width}px`,
                  height: `${panelInferiorSize.height}px`,
                }}
              >
                <PanelInferior {...panelInferiorProps} />
              </div>
            )}

            {/* ➕ NUEVO: Cubo 3D independiente */}
            <Cubo3D
              answers={submission.answers}
              selectedMember={selectedMember}
            />
          </div>
        </div>
      );
    }

    // Si NO hay posiciones personalizadas, usar grid original
    return (
      <div className="h-screen flex flex-col pt-16">
        {/* Contenido principal de 2 columnas */}
        <div className="flex-1 grid grid-cols-2 gap-0">
          {/* Columna izquierda: Mapa de Situación (Cubo 3D) o Vista Área (Cuadrado 2D) */}
          <div className="bg-[#0a0a1a] border-r border-white/10">
            {selectedArea !== null ? (
              <VistaArea {...vistaAreaProps} />
            ) : (
              <MapaDeSituacion {...mapaDeSituacionProps} />
            )}
          </div>

          {/* Columna derecha: Vista General (siempre visible) */}
          <div className="bg-[#0a0a1a]">
            <VistaGeneral {...vistaGeneralProps} />
          </div>
        </div>

        {/* Panel Inferior (se despliega cuando se selecciona una sub-área) */}
        {selectedSubArea !== null && (
          <PanelInferior {...panelInferiorProps} />
        )}
      </div>
    );
  }

  // ========================================
  // MODO EDITOR: Posicionamiento Absoluto con Drag & Drop
  // ========================================
  return (
    <div className="h-screen flex flex-col pt-16 relative">
      <div className="flex-1 relative bg-[#0a0a1a] overflow-hidden">
        {/* Columna izquierda: Mapa de Situación o Vista Área */}
        {selectedArea !== null ? (
          <EditorWrapper
            componentId="vistaArea"
            path="components.vistaArea.layout"
            enableDrag={true}
            enableResize={true}
            initialPosition={{ x: 0, y: 0 }}
            initialSize={{ width: windowSize.width / 2, height: windowSize.height - 64 }}
            minWidth={400}
            minHeight={300}
          >
            <VistaArea {...vistaAreaProps} />
          </EditorWrapper>
        ) : (
          <EditorWrapper
            componentId="mapaDeSituacion"
            path="components.mapaDeSituacion.layout"
            enableDrag={true}
            enableResize={true}
            initialPosition={{ x: 0, y: 0 }}
            initialSize={{ width: windowSize.width / 2, height: windowSize.height - 64 }}
            minWidth={400}
            minHeight={300}
          >
            <MapaDeSituacion {...mapaDeSituacionProps} />
          </EditorWrapper>
        )}

        {/* Columna derecha: Vista General */}
        <EditorWrapper
          componentId="vistaGeneral"
          path="components.vistaGeneral.layout"
          enableDrag={true}
          enableResize={true}
          initialPosition={{ x: windowSize.width / 2, y: 0 }}
          initialSize={{ width: windowSize.width / 2, height: windowSize.height - 64 }}
          minWidth={600}
          minHeight={400}
        >
          <VistaGeneral {...vistaGeneralProps} />
        </EditorWrapper>

        {/* Panel Inferior */}
        {selectedSubArea !== null && (
          <EditorWrapper
            componentId="panelInferior"
            path="components.panelInferior.layout"
            enableDrag={true}
            enableResize={true}
            initialPosition={{ x: 0, y: windowSize.height - 264 }}
            initialSize={{ width: windowSize.width, height: 200 }}
            minWidth={800}
            minHeight={150}
          >
            <PanelInferior {...panelInferiorProps} />
          </EditorWrapper>
        )}

        {/* ➕ NUEVO: Cubo 3D independiente */}
        <Cubo3D
          answers={submission.answers}
          selectedMember={selectedMember}
        />

        {/* ➕ NUEVO: Renderizar elementos personalizados */}
        {(() => {
          console.log('🎨 Renderizando elementos personalizados:', {
            total: config.customElements?.length || 0,
            elementos: config.customElements,
          });
          return config.customElements?.map((element) => (
            <CustomElementRenderer key={element.id} element={element} />
          ));
        })()}
      </div>
    </div>
  );
}

export default function ResultadoNuevoPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [selectedSubArea, setSelectedSubArea] = useState<number | null>(null);
  const [filterLevel, setFilterLevel] = useState<FilterLevel>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [allGroupSubmissions, setAllGroupSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        // Primero intentar obtener de Supabase
        const { data: supabaseData, error } = await getSubmissionByCode(code);

        if (supabaseData && !error) {
          // Convertir formato de Supabase a formato de la app
          const submission: Submission = {
            groupCode: "",
            participantCode: supabaseData.participant_code,
            answers: supabaseData.answers as any,
            timestamp: new Date(supabaseData.timestamp).getTime(),
          };
          setSubmission(submission);
          setUserName(supabaseData.user_name || "");

          // Si tiene group_id, obtener información del grupo
          if (supabaseData.group_id) {
            setGroupId(supabaseData.group_id);
            const { data: groupData } = await getGroupById(supabaseData.group_id);
            if (groupData) {
              setGroupName(groupData.name || "");
            }

            // Obtener todos los miembros del grupo
            const { data: groupSubmissions } = await getSubmissionsByGroup(supabaseData.group_id);
            if (groupSubmissions && groupSubmissions.length > 0) {
              setAllGroupSubmissions(groupSubmissions);
              const members = groupSubmissions
                .map(sub => sub.user_name)
                .filter((name): name is string => !!name && name.trim() !== "");
              setGroupMembers(members);
            }
          }

          setLoading(false);
          return;
        }

        // Si no está en Supabase, intentar localStorage como fallback
        let localData = getSubmission(code);

        // Si no existe y el código es "MOCK1234", usar datos mock
        if (!localData && code === "MOCK1234") {
          localData = getMockSubmission();
        }

        setSubmission(localData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading submission:", error);

        // Fallback a localStorage en caso de error
        const localData = getSubmission(code);
        setSubmission(localData);
        setLoading(false);
      }
    };

    loadSubmission();
  }, [code]);

  // Efecto para cambiar los datos cuando se selecciona un miembro diferente
  useEffect(() => {
    if (!allGroupSubmissions.length) return;

    if (selectedMember === null) {
      // Mostrar promedio del equipo
      const avgAnswers = Array.from({ length: 24 }, (_, i) => {
        const sum = allGroupSubmissions.reduce((acc, sub) => {
          return acc + (sub.answers[i] || 0);
        }, 0);
        return sum / allGroupSubmissions.length;
      });

      setSubmission(prev => prev ? {
        ...prev,
        answers: avgAnswers as any
      } : null);
    } else {
      // Mostrar datos del miembro seleccionado
      const memberSubmission = allGroupSubmissions.find(
        sub => sub.user_name === selectedMember
      );

      if (memberSubmission) {
        setSubmission({
          groupCode: "",
          participantCode: memberSubmission.participant_code,
          answers: memberSubmission.answers as any,
          timestamp: new Date(memberSubmission.timestamp).getTime(),
        });
        setUserName(memberSubmission.user_name || "");
      }
    }
  }, [selectedMember, allGroupSubmissions]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
        <div className="text-center space-y-6">
          <div className="h-20 w-20 border-4 rounded-full animate-spin mx-auto shadow-lg"
               style={{ borderColor: '#2C248E', borderTopColor: 'transparent' }} />
          <p className="text-2xl font-bold text-white">Cargando resultados...</p>
          <p className="text-sm text-white/70">Preparando tu diagnóstico organizativo</p>
        </div>
      </main>
    );
  }

  if (!submission) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a1a] p-4">
        <div className="max-w-md border-2 shadow-2xl p-10 text-center space-y-6 bg-[#1a1a2e] rounded-xl"
             style={{ borderColor: '#E65B3E' }}>
          <div className="p-6 rounded-3xl w-28 h-28 mx-auto flex items-center justify-center shadow-xl"
               style={{ background: 'linear-gradient(135deg, #E65B3E 0%, #D91D5C 100%)' }}>
            <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Código no encontrado</h2>
          <p className="text-white/80 font-semibold text-lg">
            No se encontraron resultados para el código:
          </p>
          <div className="p-3 bg-red-900/20 rounded-lg border-2 border-red-500/50">
            <span className="font-mono font-bold text-xl" style={{ color: '#E65B3E' }}>{code}</span>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300"
            style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  return (
    <EditorProvider>
      <main className="min-h-screen bg-[#0a0a1a] text-white">
        {/* Toolbar del Editor */}
        <EditorToolbar />

        {/* Contenido del Dashboard con Layout Dual */}
        <DashboardContent
          submission={submission}
          selectedArea={selectedArea}
          selectedSubArea={selectedSubArea}
          setSelectedArea={setSelectedArea}
          setSelectedSubArea={setSelectedSubArea}
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          groupMembers={groupMembers}
          selectedMember={selectedMember}
          setSelectedMember={setSelectedMember}
        />

        {/* Panel Lateral del Editor */}
        <EditorPanel />
      </main>
    </EditorProvider>
  );
}

