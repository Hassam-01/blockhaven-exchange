import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How secure is BlockHaven?',
    answer: 'BlockHaven employs bank-grade security measures including multi-signature wallets, cold storage, SSL encryption, and regular security audits. We also carry comprehensive insurance coverage for digital assets.'
  },
  {
    question: 'What cryptocurrencies can I trade?',
    answer: 'We support over 300 cryptocurrencies including Bitcoin, Ethereum, and all major altcoins. Our selection is constantly expanding to include the latest promising projects and DeFi tokens.'
  },
  {
    question: 'How long do exchanges take?',
    answer: 'Most exchanges are completed within 5-30 minutes depending on network confirmations. We provide real-time updates throughout the process so you always know the status of your transaction.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No hidden fees, ever. Our transparent pricing model shows you exactly what you\'ll pay upfront. We only charge a small service fee that\'s clearly displayed before you confirm any exchange.'
  },
  {
    question: 'Do I need to create an account?',
    answer: 'For basic exchanges, no account is required. However, creating an account unlocks additional features like transaction history, favorite pairs, and higher exchange limits.'
  },
  {
    question: 'What happens if something goes wrong?',
    answer: 'Our 24/7 support team is always available to help. We also have automated refund processes for failed transactions and comprehensive insurance coverage for your peace of mind.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'If an exchange fails due to technical issues on our end, we automatically process refunds. For other cases, our support team will work with you to find the best solution within 24 hours.'
  },
  {
    question: 'How do you determine exchange rates?',
    answer: 'Our rates are determined by real-time market data from multiple exchanges and liquidity providers. We aggregate the best rates to ensure you get competitive pricing for every trade.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-background bg-pattern-mountain-texture bg-pattern-lg relative overflow-hidden">
      {/* Subtle mountain range */}
      <div className="absolute inset-0 opacity-6">
        <svg className="absolute bottom-0 left-0 w-full h-20" viewBox="0 0 1200 200" fill="none">
          <path d="M0,200L40,180C80,160,160,120,240,100C320,80,400,80,480,90C560,100,640,120,720,130C800,140,880,140,960,130C1040,120,1120,100,1160,90L1200,80L1200,200L1160,200C1120,200,1040,200,960,200C880,200,800,200,720,200C640,200,560,200,480,200C400,200,320,200,240,200C160,200,80,200,40,200L0,200Z" fill="currentColor"/>
        </svg>
      </div>
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

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border-border rounded-lg px-6 border"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}