# API Reference

## Core Program (nasdaq_strategy_core)

### Accounts

#### Config (PDA)

Stores protocol-wide configuration.

```rust
pub struct Config {
    pub mint: Pubkey,                  // Token mint
    pub fee_collector: Pubkey,         // Fee recipient
    pub treasury: Pubkey,              // Treasury vault
    pub total_supply: u64,             // 14.76M tokens
    pub fee_percentage: u16,           // 400 = 4%
    pub is_initialized: bool,
}
```

#### NAVState (PDA)

Real-time NAV calculation state.

```rust
pub struct NAVState {
    pub treasury_value_usd: u64,      // Total USD value
    pub nav_per_token: u64,           // Scaled by 1e6
    pub backing_ratio: u64,           // Percentage
    pub last_update: i64,             // Unix timestamp
}
```

### Instructions

#### initialize

Initialize protocol configuration.

**Parameters**:
- `total_supply: u64` - Total token supply (14.76M with 6 decimals)
- `fee_percentage: u16` - Fee in basis points (400 = 4%)

**Accounts Required**:
- `config` (must create)
- `mint` (token mint)
- `fee_collector` (USDC recipient)
- `treasury` (vault address)
- `payer` (signer, pays rent)

**Example**:
```typescript
const tx = await program.methods
  .initialize(
    new BN(14_760_000_000_000),  // 14.76M supply
    400                          // 4% fee
  )
  .accounts({
    config: configPDA,
    mint: tokenMint,
    feeCollector: treasuryUSDC,
    treasury: treasuryVault,
    payer: payer.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

#### transfer_with_fee

Execute transfer with automatic fee collection.

**Parameters**:
- `amount: u64` - Transfer amount

**Accounts Required**:
- `config` (protocol config)
- `sender_token_account` (source)
- `recipient_token_account` (destination)
- `treasury_token_account` (fee recipient)
- `sender` (signer)
- `token_program`

**Behavior**:
- Calculates fee: `amount * fee_percentage / 10000`
- Transfers: `amount - fee` to recipient
- Transfers: `fee` to treasury
- Emits `FeesCollected` event

**Example**:
```typescript
const tx = await program.methods
  .transferWithFee(new BN(1_000_000))
  .accounts({
    config: configPDA,
    senderTokenAccount: userTokenAccount,
    recipientTokenAccount: recipientTokenAccount,
    treasuryTokenAccount: treasuryTokenAccount,
    sender: user.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .signers([user])
  .rpc();
```

#### update_nav

Recalculate NAV based on treasury value.

**Parameters**:
- `treasury_value_usd: u64` - Total USD value in treasury

**Accounts Required**:
- `config` (protocol config)
- `nav_state` (NAV state to update)
- `authority` (signer)
- `system_program`

**Calculation**:
```
nav_per_token = (treasury_value_usd * 1_000_000) / total_supply
backing_ratio = (treasury_value_usd * 10000) / total_supply
```

**Example**:
```typescript
const tx = await program.methods
  .updateNav(new BN(1_250_000_000000))  // $1.25M USD
  .accounts({
    config: configPDA,
    navState: navStatePDA,
    authority: oracleAuthority.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([oracleAuthority])
  .rpc();
```

### Events

#### ConfigInitialized

Emitted when protocol is initialized.

```rust
pub struct ConfigInitialized {
    pub mint: Pubkey,
    pub total_supply: u64,
    pub fee_percentage: u16,
}
```

#### FeesCollected

Emitted on each transfer with fees.

```rust
pub struct FeesCollected {
    pub amount: u64,            // Transaction amount
    pub fee: u64,               // Fee collected
    pub transfer_amount: u64,   // Net transfer
    pub timestamp: i64,
}
```

#### NAVUpdated

Emitted when NAV is recalculated.

```rust
pub struct NAVUpdated {
    pub treasury_value_usd: u64,
    pub nav_per_token: u64,
    pub backing_ratio: u64,
    pub timestamp: i64,
}
```

---

## Treasury Program (nasdaq_strategy_treasury)

### Accounts

#### Treasury

Vault configuration.

```rust
pub struct Treasury {
    pub usdc_vault: Pubkey,
    pub vault_authority: Pubkey,
    pub total_usdc_accumulated: u64,
    pub rebalance_frequency: u64,    // Seconds
    pub min_purchase_amount: u64,    // $100K
    pub is_initialized: bool,
}
```

#### TreasuryHolding

Individual asset holding.

```rust
pub struct TreasuryHolding {
    pub asset: Pubkey,
    pub amount_usdc_spent: u64,
    pub current_usdc_value: u64,
    pub asset_amount: u64,
    pub purchase_timestamp: i64,
    pub last_update: i64,
}
```

#### StrategyRule

Approved asset for purchase.

```rust
pub struct StrategyRule {
    pub approved_asset: Pubkey,
    pub max_allocation_percentage: u16,
    pub is_active: bool,
}
```

### Instructions

#### initialize_treasury

Create treasury vault.

**Parameters**:
- `rebalance_frequency: u64` - Update frequency in seconds (604800 = 7 days)
- `min_purchase_amount: u64` - Minimum purchase in USDC (100_000_000 = $100K)

**Example**:
```typescript
const tx = await program.methods
  .initializeTreasury(
    new BN(604800),              // 7 days
    new BN(100_000_000)          // $100K minimum
  )
  .accounts({
    treasury: treasuryPDA,
    usdcVault: usdcVaultAccount,
    vaultAuthority: vaultAuthority.publicKey,
    payer: payer.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .rpc();
```

#### deposit_fees

Receive fees from token program.

**Parameters**:
- `amount: u64` - USDC amount to deposit

**Example**:
```typescript
const tx = await program.methods
  .depositFees(new BN(50_000_000))  // $50K USDC
  .accounts({
    treasury: treasuryPDA,
    fromUsdcAccount: feeSourceAccount,
    usdcVault: treasuryUsdcVault,
    authority: feeCollector.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .signers([feeCollector])
  .rpc();
```

#### execute_strategy_purchase

Purchase approved index proxy.

**Parameters**:
- `exposure_asset: Pubkey` - Asset to purchase
- `amount_usdc: u64` - USDC to spend

**Requirements**:
- Asset must be approved in StrategyRule
- Amount must be ≥ min_purchase_amount
- Treasury must have sufficient USDC

**Example**:
```typescript
const tx = await program.methods
  .executeStrategyPurchase(
    qqqProxyMint,
    new BN(500_000_000)  // $500K
  )
  .accounts({
    treasury: treasuryPDA,
    holding: holdingPDA,
    strategyRule: rulePDA,
    authority: executor.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([executor])
  .rpc();
```

#### redeem_tokens

Burn tokens and release backing.

**Parameters**:
- `token_amount: u64` - Tokens to redeem
- `nav_per_token: u64` - Current NAV (from core program)

**Calculation**:
```
usdc_release = (token_amount * nav_per_token) / 1_000_000
```

**Example**:
```typescript
const tx = await program.methods
  .redeemTokens(
    new BN(1_000_000),     // 1M tokens
    new BN(84700)          // NAV $0.0847 (scaled)
  )
  .accounts({
    tokenMint: tokenMint,
    redeemerTokenAccount: userTokenAccount,
    usdcVault: treasuryUsdcVault,
    redeemerUsdcAccount: userUsdcAccount,
    vaultAuthority: vaultAuthority.publicKey,
    redeemer: user.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
  })
  .signers([user])
  .rpc();
```

#### update_holding_value

Update asset holding value.

**Parameters**:
- `current_usdc_value: u64` - Mark-to-market USD value

**Example**:
```typescript
const tx = await program.methods
  .updateHoldingValue(new BN(525_000_000))  // $525K value
  .accounts({
    holding: holdingPDA,
    authority: oracleAuthority.publicKey,
  })
  .signers([oracleAuthority])
  .rpc();
```

### Events

#### TreasuryInitialized

Emitted on treasury creation.

```rust
pub struct TreasuryInitialized {
    pub usdc_vault: Pubkey,
    pub rebalance_frequency: u64,
    pub min_purchase_amount: u64,
}
```

#### FeesDeposited

Emitted on fee deposit.

```rust
pub struct FeesDeposited {
    pub amount: u64,
    pub total_accumulated: u64,
    pub timestamp: i64,
}
```

#### StrategyPurchaseExecuted

Emitted on asset purchase.

```rust
pub struct StrategyPurchaseExecuted {
    pub exposure_asset: Pubkey,
    pub amount_usdc: u64,
    pub remaining_usdc: u64,
    pub timestamp: i64,
}
```

#### TokenRedeemed

Emitted on redemption.

```rust
pub struct TokenRedeemed {
    pub redeemer: Pubkey,
    pub token_amount: u64,
    pub usdc_released: u64,
    pub timestamp: i64,
}
```

---

## Shared Utilities

### calculateNAV

```typescript
function calculateNAV(treasuryValueUsd: number, totalSupply: number): number
```

Calculate NAV per token.

### calculateBackingRatio

```typescript
function calculateBackingRatio(treasuryValueUsd: number, totalSupply: number): number
```

Calculate backing ratio percentage.

### calculatePremiumDiscount

```typescript
function calculatePremiumDiscount(currentPrice: number, navPerToken: number): number
```

Calculate premium/discount to NAV.

### calculateFee

```typescript
function calculateFee(transactionAmount: number, feePercentage: number): number
```

Calculate transaction fee.

### calculateRedemptionAmount

```typescript
function calculateRedemptionAmount(tokenAmount: number, navPerToken: number): number
```

Calculate USDC to receive on redemption.

---

## Error Codes

### Core Program

- `NotInitialized` (6000): Config not initialized
- `MathOverflow` (6001): Math calculation overflow
- `InvalidFeePercentage` (6002): Fee outside acceptable range
- `InsufficientBalance` (6003): Insufficient token balance

### Treasury Program

- `NotInitialized` (6100): Treasury not initialized
- `MathOverflow` (6101): Math calculation overflow
- `ZeroAmount` (6102): Zero amount provided
- `BelowMinimumPurchase` (6103): Amount below minimum
- `InsufficientFunds` (6104): Treasury USDC insufficient
- `UnapprovedAsset` (6105): Asset not whitelisted
