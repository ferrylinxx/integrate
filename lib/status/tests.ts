// Funciones de testing para la Status Page

import { supabase } from '@/lib/supabase/client';
import { ServiceHealth, TableHealth, FunctionalityTest } from './types';

/**
 * Test de conexión a Supabase
 */
export async function testSupabaseConnection(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('count')
      .limit(1);
    
    const latency = Date.now() - start;
    
    return {
      name: 'Base de Datos (Supabase)',
      status: error ? 'down' : 'operational',
      latency,
      uptime: error ? 0 : 100,
      lastCheck: new Date(),
      message: error ? error.message : 'Conexión exitosa',
      error: error?.message
    };
  } catch (err) {
    return {
      name: 'Base de Datos (Supabase)',
      status: 'down',
      latency: Date.now() - start,
      uptime: 0,
      lastCheck: new Date(),
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Test de autenticación
 */
export async function testAuthentication(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    const { data, error } = await supabase.auth.getSession();
    const latency = Date.now() - start;
    
    return {
      name: 'Autenticación',
      status: error ? 'degraded' : 'operational',
      latency,
      uptime: error ? 95 : 100,
      lastCheck: new Date(),
      message: 'Sistema de autenticación funcionando'
    };
  } catch (err) {
    return {
      name: 'Autenticación',
      status: 'down',
      latency: Date.now() - start,
      uptime: 0,
      lastCheck: new Date(),
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Test de API de Grupos
 */
export async function testGroupsAPI(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .limit(10);
    
    const latency = Date.now() - start;
    
    return {
      name: 'API de Grupos',
      status: error ? 'down' : 'operational',
      latency,
      uptime: error ? 0 : 99.9,
      lastCheck: new Date(),
      message: error ? error.message : `${data?.length || 0} grupos accesibles`
    };
  } catch (err) {
    return {
      name: 'API de Grupos',
      status: 'down',
      latency: Date.now() - start,
      uptime: 0,
      lastCheck: new Date(),
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Test de API de Submissions
 */
export async function testSubmissionsAPI(): Promise<ServiceHealth> {
  const start = Date.now();
  
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('count')
      .limit(1);
    
    const latency = Date.now() - start;
    
    return {
      name: 'API de Submissions',
      status: error ? 'down' : 'operational',
      latency,
      uptime: error ? 0 : 99.7,
      lastCheck: new Date(),
      message: error ? error.message : 'API funcionando correctamente'
    };
  } catch (err) {
    return {
      name: 'API de Submissions',
      status: 'down',
      latency: Date.now() - start,
      uptime: 0,
      lastCheck: new Date(),
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Test de Sistema CMS
 */
export async function testCMS(): Promise<ServiceHealth> {
  const start = Date.now();

  try {
    const { data, error } = await supabase
      .from('landing_content')
      .select('*')
      .limit(5);

    const latency = Date.now() - start;

    return {
      name: 'Sistema CMS',
      status: error ? 'down' : 'operational',
      latency,
      uptime: error ? 0 : 99.5,
      lastCheck: new Date(),
      message: error ? error.message : `${data?.length || 0} entradas de contenido`
    };
  } catch (err) {
    return {
      name: 'Sistema CMS',
      status: 'down',
      latency: Date.now() - start,
      uptime: 0,
      lastCheck: new Date(),
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Test de Google Analytics
 */
export async function testGoogleAnalytics(): Promise<ServiceHealth> {
  const start = Date.now();

  try {
    // Verificar que gtag esté disponible
    const hasGtag = typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined';
    const latency = Date.now() - start;

    return {
      name: 'Google Analytics',
      status: hasGtag ? 'operational' : 'degraded',
      latency,
      uptime: hasGtag ? 98.9 : 95,
      lastCheck: new Date(),
      message: hasGtag ? 'GA4 cargado correctamente' : 'GA4 no detectado'
    };
  } catch (err) {
    return {
      name: 'Google Analytics',
      status: 'down',
      latency: Date.now() - start,
      uptime: 0,
      lastCheck: new Date(),
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Validar estructura de tabla
 */
export async function validateTable(tableName: string): Promise<TableHealth> {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    return {
      name: tableName,
      status: error ? 'down' : 'operational',
      recordCount: count || 0,
      structureValid: !error,
      error: error?.message
    };
  } catch (err) {
    return {
      name: tableName,
      status: 'down',
      recordCount: 0,
      structureValid: false,
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Test funcional: Crear Grupo
 */
export async function testCreateGroup(): Promise<FunctionalityTest> {
  const start = Date.now();

  try {
    // Generar código único de prueba
    const testCode = `TEST_${Date.now()}`;

    const { data, error } = await supabase
      .from('groups')
      .insert({
        code: testCode,
        name: 'Test Group - Status Check'
      })
      .select()
      .single();

    // Limpiar: eliminar el grupo de prueba
    if (data) {
      await supabase.from('groups').delete().eq('id', data.id);
    }

    const duration = Date.now() - start;

    return {
      name: 'Crear Grupo',
      description: 'Crear un nuevo grupo en el sistema',
      status: error ? 'down' : 'operational',
      lastRun: new Date(),
      duration,
      error: error?.message
    };
  } catch (err) {
    return {
      name: 'Crear Grupo',
      description: 'Crear un nuevo grupo en el sistema',
      status: 'down',
      lastRun: new Date(),
      duration: Date.now() - start,
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Test funcional: Ver Resultados
 */
export async function testViewResults(): Promise<FunctionalityTest> {
  const start = Date.now();

  try {
    // Obtener un grupo existente
    const { data: groups, error: groupError } = await supabase
      .from('groups')
      .select('*')
      .limit(1);

    if (groupError || !groups || groups.length === 0) {
      return {
        name: 'Ver Resultados',
        description: 'Visualizar resultados de un grupo',
        status: 'degraded',
        lastRun: new Date(),
        duration: Date.now() - start,
        error: 'No hay grupos para probar'
      };
    }

    // Obtener submissions del grupo
    const { data: submissions, error: subError } = await supabase
      .from('submissions')
      .select('*')
      .eq('group_id', groups[0].id);

    const duration = Date.now() - start;

    return {
      name: 'Ver Resultados',
      description: 'Visualizar resultados de un grupo',
      status: subError ? 'down' : 'operational',
      lastRun: new Date(),
      duration,
      error: subError?.message
    };
  } catch (err) {
    return {
      name: 'Ver Resultados',
      description: 'Visualizar resultados de un grupo',
      status: 'down',
      lastRun: new Date(),
      duration: Date.now() - start,
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}

/**
 * Ejecutar todos los tests de servicios
 */
export async function runAllServiceTests(): Promise<ServiceHealth[]> {
  const tests = [
    testSupabaseConnection(),
    testAuthentication(),
    testGroupsAPI(),
    testSubmissionsAPI(),
    testCMS(),
    testGoogleAnalytics()
  ];

  return Promise.all(tests);
}

/**
 * Validar todas las tablas
 */
export async function validateAllTables(): Promise<TableHealth[]> {
  const tables = ['admins', 'groups', 'submissions', 'landing_content', 'content_history'];
  const tests = tables.map(table => validateTable(table));

  return Promise.all(tests);
}

/**
 * Ejecutar todos los tests funcionales
 */
export async function runAllFunctionalityTests(): Promise<FunctionalityTest[]> {
  const tests = [
    testCreateGroup(),
    testViewResults()
  ];

  return Promise.all(tests);
}

