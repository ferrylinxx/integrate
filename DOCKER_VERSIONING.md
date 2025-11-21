# 🐳 Docker Versionado - INTEGRATE 2.0

## 📋 Descripción

Este documento describe cómo construir y publicar imágenes Docker con versionado semántico para el proyecto INTEGRATE 2.0.

---

## 🚀 Uso Rápido

### **Linux/Mac:**
```bash
chmod +x docker-build.sh
./docker-build.sh 2.0.0
```

### **Windows (PowerShell):**
```powershell
.\docker-build.ps1 2.0.0
```

---

## 📦 Versionado Semántico

El proyecto utiliza **versionado semántico** (SemVer) con el formato: `MAJOR.MINOR.PATCH`

### **Formato:** `X.Y.Z`

- **X (MAJOR):** Cambios incompatibles con versiones anteriores
- **Y (MINOR):** Nueva funcionalidad compatible con versiones anteriores
- **Z (PATCH):** Correcciones de bugs compatibles con versiones anteriores

### **Ejemplos:**
- `2.0.0` - Versión inicial de producción
- `2.1.0` - Nueva funcionalidad (ej: campo de nombre de usuario)
- `2.1.1` - Corrección de bug (ej: logo no se muestra en Docker)
- `3.0.0` - Cambio mayor incompatible (ej: nueva arquitectura)

---

## 🛠️ Scripts Disponibles

### **1. docker-build.sh (Linux/Mac)**

Script Bash para construir y publicar imágenes Docker.

**Características:**
- ✅ Validación de formato de versión
- ✅ Confirmación antes de build
- ✅ Build con dos tags: `v{VERSION}` y `latest`
- ✅ Push automático a Docker Hub
- ✅ Mensajes con colores para mejor legibilidad
- ✅ Manejo de errores

**Uso:**
```bash
./docker-build.sh <version>
```

**Ejemplo:**
```bash
./docker-build.sh 2.0.0
```

### **2. docker-build.ps1 (Windows)**

Script PowerShell equivalente para Windows.

**Uso:**
```powershell
.\docker-build.ps1 <version>
```

**Ejemplo:**
```powershell
.\docker-build.ps1 2.0.0
```

### **3. docker-verify-tags.sh (Linux/Mac) - NUEVO ✨**

Script para verificar que los tags existen en Docker Hub.

**Características:**
- ✅ Verifica tags locales
- ✅ Verifica tags en Docker Hub con `docker pull`
- ✅ Compara Image IDs
- ✅ Reporte detallado con colores

**Uso:**
```bash
chmod +x docker-verify-tags.sh
./docker-verify-tags.sh <version>
```

**Ejemplo:**
```bash
./docker-verify-tags.sh 2.0.0
```

### **4. docker-verify-tags.ps1 (Windows) - NUEVO ✨**

Script PowerShell para verificar tags en Windows.

**Uso:**
```powershell
.\docker-verify-tags.ps1 <version>
```

**Ejemplo:**
```powershell
.\docker-verify-tags.ps1 2.0.0
```

---

## 📝 Proceso Manual (Sin Scripts)

Si prefieres ejecutar los comandos manualmente:

### **1. Build de la imagen:**
```bash
docker build -t gabo9803/integrate-cubo-test:v2.0.0 -t gabo9803/integrate-cubo-test:latest .
```

### **2. Push de la versión específica:**
```bash
docker push gabo9803/integrate-cubo-test:v2.0.0
```

### **3. Push de latest:**
```bash
docker push gabo9803/integrate-cubo-test:latest
```

---

## 🏷️ Tags Disponibles

Cada build genera **dos tags**:

1. **Versión específica:** `gabo9803/integrate-cubo-test:v{VERSION}`
   - Ejemplo: `gabo9803/integrate-cubo-test:v2.0.0`
   - Uso: Para producción estable

2. **Latest:** `gabo9803/integrate-cubo-test:latest`
   - Siempre apunta a la última versión publicada
   - Uso: Para desarrollo y testing

---

## ✅ Verificación de Tags en Docker Hub

### **⚠️ IMPORTANTE: Sobre la visualización de tags en Docker Hub**

Cuando construyes una imagen con múltiples tags (`-t image:v2.0.0 -t image:latest`), Docker crea **UNA SOLA IMAGEN** con múltiples etiquetas que apuntan al mismo Image ID.

**Esto significa:**
- ✅ Ambos tags (`v2.0.0` y `latest`) existen y funcionan correctamente
- ⚠️ La interfaz web de Docker Hub puede mostrar solo uno de los tags visualmente
- ✅ Ambos tags están disponibles para `docker pull` y funcionan perfectamente

