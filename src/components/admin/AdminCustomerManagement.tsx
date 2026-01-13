import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  Eye, 
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Building,
  MapPin
} from "lucide-react";

interface Customer {
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
  created_at: string;
  orderCount?: number;
  totalSpent?: number;
}

export function AdminCustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;

      // Fetch order counts and totals for each customer
      const customersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: orders } = await supabase
            .from("orders")
            .select("id, final_price, status")
            .eq("user_id", profile.user_id);

          const orderCount = orders?.length || 0;
          const totalSpent = orders
            ?.filter(o => o.status === "delivered")
            .reduce((sum, o) => sum + (o.final_price || 0), 0) || 0;

          return {
            ...profile,
            orderCount,
            totalSpent,
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Customer Management
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchCustomers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, company, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.company_name || customer.contact_name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{customer.contact_name || "-"}</p>
                        <p className="text-xs text-muted-foreground">{customer.phone || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.city ? `${customer.city}, ${customer.state}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {customer.orderCount} orders
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{customer.totalSpent?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Customer Details</DialogTitle>
                          </DialogHeader>
                          {selectedCustomer && (
                            <div className="space-y-4 mt-4">
                              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                                <div className="flex items-center gap-3">
                                  <Building className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Company</p>
                                    <p className="font-medium">{selectedCustomer.company_name || "Not specified"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{selectedCustomer.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{selectedCustomer.phone || "Not specified"}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm text-muted-foreground">Address</p>
                                    <p className="font-medium">
                                      {selectedCustomer.address 
                                        ? `${selectedCustomer.address}, ${selectedCustomer.city}, ${selectedCustomer.state} - ${selectedCustomer.pincode}`
                                        : "Not specified"
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-primary/5 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-primary">{selectedCustomer.orderCount}</p>
                                  <p className="text-sm text-muted-foreground">Total Orders</p>
                                </div>
                                <div className="p-4 bg-success/5 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-success">₹{selectedCustomer.totalSpent?.toLocaleString()}</p>
                                  <p className="text-sm text-muted-foreground">Total Spent</p>
                                </div>
                              </div>

                              {selectedCustomer.gst_number && (
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-sm text-muted-foreground">GST Number</p>
                                  <p className="font-mono font-medium">{selectedCustomer.gst_number}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">No customers found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
