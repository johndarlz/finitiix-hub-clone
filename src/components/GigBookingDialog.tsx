import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Gig {
  id: string;
  title: string;
  price: number;
  delivery_time: string;
  creator_name: string;
  description: string;
}

interface GigBookingDialogProps {
  gig: Gig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GigBookingDialog({ gig, open, onOpenChange }: GigBookingDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    buyer_name: "",
    buyer_email: user?.email || "",
    buyer_phone: "",
    project_requirements: "",
    special_instructions: "",
    payment_method: "",
    agreed_to_terms: false
  });

  const [referenceLinks, setReferenceLinks] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addReferenceLink = () => {
    setReferenceLinks([...referenceLinks, ""]);
  };

  const updateReferenceLink = (index: number, value: string) => {
    const updated = [...referenceLinks];
    updated[index] = value;
    setReferenceLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gig) return;

    if (!formData.agreed_to_terms) {
      toast({ title: "Please agree to terms & conditions", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bookingData = {
        gig_id: gig.id,
        buyer_user_id: user?.id || null,
        buyer_name: formData.buyer_name,
        buyer_email: formData.buyer_email,
        buyer_phone: formData.buyer_phone,
        project_requirements: formData.project_requirements,
        reference_links: referenceLinks.filter(link => link.trim()),
        special_instructions: formData.special_instructions,
        payment_method: formData.payment_method,
        total_amount: gig.price,
        status: 'pending'
      };

      const { error } = await supabase
        .from('gig_bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({ title: "Booking confirmed successfully!" });
      onOpenChange(false);
      
      // Reset form
      setFormData({
        buyer_name: "",
        buyer_email: user?.email || "",
        buyer_phone: "",
        project_requirements: "",
        special_instructions: "",
        payment_method: "",
        agreed_to_terms: false
      });
      setReferenceLinks([""]);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({ title: "Error creating booking", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!gig) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Gig: {gig.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Gig Details</h3>
            <p><strong>Service:</strong> {gig.title}</p>
            <p><strong>Creator:</strong> {gig.creator_name}</p>
            <p><strong>Price:</strong> ₹{gig.price}</p>
            <p><strong>Delivery Time:</strong> {gig.delivery_time}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyer_name">Buyer Name *</Label>
                <Input
                  id="buyer_name"
                  placeholder="Full name"
                  value={formData.buyer_name}
                  onChange={(e) => handleInputChange("buyer_name", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="buyer_email">Email Address *</Label>
                <Input
                  id="buyer_email"
                  type="email"
                  placeholder="For communication & delivery"
                  value={formData.buyer_email}
                  onChange={(e) => handleInputChange("buyer_email", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="buyer_phone">Phone Number (Optional)</Label>
              <Input
                id="buyer_phone"
                placeholder="Your phone number"
                value={formData.buyer_phone}
                onChange={(e) => handleInputChange("buyer_phone", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="project_requirements">Project Requirements *</Label>
              <Textarea
                id="project_requirements"
                placeholder="Describe what you want – details, preferences, references"
                value={formData.project_requirements}
                onChange={(e) => handleInputChange("project_requirements", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Upload Reference Files</p>
                <p className="text-xs text-muted-foreground">JPG / PNG / PDF / DOCX / ZIP | Max 500 KB each</p>
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            <div>
              <Label>Reference Links (Optional)</Label>
              {referenceLinks.map((link, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    placeholder="Share links to inspiration, brand guidelines, or examples"
                    value={link}
                    onChange={(e) => updateReferenceLink(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addReferenceLink}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="special_instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="special_instructions"
                placeholder="Anything specific the seller should know"
                value={formData.special_instructions}
                onChange={(e) => handleInputChange("special_instructions", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="payment_method">Payment Method *</Label>
              <Select onValueChange={(value) => handleInputChange("payment_method", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Debit/Credit Card</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="wallet">Wallets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreed_to_terms}
                onCheckedChange={(checked) => handleInputChange("agreed_to_terms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms & conditions and confirm this booking.
              </Label>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.agreed_to_terms}
            >
              {isSubmitting ? "Confirming..." : `Confirm Booking - ₹${gig.price}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}