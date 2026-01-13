import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Maximize2,
  Grid3X3
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GerberPreviewProps {
  files: File[];
  boardWidth?: number;
  boardHeight?: number;
  layers?: number;
  solderMaskColor?: string;
}

interface LayerInfo {
  name: string;
  type: string;
  visible: boolean;
  color: string;
  icon: string;
}

const SOLDER_MASK_COLORS: Record<string, { bg: string; border: string }> = {
  "Green": { bg: "#1a5f1a", border: "#2d8a2d" },
  "Black": { bg: "#1a1a1a", border: "#333333" },
  "White": { bg: "#e5e5e5", border: "#cccccc" },
  "Blue": { bg: "#1a3d5c", border: "#2a5580" },
  "Red": { bg: "#8b1a1a", border: "#b02525" },
  "Yellow": { bg: "#b5a020", border: "#d4bc28" },
  "Matte Black": { bg: "#0d0d0d", border: "#262626" },
  "Matte Green": { bg: "#145214", border: "#1f7a1f" },
  "Purple": { bg: "#4a1a6b", border: "#6b2899" },
};

const LAYER_COLORS: Record<string, string> = {
  "Top Copper": "#ff6b6b",
  "Bottom Copper": "#4dabf7",
  "Inner Layer": "#ffd43b",
  "Top Solder Mask": "#1a5f1a",
  "Bottom Solder Mask": "#145214",
  "Top Silkscreen": "#ffffff",
  "Bottom Silkscreen": "#f0f0f0",
  "Drill": "#ffd43b",
  "Board Outline": "#20c997",
  "Solder Paste": "#adb5bd",
  "Unknown": "#888888",
};

