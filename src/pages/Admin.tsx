import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminQuoteManagement } from "@/components/admin/AdminQuoteManagement";
import { AdminOrderManagement } from "@/components/admin/AdminOrderManagement";
import { AdminCustomerManagement } from "@/components/admin/AdminCustomerManagement";
import { AdminProductManagement } from "@/components/admin/AdminProductManagement";
import { AdminDashboardStats } from "@/components/admin/AdminDashboardStats";
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  ShoppingBag,
  Shield,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/dashboard");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="section-padding bg-gradient-to-b from-muted/30 to-background min-h-screen">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-xl">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage quotes, orders, customers, and products
                </p>
              </div>
            </div>
            <Badge className="bg-success/10 text-success border-success/20 self-start">
              Admin Access
            </Badge>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto gap-2 bg-transparent p-0">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 p-3"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="quotes" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 p-3"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Quotes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 p-3"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="customers" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 p-3"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Customers</span>
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 p-3"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <AdminDashboardStats />
            </TabsContent>

            <TabsContent value="quotes" className="mt-6">
              <AdminQuoteManagement />
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <AdminOrderManagement />
            </TabsContent>

            <TabsContent value="customers" className="mt-6">
              <AdminCustomerManagement />
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <AdminProductManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
