-- =============================================
-- PHASE 1: Expand orders table with JLCPCB-level options
-- =============================================

-- Add new PCB specification columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS pcb_type text DEFAULT 'rigid',
ADD COLUMN IF NOT EXISTS material text DEFAULT 'FR-4',
ADD COLUMN IF NOT EXISTS inner_copper_weight text DEFAULT '0.5oz',
ADD COLUMN IF NOT EXISTS min_track_spacing text DEFAULT '6/6mil',
ADD COLUMN IF NOT EXISTS min_hole_size text DEFAULT '0.3mm',
ADD COLUMN IF NOT EXISTS via_process text DEFAULT 'tenting',
ADD COLUMN IF NOT EXISTS impedance_control boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS castellated_holes boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS edge_plating boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS gold_fingers boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS gold_finger_length text,
ADD COLUMN IF NOT EXISTS gold_finger_chamfer text,
ADD COLUMN IF NOT EXISTS panelization_type text DEFAULT 'none',
ADD COLUMN IF NOT EXISTS ul_marking boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS assembly_sides text,
ADD COLUMN IF NOT EXISTS component_sourcing text,
ADD COLUMN IF NOT EXISTS stencil_type text,
ADD COLUMN IF NOT EXISTS xray_inspection boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS conformal_coating text,
ADD COLUMN IF NOT EXISTS ipc_class text DEFAULT 'class2',
ADD COLUMN IF NOT EXISTS lead_time_type text DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS estimated_price numeric,
ADD COLUMN IF NOT EXISTS final_price numeric,
ADD COLUMN IF NOT EXISTS panel_qty integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS different_designs integer DEFAULT 1;

-- =============================================
-- PHASE 2: Pricing Rules Table
-- =============================================

CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  option_name text NOT NULL,
  option_value text NOT NULL,
  base_price numeric DEFAULT 0,
  multiplier numeric DEFAULT 1,
  min_quantity integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category, option_name, option_value)
);

ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage pricing rules"
ON public.pricing_rules
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view pricing rules"
ON public.pricing_rules
FOR SELECT
USING (true);

-- =============================================
-- PHASE 3: Component Marketplace Tables
-- =============================================

-- Component Categories (hierarchical)
CREATE TABLE IF NOT EXISTS public.component_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  parent_id uuid REFERENCES public.component_categories(id) ON DELETE SET NULL,
  image_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.component_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
ON public.component_categories
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.component_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Components Table
CREATE TABLE IF NOT EXISTS public.components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number text NOT NULL,
  manufacturer text,
  category_id uuid REFERENCES public.component_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  
  -- Technical specifications
  value text,
  tolerance text,
  package text,
  voltage_rating text,
  current_rating text,
  power_rating text,
  temperature_range text,
  specifications jsonb DEFAULT '{}',
  
  -- Physical
  length_mm numeric,
  width_mm numeric,
  height_mm numeric,
  weight_grams numeric,
  
  -- Sourcing
  moq integer DEFAULT 1,
  lead_time_days integer,
  unit_price numeric NOT NULL,
  bulk_prices jsonb DEFAULT '[]',
  
  -- Stock
  stock_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 10,
  
  -- Files
  image_url text,
  datasheet_url text,
  schematic_symbol_url text,
  footprint_url text,
  model_3d_url text,
  
  -- Status
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  
  -- SEO
  meta_title text,
  meta_description text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active components"
ON public.components
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage components"
ON public.components
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Component Images (multiple per component)
CREATE TABLE IF NOT EXISTS public.component_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id uuid REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.component_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view component images"
ON public.component_images
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage component images"
ON public.component_images
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Component Documents
CREATE TABLE IF NOT EXISTS public.component_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id uuid REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL, -- datasheet, schematic, footprint, 3d_model, application_note
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.component_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view component documents"
ON public.component_documents
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage component documents"
ON public.component_documents
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Shopping Cart
CREATE TABLE IF NOT EXISTS public.shopping_cart (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart"
ON public.shopping_cart
FOR ALL
USING (auth.uid() = user_id);

-- Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES public.shopping_cart(id) ON DELETE CASCADE NOT NULL,
  component_id uuid REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(cart_id, component_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart items"
ON public.cart_items
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.shopping_cart
    WHERE id = cart_items.cart_id AND user_id = auth.uid()
  )
);

-- Component Orders
CREATE TABLE IF NOT EXISTS public.component_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  subtotal numeric NOT NULL DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  shipping_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  
  -- Shipping Address
  shipping_name text,
  shipping_address text,
  shipping_city text,
  shipping_state text,
  shipping_pincode text,
  shipping_phone text,
  
  -- GST
  gst_number text,
  
  -- Tracking
  tracking_number text,
  tracking_url text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  
  notes text,
  admin_notes text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.component_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own component orders"
