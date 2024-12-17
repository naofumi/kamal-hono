FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat sqlite
WORKDIR /app

COPY package*json tsconfig.json tailwind.config.js ./
COPY src src

RUN npm ci && \
    npm run build && \
    npm run build:css && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

COPY --chown=hono:nodejs ./static/ /app/static/
COPY --from=builder --chown=hono:nodejs /app/static/assets/application.css /app/static/assets/application.css

RUN mkdir /db
RUN chown hono:nodejs /db
COPY --chown=hono:nodejs ./db/db.sqlite /app/db/db.sqlite
COPY --chown=hono:nodejs ./db/db.sqlite-wal /app/db/db.sqlite-wal

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
