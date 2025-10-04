export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          permissions: string[] | null
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: string[] | null
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: string[] | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          answer_content: string
          created_at: string
          id: string
          is_accepted: boolean | null
          mentor_name: string
          mentor_user_id: string
          question_id: string
          updated_at: string
        }
        Insert: {
          answer_content: string
          created_at?: string
          id?: string
          is_accepted?: boolean | null
          mentor_name: string
          mentor_user_id: string
          question_id: string
          updated_at?: string
        }
        Update: {
          answer_content?: string
          created_at?: string
          id?: string
          is_accepted?: boolean | null
          mentor_name?: string
          mentor_user_id?: string
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          consent_contact: boolean | null
          created_at: string
          description: string
          email: string
          feedback_type: string
          id: string
          name: string
          rating: number | null
          screenshot_url: string | null
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          consent_contact?: boolean | null
          created_at?: string
          description: string
          email: string
          feedback_type: string
          id?: string
          name: string
          rating?: number | null
          screenshot_url?: string | null
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          consent_contact?: boolean | null
          created_at?: string
          description?: string
          email?: string
          feedback_type?: string
          id?: string
          name?: string
          rating?: number | null
          screenshot_url?: string | null
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gig_bookings: {
        Row: {
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          buyer_user_id: string | null
          created_at: string | null
          gig_id: string
          id: string
          payment_method: string
          project_requirements: string
          reference_files: string[] | null
          reference_links: string[] | null
          special_instructions: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          buyer_user_id?: string | null
          created_at?: string | null
          gig_id: string
          id?: string
          payment_method: string
          project_requirements: string
          reference_files?: string[] | null
          reference_links?: string[] | null
          special_instructions?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          buyer_user_id?: string | null
          created_at?: string | null
          gig_id?: string
          id?: string
          payment_method?: string
          project_requirements?: string
          reference_files?: string[] | null
          reference_links?: string[] | null
          special_instructions?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gig_bookings_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      gigs: {
        Row: {
          additional_notes: string | null
          category: string
          cover_image_url: string | null
          created_at: string | null
          creator_name: string
          delivery_time: string
          description: string
          id: string
          links: string[] | null
          pitch_video_url: string | null
          portfolio_samples: string[] | null
          price: number
          revisions: string
          skills_tags: string[] | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          category: string
          cover_image_url?: string | null
          created_at?: string | null
          creator_name: string
          delivery_time: string
          description: string
          id?: string
          links?: string[] | null
          pitch_video_url?: string | null
          portfolio_samples?: string[] | null
          price: number
          revisions: string
          skills_tags?: string[] | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          category?: string
          cover_image_url?: string | null
          created_at?: string | null
          creator_name?: string
          delivery_time?: string
          description?: string
          id?: string
          links?: string[] | null
          pitch_video_url?: string | null
          portfolio_samples?: string[] | null
          price?: number
          revisions?: string
          skills_tags?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          additional_notes: string | null
          applicant_id: string
          availability: Database["public"]["Enums"]["availability_type"]
          created_at: string | null
          email: string
          expected_budget: number
          experience_level: Database["public"]["Enums"]["experience_level"]
          full_name: string
          id: string
          job_id: string
          phone_number: string | null
          portfolio_links: string[] | null
          reference_files: string[] | null
          relevant_skills: string[] | null
          resume_url: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
          why_hire_me: string
        }
        Insert: {
          additional_notes?: string | null
          applicant_id: string
          availability?: Database["public"]["Enums"]["availability_type"]
          created_at?: string | null
          email: string
          expected_budget: number
          experience_level?: Database["public"]["Enums"]["experience_level"]
          full_name: string
          id?: string
          job_id: string
          phone_number?: string | null
          portfolio_links?: string[] | null
          reference_files?: string[] | null
          relevant_skills?: string[] | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          why_hire_me: string
        }
        Update: {
          additional_notes?: string | null
          applicant_id?: string
          availability?: Database["public"]["Enums"]["availability_type"]
          created_at?: string | null
          email?: string
          expected_budget?: number
          experience_level?: Database["public"]["Enums"]["experience_level"]
          full_name?: string
          id?: string
          job_id?: string
          phone_number?: string | null
          portfolio_links?: string[] | null
          reference_files?: string[] | null
          relevant_skills?: string[] | null
          resume_url?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
          why_hire_me?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          additional_notes: string | null
          budget: number
          category: string
          created_at: string | null
          deliverables: string
          description: string
          experience_level: Database["public"]["Enums"]["experience_level"]
          how_to_apply: string
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          location_preference: string | null
          ownership_rights: boolean | null
          reference_files: string[] | null
          reference_links: string[] | null
          revisions: string | null
          skills_required: string[] | null
          status: Database["public"]["Enums"]["job_status"] | null
          timeline: Database["public"]["Enums"]["timeline_type"]
          timeline_other: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          budget: number
          category: string
          created_at?: string | null
          deliverables: string
          description: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          how_to_apply: string
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location_preference?: string | null
          ownership_rights?: boolean | null
          reference_files?: string[] | null
          reference_links?: string[] | null
          revisions?: string | null
          skills_required?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          timeline?: Database["public"]["Enums"]["timeline_type"]
          timeline_other?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          budget?: number
          category?: string
          created_at?: string | null
          deliverables?: string
          description?: string
          experience_level?: Database["public"]["Enums"]["experience_level"]
          how_to_apply?: string
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location_preference?: string | null
          ownership_rights?: boolean | null
          reference_files?: string[] | null
          reference_links?: string[] | null
          revisions?: string | null
          skills_required?: string[] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          timeline?: Database["public"]["Enums"]["timeline_type"]
          timeline_other?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          avg_rating: number | null
          bio: string
          created_at: string
          email: string
          expertise: string
          hourly_rate: number
          id: string
          is_verified: boolean | null
          languages: string[] | null
          name: string
          response_time: string | null
          skills: string[] | null
          total_earnings: number | null
          total_students: number | null
          updated_at: string
          user_id: string
          years_experience: number
        }
        Insert: {
          avg_rating?: number | null
          bio: string
          created_at?: string
          email: string
          expertise: string
          hourly_rate: number
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name: string
          response_time?: string | null
          skills?: string[] | null
          total_earnings?: number | null
          total_students?: number | null
          updated_at?: string
          user_id: string
          years_experience: number
        }
        Update: {
          avg_rating?: number | null
          bio?: string
          created_at?: string
          email?: string
          expertise?: string
          hourly_rate?: number
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string
          response_time?: string | null
          skills?: string[] | null
          total_earnings?: number | null
          total_students?: number | null
          updated_at?: string
          user_id?: string
          years_experience?: number
        }
        Relationships: []
      }
      myprofile: {
        Row: {
          achievements: Json | null
          additional_notes: string | null
          badges: Json | null
          bio: string | null
          certifications: Json | null
          contact_email: string | null
          created_at: string
          date_of_birth: string | null
          education: Json | null
          full_name: string | null
          gender: string | null
          headline: string | null
          id: string
          languages: string[] | null
          location: string | null
          phone_number: string | null
          portfolio_projects: Json | null
          profile_picture: string | null
          resume_url: string | null
          skills: string[] | null
          social_links: Json | null
          tagline: string | null
          testimonials: Json | null
          updated_at: string
          user_id: string
          work_experience: Json | null
          years_experience: number | null
        }
        Insert: {
          achievements?: Json | null
          additional_notes?: string | null
          badges?: Json | null
          bio?: string | null
          certifications?: Json | null
          contact_email?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: Json | null
          full_name?: string | null
          gender?: string | null
          headline?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          phone_number?: string | null
          portfolio_projects?: Json | null
          profile_picture?: string | null
          resume_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          tagline?: string | null
          testimonials?: Json | null
          updated_at?: string
          user_id: string
          work_experience?: Json | null
          years_experience?: number | null
        }
        Update: {
          achievements?: Json | null
          additional_notes?: string | null
          badges?: Json | null
          bio?: string | null
          certifications?: Json | null
          contact_email?: string | null
          created_at?: string
          date_of_birth?: string | null
          education?: Json | null
          full_name?: string | null
          gender?: string | null
          headline?: string | null
          id?: string
          languages?: string[] | null
          location?: string | null
          phone_number?: string | null
          portfolio_projects?: Json | null
          profile_picture?: string | null
          resume_url?: string | null
          skills?: string[] | null
          social_links?: Json | null
          tagline?: string | null
          testimonials?: Json | null
          updated_at?: string
          user_id?: string
          work_experience?: Json | null
          years_experience?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          experience: string | null
          id: string
          location: string | null
          name: string
          phone_number: string | null
          portfolio_url: string | null
          skills: string | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          id?: string
          location?: string | null
          name: string
          phone_number?: string | null
          portfolio_url?: string | null
          skills?: string | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          experience?: string | null
          id?: string
          location?: string | null
          name?: string
          phone_number?: string | null
          portfolio_url?: string | null
          skills?: string | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          additional_notes: string | null
          author_name: string
          category: string
          contact_email: string
          created_at: string
          detailed_overview: string | null
          drive_url: string | null
          github_url: string | null
          id: string
          live_demo_url: string | null
          project_files: string[] | null
          screenshot_urls: string[] | null
          short_description: string
          status: string | null
          technologies: string[] | null
          title: string
          updated_at: string
          user_id: string
          video_demo_url: string | null
        }
        Insert: {
          additional_notes?: string | null
          author_name: string
          category: string
          contact_email: string
          created_at?: string
          detailed_overview?: string | null
          drive_url?: string | null
          github_url?: string | null
          id?: string
          live_demo_url?: string | null
          project_files?: string[] | null
          screenshot_urls?: string[] | null
          short_description: string
          status?: string | null
          technologies?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          video_demo_url?: string | null
        }
        Update: {
          additional_notes?: string | null
          author_name?: string
          category?: string
          contact_email?: string
          created_at?: string
          detailed_overview?: string | null
          drive_url?: string | null
          github_url?: string | null
          id?: string
          live_demo_url?: string | null
          project_files?: string[] | null
          screenshot_urls?: string[] | null
          short_description?: string
          status?: string | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          video_demo_url?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          asker_email: string
          asker_name: string
          bounty: number
          category: string
          created_at: string
          difficulty: string
          id: string
          question_details: string
          question_title: string
          status: string | null
          tags: string[] | null
          updated_at: string
          urgency: string
          user_id: string
        }
        Insert: {
          asker_email: string
          asker_name: string
          bounty?: number
          category: string
          created_at?: string
          difficulty: string
          id?: string
          question_details: string
          question_title: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          urgency: string
          user_id: string
        }
        Update: {
          asker_email?: string
          asker_name?: string
          bounty?: number
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          question_details?: string
          question_title?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          urgency?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_exchange_proposals: {
        Row: {
          created_at: string
          exchange_id: string
          id: string
          message: string
          proposer_email: string
          proposer_name: string
          proposer_user_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          exchange_id: string
          id?: string
          message: string
          proposer_email: string
          proposer_name: string
          proposer_user_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          exchange_id?: string
          id?: string
          message?: string
          proposer_email?: string
          proposer_name?: string
          proposer_user_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_exchange_proposals_exchange_id_fkey"
            columns: ["exchange_id"]
            isOneToOne: false
            referencedRelation: "skill_exchanges"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_exchanges: {
        Row: {
          category: string
          coins: number
          created_at: string
          description: string
          exchange_type: string | null
          experience_level: string | null
          id: string
          location_preference: string | null
          offerer_name: string
          offering_skill: string
          status: string | null
          timeframe: string
          updated_at: string
          user_id: string
          wanting_skill: string
        }
        Insert: {
          category: string
          coins?: number
          created_at?: string
          description: string
          exchange_type?: string | null
          experience_level?: string | null
          id?: string
          location_preference?: string | null
          offerer_name: string
          offering_skill: string
          status?: string | null
          timeframe: string
          updated_at?: string
          user_id: string
          wanting_skill: string
        }
        Update: {
          category?: string
          coins?: number
          created_at?: string
          description?: string
          exchange_type?: string | null
          experience_level?: string | null
          id?: string
          location_preference?: string | null
          offerer_name?: string
          offering_skill?: string
          status?: string | null
          timeframe?: string
          updated_at?: string
          user_id?: string
          wanting_skill?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_username_availability: {
        Args: { username_input: string }
        Returns: boolean
      }
    }
    Enums: {
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      availability_type: "part-time" | "full-time" | "freelance" | "flexible"
      experience_level: "fresher" | "1-2-years" | "3-5-years" | "5-plus-years"
      job_category:
        | "design_creative"
        | "programming_tech"
        | "writing_translation"
        | "digital_marketing"
        | "video_animation"
        | "music_audio"
        | "business"
        | "data_entry"
        | "customer_service"
        | "other"
      job_status: "active" | "in_progress" | "completed" | "cancelled" | "draft"
      job_type: "online" | "offline"
      timeline_type: "1-3-days" | "1-week" | "2-weeks" | "flexible" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "accepted", "rejected", "withdrawn"],
      availability_type: ["part-time", "full-time", "freelance", "flexible"],
      experience_level: ["fresher", "1-2-years", "3-5-years", "5-plus-years"],
      job_category: [
        "design_creative",
        "programming_tech",
        "writing_translation",
        "digital_marketing",
        "video_animation",
        "music_audio",
        "business",
        "data_entry",
        "customer_service",
        "other",
      ],
      job_status: ["active", "in_progress", "completed", "cancelled", "draft"],
      job_type: ["online", "offline"],
      timeline_type: ["1-3-days", "1-week", "2-weeks", "flexible", "other"],
    },
  },
} as const
