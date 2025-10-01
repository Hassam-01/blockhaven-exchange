import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatbotIcon({ onClick, isOpen }: ChatbotIconProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        onClick={onClick}
        className={`
          h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110
          ${isOpen 
            ? 'bg-destructive hover:bg-destructive/90' 
            : 'bg-primary hover:bg-primary/90'
          }
        `}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle 
          className={`h-6 w-6 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </Button>
    </div>
  );
}