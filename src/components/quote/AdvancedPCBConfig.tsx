import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Layers, 
  Zap, 
  Palette, 
  Cpu, 
  TestTube, 
  Clock,
  Settings2,
  Sparkles
} from "lucide-react";

const advancedPcbSchema = z.object({
  // Board Basics
  boardWidth: z.string().min(1, "Required"),
  boardHeight: z.string().min(1, "Required"),
  quantity: z.string().min(1, "Required"),
  panelQty: z.string().default("1"),
  differentDesigns: z.string().default("1"),
  
  // Board Specifications
  layers: z.string().min(1, "Required"),
  pcbType: z.string().default("rigid"),
  material: z.string().default("FR-4"),
  thickness: z.string().default("1.6mm"),
  
  // Copper
  copperWeight: z.string().default("1oz"),
  innerCopperWeight: z.string().default("0.5oz"),
  minTrackSpacing: z.string().default("6/6mil"),
  minHoleSize: z.string().default("0.3mm"),
  
  // Surface & Finish
  surfaceFinish: z.string().default("HASL Lead-Free"),
  solderMask: z.string().default("Green"),
  silkscreen: z.string().default("White"),
  viaProcess: z.string().default("tenting"),
  
  // Advanced Options
  impedanceControl: z.boolean().default(false),
  castellatedHoles: z.boolean().default(false),
  edgePlating: z.boolean().default(false),
  goldFingers: z.boolean().default(false),
  goldFingerLength: z.string().optional(),
  goldFingerChamfer: z.string().optional(),
  panelizationType: z.string().default("none"),
  ulMarking: z.boolean().default(false),
  
  // Assembly
  assemblySides: z.string().default("none"),
  assemblyType: z.string().default("prototype"),
  componentSourcing: z.string().default("customer"),
  stencilType: z.string().default("none"),
  xrayInspection: z.boolean().default(false),
  conformalCoating: z.string().default("none"),
  
  // Testing
  electricalTesting: z.string().default("flying_probe"),
  aoiTesting: z.boolean().default(false),
  xrayTesting: z.boolean().default(false),
  ipcClass: z.string().default("class2"),
  
  // Lead Time
  leadTimeType: z.string().default("standard"),
  
  // Notes
  specialRequirements: z.string().optional(),
});

export type AdvancedPCBConfig = z.infer<typeof advancedPcbSchema>;

interface AdvancedPCBConfigFormProps {
  onSubmit: (data: AdvancedPCBConfig) => void;
  onChange?: (data: Partial<AdvancedPCBConfig>) => void;
  isSubmitting?: boolean;
}

