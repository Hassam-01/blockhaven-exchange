// Re-export BlockHeaven API functions for functions that require API keys
export {
  getAvailableCurrencies,
  getAvailablePairs,
  getMinimalExchangeAmount,
  getEstimatedExchangeAmount,
  getTransactionStatus,
  getUserAddresses,
  getEstimatedNetworkFee,
  getExchangeRange,
  createFiatTransaction,
  getFiatMarketInfo,
  getFiatHealthCheck,
  getExchangeActions,
  refundExchange,
  continueExchange,
  getFiatTransactionStatus,
  getFiatEstimate,
  type ExchangeCurrency,
  type CurrencyOptions,
} from "@/lib/blockhaven-api";

import {
  CreateTransactionResponse,
  CryptoCurrencyForFiat,
  FiatCurrency,
  ValidationResponse,
} from "@/const/types";
import { toast } from "@/hooks/use-toast";
import { API_CONFIG, getHeaders } from "@/lib/api-config";

export interface MarketInfo {
  ticker: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
  marketCap: number;
}

/**
 * Create an exchange transaction through BlockHeaven backend.
 * This function goes through your backend instead of directly to external providers.
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
    flow?: "standard" | "fixed-rate";
    type?: "direct" | "reverse";
    rateId?: string;
  },
  userIp?: string
): Promise<CreateTransactionResponse | null> {
  try {
    // Prepare headers for backend request (with or without token)
    // Ensure JSON content type so the backend can parse the request body
    const headers = {
      ...getHeaders(),
      "Content-Type": "application/json",
      Accept: "application/json",
    } as HeadersInit;

    // Add user IP to the request body if provided
    const requestBody = userIp ? { ...body, userIp } : body;

    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EXCHANGES.CREATE}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || "Failed to create transaction";

      toast({
        variant: "destructive",
        title: "Transaction Error",
        description: errorMessage,
      });

      throw new Error(errorMessage);
    }

    const result = await response.json();

    // Extract the actual transaction data from the response
    const transactionData = result.data || result;

    // Show success message
    toast({
      title: "Transaction Created",
      description: "Your exchange transaction has been created successfully.",
    });

    return transactionData;
  } catch (error) {
    // console.error("Error creating exchange transaction:", error);

    // Only show toast if it hasn't been shown already
    if (
      error instanceof Error &&
      !error.message.includes("Failed to create transaction")
    ) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Unable to connect to the server. Please try again.",
      });
    }

    return null;
  }
}

/**
 * Validate a payout or refund address for a specific currency/network.
 * Now uses BlockHeaven backend endpoint.
 */
export async function validateAddress(
  currency: string,
  address: string
): Promise<ValidationResponse | null> {
  try {
    const params = new URLSearchParams({ currency, address });

    const response = await fetch(
      `${
        API_CONFIG.BASE_URL
      }/api/blockhaven/validate-address?${params.toString()}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) throw new Error("Failed to validate address");

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    // console.error("Error validating address:", error);
    return null;
  }
}

/**
 * Get information about fiat currencies that can be used to buy cryptocurrencies.
 * Now uses BlockHeaven backend endpoint.
 */
export async function getFiatCurrencies(): Promise<FiatCurrency[] | null> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/blockhaven/fiat-currencies`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      // console.error("Failed to fetch fiat currencies:", errorData);
      throw new Error("Failed to fetch fiat currencies");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    // console.error("Error fetching fiat currencies:", error);
    return null;
  }
}

/**
 * Get information about cryptocurrencies that can be bought using fiat currencies.
 * Now uses BlockHeaven backend endpoint.
 */
export async function getCryptoCurrenciesForFiat(): Promise<
  CryptoCurrencyForFiat[] | null
> {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/api/blockhaven/crypto-currencies-for-fiat`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to fetch crypto currencies for fiat:", errorData);
      throw new Error("Failed to fetch crypto currencies for fiat");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching crypto currencies for fiat:", error);
    return null;
  }
}