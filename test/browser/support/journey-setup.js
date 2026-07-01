import aws4 from "aws4";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

const resolveCredentials = fromNodeProviderChain({
  timeout: 1000,
  maxRetries: 0,
});

export async function getOauthPath(request, clientId) {
  return `/oauth2/authorize?request=${request}&client_id=${clientId}`;
}

async function getStartingURLForStub(sharedClaims) {
  try {
    const baseUrl = process.env.WEBSITE_HOST;
    const startUrl = new URL("start", process.env.RELYING_PARTY_URL);
    const body = JSON.stringify({
      aud: process.env.WEBSITE_HOST,
      ...(sharedClaims && { shared_claims: sharedClaims }),
    });

    const credentials = await resolveCredentials();
    const { headers } = aws4.sign(
      {
        host: startUrl.host,
        path: `${startUrl.pathname}${startUrl.search}`,
        method: "POST",
        service: "execute-api",
        region: "eu-west-2",
        headers: { "Content-Type": "application/json" },
        body,
      },
      {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken,
      }
    );

    const response = await fetch(startUrl, {
      method: "POST",
      headers,
      body,
    });
    const data = await response.json();

    const oauthPath = getOauthPath(data.request, data.client_id);

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
    return new URL(
      `/oauth2/authorize?request=lorem&client_id=${clientId}`,
      baseURL
    );
  }
}
