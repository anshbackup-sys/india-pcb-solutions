import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-tight text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground animate-fade-up">
            Complete PCB Solutions Under One Roof
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>
            BharatPCB provides complete PCB solutions including design support, PCB fabrication, component sourcing, assembly, and testing. We help startups, OEMs, and defence-linked industries convert ideas into reliable electronic products with Indian manufacturing excellence.
          </p>
          <div className="pt-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button variant="outline" asChild>
              <Link to="/about" className="flex items-center gap-2">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
