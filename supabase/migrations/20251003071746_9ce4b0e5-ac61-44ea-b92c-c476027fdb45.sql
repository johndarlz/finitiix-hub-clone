-- Create skill_exchanges table
CREATE TABLE IF NOT EXISTS public.skill_exchanges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offerer_name TEXT NOT NULL,
  offering_skill TEXT NOT NULL,
  wanting_skill TEXT NOT NULL,
  description TEXT NOT NULL,
  coins INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  experience_level TEXT,
  location_preference TEXT,
  exchange_type TEXT DEFAULT 'Skill Exchange',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skill_exchange_proposals table for tracking exchange proposals
CREATE TABLE IF NOT EXISTS public.skill_exchange_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exchange_id UUID NOT NULL REFERENCES public.skill_exchanges(id) ON DELETE CASCADE,
  proposer_user_id UUID NOT NULL,
  proposer_name TEXT NOT NULL,
  proposer_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skill_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_exchange_proposals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill_exchanges
CREATE POLICY "Anyone can view active skill exchanges"
  ON public.skill_exchanges
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can view their own skill exchanges"
  ON public.skill_exchanges
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create skill exchanges"
  ON public.skill_exchanges
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skill exchanges"
  ON public.skill_exchanges
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skill exchanges"
  ON public.skill_exchanges
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for skill_exchange_proposals
CREATE POLICY "Exchange owners can view proposals"
  ON public.skill_exchange_proposals
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.skill_exchanges WHERE id = exchange_id
    )
  );

CREATE POLICY "Proposers can view their own proposals"
  ON public.skill_exchange_proposals
  FOR SELECT
  USING (auth.uid() = proposer_user_id);

CREATE POLICY "Users can create proposals"
  ON public.skill_exchange_proposals
  FOR INSERT
  WITH CHECK (auth.uid() = proposer_user_id);

CREATE POLICY "Exchange owners can update proposal status"
  ON public.skill_exchange_proposals
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.skill_exchanges WHERE id = exchange_id
    )
  );

-- Enable realtime for skill_exchanges
ALTER TABLE public.skill_exchanges REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.skill_exchanges;

-- Enable realtime for proposals
ALTER TABLE public.skill_exchange_proposals REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.skill_exchange_proposals;

-- Create indexes for better performance
CREATE INDEX idx_skill_exchanges_status ON public.skill_exchanges(status);
CREATE INDEX idx_skill_exchanges_user_id ON public.skill_exchanges(user_id);
CREATE INDEX idx_skill_exchanges_created_at ON public.skill_exchanges(created_at DESC);
CREATE INDEX idx_skill_exchange_proposals_exchange_id ON public.skill_exchange_proposals(exchange_id);
CREATE INDEX idx_skill_exchange_proposals_proposer ON public.skill_exchange_proposals(proposer_user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_skill_exchanges_updated_at
  BEFORE UPDATE ON public.skill_exchanges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skill_exchange_proposals_updated_at
  BEFORE UPDATE ON public.skill_exchange_proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();