import { Link } from "react-router-dom";
import { ArrowRight, Pencil, Cpu, Layers, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Pencil,
    title: "PCB Design & Engineering",
    description: "Schematic design, layout, DFM/DFA review, and BOM optimization.",
    href: "/services#design",
  },
  {
    icon: Cpu,
    title: "PCB Fabrication",
    description: "Single-layer to multilayer, HDI, rigid, flex, rigid-flex, and metal core PCBs.",
    href: "/services#fabrication",
  },
  {
    icon: Layers,
    title: "PCB Assembly (PCBA)",
    description: "SMT, THT, mixed assembly, prototypes, and scalable production.",
    href: "/services#assembly",
  },
  {
    icon: Package,
    title: "Turnkey PCB Solutions",
    description: "Design → Fabrication → Assembly → Testing → Delivery.",
    href: "/services#turnkey",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-gradient-surface">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-up">
            Our PCB Services
          </h2>
          <p className="text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>
            From initial design to final delivery, we cover every step of your PCB manufacturing journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group card-hover border-border bg-card animate-fade-up"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <Link
                  to={service.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
