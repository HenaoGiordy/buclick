# Etapa 1: Build
FROM node:18 AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Argumentos de build para variables de entorno
ARG VITE_API_URL
ARG VITE_WS_URL

# Crear archivo .env para el build
RUN echo "VITE_API_URL=$VITE_API_URL" > .env && \
    echo "VITE_WS_URL=$VITE_WS_URL" >> .env

# Compilar aplicación
RUN npm run build

# Etapa 2: Nginx
FROM nginx:bookworm

# Instalar curl para health checks
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Remover configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar archivos build de React (verificar si es dist o build)
COPY --from=builder /app/bienestar /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puertos
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]