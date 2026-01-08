'use client';

import Link from 'next/link';
import { TrendingUp, PieChart, Wallet } from 'lucide-react';

export default function Treasury() {
  const mockTreasuryData = {
    totalValue: 1250000,
    navPerToken: 0.0847,
    backingRatio: 8.47,
    holdings: [
      { asset: 'USDC', value: 750000, percentage: 60 },
      { asset: 'QQQ Proxy', value: 300000, percentage: 24 },
      { asset: 'IVV Proxy', value: 200000, percentage: 16 },
    ],
  };

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
              <Link href="/treasury" className="text-sm text-blue-400">
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

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold">Treasury Composition</h1>

        {/* Key Metrics */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="metric-card">
            <div className="relative z-10 space-y-2">
              <div className="text-sm font-medium text-slate-400">Total Treasury Value</div>
              <div className="text-3xl font-bold">${(mockTreasuryData.totalValue / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-slate-500">Updated 2 minutes ago</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="relative z-10 space-y-2">
              <div className="text-sm font-medium text-slate-400">NAV per Token</div>
              <div className="text-3xl font-bold">${mockTreasuryData.navPerToken.toFixed(4)}</div>
              <div className="text-xs text-slate-500">Based on 14.76M supply</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="relative z-10 space-y-2">
              <div className="text-sm font-medium text-slate-400">Backing Ratio</div>
              <div className="text-3xl font-bold">{mockTreasuryData.backingRatio.toFixed(2)}%</div>
              <div className="text-xs text-slate-500">Progressively increasing</div>
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="card">
          <div className="mb-6 flex items-center gap-2">
            <PieChart className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Holdings Breakdown</h2>
          </div>
          <div className="space-y-4">
            {mockTreasuryData.holdings.map((holding) => (
              <div key={holding.asset} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{holding.asset}</span>
                  <span className="text-slate-400">
                    ${(holding.value / 1000).toFixed(0)}K ({holding.percentage}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${holding.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treasury Rules */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">Treasury Rules</h2>
          <div className="card">
            <h3 className="mb-3 text-lg font-semibold">Fixed Rules (Immutable)</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ No manual withdrawal authority</li>
              <li>✓ No leverage</li>
              <li>✓ Purchases limited to approved proxy assets</li>
              <li>✓ Minimum purchase amount enforced</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="mb-3 text-lg font-semibold">Fee Distribution (Current)</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• 4% transaction fee</li>
              <li>• 2.5% → Strategy Treasury (USDC accumulation)</li>
              <li>• 1.5% → Liquidity pool</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
