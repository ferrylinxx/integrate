# 📝 Sistema CMS - Gestión de Contenido Landing Page

## 🎯 Descripción

Sistema de gestión de contenido (CMS) implementado para la landing page de INTEGRATE 2.0. Permite editar todos los textos de la landing page desde una interfaz web sin necesidad de modificar código fuente.

## ✨ Características

- ✅ **Edición en tiempo real**: Los cambios se reflejan inmediatamente en la landing page
- ✅ **Sin código**: Usuarios no técnicos pueden actualizar contenido
- ✅ **Búsqueda avanzada**: Filtra por sección, clave o contenido
- ✅ **Organizado por secciones**: Contenido agrupado lógicamente
- ✅ **Caché inteligente**: Optimización de rendimiento (5 minutos)
- ✅ **Fallback automático**: Si falla la conexión, usa textos por defecto
- ✅ **Historial de cambios**: Fecha de última actualización visible
- ✅ **Protegido**: Solo administradores autenticados pueden editar

## 🗄️ Estructura de la Base de Datos

### Tabla: `landing_content`

```sql
CREATE TABLE landing_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,           -- Sección de la landing (ej: "hero", "features")
  key TEXT NOT NULL,                -- Clave del texto (ej: "title", "subtitle")
  value TEXT NOT NULL,              -- Contenido del texto
  language TEXT DEFAULT 'es',       -- Idioma (preparado para multiidioma)
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key, language)
);
```

### Índices

- `idx_landing_content_section`: Optimiza búsquedas por sección
- `idx_landing_content_language`: Optimiza búsquedas por idioma

### Políticas de Seguridad (RLS)

- **Lectura pública**: Cualquiera puede leer el contenido
- **Escritura protegida**: Solo usuarios autenticados pueden editar

## 📂 Secciones de Contenido

### 1. **Hero Section** (`hero`)
- `badge_text`: Texto del badge superior
- `title`: Título principal
- `subtitle`: Subtítulo descriptivo
- `cta_primary`: Texto del botón principal
- `cta_secondary`: Texto del botón secundario

### 2. **Estadísticas** (`stats`)
- `organizations`: Número de organizaciones
- `organizations_label`: Etiqueta de organizaciones
- `participants`: Número de participantes
- `participants_label`: Etiqueta de participantes
- `satisfaction`: Porcentaje de satisfacción
- `satisfaction_label`: Etiqueta de satisfacción

### 3. **Características** (`features`, `features_1` - `features_6`)
- `title`: Título de la sección
- `subtitle`: Subtítulo de la sección
- Para cada característica (1-6):
  - `title`: Título de la característica
  - `description`: Descripción de la característica

### 4. **Áreas INTEGRATE** (`areas`, `area_1` - `area_6`)
- `title`: Título de la sección
- `subtitle`: Subtítulo de la sección
- Para cada área (1-6):
  - `title`: Nombre del área
  - `description`: Descripción del área

### 5. **Perspectivas** (`perspectives`)
- `title`: Título de la sección
- `description`: Descripción general
- `perspectives_directive.title`: Título visión directiva
- `perspectives_directive.description`: Descripción visión directiva
- `perspectives_operative.title`: Título experiencia operativa
- `perspectives_operative.description`: Descripción experiencia operativa

### 6. **CTA Final** (`cta`)
- `title`: Título del llamado a la acción
- `description`: Descripción
- `quote`: Frase inspiradora en catalán
- `button`: Texto del botón

### 7. **Footer** (`footer`)
- `description`: Descripción del proyecto
- `quote`: Frase en catalán
- `quick_access_title`: Título de acceso rápido
- `quick_access_test`: Texto enlace test
- `quick_access_admin`: Texto enlace admin
- `info_title`: Título información
- `info_about`: Enlace sobre INTEGRATE
- `info_methodology`: Enlace metodología
- `info_privacy`: Enlace privacidad
- `info_terms`: Enlace términos
- `copyright`: Texto de copyright

## 🚀 Uso del Sistema

### Para Administradores

1. **Acceder al CMS**:
   - Ir a `/admin/login`
   - Iniciar sesión con credenciales de administrador
   - Click en el botón "CMS" en el panel de administración
   - O ir directamente a `/admin/cms`

