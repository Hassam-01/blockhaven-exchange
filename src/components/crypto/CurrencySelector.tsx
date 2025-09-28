import React, { memo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CryptoCurrency } from '@/lib/changenow-api';

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  currencies: CryptoCurrency[];
  selectedCurrency: CryptoCurrency | null;
  placeholder?: string;
  className?: string;
}

export const CurrencySelector = memo(({
  value,
  onValueChange,
  currencies,
  selectedCurrency,
  placeholder = "Select currency",
  className = "w-full",
}: CurrencySelectorProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`${className} focus:ring-0 focus:ring-offset-0 focus:border-2`}
        style={{
          borderColor: selectedCurrency?.color || "hsl(var(--input))",
        }}
      >
        <SelectValue placeholder={placeholder}>
          {selectedCurrency && (
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold"
                style={{ color: selectedCurrency.color }}
              >
                {selectedCurrency.logo}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">
                  {selectedCurrency.name}
                </span>
                <span className="text-xs text-muted-foreground uppercase">
                  {selectedCurrency.ticker}
                </span>
              </div>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {currencies.map((c) => (
          <SelectItem key={c.ticker} value={c.ticker}>
            <div className="flex items-center gap-3 w-full">
              <span
                className="text-lg font-bold"
                style={{ color: c.color }}
              >
                {c.logo}
              </span>
              <div className="flex flex-col items-start flex-1">
                <span className="font-semibold text-sm">
                  {c.name}
                </span>
                <span className="text-xs text-muted-foreground uppercase">
                  {c.ticker}
                </span>
              </div>
              {c.featured && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Popular
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

CurrencySelector.displayName = 'CurrencySelector';
