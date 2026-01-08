import { NAVState, TreasuryMetrics, TreasuryHolding } from '@nasdaq-strategy/types';

/**
 * Calculate Net Asset Value per token
 * @param treasuryValueUsd Total USD value of treasury assets
 * @param totalSupply Total supply of tokens (in base units)
 * @returns NAV per token (scaled by 1e6)
 */
export function calculateNAV(treasuryValueUsd: number, totalSupply: number): number {
  if (totalSupply === 0) return 0;
  return (treasuryValueUsd * 1_000_000) / totalSupply;
}

/**
 * Calculate backing ratio percentage
 * @param treasuryValueUsd Total USD value in treasury
 * @param totalSupply Total supply of tokens
 * @returns Backing ratio as percentage (0-100+)
 */
export function calculateBackingRatio(treasuryValueUsd: number, totalSupply: number): number {
  if (totalSupply === 0) return 0;
  return (treasuryValueUsd / totalSupply) * 100;
}

/**
 * Calculate premium/discount to NAV
 * @param currentPrice Current token price in USD
 * @param navPerToken NAV per token in USD
 * @returns Premium/discount as percentage (positive = premium, negative = discount)
 */
export function calculatePremiumDiscount(currentPrice: number, navPerToken: number): number {
  if (navPerToken === 0) return 0;
  return ((currentPrice - navPerToken) / navPerToken) * 100;
}

/**
 * Calculate fee amount
 * @param transactionAmount Transaction amount
 * @param feePercentage Fee percentage (basis points, e.g., 400 = 4%)
 * @returns Fee amount
 */
export function calculateFee(transactionAmount: number, feePercentage: number): number {
  return (transactionAmount * feePercentage) / 10000;
}

/**
 * Calculate USDC to release on redemption
 * @param tokenAmount Amount of tokens to redeem
 * @param navPerToken NAV per token (scaled by 1e6)
 * @returns USDC amount to release
 */
export function calculateRedemptionAmount(tokenAmount: number, navPerToken: number): number {
  return (tokenAmount * navPerToken) / 1_000_000;
}

/**
 * Calculate treasury composition percentages
 * @param holdings Array of treasury holdings
 * @param totalValue Total treasury value in USD
 * @returns Array of holdings with percentage allocation
 */
export function calculateAllocationPercentages(
  holdings: TreasuryHolding[],
  totalValue: number
): Array<TreasuryHolding & { allocationPercentage: number }> {
  if (totalValue === 0) {
    return holdings.map((h) => ({ ...h, allocationPercentage: 0 }));
  }

  return holdings.map((h) => ({
    ...h,
    allocationPercentage: (h.currentUsdcValue / totalValue) * 100,
  }));
}

/**
 * Validate fee percentage is within acceptable range
 * @param feePercentage Fee percentage in basis points
 * @returns true if valid
 */
export function isValidFeePercentage(feePercentage: number): boolean {
  // Allow 0-50% (0-5000 basis points)
  return feePercentage >= 0 && feePercentage <= 5000;
}

/**
 * Format number as USD currency
 * @param value Value in USD
 * @returns Formatted string
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format percentage
 * @param value Percentage value
 * @returns Formatted string
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}
