export interface ExchangeCurrency {
  ticker: string;
  name: string;
  image: string;
  hasExternalId: boolean;
  isFiat: boolean;
  featured: boolean;
  isStable: boolean;
  supportsFixedRate: boolean;
  network: string | null;
  tokenContract: string | null;
  buy: boolean;
  sell: boolean;
  legacyTicker: string;
  isExtraIdSupported: boolean;
  color?: string;
  logo?: string;
}

import { AvailablePairsResponse, ContinueExchangeRequest, ContinueExchangeResponse, CreateTransactionResponse, CryptoCurrencyForFiat, EstimatedAmountResponse, ExchangeActionsResponse, ExchangeRange, FiatCurrency, FiatEstimateRequest, FiatEstimateResponse, FiatHealthCheckResponse, FiatMarketInfoResponse, FiatTransactionRequest, FiatTransactionResponse, FiatTransactionStatusResponse, MinAmountResponse, NetworkFeeEstimate, RefundExchangeRequest, RefundExchangeResponse, TransactionStatusResponse, UserAddressesResponse, ValidationResponse } from "@/const/types";
import { toast } from "@/hooks/use-toast";
import { API_CONFIG, getHeaders } from "@/lib/api-config";
import { getCurrentAuthToken } from "@/lib/user-services-api";

const CHANGENOW_API_BASE = 'https://api.changenow.io/v2';
const CHANGENOW_API_KEY = import.meta.env.VITE_CHANGENOW_API_KEY;

// Track shown error toasts to prevent spam
let lastShownError: {
    fromCurrency?: string;
    toCurrency?: string;
    error?: string;
    timestamp?: number;
} = {};

// Helper function to check if we should show error toast
function shouldShowErrorToast(fromCurrency?: string, toCurrency?: string, error?: string): boolean {
    const currentPair = `${fromCurrency}-${toCurrency}`;
    const lastPair = `${lastShownError.fromCurrency}-${lastShownError.toCurrency}`;
    const now = Date.now();
    
    // Show toast if:
    // 1. Currency pair has changed, OR
    // 2. Error type has changed, OR  
    // 3. More than 30 seconds have passed since last toast
    if (currentPair !== lastPair || 
        lastShownError.error !== error || 
        !lastShownError.timestamp || 
        (now - lastShownError.timestamp) > 30000) {
        
        lastShownError = {
            fromCurrency,
            toCurrency, 
            error,
            timestamp: now
        };
        return true;
    }
    
    return false;
}

// Validate API key
if (!CHANGENOW_API_KEY) {
  console.error('VITE_CHANGENOW_API_KEY environment variable is not set');
}

