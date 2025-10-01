import React from 'react';
import { Shield, Zap, Globe, Lock, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Execute trades in seconds with our optimized matching engine and instant settlement.',
    color: 'text-warning'
  },
  {
    icon: Globe,
    title: '900+ Cryptocurrencies', 
    description: 'Access the largest selection of digital assets from Bitcoin to emerging DeFi tokens.',
    color: 'text-primary'
  },
  {
    icon: TrendingUp,
    title: 'Best Rates',
    description: 'Competitive rates with transparent pricing and no hidden fees.',
    color: 'text-success'
  },
  {
    icon: Users,
    title: '24/7 Support',
    description: 'Expert support team available around the clock to assist with any questions.',
    color: 'text-primary'
  }
];

export function WhyBlockHaven() {
  return (
    <section id="why-blockhaven" className="py-20 bg-muted/30  relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              BlockHaven
            </span>
            ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built by crypto enthusiasts for crypto enthusiasts. We combine cutting-edge technology 
            with uncompromising security to deliver the ultimate trading experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {features?.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/30 transition-all duration-300 hover:shadow-card group">
              <CardContent className="p-8 text-center">
                <feature.icon className={`w-12 h-12 mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              $2.5B+
            </div>
            <p className="text-muted-foreground">Trading Volume</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              300+
            </div>
            <p className="text-muted-foreground">Cryptocurrencies</p>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <p className="text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
    </section>
  );
}