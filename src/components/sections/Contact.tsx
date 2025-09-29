import React, { useState } from 'react';
import { Mail, MessageCircle, Send, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-muted/30 bg-pattern-dots bg-pattern relative overflow-hidden">
      {/* Subtle combined elements */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute top-10 right-10 w-24 h-12" viewBox="0 0 96 48" fill="none">
          <path d="M72,24C72,10.7,61.3,0,48,0S24,10.7,24,24c0,0,0,0,0,0C10.7,24,0,34.7,0,48s10.7,24,24,24h48c13.3,0,24-10.7,24-24S85.3,24,72,24z" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-10 left-20 w-6 h-16" viewBox="0 0 24 64" fill="none">
          <rect x="10" y="40" width="4" height="24" fill="currentColor"/>
          <path d="M12,0L18,12L6,12L12,0ZM12,8L16,20L8,20L12,8Z" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-0 right-1/4 w-1/3 h-16" viewBox="0 0 400 128" fill="none">
          <path d="M0,128L20,120C40,112,80,96,120,90.7C160,85,200,91,240,96C280,101,320,107,360,106.7C380,107,400,101,400,101L400,128L380,128C360,128,320,128,280,128C240,128,200,128,160,128C120,128,80,128,40,128L0,128Z" fill="currentColor"/>
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Get in{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or need support? Our team is here to help you succeed in your crypto journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-bold text-lg">Live Chat</h3>
                    <p className="text-muted-foreground">Get instant support</p>
                  </div>
                </div>
                <Button variant="crypto" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Mail className="w-8 h-8 text-accent" />
                  <div>
                    <h3 className="font-bold text-lg">Email Support</h3>
                    <p className="text-muted-foreground">support@blockhaven.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Response within 24 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Phone className="w-8 h-8 text-success" />
                  <div>
                    <h3 className="font-bold text-lg">Phone Support</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Available</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Please describe your question or issue in detail..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="crypto" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    {!isSubmitting && <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}