### **Método 1: Verificar tags localmente**

Después de ejecutar el script, verifica que ambos tags existen localmente:

```bash
docker images gabo9803/integrate-cubo-test
```

**Salida esperada:**
```
REPOSITORY                        TAG       IMAGE ID       CREATED         SIZE
gabo9803/integrate-cubo-test      v2.0.0    abc123def456   2 minutes ago   180MB
gabo9803/integrate-cubo-test      latest    abc123def456   2 minutes ago   180MB
```

**Nota:** Ambos tags tienen el **mismo IMAGE ID** porque son la misma imagen.

### **Método 2: Verificar tags en Docker Hub (CLI)**

Usa `docker pull` para verificar que ambos tags existen en Docker Hub:

```bash
# Verificar tag versionado
docker pull gabo9803/integrate-cubo-test:v2.0.0

# Verificar tag latest
docker pull gabo9803/integrate-cubo-test:latest
```

Si ambos comandos funcionan sin error, **ambos tags existen en Docker Hub**.

### **Método 3: Verificar tags en Docker Hub (Web)**

1. Visita: https://hub.docker.com/r/gabo9803/integrate-cubo-test/tags
2. Busca el tag `v2.0.0` en la lista
3. Busca el tag `latest` en la lista

**Nota:** Si solo ves `latest` en la interfaz web pero `docker pull gabo9803/integrate-cubo-test:v2.0.0` funciona, **el tag existe** - es solo una limitación de la UI de Docker Hub.

### **Método 4: Usar Docker Hub API**

```bash
# Listar todos los tags disponibles
curl -s https://hub.docker.com/v2/repositories/gabo9803/integrate-cubo-test/tags/ | jq '.results[].name'
```

**Salida esperada:**
```json
"latest"
"v2.0.0"
"v1.0.0"
```

---

## 🔄 Workflow Recomendado

### **Paso 1: Actualizar versión en el código**

Edita `lib/version.ts`:
```typescript
export const APP_VERSION = "2.0.0";
export const APP_VERSION_LABEL = "v2.0.0 · Inestable";
```

### **Paso 2: Commit de cambios**
```bash
git add .
git commit -m "chore: bump version to 2.0.0"
git tag v2.0.0
git push origin main --tags
```

### **Paso 3: Build y push de Docker**
```bash
./docker-build.sh 2.0.0
```

### **Paso 4: Verificar que los tags existen (RECOMENDADO) ✨**

**Opción A: Usar script de verificación (recomendado)**
```bash
./docker-verify-tags.sh 2.0.0
```

**Opción B: Verificación manual**
```bash
# Verificar tag versionado
docker pull gabo9803/integrate-cubo-test:v2.0.0

# Verificar tag latest
docker pull gabo9803/integrate-cubo-test:latest

# Verificar que ambos tienen el mismo Image ID
docker images gabo9803/integrate-cubo-test
```

### **Paso 5: Verificar en Docker Hub (opcional)**

Visita: https://hub.docker.com/r/gabo9803/integrate-cubo-test/tags

**Nota:** Si solo ves `latest` en la UI web pero el script de verificación pasa, **todo está correcto** ✅

---

## 🎯 Ejecutar Imagen Específica

### **Versión específica:**
```bash
docker run -p 3000:3000 gabo9803/integrate-cubo-test:v2.0.0
```

### **Última versión (latest):**
```bash
docker run -p 3000:3000 gabo9803/integrate-cubo-test:latest
```

### **Con variables de entorno:**
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key \
  gabo9803/integrate-cubo-test:v2.0.0
