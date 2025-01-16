FROM node:20.11.1-alpine3.19@sha256:f4c96a28c0b2d8981664e03f461c2677152cd9a756012ffa8e2c6727427c2bda

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

CMD yarn run dev

EXPOSE $PORT
