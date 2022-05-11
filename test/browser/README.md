# Running the browser tests

A number of environment variables are needed by the browser tests, as they affect how Playwright is setup, and affect some of the Before/After hooks in cucumberjs.

## Environment variables

| env var                    | example                        | description                                                       |
|----------------------------|--------------------------------|-------------------------------------------------------------------|
| CORE_STUB_CONFIG_DIRECTORY | config/stubs/di-ipv-core-stub/ | Location of the config directory including the Keystore           |
| CREDENTIAL_ISSUER_LABEL    | Address Development            | Label to click on inside the Core stub instance                   |
| CORE_STUB_URL              | http://localhost:8085          | URL of the core stub, where the tests start                       |
| MOCK_API_URL               | http://localhost:8090          | URL of the mock API, used to reset scenarios as required          |
| MOCK_API                   | true                           | Use the mock API                                                  |


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



## Authenticating to GHCR.io

https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

1. generate new token
2. permissions: read:packages
3. Save token as environment variable

> echo $PAT | docker login ghcr.io -u GITHUB_USER_NAME --password-stdin  
❯ docker pull ghcr.io/alphagov/di/di-ipv-core-stub:latest


https://mkjwk.org/

- publicEncryptionJwkBase64 - RSA
- CORE_STUB_SIGNING_PRIVATE_KEY_JWK_BASE64 - EC

