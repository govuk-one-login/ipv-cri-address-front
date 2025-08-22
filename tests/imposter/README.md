# Imposter

[Imposter](https://www.imposter.sh/) is a mocking solution for APIs.

## Running

Imposter can be [run locally](https://docs.imposter.sh/getting_started/) using the [Imposter CLI](https://docs.imposter.sh/run_imposter_cli/). Alternatively, it can also be run using [Docker](https://docs.imposter.sh/run_imposter_docker/) or a [JAR](https://docs.imposter.sh/run_imposter_jar/) file.

### Option 1: Docker (standalone)

The Imposter server can be started using Docker:

```bash
docker run --rm -p 8080:8080 -v $(pwd):/opt/imposter/config outofcoffee/imposter:3.25.1
```

### Option 2: Docker Compose (recommended for testing)

For browser testing with the full application stack:

```bash
cd ../docker
docker-compose up mocks
```

This starts Imposter as part of the complete testing environment.

Imposter runs on port `8080` by default.

## Endpoints

To test that the system is running as expected hit the following endpoint:

```bash
curl http://localhost:8080/system/status
```

Test the session endpoint:

```bash
curl -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"client_id": "address-success", "request": "test"}'
```