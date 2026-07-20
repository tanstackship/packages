FROM node:20-alpine AS builder

WORKDIR /app

# Copy source (assuming this runs from the utm-parse context)
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Install Cloudflare Workers runtime
RUN npm install -g wrangler

# Copy built artifact
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/wrangler.toml ./
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

EXPOSE 8787

CMD ["wrangler", "dev", "--port", "8787"]
