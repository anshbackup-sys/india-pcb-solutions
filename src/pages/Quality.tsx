import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Shield,
  Award,
  CheckCircle2,
  Microscope,
  FileCheck,
  Leaf,
  ArrowRight,
} from "lucide-react";

const certifications = [
  {
    icon: Award,
    title: "ISO 9001:2015 Aligned",
    description:
      "Our quality management system follows ISO 9001:2015 standards for consistent, high-quality manufacturing processes.",
  },
  {
    icon: FileCheck,
    title: "IPC Class 2 & 3",
    description:
      "We manufacture to IPC-A-600 and IPC-A-610 standards for both general electronics and high-reliability applications.",
  },
  {
    icon: Leaf,
    title: "RoHS Compliant",
    description:
      "All our products meet EU RoHS directive requirements for restriction of hazardous substances.",
  },
  {
    icon: Shield,
    title: "UL Certified Materials",
    description:
      "We use only UL-approved laminates and materials for safety and reliability.",
  },
];

const qcProcesses = [
  {
    step: "01",
    title: "Incoming Material Inspection",
    description:
      "Every batch of raw materials undergoes thorough testing to verify specifications and quality before use.",
  },
  {
    step: "02",
    title: "In-Process Quality Checks",
    description:
      "Multiple inspection points throughout manufacturing ensure defects are caught and corrected early.",
  },
  {
    step: "03",
    title: "Automated Optical Inspection",
    description:
      "100% AOI coverage detects surface defects, missing components, and solder issues automatically.",
  },
  {
    step: "04",
    title: "Electrical Testing",
    description:
      "Every board undergoes flying probe or fixture testing to verify electrical continuity and isolation.",
  },
  {
    step: "05",
    title: "X-Ray Inspection",
    description:
      "BGA and hidden solder joints are inspected using advanced X-ray imaging technology.",
  },
  {
    step: "06",
    title: "Final QC & Documentation",
    description:
      "Comprehensive final inspection with full test reports and certificates of conformance.",
  },
];

const testingCapabilities = [
  "Flying Probe Testing",
  "Automated Optical Inspection (AOI)",
  "X-Ray Inspection",
  "Impedance Testing",
  "Microsection Analysis",
  "Solder Paste Inspection (SPI)",
  "In-Circuit Testing (ICT)",
  "Functional Testing",
  "Burn-in Testing",
  "Environmental Stress Screening",
];

export default function Quality() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Shield className="w-4 h-4" />
            Quality Assurance
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Uncompromising Quality Standards
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every PCB we manufacture undergoes rigorous quality control to ensure 
            reliability, performance, and compliance with international standards.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 lg:py-24">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-4">
            Certifications & Standards
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We adhere to industry-leading standards and maintain certifications 
            that demonstrate our commitment to quality.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <cert.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* QC Process */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-4">
            Our Quality Control Process
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            A 6-step quality assurance process ensures every board meets 
            specifications before shipping.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qcProcesses.map((process, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <span className="absolute top-4 right-4 text-6xl font-bold text-muted/50">
                    {process.step}
                  </span>
                  <h3 className="font-semibold text-lg mb-2 relative z-10">
                    {process.title}
                  </h3>
                  <p className="text-sm text-muted-foreground relative z-10">
                    {process.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Capabilities */}
      <section className="py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Microscope className="w-6 h-6 text-accent" />
                <span className="text-sm font-medium text-accent">Testing Lab</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">
                Advanced Testing Capabilities
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our state-of-the-art testing laboratory is equipped with the latest 
                inspection and testing equipment to verify every aspect of your PCB.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {testingCapabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80"
                alt="Quality Testing Lab"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
                <p className="text-4xl font-bold">99.8%</p>
                <p className="text-sm">First-Pass Yield</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold mb-6">Our Quality Commitment</h2>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            We stand behind every board we manufacture. If any PCB fails to meet 
            specifications, we'll remake it at no additional cost.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/quote">
              Experience Our Quality
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
