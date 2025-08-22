#!/bin/bash

echo "Starting Imposter scenario verification..."
echo

# Start docker-compose
echo "Starting Imposter mock server..."
cd ../docker
docker-compose up -d mocks
sleep 3


echo
echo "=== Testing Session Creation Scenarios ==="

# address-success session
echo "Testing: Create address-success session"
curl -s -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"client_id": "address-success", "request": "test"}' \
  -w "Status: %{http_code}\n" | tail -1

# address-authorization-error session
echo "Testing: Create address-authorization-error session"
curl -s -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"client_id": "address-authorization-error", "request": "test"}' \
  -w "Status: %{http_code}\n" | tail -1

# international-address session
echo "Testing: Create international-address session"
curl -s -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"client_id": "international-address", "request": "test"}' \
  -w "Status: %{http_code}\n" | tail -1

# address-prepopulated session
echo "Testing: Create address-prepopulated session"
curl -s -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"client_id": "address-prepopulated", "request": "test"}' \
  -w "Status: %{http_code}\n" | tail -1

# address-prepopulated-postcode session
echo "Testing: Create address-prepopulated-postcode session"
curl -s -X POST http://localhost:8080/session \
  -H "Content-Type: application/json" \
  -d '{"client_id": "address-prepopulated-postcode", "request": "test"}' \
  -w "Status: %{http_code}\n" | tail -1

echo
echo "=== Testing Postcode Lookup Scenarios ==="

# E1 8QS with address-success session
echo "Testing: Postcode lookup E1 8QS (address-success)"
curl -s -X POST http://localhost:8080/postcode-lookup \
  -H "Content-Type: application/json" \
  -H "session_id: address-success" \
  -d '{"postcode": "E1 8QS"}' \
  -w "Status: %{http_code}\n" | tail -1

# E1 8QS with authorization-error session
echo "Testing: Postcode lookup E1 8QS (authorization-error)"
curl -s -X POST http://localhost:8080/postcode-lookup \
  -H "Content-Type: application/json" \
  -H "session_id: address-authorization-error" \
  -d '{"postcode": "E1 8QS"}' \
  -w "Status: %{http_code}\n" | tail -1

# ZZ1 1ZZ compliance data
echo "Testing: Postcode lookup ZZ1 1ZZ (compliance data)"
curl -s -X POST http://localhost:8080/postcode-lookup \
  -H "Content-Type: application/json" \
  -d '{"postcode": "ZZ1 1ZZ"}' \
  -w "Status: %{http_code}\n" | tail -1

# PR3VC0DE test data
echo "Testing: Postcode lookup PR3VC0DE (test data)"
curl -s -X POST http://localhost:8080/postcode-lookup \
  -H "Content-Type: application/json" \
  -d '{"postcode": "PR3VC0DE"}' \
  -w "Status: %{http_code}\n" | tail -1

# E1 8QS with prepopulated session
echo "Testing: Postcode lookup E1 8QS (prepopulated)"
curl -s -X POST http://localhost:8080/postcode-lookup \
  -H "Content-Type: application/json" \
  -H "session_id: address-prepopulated" \
  -d '{"postcode": "E1 8QS"}' \
  -w "Status: %{http_code}\n" | tail -1

# PR3VC0DE with prepopulated session
echo "Testing: Postcode lookup PR3VC0DE (prepopulated)"
curl -s -X POST http://localhost:8080/postcode-lookup \
  -H "Content-Type: application/json" \
  -H "session_id: address-prepopulated" \
  -d '{"postcode": "PR3VC0DE"}' \
  -w "Status: %{http_code}\n" | tail -1

# XXX_XX not found
echo "Testing: Postcode lookup XXX_XX (not found)"
curl -s -X POST http://localhost:8080/postcode-lookup \
  -H "Content-Type: application/json" \
  -d '{"postcode": "XXX_XX"}' \
  -w "Status: %{http_code}\n" | tail -1

echo
echo "=== Testing Address Save Endpoint ==="

# Address save
echo "Testing: Address save"
curl -s -X PUT http://localhost:8080/address \
  -H "Content-Type: application/json" \
  -H "session_id: address-success" \
  -d '{"uprn": "123", "buildingNumber": "1", "streetName": "TEST STREET", "addressLocality": "LONDON", "postalCode": "E1 8QS"}' \
  -w "Status: %{http_code}\n" | tail -1

echo
echo "=== Testing Authorization Endpoints ==="

# Authorization success
echo "Testing: Authorization success"
curl -s -X GET http://localhost:8080/authorization \
  -H "session-id: address-success" \
  -w "Status: %{http_code}\n" | tail -1

# Authorization error
echo "Testing: Authorization error"
curl -s -X GET http://localhost:8080/authorization \
  -H "session-id: address-authorization-error" \
  -w "Status: %{http_code}\n" | tail -1

# Authorization international address
echo "Testing: Authorization international address"
curl -s -X GET http://localhost:8080/authorization \
  -H "session-id: international-address" \
  -w "Status: %{http_code}\n" | tail -1

# Authorization prepopulated address
echo "Testing: Authorization prepopulated address"
curl -s -X GET http://localhost:8080/authorization \
  -H "session-id: address-prepopulated" \
  -w "Status: %{http_code}\n" | tail -1

echo
echo "=== Testing Addresses v2 Endpoints ==="

# Addresses v2 international
echo "Testing: Addresses v2 international"
curl -s -X GET http://localhost:8080/addresses/v2 \
  -H "session_id: international-address" \
  -w "Status: %{http_code}\n" | tail -1

# Addresses v2 prepopulated
echo "Testing: Addresses v2 prepopulated"
curl -s -X GET http://localhost:8080/addresses/v2 \
  -H "session_id: address-prepopulated" \
  -w "Status: %{http_code}\n" | tail -1

# Addresses v2 prepopulated postcode
echo "Testing: Addresses v2 prepopulated postcode"
curl -s -X GET http://localhost:8080/addresses/v2 \
  -H "session_id: address-prepopulated-postcode" \
  -w "Status: %{http_code}\n" | tail -1

# Addresses v2 default (empty)
echo "Testing: Addresses v2 default (empty)"
curl -s -X GET http://localhost:8080/addresses/v2 \
  -H "session_id: unknown-session" \
  -w "Status: %{http_code}\n" | tail -1

echo
echo "=== Testing Return Endpoint ==="

# Return endpoint
echo "Testing: Return endpoint"
curl -s -X GET http://localhost:8080/return \
  -w "Status: %{http_code}\n" | tail -1

echo
echo "All tests completed!"