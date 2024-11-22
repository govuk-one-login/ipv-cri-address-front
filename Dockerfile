FROM node:23.3.0-alpine3.19@sha256:1c380ed40f8d2f42081a07e8bcea5048b18df1e1dab3e6191e0ad095c84b9e12 AS builder

WORKDIR /app

COPY .yarn ./.yarn
COPY .yarnrc.yml ./

RUN [ "yarn", "set", "version", "1.22.17" ]

COPY /src ./src
COPY package.json yarn.lock ./

RUN yarn install
RUN yarn build

# 'yarn install --production' does not prune test packages which are necessary
# to build the app. So delete nod_modules and reinstall only production packages.
RUN [ "rm", "-rf", "node_modules" ]
RUN yarn install --production --frozen-lockfile

FROM node:23.3.0-alpine3.19@sha256:1c380ed40f8d2f42081a07e8bcea5048b18df1e1dab3e6191e0ad095c84b9e12 AS final

RUN ["apk", "--no-cache", "upgrade"]
RUN ["apk", "add", "--no-cache", "tini"]
RUN [ "yarn", "set", "version", "1.22.17" ]

WORKDIR /app

# Copy in compile assets and deps from build container
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Add in dynatrace layer
COPY --from=khw46367.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

ENV PORT 8080
EXPOSE $PORT

ENTRYPOINT ["tini", "--"]

CMD ["yarn", "start"]
