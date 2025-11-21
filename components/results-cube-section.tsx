"use client";

import { Suspense, useRef, forwardRef, useState, useEffect } from "react";
import { AnswerValue } from "@/lib/types";
import { Cube3D, Cube3DRef } from "@/components/cube-3d";
import { CubeDesplegado2D } from "@/components/cube-desplegado-2d";
import { LeyendaLecturaReal } from "@/components/leyenda-lectura-real";
import { VistaEspecificaPanel } from "@/components/vista-especifica-panel";
import { VistaGlobalPanel } from "@/components/vista-global-panel";
import { AREA_COLORS, getGradientBackground } from "@/lib/constants";
import { getGroupAverages } from "@/lib/supabase";

interface ResultsCubeSectionProps {
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

export const ResultsCubeSection = forwardRef<Cube3DRef, ResultsCubeSectionProps>(
  function ResultsCubeSection({ answers, participantCode, groupId, groupName, view3D, onToggleView, webGLSupported }, cube3DRef) {
    // Estados (DEBEN estar antes de cualquier return condicional)
    const [viewMode, setViewMode] = useState<'individual' | 'equipo'>('individual');
    const [teamAnswers, setTeamAnswers] = useState<AnswerValue[] | null>(null);
    const [loadingTeamData, setLoadingTeamData] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<'critico' | 'desarrollo' | 'solido' | 'ejemplar' | null>('critico');
    const [selectedAreaIndex, setSelectedAreaIndex] = useState<number | null>(0);
    const [selectedSubAreaIndex, setSelectedSubAreaIndex] = useState<number | null>(0);
    const [autoRotate, setAutoRotate] = useState(true);
    const [activeTab, setActiveTab] = useState<'especifica' | 'global'>('especifica');
    const [compactMode, setCompactMode] = useState(false);
    // TAREA 2: Estado para pantalla completa
    const [isFullscreen, setIsFullscreen] = useState(false);

    const cubeContainerRef = useRef<HTMLDivElement>(null);
    const fullscreenContainerRef = useRef<HTMLDivElement>(null);

    // Cargar datos del equipo cuando se cambia a modo "equipo"
    useEffect(() => {
      const loadTeamData = async () => {
        if (viewMode === 'equipo' && groupId && !teamAnswers) {
          setLoadingTeamData(true);
          try {
            const { data, error } = await getGroupAverages(groupId);
            if (data && !error) {
              setTeamAnswers(data as AnswerValue[]);
            } else {
              console.error('Error loading team data:', error);
            }
          } catch (error) {
            console.error('Error loading team data:', error);
          } finally {
            setLoadingTeamData(false);
          }
        }
      };

      loadTeamData();
    }, [viewMode, groupId, teamAnswers]);

    // TAREA 2: Detectar cambios en el estado de pantalla completa (ANTES del return condicional)
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }, []);

    // Validación de datos (DESPUÉS de todos los hooks)
    if (!answers || answers.length !== 24) {
      return (
        <div className="bg-white border-4 border-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        </div>
      );
    }

    // Determinar qué datos mostrar según el modo
    const displayAnswers = viewMode === 'equipo' && teamAnswers ? teamAnswers : answers;

    // Calcular promedios por área usando displayAnswers
    const areaAverages = Array.from({ length: 6 }, (_, i) => {
      const startIndex = i * 4;
      const areaAnswers = displayAnswers.slice(startIndex, startIndex + 4);
      return areaAnswers.reduce((sum, val) => sum + val, 0) / 4;
    });

    // Handlers
    const handleAreaClick = (areaIndex: number) => {
      setSelectedAreaIndex(areaIndex);
      setSelectedSubAreaIndex(0);

      // Rotar el cubo hacia esa área
      if (cube3DRef && typeof cube3DRef !== 'function' && cube3DRef.current) {
        cube3DRef.current.rotateTo(areaIndex);
      }
    };

    const handleCellClick = (areaIndex: number, subAreaIndex: number) => {
      setSelectedAreaIndex(areaIndex);
      setSelectedSubAreaIndex(subAreaIndex);

      // Rotar el cubo hacia esa área
      if (cube3DRef && typeof cube3DRef !== 'function' && cube3DRef.current) {
        cube3DRef.current.rotateTo(areaIndex);
      }
    };

