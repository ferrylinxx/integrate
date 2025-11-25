# INTEGRATE - Diagnóstico Organizativo

<p align="center">
  <img src="./public/logo/Integrate_logo gris + color.png" alt="INTEGRATE Logo" width="400"/>
</p>

## 🎯 Descripción

**INTEGRATE** es una plataforma avanzada de diagnóstico organizativo que permite evaluar y visualizar el estado de las organizaciones a través de un innovador sistema de cubo 3D interactivo.

### Características principales:

- ✅ **Cubo 3D Interactivo**: Visualización tridimensional de 6 áreas organizativas
- ✅ **Dashboard Avanzado**: Análisis detallado por áreas y sub-áreas
- ✅ **Sistema de Grupos**: Gestión de equipos y comparativas
- ✅ **Exportación de Resultados**: PDF, imágenes HD y 4K
- ✅ **CMS Integrado**: Gestión de contenido multiidioma
- ✅ **Responsive Design**: Optimizado para todos los dispositivos

## 🚀 Inicio Rápido

### Usando Docker Hub

```bash
# Descargar la última versión
docker pull gabo9803/integrate:latest

# Ejecutar el contenedor
docker run -p 3000:3000 gabo9803/integrate:latest
```

La aplicación estará disponible en: **http://localhost:3000**

### Versiones Disponibles

- `latest` - Última versión estable
- `3.7.0` - Eliminación de bloque "Acciones Disponibles" + Video de fondo
- `3.6.0` - Video de fondo en landing page
- `3.5.0` - Mejoras en animaciones del cubo y pantalla de carga

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Figma Integration (opcional)
FIGMA_ACCESS_TOKEN=tu_figma_token
FIGMA_FILE_KEY=tu_figma_file_key
```

### Ejecutar con variables de entorno

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=tu_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key \
  gabo9803/integrate:latest
```

## 📦 Tecnologías

- **Framework**: Next.js 15.5.6
- **UI**: React 19, Tailwind CSS
- **3D**: Three.js, React Three Fiber
- **Base de Datos**: Supabase
- **Containerización**: Docker

## 🎨 Áreas de Evaluación

1. **Estrategia** - Visión y planificación organizativa
2. **Estructura** - Organización y procesos
3. **Resultados** - Logros y métricas
4. **Eficacia** - Eficiencia operativa
5. **Recursos** - Gestión de activos
6. **Personas** - Talento y cultura

## 📊 Niveles de Madurez

- 🔴 **Crítico** (0-1): Requiere atención inmediata
- 🟡 **En Desarrollo** (1-2): Necesita mejoras
- 🟢 **Sólido** (2-3): Funcionamiento adecuado
- 🔵 **Ejemplar** (3-4): Excelencia organizativa

## 🔗 Enlaces

- **Docker Hub**: https://hub.docker.com/r/gabo9803/integrate
- **Documentación**: Ver archivos MD en el repositorio
- **Versión**: 3.7.0

## 📝 Licencia

© 2025 INTEGRATE - Todos los derechos reservados

## 🆘 Soporte

Para reportar problemas o solicitar características, contacta con el equipo de desarrollo.

---

**Última actualización**: 2025-01-21 | **Versión**: 3.7.0

