import axios from "axios";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";
import { aws4Interceptor } from "aws4-axios";

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

axios.interceptors.request.use(interceptor);

export async function getOauthPath(request, clientId) {
  return `/oauth2/authorize?request=${request}&client_id=${clientId}`;
}

async function getStartingURLForStub(sharedClaims) {
  try {
    const baseUrl = process.env.WEBSITE_HOST;
    const startUrl = new URL("start", process.env.RELYING_PARTY_URL);
    const response = await axios.post(startUrl, {
      aud: process.env.WEBSITE_HOST,
      ...(sharedClaims && {shared_claims: sharedClaims}),
    });
    const oauthPath = getOauthPath(
      response.data.request,
      response.data.client_id
    );


    return new URL(oauthPath, baseUrl);
  } catch (error) {
    console.error(error);
  }
}

export async function getStartingURL(clientId = "standalone", sharedClaims) {
  const baseURL = process.env.WEBSITE_HOST || "http://localhost:5010";

  if (process.env.MOCK_API === "false") {
    return await getStartingURLForStub(sharedClaims);
  } else {
    return new URL(`/oauth2/authorize?request=lorem&client_id=${clientId}`, baseURL);
  }
}
