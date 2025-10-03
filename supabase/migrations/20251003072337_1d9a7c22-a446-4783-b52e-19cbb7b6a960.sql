-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  question_title TEXT NOT NULL,
  question_details TEXT NOT NULL,
  category TEXT NOT NULL,
  bounty NUMERIC NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL,
  urgency TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  mentor_user_id UUID NOT NULL,
  mentor_name TEXT NOT NULL,
  answer_content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentors table for mentor profiles
CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  expertise TEXT NOT NULL,
  bio TEXT NOT NULL,
  hourly_rate NUMERIC NOT NULL,
  years_experience INTEGER NOT NULL,
  response_time TEXT,
  languages TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  total_earnings NUMERIC DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions
CREATE POLICY "Anyone can view open questions"
  ON public.questions
  FOR SELECT
  USING (status IN ('open', 'answered'));

CREATE POLICY "Users can view their own questions"
  ON public.questions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create questions"
  ON public.questions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own questions"
  ON public.questions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own questions"
  ON public.questions
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for answers
CREATE POLICY "Anyone can view answers to public questions"
  ON public.answers
  FOR SELECT
  USING (
    question_id IN (
      SELECT id FROM public.questions WHERE status IN ('open', 'answered')
    )
  );

CREATE POLICY "Mentors can create answers"
  ON public.answers
  FOR INSERT
  WITH CHECK (auth.uid() = mentor_user_id);

CREATE POLICY "Mentors can update their own answers"
  ON public.answers
  FOR UPDATE
  USING (auth.uid() = mentor_user_id);

CREATE POLICY "Question owners can mark answers as accepted"
  ON public.answers
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.questions WHERE id = question_id
    )
  );

-- RLS Policies for mentors
CREATE POLICY "Anyone can view mentor profiles"
  ON public.mentors
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their mentor profile"
  ON public.mentors
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentors can update their own profile"
  ON public.mentors
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER TABLE public.questions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.questions;

ALTER TABLE public.answers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.answers;

ALTER TABLE public.mentors REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mentors;

-- Create indexes
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX idx_answers_question_id ON public.answers(question_id);
CREATE INDEX idx_answers_mentor_user_id ON public.answers(mentor_user_id);
CREATE INDEX idx_mentors_user_id ON public.mentors(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_answers_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentors_updated_at
  BEFORE UPDATE ON public.mentors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();