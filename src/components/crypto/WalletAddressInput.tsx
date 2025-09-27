import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Wallet, Shield } from 'lucide-react';

interface WalletAddressInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
  icon: 'wallet' | 'shield';
  required?: boolean;
  className?: string;
}

export const WalletAddressInput = memo(({
  label,
  placeholder,
  value,
  onChange,
  onCopy,
  icon,
  required = false,
  className = "font-mono text-sm flex-1"
}: WalletAddressInputProps) => {
  const IconComponent = icon === 'wallet' ? Wallet : Shield;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <IconComponent className="w-4 h-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          disabled={!value}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

WalletAddressInput.displayName = 'WalletAddressInput';
