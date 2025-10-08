import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExchangeTypeSelectorProps {
  exchangeType: 'fixed' | 'floating';
  onTypeChange: (type: 'fixed' | 'floating') => void;
  charges: {
    fixed: { rate: number; description: string };
    floating: { rate: number; description: string };
  };
}

export const ExchangeTypeSelector = memo(({
  exchangeType,
  onTypeChange,
  charges
}: ExchangeTypeSelectorProps) => {
  const isFixed = exchangeType === 'fixed';

  // Format rate to remove trailing zeros but keep .00 for whole numbers
  const formatRate = (rate: number): string => {
    const numRate = Number(rate);
    // If it's a whole number (like 1.00), keep the .00
    if (numRate % 1 === 0) {
      return numRate.toFixed(2);
    }
    // Otherwise, remove trailing zeros
    return parseFloat(numRate.toString()).toString();
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Order type</label>

      <div className="relative flex rounded-md bg-muted p-0.5 border">
        {/* Sliding highlight */}
        <div
          className={cn(
            'absolute top-0.5 bottom-0.5 w-1/2 rounded-md bg-blue-500 transition-transform duration-300',
            isFixed ? 'translate-x-0' : 'translate-x-full'
          )}
        />

        {/* Buttons with hard focus overrides */}
        <Button
          variant="ghost"
          onClick={() => onTypeChange('fixed')}
          className={cn(
            'relative z-10 flex-1 font-medium',
            // kill hover and focus visuals completely
            'hover:bg-transparent hover:text-inherit',
            'focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent',
            'active:outline-none active:ring-0 active:border-transparent',
            isFixed ? 'text-white' : 'text-muted-foreground'
          )}
        >
          Fixed rate ({formatRate(charges.fixed.rate)}%)
        </Button>

        <Button
          variant="ghost"
          onClick={() => onTypeChange('floating')}
          className={cn(
            'relative z-10 flex-1 font-medium',
            'hover:bg-transparent hover:text-inherit',
            'focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent',
            'active:outline-none active:ring-0 active:border-transparent',
            !isFixed ? 'text-white' : 'text-muted-foreground'
          )}
        >
          Float rate ({formatRate(charges.floating.rate)}%)
        </Button>
      </div>
    </div>
  );
});

ExchangeTypeSelector.displayName = 'ExchangeTypeSelector';
