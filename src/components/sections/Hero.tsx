import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExchangeWidget } from '@/components/crypto/ExchangeWidget';
import mountainBg from '@/assets/mountain-bg.png';

export function Hero() {
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const words = ['Reliable', 'Secure', 'Swift'];
  const wordColors = [
    'from-blue-500 to-cyan-400',
    'from-green-500 to-emerald-400', 
    'from-purple-500 to-pink-400'
  ];

  useEffect(() => {
    const current = words[currentWord];
    const colorClass = wordColors[currentWord];
    
    if (!isDeleting) {
      // Typing effect
      if (displayText.length < current.length) {
        const timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        // Wait before starting to delete
        const timeout = setTimeout(() => setIsDeleting(true), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting effect
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        // Move to next word after deleting
        setIsDeleting(false);
        setCurrentWord((prev) => (prev + 1) % words.length);
      }
    }
  }, [displayText, currentWord, isDeleting]);

  return (
    <section id="exchange" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${mountainBg})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">
            <span className="text-foreground">
              <span 
                className={`bg-gradient-to-r ${wordColors[currentWord]} bg-clip-text text-transparent`}
              >
                {displayText}
              </span>
              {!isDeleting && displayText.length === words[currentWord].length && (
                <span className="animate-pulse"></span>
              )}
              {(isDeleting || displayText.length < words[currentWord].length) && (
                <span className="animate-pulse"></span>
              )}{' '}
              Crypto Exchange
            </span>
          </h1>
        </div>
        
        {/* Centered Exchange Widget */}
        <div className="flex justify-center">
          <ExchangeWidget />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
}