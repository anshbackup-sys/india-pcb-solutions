import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Grid3X3,
  Loader2,
  FileCode
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
  content?: string;
  parsed?: ParsedGerberData;
}

interface ParsedGerberData {
  commands: GerberCommand[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  apertures: Map<string, ApertureDefinition>;
}

interface GerberCommand {
  type: 'move' | 'draw' | 'flash' | 'arc' | 'region';
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  aperture?: string;
}

interface ApertureDefinition {
  shape: 'circle' | 'rectangle' | 'obround';
  diameter?: number;
  width?: number;
  height?: number;
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

// Simple Gerber parser for visualization
function parseGerberContent(content: string): ParsedGerberData {
  const commands: GerberCommand[] = [];
  const apertures = new Map<string, ApertureDefinition>();
  let currentAperture = '';
  let currentX = 0;
  let currentY = 0;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Parse aperture definitions
    const apertureMatch = trimmed.match(/%ADD(\d+)([CRO]),([^%]+)%/);
    if (apertureMatch) {
      const [, id, shape, params] = apertureMatch;
      const parts = params.split('X').map(p => parseFloat(p));
      if (shape === 'C') {
        apertures.set(id, { shape: 'circle', diameter: parts[0] });
      } else if (shape === 'R') {
        apertures.set(id, { shape: 'rectangle', width: parts[0], height: parts[1] || parts[0] });
      }
      continue;
    }
    
    // Select aperture
    const selectMatch = trimmed.match(/D(\d+)\*/);
    if (selectMatch && parseInt(selectMatch[1]) >= 10) {
      currentAperture = selectMatch[1];
      continue;
    }
    
    // Parse coordinates
    const coordMatch = trimmed.match(/X(-?\d+)Y(-?\d+)D(\d+)\*/);
    if (coordMatch) {
      const x = parseInt(coordMatch[1]) / 10000; // Convert to mm (assuming 10000 units per mm)
      const y = parseInt(coordMatch[2]) / 10000;
      const d = parseInt(coordMatch[3]);
      
      if (d === 1) { // Draw
        commands.push({ type: 'draw', x: currentX, y: currentY, x2: x, y2: y, aperture: currentAperture });
      } else if (d === 2) { // Move
        commands.push({ type: 'move', x, y });
      } else if (d === 3) { // Flash
        commands.push({ type: 'flash', x, y, aperture: currentAperture });
      }
      
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      
      currentX = x;
      currentY = y;
    }
  }
  
  // Set reasonable defaults if no valid coordinates found
  if (minX === Infinity) {
    minX = 0; maxX = 100; minY = 0; maxY = 100;
  }
  
  return { commands, bounds: { minX, maxX, minY, maxY }, apertures };
}

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
  const [parsedLayers, setParsedLayers] = useState<LayerInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const detectLayerType = useCallback((fileName: string): { type: string; color: string } => {
    const name = fileName.toLowerCase();
    
    if (name.includes("gtl") || (name.includes("top") && name.includes("copper")) || name.includes("f_cu") || name.includes("-f.cu")) {
      return { type: "Top Copper", color: LAYER_COLORS["Top Copper"] };
    }
    if (name.includes("gbl") || (name.includes("bottom") && name.includes("copper")) || name.includes("b_cu") || name.includes("-b.cu")) {
      return { type: "Bottom Copper", color: LAYER_COLORS["Bottom Copper"] };
    }
    if (name.includes("gts") || (name.includes("top") && name.includes("mask")) || name.includes("f_mask") || name.includes("-f.mask")) {
      const maskColor = SOLDER_MASK_COLORS[solderMaskColor]?.bg || LAYER_COLORS["Top Solder Mask"];
      return { type: "Top Solder Mask", color: maskColor };
    }
    if (name.includes("gbs") || (name.includes("bottom") && name.includes("mask")) || name.includes("b_mask") || name.includes("-b.mask")) {
      const maskColor = SOLDER_MASK_COLORS[solderMaskColor]?.bg || LAYER_COLORS["Bottom Solder Mask"];
      return { type: "Bottom Solder Mask", color: maskColor };
    }
    if (name.includes("gto") || (name.includes("top") && name.includes("silk")) || name.includes("f_silks") || name.includes("-f.silk")) {
      return { type: "Top Silkscreen", color: LAYER_COLORS["Top Silkscreen"] };
    }
    if (name.includes("gbo") || (name.includes("bottom") && name.includes("silk")) || name.includes("b_silks") || name.includes("-b.silk")) {
      return { type: "Bottom Silkscreen", color: LAYER_COLORS["Bottom Silkscreen"] };
    }
    if (name.includes("drl") || name.includes("drill") || name.includes("xln") || name.includes("exc") || name.includes(".drl")) {
      return { type: "Drill", color: LAYER_COLORS["Drill"] };
    }
    if (name.includes("gko") || name.includes("outline") || name.includes("edge") || name.includes("gm1") || name.includes("-edge")) {
      return { type: "Board Outline", color: LAYER_COLORS["Board Outline"] };
    }
    if (name.includes("gtp") || name.includes("gbp") || name.includes("paste")) {
      return { type: "Solder Paste", color: LAYER_COLORS["Solder Paste"] };
    }
    if (name.includes("g2") || name.includes("g3") || name.includes("in1") || name.includes("in2") || name.includes("inner")) {
      return { type: "Inner Layer", color: LAYER_COLORS["Inner Layer"] };
    }
    
    return { type: "Unknown", color: LAYER_COLORS["Unknown"] };
  }, [solderMaskColor]);

