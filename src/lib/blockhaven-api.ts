import {
  AvailablePairsResponse,
  ContinueExchangeRequest,
  ContinueExchangeResponse,
  CryptoCurrencyForFiat,
  EstimatedAmountResponse,
  ExchangeActionsResponse,
  ExchangeRange,
  FiatEstimateRequest,
  FiatEstimateResponse,
  FiatHealthCheckResponse,
  FiatMarketInfoResponse,
  FiatTransactionRequest,
  FiatTransactionResponse,
  FiatTransactionStatusResponse,
  MinAmountResponse,
  NetworkFeeEstimate,
  RefundExchangeRequest,
  RefundExchangeResponse,
  TransactionStatusResponse,
  UserAddressesResponse,
} from "@/const/types";
import { toast } from "@/hooks/use-toast";
import { API_CONFIG, getHeaders } from "@/lib/api-config";

// Coin colors mapping for currency display
const coinColors: Record<string, string> = {
  btc: "#f7931a",
  eth: "#627eea",
  usdt: "#26a17b",
  usdc: "#2775ca",
  bnb: "#f3ba2f",
  ada: "#0033ad",
  sol: "#9945ff",
  xrp: "#23292f",
  doge: "#c2a633",
  avax: "#e84142",
  matic: "#8247e5",
  dot: "#e6007a",
  ltc: "#bfbbbb",
  link: "#2a5ada",
  atom: "#2e3148",
  near: "#000000",
  ftm: "#1969ff",
  algo: "#000000",
  vet: "#15bdff",
  icp: "#29abe2",
  flow: "#00ef8b",
  hbar: "#000000",
  egld: "#000000",
  xtz: "#2c7df7",
  mana: "#ff2d55",
  sand: "#00adef",
  axs: "#0052ff",
  chz: "#cd1d1f",
  enj: "#624dbf",
  gala: "#ffd700",
  ilv: "#ffd700",
  ape: "#0052ff",
  lrc: "#2c5aa0",
  bat: "#ff5000",
  zec: "#ecb244",
  xmr: "#ff6600",
  dash: "#008ce7",
  eos: "#000000",
  trx: "#ff060a",
  xlm: "#7d00ff",
  neo: "#00e599",
  qtum: "#2e9ad0",
  waves: "#0055ff",
  omg: "#1a53f0",
  zil: "#00d4ff",
  ont: "#00a6b4",
  iost: "#1c1c1c",
  nano: "#4a90e2",
  rvn: "#384182",
  dcr: "#2ed6a1",
  zrx: "#000000",
  rep: "#40a2ba",
  knc: "#31cb9e",
  comp: "#00d395",
  mkr: "#1abc9c",
  snx: "#d1d1d1",
  yfi: "#006ae3",
  aave: "#b6509e",
  sushi: "#d65892",
  crv: "#40649f",
  "1inch": "#1f2937",
  uni: "#ff007a",
  cake: "#d1884f",
  sxp: "#f8b500",
  theta: "#2ab8e6",
  fil: "#0090ff",
  tfuel: "#2ab8e6",
  klay: "#f6c343",
  ksm: "#000000",
  mina: "#ea4e99",
  celo: "#35d07f",
  one: "#00d4aa",
  rose: "#ff6b6b",
  iotx: "#00d4d5",
  grt: "#6747ed",
  luna: "#ff6b35",
  ust: "#00d4aa",
  lunc: "#ff6b35",
  shib: "#ff6b35",
  pepe: "#00d4aa",
  floki: "#ff6b35",
  bonk: "#ff6b35",
  wld: "#00d4aa",
  arb: "#2d3748",
  op: "#ff6b35",
  sei: "#00d4aa",
  sui: "#ff6b35",
  apt: "#00d4aa",
  tia: "#ff6b35",
  inj: "#00d4aa",
  strk: "#ff6b35",
  pyth: "#00d4aa",
  jup: "#ff6b35",
  w: "#00d4aa",
  jto: "#ff6b35",
  myro: "#00d4aa",
  bome: "#ff6b35",
  wif: "#00d4aa",
  popcat: "#ff6b35",
  meow: "#00d4aa",
  act: "#ff6b35",
  gme: "#00d4aa",
  roaring: "#ff6b35",
  trump: "#00d4aa",
  biden: "#ff6b35",
  maga: "#00d4aa",
  djt: "#ff6b35",
  meme: "#00d4aa",
  based: "#ff6b35",
  tremp: "#00d4aa",
  boden: "#ff6b35",
  mog: "#00d4aa",
  pnut: "#ff6b35",
  bub: "#00d4aa",
  cat: "#ff6b35",
};

// Helper function to get coin color
function getCoinColor(ticker: string): string {
  return coinColors[ticker.toLowerCase()] || "#6b7280";
}

