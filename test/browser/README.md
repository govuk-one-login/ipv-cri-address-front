# Running the browser tests

A number of environment variables are needed by the browser tests, as they affect how Playwright is setup, and affect some of the Before/After hooks in cucumberjs.

## Environment variables

| env var                    | example                        | description                                              |
| -------------------------- | ------------------------------ | -------------------------------------------------------- |
| CORE_STUB_CONFIG_DIRECTORY | config/stubs/di-ipv-core-stub/ | Location of the config directory including the Keystore  |
| CREDENTIAL_ISSUER_LABEL    | Address Development            | Label to click on inside the Core stub instance          |
| CORE_STUB_URL              | http://localhost:8085          | URL of the core stub, where the tests start              |
| MOCK_API_URL               | http://localhost:8090          | URL of the mock API, used to reset scenarios as required |
| MOCK_API                   | true                           | Use the mock API                                         |

## Running against mocks

Required environment variables:

- `CORE_STUB_CONFIG_DIRECTORY` - config/stubs/di-ipv-core-stub/
- `CREDENTIAL_ISSUER_LABEL`- Address Local
- `CORE_STUB_URL` - http://localhost:8085
- `MOCK_API_URL` - http://localhost:8090
- `MOCK_API` - true

1. `docker-compose up`
2. `yarn run cucumber-js --config test/browser/cucumber.js`
   - `yarn run` runs from the root directory, so the full path to the config file needs to be specified

## Running against environment

Required environment variables:

- `CREDENTIAL_ISSUER_LABEL` - Address CRI Dev
- `CORE_STUB_URL` - https://di-ipv-core-stub.example.org
- `MOCK_API` - false

1. `yarn run cucumber-js --config test/browser/cucumber.js`
   - `yarn run` runs from the root directory, so the full path to the config file needs to be specified
