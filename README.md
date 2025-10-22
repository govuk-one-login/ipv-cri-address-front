# ipv-cri-address-front

[![GitHub Action: Scan repository](https://github.com/govuk-one-login/ipv-cri-address-front/actions/workflows/scan-repo.yml/badge.svg?branch=main)](https://github.com/govuk-one-login/ipv-cri-address-front/actions/workflows/scan-repo.yml?query=branch%3Amain)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ipv-cri-address-front&metric=coverage)](https://sonarcloud.io/summary/overall?id=ipv-cri-address-front)

Frontend for the Address Credential Issuer.

This is the home for the front end user interface for a credential issuer as a part of the Identity Proofing and Verification (IPV) system within the GDS GOV.UK One Login service. Other repositories are used for core services or other credential issuers.

# Installation

Clone this repository and then run

```bash
npm install
```

## Precommit Hooks

Install `pre-commit` from [here](https://pre-commit.com/)

Run `pre-commit install` to install pre-commit hooks locally.

If you get the error:

```
[ERROR] Cowardly refusing to install hooks with `core.hooksPath` set.
```

Run `git config --unset-all core.hooksPath` to reset your git hook settings.

## Environment Variables

- `API_BASE_URL` - Base URL for the Address CRI API backend. Defaults to `http://localhost:5007`
- `BASE_URL`: Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5010`)
- `GA4_ENABLED` - Feature flag to disable GA4, defaulted to `false`
- `UA_ENABLED` - Feature flag to disable UA, defaulted to `false`
- `UA_CONTAINER_ID` - Container ID for Universal Analytics, required for UA to work correctly. Default value is `GTM-TK92W68`
- `GA4_CONTAINER_ID` - Container ID for GA4, required for analytics to work correctly. Default value is `GTM-KD86CMZ`
- `ANALYTICS_DATA_SENSITIVE` - Used to set isDataSensitive flag for @govuk-one-login/frontend-analytics package. If true, will redact all form data from analytics.
- `FRONTEND_DOMAIN` - Cookie domain to persist values throughout the different sections of the OneLogin journey. Default value is `localhost`
- `DEVICE_INTELLIGENCE_ENABLED` - Feature flag to disable device intelligence, defaulted to `false`
- `DEVICE_INTELLIGENCE_DOMAIN` - Domain to set the device intelligence cookie, defaults to `account.gov.uk`
- `LANGUAGE_TOGGLE_DISABLED` - Feature flag to disable Language Toggle, defaulted to `true`
- `MAY_2025_REBRAND_ENABLED` - Feature flag to enable the May 2025 GOV.UK branding change, defaults to `false`

# Testing

## Mock Data

[Wiremock](https://wiremock.org) has been used to create a [stateful mock](https://wiremock.org/docs/stateful-behaviour/) of the API, through the use of scenarios.
These configuration files are stored as JSON files in the [./test/mocks/mappings](./test/mocks/mappings) directory.

This can be run by using:

`npm run mocks`

The frontend can be configured to use this server through changing two environment variables:

- `API_BASE_URL = http://localhost:8080` - this points the frontend to the imposter instance.

## Testing Environment Variables

#### Running against a deployed system

| Variable                | Value                                  | Comment                                                                                                    |
| ----------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| CREDENTIAL_ISSUER_LABEL | Address CRI Dev                        | There might be many different buttons on the credential issuer page, this allows selection of a single one |
| CORE_STUB_URL           | https://cri.core.stubs.account.gov.uk. | Initial host to start the web journey on. Will be either Core or a Core stub.                              |
| MOCK_API                | false                                  | Should the automatic mocking be used                                                                       |

## Browser tests.

Browser based tests can be run against the mock server, and should be able to be run against an instance of the API.

These tests are written using [Cucumber](https://cucumber.io/docs/installation/javascript/) as the test runner and [Playwright](https://playwright.dev/) as the automation tool. They also follow the [Page Object Model](https://playwright.dev/docs/test-pom) for separation of concerns.

They can be run using:

```sh
./test/browser $ cucumber-js
```

## Using mocked scenario data

Any cucumber feature or scenario with a tag prefixed with `@mock-api:`

eg:

```
  @mock-api:address-error
  Scenario: Address error
  ...
```

This scenario will be configured to send using `address-error` as the clientId to drive the test

## Using live data

Most scenarios will not be able to run against a live system. These include journey flows involving errors. The few scenarios that can be run against both live and mocked data should be tagged with "@live" to make it clear they can be run against live.

These should be able to be run using cucumber-js as below:

```sh
./test/browser $ cucumber-js --tags "@live"
```

## Running browser tests in isolation

You can run browser tests in isolation by decorating the scenario with a `@only` tag and then running `npm run test:browser:ci:only`.

eg:

```
  @only
  Scenario: Address error
  ...
```

## Running address frontend with a deployed stack

You can run the address frontend with a deployed Address CRI stack in AWS. This is useful for backend API testing.

### Prerequisites

1. The required repositories need to be cloned into the same parent directory, this is a one-time setup:
   - This repository (`ipv-cri-address-front`)
   - [ipv-stubs](https://github.com/govuk-one-login/ipv-stubs)
   - [ipv-config](https://github.com/govuk-one-login/ipv-config)

   The `npm run ipv-core-stub` command uses relative paths in the [docker-compose](test/docker/compose.yml) file to locate the needed `.env` and `config` files from these repositories.

2. Follow the instructions for [Deploying the Address CRI stack into the AWS Development account](https://github.com/govuk-one-login/ipv-cri-address-api/blob/main/README.md#deploy-to-dev-account)
3. Once deployed, note the stack outputs containing the `public-api` and `private-api` IDs

### Configuration

1. Create a `.env` file if you don't already have in the project root and add the `private-api` ID as the `API_BASE_URL`:

```bash
API_BASE_URL=https://xxxxx.execute-api.eu-west-2.amazonaws.com/localdev
```

Replace `xxxxx` with your actual private API ID.

**Example:** If your private API ID is `75dre0xy11`, the URL would be:

```bash
API_BASE_URL=https://75dre0xy11.execute-api.eu-west-2.amazonaws.com/localdev
```

2. Update the [config file](test/browser/di-ipv-config.yaml) with your deployed stack's public API ID:

```yaml
credentialIssuerConfigs:
  - id: address-cri-dev
    name: Address Local
    jwksEndpoint: https://api.review-a.dev.account.gov.uk/.well-known/jwks.json
    useKeyRotation: true
    authorizeUrl: http://localhost:5010/oauth2/authorize
    tokenUrl: https://xxxxx.execute-api.eu-west-2.amazonaws.com/localdev/token
    credentialUrl: https://xxxxx.execute-api.eu-west-2.amazonaws.com/localdev/credential/issue
    audience: https://review-a.dev.account.gov.uk
    publicEncryptionJwkBase64: "..."
    publicVCSigningVerificationJwkBase64: ".."
    apiKeyEnvVar: API_KEY_CRI_DEV
```

3. Replace `xxxxx` with your actual public API ID in both `tokenUrl` and `credentialUrl`

   **Example:** If your public API ID is `c5zgqkhoo3`, update the URLs to:

   ```yaml
   tokenUrl: https://c5zgqkhoo3.execute-api.eu-west-2.amazonaws.com/localdev/token
   credentialUrl: https://c5zgqkhoo3.execute-api.eu-west-2.amazonaws.com/localdev/credential/issue
   ```

### Running the services

1. Start the IPV core stub:

   ```bash
   npm run ipv-core-stub
   ```

2. In a new terminal, build and start the address front-end:

   ```bash
   npm run build && npm run dev
   ```

3. Access the core stub at: http://localhost:8085

### Code Owners

This repo has a `CODEOWNERS` file in the root and is configured to require PRs to reviewed by Code Owners.
