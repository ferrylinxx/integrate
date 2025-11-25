# 🚀 CONFIGURACIÓN DE SUPABASE - PASO A PASO

## PASO 1: Crear Cuenta en Supabase

1. Ve a https://supabase.com
2. Haz clic en "Start your project"
3. Inicia sesión con GitHub, Google o Email

## PASO 2: Crear Nuevo Proyecto

1. Haz clic en "New Project"
2. Completa los datos:
   - **Name**: `cubo-test-nivel` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura (¡GUÁRDALA!)
   - **Region**: Elige la más cercana (Europe West recomendado para España)
   - **Pricing Plan**: Free (suficiente para empezar)
3. Haz clic en "Create new project"
4. Espera 2-3 minutos mientras se crea el proyecto

## PASO 3: Obtener las Credenciales

1. Una vez creado el proyecto, ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API** en el submenú
3. Encontrarás:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGc...` (clave pública)
   - **service_role**: `eyJhbGc...` (clave privada - ¡NO COMPARTIR!)

## PASO 4: Configurar Variables de Entorno

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Copia el contenido de `.env.local.example`
3. Reemplaza los valores con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## PASO 5: Crear las Tablas en Supabase

1. Ve a **SQL Editor** en el menú lateral de Supabase
2. Haz clic en "New query"
3. Copia y pega el siguiente SQL:

```sql
-- Tabla de grupos
CREATE TABLE groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID
);

-- Tabla de respuestas/submissions
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  participant_code VARCHAR(20) UNIQUE NOT NULL,
  answers INTEGER[] NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de administradores
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_submissions_group_id ON submissions(group_id);
CREATE INDEX idx_submissions_participant_code ON submissions(participant_code);
CREATE INDEX idx_groups_code ON groups(code);

-- Habilitar Row Level Security (RLS)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para groups
-- Permitir lectura pública de grupos (para validar códigos)
CREATE POLICY "Allow public read access to groups"
  ON groups FOR SELECT
  USING (true);

-- Solo administradores pueden crear/modificar grupos
CREATE POLICY "Allow authenticated users to insert groups"
  ON groups FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update groups"
  ON groups FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete groups"
  ON groups FOR DELETE
  USING (auth.role() = 'authenticated');

-- Políticas de seguridad para submissions
-- Permitir a cualquiera crear submissions
CREATE POLICY "Allow public insert to submissions"
  ON submissions FOR INSERT
  WITH CHECK (true);

-- Permitir lectura pública de submissions (para ver resultados)
CREATE POLICY "Allow public read access to submissions"
  ON submissions FOR SELECT
  USING (true);

-- Solo administradores pueden eliminar submissions
CREATE POLICY "Allow authenticated users to delete submissions"
  ON submissions FOR DELETE
  USING (auth.role() = 'authenticated');

-- Políticas de seguridad para admins
-- Solo administradores pueden ver otros administradores
CREATE POLICY "Allow authenticated users to read admins"
  ON admins FOR SELECT
  USING (auth.role() = 'authenticated');
```

4. Haz clic en "Run" (▶️) para ejecutar el SQL
5. Deberías ver el mensaje "Success. No rows returned"

## PASO 6: Verificar las Tablas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver 3 tablas:
   - `groups`
   - `submissions`
   - `admins`
3. Haz clic en cada una para verificar que tienen las columnas correctas

## PASO 7: Crear un Grupo de Prueba

1. En **Table Editor**, selecciona la tabla `groups`
2. Haz clic en "Insert row"
3. Completa:
   - **code**: `TEST2024`
   - **name**: `Grupo de Prueba`
4. Haz clic en "Save"

## PASO 8: Reiniciar el Servidor de Desarrollo

1. Detén el servidor actual (Ctrl+C en la terminal)
2. Ejecuta: `npm run dev`
3. El servidor ahora cargará las variables de entorno

## ✅ VERIFICACIÓN

Para verificar que todo funciona:

1. Abre la consola del navegador (F12)
2. Ejecuta:
```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```
3. Deberías ver tu URL de Supabase

## 🔒 SEGURIDAD

**IMPORTANTE**:
- ✅ El archivo `.env.local` está en `.gitignore` (no se sube a GitHub)
- ✅ NUNCA compartas tu `SUPABASE_SERVICE_ROLE_KEY`
- ✅ La `NEXT_PUBLIC_SUPABASE_ANON_KEY` es segura para usar en el cliente
- ✅ Las políticas RLS protegen los datos

## 📞 SIGUIENTE PASO

Una vez completados estos pasos, avísame y continuaremos con:
- Crear el cliente de Supabase en el proyecto
- Crear las funciones de API
- Migrar las páginas para usar Supabase

---

**¿Necesitas ayuda?** Revisa la documentación oficial: https://supabase.com/docs

