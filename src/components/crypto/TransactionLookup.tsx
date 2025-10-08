import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { TransactionTracker } from './TransactionTracker';

export function TransactionLookup() {
  const [transactionId, setTransactionId] = useState('');
  const [showTracker, setShowTracker] = useState(false);
  const [currentTrackingId, setCurrentTrackingId] = useState('');

  const handleTrackTransaction = () => {
    if (transactionId.trim()) {
      setCurrentTrackingId(transactionId.trim());
      setShowTracker(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrackTransaction();
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Track Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="transaction-id" className="text-sm font-medium">
              Order ID
            </label>
            <Input
              id="transaction-id"
              placeholder="Enter your order ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button 
            onClick={handleTrackTransaction} 
            disabled={!transactionId.trim()}
            className="w-full"
          >
            Track Order
          </Button>
        </CardContent>
      </Card>

      <TransactionTracker
        transactionId={currentTrackingId}
        isOpen={showTracker}
        onClose={() => setShowTracker(false)}
      />
    </>
  );
}