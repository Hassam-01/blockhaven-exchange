import React, { memo } from 'react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Order type</label>
      <div className="flex gap-2">
        <Button
          variant={exchangeType === 'fixed' ? 'default' : 'outline'}
          onClick={() => onTypeChange('fixed')}
          className="flex-1"
        >
          Fixed rate ({charges.fixed.rate}%)
        </Button>
        <Button
          variant={exchangeType === 'floating' ? 'default' : 'outline'}
          onClick={() => onTypeChange('floating')}
          className="flex-1"
        >
          Float rate ({charges.floating.rate}%)
        </Button>
      </div>
    </div>
  );
});

ExchangeTypeSelector.displayName = 'ExchangeTypeSelector';