// Exchange Currency Interface
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

// Currency Options Interface
export interface CurrencyOptions {
  active?: boolean;
  flow?: "standard" | "fixed-rate";
  buy?: boolean;
  sell?: boolean;
}

// BlockHeaven API Base URL
const BLOCKHAVEN_API_BASE = `${API_CONFIG.BASE_URL}/api/blockhaven`;

// ========================= BLOCKHAVEN API ENDPOINTS =========================

/**
 * 1. Fetches the list of available currencies from BlockHeaven API.
 * BlockHeaven Endpoint: GET /api/blockhaven/currencies
 */
export async function getAvailableCurrencies(
  options: CurrencyOptions = {}
): Promise<ExchangeCurrency[] | null> {
  try {
    const { active, flow = "standard", buy, sell } = options;

    const params = new URLSearchParams();
    if (active !== undefined) params.append("active", String(active));
    if (flow) params.append("flow", flow);
    if (buy !== undefined) params.append("buy", String(buy));
    if (sell !== undefined) params.append("sell", String(sell));

    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/currencies?${params.toString()}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || "Failed to fetch currencies");
    }

    const result = await response.json();
    const currencies = result.data || result;

    // Filter out currencies with null or undefined network values first
    const validCurrencies = currencies.filter(
      (currency: ExchangeCurrency) =>
        currency.network !== null &&
        currency.network !== undefined &&
        currency.network.trim() !== ""
    );

    // Deduplicate currencies by ticker and add color/logo properties
    const uniqueCurrencies = validCurrencies.reduce(
      (acc: ExchangeCurrency[], currency: ExchangeCurrency) => {
        const existingIndex = acc.findIndex(
          (c) => c.ticker === currency.ticker
        );
        if (existingIndex === -1) {
          // Add new currency with color and logo
          acc.push({
            ...currency,
            image: currency?.image || "",
            hasExternalId: currency?.hasExternalId || false,
            isFiat: currency?.isFiat || false,
            featured: currency?.featured || false,
            isStable: currency?.isStable || false,
            supportsFixedRate: currency?.supportsFixedRate || false,
            network: currency?.network || "",
            tokenContract: currency?.tokenContract || null,
            buy: currency?.buy || false,
            sell: currency?.sell || false,
            legacyTicker: currency?.legacyTicker || "",
            isExtraIdSupported: currency?.isExtraIdSupported || false,
            color: getCoinColor(currency.ticker),
            logo: currency?.image || "",
          });
        } else {
          // Update existing currency if this one is more featured or has better properties
          const existing = acc[existingIndex];
          if (currency.featured && !existing.featured) {
            acc[existingIndex] = {
              ...currency,
              image: currency?.image || "",
              hasExternalId: currency?.hasExternalId || false,
              isFiat: currency?.isFiat || false,
              featured: currency?.featured || false,
              isStable: currency?.isStable || false,
              supportsFixedRate: currency?.supportsFixedRate || false,
              network: currency?.network || "",
              tokenContract: currency?.tokenContract || null,
              buy: currency?.buy || false,
              sell: currency?.sell || false,
              legacyTicker: currency?.legacyTicker || "",
              isExtraIdSupported: currency?.isExtraIdSupported || false,
              color: getCoinColor(currency.ticker),
              logo: currency?.image || "",
            };
          }
        }
        return acc;
      },
      []
    );

    return uniqueCurrencies;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch available currencies",
    });
    return null;
  }
}

/**
 * 2. Fetches all available trading pairs from BlockHeaven API.
 * BlockHeaven Endpoint: GET /api/blockhaven/available-pairs
 */
