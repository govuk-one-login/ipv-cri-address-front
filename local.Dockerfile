FROM node:22.0.0-alpine3.19@sha256:9459e243f620fff19380c51497493e91db1454f5a30847efe5bc5e50920748d5

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
