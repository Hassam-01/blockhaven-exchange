import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowUpDown, Zap, Shield, ShoppingCart, DollarSign, Wallet, Copy, Check, ArrowRight, ArrowLeft, MoveLeft, MoveRight, CloudCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getExchangeEstimate, getMinimumAmount, createExchange, validateAddress, getTransactionStatus, getAvailableCurrencies, type CryptoCurrency, type Transaction } from '@/lib/changenow-api';
import { CurrencySelector } from './CurrencySelector';
import { CurrencyInput } from './CurrencyInput';
import { ExchangeTypeSelector } from './ExchangeTypeSelector';
import { WalletAddressInput } from './WalletAddressInput';

export function ExchangeWidget() {
  const [activeTab, setActiveTab] = useState<'exchange' | 'buy' | 'sell'>('exchange');
  const [fromCurrency, setFromCurrency] = useState('btc');
  const [toCurrency, setToCurrency] = useState('eth');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minAmount, setMinAmount] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState('');
  const [refundAddress, setRefundAddress] = useState('');
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [allCurrencies, setAllCurrencies] = useState<CryptoCurrency[]>([]);
  const [selectedFromCurrency, setSelectedFromCurrency] = useState<CryptoCurrency | null>(null);
  const [selectedToCurrency, setSelectedToCurrency] = useState<CryptoCurrency | null>(null);
  const [rightColor, setRightColor] = useState(selectedFromCurrency?.color || "")
  const [leftColor, setLeftColor] = useState(selectedToCurrency?.color || "")
  const [exchangeType, setExchangeType] = useState<'fixed' | 'floating'>('fixed');
  const { toast } = useToast();

  // Memoize filtered currencies for better performance
  const filteredCurrencies = useMemo(() => {
    return allCurrencies
      .filter(c => !c.isFiat)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [allCurrencies]);

  // Exchange type charges
  const exchangeCharges = useMemo(() => ({
    fixed: { rate: 1.0, description: 'Fixed rate - guaranteed for 15 minutes' },
    floating: { rate: 0.5, description: 'Floating rate - best market price' }
  }), []);

  // Fetch all currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currencies = await getAvailableCurrencies();
        setAllCurrencies(currencies);

        // Set initial selected currencies
        const btc = currencies.find(c => c.ticker === 'btc');
        const eth = currencies.find(c => c.ticker === 'eth');
        if (btc) {
          setSelectedFromCurrency(btc);
          setRightColor(btc?.color)
        }

        if (eth) {
          setSelectedToCurrency(eth);
          setLeftColor(eth?.color)
        }
      } catch (error) {
        console.error('Failed to fetch currencies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load available currencies',
          variant: 'destructive',
        });
      }
    };

    fetchCurrencies();
  }, [toast]);

  // Update selected currency when fromCurrency changes
  useEffect(() => {
    const currency = allCurrencies.find(c => c.ticker === fromCurrency);
    setSelectedFromCurrency(currency || null);
    setRightColor(currency?.color)
  }, [fromCurrency, allCurrencies]);

  // Update selected currency when toCurrency changes
  useEffect(() => {
    const currency = allCurrencies.find(c => c.ticker === toCurrency);
    setSelectedToCurrency(currency || null);
    setLeftColor(currency?.color)
  }, [toCurrency, allCurrencies]);

  // Minimum amount
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      getMinimumAmount(fromCurrency, toCurrency).then(result => {
        if (result) setMinAmount(result.minAmount);
      });
    }
  }, [fromCurrency, toCurrency]);

  // Estimate
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && fromCurrency && toCurrency) {
      setIsLoading(true);
      getExchangeEstimate(fromCurrency, toCurrency, fromAmount)
        .then(result => {
          if (result) setToAmount(result.estimatedAmount);
        })
        .finally(() => setIsLoading(false));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount('');
  }, [fromCurrency, toCurrency, toAmount]);

  const handleFromCurrencyChange = useCallback((value: string) => {
    setFromCurrency(value);
  }, []);

  const handleToCurrencyChange = useCallback((value: string) => {
    setToCurrency(value);
  }, []);

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy address to clipboard',
        variant: 'destructive',
      });
    }
  };

  const validateWalletAddresses = async () => {
    if (!depositAddress.trim()) {
      toast({
        title: 'Missing Deposit Address',
        description: 'Please enter your deposit wallet address.',
        variant: 'destructive',
      });
      return false;
    }

    // Validate deposit address
    const isDepositValid = await validateAddress(toCurrency, depositAddress);
    if (!isDepositValid) {
      toast({
        title: 'Invalid Deposit Address',
        description: `Please enter a valid ${toCurrency.toUpperCase()} wallet address.`,
        variant: 'destructive',
      });
      return false;
    }

    // Validate refund address only if provided
    if (refundAddress.trim()) {
      const isRefundValid = await validateAddress(fromCurrency, refundAddress);
      if (!isRefundValid) {
        toast({
          title: 'Invalid Refund Address',
          description: `Please enter a valid ${fromCurrency.toUpperCase()} wallet address.`,
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleTransaction = async (type: 'exchange' | 'buy' | 'sell') => {
    if (!fromAmount || !toAmount) {
      toast({
        title: 'Missing Information',
        description: 'Please enter an amount to proceed.',
        variant: 'destructive',
      });
      return;
    }

    if (type === 'exchange') {
      // Validate wallet addresses for exchange
      const isValid = await validateWalletAddresses();
      if (!isValid) return;

      // Create the exchange transaction
      setIsCreatingTransaction(true);
      try {
        const transaction = await createExchange({
          fromCurrency,
          toCurrency,
          fromAmount,
          toAddress: depositAddress,
          refundAddress: refundAddress.trim() || undefined,
        });

        if (transaction) {
          setCurrentTransaction(transaction);
          setShowTransactionDialog(true);
          toast({
            title: 'Exchange Created',
            description: 'Your exchange transaction has been created successfully.',
          });
        } else {
          throw new Error('Failed to create transaction');
        }
      } catch (error) {
        toast({
          title: 'Transaction Failed',
          description: 'Failed to create exchange transaction. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsCreatingTransaction(false);
      }
    } else {
      // For buy/sell, show placeholder message
      const actionMap = {
        buy: 'Buy Order Created',
        sell: 'Sell Order Created',
      };

      toast({
        title: actionMap[type],
        description: 'This feature will be available soon.',
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-card backdrop-blur-sm border-primary/20 shadow-card
                     flex flex-col"
      style={{ minHeight: '350px' }}
    >
      <CardContent className="flex-1 flex flex-col pt-4">
        {/* Tabs with active background */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full flex flex-col flex-1">
          <TabsList className="grid w-full grid-cols-3 relative bg-muted/50 p-1 rounded-lg">
            <TabsTrigger
              value="exchange"
              className="flex items-center gap-2 relative z-10 transition-all duration-200"
            >
              <ArrowUpDown className="w-4 h-4" />
              Exchange
            </TabsTrigger>
            <TabsTrigger
              value="buy"
              className="flex items-center gap-2 relative z-10 transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="flex items-center gap-2 relative z-10 transition-all duration-200"
            >
              <DollarSign className="w-4 h-4" />
              Sell
            </TabsTrigger>

            {/* Active tab background */}
            <div
              className="absolute top-1 bottom-1 bg-background shadow-sm rounded-md transition-all duration-500"
              style={{
                width: `calc(33.333% - 0.5rem)`,
                left: activeTab === 'exchange' ? '0.25rem' :
                  activeTab === 'buy' ? 'calc(33.333% + 0.25rem)' :
                    'calc(66.666% + 0.25rem)',
              }}
            />
          </TabsList>

          {/* Exchange */}
          <TabsContent value="exchange" className="mt-4 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Send Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-orange-500 flex items-center gap-1">
                  Send <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <CurrencyInput
                    value={fromAmount}
                    onChange={setFromAmount}
                    selectedCurrency={selectedFromCurrency}
                    placeholder="0.00"
                  />
                  <CurrencySelector
                    value={fromCurrency}
                    onValueChange={handleFromCurrencyChange}
                    currencies={filteredCurrencies}
                    selectedCurrency={selectedFromCurrency}
                  />
                  {fromAmount && selectedFromCurrency && (
                    <div className="text-xs text-muted-foreground">
                      1 {selectedFromCurrency.ticker.toUpperCase()} ≈ {toAmount ? (parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6) : '0.000000'} {selectedToCurrency?.ticker.toUpperCase() || ''}
                    </div>
                  )}
                  {minAmount && (
                    <div className="text-xs text-muted-foreground">
                      Min: {minAmount} {fromCurrency.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center">
                {/* <Button
                  variant="outline"
                  size="sm"
                  // className="rounded-full p-2"
                > */}
                <div className="flex flex-col items-center rotate-90 md:rotate-0"
                  onClick={handleSwapCurrencies}
                >
                  <MoveLeft className="md:w-7 md:h-7 w-5 h-5 -mb-2" style={{
                    color: leftColor || "",
                  }} />
                  <MoveRight className="md:w-7 md:h-7 w-5 h-5" style={{
                    color: rightColor || "",
                  }} />
                </div>
                {/* </Button> */}
              </div>

              {/* Receive Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-500 flex items-center gap-1">
                  Receive <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <CurrencyInput
                    value={isLoading ? 'Calculating...' : toAmount}
                    onChange={() => { }} // Read-only
                    selectedCurrency={selectedToCurrency}
                    placeholder="0.00"
                    readOnly
                  />
                  <CurrencySelector
                    value={toCurrency}
                    onValueChange={handleToCurrencyChange}
                    currencies={filteredCurrencies}
                    selectedCurrency={selectedToCurrency}
                  />
                  {toAmount && selectedToCurrency && (
                    <div className="text-xs text-muted-foreground">
                      1 {selectedToCurrency.ticker.toUpperCase()} ≈ {fromAmount ? (parseFloat(fromAmount) / parseFloat(toAmount)).toFixed(6) : '0.000000'} {selectedFromCurrency?.ticker.toUpperCase() || ''}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section - Destination and Exchange Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {/* Destination Address */}
              <WalletAddressInput
                label={`Destination (${selectedToCurrency?.ticker.toUpperCase() || 'crypto'})`}
                placeholder={`Your ${selectedToCurrency?.ticker.toUpperCase() || 'crypto'} address`}
                value={depositAddress}
                onChange={setDepositAddress}
                onCopy={() => handleCopyAddress(depositAddress)}
                icon="wallet"
                required
              />

              {/* Exchange Type */}
              <ExchangeTypeSelector
                exchangeType={exchangeType}
                onTypeChange={setExchangeType}
                charges={exchangeCharges}
              />
            </div>

            {/* Refund Address - Optional */}
            <div className="mt-4">
              <WalletAddressInput
                label={`Refund Address (${selectedFromCurrency?.ticker.toUpperCase() || 'crypto'}) - Optional`}
                placeholder={`Your ${selectedFromCurrency?.ticker.toUpperCase() || 'crypto'} address for refunds`}
                value={refundAddress}
                onChange={setRefundAddress}
                onCopy={() => handleCopyAddress(refundAddress)}
                icon="shield"
                required={false}
              />
            </div>
            <div className="mt-4 flex justify-between">
              <span className='text-sm text-muted-foreground font-bold flex items-center gap-1 text-orange-500'>
                By clicking Exchange now, you agree to the
                {/* <Link href="/terms" className='text-orange-500'>Terms of Service</Link> and <Link href="/privacy" className='text-orange-500'>Privacy Policy</Link> */}
              </span>
              {/* Exchange Button */}
              <Button
                variant="crypto"
                size="lg"
                onClick={() => handleTransaction('exchange')}
                disabled={!fromAmount || !toAmount || isLoading || isCreatingTransaction || !depositAddress.trim()}
                className="px-8"
              >
                {isCreatingTransaction ? 'Creating Exchange...' : 'Exchange now'}
              </Button>
            </div>
          </TabsContent>

          {/* Buy */}
          <TabsContent value="buy" className="space-y-4 mt-4 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Spend (USD) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Buy <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <CurrencyInput
                  value={isLoading ? 'Calculating...' : toAmount}
                  onChange={() => { }} // Read-only
                  selectedCurrency={selectedToCurrency}
                  placeholder="0.00"
                  readOnly
                  className="flex-1"
                />
                <CurrencySelector
                  value={toCurrency}
                  onValueChange={handleToCurrencyChange}
                  currencies={filteredCurrencies}
                  selectedCurrency={selectedToCurrency}
                  className="w-48 min-w-[200px]"
                />
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

          {/* Sell */}
          <TabsContent value="sell" className="space-y-4 mt-4 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Sell <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <CurrencyInput
                  value={fromAmount}
                  onChange={setFromAmount}
                  selectedCurrency={selectedFromCurrency}
                  placeholder="0.00"
                  className="flex-1"
                />
                <CurrencySelector
                  value={fromCurrency}
                  onValueChange={handleFromCurrencyChange}
                  currencies={filteredCurrencies}
                  selectedCurrency={selectedFromCurrency}
                  className="w-48 min-w-[200px]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                Receive (USD) <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="0.00"
                value={isLoading ? 'Calculating...' : toAmount}
                readOnly
                className="focus-visible:ring-0 focus-visible:ring-offset-0"
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

      {/* Transaction Confirmation Dialog */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Exchange Created Successfully
            </DialogTitle>
            <DialogDescription>
              Your exchange transaction has been created. Please send your {fromCurrency.toUpperCase()} to the address below.
            </DialogDescription>
          </DialogHeader>

          {currentTransaction && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Transaction ID:</strong> {currentTransaction.id}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Send {fromAmount} {fromCurrency.toUpperCase()} to:
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-sm font-mono break-all">
                      {currentTransaction.payinAddress}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyAddress(currentTransaction.payinAddress)}
                    >
                      {copiedAddress === currentTransaction.payinAddress ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    You will receive {toAmount} {toCurrency.toUpperCase()} at:
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <code className="flex-1 text-sm font-mono break-all">
                      {depositAddress}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyAddress(depositAddress)}
                    >
                      {copiedAddress === depositAddress ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Only send {fromCurrency.toUpperCase()} to the address above.
                  Sending other cryptocurrencies will result in permanent loss.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowTransactionDialog(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    // In a real app, this would open the transaction tracking page
                    window.open(`https://changenow.io/exchange/txs/${currentTransaction.id}`, '_blank');
                  }}
                >
                  Track Transaction
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}