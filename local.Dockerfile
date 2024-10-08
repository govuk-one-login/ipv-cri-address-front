FROM node:22.9.0-alpine3.19@sha256:83b4d7bcfc3d4a40faac3e73a59bc3b0f4b3cc72b9a19e036d340746ebfeaecb

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
