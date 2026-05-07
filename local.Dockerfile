# https://hub.docker.com/layers/library/node/22-alpine/images/sha256-cb15fca92530d7ac113467696cf1001208dac49c3c64355fd1348c11a88ddf8f
FROM node:22-alpine@sha256:8ea2348b068a9544dae7317b4f3aafcdc032df1647bb7d768a05a5cad1a7683f

ENV PORT=5010

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . ./

RUN npm run build

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

CMD [ "npm", "run", "dev" ]

EXPOSE $PORT
