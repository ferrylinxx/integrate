"use client";

import { Suspense, useRef, forwardRef, useState, useEffect } from "react";
import { AnswerValue } from "@/lib/types";
import { Cube3D, Cube3DRef } from "@/components/cube-3d";
import { CubeDesplegado2D } from "@/components/cube-desplegado-2d";
import { LeyendaLecturaReal } from "@/components/leyenda-lectura-real";
import { AreaCompletaPanel } from "@/components/vista-especifica-panel";
import { VistaGlobalPanel } from "@/components/vista-global-panel";
import { VistaGeneralMejorada } from "@/components/vista-general-mejorada";
import { AREA_COLORS, getGradientBackground, SUB_AREA_NAMES_BY_AREA } from "@/lib/constants";
import { getGroupAverages, getSubmissionsByGroup } from "@/lib/supabase";
import { Submission } from "@/lib/supabase/types";

interface CuboVistaSectionProps {
  answers: AnswerValue[];
  participantCode: string;
  groupId: string | null;
  groupName: string | null;
  view3D: boolean;
  onToggleView: (is3D: boolean) => void;
  webGLSupported: boolean;
}

// Función para calcular el nivel según el promedio
const getLevel = (average: number): 'critico' | 'desarrollo' | 'solido' | 'ejemplar' => {
  if (average < 1.25) return 'critico';
  if (average < 2.5) return 'desarrollo';
  if (average < 3.75) return 'solido';
  return 'ejemplar';
};

