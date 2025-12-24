import { Upload, Settings, FileCheck, CreditCard, Factory, TestTube, Truck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload PCB Files",
    description: "Upload Gerber, BOM, and Pick & Place files",
  },
  {
    icon: Settings,
    number: "02",
    title: "Configure Specifications",
    description: "Select layers, thickness, finish, and more",
  },
  {
    icon: FileCheck,
    number: "03",
    title: "Get Engineer-Verified Quote",
    description: "Our team reviews and provides accurate pricing",
  },
  {
    icon: CreditCard,
    number: "04",
    title: "Confirm Order",
    description: "Approve the quote and place your order",
  },
  {
    icon: Factory,
    number: "05",
    title: "Manufacturing & Assembly",
    description: "Precision fabrication and component assembly",
  },
  {
    icon: TestTube,
    number: "06",
    title: "Testing & Quality Check",
    description: "Comprehensive testing ensures reliability",
  },
  {
    icon: Truck,
    number: "07",
    title: "Secure Delivery",
    description: "Pan-India delivery with tracking",
  },
];

export function HowItWorksSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-up">
            How It Works
          </h2>
          <p className="text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>
            Simple, transparent process from file upload to delivery
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-border" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center animate-fade-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                {/* Step Number */}
                <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mb-4 z-10">
                  <step.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                
                <div className="text-xs font-bold text-accent mb-2">
                  STEP {step.number}
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-sm">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
