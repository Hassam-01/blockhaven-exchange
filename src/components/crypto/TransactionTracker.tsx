import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Check,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { getTransactionStatus } from "@/lib/blockhaven-exchange-api";
import { TransactionStatusResponse } from "@/const/types";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransactionTrackerProps {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
  createdAt?: string; // Optional creation date fallback
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
    case "waiting":
      return {
        icon: Clock,
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        label: "Waiting for deposit",
        description: "Send your funds to the deposit address",
      };
    case "confirming":
      return {
        icon: RefreshCw,
        color: "bg-blue-500",
        textColor: "text-blue-700",
        bgColor: "bg-blue-50",
        label: "Confirming",
        description: "Transaction is being confirmed on the blockchain",
      };
    case "exchanging":
      return {
        icon: RefreshCw,
        color: "bg-purple-500",
        textColor: "text-purple-700",
        bgColor: "bg-purple-50",
        label: "Exchanging",
        description: "Converting your funds",
      };
    case "sending":
      return {
        icon: RefreshCw,
        color: "bg-indigo-500",
        textColor: "text-indigo-700",
        bgColor: "bg-indigo-50",
        label: "Sending",
        description: "Sending funds to your address",
      };
    case "finished":
    case "completed":
      return {
        icon: CheckCircle,
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        label: "Completed",
        description: "Order completed successfully",
      };
    case "failed":
    case "refunded":
      return {
        icon: XCircle,
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        label: "Failed",
        description: "Order failed or was refunded",
      };
    default:
      return {
        icon: AlertCircle,
        color: "bg-gray-500",
        textColor: "text-gray-700",
        bgColor: "bg-gray-50",
        label: "Unknown",
        description: "Status unknown",
      };
  }
};

export function TransactionTracker({
  transactionId,
  isOpen,
  onClose,
  createdAt,
}: TransactionTrackerProps) {
  const [transaction, setTransaction] =
    useState<TransactionStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchTransactionStatus = useCallback(async () => {
    if (!transactionId) return;

    setIsLoading(true);
    try {
      const status = await getTransactionStatus(transactionId);

      if (status) {
        setTransaction(status);
        setLastUpdated(new Date());
      }
      // No toast needed - UI already shows "not found" message
    } catch (error) {
      // No toast needed - UI already shows "not found" message
    } finally {
      setIsLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    if (isOpen && transactionId) {
      fetchTransactionStatus();
    }
  }, [isOpen, transactionId, fetchTransactionStatus]);

  useEffect(() => {
    if (!isOpen || !transaction) return;

    // Auto-refresh every 30 seconds for active transactions
    const interval = setInterval(() => {
      if (
        !["finished", "completed", "failed", "refunded"].includes(
          transaction.status.toLowerCase()
        )
      ) {
        fetchTransactionStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [transaction, fetchTransactionStatus, isOpen]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      const dateFormatted = date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timeFormatted = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return `${dateFormatted} at ${timeFormatted}`;
    } catch (error) {
      return "Invalid date";
    }
  };

  const statusConfig = transaction ? getStatusConfig(transaction.status) : null;
  const StatusIcon = statusConfig?.icon || Clock;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Order Tracker
          </DialogTitle>
          <DialogDescription>
            Track your exchange order in real-time
          </DialogDescription>
        </DialogHeader>

        {isLoading && !transaction ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading order details...</span>
          </div>
        ) : transaction ? (
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${statusConfig?.color}`}>
                      <StatusIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {statusConfig?.label}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {statusConfig?.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchTransactionStatus}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Transaction ID */}
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Order ID</p>
                    <p className="text-xs text-muted-foreground break-all">
                      {transaction.id}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transaction.id, "Order ID")}
                  >
                    {copiedField === "Order ID" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Exchange Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      From
                    </p>
                    <p className="font-medium">
                      {transaction.fromCurrency.toUpperCase()}
                    </p>
                    <p className="text-sm">
                      {transaction.expectedAmountFrom || transaction.fromAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      To
                    </p>
                    <p className="font-medium">
                      {transaction.toCurrency.toUpperCase()}
                    </p>
                    <p className="text-sm">
                      {transaction.expectedAmountTo || transaction.toAmount}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Addresses */}
                {transaction.payinAddress && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Deposit Address</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <p className="text-xs break-all font-mono">
                        {transaction.payinAddress}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            transaction.payinAddress,
                            "Deposit Address"
                          )
                        }
                      >
                        {copiedField === "Deposit Address" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {transaction.payoutAddress && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payout Address</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <p className="text-xs break-all font-mono">
                        {transaction.payoutAddress}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            transaction.payoutAddress,
                            "Payout Address"
                          )
                        }
                      >
                        {copiedField === "Payout Address" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Transaction Hashes */}
                {transaction.payinHash && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Deposit Transaction Hash
                    </p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <p className="text-xs break-all font-mono">
                        {transaction.payinHash}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              transaction.payinHash,
                              "Deposit Hash"
                            )
                          }
                        >
                          {copiedField === "Deposit Hash" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {transaction.payoutHash && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Payout Transaction Hash
                    </p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <p className="text-xs break-all font-mono">
                        {transaction.payoutHash}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              transaction.payoutHash,
                              "Payout Hash"
                            )
                          }
                        >
                          {copiedField === "Payout Hash" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {transaction.payinExtraId && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Memo ID</p>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <p className="text-xs break-all font-mono">
                        {transaction.payinExtraId}
                      </p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              transaction.payinExtraId,
                              "Payout Extra ID"
                            )
                          }
                        >
                          {copiedField === "Payout Extra ID" ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {formatDate(
                        transaction.createdAt ||
                          transaction.created_at ||
                          createdAt
                      )}
                    </span>
                  </div>
                  {(transaction.updatedAt || transaction.updated_at) && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span>
                        {formatDate(
                          transaction.updatedAt || transaction.updated_at
                        )}
                      </span>
                    </div>
                  )}
                  {transaction.depositReceivedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Deposit Received:
                      </span>
                      <span>{formatDate(transaction.depositReceivedAt)}</span>
                    </div>
                  )}
                  {lastUpdated && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Last checked:
                      </span>
                      <span>{lastUpdated.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={onClose} className="px-8">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Order not found</p>
            <p className="text-sm text-muted-foreground">
              Unable to load order details. Please check the order ID and try
              again.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
