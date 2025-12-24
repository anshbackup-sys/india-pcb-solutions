import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Cpu, CircuitBoard, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-surface">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary blur-3xl" />
      </div>

      <div className="container-wide section-padding relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Made in India Manufacturing
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
              Powering India's{" "}
              <span className="text-gradient">Electronics Manufacturing</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: "200ms" }}>
              End-to-end PCB manufacturing and assembly platform — from prototype to production, proudly Made in India.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <Button size="lg" className="bg-gradient-accent hover:opacity-90 shadow-glow" asChild>
                <Link to="/quote" className="flex items-center gap-2">
                  Get Instant PCB Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Talk to an Engineer
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border animate-fade-up" style={{ animationDelay: "400ms" }}>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">48hr</div>
                <div className="text-sm text-muted-foreground">Quick Turn Time</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">99.5%</div>
                <div className="text-sm text-muted-foreground">Quality Rate</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating PCB Elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-accent opacity-10 blur-3xl" />
              
              <div className="absolute top-8 left-8 p-4 rounded-2xl bg-card shadow-lg border border-border animate-float" style={{ animationDelay: "0s" }}>
                <CircuitBoard className="w-12 h-12 text-accent" />
              </div>
              
              <div className="absolute top-1/3 right-4 p-4 rounded-2xl bg-card shadow-lg border border-border animate-float" style={{ animationDelay: "0.5s" }}>
                <Cpu className="w-12 h-12 text-primary" />
              </div>
              
              <div className="absolute bottom-1/3 left-4 p-4 rounded-2xl bg-card shadow-lg border border-border animate-float" style={{ animationDelay: "1s" }}>
                <Layers className="w-12 h-12 text-success" />
              </div>

              {/* Center Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-3xl bg-card shadow-xl border border-border">
                <div className="w-40 h-40 rounded-2xl bg-gradient-hero flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <CircuitBoard className="w-16 h-16 mx-auto mb-2" />
                    <span className="text-sm font-medium">PCB Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
