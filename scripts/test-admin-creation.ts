/**
 * Script de prueba para crear un administrador directamente
 * Ejecutar en la consola del navegador o en un endpoint de prueba
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irnaqjodmnwxwaepoybm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFxam9kbW53eHdhZXBveWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTc3ODYsImV4cCI6MjA3NzE3Mzc4Nn0.QdKC7mKBGHeppWRxYnIrX3vVIR0VQv2lEffGecRHKH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminCreation() {
  console.log('Testing admin creation...');

  const testAdmin = {
    email: 'test@example.com',
    password_hash: btoa('password123'), // Simple hash para prueba
    name: 'Test Admin',
  };

  console.log('Inserting admin:', testAdmin);

  const { data, error } = await supabase
    .from('admins')
    .insert(testAdmin)
    .select()
    .single();

  console.log('Result:', { data, error });

  if (error) {
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  return { data, error };
}

// Ejecutar la prueba
testAdminCreation();

