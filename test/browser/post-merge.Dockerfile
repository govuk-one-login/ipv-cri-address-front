FROM mcr.microsoft.com/playwright:v1.52.0-jammy

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends unzip curl && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /test/browser

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./run-post-merge.sh /run-tests.sh
RUN chmod +x /run-tests.sh

COPY . .

CMD ["/run-tests.sh"]
