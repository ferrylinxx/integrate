import { supabase } from './client';
import { Submission, SubmissionInsert } from './types';
import { AnswerValue } from '../types';

/**
 * Genera un código único para un participante
 * Formato: 4 letras mayúsculas + 4 números
 * Ejemplo: XYZW5678
 */
export function generateParticipantCode(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let code = '';
  
  // 4 letras
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // 4 números
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
}

/**
 * Crear una nueva submission
 */
export async function createSubmission(
  groupCode: string,
  answers: AnswerValue[],
  userName?: string
): Promise<{ data: Submission | null; error: Error | null }> {
  try {
    // Validar que el grupo existe
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id')
      .eq('code', groupCode)
      .single();

    if (groupError || !group) {
      throw new Error(`Grupo con código ${groupCode} no encontrado`);
    }

    // Generar código único para el participante
    let participantCode = generateParticipantCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Verificar que el código no exista (máximo 10 intentos)
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('submissions')
        .select('participant_code')
        .eq('participant_code', participantCode)
        .single();

      if (!existing) break;

      participantCode = generateParticipantCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('No se pudo generar un código único. Intenta de nuevo.');
    }

    // Crear la submission
    const submissionData: SubmissionInsert = {
      group_id: (group as any).id,
      participant_code: participantCode,
      answers: answers as number[],
      user_name: userName || null,
    };
    
    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData as any)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating submission:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Obtener una submission por código de participante
 */
export async function getSubmissionByCode(
  participantCode: string
): Promise<{ data: Submission | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('participant_code', participantCode)
      .single();

    // Si el error es "PGRST116" significa que no se encontró el registro (no es un error real)
    if (error) {
      if (error.code === 'PGRST116') {
        return { data: null, error: null };
      }
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching submission:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Obtener todas las submissions de un grupo
 */
export async function getSubmissionsByGroup(
  groupId: string
): Promise<{ data: Submission[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('group_id', groupId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Obtener todas las submissions de un grupo por código de grupo
 */
export async function getSubmissionsByGroupCode(
  groupCode: string
): Promise<{ data: Submission[] | null; error: Error | null }> {
  try {
    // Primero obtener el ID del grupo
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id')
      .eq('code', groupCode)
      .single();
    
    if (groupError || !group) {
      throw new Error(`Grupo con código ${groupCode} no encontrado`);
    }
    
    // Luego obtener las submissions
    return await getSubmissionsByGroup((group as any).id);
  } catch (error) {
    console.error('Error fetching submissions by group code:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Eliminar una submission por código de participante
 */
export async function deleteSubmission(
  participantCode: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('participant_code', participantCode);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Eliminar todas las submissions de un grupo
 */
export async function deleteAllSubmissionsFromGroup(
  groupId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting submissions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Calcular promedios por pregunta de un grupo
 * Retorna un array de 24 números con el promedio de cada pregunta
 */
export async function getGroupAverages(
  groupId: string
): Promise<{ data: number[] | null; error: Error | null }> {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('answers')
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    if (!submissions || submissions.length === 0) {
      return { data: null, error: new Error('No hay submissions para este grupo') };
    }
    
    // Calcular promedio por pregunta
    const averages: number[] = [];
    
    for (let i = 0; i < 24; i++) {
      const sum = submissions.reduce((total, sub) => total + (sub as any).answers[i], 0);
      const average = sum / submissions.length;
      averages.push(Number(average.toFixed(2)));
    }
    
    return { data: averages, error: null };
  } catch (error) {
    console.error('Error calculating group averages:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Calcular suma por área de un grupo (para cubo resumen)
 * Retorna un array de 6 números con la suma de cada área
 */
export async function getGroupAreaSums(
  groupId: string
): Promise<{ data: number[] | null; error: Error | null }> {
  try {
    const { data: averages, error } = await getGroupAverages(groupId);
    
    if (error || !averages) {
      return { data: null, error };
    }
    
    // Sumar las 4 preguntas de cada área
    const areaSums: number[] = [];
    
    for (let area = 0; area < 6; area++) {
      const startIndex = area * 4;
      const sum = averages.slice(startIndex, startIndex + 4).reduce((a, b) => a + b, 0);
      areaSums.push(Number(sum.toFixed(2)));
    }
    
    return { data: areaSums, error: null };
  } catch (error) {
    console.error('Error calculating group area sums:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

