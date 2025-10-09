import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ArrowUpDown,
  Zap,
  Shield,
  ShoppingCart,
  DollarSign,
  Copy,
  Check,
  MoveLeft,
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  getAvailableCurrencies,
  getEstimatedExchangeAmount,
  getMinimalExchangeAmount,
  createExchangeTransaction,
  validateAddress,
  getTransactionStatus,
  getExchangeRange,
  getFiatEstimate,
  createFiatTransaction,
  getFiatCurrencies,
  getCryptoCurrenciesForFiat,
} from "@/lib/changenow-api-v2";
import {
  getCurrentServiceFee,
  ServiceFeeConfig,
} from "@/lib/user-services-api";
import {
  storeFixedRateData,
  getFixedRateData,
  clearFixedRateData,
  isRateDataValid,
  getTimeRemaining,
  formatTimeRemaining,
  isRateAboutToExpire,
  isRateCriticallyLow,
} from "@/lib/rate-utils";

// Enhanced interface to handle potential separate rates from backend
interface EnhancedServiceFeeConfig extends ServiceFeeConfig {
  fixedRateFee?: number;
  floatingRateFee?: number;
}
import { CurrencyInput } from "./CurrencyInput";
import { ExchangeTypeSelector } from "./ExchangeTypeSelector";
import { WalletAddressInput } from "./WalletAddressInput";
import CurrencySelector from "./CurrencySelector";
import { TransactionTracker } from "./TransactionTracker";
import { TermsPopover } from "@/components/legal/TermsPopover";
import { PrivacyPopover } from "@/components/legal/PrivacyPopover";
import { CreateTransactionResponse, CryptoCurrencyForFiat, ExchangeCurrency, FiatCurrency } from "@/const/types";