  // Parse uploaded files
  useEffect(() => {
    if (files.length === 0) {
      setParsedLayers([]);
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    
    const parseFiles = async () => {
      const newLayers: LayerInfo[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { type, color } = detectLayerType(file.name);
        
        try {
          const content = await file.text();
          const parsed = parseGerberContent(content);
          
          newLayers.push({
            name: file.name,
            type,
            visible: layerVisibility[file.name] !== false,
            color,
            icon: type.includes("Copper") ? "⚡" : type.includes("Mask") ? "🎨" : type.includes("Silk") ? "✍️" : type.includes("Drill") ? "⚫" : type.includes("Outline") ? "📐" : "📄",
            content: content.substring(0, 1000), // Store first 1000 chars for preview
            parsed
          });
        } catch {
          newLayers.push({
            name: file.name,
            type,
            visible: layerVisibility[file.name] !== false,
            color,
            icon: type.includes("Copper") ? "⚡" : type.includes("Mask") ? "🎨" : type.includes("Silk") ? "✍️" : type.includes("Drill") ? "⚫" : type.includes("Outline") ? "📐" : "📄",
          });
        }
        
        setLoadingProgress(((i + 1) / files.length) * 100);
      }
      
      setParsedLayers(newLayers);
      setIsLoading(false);
    };
    
    parseFiles();
  }, [files, detectLayerType, layerVisibility]);

  // Initialize visibility for new files
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
      status: parsedLayers.some(l => l.type === "Drill"), 
      message: parsedLayers.some(l => l.type === "Drill") ? "✓ Found" : "⚠ Missing",
      critical: true
    },
    { 
      name: "Board Outline", 
      status: parsedLayers.some(l => l.type === "Board Outline"), 
      message: parsedLayers.some(l => l.type === "Board Outline") ? "✓ Found" : "Optional",
      critical: false
    },
    { 
      name: "Copper Layers", 
      status: parsedLayers.some(l => l.type.includes("Copper")), 
      message: parsedLayers.filter(l => l.type.includes("Copper")).length + " detected",
      critical: true
    },
  ], [boardWidth, boardHeight, layers, files.length, parsedLayers]);

  const maskColors = SOLDER_MASK_COLORS[solderMaskColor] || SOLDER_MASK_COLORS["Green"];

  // Calculate combined bounds from all parsed layers
  const combinedBounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    parsedLayers.forEach(layer => {
      if (layer.parsed && layerVisibility[layer.name] !== false) {
        minX = Math.min(minX, layer.parsed.bounds.minX);
        maxX = Math.max(maxX, layer.parsed.bounds.maxX);
        minY = Math.min(minY, layer.parsed.bounds.minY);
        maxY = Math.max(maxY, layer.parsed.bounds.maxY);
      }
    });
    
    if (minX === Infinity) {
      return { minX: 0, maxX: boardWidth, minY: 0, maxY: boardHeight };
    }
    
    return { minX, maxX, minY, maxY };
  }, [parsedLayers, layerVisibility, boardWidth, boardHeight]);

  // Render parsed Gerber data as SVG paths
  const renderGerberLayer = (layer: LayerInfo, index: number) => {
    if (!layer.parsed || layerVisibility[layer.name] === false) return null;
    
    const { commands, bounds } = layer.parsed;
    const width = bounds.maxX - bounds.minX || boardWidth;
    const height = bounds.maxY - bounds.minY || boardHeight;
    const scale = 180 / Math.max(width, height);
    
    const paths: JSX.Element[] = [];
    
    commands.forEach((cmd, cmdIndex) => {
      const x = (cmd.x - bounds.minX) * scale;
      const y = 180 - (cmd.y - bounds.minY) * scale; // Flip Y axis
      
      if (cmd.type === 'flash') {
        paths.push(
          <circle
            key={`${index}-${cmdIndex}`}
            cx={x}
            cy={y}
            r={2}
            fill={layer.color}
            opacity={0.8}
          />
        );
      } else if (cmd.type === 'draw' && cmd.x2 !== undefined && cmd.y2 !== undefined) {
        const x2 = (cmd.x2 - bounds.minX) * scale;
        const y2 = 180 - (cmd.y2 - bounds.minY) * scale;
        paths.push(
          <line
            key={`${index}-${cmdIndex}`}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            stroke={layer.color}
            strokeWidth={1.5}
            strokeLinecap="round"
            opacity={0.8}
          />
        );
      }
    });
    
    return <g key={`layer-${index}`}>{paths}</g>;
  };

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
            {isLoading && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Loading...
              </Badge>
            )}
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
        {isLoading && (
          <Progress value={loadingProgress} className="h-1 mt-2" />
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b h-10">
            <TabsTrigger value="preview" className="text-xs gap-1">
              <Grid3X3 className="w-3 h-3" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="layers" className="text-xs gap-1">
              <Layers className="w-3 h-3" />
              Layers ({files.length})
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs gap-1">
              <FileCode className="w-3 h-3" />
              Code
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
              
              {/* PCB Preview from actual file data */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              >
                <div 
                  className="relative rounded-sm shadow-2xl overflow-hidden"
                  style={{
                    width: `${Math.min(200, Math.max(80, boardWidth * 0.8))}px`,
                    height: `${Math.min(200, Math.max(80, boardHeight * 0.8))}px`,
                    backgroundColor: maskColors.bg,
                    border: `3px solid ${maskColors.border}`,
                  }}
                >
                  {/* SVG canvas for rendering parsed Gerber data */}
                  <svg 
                    className="absolute inset-0 w-full h-full" 
                    viewBox={`0 0 180 180`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Background pattern */}
                    <defs>
                      <pattern id="pcb-grid-dynamic" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pcb-grid-dynamic)" />
                    
                    {/* Render actual Gerber layers */}
                    {parsedLayers.map((layer, index) => renderGerberLayer(layer, index))}
                    
                    {/* Fallback visualization if no parsed data */}
                    {parsedLayers.every(l => !l.parsed) && (
                      <g stroke="#d4a03a" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
                        <path d="M 15% 25% L 40% 25% L 40% 50% L 85% 50%" strokeWidth="2.5"/>
                        <path d="M 25% 15% L 25% 45% L 60% 45% L 60% 85%" strokeWidth="2"/>
                        <path d="M 70% 20% L 70% 35% L 50% 35%" strokeWidth="1.5"/>
                        <path d="M 35% 70% L 55% 70% L 55% 55%" strokeWidth="2"/>
                        <circle cx="40%" cy="50%" r="4" fill="#d4a03a" stroke="#1a1a1a" strokeWidth="1"/>
                        <circle cx="25%" cy="45%" r="3" fill="#d4a03a" stroke="#1a1a1a" strokeWidth="1"/>
                        <rect x="10%" y="20%" width="10%" height="10%" rx="1" fill="#d4a03a"/>
                        <rect x="80%" y="45%" width="10%" height="10%" rx="1" fill="#d4a03a"/>
                      </g>
                    )}
                    
                    {/* Silkscreen text */}
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
              
              {/* File count */}
              <div className="absolute bottom-3 left-3">
                <Badge variant="secondary" className="text-xs">
                  {parsedLayers.filter(l => l.parsed).length} parsed / {files.length} files
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
                {parsedLayers.map((layer) => (
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
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">{layer.type}</p>
                          {layer.parsed && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              {layer.parsed.commands.length} elements
                            </Badge>
                          )}
                        </div>
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

          <TabsContent value="code" className="m-0">
            <ScrollArea className="h-[280px]">
              <div className="p-3 space-y-3">
                {parsedLayers.map((layer) => (
                  <div key={layer.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <p className="text-xs font-medium">{layer.name}</p>
                    </div>
                    <pre className="text-[10px] bg-muted/50 p-2 rounded overflow-x-auto max-h-20 text-muted-foreground font-mono">
                      {layer.content || "Unable to read file contents"}
                    </pre>
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
