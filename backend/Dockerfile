# ---- Portfolio Platform API ----
FROM node:20-alpine AS base
WORKDIR /app

# Install production dependencies first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source.
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

# Basic healthcheck against the API health endpoint.
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||5000)+'/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
