import React from 'react';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExchangeWidget } from '@/components/crypto/ExchangeWidget';
import mountainBg from '@/assets/mountain-bg.png';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${mountainBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-mountain" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                BlockHaven
              </span>
              <br />
              <span className="text-foreground">
                Secure Crypto Exchange
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Trade 300+ cryptocurrencies with instant exchanges, competitive rates, 
              and enterprise-grade security. Your gateway to the digital asset universe.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-10 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-success" />
                <span className="font-medium">Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Zap className="w-5 h-5 text-warning" />
                <span className="font-medium">Instant Exchanges</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">50K+ Users</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl">
                Start Trading Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="exchange" size="xl">
                View All Markets
              </Button>
            </div>
          </div>
          
          {/* Right Content - Exchange Widget */}
          <div className="flex justify-center">
            <ExchangeWidget />
          </div>
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