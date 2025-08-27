# ipv-cri-address-front

[![GitHub Action: Scan repository](https://github.com/govuk-one-login/ipv-cri-address-front/actions/workflows/scan-repo.yml/badge.svg?branch=main)](https://github.com/govuk-one-login/ipv-cri-address-front/actions/workflows/scan-repo.yml?query=branch%3Amain)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ipv-cri-address-front&metric=coverage)](https://sonarcloud.io/summary/overall?id=ipv-cri-address-front)

Frontend for the Address Credential Issuer.

This is the home for the front end user interface for a credential issuer as a part of the Identity Proofing and Verification (IPV) system within the GDS GOV.UK One Login service. Other repositories are used for core services or other credential issuers.

# Installation

Clone this repository and then run

```bash
yarn install
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

- `BASE_URL`: Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5010`)
- `GA4_ENABLED` - Feature flag to disable GA4, defaulted to `false`
- `UA_ENABLED` - Feature flag to disable UA, defaulted to `false`
- `UA_CONTAINER_ID` - Container ID for Universal Analytics, required for UA to work correctly. Default value is `GTM-TK92W68`
- `GA4_CONTAINER_ID` - Container ID for GA4, required for analytics to work correctly. Default value is `GTM-KD86CMZ`
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

`yarn run mocks`

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
./test/brower $ cucumber-js
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

You can run browser tests in isolation by decorating the scenario with a `@only` tag and then running `yarn run test:browser:ci:only`.

eg:

```
  @only
  Scenario: Address error
  ...
```

### Code Owners

This repo has a `CODEOWNERS` file in the root and is configured to require PRs to reviewed by Code Owners.
