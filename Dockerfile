ARG NODE_SHA=sha256:f4c96a28c0b2d8981664e03f461c2677152cd9a756012ffa8e2c6727427c2bda

FROM node:20.11.1-alpine3.19@${NODE_SHA} AS builder
WORKDIR /app

COPY src/ ./src
COPY package.json package-lock.json .npmrc ./

RUN <<COMMANDS
  npm ci --ignore-scripts
  npm run build
  rm -rf node_modules/  # Only keep production packages
  npm ci --omit=dev --ignore-scripts
COMMANDS

FROM node:20.11.1-alpine3.19@${NODE_SHA} AS runner
RUN apk --no-cache upgrade && apk add --no-cache tini curl

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

ENTRYPOINT ["tini", "--"]

CMD ["sh", "-c", "DT_HOST_ID=ADDRESS-CRI-FRONT-$RANDOM node src/app.js"]
