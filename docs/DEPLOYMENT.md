# Deployment Guide

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] Security audit completed
- [ ] Legal review completed
- [ ] Liquidity pool configured
- [ ] Proxy assets approved
- [ ] Keypairs secured in vault

## Environment Setup

### 1. Install Required Tools

```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Anchor
npm install -g @coral-xyz/anchor-cli

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Configure Solana CLI

```bash
# Set cluster
solana config set --url https://api.devnet.solana.com

# Create keypair (if needed)
solana-keygen new --outfile ~/.config/solana/id.json
```

## Deployment to Devnet

### 1. Build Programs

```bash
cd programs/nasdaq_strategy_core
anchor build
cd ../nasdaq_strategy_treasury
anchor build
cd ../..
```

### 2. Deploy Core Program

```bash
solana program deploy \
  programs/nasdaq_strategy_core/target/deploy/nasdaq_strategy_core.so \
  --keypair ~/.config/solana/id.json \
  --url https://api.devnet.solana.com
```

**Output**: Core Program ID (save this)

### 3. Deploy Treasury Program

```bash
solana program deploy \
  programs/nasdaq_strategy_treasury/target/deploy/nasdaq_strategy_treasury.so \
  --keypair ~/.config/solana/id.json \
  --url https://api.devnet.solana.com
```

**Output**: Treasury Program ID (save this)

### 4. Initialize Protocol State

Create an initialization script that calls:

```rust
initialize(
  total_supply: 14_760_000_000_000,
  fee_percentage: 400,  // 4%
)
```

## Deployment to Testnet

### 1. Request Testnet SOL

```bash
solana airdrop 2 <your_address> --url https://api.testnet.solana.com
```

### 2. Configure for Testnet

```bash
solana config set --url https://api.testnet.solana.com
```

### 3. Deploy Same as Devnet

```bash
./scripts/deploy.sh testnet
```

## Deployment to Mainnet

### CRITICAL STEPS

1. **Audit Complete**: Security audit must be complete
2. **Legal Review**: Full legal and compliance review
3. **Testnet Validation**: Must run successfully on testnet for 2+ weeks
4. **Liquidity**: DEX pools must be funded before launch

### Mainnet Deployment Process

```bash
# 1. Verify all tests pass
pnpm run test

# 2. Deploy with mainnet keypair
solana program deploy \
  programs/nasdaq_strategy_core/target/deploy/nasdaq_strategy_core.so \
  --keypair ~/.config/solana/id.json \
  --url https://api.solana.com

solana program deploy \
  programs/nasdaq_strategy_treasury/target/deploy/nasdaq_strategy_treasury.so \
  --keypair ~/.config/solana/id.json \
  --url https://api.solana.com

# 3. Initialize with mainnet parameters
# (see initialization script)

# 4. Announce to community
# (social media, Discord, etc.)
```

## Post-Deployment Steps

### 1. Verify Deployment

```bash
# Check program is deployed
solana program show <program_id> --url https://api.solana.com

# Check account state
solana account <config_account> --url https://api.solana.com
```

### 2. Initialize Liquidity Pool

On Serum/Orca/Raydium:
1. Create trading pair: nasdaq-strategy / USDC
2. Fund with initial liquidity
3. Set trading limits initially (prevent rug)

### 3. Configure Treasury Proxies

Approved assets must be whitelisted:
- QQQ Proxy token address
- IVV Proxy token address
- Minimum purchase amounts

### 4. Launch Frontend

Deploy Next.js app:

```bash
cd apps/web
pnpm run build
pnpm start
```

Or use Vercel:

```bash
vercel deploy
```

### 5. Monitor and Alerts

Set up monitoring:

```bash
# Transaction monitoring
solana transaction confirm <tx_sig>

# Account monitoring
solana account watch <account_address>

# Program logs
solana logs <program_id>
```

## Configuration Reference

### Core Program Configuration

```rust
Config {
  mint: PublicKey,           // Token mint address
  fee_collector: PublicKey,  // Fee recipient
  treasury: PublicKey,       // Treasury vault
  total_supply: 14_760_000_000_000,  // 14.76M tokens
  fee_percentage: 400,       // 4% (basis points)
  is_initialized: true,
}
```

### Treasury Configuration

```rust
Treasury {
  usdc_vault: PublicKey,
  vault_authority: PublicKey,
  total_usdc_accumulated: 0,
  rebalance_frequency: 604800,  // 7 days
  min_purchase_amount: 100_000_000,  // $100K
  is_initialized: true,
}
```

## Rollback Plan

If critical issues discovered:

1. **Pause Trading**: Implement circuit breaker (optional)
2. **Notify Users**: Announce issue and plan
3. **Deploy Patch**: 
   - Test thoroughly
   - Deploy new program
   - Migrate state if necessary
4. **Compensation**: Determine if user fund recovery needed

## Mainnet Launch Timeline

Recommended timeline:

```
Week 1: Devnet deployment + testing
Week 2: Testnet deployment + monitoring
Week 3-4: Testnet validation, security audit final
Week 5: Mainnet beta with limited funds
Week 6: Community feedback and adjustments
Week 7+: Full mainnet launch
```

## Emergency Contacts

For mainnet deployment, establish:
- Security team contact
- Legal team contact
- Community moderators
- Exchange liaisons (if listing)

## Documentation for Users

Post-launch, create:

- On-chain verification guide
- Treasury audit trail
- NAV calculation explanation
- Redemption tutorial
- Risk disclaimers (prominently displayed)

## Ongoing Maintenance

After launch:

- Monitor transaction volume
- Track treasury asset values
- Publish weekly NAV reports
- Respond to user questions
- Monitor regulatory environment
- Plan future protocol upgrades
