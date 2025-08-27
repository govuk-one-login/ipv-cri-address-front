FROM node:20.11.1-alpine3.19

ENV PORT 5010

WORKDIR /app

RUN apk add --no-cache curl

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

CMD yarn run dev

EXPOSE $PORT
