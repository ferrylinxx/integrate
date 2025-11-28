# 📋 Instrucciones para conectar GitHub con Docker Hub

## ✅ Estado actual:
- ✅ Repositorio Git local inicializado
- ✅ Commit inicial creado (261 archivos, v3.7.0)
- ✅ README.md con logo preparado
- ✅ Usuario Git configurado: ferrylinxx

---

## 🚀 PASO 1: Crear repositorio en GitHub

### Opción A - Desde la web (RECOMENDADO):

1. Ve a: **https://github.com/new**

2. Configura el repositorio:
   - **Repository name**: `integrate`
   - **Description**: `INTEGRATE - Plataforma de diagnóstico organizativo con visualización 3D interactiva`
   - **Visibility**: ✅ Public
   - **NO marques**: "Add a README file" (ya lo tenemos)
   - **NO marques**: "Add .gitignore" (ya lo tenemos)
   - **NO marques**: "Choose a license"

3. Haz clic en **"Create repository"**

4. GitHub te mostrará comandos. **NO los uses todavía**, sigue con el PASO 2.

---

## 🔗 PASO 2: Conectar repositorio local con GitHub

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
# Añadir el repositorio remoto (reemplaza 'ferrylinxx' si tu usuario es diferente)
git remote add origin https://github.com/ferrylinxx/integrate.git

# Renombrar la rama a 'main' (si es necesario)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

**Nota**: GitHub te pedirá autenticación. Usa tu **Personal Access Token** (no tu contraseña).

### Si no tienes un Personal Access Token:
1. Ve a: https://github.com/settings/tokens
2. Click en "Generate new token" → "Generate new token (classic)"
3. Marca: `repo` (Full control of private repositories)
4. Genera el token y **cópialo** (no podrás verlo de nuevo)
5. Úsalo como contraseña cuando Git te lo pida

---

## 🐳 PASO 3: Conectar Docker Hub con GitHub

1. Ve a tu repositorio en Docker Hub:
   **https://hub.docker.com/r/gabo9803/integrate**

2. Haz clic en **"Manage Repository"**

3. Ve a la pestaña **"Builds"** o **"General"**

4. Busca la opción **"Connect to GitHub"** o **"Link to GitHub"**

5. Autoriza a Docker Hub para acceder a tu cuenta de GitHub

6. Selecciona el repositorio: **ferrylinxx/integrate**

7. Configura:
   - **Source Repository**: `ferrylinxx/integrate`
   - **Build Context**: `/`
   - **Dockerfile Location**: `Dockerfile`
   - **Autobuild**: ✅ Activado (opcional, para builds automáticos)

8. Guarda los cambios

---

## 📝 PASO 4: Verificar que el README se muestra en Docker Hub

1. Ve a: **https://hub.docker.com/r/gabo9803/integrate**

2. Deberías ver:
   - ✅ El logo de INTEGRATE en la parte superior
   - ✅ La descripción completa del README.md
   - ✅ Instrucciones de uso
   - ✅ Información de versiones

**Nota**: Docker Hub puede tardar unos minutos en sincronizar el README.

---

## 🔄 PASO 5: Actualizar el README en el futuro

Cada vez que quieras actualizar el README en Docker Hub:

```powershell
# 1. Edita el archivo README.md

# 2. Haz commit
git add README.md
git commit -m "Actualizar README"

# 3. Sube a GitHub
git push origin main
```

Docker Hub sincronizará automáticamente el README desde GitHub.

---

## 🎯 Comandos útiles para el futuro

### Subir cambios a GitHub:
```powershell
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### Ver estado del repositorio:
```powershell
git status
```

### Ver historial de commits:
```powershell
git log --oneline
```

### Crear una nueva versión (tag):
```powershell
git tag -a v3.8.0 -m "Versión 3.8.0"
git push origin v3.8.0
```

---

## ✅ Resultado final esperado:

Después de completar estos pasos:

1. ✅ Tu código estará en GitHub: `https://github.com/ferrylinxx/integrate`
2. ✅ Docker Hub mostrará el README con el logo de INTEGRATE
3. ✅ Cualquier cambio en el README se sincronizará automáticamente
4. ✅ Podrás configurar builds automáticos desde GitHub

---

## 🆘 Problemas comunes:

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/ferrylinxx/integrate.git
```

### Error: "Authentication failed"
- Usa un Personal Access Token en lugar de tu contraseña
- Genera uno en: https://github.com/settings/tokens

### El logo no se muestra en Docker Hub
- Verifica que la ruta en README.md sea correcta
- Espera unos minutos para que Docker Hub sincronice
- Asegúrate de que el archivo existe en: `public/logo/integrate-logo.png`
- **IMPORTANTE**: El nombre del archivo NO debe tener espacios (causa problemas en Docker/Linux)

---

**¿Necesitas ayuda?** Avísame si tienes algún problema en cualquiera de estos pasos.

