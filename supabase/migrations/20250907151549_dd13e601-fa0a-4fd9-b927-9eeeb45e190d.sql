-- Create feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug_report', 'feature_request', 'general_feedback', 'payment_issue', 'other')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  screenshot_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  consent_contact BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback
CREATE POLICY "Users can create feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own feedback" 
ON public.feedback 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create profile files storage bucket for profile pictures and resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-files', 'profile-files', true);

-- Create policies for profile files storage
CREATE POLICY "Users can view their own profile files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own profile files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to profile files for shareable profiles
CREATE POLICY "Public can view profile files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-files');

-- Create trigger for feedback updated_at
CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();