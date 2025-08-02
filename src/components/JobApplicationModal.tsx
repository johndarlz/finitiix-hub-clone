import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, X } from "lucide-react";

interface JobApplicationModalProps {
  jobId: string | null;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const JobApplicationModal = ({ jobId, jobTitle, isOpen, onClose }: JobApplicationModalProps) => {
  const [formData, setFormData] = useState({
    proposal_message: '',
    bid_amount: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { applyForJob } = useJobs();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobId || !user) return;

    setSubmitting(true);
    
    const applicationData = {
      proposal_message: formData.proposal_message,
      bid_amount: parseInt(formData.bid_amount),
      attachment_urls: [], // TODO: Handle file uploads
    };

    const success = await applyForJob(jobId, applicationData);
    
    if (success) {
      setFormData({ proposal_message: '', bid_amount: '' });
      setAttachments([]);
      onClose();
    }
    
    setSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apply for: {jobTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="proposal">Proposal Message *</Label>
            <Textarea
              id="proposal"
              value={formData.proposal_message}
              onChange={(e) => setFormData(prev => ({ ...prev, proposal_message: e.target.value }))}
              placeholder="Explain why you're the right person for this job, your approach, and relevant experience"
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="bid">Your Bid Amount ($) *</Label>
            <Input
              id="bid"
              type="number"
              min="1"
              value={formData.bid_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, bid_amount: e.target.value }))}
              placeholder="Enter your bid amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="attachments" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload portfolio or relevant files</p>
                </div>
              </label>
              
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};