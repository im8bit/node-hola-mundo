# =============================================================================
# Stage 1 — Dependencias (builder)
# Usamos la imagen slim de Debian para tener un entorno Linux limpio y ligero
# =============================================================================
FROM node:22.22.1-alpine3.23 AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

ARG IKENV_IMAGE

# Copiamos primero los archivos de manifiesto para aprovechar la caché de capas.
# Si package.json no cambia, Docker reutiliza esta capa en builds posteriores.
COPY package*.json ./

# Instalamos solo las dependencias de producción
RUN npm ci --omit=dev

# =============================================================================
# Stage 2 — Runner (imagen final)
# Partimos de la misma base para mantener consistencia; la imagen final
# NO incluye el caché de npm ni herramientas de build innecesarias.
# =============================================================================
FROM node:22.22.1-alpine3.23 AS runner

RUN apk add --no-cache \
  zlib=1.3.2-r0 \
  libexpat=2.7.5-r0 \
  libpng=1.6.57-r0

# Metadatos del contenedor (estándar OCI)
LABEL org.opencontainers.image.title="node-hola-mundo" \
      org.opencontainers.image.description="Servidor HTTP Hola Mundo con Node.js puro" \
      org.opencontainers.image.version="1.0.0"

# Variables de entorno
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Crear un usuario sin privilegios para mayor seguridad (buena práctica)
RUN groupadd --gid 1001 nodejs \
 && useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home appuser

WORKDIR /app

# Copiar node_modules desde el stage builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar el código fuente
COPY src/ ./src/
COPY package.json ./

# Cambiar al usuario sin privilegios
USER appuser

# Exponer el puerto que usa la aplicación
EXPOSE 3000

# Health check nativo de Docker
# Docker verificará este endpoint cada 30s; tras 3 fallos marca el contenedor como "unhealthy"
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Comando de arranque
CMD ["node", "src/index.js"]
