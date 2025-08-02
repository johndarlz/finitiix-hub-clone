-- Create enums for job categories, status, and application status
CREATE TYPE public.job_category AS ENUM (
  'web_development',
  'mobile_development', 
  'ui_ux_design',
  'graphic_design',
  'content_writing',
  'digital_marketing',
  'data_entry',
  'virtual_assistant',
  'video_editing',
  'programming',
  'consulting',
  'other'
);

CREATE TYPE public.job_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected', 'hired');

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  important_instructions TEXT,
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  budget_negotiable BOOLEAN DEFAULT false,
  delivery_time INTEGER NOT NULL, -- in days
  category job_category NOT NULL,
  status job_status DEFAULT 'open',
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proposal_message TEXT NOT NULL,
  bid_amount INTEGER NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Create job reviews table
CREATE TABLE public.job_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, reviewer_id, reviewee_id)
);

-- Create saved jobs table
CREATE TABLE public.saved_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  language TEXT DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for jobs
CREATE POLICY "Anyone can view open jobs" ON public.jobs
FOR SELECT USING (status = 'open' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs" ON public.jobs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON public.jobs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" ON public.jobs
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for job applications
CREATE POLICY "Job owners and applicants can view applications" ON public.job_applications
FOR SELECT USING (
  auth.uid() = applicant_id OR 
  auth.uid() IN (SELECT user_id FROM public.jobs WHERE id = job_id)
);

CREATE POLICY "Users can create their own applications" ON public.job_applications
FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Applicants can update their own applications" ON public.job_applications
FOR UPDATE USING (auth.uid() = applicant_id);

CREATE POLICY "Job owners can update application status" ON public.job_applications
FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM public.jobs WHERE id = job_id)
);

-- Create RLS policies for job reviews
CREATE POLICY "Anyone can view reviews" ON public.job_reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their jobs" ON public.job_reviews
FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Create RLS policies for saved jobs
CREATE POLICY "Users can view their own saved jobs" ON public.saved_jobs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save jobs" ON public.saved_jobs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave jobs" ON public.saved_jobs
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" ON public.user_preferences
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for admin users
CREATE POLICY "Only admins can view admin users" ON public.admin_users
FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM public.admin_users)
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);

-- Enable real-time for tables
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
ALTER TABLE public.job_applications REPLICA IDENTITY FULL;
ALTER TABLE public.job_reviews REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_reviews;

-- Create storage bucket for job attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('job-attachments', 'job-attachments', false);

-- Create storage policies for job attachments
CREATE POLICY "Authenticated users can upload job attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'job-attachments' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can view job attachments" ON storage.objects
FOR SELECT USING (bucket_id = 'job-attachments');

CREATE POLICY "Users can update their own job attachments" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'job-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own job attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'job-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);