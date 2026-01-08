'use client';

import Link from 'next/link';

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-2xl font-bold gradient-text">
            nasdaq-strategy
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold">Legal Disclaimer</h1>

        <div className="card space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="mb-3 text-xl font-bold">1. Not a Security</h2>
            <p className="text-slate-300">
              nasdaq-strategy is NOT a registered security. It is a decentralized protocol built on
              Solana. Tokens are not offered as securities and are not subject to registration
              requirements in any jurisdiction. This project is not regulated by the SEC, FINRA,
              or any other financial authority.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">2. Not an ETF</h2>
            <p className="text-slate-300">
              While this protocol shares structural similarities with ETF mechanics (balance sheet
              backing, NAV calculation), it is NOT an Exchange-Traded Fund and is NOT regulated as
              such. There is no fund manager, custodian, or regulated entity managing this protocol.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">3. No Affiliation with Nasdaq</h2>
            <p className="text-slate-300">
              nasdaq-strategy is NOT affiliated, endorsed, or approved by Nasdaq, Inc. The name
              "nasdaq-strategy" is used as a reference to the index exposure strategy, not as a
              claim of partnership or endorsement. All liability is the responsibility of the
              protocol participants, not Nasdaq, Inc.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">4. Risk of Loss</h2>
            <p className="text-slate-300">
              Crypto assets are highly volatile and subject to total loss. The value of treasury
              holdings may decline, causing NAV to decline. There is no guarantee of any return on
              investment. You may lose your entire investment.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">5. Regulatory Uncertainty</h2>
            <p className="text-slate-300">
              Cryptocurrency regulation is evolving globally. Future regulatory changes may
              negatively impact this protocol. Governments may classify this protocol as a
              security, commodity, or financial instrument, subjecting it to regulation or
              restriction.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">6. Smart Contract Risk</h2>
            <p className="text-slate-300">
              This protocol is built on smart contracts that may contain bugs, vulnerabilities, or
              exploits. Smart contract code is complex and may behave unexpectedly. Hacks, exploits,
              or loss of funds are possible.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">7. No Guarantees</h2>
            <p className="text-slate-300">
              Past performance does not guarantee future results. Treasury holdings may decline in
              value. Index proxies may underperform. Market conditions may change. There are no
              guarantees of any kind.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">8. Redemption Limitations</h2>
            <p className="text-slate-300">
              While redemption is designed to be available, large-scale redemptions may exceed
              treasury liquidity. Redemptions could be delayed or queued. There is no guarantee of
              immediate liquidity.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">9. Tax Implications</h2>
            <p className="text-slate-300">
              Crypto transactions have tax implications that vary by jurisdiction. It is YOUR
              responsibility to understand and comply with applicable tax laws. Consult a tax
              professional.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold">10. Use at Your Own Risk</h2>
            <p className="text-slate-300">
              By using this protocol, you accept all risks. You are solely responsible for your
              investment decisions. Do not invest more than you can afford to lose. This is an
              experimental protocol with no insurance or guarantees.
            </p>
          </div>

          <div className="rounded-lg border border-red-600/30 bg-red-600/5 p-4">
            <p className="font-bold text-red-400">
              By participating in nasdaq-strategy, you acknowledge that you have read this disclaimer
              and accept all risks associated with this protocol.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
