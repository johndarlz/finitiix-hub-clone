-- Add missing profile fields that are being used in the Profile component
ALTER TABLE public.profiles 
ADD COLUMN bio text,
ADD COLUMN location text,
ADD COLUMN skills text,
ADD COLUMN experience text,
ADD COLUMN portfolio_url text;