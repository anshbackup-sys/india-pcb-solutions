import { Link } from "react-router-dom";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="section-padding bg-gradient-surface">
      <div className="container-tight">
        <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-card border border-border overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground animate-fade-up">
              Ready to Manufacture Your PCB?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "100ms" }}>
              Upload your files and get started today. Our engineering team will review your requirements and provide a detailed quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <Button size="lg" className="bg-gradient-accent hover:opacity-90 shadow-glow" asChild>
                <Link to="/quote" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Files & Get Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/services" className="flex items-center gap-2">
                  Explore Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
