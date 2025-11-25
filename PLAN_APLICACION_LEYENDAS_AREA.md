# PLAN DE APLICACIÓN: LEYENDAS DE ÁREA COMPLETA

## 📊 ANÁLISIS DE LA SITUACIÓN ACTUAL

### **ARCHIVOS INVOLUCRADOS:**

1. **`lib/contenido-interpretativo.ts`**
   - Contiene las leyendas de las SUB-ÁREAS (24 sub-áreas × 4 niveles)
   - NO contiene leyendas de ÁREAS COMPLETAS (6 áreas × 4 niveles)
   - Usa nomenclatura: `critico`, `vulnerable`, `estable`, `maduro`

2. **`components/resultado-nuevo/panel-inferior.tsx`**
   - Renderiza el panel inferior en la vista estándar
   - Líneas 136-148: Contenido HARDCODEADO para área completa
   - Líneas 150-196: Contenido HARDCODEADO para sub-área
   - Usa nomenclatura correcta: `critico`, `desarrollo`, `solido`, `ejemplar`

3. **`components/vista-especifica-panel.tsx`**
   - Renderiza el panel en la vista de pantalla completa
   - Líneas 504-507: Contenido HARDCODEADO para área completa (PROPÓSITO)
   - Líneas 525-538: Contenido HARDCODEADO para área completa (PRÓXIMOS PASOS)
   - Líneas 560-568: Contenido HARDCODEADO para área completa (RUTA FORMATIVA)

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### **PASO 1: Actualizar `lib/contenido-interpretativo.ts`**

#### **1.1 Crear nueva interfaz para niveles de área:**

```typescript
export interface NivelAreaContenido {
  rango: string;                    // "1.0-1.49"
  visionGeneral: string;            // Texto narrativo del estado del área
  propositoArea: string;            // Para qué sirve el área
  proximosPasos: string[];          // Lista de acciones recomendadas
  rutaFormativaDescripcion: string; // Descripción de la ruta formativa
}
```

#### **1.2 Actualizar interfaz `AreaContenido`:**

```typescript
export interface AreaContenido {
  area: string;
  rutaFormativa: string;
  proposito: string;
  niveles: {                        // ← NUEVO
    critico: NivelAreaContenido;
    desarrollo: NivelAreaContenido;
    solido: NivelAreaContenido;
    ejemplar: NivelAreaContenido;
  };
  subAreas: SubAreaContenido[];
}
```

#### **1.3 Cambiar nomenclatura en SUB-ÁREAS:**

Actualizar las 24 sub-áreas (solo Área 1 por ahora):
- `vulnerable` → `desarrollo`
- `estable` → `solido`
- `maduro` → `ejemplar`

#### **1.4 Agregar contenido de niveles de ÁREA 1 - ESTRATEGIA:**

```typescript
export const CONTENIDO_ESTRATEGIA: AreaContenido = {
  area: "Estrategia",
  rutaFormativa: "Visión & Impacto Real",
  proposito: "Conectar propósito, dirección y decisiones...",
  
  // ← NUEVO: Niveles de área completa
  niveles: {
    critico: {
      rango: "1.0-1.49",
      visionGeneral: "El área de Estrategia muestra un punto de partida inicial...",
      propositoArea: "Establecer una base común sobre qué queremos conseguir...",
      proximosPasos: [
        "Acordar un mensaje claro y comprensible sobre misión...",
        "Facilitar espacios breves donde los equipos puedan preguntar...",
        // ... etc
      ],
      rutaFormativaDescripcion: "Ruta centrada en construir los fundamentos estratégicos..."
    },
    desarrollo: { ... },
    solido: { ... },
    ejemplar: { ... }
  },
  
  subAreas: [ ... ] // Las 4 sub-áreas existentes
}
```

---

### **PASO 2: Actualizar `components/resultado-nuevo/panel-inferior.tsx`**

#### **2.1 Importar contenido:**

```typescript
import { CONTENIDO_ESTRATEGIA, getNivelKey } from "@/lib/contenido-interpretativo";
```

#### **2.2 Modificar función `getContentByLevel()` (líneas 123-198):**

