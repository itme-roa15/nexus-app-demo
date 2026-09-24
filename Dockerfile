# Stage 1: Base image with latest LTS Node.js, build tools for native modules, and pnpm 9
FROM node:22-slim AS base
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g pnpm@9

# Stage 2: Dependencies - install all dependencies for building
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Stage 3: Production dependencies - install only runtime dependencies
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# Stage 4: Builder - build the TanStack Start / Nitro application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Stage 5: Production runner - minimal, secure runtime image
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Prepare directories and permissions for the non-root node user
RUN mkdir -p /app/data && chown -R node:node /app

# Copy production dependencies and compiled output
COPY --chown=node:node --from=prod-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/.output ./.output
COPY --chown=node:node --from=builder /app/package.json ./package.json

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
