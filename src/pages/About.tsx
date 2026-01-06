import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  MapPin,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Quality First",
    description:
      "Every PCB we manufacture meets rigorous quality standards. We never compromise on quality, even under tight deadlines.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description:
      "Your success is our success. We go above and beyond to ensure your project requirements are met with excellence.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Clear communication, honest pricing, and no hidden surprises. We believe in building trust through transparency.",
  },
  {
    icon: Users,
    title: "Innovation",
    description:
      "Continuously investing in new technologies and processes to deliver cutting-edge solutions for our customers.",
  },
];

const milestones = [
  { year: "2018", title: "Founded", description: "BharatPCBs established in Bengaluru" },
  { year: "2019", title: "First Factory", description: "Opened first manufacturing facility" },
  { year: "2020", title: "SMT Line", description: "Added automated SMT assembly capability" },
  { year: "2022", title: "Expansion", description: "Expanded to 50,000 sq ft facility" },
  { year: "2024", title: "1000+ Customers", description: "Serving customers across 15+ countries" },
];

const stats = [
  { value: "1000+", label: "Happy Customers" },
  { value: "50,000+", label: "PCBs Delivered" },
  { value: "99.8%", label: "Quality Rate" },
  { value: "15+", label: "Countries Served" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                About BharatPCBs
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                We're on a mission to make world-class PCB manufacturing accessible 
                to every innovator in India and beyond.
              </p>
              <p className="text-muted-foreground mb-8">
                Founded in 2018, BharatPCBs has grown from a small prototype shop 
                to a full-scale electronics manufacturing partner. We combine 
                state-of-the-art technology with the craftsmanship and dedication 
                that defines Indian manufacturing excellence.
              </p>
              <div className="flex items-center gap-2 text-accent font-medium">
                <MapPin className="w-5 h-5" />
                Proudly Made in India 🇮🇳
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80"
                alt="BharatPCBs Team"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <p className="text-4xl font-bold">6+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-accent mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To democratize access to high-quality PCB manufacturing by providing 
                  affordable, reliable, and fast turnaround services that empower 
                  innovators to bring their electronic products to life.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  To become India's most trusted electronics manufacturing partner, 
                  known for quality, innovation, and customer success. We envision 
                  a future where "Made in India" is synonymous with world-class quality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-2xl font-bold text-accent mb-1">
                          {milestone.year}
                        </p>
                        <h3 className="font-semibold text-lg mb-2">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:flex w-4 h-4 rounded-full bg-accent flex-shrink-0 relative z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container-wide text-center">
          <Award className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Led by Industry Experts</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Our leadership team brings decades of combined experience in electronics 
            manufacturing, quality assurance, and customer success from leading 
            global companies.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/contact">
              Meet Our Team
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="container-wide text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 1000+ companies who trust BharatPCBs for their PCB manufacturing needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/quote">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