**ANTES (líneas 136-148):**
```typescript
return {
  desglose: subAreasDesglose,
  visionGeneral: `El área de ${displayName} presenta...`, // ← HARDCODEADO
  proposito: `Optimizar el uso de herramientas...`,        // ← HARDCODEADO
  proximosPasos: [ ... ],                                  // ← HARDCODEADO
  rutaFormativa: 'Activa tu Sistema Operativo',           // ← HARDCODEADO
};
```

**DESPUÉS:**
```typescript
// Obtener contenido del área según el índice
const getContenidoArea = () => {
  if (areaIndex === 0) return CONTENIDO_ESTRATEGIA;
  // if (areaIndex === 1) return CONTENIDO_ESTRUCTURA;
  // ... etc
  return null;
};

const contenidoArea = getContenidoArea();
const nivelKey = getNivelKey(displayValue);
const contenidoNivel = contenidoArea?.niveles[nivelKey];

return {
  desglose: subAreasDesglose,
  visionGeneral: contenidoNivel?.visionGeneral || `El área de ${displayName}...`,
  proposito: contenidoNivel?.propositoArea || contenidoArea?.proposito || '',
  proximosPasos: contenidoNivel?.proximosPasos || [],
  rutaFormativa: contenidoArea?.rutaFormativa || '',
  rutaFormativaDescripcion: contenidoNivel?.rutaFormativaDescripcion || '',
};
```

---

### **PASO 3: Actualizar `components/vista-especifica-panel.tsx`**

#### **3.1 Ya tiene la función `getContenidoArea()` (líneas 339-347)**

✅ Ya importa `CONTENIDO_ESTRATEGIA`
✅ Ya tiene lógica para obtener contenido por área

#### **3.2 Modificar sección de PROPÓSITO DEL ÁREA (líneas 504-507):**

**ANTES:**
```typescript
{isAreaView ? (
  <p className={`text-sm leading-relaxed ${darkMode ? 'text-white' : 'text-gray-700'}`}>
    Optimizar el uso de herramientas... // ← HARDCODEADO
  </p>
) : ...}
```

**DESPUÉS:**
```typescript
{isAreaView ? (
  <p className={`text-sm leading-relaxed ${darkMode ? 'text-white' : 'text-gray-700'}`}>
    {contenidoAreaNivel?.propositoArea || contenidoArea?.proposito || ''}
  </p>
) : ...}
```

#### **3.3 Modificar sección de PRÓXIMOS PASOS (líneas 525-538):**

**ANTES:**
```typescript
{isAreaView ? (
  <ul className="space-y-1.5">
    {[
      'Revisar en detalle cada sub-área...', // ← HARDCODEADO
      // ...
    ].map((paso, idx) => ( ... ))}
  </ul>
) : ...}
```

**DESPUÉS:**
```typescript
{isAreaView ? (
  <ul className="space-y-1.5">
    {(contenidoAreaNivel?.proximosPasos || []).map((paso, idx) => (
      <li key={idx} className={`text-sm flex items-start gap-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
        <span className="text-xs mt-1">•</span>
        <span className="flex-1 leading-relaxed">{paso}</span>
      </li>
    ))}
  </ul>
) : ...}
```

---

## 📝 RESUMEN DE CAMBIOS

### **Archivos a modificar:**

1. ✅ **`lib/contenido-interpretativo.ts`**
   - Crear `NivelAreaContenido` interface
   - Actualizar `AreaContenido` interface
   - Cambiar nomenclatura: `vulnerable`→`desarrollo`, `estable`→`solido`, `maduro`→`ejemplar`
   - Agregar contenido de niveles para ÁREA 1 - ESTRATEGIA

2. ✅ **`components/resultado-nuevo/panel-inferior.tsx`**
   - Importar contenido de área
   - Reemplazar contenido hardcodeado con contenido dinámico

3. ✅ **`components/vista-especifica-panel.tsx`**
   - Obtener nivel de área según porcentaje
   - Reemplazar contenido hardcodeado con contenido dinámico

---

## ⚠️ NOTAS IMPORTANTES

1. **Solo aplicar para ÁREA 1 - ESTRATEGIA** por ahora
2. **Mantener fallbacks** para áreas sin contenido definido
3. **Probar ambas vistas:** estándar (`panel-inferior`) y pantalla completa (`vista-especifica-panel`)
4. **Verificar que la nomenclatura sea consistente** en todos los archivos

