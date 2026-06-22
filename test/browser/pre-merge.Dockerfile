FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN mkdir -p test/browser

COPY test/browser/package.json ./test/browser

RUN npm ci --workspace test/browser

WORKDIR /app/test/browser

COPY ./test/browser ./

CMD [ "npm", "run", "test" ]