const OPTIONS = {
  pcbType: [
    { value: "rigid", label: "Rigid PCB" },
    { value: "flex", label: "Flex PCB" },
    { value: "rigid_flex", label: "Rigid-Flex" },
    { value: "aluminum", label: "Aluminum Core" },
    { value: "copper_core", label: "Copper Core" },
    { value: "rf", label: "RF/High Frequency" },
  ],
  layers: ["1", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20"],
  material: [
    { value: "FR-4", label: "FR-4 Standard" },
    { value: "FR-4 High TG", label: "FR-4 High TG (Tg170°C)" },
    { value: "FR-4 Ultra High TG", label: "FR-4 Ultra High TG (Tg180°C)" },
    { value: "Aluminum", label: "Aluminum Base" },
    { value: "Rogers 4003C", label: "Rogers 4003C" },
    { value: "Rogers 4350B", label: "Rogers 4350B" },
    { value: "Polyimide", label: "Polyimide (Flex)" },
    { value: "PTFE", label: "PTFE/Teflon" },
  ],
  thickness: ["0.4mm", "0.6mm", "0.8mm", "1.0mm", "1.2mm", "1.6mm", "2.0mm", "2.4mm", "2.5mm", "3.0mm"],
  copperWeight: [
    { value: "1oz", label: "1 oz (35μm)" },
    { value: "2oz", label: "2 oz (70μm)" },
    { value: "2.5oz", label: "2.5 oz (88μm)" },
    { value: "3.5oz", label: "3.5 oz (123μm)" },
    { value: "4.5oz", label: "4.5 oz (158μm)" },
  ],
  innerCopperWeight: [
    { value: "0.5oz", label: "0.5 oz (18μm)" },
    { value: "1oz", label: "1 oz (35μm)" },
    { value: "2oz", label: "2 oz (70μm)" },
  ],
  minTrackSpacing: [
    { value: "3/3mil", label: "3/3 mil (Premium)" },
    { value: "4/4mil", label: "4/4 mil" },
    { value: "5/5mil", label: "5/5 mil" },
    { value: "6/6mil", label: "6/6 mil (Standard)" },
    { value: "8/8mil", label: "8/8 mil" },
  ],
  minHoleSize: [
    { value: "0.15mm", label: "0.15mm (Premium)" },
    { value: "0.2mm", label: "0.2mm" },
    { value: "0.25mm", label: "0.25mm" },
    { value: "0.3mm", label: "0.3mm (Standard)" },
    { value: "0.4mm", label: "0.4mm" },
  ],
  surfaceFinish: [
    { value: "HASL Leaded", label: "HASL (Leaded)" },
    { value: "HASL Lead-Free", label: "HASL (Lead-Free)" },
    { value: "ENIG 1U", label: "ENIG 1U\" Gold" },
    { value: "ENIG 2U", label: "ENIG 2U\" Gold" },
    { value: "OSP", label: "OSP" },
    { value: "Immersion Silver", label: "Immersion Silver" },
    { value: "Immersion Tin", label: "Immersion Tin" },
    { value: "Hard Gold", label: "Hard Gold" },
  ],
  solderMask: [
    { value: "Green", label: "Green", color: "#1a5f1a" },
    { value: "Black", label: "Black", color: "#1a1a1a" },
    { value: "White", label: "White", color: "#e5e5e5" },
    { value: "Blue", label: "Blue", color: "#1a3d5c" },
    { value: "Red", label: "Red", color: "#8b1a1a" },
    { value: "Yellow", label: "Yellow", color: "#b5a020" },
    { value: "Purple", label: "Purple", color: "#4a1a6b" },
    { value: "Matte Black", label: "Matte Black", color: "#0d0d0d" },
    { value: "Matte Green", label: "Matte Green", color: "#145214" },
  ],
  silkscreen: [
    { value: "White", label: "White" },
    { value: "Black", label: "Black" },
    { value: "Yellow", label: "Yellow" },
    { value: "None", label: "None" },
  ],
  viaProcess: [
    { value: "tenting", label: "Tenting" },
    { value: "plugged_soldermask", label: "Plugged (Soldermask)" },
    { value: "via_in_pad_epoxy", label: "Via-in-Pad (Epoxy Filled)" },
    { value: "via_in_pad_copper", label: "Via-in-Pad (Copper Filled)" },
  ],
  panelization: [
    { value: "none", label: "No Panelization" },
    { value: "v_cut", label: "V-Cut" },
    { value: "tab_routed", label: "Tab-Routed" },
    { value: "mouse_bites", label: "Mouse Bites" },
    { value: "stamp_holes", label: "Stamp Holes" },
  ],
  goldFingerChamfer: [
    { value: "none", label: "No Chamfer" },
    { value: "20deg", label: "20°" },
    { value: "30deg", label: "30°" },
    { value: "45deg", label: "45°" },
  ],
  assemblySides: [
    { value: "none", label: "No Assembly" },
    { value: "top", label: "Top Side Only" },
    { value: "bottom", label: "Bottom Side Only" },
    { value: "both", label: "Both Sides" },
  ],
  assemblyType: [
    { value: "prototype", label: "Prototype" },
    { value: "small_batch", label: "Small Batch" },
    { value: "mass_production", label: "Mass Production" },
  ],
  componentSourcing: [
    { value: "customer", label: "Customer Supplied" },
    { value: "bharatpcbs", label: "BharatPCBs Sourced" },
    { value: "hybrid", label: "Hybrid" },
  ],
  stencil: [
    { value: "none", label: "No Stencil" },
    { value: "frameless", label: "Frameless Stencil" },
    { value: "framed", label: "Framed Stencil" },
  ],
  conformalCoating: [
    { value: "none", label: "No Coating" },
    { value: "acrylic", label: "Acrylic" },
    { value: "silicone", label: "Silicone" },
    { value: "urethane", label: "Urethane" },
    { value: "epoxy", label: "Epoxy" },
  ],
  electricalTesting: [
    { value: "flying_probe", label: "Flying Probe" },
    { value: "fixture", label: "Fixture Test" },
    { value: "none", label: "No Testing" },
  ],
  ipcClass: [
    { value: "class1", label: "IPC Class 1 (General)" },
    { value: "class2", label: "IPC Class 2 (Standard)" },
    { value: "class3", label: "IPC Class 3 (High Reliability)" },
  ],
  leadTime: [
    { value: "standard", label: "Standard", days: "10-12 days" },
    { value: "expedited", label: "Expedited", days: "7-8 days" },
    { value: "express", label: "Express", days: "5-6 days" },
    { value: "rush", label: "Rush", days: "3-4 days" },
    { value: "super_rush", label: "Super Rush", days: "24-48 hours" },
  ],
};

export function AdvancedPCBConfigForm({ onSubmit, onChange, isSubmitting }: AdvancedPCBConfigFormProps) {
  const form = useForm<AdvancedPCBConfig>({
    resolver: zodResolver(advancedPcbSchema),
    defaultValues: {
      boardWidth: "",
      boardHeight: "",
      quantity: "10",
      panelQty: "1",
      differentDesigns: "1",
      layers: "2",
      pcbType: "rigid",
      material: "FR-4",
      thickness: "1.6mm",
      copperWeight: "1oz",
      innerCopperWeight: "0.5oz",
      minTrackSpacing: "6/6mil",
      minHoleSize: "0.3mm",
      surfaceFinish: "HASL Lead-Free",
      solderMask: "Green",
      silkscreen: "White",
      viaProcess: "tenting",
      impedanceControl: false,
      castellatedHoles: false,
      edgePlating: false,
      goldFingers: false,
      panelizationType: "none",
      ulMarking: false,
      assemblySides: "none",
      assemblyType: "prototype",
      componentSourcing: "customer",
      stencilType: "none",
      xrayInspection: false,
      conformalCoating: "none",
      electricalTesting: "flying_probe",
      aoiTesting: false,
      xrayTesting: false,
      ipcClass: "class2",
      leadTimeType: "standard",
      specialRequirements: "",
    },
  });

  // Watch for changes and notify parent
  const watchedValues = form.watch();
  
  // Debounced onChange
  const handleChange = () => {
    if (onChange) {
      onChange(watchedValues);
    }
  };

  // Trigger onChange when values change
  form.watch(() => handleChange());

  const watchGoldFingers = form.watch("goldFingers");
  const watchLayers = form.watch("layers");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="pcb-config-form">
        <Tabs defaultValue="board" className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="board" className="flex items-center gap-1 text-xs">
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">Board</span>
            </TabsTrigger>
            <TabsTrigger value="copper" className="flex items-center gap-1 text-xs">
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Copper</span>
            </TabsTrigger>
            <TabsTrigger value="surface" className="flex items-center gap-1 text-xs">
              <Palette className="w-3 h-3" />
              <span className="hidden sm:inline">Surface</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1 text-xs">
              <Settings2 className="w-3 h-3" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="assembly" className="flex items-center gap-1 text-xs">
              <Cpu className="w-3 h-3" />
              <span className="hidden sm:inline">Assembly</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-1 text-xs">
              <TestTube className="w-3 h-3" />
              <span className="hidden sm:inline">Testing</span>
            </TabsTrigger>
          </TabsList>

          {/* Board Specifications Tab */}
          <TabsContent value="board" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  Board Dimensions & Quantity
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="boardWidth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width (mm) *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="boardHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (mm) *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="panelQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Panels</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="1" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">Boards per panel</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="differentDesigns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designs</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="10" placeholder="1" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">Different designs</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pcbType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PCB Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.pcbType.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="layers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layers *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.layers.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt} Layer{opt !== "1" ? "s" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Material</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.material.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thickness"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thickness</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.thickness.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Copper Tab */}
          <TabsContent value="copper" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  Copper Specifications
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="copperWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Outer Copper Weight</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.copperWeight.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  {parseInt(watchLayers) >= 4 && (
                    <FormField
                      control={form.control}
                      name="innerCopperWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inner Copper Weight</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {OPTIONS.innerCopperWeight.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minTrackSpacing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Track/Spacing</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.minTrackSpacing.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minHoleSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Hole Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.minHoleSize.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Surface & Finish Tab */}
          <TabsContent value="surface" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-accent" />
                  Surface Finish & Colors
                </h3>
                
                <FormField
                  control={form.control}
                  name="surfaceFinish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface Finish</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OPTIONS.surfaceFinish.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="solderMask"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solder Mask Color</FormLabel>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {OPTIONS.solderMask.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                              field.value === opt.value
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-accent/50"
                            }`}
                          >
                            <div
                              className="w-8 h-8 rounded-full border"
                              style={{ backgroundColor: opt.color }}
                            />
                            <span className="text-xs">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="silkscreen"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Silkscreen Color</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.silkscreen.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="viaProcess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Via Process</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.viaProcess.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Options Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-accent" />
                  Advanced Options
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="impedanceControl"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Impedance Control</FormLabel>
                          <FormDescription>Controlled impedance for high-speed designs</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="castellatedHoles"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Castellated Holes</FormLabel>
                          <FormDescription>Half-holes for module integration</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="edgePlating"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Edge Plating</FormLabel>
                          <FormDescription>Copper plating on board edges</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goldFingers"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Gold Fingers</FormLabel>
                          <FormDescription>Hard gold plating for edge connectors</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchGoldFingers && (
                    <div className="grid grid-cols-2 gap-4 ml-4 p-4 bg-muted/30 rounded-lg">
                      <FormField
                        control={form.control}
                        name="goldFingerLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Finger Length (mm)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" placeholder="20" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="goldFingerChamfer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chamfer Angle</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {OPTIONS.goldFingerChamfer.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="ulMarking"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">UL Marking</FormLabel>
                          <FormDescription>UL certification marking on PCB</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="panelizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Panelization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.panelization.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assembly Tab */}
          <TabsContent value="assembly" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent" />
                  Assembly Services
                </h3>
                
                <FormField
                  control={form.control}
                  name="assemblySides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assembly Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OPTIONS.assemblySides.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assemblyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assembly Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.assemblyType.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="componentSourcing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Component Sourcing</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.componentSourcing.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stencilType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stencil</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.stencil.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="conformalCoating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conformal Coating</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.conformalCoating.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="xrayInspection"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">X-Ray Inspection</FormLabel>
                        <FormDescription>BGA and hidden joint inspection</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-accent" />
                  Testing & Quality
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="electricalTesting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Electrical Testing</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.electricalTesting.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ipcClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IPC Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OPTIONS.ipcClass.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="aoiTesting"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">AOI Testing</FormLabel>
                        <FormDescription>Automated Optical Inspection</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="xrayTesting"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">X-Ray Testing</FormLabel>
                        <FormDescription>Hidden solder joint verification</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leadTimeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Lead Time
                      </FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {OPTIONS.leadTime.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                              field.value === opt.value
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-accent/50"
                            }`}
                          >
                            <span className="font-medium text-sm">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">{opt.days}</span>
                          </button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements, blind/buried vias, specific testing needs, etc..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
