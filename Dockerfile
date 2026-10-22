# 22-alpine amd64 (node version 22.23.4)
ARG NODE_SHA=sha256:025b8e975a61d94e33abeafaad1255ef44e4898cf1a1b6446860009c72e6d284
ARG BASE=with_dynatrace

FROM node@${NODE_SHA} AS builder
WORKDIR /app

COPY src/ ./src
COPY package.json package-lock.json .npmrc ./

RUN <<COMMANDS
  npm ci --ignore-scripts
  npm run build
  rm -rf node_modules/  # Only keep production packages
  npm ci --omit=dev --ignore-scripts
COMMANDS

FROM node@${NODE_SHA} AS plain
RUN apk --no-cache upgrade && apk add --no-cache tini curl

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f "http://localhost:$PORT/healthcheck" || exit 1

ENTRYPOINT ["tini", "--"]

# node
USER 1000

CMD ["sh", "-c", "DT_HOST_ID=ADDRESS-CRI-FRONT-$RANDOM node src/app.js"]

FROM plain AS with_dynatrace
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so
FROM ${BASE} AS release