// Coin colors and logos mappings
const coinColors: Record<string, string> = {
    'btc': '#f7931a', 'eth': '#627eea', 'usdt': '#26a17b', 'usdc': '#2775ca',
    'bnb': '#f3ba2f', 'ada': '#0033ad', 'sol': '#9945ff', 'xrp': '#23292f',
    'doge': '#c2a633', 'avax': '#e84142', 'matic': '#8247e5', 'dot': '#e6007a',
    'ltc': '#bfbbbb', 'link': '#2a5ada', 'atom': '#2e3148', 'near': '#000000',
    'ftm': '#1969ff', 'algo': '#000000', 'vet': '#15bdff', 'icp': '#29abe2',
    'flow': '#00ef8b', 'hbar': '#000000', 'egld': '#000000', 'xtz': '#2c7df7',
    'mana': '#ff2d55', 'sand': '#00adef', 'axs': '#0052ff', 'chz': '#cd1d1f',
    'enj': '#624dbf', 'gala': '#ffd700', 'ilv': '#ffd700', 'ape': '#0052ff',
    'lrc': '#2c5aa0', 'bat': '#ff5000', 'zec': '#ecb244', 'xmr': '#ff6600',
    'dash': '#008ce7', 'eos': '#000000', 'trx': '#ff060a', 'xlm': '#7d00ff',
    'neo': '#00e599', 'qtum': '#2e9ad0', 'waves': '#0055ff', 'omg': '#1a53f0',
    'zil': '#00d4ff', 'ont': '#00a6b4', 'iost': '#1c1c1c', 'nano': '#4a90e2',
    'rvn': '#384182', 'dcr': '#2ed6a1', 'zrx': '#000000', 'rep': '#40a2ba',
    'knc': '#31cb9e', 'comp': '#00d395', 'mkr': '#1abc9c', 'snx': '#d1d1d1',
    'yfi': '#006ae3', 'aave': '#b6509e', 'sushi': '#d65892', 'crv': '#40649f',
    '1inch': '#1f2937', 'uni': '#ff007a', 'cake': '#d1884f', 'sxp': '#f8b500',
    'theta': '#2ab8e6', 'fil': '#0090ff', 'tfuel': '#2ab8e6', 'klay': '#f6c343',
    'ksm': '#000000', 'mina': '#ea4e99', 'celo': '#35d07f', 'one': '#00d4aa',
    'rose': '#ff6b6b', 'iotx': '#00d4d5', 'grt': '#6747ed', 'luna': '#ff6b35',
    'ust': '#00d4aa', 'lunc': '#ff6b35', 'shib': '#ff6b35', 'pepe': '#00d4aa',
    'floki': '#ff6b35', 'bonk': '#ff6b35', 'wld': '#00d4aa', 'arb': '#2d3748',
    'op': '#ff6b35', 'sei': '#00d4aa', 'sui': '#ff6b35', 'apt': '#00d4aa',
    'tia': '#ff6b35', 'inj': '#00d4aa', 'strk': '#ff6b35', 'pyth': '#00d4aa',
    'jup': '#ff6b35', 'w': '#00d4aa', 'jto': '#ff6b35', 'myro': '#00d4aa',
    'bome': '#ff6b35', 'wif': '#00d4aa', 'popcat': '#ff6b35', 'meow': '#00d4aa',
    'act': '#ff6b35', 'gme': '#00d4aa', 'roaring': '#ff6b35', 'trump': '#00d4aa',
    'biden': '#ff6b35', 'maga': '#00d4aa', 'djt': '#ff6b35', 'meme': '#00d4aa',
    'based': '#ff6b35', 'tremp': '#00d4aa', 'boden': '#ff6b35', 'mog': '#00d4aa',
    'pnut': '#ff6b35', 'bub': '#00d4aa', 'cat': '#ff6b35'
};


// Helper functions to get coin color and logo
function getCoinColor(ticker: string): string {
    return coinColors[ticker.toLowerCase()] || '#6b7280';
}


/**
 * Fetches the list of available currencies from ChangeNOW.
 */
export interface CurrencyOptions {
    active?: boolean;
    flow?: 'standard' | 'fixed-rate';
    buy?: boolean;
    sell?: boolean;
}