export const CuboVistaSection = forwardRef<Cube3DRef, CuboVistaSectionProps>(
  function CuboVistaSection({ answers, participantCode, groupId, groupName, view3D, onToggleView, webGLSupported }, cube3DRef) {
    // Estados
    const [viewMode, setViewMode] = useState<'individual' | 'equipo'>('equipo'); // Por defecto EQUIPO
    const [teamAnswers, setTeamAnswers] = useState<AnswerValue[] | null>(null);
    const [loadingTeamData, setLoadingTeamData] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null>('solido');
    const [selectedAreaIndex, setSelectedAreaIndex] = useState<number | null>(0);
    const [selectedSubAreaIndex, setSelectedSubAreaIndex] = useState<number | null>(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const [activeTab, setActiveTab] = useState<'especifica' | 'global'>('especifica');
    const [compactMode, setCompactMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // NUEVO: Estado para controlar si el cubo está en modo "área seleccionada"
    const [areaSelected, setAreaSelected] = useState(false);

    // NUEVO: Estados para miembros del grupo
    const [groupMembers, setGroupMembers] = useState<Array<{ name: string; answers: AnswerValue[] }>>([]);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);



    const cubeContainerRef = useRef<HTMLDivElement>(null);
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);

    // Cargar datos del equipo y miembros cuando hay groupId
    useEffect(() => {
      const loadGroupData = async () => {
        if (!groupId) {
          console.log('❌ No hay groupId, no se cargarán miembros');
          return;
        }

        console.log('🔄 Cargando datos del grupo:', groupId);
        setLoadingTeamData(true);
        try {
          // Cargar promedios del equipo
          const { data: averages, error: avgError } = await getGroupAverages(groupId);
          if (averages && !avgError) {
            console.log('✅ Promedios del equipo cargados:', averages);
            setTeamAnswers(averages as AnswerValue[]);
          }

          // Cargar miembros del grupo
          const { data: submissions, error: subError } = await getSubmissionsByGroup(groupId);
          console.log('📊 Submissions recibidas:', submissions);

          if (submissions && !subError) {
            const members = submissions
              .filter((sub: Submission) => sub.user_name && sub.user_name.trim() !== '')
              .map((sub: Submission) => ({
                name: sub.user_name!,
                answers: sub.answers as AnswerValue[]
              }));
            console.log('👥 Miembros del grupo:', members);
            setGroupMembers(members);
          }
        } catch (error) {
          console.error('❌ Error loading group data:', error);
        } finally {
          setLoadingTeamData(false);
        }
      };

      loadGroupData();
    }, [groupId]);

    // NUEVO: Activar modo maximizado automáticamente al cargar la página
    useEffect(() => {
      // Activar modo maximizado automáticamente
      setIsFullscreen(true);
      console.log('✅ Modo maximizado activado automáticamente');
    }, []);

    // Bloquear scroll del body cuando está en modo maximizado
    useEffect(() => {
      if (isFullscreen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [isFullscreen]);

    // Detectar tecla ESC para salir del modo maximizado
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
          setIsFullscreen(false);
          console.log('⌨️ ESC presionado - Saliendo del modo maximizado');
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isFullscreen]);

    // NUEVO: Handler para cuando se hace click en un área del cubo
    const handleAreaClick = (areaIndex: number) => {
      console.log('Área clickeada:', areaIndex);

      // 1. Activar modo "área seleccionada" (cubo pequeño + vista específica)
      setAreaSelected(true);

      // 2. Seleccionar el área clickeada
      setSelectedAreaIndex(areaIndex);
      setSelectedSubAreaIndex(0); // Primera sub-área por defecto

      // 3. Cambiar a tab "Vista Específica"
      setActiveTab('especifica');

      // 4. Desactivar auto-rotate
      setAutoRotate(false);
    };

    // NUEVO: Handler para cuando se hace click en una celda específica
    const handleCellClick = (areaIndex: number, subAreaIndex: number) => {
      console.log('Celda clickeada:', areaIndex, subAreaIndex);

      setAreaSelected(true);
      setSelectedAreaIndex(areaIndex);
      setSelectedSubAreaIndex(subAreaIndex);
      setActiveTab('especifica');
      setAutoRotate(false);
    };

    // NUEVO: Handler para cuando se hace click en una sub-área
    const handleSubAreaClick = (subAreaIndex: number) => {
      console.log('Sub-área clickeada:', subAreaIndex);
      setSelectedSubAreaIndex(subAreaIndex);
    };

    // NUEVO: Handler para volver a la vista general
    const handleBackToGeneral = () => {
      console.log('Volver a vista general');
      setAreaSelected(false);
      setSelectedAreaIndex(null);
      setSelectedSubAreaIndex(null);

      // ARREGLO: Reactivar la rotación automática del cubo
      setAutoRotate(true);

      // ARREGLO: Resetear el zoom del cubo
      if (cube3DRef && typeof cube3DRef !== 'function' && cube3DRef.current) {
        cube3DRef.current.resetZoom();
        console.log('✅ Zoom reseteado y rotación reactivada');
      }
    };

    // Validación de datos
    if (!answers || answers.length !== 24) {
      return (
        <div className="bg-white border-4 border-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      );
    }

    // Determinar qué datos mostrar según el modo y selección
    const displayAnswers = selectedMember
      ? (groupMembers.find(m => m.name === selectedMember)?.answers || answers)
      : (viewMode === 'equipo' && teamAnswers ? teamAnswers : answers);

    // Calcular promedios por área usando displayAnswers
    const areaAverages = Array.from({ length: 6 }, (_, i) => {
      const startIndex = i * 4;
      const areaAnswers = displayAnswers.slice(startIndex, startIndex + 4);
      return areaAnswers.reduce((sum, val) => sum + val, 0) / 4;
    });

    // Función para manejar modo maximizado (sin API de fullscreen)
    const handleToggleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
      console.log('🔄 Modo maximizado:', !isFullscreen);
    };

    return (
      <div
        ref={fullscreenContainerRef}
        className={`transition-all duration-500 ${
          isFullscreen
            ? 'fixed top-0 left-0 right-0 bottom-0 z-[9999] overflow-auto bg-[#0a0a0f] p-8'
            : ''
        }`}
        style={isFullscreen ? {
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: '2rem'
        } : undefined}
      >
        {/* Layout principal */}
        <div className="space-y-3">
          {/* Grid de 2 columnas para cubo y vista general */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* COLUMNA IZQUIERDA - CUBO */}
            <div className="space-y-2">
            {/* Título principal */}
            <div className="mb-2">
              <h1 className="text-lg font-bold text-white uppercase tracking-wide leading-tight">
                MAPA DE SITUACIÓN
              </h1>
              <h2 className="text-sm font-light text-white/80 uppercase tracking-wide">
                DE LAS 6 ÁREAS DE LA ORGANIZACIÓN
              </h2>
            </div>

            {/* Selector de Vista: EQUIPO + Miembros Individuales */}
            <div className="flex flex-wrap items-start gap-2 mb-2">
              {/* Botón EQUIPO - Píldora alargada */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedMember(null);
                    setViewMode('equipo');
                  }}
                  className={`px-8 py-1.5 rounded-full transition-all duration-300 backdrop-blur-xl border ${
                    !selectedMember && viewMode === 'equipo'
                      ? 'text-white shadow-2xl border-white/20'
                      : 'text-white/70 hover:bg-white/10 border-white/15'
                  }`}
                  title="Vista de Equipo (Promedio)"
                  style={{
                    minWidth: '140px',
                    background: !selectedMember && viewMode === 'equipo'
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 100%)'
                      : 'rgba(255,255,255,0.05)'
                  }}
                >
                  <span className="font-semibold text-sm uppercase tracking-widest">EQUIPO</span>
                </button>
              </div>

              {/* Botones de Miembros Individuales - Círculos con nombres debajo */}
              {groupMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  {/* Círculo con icono de usuario */}
                  <button
                    onClick={() => {
                      setSelectedMember(member.name);
                      setViewMode('individual');
                    }}
                    className={`w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center backdrop-blur-md ${
                      selectedMember === member.name
                        ? 'bg-white/15 border-2 border-white/40 shadow-xl'
                        : 'bg-transparent border-2 border-white/25 hover:bg-white/10 hover:border-white/35'
                    }`}
                    title={`Ver resultados de ${member.name}`}
                  >
                    {/* Icono de usuario simple */}
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {/* Nombre debajo del círculo - altura fija para alinear todos */}
                  <div className="text-center h-8 flex items-start justify-center">
                    <p className="text-white text-[10px] font-normal leading-tight max-w-[60px] break-words">
                      {member.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contenido del cubo - Columna izquierda */}
            <div className="space-y-2">
              {areaSelected && selectedAreaIndex !== null ? (
                /* Cubo 2x2 cuando se selecciona un área */
                <>
                  {/* Botón volver */}
                  <button
                    onClick={handleBackToGeneral}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all bg-white/10 hover:bg-white/20 text-white"
                    aria-label="Volver"
                  >
                    <span className="text-sm">←</span>
                    <span className="text-[10px] font-medium">Volver</span>
                  </button>

                  {/* Cubo 2x2 grande con leyenda */}
                  <div className="flex items-end justify-center gap-4">
                    {/* Leyenda vertical a la izquierda - alineada abajo */}
                    <div className="flex flex-col gap-1.5 pb-2">
                      {[
                        { label: 'EJEMPLAR', percentage: 100 },
                        { label: 'SÓLIDO', percentage: 75 },
                        { label: 'DESARROLLO', percentage: 50 },
                        { label: 'CRÍTICO', percentage: 25 }
                      ].map((level) => {
                        const areaColor = AREA_COLORS[selectedAreaIndex];
                        return (
                          <div key={level.label} className="flex items-center gap-1.5">
                            {/* Cuadrado de color con degradado */}
                            <div
                              className="w-5 h-5 rounded border border-white/30"
                              style={{
                                background: getGradientBackground(areaColor, level.percentage)
                              }}
                            />
                            {/* Texto del nivel */}
                            <div className="flex flex-col leading-tight">
                              <span className="text-white text-[10px] font-bold uppercase">
                                {level.label}
                              </span>
                              <span className="text-white/60 text-[8px]">
                                {level.percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cubo 2x2 */}
                    <div className="grid grid-cols-2 gap-2.5 w-full aspect-square max-w-[340px]">
                      {[0, 1, 2, 3].map((index) => {
                        const subAnswerIndex = selectedAreaIndex * 4 + index;
                        const subValue = displayAnswers[subAnswerIndex];
                        const subPercentage = (subValue / 4) * 100;
                        const areaColor = AREA_COLORS[selectedAreaIndex];

                        return (
                          <div
                            key={index}
                            className={`
                              border-2 rounded-lg transition-all duration-300 cursor-pointer relative
                              border-white/30
                              ${selectedSubAreaIndex === index ? 'ring-2 ring-white/50 scale-105' : 'opacity-70 hover:opacity-100'}
                            `}
                            style={{
                              background: getGradientBackground(areaColor, subPercentage),
                              minHeight: '110px'
                            }}
                            onClick={() => handleSubAreaClick(index)}
                          >
                            {/* Nombre de la subárea */}
                            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5">
                              <span
                                className="text-white text-xs font-bold"
                                style={{
                                  textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.7)'
                                }}
                              >
                                {SUB_AREA_NAMES_BY_AREA[selectedAreaIndex][index]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Cubo 3D cuando NO hay área seleccionada */
                <>
                  {/* Loading state minimalista */}
                  {loadingTeamData && (
                    <div className="text-center py-16">
                      <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-white/20 border-r-white mb-6"></div>
                      <p className="text-xl text-white font-bold">Cargando datos del equipo...</p>
                    </div>
                  )}

                  {/* Cubo 3D con leyenda de niveles */}
                  <div className="flex items-end justify-center" style={{ gap: '2px' }}>
                    {/* Leyenda de niveles - Vertical a la izquierda - alineada abajo */}
                    <div className="flex flex-col gap-1.5 pb-2">
                      {[
                        { label: 'EJEMPLAR', percentage: 100 },
                        { label: 'SÓLIDO', percentage: 75 },
                        { label: 'DESARROLLO', percentage: 50 },
                        { label: 'CRÍTICO', percentage: 25 }
                      ].map((level) => {
                        // Usar el color del área seleccionada o un color por defecto
                        const areaColor = selectedAreaIndex !== null ? AREA_COLORS[selectedAreaIndex] : AREA_COLORS[0];
                        return (
                          <div key={level.label} className="flex items-center gap-2">
                            {/* Cuadrado de color con degradado */}
                            <div
                              className="w-5 h-5 rounded border border-white/30 flex-shrink-0"
                              style={{
                                background: getGradientBackground(areaColor, level.percentage)
                              }}
                            ></div>
                            {/* Texto */}
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-white uppercase leading-tight">
                                {level.label}
                              </span>
                              <span className="text-[8px] text-white/60 leading-tight">
                                {level.percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cubo 3D */}
                    <div
                      ref={cubeContainerRef}
                      className="relative"
                      style={{ height: '420px', width: '100%', maxWidth: '600px' }}
                    >
                      {/* Botón pantalla completa */}
                      <button
                        onClick={handleToggleFullscreen}
                        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-2 transition-all duration-300"
                        title={isFullscreen ? "Salir de pantalla completa (ESC)" : "Pantalla completa"}
                      >
                        {isFullscreen ? (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        )}
                      </button>

                      {webGLSupported ? (
                        <Suspense fallback={
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <div className="h-16 w-16 border-4 rounded-full animate-spin mx-auto mb-4 border-white/20 border-t-white"></div>
                              <p className="text-lg text-white font-bold">Cargando cubo 3D...</p>
                            </div>
                          </div>
                        }>
                          <Cube3D
                            ref={cube3DRef}
                            data={displayAnswers}
                            autoRotate={autoRotate}
                            onAutoRotateChange={setAutoRotate}
                            onFaceClick={handleAreaClick}
                            onCellClick={handleCellClick}
                          />
                        </Suspense>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center max-w-md px-8">
                            <div className="bg-red-500/20 rounded-full p-6 inline-block mb-4">
                              <svg className="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">WebGL no disponible</h3>
                            <p className="text-white/70 text-sm">
                              Tu navegador no soporta gráficos 3D.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Leyenda de Áreas */}
                  <div className="mt-8 space-y-3">
                    <h4 className="text-white/80 text-sm font-bold uppercase tracking-wide mb-4">ÁREAS</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#E11D48' }}></div>
                        <span className="text-white/70 text-sm">PERSONAS</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#F97316' }}></div>
                        <span className="text-white/70 text-sm">RECURSOS</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#3B82F6' }}></div>
                        <span className="text-white/70 text-sm">ESTRATEGIA</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#8B5CF6' }}></div>
                        <span className="text-white/70 text-sm">EFICACIA</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#6B7280' }}></div>
                        <span className="text-white/70 text-sm">ESTRUCTURA</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#A855F7' }}></div>
                        <span className="text-white/70 text-sm">ORIENTACIÓN A RESULTADOS</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA - VISTA GENERAL (siempre visible) */}
          <div className="space-y-6">
            <VistaGeneralMejorada
              answers={displayAnswers}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              onAreaClick={handleAreaClick}
            />
          </div>

          </div>

          {/* ÁREA COMPLETA - Ocupa todo el ancho debajo de las dos columnas */}
          {areaSelected && selectedAreaIndex !== null && selectedSubAreaIndex !== null && (
            <AreaCompletaPanel
              areaIndex={selectedAreaIndex}
              subAreaIndex={selectedSubAreaIndex}
              answers={displayAnswers}
              darkMode={true}
            />
          )}

        </div>

      </div>
    );
  }
);



