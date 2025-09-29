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


export interface ExchangeRange {
    fromCurrency: string;
    fromNetwork: string;
    toCurrency: string;
    toNetwork: string;
    flow: string;
    minAmount: number;
    maxAmount: number | null;
}