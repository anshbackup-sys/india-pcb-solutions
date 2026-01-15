import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Package,
  Loader2,
  ChevronLeft,
  Download,
  FileText,
  Cpu,
  Box,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Zap,
  BookOpen,
} from "lucide-react";

interface Component {
  id: string;
  name: string;
  part_number: string;
  description: string | null;
  manufacturer: string | null;
  unit_price: number;
  stock_quantity: number | null;
  image_url: string | null;
  package: string | null;
  value: string | null;
  voltage_rating: string | null;
  current_rating: string | null;
  power_rating: string | null;
  temperature_range: string | null;
  tolerance: string | null;
  datasheet_url: string | null;
  schematic_symbol_url: string | null;
  footprint_url: string | null;
  model_3d_url: string | null;
  specifications: Record<string, string> | null;
  bulk_prices: unknown[];
  moq: number | null;
  lead_time_days: number | null;
}

interface ComponentImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
}

interface ComponentDocument {
  id: string;
  file_url: string;
  file_name: string;
  document_type: string;
}

export default function ComponentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [component, setComponent] = useState<Component | null>(null);
  const [images, setImages] = useState<ComponentImage[]>([]);
  const [documents, setDocuments] = useState<ComponentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchComponent();
    }
  }, [id]);

  const fetchComponent = async () => {
    setLoading(true);
    try {
      // Fetch component
      const { data: comp, error: compError } = await supabase
        .from("components")
        .select("*")
        .eq("id", id)
        .single();

      if (compError) throw compError;
      
      // Parse bulk_prices if it's a string
      const parsedComp = {
        ...comp,
        bulk_prices: Array.isArray(comp.bulk_prices) 
          ? comp.bulk_prices 
          : [],
        specifications: comp.specifications as Record<string, string> | null,
      };
      
      setComponent(parsedComp);
      setSelectedImage(comp.image_url);

      // Fetch images
      const { data: imgs } = await supabase
        .from("component_images")
        .select("*")
        .eq("component_id", id)
        .order("display_order");
      
      setImages(imgs || []);

      // Fetch documents
      const { data: docs } = await supabase
        .from("component_documents")
        .select("*")
        .eq("component_id", id);
      
      setDocuments(docs || []);
    } catch (error) {
      console.error("Error fetching component:", error);
      toast({
        title: "Error",
        description: "Could not load component details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUnitPrice = (): number => {
    if (!component) return 0;
    
    // Check bulk pricing
    const bulkPrices = (component.bulk_prices || []) as { quantity: number; price: number }[];
    const applicableTier = bulkPrices
      .filter((tier) => quantity >= tier.quantity)
      .sort((a: { quantity: number }, b: { quantity: number }) => b.quantity - a.quantity)[0];
    
    return applicableTier ? applicableTier.price : component.unit_price;
  };

  const addToCart = () => {
    if (!component) return;
    
    // Get existing cart or create new one
    const existingCart = sessionStorage.getItem("checkout_cart");
    const cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if component already in cart
    const existingIndex = cart.findIndex((item: { id: string }) => item.id === component.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: component.id,
        name: component.name,
        part_number: component.part_number,
        unit_price: getUnitPrice(),
        quantity,
        image_url: component.image_url,
      });
    }
    
    sessionStorage.setItem("checkout_cart", JSON.stringify(cart));
    
    toast({
      title: "Added to cart",
      description: `${quantity}x ${component.name} added to cart`,
    });
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!component) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Component Not Found</h1>
          <Button variant="outline" onClick={() => navigate("/components")}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </Layout>
    );
  }

  const unitPrice = getUnitPrice();
  const totalPrice = unitPrice * quantity;
  const inStock = (component.stock_quantity || 0) > 0;
  const moq = component.moq || 1;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b">
        <div className="container-wide">
          <Button variant="ghost" size="sm" onClick={() => navigate("/components")}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Marketplace
          </Button>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-muted/50 rounded-xl overflow-hidden border flex items-center justify-center">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={component.name}
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <Package className="w-24 h-24 text-muted-foreground" />
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedImage(component.image_url)}
                    className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 ${
                      selectedImage === component.image_url ? "border-accent" : "border-border"
                    }`}
                  >
                    {component.image_url ? (
                      <img src={component.image_url} alt="" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Package className="w-full h-full p-2 text-muted-foreground" />
                    )}
                  </button>
                  {images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 ${
                        selectedImage === img.image_url ? "border-accent" : "border-border"
                      }`}
                    >
                      <img src={img.image_url} alt={img.alt_text || ""} className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                {component.manufacturer && (
                  <p className="text-sm text-muted-foreground mb-1">{component.manufacturer}</p>
                )}
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">{component.name}</h1>
                <p className="text-lg font-mono text-muted-foreground">{component.part_number}</p>
              </div>

              {/* Quick Specs */}
              <div className="flex flex-wrap gap-2">
                {component.value && (
                  <Badge variant="secondary">{component.value}</Badge>
                )}
                {component.package && (
                  <Badge variant="outline">{component.package}</Badge>
                )}
                {component.tolerance && (
                  <Badge variant="outline">±{component.tolerance}</Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {inStock ? (
                  <>
                    <Check className="w-5 h-5 text-success" />
                    <span className="text-success font-medium">In Stock</span>
                    <span className="text-muted-foreground">({component.stock_quantity} available)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="text-destructive font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Pricing */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₹{unitPrice.toFixed(2)}</span>
                    <span className="text-muted-foreground">/unit</span>
                    {unitPrice < component.unit_price && (
                      <Badge className="bg-success/10 text-success border-success/20">
                        Bulk Discount Applied
                      </Badge>
                    )}
                  </div>

                  {/* Bulk Pricing Table */}
                  {component.bulk_prices && component.bulk_prices.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">Quantity Pricing:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        <div className="bg-background rounded p-2 text-center">
                          <p className="text-muted-foreground">1+</p>
                          <p className="font-semibold">₹{component.unit_price.toFixed(2)}</p>
                        </div>
                        {component.bulk_prices.map((tier: { quantity: number; price: number }, i: number) => (
                          <div key={i} className={`rounded p-2 text-center ${
                            quantity >= tier.quantity ? "bg-accent/10 border border-accent/20" : "bg-background"
                          }`}>
                            <p className="text-muted-foreground">{tier.quantity}+</p>
                            <p className="font-semibold">₹{tier.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(moq, quantity - 1))}
                        disabled={quantity <= moq}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(moq, parseInt(e.target.value) || moq))}
                        className="w-20 text-center border-0"
                        min={moq}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total:</p>
                      <p className="text-xl font-bold">₹{totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  {moq > 1 && (
                    <p className="text-sm text-muted-foreground">Minimum order: {moq} units</p>
                  )}

                  {/* Add to Cart / Buy Now */}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90"
                      size="lg"
                      onClick={addToCart}
                      disabled={!inStock}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={buyNow}
                      disabled={!inStock}
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lead Time */}
              {component.lead_time_days && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Zap className="w-4 h-4" />
                  <span>Lead time: {component.lead_time_days} days</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs: Description, Specs, Downloads */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">
                  <Cpu className="w-4 h-4 mr-2" />
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="downloads" className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">
                  <Download className="w-4 h-4 mr-2" />
                  Downloads
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="pt-6">
                <div className="prose prose-neutral max-w-none">
                  {component.description ? (
                    <p className="text-muted-foreground leading-relaxed">{component.description}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No description available.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="pt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {component.manufacturer && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Manufacturer</span>
                          <span className="font-medium">{component.manufacturer}</span>
                        </div>
                      )}
                      {component.part_number && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Part Number</span>
                          <span className="font-medium font-mono">{component.part_number}</span>
                        </div>
                      )}
                      {component.package && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Package</span>
                          <span className="font-medium">{component.package}</span>
                        </div>
                      )}
                      {component.value && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Value</span>
                          <span className="font-medium">{component.value}</span>
                        </div>
                      )}
                      {component.tolerance && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Tolerance</span>
                          <span className="font-medium">±{component.tolerance}</span>
                        </div>
                      )}
                      {component.voltage_rating && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Voltage Rating</span>
                          <span className="font-medium">{component.voltage_rating}</span>
                        </div>
                      )}
                      {component.current_rating && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Current Rating</span>
                          <span className="font-medium">{component.current_rating}</span>
                        </div>
                      )}
                      {component.power_rating && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Power Rating</span>
                          <span className="font-medium">{component.power_rating}</span>
                        </div>
                      )}
                      {component.temperature_range && (
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Temperature Range</span>
                          <span className="font-medium">{component.temperature_range}</span>
                        </div>
                      )}
                      {/* Dynamic specifications */}
                      {component.specifications && Object.entries(component.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="downloads" className="pt-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Datasheet */}
                  {component.datasheet_url && (
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-destructive" />
                          </div>
                          <div>
                            <p className="font-medium">Datasheet</p>
                            <p className="text-xs text-muted-foreground">PDF Document</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={component.datasheet_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Schematic Symbol */}
                  {component.schematic_symbol_url && (
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Schematic Symbol</p>
                            <p className="text-xs text-muted-foreground">CAD File</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={component.schematic_symbol_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Footprint */}
                  {component.footprint_url && (
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="font-medium">PCB Footprint</p>
                            <p className="text-xs text-muted-foreground">Layout File</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={component.footprint_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* 3D Model */}
                  {component.model_3d_url && (
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Box className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-medium">3D Model</p>
                            <p className="text-xs text-muted-foreground">STEP/IGES File</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={component.model_3d_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Additional Documents */}
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium truncate">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{doc.document_type}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {/* No downloads available */}
                  {!component.datasheet_url && !component.schematic_symbol_url && 
                   !component.footprint_url && !component.model_3d_url && documents.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <Download className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No downloads available for this component.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
