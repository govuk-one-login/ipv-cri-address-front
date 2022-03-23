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

# Testing

## Mock Data

[Wiremock](https://wiremock.org) has been used to create a [stateful mock](https://wiremock.org/docs/stateful-behaviour/) of the API, through the use of scenarios.
These configuration files are stored as JSON files in the [./test/mocks/mappings](./test/mocks/mappings) directory.

This can be run by using:

`yarn run mock`

The frontend can be configure to use this server through changing two environment variables:

- `NODE_ENV = development` - this enables a midldeware that passes the `x-scenario-id` header from web requests through to the API.
- `API_BASE_URL = http://localhost:8090` - this points the frontend to the wiremock instance.
- `ORDNANCE_API_URL = http://localhost:8090` - this points to an external API for address lookup. <!-- TODO: Move Ordnance to BE -->

A browser extension that can modify headers can be used to set the value of the header in a web browser. Example - [Mod Header](https://modheader.com)

## Request properties

In order to support consisten use of headers for API requests. [middleware](./src/lib/axios.js) is applied to add an instance of [axios](https://axios-http.com/) on each reqest onto `req.axios`. This is then reused in any code that uses the API.

## Browser tests.

Browser based tests can be run against the mock server, and should be able to be run against an instance of the API.

These tests are written using [Cucumber](https://cucumber.io/docs/installation/javascript/) as the test runner and [Playwright](https://playwright.dev/) as the automation tool. They also follow the [Page Object Model](https://playwright.dev/docs/test-pom) for separation of concerns.

They can be run using:

`yarn run test:browser`

## Using mocked scenario data

Any cucumber feature or scenario with a tag prefixed with `@mock-api:`

eg:

```
  @mock-api:address-error
  Scenario: Address error
  ...
```
This scenario will be configured to send a `scenario-id` header of `address-error` on every web browser request.

### Code Owners

This repo has a `CODEOWNERS` file in the root and is configured to require PRs to reviewed by Code Owners.
