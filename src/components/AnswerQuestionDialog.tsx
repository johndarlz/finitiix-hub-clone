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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, DollarSign } from "lucide-react";

const formSchema = z.object({
  answer_content: z.string().min(50, "Answer must be at least 50 characters").max(5000),
});

interface AnswerQuestionDialogProps {
  question: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnswerQuestionDialog({ question, open, onOpenChange }: AnswerQuestionDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answer_content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to answer questions",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Fetch mentor profile
      const { data: mentor } = await supabase
        .from("mentors")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch user profile if not a mentor
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", user.id)
        .maybeSingle();

      const mentorName = mentor?.name || profile?.name || user.email?.split("@")[0] || "Anonymous";

      const { error } = await supabase.from("answers").insert({
        question_id: question.id,
        mentor_user_id: user.id,
        mentor_name: mentorName,
        answer_content: values.answer_content,
      });

      if (error) throw error;

      toast({
        title: "Answer posted!",
        description: "The question asker will be notified",
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error posting answer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post answer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Answer Question</DialogTitle>
          <DialogDescription>
            Provide a detailed answer to help the asker
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted p-4 rounded-lg mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{question.question_title}</h3>
            <Badge variant="default" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              ₹{question.bounty}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{question.question_details}</p>
          <div className="flex flex-wrap gap-2">
            {question.tags?.map((tag: string, idx: number) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="answer_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed solution with explanations, code examples if needed..."
                      className="min-h-[200px] font-mono text-sm"
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
                Post Answer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
