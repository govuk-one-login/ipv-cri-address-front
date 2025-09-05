#!/usr/bin/env bash

ENVIRONMENT="${TEST_ENVIRONMENT:-dev}"
RELYING_PARTY_URL="${RELYING_PARTY_URL:-https://test-resources.review-a.${ENVIRONMENT}.account.gov.uk}"
WEBSITE_HOST="https://review-a.${ENVIRONMENT}.account.gov.uk"

export RELYING_PARTY_URL
export WEBSITE_HOST
export ENVIRONMENT
export GITHUB_ACTIONS=true
export MOCK_API=false

cd /test/browser || exit 1

yarn test --tags "@post-merge and not @live" --fail-fast
