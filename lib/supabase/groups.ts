import { supabase } from './client';
import { Group, GroupInsert } from './types';

/**
 * Genera un código único para un grupo
 * Formato: 4 letras mayúsculas + 4 números
 * Ejemplo: ABCD1234
 */
export function generateGroupCode(): string {
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
 * Crear un nuevo grupo
 */
export async function createGroup(name: string): Promise<{ data: Group | null; error: Error | null }> {
  try {
    // Generar código único
    let code = generateGroupCode();
    let attempts = 0;
    const maxAttempts = 10;
    
    // Verificar que el código no exista (máximo 10 intentos)
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('groups')
        .select('code')
        .eq('code', code)
        .single();
      
      if (!existing) break;
      
      code = generateGroupCode();
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('No se pudo generar un código único. Intenta de nuevo.');
    }
    
    // Crear el grupo
    const groupData: GroupInsert = {
      code,
      name,
    };
    
    const { data, error } = await supabase
      .from('groups')
      .insert(groupData as any)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating group:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Obtener todos los grupos
 */
export async function getAllGroups(): Promise<{ data: Group[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching groups:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Obtener un grupo por código
 */
export async function getGroupByCode(code: string): Promise<{ data: Group | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('code', code)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching group:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Obtener un grupo por ID
 */
export async function getGroupById(id: string): Promise<{ data: Group | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching group by ID:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}

/**
 * Verificar si un código de grupo existe
 */
export async function groupCodeExists(code: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('code')
      .eq('code', code)
      .single();
    
    return !error && data !== null;
  } catch (error) {
    console.error('Error checking group code:', error);
    return false;
  }
}

/**
 * Eliminar un grupo por ID
 * Esto también eliminará todas las submissions asociadas (CASCADE)
 */
export async function deleteGroup(id: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting group:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

/**
 * Obtener estadísticas de un grupo
 */
export async function getGroupStats(groupId: string): Promise<{
  data: {
    totalSubmissions: number;
    averageScore: number;
    completionDate: string | null;
  } | null;
  error: Error | null;
}> {
  try {
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('answers, timestamp')
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    if (!submissions || submissions.length === 0) {
      return {
        data: {
          totalSubmissions: 0,
          averageScore: 0,
          completionDate: null,
        },
        error: null,
      };
    }
    
    // Calcular promedio general
    const totalAnswers = submissions.reduce((sum, sub) => {
      return sum + (sub as any).answers.reduce((a: number, b: number) => a + b, 0);
    }, 0);

    const totalQuestions = submissions.length * 24;
    const averageScore = totalAnswers / totalQuestions;

    // Fecha de última submission
    const latestTimestamp = submissions.reduce((latest, sub) => {
      return new Date((sub as any).timestamp) > new Date(latest) ? (sub as any).timestamp : latest;
    }, (submissions[0] as any).timestamp);
    
    return {
      data: {
        totalSubmissions: submissions.length,
        averageScore: Number(averageScore.toFixed(2)),
        completionDate: latestTimestamp,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching group stats:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

