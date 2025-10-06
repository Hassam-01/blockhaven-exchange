import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPassword } from "@/lib/user-services-api";
import type { ResetPasswordRequest } from "@/lib/user-services-api";

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  // Password validation
  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)");
    }
    
    return errors;
  };

  useEffect(() => {
    if (password) {
      const errors = validatePassword(password);
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (validationErrors.length > 0) {
      setError("Please fix the password validation errors before continuing");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const resetPasswordData: ResetPasswordRequest = {
        token,
        newPassword: password,
      };

      const response = await resetPassword(resetPasswordData);
      
      if (response.success) {
        setSuccess(
          response.message || 
          "Password reset successfully! You can now sign in with your new password."
        );
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      } else {
        setError(response.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to reset password. Please try again or request a new reset link."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Password Reset Successful!
            </CardTitle>
            <CardDescription>
              {success}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting you to the homepage in a few seconds...
              </p>
              <Button
                onClick={() => navigate("/", { replace: true })}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="h-16 w-16 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-destructive">Invalid Reset Link</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>
              <Button
                onClick={() => navigate("/", { replace: true })}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Go to Homepage
              </Button>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-md bg-destructive/15 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password validation errors */}
                  {validationErrors.length > 0 && (
                    <div className="text-xs space-y-1">
                      {validationErrors.map((error, index) => (
                        <p key={index} className="text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <p className={`text-xs flex items-center gap-1 ${
                      password === confirmPassword 
                        ? "text-green-600" 
                        : "text-destructive"
                    }`}>
                      {password === confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Passwords match
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          Passwords do not match
                        </>
                      )}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading || validationErrors.length > 0 || password !== confirmPassword}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => navigate("/", { replace: true })}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back to Homepage
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};