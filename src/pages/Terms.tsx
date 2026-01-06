import { Layout } from "@/components/layout/Layout";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before using BharatPCBs services.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container-wide max-w-4xl">
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using BharatPCBs' website and services, you agree to be 
                bound by these Terms of Service. If you do not agree with any part of these 
                terms, you may not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Services Description</h2>
              <p>
                BharatPCBs provides PCB design, fabrication, assembly, and related 
                electronics manufacturing services. Our services include:
              </p>
              <ul className="mt-4 space-y-2">
                <li>PCB Design consultation and layout services</li>
                <li>PCB Fabrication (bare board manufacturing)</li>
                <li>PCB Assembly (component mounting and soldering)</li>
                <li>Turnkey solutions (complete product manufacturing)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Quotations & Pricing</h2>
              <p>
                All quotations are valid for 30 days from the date of issue unless 
                otherwise specified. Prices are subject to change based on:
              </p>
              <ul className="mt-4 space-y-2">
                <li>Raw material cost fluctuations</li>
                <li>Changes in order specifications</li>
                <li>Quantity modifications</li>
                <li>Currency exchange rate variations (for international orders)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Order Acceptance</h2>
              <p>
                Orders are considered confirmed only after:
              </p>
              <ul className="mt-4 space-y-2">
                <li>Customer approval of the final quotation</li>
                <li>Receipt of complete and manufacturable design files</li>
                <li>Payment confirmation as per agreed terms</li>
                <li>Written order confirmation from BharatPCBs</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Design Files & Specifications</h2>
              <p>
                Customers are responsible for providing accurate and complete design 
                files. BharatPCBs performs a basic Design for Manufacturing (DFM) review 
                but is not liable for design errors that are not identified during this review.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Payment Terms</h2>
              <p>
                Standard payment terms vary based on customer relationship and order value:
              </p>
              <ul className="mt-4 space-y-2">
                <li><strong>New Customers:</strong> 100% advance payment</li>
                <li><strong>Established Customers:</strong> 50% advance, 50% before shipping</li>
                <li><strong>Enterprise Accounts:</strong> Net 30 (subject to credit approval)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Delivery & Shipping</h2>
              <p>
                Lead times are estimates and may vary based on order complexity and 
                current production load. BharatPCBs is not liable for delays caused by:
              </p>
              <ul className="mt-4 space-y-2">
                <li>Force majeure events</li>
                <li>Shipping carrier delays</li>
                <li>Customs clearance issues</li>
                <li>Customer-requested specification changes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Quality & Returns</h2>
              <p>
                All products are manufactured to specified IPC standards. Claims for 
                defective products must be submitted within 7 days of delivery with 
                supporting documentation. BharatPCBs will replace defective products 
                at no additional cost if the defect is due to manufacturing error.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
              <p>
                BharatPCBs' liability is limited to the value of the order. We are not 
                liable for indirect, consequential, or incidental damages including 
                lost profits, lost revenue, or business interruption.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
              <p>
                These terms are governed by the laws of India. Any disputes shall be 
                subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.
              </p>
            </div>

            <div className="bg-muted/30 rounded-2xl p-8 mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
              <p>
                If you have questions about these terms, please contact us at:{" "}
                <a href="mailto:legal@bharatpcbs.com" className="text-accent hover:underline">
                  legal@bharatpcbs.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: January 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
