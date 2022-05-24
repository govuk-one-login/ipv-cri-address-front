FROM node:16.13.1-alpine3.15@sha256:a2c7f8ebdec79619fba306cec38150db44a45b48380d09603d3602139c5a5f92 AS builder

WORKDIR /app

RUN [ "yarn", "set", "version", "1.22.17" ]

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY /src ./src

RUN yarn build

FROM node:16.13.1-alpine3.15@sha256:a2c7f8ebdec79619fba306cec38150db44a45b48380d09603d3602139c5a5f92 AS final

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


ENV PORT 8080
EXPOSE 8080

ENTRYPOINT ["tini", "--"]

CMD ["yarn", "start"]
