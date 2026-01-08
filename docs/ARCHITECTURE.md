# Architecture

## System Overview

nasdaq-strategy is a decentralized, treasury-backed memecoin protocol on Solana. The system consists of two primary smart contract programs and a frontend dashboard.

## Program Architecture

### 1. nasdaq_strategy_core

**Purpose**: Token mechanics, fee collection, and NAV calculation

**Key Accounts**:
- `Config`: Stores protocol parameters (mint, fee %, total supply, treasury address)
- `NAVState`: Tracks treasury value, NAV per token, and backing ratio

**Key Instructions**:
- `initialize`: Sets up protocol config
- `transfer_with_fee`: Token transfer with automatic fee routing
- `update_nav`: Recalculates NAV based on treasury value

**Events**:
- `ConfigInitialized`: Protocol initialization
- `FeesCollected`: Fee collection event
- `NAVUpdated`: NAV recalculation

### 2. nasdaq_strategy_treasury

**Purpose**: Treasury management, asset accumulation, and redemption

**Key Accounts**:
- `Treasury`: Stores vault addresses and state
- `TreasuryHolding`: Tracks individual asset holdings
- `StrategyRule`: Defines approved proxy assets

**Key Instructions**:
- `initialize_treasury`: Creates treasury vault
- `deposit_fees`: Receives fees from core program
- `execute_strategy_purchase`: Buys approved index proxies
- `redeem_tokens`: Burns tokens and releases backing

**Events**:
- `FeesDeposited`: Fee deposit
- `StrategyPurchaseExecuted`: Asset purchase
- `TokenRedeemed`: Redemption event

## Data Flow

```
User Transaction
    ↓
[Token Transfer]
    ↓
[Fee Calculation] (4%)
    ↓
[Fee Split]
    ├→ Strategy Treasury (2.5% → USDC accumulation)
    ├→ Liquidity Pool (1.5%)
    └→ Burn (remaining)
    ↓
[Treasury Accumulation] (USDC balance grows)
    ↓
[Strategy Purchase] (rules-based, when triggered)
    ├→ Validates approved asset
    ├→ Validates minimum purchase amount
    └→ Records holding
    ↓
[NAV Recalculation]
    ├→ Sum treasury assets in USD
    ├→ NAV = Treasury Value / Total Supply
    └→ Update on-chain state
    ↓
[User Redemption]
    ├→ User provides token amount
    ├→ USDC released = Token Amount × NAV
    ├→ Tokens burned
    └→ USDC transferred to user
```

## State Transitions

```
Memecoin Phase → Accumulation Phase → Strategy Phase → Redemption Phase

Initial State:
- Supply: 14.76M tokens
- Treasury: $0 USDC
- NAV: $0
- Backing Ratio: 0%

Over Time:
- Fees accumulate
- NAV increases
- Backing ratio increases
- Redemption becomes viable
```

## Fee Mechanics

Transaction fee (4% fixed):
- 2.5% → Strategy Treasury (USDC vault)
- 1.5% → Liquidity incentive
- 0% → Burn (optional, from protocol discretion)

This fee structure ensures:
- Rapid treasury accumulation
- Backing ratio improvement
- No direct value extraction (fees used for protocol benefit)

## NAV Calculation

```
NAV per Token = (Treasury Value USD) / (Total Supply) × 10^6

Where:
- Treasury Value = Sum of all holdings in USD
  ├→ USDC balance
  ├→ QQQ Proxy value (mark-to-market)
  └→ IVV Proxy value (mark-to-market)
- Total Supply = 14.76M (fixed, no mint after launch)
```

## Redemption Mechanics

```
Redemption Equation:
USDC Released = (Token Amount) × (NAV per Token) / 10^6

Examples:
- Redeem 1M tokens at NAV $0.10 → Receive $100K USDC
- Redeem 500K tokens at NAV $0.05 → Receive $25K USDC
```

## Security Assumptions

1. **No admin withdrawal**: Treasury authority cannot withdraw funds arbitrarily
2. **Rules-based purchasing**: Only approved assets can be purchased
3. **Minimum purchase**: Prevents dust accumulation
4. **Immutable supply**: No mint after launch
5. **Deterministic NAV**: Calculation is purely mathematical, no discretion

## Integration Points

### Oracle Integration
- Treasury holdings require price feeds for mark-to-market
- Options: Chainlink, Pyth, or on-chain AMM spot prices

### Proxy Asset Bridges
- QQQ Proxy: Synthetic or wrapped index token
- IVV Proxy: Synthetic or wrapped index token
- USDC: Native Solana SPL token

### Frontend Integration
- Real-time NAV display
- Treasury composition visualization
- Activity log from on-chain events
- Redemption interface

## Scalability Considerations

- **Account storage**: Holdings stored in separate PDA per asset
- **Event logging**: All actions emit events for indexing
- **Batch operations**: Multiple redemptions can be queued
- **Compute efficiency**: Math operations optimized for Solana VM

## Upgrade Path

- Frozen at launch (immutable programs)
- Future versions deployable as separate programs
- Migration path: Users can redeem old tokens for new backing
