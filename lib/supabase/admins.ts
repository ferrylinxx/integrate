import { supabase } from './client';
import { Admin, AdminInsert } from './types';

/**
 * Hash simple de contraseña (en producción usar bcrypt)
 * Por ahora usamos un hash básico para demostración
 */
function hashPassword(password: string): string {
  // En producción, usar bcrypt o similar
  // Por ahora, solo un hash simple con btoa
  return btoa(password);
}

/**
 * Verificar contraseña
 */
function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

/**
 * Crear un administrador
 */
export async function createAdmin(
  email: string,
  password: string,
  name: string
): Promise<{ data: Admin | null; error: Error | null }> {
  try {
    console.log('Creating admin with email:', email);

    // Verificar que el email no exista
    const { data: existing, error: checkError } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .maybeSingle(); // Usar maybeSingle en lugar de single para evitar error si no existe

    console.log('Existing admin check:', { existing, checkError });

    if (existing) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = hashPassword(password);

    // Crear admin
    const adminData: AdminInsert = {
      email,
      password_hash: passwordHash,
      name,
    };

    console.log('Inserting admin data:', { email, name });

    const { data, error } = await supabase
      .from('admins')
      .insert(adminData as any)
      .select()
      .single();

    console.log('Insert result:', { data, error });

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Error al insertar: ${error.message}`);
    }

    if (!data) {
      throw new Error('No se recibieron datos después de la inserción');
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error creating admin:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Login de administrador
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<{ data: Admin | null; error: Error | null }> {
  try {
    // Buscar admin por email
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      throw new Error('Email o contraseña incorrectos');
    }

    // Verificar contraseña
    if (!verifyPassword(password, (admin as any).password_hash)) {
      throw new Error('Email o contraseña incorrectos');
    }

    return { data: admin, error: null };
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Obtener todos los administradores
 */
export async function getAllAdmins(): Promise<{
  data: Admin[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, name, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching admins:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Verificar si existe al menos un administrador
 */
export async function hasAdmins(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .limit(1);

    return !error && data !== null && data.length > 0;
  } catch (error) {
    console.error('Error checking admins:', error);
    return false;
  }
}

/**
 * Eliminar un administrador
 */
export async function deleteAdmin(id: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase.from('admins').delete().eq('id', id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

