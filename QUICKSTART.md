## Local Development Quick Start

This project uses **pnpm** and **Turbo** for monorepo management with Anchor for smart contracts.

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="/home/$USER/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install 0.29.0
avm use 0.29.0

# Install Node.js (18+) and pnpm
npm install -g pnpm@8
```

### Setup

```bash
cd nasdaq-strategy
pnpm install
```

### Development

```bash
# Terminal 1: Start Solana validator
solana-test-validator

# Terminal 2: Build and test contracts
cd programs/nasdaq_strategy_core
anchor build
anchor test

cd ../nasdaq_strategy_treasury
anchor build
anchor test

# Terminal 3: Start frontend
cd apps/web
pnpm dev
```

Visit `http://localhost:3000`

### Common Commands

```bash
# Build all
pnpm run build

# Test all
pnpm run test

# Format code
pnpm run format

# Lint
pnpm run lint

# Clean
pnpm run clean
```

### Project Layout

```
nasdaq-strategy/          Root monorepo
├── programs/            Smart contracts
│   ├── nasdaq_strategy_core/      Core token logic
│   └── nasdaq_strategy_treasury/  Treasury management
├── apps/
│   └── web/             Next.js frontend
├── packages/
│   ├── types/           Shared TypeScript types
│   └── utils/           Utility functions
└── docs/                Documentation
```

### Troubleshooting

**Anchor not found:**
```bash
avm install latest
avm use latest
```

**Solana validator fails:**
Port 8899 or 9999 in use:
```bash
kill $(lsof -t -i :8899,9999)
```

**pnpm workspace issues:**
```bash
pnpm install --recursive
```

**Build fails:**
```bash
cargo clean
pnpm install
pnpm build
```
