# ESTRUCTURA DE VISTAS: ÁREA COMPLETA Y SUB-ÁREA

## CONTEXTO
Sistema de navegación de dos niveles para visualizar resultados del diagnóstico INTEGRATE 2.0:
- **VISTA 1:** ÁREA COMPLETA (cuando se hace clic en un área del cubo)
- **VISTA 2:** SUB-ÁREA (cuando se hace clic en una sub-área específica)

---

## 1️⃣ VISTA DE ÁREA COMPLETA

### CUÁNDO SE MUESTRA
- Al hacer clic en una de las 6 áreas del cubo 3D
- `selectedArea !== null` Y `selectedSubArea === null`

### ESTRUCTURA DEL HEADER

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ÁREA COMPLETA                                                    [X]    │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┬──────────────────┬───┬─────────────────────────────┐  │
│ │ ÁREA:        │ DESGLOSE POR     │ | │ VISIÓN GENERAL:             │  │
│ │ ESTRATEGIA   │ SUB ÁREAS        │ | │                             │  │
│ │              │                  │ | │ El área de ESTRATEGIA       │  │
│ │ DIAGNÓSTICO: │ ☑ Visión/Misión  │ | │ presenta un nivel crítico   │  │
│ │ CRÍTICO 23%  │ ☑ Stakeholders   │ | │ con un 23% de cumplimiento  │  │
│ │              │ ☑ Calidad        │ | │ promedio...                 │  │
│ │              │ ☑ Proyectos      │ | │                             │  │
│ └──────────────┴──────────────────┴───┴─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

**Elementos:**
1. **Columna 1:** ÁREA + DIAGNÓSTICO (vertical)
   - ÁREA: Nombre del área (ej: ESTRATEGIA)
   - DIAGNÓSTICO: Nivel + Porcentaje promedio (ej: CRÍTICO 23%)

2. **Columna 2:** DESGLOSE POR SUB ÁREAS
   - 4 checkboxes con las sub-áreas del área
   - Cada sub-área es **CLICKEABLE** → navega a vista de sub-área
   - Muestra cuadrado de color con gradiente según porcentaje

3. **Separador vertical:** Línea divisoria

4. **Columna 3:** VISIÓN GENERAL
   - Texto descriptivo del área completa

### CONTENIDO PRINCIPAL (3 COLUMNAS)

```
┌──────────────────┬──────────────────────┬─────────────────────────┐
│ 🎯 PROPÓSITO     │ ⚡ PRÓXIMOS PASOS    │ 🎓 RUTA FORMATIVA      │
│    DEL ÁREA      │    RECOMENDADOS      │    ASOCIADA            │
├──────────────────┼──────────────────────┼─────────────────────────┤
│ Texto párrafo    │ • Bullet 1           │ ┌─────────────────────┐ │
│ descriptivo      │ • Bullet 2           │ │ Activa tu Sistema   │ │
│                  │ • Bullet 3           │ │ Operativo           │ │
│                  │ • Bullet 4           │ └─────────────────────┘ │
└──────────────────┴──────────────────────┴─────────────────────────┘
```

**Iconos y títulos:**
- 🎯 PROPÓSITO DEL ÁREA
- ⚡ PRÓXIMOS PASOS RECOMENDADOS
- 🎓 RUTA FORMATIVA ASOCIADA

### NAVEGACIÓN
- **Botón CERRAR (X):** Cierra todo y vuelve al cubo
- **Click en sub-área:** Navega a vista de sub-área

---

## 2️⃣ VISTA DE SUB-ÁREA

### CUÁNDO SE MUESTRA
- Al hacer clic en una sub-área específica desde la vista de área completa
- `selectedArea !== null` Y `selectedSubArea !== null`

### ESTRUCTURA DEL HEADER (SIMPLIFICADO)

```
┌─────────────────────────────────────────────────────────────────┐
│ SUB ÁREA FINANCIEROS                                    [VOLVER]│
├─────────────────────────────────────────────────────────────────┤
│ ÁREA:                                                           │
│ RECURSOS                                                        │
│                                                                 │
│ DIAGNÓSTICO:                                                    │
│ SÓLIDO 63%                                                      │
├─────────────────────────────────────────────────────────────────┤
```

