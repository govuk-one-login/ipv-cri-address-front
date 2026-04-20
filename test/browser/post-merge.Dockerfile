FROM mcr.microsoft.com/playwright:v1.55.1-jammy

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends unzip curl && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN mkdir -p test/browser

COPY test/browser/package.json ./test/browser

RUN npm ci --workspace test/browser

WORKDIR /app/test/browser

COPY test/browser ./

# sam-deploy-pipeline expects to be able to execute a file called run-tests.sh at the root of the filesystem
# https://github.com/govuk-one-login/devplatform-deploy/blob/main/sam-deploy-pipeline/template.yaml
RUN cp run-post-merge.sh /run-tests.sh

CMD ["/run-tests.sh"]
