import React from "react";
import { Construction, Clock, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-orange-500/20 rounded-full w-fit">
              <Construction className="h-12 w-12 text-orange-400" />
            </div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Under Maintenance
            </CardTitle>
            <CardDescription className="text-slate-300 text-lg">
              We're currently performing scheduled maintenance to improve your experience.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-slate-300">
                <Clock className="h-5 w-5" />
                <span>Expected downtime: 2-4 hours</span>
              </div>

              <p className="text-slate-400 max-w-md mx-auto">
                Our team is working hard to bring you an enhanced BlockHaven Exchange experience.
                We'll be back online shortly.
              </p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-white text-center">What we're doing:</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  System performance optimizations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Security enhancements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  New feature deployments
                </li>
              </ul>
            </div>

            <div className="text-center space-y-4">
              <p className="text-slate-400">
                Need immediate assistance? Contact our support team:
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Mail className="h-4 w-4 mr-2" />
                  support@blockhaven.com
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Support
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-500 text-sm">
                © 2025 BlockHaven Exchange. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Maintenance;