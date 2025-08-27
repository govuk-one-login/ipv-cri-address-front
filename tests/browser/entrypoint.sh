#!/usr/bin/env bash
set -euo pipefail

cd /tests

: "${MOCK_API:=true}"
: "${WEBSITE_HOST:=http://localhost:5050}"
: "${MOCK_API_URL:=http://localhost:8080}"
: "${RELYING_PARTY_URL:=http://localhost:8080}"
: "${ENVIRONMENT:=dev}"
: "${GITHUB_ACTIONS:=true}"

npm test -- "$@"
