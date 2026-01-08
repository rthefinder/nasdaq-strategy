# Development Guide

## Prerequisites

- Node.js 18+ and npm/pnpm
- Rust 1.70+
- Solana CLI 1.17+
- Anchor 0.29+

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rthefinder/nasdaq-strategy.git
cd nasdaq-strategy
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build Programs

```bash
cd programs/nasdaq_strategy_core
anchor build

cd ../nasdaq_strategy_treasury
anchor build
```

### 4. Run Local Tests

```bash
# Test core program
cd programs/nasdaq_strategy_core
anchor test

# Test treasury program
cd ../nasdaq_strategy_treasury
anchor test
```

### 5. Start Local Validator

```bash
# In one terminal
solana-test-validator

# In another terminal
cd apps/web
pnpm dev
```

Visit `http://localhost:3000` to see the frontend.

## Project Structure

```
nasdaq-strategy/
├── programs/
│   ├── nasdaq_strategy_core/       # Token & NAV program
│   │   ├── src/lib.rs
│   │   ├── Cargo.toml
│   │   └── target/
│   └── nasdaq_strategy_treasury/   # Treasury & redemption program
│       ├── src/lib.rs
│       ├── Cargo.toml
│       └── target/
├── apps/
│   └── web/                        # Next.js frontend
│       ├── src/
│       ├── next.config.js
│       └── package.json
├── packages/
│   ├── types/                      # Shared TypeScript types
│   └── utils/                      # Utility functions
├── scripts/
│   ├── deploy.sh                   # Deployment script
│   └── init.sh                     # Initialization script
├── tests/
│   └── integration.test.ts         # Integration tests
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── API.md
└── .github/
    └── workflows/                  # CI/CD pipelines
```

## Common Tasks

### Build Everything

```bash
pnpm run build
```

### Run All Tests

```bash
pnpm run test
```

### Format Code

```bash
pnpm run format
```

### Run Linter

```bash
pnpm run lint
```

### Build Smart Contracts Only

```bash
pnpm run contracts:build
```

### Run Frontend Development Server

```bash
pnpm run web:dev
```

## Code Style

- **Rust**: Follow Anchor conventions, use `clippy` linter
- **TypeScript**: ESLint + Prettier configured
- **Smart Contracts**: Document all public functions and state accounts

## Debugging

### View Program Logs

```bash
solana logs <program_id>
```

### Inspect Account State

```bash
solana account <account_address>
```

### View Blockchain History

```bash
solana transaction <tx_signature>
```

## Testing

### Unit Tests (Rust)

Tests are in each program's test module:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculation() {
        // test code
    }
}
```

### Integration Tests

Run with:

```bash
anchor test --provider.cluster devnet
```

### Frontend Tests

```bash
cd apps/web
pnpm test
```

## Making Changes

### Adding a New Instruction

1. Add instruction in `programs/*/src/lib.rs`
2. Define `Accounts` struct
3. Add tests
4. Document in `docs/API.md`
5. Update frontend to call instruction

### Adding a New Endpoint to Frontend

1. Create new page in `apps/web/src/app/[page]/page.tsx`
2. Add to navigation
3. Test locally with `pnpm run web:dev`

### Updating Types

1. Modify `packages/types/src/index.ts`
2. Update dependent packages: `pnpm run build`

## Deployment

### Deploy to Devnet

```bash
./scripts/deploy.sh devnet
```

### Deploy to Testnet

```bash
./scripts/deploy.sh testnet
```

### Deploy to Mainnet

```bash
./scripts/deploy.sh mainnet
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Troubleshooting

### "Anchor not found"

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
```

### "Solana validator failed to start"

Ensure ports 8899 (RPC) and 9999 (PubSub) are available.

### "Workspace not found"

Verify `pnpm-workspace.yaml` is in root and run `pnpm install`.

### Smart contract build fails

Update Anchor and Solana:

```bash
avm use latest
solana-install update
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and commit: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Resources

- [Anchor Documentation](https://docs.rs/anchor-lang/)
- [Solana Docs](https://docs.solana.com/)
- [SPL Token Docs](https://spl.solana.com/token)
- [Solana Cookbook](https://solanacookbook.com/)