2. **Editar Contenido**:
   - Buscar el texto que deseas editar (usa la barra de búsqueda)
   - Click en el botón "Editar" del elemento
   - Modificar el texto en el campo de entrada
   - Click en "Guardar" (✓)
   - El cambio se refleja inmediatamente en la landing page

3. **Cancelar Edición**:
   - Click en el botón "X" para cancelar sin guardar

4. **Recargar Contenido**:
   - Click en "Recargar" para obtener los últimos cambios

### Para Desarrolladores

#### Usar el Hook en Componentes

```tsx
import { useLandingContent, getContent } from "@/lib/hooks/use-landing-content";

function MyComponent() {
  const { content, loading, error } = useLandingContent("es");

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>{getContent(content, "hero.title", "Título por defecto")}</h1>
      <p>{getContent(content, "hero.subtitle", "Subtítulo por defecto")}</p>
    </div>
  );
}
```

#### Usar el Wrapper Component

```tsx
import { LandingContentLoader, getContent } from "@/components/landing-content-loader";

export default function Page() {
  return (
    <LandingContentLoader>
      {({ content }) => (
        <main>
          <h1>{getContent(content, "hero.title")}</h1>
        </main>
      )}
    </LandingContentLoader>
  );
}
```

#### Actualizar Contenido Programáticamente

```tsx
import { useUpdateLandingContent } from "@/lib/hooks/use-landing-content";

function AdminComponent() {
  const { updateContent, updating } = useUpdateLandingContent();

  const handleUpdate = async () => {
    const success = await updateContent(
      "hero",           // section
      "title",          // key
      "Nuevo título",   // value
      "es"              // language
    );
    
    if (success) {
      console.log("Actualizado!");
    }
  };

  return <button onClick={handleUpdate}>Actualizar</button>;
}
```

## 🔧 Configuración Técnica

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### Caché

- **Duración**: 5 minutos
- **Ubicación**: Memoria del cliente
- **Invalidación**: Automática al actualizar contenido

### Performance

- Primera carga: ~200-300ms (desde Supabase)
- Cargas subsecuentes: ~0ms (desde caché)
- Actualización: ~100-200ms

## 🎨 Mejoras Futuras

### Corto Plazo
- [ ] Preview de cambios antes de publicar
- [ ] Historial de versiones (rollback)
- [ ] Edición en bloque (múltiples textos a la vez)
- [ ] Exportar/Importar contenido (JSON/CSV)

### Mediano Plazo
- [ ] Multiidioma completo (inglés, catalán)
- [ ] Editor WYSIWYG (rich text)
- [ ] Imágenes y media files
- [ ] Programación de publicaciones

### Largo Plazo
- [ ] A/B Testing de textos
- [ ] Analytics de conversión por texto
- [ ] IA para sugerencias de mejora
- [ ] Colaboración multi-usuario en tiempo real

## 🐛 Troubleshooting

### El contenido no se actualiza

1. Verificar que estás autenticado como admin
2. Limpiar caché del navegador (Ctrl + Shift + R)
3. Verificar conexión a Supabase
4. Revisar consola del navegador para errores

### Error de permisos

1. Verificar que las políticas RLS están activas
2. Confirmar que el usuario está autenticado
3. Revisar que el token de Supabase es válido

### Contenido muestra fallback

1. Verificar conexión a internet
2. Revisar que la tabla `landing_content` existe
3. Confirmar que hay datos en la tabla
4. Verificar variables de entorno

## 📊 Monitoreo

### Métricas Importantes

- Tiempo de carga del contenido
- Tasa de error en actualizaciones
- Frecuencia de ediciones
- Secciones más editadas

### Logs

Los errores se registran en la consola del navegador:
```javascript
console.error("Error en useLandingContent:", error);
console.error("Error al cargar contenido:", error);
console.error("Error al guardar:", error);
```

## 🔒 Seguridad

- ✅ Row Level Security (RLS) habilitado
- ✅ Solo lectura pública
- ✅ Escritura solo para autenticados
- ✅ Validación de entrada en el cliente
- ✅ Sanitización de datos en Supabase

## 📞 Soporte

Para problemas o preguntas:
1. Revisar este README
2. Consultar logs del navegador
3. Verificar documentación de Supabase
4. Contactar al equipo de desarrollo

---

**Última actualización**: 30 de Octubre, 2025
**Versión**: 1.0.0
**Autor**: Equipo INTEGRATE 2.0

