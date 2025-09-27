import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CoinCard } from '@/components/crypto/CoinCard';
import { getTopGainers, getTopLosers } from '@/lib/changenow-api';

export function MarketMovers() {
  const topGainers = getTopGainers();
  const topLosers = getTopLosers();

  return (
    <section className="py-20 bg-gradient-mountain">
      <div className="container mx-auto px-4">
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