#!/bin/bash

API_URL="https://n6qkpzdn07.execute-api.eu-central-1.amazonaws.com/prod"

echo "Testing GET /history for Bitcoin (30 days)..."
curl -v "$API_URL/history?coinId=bitcoin&days=30"

echo -e "\n\nTesting GET /history for Ethereum (7 days)..."
curl -v "$API_URL/history?coinId=ethereum&days=7"

echo -e "\n\nTesting GET /history for Solana (90 days)..."
curl -v "$API_URL/history?coinId=solana&days=90"
