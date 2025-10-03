import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  offering_skill: z.string().min(3, "Skill offering must be at least 3 characters").max(100),
  wanting_skill: z.string().min(3, "Skill wanted must be at least 3 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  category: z.string().min(1, "Please select a category"),
  timeframe: z.string().min(1, "Please specify a timeframe"),
  experience_level: z.string().optional(),
  location_preference: z.string().optional(),
  coins: z.number().min(0).max(1000),
  exchange_type: z.string(),
});

interface CreateSkillExchangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSkillExchangeDialog({ open, onOpenChange }: CreateSkillExchangeDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offering_skill: "",
      wanting_skill: "",
      description: "",
      category: "",
      timeframe: "",
      experience_level: "Intermediate",
      location_preference: "Remote",
      coins: 100,
      exchange_type: "Skill Exchange",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a skill exchange",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch user profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();

      const { error } = await supabase.from("skill_exchanges").insert({
        user_id: user.id,
        offerer_name: profile?.name || user.email?.split("@")[0] || "Anonymous",
        ...values,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your skill exchange has been posted",
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating skill exchange:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create skill exchange",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Design ↔ Development",
    "Writing ↔ Marketing",
    "Music ↔ Video",
    "Teaching ↔ Learning",
    "Business ↔ Tech",
    "Language ↔ Culture",
    "Fitness ↔ Nutrition",
    "Art ↔ Photography",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Skill Exchange</DialogTitle>
          <DialogDescription>
            Post what skill you're offering and what you're looking for in exchange
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="offering_skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I'm Offering</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Logo Design" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wanting_skill"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I'm Looking For</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Web Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you're offering and what you expect in return..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide clear details about the scope and deliverables
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
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
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeframe</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1-2 weeks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="experience_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="In-person">In-person</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coins"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual Coins</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="exchange_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exchange Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Skill Exchange">Skill Exchange</SelectItem>
                      <SelectItem value="Quick Exchange">Quick Exchange</SelectItem>
                      <SelectItem value="Premium Exchange">Premium Exchange</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Exchange
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
