use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

declare_id!("2PBFG7KwBGGzUPH5rC4XLMhQwKhPy8yHvUkq5L2WnQ1u");

#[program]
pub mod nasdaq_strategy_treasury {
    use super::*;

    /// Initialize the treasury vault
    /// Sets up USDC and exposure asset holding accounts
    pub fn initialize_treasury(
        ctx: Context<InitializeTreasury>,
        rebalance_frequency: u64,
        min_purchase_amount: u64,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.usdc_vault = ctx.accounts.usdc_vault.key();
        treasury.vault_authority = ctx.accounts.vault_authority.key();
        treasury.rebalance_frequency = rebalance_frequency;
        treasury.min_purchase_amount = min_purchase_amount;
        treasury.total_usdc_accumulated = 0;
        treasury.is_initialized = true;

        emit!(TreasuryInitialized {
            usdc_vault: treasury.usdc_vault,
            rebalance_frequency,
            min_purchase_amount,
        });

        Ok(())
    }

    /// Receive fees from strategy token and accumulate in USDC vault
    pub fn deposit_fees(ctx: Context<DepositFees>, amount: u64) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        require!(treasury.is_initialized, TreasuryError::NotInitialized);
        require!(amount > 0, TreasuryError::ZeroAmount);

        // Transfer USDC to treasury vault
        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.from_usdc_account.to_account_info(),
                    to: ctx.accounts.usdc_vault.to_account_info(),
                    authority: ctx.accounts.authority.to_account_info(),
                },
            ),
            amount,
        )?;

        treasury.total_usdc_accumulated = treasury
            .total_usdc_accumulated
            .checked_add(amount)
            .ok_or(TreasuryError::MathOverflow)?;

        emit!(FeesDeposited {
            amount,
            total_accumulated: treasury.total_usdc_accumulated,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Execute a deterministic strategy purchase
    /// Purchases exposure proxy assets using accumulated USDC
    pub fn execute_strategy_purchase(
        ctx: Context<ExecuteStrategyPurchase>,
        exposure_asset: Pubkey,
        amount_usdc: u64,
    ) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        require!(treasury.is_initialized, TreasuryError::NotInitialized);
        require!(
            amount_usdc >= treasury.min_purchase_amount,
            TreasuryError::BelowMinimumPurchase
        );
        require!(
            treasury.total_usdc_accumulated >= amount_usdc,
            TreasuryError::InsufficientFunds
        );

        // Validate that this is an approved proxy asset
        let strategy_rule = &ctx.accounts.strategy_rule;
        require!(
            strategy_rule.approved_asset == exposure_asset,
            TreasuryError::UnapprovedAsset
        );

        // Record purchase in holdings
        let holding = &mut ctx.accounts.holding;
        holding.asset = exposure_asset;
        holding.amount_usdc_spent = amount_usdc;
        holding.purchase_timestamp = Clock::get()?.unix_timestamp;
        holding.asset_amount = 0; // Will be updated off-chain or via oracle

        treasury.total_usdc_accumulated = treasury
            .total_usdc_accumulated
            .checked_sub(amount_usdc)
            .ok_or(TreasuryError::MathOverflow)?;

        emit!(StrategyPurchaseExecuted {
            exposure_asset,
            amount_usdc,
            remaining_usdc: treasury.total_usdc_accumulated,
            timestamp: holding.purchase_timestamp,
        });

        Ok(())
    }

    /// Redeem tokens at NAV
    /// Burns tokens and releases proportional backing from treasury
    pub fn redeem_tokens(
        ctx: Context<RedeemTokens>,
        token_amount: u64,
        nav_per_token: u64,
    ) -> Result<()> {
        require!(token_amount > 0, TreasuryError::ZeroAmount);

        // Calculate USDC to release
        // usdc_release = token_amount * nav_per_token / 1e6
        let usdc_release = (token_amount as u128)
            .checked_mul(nav_per_token as u128)
            .ok_or(TreasuryError::MathOverflow)?
            .checked_div(1_000_000)
            .ok_or(TreasuryError::MathOverflow)? as u64;

        // Burn tokens
        anchor_spl::token::burn(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Burn {
                    mint: ctx.accounts.token_mint.to_account_info(),
                    from: ctx.accounts.redeemer_token_account.to_account_info(),
                    authority: ctx.accounts.redeemer.to_account_info(),
                },
            ),
            token_amount,
        )?;

        // Release USDC backing
        anchor_spl::token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.usdc_vault.to_account_info(),
                    to: ctx.accounts.redeemer_usdc_account.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                &[],
            ),
            usdc_release,
        )?;

        emit!(TokenRedeemed {
            redeemer: ctx.accounts.redeemer.key(),
            token_amount,
            usdc_released: usdc_release,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Update treasury holdings with current asset values
    /// Used to recalculate NAV
    pub fn update_holding_value(
        ctx: Context<UpdateHoldingValue>,
        current_usdc_value: u64,
    ) -> Result<()> {
        let holding = &mut ctx.accounts.holding;
        holding.current_usdc_value = current_usdc_value;
        holding.last_update = Clock::get()?.unix_timestamp;

        emit!(HoldingUpdated {
            asset: holding.asset,
            current_usdc_value,
            timestamp: holding.last_update,
        });

        Ok(())
    }
}

// Accounts

#[derive(Accounts)]
pub struct InitializeTreasury<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 32 + 8 + 8 + 8 + 1)]
    pub treasury: Account<'info, Treasury>,
    pub usdc_vault: Account<'info, TokenAccount>,
    pub vault_authority: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositFees<'info> {
    #[account(mut)]
    pub treasury: Account<'info, Treasury>,
    #[account(mut)]
    pub from_usdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub usdc_vault: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ExecuteStrategyPurchase<'info> {
    #[account(mut)]
    pub treasury: Account<'info, Treasury>,
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8 + 8 + 8)]
    pub holding: Account<'info, TreasuryHolding>,
    pub strategy_rule: Account<'info, StrategyRule>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RedeemTokens<'info> {
    pub token_mint: AccountInfo<'info>,
    #[account(mut)]
    pub redeemer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub usdc_vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub redeemer_usdc_account: Account<'info, TokenAccount>,
    pub vault_authority: AccountInfo<'info>,
    pub redeemer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateHoldingValue<'info> {
    #[account(mut)]
    pub holding: Account<'info, TreasuryHolding>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

// State Accounts

#[account]
pub struct Treasury {
    pub usdc_vault: Pubkey,
    pub vault_authority: Pubkey,
    pub total_usdc_accumulated: u64,
    pub rebalance_frequency: u64,
    pub min_purchase_amount: u64,
    pub is_initialized: bool,
}

#[account]
pub struct TreasuryHolding {
    pub asset: Pubkey,
    pub amount_usdc_spent: u64,
    pub current_usdc_value: u64,
    pub asset_amount: u64,
    pub purchase_timestamp: i64,
    pub last_update: i64,
}

#[account]
pub struct StrategyRule {
    pub approved_asset: Pubkey,
    pub max_allocation_percentage: u16,
    pub is_active: bool,
}

// Events

#[event]
pub struct TreasuryInitialized {
    pub usdc_vault: Pubkey,
    pub rebalance_frequency: u64,
    pub min_purchase_amount: u64,
}

#[event]
pub struct FeesDeposited {
    pub amount: u64,
    pub total_accumulated: u64,
    pub timestamp: i64,
}

#[event]
pub struct StrategyPurchaseExecuted {
    pub exposure_asset: Pubkey,
    pub amount_usdc: u64,
    pub remaining_usdc: u64,
    pub timestamp: i64,
}

#[event]
pub struct TokenRedeemed {
    pub redeemer: Pubkey,
    pub token_amount: u64,
    pub usdc_released: u64,
    pub timestamp: i64,
}

#[event]
pub struct HoldingUpdated {
    pub asset: Pubkey,
    pub current_usdc_value: u64,
    pub timestamp: i64,
}

// Errors

#[error_code]
pub enum TreasuryError {
    #[msg("Treasury not initialized")]
    NotInitialized,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Zero amount provided")]
    ZeroAmount,
    #[msg("Amount below minimum purchase")]
    BelowMinimumPurchase,
    #[msg("Insufficient funds in treasury")]
    InsufficientFunds,
    #[msg("Asset not approved for purchase")]
    UnapprovedAsset,
}
