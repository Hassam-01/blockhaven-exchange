import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { type MarketInfo } from '@/lib/blockhaven-exchange-api';

interface CoinCardProps {
  coin: MarketInfo;
  variant?: 'default' | 'compact';
}

export function CoinCard({ coin, variant = 'default' }: CoinCardProps) {
  const isPositive = coin.change24h > 0;
  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 1000) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString()}`;
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  if (variant === 'compact') {
    return (
      <Card className="bg-gradient-card border-primary/10 hover:border-primary/30 transition-all duration-200 hover:shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {coin.image}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{coin.ticker}</h3>
                <p className="text-xs text-muted-foreground">{coin.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">{formatPrice(coin.price)}</p>
              <div className={`flex items-center gap-1 text-xs ${
                isPositive ? 'text-success' : 'text-destructive'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(coin.change24h).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-primary/10 hover:border-primary/30 transition-all duration-200 hover:shadow-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
            {coin.image}
          </div>
          <div>
            <h3 className="font-bold text-lg">{coin.ticker}</h3>
            <p className="text-muted-foreground">{coin.name}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Price</span>
            <span className="font-bold text-lg">{formatPrice(coin.price)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">24h Change</span>
            <div className={`flex items-center gap-1 font-semibold ${
              isPositive ? 'text-success' : 'text-destructive'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="font-semibold">{formatMarketCap(coin.marketCap)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}