# 🐳 Guía de Despliegue con Docker

Esta guía te ayudará a construir, subir y ejecutar la aplicación Test de Nivel CUBO usando Docker y Docker Hub.

---

## 📋 Requisitos Previos

- **Docker** instalado (versión 20.10 o superior)
- **Docker Compose** instalado (versión 2.0 o superior)
- Cuenta en **Docker Hub** (https://hub.docker.com)
- Credenciales de **Supabase** (URL y Anon Key)

---

## 🔧 Configuración Inicial

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

---

## 🏗️ Construir la Imagen Docker

### Opción 1: Build Local Simple

```bash
docker build -t cubo-test-nivel:latest .
```

### Opción 2: Build con Tag para Docker Hub

Reemplaza `tu-usuario` con tu nombre de usuario de Docker Hub:

```bash
docker build -t tu-usuario/cubo-test-nivel:latest .
```

### Opción 3: Build Multi-plataforma (para ARM y x86)

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t tu-usuario/cubo-test-nivel:latest .
```

---

## 🧪 Probar la Imagen Localmente

Antes de subir a Docker Hub, prueba que la imagen funciona correctamente:

```bash
docker run -d \
  --name cubo-test \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-aqui" \
  cubo-test-nivel:latest
```

Verifica que funciona:
```bash
# Ver logs
docker logs cubo-test

# Abrir en navegador
# http://localhost:3000
```

Detener y eliminar el contenedor de prueba:
```bash
docker stop cubo-test
docker rm cubo-test
```

---

## 📤 Subir a Docker Hub

### 1. Iniciar Sesión en Docker Hub

```bash
docker login
```

Ingresa tu nombre de usuario y contraseña de Docker Hub.

### 2. Etiquetar la Imagen (si no lo hiciste en el build)

```bash
docker tag cubo-test-nivel:latest tu-usuario/cubo-test-nivel:latest
```

### 3. Subir la Imagen

```bash
docker push tu-usuario/cubo-test-nivel:latest
```

### 4. (Opcional) Subir con Múltiples Tags

```bash
# Tag con versión específica
docker tag cubo-test-nivel:latest tu-usuario/cubo-test-nivel:v1.0.0
docker push tu-usuario/cubo-test-nivel:v1.0.0

# Tag latest (recomendado)
docker push tu-usuario/cubo-test-nivel:latest
```

---

## 🚀 Ejecutar desde Docker Hub

### Opción 1: Docker Run (Simple)

```bash
docker run -d \
  --name cubo-test-nivel \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-aqui" \
  tu-usuario/cubo-test-nivel:latest
```

### Opción 2: Docker Compose (Recomendado)

1. Crea un archivo `docker-compose.yml` en tu servidor:

```yaml
version: '3.8'

services:
  cubo-app:
    image: tu-usuario/cubo-test-nivel:latest
    container_name: cubo-test-nivel
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
```

2. Ejecuta con Docker Compose:

```bash
docker-compose up -d
```

### Opción 3: Con Archivo .env

1. Crea un archivo `.env` en el mismo directorio que `docker-compose.yml`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

2. Usa el `docker-compose.yml` incluido en el proyecto:

```bash
docker-compose up -d
```

---

## 🔍 Comandos Útiles

### Ver Logs

```bash
# Logs en tiempo real
docker logs -f cubo-test-nivel

# Últimas 100 líneas
docker logs --tail 100 cubo-test-nivel
```

### Verificar Estado

```bash
# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores
docker ps -a

# Inspeccionar contenedor
docker inspect cubo-test-nivel
```

### Detener y Reiniciar

```bash
# Detener
docker stop cubo-test-nivel

# Iniciar
docker start cubo-test-nivel

# Reiniciar
docker restart cubo-test-nivel
```

### Actualizar a Nueva Versión

```bash
# Detener y eliminar contenedor actual
docker-compose down

# Descargar nueva imagen
docker pull tu-usuario/cubo-test-nivel:latest

# Iniciar con nueva imagen
docker-compose up -d
```

### Limpiar Recursos

```bash
# Eliminar contenedor
docker rm -f cubo-test-nivel

# Eliminar imagen local
docker rmi tu-usuario/cubo-test-nivel:latest

# Limpiar imágenes no utilizadas
docker image prune -a
```

---

## 🌐 Configuración con Nginx (Opcional)

Si quieres usar un dominio personalizado con HTTPS:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔒 Seguridad

### Variables de Entorno Sensibles

**NUNCA** incluyas credenciales en el Dockerfile o en el código. Siempre usa variables de entorno:

```bash
# ❌ MAL - No hagas esto
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ✅ BIEN - Pasa variables en tiempo de ejecución
docker run -e NEXT_PUBLIC_SUPABASE_ANON_KEY="..." ...
```

### Secrets con Docker Swarm (Avanzado)

Si usas Docker Swarm, puedes usar secrets:

```bash
echo "tu-anon-key" | docker secret create supabase_anon_key -
```

---

## 📊 Monitoreo y Salud

### Healthcheck

El contenedor incluye un healthcheck automático. Verifica el estado:

```bash
docker inspect --format='{{json .State.Health}}' cubo-test-nivel | jq
```

### Métricas de Recursos

```bash
# Ver uso de recursos
docker stats cubo-test-nivel

# Ver uso de disco
docker system df
```

---

## 🐛 Troubleshooting

### La aplicación no inicia

```bash
# Ver logs detallados
docker logs cubo-test-nivel

# Verificar variables de entorno
docker exec cubo-test-nivel env | grep SUPABASE
```

### Puerto 3000 ya en uso

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "8080:3000"  # Usa puerto 8080 en el host
```

### Imagen muy grande

```bash
# Ver tamaño de la imagen
docker images | grep cubo-test-nivel

# La imagen debería ser ~200-300MB con el build multi-stage
```

---

## 📚 Recursos Adicionales

- [Documentación de Docker](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Next.js con Docker](https://nextjs.org/docs/deployment#docker-image)
- [Supabase Documentation](https://supabase.com/docs)

---

## ✅ Checklist de Despliegue

- [ ] Variables de entorno configuradas
- [ ] Imagen construida localmente
- [ ] Imagen probada localmente
- [ ] Sesión iniciada en Docker Hub
- [ ] Imagen subida a Docker Hub
- [ ] Contenedor ejecutándose desde Docker Hub
- [ ] Aplicación accesible en http://localhost:3000
- [ ] Logs verificados sin errores
- [ ] Healthcheck pasando correctamente

---

**¡Listo!** Tu aplicación Test de Nivel CUBO ahora está desplegada con Docker. 🎉

