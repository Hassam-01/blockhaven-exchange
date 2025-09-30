import React, { useState } from 'react';
import { User, LogOut, Settings, CreditCard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { User as UserType } from '@/lib/user-services-api';

interface UserProfilePopoverProps {
  user: UserType;
  onLogout: () => void;
  onDashboard?: () => void;
}

export function UserProfilePopover({ user, onLogout, onDashboard }: UserProfilePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    onLogout();
    setIsOpen(false);
  };

  const handleDashboard = () => {
    if (onDashboard) {
      onDashboard();
    }
    setIsOpen(false);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium">
            {getInitials(user.first_name, user.last_name)}
          </div>
          <span className="hidden md:inline text-sm font-medium">
            {user.first_name}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
              {getInitials(user.first_name, user.last_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
              {user.user_type === 'admin' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 space-y-1">
            {user.user_type === 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-9"
                onClick={handleDashboard}
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 h-9"
              onClick={() => setIsOpen(false)}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 h-9"
              onClick={() => setIsOpen(false)}
            >
              <CreditCard className="h-4 w-4" />
              Transaction History
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 h-9"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}