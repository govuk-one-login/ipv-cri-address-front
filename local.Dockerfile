FROM node:22.4.0-alpine3.19@sha256:138d0b5f22718a61ceb6a6d306050fbdb599c35f4bb472bc996e540b14cd76ed

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
