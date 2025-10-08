import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPopoverProps {
  children: React.ReactNode;
}

export function PrivacyPopover({ children }: PrivacyPopoverProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md md:max-w-lg p-0">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Privacy Policy</h3>
        </div>
        <ScrollArea className="h-80 md:h-96 p-4">
          <div className="space-y-4 text-sm">
            <div>
              <div className="font-medium mb-2">1. Introduction</div>
              <div>
                1.1 BlockHaven values your privacy and is committed to
                protecting your personal data. This Privacy Policy explains how
                we collect, use, and safeguard your information.
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">2. Information We Collect</div>
              <div className="space-y-1">
                <div>
                  2.1 Personal information you provide directly (e.g., email, ID
                  documents during KYC).
                </div>
                <div>
                  2.2 Transaction information related to cryptocurrency swaps.
                </div>
                <div>
                  2.3 Technical information (IP address, browser type, device
                  information).
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">3. Use of Information</div>
              <div className="space-y-1">
                <div>3.1 To provide and improve services.</div>
                <div>
                  3.2 To comply with AML/KYC and other regulatory requirements.
                </div>
                <div>3.3 To prevent fraud and ensure security.</div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">4. AML/KYC Compliance</div>
              <div className="space-y-1">
                <div>
                  4.1 In rare cases, users may be asked to provide
                  identification documents or undergo verification to meet
                  AML/KYC obligations.
                </div>
                <div>
                  4.2 These requests are uncommon but may occur when
                  transactions are flagged for review under compliance rules.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">5. Cookies</div>
              <div className="space-y-1">
                <div>
                  5.1 BlockHaven may use cookies to improve website performance
                  and user experience.
                </div>
                <div>
                  5.2 Users can disable cookies in their browser settings,
                  though some features may not function properly.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">6. Data Security</div>
              <div className="space-y-1">
                <div>
                  6.1 We implement appropriate technical and organizational
                  measures to protect your information.
                </div>
                <div>
                  6.2 While we take all reasonable steps to secure data, no
                  system is completely immune to risks.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">7. Sharing of Information</div>
              <div className="space-y-1">
                <div>
                  7.1 Information may be shared with trusted third-party
                  providers for transaction processing.
                </div>
                <div>
                  7.2 Information may also be shared when required by law
                  enforcement, regulators, or relevant authorities.
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">8. Data Retention</div>
              <div>
                8.1 Personal data is retained only as long as necessary for
                compliance with legal obligations and provision of services.
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">9. User Rights</div>
              <div>
                9.1 You may request access, correction, or deletion of your
                personal data, subject to applicable law.
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">
                10. Changes to Privacy Policy
              </div>
              <div>
                10.1 BlockHaven may update this Privacy Policy from time to
                time. Continued use of services indicates acceptance of updates.
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
