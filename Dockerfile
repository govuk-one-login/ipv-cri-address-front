FROM node:18.9.1-alpine3.15@sha256:bb30b16188798f57d6e751a7f986c602942ec789f6f66f00b69e6d4ee0324a5c AS builder

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

FROM node:18.9.1-alpine3.15@sha256:bb30b16188798f57d6e751a7f986c602942ec789f6f66f00b69e6d4ee0324a5c AS final

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
EXPOSE $PORT

ENTRYPOINT ["tini", "--"]

CMD ["yarn", "start"]
