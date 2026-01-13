import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileText, 
  Search, 
  Eye, 
  Send, 
  CheckCircle,
  Loader2,
  Download,
  RefreshCw
} from "lucide-react";

interface Quote {
  id: string;
  order_number: string;
  status: string;
  created_at: string;
  quantity: number | null;
  layers: number | null;
  board_width: number | null;
  board_height: number | null;
  material: string | null;
  surface_finish: string | null;
  estimated_price: number | null;
  customer_notes: string | null;
  admin_notes: string | null;
  user_id: string;
  profiles?: {
    email: string;
    company_name: string | null;
    contact_name: string | null;
  };
}

export function AdminQuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [priceInput, setPriceInput] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const statusValues = statusFilter === "all" 
        ? ["quote_requested", "quote_sent", "quote_approved"] as const
        : [statusFilter] as const;
      
      let query = supabase
        .from("orders")
        .select(`
          *,
          profiles!orders_user_id_fkey (
            email,
            company_name,
            contact_name
          )
        `)
        .in("status", statusValues)
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      setQuotes((data as unknown as Quote[]) || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch quotes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async () => {
    if (!selectedQuote || !priceInput) {
      toast({
        title: "Price required",
        description: "Please enter a price for the quote",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "quote_sent",
          estimated_price: parseFloat(priceInput),
          admin_notes: adminNotes,
          quote_sent_at: new Date().toISOString(),
        })
        .eq("id", selectedQuote.id);

      if (error) throw error;

      toast({
        title: "Quote sent!",
        description: `Quote has been sent to customer.`,
      });

      setSelectedQuote(null);
      setPriceInput("");
      setAdminNotes("");
      fetchQuotes();
    } catch (error) {
      console.error("Error sending quote:", error);
      toast({
        title: "Error",
        description: "Failed to send quote",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    quote_requested: "bg-warning/10 text-warning",
    quote_sent: "bg-primary/10 text-primary",
    quote_approved: "bg-success/10 text-success",
  };

  const statusLabels: Record<string, string> = {
    quote_requested: "Pending Review",
    quote_sent: "Quote Sent",
    quote_approved: "Approved",
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      quote.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.profiles?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Quote Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchQuotes}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by order number, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quotes</SelectItem>
              <SelectItem value="quote_requested">Pending Review</SelectItem>
              <SelectItem value="quote_sent">Quote Sent</SelectItem>
              <SelectItem value="quote_approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quotes Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredQuotes.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-mono text-sm">
                      {quote.order_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quote.profiles?.company_name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{quote.profiles?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{quote.layers}L, {quote.quantity} pcs</p>
                        <p className="text-xs text-muted-foreground">
                          {quote.board_width}×{quote.board_height}mm
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[quote.status]}>
                        {statusLabels[quote.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {quote.estimated_price ? (
                        <span className="font-medium">₹{quote.estimated_price.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedQuote(quote);
                                setPriceInput(quote.estimated_price?.toString() || "");
                                setAdminNotes(quote.admin_notes || "");
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Quote Details - {quote.order_number}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              {/* Customer Info */}
                              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                <div>
                                  <p className="text-sm text-muted-foreground">Customer</p>
                                  <p className="font-medium">{quote.profiles?.company_name || quote.profiles?.contact_name || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p className="font-medium">{quote.profiles?.email}</p>
                                </div>
                              </div>

                              {/* PCB Specs */}
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Layers</p>
                                  <p className="font-medium">{quote.layers}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Quantity</p>
                                  <p className="font-medium">{quote.quantity} pcs</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Dimensions</p>
                                  <p className="font-medium">{quote.board_width}×{quote.board_height}mm</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Material</p>
                                  <p className="font-medium">{quote.material || "FR-4"}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Surface Finish</p>
                                  <p className="font-medium">{quote.surface_finish || "HASL"}</p>
                                </div>
                              </div>

                              {/* Customer Notes */}
                              {quote.customer_notes && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">Customer Notes</p>
                                  <p className="text-sm p-3 bg-muted rounded">{quote.customer_notes}</p>
                                </div>
                              )}

                              {/* Price Input */}
                              {quote.status === "quote_requested" && (
                                <div className="space-y-4 pt-4 border-t">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Quote Price (₹)</Label>
                                      <Input
                                        type="number"
                                        value={priceInput}
                                        onChange={(e) => setPriceInput(e.target.value)}
                                        placeholder="Enter price..."
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Admin Notes</Label>
                                    <Textarea
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      placeholder="Internal notes about this quote..."
                                      rows={3}
                                    />
                                  </div>
                                  <Button 
                                    onClick={handleSendQuote} 
                                    disabled={isSubmitting || !priceInput}
                                    className="w-full"
                                  >
                                    {isSubmitting ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Send className="w-4 h-4 mr-2" />
                                    )}
                                    Send Quote to Customer
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">No quotes found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
