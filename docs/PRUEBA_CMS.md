# 🧪 PRUEBA DEL CMS - PASO A PASO

## ✅ CAMBIOS IMPLEMENTADOS

### 1. **Sistema de Contenido Reestructurado**
- ✅ `ContentMap` ahora guarda `{ content: string, is_html: boolean }` en lugar de solo `string`
- ✅ `getContent()` devuelve solo el texto (para compatibilidad)
- ✅ `getContentWithHtml()` devuelve `{ content, isHtml }` para renderizar HTML
- ✅ `RenderContent` componente que renderiza HTML o texto según el flag

### 2. **Renderizado de HTML en Footer**
- ✅ Footer ahora usa `RenderContent` con `getContentWithHtml()`
- ✅ Si `is_html = true` en la base de datos, se renderiza como HTML
- ✅ Si `is_html = false`, se renderiza como texto plano

---

## 🔍 DIAGNÓSTICO DEL PROBLEMA

### **Problema 1: CMS no actualiza la landing page**

**Posibles causas:**
1. El evento no se está disparando
2. El evento se dispara pero los componentes no lo escuchan
3. Los componentes escuchan pero no recargan el contenido
4. El contenido se recarga pero React no re-renderiza

**Cómo verificar:**

1. **Abre la consola del navegador (F12)**

2. **Ve a la landing page:** `http://localhost:3001`

3. **En otra pestaña, ve al CMS:** `http://localhost:3001/admin/cms`

4. **Edita un campo en el CMS:**
   - Busca "Título Principal" (01_Portada)
   - Click "Editar"
   - Cambia el texto a "PRUEBA 123"
   - Click "Guardar"

5. **Verifica los logs en la consola del CMS:**
   ```
   💾 Guardando cambio... {id: "...", field: "Título Principal", ...}
   ✅ Historial guardado
   📝 Actualizando contenido en Supabase...
   ✅ Contenido actualizado en Supabase: [...]
   ✅ Estado local actualizado
   🔄 Invalidando caché...
   ✅ Caché de contenido invalidado
   📢 Evento 'landing-content-updated' disparado
   ✅ Guardado completado exitosamente
   ```

6. **Verifica los logs en la consola de la Landing Page:**
   ```
   🔄 Evento recibido: Recargando contenido...
   🔄 Cargando contenido desde Supabase...
   ✅ Contenido cargado: XX campos
   ✅ Estado actualizado con nuevo contenido
   ```

7. **Si NO ves el log "🔄 Evento recibido":**
   - El problema está en el listener del evento
   - Verifica que `useLandingContent` esté montado
   - Verifica que el `useEffect` se ejecute

8. **Si ves el log pero el contenido no cambia:**
   - El problema está en el re-render de React
   - Verifica que `setContent()` se llame correctamente
   - Verifica que el componente use el estado actualizado

---

### **Problema 2: HTML se muestra como texto**

**Causa:** El campo tiene `is_html = true` pero se está usando `getContent()` en lugar de `getContentWithHtml()` + `RenderContent`

**Solución:**

**ANTES (muestra HTML como texto):**
```tsx
<p>{getContent(content, "07_Footer.Copyright.texto", "...")}</p>
```

**DESPUÉS (renderiza HTML correctamente):**
```tsx
<div>
  <RenderContent 
    {...getContentWithHtml(content, "07_Footer.Copyright.texto", "...")}
  />
</div>
```

**Nota:** Ya actualicé el footer para usar `RenderContent`, así que el HTML debería renderizarse correctamente.

---

## 🧪 PRUEBA MANUAL

### **Paso 1: Verificar que el HTML se renderiza**

1. Ve a Supabase
2. Busca el campo `07_Footer.Copyright.texto`
3. Verifica que `is_html = true`
4. Verifica que el contenido sea tu HTML

5. Ve a `http://localhost:3001`
6. Scroll hasta el footer
7. **Verifica:** El HTML debería renderizarse correctamente (con el enlace clickeable)

### **Paso 2: Verificar que el CMS actualiza**

1. Ve a `http://localhost:3001/admin/cms`
2. Busca "Título Principal" (01_Portada)
3. Click "Editar"
4. Cambia el texto a "PRUEBA DE ACTUALIZACIÓN EN TIEMPO REAL"
5. Click "Guardar"

6. **SIN RECARGAR**, ve a la pestaña de la landing page
7. **Verifica:** El título debería cambiar en 1-2 segundos

### **Paso 3: Verificar logs**

1. Abre la consola (F12) en ambas pestañas
2. Repite el Paso 2
3. **Verifica los logs** según la sección "Diagnóstico del Problema" arriba

---

## 🐛 SI ALGO NO FUNCIONA

### **El HTML sigue mostrándose como texto**

**Verifica:**
1. ¿El campo tiene `is_html = true` en Supabase?
2. ¿Estás usando `RenderContent` con `getContentWithHtml()`?
3. ¿El componente `RenderContent` está importado correctamente?

**Solución rápida:**
```tsx
// Importar
import { RenderContent, getContentWithHtml } from "@/components/landing-content-loader";

// Usar
<RenderContent 
  {...getContentWithHtml(content, "tu.clave.aqui", "fallback")}
/>
```

---

### **El CMS no actualiza la landing page**

**Verifica en la consola del CMS:**
- ¿Ves "✅ Guardado completado exitosamente"?
- ¿Ves "📢 Evento 'landing-content-updated' disparado"?

**Verifica en la consola de la Landing Page:**
- ¿Ves "🔄 Evento recibido: Recargando contenido..."?
- ¿Ves "✅ Contenido cargado: XX campos"?

**Si NO ves los logs:**
1. Recarga ambas pestañas
2. Repite la prueba
3. Copia TODOS los logs de la consola
4. Repórtalos para debugging

---

## 📊 ARCHIVOS MODIFICADOS

### **Modificados en esta iteración:**
1. ✅ `lib/hooks/use-landing-content.ts`
   - `ContentMap` ahora es `Record<string, ContentValue>`
   - `ContentValue = { content: string, is_html: boolean }`
   - `getContent()` devuelve solo el texto
   - `getContentWithHtml()` devuelve `{ content, isHtml }`

2. ✅ `app/page.tsx`
   - Importado `RenderContent` y `getContentWithHtml`
   - Footer actualizado para usar `RenderContent`

3. ✅ `components/landing-content-loader.tsx`
   - Ya tenía `RenderContent` implementado
   - Exporta `getContentWithHtml`

---

## 🎯 PRÓXIMOS PASOS

1. **Probar el HTML en el footer**
   - Verificar que el enlace sea clickeable
   - Verificar que no se muestre el código HTML

2. **Probar la actualización en tiempo real**
   - Editar un campo en el CMS
   - Verificar que cambie en la landing page sin recargar

3. **Reportar resultados**
   - Si funciona: ✅ Listo!
   - Si no funciona: Copiar logs de la consola

---

**Última actualización:** 30 de octubre de 2025

