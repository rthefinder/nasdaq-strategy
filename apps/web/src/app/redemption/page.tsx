'use client';

import Link from 'next/link';
import { Wallet, AlertTriangle } from 'lucide-react';

export default function Redemption() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text">
              nasdaq-strategy
            </Link>
            <div className="flex gap-8">
              <Link href="/" className="text-sm hover:text-blue-400">
                Overview
              </Link>
              <Link href="/treasury" className="text-sm hover:text-blue-400">
                Treasury
              </Link>
              <Link href="/activity" className="text-sm hover:text-blue-400">
                Activity
              </Link>
              <Link href="/redemption" className="text-sm text-blue-400">
                Redeem
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2">
          <Wallet className="h-8 w-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Token Redemption</h1>
        </div>

        {/* How Redemption Works */}
        <div className="card mb-8">
          <h2 className="mb-6 text-2xl font-bold">How Redemption Works</h2>
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-800/50 p-4">
              <h3 className="mb-2 font-semibold text-blue-400">Step 1: Check Current NAV</h3>
              <p className="text-sm text-slate-400">
                Current NAV per token is <strong>$0.0847</strong>. This is the price at which you can
                redeem.
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <h3 className="mb-2 font-semibold text-blue-400">Step 2: Connect Wallet</h3>
              <p className="text-sm text-slate-400">
                Connect your Solana wallet containing nasdaq-strategy tokens.
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <h3 className="mb-2 font-semibold text-blue-400">Step 3: Enter Amount</h3>
              <p className="text-sm text-slate-400">
                Specify how many tokens you want to redeem. You will receive USDC equal to: amount ×
                NAV per token.
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <h3 className="mb-2 font-semibold text-blue-400">Step 4: Sign Transaction</h3>
              <p className="text-sm text-slate-400">
                Sign the transaction to execute redemption. Tokens are burned and USDC backing is
                released.
              </p>
            </div>
          </div>
        </div>

        {/* Redemption Calculator */}
        <div className="card mb-8">
          <h2 className="mb-6 text-2xl font-bold">Redemption Calculator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tokens to Redeem
              </label>
              <input
                type="number"
                placeholder="1000000"
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none"
              />
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">NAV per Token</span>
                  <span className="font-semibold">$0.0847</span>
                </div>
                <div className="border-t border-slate-700 pt-2 flex justify-between">
                  <span className="text-slate-300">USDC You Will Receive</span>
                  <span className="font-bold text-green-400">$84,700</span>
                </div>
              </div>
            </div>
            <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500">
              Connect Wallet to Redeem
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="card">
          <h2 className="mb-6 text-2xl font-bold">Redemption FAQ</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="mb-2 font-semibold">What happens when I redeem?</h3>
              <p className="text-slate-400">
                Your tokens are burned (permanently removed from supply) and you receive USDC equal
                to token_amount × NAV_per_token.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">When is NAV updated?</h3>
              <p className="text-slate-400">
                NAV is recalculated whenever treasury value changes (e.g., after fee accumulation or
                strategic purchases). Updates are posted on-chain.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Can I redeem at any time?</h3>
              <p className="text-slate-400">
                Yes. Redemption is always available, subject to treasury USDC liquidity. If treasury
                is illiquid, redemptions may be queued.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Is there a redemption fee?</h3>
              <p className="text-slate-400">
                No. Redemption at NAV incurs no additional fee. You receive the full proportional
                backing.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">What if NAV is less than market price?</h3>
              <p className="text-slate-400">
                If the token trades at a premium to NAV, you can profit by redeeming. If it trades
                at a discount, holding may be preferable.
              </p>
            </div>
          </div>
        </div>

        {/* Warnings */}
        <div className="card mt-8 border-red-600/30 bg-red-600/5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h2 className="text-2xl font-bold">Important Warnings</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <strong>Treasury Risk:</strong> NAV is backed by treasury holdings. If holdings
              decline in value, so does NAV.
            </li>
            <li>
              <strong>Liquidity Risk:</strong> Large redemptions may deplete treasury USDC.
              Redemptions could be queued.
            </li>
            <li>
              <strong>Smart Contract Risk:</strong> Protocol is subject to smart contract bugs or
              exploits.
            </li>
            <li>
              <strong>Market Risk:</strong> Nasdaq exposure proxies may decline in value. Past
              performance does not guarantee future results.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
