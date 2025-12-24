import { Shield, Award, Leaf, Lock, CheckCircle } from "lucide-react";

const trustItems = [
  {
    icon: CheckCircle,
    label: "Made in India",
    sublabel: "Manufacturing",
  },
  {
    icon: Award,
    label: "ISO-Aligned",
    sublabel: "Quality Process",
  },
  {
    icon: Shield,
    label: "IPC Standards",
    sublabel: "Followed",
  },
  {
    icon: Leaf,
    label: "RoHS",
    sublabel: "Compliant",
  },
  {
    icon: Lock,
    label: "Secure NDA",
    sublabel: "& IP Protection",
  },
];

export function TrustBar() {
  return (
    <section className="py-8 bg-primary">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {trustItems.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-sm font-semibold text-primary-foreground">
                  {item.label}
                </div>
                <div className="text-xs text-primary-foreground/60">
                  {item.sublabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
