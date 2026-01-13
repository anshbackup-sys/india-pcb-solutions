import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Calculator, 
  TrendingDown,
  Clock,
  Package,
  Truck,
  Info,
  Zap,
  Shield
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AdvancedPCBConfig } from "./AdvancedPCBConfig";

interface PCBPriceCalculatorProps {
  config: Partial<AdvancedPCBConfig>;
  className?: string;
}

const BASE_PRICES = {
  // Per layer per sq cm
  layerPrice: { 1: 0.02, 2: 0.03, 4: 0.08, 6: 0.15, 8: 0.25, 10: 0.40, 12: 0.55, 14: 0.70, 16: 0.85, 18: 1.0, 20: 1.2 },
  
  // Material multipliers
  material: {
    "FR-4": 1,
    "FR-4 High TG": 1.3,
    "FR-4 Ultra High TG": 1.5,
    "Aluminum": 1.8,
    "Rogers 4003C": 3.5,
    "Rogers 4350B": 4.0,
    "Polyimide": 2.5,
    "PTFE": 4.5,
  },
  
  // PCB Type multipliers
  pcbType: {
    "rigid": 1,
    "flex": 2.0,
    "rigid_flex": 2.5,
    "aluminum": 1.5,
    "copper_core": 1.8,
    "rf": 3.0,
  },
  
  // Surface finish
  surfaceFinish: {
    "HASL Leaded": 0,
    "HASL Lead-Free": 15,
    "ENIG 1U": 50,
    "ENIG 2U": 80,
    "OSP": 10,
    "Immersion Silver": 40,
    "Immersion Tin": 35,
    "Hard Gold": 150,
  },
  
  // Copper weight
  copperWeight: {
    "1oz": 0,
    "2oz": 30,
    "2.5oz": 50,
    "3.5oz": 100,
    "4.5oz": 180,
  },
  
  // Min track/spacing
  minTrackSpacing: {
    "3/3mil": 80,
    "4/4mil": 40,
    "5/5mil": 20,
    "6/6mil": 0,
    "8/8mil": 0,
  },
  
  // Min hole size
  minHoleSize: {
    "0.15mm": 60,
    "0.2mm": 30,
    "0.25mm": 15,
    "0.3mm": 0,
    "0.4mm": 0,
  },
  
  // Via process
  viaProcess: {
    "tenting": 0,
    "plugged_soldermask": 20,
    "via_in_pad_epoxy": 60,
    "via_in_pad_copper": 100,
  },
  
  // Lead time multipliers
  leadTime: {
    "standard": { multiplier: 1, days: "10-12 days", label: "Standard" },
    "expedited": { multiplier: 1.3, days: "7-8 days", label: "Expedited" },
    "express": { multiplier: 1.6, days: "5-6 days", label: "Express" },
    "rush": { multiplier: 2.0, days: "3-4 days", label: "Rush" },
    "super_rush": { multiplier: 3.0, days: "24-48 hours", label: "Super Rush" },
  },
  
  // Quantity discounts
  quantityDiscount: [
    { min: 1, max: 4, discount: 0 },
    { min: 5, max: 9, discount: 0.05 },
    { min: 10, max: 24, discount: 0.10 },
    { min: 25, max: 49, discount: 0.15 },
    { min: 50, max: 99, discount: 0.20 },
    { min: 100, max: 249, discount: 0.25 },
    { min: 250, max: 499, discount: 0.30 },
    { min: 500, max: 999, discount: 0.35 },
    { min: 1000, max: Infinity, discount: 0.40 },
  ],
  
  // Advanced options
  advancedOptions: {
    impedanceControl: 50,
    castellatedHoles: 40,
    edgePlating: 30,
    goldFingers: 80,
    ulMarking: 20,
  },
  
  // Stencil
  stencil: {
    "none": 0,
    "frameless": 25,
    "framed": 60,
  },
  
  // Assembly
  assemblySides: {
    "none": 0,
    "top": 50,
    "bottom": 50,
    "both": 90,
  },
  
  // Conformal coating
  conformalCoating: {
    "none": 0,
    "acrylic": 30,
    "silicone": 45,
    "urethane": 55,
    "epoxy": 40,
  },
  
  // Testing
  testing: {
    "flying_probe": 10,
    "fixture": 80,
    "none": 0,
  },
  
  // IPC class
  ipcClass: {
    "class1": 0,
    "class2": 0,
    "class3": 50,
  },
};

const QUANTITY_TIERS = [5, 10, 25, 50, 100, 250, 500, 1000];
const USD_TO_INR = 83;

