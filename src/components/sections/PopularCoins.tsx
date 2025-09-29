import React from 'react';
import { Button } from '@/components/ui/button';
import { CoinCard } from '@/components/crypto/CoinCard';
import { getMockMarketData } from '@/lib/changenow-api';

export function PopularCoins() {
  const popularCoins = getMockMarketData().slice(0, 6);

  return (
    <section id="markets" className="py-20 bg-gradient-dark-mountain relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-dots bg-pattern opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Popular{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Cryptocurrencies
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the most traded digital assets on BlockHaven. Real-time prices and market data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {popularCoins.map((coin) => (
            <CoinCard key={coin.ticker} coin={coin} />
          ))}
        </div>

        <div className="text-center">
          <Button variant="crypto" size="lg">
            View All Markets
          </Button>
        </div>
      </div>
    </section>
  );
}