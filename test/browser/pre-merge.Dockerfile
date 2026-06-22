FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN mkdir -p test/browser
RUN mkdir -p test/visual

COPY test/browser/package.json ./test/browser

RUN npm ci --workspace test/browser

COPY ./test/browser ./test/browser
COPY ./test/visual ./test/visual

WORKDIR /app/test/browser

CMD [ "npm", "run", "test" ]
