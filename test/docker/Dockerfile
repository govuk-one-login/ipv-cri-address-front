FROM mcr.microsoft.com/playwright:v1.34.3-jammy as playwright

WORKDIR /

COPY docker/package.json docker/package-lock.json ./

RUN npm install

COPY browser /test/browser

CMD ["npm", "run", "test:browser"]