export async function getAvailableCurrencies(
    options: CurrencyOptions = {}
): Promise<ExchangeCurrency[] | null> {
    try {
        const {
            active,
            flow = 'standard',
            buy,
            sell
        } = options;

        const params = new URLSearchParams();
        if (active !== undefined) params.append('active', String(active));
        if (flow) params.append('flow', flow);
        if (buy !== undefined) params.append('buy', String(buy));
        if (sell !== undefined) params.append('sell', String(sell));

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/currencies?${params.toString()}`,
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
        );

        if (!response.ok) throw new Error('Failed to fetch currencies');

        const currencies = await response.json();
        
        // Filter out currencies with null or undefined network values first
        const validCurrencies = currencies.filter((currency: ExchangeCurrency) => 
            currency.network !== null && 
            currency.network !== undefined && 
            currency.network.trim() !== ''
        );
        
        // Deduplicate currencies by ticker and add color/logo properties
        const uniqueCurrencies = validCurrencies.reduce((acc: ExchangeCurrency[], currency: ExchangeCurrency) => {
            const existingIndex = acc.findIndex(c => c.ticker === currency.ticker);
            if (existingIndex === -1) {
                // Add new currency with color and logo
                acc.push({
                    ...currency,
                    image: currency?.image || '',
                    hasExternalId: currency?.hasExternalId || false,
                    isFiat: currency?.isFiat || false,
                    featured: currency?.featured || false,
                    isStable: currency?.isStable || false,
                    supportsFixedRate: currency?.supportsFixedRate || false,
                    network: currency?.network || '',
                    tokenContract: currency?.tokenContract || null,
                    buy: currency?.buy || false,
                    sell: currency?.sell || false,
                    legacyTicker: currency?.legacyTicker || '',
                    isExtraIdSupported: currency?.isExtraIdSupported || false,
                    color: getCoinColor(currency.ticker),
                    logo: currency?.image || ''
                });
            } else {
                // Update existing currency if this one is more featured or has better properties
                const existing = acc[existingIndex];
                if (currency.featured && !existing.featured) {
                    acc[existingIndex] = {
                        ...currency,
                        image: currency?.image || '',
                        hasExternalId: currency?.hasExternalId || false,
                        isFiat: currency?.isFiat || false,
                        featured: currency?.featured || false,
                        isStable: currency?.isStable || false,
                        supportsFixedRate: currency?.supportsFixedRate || false,
                        network: currency?.network || '',
                        tokenContract: currency?.tokenContract || null,
                        buy: currency?.buy || false,
                        sell: currency?.sell || false,
                        legacyTicker: currency?.legacyTicker || '',
                        isExtraIdSupported: currency?.isExtraIdSupported || false,
                        color: getCoinColor(currency.ticker),
                        logo: currency?.image || ''
                    };
                }
            }
            return acc;
        }, []);

        return uniqueCurrencies;
    } catch (error) {
        console.error('Error fetching currencies:', error);
        return null;
    }
}

/**
 * Fetches all available trading pairs.
 */
export async function getAvailablePairs(
    fromCurrency?: string,
    toCurrency?: string,
    fromNetwork?: string,
    toNetwork?: string,
    flow?: 'standard' | 'fixed-rate'
): Promise<AvailablePairsResponse | null> {
    try {
        const params = new URLSearchParams();
        if (fromCurrency) params.append('fromCurrency', fromCurrency);
        if (toCurrency) params.append('toCurrency', toCurrency);
        if (fromNetwork) params.append('fromNetwork', fromNetwork);
        if (toNetwork) params.append('toNetwork', toNetwork);
        if (flow) params.append('flow', flow);

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/available-pairs?${params.toString()}`,
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const error = errorData?.error;
            
            if (error === 'pair_is_inactive' && shouldShowErrorToast(fromCurrency, toCurrency, error)) {
                const errorMessage = 'This currency pair is currently inactive or not supported. Please select a different pair.';
                toast({
                    variant: "destructive",
                    title: "Invalid Currency Pair",
                    description: errorMessage
                });
                throw new Error(errorMessage);
            }
            
            throw new Error('Failed to fetch available pairs');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching available pairs:', error);
        return null;
    }
}

/**
 * Get the minimal payment amount required to make an exchange.
 */
