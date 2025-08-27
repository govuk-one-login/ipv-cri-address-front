FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /test/browser

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "test"]
