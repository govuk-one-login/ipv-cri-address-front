FROM node:22.4.1-alpine3.19@sha256:67225d40d3fb36314e392846effda04b95c973bf52e44ea064a8e0015c83056e AS builder

ENV PORT 5010

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

HEALTHCHECK --interval=10s --timeout=2s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/healthcheck || exit 1

CMD npm run dev

EXPOSE $PORT
