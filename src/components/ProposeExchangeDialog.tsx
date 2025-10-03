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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  proposer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  proposer_email: z.string().email("Invalid email address"),
  message: z.string().min(20, "Message must be at least 20 characters").max(500),
});

interface ProposeExchangeDialogProps {
  exchange: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProposeExchangeDialog({ exchange, open, onOpenChange }: ProposeExchangeDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposer_name: "",
      proposer_email: user?.email || "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to propose an exchange",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("skill_exchange_proposals").insert({
        exchange_id: exchange.id,
        proposer_user_id: user.id,
        ...values,
      });

      if (error) throw error;

      toast({
        title: "Proposal sent!",
        description: "The exchange owner will be notified of your proposal",
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send proposal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exchange) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Propose Exchange</DialogTitle>
          <DialogDescription>
            Send a proposal to exchange with {exchange.offerer_name}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg mb-4">
          <div className="text-sm font-medium mb-2">
            {exchange.offering_skill} ↔ {exchange.wanting_skill}
          </div>
          <p className="text-sm text-muted-foreground">{exchange.description}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="proposer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proposer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why you're interested in this exchange and what you can offer..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
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
                Send Proposal
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
