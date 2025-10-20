FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /test/browser

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
