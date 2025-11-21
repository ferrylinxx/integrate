# 📋 INSTRUCCIONES PARA EL INFORMÁTICO - BASE DE DATOS INTEGRATE 2.0

## 🎯 OBJETIVO

Crear una base de datos PostgreSQL completa para el sistema **"Test de Áreas Sensibles - Modelo INTEGRATE 2.0"**.

---

## 📦 ARCHIVOS PROPORCIONADOS

1. **`DOCUMENTACION_BASE_DATOS.md`** - Documentación completa de la estructura
2. **`SCRIPTS_SQL_COMPLETOS.sql`** - Scripts SQL para crear toda la base de datos
3. **`DATOS_EJEMPLO_LANDING_CONTENT.sql`** - Datos iniciales para la landing page
4. **`INSTRUCCIONES_PARA_INFORMATICO.md`** - Este archivo

---

## 🚀 PASOS PARA CREAR LA BASE DE DATOS

### **PASO 1: Crear la Base de Datos**

```sql
-- Conectarse a PostgreSQL como superusuario
-- Crear la base de datos
CREATE DATABASE integrate_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectarse a la nueva base de datos
\c integrate_db
```

---

### **PASO 2: Ejecutar el Script Principal**

```bash
# Ejecutar el script SQL completo
psql -U postgres -d integrate_db -f SCRIPTS_SQL_COMPLETOS.sql
```

**Este script creará:**
- ✅ 5 tablas (`admins`, `groups`, `submissions`, `landing_content`, `content_history`)
- ✅ Todas las restricciones (PRIMARY KEY, FOREIGN KEY, UNIQUE)
- ✅ Todos los índices necesarios
- ✅ Políticas de seguridad (RLS)
- ✅ Triggers para actualizar `updated_at`

---

### **PASO 3: Insertar Datos Iniciales**

```bash
# Insertar datos de ejemplo para la landing page
psql -U postgres -d integrate_db -f DATOS_EJEMPLO_LANDING_CONTENT.sql
```

**Este script insertará:**
- ✅ ~52 registros en `landing_content` con todo el contenido de la landing page

---

### **PASO 4: Crear el Primer Administrador**

```sql
-- IMPORTANTE: Reemplazar 'HASH_DE_CONTRASEÑA' con un hash bcrypt real
-- Puedes generar el hash en: https://bcrypt-generator.com/

INSERT INTO public.admins (email, password_hash, name) VALUES
('admin@integrate.com', '$2a$10$...HASH_AQUI...', 'Administrador Principal');
```

**Ejemplo de cómo generar el hash en Node.js:**
```javascript
const bcrypt = require('bcrypt');
const password = 'tu_contraseña_segura';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

---

### **PASO 5: Verificar la Instalación**

```sql
-- Verificar que todas las tablas se crearon correctamente
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Resultado esperado:
-- admins
-- content_history
-- groups
-- landing_content
-- submissions


-- Verificar que los datos se insertaron
SELECT category, COUNT(*) as total
FROM public.landing_content
GROUP BY category
ORDER BY category;

-- Resultado esperado:
-- 00_Navegación: 3
-- 01_Portada: 5
-- 02_Estadísticas: 6
-- 04_Áreas_INTEGRATE: 14
-- 05_Perspectivas: 6
-- 06_Llamada_a_Acción: 4
-- 07_Footer: 14
```

---

## 🔧 CONFIGURACIÓN ADICIONAL

### **1. Variables de Entorno**

Crear un archivo `.env` con las credenciales de la base de datos:

```env
# Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=integrate_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_segura

# Configuración de Supabase (si se usa)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

---

### **2. Configuración de Supabase (Alternativa)**

Si prefieres usar **Supabase** en lugar de PostgreSQL local:

1. **Crear proyecto en Supabase:**
   - Ve a https://supabase.com
   - Crea un nuevo proyecto
   - Anota la URL y la clave anónima

2. **Ejecutar scripts en Supabase:**
   - Ve a "SQL Editor" en el panel de Supabase
   - Copia y pega el contenido de `SCRIPTS_SQL_COMPLETOS.sql`
   - Ejecuta el script
   - Repite con `DATOS_EJEMPLO_LANDING_CONTENT.sql`

3. **Configurar RLS:**
   - Las políticas RLS ya están incluidas en el script
   - Verifica que estén activas en "Authentication" > "Policies"

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

### **Resumen de Tablas:**

