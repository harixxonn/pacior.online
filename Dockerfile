FROM node:18-alpine AS build
WORKDIR /app

# Opcjonalnie: jeśli masz build step (np. bundlowanie)
# COPY package*.json ./
# RUN npm ci

COPY index.html .

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy HTML
COPY --from=build /app/index.html .

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# ==========================================
# BUILD:
# docker build -t posthub-frontend .
#
# RUN:
# docker run -p 80:80 posthub-frontend
#
# PUSH TO REGISTRY:
# docker tag posthub-frontend:latest your-registry/posthub-frontend:latest
# docker push your-registry/posthub-frontend:latest
# ==========================================
