FROM mcr.microsoft.com/playwright:v1.34.0-jammy

WORKDIR /test

# COPY package.json yarn.lock .yarnrc.yml ./

# RUN yarn install

COPY . ./

CMD ["./run-tests-pre-merge.sh"]
