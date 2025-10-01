import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getPublicFAQs, type FAQ } from '@/lib/user-services-api';

// Type for the API response
interface FAQResponse {
  faqs: FAQ[];
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load FAQs from API
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPublicFAQs();
        let faqsArray: FAQ[] = [];
        if (Array.isArray(response)) {
          faqsArray = response;
        } else if (response && typeof response === 'object' && 'faqs' in response) {
          faqsArray = (response as FAQResponse).faqs;
        }
        // Filter to only show active FAQs
        const activeFAQs = faqsArray.filter((faq: FAQ) => faq.is_active);
        setFaqs(activeFAQs);
      } catch (err) {
        console.error('Failed to load FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  if (loading) {
    return (
      <section id="faq" className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading FAQs...</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="faq" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions? We have answers. Find everything you need to know about using BlockHaven.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8 max-w-4xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="max-w-4xl mx-auto">
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={`item-${faq.id}`}
                  className="bg-card border-border rounded-lg px-6 border"
                >
                    <AccordionTrigger className="text-left font-semibold hover:text-primary hover:underline-none focus:underline-none" style={{ textDecoration: 'none' }}>
                    {faq.question}
                    </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No FAQs available at the moment. Please check back later.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}