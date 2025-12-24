import { MapPin, Clock, Shield } from "lucide-react";

const benefits = [
  {
    icon: MapPin,
    title: "Reduced Import Dependency",
    description: "Manufacturing locally eliminates delays and ensures supply chain reliability.",
  },
  {
    icon: Clock,
    title: "Faster Turnaround",
    description: "No customs delays. Get your PCBs faster with local manufacturing.",
  },
  {
    icon: Shield,
    title: "Strict Confidentiality",
    description: "Your designs stay protected with NDA and IP protection policies.",
  },
];

export function MakeInIndiaSection() {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-medium">
              🇮🇳 Atmanirbhar Bharat
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground animate-fade-up">
              Proudly Manufacturing Electronics in India
            </h2>
            <p className="text-lg text-primary-foreground/70 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Supporting Indian startups, MSMEs, and industries by reducing import dependency, ensuring faster turnaround, and maintaining strict confidentiality aligned with the vision of Atmanirbhar Bharat.
            </p>
          </div>

          <div className="grid gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="flex gap-4 p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/60">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
