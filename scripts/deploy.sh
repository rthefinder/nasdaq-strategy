#!/bin/bash

# Deploy script for nasdaq-strategy programs
# Usage: ./scripts/deploy.sh [devnet|testnet|mainnet]

set -e

NETWORK="${1:-devnet}"

echo "Deploying nasdaq-strategy to $NETWORK..."

# Build programs
echo "📦 Building programs..."
cd programs/nasdaq_strategy_core
anchor build
cd ../nasdaq_strategy_treasury
anchor build
cd ../..

# Deploy core program
echo "📤 Deploying nasdaq_strategy_core..."
solana program deploy \
  programs/nasdaq_strategy_core/target/deploy/nasdaq_strategy_core.so \
  --keypair ~/.config/solana/id.json \
  --url https://api.$NETWORK.solana.com

# Deploy treasury program
echo "📤 Deploying nasdaq_strategy_treasury..."
solana program deploy \
  programs/nasdaq_strategy_treasury/target/deploy/nasdaq_strategy_treasury.so \
  --keypair ~/.config/solana/id.json \
  --url https://api.$NETWORK.solana.com

echo "Deployment complete!"
