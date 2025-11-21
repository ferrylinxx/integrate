/**
 * Sistema de guardado automático (Draft Mode)
 * Permite guardar el progreso del test automáticamente en localStorage
 */

import { AnswerValue } from "./types";

export interface Draft {
  groupCode: string;
  answers: (AnswerValue | null)[];
  timestamp: number;
  status: "draft" | "submitted";
}

const DRAFT_KEY_PREFIX = "tnc-draft";
const DRAFT_EXPIRATION_DAYS = 7;

/**
 * Guarda un draft en localStorage
 */
export function saveDraft(groupCode: string, answers: (AnswerValue | null)[]): void {
  const draft: Draft = {
    groupCode,
    answers,
    timestamp: Date.now(),
    status: "draft",
  };

  const key = `${DRAFT_KEY_PREFIX}-${groupCode}`;
  localStorage.setItem(key, JSON.stringify(draft));
  
  // También guardar como "current" para fácil acceso
  localStorage.setItem(`${DRAFT_KEY_PREFIX}-current`, JSON.stringify(draft));
}

/**
 * Obtiene un draft por código de grupo
 */
export function getDraft(groupCode: string): Draft | null {
  const key = `${DRAFT_KEY_PREFIX}-${groupCode}`;
  const data = localStorage.getItem(key);
  
  if (!data) return null;
  
  try {
    const draft: Draft = JSON.parse(data);
    
    // Verificar si el draft ha expirado
    const daysSinceCreation = (Date.now() - draft.timestamp) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > DRAFT_EXPIRATION_DAYS) {
      deleteDraft(groupCode);
      return null;
    }
    
    return draft;
  } catch (error) {
    console.error("Error parsing draft:", error);
    return null;
  }
}

/**
 * Obtiene el draft actual (último guardado)
 */
export function getCurrentDraft(): Draft | null {
  const data = localStorage.getItem(`${DRAFT_KEY_PREFIX}-current`);
  
  if (!data) return null;
  
  try {
    const draft: Draft = JSON.parse(data);
    
    // Verificar si el draft ha expirado
    const daysSinceCreation = (Date.now() - draft.timestamp) / (1000 * 60 * 60 * 24);
    if (daysSinceCreation > DRAFT_EXPIRATION_DAYS) {
      deleteCurrentDraft();
      return null;
    }
    
    return draft;
  } catch (error) {
    console.error("Error parsing current draft:", error);
    return null;
  }
}

/**
 * Elimina un draft específico
 */
export function deleteDraft(groupCode: string): void {
  const key = `${DRAFT_KEY_PREFIX}-${groupCode}`;
  localStorage.removeItem(key);
  
  // Si es el draft actual, también eliminarlo
  const currentDraft = getCurrentDraft();
  if (currentDraft && currentDraft.groupCode === groupCode) {
    deleteCurrentDraft();
  }
}

/**
 * Elimina el draft actual
 */
export function deleteCurrentDraft(): void {
  localStorage.removeItem(`${DRAFT_KEY_PREFIX}-current`);
}

/**
 * Marca un draft como enviado
 */
export function markDraftAsSubmitted(groupCode: string): void {
  const draft = getDraft(groupCode);
  if (draft) {
    draft.status = "submitted";
    draft.timestamp = Date.now();
    const key = `${DRAFT_KEY_PREFIX}-${groupCode}`;
    localStorage.setItem(key, JSON.stringify(draft));
  }
  
  // Eliminar el draft actual ya que fue enviado
  deleteCurrentDraft();
}

/**
 * Limpia todos los drafts expirados
 */
export function cleanExpiredDrafts(): void {
  const keys = Object.keys(localStorage);
  const draftKeys = keys.filter(key => key.startsWith(DRAFT_KEY_PREFIX));
  
  draftKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const draft: Draft = JSON.parse(data);
        const daysSinceCreation = (Date.now() - draft.timestamp) / (1000 * 60 * 60 * 24);
        
        if (daysSinceCreation > DRAFT_EXPIRATION_DAYS) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // Si hay error al parsear, eliminar la entrada corrupta
        localStorage.removeItem(key);
      }
    }
  });
}

/**
 * Obtiene el tiempo transcurrido desde la última actualización
 */
export function getTimeSinceLastUpdate(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) {
    return "hace unos segundos";
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `hace ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours} hora${hours > 1 ? "s" : ""}`;
  }
  
  const days = Math.floor(hours / 24);
  return `hace ${days} día${days > 1 ? "s" : ""}`;
}

/**
 * Verifica si hay respuestas en el draft
 */
export function hasDraftAnswers(draft: Draft | null): boolean {
  if (!draft) return false;
  return draft.answers.some(answer => answer !== null);
}