| Tabla | Propósito | Registros Esperados |
|-------|-----------|---------------------|
| `admins` | Usuarios administradores | 1-10 |
| `groups` | Grupos/organizaciones | 10-1000 |
| `submissions` | Respuestas de participantes | 100-10000 |
| `landing_content` | Contenido de la landing page | ~52 |
| `content_history` | Historial de cambios | 100-1000 |

---

### **Relaciones:**

```
admins (1) ──────> (N) groups
groups (1) ──────> (N) submissions
landing_content (1) ──────> (N) content_history
```

---

## 🔒 SEGURIDAD

### **1. Row Level Security (RLS)**

Todas las tablas tienen RLS habilitado con políticas públicas.

**⚠️ IMPORTANTE PARA PRODUCCIÓN:**

Las políticas actuales permiten acceso público. Para producción, se recomienda:

```sql
-- Ejemplo: Restringir UPDATE de admins solo a usuarios autenticados
DROP POLICY "Allow public update access to admins" ON public.admins;

CREATE POLICY "Allow authenticated update to admins"
    ON public.admins FOR UPDATE
    USING (auth.uid() = id);
```

---

### **2. Contraseñas**

- ✅ Las contraseñas se almacenan como **hash bcrypt**
- ✅ Nunca almacenar contraseñas en texto plano
- ✅ Usar un salt de al menos 10 rondas

---

### **3. Backup**

Configurar backups automáticos:

```bash
# Backup manual
pg_dump -U postgres integrate_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
psql -U postgres integrate_db < backup_20251030.sql
```

---

## 🧪 PRUEBAS

### **1. Insertar un Grupo de Prueba**

```sql
INSERT INTO public.groups (code, name) VALUES
('TEST2024', 'Grupo de Prueba');
```

---

### **2. Insertar una Respuesta de Prueba**

```sql
-- Primero, obtener el ID del grupo
SELECT id FROM public.groups WHERE code = 'TEST2024';

-- Insertar respuesta (reemplazar 'uuid-del-grupo' con el ID real)
INSERT INTO public.submissions (group_id, participant_code, answers) VALUES
('uuid-del-grupo', 'PART001', ARRAY[4,5,3,4,5,4,3,5,4,4,5,3,4,5,4,3,5,4,4,5,3,4,5,4]);
```

---

### **3. Editar Contenido de la Landing Page**

```sql
-- Actualizar el título principal
UPDATE public.landing_content
SET content = 'Nuevo Título de Prueba',
    updated_at = now()
WHERE category = '01_Portada' 
  AND section_name = 'Hero Principal' 
  AND field_name = 'titulo';
```

---

## 📈 OPTIMIZACIÓN

### **1. Índices**

Todos los índices necesarios ya están creados. Si necesitas más:

```sql
-- Ejemplo: Índice para búsquedas por timestamp
CREATE INDEX idx_submissions_timestamp 
ON public.submissions(timestamp DESC);
```

---

### **2. Vacuuming**

Configurar auto-vacuum para mantener el rendimiento:

```sql
ALTER TABLE public.submissions 
SET (autovacuum_vacuum_scale_factor = 0.1);
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### **Error: "relation already exists"**

```sql
-- Eliminar todas las tablas y empezar de nuevo
DROP TABLE IF EXISTS public.content_history CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.landing_content CASCADE;
DROP TABLE IF EXISTS public.groups CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;

-- Volver a ejecutar SCRIPTS_SQL_COMPLETOS.sql
```

---

### **Error: "permission denied"**

```sql
-- Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE integrate_db TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

---

### **Error: "extension does not exist"**

```sql
-- Instalar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

## 📞 CONTACTO

Si tienes dudas o problemas durante la instalación:

1. Revisa la documentación completa en `DOCUMENTACION_BASE_DATOS.md`
2. Verifica los logs de PostgreSQL
3. Contacta con el desarrollador del proyecto

---

## ✅ CHECKLIST FINAL

Antes de dar por terminada la instalación, verifica:

- [ ] Base de datos `integrate_db` creada
- [ ] 5 tablas creadas correctamente
- [ ] Datos iniciales insertados en `landing_content`
- [ ] Al menos 1 administrador creado en `admins`
- [ ] RLS habilitado en todas las tablas
- [ ] Índices creados correctamente
- [ ] Triggers funcionando (verificar `updated_at`)
- [ ] Backup configurado
- [ ] Variables de entorno configuradas
- [ ] Conexión desde la aplicación funcionando

---

**¡Listo! La base de datos está completamente configurada y lista para usar.** 🚀

---

**Fecha de creación:** 30 de octubre de 2025  
**Versión:** INTEGRATE 2.0 - Database v1.0

