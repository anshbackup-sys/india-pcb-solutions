import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  Upload, 
  FileText, 
  Clock, 
  ChevronRight, 
  Plus, 
  User, 
  Settings,
  CheckCircle2,
  Truck,
  CircuitBoard,
  Loader2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Save,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  quantity: number | null;
  layers: number | null;
  board_width: number | null;
  board_height: number | null;
  estimated_price: number | null;
  final_price: number | null;
  tracking_number: string | null;
  tracking_url: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  company_name: string | null;
  contact_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  gst_number: string | null;
}

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  quote_requested: { color: "bg-muted text-muted-foreground", label: "Quote Requested", icon: FileText },
  quote_sent: { color: "bg-warning/10 text-warning", label: "Quote Sent", icon: Mail },
  quote_approved: { color: "bg-success/10 text-success", label: "Approved", icon: CheckCircle2 },
  in_fabrication: { color: "bg-primary/10 text-primary", label: "In Fabrication", icon: CircuitBoard },
  in_assembly: { color: "bg-primary/10 text-primary", label: "In Assembly", icon: CircuitBoard },
  testing: { color: "bg-accent/10 text-accent", label: "Testing", icon: CircuitBoard },
  dispatched: { color: "bg-success/10 text-success", label: "Dispatched", icon: Truck },
  delivered: { color: "bg-success/10 text-success", label: "Delivered", icon: CheckCircle2 },
  cancelled: { color: "bg-destructive/10 text-destructive", label: "Cancelled", icon: X },
};

const statusTimeline = [
  "quote_requested",
  "quote_sent", 
  "quote_approved",
  "in_fabrication",
  "in_assembly",
  "testing",
  "dispatched",
  "delivered"
];

export default function Dashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchProfile();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      if (data) {
        setProfile(data);
        setProfileForm(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: profileForm.company_name,
          contact_name: profileForm.contact_name,
          phone: profileForm.phone,
          address: profileForm.address,
          city: profileForm.city,
          state: profileForm.state,
          pincode: profileForm.pincode,
          gst_number: profileForm.gst_number,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      
      toast({ title: "Profile updated successfully!" });
      setProfile({ ...profile, ...profileForm } as Profile);
      setEditingProfile(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({ title: "Failed to save profile", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusStep = (status: string) => {
    return statusTimeline.indexOf(status);
  };

  const quickActions = [
    { icon: Upload, title: "New Quote", description: "Upload PCB files", href: "/quote", color: "bg-accent/10 text-accent" },
    { icon: Package, title: "Components", description: "Browse marketplace", href: "/components", color: "bg-primary/10 text-primary" },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome back, {profile?.contact_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {profile?.company_name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-accent hover:bg-accent/90" asChild>
                <Link to="/quote">
                  <Plus className="w-4 h-4 mr-2" />
                  New Quote
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="h-full card-hover border-border hover:border-accent/50 transition-colors">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-flex">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                My Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const currentStep = getStatusStep(order.status);
                    const StatusIcon = statusConfig[order.status]?.icon || FileText;
                    
                    return (
                      <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="pb-3 bg-muted/30">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <CircuitBoard className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-mono">{order.order_number}</CardTitle>
                                <CardDescription>
                                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={statusConfig[order.status]?.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[order.status]?.label}
                              </Badge>
                              {(order.final_price || order.estimated_price) && (
                                <span className="font-semibold text-lg">
                                  ₹{(order.final_price || order.estimated_price)?.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {/* Order Details */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
                            <div>
                              <p className="text-muted-foreground">Layers</p>
                              <p className="font-medium">{order.layers || "-"}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Quantity</p>
                              <p className="font-medium">{order.quantity || "-"} pcs</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Size</p>
                              <p className="font-medium">
                                {order.board_width && order.board_height 
                                  ? `${order.board_width}×${order.board_height}mm` 
                                  : "-"}
                              </p>
                            </div>
                            {order.tracking_number && (
                              <div>
                                <p className="text-muted-foreground">Tracking</p>
                                <a 
                                  href={order.tracking_url || "#"} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="font-medium text-accent hover:underline"
                                >
                                  {order.tracking_number}
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Status Timeline */}
                          <div className="relative">
                            <div className="flex items-center justify-between">
                              {statusTimeline.slice(0, 6).map((status, index) => {
                                const isCompleted = index <= currentStep;
                                const isCurrent = index === currentStep;
                                const Icon = statusConfig[status]?.icon || FileText;
                                
                                return (
                                  <div 
                                    key={status} 
                                    className={`flex flex-col items-center relative z-10 ${
                                      index < 5 ? "flex-1" : ""
                                    }`}
                                  >
                                    <div 
                                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                        isCompleted 
                                          ? "bg-success text-success-foreground" 
                                          : "bg-muted text-muted-foreground"
                                      } ${isCurrent ? "ring-2 ring-success ring-offset-2" : ""}`}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4" />
                                      ) : (
                                        <Icon className="w-4 h-4" />
                                      )}
                                    </div>
                                    <p className={`text-xs mt-1 text-center hidden sm:block ${
                                      isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                                    }`}>
                                      {statusConfig[status]?.label.split(" ")[0]}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Progress Line */}
                            <div className="absolute top-4 left-4 right-4 h-0.5 bg-muted -z-0">
                              <div 
                                className="h-full bg-success transition-all"
                                style={{ 
                                  width: `${Math.min((currentStep / 5) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by uploading your PCB files to get a quote
                    </p>
                    <Button className="bg-accent hover:bg-accent/90" asChild>
                      <Link to="/quote">
                        <Plus className="w-4 h-4 mr-2" />
                        New Quote Request
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Company Profile
                    </CardTitle>
                    <CardDescription>Manage your business information</CardDescription>
                  </div>
                  {editingProfile ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingProfile(false);
                          setProfileForm(profile || {});
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      {editingProfile ? (
                        <Input
                          id="company_name"
                          value={profileForm.company_name || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-foreground">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {profile?.company_name || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_name">Contact Name</Label>
                      {editingProfile ? (
                        <Input
                          id="contact_name"
                          value={profileForm.contact_name || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, contact_name: e.target.value })}
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-foreground">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {profile?.contact_name || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <p className="flex items-center gap-2 text-foreground">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {profile?.email || user?.email}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {editingProfile ? (
                        <Input
                          id="phone"
                          value={profileForm.phone || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-foreground">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {profile?.phone || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      {editingProfile ? (
                        <Input
                          id="address"
                          value={profileForm.address || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {profile?.address || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      {editingProfile ? (
                        <Input
                          id="city"
                          value={profileForm.city || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground">{profile?.city || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      {editingProfile ? (
                        <Input
                          id="state"
                          value={profileForm.state || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground">{profile?.state || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      {editingProfile ? (
                        <Input
                          id="pincode"
                          value={profileForm.pincode || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground">{profile?.pincode || "-"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gst_number">GST Number</Label>
                      {editingProfile ? (
                        <Input
                          id="gst_number"
                          value={profileForm.gst_number || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, gst_number: e.target.value })}
                        />
                      ) : (
                        <p className="text-foreground font-mono">{profile?.gst_number || "-"}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Help Card */}
          <Card className="mt-8 bg-gradient-hero text-primary-foreground">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl">🇮🇳</span>
                <div>
                  <p className="font-semibold">Need Help?</p>
                  <p className="text-sm text-primary-foreground/80">
                    Our engineering team is available for support
                  </p>
                </div>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
