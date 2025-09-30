import React from "react";
import { Github, Twitter, Linkedin, Mail, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-primary/20">
      {/* Cloud-like shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-32 h-16 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-20 bg-white/3 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-12 bg-white/4 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-1/3 w-24 h-10 bg-white/6 rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              BlockHaven
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted gateway to the cryptocurrency universe. Trade with
              confidence, backed by enterprise-grade security and 24/7 support.
            </p>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary text-muted-foreground"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary text-muted-foreground"
              >
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-foreground">Products</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Instant Exchange
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Fixed-Rate Exchange
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API Integration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  White Label Solution
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-foreground">Support</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  System Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Bug Bounty
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>SOC 2 Compliant</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>
            © {currentYear} BlockHaven. All rights reserved. | Cryptocurrency
            exchange platform built with security and trust in mind.
          </p>
        </div>
      </div>
    </footer>
  );
}
