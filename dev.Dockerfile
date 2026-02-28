FROM --platform="linux/arm64" arm64v8/node@sha256:3d41c6d7a5bc202f574b16ce30edc9bf2927e0bf3e9dbaec0e2c02f975233ac3 AS builder

WORKDIR /app

COPY /src ./src
COPY package.json package-lock.json .npmrc ./

RUN npm ci
RUN npm run build

# Dev dependencies are needed to build the app but not for runtime.
# So delete node_modules and reinstall only production packages.
RUN [ "rm", "-rf", "node_modules" ]
RUN npm ci --omit=dev --ignore-scripts

FROM --platform="linux/arm64" arm64v8/node@sha256:3d41c6d7a5bc202f574b16ce30edc9bf2927e0bf3e9dbaec0e2c02f975233ac3 AS final

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl tini \
  && rm -rf /var/lib/apt/lists/*



WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD=/opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT=8080
EXPOSE $PORT

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

ENTRYPOINT ["tini", "--"]

CMD ["node", "src/app.js"]
