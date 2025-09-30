import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsPopoverProps {
  children: React.ReactNode;
}

export function TermsPopover({ children }: TermsPopoverProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] max-w-md md:max-w-lg p-0 max-h-[90vh]">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle>Terms & Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-80 md:h-96 p-4">
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-medium mb-2">1. Acceptance of Terms</div>
              <div>
                1.1 By accessing or using BlockHaven's services, you agree to be
                bound by these Terms of Service. If you do not agree, please do
                not use the services.
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">2. Eligibility</div>
              <div className="space-y-1">
                <div>
                  2.1 You must be at least 18 years old or the legal age of
                  majority in your jurisdiction to use the services.
                </div>
                <div>
                  2.2 By using the services, you confirm that you are legally
                  permitted to do so under applicable laws.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">3. Services Provided</div>
              <div className="space-y-1">
                <div>
                  3.1 BlockHaven provides access to cryptocurrency swap services
                  through third-party providers, including ChangeNOW.
                </div>
                <div>
                  3.2 BlockHaven is a facilitator and does not custody user
                  funds.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">4. AML/KYC Compliance</div>
              <div className="space-y-1">
                <div>
                  4.1 To comply with Anti-Money Laundering (AML) and Know Your
                  Customer (KYC) regulations, some transactions may require
                  verification.
                </div>
                <div>
                  4.2 Users may be asked to provide identification documents or
                  additional information when requested by service providers or
                  regulators.
                </div>
                <div>
                  4.3 Account reviews or transaction holds due to AML/KYC checks
                  are rare occurrences, but may happen if flagged under
                  compliance rules.
                </div>
                <div>
                  4.4 Refunds, if applicable, will be processed when flagged or
                  requested by law enforcement, regulators, or relevant legal
                  authorities.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">5. User Responsibilities</div>
              <div className="space-y-1">
                <div>
                  5.1 You are responsible for the accuracy of information you
                  provide.
                </div>
                <div>
                  5.2 You must ensure your use of the services complies with
                  applicable laws.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">6. Risks and Disclaimers</div>
              <div className="space-y-1">
                <div>
                  6.1 Cryptocurrency transactions involve risks, including
                  market volatility and potential technical issues.
                </div>
                <div>
                  6.2 BlockHaven is not responsible for losses due to user
                  error, third-party failures, or market fluctuations.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">7. Indemnification</div>
              <div className="space-y-1">
                <div>
                  7.1 You agree to hold harmless and indemnify BlockHaven from
                  and against any third-party claim arising from or related to:
                </div>
                <div className="ml-4">• your breach of these Terms;</div>
                <div className="ml-4">
                  • your violation of applicable laws, rules, or regulations in
                  connection with the Website and services;
                </div>
                <div>
                  including any liability or expense arising from all claims,
                  losses, damages, suits, judgments, and litigation costs.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">8. Limitation of Liability</div>
              <div>
                8.1 BlockHaven will not be liable for indirect, incidental, or
                consequential damages arising from the use of its services.
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">9. Changes to Terms</div>
              <div>
                9.1 BlockHaven may update these Terms from time to time.
                Continued use of the services constitutes acceptance of changes.
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">10. Governing Law</div>
              <div>
                10.1 These Terms are governed by the laws of the applicable
                jurisdiction in which BlockHaven operates.
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
