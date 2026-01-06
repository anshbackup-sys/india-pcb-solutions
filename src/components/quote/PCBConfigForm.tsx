import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const pcbConfigSchema = z.object({
  quantity: z.string().min(1, "Quantity is required"),
  layers: z.string().min(1, "Number of layers is required"),
  thickness: z.string().min(1, "Thickness is required"),
  material: z.string().min(1, "Material is required"),
  surfaceFinish: z.string().min(1, "Surface finish is required"),
  copperWeight: z.string().min(1, "Copper weight is required"),
  solderMask: z.string().min(1, "Solder mask color is required"),
  silkscreen: z.string().min(1, "Silkscreen color is required"),
  boardWidth: z.string().min(1, "Board width is required"),
  boardHeight: z.string().min(1, "Board height is required"),
  leadTime: z.string().min(1, "Lead time is required"),
  specialRequirements: z.string().optional(),
});

export type PCBConfig = z.infer<typeof pcbConfigSchema>;

interface PCBConfigFormProps {
  onSubmit: (data: PCBConfig) => void;
  isSubmitting?: boolean;
}

const OPTIONS = {
  layers: ["1", "2", "4", "6", "8", "10", "12"],
  thickness: ["0.6mm", "0.8mm", "1.0mm", "1.2mm", "1.6mm", "2.0mm", "2.4mm"],
  material: ["FR-4", "FR-4 High TG", "Aluminum", "Rogers", "Flex (Polyimide)"],
  surfaceFinish: ["HASL Lead-Free", "HASL Leaded", "ENIG", "OSP", "Immersion Silver", "Immersion Tin"],
  copperWeight: ["1 oz (35μm)", "2 oz (70μm)", "3 oz (105μm)", "4 oz (140μm)"],
  solderMask: ["Green", "Black", "White", "Blue", "Red", "Yellow", "Matte Black"],
  silkscreen: ["White", "Black", "Yellow"],
  leadTime: ["Standard (7-10 days)", "Express (5-7 days)", "Rush (3-5 days)", "Super Rush (24-48 hours)"],
};

export function PCBConfigForm({ onSubmit, isSubmitting }: PCBConfigFormProps) {
  const form = useForm<PCBConfig>({
    resolver: zodResolver(pcbConfigSchema),
    defaultValues: {
      quantity: "10",
      layers: "2",
      thickness: "1.6mm",
      material: "FR-4",
      surfaceFinish: "HASL Lead-Free",
      copperWeight: "1 oz (35μm)",
      solderMask: "Green",
      silkscreen: "White",
      boardWidth: "",
      boardHeight: "",
      leadTime: "Standard (7-10 days)",
      specialRequirements: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="pcb-config-form">
        {/* Board Dimensions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Board Dimensions</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="boardWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boardHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (mm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Quantity & Layers */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity (pcs)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="layers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Layers</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select layers" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIONS.layers.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt} Layer{opt !== "1" ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Material & Thickness */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="material"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIONS.material.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thickness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thickness</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select thickness" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIONS.thickness.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Surface Finish & Copper Weight */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="surfaceFinish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surface Finish</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select finish" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIONS.surfaceFinish.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="copperWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copper Weight</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select copper" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIONS.copperWeight.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Solder Mask & Silkscreen */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="solderMask"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solder Mask Color</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIONS.solderMask.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="silkscreen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Silkscreen Color</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OPTIONS.silkscreen.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Lead Time */}
        <FormField
          control={form.control}
          name="leadTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {OPTIONS.leadTime.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Special Requirements */}
        <FormField
          control={form.control}
          name="specialRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requirements (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="E.g., impedance control, blind vias, specific testing requirements..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
