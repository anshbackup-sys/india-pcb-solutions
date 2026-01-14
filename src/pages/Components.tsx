import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  Filter,
  ShoppingCart,
  Package,
  Loader2,
  Grid3X3,
  List,
  ChevronRight,
  Zap,
  FileText,
  Box,
  Plus,
  Minus,
  X,
  Check
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  category_id: string | null;
  datasheet_url: string | null;
  is_featured: boolean | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

interface CartItem {
  component: Component;
  quantity: number;
}

export default function Components() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchComponents();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("component_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchComponents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("components")
        .select("*")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("name");

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setComponents(data || []);
    } catch (error) {
      console.error("Error fetching components:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (component: Component) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.component.id === component.id);
      if (existing) {
        return prev.map((item) =>
          item.component.id === component.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { component, quantity: 1 }];
    });
    toast({
      title: "Added to cart",
      description: `${component.name} added to cart`,
    });
  };

  const updateCartQuantity = (componentId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.component.id === componentId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (componentId: string) => {
    setCart((prev) => prev.filter((item) => item.component.id !== componentId));
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.component.unit_price * item.quantity,
    0
  );

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const filteredComponents = components.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-10 lg:py-16">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <Badge className="mb-3 bg-accent/20 text-accent-foreground border-accent/30">
                <Zap className="w-3 h-3 mr-1" />
                Electronic Components
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
                Component Marketplace
              </h1>
              <p className="text-primary-foreground/80 max-w-xl">
                Source quality electronic components for your projects. Resistors, capacitors, ICs, connectors, and more.
              </p>
            </div>
            
            {/* Cart Button */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button size="lg" className="relative bg-accent hover:bg-accent/90 text-accent-foreground">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground h-6 w-6 flex items-center justify-center p-0">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Cart ({cartCount} items)
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <div key={item.component.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                            {item.component.image_url ? (
                              <img src={item.component.image_url} alt={item.component.name} className="w-12 h-12 object-contain" />
                            ) : (
                              <Package className="w-8 h-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.component.name}</p>
                            <p className="text-sm text-muted-foreground">{item.component.part_number}</p>
                            <p className="text-sm font-medium">₹{item.component.unit_price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartQuantity(item.component.id, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartQuantity(item.component.id, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeFromCart(item.component.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">Total</span>
                          <span className="text-xl font-bold">₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                          <Link to="/checkout">
                            Proceed to Checkout
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-6 border-b bg-muted/30">
        <div className="container-wide">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, part number, or manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-52">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Quick Nav */}
      {categories.length > 0 && (
        <section className="py-4 border-b">
          <div className="container-wide">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-8">
        <div className="container-wide">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredComponents.length > 0 ? (
            <div className={viewMode === "grid" 
              ? "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {filteredComponents.map((component) => (
                viewMode === "grid" ? (
                  <Card key={component.id} className="group overflow-hidden card-hover">
                    <div className="aspect-square bg-muted/50 relative overflow-hidden">
                      {component.image_url ? (
                        <img
                          src={component.image_url}
                          alt={component.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      {component.is_featured && (
                        <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      )}
                      {component.stock_quantity && component.stock_quantity > 0 ? (
                        <Badge variant="outline" className="absolute top-2 right-2 bg-background/90">
                          <Check className="w-3 h-3 mr-1 text-success" />
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="absolute top-2 right-2 bg-background/90 text-destructive">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base line-clamp-1">{component.name}</CardTitle>
                          <p className="text-sm text-muted-foreground font-mono">{component.part_number}</p>
                        </div>
                      </div>
                      {component.manufacturer && (
                        <p className="text-xs text-muted-foreground">{component.manufacturer}</p>
                      )}
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {component.value && (
                          <Badge variant="secondary" className="text-xs">{component.value}</Badge>
                        )}
                        {component.package && (
                          <Badge variant="outline" className="text-xs">{component.package}</Badge>
                        )}
                      </div>
                      <p className="text-2xl font-bold">
                        ₹{component.unit_price.toFixed(2)}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0 gap-2">
                      <Button 
                        className="flex-1 bg-accent hover:bg-accent/90"
                        onClick={() => addToCart(component)}
                        disabled={!component.stock_quantity || component.stock_quantity <= 0}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      {component.datasheet_url && (
                        <Button variant="outline" size="icon" asChild>
                          <a href={component.datasheet_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ) : (
                  <Card key={component.id} className="overflow-hidden">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-20 h-20 bg-muted/50 rounded-lg flex-shrink-0 flex items-center justify-center">
                        {component.image_url ? (
                          <img
                            src={component.image_url}
                            alt={component.name}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{component.name}</h3>
                          {component.is_featured && (
                            <Badge className="bg-accent text-accent-foreground text-xs">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">{component.part_number}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {component.manufacturer && (
                            <span className="text-xs text-muted-foreground">{component.manufacturer}</span>
                          )}
                          {component.value && (
                            <Badge variant="secondary" className="text-xs">{component.value}</Badge>
                          )}
                          {component.package && (
                            <Badge variant="outline" className="text-xs">{component.package}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{component.unit_price.toFixed(2)}</p>
                        {component.stock_quantity && component.stock_quantity > 0 ? (
                          <p className="text-xs text-success">{component.stock_quantity} in stock</p>
                        ) : (
                          <p className="text-xs text-destructive">Out of stock</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => addToCart(component)}
                          disabled={!component.stock_quantity || component.stock_quantity <= 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                        {component.datasheet_url && (
                          <Button variant="outline" size="icon" asChild>
                            <a href={component.datasheet_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No components found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
