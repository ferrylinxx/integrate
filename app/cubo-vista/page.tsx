"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Submission } from "@/lib/types";
import { getMockSubmission } from "@/lib/storage";
import { Cube3DRef } from "@/components/cube-3d";
import { ResultsHeader } from "@/components/results-header";
import { CuboVistaSection } from "@/components/cubo-vista-section";
import { Navbar } from "@/components/navbar";
import { VersionBadge } from "@/components/version-badge";
import { useWebGLSupport } from "@/lib/hooks/use-webgl-support";
import { getGroupById, getGroupAverages, getAllGroups } from "@/lib/supabase";

function CuboVistaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [view3D, setView3D] = useState(true);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const [userName] = useState<string>("Vista General");
  const cube3DRef = useRef<Cube3DRef>(null);
  const webGLSupported = useWebGLSupport();

  useEffect(() => {
    const loadData = async () => {
      // HARDCODED: Buscar el grupo "GarBotGPT" por nombre
      const targetGroupName = "GarBotGPT";

      try {
        console.log('🔍 Buscando grupo:', targetGroupName);

        // Obtener todos los grupos y buscar el que coincida con el nombre
        const { data: allGroups, error: groupsError } = await getAllGroups();

        if (groupsError || !allGroups) {
          throw new Error('No se pudieron cargar los grupos');
        }

        console.log('📋 Grupos disponibles:', allGroups.map(g => ({ id: g.id, name: g.name })));

        // Buscar el grupo por nombre
        const targetGroup = allGroups.find(g => g.name === targetGroupName);

        if (!targetGroup) {
          console.log('❌ Grupo no encontrado, usando datos mock');
          const mockData = getMockSubmission();
          setSubmission(mockData);
          setLoading(false);
          return;
        }

        console.log('✅ Grupo encontrado:', targetGroup);

        // Usar el ID real del grupo
        const realGroupId = targetGroup.id;
        setGroupId(realGroupId);
        setGroupName(targetGroup.name);

        // Cargar promedios del grupo como submission
        const { data: averages, error: avgError } = await getGroupAverages(realGroupId);

        if (averages && !avgError) {
          console.log('✅ Promedios cargados:', averages);
          setSubmission({
            id: 'group-' + realGroupId,
            participant_code: 'GROUP',
            answers: averages,
            timestamp: new Date().toISOString(),
            group_id: realGroupId,
            user_name: targetGroup.name
          });
        } else {
          console.log('⚠️ No se pudieron cargar promedios, usando datos mock');
          console.log('Error:', avgError);
          const mockData = getMockSubmission();
          setSubmission(mockData);
        }
      } catch (error) {
        console.error('❌ Error loading group data:', error);
        // Si falla, usar datos mock
        const mockData = getMockSubmission();
        setSubmission(mockData);
      }

      setLoading(false);
    };

    loadData();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-6">
          <div className="h-20 w-20 border-4 rounded-full animate-spin mx-auto shadow-lg"
               style={{ borderColor: '#2C248E', borderTopColor: 'transparent' }} />
          <p className="text-2xl font-bold bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">
            Cargando vista del cubo...
          </p>
          <p className="text-sm text-gray-600">Preparando visualización</p>
        </div>
      </main>
    );
  }

  if (!submission) {
    return null;
  }

  return (
    <>
      <main className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
        {/* Patrón de cuadrícula sutil en el fondo */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>

        {/* Contenido principal */}
        <div className="relative mx-auto max-w-[1600px] px-4 py-3 md:px-6 md:py-4">
          {/* Sección del cubo 3D/2D - Versión personalizada para cubo-vista */}
          <CuboVistaSection
            ref={cube3DRef}
            answers={submission.answers}
            participantCode="VISTA-GENERAL"
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

export default function CuboVistaPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-6">
          <div className="h-20 w-20 border-4 rounded-full animate-spin mx-auto shadow-lg"
               style={{ borderColor: '#2C248E', borderTopColor: 'transparent' }} />
          <p className="text-2xl font-bold bg-gradient-to-r from-[#2C248E] to-[#8E235D] bg-clip-text text-transparent">
            Cargando vista del cubo...
          </p>
        </div>
      </main>
    }>
      <CuboVistaContent />
    </Suspense>
  );
}

