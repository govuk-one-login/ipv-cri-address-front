# Running the browser tests

A number of environment variables are needed by the browser tests, as they affect how Playwright is setup, and affect some of the Before/After hooks in cucumberjs.

Browser tests for the Address Credential Issuer frontend using Cucumber.js and Playwright.

## Environment Variables

| Variable            | Default                 | Description                          |
| ------------------- | ----------------------- | ------------------------------------ |
| `MOCK_API`          | `true`                  | Enable mock mode for the Address CRI |
| `WEBSITE_HOST`      | `http://localhost:5010` | URL of the frontend                  |
| `MOCK_API_URL`      | `http://localhost:8080` | URL of the mock API for Address CRI  |
| `RELYING_PARTY_URL` | `http://localhost:8080` | URL for OAuth redirects              |
| `GITHUB_ACTIONS`    | `true`                  | Run browser in headless mode         |
| `BROWSER`           | `firefox`               | Run browser test via firefox         |

### Running in Docker (Recommended)

```bash
# From the project root
cd test/docker

# Run all tests
docker-compose run --rm cucumber

# Run specific tag
docker-compose run --rm cucumber npx cucumber-js --tags "@mock-api:address-success"

# Run single scenario
docker-compose run --rm cucumber npx cucumber-js --name "Adding an year date"
```

Alternatively, use npm script command in the root package from the root directory

For example

npm run test:browser:ci

### Running Locally

```bash
# Start services
cd test/docker
docker-compose up -d web mocks redis

# Run tests from browser directory
cd ../browser
MOCK_API=true WEBSITE_HOST=http://localhost:5010 MOCK_API_URL=http://localhost:8080 npm test
```

### Running locally on different browser types

```bash
# Start services
cd test/docker
docker-compose up

# Run tests from browser directory
cd ../browser
MOCK_API=true WEBSITE_HOST=http://localhost:5010 MOCK_API_URL=http://localhost:8080 BROWSER=<browserType> npm test
```

This will show the following in the terminal `Running scenarios in browser type: <browerType>`.

The following browserType are: `firefox`, `chromium` and `edge`

If you would like to see the web pages, change `headless: true` to `headless: false` in the setup.js file.

## Test Tags

Tests use Cucumber tags to control mock API scenarios:

- `@mock-api:address-success` - Successful address journey
- `@mock-api:international-address` - International address flow
- `@mock-api:address-authorization-error` - Authorization error scenarios
