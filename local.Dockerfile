# 22-alpine amd64 (node version 22.23.4)
ARG NODE_SHA=sha256:025b8e975a61d94e33abeafaad1255ef44e4898cf1a1b6446860009c72e6d284
FROM node@${NODE_SHA}

ENV PORT=5010

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . ./

RUN npm run build

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f "http://localhost:$PORT/healthcheck" || exit 1

# node
USER 1000

CMD [ "npm", "run", "dev" ]

EXPOSE $PORT
