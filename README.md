# nasdaq-strategy
<img width="950" height="264" alt="Capture d’écran 2026-01-08 à 18 30 25" src="https://github.com/user-attachments/assets/6265f460-350c-49b4-9ec9-8a72ac346358" />

A **memecoin with a balance sheet**. A Solana treasury-backed strategy protocol that progressively accumulates Nasdaq exposure through transparent, deterministic rules.

![Status](https://img.shields.io/badge/status-Beta-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Network](https://img.shields.io/badge/network-Solana-purple)

**X/Twitter**: [@nasdaqstrategyy](https://x.com/nasdaqstrategyy)

## What is nasdaq-strategy?

nasdaq-strategy is a **crypto-native strategy protocol** that combines memecoin mechanics with treasury-backed fundamentals. Over time, it graduates from pure memecoin to fully-backed, redeemable NAV-based asset.
<img width="747" height="1025" alt="Capture d’écran 2026-01-08 à 18 41 41" src="https://github.com/user-attachments/assets/7fa6ffcf-d9e8-4bc6-833f-35f750d659cc" />

### Key Characteristics

- **Memecoin DNA**: Fun, social, and crypto-native
- **Balance Sheet First**: Transparent treasury, publicly auditable
- **Progressive Backing**: NAV increases as treasury accumulates
- **Deterministic Rules**: No discretionary treasury management
- **Fully Redeemable**: Token holders can redeem at NAV anytime

## What This Is NOT

- **NOT a security**: Not registered, not regulated, not affiliated with any government
- **NOT an ETF**: No fund manager, no custodian, no regulatory oversight
- **NOT affiliated with Nasdaq**: Uses "nasdaq" as reference to index exposure strategy only
- **NOT a guarantee**: No promises of returns, risk of total loss
- **NOT financial advice**: Do your own research, consult professionals

**[Full Disclaimer](./docs/DISCLAIMER.md)**

## How It Works

### Phase 1: Memecoin Phase
Token launches with community excitement. Trading fees begin accumulating.

### Phase 2: Accumulation Phase
Protocol uses fees to progressively buy Nasdaq exposure proxies (e.g., synthetic QQQ, IVV).
All purchases logged on-chain, rules-based, deterministic.

### Phase 3: Strategy Phase
Treasury value tracked. NAV per token calculated and published in real-time.
Token may trade at premium or discount to NAV depending on market sentiment.

### Phase 4: Redemption Phase
Token holders can redeem at NAV, burning tokens and releasing proportional backing.
Supply gradually contracts toward fully-backed equilibrium.

## Backing Mechanism

```
┌─ Trading Fee (4% fixed)
│  ├─ 2.5% → Strategy Treasury (USDC accumulation)
│  ├─ 1.5% → Liquidity reinforcement
│  └─ 0% → Other (protocol discretion)
│
├─ Treasury Accumulation
│  ├─ USDC balance grows from fees
│  └─ Periodic rule-based purchases of index proxies
│
├─ NAV Calculation
│  └─ NAV = (Total Treasury Value USD) / (Total Token Supply)
│
└─ Redemption
   ├─ Token Holder: "I want to redeem 1M tokens"
   ├─ Protocol: "NAV is $0.0847, so you get $84,700 USDC"
   ├─ Tokens: Burned (permanent removal from supply)
   └─ USDC: Transferred to token holder
```

## Treasury Security Model
<img width="745" height="1018" alt="Capture d’écran 2026-01-08 à 18 43 05" src="https://github.com/user-attachments/assets/5f082be5-6d5f-463e-b4a4-9885eb9a479e" />

### Fixed Rules (Immutable at Launch)

**No manual withdrawal authority** - Treasury can't be drained  
**No leverage** - Only holds actual assets  
**Approved purchases only** - Only whitelisted proxy assets  
**Minimum purchase enforcement** - Prevents dust  
**No mint after launch** - Supply is hard-capped  

### NAV Calculation

Fully transparent, mathematically deterministic:

```
NAV per Token = (Treasury USD Value) / (Total Supply) × 10^6

Treasury Value = USDC Balance + (QQQ Proxy Holdings) + (IVV Proxy Holdings)
Total Supply = 14.76M tokens (fixed)
```

Example: If treasury = $1.25M and supply = 14.76M tokens:
```
NAV = ($1,250,000 / 14,760,000) × 10^6 = $0.0847 per token
```

## Example Progression

| Time | Treasury | NAV | Backing % | Supply |
|------|----------|-----|-----------|--------|
| Day 0 | $0 | $0.00 | 0% | 14.76M |
| Day 30 | $250K | $0.017 | 1.7% | 14.76M |
| Day 90 | $1.25M | $0.0847 | 8.47% | 14.76M |
| Day 180 | $5M | $0.339 | 33.9% | 14.76M |
| Day 365+ | $15M | $1.02 | 102% | 12M (after redemptions) |

Token becomes fully backed and redeemable at 1:1 NAV parity.

## System Architecture

### Smart Contracts

**Two Anchor programs**:

1. **nasdaq_strategy_core** - Token mechanics, fee collection, NAV calculation
2. **nasdaq_strategy_treasury** - Asset accumulation, redemption, holdings tracking

### Frontend

Next.js dashboard for:
- Real-time NAV and metrics
- Treasury composition visualization
- Activity log from on-chain events
- Redemption interface
- Educational content

### Data Flow

```
User Transaction
    ↓
Transfer with Fee Collection
    ↓
Fee Distribution (2.5% → Treasury USDC)
    ↓
Treasury Accumulation
    ↓
Strategy Purchase (rules-based)
    ↓
NAV Recalculation
    ↓
Redemption (token holder initiated)
```

## Getting Started

### For Users

1. **Visit the Dashboard**: [nasdaq-strategy.com](https://nasdaq-strategy.com)
2. **Understand the Mechanics**: Read the [How It Works](https://nasdaq-strategy.com) page
3. **Review Disclaimers**: [Full Disclaimer](https://nasdaq-strategy.com/disclaimer)
4. **Buy Tokens**: Available on DEX (Orca, Raydium, etc.)
5. **Redeem if Desired**: Use redemption interface anytime

### For Developers

#### Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.17+
- Anchor 0.29+

#### Local Setup

```bash
# Clone repository
git clone https://github.com/rthefinder/nasdaq-strategy.git
cd nasdaq-strategy

# Install dependencies
pnpm install

# Build smart contracts
cd programs/nasdaq_strategy_core && anchor build
cd ../nasdaq_strategy_treasury && anchor build

# Run tests
anchor test

# Start local development
cd apps/web && pnpm dev
```

Visit `http://localhost:3000`

**[Full Development Guide](./docs/DEVELOPMENT.md)**

## 📚 Documentation

- **[Architecture](./docs/ARCHITECTURE.md)** - System design and data flow
- **[API Reference](./docs/API.md)** - Smart contract instructions and events
- **[Development Guide](./docs/DEVELOPMENT.md)** - Local setup and development
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - How to deploy to Devnet/Testnet/Mainnet
- **[Disclaimer](./docs/DISCLAIMER.md)** - Legal disclaimers

## 🔍 On-Chain Verification

All treasury activity is publicly verifiable on Solana blockchain:

**Core Program ID**: `5GW9VZvakFrYrLHiNVmLBEY6M5tBMjWZMPMWCHBY8RZH`  
**Treasury Program ID**: `2PBFG7KwBGGzUPH5rC4XLMhQwKhPy8yHvUkq5L2WnQ1u`

View with:
- [Solscan](https://solscan.io)
- [Solana Explorer](https://explorer.solana.com)
- [Helius Dashboard](https://helius.xyz)

**Verify Treasury**:
1. Query `config` account → View `treasury` address
2. Query `treasury` account → View `usdc_vault` balance
3. Query `nav_state` → See latest NAV calculation
4. Filter program logs → View all fee/purchase/redemption events

## 💡 How NAV is Calculated

Real-time on-chain calculation:

```typescript
// Called whenever treasury composition changes
update_nav(treasury_value_usd: u64)

// Calculation logic
nav_per_token = (treasury_value_usd * 1_000_000) / total_supply
backing_ratio = (treasury_value_usd * 10_000) / total_supply

// Event emitted
NAVUpdated {
  treasury_value_usd,
  nav_per_token,
  backing_ratio,
  timestamp
}
```

### Data Sources for Treasury Values

1. **USDC Balance**: Direct SPL token account balance
2. **QQQ Proxy**: Oracle price feed or DEX spot price
3. **IVV Proxy**: Oracle price feed or DEX spot price

## 🔄 Redemption Process

Step-by-step:

```
1. User: "I have 1,000,000 tokens"
2. Protocol: "Current NAV is $0.0847 per token"
3. User: "Redeem my tokens"
4. Protocol: 
   - Calculate: 1M × $0.0847 = $84,700 USDC
   - Burn: 1M tokens
   - Release: $84,700 USDC to user
5. Result:
   - User: -1M tokens, +$84,700 USDC
   - Supply: -1M tokens (now 13.76M)
   - Treasury: -$84,700 USDC
```

### Redemption is Always Possible

- No minimum lock-up period
- No redemption fees
- Subject to treasury liquidity
- Proportional to NAV

## 🛡️ Risk Warnings

### Market Risk
- Nasdaq proxy tokens may decline in value
- Trading volume may be insufficient for redemption
- Smart contracts may contain bugs or exploits

### Regulatory Risk
- Crypto regulation uncertain globally
- Protocol may be classified as security in some jurisdictions
- Government restrictions possible

### Liquidity Risk
- Large redemptions may deplete treasury USDC
- DEX liquidity may dry up
- Slippage on large trades

### Technology Risk
- Smart contracts are experimental
- May contain undiscovered vulnerabilities
- Blockchain itself has inherent risks

**Do not invest more than you can afford to lose.**

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📋 Project Structure

```
nasdaq-strategy/
├── programs/                          # Smart contracts
│   ├── nasdaq_strategy_core/         # Token & NAV
│   └── nasdaq_strategy_treasury/     # Treasury & redemption
├── apps/
│   └── web/                          # Next.js frontend
├── packages/
│   ├── types/                        # Shared TypeScript types
│   └── utils/                        # Utility functions
├── docs/                             # Documentation
├── scripts/                          # Deployment scripts
├── tests/                            # Integration tests
└── .github/workflows/                # CI/CD pipelines
```

## 🔗 Links

- **Website**: [nasdaq-strategy.com](https://nasdaq-strategy.com)
- **GitHub**: [github.com/rthefinder/nasdaq-strategy](https://github.com/rthefinder/nasdaq-strategy)
- **Discord**: (Coming soon)
- **Twitter**: (Coming soon)
- **Solscan**: [Core Program](https://solscan.io/account/5GW9VZvakFrYrLHiNVmLBEY6M5tBMjWZMPMWCHBY8RZH)

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

## ⚖️ Legal

**nasdaq-strategy is NOT affiliated with or endorsed by Nasdaq, Inc.**

This is a decentralized, community-driven protocol. There are no regulatory approvals, no fund managers, and no guarantees.

Read the [full disclaimer](./docs/DISCLAIMER.md) before using.

## ❓ FAQ

### Is this a security?
No. It's a decentralized protocol token, not a registered security.

### Can I lose money?
Yes. Like all crypto, you can lose your entire investment.

### How is the protocol managed?
Rules-based execution. No admin discretion. Smart contracts execute deterministically.

### When can I redeem?
Anytime. Redemption at NAV is always available (subject to liquidity).

### What if treasury value declines?
NAV declines proportionally. Token holders share the loss fairly.

### Is there an audit?
[Audit link will be posted]

### How do I verify the treasury on-chain?
See [On-Chain Verification](#-on-chain-verification) section.

---

**Built with ❤️ by the crypto community.**

**Remember: This is experimental. Only invest what you can afford to lose.**
