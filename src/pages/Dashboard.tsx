import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Upload, FileText, Clock, ChevronRight, Plus, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const quickActions = [
  {
    icon: Upload,
    title: "Upload PCB Files",
    description: "Start a new quote request",
    href: "/quote",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: FileText,
    title: "View Quotes",
    description: "Check your quote status",
    href: "/dashboard/orders?status=quote",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Package,
    title: "Track Orders",
    description: "Monitor your active orders",
    href: "/dashboard/orders",
    color: "bg-success/10 text-success",
  },
  {
    icon: User,
    title: "Profile",
    description: "Manage your account",
    href: "/dashboard/profile",
    color: "bg-muted text-muted-foreground",
  },
];

// Mock recent orders - will be replaced with real data
const recentOrders = [
  {
    id: "1",
    orderNumber: "BPCB-20241224-0001",
    status: "in_fabrication",
    date: "2024-12-24",
    total: "₹12,500",
  },
  {
    id: "2",
    orderNumber: "BPCB-20241223-0042",
    status: "quote_sent",
    date: "2024-12-23",
    total: "Pending",
  },
];

const statusColors: Record<string, string> = {
  quote_requested: "bg-muted text-muted-foreground",
  quote_sent: "bg-warning/10 text-warning",
  quote_approved: "bg-success/10 text-success",
  in_fabrication: "bg-primary/10 text-primary",
  in_assembly: "bg-primary/10 text-primary",
  testing: "bg-accent/10 text-accent",
  dispatched: "bg-success/10 text-success",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  quote_requested: "Quote Requested",
  quote_sent: "Quote Sent",
  quote_approved: "Quote Approved",
  in_fabrication: "In Fabrication",
  in_assembly: "In Assembly",
  testing: "Testing",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function Dashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  return (
    <Layout>
      <div className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Welcome back!
              </h1>
              <p className="text-muted-foreground mt-1">
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/profile">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground"
              >
                Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="h-full card-hover border-border hover:border-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest quote requests and orders</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard/orders">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {order.orderNumber}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className={statusColors[order.status]}>
                              {statusLabels[order.status]}
                            </Badge>
                            <span className="font-medium text-foreground">
                              {order.total}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">
                        No orders yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start by uploading your PCB files to get a quote
                      </p>
                      <Button className="bg-gradient-accent" asChild>
                        <Link to="/quote">
                          <Plus className="w-4 h-4 mr-2" />
                          New Quote Request
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats / Help */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Our engineering team is here to help with your PCB requirements.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border bg-gradient-hero text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🇮🇳</span>
                    <span className="font-semibold">Made in India</span>
                  </div>
                  <p className="text-sm text-primary-foreground/80">
                    All your PCBs are manufactured locally with strict quality control and fast turnaround times.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
