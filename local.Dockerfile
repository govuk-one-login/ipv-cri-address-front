FROM node:23.2.0-alpine3.19@sha256:416fdb6cb5dbb08184ffde134fe543b014b058ed21c373767832410b25ec3662

ENV PORT 5010

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./

RUN yarn build

CMD yarn run dev

EXPOSE $PORT
