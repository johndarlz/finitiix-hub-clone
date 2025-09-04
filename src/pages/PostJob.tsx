import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    experience_level: "fresher" as const,
    deliverables: "",
    revisions: "",
    budget: "",
    timeline: "flexible" as const,
    timeline_other: "",
    job_type: "online" as const,
    location_preference: "remote",
    ownership_rights: true,
    how_to_apply: "",
    additional_notes: "",
    category: ""
  });

  const categories = [
    "Design & Creative",
    "Programming & Tech",
    "Writing & Translation",
    "Digital Marketing",
    "Video & Animation",
    "Music & Audio",
    "Business",
    "Education & Training"
  ];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addLink = () => {
    if (linkInput.trim() && !links.includes(linkInput.trim())) {
      setLinks([...links, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const removeLink = (link: string) => {
    setLinks(links.filter(l => l !== link));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.size <= 500 * 1024); // 500KB limit
    
    if (selectedFiles.length !== validFiles.length) {
      toast({
        title: "File size limit exceeded",
        description: "Some files are larger than 500KB and were not added.",
        variant: "destructive"
      });
    }
    
    setFiles([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];
    
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('job-files')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data } = supabase.storage.from('job-files').getPublicUrl(fileName);
      return data.publicUrl;
    });
    
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Upload files first
      const fileUrls = await uploadFiles();
      
      const { error } = await supabase.from('jobs').insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        skills_required: skills,
        experience_level: formData.experience_level,
        deliverables: formData.deliverables,
        revisions: formData.revisions,
        budget: parseFloat(formData.budget),
        timeline: formData.timeline,
        timeline_other: formData.timeline_other,
        job_type: formData.job_type,
        location_preference: formData.location_preference,
        ownership_rights: formData.ownership_rights,
        how_to_apply: formData.how_to_apply,
        additional_notes: formData.additional_notes,
        reference_files: fileUrls,
        reference_links: links,
        category: formData.category,
        status: 'active'
      });

      if (error) throw error;

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted and is now visible to applicants."
      });

      navigate('/workzone');
    } catch (error: any) {
      toast({
        title: "Error posting job",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">📝 Post a New Job</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div>
                  <Label htmlFor="title">1. Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Logo Designer, Mobile App Developer, Content Writer"
                    required
                  />
                </div>

                {/* Job Description */}
                <div>
                  <Label htmlFor="description">2. Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Briefly explain the work, tasks, and expectations"
                    rows={5}
                    required
                  />
                </div>

                {/* Skills Required */}
                <div>
                  <Label>3. Skills Required *</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <Label>4. Experience Level *</Label>
                  <Select value={formData.experience_level} onValueChange={(value: any) => setFormData({...formData, experience_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="1-2-years">1-2 years</SelectItem>
                      <SelectItem value="3-5-years">3-5 years</SelectItem>
                      <SelectItem value="5-plus-years">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Deliverables */}
                <div>
                  <Label htmlFor="deliverables">5. Deliverables *</Label>
                  <Textarea
                    id="deliverables"
                    value={formData.deliverables}
                    onChange={(e) => setFormData({...formData, deliverables: e.target.value})}
                    placeholder="What you expect to receive at the end – files, reports, code, designs, etc."
                    required
                  />
                </div>

                {/* Number of Revisions */}
                <div>
                  <Label htmlFor="revisions">6. Number of Revisions / Iterations</Label>
                  <Input
                    id="revisions"
                    value={formData.revisions}
                    onChange={(e) => setFormData({...formData, revisions: e.target.value})}
                    placeholder="e.g., Up to 3 revisions, Unlimited revisions"
                  />
                </div>

                {/* Budget */}
                <div>
                  <Label htmlFor="budget">7. Budget (₹) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="Enter your budget"
                    required
                  />
                </div>

                {/* Timeline */}
                <div>
                  <Label>8. Timeline / Deadline *</Label>
                  <Select value={formData.timeline} onValueChange={(value: any) => setFormData({...formData, timeline: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3-days">1–3 days</SelectItem>
                      <SelectItem value="1-week">1 week</SelectItem>
                      <SelectItem value="2-weeks">2 weeks</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.timeline === 'other' && (
                    <Input
                      className="mt-2"
                      value={formData.timeline_other}
                      onChange={(e) => setFormData({...formData, timeline_other: e.target.value})}
                      placeholder="Specify timeline"
                    />
                  )}
                </div>

                {/* Job Type */}
                <div>
                  <Label>9. Job Type *</Label>
                  <Select value={formData.job_type} onValueChange={(value: any) => setFormData({...formData, job_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Preference */}
                <div>
                  <Label htmlFor="location">10. Location Preference</Label>
                  <Input
                    id="location"
                    value={formData.location_preference}
                    onChange={(e) => setFormData({...formData, location_preference: e.target.value})}
                    placeholder="Remote, On-site, Hybrid, No preference, or specific location"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label>11. Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ownership Rights */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ownership"
                    checked={formData.ownership_rights}
                    onCheckedChange={(checked) => setFormData({...formData, ownership_rights: checked as boolean})}
                  />
                  <Label htmlFor="ownership">12. Full rights must be transferred after completion</Label>
                </div>

                {/* How to Apply */}
                <div>
                  <Label htmlFor="how_to_apply">13. How to Apply *</Label>
                  <Textarea
                    id="how_to_apply"
                    value={formData.how_to_apply}
                    onChange={(e) => setFormData({...formData, how_to_apply: e.target.value})}
                    placeholder="e.g., Submit portfolio, Resume, Sample work, Cover letter, etc."
                    required
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="additional_notes">14. Additional Notes / Instructions</Label>
                  <Textarea
                    id="additional_notes"
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                    placeholder="Any extra info, references, or inspirations"
                  />
                </div>

                {/* Reference Files */}
                <div>
                  <Label>15. Reference Documents / Files (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">Maximum size: 500 KB per file</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="hidden"
                      id="file-upload"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reference Links */}
                <div>
                  <Label>16. Links (Optional)</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="Add a reference link"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                    />
                    <Button type="button" onClick={addLink} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          {link}
                        </a>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeLink(link)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Posting Job..." : "Post Job"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default PostJob;