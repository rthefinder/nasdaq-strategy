use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

declare_id!("5GW9VZvakFrYrLHiNVmLBEY6M5tBMjWZMPMWCHBY8RZH");

#[program]
pub mod nasdaq_strategy_core {
    use super::*;

    /// Initialize the strategy token configuration
    /// Sets up minting authority, fee collector, and initial parameters
    pub fn initialize(
        ctx: Context<Initialize>,
        total_supply: u64,
        fee_percentage: u16,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.mint = ctx.accounts.mint.key();
        config.fee_collector = ctx.accounts.fee_collector.key();
        config.total_supply = total_supply;
        config.fee_percentage = fee_percentage;
        config.treasury = ctx.accounts.treasury.key();
        config.is_initialized = true;

        emit!(ConfigInitialized {
            mint: config.mint,
            total_supply,
            fee_percentage,
        });

        Ok(())
    }

    /// Execute a token transfer with automatic fee collection
    /// Fees are routed to the strategy treasury
    pub fn transfer_with_fee(
        ctx: Context<TransferWithFee>,
        amount: u64,
    ) -> Result<()> {
        let config = &ctx.accounts.config;
        require!(config.is_initialized, CustomError::NotInitialized);

        // Calculate fee
        let fee = (amount as u128)
            .checked_mul(config.fee_percentage as u128)
            .ok_or(CustomError::MathOverflow)?
            .checked_div(10000)
            .ok_or(CustomError::MathOverflow)? as u64;

        let transfer_amount = amount.checked_sub(fee).ok_or(CustomError::MathOverflow)?;

        // Transfer to recipient
        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.sender_token_account.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    authority: ctx.accounts.sender.to_account_info(),
                },
            ),
            transfer_amount,
        )?;

        // Transfer fee to treasury
        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx.accounts.sender_token_account.to_account_info(),
                    to: ctx.accounts.treasury_token_account.to_account_info(),
                    authority: ctx.accounts.sender.to_account_info(),
                },
            ),
            fee,
        )?;

        emit!(FeesCollected {
            amount,
            fee,
            transfer_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    /// Update NAV calculation state
    /// Called periodically to recalculate the Net Asset Value per token
    pub fn update_nav(ctx: Context<UpdateNAV>, treasury_value_usd: u64) -> Result<()> {
        let config = &ctx.accounts.config;
        let nav_state = &mut ctx.accounts.nav_state;

        require!(config.is_initialized, CustomError::NotInitialized);

        // Calculate NAV per token
        // nav_per_token = treasury_value_usd / total_supply * 1e6 (for decimals)
        let nav_per_token = if config.total_supply > 0 {
            (treasury_value_usd as u128)
                .checked_mul(1_000_000)
                .ok_or(CustomError::MathOverflow)?
                .checked_div(config.total_supply as u128)
                .ok_or(CustomError::MathOverflow)? as u64
        } else {
            0
        };

        nav_state.treasury_value_usd = treasury_value_usd;
        nav_state.nav_per_token = nav_per_token;
        nav_state.last_update = Clock::get()?.unix_timestamp;
        nav_state.backing_ratio = if treasury_value_usd > 0 {
            ((treasury_value_usd as u128)
                .checked_mul(10000)
                .ok_or(CustomError::MathOverflow)?
                .checked_div(config.total_supply as u128)
                .ok_or(CustomError::MathOverflow)?) as u64
        } else {
            0
        };

        emit!(NAVUpdated {
            treasury_value_usd,
            nav_per_token,
            backing_ratio: nav_state.backing_ratio,
            timestamp: nav_state.last_update,
        });

        Ok(())
    }
}

// Accounts

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 32 + 8 + 2 + 32 + 1)]
    pub config: Account<'info, Config>,
    pub mint: AccountInfo<'info>,
    pub fee_collector: AccountInfo<'info>,
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferWithFee<'info> {
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub sender_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_token_account: Account<'info, TokenAccount>,
    pub sender: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateNAV<'info> {
    pub config: Account<'info, Config>,
    #[account(init_if_needed, payer = authority, space = 8 + 8 + 8 + 8 + 8)]
    pub nav_state: Account<'info, NAVState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// State Accounts

#[account]
pub struct Config {
    pub mint: Pubkey,
    pub fee_collector: Pubkey,
    pub treasury: Pubkey,
    pub total_supply: u64,
    pub fee_percentage: u16,
    pub is_initialized: bool,
}

#[account]
pub struct NAVState {
    pub treasury_value_usd: u64,
    pub nav_per_token: u64,
    pub backing_ratio: u64,
    pub last_update: i64,
}

// Events

#[event]
pub struct ConfigInitialized {
    pub mint: Pubkey,
    pub total_supply: u64,
    pub fee_percentage: u16,
}

#[event]
pub struct FeesCollected {
    pub amount: u64,
    pub fee: u64,
    pub transfer_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct NAVUpdated {
    pub treasury_value_usd: u64,
    pub nav_per_token: u64,
    pub backing_ratio: u64,
    pub timestamp: i64,
}

// Errors

#[error_code]
pub enum CustomError {
    #[msg("Config is not initialized")]
    NotInitialized,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid fee percentage")]
    InvalidFeePercentage,
    #[msg("Insufficient balance")]
    InsufficientBalance,
}
