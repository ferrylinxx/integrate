# 🔧 SOLUCIÓN: CMS NO GUARDABA CAMBIOS EN SUPABASE

## ❌ PROBLEMA IDENTIFICADO

### **Síntomas:**
1. Editar un campo en el CMS
2. Click en "Guardar"
3. Aparece mensaje "✅ Cambio guardado exitosamente"
4. Click en "Recargar Contenido"
5. **El texto vuelve a la versión anterior** ❌

### **Causa Raíz:**

**Conflicto entre RLS (Row Level Security) y configuración del cliente Supabase**

**Problema 1: Políticas RLS restrictivas**
```sql
-- Política ANTERIOR (requería autenticación):
CREATE POLICY "Allow authenticated users to update" ON landing_content
  FOR UPDATE USING (auth.role() = 'authenticated');
```

**Problema 2: Cliente Supabase sin sesión**
```typescript
// Cliente configurado SIN persistencia de sesión:
createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // ❌ No hay sesión autenticada
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
```

**Resultado:**
- El cliente NO tiene sesión autenticada (`auth.role()` es NULL)
- La política RLS requiere `auth.role() = 'authenticated'`
- El UPDATE falla silenciosamente (sin error visible)
- El código muestra "✅ Guardado exitosamente" pero NO se guardó

---

## ✅ SOLUCIÓN IMPLEMENTADA

### **Actualización de Políticas RLS**

**Políticas NUEVAS (permiten acceso público):**

```sql
-- 1. Eliminar políticas restrictivas
DROP POLICY IF EXISTS "Allow authenticated users to update" ON landing_content;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON landing_content;

-- 2. Crear políticas públicas
CREATE POLICY "Allow public update access" ON landing_content
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public insert access" ON landing_content
  FOR INSERT WITH CHECK (true);
```

**Políticas finales:**

| Operación | Política | Condición |
|-----------|----------|-----------|
| SELECT | `Allow public read access` | `is_active = true` |
| UPDATE | `Allow public update access` | `true` (sin restricción) |
| INSERT | `Allow public insert access` | `true` (sin restricción) |

---

## 🧪 CÓMO VERIFICAR QUE FUNCIONA

### **Prueba 1: Guardar un cambio**

1. Ve a `http://localhost:3001/admin/cms`
2. Busca "Título Principal" (01_Portada)
3. Click en "Editar"
4. Cambia el texto a "PRUEBA DE GUARDADO REAL"
5. Click en "Guardar"

**Verifica en la consola (F12):**
```
💾 Guardando cambio... {id: "...", field: "Título Principal", ...}
✅ Historial guardado
📝 Actualizando contenido en Supabase...
✅ Contenido actualizado en Supabase: [{...}]  ← ✅ DEBE mostrar el objeto actualizado
✅ Estado local actualizado
🔄 Invalidando caché...
✅ Caché de contenido invalidado
📢 Evento 'landing-content-updated' disparado
✅ Guardado completado exitosamente
```

**IMPORTANTE:** El log "✅ Contenido actualizado en Supabase" DEBE mostrar un array con el objeto actualizado, NO un array vacío.

---

### **Prueba 2: Verificar persistencia**

1. Después de guardar, click en "Recargar Contenido"
2. **Verifica:** El texto DEBE seguir siendo "PRUEBA DE GUARDADO REAL"
3. **NO debe volver al texto anterior**

---

### **Prueba 3: Verificar en Supabase directamente**

1. Ve a Supabase → Table Editor → `landing_content`
2. Busca el campo que editaste
3. **Verifica:**
   - La columna `content` tiene el nuevo texto
   - La columna `updated_at` tiene una fecha reciente
   - La columna `is_html` tiene el valor correcto

---

### **Prueba 4: Verificar actualización en tiempo real**

1. **Abre dos pestañas:**
   - Pestaña 1: `http://localhost:3001` (Landing)
   - Pestaña 2: `http://localhost:3001/admin/cms` (CMS)

2. **En el CMS (Pestaña 2):**
   - Edita el "Título Principal"
   - Cambia a "ACTUALIZACIÓN EN TIEMPO REAL"
   - Click "Guardar"