```

---

## 📊 Historial de Versiones

| Versión | Fecha | Cambios Principales |
|---------|-------|---------------------|
| v2.2.0 | 2025-01-17 | • Sistema CMS multi-página<br>• Indicador de versión en todas las páginas<br>• Nuevas tablas de contenido<br>• Panel CMS con tabs |
| v2.1.0 | 2025-01-16 | • Eliminación del cubo 3D<br>• Optimización mobile-first<br>• Colores INTEGRATE |
| v2.0.0 | 2025-01-15 | • Campo de nombre de usuario<br>• QR code reducido<br>• Logo corregido en Docker<br>• Scripts de versionado |
| v1.0.0 | 2025-01-10 | • Versión inicial de producción |

---

## ⚠️ Notas Importantes

1. **Autenticación Docker Hub:**
   - Asegúrate de estar autenticado: `docker login`
   - Usuario: `gabo9803`

2. **Permisos de Scripts (Linux/Mac):**
   ```bash
   chmod +x docker-build.sh
   ```

3. **Política de Ejecución (Windows):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. **Tamaño de Imagen:**
   - La imagen optimizada pesa ~150-200 MB
   - Usa multi-stage build para minimizar tamaño

5. **Cache de Docker:**
   - Para forzar rebuild sin cache: `docker build --no-cache ...`

---

## 🐛 Troubleshooting

### **Problema: "Solo veo el tag 'latest' en Docker Hub, no veo 'v2.0.0'"**

**Causa:** Docker Hub UI puede mostrar solo un tag cuando múltiples tags apuntan a la misma imagen.

**Solución:**
1. **Verifica que el tag existe con `docker pull`:**
   ```bash
   docker pull gabo9803/integrate-cubo-test:v2.0.0
   ```
   Si funciona sin error, **el tag existe** ✅

2. **Verifica localmente:**
   ```bash
   docker images gabo9803/integrate-cubo-test
   ```
   Deberías ver ambos tags con el mismo IMAGE ID

3. **Usa la API de Docker Hub:**
   ```bash
   curl -s https://hub.docker.com/v2/repositories/gabo9803/integrate-cubo-test/tags/ | jq '.results[].name'
   ```
   Esto lista TODOS los tags disponibles

**Conclusión:** Si `docker pull` funciona, el tag existe y está disponible para uso, independientemente de lo que muestre la UI web.

---

### **Error: "permission denied"**
```bash
chmod +x docker-build.sh
```

### **Error: "docker: command not found"**
- Instala Docker Desktop
- Verifica que Docker esté en el PATH

### **Error: "denied: requested access to the resource is denied"**
```bash
docker login
# Ingresa usuario: gabo9803
# Ingresa contraseña
```

### **Error: "logo no se muestra en Docker"**
- Verifica que `public/logo/` existe
- Verifica que el Dockerfile copia `public` correctamente
- Rebuild la imagen: `./docker-build.sh 2.0.1`

### **Error: "The push refers to repository does not exist"**
- Verifica que el nombre de la imagen es correcto
- Verifica que estás autenticado: `docker login`
- Verifica que tienes permisos para pushear al repositorio

---

## 📚 Referencias

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Semantic Versioning](https://semver.org/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)

---

## 📞 Soporte

Para problemas o preguntas:
- Revisa este documento
- Consulta los logs de Docker: `docker logs <container_id>`
- Verifica el Dockerfile y next.config.ts

---

**Última actualización:** 2025-01-17
**Versión del documento:** 1.2.0

---

## 📝 Historial de Versiones de la Aplicación

### **v2.2.0** (2025-01-17) - Estable
**Cambios:**
- ✅ Indicador de versión añadido en todas las páginas internas
- ✅ Sistema CMS multi-página implementado
- ✅ Nuevas tablas de contenido: test_content, results_content, admin_content, code_entry_content
- ✅ Panel de administración CMS con tabs para cada página
- ✅ Hooks genéricos para gestión de contenido por página
- ✅ Datos iniciales (seed data) para todas las tablas CMS
- ✅ Componente VersionBadge reutilizable

**Tags Docker:**
- `gabo9803/integrate-cubo-test:v2.2.0`
- `gabo9803/integrate-cubo-test:latest`

**Comando de build:**
```bash
./docker-build.sh 2.2.0
```

---

### **v2.1.0** (2025-01-16) - Estable
**Cambios:**
- ✅ Eliminación del cubo 3D interactivo (simplificación)
- ✅ Vista de lista como única opción de visualización
- ✅ Optimización mobile-first completa del test
- ✅ Aplicación de colores INTEGRATE en toda la experiencia
- ✅ Mejora de rendimiento en dispositivos móviles
- ✅ Botones táctiles optimizados (≥48px)
- ✅ Animaciones y transiciones suaves

**Tags Docker:**
- `gabo9803/integrate-cubo-test:v2.1.0`

---

### **v2.0.0** (2025-01-15) - Inestable
**Cambios:**
- ✅ Campo de nombre de usuario añadido
- ✅ QR code reducido y simplificado
- ✅ Logo corregido en Docker
- ✅ Scripts de versionado implementados
- ✅ Funcionalidad de eliminar participantes
- ✅ Mejora en visualización de nombres de usuario

**Tags Docker:**
- `gabo9803/integrate-cubo-test:v2.0.0`

---

### **v1.3.0** (2025-01-10) - Inicial
**Cambios:**
- ✅ Versión inicial de producción
- ✅ Sistema de test INTEGRATE completo
- ✅ Panel de administración
- ✅ Visualización de resultados con cubo 3D

**Tags Docker:**
- `gabo9803/integrate-cubo-test:v1.3.0`

