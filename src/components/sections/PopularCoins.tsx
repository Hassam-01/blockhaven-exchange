import React from 'react';
import { Button } from '@/components/ui/button';
import { CoinCard } from '@/components/crypto/CoinCard';
import { getMockMarketData } from '@/lib/changenow-api';

export function PopularCoins() {
  const popularCoins = getMockMarketData().slice(0, 6);

  return (
    <section id="popular-coins" className="py-20 bg-background bg-pattern-dots bg-pattern-lg relative overflow-hidden">
      {/* Subtle cloud shapes */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute top-20 left-10 w-32 h-16" viewBox="0 0 128 64" fill="none">
          <path d="M96,32C96,14.3,81.7,0,64,0S32,14.3,32,32c0,0,0,0,0,0c-17.7,0-32,14.3-32,32s14.3,32,32,32h64c17.7,0,32-14.3,32-32S113.7,32,96,32z" fill="currentColor"/>
        </svg>
        <svg className="absolute top-32 right-20 w-24 h-12" viewBox="0 0 96 48" fill="none">
          <path d="M72,24C72,10.7,61.3,0,48,0S24,10.7,24,24c0,0,0,0,0,0C10.7,24,0,34.7,0,48s10.7,24,24,24h48c13.3,0,24-10.7,24-24S85.3,24,72,24z" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-20 left-1/3 w-20 h-10" viewBox="0 0 80 40" fill="none">
          <path d="M60,20C60,9,51,0,40,0S20,9,20,20c0,0,0,0,0,0C9,20,0,29,0,40s9,20,20,20h40c11,0,20-9,20-20S71,20,60,20z" fill="currentColor"/>
        </svg>
      </div>
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