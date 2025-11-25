"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnswerValue } from "@/lib/types";
import { AREAS, TOTAL_QUESTIONS } from "@/lib/constants";
import { saveSubmission } from "@/lib/storage";
import {
  saveDraft,
  getDraft,
  deleteDraft,
  markDraftAsSubmitted,
  cleanExpiredDrafts,
  hasDraftAnswers,
} from "@/lib/draft-storage";
import { createSubmission, groupCodeExists } from "@/lib/supabase";
import { AreaSection } from "@/components/area-section";
import { DraftRecoveryModal } from "@/components/draft-recovery-modal";
import { TestPageHeader } from "@/components/test-page-header";
import { EnhancedProgressBar } from "@/components/enhanced-progress-bar";
import { ConfirmModal } from "@/components/confirm-modal";
import { VersionBadge } from "@/components/version-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestContentLoader } from "@/components/test-content-loader";

export default function TestPage() {
  const router = useRouter();
  const [groupCode, setGroupCode] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(AnswerValue | null)[]>(
    Array(TOTAL_QUESTIONS).fill(null)
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Estados para draft mode
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<ReturnType<typeof getDraft>>(null);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estados para Supabase
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [groupCodeValid, setGroupCodeValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Limpiar drafts expirados al cargar
    cleanExpiredDrafts();

    // Verificar que hay un código de grupo en sessionStorage
    const code = sessionStorage.getItem("currentGroupCode");
    if (!code) {
      router.push("/");
      return;
    }
    setGroupCode(code);

    // Validar que el código de grupo existe en Supabase
    const validateGroupCode = async () => {
      const exists = await groupCodeExists(code);
      setGroupCodeValid(exists);

      if (!exists) {
        alert(`El código de grupo "${code}" no existe. Por favor, verifica el código e intenta de nuevo.`);
        sessionStorage.removeItem("currentGroupCode");
        router.push("/");
        return;
      }
    };

    validateGroupCode();

    // Verificar si hay un draft guardado
    const draft = getDraft(code);
    if (draft && hasDraftAnswers(draft) && draft.status === "draft") {
      setPendingDraft(draft);
      setShowDraftModal(true);
    }
  }, [router]);

  // Auto-save cuando cambian las respuestas
  useEffect(() => {
    if (!groupCode) return;

    // No guardar si no hay respuestas
    const hasAnswers = answers.some(a => a !== null);
    if (!hasAnswers) return;

    // Guardar draft automáticamente
    setIsSaving(true);
    const timer = setTimeout(() => {
      saveDraft(groupCode, answers);
      setLastSaved(Date.now());
      setIsSaving(false);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [answers, groupCode]);

  const handleAnswerChange = useCallback((questionIndex: number, value: AnswerValue) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  }, []);

  const answeredCount = answers.filter((a) => a !== null).length;
  const progressPercentage = (answeredCount / TOTAL_QUESTIONS) * 100;

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (!groupCode) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Convertir nulls a 1 (valor por defecto) para preguntas no respondidas
      const finalAnswers = answers.map((a) => a ?? 1) as AnswerValue[];

      // Obtener el nombre de usuario de sessionStorage
      const userName = sessionStorage.getItem("currentUserName") || undefined;

      // Guardar en Supabase
      const { data, error } = await createSubmission(groupCode, finalAnswers, userName);

      if (error || !data) {
        throw new Error(error?.message || "Error al guardar las respuestas");
      }

      // También guardar en localStorage como backup
      saveSubmission(groupCode, finalAnswers);

      // Marcar draft como enviado y eliminarlo
      markDraftAsSubmitted(groupCode);

      // Limpiar sessionStorage
      sessionStorage.removeItem("currentGroupCode");
      sessionStorage.removeItem("currentUserName");

      // Redirigir a la página de gracias con el código del participante
      router.push(`/gracias/${data.participant_code}`);
    } catch (error) {
      console.error("Error al guardar:", error);
      setSubmitError(error instanceof Error ? error.message : "Error desconocido");
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  // Manejar recuperación de draft
  const handleRecoverDraft = () => {
    if (pendingDraft) {
      setAnswers(pendingDraft.answers);
      setLastSaved(pendingDraft.timestamp);
    }
    setShowDraftModal(false);
  };

  // Manejar descarte de draft
  const handleDiscardDraft = () => {
    if (groupCode) {
      deleteDraft(groupCode);
    }
    setShowDraftModal(false);
  };

  // Manejar descarte manual de draft
  const handleManualDiscardDraft = () => {
    if (groupCode && window.confirm("¿Estás seguro de que deseas descartar el borrador? Se perderá todo el progreso guardado.")) {
      deleteDraft(groupCode);
      setAnswers(Array(TOTAL_QUESTIONS).fill(null));
      setLastSaved(null);
    }
  };

  if (!groupCode) {
    return null; // Mientras redirige
  }

  return (
    <TestContentLoader>
      {({ content }) => (
        <>
          {/* Version Badge - Top Right */}
          <VersionBadge position="top-right" size="sm" />
          <main
            className="min-h-screen pb-20 md:pb-12"
            style={{
              background: 'linear-gradient(135deg, rgba(44, 36, 142, 0.03) 0%, rgba(65, 39, 97, 0.05) 20%, rgba(142, 35, 93, 0.03) 40%, rgba(230, 91, 62, 0.02) 60%, rgba(240, 135, 38, 0.03) 80%, rgba(217, 29, 92, 0.02) 100%)'
            }}
          >
            <div className="max-w-6xl mx-auto space-y-3 md:space-y-6">
              {/* Header simplificado */}
              <TestPageHeader
                groupCode={groupCode}
                lastSaved={lastSaved}
                isSaving={isSaving}
                onDiscardDraft={handleManualDiscardDraft}
                onGoHome={() => router.push("/")}
                content={content}
              />

          {/* Barra de progreso mejorada con colores INTEGRATE */}
          <div className="px-2 md:px-0">
            <Card
              className="border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              style={{
                borderImage: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #E65B3E 100%) 1',
                borderImageSlice: 1
              }}
            >
              <CardContent className="pt-4 pb-4 md:pt-8 md:pb-6 px-3 md:px-6">
                <EnhancedProgressBar answers={answers} />
              </CardContent>
            </Card>
          </div>

          {/* Vista de Lista (única opción) */}
          <div className="px-2 md:px-0">
            <div className="space-y-3 md:space-y-5">
              {AREAS.map((area) => (
                <AreaSection
                  key={area.areaNumber}
                  area={area}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              ))}
            </div>
          </div>

          {/* Botón de guardar - Sticky en móvil */}
          <div className="px-2 md:px-0">
            <Card
              className="border-2 shadow-xl sticky bottom-2 md:static"
              style={{
                borderImage: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #D91D5C 100%) 1',
                borderImageSlice: 1
              }}
            >
              <CardContent className="pt-3 pb-3 md:pt-6 md:pb-6 px-3 md:px-6 space-y-2 md:space-y-4">
                <Button
                  onClick={handleSaveClick}
                  disabled={isSubmitting || groupCodeValid === false}
                  className="w-full text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #2C248E 0%, #412761 20%, #8E235D 50%, #E65B3E 80%, #F08726 100%)',
                    minHeight: '48px',
                    fontSize: '15px'
                  }}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-sm md:text-base">Guardando...</span>
                    </>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-sm md:text-base">Guardar Respuestas</span>
                      {answeredCount === TOTAL_QUESTIONS && <span>✓</span>}
                    </span>
                  )}
                </Button>

                {/* Contador de progreso */}
                <div className="flex items-center justify-between">
                  <p className="text-xs md:text-base text-gray-700 font-medium">
                    {answeredCount < TOTAL_QUESTIONS ? (
                      <>
                        <span className="text-orange-600 font-bold">{answeredCount}</span>
                        <span className="text-gray-500 hidden sm:inline"> de </span>
                        <span className="text-gray-500 sm:hidden">/</span>
                        <span className="font-bold">{TOTAL_QUESTIONS}</span>
                        <span className="text-gray-500 hidden sm:inline"> preguntas</span>
                      </>
                    ) : (
                      <span className="text-green-600 font-bold text-xs md:text-base">
                        ✓ <span className="hidden sm:inline">Todas completadas</span>
                        <span className="sm:hidden">Completo</span>
                      </span>
                    )}
                  </p>
                  <span
                    className="text-base md:text-xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #2C248E 0%, #8E235D 50%, #E65B3E 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {Math.round(progressPercentage)}%
                  </span>
                </div>

                {/* Mensaje de error */}
                {submitError && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-2 md:p-4 animate-shake">
                    <p className="text-xs md:text-sm text-red-700 text-center font-medium">
                      ⚠️ {submitError}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>



              {/* Modal de recuperación de draft */}
              <DraftRecoveryModal
                open={showDraftModal}
                draft={pendingDraft}
                onRecover={handleRecoverDraft}
                onDiscard={handleDiscardDraft}
                onCancel={() => setShowDraftModal(false)}
              />

              {/* Modal de confirmación */}
              <ConfirmModal
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
                onConfirm={handleConfirmSave}
                answeredCount={answeredCount}
                totalCount={TOTAL_QUESTIONS}
              />
            </div>
          </main>
        </>
      )}
    </TestContentLoader>
  );
}

