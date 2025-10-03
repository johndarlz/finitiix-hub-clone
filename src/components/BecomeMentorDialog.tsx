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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  expertise: z.string().min(5, "Expertise must be at least 5 characters").max(200),
  bio: z.string().min(50, "Bio must be at least 50 characters").max(1000),
  hourly_rate: z.number().min(100).max(10000),
  years_experience: z.number().min(1).max(50),
  response_time: z.string(),
  languages: z.string(),
  skills: z.string(),
});

interface BecomeMentorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BecomeMentorDialog({ open, onOpenChange }: BecomeMentorDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      expertise: "",
      bio: "",
      hourly_rate: 500,
      years_experience: 3,
      response_time: "< 2 hours",
      languages: "English",
      skills: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to become a mentor",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const languagesArray = values.languages.split(",").map(l => l.trim()).filter(l => l);
      const skillsArray = values.skills.split(",").map(s => s.trim()).filter(s => s);

      const { error } = await supabase.from("mentors").insert({
        user_id: user.id,
        name: values.name,
        email: values.email,
        expertise: values.expertise,
        bio: values.bio,
        hourly_rate: values.hourly_rate,
        years_experience: values.years_experience,
        response_time: values.response_time,
        languages: languagesArray,
        skills: skillsArray,
      });

      if (error) throw error;

      toast({
        title: "Welcome as a mentor!",
        description: "Your profile has been created. You can now start answering questions.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating mentor profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create mentor profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Become a Mentor</DialogTitle>
          <DialogDescription>
            Share your expertise and earn money by helping others learn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area of Expertise</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Data Science & Machine Learning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell students about your background, experience, and teaching style..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Highlight your qualifications and what makes you a great mentor
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="hourly_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (₹)</FormLabel>
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

              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years Experience</FormLabel>
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

              <FormField
                control={form.control}
                name="response_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Response Time</FormLabel>
                    <FormControl>
                      <Input placeholder="< 2 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages</FormLabel>
                    <FormControl>
                      <Input placeholder="English, Hindi, Spanish" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Comma-separated
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="Python, Machine Learning, Data Analysis" {...field} />
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
                Become a Mentor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
