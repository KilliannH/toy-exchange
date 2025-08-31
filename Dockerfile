# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
# si tu utilises pnpm: COPY pnpm-lock.yaml . && corepack enable && corepack prepare pnpm@latest --activate
RUN npm ci
COPY . .
# Prisma (si utilisé)
RUN npx prisma generate
# Build Next
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runner ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Next.js standalone (optionnel si tu utilises output: 'standalone')
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

EXPOSE 8080
ENV PORT=8080
CMD ["npm","start"]