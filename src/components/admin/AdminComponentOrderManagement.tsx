import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Package,
  Search,
  Loader2,
  Eye,
  Truck,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

interface ComponentOrder {
  id: string;
  order_number: string;
  user_id: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  status: string;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_pincode: string | null;
  shipping_phone: string | null;
  gst_number: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  name: string;
  part_number: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  confirmed: { label: "Confirmed", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  processing: { label: "Processing", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  shipped: { label: "Shipped", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
  delivered: { label: "Delivered", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function AdminComponentOrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<ComponentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<ComponentOrder | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [saving, setSaving] = useState(false);
  
  // Edit form state
  const [editStatus, setEditStatus] = useState("");
  const [editTracking, setEditTracking] = useState({ number: "", url: "" });
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("component_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data, error } = await supabase
      .from("component_order_items")
      .select("*")
      .eq("order_id", orderId);

    if (!error) {
      setOrderItems(data || []);
    }
  };

  const openOrderDetail = (order: ComponentOrder) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditTracking({
      number: order.tracking_number || "",
      url: order.tracking_url || "",
    });
    setEditNotes(order.admin_notes || "");
    fetchOrderItems(order.id);
  };

  const updateOrder = async () => {
    if (!selectedOrder) return;

    setSaving(true);
    try {
      const updates: Record<string, unknown> = {
        status: editStatus,
        tracking_number: editTracking.number || null,
        tracking_url: editTracking.url || null,
        admin_notes: editNotes || null,
      };

      if (editStatus === "shipped") {
        updates.shipped_at = new Date().toISOString();
      }
      if (editStatus === "delivered") {
        (updates as Record<string, unknown>).delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("component_orders")
        .update(updates)
        .eq("id", selectedOrder.id);

      if (error) throw error;

      setOrders(prev =>
        prev.map(o => o.id === selectedOrder.id ? { ...o, ...updates } : o)
      );
      setSelectedOrder(null);

      toast({
        title: "Order updated",
        description: "Order has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = orders.filter(
    order =>
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shipping_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Component Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.shipping_name || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{order.shipping_city}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig[order.status]?.color}>
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(order.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => openOrderDetail(order)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Order {selectedOrder.order_number}</span>
                  <Badge variant="outline" className={statusConfig[selectedOrder.status]?.color}>
                    {statusConfig[selectedOrder.status]?.label || selectedOrder.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Shipping Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-medium">{selectedOrder.shipping_name}</p>
                      <p className="text-muted-foreground">{selectedOrder.shipping_address}</p>
                      <p className="text-muted-foreground">
                        {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_pincode}
                      </p>
                      {selectedOrder.shipping_phone && (
                        <p className="flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {selectedOrder.shipping_phone}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (18%)</span>
                        <span>₹{(selectedOrder.tax_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹{(selectedOrder.shipping_amount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                      </div>
                      {selectedOrder.gst_number && (
                        <p className="text-xs text-muted-foreground pt-2">
                          GST: {selectedOrder.gst_number}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{item.part_number}</p>
                            </TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">₹{item.unit_price.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">₹{item.total_price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Update Form */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Update Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={editStatus} onValueChange={setEditStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tracking Number</Label>
                        <Input
                          value={editTracking.number}
                          onChange={(e) => setEditTracking({ ...editTracking, number: e.target.value })}
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tracking URL</Label>
                        <Input
                          value={editTracking.url}
                          onChange={(e) => setEditTracking({ ...editTracking, url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Admin Notes</Label>
                      <Textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Internal notes..."
                        rows={3}
                      />
                    </div>

                    <Button onClick={updateOrder} disabled={saving} className="bg-accent hover:bg-accent/90">
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Truck className="w-4 h-4 mr-2" />}
                      Update Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
