import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TransactionTracker } from './TransactionTracker';

export function TransactionTrackingPopover() {
  const [transactionId, setTransactionId] = useState('');
  const [showTracker, setShowTracker] = useState(false);
  const [currentTrackingId, setCurrentTrackingId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleTrackTransaction = () => {
    if (transactionId.trim()) {
      setCurrentTrackingId(transactionId.trim());
      setShowTracker(true);
      setIsOpen(false); // Close the popover
      setTransactionId(''); // Clear the input
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrackTransaction();
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Track Transaction</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Track Transaction</h4>
              <p className="text-sm text-muted-foreground">
                Enter your transaction ID to track its status
              </p>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
              <Button 
                onClick={handleTrackTransaction} 
                disabled={!transactionId.trim()}
                className="w-full"
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Track Transaction
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <TransactionTracker
        transactionId={currentTrackingId}
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
      />
    </>
  );
}