import React, { useState } from 'react';
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { WhyBlockHaven } from "@/components/sections/WhyBlockHaven";
import { FAQ } from "@/components/sections/FAQ";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { AdminDashboard } from './AdminDashboard';

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleDashboardOpen = () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAuthToken(token);
      setShowDashboard(true);
    }
  };

  const handleDashboardClose = () => {
    setShowDashboard(false);
    setAuthToken(null);
  };

  if (showDashboard && authToken) {
    return <AdminDashboard onBack={handleDashboardClose} token={authToken} />;
  }

  return (
    <main className="min-h-screen">
      <Header onDashboardOpen={handleDashboardOpen} />
      <Hero />
      <WhyBlockHaven />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
