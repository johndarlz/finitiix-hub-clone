import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";
import { Upload, X } from "lucide-react";

const jobCategories = [
  { value: 'design_creative', label: 'Design & Creative' },
  { value: 'programming_tech', label: 'Programming & Tech' },
  { value: 'writing_translation', label: 'Writing & Translation' },
  { value: 'digital_marketing', label: 'Digital Marketing' },
  { value: 'video_animation', label: 'Video & Animation' },
  { value: 'music_audio', label: 'Music & Audio' },
  { value: 'business', label: 'Business' },
  { value: 'data_entry', label: 'Data Entry' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'other', label: 'Other' },
];

export const PostJobModal = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    important_instructions: '',
    budget_min: '',
    budget_max: '',
    budget_negotiable: false,
    delivery_time: '',
    category: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const { createJob } = useJobs();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to post a job');
      return;
    }

    const jobData = {
      title: formData.title,
      description: formData.description,
      important_instructions: formData.important_instructions,
      budget_min: parseInt(formData.budget_min),
      budget_max: parseInt(formData.budget_max),
      budget_negotiable: formData.budget_negotiable,
      delivery_time: formData.delivery_time,
      category: formData.category as 'design_creative' | 'programming_tech' | 'writing_translation' | 'digital_marketing' | 'video_animation' | 'music_audio' | 'business' | 'data_entry' | 'customer_service' | 'other',
      attachment_urls: [], // TODO: Handle file uploads
    };

    const result = await createJob(jobData);
    
    if (result) {
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        important_instructions: '',
        budget_min: '',
        budget_max: '',
        budget_negotiable: false,
        delivery_time: '',
        category: '',
      });
      setAttachments([]);
    }
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a clear and specific job title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task, timeline, and expectations"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="instructions">Important Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.important_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, important_instructions: e.target.value }))}
              placeholder="Any specific requirements or instructions"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget_min">Minimum Budget ($) *</Label>
              <Input
                id="budget_min"
                type="number"
                min="50"
                max="10000"
                value={formData.budget_min}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="budget_max">Maximum Budget ($) *</Label>
              <Input
                id="budget_max"
                type="number"
                min="50"
                max="10000"
                value={formData.budget_max}
                onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="negotiable"
              checked={formData.budget_negotiable}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, budget_negotiable: checked as boolean }))
              }
            />
            <Label htmlFor="negotiable">Budget is negotiable</Label>
          </div>

          <div>
            <Label htmlFor="delivery_time">Delivery Time (days) *</Label>
            <Input
              id="delivery_time"
              type="number"
              min="1"
              value={formData.delivery_time}
              onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Job Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <p className="text-sm text-gray-600">Click to upload files</p>
                  <p className="text-xs text-gray-500">Links, documents, screenshots</p>
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
            <Button type="submit" className="flex-1">
              Post Job
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};