import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Settings,
  Building,
  Mail,
  Truck,
  Percent,
  Loader2,
  Save,
} from "lucide-react";

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  gst: string;
}

interface TaxConfig {
  gst_rate: number;
  igst_enabled: boolean;
}

interface EmailConfig {
  from_name: string;
  from_email: string;
}

interface ShippingConfig {
  free_shipping_threshold: number;
  default_shipping_cost: number;
}

export function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "BharatPCBs",
    email: "info@bharatpcbs.com",
    phone: "",
    address: "",
    gst: "",
  });
  
  const [taxConfig, setTaxConfig] = useState<TaxConfig>({
    gst_rate: 18,
    igst_enabled: true,
  });
  
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    from_name: "BharatPCBs",
    from_email: "noreply@bharatpcbs.com",
  });
  
  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>({
    free_shipping_threshold: 5000,
    default_shipping_cost: 150,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("*");

      if (error) throw error;

      data?.forEach((setting) => {
        const value = setting.setting_value as Record<string, unknown>;
        switch (setting.setting_key) {
          case "company_info":
            setCompanyInfo(value as unknown as CompanyInfo);
            break;
          case "tax_config":
            setTaxConfig(value as unknown as TaxConfig);
            break;
          case "email_config":
            setEmailConfig(value as unknown as EmailConfig);
            break;
          case "shipping_config":
            setShippingConfig(value as unknown as ShippingConfig);
            break;
        }
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: object) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("admin_settings")
        .update({ setting_value: value as unknown as Record<string, never> })
        .eq("setting_key", key);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details used across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_email">Email</Label>
              <Input
                id="company_email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_phone">Phone</Label>
              <Input
                id="company_phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_gst">GST Number</Label>
              <Input
                id="company_gst"
                value={companyInfo.gst}
                onChange={(e) => setCompanyInfo({ ...companyInfo, gst: e.target.value.toUpperCase() })}
                className="uppercase"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_address">Address</Label>
            <Input
              id="company_address"
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
            />
          </div>
          <Button onClick={() => saveSetting("company_info", companyInfo as object)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Company Info
          </Button>
        </CardContent>
      </Card>

      {/* Tax Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Tax Configuration
          </CardTitle>
          <CardDescription>
            Configure GST and other tax settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gst_rate">GST Rate (%)</Label>
              <Input
                id="gst_rate"
                type="number"
                value={taxConfig.gst_rate}
                onChange={(e) => setTaxConfig({ ...taxConfig, gst_rate: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button onClick={() => saveSetting("tax_config", taxConfig)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Tax Settings
          </Button>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            Settings for outgoing emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_name">From Name</Label>
              <Input
                id="from_name"
                value={emailConfig.from_name}
                onChange={(e) => setEmailConfig({ ...emailConfig, from_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_email">From Email</Label>
              <Input
                id="from_email"
                type="email"
                value={emailConfig.from_email}
                onChange={(e) => setEmailConfig({ ...emailConfig, from_email: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={() => saveSetting("email_config", emailConfig)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Email Settings
          </Button>
        </CardContent>
      </Card>

      {/* Shipping Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Configuration
          </CardTitle>
          <CardDescription>
            Configure shipping costs and free shipping threshold
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="free_threshold">Free Shipping Threshold (₹)</Label>
              <Input
                id="free_threshold"
                type="number"
                value={shippingConfig.free_shipping_threshold}
                onChange={(e) => setShippingConfig({ ...shippingConfig, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">Orders above this amount get free shipping</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_shipping">Default Shipping Cost (₹)</Label>
              <Input
                id="default_shipping"
                type="number"
                value={shippingConfig.default_shipping_cost}
                onChange={(e) => setShippingConfig({ ...shippingConfig, default_shipping_cost: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">Shipping cost for orders below threshold</p>
            </div>
          </div>
          <Button onClick={() => saveSetting("shipping_config", shippingConfig)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Shipping Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
