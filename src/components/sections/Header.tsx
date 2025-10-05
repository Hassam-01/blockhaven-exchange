import { useState, useEffect, useRef } from "react";
import { Menu, X, User as UserIcon, LogOut, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignInPopover } from "@/components/auth/SignInPopover";
import { UserProfilePopover } from "@/components/auth/UserProfilePopover";
import { Profile } from "@/components/Profile";
import { TransactionTrackingPopover } from "@/components/crypto/TransactionTrackingPopover";
import { getCurrentUser, getCurrentAuthToken, validateCurrentToken, logoutUser } from "@/lib/user-services-api";
import type { User } from "@/lib/user-services-api";

interface HeaderProps {
  onDashboardOpen?: () => void;
}

export function Header({ onDashboardOpen }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const tokenValidationInterval = useRef<NodeJS.Timeout | null>(null);

  // Check for existing user session on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = getCurrentAuthToken();
        const userData = getCurrentUser();

        if (token && userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Set up periodic token validation (every 5 minutes)
    const startTokenValidation = () => {
      if (tokenValidationInterval.current) {
        clearInterval(tokenValidationInterval.current);
      }
      
      tokenValidationInterval.current = setInterval(async () => {
        const token = getCurrentAuthToken();
        if (token) {
          const isValid = await validateCurrentToken();
          if (!isValid) {
            // Token is invalid, user will be logged out automatically by validateCurrentToken
            setUser(null);
          }
        }
      }, 5 * 60 * 1000); // 5 minutes
    };

    // Start token validation if user is logged in
    if (getCurrentAuthToken()) {
      startTokenValidation();
    }

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    // Listen for auth state changes (e.g., login/logout)
    const handleAuthStateChange = () => {
      checkAuthStatus();
      // Restart token validation based on new auth state
      const token = getCurrentAuthToken();
      if (token) {
        startTokenValidation();
      } else {
        if (tokenValidationInterval.current) {
          clearInterval(tokenValidationInterval.current);
          tokenValidationInterval.current = null;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-state-changed", handleAuthStateChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
      
      // Clean up interval
      if (tokenValidationInterval.current) {
        clearInterval(tokenValidationInterval.current);
      }
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  const handleMobileProfile = () => {
    setIsProfileOpen(true);
    setIsMenuOpen(false);
  };

  const handleMobileLogout = () => {
    logoutUser();
    setUser(null);
    setIsMenuOpen(false);
  };

  const handleMobileDashboard = () => {
    if (onDashboardOpen) {
      onDashboardOpen();
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: "Exchange", href: "#exchange" },
    { name: "Why BlockHaven", href: "#why-blockhaven" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto md:px-6 px-2">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Logo width={200} height={44} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation?.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <TransactionTrackingPopover />
            {!isLoading &&
              (user ? (
                <UserProfilePopover 
                  user={user} 
                  onLogout={handleLogout}
                  onDashboard={onDashboardOpen}
                />
              ) : (
                <SignInPopover>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInPopover>
              ))}
            <ThemeToggle />
          </div>

          {/* Mobile menu button & Theme Toggle */}
          <div className="md:hidden flex items-center ">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-md border border-border rounded-lg mt-2 mb-2">
              {navigation?.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200 font-medium"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Track Transaction */}
              <div className="px-3 py-2">
                <TransactionTrackingPopover isMobile={true} />
              </div>
              
              {/* Mobile User Section */}
              {!isLoading && user && (
                <div className="border-t border-border pt-2 mt-2">
                  {/* User Info Display */}
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Admin Dashboard Option */}
                  {user.user_type === 'admin' && (
                    <button
                      onClick={handleMobileDashboard}
                      className="flex items-center gap-3 w-full text-left px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200 font-medium"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </button>
                  )}

                  {/* Profile Option */}
                  <button
                    onClick={handleMobileProfile}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200 font-medium"
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </button>

                  {/* Sign Out Option */}
                  <button
                    onClick={handleMobileLogout}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}

              {/* Sign In Section for non-authenticated users */}
              {!isLoading && !user && (
                <div className="px-3 py-2 space-y-2">
                  <SignInPopover>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                  </SignInPopover>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <Profile onClose={() => setIsProfileOpen(false)} />
      )}
    </header>
  );
}
