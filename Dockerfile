# Stage 1: Base image with latest LTS Node.js and pnpm
FROM node:22-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@latest

# Stage 2: Dependencies - install all dependencies for building
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 3: Production dependencies - install only runtime dependencies
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Stage 4: Builder - build the TanStack Start / Nitro application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Stage 5: Production runner - minimal, secure runtime image
FROM node:22-alpine AS runner
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
