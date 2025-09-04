-- Create missing enum types (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('online', 'offline');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM ('fresher', '1-2-years', '3-5-years', '5-plus-years');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE timeline_type AS ENUM ('1-3-days', '1-week', '2-weeks', 'flexible', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE availability_type AS ENUM ('part-time', 'full-time', 'freelance', 'flexible');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Jobs table (WorkZone)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_required TEXT[] DEFAULT '{}',
  experience_level experience_level NOT NULL DEFAULT 'fresher',
  deliverables TEXT NOT NULL,
  revisions TEXT,
  budget DECIMAL(10,2) NOT NULL,
  timeline timeline_type NOT NULL DEFAULT 'flexible',
  timeline_other TEXT,
  job_type job_type NOT NULL DEFAULT 'online',
  location_preference TEXT DEFAULT 'remote',
  ownership_rights BOOLEAN DEFAULT true,
  how_to_apply TEXT NOT NULL,
  additional_notes TEXT,
  reference_files TEXT[], -- URLs to uploaded files
  reference_links TEXT[],
  category TEXT NOT NULL,
  status job_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  relevant_skills TEXT[] DEFAULT '{}',
  experience_level experience_level NOT NULL DEFAULT 'fresher',
  why_hire_me TEXT NOT NULL,
  expected_budget DECIMAL(10,2) NOT NULL,
  availability availability_type NOT NULL DEFAULT 'flexible',
  resume_url TEXT, -- URL to uploaded resume
  reference_files TEXT[], -- URLs to work samples
  portfolio_links TEXT[],
  additional_notes TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'job_application', 'application_status', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  related_id UUID, -- job_id or application_id
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for file uploads (only if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('job-files', 'job-files', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Jobs
CREATE POLICY "Anyone can view active jobs" ON jobs 
FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create jobs" ON jobs 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own jobs" ON jobs 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON jobs 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" ON jobs 
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Job Applications
CREATE POLICY "Job owners can view applications for their jobs" ON job_applications 
FOR SELECT USING (auth.uid() IN (SELECT user_id FROM jobs WHERE id = job_id));

CREATE POLICY "Applicants can view their own applications" ON job_applications 
FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Users can create applications" ON job_applications 
FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Applicants can update their own applications" ON job_applications 
FOR UPDATE USING (auth.uid() = applicant_id);

CREATE POLICY "Job owners can update application status" ON job_applications 
FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM jobs WHERE id = job_id));

-- RLS Policies for Notifications
CREATE POLICY "Users can view their own notifications" ON notifications 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON notifications 
FOR UPDATE USING (auth.uid() = user_id);

-- Storage policies for job files
CREATE POLICY "Users can upload their own job files" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'job-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view job files" ON storage.objects 
FOR SELECT USING (bucket_id = 'job-files');

CREATE POLICY "Users can update their own job files" ON storage.objects 
FOR UPDATE USING (bucket_id = 'job-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own job files" ON storage.objects 
FOR DELETE USING (bucket_id = 'job-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification when job application is submitted
CREATE OR REPLACE FUNCTION notify_job_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_id)
  SELECT 
    j.user_id,
    'job_application',
    'New Job Application',
    'You have received a new application for: ' || j.title,
    NEW.id
  FROM jobs j 
  WHERE j.id = NEW.job_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_job_application_created
  AFTER INSERT ON job_applications
  FOR EACH ROW EXECUTE FUNCTION notify_job_owner();

-- Add job categories table for reference
CREATE TABLE IF NOT EXISTS job_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample categories (only if table is empty)
INSERT INTO job_categories (name, description) 
SELECT * FROM (VALUES
  ('Design & Creative', 'Logo design, graphic design, UI/UX, branding'),
  ('Programming & Tech', 'Web development, mobile apps, software development'),
  ('Writing & Translation', 'Content writing, copywriting, translation services'),
  ('Digital Marketing', 'SEO, social media, advertising, content marketing'),
  ('Video & Animation', 'Video editing, motion graphics, animation'),
  ('Music & Audio', 'Voice over, music production, audio editing'),
  ('Business', 'Virtual assistant, data entry, market research'),
  ('Education & Training', 'Online tutoring, course creation, training')
) AS v(name, description)
WHERE NOT EXISTS (SELECT 1 FROM job_categories);

ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view job categories" ON job_categories FOR SELECT USING (true);