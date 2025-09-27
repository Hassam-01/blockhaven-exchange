import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { CryptoCurrency } from '@/lib/changenow-api';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  selectedCurrency: CryptoCurrency | null;
  className?: string;
}

export const CurrencyInput = memo(({
  value,
  onChange,
  placeholder = "0.00",
  readOnly = false,
  selectedCurrency,
  className = "text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
}: CurrencyInputProps) => {
  return (
    <Input
      type="text" // Always use text type to completely avoid number input behavior
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        // Only allow numbers and decimal point
        const val = e.target.value;
        if (readOnly || /^\d*\.?\d*$/.test(val)) {
          onChange(val);
        }
      }}
      readOnly={readOnly}
      className={className}
      style={{
        borderColor: selectedCurrency?.color || undefined,
        color: selectedCurrency?.color || undefined
      }}
      inputMode="decimal" // Show decimal keyboard on mobile
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';