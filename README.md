# 🚀 Node.js Hola Mundo — Docker

Servidor HTTP minimalista escrito con la API nativa de Node.js, sin frameworks externos. Listo para ejecutarse como contenedor Docker sobre Linux.

## Estructura del proyecto

```
node-hola-mundo/
├── src/
│   └── index.js        # Servidor HTTP principal
├── .dockerignore       # Archivos excluidos del contexto de build
├── .gitignore
├── Dockerfile          # Imagen multi-stage sobre Debian (bookworm-slim)
├── package.json
└── README.md
```

## Requisitos

- [Node.js](https://nodejs.org/) >= 18 (solo para ejecución local)
- [Docker](https://www.docker.com/) >= 20

---

## Ejecución local (sin Docker)

```bash
npm start
```

O en modo watch (recarga automática con Node.js >= 18):

```bash
npm run dev
```

Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

---

## Ejecución con Docker

### 1. Construir la imagen

```bash
docker build -t node-hola-mundo .
```

### 2. Correr el contenedor

```bash
docker run -d -p 3000:3000 --name hola-mundo node-hola-mundo
```

Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

### 3. Comandos útiles

```bash
# Ver logs del contenedor
docker logs hola-mundo

# Verificar estado del health check
docker inspect --format='{{.State.Health.Status}}' hola-mundo

# Detener y eliminar el contenedor
docker stop hola-mundo && docker rm hola-mundo
```

---

## Variables de entorno

| Variable | Descripción             | Valor por defecto |
|----------|-------------------------|-------------------|
| `PORT`   | Puerto del servidor HTTP | `3000`            |
| `HOST`   | Interfaz de escucha      | `0.0.0.0`         |

Ejemplo con puerto personalizado:

```bash
docker run -d -p 8080:8080 -e PORT=8080 --name hola-mundo node-hola-mundo
```

---

## Endpoints

| Endpoint  | Descripción                              |
|-----------|------------------------------------------|
| `GET /`   | Página principal con el Hola Mundo       |
| `GET /health` | Health check en JSON (`{ status, uptime }`) |

---

## Detalles del Dockerfile

- **Base**: `node:20-bookworm-slim` (Debian Bookworm, imagen ligera)
- **Multi-stage build**: separa la instalación de dependencias del artefacto final
- **Usuario sin privilegios**: el proceso corre como `appuser` (UID 1001), no como root
- **HEALTHCHECK** nativo de Docker integrado
- **Cache de capas**: `package.json` se copia antes que el código fuente para maximizar el uso de caché

---

## Licencia

MIT
