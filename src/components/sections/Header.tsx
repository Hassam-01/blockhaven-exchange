import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignInPopover } from "@/components/auth/SignInPopover";
import { UserProfilePopover } from "@/components/auth/UserProfilePopover";
import type { User } from "@/lib/user-services-api";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          } catch (parseError) {
            // Clear invalid data
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
          }
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    // Listen for auth state changes (e.g., login/logout)
    const handleAuthStateChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-state-changed", handleAuthStateChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: "Exchange", href: "#exchange" },
    { name: "Why BlockHaven", href: "#why-blockhaven" },
    { name: "Markets", href: "#markets" },
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
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                BlockHaven
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
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
            {!isLoading &&
              (user ? (
                <UserProfilePopover user={user} onLogout={handleLogout} />
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
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors duration-200 font-medium"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 py-2 space-y-2">
                {!isLoading &&
                  (user ? (
                    <UserProfilePopover user={user} onLogout={handleLogout} />
                  ) : (
                    <SignInPopover>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Sign In
                      </Button>
                    </SignInPopover>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