export function ExchangeWidget() {
  const [activeTab, setActiveTab] = useState<"exchange">(
    "exchange"
  );
  const [fromCurrency, setFromCurrency] = useState("btc");
  const [toCurrency, setToCurrency] = useState("eth");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");
  const [calculationType, setCalculationType] = useState<"direct" | "reverse">(
    "direct"
  );
  const [depositAddress, setDepositAddress] = useState("");
  const [refundAddress, setRefundAddress] = useState("");
  const [currentTransaction, setCurrentTransaction] =
    useState<CreateTransactionResponse | null>(null);
  const [transactionCreatedAt, setTransactionCreatedAt] = useState<string>("");
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [allCurrencies, setAllCurrencies] = useState<ExchangeCurrency[]>([]);
  const [selectedFromCurrency, setSelectedFromCurrency] =
    useState<ExchangeCurrency | null>(null);
  const [selectedToCurrency, setSelectedToCurrency] =
    useState<ExchangeCurrency | null>(null);
  const [rightColor, setRightColor] = useState(
    selectedFromCurrency?.color || ""
  );
  const [leftColor, setLeftColor] = useState(selectedToCurrency?.color || "");
  const [exchangeType, setExchangeType] = useState<"fixed" | "floating">(
    "fixed"
  );
  // Rate ID and validity for fixed-rate exchanges - used to freeze the estimated rate
  const [rateId, setRateId] = useState<string | null>(null);
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [showRateTimer, setShowRateTimer] = useState(false);
  const [serviceFeeConfig, setServiceFeeConfig] =
    useState<EnhancedServiceFeeConfig | null>(null);
  
  // Fiat-specific state variables
  const [fiatCurrencies, setFiatCurrencies] = useState<FiatCurrency[]>([]);
  const [cryptoForFiat, setCryptoForFiat] = useState<CryptoCurrencyForFiat[]>([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState("USD");
  
  // Transaction tracking state
  const [showTransactionTracker, setShowTransactionTracker] = useState(false);
  const [trackingTransactionId, setTrackingTransactionId] = useState<string>("");
  
  // Currency selector popover states
  const [fromCurrencyPopoverOpen, setFromCurrencyPopoverOpen] = useState(false);
  const [toCurrencyPopoverOpen, setToCurrencyPopoverOpen] = useState(false);
  
  const { toast } = useToast();

  // Memoize filtered currencies for better performance - now shows ALL available currencies
  const filteredCurrencies = useMemo(() => {
    return allCurrencies
      .filter((c) => !c.isFiat) // Only exclude fiat currencies
      .filter((c) => 
        c.network !== null && 
        c.network !== undefined && 
        c.network.trim() !== ''
      ) // Exclude currencies with null/undefined network
      .sort((a, b) => {
        // Sort by featured first, then alphabetically
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [allCurrencies]);

  // Exchange type charges - dynamically generated from backend data
  const exchangeCharges = useMemo(() => {
    const fixedRate = serviceFeeConfig?.fixedRateFee;

    const floatingRate = serviceFeeConfig?.floatingRateFee;
    return {
      fixed: {
        rate: fixedRate,
        description: "Fixed rate - guaranteed for 15 minutes",
      },
      floating: {
        rate: floatingRate,
        description: "Floating rate - best market price",
      },
    };
  }, [serviceFeeConfig]);

  // Fetch service fee configuration on component mount
  useEffect(() => {
    const fetchServiceFeeConfig = async () => {
      try {
        const config = await getCurrentServiceFee();
        setServiceFeeConfig(config as EnhancedServiceFeeConfig);
      } catch (error) {
        console.log("Error Fetching Exchange Rate! ");
      }
    };

    fetchServiceFeeConfig();
  }, []);

  // Clear rateId when exchange type or currencies change
  useEffect(() => {
    setRateId(null);
    setValidUntil(null);
    setShowRateTimer(false);
    clearFixedRateData();
  }, [exchangeType, fromCurrency, toCurrency]);

  // Countdown timer for fixed-rate validity
  useEffect(() => {
    if (!validUntil || !showRateTimer) {
      setTimeRemaining("");
      return;
    }

    const updateTimer = () => {
      const timeData = getTimeRemaining(validUntil);
      
      if (timeData.isExpired) {
        setTimeRemaining("Rate expired");
        setShowRateTimer(false);
        setRateId(null);
        setValidUntil(null);
        clearFixedRateData();
        
        toast({
          title: "Rate Expired",
          description: "The fixed rate has expired. Please get a new estimate.",
          variant: "destructive",
        });
        return;
      }
      
      setTimeRemaining(timeData.formatted);
    };

    // Update immediately
    updateTimer();
    
    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [validUntil, showRateTimer, toast]);

  // Fetch all currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currencies = await getAvailableCurrencies({
          active: true,
          flow: "standard",
          buy: true,
          sell: true,
        });

        if (currencies) {
          setAllCurrencies(currencies);

          // Set initial selected currencies
          const btc = currencies.find((c) => c.ticker === "btc");
          const eth = currencies.find((c) => c.ticker === "eth");
          if (btc) {
            setSelectedFromCurrency(btc);
            setRightColor(btc.color || "");
          }

          if (eth) {
            setSelectedToCurrency(eth);
            setLeftColor(eth.color || "");
          }
        } else {
          throw new Error("No currencies returned from API");
        }
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
        toast({
          title: "Error",
          description: "Failed to load available currencies",
          variant: "destructive",
        });
      }
    };

    fetchCurrencies();
  }, [toast]);

  // Fetch fiat currencies and crypto currencies for fiat
  useEffect(() => {
    const fetchFiatData = async () => {
      try {
        const [fiatCurrs, cryptoCurrs] = await Promise.all([
          getFiatCurrencies(),
          getCryptoCurrenciesForFiat()
        ]);

        if (fiatCurrs) {
          setFiatCurrencies(fiatCurrs);
        }

        if (cryptoCurrs) {
          setCryptoForFiat(cryptoCurrs);
        }
      } catch (error) {
        console.error("Failed to fetch fiat currencies:", error);
      }
    };

    fetchFiatData();
  }, []);

  // Update selected currency when fromCurrency changes
  useEffect(() => {
    const currency = allCurrencies.find((c) => c.ticker === fromCurrency);
    setSelectedFromCurrency(currency || null);
    setRightColor(currency?.color || "");
  }, [fromCurrency, allCurrencies]);

  // Update selected currency when toCurrency changes
  useEffect(() => {
    const currency = allCurrencies.find((c) => c.ticker === toCurrency);
    setSelectedToCurrency(currency || null);
    setLeftColor(currency?.color || "");
  }, [toCurrency, allCurrencies]);

  // Close currency selector popovers when page scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (fromCurrencyPopoverOpen) {
        setFromCurrencyPopoverOpen(false);
      }
      if (toCurrencyPopoverOpen) {
        setToCurrencyPopoverOpen(false);
      }
    };

    // Add scroll event listener to window
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fromCurrencyPopoverOpen, toCurrencyPopoverOpen]);

  // Check for stored fixed rate data on component mount and when currencies change
  useEffect(() => {
    if (exchangeType === "fixed" && fromAmount && toAmount) {
      const storedData = getFixedRateData();
      
      if (storedData && isRateDataValid(fromCurrency, toCurrency, fromAmount, toAmount)) {
        setRateId(storedData.rateId);
        setValidUntil(storedData.validUntil);
        setShowRateTimer(true);
      }
    }
  }, [exchangeType, fromCurrency, toCurrency, fromAmount, toAmount]);

  // Fiat estimation function
  const performFiatEstimate = useCallback(async (
    fiatCurrency: string,
    cryptoCurrency: string,
    amount: number,
    isBuy: boolean
  ) => {
    try {
      const estimate = await getFiatEstimate({
        from_currency: isBuy ? fiatCurrency : cryptoCurrency,
        to_currency: isBuy ? cryptoCurrency : fiatCurrency,
        from_amount: amount,
        deposit_type: "SEPA_1", // Default deposit type
        payout_type: isBuy ? "CRYPTO_THROUGH_CN" : "SEPA_1"
      });

      return estimate;
    } catch (error) {
      console.error("Error estimating fiat amount:", error);
      return null;
    }
  }, []);

  // Minimum and Maximum amounts
  useEffect(() => {
    const fetchAmountLimits = async () => {
      if (fromCurrency && toCurrency) {
        try {
          // const minResult = await getMinimalExchangeAmount(fromCurrency, toCurrency, {
          //   flow: exchangeType === 'fixed' ? 'fixed-rate' : 'standard'
          // });
          const range = await getExchangeRange(fromCurrency, toCurrency, {
            flow: exchangeType === "fixed" ? "fixed-rate" : "standard",
          });
          if (range) {
            setMinAmount(range.minAmount.toString());
          }
          if (range.maxAmount) {
            setMaxAmount(range.maxAmount.toString());
          }
        } catch (error) {
          console.error("Error fetching amount limits:", error);
        }
      }
    };

    fetchAmountLimits();
  }, [fromCurrency, toCurrency, exchangeType]);

  // Estimate amounts based on calculation type
  useEffect(() => {
    const performEstimate = async () => {
      if (!fromCurrency || !toCurrency) return;

      const amount =
        calculationType === "direct"
          ? parseFloat(fromAmount)
          : parseFloat(toAmount);

      if (!amount || amount <= 0) {
        if (calculationType === "direct") {
          setToAmount("");
        } else {
          setFromAmount("");
        }
        return;
      }

      setIsLoading(true);
      try {
        // Regular crypto-to-crypto exchange
        const result = await getEstimatedExchangeAmount(
          fromCurrency,
          toCurrency,
          {
            [calculationType === "direct" ? "fromAmount" : "toAmount"]: amount,
            flow: exchangeType === "fixed" ? "fixed-rate" : "standard",
            type: calculationType,
            fromNetwork: selectedFromCurrency?.network || undefined,
            toNetwork: selectedToCurrency?.network || undefined,
          }
          );

          // Store rateId and validUntil for fixed-rate exchanges
          if (exchangeType === "fixed" && result.rateId) {
            setRateId(result.rateId);
            setValidUntil(result.validUntil || null);
            setShowRateTimer(true);
            
            // Store in localStorage
            if (result.validUntil) {
              storeFixedRateData({
                rateId: result.rateId,
                validUntil: result.validUntil,
                fromCurrency,
                toCurrency,
                fromAmount: calculationType === "direct" ? amount.toString() : result.fromAmount?.toString() || "",
                toAmount: calculationType === "reverse" ? amount.toString() : result.toAmount?.toString() || "",
              });
            }
          } else {
            setRateId(null);
            setValidUntil(null);
            setShowRateTimer(false);
            clearFixedRateData();
          }

          if (calculationType === "direct") {
            setToAmount(result.toAmount?.toString() ?? "");
          } else {
            setFromAmount(result.fromAmount?.toString() ?? "");
          }
      } catch (err) {
        console.error("Error estimating amount:", err);
        toast({
          title: "Error Estimating",
          description: err instanceof Error ? err.message : "Unknown error",
        });
        if (calculationType === "direct") {
          setToAmount("");
        } else {
          setFromAmount("");
        }
      } finally {
        setIsLoading(false);
      }
    };

    performEstimate();
  }, [
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    calculationType,
    exchangeType,
    activeTab,
    selectedFiatCurrency,
    performFiatEstimate,
    toast,
    selectedFromCurrency?.network,
    selectedToCurrency?.network,
  ]);

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (calculationType === "direct") {
      setFromAmount(toAmount);
      setToAmount("");
    } else {
      setToAmount(fromAmount);
      setFromAmount("");
    }
  }, [fromCurrency, toCurrency, fromAmount, toAmount, calculationType]);

  const handleFromCurrencyChange = useCallback(
    (value: string) => {
      if (toCurrency === value) {
        setToCurrency(fromCurrency);
      }
      setFromCurrency(value);
    },
    [fromCurrency, toCurrency]
  );

  const handleToCurrencyChange = useCallback(
    (value: string) => {
      if (fromCurrency === value) {
        setFromCurrency(toCurrency);
      }
      setToCurrency(value);
    },
    [fromCurrency, toCurrency]
  );

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const validateWalletAddresses = async () => {
    if (!depositAddress.trim()) {
      toast({
        title: "Missing Deposit Address",
        description: "Please enter your deposit wallet address.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Validate deposit address
      const depositValidation = await validateAddress(
        toCurrency,
        depositAddress
      );
      if (!depositValidation?.result) {
        toast({
          title: "Invalid Deposit Address",
          description:
            depositValidation?.message ||
            `Please enter a valid ${toCurrency.toUpperCase()} wallet address.`,
          variant: "destructive",
        });
        return false;
      }

      // Validate refund address only if provided
      if (refundAddress.trim()) {
        const refundValidation = await validateAddress(
          fromCurrency,
          refundAddress
        );
        if (!refundValidation?.result) {
          toast({
            title: "Invalid Refund Address",
            description:
              refundValidation?.message ||
              `Please enter a valid ${fromCurrency.toUpperCase()} wallet address.`,
            variant: "destructive",
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Unable to validate wallet addresses. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleTransaction = async (type: "exchange" | "buy" | "sell") => {
    if (!fromAmount || !toAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter an amount to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (type === "exchange") {
      // Validate wallet addresses for exchange
      const isValid = await validateWalletAddresses();
      if (!isValid) return;

      // Check if fixed rate has expired and get a new rate if needed
      let currentRateId = rateId;
      if (exchangeType === "fixed") {
        if (!validUntil || getTimeRemaining(validUntil).isExpired) {
          toast({
            title: "Rate Expired",
            description: "Getting a new fixed rate...",
          });

          try {
            const amount = calculationType === "direct" ? parseFloat(fromAmount) : parseFloat(toAmount);
            const newRateResult = await getEstimatedExchangeAmount(
              fromCurrency,
              toCurrency,
              {
                [calculationType === "direct" ? "fromAmount" : "toAmount"]: amount,
                flow: "fixed-rate",
                type: calculationType,
              }
            );

            if (newRateResult.rateId && newRateResult.validUntil) {
              currentRateId = newRateResult.rateId;
              setRateId(newRateResult.rateId);
              setValidUntil(newRateResult.validUntil);
              setShowRateTimer(true);

              // Store the new rate data
              storeFixedRateData({
                rateId: newRateResult.rateId,
                validUntil: newRateResult.validUntil,
                fromCurrency,
                toCurrency,
                fromAmount: calculationType === "direct" ? amount.toString() : newRateResult.fromAmount?.toString() || "",
                toAmount: calculationType === "reverse" ? amount.toString() : newRateResult.toAmount?.toString() || "",
              });

              // Update amounts if they changed with the new rate
              if (calculationType === "direct" && newRateResult.toAmount) {
                setToAmount(newRateResult.toAmount.toString());
              } else if (calculationType === "reverse" && newRateResult.fromAmount) {
                setFromAmount(newRateResult.fromAmount.toString());
              }

              toast({
                title: "New Rate Obtained",
                description: "Fixed rate has been refreshed and locked for 15 minutes.",
              });
            } else {
              throw new Error("Failed to get new fixed rate");
            }
          } catch (error) {
            console.error("Error getting new fixed rate:", error);
            toast({
              title: "Rate Refresh Failed",
              description: "Could not get a new fixed rate. Please try again or use floating rate.",
              variant: "destructive",
            });
            return;
          }
        }
      }

      // Create the exchange transaction
      setIsCreatingTransaction(true);
      try {
        const transaction = await createExchangeTransaction({
          fromCurrency,
          toCurrency,
          fromNetwork: selectedFromCurrency?.network || fromCurrency,
          toNetwork: selectedToCurrency?.network || toCurrency,
          fromAmount: calculationType === "direct" ? fromAmount : undefined,
          toAmount: calculationType === "reverse" ? toAmount : undefined,
          address: depositAddress,
          refundAddress: refundAddress.trim() || undefined,
          flow: exchangeType === "fixed" ? "fixed-rate" : "standard",
          type: calculationType,
          // Include rateId for fixed-rate to freeze the estimated rate
          ...(exchangeType === "fixed" && currentRateId && { rateId: currentRateId }),
        });

        if (transaction) {
          console.log('🆕 Transaction created - complete response:', transaction);
          console.log('🆕 Transaction createdAt field:', transaction.createdAt);
          console.log('🆕 Transaction keys:', Object.keys(transaction));
          
          setCurrentTransaction(transaction);
          const now = new Date();
          const formattedDate = now.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          });
          console.log('📅 Formatted date being stored:', formattedDate);
          setTransactionCreatedAt(formattedDate);
          setShowTransactionDialog(true);
          toast({
            title: "Exchange Created",
            description:
              "Your exchange order has been created successfully.",
          });
        } else {
          // throw new Error("Failed to create transaction");
        }
      } catch (error) {
        console.error("Transaction creation error:",  );
        toast({
          title: "Order Failed",
          description:
            "Failed to create exchange order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCreatingTransaction(false);
      }
    } else if (type === "buy" || type === "sell") {
      // Validate customer information for fiat transactions
      if (!customerEmail.trim()) {
        toast({
          title: "Missing Email",
          description: "Please provide your email address for fiat transactions.",
          variant: "destructive",
        });
        return;
      }

      // Validate wallet address for crypto payout (buy) or crypto input (sell)
      const cryptoAddress = type === "buy" ? depositAddress : depositAddress;
      const cryptoCurrency = type === "buy" ? toCurrency : fromCurrency;
      
      if (!cryptoAddress.trim()) {
        toast({
          title: "Missing Wallet Address",
          description: `Please provide your ${cryptoCurrency.toUpperCase()} wallet address.`,
          variant: "destructive",
        });
        return;
      }

      // Validate the crypto wallet address
      try {
        const addressValidation = await validateAddress(cryptoCurrency, cryptoAddress);
        if (!addressValidation?.result) {
          toast({
            title: "Invalid Wallet Address",
            description: `Please enter a valid ${cryptoCurrency.toUpperCase()} wallet address.`,
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        toast({
          title: "Validation Error",
          description: "Unable to validate wallet address. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create fiat transaction
      setIsCreatingTransaction(true);
      try {
        const fiatTransaction = await createFiatTransaction({
          from_amount: parseFloat(fromAmount),
          from_currency: type === "buy" ? selectedFiatCurrency : fromCurrency,
          to_currency: type === "buy" ? toCurrency : selectedFiatCurrency,
          from_network: type === "buy" ? null : selectedFromCurrency?.network || null,
          to_network: type === "buy" ? selectedToCurrency?.network || toCurrency : null,
          payout_address: cryptoAddress,
          deposit_type: "SEPA_1", // Default deposit type
          payout_type: type === "buy" ? "CRYPTO_THROUGH_CN" : "SEPA_1",
          external_partner_link_id: "",
          customer: {
            contact_info: {
              email: customerEmail,
              phone_number: customerPhone.trim() || undefined,
            },
          },
        });

        if (fiatTransaction) {
          // For fiat transactions, we can show the redirect URL or transaction details
          toast({
            title: `${type === "buy" ? "Buy" : "Sell"} Order Created`,
            description: `Your ${type} order has been created successfully. Order ID: ${fiatTransaction.id}`,
          });

          // If there's a redirect URL, you might want to open it
          if (fiatTransaction.redirect_url) {
            window.open(fiatTransaction.redirect_url, '_blank');
          }
        } else {
          throw new Error("Failed to create fiat transaction");
        }
      } catch (error) {
        console.error("Fiat transaction creation error:", error);
        toast({
          title: `${type === "buy" ? "Buy" : "Sell"} Order Failed`,
          description: `Failed to create ${type} order. Please try again.`,
          variant: "destructive",
        });
      } finally {
        setIsCreatingTransaction(false);
      }
    }
  };

  return (
    <Card
      className="w-full max-w-4xl mx-auto dark:bg-card bg-gray-200 backdrop-blur-sm border-border shadow-card
                     flex flex-col"
      style={{ minHeight: "350px" }}
    >
      <CardContent className="flex-1 flex flex-col pt-4">
        {/* Tabs with active background */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "exchange")}
          className="w-full flex flex-col flex-1"
        >
          <TabsList className="grid w-full grid-cols-1 relative bg-muted p-1 rounded-lg">
            <TabsTrigger
              value="exchange"
              className="flex items-center gap-2 relative z-10 transition-all duration-200"
            >
              <ArrowUpDown className="w-4 h-4" />
              Exchange
            </TabsTrigger>

            {/* Active tab background */}
            <div
              className="absolute top-1 bottom-1 bg-background shadow-sm rounded-md transition-all duration-500"
              style={{
                width: `calc(100% - 0.5rem)`,
                left: "0.25rem",
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
                    onChange={(value) => {
                      setFromAmount(value);
                      setCalculationType("direct");
                    }}
                    selectedCurrency={selectedFromCurrency}
                    placeholder="0.00"
                  />
                  <CurrencySelector
                    value={fromCurrency}
                    onValueChange={handleFromCurrencyChange}
                    currencies={filteredCurrencies}
                    selectedCurrency={selectedFromCurrency}
                    open={fromCurrencyPopoverOpen}
                    onOpenChange={setFromCurrencyPopoverOpen}
                  />
                  {fromAmount && selectedFromCurrency && (
                    <div className="text-xs text-muted-foreground">
                      1 {selectedFromCurrency.ticker.toUpperCase()} ≈{" "}
                      {toAmount
                        ? (
                            parseFloat(toAmount) / parseFloat(fromAmount)
                          ).toFixed(6)
                        : "0.000000"}{" "}
                      {selectedToCurrency?.ticker.toUpperCase() || ""}
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {minAmount && (
                      <span>
                        Min: {minAmount} {fromCurrency.toUpperCase()}
                      </span>
                    )}
                    {maxAmount && (
                      <span>
                        Max: {maxAmount} {fromCurrency.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center">
                {/* <Button
                  variant="outline"
                  size="sm"
                  // className="rounded-full p-2"
                > */}
                <div
                  className="flex flex-col items-center rotate-90 md:rotate-0"
                  onClick={handleSwapCurrencies}
                >
                  <MoveRight
                    className="md:w-7 md:h-7 w-5 h-5 md:-mb-4 -mb-2 md:ml-2 ml-2 "
                    style={{
                      color: rightColor || "",
                    }}
                  />
                  <MoveLeft
                    className="md:w-7 md:h-7 w-5 h-5  md:mr-4 "
                    style={{
                      color: leftColor || "",
                    }}
                  />
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
                    value={isLoading ? "Calculating..." : toAmount}
                    onChange={(value) => {
                      setToAmount(value);
                      setCalculationType("reverse");
                    }}
                    selectedCurrency={selectedToCurrency}
                    placeholder="0.00"
                    readOnly={false}
                  />
                  <CurrencySelector
                    value={toCurrency}
                    onValueChange={handleToCurrencyChange}
                    currencies={filteredCurrencies}
                    selectedCurrency={selectedToCurrency}
                    open={toCurrencyPopoverOpen}
                    onOpenChange={setToCurrencyPopoverOpen}
                  />
                  {toAmount && selectedToCurrency && (
                    <div className="text-xs text-muted-foreground">
                      1 {selectedToCurrency.ticker.toUpperCase()} ≈{" "}
                      {fromAmount
                        ? (
                            parseFloat(fromAmount) / parseFloat(toAmount)
                          ).toFixed(6)
                        : "0.000000"}{" "}
                      {selectedFromCurrency?.ticker.toUpperCase() || ""}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section - Destination and Exchange Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {/* Destination Address */}
              <WalletAddressInput
                label={`Destination (${
                  selectedToCurrency?.ticker.toUpperCase() || "crypto"
                })`}
                placeholder={`Your ${
                  selectedToCurrency?.ticker.toUpperCase() || "crypto"
                } address`}
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
                label={`Refund Address (${
                  selectedFromCurrency?.ticker.toUpperCase() || "crypto"
                }) - Optional`}
                placeholder={`Your ${
                  selectedFromCurrency?.ticker.toUpperCase() || "crypto"
                } address for refunds`}
                value={refundAddress}
                onChange={setRefundAddress}
                onCopy={() => handleCopyAddress(refundAddress)}
                icon="shield"
                required={false}
              />
            </div>
            <div className="mt-4 flex flex-col-reverse md:flex-row justify-between ">
              <span className="text-xs mt-1 md:mt-0 md:text-sm text-muted-foreground text-orange-500">
                <span className="text-center md:text-left block">
                  By clicking Exchange now, you agree to the
                  <span className="block md:inline">
                    {" "}
                    <TermsPopover>
                      <span className="font-bold text-primary underline cursor-pointer">
                        Terms & Conditions
                      </span>
                    </TermsPopover>{" "}
                    and{" "}
                    <PrivacyPopover>
                      <span className="font-bold text-primary underline cursor-pointer">
                        Privacy Policy
                      </span>
                    </PrivacyPopover>
                  </span>
                </span>
              </span>
              
              {/* Fixed Rate Timer */}
              {showRateTimer && exchangeType === "fixed" && timeRemaining && (
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                    timeRemaining.includes('expired') 
                      ? 'bg-red-100 dark:bg-red-900/20' 
                      : timeRemaining.startsWith('0:') && !timeRemaining.startsWith('0:0')
                        ? 'bg-orange-100 dark:bg-orange-900/20'
                        : timeRemaining.startsWith('0:0')
                          ? 'bg-red-100 dark:bg-red-900/20'
                          : 'bg-green-100 dark:bg-green-900/20'
                  }`}>
                    <Zap className={`h-3 w-3 ${
                      timeRemaining.includes('expired')
                        ? 'text-red-600 dark:text-red-400'
                        : timeRemaining.startsWith('0:') && !timeRemaining.startsWith('0:0')
                          ? 'text-orange-600 dark:text-orange-400'
                          : timeRemaining.startsWith('0:0')
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                    }`} />
                    <span className={`text-xs font-medium ${
                      timeRemaining.includes('expired')
                        ? 'text-red-600 dark:text-red-400'
                        : timeRemaining.startsWith('0:') && !timeRemaining.startsWith('0:0')
                          ? 'text-orange-600 dark:text-orange-400'
                          : timeRemaining.startsWith('0:0')
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                    }`}>
                      {timeRemaining.includes('expired') ? 'Rate expired' : `Rate locked: ${timeRemaining}`}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Exchange Button */}
              <Button
                variant="crypto"
                size="lg"
                onClick={() => handleTransaction("exchange")}
                disabled={
                  !fromAmount ||
                  !toAmount ||
                  isLoading ||
                  isCreatingTransaction ||
                  !depositAddress.trim()
                }
                className={`px-8 ${
                  exchangeType === "fixed" && validUntil && isRateCriticallyLow(validUntil)
                    ? "animate-pulse"
                    : ""
                }`}
              >
                Exchange Now
              </Button>
            </div>
          </TabsContent>

        </Tabs>

        <p className="text-xs text-center text-muted-foreground mt-6">
          No registration required • Competitive rates
        </p>
      </CardContent>

      {/* Transaction Confirmation Dialog */}
      <Dialog
        open={showTransactionDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Exchange Created Successfully
            </DialogTitle>
            <DialogDescription>
              Your exchange order has been created. Please send your{" "}
              {fromCurrency.toUpperCase()} to the address below.
            </DialogDescription>
          </DialogHeader>

          {currentTransaction && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div><strong>Order ID:</strong> {currentTransaction.id}</div>
                    <div><strong>Created:</strong> {transactionCreatedAt}</div>
                  </div>
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
                      onClick={() =>
                        handleCopyAddress(currentTransaction.payinAddress)
                      }
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
                  <strong>Important:</strong> Only send{" "}
                  {fromCurrency.toUpperCase()} to the address above. Sending
                  other cryptocurrencies will result in permanent loss.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowTransactionDialog(false);
                    setTransactionCreatedAt("");
                  }}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (currentTransaction?.id) {
                      setTrackingTransactionId(currentTransaction.id);
                      setShowTransactionTracker(true);
                      setShowTransactionDialog(false);
                      setTransactionCreatedAt("");
                    }
                  }}
                >
                  Track Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction Tracker */}
      <TransactionTracker
        transactionId={trackingTransactionId}
        isOpen={showTransactionTracker}
        onClose={() => setShowTransactionTracker(false)}
        createdAt={transactionCreatedAt}
      />
    </Card>
  );
}