"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Submission } from "@/lib/types";
import { getSubmission, getMockSubmission } from "@/lib/storage";
import { getSubmissionByCode, getGroupById, getGroupByCode, getGroupAverages } from "@/lib/supabase";
import { Cube3DRef } from "@/components/cube-3d";
import { CuboVistaSection } from "@/components/cubo-vista-section";
import { VersionBadge } from "@/components/version-badge";
import { useWebGLSupport } from "@/lib/hooks/use-webgl-support";
import { Card, CardContent } from "@/components/ui/card";

export default function ResultadoPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [view3D, setView3D] = useState(true);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const cube3DRef = useRef<Cube3DRef>(null);
  const webGLSupported = useWebGLSupport();

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        // Primero intentar obtener como participante individual
        const { data: supabaseData, error: participantError } = await getSubmissionByCode(code);

        if (supabaseData && !participantError) {
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
          }

          setLoading(false);
          return;
        }

        // Si no es un participante, intentar como código de grupo
        const { data: groupData, error: groupError } = await getGroupByCode(code);

        if (groupData && !groupError) {
          // Obtener promedios del grupo
          const { data: averagesData, error: averagesError } = await getGroupAverages(groupData.id);

          if (averagesData && !averagesError) {
            // Crear una submission "virtual" con los promedios del grupo
            const submission: Submission = {
              groupCode: groupData.code,
              participantCode: groupData.code,
              answers: averagesData,
              timestamp: Date.now(),
            };
            setSubmission(submission);
            setGroupId(groupData.id);
            setGroupName(groupData.name || "");
            setUserName(""); // No hay usuario individual en grupo

            setLoading(false);
            return;
          }
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
        console.error("Error loading data:", error);

        // Fallback a localStorage en caso de error
        const localData = getSubmission(code);
        setSubmission(localData);
        setLoading(false);
      }
    };

    loadSubmission();
  }, [code]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-6">
          <div className="h-20 w-20 border-4 rounded-full animate-spin mx-auto shadow-lg"
               style={{ borderColor: '#2C248E', borderTopColor: 'transparent' }} />
          <p className="text-2xl font-bold bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">
            Cargando resultados...
          </p>
          <p className="text-sm text-gray-600">Preparando tu diagnóstico organizativo</p>
        </div>
      </main>
    );
  }

  if (!submission) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
        <Card className="max-w-md border-2 shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              style={{ borderColor: '#E65B3E' }}>
          <CardContent className="pt-10 pb-10 text-center space-y-6">
            <div className="p-6 rounded-3xl w-28 h-28 mx-auto flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300"
                 style={{ background: 'linear-gradient(135deg, #E65B3E 0%, #D91D5C 100%)' }}>
              <svg className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#E65B3E] to-[#D91D5C] bg-clip-text text-transparent">
              Código no encontrado
            </h2>
            <p className="text-gray-700 font-semibold text-lg">
              No se encontraron resultados para el código:
            </p>
            <div className="p-3 bg-red-50 rounded-lg border-2 border-red-200">
              <span className="font-mono font-bold text-xl" style={{ color: '#E65B3E' }}>{code}</span>
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300"
              style={{ background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 100%)' }}
            >
              Volver al inicio
            </button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <>
      {/* Version Badge - Top Right */}
      <VersionBadge position="top-right" size="sm" />

      {/* Marca de agua - Programa en Desarrollo */}
      <div className="fixed bottom-4 left-4 z-[10000]">
        <p className="text-white text-xs font-light tracking-wide">
          Programa en Desarrollo (Versión 4.1.0)
        </p>
      </div>

      <main className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        {/* Patrón de cuadrícula sutil en el fondo */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        {/* Contenido principal */}
        <div className="relative mx-auto max-w-[1600px] px-4 py-3 md:px-6 md:py-4">
          {/* Sección del cubo 3D/2D - Versión cubo-vista */}
          <CuboVistaSection
            ref={cube3DRef}
            answers={submission.answers}
            participantCode={code}
            groupId={groupId}
            groupName={groupName}
            view3D={view3D}
            onToggleView={setView3D}
            webGLSupported={webGLSupported}
          />
        </div>
      </main>
    </>
  );
}
