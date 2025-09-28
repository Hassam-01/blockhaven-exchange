export type AvailablePairsResponse = string[]; // array of underscore-separated pairs, e.g. "btc_usdt"

export interface MinAmountResponse {
    minAmount: number;
}

export interface ExchangeCurrency {
    ticker: string;
    name: string;
    image: string;
    hasExternalId: boolean;
    isExtraIdSupported: boolean;
    isFiat: boolean;
    featured: boolean;
    isStable: boolean;
    supportsFixedRate: boolean;
    network: string;
    tokenContract: string | null;
    buy: boolean;
    sell: boolean;
    legacyTicker: string;
    color?: string;
    logo?: string;
}

export interface UserAddress {
    currency: string;
    chain: string;
    address: string;
    protocol: string;
}

export interface UserAddressesResponse {
    success: boolean;
    addresses: UserAddress[];
}

export interface EstimatedAmountResponse {
    fromAmount: number;
    toAmount: number;
    flow: string;
}

export interface CreateTransactionResponse {
    id: string;
    payinAddress: string;
    payoutAddress: string;
    payoutExtraId?: string;
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    fromNetwork?: string;
    toNetwork?: string;
    flow: 'standard' | 'fixed-rate';
    type: 'direct' | 'reverse';
    rate: number;
    rateId?: string;
    validUntil: string;
    depositFee?: number;
    withdrawalFee?: number;
    transactionFee?: number;
    userId?: string;
    payload?: Record<string, string>;
    contactEmail?: string;
    refundAddress?: string;
    refundExtraId?: string;
    createdAt: string;
    kycRequired?: boolean;
    isUniqueAddress: boolean;
    warningMessage?: string;
    depositMaxLimit?: number;
    depositMinLimit?: number;
}

export interface TransactionStatusResponse {
    id: string;
    status:
    | 'new'
    | 'waiting'
    | 'confirming'
    | 'exchanging'
    | 'sending'
    | 'finished'
    | 'failed'
    | 'refunded'
    | 'verifying'
    | 'expired';
    statusCode?: number;
    payinAddress: string;
    payoutAddress: string;
    payoutExtraId?: string;
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    fromNetwork?: string;
    toNetwork?: string;
    expectedAmountFrom?: number;
    expectedAmountTo?: number;
    amountFrom?: number;
    amountTo?: number;
    rate?: number;
    rateType?: 'fixed' | 'float';
    depositReceived?: boolean;
    depositReceivedAmount?: number;
    payinHash?: string;
    payoutHash?: string;
    refundHash?: string;
    kycRequired?: boolean;
    kycStatus?: 'not-submitted' | 'in-progress' | 'rejected' | 'approved';
    created_at: string;
    updated_at: string;
    depositFee?: number;
    withdrawalFee?: number;
    transactionFee?: number;
    depositMaxLimit?: number;
    depositMinLimit?: number;
    validUntil: string;
    userId?: string;
    isUniqueAddress: boolean;
    refundAddress?: string;
    refundExtraId?: string;
    contactEmail?: string;
    error?: string;
    warningMessage?: string;
    transactionId?: string;
    networkFee?: {
        deposit: {
            currency: string;
            network: string;
            amount: number;
        };
        withdrawal: {
            currency: string;
            network: string;
            amount: number;
        };
    };
}

export interface TransactionStatusHistory {
    status: string;
    statusCode: number;
    createdAt: string;
}

export interface TransactionEstimatedAmount {
    fromAmount: number;
    toAmount: number;
    rate: number;
    rateId?: string;
    validUntil: string;
    transactionSpeedForecast?: string;
    warningMessage?: string;
    depositFee?: number;
    withdrawalFee?: number;
    networkFee?: NetworkFeeEstimate;
}
export interface ValidationResponse {
    result: boolean;
    message: string | null;
    isActivated: boolean;
}

export interface NetworkFeeEstimate {
    estimatedFee: {
        deposit: {
            currency: string;
            network: string;
            amount: number;
        };
        withdrawal: {
            currency: string;
            network: string;
            amount: number;
        };
        totals: {
            from: {
                currency: string;
                network: string;
                amount: number;
            };
            to: {
                currency: string;
                network: string;
                amount: number;
            };
        };
        converted: {
            currency: string;
            network: string;
            deposit: number;
            withdrawal: number;
            total: number;
        };
    };
}

// api.ts
const CHANGENOW_API_BASE = '/api/changenow';
const CHANGENOW_API_KEY = '4d2e85bbf550b94bd9647732dc3b9984ac14b560a1236f8f142fe82f9e8ce583';

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
        // Deduplicate currencies by ticker and add color/logo properties
        const uniqueCurrencies = currencies.reduce((acc: ExchangeCurrency[], currency: ExchangeCurrency) => {
            const existingIndex = acc.findIndex(c => c.ticker === currency.ticker);
            if (existingIndex === -1) {
                // Add new currency with color and logo
                acc.push({
                    ...currency,
                    color: getCoinColor(currency.ticker),
                    logo: currency?.image
                });
            } else {
                // Update existing currency if this one is more featured or has better properties
                const existing = acc[existingIndex];
                if (currency.featured && !existing.featured) {
                    acc[existingIndex] = {
                        ...currency,
                        color: getCoinColor(currency.ticker),
                        logo: currency?.image
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

        if (!response.ok) throw new Error('Failed to fetch available pairs');
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

        if (!response.ok) throw new Error('Failed to fetch minimal exchange amount');
        return await response.json();
    } catch (error) {
        console.error('Error fetching minimal exchange amount:', error);
        return null;
    }
}

/**
 * Get an estimated exchange amount and related details.
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
): Promise<EstimatedAmountResponse | null> {
    try {
        const params = new URLSearchParams({
            fromCurrency,
            toCurrency,
        });

        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, String(value));
            }
        });

        const response = await fetch(
            `${CHANGENOW_API_BASE}/exchange/estimated-amount?${params.toString()}`,
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
        );

        if (!response.ok) throw new Error('Failed to fetch estimated amount');
        return await response.json();
    } catch (error) {
        console.error('Error fetching estimated exchange amount:', error);
        return null;
    }
}

/**
 * Create an exchange transaction.
 */
export async function createExchangeTransaction(
    body: {
        fromCurrency: string;
        toCurrency: string;
        fromNetwork?: string;
        toNetwork?: string;
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
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-changenow-api-key': CHANGENOW_API_KEY,
        };

        if (userIp) {
            headers['x-forwarded-for'] = userIp;
        }

        const response = await fetch(`${CHANGENOW_API_BASE}/exchange`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) throw new Error('Failed to create transaction');
        return await response.json();
    } catch (error) {
        console.error('Error creating exchange transaction:', error);
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
            {
                headers: { 'x-changenow-api-key': CHANGENOW_API_KEY },
            }
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