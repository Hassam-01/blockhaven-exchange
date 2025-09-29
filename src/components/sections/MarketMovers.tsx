import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CoinCard } from '@/components/crypto/CoinCard';
import { getTopGainers, getTopLosers } from '@/lib/changenow-api';

export function MarketMovers() {
  const topGainers = getTopGainers();
  const topLosers = getTopLosers();

  return (
    <section id="markets" className="py-20 bg-muted/20 bg-pattern-grid bg-pattern relative overflow-hidden">
      {/* Subtle tree silhouettes */}
      <div className="absolute inset-0 opacity-8">
        <svg className="absolute bottom-0 left-10 w-8 h-24" viewBox="0 0 32 96" fill="none">
          <rect x="14" y="60" width="4" height="36" fill="currentColor"/>
          <path d="M16,0L24,20L8,20L16,0ZM16,15L22,30L10,30L16,15ZM16,25L20,40L12,40L16,25Z" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-0 right-32 w-6 h-20" viewBox="0 0 24 80" fill="none">
          <rect x="10" y="50" width="4" height="30" fill="currentColor"/>
          <path d="M12,0L18,15L6,15L12,0ZM12,10L16,25L8,25L12,10Z" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-0 left-1/2 w-10 h-28" viewBox="0 0 40 112" fill="none">
          <rect x="18" y="70" width="4" height="42" fill="currentColor"/>
          <path d="M20,0L28,25L12,25L20,0ZM20,20L26,40L14,40L20,20ZM20,35L24,50L16,50L20,35Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Market{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Movers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the biggest winners and losers in today's crypto market.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Top Gainers */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-8 h-8 text-success" />
              <h3 className="text-2xl font-bold text-success">Top Gainers</h3>
            </div>
            <div className="space-y-4">
              {topGainers.map((coin) => (
                <CoinCard key={`gainer-${coin.ticker}`} coin={coin} variant="compact" />
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <TrendingDown className="w-8 h-8 text-destructive" />
              <h3 className="text-2xl font-bold text-destructive">Top Losers</h3>
            </div>
            <div className="space-y-4">
              {topLosers.map((coin) => (
                <CoinCard key={`loser-${coin.ticker}`} coin={coin} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}