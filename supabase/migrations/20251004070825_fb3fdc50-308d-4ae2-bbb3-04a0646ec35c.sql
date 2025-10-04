-- Add tagline field to myprofile table
ALTER TABLE public.myprofile
ADD COLUMN IF NOT EXISTS tagline TEXT;