    // TAREA 2: Funciones para manejar pantalla completa
    const handleToggleFullscreen = () => {
      if (!fullscreenContainerRef.current) return;

      if (!isFullscreen) {
        // Entrar en pantalla completa
        if (fullscreenContainerRef.current.requestFullscreen) {
          fullscreenContainerRef.current.requestFullscreen();
        }
      } else {
        // Salir de pantalla completa
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    return (
      <div
        ref={fullscreenContainerRef}
        className={`bg-white border-4 border-gray-900 rounded-lg p-6 shadow-xl transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''
        }`}
      >
        {/* Título principal con indicador de modo y controles */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 uppercase">TEST DE DIAGNÓSTICO INTEGRAL</h1>
              {/* Badge indicador de modo */}
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all shadow-md ${
                viewMode === 'individual'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-green-100 text-green-700 border-2 border-green-300'
              }`}>
                {viewMode === 'individual' ? '👤 Vista Individual' : '👥 Vista de Equipo'}
              </span>
            </div>

            {/* Toggle modo compacto */}
            <button
              onClick={() => setCompactMode(!compactMode)}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-200 hover:bg-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
              title={compactMode ? 'Expandir vista' : 'Vista compacta'}
            >
              {compactMode ? '📏 Expandir' : '📐 Compactar'}
            </button>
          </div>

          {/* Subtítulo dinámico según el modo */}
          <h2 className={`text-xl font-bold transition-all ${
            viewMode === 'individual'
              ? 'text-gray-900'
              : 'text-green-700'
          }`}>
            {viewMode === 'individual' ? 'ÁREAS SENSIBLES' : 'RESULTADOS DEL EQUIPO'}
          </h2>

          {/* Mensaje informativo adicional para modo equipo */}
          {viewMode === 'equipo' && (
            <p className="text-sm text-green-600 mt-1 font-medium">
              {groupName ? (
                <>
                  📊 Resultados del equipo: <span className="font-bold text-green-700">{groupName}</span>
                </>
              ) : (
                <>📊 Mostrando promedios agregados del equipo</>
              )}
            </p>
          )}
        </div>

        {/* Layout de 2 columnas */}
        <div className={`grid grid-cols-1 lg:grid-cols-[60%_40%] ${compactMode ? 'gap-3' : 'gap-6'}`}>
          {/* ========== COLUMNA IZQUIERDA ========== */}
          <div className={`flex flex-col ${compactMode ? 'gap-3' : 'gap-6'}`}>

            {/* Sección 1: MAPA SITUACIONAL */}
            <div className="border-2 border-gray-900 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase flex items-center gap-2">
                <span>🗺️</span>
                <span>MAPA SITUACIONAL DE LAS 6 ÁREAS DE LA ORGANIZACIÓN</span>
              </h3>

              {/* Toggle Individual/Equipo */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setViewMode('individual')}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm ${
                    viewMode === 'individual'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  INDIVIDUAL
                </button>
                <button
                  onClick={() => setViewMode('equipo')}
                  disabled={!groupId || loadingTeamData}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 transform shadow-sm ${
                    viewMode === 'equipo'
                      ? 'bg-gray-900 text-white shadow-md'
                      : !groupId
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105 active:scale-95'
                  }`}
                  title={!groupId ? 'No hay datos de equipo disponibles' : ''}
                >
                  {loadingTeamData ? 'CARGANDO...' : 'EQUIPO'}
                </button>
              </div>

              {/* Cubo 3D */}
              <div className="flex gap-6">
                {/* Leyenda de colores con degradados usando colores corporativos */}
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2 group">
                    <div
                      className="w-6 h-6 border border-gray-900 rounded shadow-sm group-hover:shadow-md transition-shadow duration-200"
                      style={{ background: getGradientBackground(AREA_COLORS[5], 87.5) }}
                      title="Ejemplo: Personas 87.5% cumplimiento"
                    />
                    <span className="font-semibold flex items-center gap-1">
                      <span>🔵</span>
                      <span>EJEMPLAR (▲ 75%)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <div
                      className="w-6 h-6 border border-gray-900 rounded shadow-sm group-hover:shadow-md transition-shadow duration-200"
                      style={{ background: getGradientBackground(AREA_COLORS[4], 62.5) }}
                      title="Ejemplo: Recursos 62.5% cumplimiento"
                    />
                    <span className="font-semibold flex items-center gap-1">
                      <span>🟢</span>
                      <span>SÓLIDO (▲ 50%)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <div
                      className="w-6 h-6 border border-gray-900 rounded shadow-sm group-hover:shadow-md transition-shadow duration-200"
                      style={{ background: getGradientBackground(AREA_COLORS[2], 37.5) }}
                      title="Ejemplo: Orientación 37.5% cumplimiento"
                    />
                    <span className="font-semibold flex items-center gap-1">
                      <span>🟠</span>
                      <span>DESARROLLO (▼ 50%)</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <div
                      className="w-6 h-6 border border-gray-900 rounded shadow-sm group-hover:shadow-md transition-shadow duration-200"
                      style={{ background: getGradientBackground(AREA_COLORS[0], 12.5) }}
                      title="Ejemplo: Estrategia 12.5% cumplimiento"
                    />
                    <span className="font-semibold flex items-center gap-1">
                      <span>🔴</span>
                      <span>CRÍTICO (▼ 25%)</span>
                    </span>
                  </div>
                </div>

                {/* Cubo 3D con botón de pantalla completa */}
                <div ref={cubeContainerRef} className="flex-1 relative">
                  {/* TAREA 2: Botón de pantalla completa */}
                  <button
                    onClick={handleToggleFullscreen}
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white border-2 border-gray-900 rounded-lg p-2 shadow-lg hover:shadow-xl transition-all duration-200 group"
                    title={isFullscreen ? "Salir de pantalla completa (ESC)" : "Pantalla completa"}
                  >
                    {isFullscreen ? (
                      <svg className="w-6 h-6 text-gray-900 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-900 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    )}
                  </button>

                  {webGLSupported ? (
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                      </div>
                    }>
                      <Cube3D
                        ref={cube3DRef}
                        data={displayAnswers}
                        autoRotate={autoRotate}
                        onFaceClick={handleAreaClick}
                        onCellClick={handleCellClick}
                      />
                    </Suspense>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <p className="text-gray-600">WebGL no soportado</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección 2: FOCO DE INTERVENCIÓN 360 */}
            <div className="border-2 border-gray-900 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CubeDesplegado2D
                answers={displayAnswers}
                selectedFilter={selectedFilter}
                onAreaClick={handleAreaClick}
              />

              {/* Filtros con iconos */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => setSelectedFilter('critico')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1 ${
                    selectedFilter === 'critico'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <span>🔴</span>
                  <span>CRÍTICO</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('desarrollo')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1 ${
                    selectedFilter === 'desarrollo'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <span>🟠</span>
                  <span>DESARROLLO</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('solido')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1 ${
                    selectedFilter === 'solido'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <span>🟢</span>
                  <span>SÓLIDO</span>
                </button>
                <button
                  onClick={() => setSelectedFilter('ejemplar')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1 ${
                    selectedFilter === 'ejemplar'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <span>🔵</span>
                  <span>EJEMPLAR</span>
                </button>
              </div>
            </div>

            {/* Sección 3: LEYENDA DE LECTURA REAL */}
            <div className="border-2 border-gray-900 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <LeyendaLecturaReal answers={displayAnswers} selectedFilter={selectedFilter} />
            </div>
          </div>

          {/* ========== COLUMNA DERECHA ========== */}
          <div className={`flex flex-col ${compactMode ? 'gap-3' : 'gap-6'}`}>
            {/* Panel con tabs para Vista Específica y Vista Global */}
            {selectedAreaIndex !== null && (
              <div className={`border-2 border-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                activeTab === 'global' ? '' : 'p-4 bg-white'
              }`}>
                {/* Tabs - Solo mostrar si NO es Vista Global */}
                {activeTab !== 'global' && (
                  <div className="flex gap-2 mb-4 border-b-2 border-gray-200">
                    <button
                      onClick={() => setActiveTab('especifica')}
                      className={`px-4 py-2 font-bold text-sm border-b-2 transition-all duration-200 ${
                        activeTab === 'especifica'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      📍 Vista Específica
                    </button>
                    <button
                      onClick={() => setActiveTab('global')}
                      className={`px-4 py-2 font-bold text-sm border-b-2 transition-all duration-200 ${
                        activeTab === 'global'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      🌐 Vista Global
                    </button>
                  </div>
                )}

                {/* Contenido de tabs */}
                <div className="animate-fadeIn">
                  {activeTab === 'especifica' && selectedSubAreaIndex !== null ? (
                    <VistaEspecificaPanel
                      areaIndex={selectedAreaIndex}
                      subAreaIndex={selectedSubAreaIndex}
                      answers={displayAnswers}
                    />
                  ) : (
                    <VistaGlobalPanel
                      areaIndex={selectedAreaIndex}
                      answers={displayAnswers}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

