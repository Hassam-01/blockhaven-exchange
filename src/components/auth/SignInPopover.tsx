import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User as UserIcon,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { userSignup, userLogin } from "@/lib/user-services-api";
import type { SignupRequest, LoginRequest, LoginResponse, User } from "@/lib/user-services-api";
import { ForgotPasswordPopover } from "./ForgotPasswordPopover";
import { TwoFactorVerification } from "./TwoFactorVerification";

interface SignInPopoverProps {
  children: React.ReactNode;
}

// Shared content component for both Dialog and Popover
const AuthContent = ({
  error,
  success,
  setError,
  setSuccess,
  handleTabChange,
  handleLogin,
  handleSignup,
  loginData,
  setLoginData,
  signupData,
  setSignupData,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  onForgotPassword,
}: {
  error: string;
  success: string;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  handleTabChange: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleSignup: (e: React.FormEvent) => void;
  loginData: LoginRequest;
  setLoginData: (data: LoginRequest) => void;
  signupData: SignupRequest;
  setSignupData: (data: SignupRequest) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  isLoading: boolean;
  onForgotPassword: () => void;
}) => (
  <div className="p-6">
    <Tabs
      defaultValue="login"
      className="w-full"
      onValueChange={handleTabChange}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </TabsTrigger>
        <TabsTrigger value="register" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Register
        </TabsTrigger>
      </TabsList>

      {/* Success/Error Messages */}
      {error && (
        <div className="mt-4 p-3 rounded-md bg-destructive/15 border border-destructive/20 relative">
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
        <div className="mt-4 p-3 rounded-md bg-green-500/15 border border-green-500/20 relative">
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

      {/* Login Tab */}
      <TabsContent value="login" className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">Welcome back!</h3>
          <p className="text-sm text-muted-foreground">
            Sign in to your BlockHaven account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={onForgotPassword}
              className="text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              Forgot your password?
            </Button>
          </div>
        </form>
      </TabsContent>

      {/* Register Tab */}
      <TabsContent value="register" className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">Create Account</h3>
          <p className="text-sm text-muted-foreground">
            Join BlockHaven and start exchanging crypto
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="signup-firstname">First Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-firstname"
                  type="text"
                  placeholder="First name"
                  className="pl-10"
                  value={signupData.first_name}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      first_name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-lastname">Last Name</Label>
              <Input
                id="signup-lastname"
                type="text"
                placeholder="Last name"
                value={signupData.last_name}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    last_name: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-10 pr-10"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    password: e.target.value,
                  })
                }
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>

    <div className="mt-6 pt-4 border-t border-border">
      <p className="text-xs text-muted-foreground text-center">
        By signing up, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </div>
  </div>
);

