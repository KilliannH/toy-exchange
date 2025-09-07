# ---- Builder ----
FROM node:22-alpine AS builder
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer toutes les dépendances (dev incluses pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Générer Prisma client
RUN npx prisma generate

# Variables d'environnement pour le build (nécessaires pour NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_STRIPE_PRICE_100_POINTS
ARG NEXT_PUBLIC_STRIPE_PRICE_250_POINTS
ARG NEXT_PUBLIC_STRIPE_PRICE_600_POINTS
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_META_PIXEL_ID=$NEXT_PUBLIC_META_PIXEL_ID
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PRICE_100_POINTS=$NEXT_PUBLIC_STRIPE_PRICE_100_POINTS
ENV NEXT_PUBLIC_STRIPE_PRICE_250_POINTS=$NEXT_PUBLIC_STRIPE_PRICE_250_POINTS
ENV NEXT_PUBLIC_STRIPE_PRICE_600_POINTS=$NEXT_PUBLIC_STRIPE_PRICE_600_POINTS

# (optionnel mais utile pour fail-fast)
RUN test -n "$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" || (echo 'Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY' && exit 1)

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runner ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1


# Installe le Cloud SQL Auth Proxy v2 (binaire linux amd64)
# => chemin officiel des connecteurs v2
ARG PROXY_VERSION=2.18.1
RUN apk add --no-cache wget ca-certificates bash && \
    wget -O /usr/local/bin/cloud-sql-proxy \
      https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v${PROXY_VERSION}/cloud-sql-proxy.linux.amd64 && \
    chmod +x /usr/local/bin/cloud-sql-proxy

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/package*.json ./ 
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copier Prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Lancer Cloud SQL Proxy puis Prisma migrations puis Next.js
CMD ["sh", "-c", "cloud-sql-proxy --address 0.0.0.0 --port 5432 toy-echange2:europe-west1:toyexchange-db-instance & sleep 5 && npx prisma migrate deploy && node server.js"]
