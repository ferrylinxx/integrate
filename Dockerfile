# Dockerfile optimizado para Next.js 15 en producción
# Basado en las mejores prácticas de Next.js
# Versión: 4.2.0

# ============================================
# Etapa 1: Dependencias
# ============================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# ============================================
# Etapa 2: Builder
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno necesarias para el build
# Estas se pueden sobrescribir en tiempo de ejecución
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SUPABASE_URL=https://irnaqjodmnwxwaepoybm.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFxam9kbW53eHdhZXBveWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1OTc3ODYsImV4cCI6MjA3NzE3Mzc4Nn0.QdKC7mKBGHeppWRxYnIrX3vVIR0VQv2lEffGecRHKH4

# Build de la aplicación
RUN npm run build

# ============================================
# Etapa 3: Runner (Producción)
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# IMPORTANTE: Copiar archivos públicos ANTES del standalone
# Next.js standalone NO incluye la carpeta public automáticamente
COPY --from=builder /app/public ./public

# Copiar archivos de build
# Next.js genera automáticamente un standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Asegurar permisos correctos para todos los archivos
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicio
CMD ["node", "server.js"]

