// ChangeNow API integration for BlockHaven crypto exchange
// Documentation: https://changenow.io/api/docs

const CHANGENOW_API_BASE = 'https://api.changenow.io/v1';

export interface CryptoCurrency {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
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

// Get list of available currencies
export async function getAvailableCurrencies(): Promise<CryptoCurrency[]> {
  try {
    const response = await fetch(`${CHANGENOW_API_BASE}/currencies?active=true`);
    if (!response.ok) throw new Error('Failed to fetch currencies');
    return await response.json();
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return [];
  }
}

// Get exchange estimate
export async function getExchangeEstimate(
  fromCurrency: string,
  toCurrency: string, 
  amount: string
): Promise<ExchangeEstimate | null> {
  try {
    const response = await fetch(
      `${CHANGENOW_API_BASE}/exchange-amount/${amount}/${fromCurrency}_${toCurrency}`
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
      `${CHANGENOW_API_BASE}/min-amount/${fromCurrency}_${toCurrency}`
    );
    if (!response.ok) throw new Error('Failed to get minimum amount');
    return await response.json();
  } catch (error) {
    console.error('Error getting minimum amount:', error);
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
}) {
  try {
    const response = await fetch(`${CHANGENOW_API_BASE}/transactions`, {
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

    if (!response.ok) throw new Error('Failed to create exchange');
    return await response.json();
  } catch (error) {
    console.error('Error creating exchange:', error);
    return null;
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