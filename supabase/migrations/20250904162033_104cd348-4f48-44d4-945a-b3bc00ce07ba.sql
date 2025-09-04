-- Fix security issues: Update functions to have proper search_path settings

-- Update the update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Update the notify_job_owner function  
CREATE OR REPLACE FUNCTION notify_job_owner()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  SELECT 
    j.user_id,
    'job_application',
    'New Job Application',
    'You have received a new application for: ' || j.title,
    NEW.id
  FROM public.jobs j 
  WHERE j.id = NEW.job_id;
  
  RETURN NEW;
END;
$$;

-- Update the existing check_username_availability function to be more secure
CREATE OR REPLACE FUNCTION check_username_availability(username_input text)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = username_input
  );
$$;