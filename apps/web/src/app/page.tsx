'use client';

import Link from 'next/link';
import { BarChart3, TrendingUp, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold gradient-text">nasdaq-strategy</div>
            <div className="flex gap-8">
              <Link href="/#overview" className="text-sm hover:text-blue-400">
                Overview
              </Link>
              <Link href="/treasury" className="text-sm hover:text-blue-400">
                Treasury
              </Link>
              <Link href="/activity" className="text-sm hover:text-blue-400">
                Activity
              </Link>
              <Link href="/redemption" className="text-sm hover:text-blue-400">
                Redeem
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          <h1 className="text-5xl font-bold sm:text-7xl">
            <span className="gradient-text">Memecoin</span> with a <span className="gradient-text">Balance Sheet</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">
            A Solana treasury-backed strategy protocol. Protocol fees progressively build exposure
            to Nasdaq spot instruments, accumulating assets into a transparent treasury.
          </p>
          <div className="flex justify-center gap-4">
            <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold hover:bg-blue-500">
              Launch App
            </button>
            <button className="rounded-lg border border-slate-600 px-8 py-3 font-semibold hover:border-slate-400">
              Read Docs
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="overview" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">Core Principles</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <BarChart3 className="mb-4 h-8 w-8 text-blue-400" />
            <h3 className="mb-2 text-lg font-semibold">Balance-Sheet First</h3>
            <p className="text-sm text-slate-400">
              All strategy mechanics are driven by transparent balance sheet composition.
            </p>
          </div>
          <div className="card">
            <TrendingUp className="mb-4 h-8 w-8 text-cyan-400" />
            <h3 className="mb-2 text-lg font-semibold">Progressive Backing</h3>
            <p className="text-sm text-slate-400">
              Over time, token graduates from memecoin to fully-backed NAV asset.
            </p>
          </div>
          <div className="card">
            <Shield className="mb-4 h-8 w-8 text-blue-400" />
            <h3 className="mb-2 text-lg font-semibold">Deterministic Rules</h3>
            <p className="text-sm text-slate-400">
              No manual discretion. All treasury actions follow rule-based logic.
            </p>
          </div>
          <div className="card">
            <Zap className="mb-4 h-8 w-8 text-cyan-400" />
            <h3 className="mb-2 text-lg font-semibold">Redeemable</h3>
            <p className="text-sm text-slate-400">
              Token holders can redeem at NAV, burning tokens and releasing backing.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
        <div className="space-y-6">
          <div className="card">
            <div className="mb-2 flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Phase 1: Memecoin</h3>
            </div>
            <p className="text-slate-400">
              Token launches as a memecoin. Trading fees are collected from each transaction.
            </p>
          </div>
          <div className="card">
            <div className="mb-2 flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Phase 2: Accumulation</h3>
            </div>
            <p className="text-slate-400">
              Treasury uses accumulated USDC fees to acquire Nasdaq exposure proxies. Purchases are
              rules-based and publicly logged.
            </p>
          </div>
          <div className="card">
            <div className="mb-2 flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Phase 3: Strategy</h3>
            </div>
            <p className="text-slate-400">
              Treasury value is tracked. Net Asset Value (NAV) per token is computed and published
              in real-time.
            </p>
          </div>
          <div className="card">
            <div className="mb-2 flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold">Phase 4: Redemption</h3>
            </div>
            <p className="text-slate-400">
              Token holders can redeem tokens at NAV. Redemption burns tokens and releases
              proportional backing from treasury.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimers */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="card border-yellow-600/30 bg-yellow-600/5">
          <h2 className="mb-4 text-2xl font-bold">Disclaimers</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <strong>Not a Security:</strong> This project is NOT affiliated with Nasdaq, Inc.
              It is a crypto-native strategy protocol, not a regulated financial product.
            </li>
            <li>
              <strong>Not an ETF:</strong> While structurally similar to ETF mechanics, this is
              a decentralized protocol with no fund manager.
            </li>
            <li>
              <strong>Risk of Loss:</strong> Like all crypto assets, there is risk of total loss.
              Treasury holdings may decline in value.
            </li>
            <li>
              <strong>Regulatory Uncertainty:</strong> Crypto regulations are evolving. This
              project may face legal challenges.
            </li>
            <li>
              <strong>No Guaranteed Returns:</strong> Past performance does not guarantee future
              results. Holdings are subject to market risk.
            </li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>nasdaq-strategy © 2024. Not affiliated with Nasdaq, Inc.</p>
          <p className="mt-2">
            <Link href="/disclaimer" className="hover:text-slate-300">
              Full Disclaimer
            </Link>
            {' · '}
            <Link href="https://github.com" className="hover:text-slate-300">
              GitHub
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
