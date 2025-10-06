import React, { useState } from "react";
import { Mail, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { forgotPassword } from "@/lib/user-services-api";
import type { ForgotPasswordRequest } from "@/lib/user-services-api";

interface ForgotPasswordPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

// Shared content component for both Dialog and Popover
const ForgotPasswordContent = ({
  error,
  success,
  setError,
  setSuccess,
  handleSubmit,
  email,
  setEmail,
  isLoading,
  onBackToLogin,
  onClose,
}: {
  error: string;
  success: string;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  onBackToLogin: () => void;
  onClose: () => void;
}) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBackToLogin}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>

    <div className="space-y-2 text-center mb-6">
      <h3 className="text-lg font-semibold">Forgot Password?</h3>
      <p className="text-sm text-muted-foreground">
        Enter your email address and we'll send you a link to reset your password.
      </p>
    </div>

    {/* Success/Error Messages */}
    {error && (
      <div className="mb-4 p-3 rounded-md bg-destructive/15 border border-destructive/20 relative">
        <div className="flex items-start gap-2">
          <p className="text-sm text-destructive flex-1">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-destructive hover:text-destructive hover:bg-destructive/20"
            onClick={() => setError("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )}

    {success && (
      <div className="mb-4 p-3 rounded-md bg-green-500/15 border border-green-500/20 relative">
        <div className="flex items-start gap-2">
          <p className="text-sm text-green-600 dark:text-green-400 flex-1">
            {success}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-green-600 dark:text-green-400 hover:text-green-600 hover:bg-green-500/20"
            onClick={() => setSuccess("")}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="forgot-email"
            type="email"
            placeholder="Enter your email address"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        disabled={isLoading || !email.trim()}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>

    {success && (
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the email? Check your spam folder or{" "}
          <Button
            variant="link"
            size="sm"
            className="p-0 h-auto font-normal underline"
            onClick={() => {
              setSuccess("");
              setError("");
            }}
          >
            try again
          </Button>
        </p>
      </div>
    )}
  </div>
);

export const ForgotPasswordPopover: React.FC<ForgotPasswordPopoverProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const forgotPasswordData: ForgotPasswordRequest = {
        email: email.trim(),
      };

      const response = await forgotPassword(forgotPasswordData);
      
      if (response.success) {
        setSuccess(
          response.message || 
          "Password reset link sent successfully! Please check your email."
        );
        setEmail(""); // Clear the form
      } else {
        setError(response.message || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSuccess("");
    setIsLoading(false);
    onClose();
  };

  const handleBackToLogin = () => {
    setEmail("");
    setError("");
    setSuccess("");
    setIsLoading(false);
    onBackToLogin();
  };

  const contentProps = {
    error,
    success,
    setError,
    setSuccess,
    handleSubmit,
    email,
    setEmail,
    isLoading,
    onBackToLogin: handleBackToLogin,
    onClose: handleClose,
  };

  // Use Dialog for both mobile and desktop for better compatibility
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={isMobile ? "sm:max-w-md" : "w-96 max-w-md"}>
        <DialogTitle className="sr-only">Forgot Password</DialogTitle>
        <DialogDescription className="sr-only">
          Enter your email to reset your password
        </DialogDescription>
        <ForgotPasswordContent {...contentProps} />
      </DialogContent>
    </Dialog>
  );
};