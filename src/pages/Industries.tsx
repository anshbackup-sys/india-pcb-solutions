import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Factory,
  Cpu,
  Heart,
  Car,
  Plane,
  Shield,
  Radio,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const industries = [
  {
    icon: Cpu,
    title: "Consumer Electronics",
    description:
      "From wearables to smart home devices, we manufacture PCBs for consumer products that demand reliability and cost-efficiency.",
    applications: ["Smartphones & Tablets", "Wearables", "Smart Home", "Gaming"],
  },
  {
    icon: Factory,
    title: "Industrial Automation",
    description:
      "Rugged, reliable PCBs for industrial control systems, sensors, and automation equipment built to withstand harsh environments.",
    applications: ["PLCs & Controllers", "Sensors", "Motor Drives", "HMI Panels"],
  },
  {
    icon: Heart,
    title: "Medical Devices",
    description:
      "IPC Class 3 certified manufacturing for life-critical medical devices with full traceability and regulatory compliance.",
    applications: ["Diagnostic Equipment", "Patient Monitors", "Implantables", "Lab Instruments"],
  },
  {
    icon: Car,
    title: "Automotive",
    description:
      "IATF 16949 aligned processes for automotive-grade PCBs meeting strict thermal and reliability requirements.",
    applications: ["ECUs", "Infotainment", "ADAS Systems", "EV Components"],
  },
  {
    icon: Plane,
    title: "Aerospace",
    description:
      "High-reliability PCBs for aerospace applications with specialized materials and rigorous testing protocols.",
    applications: ["Avionics", "Satellite Systems", "Navigation", "Communication"],
  },
  {
    icon: Shield,
    title: "Defence & Security",
    description:
      "Secure manufacturing with strict IP protection for defence electronics and surveillance systems.",
    applications: ["Radar Systems", "Communication", "Surveillance", "Control Systems"],
  },
  {
    icon: Radio,
    title: "Telecommunications",
    description:
      "High-frequency PCBs for 5G, networking equipment, and communication infrastructure.",
    applications: ["5G Infrastructure", "Network Equipment", "Antennas", "Base Stations"],
  },
  {
    icon: Zap,
    title: "Energy & Power",
    description:
      "Power electronics and renewable energy PCBs designed for high current and thermal management.",
    applications: ["Solar Inverters", "EV Chargers", "Power Supplies", "Smart Meters"],
  },
];

export default function Industries() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <div className="container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Industries We Serve
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From consumer electronics to defence systems, we deliver specialized 
            PCB solutions tailored to the unique requirements of each industry.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <industry.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{industry.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {industry.description}
                  </p>
                  <div className="space-y-2">
                    {industry.applications.map((app, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{app}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Industry-Specific Capabilities
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Different industries have different requirements. We've developed 
                specialized capabilities to meet the unique demands of each sector.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">High-Reliability Manufacturing</h4>
                    <p className="text-sm text-muted-foreground">
                      IPC Class 3 capability for aerospace, medical, and defence applications
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Controlled Impedance</h4>
                    <p className="text-sm text-muted-foreground">
                      Precision impedance control for RF and high-speed digital applications
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Thermal Management</h4>
                    <p className="text-sm text-muted-foreground">
                      Metal-core and heavy copper PCBs for power electronics
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Full Traceability</h4>
                    <p className="text-sm text-muted-foreground">
                      Lot tracking and documentation for regulated industries
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
                alt="PCB Manufacturing"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Defence Focus */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 mb-6">
                <Shield className="w-4 h-4" />
                Defence & Strategic Sectors
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Trusted Partner for Defence Electronics
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                BharatPCBs is committed to supporting India's defence manufacturing 
                ecosystem. Our secure facilities, stringent IP protection, and 
                quality processes make us an ideal partner for defence contractors 
                and strategic sector organizations.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  Secure, access-controlled manufacturing
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  100% Indian ownership & operations
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  Custom NDA agreements
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  MIL-spec capabilities available
                </li>
              </ul>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/contact">
                  Contact Defence Sales
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="text-center">
              <div className="text-8xl font-bold text-accent mb-4">🇮🇳</div>
              <p className="text-xl font-semibold">Made in India</p>
              <p className="text-primary-foreground/70">For India's Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Let's Discuss Your Industry Requirements
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our engineering team has experience across all major industries. 
            Share your requirements and we'll provide a tailored solution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/quote">Get a Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Talk to an Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
