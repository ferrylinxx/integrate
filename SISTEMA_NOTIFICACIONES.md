# 🔔 Sistema de Notificaciones de Actualización

## 📋 Descripción

Sistema automático que notifica a los usuarios cuando hay una nueva versión disponible de la aplicación INTEGRATE.

## 🎯 Características

- ✅ **Verificación automática** cada 30 minutos
- ✅ **Notificación visual** en la parte superior de la página
- ✅ **Descartable** - El usuario puede cerrar la notificación
- ✅ **Persistente** - No vuelve a mostrar la misma versión si fue descartada
- ✅ **Fallback local** - Funciona tanto con GitHub como localmente
- ✅ **Sin errores molestos** - Falla silenciosamente si no hay conexión

## 🏗️ Arquitectura

### **Archivos creados:**

1. **`public/version.json`** - Archivo de configuración de versión
2. **`hooks/use-version-check.ts`** - Hook para verificar actualizaciones
3. **`components/update-notification.tsx`** - Componente de notificación
4. **`app/layout.tsx`** - Modificado para incluir el componente

### **Flujo de funcionamiento:**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario carga la página                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. useVersionCheck se ejecuta automáticamente              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Intenta fetch desde GitHub (producción)                 │
│    https://raw.githubusercontent.com/.../version.json       │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    ¿Éxito? ──No──→ Intenta /version.json local
                          │
                         Sí
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Compara versión actual vs versión en archivo            │
│    Ejemplo: 4.0.0 (actual) vs 4.1.0 (nueva)                │
└─────────────────────────────────────────────────────────────┘
                          ↓
                  ¿Hay actualización?
                          │
                         Sí
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Verifica si el usuario ya descartó esta versión         │
│    localStorage.getItem("dismissedUpdateVersion")          │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    ¿No descartada?
                          │
                         Sí
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Muestra notificación en la parte superior               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Cómo Publicar una Nueva Versión

### **Paso 1: Actualizar versión en el código**

Edita `lib/version.ts`:
```typescript
export const APP_VERSION = "4.1.0"; // Nueva versión
export const APP_VERSION_LABEL = "v4.1.0";
```

### **Paso 2: Actualizar archivo de versión pública**

Edita `public/version.json`:
```json
{
  "version": "4.1.0",
  "releaseDate": "2025-01-26",
  "releaseNotes": {
    "es": {
      "title": "Nueva versión disponible (v4.1.0)",
      "message": "Actualitza per a les darreres característiques i millores.",
      "features": [
        "Nueva característica 1",
        "Mejora en característica 2",
        "Corrección de bug 3"
      ]
    }
  },
  "minVersion": "4.0.0",
  "updateUrl": "https://github.com/ferrylinxx/integrate/releases/latest"
}
```

### **Paso 3: Commit y push a GitHub**

```bash
git add .
git commit -m "chore: bump version to 4.1.0"
git push origin main
```

### **Paso 4: Build y push a Docker Hub**

```bash
# Opción 1: Script PowerShell
.\docker-deploy.ps1 4.1.0

# Opción 2: Manual
docker build -t gabo9803/integrate:4.1.0 -t gabo9803/integrate:latest .
docker push gabo9803/integrate:4.1.0
docker push gabo9803/integrate:latest
```

### **Paso 5: ¡Listo!**

Los usuarios verán automáticamente la notificación en los próximos 30 minutos (o al recargar la página).

## 🎨 Personalización

### **Cambiar frecuencia de verificación:**

En `hooks/use-version-check.ts`, línea 115:
```typescript
// Verificar cada 30 minutos (1800000 ms)
const interval = setInterval(checkVersion, 30 * 60 * 1000);

// Cambiar a 1 hora:
const interval = setInterval(checkVersion, 60 * 60 * 1000);

// Cambiar a 5 minutos (para testing):
const interval = setInterval(checkVersion, 5 * 60 * 1000);
```

### **Cambiar estilo de notificación:**

Edita `components/update-notification.tsx` para modificar colores, tamaño, posición, etc.

## 🧪 Testing

### **Probar localmente:**

1. Cambia la versión en `public/version.json` a una superior (ej: 5.0.0)
2. Recarga la página
3. Deberías ver la notificación

### **Limpiar localStorage:**

```javascript
// En la consola del navegador:
localStorage.removeItem("dismissedUpdateVersion");
location.reload();
```

## 📊 Ventajas de este Sistema

| Característica | Beneficio |
|----------------|-----------|
| **Sin backend adicional** | No requiere servidor extra, usa GitHub como CDN |
| **Caché inteligente** | No sobrecarga el servidor con requests |
| **Fallback local** | Funciona en desarrollo sin conexión |
| **UX no intrusiva** | El usuario puede descartar la notificación |
| **Versionado semántico** | Compara versiones correctamente (4.0.0 < 4.1.0) |
| **Persistencia** | Recuerda qué versiones fueron descartadas |

## 🔄 Alternativas Consideradas

### **Opción 2: Docker Hub API (Más compleja)**
- Requiere llamadas a la API de Docker Hub
- Necesita parsear tags y ordenarlos
- Más lento y complejo

### **Opción 3: Webhook de GitHub (Más avanzada)**
- Requiere backend con WebSockets
- Notificaciones en tiempo real
- Más costoso de implementar

### **Opción 4: Supabase Realtime (Overkill)**
- Requiere tabla en Supabase
- Subscripciones en tiempo real
- Innecesario para este caso de uso

## ✅ Conclusión

El sistema implementado es **simple, eficiente y no requiere infraestructura adicional**. Usa GitHub como fuente de verdad y funciona perfectamente tanto en producción como en desarrollo.