export async function getMinimalExchangeAmount(
    fromCurrency: string,
    toCurrency: string,
    options?: {
        fromNetwork?: string;
        toNetwork?: string;
        flow?: 'standard' | 'fixed-rate';
    }
): Promise<MinAmountResponse | null> {
    try {
        const params = new URLSearchParams({
            fromCurrency,
            toCurrency,
        });

        if (options?.fromNetwork) params.append('fromNetwork', options.fromNetwork);
        if (options?.toNetwork) params.append('toNetwork', options.toNetwork);
        if (options?.flow) params.append('flow', options.flow);

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/min-amount?${params.toString()}`,
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const error = errorData?.error;
            
            if (error === 'pair_is_inactive' && shouldShowErrorToast(fromCurrency, toCurrency, error)) {
                const errorMessage = 'This currency pair is currently inactive or not supported. Please select a different pair.';
                toast({
                    variant: "destructive",
                    title: "Invalid Currency Pair",
                    description: errorMessage
                });
                throw new Error(errorMessage);
            }
            
            throw new Error('Failed to fetch minimal exchange amount');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching minimal exchange amount:', error);
        return null;
    }
}

/**
 * Get an estimated exchange amount and related details.
 * For fixed-rate flow, automatically sets useRateId to true to get rateId for freezing the rate.
 * 
 * @param fromCurrency - Source currency ticker
 * @param toCurrency - Target currency ticker  
 * @param options - Exchange options including flow type, amounts, networks, etc.
 * @returns Promise<EstimatedAmountResponse> - Contains estimated amounts and rateId for fixed-rate
 * 
 * Note: When flow is 'fixed-rate', the response will include:
 * - rateId: Use this when creating the transaction to freeze the estimated rate
 * - validUntil: Timestamp until which the rate is guaranteed valid
 */
export async function getEstimatedExchangeAmount(
    fromCurrency: string,
    toCurrency: string,
    options: {
        fromAmount?: number;
        toAmount?: number;
        fromNetwork?: string;
        toNetwork?: string;
        flow?: 'standard' | 'fixed-rate';
        type?: 'direct' | 'reverse';
        useRateId?: boolean;
        isTopUp?: boolean;
    }
): Promise<EstimatedAmountResponse> {
    // Automatically set useRateId to true for fixed-rate flow to get rateId
    const modifiedOptions = {
        ...options,
        useRateId: options.flow === 'fixed-rate' ? true : options.useRateId
    };

    const params = new URLSearchParams({ fromCurrency, toCurrency });
    Object.entries(modifiedOptions).forEach(([k, v]) => v !== undefined && params.append(k, String(v)));

    const res = await fetch(
        `${CHANGENOW_API_BASE}/exchange/estimated-amount?${params.toString()}`,
        { headers: { 'x-changenow-api-key': CHANGENOW_API_KEY } }
    );

    const data = await res.json();

    if (!res.ok) {
        const message = data?.message ?? 'Failed to fetch estimated amount';
        const error = data?.error;
        
        // Handle specific error cases
        if (error === 'pair_is_inactive' && shouldShowErrorToast(fromCurrency, toCurrency, error)) {
            const errorMessage = 'This currency pair is currently inactive or not supported. Please select a different pair.';
            toast({
                variant: "destructive",
                title: "Invalid Currency Pair",
                description: errorMessage
            });
            throw new Error(errorMessage);
        }
        
        // Handle other errors - but also check if we should show toast for general errors
        if (shouldShowErrorToast(fromCurrency, toCurrency, error || 'general_error')) {
            toast({
                variant: "destructive",
                title: "Estimation Error",
                description: message
            });
        }
        throw new Error(message);
    }

    return data as EstimatedAmountResponse;
}

/**
 * Create an exchange transaction.
 */
export async function createExchangeTransaction(
    body: {
        fromCurrency: string;
        toCurrency: string;
        fromNetwork: string;
        toNetwork: string;
        fromAmount?: string;
        toAmount?: string;
        address: string;
        extraId?: string;
        refundAddress?: string;
        refundExtraId?: string;
        userId?: string;
        payload?: Record<string, string>;
        contactEmail?: string;
        flow?: 'standard' | 'fixed-rate';
        type?: 'direct' | 'reverse';
        rateId?: string;
    },
    userIp?: string
): Promise<CreateTransactionResponse | null> {
    try {
        // Prepare headers for backend request (with or without token)
        const headers = getHeaders();
        
        // Add user IP to the request body if provided
        const requestBody = userIp ? { ...body, userIp } : body;

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EXCHANGES.CREATE}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || 'Failed to create transaction';
            
            toast({
                variant: "destructive",
                title: "Transaction Error",
                description: errorMessage
            });
            
            throw new Error(errorMessage);
        }

        const result = await response.json();

        // Extract the actual transaction data from the response
        const transactionData = result.data || result;
        
        // Show success message
        toast({
            title: "Transaction Created",
            description: "Your exchange transaction has been created successfully."
        });

        return transactionData;
    } catch (error) {
        console.error('Error creating exchange transaction:', error);
        
        // Only show toast if it hasn't been shown already
        if (error instanceof Error && !error.message.includes('Failed to create transaction')) {
            toast({
                variant: "destructive",
                title: "Network Error",
                description: "Unable to connect to the server. Please try again."
            });
        }
        
        return null;
    }
}

/**
 * Get status and details for a single transaction by its ID.
 */
export async function getTransactionStatus(
    transactionId: string
): Promise<TransactionStatusResponse | null> {
    try {
        const params = new URLSearchParams({ id: transactionId });

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/by-id?${params.toString()}`,
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
        );

        if (!response.ok) throw new Error('Failed to fetch transaction status');
        return await response.json();
    } catch (error) {
        console.error('Error fetching transaction status:', error);
        return null;
    }
}

