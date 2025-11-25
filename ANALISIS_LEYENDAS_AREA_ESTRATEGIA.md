# ANÁLISIS: LEYENDAS DE ÁREA COMPLETA vs IMPLEMENTACIÓN ACTUAL

## 📊 SITUACIÓN ACTUAL

### **ESTRUCTURA EXISTENTE:**
```typescript
export interface AreaContenido {
  area: string;
  rutaFormativa: string;
  proposito: string;
  subAreas: SubAreaContenido[];  // ← Solo contenido de SUB-ÁREAS
}
```

**PROBLEMA:** 
- ✅ Tenemos contenido para las **24 SUB-ÁREAS** (4 niveles cada una)
- ❌ **NO** tenemos contenido para las **6 ÁREAS COMPLETAS** (4 niveles cada una)

### **LO QUE FALTA:**
Contenido de ÁREA COMPLETA con 4 niveles:
1. **CRÍTICO** (1.0-1.49)
2. **DESARROLLO** (1.5-2.49) ← Usuario dice "Vulnerable"
3. **SÓLIDO** (2.5-3.49) ← Usuario dice "Estable"
4. **EJEMPLAR** (3.5-4.0) ← Usuario dice "Consolidado"

---

## 🎯 ESTRUCTURA REQUERIDA PARA ÁREA COMPLETA

Según las leyendas proporcionadas por el usuario, cada nivel de área debe tener:

### **1. VISIÓN GENERAL**
- Incluye porcentaje + interpretación del área completa
- Texto narrativo que explica el estado general del área

### **2. PROPÓSITO DEL ÁREA**
- Texto fijo que explica para qué sirve el área

### **3. PRÓXIMOS PASOS RECOMENDADOS**
- Lista de bullets con acciones recomendadas

### **4. RUTA FORMATIVA ASOCIADA**
- Nombre de la ruta (ej: "R1 · Visión & Impacto Real")
- Descripción clara y comprensible

---

## 🔧 CAMBIOS NECESARIOS

### **1. Crear nueva interfaz para contenido de área:**

```typescript
export interface NivelAreaContenido {
  rango: string;                    // "1.0-1.49"
  visionGeneral: string;            // VISIÓN GENERAL
  propositoArea: string;            // PROPÓSITO DEL ÁREA
  proximosPasos: string[];          // PRÓXIMOS PASOS (bullets)
  rutaFormativaDescripcion: string; // Descripción de la ruta
}

export interface AreaContenidoCompleto {
  area: string;
  rutaFormativa: string;
  proposito: string;
  niveles: {
    critico: NivelAreaContenido;
    desarrollo: NivelAreaContenido;    // ← Cambiar de "vulnerable"
    solido: NivelAreaContenido;        // ← Cambiar de "estable"
    ejemplar: NivelAreaContenido;      // ← Cambiar de "maduro"
  };
  subAreas: SubAreaContenido[];
}
```

### **2. Actualizar función getNivelKey:**

```typescript
// ANTES:
export function getNivelKey(value: number): 'critico' | 'vulnerable' | 'estable' | 'maduro'

// DESPUÉS:
export function getNivelKey(value: number): 'critico' | 'desarrollo' | 'solido' | 'ejemplar'
```

### **3. Actualizar todas las sub-áreas:**

Cambiar nombres de niveles en las 24 sub-áreas:
- `vulnerable` → `desarrollo`
- `estable` → `solido`
- `maduro` → `ejemplar`

---

## 📝 CONTENIDO A AGREGAR: ÁREA 1 - ESTRATEGIA

### **NIVEL CRÍTICO (1.0-1.49)**

**VISIÓN GENERAL:**
```
El área de Estrategia muestra un punto de partida inicial. El porcentaje obtenido refleja que las personas conocen elementos básicos del propósito, pero todavía no existe un marco común que oriente decisiones, prioridades y proyectos. Se observan esfuerzos individuales valiosos, aunque sin una dirección clara que unifique los criterios y reduzca la dispersión en el trabajo diario.

Este nivel indica que la organización necesita construir un lenguaje compartido que proporcione claridad y facilite la comprensión del rumbo a seguir.
```

**PROPÓSITO DEL ÁREA:**
```
Establecer una base común sobre qué queremos conseguir, por qué y cómo lo vamos a hacer. La Estrategia da dirección, ordena esfuerzos y genera seguridad colectiva.
```

**PRÓXIMOS PASOS RECOMENDADOS:**
- Acordar un mensaje claro y comprensible sobre misión, valores y prioridades estratégicas.
- Facilitar espacios breves donde los equipos puedan preguntar y aclarar criterios.
- Crear un mapa sencillo de proyectos que muestre hacia dónde quiere avanzar la organización.
- Conectar decisiones operativas con la dirección estratégica para reducir incertidumbre.

**RUTA FORMATIVA:**
```
Ruta centrada en construir los fundamentos estratégicos:
• Ayuda a entender qué representa la estrategia en el día a día.
• Proporciona un marco común para tomar decisiones con coherencia.
• Conecta propósito, prioridades y acciones de forma clara.
• Facilita que todas las personas puedan identificar cómo contribuyen al impacto global.
```

---

### **NIVEL DESARROLLO (1.5-2.49)**

**VISIÓN GENERAL:**
```
El área de Estrategia presenta una base reconocida, pero todavía en consolidación. El porcentaje refleja que hay una dirección conocida y valores visibles, aunque su aplicación real varía entre equipos. Se percibe intención de avanzar, pero aún falta consistencia para traducir la estrategia en prácticas regulares y compartidas.

Este nivel muestra que la organización ya ha iniciado el camino, pero necesita reforzar la conexión entre propósito, decisiones y proyectos.
```

**PROPÓSITO DEL ÁREA:**
```
Convertir la estrategia en una guía práctica y comprensible que ayude a priorizar, decidir y coordinar con coherencia.
```

**PRÓXIMOS PASOS RECOMENDADOS:**
- Revisar cómo se aplican misión y valores en distintos equipos para ganar coherencia.
- Definir prioridades estratégicas de manera más visible y accesible.
- Unificar criterios de calidad y seguimiento de proyectos estratégicos.
- Compartir ejemplos reales que muestren cómo se traduce la estrategia en decisiones.

**RUTA FORMATIVA:**
```
Ruta orientada a consolidar la estrategia aplicada:
• Conecta visión y tareas reales para facilitar coherencia.
• Ayuda a convertir la intención estratégica en hábitos.
• Aporta herramientas para alinear proyectos con prioridades.
• Fortalece el criterio colectivo para tomar decisiones con sentido.
```

---

## ⚠️ NOTA IMPORTANTE: NOMENCLATURA

El usuario usa estos nombres de niveles:
- **CRÍTICO** (1.0-1.49)
- **DESARROLLO** (1.5-2.49) ← NO "Vulnerable"
- **SÓLIDO** (2.5-3.49) ← NO "Estable"
- **EJEMPLAR** (3.5-4.0) ← NO "Consolidado" ni "Maduro"

Debemos actualizar TODO el código para usar esta nomenclatura consistentemente.

