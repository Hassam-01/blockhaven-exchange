import React, { useState } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitChatQuery, type ChatQueryData } from '@/lib/chat-api';

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  const [formData, setFormData] = useState<ChatQueryData>({
    email: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.query.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both email and query fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitChatQuery(formData);

      toast({
        title: "Query Sent!",
        description: "Thank you for your query. We'll respond to your email soon.",
      });

      setFormData({ email: '', query: '' });
      setShowForm(false);
      
      // Close the panel after a brief delay
      setTimeout(() => {
        onClose();
        setShowForm(true);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send query. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 w-80 animate-in slide-in-from-bottom-2">
      <Card className="shadow-2xl border-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-primary" />
            Quick Help
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <>
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Hi! I'm here to help. Please share your email and question, and our team will get back to you quickly.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    name="query"
                    placeholder="How can we help you?"
                    value={formData.query}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Query
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 justify-center">
                  <User className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Thank you! Your query has been sent successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}