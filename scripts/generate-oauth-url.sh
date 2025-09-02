#!/usr/bin/env bash
set -euo pipefail

PROFILE=${1:-aws-api}
AWS_PROFILE=${2:-address-cri-dev}

if [ "$PROFILE" = "local-dev" ]; then
  SERVICE="url-generator-dev"
else
  SERVICE="url-generator"
fi

docker compose -f test/docker/compose.yml down --remove-orphans > /dev/null 2>&1 || true
trap 'docker compose -f test/docker/compose.yml down --remove-orphans > /dev/null 2>&1' EXIT

OUTPUT=$(AWS_PROFILE=$AWS_PROFILE docker compose -f test/docker/compose.yml --profile $PROFILE run --rm $SERVICE)
OAUTH_LINE=$(echo "$OUTPUT" | grep oauth2)
URL=${OAUTH_LINE#*: }

open "$URL"
