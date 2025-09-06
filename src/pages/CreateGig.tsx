import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload, Video, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateGig() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    delivery_time: "",
    description: "",
    revisions: "",
    creator_name: "",
    additional_notes: ""
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Design & Creative",
    "Programming & Tech", 
    "Video Editing",
    "Content Creation",
    "Digital Marketing",
    "Business Consulting",
    "Music & Audio",
    "Writing",
    "Other"
  ];

  const deliveryTimes = ["1 hr", "5 hrs", "1 Day", "2 Days", "3 Days", "5 Days", "Other"];
  const revisionOptions = ["1 Revision", "2 Revisions", "3 Revisions", "Unlimited Revisions"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addPortfolioLink = () => {
    setPortfolioLinks([...portfolioLinks, ""]);
  };

  const updatePortfolioLink = (index: number, value: string) => {
    const updated = [...portfolioLinks];
    updated[index] = value;
    setPortfolioLinks(updated);
  };

  const removePortfolioLink = (index: number) => {
    setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in to create a gig", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const gigData = {
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        skills_tags: skills,
        price: parseFloat(formData.price),
        delivery_time: formData.delivery_time,
        description: formData.description,
        revisions: formData.revisions,
        links: portfolioLinks.filter(link => link.trim()),
        creator_name: formData.creator_name,
        additional_notes: formData.additional_notes,
        status: 'active'
      };

      const { error } = await supabase
        .from('gigs')
        .insert([gigData]);

      if (error) throw error;

      toast({ title: "Gig created successfully!" });
      navigate('/bubble-gigs');
    } catch (error) {
      console.error('Error creating gig:', error);
      toast({ title: "Error creating gig", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">🎥 BubbleGigs – Create Your 1-Minute Video Gig</h1>
          <p className="text-muted-foreground">Share your skills and connect with potential clients</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Gig Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Professional Logo Design in 24hrs"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => handleInputChange("category", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="skills">Skills / Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Pricing (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 2500"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="delivery_time">Delivery Time *</Label>
                  <Select onValueChange={(value) => handleInputChange("delivery_time", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Gig Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Short description of what you offer, including benefits"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="revisions">Revisions Included *</Label>
                <Select onValueChange={(value) => handleInputChange("revisions", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select revisions" />
                  </SelectTrigger>
                  <SelectContent>
                    {revisionOptions.map((revision) => (
                      <SelectItem key={revision} value={revision}>
                        {revision}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="creator_name">Creator Name / Brand Name *</Label>
                <Input
                  id="creator_name"
                  placeholder="Name that will be displayed on your gig"
                  value={formData.creator_name}
                  onChange={(e) => handleInputChange("creator_name", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media & Portfolio (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Upload Pitch Video</p>
                  <p className="text-xs text-muted-foreground">MP4 / MOV | Max 50 MB | 60 seconds</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Upload Cover Image</p>
                  <p className="text-xs text-muted-foreground">JPG / PNG | Max 500 KB</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>

              <div>
                <Label>Portfolio Links</Label>
                {portfolioLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add portfolio, website, GitHub, Behance, etc."
                      value={link}
                      onChange={(e) => updatePortfolioLink(index, e.target.value)}
                    />
                    {portfolioLinks.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePortfolioLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addPortfolioLink} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additional_notes"
                  placeholder="Special offers, conditions, or instructions for buyers"
                  value={formData.additional_notes}
                  onChange={(e) => handleInputChange("additional_notes", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/bubble-gigs')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Gig"}
            </Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}