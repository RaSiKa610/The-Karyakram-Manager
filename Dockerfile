# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install compatibility libraries for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl openssl-dev

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install compatibility libraries for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl openssl-dev

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client targeting linux-musl-openssl-3.0.x
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static files - create public dir if it doesn't exist
COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
