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
  rateId?: string; // Available for fixed-rate flow when useRateId is true
  validUntil?: string; // Timestamp until which the rate is valid (ISO format)
}

export interface CreateTransactionResponse {
  id: string;
  payinAddress: string;
  payoutAddress: string;
  payoutExtraId?: string;
  payinExtraId?: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  fromNetwork?: string;
  toNetwork?: string;
  flow: "standard" | "fixed-rate";
  type: "direct" | "reverse";
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
    | "new"
    | "waiting"
    | "confirming"
    | "exchanging"
    | "sending"
    | "finished"
    | "failed"
    | "refunded"
    | "verifying"
    | "expired";
  statusCode?: number;
  payinAddress: string;
  payoutAddress: string;
  payoutExtraId?: string;
  payinExtraId?: string;
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
  rateType?: "fixed" | "float";
  depositReceived?: boolean;
  depositReceivedAmount?: number;
  depositReceivedAt?: string; // When deposit was received
  payinHash?: string;
  payoutHash?: string;
  refundHash?: string;
  kycRequired?: boolean;
  kycStatus?: "not-submitted" | "in-progress" | "rejected" | "approved";
  created_at?: string; // Keep for backward compatibility
  updated_at?: string; // Keep for backward compatibility
  createdAt: string; // Actual field from API
  updatedAt?: string; // Actual field from API
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

export interface FiatTransactionRequest {
  from_amount: number;
  from_currency: string;
  to_currency: string;
  from_network: string | null;
  to_network: string;
  payout_address: string;
  payout_extra_id?: string;
  deposit_type: string;
  payout_type: string;
  external_partner_link_id?: string;
  customer: {
    contact_info: {
      email: string;
      phone_number?: string;
    };
  };
}

export interface FiatTransactionResponse {
  id: string;
  status: string;
  email: string | null;
  errors: string[];
  status_details: string | null;
  from_currency: string;
  from_network: string | null;
  from_currency_with_network: string | null;
  from_amount: string;
  deposit_type: string;
  payout_type: string;
  expected_from_amount: string;
  to_currency: string;
  to_network: string | null;
  to_currency_with_network: string | null;
  to_amount: string | null;
  output_hash: string | null;
  expected_to_amount: string;
  location: string;
  created_at: string;
  updated_at: string;
  partner_id: string;
  external_partner_link_id: string | null;
  estimate_breakdown: {
    toAmount: string;
    fromAmount: number;
    serviceFees: Array<{
      name: string;
      amount: string;
      currency: string;
    }>;
    convertedAmount: {
      amount: string;
      currency: string;
    };
    estimatedExchangeRate: string;
    networkFee: {
      amount: string;
      currency: string;
    };
  };
  payout: {
    address: string;
    extra_id?: string;
  };
  redirect_url: string;
}

export interface FiatTransactionStatusResponse {
  id: string;
  status: string;
  email: string | null;
  errors: string[];
  status_details: string | null;
  from_currency: string;
  from_network: string | null;
  from_currency_with_network: string | null;
  from_amount: string;
  deposit_type: string;
  payout_type: string;
  expected_from_amount: string;
  to_currency: string;
  to_network: string | null;
  to_currency_with_network: string | null;
  to_amount: string | null;
  output_hash: string | null;
  expected_to_amount: string;
  location: string;
  created_at: string;
  updated_at: string;
  partner_id: string;
  external_partner_link_id: string | null;
  estimate_breakdown?: {
    toAmount: string;
    fromAmount: number;
    serviceFees: Array<{
      name: string;
      amount: string;
      currency: string;
    }>;
    convertedAmount: {
      amount: string;
      currency: string;
    };
    estimatedExchangeRate: string;
    networkFee: {
      amount: string;
      currency: string;
    };
  };
  payout: {
    address: string;
    extra_id?: string;
  };
  redirect_url?: string;
}

export interface FiatEstimateRequest {
  from_currency: string;
  from_network?: string;
  from_amount: number;
  to_currency: string;
  to_network?: string;
  deposit_type?: string;
  payout_type?: string;
}

export interface FiatEstimateResponse {
  from_currency: string;
  from_network: string | null;
  from_amount: string;
  to_currency: string;
  to_network: string | null;
  to_amount: string;
  deposit_type: string;
  payout_type: string;
  estimate_breakdown: {
    toAmount: string;
    fromAmount: number;
    serviceFees: Array<{
      name: string;
      amount: string;
      currency: string;
    }>;
    convertedAmount: {
      amount: string;
      currency: string;
    };
    estimatedExchangeRate: string;
    networkFee: {
      amount: string;
      currency: string;
    };
  };
}

export interface FiatMarketInfoResponse {
  fromCurrency: string;
  fromNetwork: string | null;
  toCurrency: string;
  toNetwork: string | null;
  minAmount: number;
  maxAmount: number | null;
  depositType: string;
  payoutType: string;
}

export interface FiatHealthCheckResponse {
  status: string;
  message?: string;
  timestamp?: string;
}

export interface FiatCurrency {
  ticker: string;
  name: string;
  image?: string;
  precision: number;
  isStable?: boolean;
  supportsTestMode?: boolean;
}

export interface CryptoCurrencyForFiat {
  ticker: string;
  name: string;
  image?: string;
  network: string;
  tokenContract?: string | null;
  precision: number;
  isStable?: boolean;
  supportsTestMode?: boolean;
}

export interface ExchangeActionsResponse {
  available: boolean;
  amount: number;
  address: string;
  additionalAddressList: string[];
  currentEstimate: number;
}

export interface RefundExchangeRequest {
  id: string;
  address: string;
  extraId?: string;
}

export interface RefundExchangeResponse {
  result: boolean;
}

export interface ContinueExchangeRequest {
  id: string;
}

export interface ContinueExchangeResponse {
  result: boolean;
  amount: number;
  currency: string;
  network: string;
}
