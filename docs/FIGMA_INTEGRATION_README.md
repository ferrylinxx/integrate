# 🎨 Integración con Figma - INTEGRATE 2.0

## ✅ IMPLEMENTACIÓN COMPLETADA

Se ha implementado exitosamente la sincronización automática entre Figma y Supabase para gestionar el contenido de la aplicación.

---

## 📦 Archivos Creados

### **1. Librería de Cliente Figma**
- **Archivo:** `lib/figma/client.ts`
- **Función:** Cliente para interactuar con la API de Figma
- **Características:**
  - Obtiene archivos de Figma
  - Extrae nodos de texto
  - Parsea convención de nombres
  - Detecta contenido HTML

### **2. Servicio de Sincronización**
- **Archivo:** `lib/figma/sync-service.ts`
- **Función:** Sincroniza contenido de Figma a Supabase
- **Características:**
  - Crea nuevos registros
  - Actualiza registros existentes
  - Manejo de errores detallado
  - Logs de progreso

### **3. API Route**
- **Archivo:** `app/api/figma/sync/route.ts`
- **Endpoint:** `POST /api/figma/sync`
- **Función:** Endpoint HTTP para ejecutar sincronización

### **4. Página de Administración**
- **Archivo:** `app/admin/figma-sync/page.tsx`
- **URL:** `http://localhost:3000/admin/figma-sync`
- **Función:** Interfaz visual para sincronizar contenido

### **5. Documentación**
- **Archivo:** `docs/FIGMA_SYNC_GUIDE.md`
- **Contenido:** Guía completa de uso y convenciones

---

## 🚀 Cómo Usar

### **Paso 1: Configurar Figma**

1. **Abre tu archivo de Figma**
2. **Organiza los textos** siguiendo la convención de nombres:
   ```
   category/section_name/field_name
   ```

**Ejemplo:**
```
01_Portada/Hero Principal/titulo
01_Portada/Hero Principal/subtitulo
02_Caracteristicas/Beneficios/descripcion [HTML]
```

### **Paso 2: Obtener File Key**

1. Abre tu archivo en Figma
2. Copia la URL del navegador
3. Extrae el File Key:
   ```
   https://www.figma.com/file/ABC123DEF456/Nombre
                                ↑
                           FILE KEY
   ```

### **Paso 3: Sincronizar**

**Opción A: Interfaz Web (Recomendada)**

1. Navega a: `http://localhost:3000/admin/figma-sync`
2. Pega el **File Key**
3. Haz clic en **"Sincronizar Contenido"**
4. Espera el resultado

**Opción B: API Directa**

```bash
curl -X POST http://localhost:3000/api/figma/sync \
  -H "Content-Type: application/json" \
  -d '{
    "fileKey": "TU_FILE_KEY_AQUI",
    "tableName": "landing_content"
  }'
```

### **Paso 4: Verificar**

1. Ve al CMS: `http://localhost:3000/admin/cms`
2. Verifica que el contenido se haya sincronizado
3. Recarga la landing page para ver los cambios

---

## 📋 Convención de Nombres

### **Estructura Básica**
```
category/section_name/field_name
```

### **Para Contenido HTML**
```
category/section_name/field_name [HTML]
```

### **Ejemplos Válidos**

| Nombre en Figma | Resultado |
|----------------|-----------|
| `01_Portada/Hero Principal/titulo` | ✅ Texto plano |
| `07_Footer/Copyright/texto [HTML]` | ✅ HTML |
| `02_Caracteristicas/Beneficios/lista [HTML]` | ✅ HTML |

### **Ejemplos Inválidos**

| Nombre en Figma | Problema |
|----------------|----------|
| `Titulo Principal` | ❌ Falta estructura |
| `Portada-Hero-Titulo` | ❌ Usa guiones |
| `01_Portada/titulo` | ❌ Falta section_name |

---

## 🔧 Configuración

### **Variables de Entorno (.env.local)**

```env
# Token de Figma (YA CONFIGURADO)
FIGMA_ACCESS_TOKEN=figd_0CYtmCTQigDonCeIEL5vEBhBwEp0lrXQ1Ah8_Ptj

# File Key de tu archivo (AÑADIR SI QUIERES)
FIGMA_FILE_KEY=
```

---

## 📊 Resultado de Sincronización

Después de sincronizar, verás:

```
📊 Resumen de sincronización:
   ✅ Procesados: 45
   ➕ Creados: 12
   ✏️  Actualizados: 33
   ❌ Errores: 0
```

**Interpretación:**
- **Procesados**: Nodos de texto encontrados en Figma
- **Creados**: Nuevos registros en Supabase
- **Actualizados**: Registros existentes actualizados
- **Errores**: Elementos que fallaron

---

## 🎯 Flujo de Trabajo Recomendado

1. **Diseña en Figma** con la convención de nombres
2. **Sincroniza** usando `/admin/figma-sync`
3. **Verifica** en el CMS (`/admin/cms`)
4. **Ajusta** si es necesario en Figma
5. **Re-sincroniza** para aplicar cambios

---

## 🐛 Troubleshooting

### **Error: "Figma API error: 403 Forbidden"**

**Solución:**
- Verifica que el token sea válido
- Asegúrate de tener acceso al archivo
- Comparte el archivo si es privado

### **Contenido no se sincroniza**

**Verifica:**
1. ✅ Nombres siguen la convención
2. ✅ Nodos son de tipo TEXT
3. ✅ Nodos tienen contenido
4. ✅ File Key es correcto

---

## 📚 Recursos

- **Guía Completa:** `docs/FIGMA_SYNC_GUIDE.md`
- **Documentación CMS:** `CMS_README.md`
- **API de Figma:** https://www.figma.com/developers/api

---

## ✨ Próximos Pasos

1. ✅ **Organiza tu archivo de Figma**
2. ✅ **Ejecuta la primera sincronización**
3. ✅ **Verifica el contenido en el CMS**
4. ✅ **Actualiza diseños cuando necesites**
5. ✅ **Re-sincroniza para aplicar cambios**

---

**¡La integración con Figma está lista para usar!** 🎉

