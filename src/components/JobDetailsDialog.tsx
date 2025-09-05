import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Clock, DollarSign, MapPin, User, Briefcase, FileText, Link as LinkIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface JobDetailsDialogProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailsDialog = ({ job, isOpen, onClose }: JobDetailsDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showProposal, setShowProposal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [proposalData, setProposalData] = useState({
    why_hire_me: "",
    expected_budget: "",
    availability: "flexible" as const,
    experience_level: "fresher" as const,
    full_name: "",
    email: "",
    phone_number: "",
    additional_notes: "",
    relevant_skills: [] as string[],
    portfolio_links: [] as string[]
  });

  if (!job) return null;

  const formatTimeline = (timeline: string) => {
    return timeline.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleApply = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }
    setShowProposal(true);
  };

  const handleSubmitProposal = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('job_applications').insert({
        job_id: job.id,
        applicant_id: user.id,
        why_hire_me: proposalData.why_hire_me,
        expected_budget: parseFloat(proposalData.expected_budget),
        availability: proposalData.availability,
        experience_level: proposalData.experience_level,
        full_name: proposalData.full_name,
        email: proposalData.email,
        phone_number: proposalData.phone_number,
        additional_notes: proposalData.additional_notes,
        relevant_skills: proposalData.relevant_skills,
        portfolio_links: proposalData.portfolio_links
      });

      if (error) throw error;

      toast({
        title: "Application submitted!",
        description: "Your proposal has been sent to the job poster."
      });

      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex-1">
            <DialogTitle className="text-2xl font-bold mb-2">{job.title}</DialogTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-lg font-bold text-success">₹{job.budget}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimeline(job.timeline)}</span>
              </div>
              <Badge variant="secondary">{job.job_type}</Badge>
              <Badge variant="outline">{job.category}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Job Description
            </h3>
            <p className="text-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Deliverables</h3>
            <p className="text-foreground">{job.deliverables}</p>
          </div>

          {/* Skills Required */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills_required?.map((skill: string, index: number) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">Experience Level</Label>
                <p className="text-sm text-muted-foreground capitalize">{job.experience_level.replace('-', ' ')}</p>
              </div>
              <div>
                <Label className="font-medium">Job Type</Label>
                <p className="text-sm text-muted-foreground capitalize">{job.job_type}</p>
              </div>
              <div>
                <Label className="font-medium">Location</Label>
                <p className="text-sm text-muted-foreground">{job.location_preference}</p>
              </div>
              <div>
                <Label className="font-medium">Revisions</Label>
                <p className="text-sm text-muted-foreground">{job.revisions || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div>
            <h3 className="text-lg font-semibold mb-2">How to Apply</h3>
            <p className="text-foreground">{job.how_to_apply}</p>
          </div>

          {/* Additional Notes */}
          {job.additional_notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
              <p className="text-foreground">{job.additional_notes}</p>
            </div>
          )}

          {/* Reference Links */}
          {job.reference_links && job.reference_links.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Reference Links
              </h3>
              <div className="space-y-2">
                {job.reference_links.map((link: string, index: number) => (
                  <a key={index} href={link} target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline block">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showProposal && (
            <div className="flex gap-3 pt-4">
              <Button onClick={handleApply} className="flex-1">
                Apply Now
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {/* Proposal Form */}
          {showProposal && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold mb-4">Submit Your Proposal</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={proposalData.full_name}
                    onChange={(e) => setProposalData({...proposalData, full_name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={proposalData.email}
                    onChange={(e) => setProposalData({...proposalData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={proposalData.phone_number}
                    onChange={(e) => setProposalData({...proposalData, phone_number: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="why_hire">Why should we hire you? *</Label>
                  <Textarea
                    id="why_hire"
                    value={proposalData.why_hire_me}
                    onChange={(e) => setProposalData({...proposalData, why_hire_me: e.target.value})}
                    placeholder="Explain your relevant experience and why you're the best fit for this job"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Your Expected Budget (₹) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={proposalData.expected_budget}
                    onChange={(e) => setProposalData({...proposalData, expected_budget: e.target.value})}
                    placeholder="Enter your expected budget"
                    required
                  />
                </div>

                <div>
                  <Label>Your Availability</Label>
                  <Select value={proposalData.availability} onValueChange={(value: any) => setProposalData({...proposalData, availability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="within-week">Within a week</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Your Experience Level</Label>
                  <Select value={proposalData.experience_level} onValueChange={(value: any) => setProposalData({...proposalData, experience_level: value})}>
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

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={proposalData.additional_notes}
                    onChange={(e) => setProposalData({...proposalData, additional_notes: e.target.value})}
                    placeholder="Any additional information you'd like to share"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSubmitProposal} disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit Proposal"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowProposal(false)}>
                    Back to Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsDialog;