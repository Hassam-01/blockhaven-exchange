import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Zap, Shield, ShoppingCart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getExchangeEstimate, getMinimumAmount, type CryptoCurrency } from '@/lib/changenow-api';

const popularCurrencies: CryptoCurrency[] = [
  { ticker: 'btc', name: 'Bitcoin', image: '₿', hasExternalId: false, isFiat: false, featured: true, isStable: false, supportsFixedRate: true },
  { ticker: 'eth', name: 'Ethereum', image: 'Ξ', hasExternalId: false, isFiat: false, featured: true, isStable: false, supportsFixedRate: true },
  { ticker: 'usdt', name: 'Tether', image: '₮', hasExternalId: false, isFiat: false, featured: true, isStable: true, supportsFixedRate: true },
  { ticker: 'bnb', name: 'BNB', image: 'B', hasExternalId: false, isFiat: false, featured: true, isStable: false, supportsFixedRate: true },
  { ticker: 'xrp', name: 'XRP', image: 'X', hasExternalId: true, isFiat: false, featured: true, isStable: false, supportsFixedRate: true },
  { ticker: 'ada', name: 'Cardano', image: 'C', hasExternalId: false, isFiat: false, featured: true, isStable: false, supportsFixedRate: true },
];

export function ExchangeWidget() {
  const [activeTab, setActiveTab] = useState('exchange');
  const [fromCurrency, setFromCurrency] = useState('btc');
  const [toCurrency, setToCurrency] = useState('eth');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minAmount, setMinAmount] = useState<string>('');
  const { toast } = useToast();

  // Get minimum amount when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      getMinimumAmount(fromCurrency, toCurrency).then(result => {
        if (result) {
          setMinAmount(result.minAmount);
        }
      });
    }
  }, [fromCurrency, toCurrency]);

  // Get estimate when amount changes
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && fromCurrency && toCurrency) {
      setIsLoading(true);
      getExchangeEstimate(fromCurrency, toCurrency, fromAmount)
        .then(result => {
          if (result) {
            setToAmount(result.estimatedAmount);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount('');
  };

  const handleTransaction = (type: 'exchange' | 'buy' | 'sell') => {
    if (!fromAmount || !toAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    const actionMap = {
      exchange: "Exchange Started",
      buy: "Buy Order Created", 
      sell: "Sell Order Created"
    };
    
    toast({
      title: actionMap[type],
      description: "Redirecting to complete your transaction...",
    });
    // In a real app, redirect to transaction completion page
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Crypto Trading Hub
        </CardTitle>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-warning" />
            <span>Instant</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-success" />
            <span>Secure</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exchange" className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Exchange
            </TabsTrigger>
            <TabsTrigger value="buy" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Sell
            </TabsTrigger>
          </TabsList>
          
          {/* Exchange Tab */}
          <TabsContent value="exchange" className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">You send</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1"
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map((currency) => (
                      <SelectItem key={currency.ticker} value={currency.ticker}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{currency.image}</span>
                          <span className="uppercase">{currency.ticker}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {minAmount && (
                <p className="text-xs text-muted-foreground">
                  Minimum: {minAmount} {fromCurrency.toUpperCase()}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <Button
                variant="exchange"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">You receive</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="0.00"
                  value={isLoading ? 'Calculating...' : toAmount}
                  readOnly
                  className="flex-1"
                />
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map((currency) => (
                      <SelectItem key={currency.ticker} value={currency.ticker}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{currency.image}</span>
                          <span className="uppercase">{currency.ticker}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              variant="crypto" 
              size="lg" 
              className="w-full"
              onClick={() => handleTransaction('exchange')}
              disabled={!fromAmount || !toAmount || isLoading}
            >
              Start Exchange
            </Button>
          </TabsContent>

          {/* Buy Tab */}
          <TabsContent value="buy" className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Spend (USD)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Buy</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="0.00"
                  value={isLoading ? 'Calculating...' : toAmount}
                  readOnly
                  className="flex-1"
                />
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map((currency) => (
                      <SelectItem key={currency.ticker} value={currency.ticker}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{currency.image}</span>
                          <span className="uppercase">{currency.ticker}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              variant="crypto" 
              size="lg" 
              className="w-full"
              onClick={() => handleTransaction('buy')}
              disabled={!fromAmount || isLoading}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Crypto
            </Button>
          </TabsContent>

          {/* Sell Tab */}
          <TabsContent value="sell" className="space-y-6 mt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sell</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1"
                />
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularCurrencies.map((currency) => (
                      <SelectItem key={currency.ticker} value={currency.ticker}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{currency.image}</span>
                          <span className="uppercase">{currency.ticker}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Receive (USD)</label>
              <Input
                type="text"
                placeholder="0.00"
                value={isLoading ? 'Calculating...' : toAmount}
                readOnly
              />
            </div>

            <Button 
              variant="crypto" 
              size="lg" 
              className="w-full"
              onClick={() => handleTransaction('sell')}
              disabled={!fromAmount || isLoading}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Sell Crypto
            </Button>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-center text-muted-foreground mt-6">
          No registration required • Competitive rates
        </p>
      </CardContent>
    </Card>
  );
}