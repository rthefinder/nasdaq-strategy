import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'nasdaq-strategy | Memecoin with a Balance Sheet',
  description:
    'A Solana treasury-backed strategy protocol. Memecoin that accumulates Nasdaq exposure through transparent, deterministic rules.',
  keywords: [
    'solana',
    'memecoin',
    'treasury',
    'nasdaq',
    'crypto',
    'defi',
    'balance sheet',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-950">{children}</div>
      </body>
    </html>
  );
}
