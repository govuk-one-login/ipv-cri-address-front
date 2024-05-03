FROM node:22.1.0-alpine3.19@sha256:487dc5d5122d578e13f2231aa4ac0f63068becd921099c4c677c850df93bede8

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
