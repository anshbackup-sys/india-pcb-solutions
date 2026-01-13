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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, User, Shield, Loader2, Calculator } from "lucide-react";

export default function Quote() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pcbConfig, setPcbConfig] = useState<Partial<AdvancedPCBConfig>>({});
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

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || "00000000-0000-0000-0000-000000000000",
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
          customer_notes: `${config.specialRequirements || ""}${!user ? `\nGuest: ${contactInfo.name}, ${contactInfo.email}, ${contactInfo.phone || "N/A"}, ${contactInfo.company || "N/A"}` : ""}`,
        })
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
          user_id: user?.id || "00000000-0000-0000-0000-000000000000",
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

      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
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
      <div className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-16">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Get Your PCB Quote
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Industry-leading specifications with real-time pricing. Upload your Gerber files, configure every detail, and get an instant estimate.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - File Upload & Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-accent" />
                    Upload Gerber Files
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload onFilesChange={handleFilesChange} />
                </CardContent>
              </Card>

              <GerberPreview 
                files={files}
                boardWidth={parseFloat(pcbConfig.boardWidth || "100")}
                boardHeight={parseFloat(pcbConfig.boardHeight || "100")}
                layers={parseInt(pcbConfig.layers || "2")}
                solderMaskColor={pcbConfig.solderMask}
              />

              {!user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-accent" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <a href="/auth" className="text-accent hover:underline">Sign in</a>
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent" />
                    NDA & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="nda"
                      checked={acceptNDA}
                      onCheckedChange={(checked) => setAcceptNDA(checked === true)}
                    />
                    <label htmlFor="nda" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <a href="/privacy" className="text-accent hover:underline">NDA & Privacy Agreement</a>.
                      BharatPCBs guarantees complete confidentiality of all uploaded files and design data.
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column - PCB Configuration */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-accent" />
                    PCB Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedPCBConfigForm 
                    onSubmit={handleSubmit} 
                    onChange={handleConfigChange}
                    isSubmitting={isSubmitting} 
                  />
                  <Button
                    type="submit"
                    form="pcb-config-form"
                    className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Quote Request"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Price Calculator */}
            <div>
              <PCBPriceCalculator config={pcbConfig} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
