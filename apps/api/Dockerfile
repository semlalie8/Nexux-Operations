# ── Stage 1: Dependencies ────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Runtime ─────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Install openssl for Prisma on Alpine
RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client inside the image
RUN npx prisma generate

EXPOSE 3001

# On start: push migrations then run the server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
