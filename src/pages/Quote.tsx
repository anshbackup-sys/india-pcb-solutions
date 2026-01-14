import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUpload } from "@/components/quote/FileUpload";
import { AdvancedPCBConfigForm, AdvancedPCBConfig } from "@/components/quote/AdvancedPCBConfig";
import { GerberPreview } from "@/components/quote/GerberPreview";
import { PCBPriceCalculator } from "@/components/quote/PCBPriceCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  User, 
  Shield, 
  Loader2, 
  CircuitBoard,
  CheckCircle2,
  Zap,
  Clock,
  Award,
  Eye
} from "lucide-react";

export default function Quote() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pcbConfig, setPcbConfig] = useState<Partial<AdvancedPCBConfig>>({
    boardWidth: "100",
    boardHeight: "100",
    quantity: "10",
    layers: "2",
    solderMask: "Green",
  });
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [acceptNDA, setAcceptNDA] = useState(false);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleConfigChange = (config: Partial<AdvancedPCBConfig>) => {
    setPcbConfig(config);
  };

  const handleSubmit = async (config: AdvancedPCBConfig) => {
    if (files.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one Gerber file.",
        variant: "destructive",
      });
      return;
    }

    if (!user && (!contactInfo.name || !contactInfo.email)) {
      toast({
        title: "Contact information required",
        description: "Please provide your name and email.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptNDA) {
      toast({
        title: "NDA Agreement required",
        description: "Please accept our NDA & Privacy Agreement.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const boardWidth = parseFloat(config.boardWidth) || null;
      const boardHeight = parseFloat(config.boardHeight) || null;
      const quantity = parseInt(config.quantity) || 10;
      const layers = parseInt(config.layers) || 2;

      if (!user) {
        toast({
          title: "Account required",
          description: "Please sign up or log in to submit a quote request.",
        });
        navigate("/auth");
        return;
      }

      const tempOrderNumber = `BPCB-${Date.now()}`;
      
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          order_number: tempOrderNumber,
          user_id: user.id,
          status: "quote_requested" as const,
          board_width: boardWidth,
          board_height: boardHeight,
          quantity: quantity,
          layers: layers,
          board_thickness: config.thickness,
          board_type: config.pcbType,
          material: config.material,
          surface_finish: config.surfaceFinish,
          copper_weight: config.copperWeight,
          inner_copper_weight: config.innerCopperWeight,
          solder_mask_color: config.solderMask,
          silkscreen_color: config.silkscreen,
          min_track_spacing: config.minTrackSpacing,
          min_hole_size: config.minHoleSize,
          via_process: config.viaProcess,
          impedance_control: config.impedanceControl,
          castellated_holes: config.castellatedHoles,
          edge_plating: config.edgePlating,
          gold_fingers: config.goldFingers,
          gold_finger_length: config.goldFingerLength,
          gold_finger_chamfer: config.goldFingerChamfer,
          panelization_type: config.panelizationType,
          ul_marking: config.ulMarking,
          assembly_sides: config.assemblySides,
          component_sourcing: config.componentSourcing,
          stencil_type: config.stencilType,
          xray_inspection: config.xrayInspection,
          conformal_coating: config.conformalCoating,
          ipc_class: config.ipcClass,
          lead_time_type: config.leadTimeType,
          panel_qty: parseInt(config.panelQty) || 1,
          different_designs: parseInt(config.differentDesigns) || 1,
          customer_notes: config.specialRequirements || null,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      for (const file of files) {
        const filePath = `${order.id}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("pcb-files")
          .upload(filePath, file);

        if (uploadError) {
          console.error("File upload error:", uploadError);
          continue;
        }

        await supabase.from("uploaded_files").insert({
          user_id: user.id,
          order_id: order.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type || "application/octet-stream",
        });
      }

      toast({
        title: "Quote request submitted!",
        description: `Order ${order.order_number} created. Our team will review and send you a quote within 24 hours.`,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-8 lg:py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="circuit-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 10 10 M 0 10 L 20 10" stroke="currentColor" strokeWidth="0.5" fill="none"/>
              <circle cx="10" cy="10" r="2" fill="currentColor"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)"/>
          </svg>
        </div>
        <div className="container-wide relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-3 bg-accent/20 text-accent-foreground border-accent/30">
              <CircuitBoard className="w-3 h-3 mr-1" />
              Industry-Grade PCB Manufacturing
            </Badge>
            <h1 className="text-2xl lg:text-4xl font-bold text-primary-foreground mb-3">
              Get Your PCB Quote
            </h1>
            <p className="text-base text-primary-foreground/80">
              Upload Gerber files, configure specs, get instant estimates.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-sm">50+ Options</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm">Real-Time Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm">24-Hour Quote</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-sm">IPC Class 2/3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Quote Form - Two Column Layout */}
      <section className="py-6 lg:py-8 bg-gradient-to-b from-muted/50 to-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Upload, Preview & Contact */}
            <div className="space-y-6">
              {/* File Upload Card */}
              <Card className="border-2 border-dashed border-accent/30 hover:border-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Upload className="w-5 h-5 text-accent" />
                    </div>
                    Upload Gerber Files
                  </CardTitle>
                  <CardDescription>
                    Gerber, ODB++, Eagle, KiCad files (ZIP, RAR, 7z)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFilesChange={handleFilesChange} />
                </CardContent>
              </Card>

              {/* Gerber Preview Card */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3 border-b bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    Real-Time PCB Preview
                  </CardTitle>
                  <CardDescription>
                    Live visualization from your uploaded files
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <GerberPreview 
                    files={files}
                    boardWidth={parseFloat(pcbConfig.boardWidth || "100")}
                    boardHeight={parseFloat(pcbConfig.boardHeight || "100")}
                    layers={parseInt(pcbConfig.layers || "2")}
                    solderMaskColor={pcbConfig.solderMask}
                  />
                </CardContent>
              </Card>

              {/* Price Calculator - Sticky on Desktop */}
              <div className="lg:sticky lg:top-4">
                <PCBPriceCalculator config={pcbConfig} />
              </div>

              {/* Contact Info for Guests */}
              {!user && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={contactInfo.name}
                          onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={contactInfo.company}
                          onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                          placeholder="Company name"
                        />
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        Have an account?{" "}
                        <a href="/auth" className="text-accent font-medium hover:underline">
                          Sign in for faster checkout
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* NDA Agreement */}
              <Card className="border-success/30 bg-success/5">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="nda"
                      checked={acceptNDA}
                      onCheckedChange={(checked) => setAcceptNDA(checked === true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-success" />
                        <span className="font-medium text-sm">NDA & Data Protection</span>
                      </div>
                      <label htmlFor="nda" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        I agree to the{" "}
                        <a href="/privacy" className="text-accent font-medium hover:underline">
                          Privacy Agreement
                        </a>. Complete confidentiality guaranteed.
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - PCB Configuration */}
            <div className="space-y-6">
              <Card className="shadow-lg border-2">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent rounded-lg">
                        <CircuitBoard className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <CardTitle>PCB Specifications</CardTitle>
                        <CardDescription>Configure all fabrication parameters</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-accent border-accent/30">
                      JLCPCB Compatible
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <AdvancedPCBConfigForm 
                    onSubmit={handleSubmit} 
                    onChange={handleConfigChange}
                    isSubmitting={isSubmitting} 
                  />
                  
                  {/* Submit Button */}
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      type="submit"
                      form="pcb-config-form"
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25 h-12 text-lg"
                      size="lg"
                      disabled={isSubmitting || files.length === 0 || !acceptNDA}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting Quote Request...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 mr-2" />
                          Submit Quote Request
                        </>
                      )}
                    </Button>
                    {(files.length === 0 || !acceptNDA) && (
                      <p className="text-xs text-destructive text-center mt-2">
                        {files.length === 0 ? "Upload files to continue" : "Accept NDA to continue"}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Our engineers will review and send a quote within 24 hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-8 bg-muted/30 border-t">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Secure</h3>
              <p className="text-xs text-muted-foreground">NDA Protected</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Fast</h3>
              <p className="text-xs text-muted-foreground">24hr Turnaround</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Quality</h3>
              <p className="text-xs text-muted-foreground">IPC Certified</p>
            </div>
            <div className="p-4">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-lg">🇮🇳</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">Made in India</h3>
              <p className="text-xs text-muted-foreground">Local Support</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
