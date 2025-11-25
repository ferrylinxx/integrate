# Guía de Versionado - Integrate Test de Áreas Sensibles

## 📌 Ubicación de la Versión

La versión de la aplicación se encuentra en el archivo:
```
lib/version.ts
```

## 🔢 Formato de Versión

La versión sigue el formato semántico: `Demo (X.Y.Z)`

- **X** (Mayor): Cambios mayores, rediseños completos, nuevas funcionalidades principales
- **Y** (Menor): Mejoras de funcionalidades existentes, nuevas características pequeñas
- **Z** (Parche): Correcciones de bugs y ajustes menores

## 📝 Cómo Actualizar la Versión

### Paso 1: Editar el archivo `lib/version.ts`

Abre el archivo y modifica la constante `APP_VERSION`:

```typescript
export const APP_VERSION = "1.0.2"; // Incrementa según el tipo de cambio
export const APP_VERSION_LABEL = `Demo (${APP_VERSION})`;
```

### Paso 2: Ejemplos de Incremento

**Corrección de bug (Parche):**
- Antes: `1.0.1`
- Después: `1.0.2`

**Nueva característica pequeña (Menor):**
- Antes: `1.0.2`
- Después: `1.1.0`

**Rediseño completo o funcionalidad mayor (Mayor):**
- Antes: `1.1.0`
- Después: `2.0.0`

## 🎯 Dónde se Muestra la Versión

La versión se muestra automáticamente en:
- **Menú de navegación** (navbar) en todas las páginas
- Visible en desktop (oculto en móvil con `hidden sm:flex`)

## 🚀 Proceso Completo de Actualización

1. **Hacer cambios en el código**
2. **Actualizar la versión en `lib/version.ts`**
3. **Probar localmente**: `npm run dev`
4. **Construir imagen Docker**: `docker build -t gabo9803/integrate-test-areas-sensibles:latest -t gabo9803/integrate-test-areas-sensibles:X.Y.Z .`
5. **Subir a Docker Hub**:
   ```bash
   docker push gabo9803/integrate-test-areas-sensibles:latest
   docker push gabo9803/integrate-test-areas-sensibles:X.Y.Z
   ```

## 📊 Historial de Versiones

### v1.3.0 (Actual) - 🎉 MEJORAS MASIVAS DEL CUBO 3D
- ✨ **TOOLTIP MEJORADO**: Información detallada al hacer hover (nombre, promedio, valores individuales)
- 🎮 **BOTÓN PAUSA/PLAY**: Control de rotación automática del cubo
- 📚 **LEYENDA INTERACTIVA**: Panel lateral mostrar/ocultar con toda la información
- 🎓 **MINI TUTORIAL**: Tutorial interactivo que se muestra la primera vez
- 💡 **TOOLTIPS EXPLICATIVOS**: Información sobre qué significa cada color en la leyenda
- 🎯 **RECOMENDACIONES PERSONALIZADAS**: Sistema automático de recomendaciones basado en puntuaciones bajas
- 🎬 **EXPORTAR GIF**: Funcionalidad para exportar el cubo rotando como GIF animado
- ✨ **EFECTO BLOOM**: Brillo especial en caras con alta puntuación (>= 3.5)
- 🎨 **8 NUEVOS COMPONENTES**: cube-legend, cube-tutorial, cube-recommendations, export-cube-gif
- 📦 **NUEVA DEPENDENCIA**: gif.js para exportación de GIF animado

### v1.2.1
- ✅ **MEJORA UX**: Eliminada leyenda "Áreas INTEGRATE" del cubo 3D de resultados
- ✅ Componente `ColorLegend` removido de `components/cube-3d.tsx`
- ✅ Interfaz más limpia y menos saturada visualmente
- ✅ Cubo 3D ahora muestra solo el cubo interactivo sin panel lateral

### v1.1.1 - 🚀 DESPLEGADO EN DOCKER HUB
- ✅ **FIX CRÍTICO**: Logo de Integrate ahora se carga correctamente en Docker
- ✅ Dockerfile corregido: archivos públicos copiados con permisos correctos (--chown=nextjs:nodejs)
- ✅ Logo visible en navbar, footer y todas las páginas en versión Docker
- 🚀 **Desplegado en Docker Hub**: `gabo9803/integrate-test-areas-sensibles:1.1.1` y `:latest`

### v1.1.0 - 🎨 MEJORAS VISUALES
- ✅ Landing page mejorada con más presencia de colores Integrate
- ✅ Hero Section con gradientes de 6 colores y elementos decorativos
- ✅ Todas las secciones con fondos mejorados con gradientes sutiles
- ✅ Elementos decorativos con blur effects en todas las secciones
- ✅ Badges y botones con gradientes de múltiples colores Integrate
- ✅ Footer mejorado con borde superior gradiente y efectos visuales
- ✅ Animaciones y transiciones mejoradas en todos los elementos
- ✅ Más uso de los 6 colores oficiales: #2C248E, #412761, #8E235D, #E65B3E, #F08726, #D91D5C

### v1.0.3
- ✅ Cubo 3D completamente simplificado (versión básica y limpia)
- ✅ Eliminados todos los efectos complejos y decoraciones
- ✅ Tamaño reducido a 280px
- ✅ Código reducido de 330 líneas a 260 líneas

### v1.0.2
- ✅ Cubo 3D restaurado a versión anterior (eliminadas propiedades `backfaceVisibility`)
- ✅ Corrección de bug: cubo se veía plano en 2D

### v1.0.1
- ✅ Cubo 3D arreglado con `backface-visibility: hidden`
- ✅ Versión movida del footer al menú de navegación
- ✅ Sistema de versionado implementado

### v1.0.0
- ✅ Cubo 3D mejorado con efectos visuales
- ✅ Badge de versión en el footer
- ✅ Primera versión en Docker Hub

## 💡 Notas Importantes

- **Siempre actualiza la versión** antes de hacer push a Docker Hub
- **Usa tags semánticos** en Docker para mantener historial de versiones
- **La versión se importa automáticamente** en todas las páginas que la necesiten
- **No es necesario editar manualmente** el navbar, solo el archivo `lib/version.ts`