/**
 * Validate a payout or refund address for a specific currency/network.
 */
export async function validateAddress(
    currency: string,
    address: string
): Promise<ValidationResponse | null> {
    try {
        const params = new URLSearchParams({ currency, address });

        const response = await fetch(
            `${CHANGENOW_API_BASE}/validate/address?${params.toString()}`,
        );

        if (!response.ok) throw new Error('Failed to validate address');
        return await response.json();
    } catch (error) {
        console.error('Error validating address:', error);
        return null;
    }
}

/**
 * Get the list of addresses bound to a given FIO/Unstoppable domain name.
 */
export async function getUserAddresses(
    name: string,
    apiKey?: string
): Promise<UserAddressesResponse | null> {
    try {
        const headers: Record<string, string> = {};
        const apiKeyToUse = apiKey || CHANGENOW_API_KEY;

        if (apiKeyToUse) {
            headers['x-changenow-api-key'] = apiKeyToUse;
        }

        const response = await fetch(
            `${CHANGENOW_API_BASE}/addresses-by-name?name=${encodeURIComponent(name)}`,
            { headers }
        );

        if (!response.ok) throw new Error('Failed to fetch user addresses');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        return null;
    }
}

export async function getEstimatedNetworkFee(
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number,
    options?: {
        fromNetwork?: string;
        toNetwork?: string;
        convertedCurrency?: string;
        convertedNetwork?: string;
    }
): Promise<NetworkFeeEstimate | null> {
    try {
        const params = new URLSearchParams({
            fromCurrency,
            toCurrency,
            fromAmount: String(fromAmount),
        });

        if (options?.fromNetwork) params.append('fromNetwork', options.fromNetwork);
        if (options?.toNetwork) params.append('toNetwork', options.toNetwork);
        if (options?.convertedCurrency) params.append('convertedCurrency', options.convertedCurrency);
        if (options?.convertedNetwork) params.append('convertedNetwork', options.convertedNetwork);

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/network-fee?${params.toString()}`,
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized: Please contact partners@changenow.io for access to this endpoint');
            }
            throw new Error('Failed to fetch network fee estimate');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching network fee estimate:', error);
        return null;
    }
}

export async function getExchangeRange(
    fromCurrency: string,
    toCurrency: string,
    options?: {
        fromNetwork?: string;
        toNetwork?: string;
        flow?: "standard" | "fixed-rate";
    }
): Promise<ExchangeRange | null> {
    try {
        const params = new URLSearchParams({
            fromCurrency,
            toCurrency,
        });

        if (options?.fromNetwork) params.append('fromNetwork', options.fromNetwork);
        if (options?.toNetwork) params.append('toNetwork', options.toNetwork);
        if (options?.flow) params.append('flow', options.flow);

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/range?${params.toString()}`,
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized: Please contact partners@changenow.io for access to this endpoint');
            }
            throw new Error('Failed to fetch exchange range');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching exchange range:', error);
        return null;
    }
}

