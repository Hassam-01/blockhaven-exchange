import React, { useState } from 'react';
import { Mail, MessageCircle, Send, MapPin, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wave1, Wave2, Wave3, Wave4, Wave5 } from '@/components/ui/wave-graphics';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm, type ContactFormData } from '@/lib/contact-api';

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
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

    try {
      await submitContactForm(formData);

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden section-bg">
      {/* Cloud Layers - Non-overlapping light pattern */}
      <Wave1 className="absolute top-24 left-1/5 w-1/7 h-auto opacity-[0.02] z-1 filter grayscale" />
      <Wave2 className="absolute bottom-32 right-1/6 w-1/6 h-auto opacity-[0.02] z-1 filter grayscale scale-x-[-1]" />
      <Wave3 className="absolute top-8 right-2/5 w-1/8 h-auto opacity-[0.02] z-1 filter grayscale" />
      <Wave4 className="absolute bottom-8 left-2/5 w-1/8 h-auto opacity-[0.02] z-1 filter grayscale scale-x-[-1]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Get in{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Have questions or need support? Our team is here to help you succeed in your crypto journey.
          </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-lg">
              <span className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-2" />
                <span className="text-muted-foreground mr-2">Contact us directly at:</span>
              </span>
              <a 
                href="mailto:support@blockhaven.com" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                support@blockhaven.com
              </a>
            </div>
        </div>

        {/* Centered Contact Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Send us a Message</CardTitle>
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
                        placeholder="john.doe@example.com"
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
                      placeholder="Inquiry about services"
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
                      placeholder="I would like to know more about your blockchain services..."
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
    </section>
  );
}