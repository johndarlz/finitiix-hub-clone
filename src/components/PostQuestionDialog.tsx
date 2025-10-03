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
  asker_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  asker_email: z.string().email("Invalid email address"),
  question_title: z.string().min(10, "Title must be at least 10 characters").max(200),
  question_details: z.string().min(30, "Details must be at least 30 characters").max(2000),
  category: z.string().min(1, "Please select a category"),
  bounty: z.number().min(0).max(10000),
  difficulty: z.string(),
  urgency: z.string(),
  tags: z.string(),
});

interface PostQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostQuestionDialog({ open, onOpenChange }: PostQuestionDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asker_name: "",
      asker_email: user?.email || "",
      question_title: "",
      question_details: "",
      category: "",
      bounty: 100,
      difficulty: "Intermediate",
      urgency: "Medium",
      tags: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a question",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = values.tags.split(",").map(t => t.trim()).filter(t => t);

      const { error } = await supabase.from("questions").insert({
        user_id: user.id,
        asker_name: values.asker_name,
        asker_email: values.asker_email,
        question_title: values.question_title,
        question_details: values.question_details,
        category: values.category,
        bounty: values.bounty,
        difficulty: values.difficulty,
        urgency: values.urgency,
        tags: tagsArray,
      });

      if (error) throw error;

      toast({
        title: "Question posted!",
        description: "Mentors will be notified and can start answering",
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error posting question:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to post question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Programming", "Design", "Marketing", "Business", "Mathematics",
    "Languages", "Science", "Finance", "Writing", "Music"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a Question</DialogTitle>
          <DialogDescription>
            Ask your question and set a bounty to get expert answers faster
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="asker_name"
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
                name="asker_email"
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
            </div>

            <FormField
              control={form.control}
              name="question_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., How to implement JWT authentication in Node.js?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about your question..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include relevant code, error messages, or context
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
                name="bounty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bounty Amount (₹)</FormLabel>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="node, jwt, auth" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Comma-separated
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                Post Question
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
