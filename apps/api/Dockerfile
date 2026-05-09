FROM node:20-alpine AS builder

WORKDIR /app

# Install global turbo
RUN npm install -g turbo

# Copy all workspace files
COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies for the whole workspace
RUN npm install

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build the api package
WORKDIR /app
RUN npm run build --workspace=apps/api

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV PORT=4005

EXPOSE 4005

CMD ["npm", "run", "start:prod"]
