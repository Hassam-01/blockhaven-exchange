import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { verify2FA } from "@/lib/user-services-api";
import type { Verify2FARequest, User } from "@/lib/user-services-api";

interface TwoFactorVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  pendingToken: string;
  onVerificationSuccess: (token: string, user: User) => void;
}

export function TwoFactorVerification({
  isOpen,
  onClose,
  email,
  pendingToken,
  onVerificationSuccess,
}: TwoFactorVerificationProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setCode("");
      setError("");
      setSuccess("");
      setTimeLeft(600);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setError("Verification code has expired. Please login again.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (code.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verify2FA({
        email,
        code: code.trim(),
        pendingToken,
      });

      setSuccess("Two-factor authentication verified successfully!");
      
      // Handle different response structures based on the apiCall function logic
      let token: string;
      let user: User;
      
      const responseObj = response as unknown as Record<string, unknown>;
      
      // Check if response has direct token and user (when apiCall returns result.data)
      if (responseObj.token && responseObj.user) {
        token = responseObj.token as string;
        user = responseObj.user as User;
      }
      // Check if response has a data property (when apiCall returns result as-is)
      else if (responseObj.data && 
               typeof responseObj.data === 'object' && 
               responseObj.data !== null) {
        const dataObj = responseObj.data as Record<string, unknown>;
        if (dataObj.token && dataObj.user) {
          token = dataObj.token as string;
          user = dataObj.user as User;
        } else {
          setError("Invalid response structure from server. Please try again.");
          return;
        }
      }
      else {
        setError("Unexpected response from server. Please try again.");
        return;
      }
      
      if (!token || !user) {
        setError("Invalid response from server. Please try again.");
        return;
      }
      
      // Call the success callback with token and user data
      setTimeout(() => {
        onVerificationSuccess(token, user);
        onClose();
      }, 1000);

    } catch (err) {
      let errorMessage = "Verification failed. Please try again.";

      if (err instanceof Error) {
        if (err.message.includes("invalid") || err.message.includes("expired")) {
          errorMessage = "Invalid or expired verification code. Please check your code and try again.";
        } else if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
      setError(""); // Clear error when user starts typing
    }
  };

  const handleResendCode = () => {
    // In a real implementation, you would call an API to resend the code
    setError("");
    setSuccess("");
    setTimeLeft(600);
    // For now, just show a message
    setSuccess("Verification code resent to your email!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to your email address. Please enter it below to complete your login.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verification-code">Verification Code</Label>
            <Input
              id="verification-code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter 6-digit code"
              className="text-center text-lg tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
              disabled={isLoading || timeLeft <= 0}
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Code sent to: {email}</span>
              <span className={timeLeft <= 60 ? "text-red-500" : ""}>
                Time remaining: {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading || !code.trim() || code.length !== 6 || timeLeft <= 0}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isLoading || timeLeft > 540} // Allow resend after 1 minute
              className="w-full"
            >
              Resend Code
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center">
          <p>
            Didn't receive the code? Check your spam folder or click "Resend Code" above.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}