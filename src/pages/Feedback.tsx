import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Upload, MessageSquare, Bug, Lightbulb, DollarSign, HelpCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    feedback_type: '',
    subject: '',
    description: '',
    consent_contact: false
  });

  const feedbackTypes = [
    { value: 'bug_report', label: 'Bug Report', icon: Bug },
    { value: 'feature_request', label: 'Feature Request', icon: Lightbulb },
    { value: 'general_feedback', label: 'General Feedback', icon: MessageSquare },
    { value: 'payment_issue', label: 'Payment Issue', icon: DollarSign },
    { value: 'other', label: 'Other', icon: HelpCircle }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedback_type || !formData.subject || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id,
          name: formData.name,
          email: formData.email,
          feedback_type: formData.feedback_type,
          subject: formData.subject,
          description: formData.description,
          rating: rating || null,
          consent_contact: formData.consent_contact
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it soon."
      });

      // Reset form
      setFormData({
        name: user?.user_metadata?.name || '',
        email: user?.email || '',
        feedback_type: '',
        subject: '',
        description: '',
        consent_contact: false
      });
      setRating(0);

    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Share Your Feedback
          </h1>
          <p className="text-muted-foreground mt-2">
            Help us improve FinitiixHub by sharing your thoughts and suggestions
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Feedback Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>

              {/* Feedback Type */}
              <div className="space-y-2">
                <Label>Feedback Type</Label>
                <Select 
                  value={formData.feedback_type} 
                  onValueChange={(value) => setFormData({...formData, feedback_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feedbackTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Brief description of your feedback"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed message about your feedback, issue, or suggestion"
                  className="min-h-32"
                  required
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label>Overall Experience Rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating > 0 ? `${rating}/5 stars` : 'No rating'}
                  </span>
                </div>
              </div>

              {/* File Upload Placeholder */}
              <div className="space-y-2">
                <Label>Screenshot / File Upload (Optional)</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center text-muted-foreground">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">File upload coming soon</p>
                  <p className="text-xs">You can attach images or documents to help us understand your feedback</p>
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent_contact}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, consent_contact: checked as boolean})
                  }
                />
                <Label htmlFor="consent" className="text-sm">
                  I agree to be contacted regarding my feedback
                </Label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? 'Sending Feedback...' : 'Send Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;