/**
 * Create a fiat-to-cryptocurrency exchange transaction.
 */
export async function createFiatTransaction(
    request: FiatTransactionRequest
): Promise<FiatTransactionResponse | null> {
    try {
        const response = await fetch(
            `${CHANGENOW_API_BASE}/fiat-transaction`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-changenow-api-key': CHANGENOW_API_KEY,
                },
                body: JSON.stringify(request),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Failed to create fiat transaction:', errorData);
            throw new Error('Failed to create fiat transaction');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating fiat transaction:', error);
        toast({
            variant: "destructive",
            title: "Transaction Error",
            description: "Failed to create fiat transaction. Please try again."
        });
        return null;
    }
}

/**
 * Get the status of a fiat transaction by its ID.
 */
export async function getFiatTransactionStatus(
    transactionId: string
): Promise<FiatTransactionStatusResponse | null> {
    try {
        const params = new URLSearchParams({ id: transactionId });

        const response = await fetch(
            `${CHANGENOW_API_BASE}/fiat-status?${params.toString()}`,
            {
                headers: {
                    'x-api-key': CHANGENOW_API_KEY,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Failed to fetch fiat transaction status:', errorData);
            throw new Error('Failed to fetch fiat transaction status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching fiat transaction status:', error);
        return null;
    }
}

/**
 * Get an estimate for a fiat exchange transaction.
 */
export async function getFiatEstimate(
    request: FiatEstimateRequest
): Promise<FiatEstimateResponse | null> {
    try {
        const params = new URLSearchParams();
        
        // Add required parameters
        params.append('from_currency', request.from_currency);
        params.append('from_amount', request.from_amount.toString());
        params.append('to_currency', request.to_currency);
        
        // Add optional parameters
        if (request.from_network) params.append('from_network', request.from_network);
        if (request.to_network) params.append('to_network', request.to_network);
        if (request.deposit_type) params.append('deposit_type', request.deposit_type);
        if (request.payout_type) params.append('payout_type', request.payout_type);

        const response = await fetch(
            `${CHANGENOW_API_BASE}/fiat-estimate?${params.toString()}`,
            {
                headers: {
                    'x-api-key': CHANGENOW_API_KEY,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Failed to fetch fiat estimate:', errorData);
            throw new Error('Failed to fetch fiat estimate');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching fiat estimate:', error);
        return null;
    }
}

/**
 * Get market information including min and max range for fiat transactions.
 */
export async function getFiatMarketInfo(
    fromCurrency: string,
    toCurrency: string,
    options?: {
        fromNetwork?: string;
        toNetwork?: string;
    }
): Promise<FiatMarketInfoResponse | null> {
    try {
        const fromCurrencyWithNetwork = options?.fromNetwork 
            ? `${fromCurrency}_${options.fromNetwork}`
            : fromCurrency;
        const toCurrencyWithNetwork = options?.toNetwork
            ? `${toCurrency}_${options.toNetwork}`
            : toCurrency;
        
        const pair = `${fromCurrencyWithNetwork}-${toCurrencyWithNetwork}`;

        const response = await fetch(
            `${CHANGENOW_API_BASE}/fiat-market-info/min-max-range/${pair}`,
            {
                headers: {
                    'x-changenow-api-key': CHANGENOW_API_KEY,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Failed to fetch fiat market info:', errorData);
            throw new Error('Failed to fetch fiat market info');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching fiat market info:', error);
        return null;
    }
}

/**
 * Check the health status of the fiat-to-cryptocurrency exchange service.
 */
export async function getFiatHealthCheck(): Promise<FiatHealthCheckResponse | null> {
    try {
        const response = await fetch(
            `${CHANGENOW_API_BASE}/fiat-status`,
            {
                headers: {
                    'x-changenow-api-key': CHANGENOW_API_KEY,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Failed to fetch fiat health check:', errorData);
            throw new Error('Failed to fetch fiat health check');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching fiat health check:', error);
        return null;
    }
}

/**
 * Get information about fiat currencies that can be used to buy cryptocurrencies.
 */
export async function getFiatCurrencies(): Promise<FiatCurrency[] | null> {
    try {
        const response = await fetch(
            `${CHANGENOW_API_BASE}/fiat-currencies/fiat`,
            {
                // headers: {
                //     'x-changenow-api-key': CHANGENOW_API_KEY,
                // },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Failed to fetch fiat currencies:', errorData);
            throw new Error('Failed to fetch fiat currencies');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching fiat currencies:', error);
        return null;
    }
}

/**
 * Get information about cryptocurrencies that can be bought using fiat currencies.
 */
export async function getCryptoCurrenciesForFiat(): Promise<CryptoCurrencyForFiat[] | null> {
    try {
        const response = await fetch(
            `${CHANGENOW_API_BASE}/fiat-currencies/crypto`,
            {
                // headers: {
                //     'x-changenow-api-key': CHANGENOW_API_KEY,
                // },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Failed to fetch crypto currencies for fiat:', errorData);
            throw new Error('Failed to fetch crypto currencies for fiat');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching crypto currencies for fiat:', error);
        return null;
    }
}

/**
 * Get possible actions that can be applied to an exchange transaction.
 * Note: Access to this endpoint requires a dedicated request to partners@changenow.io
 */
export async function getExchangeActions(
    transactionId: string
): Promise<ExchangeActionsResponse | null> {
    try {
        const params = new URLSearchParams({ id: transactionId });

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/actions?${params.toString()}`,
            {
                headers: {
                    'x-changenow-api-key': CHANGENOW_API_KEY,
                },
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized: Please contact partners@changenow.io for access to this endpoint');
            }
            const errorData = await response.json().catch(() => null);
            console.error('Failed to fetch exchange actions:', errorData);
            throw new Error('Failed to fetch exchange actions');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching exchange actions:', error);
        return null;
    }
}

/**
 * Refund an exchange to the refund or original address.
 * Note: Access to this endpoint requires a dedicated request to partners@changenow.io
 */
export async function refundExchange(
    request: RefundExchangeRequest
): Promise<RefundExchangeResponse | null> {
    try {
        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/refund`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-changenow-api-key': CHANGENOW_API_KEY,
                },
                body: JSON.stringify({
                    id: request.id,
                    address: request.address,
                    ...(request.extraId && { extraId: request.extraId })
                }),
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized: Please contact partners@changenow.io for access to this endpoint');
            }
            const errorData = await response.json().catch(() => null);
            console.error('Failed to refund exchange:', errorData);
            throw new Error('Failed to refund exchange');
        }

        return await response.json();
    } catch (error) {
        console.error('Error refunding exchange:', error);
        toast({
            variant: "destructive",
            title: "Refund Error",
            description: "Failed to process refund request. Please try again."
        });
        return null;
    }
}

/**
 * Continue an exchange that can be pushed.
 * Note: Access to this endpoint requires a dedicated request to partners@changenow.io
 */
export async function continueExchange(
    request: ContinueExchangeRequest
): Promise<ContinueExchangeResponse | null> {
    try {
        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/continue`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-changenow-api-key': CHANGENOW_API_KEY,
                },
                body: JSON.stringify({
                    id: request.id
                }),
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized: Please contact partners@changenow.io for access to this endpoint');
            }
            const errorData = await response.json().catch(() => null);
            console.error('Failed to continue exchange:', errorData);
            throw new Error('Failed to continue exchange');
        }

        return await response.json();
    } catch (error) {
        console.error('Error continuing exchange:', error);
        toast({
            variant: "destructive",
            title: "Continue Exchange Error",
            description: "Failed to continue exchange. Please try again."
        });
        return null;
    }
}
