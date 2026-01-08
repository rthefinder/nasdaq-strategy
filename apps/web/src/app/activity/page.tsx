'use client';

import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function ActivityLog() {
  const mockEvents = [
    {
      id: 1,
      type: 'STRATEGY_PURCHASE',
      timestamp: '2024-01-08 14:32:15',
      asset: 'QQQ Proxy',
      amount: '$50,000',
      description: 'Purchased $50K QQQ exposure',
    },
    {
      id: 2,
      type: 'FEES_COLLECTED',
      timestamp: '2024-01-08 14:15:42',
      amount: '$12,500',
      description: 'Trading fees collected',
    },
    {
      id: 3,
      type: 'NAV_UPDATE',
      timestamp: '2024-01-08 14:00:00',
      navPerToken: '$0.0847',
      description: 'NAV recalculated',
    },
    {
      id: 4,
      type: 'REDEMPTION',
      timestamp: '2024-01-07 23:45:20',
      amount: '500K tokens',
      usdc: '$42,350',
      description: 'Token redemption executed',
    },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'STRATEGY_PURCHASE':
        return 'text-blue-400 bg-blue-400/10';
      case 'FEES_COLLECTED':
        return 'text-green-400 bg-green-400/10';
      case 'NAV_UPDATE':
        return 'text-purple-400 bg-purple-400/10';
      case 'REDEMPTION':
        return 'text-orange-400 bg-orange-400/10';
      default:
        return 'text-slate-400 bg-slate-400/10';
    }
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
              <Link href="/treasury" className="text-sm hover:text-blue-400">
                Treasury
              </Link>
              <Link href="/activity" className="text-sm text-blue-400">
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
        <div className="mb-8 flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-400" />
          <h1 className="text-4xl font-bold">Strategy Activity Log</h1>
        </div>

        <div className="space-y-4">
          {mockEvents.map((event) => (
            <div key={event.id} className="card">
              <div className="flex items-start gap-4">
                <div className={`rounded-lg px-3 py-1 text-xs font-mono font-semibold ${getEventColor(event.type)}`}>
                  {event.type}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="font-semibold text-white">{event.description}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>{event.timestamp}</span>
                    {'amount' in event && event.amount && (
                      <span className="text-blue-400">{event.amount}</span>
                    )}
                    {'asset' in event && event.asset && (
                      <span className="text-cyan-400">{event.asset}</span>
                    )}
                    {'navPerToken' in event && event.navPerToken && (
                      <span className="text-purple-400">NAV: {event.navPerToken}</span>
                    )}
                    {'usdc' in event && event.usdc && (
                      <span className="text-orange-400">USDC: {event.usdc}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card">
          <h2 className="mb-4 text-2xl font-bold">How to View On-Chain</h2>
          <p className="mb-4 text-slate-400">
            All transactions are recorded on Solana blockchain. You can verify treasury activity using:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              • <strong>Program ID:</strong> <code className="text-blue-400">5GW9VZvakFrYrLHiNVmLBEY6M5tBMjWZMPMWCHBY8RZH</code>
            </li>
            <li>
              • <strong>Explorer:</strong>{' '}
              <Link href="https://solscan.io" className="text-blue-400 hover:underline">
                Solscan
              </Link>
              {' or '}
              <Link href="https://explorer.solana.com" className="text-blue-400 hover:underline">
                Solana Explorer
              </Link>
            </li>
            <li>
              • <strong>Events:</strong> Query program logs for FeesCollected, StrategyPurchaseExecuted, NAVUpdated events
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
