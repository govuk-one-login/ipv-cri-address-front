const axios = require("axios");

const configureAxios = () => {
  if (process.env.MOCK_API !== "false") {
    return axios;
  }

  const instance = axios.create();

  try {
    const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
    const { aws4Interceptor } = require("aws4-axios");

    const customCredentialsProvider = {
      getCredentials: fromNodeProviderChain({
        timeout: 1000,
        maxRetries: 0,
      }),
    };
    const interceptor = aws4Interceptor({
      options: {
        region: "eu-west-2",
        service: "execute-api",
      },
      credentials: customCredentialsProvider,
    });

    instance.interceptors.request.use(interceptor);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      "AWS SDK not available – using unsigned HTTP requests",
      error.message
    );
  }

  return instance;
};

module.exports = configureAxios;