**Elementos:**
1. **Título:** SUB ÁREA [NOMBRE] (ej: SUB ÁREA FINANCIEROS)
2. **ÁREA:** Nombre del área padre (ej: RECURSOS)
3. **DIAGNÓSTICO:** Nivel + Porcentaje de la sub-área (ej: SÓLIDO 63%)
4. **Botón VOLVER:** Regresa a vista de área completa

**IMPORTANTE:** 
- ❌ NO mostrar "DESGLOSE POR SUB ÁREAS"
- ❌ NO mostrar "VISIÓN GENERAL" en el header
- ✅ Header simple y vertical

### CONTENIDO PRINCIPAL (3 COLUMNAS)

```
┌──────────────────┬──────────────────────┬─────────────────────────┐
│ 👁️ QUÉ SE       │ 📖 CÓMO              │ 🤝 CÓMO TE ACOMPAÑA    │
│    OBSERVA       │    INTERPRETARLO     │    INTEGRATE           │
├──────────────────┼──────────────────────┼─────────────────────────┤
│ Texto párrafo    │ • Bullet 1           │ Texto párrafo           │
│ descriptivo      │ • Bullet 2           │ descriptivo             │
│                  │ • Bullet 3           │                         │
│                  │ • Bullet 4           │                         │
└──────────────────┴──────────────────────┴─────────────────────────┘
```

**Iconos y títulos:**
- 👁️ QUÉ SE OBSERVA
- 📖 CÓMO INTERPRETARLO
- 🤝 CÓMO TE ACOMPAÑA INTEGRATE

### NAVEGACIÓN
- **Botón VOLVER:** Regresa a vista de área completa (mantiene área seleccionada)
- **Botón CERRAR (X):** Cierra todo y vuelve al cubo

---

## FLUJO DE NAVEGACIÓN COMPLETO

```
CUBO 3D
  │
  ├─ Click en ÁREA
  │    │
  │    ▼
  │  ÁREA COMPLETA (selectedArea = X, selectedSubArea = null)
  │    │
  │    ├─ Click en SUB-ÁREA
  │    │    │
  │    │    ▼
  │    │  SUB-ÁREA (selectedArea = X, selectedSubArea = Y)
  │    │    │
  │    │    └─ Click VOLVER → Regresa a ÁREA COMPLETA
  │    │
  │    └─ Click CERRAR (X) → Regresa a CUBO
  │
  └─ (Sin selección)
```

---

## RESUMEN DE DIFERENCIAS

| ASPECTO | ÁREA COMPLETA | SUB-ÁREA |
|---------|---------------|----------|
| **Título** | ÁREA COMPLETA | SUB ÁREA [NOMBRE] |
| **Header** | 4 columnas (Área+Diag, Desglose, \|, Visión) | Simple vertical (Área, Diagnóstico) |
| **Desglose** | ✅ Muestra 4 sub-áreas clickeables | ❌ No muestra |
| **Visión General** | ✅ En header | ❌ No muestra |
| **Icono Col 1** | 🎯 PROPÓSITO DEL ÁREA | 👁️ QUÉ SE OBSERVA |
| **Icono Col 2** | ⚡ PRÓXIMOS PASOS | 📖 CÓMO INTERPRETARLO |
| **Icono Col 3** | 🎓 RUTA FORMATIVA | 🤝 CÓMO TE ACOMPAÑA |
| **Botón** | CERRAR (X) | VOLVER |
| **Acción botón** | Cierra todo → Cubo | Vuelve a Área Completa |

---

## ARCHIVOS INVOLUCRADOS

1. **`app/resultado-nuevo/[code]/page.tsx`**
   - Maneja estados: `selectedArea`, `selectedSubArea`
   - Renderiza `PanelInferior` cuando `selectedArea !== null`

2. **`components/resultado-nuevo/panel-inferior.tsx`**
   - Detecta tipo de vista: `isAreaView = subAreaIndex === null`
   - Renderiza contenido según tipo de vista

3. **`components/cubo-vista-section.tsx`** (pantalla completa)
   - Maneja clicks en área: `setSelectedSubArea(null)`
   - Renderiza `AreaCompletaPanel`

4. **`components/vista-especifica-panel.tsx`**
   - Componente `AreaCompletaPanel`
   - Maneja ambas vistas con condicional `isAreaView`

