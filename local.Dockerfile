FROM node:22.7.0-alpine3.19@sha256:a20e85826910e797a556dc808e070c582546786be9e82c535ecdacd2358e2a27

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
