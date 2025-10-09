import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldAlert, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { enable2FA, disable2FA, getCurrentUser, getCurrentAuthToken } from "@/lib/user-services-api";
import type { User } from "@/lib/user-services-api";

interface TwoFactorSettingsProps {
  user?: User | null;
  onUserUpdate?: (user: User) => void;
}

export function TwoFactorSettings({ user: propUser, onUserUpdate }: TwoFactorSettingsProps) {
  const [user, setUser] = useState<User | null>(propUser || getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);

  const handleToggle2FA = async (enabled: boolean) => {
    if (!user) {
      setError("User information not available");
      return;
    }

    const token = getCurrentAuthToken();
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = enabled ? await enable2FA(token) : await disable2FA(token);
      
      setSuccess(response.message);
      
      // Update local user state
      const updatedUser = { ...user, two_factor_enabled: enabled };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      
      // Trigger auth state change event
      window.dispatchEvent(new CustomEvent("auth-state-changed"));
      
      // Call parent callback if provided
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

    } catch (err) {
      let errorMessage = `Failed to ${enabled ? 'enable' : 'disable'} two-factor authentication.`;

      if (err instanceof Error) {
        if (err.message.includes("401") || err.message.includes("unauthorized")) {
          errorMessage = "Session expired. Please log in again.";
          // Handle token expiration
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          window.dispatchEvent(new CustomEvent("auth-state-changed"));
        } else if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage = "Unable to connect to server. Please check your internet connection and try again.";
        } else {
          errorMessage = err.message || errorMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Please log in to manage your two-factor authentication settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Two-Factor Authentication
          {user.two_factor_enabled ? (
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Enabled
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <ShieldAlert className="w-3 h-3 mr-1" />
              Disabled
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by enabling two-factor authentication.
          You'll receive a verification code via email each time you log in.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
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

        <div className="flex items-start justify-between p-4 border rounded-lg gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h4 className="font-medium">Email Verification</h4>
            <p className="text-sm text-muted-foreground break-words">
              Receive verification codes via email ({user.email})
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            <Switch
              checked={user.two_factor_enabled}
              onCheckedChange={handleToggle2FA}
              disabled={isLoading}
              aria-label="Toggle two-factor authentication"
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <h5 className="font-medium text-foreground">How it works:</h5>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>When enabled, you'll need to verify your identity during login</li>
            <li>A Code will be sent to your registered email address</li>
            <li>Enter the code to complete your login process</li>
            <li>Codes expire after 10 minutes for security</li>
          </ul>
        </div>

        {user.two_factor_enabled && (
          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>
              <strong>Two-factor authentication is active.</strong> Your account is now more secure. 
              You'll be asked for a verification code each time you log in.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}