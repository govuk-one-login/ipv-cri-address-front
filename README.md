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
- `API_BASE_URL = http://localhost:8010` - this points the frontend to the wiremock instance.

A browser extension that can modify headers can be used to set the value of the header in a web browser. Example - [Mod Header](https://modheader.com)

## Request properties

In order to support consisten use of headers for API requests. [middleware](./src/lib/axios.js) is applied to add an instance of [axios](https://axios-http.com/) on each reqest onto `req.axios`. This is then reused in any code that uses the API.

## Testing Environment Variables

#### Running against a deployed system

| Variable                | Value                                              | Comment                                                                                                    |
|-------------------------|----------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| CREDENTIAL_ISSUER_LABEL | Address CRI Dev                                    | There might be many different buttons on the credential issuer page, this allows selection of a single one |
| CORE_STUB_URL           | https://di-ipv-core-stub.london.cloudapps.digital/ | Initial host to start the web journey on. Will be either Core or a Core stub.                              |
| MOCK_API                | false                                              | Should the automatic mocking be used                                                                       |

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
This scenario will be configured to send a `scenario-id` header of `address-error` on every web browser request.


## Using live data

Most scenarios will not be able to run against a live system. These include journey flows involving errors. The few scenarios that can be run against both live and mocked data should be tagged with "@live" to make it clear they can be run against live.

These should be able to be run using cucumber-js as below:

```sh
./test/brower $ cucumber-js --tags "@live"
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
