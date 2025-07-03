FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

COPY . ./

CMD ["./run-tests-pre-merge.sh"]
