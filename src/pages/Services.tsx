import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Cpu,
  Layers,
  Cog,
  Package,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    id: "design",
    icon: Cpu,
    title: "PCB Design",
    subtitle: "From Concept to Gerber",
    description:
      "Our expert engineers transform your schematic into production-ready PCB layouts. We handle complex multi-layer designs, impedance control, and signal integrity analysis.",
    features: [
      "Schematic review & optimization",
      "Multi-layer PCB layout (up to 32 layers)",
      "Impedance controlled designs",
      "Signal integrity analysis",
      "DFM (Design for Manufacturing) review",
      "Gerber file generation & validation",
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
  },
  {
    id: "fabrication",
    icon: Layers,
    title: "PCB Fabrication",
    subtitle: "Precision Manufacturing",
    description:
      "State-of-the-art manufacturing facilities producing high-quality bare PCBs. From single-layer prototypes to complex multilayer boards with tight tolerances.",
    features: [
      "1 to 32 layer PCBs",
      "FR-4, High-TG, Rogers, Aluminum substrates",
      "Minimum trace/space: 3/3 mil",
      "Controlled impedance ±10%",
      "Multiple surface finishes (HASL, ENIG, OSP)",
      "Blind & buried vias",
    ],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
  },
  {
    id: "assembly",
    icon: Cog,
    title: "PCB Assembly",
    subtitle: "Component Mounting",
    description:
      "Full-service PCBA with SMT and through-hole capabilities. We handle component sourcing, placement, soldering, and inspection under one roof.",
    features: [
      "SMT & Through-hole assembly",
      "BGA, QFN, 0201 component capability",
      "Component sourcing from authorized distributors",
      "Automated optical inspection (AOI)",
      "X-ray inspection for BGAs",
      "Functional testing",
    ],
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80",
  },
  {
    id: "turnkey",
    icon: Package,
    title: "Turnkey Solutions",
    subtitle: "End-to-End Manufacturing",
    description:
      "Complete electronics manufacturing from design to boxed product. We manage the entire supply chain, assembly, testing, and packaging.",
    features: [
      "Full supply chain management",
      "Box-build assembly",
      "Cable & wire harness assembly",
      "Firmware programming",
      "100% functional testing",
      "Custom packaging & labeling",
    ],
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&q=80",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "48-hour express prototypes, 5-7 day standard production",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "ISO 9001 aligned processes with 100% electrical testing",
  },
  {
    icon: Zap,
    title: "Competitive Pricing",
    description: "Direct manufacturer pricing with no hidden costs",
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <div className="container-wide text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Comprehensive PCB manufacturing solutions from prototype to mass production. 
            Every service backed by our commitment to quality and Made in India excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="px-4 py-2 rounded-full bg-muted hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
              >
                {service.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Detail */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-16 lg:py-24 ${index % 2 === 1 ? "bg-muted/30" : ""}`}
        >
          <div className="container-wide">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-accent">{service.subtitle}</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  {service.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/quote">
                    Get Quote for {service.title}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Benefits */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose BharatPCBs?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-primary-foreground/10 border-primary-foreground/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-primary-foreground/70">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload your Gerber files and get a detailed quote within 24 hours. 
            Our engineering team is ready to help.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/quote">
              Get Instant Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
