import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { WhyBlockHaven } from '@/components/sections/WhyBlockHaven';
import { PopularCoins } from '@/components/sections/PopularCoins';
import { MarketMovers } from '@/components/sections/MarketMovers';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <WhyBlockHaven />  
      <PopularCoins />
      <MarketMovers />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
