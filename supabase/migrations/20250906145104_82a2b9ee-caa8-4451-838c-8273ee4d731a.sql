-- Create gigs table for BubbleGigs
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  skills_tags TEXT[] DEFAULT '{}',
  price DECIMAL NOT NULL,
  delivery_time TEXT NOT NULL,
  description TEXT NOT NULL,
  revisions TEXT NOT NULL,
  pitch_video_url TEXT,
  cover_image_url TEXT,
  portfolio_samples TEXT[],
  links TEXT[],
  creator_name TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create gig_bookings table
CREATE TABLE public.gig_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  buyer_user_id UUID,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  project_requirements TEXT NOT NULL,
  reference_files TEXT[],
  reference_links TEXT[],
  special_instructions TEXT,
  payment_method TEXT NOT NULL,
  total_amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_bookings ENABLE ROW LEVEL SECURITY;

-- Gigs policies
CREATE POLICY "Anyone can view active gigs" ON public.gigs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own gigs" ON public.gigs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gigs" ON public.gigs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own gigs" ON public.gigs
  FOR SELECT USING (auth.uid() = user_id);

-- Gig bookings policies  
CREATE POLICY "Anyone can create bookings" ON public.gig_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view bookings for their gigs" ON public.gig_bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM gigs WHERE id = gig_id
    )
  );

CREATE POLICY "Buyers can view their own bookings" ON public.gig_bookings
  FOR SELECT USING (auth.uid() = buyer_user_id OR buyer_email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

-- Add triggers for updated_at
CREATE TRIGGER update_gigs_updated_at
  BEFORE UPDATE ON public.gigs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gig_bookings_updated_at
  BEFORE UPDATE ON public.gig_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fix myprofile unique constraint issue
ALTER TABLE public.myprofile DROP CONSTRAINT IF EXISTS myprofile_user_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS myprofile_user_id_unique ON public.myprofile(user_id);