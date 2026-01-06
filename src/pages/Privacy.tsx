import { Layout } from "@/components/layout/Layout";
import { Shield, Lock, Eye, FileText, Users, Globe } from "lucide-react";

export default function Privacy() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Shield className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Privacy Policy & NDA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your intellectual property and data security are our top priority. 
            Learn how we protect your designs and information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container-wide max-w-4xl">
          {/* IP Protection */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-8 h-8 text-accent" />
              <h2 className="text-2xl font-bold">Intellectual Property Protection</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                At BharatPCBs, we understand that your PCB designs represent significant 
                investment in research and development. We are committed to protecting 
                your intellectual property with the highest standards of security and 
                confidentiality.
              </p>
              <ul className="space-y-2 mt-4">
                <li>All uploaded files are encrypted using AES-256 encryption</li>
                <li>Access to design files is strictly limited to authorized personnel</li>
                <li>Design data is never shared with third parties without explicit consent</li>
                <li>All production data is securely deleted after order completion (upon request)</li>
                <li>Employees sign strict confidentiality agreements</li>
              </ul>
            </div>
          </div>

          {/* NDA */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-accent" />
              <h2 className="text-2xl font-bold">Non-Disclosure Agreement</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                By submitting your designs to BharatPCBs, you automatically receive 
                our standard NDA protection. For customers requiring additional 
                security measures, we offer custom NDA agreements.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                Standard NDA Coverage:
              </h3>
              <ul className="space-y-2">
                <li>Complete confidentiality of all design files and specifications</li>
                <li>No disclosure of customer identity or order details</li>
                <li>Prohibition of reverse engineering or design replication</li>
                <li>Secure handling and disposal of all physical samples</li>
                <li>5-year confidentiality period after project completion</li>
              </ul>
            </div>
          </div>

          {/* Data Collection */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-8 h-8 text-accent" />
              <h2 className="text-2xl font-bold">Data We Collect</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>We collect only the information necessary to provide our services:</p>
              <ul className="space-y-2 mt-4">
                <li><strong>Contact Information:</strong> Name, email, phone, company</li>
                <li><strong>Order Data:</strong> PCB specifications, design files, shipping details</li>
                <li><strong>Usage Data:</strong> Website analytics for service improvement</li>
                <li><strong>Communication:</strong> Email correspondence and support tickets</li>
              </ul>
            </div>
          </div>

          {/* Data Usage */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-accent" />
              <h2 className="text-2xl font-bold">How We Use Your Data</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <ul className="space-y-2">
                <li>Processing and fulfilling your orders</li>
                <li>Communicating about your projects and quotes</li>
                <li>Providing customer support</li>
                <li>Improving our services and website</li>
                <li>Sending relevant updates (with your consent)</li>
              </ul>
              <p className="mt-4">
                We <strong>never</strong> sell, rent, or share your personal information 
                with third parties for marketing purposes.
              </p>
            </div>
          </div>

          {/* International */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-8 h-8 text-accent" />
              <h2 className="text-2xl font-bold">International Compliance</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                Our privacy practices comply with applicable Indian data protection 
                laws and international standards including:
              </p>
              <ul className="space-y-2 mt-4">
                <li>Information Technology Act, 2000 (India)</li>
                <li>GDPR principles for European customers</li>
                <li>Industry-standard security practices (ISO 27001 aligned)</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-muted/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about our privacy practices or need a custom NDA, 
              please contact our data protection team:
            </p>
            <p className="font-medium">
              Email: <a href="mailto:privacy@bharatpcbs.com" className="text-accent hover:underline">privacy@bharatpcbs.com</a>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
