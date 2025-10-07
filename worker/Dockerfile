# worker/Dockerfile
FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# Install only what we need to build
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Build TypeScript
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# If you haven’t yet, add a tsconfig.json (you did): worker/tsconfig.json
RUN npm run build

# Runtime image (small)
FROM gcr.io/distroless/nodejs20-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production
# If your worker needs time zone / locales, you can switch to node:20-slim for convenience.

# Copy only what runtime needs
COPY --from=build /app/package.json ./
COPY --from=deps  /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# The compiled entrypoint should be dist/index.js (or dist/worker.js) per your package.json
CMD ["dist/index.js"]
