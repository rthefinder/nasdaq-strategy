export interface StrategyConfig {
  mint: string;
  feeCollector: string;
  treasury: string;
  totalSupply: number;
  feePercentage: number;
  isInitialized: boolean;
}

export interface NAVState {
  treasuryValueUsd: number;
  navPerToken: number;
  backingRatio: number;
  lastUpdate: number;
}

export interface TreasuryState {
  usdcVault: string;
  vaultAuthority: string;
  totalUsdcAccumulated: number;
  rebalanceFrequency: number;
  minPurchaseAmount: number;
  isInitialized: boolean;
}

export interface TreasuryHolding {
  asset: string;
  amountUsdcSpent: number;
  currentUsdcValue: number;
  assetAmount: number;
  purchaseTimestamp: number;
  lastUpdate: number;
}

export interface StrategyRule {
  approvedAsset: string;
  maxAllocationPercentage: number;
  isActive: boolean;
}

export interface FeesCollectedEvent {
  amount: number;
  fee: number;
  transferAmount: number;
  timestamp: number;
}

export interface NAVUpdatedEvent {
  treasuryValueUsd: number;
  navPerToken: number;
  backingRatio: number;
  timestamp: number;
}

export interface StrategyPurchaseExecutedEvent {
  exposureAsset: string;
  amountUsdc: number;
  remainingUsdc: number;
  timestamp: number;
}

export interface TokenRedeemedEvent {
  redeemer: string;
  tokenAmount: number;
  usdcReleased: number;
  timestamp: number;
}

export interface TreasuryMetrics {
  totalUsdcAccumulated: number;
  navPerToken: number;
  backingRatio: number;
  premiumDiscount: number;
  treasuryComposition: TreasuryHolding[];
  lastUpdated: number;
}
