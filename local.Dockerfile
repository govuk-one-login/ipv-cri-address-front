FROM node:22.5.0-alpine3.19@sha256:858234ab25268e64cc6be3d3d01b7dff66614647d9542ec5ae3dda30d11e9e3e

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
