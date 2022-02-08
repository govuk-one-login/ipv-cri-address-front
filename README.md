# Digital Identity Credential Issuer

# di-ipv-cri-address-front

Frontend for address collection Credential Issuer

This is the home for the front end user interface for a credential issuer as a part of the Identity Proofing and Verification (IPV) system within the GDS digital identity platform. Other repositories are used for core services or other credential issuers.

# Installation

Clone this repository and then run

```bash
yarn install
```

## Environment Variables

- `BASE_URL`: Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5010`)
- `ORDNANCE_SURVEY_SECRET`- The api key for the ordnance postcode look up api.

## Testing

### How to run Browser tests

Start the server:
`NODE_ENV=development API_BASE_URL=http://localhost:8090 ORDNANCE_SURVEY_URL=http://localhost:8090 yarn dev`

Start the wiremock server:
`yarn run mocks`

Run all the tests:
`yarn run test:application --tags`
**or**
Run the specific tests with the @run tag:
`yarn run test:application --tags "@run"`


### Code Owners

This repo has a `CODEOWNERS` file in the root and is configured to require PRs to reviewed by Code Owners.

