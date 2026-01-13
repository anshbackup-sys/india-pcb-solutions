import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Package, 
  Users, 
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface DashboardStats {
  totalQuotes: number;
  pendingQuotes: number;
  totalOrders: number;
  activeOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: {
    id: string;
    order_number: string;
    status: string;
    created_at: string;
    final_price: number | null;
  }[];
}

export function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalQuotes: 0,
    pendingQuotes: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch orders stats
      const { data: orders } = await supabase
        .from("orders")
        .select("id, order_number, status, created_at, final_price");

      // Fetch customers count
      const { count: customersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (orders) {
        const pendingQuotes = orders.filter(o => o.status === "quote_requested").length;
        const activeOrders = orders.filter(o => 
          ["quote_approved", "in_fabrication", "in_assembly", "testing"].includes(o.status)
        ).length;
        const totalRevenue = orders
          .filter(o => o.status === "delivered")
          .reduce((sum, o) => sum + (o.final_price || 0), 0);

        setStats({
          totalQuotes: orders.filter(o => ["quote_requested", "quote_sent"].includes(o.status)).length,
          pendingQuotes,
          totalOrders: orders.length,
          activeOrders,
          totalCustomers: customersCount || 0,
          totalRevenue,
          recentOrders: orders.slice(0, 5),
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    quote_requested: "bg-warning/10 text-warning",
    quote_sent: "bg-primary/10 text-primary",
    quote_approved: "bg-success/10 text-success",
    in_fabrication: "bg-accent/10 text-accent",
    in_assembly: "bg-accent/10 text-accent",
    testing: "bg-primary/10 text-primary",
    dispatched: "bg-success/10 text-success",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const statusLabels: Record<string, string> = {
    quote_requested: "Quote Requested",
    quote_sent: "Quote Sent",
    quote_approved: "Approved",
    in_fabrication: "Fabrication",
    in_assembly: "Assembly",
    testing: "Testing",
    dispatched: "Dispatched",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Quotes</p>
                <p className="text-3xl font-bold text-warning">{stats.pendingQuotes}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            {stats.pendingQuotes > 0 && (
              <p className="text-xs text-warning mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Requires attention
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-3xl font-bold text-accent">{stats.activeOrders}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-xl">
                <Package className="w-6 h-6 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              In production pipeline
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-3xl font-bold text-primary">{stats.totalCustomers}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-success">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-xl">
                <IndianRupee className="w-6 h-6 text-success" />
              </div>
            </div>
            <p className="text-xs text-success mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              From delivered orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                    {order.final_price && (
                      <span className="font-medium">
                        ₹{order.final_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
