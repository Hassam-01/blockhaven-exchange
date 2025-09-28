// ChangeNow API integration for BlockHaven crypto exchange
// Documentation: https://changenow.io/api/docs

const CHANGENOW_API_BASE = 'https://api.changenow.io/v1';
const CHANGENOW_API_KEY = '4d2e85bbf550b94bd9647732dc3b9984ac14b560a1236f8f142fe82f9e8ce583';

export interface CryptoCurrency {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
  color?: string;
  logo?: string;
}

export interface ExchangeEstimate {
  estimatedAmount: string;
  transactionSpeedForecast: string;
  warningMessage?: string;
}

export interface MarketInfo {
  ticker: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  marketCap: number;
}

export interface Transaction {
  id: string;
  status: 'new' | 'waiting' | 'confirming' | 'exchanging' | 'sending' | 'finished' | 'failed' | 'refunded' | 'expired';
  payinAddress: string;
  payoutAddress: string;
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  amountExpectedFrom: string;
  amountExpectedTo: string;
  payinExtraId?: string;
  payoutExtraId?: string;
  refundAddress?: string;
  refundExtraId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionStatus {
  status: string;
  payinAddress?: string;
  payoutAddress?: string;
  fromCurrency?: string;
  toCurrency?: string;
  amount?: string;
  amountExpectedFrom?: string;
  amountExpectedTo?: string;
  payinExtraId?: string;
  payoutExtraId?: string;
  refundAddress?: string;
  refundExtraId?: string;
}

// Get list of available currencies
export async function getAvailableCurrencies(): Promise<CryptoCurrency[]> {
  try {
    const response = await fetch(`${CHANGENOW_API_BASE}/currencies?active=true&api_key=${CHANGENOW_API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch currencies');
    const currencies = await response.json();
    // console.log(currencies)
    return currencies.map((currency: any) => ({
      ...currency,
      color: getCoinColor(currency.ticker),
      logo: getCoinLogo(currency.ticker)
    }));
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return [];
  }
}

// Coin colors mapping
const coinColors: Record<string, string> = {
  'btc': '#f7931a',
  'eth': '#627eea',
  'usdt': '#26a17b',
  'usdc': '#2775ca',
  'bnb': '#f3ba2f',
  'xrp': '#23292f',
  'ada': '#0033ad',
  'sol': '#9945ff',
  'dot': '#e6007a',
  'avax': '#e84142',
  'matic': '#8247e5',
  'link': '#2a5ada',
  'ltc': '#bfbbbb',
  'bch': '#0ac18e',
  'xlm': '#7b00ff',
  'atom': '#2e3148',
  'near': '#00d4aa',
  'ftm': '#1969ff',
  'algo': '#000000',
  'vet': '#15bdff',
  'icp': '#29beee',
  'fil': '#0090ff',
  'trx': '#ff060a',
  'eos': '#000000',
  'xtz': '#2c7df7',
  'mana': '#ff2d55',
  'sand': '#00d4ff',
  'axs': '#0051d5',
  'gala': '#00d4ff',
  'enj': '#624dbf',
  'chz': '#cd1d5c',
  'flow': '#00ef8b',
  'theta': '#2ab8e6',
  'hbar': '#000000',
  'egld': '#000000',
  'one': '#00d4aa',
  'zil': '#49c9ce',
  'iost': '#1c1c1c',
  'wax': '#f89022',
  'btt': '#d31f28',
  'hot': '#ff6b35',
  'bat': '#ff5000',
  'zrx': '#308fc5',
  'rep': '#40a2c3',
  'knc': '#31cb9e',
  'comp': '#00d395',
  'mkr': '#1abc9c',
  'snx': '#00d1ff',
  'yfi': '#006ae3',
  'aave': '#b6509e',
  'sushi': '#d65892',
  'uni': '#ff007a',
  'crv': '#40649f',
  '1inch': '#1c3144',
  'bal': '#1e1e1e',
  'ren': '#000000',
  'uma': '#ff4a4a',
  'band': '#5168ff',
  'nkn': '#233c5b',
  'storj': '#2683ff',
  'ocean': '#141414',
  'grt': '#6748ff',
  'alpha': '#ff6b35',
  'beta': '#c21313',
  'gamma': '#00d4aa',
  'delta': '#00d4aa',
  'epsilon': '#00d4aa',
  'zeta': '#00d4aa',
  'eta': '#00d4aa',
  'iota': '#00d4aa',
  'kappa': '#00d4aa',
  'lambda': '#00d4aa',
  'mu': '#00d4aa',
  'nu': '#00d4aa',
  'xi': '#00d4aa',
  'omicron': '#00d4aa',
  'pi': '#00d4aa',
  'rho': '#00d4aa',
  'sigma': '#00d4aa',
  'tau': '#00d4aa',
  'upsilon': '#00d4aa',
  'phi': '#00d4aa',
  'chi': '#00d4aa',
  'psi': '#00d4aa',
  'omega': '#00d4aa'
};

// Coin logos mapping
const coinLogos: Record<string, string> = {
  'btc': '₿',
  'eth': 'Ξ',
  'usdt': '₮',
  'usdc': 'U',
  'bnb': 'B',
  'xrp': 'X',
  'ada': 'C',
  'sol': 'S',
  'dot': 'D',
  'avax': 'A',
  'matic': 'M',
  'link': 'L',
  'ltc': 'Ł',
  'bch': 'B',
  'xlm': 'X',
  'atom': 'A',
  'near': 'N',
  'ftm': 'F',
  'algo': 'A',
  'vet': 'V',
  'icp': 'I',
  'fil': 'F',
  'trx': 'T',
  'eos': 'E',
  'xtz': 'T',
  'mana': 'M',
  'sand': 'S',
  'axs': 'A',
  'gala': 'G',
  'enj': 'E',
  'chz': 'C',
  'flow': 'F',
  'theta': 'Θ',
  'hbar': 'H',
  'egld': 'E',
  'one': '1',
  'zil': 'Z',
  'iost': 'I',
  'wax': 'W',
  'btt': 'B',
  'hot': 'H',
  'bat': 'B',
  'zrx': 'Z',
  'rep': 'R',
  'knc': 'K',
  'comp': 'C',
  'mkr': 'M',
  'snx': 'S',
  'yfi': 'Y',
  'aave': 'A',
  'sushi': 'S',
  'uni': 'U',
  'crv': 'C',
  '1inch': '1',
  'bal': 'B',
  'ren': 'R',
  'uma': 'U',
  'band': 'B',
  'nkn': 'N',
  'storj': 'S',
  'ocean': 'O',
  'grt': 'G'
};

function getCoinColor(ticker: string): string {
  return coinColors[ticker.toLowerCase()] || '#6b7280';
}

function getCoinLogo(ticker: string): string {
  return coinLogos[ticker.toLowerCase()] || ticker.charAt(0).toUpperCase();
}

// Get exchange estimate
export async function getExchangeEstimate(
  fromCurrency: string,
  toCurrency: string,
  amount: string
): Promise<ExchangeEstimate | null> {
  try {
    const response = await fetch(
      `${CHANGENOW_API_BASE}/exchange-amount/${amount}/${fromCurrency}_${toCurrency}?api_key=${CHANGENOW_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to get estimate');
    return await response.json();
  } catch (error) {
    console.error('Error getting estimate:', error);
    return null;
  }
}

// Get minimum exchange amount
export async function getMinimumAmount(
  fromCurrency: string,
  toCurrency: string
): Promise<{ minAmount: string } | null> {
  try {
    const response = await fetch(
      `${CHANGENOW_API_BASE}/min-amount/${fromCurrency}_${toCurrency}?api_key=${CHANGENOW_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to get minimum amount');
    return await response.json();
  } catch (error) {
    console.error('Error getting minimum amount:', error);
    return null;
  }
}
// Get max exchange amount
export async function getMaximumAmount(
  fromCurrency: string,
  toCurrency: string
): Promise<{ maxAmount: string } | null> {
  try {
    const response = await fetch(
      `${CHANGENOW_API_BASE}/max-amount/${fromCurrency}_${toCurrency}?api_key=${CHANGENOW_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to get maximum amount');
    return await response.json();
  } catch (error) {
    console.error('Error getting maximum amount:', error);
    return null;
  }
}


// Create exchange transaction
export async function createExchange({
  fromCurrency,
  toCurrency,
  fromAmount,
  toAddress,
  extraId,
  refundAddress,
  refundExtraId
}: {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: string;
  toAddress: string;
  extraId?: string;
  refundAddress?: string;
  refundExtraId?: string;
}): Promise<Transaction | null> {
  try {
    const response = await fetch(`${CHANGENOW_API_BASE}/transactions/${CHANGENOW_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromCurrency,
        to: toCurrency,
        amount: fromAmount,
        address: toAddress,
        extraId,
        refundAddress,
        refundExtraId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create exchange');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating exchange:', error);
    return null;
  }
}

// Get transaction status
export async function getTransactionStatus(transactionId: string): Promise<TransactionStatus | null> {
  try {
    const response = await fetch(`${CHANGENOW_API_BASE}/transactions/${transactionId}/${CHANGENOW_API_KEY}`);
    if (!response.ok) throw new Error('Failed to get transaction status');
    return await response.json();
  } catch (error) {
    console.error('Error getting transaction status:', error);
    return null;
  }
}

// Get transaction by ID
export async function getTransaction(transactionId: string): Promise<Transaction | null> {
  try {
    const response = await fetch(`${CHANGENOW_API_BASE}/transactions/${transactionId}/${CHANGENOW_API_KEY}`);
    if (!response.ok) throw new Error('Failed to get transaction');
    return await response.json();
  } catch (error) {
    console.error('Error getting transaction:', error);
    return null;
  }
}

// Validate address
export async function validateAddress(currency: string, address: string): Promise<boolean> {
  try {
    const response = await fetch(`${CHANGENOW_API_BASE}/validate-address?api_key=${CHANGENOW_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency,
        address
      })
    });
    if (!response.ok) return false;
    const result = await response.json();
    return result.result === true;
  } catch (error) {
    console.error('Error validating address:', error);
    return false;
  }
}

// Mock market data for demo (in production, integrate with CoinGecko or similar)
export const getMockMarketData = (): MarketInfo[] => [
  { ticker: 'BTC', name: 'Bitcoin', image: '₿', price: 43250.00, change24h: 2.45, marketCap: 847000000000 },
  { ticker: 'ETH', name: 'Ethereum', image: 'Ξ', price: 2650.75, change24h: -1.23, marketCap: 318000000000 },
  { ticker: 'BNB', name: 'BNB', image: 'B', price: 315.20, change24h: 0.89, marketCap: 47000000000 },
  { ticker: 'XRP', name: 'XRP', image: 'X', price: 0.6234, change24h: 4.67, marketCap: 34000000000 },
  { ticker: 'ADA', name: 'Cardano', image: 'C', price: 0.4821, change24h: -2.11, marketCap: 17000000000 },
  { ticker: 'SOL', name: 'Solana', image: 'S', price: 98.43, change24h: 3.21, marketCap: 42000000000 },
  { ticker: 'DOT', name: 'Polkadot', image: 'D', price: 7.89, change24h: -0.56, marketCap: 10000000000 },
  { ticker: 'AVAX', name: 'Avalanche', image: 'A', price: 38.92, change24h: 1.78, marketCap: 14000000000 }
];

export const getTopGainers = (): MarketInfo[] => {
  return getMockMarketData().sort((a, b) => b.change24h - a.change24h).slice(0, 4);
};

export const getTopLosers = (): MarketInfo[] => {
  return getMockMarketData().sort((a, b) => a.change24h - b.change24h).slice(0, 4);
};