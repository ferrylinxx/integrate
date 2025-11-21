# 🎨 Guía de Sincronización con Figma

## 📋 Índice

1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Estructura de Figma](#estructura-de-figma)
4. [Sincronización](#sincronización)
5. [Convenciones de Nombres](#convenciones-de-nombres)
6. [Ejemplos](#ejemplos)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Introducción

Este sistema permite sincronizar automáticamente el contenido de tus diseños de Figma con la base de datos de Supabase, eliminando la necesidad de copiar y pegar manualmente el contenido.

### **Ventajas:**
- ✅ Sincronización automática desde Figma
- ✅ Actualización masiva de contenido
- ✅ Mantiene el diseño como fuente de verdad
- ✅ Reduce errores de transcripción
- ✅ Acelera el proceso de actualización

---

## ⚙️ Configuración Inicial

### **1. Token de Figma**

Ya está configurado en `.env.local`:
```env
FIGMA_ACCESS_TOKEN=figd_0CYtmCTQigDonCeIEL5vEBhBwEp0lrXQ1Ah8_Ptj
```

### **2. Obtener el File Key**

El File Key se encuentra en la URL de tu archivo de Figma:

```
https://www.figma.com/file/ABC123DEF456/Nombre-del-Archivo
                              ↑
                         FILE KEY
```

**Ejemplo:**
- URL: `https://www.figma.com/file/xyz789abc123/INTEGRATE-Landing`
- File Key: `xyz789abc123`

---

## 🏗️ Estructura de Figma

### **Convención de Nombres de Nodos de Texto**

Para que la sincronización funcione, los nodos de texto en Figma deben seguir esta convención:

```
category/section_name/field_name
```

**Componentes:**
- `category`: Categoría del contenido (ej: `01_Portada`, `02_Caracteristicas`)
- `section_name`: Nombre de la sección (ej: `Hero Principal`, `Beneficios`)
- `field_name`: Nombre del campo (ej: `titulo`, `subtitulo`, `descripcion`)

### **Para contenido HTML:**

Añade `[HTML]` al final del nombre:

```
category/section_name/field_name [HTML]
```

---

## 🔄 Sincronización

### **Opción 1: Interfaz Web (Recomendada)**

1. Navega a: `http://localhost:3000/admin/figma-sync`
2. Ingresa el **File Key** de tu archivo de Figma
3. Selecciona la tabla de destino (por defecto: `landing_content`)
4. Haz clic en **"Sincronizar Contenido"**
5. Espera a que termine el proceso
6. Revisa el resumen de resultados

### **Opción 2: API Directa**

```bash
curl -X POST http://localhost:3000/api/figma/sync \
  -H "Content-Type: application/json" \
  -d '{
    "fileKey": "xyz789abc123",
    "tableName": "landing_content"
  }'
```

---

## 📝 Convenciones de Nombres

### **Ejemplos Correctos:**

| Nombre en Figma | Resultado en Supabase |
|----------------|----------------------|
| `01_Portada/Hero Principal/titulo` | category: `01_Portada`<br>section_name: `Hero Principal`<br>field_name: `titulo` |
| `02_Caracteristicas/Beneficios/descripcion [HTML]` | category: `02_Caracteristicas`<br>section_name: `Beneficios`<br>field_name: `descripcion`<br>is_html: `true` |
| `07_Footer/Copyright/texto [HTML]` | category: `07_Footer`<br>section_name: `Copyright`<br>field_name: `texto`<br>is_html: `true` |

### **Ejemplos Incorrectos:**

❌ `Titulo Principal` - Falta estructura de categorías
❌ `Portada-Hero-Titulo` - Usa guiones en lugar de barras
❌ `01_Portada/titulo` - Falta el section_name

---

## 💡 Ejemplos Prácticos

### **Ejemplo 1: Landing Page - Hero Section**

**En Figma:**
```
Frame: "01_Portada"
  └─ Text: "01_Portada/Hero Principal/titulo"
       Contenido: "Descubre las Áreas Sensibles de tu Organización"
  
  └─ Text: "01_Portada/Hero Principal/subtitulo"
       Contenido: "Diagnóstico organizativo basado en el modelo INTEGRATE 2.0"
  
  └─ Text: "01_Portada/Hero Principal/boton_principal"
       Contenido: "Comenzar Test"
```

**Resultado en Supabase:**
| category | section_name | field_name | content |
|----------|-------------|-----------|---------|
| 01_Portada | Hero Principal | titulo | Descubre las Áreas... |
| 01_Portada | Hero Principal | subtitulo | Diagnóstico organizativo... |
| 01_Portada | Hero Principal | boton_principal | Comenzar Test |

### **Ejemplo 2: Footer con HTML**

**En Figma:**
```
Frame: "07_Footer"
  └─ Text: "07_Footer/Copyright/texto [HTML]"
       Contenido: "<p>© 2025 Integrate - <a href='https://tecnofgb.com'>Ferran Garola</a></p>"
```

**Resultado en Supabase:**
| category | section_name | field_name | content | is_html |
|----------|-------------|-----------|---------|---------|
| 07_Footer | Copyright | texto | `<p>© 2025...</p>` | true |

---

## 🐛 Troubleshooting

### **Error: "FIGMA_ACCESS_TOKEN no está configurado"**

**Solución:**
Verifica que `.env.local` contenga:
```env
FIGMA_ACCESS_TOKEN=figd_0CYtmCTQigDonCeIEL5vEBhBwEp0lrXQ1Ah8_Ptj
```

### **Error: "Figma API error: 403 Forbidden"**

**Causas posibles:**
1. Token de Figma inválido o expirado
2. No tienes permisos para acceder al archivo
3. El archivo es privado y no está compartido

**Solución:**
1. Verifica que el token sea correcto
2. Asegúrate de tener acceso al archivo en Figma
3. Comparte el archivo con el usuario del token

### **Error: "fileKey es requerido"**

**Solución:**
Asegúrate de proporcionar el File Key correcto en el campo correspondiente.

### **Contenido no se sincroniza**

**Verifica:**
1. ✅ Los nombres de los nodos siguen la convención `category/section_name/field_name`
2. ✅ Los nodos son de tipo TEXT
3. ✅ Los nodos tienen contenido (no están vacíos)
4. ✅ El File Key es correcto

---

## 📊 Resultado de Sincronización

Después de sincronizar, verás un resumen como este:

```
📊 Resumen de sincronización:
   ✅ Procesados: 45
   ➕ Creados: 12
   ✏️  Actualizados: 33
   ❌ Errores: 0
```

**Interpretación:**
- **Procesados**: Total de nodos de texto encontrados en Figma
- **Creados**: Nuevos registros insertados en Supabase
- **Actualizados**: Registros existentes que fueron actualizados
- **Errores**: Elementos que no pudieron procesarse

---

## 🚀 Próximos Pasos

1. **Organiza tu archivo de Figma** siguiendo las convenciones de nombres
2. **Ejecuta la primera sincronización** desde `/admin/figma-sync`
3. **Verifica el contenido** en el CMS (`/admin/cms`)
4. **Actualiza tu diseño en Figma** cuando necesites cambiar contenido
5. **Re-sincroniza** para aplicar los cambios

---

## 📚 Recursos Adicionales

- [Documentación de Figma API](https://www.figma.com/developers/api)
- [Guía del CMS](./CMS_README.md)
- [Estructura de Base de Datos](./database/DOCUMENTACION_BASE_DATOS.md)