ON public.component_orders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create component orders"
ON public.component_orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all component orders"
ON public.component_orders
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Component Order Items
CREATE TABLE IF NOT EXISTS public.component_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.component_orders(id) ON DELETE CASCADE NOT NULL,
  component_id uuid REFERENCES public.components(id) ON DELETE SET NULL,
  part_number text NOT NULL,
  name text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.component_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items"
ON public.component_order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.component_orders
    WHERE id = component_order_items.order_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all order items"
ON public.component_order_items
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- PHASE 4: Storage Buckets for Marketplace
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('component-images', 'component-images', true),
  ('component-documents', 'component-documents', true),
  ('component-3d-models', 'component-3d-models', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for component images
CREATE POLICY "Anyone can view component images"
ON storage.objects FOR SELECT
USING (bucket_id = 'component-images');

CREATE POLICY "Admins can upload component images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'component-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update component images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'component-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete component images"
ON storage.objects FOR DELETE
USING (bucket_id = 'component-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for component documents
CREATE POLICY "Anyone can view component documents storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'component-documents');

CREATE POLICY "Admins can upload component documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'component-documents' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete component documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'component-documents' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for 3D models
CREATE POLICY "Anyone can view 3d models"
ON storage.objects FOR SELECT
USING (bucket_id = 'component-3d-models');

CREATE POLICY "Admins can upload 3d models"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'component-3d-models' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete 3d models"
ON storage.objects FOR DELETE
USING (bucket_id = 'component-3d-models' AND has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- PHASE 5: Triggers for updated_at
-- =============================================

CREATE TRIGGER update_pricing_rules_updated_at
BEFORE UPDATE ON public.pricing_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_component_categories_updated_at
BEFORE UPDATE ON public.component_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_components_updated_at
BEFORE UPDATE ON public.components
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_cart_updated_at
BEFORE UPDATE ON public.shopping_cart
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_component_orders_updated_at
BEFORE UPDATE ON public.component_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- PHASE 6: Function to generate component order number
-- =============================================

CREATE OR REPLACE FUNCTION public.generate_component_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.order_number := 'BCOMP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_component_order_number
BEFORE INSERT ON public.component_orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_component_order_number();

-- =============================================
-- PHASE 7: Insert Default Pricing Rules
-- =============================================

INSERT INTO public.pricing_rules (category, option_name, option_value, base_price, multiplier) VALUES
-- Layer pricing
('board', 'layers', '1', 50, 1),
('board', 'layers', '2', 80, 1),
('board', 'layers', '4', 200, 1),
('board', 'layers', '6', 350, 1),
('board', 'layers', '8', 550, 1),
('board', 'layers', '10', 800, 1),
-- Material pricing
('board', 'material', 'FR-4', 0, 1),
('board', 'material', 'FR-4 High TG', 50, 1.2),
('board', 'material', 'Aluminum', 100, 1.5),
('board', 'material', 'Rogers 4003C', 200, 2),
('board', 'material', 'Rogers 4350B', 250, 2.2),
-- Thickness pricing
('board', 'thickness', '0.4mm', 20, 1.1),
('board', 'thickness', '0.6mm', 10, 1.05),
('board', 'thickness', '0.8mm', 0, 1),
('board', 'thickness', '1.0mm', 0, 1),
('board', 'thickness', '1.2mm', 0, 1),
('board', 'thickness', '1.6mm', 0, 1),
('board', 'thickness', '2.0mm', 15, 1.1),
('board', 'thickness', '2.4mm', 25, 1.15),
-- Surface finish pricing
('surface', 'finish', 'HASL Leaded', 0, 1),
('surface', 'finish', 'HASL Lead-Free', 20, 1.1),
('surface', 'finish', 'ENIG 1U', 80, 1.3),
('surface', 'finish', 'ENIG 2U', 120, 1.4),
('surface', 'finish', 'OSP', 15, 1.05),
('surface', 'finish', 'Immersion Silver', 60, 1.2),
('surface', 'finish', 'Immersion Tin', 50, 1.15),
('surface', 'finish', 'Hard Gold', 200, 1.8),
-- Lead time multipliers
('leadtime', 'type', 'standard', 0, 1),
('leadtime', 'type', 'expedited', 50, 1.3),
('leadtime', 'type', 'express', 100, 1.6),
('leadtime', 'type', 'rush', 200, 2),
('leadtime', 'type', 'super_rush', 400, 3),
-- Copper weight
('copper', 'outer', '1oz', 0, 1),
('copper', 'outer', '2oz', 40, 1.2),
('copper', 'outer', '2.5oz', 60, 1.3),
('copper', 'outer', '3.5oz', 100, 1.5),
('copper', 'outer', '4.5oz', 150, 1.7)
ON CONFLICT (category, option_name, option_value) DO NOTHING;