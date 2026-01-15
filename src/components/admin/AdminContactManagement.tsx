import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Building,
  Clock,
  User,
  Loader2,
  Check,
  X,
  Trash2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  inquiry_type: string;
  subject: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  replied_at: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  in_progress: { label: "In Progress", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  resolved: { label: "Resolved", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  spam: { label: "Spam", color: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function AdminContactManagement() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load contact inquiries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    setSaving(true);
    try {
      const updateData: { status: string; replied_at?: string } = { status };
      if (status === "resolved") {
        updateData.replied_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("contact_inquiries")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setInquiries(prev =>
        prev.map(inq => inq.id === id ? { ...inq, ...updateData } : inq)
      );

      toast({
        title: "Status updated",
        description: `Inquiry marked as ${statusConfig[status]?.label || status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedInquiry) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .update({ admin_notes: adminNotes })
        .eq("id", selectedInquiry.id);

      if (error) throw error;

      setInquiries(prev =>
        prev.map(inq => inq.id === selectedInquiry.id ? { ...inq, admin_notes: adminNotes } : inq)
      );

      toast({
        title: "Notes saved",
        description: "Admin notes have been updated.",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const { error } = await supabase
        .from("contact_inquiries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setInquiries(prev => prev.filter(inq => inq.id !== id));
      setSelectedInquiry(null);

      toast({
        title: "Deleted",
        description: "Inquiry has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to delete inquiry.",
        variant: "destructive",
      });
    }
  };

  const filteredInquiries = inquiries.filter(
    inq =>
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openInquiryDetail = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
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
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{inquiries.filter(i => i.status === "new").length}</div>
            <p className="text-sm text-muted-foreground">New</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{inquiries.filter(i => i.status === "in_progress").length}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{inquiries.filter(i => i.status === "resolved").length}</div>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{inquiries.length}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inquiries found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
                  onClick={() => openInquiryDetail(inquiry)}
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{inquiry.name}</span>
                      <Badge variant="outline" className={statusConfig[inquiry.status]?.color}>
                        {statusConfig[inquiry.status]?.label || inquiry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-1">{inquiry.email}</p>
                    <p className="text-sm line-clamp-2">{inquiry.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(inquiry.created_at), "MMM d, yyyy h:mm a")}
                      </span>
                      {inquiry.inquiry_type && (
                        <Badge variant="secondary" className="text-xs">{inquiry.inquiry_type}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Inquiry Details</span>
                  <Badge variant="outline" className={statusConfig[selectedInquiry.status]?.color}>
                    {statusConfig[selectedInquiry.status]?.label || selectedInquiry.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedInquiry.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <a href={`mailto:${selectedInquiry.email}`} className="font-medium text-accent hover:underline">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <a href={`tel:${selectedInquiry.phone}`} className="font-medium">
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedInquiry.company_name && (
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{selectedInquiry.company_name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this inquiry..."
                    className="min-h-[100px]"
                  />
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={saveAdminNotes}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Notes
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateInquiryStatus(selectedInquiry.id, "in_progress")}
                    disabled={saving || selectedInquiry.status === "in_progress"}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Mark In Progress
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-success"
                    onClick={() => updateInquiryStatus(selectedInquiry.id, "resolved")}
                    disabled={saving || selectedInquiry.status === "resolved"}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Resolved
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateInquiryStatus(selectedInquiry.id, "spam")}
                    disabled={saving || selectedInquiry.status === "spam"}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Mark as Spam
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive ml-auto"
                    onClick={() => deleteInquiry(selectedInquiry.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created: {format(new Date(selectedInquiry.created_at), "MMM d, yyyy h:mm a")}</span>
                  {selectedInquiry.replied_at && (
                    <span>Replied: {format(new Date(selectedInquiry.replied_at), "MMM d, yyyy h:mm a")}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
