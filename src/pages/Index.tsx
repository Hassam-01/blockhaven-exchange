import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { WhyBlockHaven } from '@/components/sections/WhyBlockHaven';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <WhyBlockHaven />  
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