export async function getAvailablePairs(
  fromCurrency?: string,
  toCurrency?: string,
  fromNetwork?: string,
  toNetwork?: string,
  flow?: "standard" | "fixed-rate"
): Promise<AvailablePairsResponse | null> {
  try {
    const params = new URLSearchParams();
    if (fromCurrency) params.append("fromCurrency", fromCurrency);
    if (toCurrency) params.append("toCurrency", toCurrency);
    if (fromNetwork) params.append("fromNetwork", fromNetwork);
    if (toNetwork) params.append("toNetwork", toNetwork);
    if (flow) params.append("flow", flow);

    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/available-pairs?${params.toString()}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || "Failed to fetch available pairs";
      
      toast({
        variant: "destructive",
        title: "Invalid Currency Pair",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching available pairs:", error);
    return null;
  }
}

/**
 * 3. Get the minimal payment amount required to make an exchange.
 * BlockHeaven Endpoint: GET /api/blockhaven/min-amount
 */
export async function getMinimalExchangeAmount(
  fromCurrency: string,
  toCurrency: string,
  options?: {
    fromNetwork?: string;
    toNetwork?: string;
    flow?: "standard" | "fixed-rate";
  }
): Promise<MinAmountResponse | null> {
  try {
    const params = new URLSearchParams({
      fromCurrency,
      toCurrency,
    });

    if (options?.fromNetwork) params.append("fromNetwork", options.fromNetwork);
    if (options?.toNetwork) params.append("toNetwork", options.toNetwork);
    if (options?.flow) params.append("flow", options.flow);

    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/min-amount?${params.toString()}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || "Failed to fetch minimal exchange amount";
      
      toast({
        variant: "destructive",
        title: "Invalid Currency Pair",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching minimal exchange amount:", error);
    return null;
  }
}

/**
 * 4. Get an estimated exchange amount and related details.
 * BlockHeaven Endpoint: GET /api/blockhaven/estimated-amount
 */
export async function getEstimatedExchangeAmount(
  fromCurrency: string,
  toCurrency: string,
  options: {
    fromAmount?: number;
    toAmount?: number;
    fromNetwork?: string;
    toNetwork?: string;
    flow?: "standard" | "fixed-rate";
    type?: "direct" | "reverse";
    useRateId?: boolean;
    isTopUp?: boolean;
  }
): Promise<EstimatedAmountResponse> {
  // Automatically set useRateId to true for fixed-rate flow to get rateId
  const modifiedOptions = {
    ...options,
    useRateId: options.flow === "fixed-rate" ? true : options.useRateId,
  };

  const params = new URLSearchParams({ fromCurrency, toCurrency });
  Object.entries(modifiedOptions).forEach(
    ([k, v]) => v !== undefined && params.append(k, String(v))
  );

  const res = await fetch(
    `${BLOCKHAVEN_API_BASE}/estimated-amount?${params.toString()}`,
    { headers: getHeaders() }
  );

  const result = await res.json();
  if (!res.ok) {
    const message = result?.error ?? "Failed to fetch estimated amount";

    toast({
      variant: "destructive",
      title: "Estimation Error",
      description: message,
    });
    throw new Error(message);
  }

  return (result.data || result) as EstimatedAmountResponse;
}

/**
 * 5. Get status and details for a single transaction by its ID.
 * BlockHeaven Endpoint: GET /api/blockhaven/transaction-status/:id
 */
export async function getTransactionStatus(
  transactionId: string
): Promise<TransactionStatusResponse | null> {
  try {
    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/transaction-status/${encodeURIComponent(transactionId)}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch transaction status");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    return null;
  }
}

/**
 * 6. Get the list of addresses bound to a given FIO/Unstoppable domain name.
 * BlockHeaven Endpoint: GET /api/blockhaven/addresses-by-name
 */
export async function getUserAddresses(
  name: string,
  apiKey?: string
): Promise<UserAddressesResponse | null> {
  try {
    const params = new URLSearchParams({ name });
    if (apiKey) params.append("apiKey", apiKey);

    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/addresses-by-name?${params.toString()}`,
      { headers: getHeaders() }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user addresses");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return null;
  }
}

/**
 * 7. Get estimated network fee for an exchange.
 * BlockHeaven Endpoint: GET /api/blockhaven/network-fee
 */
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

    if (options?.fromNetwork) params.append("fromNetwork", options.fromNetwork);
    if (options?.toNetwork) params.append("toNetwork", options.toNetwork);
    if (options?.convertedCurrency)
      params.append("convertedCurrency", options.convertedCurrency);
    if (options?.convertedNetwork)
      params.append("convertedNetwork", options.convertedNetwork);

    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/network-fee?${params.toString()}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch network fee estimate");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching network fee estimate:", error);
    return null;
  }
}

/**
 * 8. Get exchange range (min/max amounts) for a currency pair.
 * BlockHeaven Endpoint: GET /api/blockhaven/exchange-range
 */
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

    if (options?.fromNetwork) params.append("fromNetwork", options.fromNetwork);
    if (options?.toNetwork) params.append("toNetwork", options.toNetwork);
    if (options?.flow) params.append("flow", options.flow);
    
    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/exchange-range?${params.toString()}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange range");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching exchange range:", error);
    return null;
  }
}

/**
 * 9. Create a fiat-to-cryptocurrency exchange transaction.
 * BlockHeaven Endpoint: POST /api/blockhaven/fiat-transaction
 */
export async function createFiatTransaction(
  request: FiatTransactionRequest
): Promise<FiatTransactionResponse | null> {
  try {
    const response = await fetch(`${BLOCKHAVEN_API_BASE}/fiat-transaction`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || "Failed to create fiat transaction";
      
      toast({
        variant: "destructive",
        title: "Transaction Error",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error creating fiat transaction:", error);
    return null;
  }
}

/**
 * 10. Get market information including min and max range for fiat transactions.
 * BlockHeaven Endpoint: GET /api/blockhaven/fiat-market-info/:fromCurrency/:toCurrency
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
    const params = new URLSearchParams();
    if (options?.fromNetwork) params.append("fromNetwork", options.fromNetwork);
    if (options?.toNetwork) params.append("toNetwork", options.toNetwork);

    const queryString = params.toString();
    const url = queryString 
      ? `${BLOCKHAVEN_API_BASE}/fiat-market-info/${encodeURIComponent(fromCurrency)}/${encodeURIComponent(toCurrency)}?${queryString}`
      : `${BLOCKHAVEN_API_BASE}/fiat-market-info/${encodeURIComponent(fromCurrency)}/${encodeURIComponent(toCurrency)}`;

    const response = await fetch(url, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to fetch fiat market info:", errorData);
      throw new Error("Failed to fetch fiat market info");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching fiat market info:", error);
    return null;
  }
}

/**
 * 11. Check the health status of the fiat-to-cryptocurrency exchange service.
 * BlockHeaven Endpoint: GET /api/blockhaven/fiat-health-check
 */
export async function getFiatHealthCheck(): Promise<FiatHealthCheckResponse | null> {
  try {
    const response = await fetch(`${BLOCKHAVEN_API_BASE}/fiat-health-check`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to fetch fiat health check:", errorData);
      throw new Error("Failed to fetch fiat health check");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching fiat health check:", error);
    return null;
  }
}

/**
 * 12. Get possible actions that can be applied to an exchange transaction.
 * BlockHeaven Endpoint: GET /api/blockhaven/exchange-actions/:id
 */
export async function getExchangeActions(
  transactionId: string
): Promise<ExchangeActionsResponse | null> {
  try {
    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/exchange-actions/${encodeURIComponent(transactionId)}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to fetch exchange actions:", errorData);
      throw new Error("Failed to fetch exchange actions");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching exchange actions:", error);
    return null;
  }
}

/**
 * 13. Refund an exchange to the refund or original address.
 * BlockHeaven Endpoint: POST /api/blockhaven/refund
 */
export async function refundExchange(
  request: RefundExchangeRequest
): Promise<RefundExchangeResponse | null> {
  try {
    const response = await fetch(`${BLOCKHAVEN_API_BASE}/refund`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: request.id,
        address: request.address,
        ...(request.extraId && { extraId: request.extraId }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || "Failed to refund exchange";
      
      toast({
        variant: "destructive",
        title: "Refund Error",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error refunding exchange:", error);
    return null;
  }
}

/**
 * 14. Continue an exchange that can be pushed.
 * BlockHeaven Endpoint: POST /api/blockhaven/continue
 */
export async function continueExchange(
  request: ContinueExchangeRequest
): Promise<ContinueExchangeResponse | null> {
  try {
    const response = await fetch(`${BLOCKHAVEN_API_BASE}/continue`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: request.id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || "Failed to continue exchange";
      
      toast({
        variant: "destructive",
        title: "Continue Exchange Error",
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error continuing exchange:", error);
    return null;
  }
}

/**
 * 15. Get the status of a fiat transaction by its ID.
 * BlockHeaven Endpoint: GET /api/blockhaven/fiat-transaction-status/:id
 */
export async function getFiatTransactionStatus(
  transactionId: string
): Promise<FiatTransactionStatusResponse | null> {
  try {
    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/fiat-transaction-status/${encodeURIComponent(transactionId)}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to fetch fiat transaction status:", errorData);
      throw new Error("Failed to fetch fiat transaction status");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching fiat transaction status:", error);
    return null;
  }
}

/**
 * 16. Get an estimate for a fiat exchange transaction.
 * BlockHeaven Endpoint: GET /api/blockhaven/fiat-estimate
 */
export async function getFiatEstimate(
  request: FiatEstimateRequest
): Promise<FiatEstimateResponse | null> {
  try {
    const params = new URLSearchParams();

    // Add required parameters
    params.append("from_currency", request.from_currency);
    params.append("from_amount", request.from_amount.toString());
    params.append("to_currency", request.to_currency);

    // Add optional parameters
    if (request.from_network)
      params.append("from_network", request.from_network);
    if (request.to_network) params.append("to_network", request.to_network);
    if (request.deposit_type)
      params.append("deposit_type", request.deposit_type);
    if (request.payout_type) params.append("payout_type", request.payout_type);

    const response = await fetch(
      `${BLOCKHAVEN_API_BASE}/fiat-estimate?${params.toString()}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Failed to fetch fiat estimate:", errorData);
      throw new Error("Failed to fetch fiat estimate");
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error fetching fiat estimate:", error);
    return null;
  }
}