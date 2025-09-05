-- Create projects table for ProjectHub
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  detailed_overview TEXT,
  technologies TEXT[] DEFAULT '{}',
  project_files TEXT[] DEFAULT '{}',
  screenshot_urls TEXT[] DEFAULT '{}',
  github_url TEXT,
  drive_url TEXT,
  live_demo_url TEXT,
  video_demo_url TEXT,
  author_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Anyone can view active projects" 
ON public.projects 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create myprofile table for enhanced user profiles
CREATE TABLE public.myprofile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  profile_picture TEXT,
  gender TEXT,
  date_of_birth DATE,
  contact_email TEXT,
  phone_number TEXT,
  location TEXT,
  headline TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  languages TEXT[] DEFAULT '{}',
  education JSONB DEFAULT '[]',
  work_experience JSONB DEFAULT '[]',
  portfolio_projects JSONB DEFAULT '[]',
  resume_url TEXT,
  certifications JSONB DEFAULT '[]',
  social_links JSONB DEFAULT '{}',
  additional_notes TEXT,
  achievements JSONB DEFAULT '[]',
  badges JSONB DEFAULT '[]',
  testimonials JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.myprofile ENABLE ROW LEVEL SECURITY;

-- Create policies for myprofile
CREATE POLICY "Users can view all profiles" 
ON public.myprofile 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own profile" 
ON public.myprofile 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.myprofile 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.myprofile 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_myprofile_updated_at
BEFORE UPDATE ON public.myprofile
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true);

-- Create storage policies for project files
CREATE POLICY "Anyone can view project files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-files');

CREATE POLICY "Users can upload their own project files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);