export function SignInPopover({ children }: SignInPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // 2FA state
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingToken, setPendingToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  const isMobile = useIsMobile();

  // Login form state
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState<SignupRequest>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    user_type: "admin",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); // Clear error after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-dismiss success messages after 3 seconds (shorter since they're positive feedback)
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000); // Clear success after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [success]);

  // Clear messages when popover closes
  useEffect(() => {
    if (!isOpen) {
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  // Clear messages when switching tabs
  const handleTabChange = (value: string) => {
    setError("");
    setSuccess("");
  };

  const resetForms = (resetForgotPassword = true) => {
    setLoginData({ email: "", password: "" });
    setSignupData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      user_type: "customer",
    });
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (resetForgotPassword) {
      setShowForgotPassword(false);
    }
  };

  const handleForgotPassword = () => {
    setIsOpen(false);
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setIsOpen(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const handleTwoFactorSuccess = (token: string, user: User) => {
    // Store token and user data
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));
    
    // Clear 2FA state first
    setPendingToken("");
    setUserEmail("");
    
    // Close all dialogs
    setShowTwoFactor(false);
    setIsOpen(false);
    resetForms();
    
    // Trigger auth state change event with a small delay to ensure localStorage is updated
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("auth-state-changed"));
      // Also dispatch a storage event to trigger the Header's storage listener
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'auth_token',
        newValue: token,
        url: window.location.href
      }));
    }, 100);
  };

  const handleTwoFactorClose = () => {
    setShowTwoFactor(false);
    setPendingToken("");
    setUserEmail("");
    setIsOpen(true); // Return to login
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await userLogin(loginData);
      
      // Check if 2FA is required
      if (response.requiresTwoFactor && response.pendingToken) {
        // Close the login popover and show 2FA verification
        setIsOpen(false);
        setPendingToken(response.pendingToken);
        setUserEmail(loginData.email);
        setShowTwoFactor(true);
        setSuccess("Please check your email for the verification code.");
      } else if (response.data || (response.user && response.token)) {
        // Regular login without 2FA
        setSuccess("Login successful!");

        // Handle both response formats: response.data or direct response
        const userData = response.data ? response.data.user : response.user;
        const token = response.data ? response.data.token : response.token;

        // Store token in localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_data", JSON.stringify(userData));

        // Close popover after successful login
        setTimeout(() => {
          setIsOpen(false);
          resetForms();
          // Trigger a custom event to update the header state
          window.dispatchEvent(new CustomEvent("auth-state-changed"));
        }, 1000);
      } else {
        console.log("response: ", response)
        throw new Error("Invalid response format");
      }
    } catch (err) {
      // Provide more user-friendly error messages
      let errorMessage = "Login failed. Please try again.";

      if (err instanceof Error) {
        if (
          err.message.includes("401") ||
          err.message.includes("unauthorized") ||
          err.message.includes("invalid credentials")
        ) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          errorMessage =
            "Unable to connect to server. Please check your internet connection and try again.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (signupData.password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await userSignup(signupData);
      setSuccess("Account created successfully! You are now logged in.");

      // Store token in localStorage
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.user));

      // Close popover after successful signup
      setTimeout(() => {
        setIsOpen(false);
        resetForms();
        // Trigger a custom event to update the header state
        window.dispatchEvent(new CustomEvent("auth-state-changed"));
      }, 1000);
    } catch (err) {
      // Provide more user-friendly error messages
      let errorMessage = "Registration failed. Please try again.";

      if (err instanceof Error) {
        if (
          err.message.includes("409") ||
          err.message.includes("already exists") ||
          err.message.includes("duplicate")
        ) {
          errorMessage =
            "An account with this email already exists. Please use a different email or try logging in.";
        } else if (
          err.message.includes("400") ||
          err.message.includes("validation")
        ) {
          errorMessage =
            "Please check your information and try again. Make sure all fields are filled correctly.";
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          errorMessage =
            "Unable to connect to server. Please check your internet connection and try again.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Create mobile dialog component
  const mobileDialog = (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent 
        className="w-[90vw] max-w-md max-h-[85vh] overflow-y-auto p-0 !top-[35%]"
        onInteractOutside={() => resetForms(false)}
      >
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in to your existing account or create a new account to access BlockHaven services
        </DialogDescription>
        <AuthContent
          error={error}
          success={success}
          setError={setError}
          setSuccess={setSuccess}
          handleTabChange={handleTabChange}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          loginData={loginData}
          setLoginData={setLoginData}
          signupData={signupData}
          setSignupData={setSignupData}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          isLoading={isLoading}
          onForgotPassword={handleForgotPassword}
        />
      </DialogContent>
    </Dialog>
  );

  // Create desktop popover component
  const desktopPopover = (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-96 p-0"
        align="end"
        onInteractOutside={() => resetForms(false)}
      >
        <AuthContent
          error={error}
          success={success}
          setError={setError}
          setSuccess={setSuccess}
          handleTabChange={handleTabChange}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          loginData={loginData}
          setLoginData={setLoginData}
          signupData={signupData}
          setSignupData={setSignupData}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          isLoading={isLoading}
          onForgotPassword={handleForgotPassword}
        />
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      {isMobile ? mobileDialog : desktopPopover}
      <ForgotPasswordPopover
        isOpen={showForgotPassword}
        onClose={handleCloseForgotPassword}
        onBackToLogin={handleBackToLogin}
      />
      <TwoFactorVerification
        isOpen={showTwoFactor}
        onClose={handleTwoFactorClose}
        email={userEmail}
        pendingToken={pendingToken}
        onVerificationSuccess={handleTwoFactorSuccess}
      />
    </>
  );
}
