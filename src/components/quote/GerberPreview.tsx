import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Eye,
  EyeOff,
  FileText,
  AlertTriangle,
  CheckCircle2
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
}

const SOLDER_MASK_COLORS: Record<string, string> = {
  "Green": "#1a5f1a",
  "Black": "#1a1a1a",
  "White": "#e5e5e5",
  "Blue": "#1a3d5c",
  "Red": "#8b1a1a",
  "Yellow": "#b5a020",
  "Matte Black": "#0d0d0d",
  "Matte Green": "#145214",
  "Purple": "#4a1a6b",
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
  const [activeLayer, setActiveLayer] = useState("all");
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({});

  const detectedLayers: LayerInfo[] = files.map((file) => {
    const name = file.name.toLowerCase();
    let type = "Unknown";
    let color = "#888888";

    if (name.includes("top") || name.includes("gtl") || name.includes("f_cu")) {
      type = "Top Copper";
      color = "#ff6b6b";
    } else if (name.includes("bottom") || name.includes("gbl") || name.includes("b_cu")) {
      type = "Bottom Copper";
      color = "#4dabf7";
    } else if (name.includes("mask") && (name.includes("top") || name.includes("gts"))) {
      type = "Top Solder Mask";
      color = SOLDER_MASK_COLORS[solderMaskColor] || "#1a5f1a";
    } else if (name.includes("mask") && (name.includes("bot") || name.includes("gbs"))) {
      type = "Bottom Solder Mask";
      color = SOLDER_MASK_COLORS[solderMaskColor] || "#1a5f1a";
    } else if (name.includes("silk") || name.includes("gto") || name.includes("gbo")) {
      type = "Silkscreen";
      color = "#ffffff";
    } else if (name.includes("drill") || name.includes("drl") || name.includes("xln")) {
      type = "Drill";
      color = "#ffd43b";
    } else if (name.includes("outline") || name.includes("edge") || name.includes("gko")) {
      type = "Board Outline";
      color = "#20c997";
    } else if (name.includes("paste")) {
      type = "Solder Paste";
      color = "#adb5bd";
    }

    return {
      name: file.name,
      type,
      visible: layerVisibility[file.name] !== false,
      color,
    };
  });

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    files.forEach((f) => {
      initial[f.name] = true;
    });
    setLayerVisibility(initial);
  }, [files]);

  const toggleLayer = (fileName: string) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [fileName]: !prev[fileName],
    }));
  };

  const drcChecks = [
    { name: "Board Size", status: boardWidth > 0 && boardHeight > 0, message: boardWidth > 0 ? `${boardWidth}×${boardHeight}mm` : "Not specified" },
    { name: "Layer Count", status: layers >= 1, message: `${layers} layers` },
    { name: "Gerber Files", status: files.length > 0, message: `${files.length} files uploaded` },
    { name: "Drill File", status: detectedLayers.some(l => l.type === "Drill"), message: detectedLayers.some(l => l.type === "Drill") ? "Found" : "Missing" },
    { name: "Outline", status: detectedLayers.some(l => l.type === "Board Outline"), message: detectedLayers.some(l => l.type === "Board Outline") ? "Found" : "Optional" },
  ];

  if (files.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Layers className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Upload Gerber files to see preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5 text-accent" />
            PCB Preview
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setRotation(r => (r + 90) % 360)}>
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="layers">Layers ({files.length})</TabsTrigger>
            <TabsTrigger value="drc">DRC Check</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <div className="relative bg-muted/50 rounded-lg overflow-hidden aspect-square">
              {/* PCB Preview Visualization */}
              <div 
                className="absolute inset-4 flex items-center justify-center"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              >
                <div 
                  className="relative border-2 border-dashed border-muted-foreground/30 rounded-sm"
                  style={{
                    width: `${Math.min(80, boardWidth / 2)}%`,
                    height: `${Math.min(80, boardHeight / 2)}%`,
                    minWidth: '100px',
                    minHeight: '100px',
                    backgroundColor: SOLDER_MASK_COLORS[solderMaskColor] || '#1a5f1a',
                  }}
                >
                  {/* Simulated PCB traces */}
                  <svg className="absolute inset-0 w-full h-full opacity-60">
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    {/* Copper traces simulation */}
                    <path 
                      d="M 20% 30% L 50% 30% L 50% 70% L 80% 70%" 
                      stroke="#d4a03a" 
                      strokeWidth="3" 
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path 
                      d="M 30% 20% L 30% 50% L 70% 50% L 70% 80%" 
                      stroke="#d4a03a" 
                      strokeWidth="2" 
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Via holes */}
                    <circle cx="50%" cy="50%" r="4" fill="#d4a03a" stroke="#333" strokeWidth="1"/>
                    <circle cx="30%" cy="50%" r="3" fill="#d4a03a" stroke="#333" strokeWidth="1"/>
                    <circle cx="70%" cy="50%" r="3" fill="#d4a03a" stroke="#333" strokeWidth="1"/>
                    {/* Pads */}
                    <rect x="15%" y="25%" width="10%" height="10%" rx="1" fill="#d4a03a"/>
                    <rect x="75%" y="65%" width="10%" height="10%" rx="1" fill="#d4a03a"/>
                  </svg>
                  
                  {/* Dimension labels */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                    {boardWidth}mm
                  </div>
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground whitespace-nowrap rotate-90">
                    {boardHeight}mm
                  </div>
                </div>
              </div>

              {/* Layer indicator */}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">
                  {layers}L PCB
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layers">
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {detectedLayers.map((layer) => (
                <div
                  key={layer.name}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2"
                      style={{ backgroundColor: layer.color, borderColor: layer.color }}
                    />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[180px]">{layer.name}</p>
                      <p className="text-xs text-muted-foreground">{layer.type}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleLayer(layer.name)}
                    className={cn(
                      "h-8 w-8",
                      !layerVisibility[layer.name] && "opacity-50"
                    )}
                  >
                    {layerVisibility[layer.name] ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drc">
            <div className="space-y-2">
              {drcChecks.map((check) => (
                <div
                  key={check.name}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    check.status ? "bg-success/10" : "bg-warning/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {check.status ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                    <span className="text-sm font-medium">{check.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{check.message}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
