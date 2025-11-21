# 📊 DOCUMENTACIÓN COMPLETA DE LA BASE DE DATOS - INTEGRATE 2.0

## 📋 ÍNDICE

1. [Resumen General](#resumen-general)
2. [Tablas de la Base de Datos](#tablas-de-la-base-de-datos)
3. [Relaciones entre Tablas](#relaciones-entre-tablas)
4. [Políticas de Seguridad (RLS)](#políticas-de-seguridad-rls)
5. [Índices](#índices)
6. [Scripts SQL Completos](#scripts-sql-completos)
7. [Datos de Ejemplo](#datos-de-ejemplo)

---

## 📊 RESUMEN GENERAL

### **Sistema:** Test de Áreas Sensibles - Modelo INTEGRATE 2.0
### **Base de Datos:** PostgreSQL (Supabase)
### **Total de Tablas:** 5

| Tabla | Propósito | Registros Aprox. |
|-------|-----------|------------------|
| `admins` | Usuarios administradores del sistema | 1-10 |
| `groups` | Grupos/organizaciones que realizan el test | 10-1000 |
| `submissions` | Respuestas individuales de participantes | 100-10000 |
| `landing_content` | Contenido editable de la landing page | ~45 |
| `content_history` | Historial de cambios del contenido | 100-1000 |

---

## 🗂️ TABLAS DE LA BASE DE DATOS

### **1. TABLA: `admins`**

**Propósito:** Almacena los usuarios administradores que pueden acceder al panel de administración.

**Estructura:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del administrador |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email del administrador (usado para login) |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash de la contraseña (bcrypt) |
| `name` | VARCHAR(255) | NULL | Nombre completo del administrador |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Fecha de creación del registro |

**Ejemplo de datos:**
```sql
INSERT INTO admins (email, password_hash, name) VALUES
('admin@integrate.com', '$2a$10$...', 'Administrador Principal');
```

---

### **2. TABLA: `groups`**

**Propósito:** Almacena los grupos u organizaciones que realizan el test. Cada grupo tiene un código único.

**Estructura:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del grupo |
| `code` | VARCHAR(20) | NOT NULL, UNIQUE | Código único del grupo (ej: "ORG2024") |
| `name` | VARCHAR(255) | NULL | Nombre descriptivo del grupo/organización |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Fecha de creación del grupo |
| `created_by` | UUID | NULL | ID del admin que creó el grupo |

**Ejemplo de datos:**
```sql
INSERT INTO groups (code, name) VALUES
('ORG2024', 'Empresa Ejemplo S.L.'),
('TEAM001', 'Equipo de Marketing');
```

---

### **3. TABLA: `submissions`**

**Propósito:** Almacena las respuestas individuales de cada participante del test.

**Estructura:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único de la respuesta |
| `group_id` | UUID | FOREIGN KEY → groups(id), NULL | Grupo al que pertenece el participante |
| `participant_code` | VARCHAR(20) | NOT NULL, UNIQUE | Código único del participante |
| `answers` | INTEGER[] | NOT NULL | Array de 24 respuestas (valores 1-5) |
| `timestamp` | TIMESTAMPTZ | DEFAULT now() | Fecha y hora de envío |

**Relación:**
- `group_id` → `groups.id` (CASCADE on DELETE)

**Ejemplo de datos:**
```sql
INSERT INTO submissions (group_id, participant_code, answers) VALUES
('uuid-del-grupo', 'PART001', ARRAY[4,5,3,4,5,4,3,5,4,4,5,3,4,5,4,3,5,4,4,5,3,4,5,4]);
```

**Nota:** El array `answers` contiene exactamente 24 valores (6 áreas × 4 preguntas), cada uno entre 1 y 5.

---

### **4. TABLA: `landing_content`**

**Propósito:** Almacena todo el contenido editable de la landing page (textos, títulos, descripciones, etc.).

**Estructura:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del contenido |
| `category` | TEXT | NOT NULL | Categoría (ej: "01_Portada") |
| `section_name` | TEXT | NOT NULL | Nombre de la sección (ej: "Hero Principal") |
| `field_name` | TEXT | NOT NULL | Nombre del campo (ej: "titulo") |
| `field_label` | TEXT | NOT NULL | Etiqueta descriptiva para el CMS |
| `content` | TEXT | NOT NULL | Contenido del campo (texto o HTML) |
| `language` | TEXT | DEFAULT 'es' | Idioma del contenido |
| `display_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `is_active` | BOOLEAN | DEFAULT true | Si el contenido está activo |
| `is_html` | BOOLEAN | DEFAULT false | Si el contenido debe renderizarse como HTML |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Fecha de última actualización |

**Restricción UNIQUE:**
- Combinación única: `(category, section_name, field_name, language)`

**Ejemplo de datos:**
```sql
INSERT INTO landing_content (category, section_name, field_name, field_label, content, is_html) VALUES
('01_Portada', 'Hero Principal', 'titulo', 'Título Principal', 'Descubre las Áreas Sensibles de tu Organización', false),
('07_Footer', 'Copyright', 'texto', 'Texto de Copyright', '<p>© 2025 Integrate - <a href="https://tecnofgb.com">Ferran Garola</a></p>', true);
```

---

### **5. TABLA: `content_history`**

**Propósito:** Almacena el historial de cambios del contenido de la landing page (sistema de versiones).

**Estructura:**

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador único del historial |
| `content_id` | UUID | FOREIGN KEY → landing_content(id), NOT NULL | ID del contenido modificado |
| `content` | TEXT | NOT NULL | Contenido ANTERIOR (antes del cambio) |
| `is_html` | BOOLEAN | DEFAULT false | Si el contenido era HTML |
| `changed_by` | TEXT | NULL | Email del usuario que hizo el cambio |
| `change_description` | TEXT | NULL | Descripción del cambio |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Fecha del cambio |

**Relación:**
- `content_id` → `landing_content.id` (CASCADE on DELETE)

**Ejemplo de datos:**
```sql
INSERT INTO content_history (content_id, content, is_html, changed_by, change_description) VALUES
('uuid-del-contenido', 'Texto anterior', false, 'admin@integrate.com', 'Cambio desde CMS');
```

---

## 🔗 RELACIONES ENTRE TABLAS

### **Diagrama de Relaciones:**

```
┌─────────────┐
│   admins    │
└─────────────┘
       │
       │ created_by (opcional)
       ▼
┌─────────────┐         ┌──────────────────┐
│   groups    │◄────────│   submissions    │
└─────────────┘         └──────────────────┘
    1 : N                   group_id
                           (CASCADE on DELETE)


┌──────────────────┐         ┌──────────────────┐
│ landing_content  │◄────────│ content_history  │
└──────────────────┘         └──────────────────┘
    1 : N                       content_id
                               (CASCADE on DELETE)
```

### **Relaciones Detalladas:**

1. **groups → submissions** (1:N)
   - Un grupo puede tener múltiples respuestas
   - Si se elimina un grupo, se eliminan todas sus respuestas (CASCADE)

2. **landing_content → content_history** (1:N)
   - Un contenido puede tener múltiples versiones en el historial
   - Si se elimina un contenido, se elimina todo su historial (CASCADE)

3. **admins → groups** (1:N, opcional)
   - Un admin puede crear múltiples grupos
   - Relación opcional (created_by puede ser NULL)

---

## 🔒 POLÍTICAS DE SEGURIDAD (RLS)

**Row Level Security (RLS)** está habilitado en todas las tablas.

### **Tabla: `admins`**

| Operación | Política | Condición |
|-----------|----------|-----------|
| SELECT | Allow public read access | `true` (sin restricción) |
| INSERT | Allow public insert access | `true` (sin restricción) |
| UPDATE | Allow public update access | `true` (sin restricción) |
| DELETE | Allow public delete access | `true` (sin restricción) |

**Nota:** En producción, se recomienda restringir estas políticas.

---

### **Tabla: `groups`**

| Operación | Política | Condición |
|-----------|----------|-----------|
| SELECT | Allow public read access | `true` |
| INSERT | Allow public insert | `true` |
| UPDATE | Allow public update | `true` |
| DELETE | Allow public delete | `true` |

---

### **Tabla: `submissions`**

| Operación | Política | Condición |
|-----------|----------|-----------|
| SELECT | Allow public read access | `true` |
| INSERT | Allow public insert | `true` |
| DELETE | Allow public delete | `true` |

**Nota:** No hay política de UPDATE (las respuestas no se modifican).

---

### **Tabla: `landing_content`**

| Operación | Política | Condición |
|-----------|----------|-----------|
| SELECT | Allow public read access | `is_active = true` |
| INSERT | Allow public insert access | `true` |
| UPDATE | Allow public update access | `true` |

**Importante:** Solo se muestran contenidos activos (`is_active = true`).

---

### **Tabla: `content_history`**

| Operación | Política | Condición |
|-----------|----------|-----------|
| SELECT | Permitir lectura pública | `true` |
| INSERT | Permitir inserción | `true` |

**Nota:** No hay UPDATE ni DELETE (el historial es inmutable).

---

## 📑 ÍNDICES

### **Índices por Tabla:**

**`admins`:**
- `admins_pkey` (PRIMARY KEY en `id`)
- `admins_email_key` (UNIQUE en `email`)

**`groups`:**
- `groups_pkey` (PRIMARY KEY en `id`)
- `groups_code_key` (UNIQUE en `code`)
- `idx_groups_code` (INDEX en `code` para búsquedas rápidas)

**`submissions`:**
- `submissions_pkey` (PRIMARY KEY en `id`)
- `submissions_participant_code_key` (UNIQUE en `participant_code`)
- `idx_submissions_group_id` (INDEX en `group_id`)
- `idx_submissions_participant_code` (INDEX en `participant_code`)

**`landing_content`:**
- `landing_content_pkey` (PRIMARY KEY en `id`)
- `landing_content_category_section_name_field_name_language_key` (UNIQUE en combinación)
- `idx_landing_content_category` (INDEX en `category`)
- `idx_landing_content_language` (INDEX en `language`)
- `idx_landing_content_order` (INDEX en `display_order`)
- `idx_landing_content_active` (INDEX en `is_active`)

**`content_history`:**
- `content_history_pkey` (PRIMARY KEY en `id`)
- `idx_content_history_content_id` (INDEX en `content_id`)
- `idx_content_history_created_at` (INDEX en `created_at DESC`)

---

## 💾 SCRIPTS SQL COMPLETOS

Continúa en el siguiente archivo...

