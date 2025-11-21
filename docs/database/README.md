# 📊 DOCUMENTACIÓN DE LA BASE DE DATOS - INTEGRATE 2.0

Esta carpeta contiene toda la documentación necesaria para crear y configurar la base de datos del sistema **Test de Áreas Sensibles - Modelo INTEGRATE 2.0**.

---

## 📁 ARCHIVOS INCLUIDOS

### **1. INSTRUCCIONES_PARA_INFORMATICO.md** 🚀
**Empieza por aquí**

Guía paso a paso para el informático que va a crear la base de datos.

**Contenido:**
- Pasos de instalación
- Configuración de PostgreSQL o Supabase
- Variables de entorno
- Pruebas y verificación
- Solución de problemas
- Checklist final

---

### **2. SCRIPTS_SQL_COMPLETOS.sql** 💾
**Script principal de creación**

Script SQL completo para crear toda la estructura de la base de datos.

**Incluye:**
- Creación de 5 tablas
- Restricciones (PRIMARY KEY, FOREIGN KEY, UNIQUE)
- Índices para optimización
- Políticas RLS (Row Level Security)
- Triggers automáticos
- Comentarios explicativos

**Uso:**
```bash
psql -U postgres -d integrate_db -f SCRIPTS_SQL_COMPLETOS.sql
```

---

### **3. DATOS_EJEMPLO_LANDING_CONTENT.sql** 📝
**Datos iniciales**

Script SQL con ~52 registros de ejemplo para la tabla `landing_content`.

**Incluye:**
- Todo el contenido inicial de la landing page
- Organizado por categorías (Navegación, Portada, Áreas, Footer, etc.)
- Ejemplos de texto plano y HTML

**Uso:**
```bash
psql -U postgres -d integrate_db -f DATOS_EJEMPLO_LANDING_CONTENT.sql
```

---

### **4. DOCUMENTACION_BASE_DATOS.md** 📖
**Documentación técnica completa**

Documentación detallada de toda la estructura de la base de datos.

**Contenido:**
- Descripción de las 5 tablas
- Tipos de datos y restricciones
- Relaciones entre tablas
- Políticas de seguridad (RLS)
- Índices
- Diagramas de relaciones

---

## 🗂️ ESTRUCTURA DE LA BASE DE DATOS

### **5 Tablas Principales:**

| Tabla | Propósito | Registros |
|-------|-----------|-----------|
| `admins` | Usuarios administradores | 1-10 |
| `groups` | Grupos/organizaciones | 10-1000 |
| `submissions` | Respuestas del test | 100-10000 |
| `landing_content` | Contenido de la web | ~52 |
| `content_history` | Historial de cambios | 100-1000 |

---

## 🚀 INICIO RÁPIDO

### **Opción 1: PostgreSQL Local**

```bash
# 1. Crear base de datos
createdb integrate_db

# 2. Ejecutar script principal
psql -d integrate_db -f SCRIPTS_SQL_COMPLETOS.sql

# 3. Insertar datos iniciales
psql -d integrate_db -f DATOS_EJEMPLO_LANDING_CONTENT.sql
```

---

### **Opción 2: Supabase**

1. Crear proyecto en https://supabase.com
2. Ir a "SQL Editor"
3. Copiar y pegar el contenido de `SCRIPTS_SQL_COMPLETOS.sql`
4. Ejecutar
5. Copiar y pegar el contenido de `DATOS_EJEMPLO_LANDING_CONTENT.sql`
6. Ejecutar

---

## 📋 ORDEN DE LECTURA RECOMENDADO

1. **`README.md`** (este archivo) - Visión general
2. **`INSTRUCCIONES_PARA_INFORMATICO.md`** - Guía de instalación
3. **`SCRIPTS_SQL_COMPLETOS.sql`** - Revisar el código SQL
4. **`DATOS_EJEMPLO_LANDING_CONTENT.sql`** - Ver los datos de ejemplo
5. **`DOCUMENTACION_BASE_DATOS.md`** - Consulta técnica detallada

---

## 🔗 RELACIONES ENTRE TABLAS

```
admins (1) ──────> (N) groups
groups (1) ──────> (N) submissions
landing_content (1) ──────> (N) content_history
```

---

## 🔒 SEGURIDAD

- ✅ Row Level Security (RLS) habilitado en todas las tablas
- ✅ Contraseñas almacenadas como hash bcrypt
- ✅ Políticas de acceso configuradas
- ⚠️ **Importante:** Las políticas actuales son públicas. Para producción, restringir según necesidades.

---

## 📞 SOPORTE

Para dudas o problemas:
1. Consulta `INSTRUCCIONES_PARA_INFORMATICO.md`
2. Revisa `DOCUMENTACION_BASE_DATOS.md`
3. Contacta con el desarrollador del proyecto

---

## ✅ CHECKLIST DE INSTALACIÓN

- [ ] Base de datos creada
- [ ] Script principal ejecutado
- [ ] Datos iniciales insertados
- [ ] Primer administrador creado
- [ ] Variables de entorno configuradas
- [ ] Conexión desde la aplicación funcionando

---

**Fecha de creación:** 30 de octubre de 2025  
**Versión:** INTEGRATE 2.0 - Database v1.0  
**Desarrollado por:** Ferran Garola Bonilla