export function GerberPreview({ 
  files, 
  boardWidth = 100, 
  boardHeight = 100, 
  layers = 2,
  solderMaskColor = "Green"
}: GerberPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("preview");

  const detectLayerType = (fileName: string): { type: string; color: string } => {
    const name = fileName.toLowerCase();
    
    if (name.includes("gtl") || (name.includes("top") && name.includes("copper")) || name.includes("f_cu")) {
      return { type: "Top Copper", color: LAYER_COLORS["Top Copper"] };
    }
    if (name.includes("gbl") || (name.includes("bottom") && name.includes("copper")) || name.includes("b_cu")) {
      return { type: "Bottom Copper", color: LAYER_COLORS["Bottom Copper"] };
    }
    if (name.includes("gts") || (name.includes("top") && name.includes("mask")) || name.includes("f_mask")) {
      const maskColor = SOLDER_MASK_COLORS[solderMaskColor]?.bg || LAYER_COLORS["Top Solder Mask"];
      return { type: "Top Solder Mask", color: maskColor };
    }
    if (name.includes("gbs") || (name.includes("bottom") && name.includes("mask")) || name.includes("b_mask")) {
      const maskColor = SOLDER_MASK_COLORS[solderMaskColor]?.bg || LAYER_COLORS["Bottom Solder Mask"];
      return { type: "Bottom Solder Mask", color: maskColor };
    }
    if (name.includes("gto") || (name.includes("top") && name.includes("silk")) || name.includes("f_silks")) {
      return { type: "Top Silkscreen", color: LAYER_COLORS["Top Silkscreen"] };
    }
    if (name.includes("gbo") || (name.includes("bottom") && name.includes("silk")) || name.includes("b_silks")) {
      return { type: "Bottom Silkscreen", color: LAYER_COLORS["Bottom Silkscreen"] };
    }
    if (name.includes("drl") || name.includes("drill") || name.includes("xln") || name.includes("exc")) {
      return { type: "Drill", color: LAYER_COLORS["Drill"] };
    }
    if (name.includes("gko") || name.includes("outline") || name.includes("edge") || name.includes("gm1")) {
      return { type: "Board Outline", color: LAYER_COLORS["Board Outline"] };
    }
    if (name.includes("gtp") || name.includes("gbp") || name.includes("paste")) {
      return { type: "Solder Paste", color: LAYER_COLORS["Solder Paste"] };
    }
    if (name.includes("g2") || name.includes("g3") || name.includes("in1") || name.includes("in2")) {
      return { type: "Inner Layer", color: LAYER_COLORS["Inner Layer"] };
    }
    
    return { type: "Unknown", color: LAYER_COLORS["Unknown"] };
  };

  const detectedLayers: LayerInfo[] = useMemo(() => {
    return files.map((file) => {
      const { type, color } = detectLayerType(file.name);
      return {
        name: file.name,
        type,
        visible: layerVisibility[file.name] !== false,
        color,
        icon: type.includes("Copper") ? "⚡" : type.includes("Mask") ? "🎨" : type.includes("Silk") ? "✍️" : type.includes("Drill") ? "⚫" : type.includes("Outline") ? "📐" : "📄",
      };
    });
  }, [files, layerVisibility, solderMaskColor]);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    files.forEach((f) => {
      if (layerVisibility[f.name] === undefined) {
        initial[f.name] = true;
      }
    });
    if (Object.keys(initial).length > 0) {
      setLayerVisibility((prev) => ({ ...prev, ...initial }));
    }
  }, [files]);

  const toggleLayer = (fileName: string) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };

  const drcChecks = useMemo(() => [
    { 
      name: "Board Dimensions", 
      status: boardWidth > 0 && boardHeight > 0 && boardWidth <= 500 && boardHeight <= 500, 
      message: boardWidth > 0 ? `${boardWidth} × ${boardHeight} mm` : "Not specified",
      critical: true
    },
    { 
      name: "Layer Count", 
      status: layers >= 1 && layers <= 20, 
      message: `${layers} layer${layers > 1 ? 's' : ''}`,
      critical: true
    },
    { 
      name: "Gerber Files", 
      status: files.length >= 2, 
      message: files.length > 0 ? `${files.length} files` : "No files",
      critical: true
    },
    { 
      name: "Drill File", 
      status: detectedLayers.some(l => l.type === "Drill"), 
      message: detectedLayers.some(l => l.type === "Drill") ? "✓ Found" : "⚠ Missing",
      critical: true
    },
    { 
      name: "Board Outline", 
      status: detectedLayers.some(l => l.type === "Board Outline"), 
      message: detectedLayers.some(l => l.type === "Board Outline") ? "✓ Found" : "Optional",
      critical: false
    },
    { 
      name: "Copper Layers", 
      status: detectedLayers.some(l => l.type.includes("Copper")), 
      message: detectedLayers.filter(l => l.type.includes("Copper")).length + " detected",
      critical: true
    },
  ], [boardWidth, boardHeight, layers, files, detectedLayers]);

  const maskColors = SOLDER_MASK_COLORS[solderMaskColor] || SOLDER_MASK_COLORS["Green"];

  if (files.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Layers className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No Files Uploaded</h3>
          <p className="text-sm text-muted-foreground max-w-[200px]">
            Upload your Gerber files to see a preview of your PCB design
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-accent/10 rounded-lg">
              <Layers className="w-4 h-4 text-accent" />
            </div>
            PCB Preview
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRotation(r => (r + 90) % 360)}>
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 rounded-none border-b h-10">
            <TabsTrigger value="preview" className="text-xs gap-1">
              <Grid3X3 className="w-3 h-3" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-xs gap-1">
              <Layers className="w-3 h-3" />
              Layers ({files.length})
            </TabsTrigger>
            <TabsTrigger value="drc" className="text-xs gap-1">
              <CheckCircle2 className="w-3 h-3" />
              DRC
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="m-0">
            <div className="relative bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden" style={{ height: '280px' }}>
              {/* Grid background */}
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="preview-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#preview-grid)" />
                </svg>
              </div>
              
              {/* PCB Preview */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              >
                <div 
                  className="relative rounded-sm shadow-2xl"
                  style={{
                    width: `${Math.min(180, Math.max(80, boardWidth * 0.8))}px`,
                    height: `${Math.min(180, Math.max(80, boardHeight * 0.8))}px`,
                    backgroundColor: maskColors.bg,
                    border: `3px solid ${maskColors.border}`,
                  }}
                >
                  {/* PCB Surface Pattern */}
                  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }}>
                    <defs>
                      <pattern id="pcb-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pcb-grid)" />
                    
                    {/* Copper traces */}
                    <g stroke="#d4a03a" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 15% 25% L 40% 25% L 40% 50% L 85% 50%" strokeWidth="2.5"/>
                      <path d="M 25% 15% L 25% 45% L 60% 45% L 60% 85%" strokeWidth="2"/>
                      <path d="M 70% 20% L 70% 35% L 50% 35%" strokeWidth="1.5"/>
                      <path d="M 35% 70% L 55% 70% L 55% 55%" strokeWidth="2"/>
                    </g>
                    
                    {/* Via holes */}
                    <g>
                      <circle cx="40%" cy="50%" r="4" fill="#d4a03a" stroke="#1a1a1a" strokeWidth="1"/>
                      <circle cx="25%" cy="45%" r="3" fill="#d4a03a" stroke="#1a1a1a" strokeWidth="1"/>
                      <circle cx="60%" cy="45%" r="3" fill="#d4a03a" stroke="#1a1a1a" strokeWidth="1"/>
                      <circle cx="55%" cy="55%" r="3" fill="#d4a03a" stroke="#1a1a1a" strokeWidth="1"/>
                    </g>
                    
                    {/* Component pads */}
                    <g fill="#d4a03a">
                      <rect x="10%" y="20%" width="10%" height="10%" rx="1"/>
                      <rect x="80%" y="45%" width="10%" height="10%" rx="1"/>
                      <rect x="30%" y="65%" width="15%" height="8%" rx="1"/>
                      <rect x="65%" y="75%" width="12%" height="12%" rx="1"/>
                    </g>
                    
                    {/* IC footprint */}
                    <g fill="#d4a03a" transform="translate(55, 20)">
                      <rect x="0" y="0" width="20%" height="3" rx="0.5"/>
                      <rect x="0" y="5" width="20%" height="3" rx="0.5"/>
                      <rect x="0" y="10" width="20%" height="3" rx="0.5"/>
                      <rect x="0" y="15" width="20%" height="3" rx="0.5"/>
                    </g>
                    
                    {/* Silkscreen text simulation */}
                    <text x="50%" y="92%" textAnchor="middle" fill="#ffffff" fontSize="6" fontFamily="monospace" opacity="0.8">
                      BharatPCBs
                    </text>
                  </svg>
                  
                  {/* Dimension labels */}
                  <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap font-mono bg-background/80 px-1 rounded">
                    {boardWidth}mm
                  </div>
                  <div className="absolute -right-9 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap rotate-90 font-mono bg-background/80 px-1 rounded">
                    {boardHeight}mm
                  </div>
                </div>
              </div>

              {/* Layer badge */}
              <div className="absolute top-3 left-3">
                <Badge className="text-xs bg-primary/90">
                  {layers}L PCB
                </Badge>
              </div>
              
              {/* Expand button */}
              <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-7 w-7 bg-background/50 hover:bg-background/80">
                <Maximize2 className="w-3 h-3" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="m-0">
            <ScrollArea className="h-[280px]">
              <div className="p-3 space-y-2">
                {detectedLayers.map((layer) => (
                  <div
                    key={layer.name}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-all",
                      layerVisibility[layer.name] 
                        ? "bg-muted/50 hover:bg-muted" 
                        : "bg-muted/20 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 border-2"
                      style={{ backgroundColor: layer.color, borderColor: layer.color }}
                    />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{layer.name}</p>
                        <p className="text-xs text-muted-foreground">{layer.type}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleLayer(layer.name)}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      {layerVisibility[layer.name] ? (
                        <Eye className="w-4 h-4 text-success" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="drc" className="m-0">
            <ScrollArea className="h-[280px]">
              <div className="p-3 space-y-2">
                {drcChecks.map((check) => (
                  <div
                    key={check.name}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      check.status 
                        ? "bg-success/10 border border-success/20" 
                        : check.critical 
                          ? "bg-destructive/10 border border-destructive/20"
                          : "bg-warning/10 border border-warning/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {check.status ? (
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      ) : check.critical ? (
                        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium">{check.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {check.message}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
