# INTEGRATE - Diagnóstico Organizativo

<p align="center">
  <img src="./public/logo/Integrate_logo gris + color.png" alt="INTEGRATE Logo" width="400"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-4.9.0-blue.svg" alt="Version 4.9.0"/>
  <img src="https://img.shields.io/badge/Next.js-15.5.6-black.svg" alt="Next.js 15.5.6"/>
  <img src="https://img.shields.io/badge/React-19-61dafb.svg" alt="React 19"/>
  <img src="https://img.shields.io/badge/Docker-Ready-2496ed.svg" alt="Docker Ready"/>
  <img src="https://img.shields.io/badge/License-Proprietary-red.svg" alt="License"/>
</p>

## 🎯 Descripción

**INTEGRATE** es una plataforma avanzada de diagnóstico organizativo que permite evaluar y visualizar el estado de las organizaciones a través de un innovador sistema de cubo 3D interactivo.

### ✨ Características principales:

- ✅ **Cubo 3D Interactivo**: Visualización tridimensional de 6 áreas organizativas
- ✅ **Dashboard Avanzado**: Análisis detallado por áreas y sub-áreas
- ✅ **Sistema de Grupos**: Gestión de equipos y comparativas
- ✅ **Exportación de Resultados**: PDF, imágenes HD y 4K
- ✅ **CMS Integrado**: Gestión de contenido multiidioma
- ✅ **Panel de Administración**: Control total del sistema
- ✅ **Status Page**: Monitoreo en tiempo real con Liquid Glass design
- ✅ **Autenticación Segura**: Protección de datos con Supabase Auth
- ✅ **Google Analytics**: Tracking de eventos y conversiones
- ✅ **Responsive Design**: Optimizado para todos los dispositivos

### 🆕 Novedades v4.9.0

- 🎨 **Status Page Rediseñada**: Estilo Liquid Glass de Apple con backdrop blur
- 📊 **Sistema de Tabs**: Navegación mejorada (Resumen, Servicios, Base de Datos, Tests)
- 📥 **Exportar Reportes**: Descarga el estado del sistema en formato JSON
- 📈 **Dashboard de Métricas**: Vista rápida de servicios, tablas y tests
- 🔄 **Auto-refresh Mejorado**: Control de pausa/reanudar con indicadores visuales
- 🔍 **Búsqueda por Nombre**: Buscar grupos por código o nombre
- 🎯 **Monitoreo en Tiempo Real**: 6 servicios, 5 tablas, tests funcionales

## 🚀 Inicio Rápido

### Opción 1: Docker Hub (Recomendado)

```bash
# Descargar la última versión (4.9.0)
docker pull gabo9803/integrate:latest

# O descargar una versión específica
docker pull gabo9803/integrate:4.9.0

# Ejecutar el contenedor
docker run -p 3000:3000 gabo9803/integrate:latest
```

La aplicación estará disponible en: **http://localhost:3000**

### Opción 2: Desarrollo Local

```bash
# Clonar el repositorio
git clone https://github.com/ferrylinxx/integrate.git
cd integrate

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en modo desarrollo
npm run dev

# O construir para producción
npm run build
npm start
```

### 📦 Versiones Disponibles en Docker Hub

| Versión | Fecha | Características Principales |
|---------|-------|----------------------------|
| **4.9.0** | 2025-01-27 | Status Page con Liquid Glass, Tabs mejorados, Exportar reportes |
| **4.8.0** | 2025-01-27 | Búsqueda por nombre de grupo, Autocompletado mejorado |
| **4.6.0** | 2025-01-26 | Autenticación para resultados, Protección de rutas |
| **4.5.0** | 2025-01-25 | Mejoras de seguridad y rendimiento |
| **4.0.0** | 2025-01-24 | Rediseño completo del sistema |
| **3.9.0** | 2025-01-23 | Optimizaciones de cubo 3D |
| **3.8.0** | 2025-01-22 | Mejoras en exportación PDF |
| **3.7.0** | 2025-01-21 | Video de fondo, Eliminación de "Acciones Disponibles" |
| **3.6.0** | 2025-01-20 | Video de fondo en landing page |
| **3.5.0** | 2025-01-19 | Mejoras en animaciones del cubo |

> 💡 **Tip**: Usa `latest` para obtener siempre la versión más reciente, o especifica una versión para estabilidad.

## 🔧 Configuración

### Variables de Entorno Requeridas

Crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase Configuration (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Google Analytics (Opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Figma Integration (Opcional - Deprecado)
FIGMA_ACCESS_TOKEN=tu_figma_token
FIGMA_FILE_KEY=tu_figma_file_key
```

### Ejecutar Docker con Variables de Entorno

```bash
# Método 1: Variables en línea
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key \
  -e SUPABASE_SERVICE_ROLE_KEY=tu_service_key \
  gabo9803/integrate:latest

# Método 2: Usando archivo .env
docker run -p 3000:3000 \
  --env-file .env.local \
  gabo9803/integrate:latest
```

### Estructura de Base de Datos (Supabase)

La aplicación requiere las siguientes tablas:

- **admins** - Usuarios administradores
- **groups** - Grupos de participantes
- **submissions** - Respuestas del test
- **landing_content** - Contenido CMS
- **content_history** - Historial de cambios

> 📝 **Nota**: Los esquemas SQL están disponibles en la carpeta `/docs`

## 📦 Stack Tecnológico

### Frontend
- **Framework**: Next.js 15.5.6 (App Router)
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.17
- **3D Graphics**: Three.js 0.180.0, React Three Fiber, React Three Drei
- **Animations**: Framer Motion 12.23.24, GSAP 3.13.0
- **Forms**: React Hook Form 7.66.0
- **State Management**: Zustand 5.0.8
- **Icons**: Lucide React 0.468.0

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes

### Development & Build
- **Language**: TypeScript 5.7.2
- **Package Manager**: npm
- **Containerization**: Docker (Multi-stage builds)
- **Linting**: ESLint 9.17.0
- **CSS Processing**: PostCSS 8.4.49, Autoprefixer 10.4.20

### Analytics & Monitoring
- **Analytics**: Google Analytics 4
- **Status Monitoring**: Custom Status Page (v4.9.0)
- **Error Tracking**: Built-in logging system

### UI Components
- **Component Library**: Radix UI (Dialog, Label, Progress, Tabs)
- **Rich Text Editor**: Tiptap 3.9.1
- **Charts**: Recharts 3.3.0
- **QR Codes**: React QR Code 2.0.18
- **Color Picker**: React Colorful 5.6.1
- **Drag & Drop**: DnD Kit 6.3.1, React Draggable 4.5.0

### Export & Generation
- **PDF**: jsPDF 3.0.3
- **Screenshots**: html2canvas 1.4.1
- **GIF**: gif.js 0.2.0

## 🎨 Áreas de Evaluación

El sistema INTEGRATE evalúa 6 áreas organizativas clave:

### 1. 📋 Estrategia
- Visión y misión organizativa
- Planificación estratégica
- Objetivos y metas
- Alineación organizacional

### 2. 🏗️ Estructura
- Organización interna
- Procesos y procedimientos
- Sistemas de gestión
- Comunicación organizativa

### 3. 📊 Resultados
- Logros y métricas
- KPIs y objetivos cumplidos
- Impacto organizacional
- Retorno de inversión

### 4. ⚡ Eficacia
- Eficiencia operativa
- Productividad
- Optimización de recursos
- Mejora continua

### 5. 💼 Recursos
- Gestión de activos
- Recursos financieros
- Infraestructura
- Tecnología

### 6. 👥 Personas
- Talento humano
- Cultura organizativa
- Desarrollo profesional
- Clima laboral

## 📊 Niveles de Madurez

Cada área se evalúa en una escala de 0 a 4:

| Nivel | Rango | Estado | Descripción |
|-------|-------|--------|-------------|
| 🔴 **Crítico** | 0-1 | Requiere atención inmediata | Área en estado crítico que necesita intervención urgente |
| 🟡 **En Desarrollo** | 1-2 | Necesita mejoras | Área funcional pero con margen significativo de mejora |
| 🟢 **Sólido** | 2-3 | Funcionamiento adecuado | Área bien establecida con procesos consolidados |
| 🔵 **Ejemplar** | 3-4 | Excelencia organizativa | Área de referencia con mejores prácticas implementadas |

### Visualización del Cubo 3D

El cubo interactivo muestra:
- **6 caras**: Una por cada área de evaluación
- **Colores dinámicos**: Según el nivel de madurez
- **Rotación 360°**: Exploración completa de todas las áreas
- **Zoom y pan**: Navegación intuitiva
- **Tooltips informativos**: Detalles al pasar el cursor

## �️ Estructura del Proyecto

```
integrate/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── codigo/                  # Entrada de código
│   ├── test/                    # Cuestionario de 24 preguntas
│   ├── resultado/[code]/        # Resultados con cubo 3D
│   ├── gracias/[code]/          # Página de agradecimiento
│   ├── admin/                   # Panel de administración
│   │   ├── login/              # Login de admin
│   │   ├── cms/                # CMS de contenido
│   │   └── grupo/[id]/         # Detalle de grupo
│   ├── admin-test/             # Status Page (v4.9.0)
│   ├── cookies/                # Política de cookies
│   └── privacidad/             # Política de privacidad
├── components/                  # Componentes React
│   ├── ui/                     # Componentes UI base
│   ├── status/                 # Componentes de Status Page
│   ├── cubo-3d.tsx            # Cubo 3D interactivo
│   ├── group-results-access.tsx # Acceso a resultados
│   └── version-badge.tsx       # Badge de versión
├── lib/                        # Utilidades y helpers
│   ├── supabase/              # Cliente de Supabase
│   ├── status/                # Sistema de monitoreo
│   └── version.ts             # Información de versión
├── public/                     # Archivos estáticos
│   ├── logo/                  # Logos de INTEGRATE
│   ├── fondo-landing.mp4      # Video de fondo
│   └── version.json           # Versión pública
├── docs/                       # Documentación
├── Dockerfile                  # Configuración Docker
└── package.json               # Dependencias del proyecto
```

## 🚀 Funcionalidades Principales

### 1. Sistema de Test
- ✅ 24 preguntas organizadas en 6 áreas
- ✅ 4 sub-áreas por área principal
- ✅ Escala de valoración 0-4
- ✅ Guardado automático de progreso
- ✅ Validación de respuestas

### 2. Visualización de Resultados
- ✅ Cubo 3D interactivo con Three.js
- ✅ Dashboard con gráficos y métricas
- ✅ Análisis por área y sub-área
- ✅ Comparativas de grupo
- ✅ Exportación a PDF, PNG, JPG

### 3. Panel de Administración
- ✅ Gestión de grupos
- ✅ Visualización de resultados
- ✅ CMS para editar contenido
- ✅ Estadísticas y analytics
- ✅ Control de acceso con autenticación

### 4. Status Page (v4.9.0)
- ✅ Monitoreo de 6 servicios críticos
- ✅ Validación de 5 tablas de base de datos
- ✅ Tests funcionales automatizados
- ✅ Exportación de reportes en JSON
- ✅ Auto-refresh cada 30 segundos
- ✅ Diseño Liquid Glass de Apple

### 5. Sistema de Grupos
- ✅ Creación de grupos con código único
- ✅ Búsqueda por código o nombre
- ✅ Autocompletado inteligente
- ✅ Gestión de participantes
- ✅ Resultados agregados

## 📱 Páginas Disponibles

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Landing page principal | Público |
| `/codigo` | Entrada de código de grupo | Público |
| `/test` | Cuestionario de 24 preguntas | Público |
| `/resultado/[code]` | Resultados con cubo 3D | Requiere auth |
| `/gracias/[code]` | Página de agradecimiento | Público |
| `/admin` | Panel de administración | Admin |
| `/admin/login` | Login de administrador | Público |
| `/admin/cms` | CMS de contenido | Admin |
| `/admin/grupo/[id]` | Detalle de grupo | Admin |
| `/admin-test` | Status Page | Admin |
| `/cookies` | Política de cookies | Público |
| `/privacidad` | Política de privacidad | Público |

## �🔗 Enlaces Útiles

- **🐳 Docker Hub**: https://hub.docker.com/r/gabo9803/integrate
- **📦 GitHub Repository**: https://github.com/ferrylinxx/integrate
- **📋 Releases**: https://github.com/ferrylinxx/integrate/releases
- **📚 Documentación**: Ver carpeta `/docs` en el repositorio
- **🎯 Status Page**: `/admin-test` (requiere acceso admin)

## 🎨 Paleta de Colores Corporativos

```css
--color-blue: #2C248E      /* Azul principal */
--color-magenta: #8E235D   /* Magenta */
--color-pink: #D91D5C      /* Rosa */
--color-orange: #E65B3E    /* Naranja */
--color-orange-alt: #F08726 /* Naranja alternativo */
```

## 📝 Licencia

© 2025 INTEGRATE - Todos los derechos reservados

Este software es propiedad de INTEGRATE y está protegido por leyes de derechos de autor.

## 🆘 Soporte y Contacto

Para reportar problemas, solicitar características o consultas:

- **Issues**: https://github.com/ferrylinxx/integrate/issues
- **Email**: Contacta con el equipo de desarrollo
- **Documentación**: Consulta los archivos MD en `/docs`

## 🔄 Historial de Versiones

### v4.9.0 (2025-01-27) - Actual
- 🎨 Status Page rediseñada con Liquid Glass
- 📊 Sistema de tabs mejorado
- 📥 Exportar reportes del sistema
- 📈 Dashboard de métricas rápidas
- 🔄 Auto-refresh con control mejorado

### v4.8.0 (2025-01-27)
- 🔍 Búsqueda por nombre de grupo
- ⌨️ Autocompletado mejorado
- 🎯 Mejoras en UX del landing

### v4.6.0 (2025-01-26)
- 🔐 Autenticación para resultados
- 🔒 Protección de rutas
- 💬 Modal de login mejorado

### v4.0.0 (2025-01-24)
- 🎨 Rediseño completo del sistema
- 🚀 Mejoras de rendimiento
- 📱 Responsive design mejorado

### v3.7.0 (2025-01-21)
- 🎥 Video de fondo en landing
- 🗑️ Eliminación de "Acciones Disponibles"

---

<p align="center">
  <strong>INTEGRATE v4.9.0</strong><br>
  Sistema de Evaluación de Áreas Sensibles<br>
  <em>Última actualización: 2025-01-27</em>
</p>

