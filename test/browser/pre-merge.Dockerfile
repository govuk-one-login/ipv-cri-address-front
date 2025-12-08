FROM mcr.microsoft.com/playwright:v1.55.1-jammy

WORKDIR /test/browser

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

CMD ["npm", "test"]
