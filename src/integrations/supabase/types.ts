export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          component_id: string
          created_at: string
          id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          cart_id: string
          component_id: string
          created_at?: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          cart_id?: string
          component_id?: string
          created_at?: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "shopping_cart"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
        ]
      }
      component_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "component_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      component_documents: {
        Row: {
          component_id: string
          created_at: string
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
        }
        Insert: {
          component_id: string
          created_at?: string
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
        }
        Update: {
          component_id?: string
          created_at?: string
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_documents_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
        ]
      }
      component_images: {
        Row: {
          alt_text: string | null
          component_id: string
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          alt_text?: string | null
          component_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          alt_text?: string | null
          component_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "component_images_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
        ]
      }
      component_order_items: {
        Row: {
          component_id: string | null
          created_at: string
          id: string
          name: string
          order_id: string
          part_number: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          component_id?: string | null
          created_at?: string
          id?: string
          name: string
          order_id: string
          part_number: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          component_id?: string | null
          created_at?: string
          id?: string
          name?: string
          order_id?: string
          part_number?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "component_order_items_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "component_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      component_orders: {
        Row: {
          admin_notes: string | null
          created_at: string
          delivered_at: string | null
          gst_number: string | null
          id: string
          notes: string | null
          order_number: string
          shipped_at: string | null
          shipping_address: string | null
          shipping_amount: number | null
          shipping_city: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_pincode: string | null
          shipping_state: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          delivered_at?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          order_number: string
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_pincode?: string | null
          shipping_state?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          delivered_at?: string | null
          gst_number?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          shipped_at?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_pincode?: string | null
          shipping_state?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      components: {
        Row: {
          bulk_prices: Json | null
          category_id: string | null
          created_at: string
          current_rating: string | null
          datasheet_url: string | null
          description: string | null
          footprint_url: string | null
          height_mm: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          lead_time_days: number | null
          length_mm: number | null
          low_stock_threshold: number | null
          manufacturer: string | null
          meta_description: string | null
          meta_title: string | null
          model_3d_url: string | null
          moq: number | null
          name: string
          package: string | null
          part_number: string
          power_rating: string | null
          schematic_symbol_url: string | null
          specifications: Json | null
          stock_quantity: number | null
          temperature_range: string | null
          tolerance: string | null
          unit_price: number
          updated_at: string
          value: string | null
          voltage_rating: string | null
          weight_grams: number | null
          width_mm: number | null
        }
        Insert: {
          bulk_prices?: Json | null
          category_id?: string | null
          created_at?: string
          current_rating?: string | null
          datasheet_url?: string | null
          description?: string | null
          footprint_url?: string | null
          height_mm?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          lead_time_days?: number | null
          length_mm?: number | null
          low_stock_threshold?: number | null
          manufacturer?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model_3d_url?: string | null
          moq?: number | null
          name: string
          package?: string | null
          part_number: string
          power_rating?: string | null
          schematic_symbol_url?: string | null
          specifications?: Json | null
          stock_quantity?: number | null
          temperature_range?: string | null
          tolerance?: string | null
          unit_price: number
          updated_at?: string
          value?: string | null
          voltage_rating?: string | null
          weight_grams?: number | null
          width_mm?: number | null
        }
        Update: {
          bulk_prices?: Json | null
          category_id?: string | null
          created_at?: string
          current_rating?: string | null
          datasheet_url?: string | null
          description?: string | null
          footprint_url?: string | null
          height_mm?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          lead_time_days?: number | null
          length_mm?: number | null
          low_stock_threshold?: number | null
          manufacturer?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model_3d_url?: string | null
          moq?: number | null
          name?: string
          package?: string | null
          part_number?: string
          power_rating?: string | null
          schematic_symbol_url?: string | null
          specifications?: Json | null
          stock_quantity?: number | null
          temperature_range?: string | null
          tolerance?: string | null
          unit_price?: number
          updated_at?: string
          value?: string | null
          voltage_rating?: string | null
          weight_grams?: number | null
          width_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "components_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "component_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          admin_notes: string | null
          assigned_to: string | null
          company_name: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          phone: string | null
          replied_at: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          assigned_to?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string
          message: string
          name: string
          phone?: string | null
          replied_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          assigned_to?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          phone?: string | null
          replied_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          admin_notes: string | null
          assembly_cost: number | null
          assembly_required: boolean | null
          assembly_sides: string | null
          assembly_type: string | null
          board_height: number | null
          board_thickness: string | null
          board_type: string | null
          board_width: number | null
          castellated_holes: boolean | null
          component_sourcing: string | null
          conformal_coating: string | null
          copper_weight: string | null
          created_at: string
          customer_notes: string | null
          different_designs: number | null
          edge_plating: boolean | null
          estimated_price: number | null
          fabrication_cost: number | null
          final_price: number | null
          gold_finger_chamfer: string | null
          gold_finger_length: string | null
          gold_fingers: boolean | null
          id: string
          impedance_control: boolean | null
          inner_copper_weight: string | null
          ipc_class: string | null
          layers: number | null
          lead_time_days: number | null
          lead_time_type: string | null
          material: string | null
          min_hole_size: string | null
          min_track_spacing: string | null
          order_number: string
          panel_qty: number | null
          panelization_type: string | null
          pcb_type: string | null
          quantity: number | null
          quote_approved_at: string | null
          quote_sent_at: string | null
          silkscreen_color: string | null
          solder_mask_color: string | null
          status: Database["public"]["Enums"]["order_status"]
          stencil_type: string | null
          surface_finish: string | null
          testing_cost: number | null
          testing_required: boolean | null
          testing_type: string[] | null
          total_cost: number | null
          tracking_number: string | null
          tracking_url: string | null
          ul_marking: boolean | null
          updated_at: string
          user_id: string
          via_process: string | null
          xray_inspection: boolean | null
        }
        Insert: {
          admin_notes?: string | null
          assembly_cost?: number | null
          assembly_required?: boolean | null
          assembly_sides?: string | null
          assembly_type?: string | null
          board_height?: number | null
          board_thickness?: string | null
          board_type?: string | null
          board_width?: number | null
          castellated_holes?: boolean | null
          component_sourcing?: string | null
          conformal_coating?: string | null
          copper_weight?: string | null
          created_at?: string
          customer_notes?: string | null
          different_designs?: number | null
          edge_plating?: boolean | null
          estimated_price?: number | null
          fabrication_cost?: number | null
          final_price?: number | null
          gold_finger_chamfer?: string | null
          gold_finger_length?: string | null
          gold_fingers?: boolean | null
          id?: string
          impedance_control?: boolean | null
          inner_copper_weight?: string | null
          ipc_class?: string | null
          layers?: number | null
          lead_time_days?: number | null
          lead_time_type?: string | null
          material?: string | null
          min_hole_size?: string | null
          min_track_spacing?: string | null
          order_number: string
          panel_qty?: number | null
          panelization_type?: string | null
          pcb_type?: string | null
          quantity?: number | null
          quote_approved_at?: string | null
          quote_sent_at?: string | null
          silkscreen_color?: string | null
          solder_mask_color?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stencil_type?: string | null
          surface_finish?: string | null
          testing_cost?: number | null
          testing_required?: boolean | null
          testing_type?: string[] | null
          total_cost?: number | null
          tracking_number?: string | null
          tracking_url?: string | null
          ul_marking?: boolean | null
          updated_at?: string
          user_id: string
          via_process?: string | null
          xray_inspection?: boolean | null
        }
        Update: {
          admin_notes?: string | null
          assembly_cost?: number | null
          assembly_required?: boolean | null
          assembly_sides?: string | null
          assembly_type?: string | null
          board_height?: number | null
          board_thickness?: string | null
          board_type?: string | null
          board_width?: number | null
          castellated_holes?: boolean | null
          component_sourcing?: string | null
          conformal_coating?: string | null
          copper_weight?: string | null
          created_at?: string
          customer_notes?: string | null
          different_designs?: number | null
          edge_plating?: boolean | null
          estimated_price?: number | null
          fabrication_cost?: number | null
          final_price?: number | null
          gold_finger_chamfer?: string | null
          gold_finger_length?: string | null
          gold_fingers?: boolean | null
          id?: string
          impedance_control?: boolean | null
          inner_copper_weight?: string | null
          ipc_class?: string | null
          layers?: number | null
          lead_time_days?: number | null
          lead_time_type?: string | null
          material?: string | null
          min_hole_size?: string | null
          min_track_spacing?: string | null
          order_number?: string
          panel_qty?: number | null
          panelization_type?: string | null
          pcb_type?: string | null
          quantity?: number | null
          quote_approved_at?: string | null
          quote_sent_at?: string | null
          silkscreen_color?: string | null
          solder_mask_color?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stencil_type?: string | null
          surface_finish?: string | null
          testing_cost?: number | null
          testing_required?: boolean | null
          testing_type?: string[] | null
          total_cost?: number | null
          tracking_number?: string | null
          tracking_url?: string | null
          ul_marking?: boolean | null
          updated_at?: string
          user_id?: string
          via_process?: string | null
          xray_inspection?: boolean | null
        }
        Relationships: []
      }
      pricing_rules: {
        Row: {
          base_price: number | null
          category: string
          created_at: string
          id: string
          is_active: boolean | null
          min_quantity: number | null
          multiplier: number | null
          option_name: string
          option_value: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          min_quantity?: number | null
          multiplier?: number | null
          option_name: string
          option_value: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          min_quantity?: number | null
          multiplier?: number | null
          option_name?: string
          option_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          created_at: string
          email: string
          gst_number: string | null
          id: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          email: string
          gst_number?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string
          gst_number?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shopping_cart: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      uploaded_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploaded_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      order_status:
        | "quote_requested"
        | "quote_sent"
        | "quote_approved"
        | "in_fabrication"
        | "in_assembly"
        | "testing"
        | "dispatched"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer"],
      order_status: [
        "quote_requested",
        "quote_sent",
        "quote_approved",
        "in_fabrication",
        "in_assembly",
        "testing",
        "dispatched",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