export function PCBPriceCalculator({ config, className }: PCBPriceCalculatorProps) {
  const calculatePrice = useMemo(() => {
    const boardWidth = parseFloat(config.boardWidth || "100") || 100;
    const boardHeight = parseFloat(config.boardHeight || "100") || 100;
    const quantity = parseInt(config.quantity || "10") || 10;
    const layers = parseInt(config.layers || "2") || 2;
    const panelQty = parseInt(config.panelQty || "1") || 1;
    const differentDesigns = parseInt(config.differentDesigns || "1") || 1;
    
    const boardArea = (boardWidth * boardHeight) / 100; // sq cm
    
    // Base price per board
    const layerKey = Math.min(layers, 20) as keyof typeof BASE_PRICES.layerPrice;
    const pricePerSqCm = BASE_PRICES.layerPrice[layerKey] || BASE_PRICES.layerPrice[2];
    let basePrice = boardArea * pricePerSqCm;
    
    // PCB type multiplier
    const pcbTypeMult = BASE_PRICES.pcbType[config.pcbType as keyof typeof BASE_PRICES.pcbType] || 1;
    basePrice *= pcbTypeMult;
    
    // Material multiplier
    const materialMult = BASE_PRICES.material[config.material as keyof typeof BASE_PRICES.material] || 1;
    basePrice *= materialMult;
    
    // Surface finish
    const finishPrice = BASE_PRICES.surfaceFinish[config.surfaceFinish as keyof typeof BASE_PRICES.surfaceFinish] || 0;
    
    // Copper weight
    const copperPrice = BASE_PRICES.copperWeight[config.copperWeight as keyof typeof BASE_PRICES.copperWeight] || 0;
    
    // Track/spacing
    const trackPrice = BASE_PRICES.minTrackSpacing[config.minTrackSpacing as keyof typeof BASE_PRICES.minTrackSpacing] || 0;
    
    // Hole size
    const holePrice = BASE_PRICES.minHoleSize[config.minHoleSize as keyof typeof BASE_PRICES.minHoleSize] || 0;
    
    // Via process
    const viaPrice = BASE_PRICES.viaProcess[config.viaProcess as keyof typeof BASE_PRICES.viaProcess] || 0;
    
    // Advanced options
    let advancedPrice = 0;
    if (config.impedanceControl) advancedPrice += BASE_PRICES.advancedOptions.impedanceControl;
    if (config.castellatedHoles) advancedPrice += BASE_PRICES.advancedOptions.castellatedHoles;
    if (config.edgePlating) advancedPrice += BASE_PRICES.advancedOptions.edgePlating;
    if (config.goldFingers) advancedPrice += BASE_PRICES.advancedOptions.goldFingers;
    if (config.ulMarking) advancedPrice += BASE_PRICES.advancedOptions.ulMarking;
    
    // Stencil
    const stencilPrice = BASE_PRICES.stencil[config.stencilType as keyof typeof BASE_PRICES.stencil] || 0;
    
    // Assembly
    const assemblyPrice = BASE_PRICES.assemblySides[config.assemblySides as keyof typeof BASE_PRICES.assemblySides] || 0;
    
    // Conformal coating
    const coatingPrice = BASE_PRICES.conformalCoating[config.conformalCoating as keyof typeof BASE_PRICES.conformalCoating] || 0;
    
    // Testing
    const testingPrice = BASE_PRICES.testing[config.electricalTesting as keyof typeof BASE_PRICES.testing] || 0;
    
    // IPC class
    const ipcPrice = BASE_PRICES.ipcClass[config.ipcClass as keyof typeof BASE_PRICES.ipcClass] || 0;
    
    // Different designs surcharge
    const designSurcharge = differentDesigns > 1 ? (differentDesigns - 1) * 20 : 0;
    
    // Calculate per-board price
    const perBoardBase = basePrice + (finishPrice / quantity) + (copperPrice / quantity) + (trackPrice / quantity) + (holePrice / quantity) + (viaPrice / quantity);
    
    // Quantity discount
    const discount = BASE_PRICES.quantityDiscount.find(
      tier => quantity >= tier.min && quantity <= tier.max
    )?.discount || 0;
    
    const discountedPerBoard = perBoardBase * (1 - discount);
    
    // Subtotal for boards
    const boardsSubtotal = discountedPerBoard * quantity * panelQty;
    
    // Fixed costs
    const fixedCosts = advancedPrice + stencilPrice + assemblyPrice + coatingPrice + testingPrice + ipcPrice + designSurcharge;
    
    // Lead time multiplier
    const leadTimeConfig = BASE_PRICES.leadTime[config.leadTimeType as keyof typeof BASE_PRICES.leadTime] 
      || BASE_PRICES.leadTime.standard;
    
    const subtotal = (boardsSubtotal + fixedCosts) * leadTimeConfig.multiplier;
    
    // Minimum order value
    const total = Math.max(subtotal, 25);
    
    return {
      perBoard: discountedPerBoard,
      boardsSubtotal,
      fixedCosts,
      discount: discount * 100,
      leadTimeMultiplier: leadTimeConfig.multiplier,
      leadTimeLabel: leadTimeConfig.label,
      leadTimeDays: leadTimeConfig.days,
      subtotal,
      total: Math.round(total * 100) / 100,
      totalINR: Math.round(total * USD_TO_INR * 100) / 100,
      quantity,
      layers,
      boardArea,
    };
  }, [config]);

  // Calculate tier prices
  const tierPrices = useMemo(() => {
    return QUANTITY_TIERS.map(qty => {
      const boardWidth = parseFloat(config.boardWidth || "100") || 100;
      const boardHeight = parseFloat(config.boardHeight || "100") || 100;
      const layers = parseInt(config.layers || "2") || 2;
      
      const boardArea = (boardWidth * boardHeight) / 100;
      const layerKey = Math.min(layers, 20) as keyof typeof BASE_PRICES.layerPrice;
      const pricePerSqCm = BASE_PRICES.layerPrice[layerKey] || BASE_PRICES.layerPrice[2];
      let basePrice = boardArea * pricePerSqCm;
      
      const pcbTypeMult = BASE_PRICES.pcbType[config.pcbType as keyof typeof BASE_PRICES.pcbType] || 1;
      const materialMult = BASE_PRICES.material[config.material as keyof typeof BASE_PRICES.material] || 1;
      basePrice *= pcbTypeMult * materialMult;
      
      const discount = BASE_PRICES.quantityDiscount.find(
        tier => qty >= tier.min && qty <= tier.max
      )?.discount || 0;
      
      const perBoard = basePrice * (1 - discount);
      const total = Math.max(perBoard * qty + 30, 25);
      
      return {
        quantity: qty,
        perBoard: Math.round(perBoard * 100) / 100,
        total: Math.round(total * 100) / 100,
        discount: discount * 100,
      };
    });
  }, [config]);

  const currentQty = parseInt(config.quantity || "10") || 10;

  return (
    <TooltipProvider>
      <Card className={cn("sticky top-4 border-2 border-accent/20 shadow-lg", className)}>
        <CardHeader className="pb-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-accent rounded-lg">
              <Calculator className="w-5 h-5 text-accent-foreground" />
            </div>
            Real-Time Price Estimate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          {/* Main Price Display */}
          <div className="text-center p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-2xl border border-accent/30 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/30">
                <Zap className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Estimated Total</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                ₹{calculatePrice.totalINR.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ≈ ${calculatePrice.total.toLocaleString('en-US')} USD
            </p>
            {calculatePrice.discount > 0 && (
              <Badge className="mt-3 bg-success text-success-foreground">
                <TrendingDown className="w-3 h-3 mr-1" />
                {calculatePrice.discount}% Bulk Discount Applied
              </Badge>
            )}
          </div>

          {/* Specs Summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold text-primary">{calculatePrice.quantity}</p>
              <p className="text-xs text-muted-foreground">Quantity</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold text-primary">{calculatePrice.layers}L</p>
              <p className="text-xs text-muted-foreground">Layers</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold text-primary">{calculatePrice.boardArea.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">cm² Area</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Per Board Cost</span>
              <span className="font-semibold">₹{(calculatePrice.perBoard * USD_TO_INR).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                PCBs ({calculatePrice.quantity} × {parseInt(config.panelQty || "1") || 1} panels)
              </span>
              <span className="font-medium">₹{(calculatePrice.boardsSubtotal * USD_TO_INR).toFixed(2)}</span>
            </div>
            {calculatePrice.fixedCosts > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-1">
                  Setup & Options
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Includes tooling, special features, and testing</p>
                    </TooltipContent>
                  </Tooltip>
                </span>
                <span className="font-medium">₹{(calculatePrice.fixedCosts * USD_TO_INR).toFixed(2)}</span>
              </div>
            )}
            {calculatePrice.leadTimeMultiplier > 1 && (
              <div className="flex justify-between items-center text-warning">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {calculatePrice.leadTimeLabel} Premium
                </span>
                <span className="font-medium">×{calculatePrice.leadTimeMultiplier}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Lead Time */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium">Delivery Time</span>
                <p className="text-xs text-muted-foreground">{calculatePrice.leadTimeLabel}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30 font-semibold">
              {calculatePrice.leadTimeDays}
            </Badge>
          </div>

          {/* Quantity Tiers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">Quantity Pricing Tiers</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tierPrices.slice(0, 8).map((tier) => (
                <button
                  key={tier.quantity}
                  type="button"
                  className={cn(
                    "p-2 rounded-lg text-center border-2 transition-all duration-200",
                    tier.quantity === currentQty
                      ? "bg-accent/10 border-accent shadow-sm"
                      : "bg-muted/30 border-transparent hover:border-accent/30"
                  )}
                >
                  <p className={cn(
                    "font-bold text-sm",
                    tier.quantity === currentQty ? "text-accent" : "text-foreground"
                  )}>{tier.quantity}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{(tier.perBoard * USD_TO_INR).toFixed(0)}/ea
                  </p>
                  {tier.discount > 0 && (
                    <p className="text-[10px] text-success font-medium">-{tier.discount}%</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Trust Badges */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-success" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>Free shipping ₹10k+</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center italic bg-muted/30 p-2 rounded-lg">
            * Final price confirmed after engineer review of Gerber files
          </p>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
