import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  TrendingDown,
  Clock,
  Package,
  Truck,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PricingConfig {
  // Board specs
  boardWidth: number;
  boardHeight: number;
  quantity: number;
  layers: number;
  pcbType: string;
  material: string;
  thickness: string;
  copperWeight: string;
  innerCopperWeight: string;
  minTrackSpacing: string;
  minHoleSize: string;
  
  // Surface
  surfaceFinish: string;
  solderMask: string;
  silkscreen: string;
  viaProcess: string;
  
  // Advanced
  impedanceControl: boolean;
  castellatedHoles: boolean;
  edgePlating: boolean;
  goldFingers: boolean;
  panelizationType: string;
  ulMarking: boolean;
  
  // Assembly
  assemblySides: string;
  stencilType: string;
  
  // Testing
  electricalTesting: string;
  
  // Lead time
  leadTimeType: string;
  
  // Panel
  panelQty: number;
  differentDesigns: number;
}

interface PCBPriceCalculatorProps {
  config: Partial<PricingConfig>;
  className?: string;
}

const BASE_PRICES = {
  // Per layer per sq cm
  layerPrice: { 1: 0.02, 2: 0.03, 4: 0.08, 6: 0.15, 8: 0.25, 10: 0.40 },
  
  // Material multipliers
  material: {
    "FR-4": 1,
    "FR-4 High TG": 1.3,
    "Aluminum": 1.8,
    "Rogers 4003C": 3.5,
    "Rogers 4350B": 4.0,
    "Polyimide": 2.5,
    "PTFE": 4.5,
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
  
  // Testing
  testing: {
    "flying_probe": 10,
    "fixture": 80,
  },
};

const QUANTITY_TIERS = [5, 10, 25, 50, 100, 250, 500, 1000];

export function PCBPriceCalculator({ config, className }: PCBPriceCalculatorProps) {
  const calculatePrice = useMemo(() => {
    const boardArea = ((config.boardWidth || 100) * (config.boardHeight || 100)) / 100; // sq cm
    const quantity = config.quantity || 10;
    const layers = config.layers || 2;
    
    // Base price per board
    const layerKey = Math.min(layers, 10) as keyof typeof BASE_PRICES.layerPrice;
    const pricePerSqCm = BASE_PRICES.layerPrice[layerKey] || BASE_PRICES.layerPrice[2];
    let basePrice = boardArea * pricePerSqCm;
    
    // Material multiplier
    const materialMult = BASE_PRICES.material[config.material as keyof typeof BASE_PRICES.material] || 1;
    basePrice *= materialMult;
    
    // Surface finish
    const finishPrice = BASE_PRICES.surfaceFinish[config.surfaceFinish as keyof typeof BASE_PRICES.surfaceFinish] || 0;
    
    // Copper weight
    const copperPrice = BASE_PRICES.copperWeight[config.copperWeight as keyof typeof BASE_PRICES.copperWeight] || 0;
    
    // Advanced options
    let advancedPrice = 0;
    if (config.impedanceControl) advancedPrice += BASE_PRICES.advancedOptions.impedanceControl;
    if (config.castellatedHoles) advancedPrice += BASE_PRICES.advancedOptions.castellatedHoles;
    if (config.edgePlating) advancedPrice += BASE_PRICES.advancedOptions.edgePlating;
    if (config.goldFingers) advancedPrice += BASE_PRICES.advancedOptions.goldFingers;
    if (config.ulMarking) advancedPrice += BASE_PRICES.advancedOptions.ulMarking;
    
    // Stencil
    const stencilPrice = BASE_PRICES.stencil[config.stencilType as keyof typeof BASE_PRICES.stencil] || 0;
    
    // Testing
    const testingPrice = BASE_PRICES.testing[config.electricalTesting as keyof typeof BASE_PRICES.testing] || 0;
    
    // Calculate per-board price
    const perBoardBase = basePrice + (finishPrice / quantity) + (copperPrice / quantity);
    
    // Quantity discount
    const discount = BASE_PRICES.quantityDiscount.find(
      tier => quantity >= tier.min && quantity <= tier.max
    )?.discount || 0;
    
    const discountedPerBoard = perBoardBase * (1 - discount);
    
    // Subtotal for boards
    const boardsSubtotal = discountedPerBoard * quantity;
    
    // Fixed costs
    const fixedCosts = advancedPrice + stencilPrice + testingPrice;
    
    // Lead time multiplier
    const leadTimeConfig = BASE_PRICES.leadTime[config.leadTimeType as keyof typeof BASE_PRICES.leadTime] 
      || BASE_PRICES.leadTime.standard;
    
    const subtotal = (boardsSubtotal + fixedCosts) * leadTimeConfig.multiplier;
    
    // Minimum order value
    const total = Math.max(subtotal, 50);
    
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
      totalINR: Math.round(total * 83 * 100) / 100, // USD to INR approximate
    };
  }, [config]);

  // Calculate tier prices
  const tierPrices = useMemo(() => {
    return QUANTITY_TIERS.map(qty => {
      const tierConfig = { ...config, quantity: qty };
      const boardArea = ((config.boardWidth || 100) * (config.boardHeight || 100)) / 100;
      const layers = config.layers || 2;
      const layerKey = Math.min(layers, 10) as keyof typeof BASE_PRICES.layerPrice;
      const pricePerSqCm = BASE_PRICES.layerPrice[layerKey] || BASE_PRICES.layerPrice[2];
      let basePrice = boardArea * pricePerSqCm;
      const materialMult = BASE_PRICES.material[config.material as keyof typeof BASE_PRICES.material] || 1;
      basePrice *= materialMult;
      
      const discount = BASE_PRICES.quantityDiscount.find(
        tier => qty >= tier.min && qty <= tier.max
      )?.discount || 0;
      
      const perBoard = basePrice * (1 - discount);
      const total = Math.max(perBoard * qty + 30, 50);
      
      return {
        quantity: qty,
        perBoard: Math.round(perBoard * 100) / 100,
        total: Math.round(total * 100) / 100,
        discount: discount * 100,
      };
    });
  }, [config]);

  return (
    <Card className={cn("sticky top-4", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="w-5 h-5 text-accent" />
          Estimated Price
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Price Display */}
        <div className="text-center p-4 bg-accent/5 rounded-xl border border-accent/20">
          <p className="text-sm text-muted-foreground mb-1">Total Estimate</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-accent">₹{calculatePrice.totalINR.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            ≈ ${calculatePrice.total.toLocaleString()} USD
          </p>
          {calculatePrice.discount > 0 && (
            <Badge variant="secondary" className="mt-2">
              <TrendingDown className="w-3 h-3 mr-1" />
              {calculatePrice.discount}% Quantity Discount
            </Badge>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Per Board</span>
            <span className="font-medium">₹{(calculatePrice.perBoard * 83).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Boards ({config.quantity || 10} pcs)
            </span>
            <span>₹{(calculatePrice.boardsSubtotal * 83).toFixed(2)}</span>
          </div>
          {calculatePrice.fixedCosts > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Setup & Options</span>
              <span>₹{(calculatePrice.fixedCosts * 83).toFixed(2)}</span>
            </div>
          )}
          {calculatePrice.leadTimeMultiplier > 1 && (
            <div className="flex justify-between text-warning">
              <span>{calculatePrice.leadTimeLabel} Fee</span>
              <span>×{calculatePrice.leadTimeMultiplier}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Lead Time */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Lead Time</span>
          </div>
          <Badge variant="outline">{calculatePrice.leadTimeDays}</Badge>
        </div>

        {/* Quantity Tiers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Quantity Pricing</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Order more to save more per board</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid grid-cols-4 gap-1 text-xs">
            {tierPrices.slice(0, 8).map((tier) => (
              <div
                key={tier.quantity}
                className={cn(
                  "p-2 rounded text-center border",
                  tier.quantity === (config.quantity || 10)
                    ? "bg-accent/10 border-accent"
                    : "bg-muted/30 border-transparent"
                )}
              >
                <p className="font-semibold">{tier.quantity}</p>
                <p className="text-muted-foreground">₹{(tier.perBoard * 83).toFixed(0)}/ea</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shipping Note */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Truck className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>
            Shipping calculated at checkout. Free shipping on orders over ₹10,000.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center italic">
          * Final price may vary based on design review
        </p>
      </CardContent>
    </Card>
  );
}
