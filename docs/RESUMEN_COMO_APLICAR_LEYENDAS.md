# CÓMO APLICAR LAS LEYENDAS DE ÁREA COMPLETA - RESUMEN EJECUTIVO

## 🎯 OBJETIVO
Reemplazar el contenido HARDCODEADO de la vista "ÁREA COMPLETA" con las leyendas oficiales que me proporcionaste para el ÁREA 1 - ESTRATEGIA.

---

## 📍 DÓNDE ESTÁ EL PROBLEMA AHORA

### **Vista de ÁREA COMPLETA tiene contenido HARDCODEADO en 2 lugares:**

#### **1. Vista estándar:** `components/resultado-nuevo/panel-inferior.tsx`
```typescript
// Líneas 136-148 - CONTENIDO HARDCODEADO:
visionGeneral: `El área de ${displayName} presenta un nivel...`  // ← Genérico
proposito: `Optimizar el uso de herramientas...`                 // ← Área 5, no Área 1
proximosPasos: [
  'Revisar en detalle cada sub-área...',                         // ← Genérico
  'Priorizar las sub-áreas...',
  // ...
]
rutaFormativa: 'Activa tu Sistema Operativo'                     // ← Área 5, no Área 1
```

#### **2. Vista pantalla completa:** `components/vista-especifica-panel.tsx`
```typescript
// Línea 506 - PROPÓSITO HARDCODEADO:
Optimizar el uso de herramientas, tiempo y conocimiento...  // ← Área 5, no Área 1

// Líneas 527-531 - PRÓXIMOS PASOS HARDCODEADOS:
'Revisar en detalle cada sub-área usando la Vista Específica',
'Priorizar las sub-áreas con menor puntuación...',
// ...

// Línea 565 - RUTA FORMATIVA HARDCODEADA:
Activa tu Sistema Operativo  // ← Área 5, no Área 1
```

---

## ✅ SOLUCIÓN: 3 PASOS

### **PASO 1: Crear estructura de datos en `lib/contenido-interpretativo.ts`**

Agregar a cada área un objeto `niveles` con 4 niveles (crítico, desarrollo, sólido, ejemplar):

```typescript
export const CONTENIDO_ESTRATEGIA: AreaContenido = {
  area: "Estrategia",
  rutaFormativa: "Visión & Impacto Real",
  proposito: "Conectar propósito, dirección y decisiones...",
  
  // ← AGREGAR ESTO:
  niveles: {
    critico: {
      rango: "1.0-1.49",
      visionGeneral: "El área de Estrategia muestra un punto de partida inicial. El porcentaje obtenido refleja que las personas conocen elementos básicos del propósito, pero todavía no existe un marco común que oriente decisiones, prioridades y proyectos. Se observan esfuerzos individuales valiosos, aunque sin una dirección clara que unifique los criterios y reduzca la dispersión en el trabajo diario.\n\nEste nivel indica que la organización necesita construir un lenguaje compartido que proporcione claridad y facilite la comprensión del rumbo a seguir.",
      propositoArea: "Establecer una base común sobre qué queremos conseguir, por qué y cómo lo vamos a hacer. La Estrategia da dirección, ordena esfuerzos y genera seguridad colectiva.",
      proximosPasos: [
        "Acordar un mensaje claro y comprensible sobre misión, valores y prioridades estratégicas.",
        "Facilitar espacios breves donde los equipos puedan preguntar y aclarar criterios.",
        "Crear un mapa sencillo de proyectos que muestre hacia dónde quiere avanzar la organización.",
        "Conectar decisiones operativas con la dirección estratégica para reducir incertidumbre."
      ],
      rutaFormativaDescripcion: "Ruta centrada en construir los fundamentos estratégicos:\n• Ayuda a entender qué representa la estrategia en el día a día.\n• Proporciona un marco común para tomar decisiones con coherencia.\n• Conecta propósito, prioridades y acciones de forma clara.\n• Facilita que todas las personas puedan identificar cómo contribuyen al impacto global."
    },
    desarrollo: { ... },  // Nivel 1.5-2.49
    solido: { ... },      // Nivel 2.5-3.49
    ejemplar: { ... }     // Nivel 3.5-4.0
  },
  
  subAreas: [ ... ] // Las 4 sub-áreas que ya existen
}
```

---

### **PASO 2: Usar datos en `panel-inferior.tsx`**

Reemplazar líneas 136-148 con:

```typescript
// Obtener contenido del área
const getContenidoArea = () => {
  if (areaIndex === 0) return CONTENIDO_ESTRATEGIA;
  return null;
};

const contenidoArea = getContenidoArea();
const nivelKey = getNivelKey(displayValue);  // Ya existe esta función
const contenidoNivel = contenidoArea?.niveles[nivelKey];

return {
  desglose: subAreasDesglose,
  visionGeneral: contenidoNivel?.visionGeneral || `Texto genérico...`,
  proposito: contenidoNivel?.propositoArea || contenidoArea?.proposito || '',
  proximosPasos: contenidoNivel?.proximosPasos || [],
  rutaFormativa: contenidoArea?.rutaFormativa || '',
  rutaFormativaDescripcion: contenidoNivel?.rutaFormativaDescripcion || '',
};
```

---

### **PASO 3: Usar datos en `vista-especifica-panel.tsx`**

Ya tiene la función `getContenidoArea()` en línea 339. Solo necesitamos:

1. **Obtener el nivel del área:**
```typescript
const nivelKey = getNivelKey(value);
const contenidoAreaNivel = contenidoArea?.niveles?.[nivelKey];
```

2. **Reemplazar línea 506:**
```typescript
// ANTES:
Optimizar el uso de herramientas, tiempo y conocimiento...

// DESPUÉS:
{contenidoAreaNivel?.propositoArea || contenidoArea?.proposito || ''}
```

3. **Reemplazar líneas 527-531:**
```typescript
// ANTES:
{[
  'Revisar en detalle cada sub-área...',
  // ...
].map((paso, idx) => ( ... ))}

// DESPUÉS:
{(contenidoAreaNivel?.proximosPasos || []).map((paso, idx) => ( ... ))}
```

4. **Reemplazar línea 565:**
```typescript
// ANTES:
Activa tu Sistema Operativo

// DESPUÉS:
{contenidoArea?.rutaFormativa || ''}
```

---

## 📊 RESULTADO ESPERADO

### **ANTES:**
- Área 1 (Estrategia) mostraba contenido del Área 5 (Recursos) ❌
- Contenido genérico sin personalización por nivel ❌

### **DESPUÉS:**
- Área 1 (Estrategia) muestra su propio contenido ✅
- Contenido específico según nivel (Crítico, Desarrollo, Sólido, Ejemplar) ✅
- Textos oficiales aprobados por el usuario ✅

---

## 🚀 ORDEN DE EJECUCIÓN

1. ✅ Modificar `lib/contenido-interpretativo.ts` (agregar interfaces y contenido)
2. ✅ Modificar `components/resultado-nuevo/panel-inferior.tsx` (vista estándar)
3. ✅ Modificar `components/vista-especifica-panel.tsx` (vista pantalla completa)
4. ✅ Compilar y probar: `npm run build`

---

## ⚠️ IMPORTANTE

- Solo aplicar para **ÁREA 1 - ESTRATEGIA** por ahora
- Mantener **fallbacks** para áreas sin contenido
- Cambiar nomenclatura: `vulnerable`→`desarrollo`, `estable`→`solido`, `maduro`→`ejemplar`

