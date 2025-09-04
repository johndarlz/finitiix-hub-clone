import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus, Briefcase, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";

const ApplyJob = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    experience_level: "fresher" as const,
    why_hire_me: "",
    expected_budget: "",
    availability: "flexible" as const,
    additional_notes: ""
  });

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }

    fetchJobDetails();
    fetchUserProfile();
  }, [jobId, user]);

  const fetchJobDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error: any) {
      toast({
        title: "Error fetching job",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setProfile(data);
        setFormData(prev => ({
          ...prev,
          full_name: data.name || "",
          email: user?.email || "",
          phone_number: data.phone_number || ""
        }));
      }
    } catch (error) {
      console.log("Profile not found or error:", error);
    }
  };

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
    if (linkInput.trim() && !portfolioLinks.includes(linkInput.trim())) {
      setPortfolioLinks([...portfolioLinks, linkInput.trim()]);
      setLinkInput("");
    }
  };

  const removeLink = (link: string) => {
    setPortfolioLinks(portfolioLinks.filter(l => l !== link));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        toast({
          title: "File too large",
          description: "Resume must be smaller than 500KB.",
          variant: "destructive"
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.size <= 500 * 1024);
    
    if (selectedFiles.length !== validFiles.length) {
      toast({
        title: "File size limit exceeded",
        description: "Some files are larger than 500KB and were not added.",
        variant: "destructive"
      });
    }
    
    setReferenceFiles([...referenceFiles, ...validFiles]);
  };

  const removeReferenceFile = (index: number) => {
    setReferenceFiles(referenceFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<{ resumeUrl?: string; referenceUrls: string[] }> => {
    const results: { resumeUrl?: string; referenceUrls: string[] } = { referenceUrls: [] };
    
    // Upload resume
    if (resumeFile) {
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${user?.id}/resumes/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('job-files')
        .upload(fileName, resumeFile);
      
      if (!error) {
        const { data } = supabase.storage.from('job-files').getPublicUrl(fileName);
        results.resumeUrl = data.publicUrl;
      }
    }
    
    // Upload reference files
    if (referenceFiles.length > 0) {
      const uploadPromises = referenceFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/references/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('job-files')
          .upload(fileName, file);
        
        if (!error) {
          const { data } = supabase.storage.from('job-files').getPublicUrl(fileName);
          return data.publicUrl;
        }
        return null;
      });
      
      const urls = await Promise.all(uploadPromises);
      results.referenceUrls = urls.filter(Boolean) as string[];
    }
    
    return results;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !job) return;

    setLoading(true);
    try {
      // Upload files first
      const { resumeUrl, referenceUrls } = await uploadFiles();
      
      const { error } = await supabase.from('job_applications').insert({
        job_id: jobId,
        applicant_id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        relevant_skills: skills,
        experience_level: formData.experience_level,
        why_hire_me: formData.why_hire_me,
        expected_budget: parseFloat(formData.expected_budget),
        availability: formData.availability,
        resume_url: resumeUrl,
        reference_files: referenceUrls,
        portfolio_links: portfolioLinks,
        additional_notes: formData.additional_notes,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Application submitted successfully!",
        description: "The job owner will be notified of your application."
      });

      navigate('/workzone');
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Job Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {job.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-success" />
                  <span className="font-semibold text-success">₹{job.budget}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{job.timeline.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{job.job_type}</Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{job.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills_required?.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <p><strong>Deliverables:</strong> {job.deliverables}</p>
                {job.how_to_apply && (
                  <p className="mt-2"><strong>How to Apply:</strong> {job.how_to_apply}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">📝 Job Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="full_name">1. Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Enter your first and last name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">2. Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter a valid email for communication"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone">3. Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="Include country code if applicable"
                  />
                </div>

                {/* Applying For */}
                <div>
                  <Label>4. Applying For</Label>
                  <Input value={job.title} disabled className="bg-muted" />
                </div>

                {/* Relevant Skills */}
                <div>
                  <Label>5. Relevant Skills *</Label>
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

                {/* Years of Experience */}
                <div>
                  <Label>6. Years of Experience *</Label>
                  <Select value={formData.experience_level} onValueChange={(value: any) => setFormData({...formData, experience_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="1-2-years">1–2 years</SelectItem>
                      <SelectItem value="3-5-years">3–5 years</SelectItem>
                      <SelectItem value="5-plus-years">5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Why Should We Hire You */}
                <div>
                  <Label htmlFor="why_hire_me">7. Why Should We Hire You? *</Label>
                  <Textarea
                    id="why_hire_me"
                    value={formData.why_hire_me}
                    onChange={(e) => setFormData({...formData, why_hire_me: e.target.value})}
                    placeholder="Briefly explain in 2–5 sentences"
                    rows={4}
                    required
                  />
                </div>

                {/* Expected Budget */}
                <div>
                  <Label htmlFor="expected_budget">8. Expected Budget / Salary (₹) *</Label>
                  <Input
                    id="expected_budget"
                    type="number"
                    value={formData.expected_budget}
                    onChange={(e) => setFormData({...formData, expected_budget: e.target.value})}
                    placeholder="Enter your expected amount"
                    required
                  />
                </div>

                {/* Availability */}
                <div>
                  <Label>9. Availability *</Label>
                  <Select value={formData.availability} onValueChange={(value: any) => setFormData({...formData, availability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="freelance">Freelance / Project-based</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resume Upload */}
                <div>
                  <Label>10. Resume / CV Upload (Optional, &lt;500 KB)</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      type="file"
                      onChange={handleResumeUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="resume-upload"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('resume-upload')?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </Button>
                  </div>
                  {resumeFile && (
                    <div className="p-2 bg-muted rounded flex items-center justify-between">
                      <span className="text-sm">{resumeFile.name}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setResumeFile(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Reference Files */}
                <div>
                  <Label>11. Reference Documents / Work Samples (Optional, &lt;500 KB each)</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleReferenceUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                      className="hidden"
                      id="reference-upload"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById('reference-upload')?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                  {referenceFiles.length > 0 && (
                    <div className="space-y-1">
                      {referenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeReferenceFile(index)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Portfolio Links */}
                <div>
                  <Label>12. Links (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">Portfolio / GitHub / Behance / LinkedIn / Website</p>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="Add a portfolio link"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                    />
                    <Button type="button" onClick={addLink} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {portfolioLinks.map((link, index) => (
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

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="additional_notes">13. Additional Notes (Optional)</Label>
                  <Textarea
                    id="additional_notes"
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                    placeholder="Anything else you'd like us to know"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting Application..." : "Apply Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ApplyJob;