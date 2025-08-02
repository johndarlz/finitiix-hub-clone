import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string;
  important_instructions?: string;
  budget_min: number;
  budget_max: number;
  budget_negotiable: boolean;
  delivery_time: number;
  category: string;
  status: string;
  attachment_urls?: string[];
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    username: string;
  };
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  proposal_message: string;
  bid_amount: number;
  attachments: any[];
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    username: string;
  };
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:user_id (name, username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posted successfully!",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create job",
        variant: "destructive",
      });
      return null;
    }
  };

  const applyForJob = async (jobId: string, applicationData: {
    proposal_message: string;
    bid_amount: number;
    attachments?: any[];
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([{
          job_id: jobId,
          applicant_id: user.id,
          ...applicationData,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
      return false;
    }
  };

  const saveJob = async (jobId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert([{
          user_id: user.id,
          job_id: jobId,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job saved successfully!",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save job",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    jobs,
    loading,
    createJob,
    applyForJob,
    saveJob,
    refetch: fetchJobs,
  };
};