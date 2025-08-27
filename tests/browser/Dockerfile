FROM mcr.microsoft.com/playwright:v1.52.0-jammy

# Install AWS CLI v2 so it can be reused for post-merge tests
RUN apt-get update -y && \
    apt-get install -y unzip curl && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip /var/lib/apt/lists/*

WORKDIR /tests

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx playwright install --with-deps

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