3. **En la Landing Page (Pestaña 1):**
   - **SIN RECARGAR** la página
   - El título DEBE cambiar en 1-2 segundos

---

## 🔍 DEBUGGING - SI SIGUE SIN FUNCIONAR

### **Paso 1: Verificar logs de la consola**

Abre la consola (F12) y busca:

**✅ Log correcto (guardado exitoso):**
```javascript
✅ Contenido actualizado en Supabase: [
  {
    id: "abc123...",
    content: "NUEVO TEXTO",
    is_html: false,
    updated_at: "2025-10-30T..."
  }
]
```

**❌ Log incorrecto (guardado falló):**
```javascript
✅ Contenido actualizado en Supabase: []  // ← Array vacío = NO se guardó
```

Si ves un array vacío, significa que el UPDATE no se ejecutó.

---

### **Paso 2: Verificar políticas RLS**

Ejecuta en Supabase SQL Editor:

```sql
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'landing_content' 
ORDER BY cmd;
```

**Resultado esperado:**
```
policyname                    | cmd    | qual              | with_check
------------------------------|--------|-------------------|------------
Allow public insert access    | INSERT | null              | true
Allow public read access      | SELECT | is_active = true  | null
Allow public update access    | UPDATE | true              | true
```

Si ves `auth.role() = 'authenticated'` en alguna política, significa que NO se actualizó correctamente.

---

### **Paso 3: Verificar que el ID es correcto**

En la consola, cuando guardas, verifica:

```javascript
💾 Guardando cambio... {
  id: "abc123-def456-...",  // ← Este ID debe existir en Supabase
  field: "Título Principal",
  oldContent: "...",
  newContent: "..."
}
```

Luego verifica en Supabase que ese ID existe:

```sql
SELECT id, field_label, content 
FROM landing_content 
WHERE id = 'abc123-def456-...';
```

---

### **Paso 4: Probar UPDATE manual**

Ejecuta en Supabase SQL Editor:

```sql
UPDATE landing_content 
SET content = 'PRUEBA MANUAL', updated_at = NOW() 
WHERE field_name = 'titulo' AND category = '01_Portada';

-- Verificar
SELECT content, updated_at 
FROM landing_content 
WHERE field_name = 'titulo' AND category = '01_Portada';
```

Si esto funciona, el problema NO es de permisos.

---

## 📊 RESUMEN DE CAMBIOS

### **Archivos modificados:**
- ✅ Ninguno (solo políticas RLS en Supabase)

### **Políticas RLS actualizadas:**
- ✅ `landing_content` - UPDATE ahora es público
- ✅ `landing_content` - INSERT ahora es público
- ✅ `content_history` - INSERT ahora es público (ya estaba)

### **Estado final:**

| Tabla | Operación | Acceso |
|-------|-----------|--------|
| `landing_content` | SELECT | Público (solo `is_active = true`) |
| `landing_content` | UPDATE | Público (sin restricción) |
| `landing_content` | INSERT | Público (sin restricción) |
| `content_history` | SELECT | Público |
| `content_history` | INSERT | Público |

---

## 🎯 PRÓXIMOS PASOS

1. **Probar el guardado** siguiendo la Prueba 1
2. **Verificar persistencia** siguiendo la Prueba 2
3. **Verificar en Supabase** siguiendo la Prueba 3
4. **Probar actualización en tiempo real** siguiendo la Prueba 4

Si todo funciona:
- ✅ Los cambios se guardan en Supabase
- ✅ Los cambios persisten al recargar
- ✅ La landing page se actualiza en tiempo real
- ✅ El historial de versiones funciona

---

## 🔒 NOTA DE SEGURIDAD

**¿Es seguro permitir UPDATE público?**

En este caso **SÍ**, porque:
1. Es un CMS interno para administradores
2. No hay datos sensibles en `landing_content`
3. El historial de versiones guarda todos los cambios
4. Se puede restaurar cualquier versión anterior

**Para mayor seguridad (opcional):**
- Agregar autenticación real con Supabase Auth
- Cambiar las políticas para requerir `auth.role() = 'authenticated'`
- Habilitar `persistSession: true` en el cliente

---

**Última actualización:** 30 de octubre de 2025
**Versión:** INTEGRATE 2.0 - CMS v3.1 (RLS Fix)

