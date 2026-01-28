# Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY apps/frontend/package*.json ./
RUN npm install
COPY apps/frontend/ ./
RUN npm run build

# Build backend
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY apps/backend/package*.json ./
RUN npm install
COPY apps/backend/ ./
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app
COPY apps/backend/package*.json ./apps/backend/
RUN cd apps/backend && npm install --omit=dev
COPY --from=backend /app/backend/dist ./apps/backend/dist
COPY --from=frontend /app/frontend/dist ./apps/frontend/dist
RUN mkdir -p /app/apps/backend/data && chown -R node:node /app/apps/backend/data
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001
USER node
WORKDIR /app/apps/backend
CMD ["node", "dist/index.js"]
