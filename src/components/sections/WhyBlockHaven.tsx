import React from 'react';
import { Shield, Zap, Globe, Lock, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Multi-layered security protocols with cold storage and insurance coverage to protect your assets.',
    color: 'text-success'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Execute trades in seconds with our optimized matching engine and instant settlement.',
    color: 'text-warning'
  },
  {
    icon: Globe,
    title: '300+ Cryptocurrencies', 
    description: 'Access the largest selection of digital assets from Bitcoin to emerging DeFi tokens.',
    color: 'text-primary'
  },
  {
    icon: Lock,
    title: 'Non-Custodial',
    description: 'You maintain full control of your private keys. We never hold your funds.',
    color: 'text-accent'
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
    <section id="why-blockhaven" className="py-20 bg-muted/30 bg-pattern-mountain-texture bg-pattern relative overflow-hidden">
      {/* Subtle mountain silhouettes */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 320" fill="none">
          <path d="M0,320L50,280C100,240,200,160,300,133.3C400,107,500,133,600,149.3C700,165,800,171,900,160C1000,149,1100,123,1150,109.3L1200,96L1200,320L1150,320C1100,320,1000,320,900,320C800,320,700,320,600,320C500,320,400,320,300,320C200,320,100,320,50,320L0,320Z" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-0 right-1/4 w-1/2 h-24" viewBox="0 0 600 200" fill="none">
          <path d="M0,200L25,180C50,160,100,120,150,110C200,100,250,120,300,130C350,140,400,140,450,133.3C500,127,550,113,575,106.7L600,100L600,200L575,200C550,200,500,200,450,200C400,200,350,200,300,200C250,200,200,200,150,200C100,200,50,200,25,200L0,200Z" fill="currentColor"/>
        </svg>
      </div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
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