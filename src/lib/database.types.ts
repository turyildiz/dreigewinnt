export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string | null;
          town: string;
          tier: string;
          status: string;
          description: string | null;
          full_description: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          hero_image_url: string | null;
          is_spotlight: boolean;
          opening_hours: Json | null;
          telegram_code: string | null;
          telegram_chat_id: string | null;
          telegram_linked_at: string | null;
          social_instagram: string | null;
          social_facebook: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category?: string | null;
          town: string;
          tier?: string;
          status?: string;
          description?: string | null;
          full_description?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          hero_image_url?: string | null;
          is_spotlight?: boolean;
          opening_hours?: Json | null;
          telegram_code?: string | null;
          telegram_chat_id?: string | null;
          telegram_linked_at?: string | null;
          social_instagram?: string | null;
          social_facebook?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: string | null;
          town?: string;
          tier?: string;
          status?: string;
          description?: string | null;
          full_description?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          hero_image_url?: string | null;
          is_spotlight?: boolean;
          opening_hours?: Json | null;
          telegram_code?: string | null;
          telegram_chat_id?: string | null;
          telegram_linked_at?: string | null;
          social_instagram?: string | null;
          social_facebook?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      business_photos: {
        Row: {
          id: string;
          business_id: string;
          url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          business_id: string;
          url: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          business_id?: string;
          url?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      business_posts: {
        Row: {
          id: string;
          business_id: string;
          content: string;
          image_url: string | null;
          images: string[] | null;
          source: string;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          content: string;
          image_url?: string | null;
          images?: string[] | null;
          source?: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          content?: string;
          image_url?: string | null;
          images?: string[] | null;
          source?: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "business_posts_business_id_fkey";
            columns: ["business_id"];
            isOneToOne: false;
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          town: string;
          category: string | null;
          status: string;
          is_featured: boolean;
          date_start: string;
          date_end: string | null;
          venue: string | null;
          address: string | null;
          organiser_name: string | null;
          organiser_email: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          town: string;
          category?: string | null;
          status?: string;
          is_featured?: boolean;
          date_start: string;
          date_end?: string | null;
          venue?: string | null;
          address?: string | null;
          organiser_name?: string | null;
          organiser_email?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          town?: string;
          category?: string | null;
          status?: string;
          is_featured?: boolean;
          date_start?: string;
          date_end?: string | null;
          venue?: string | null;
          address?: string | null;
          organiser_name?: string | null;
          organiser_email?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body: string | null;
          hero_image_url: string | null;
          towns: string[] | null;
          status: string;
          type: string;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          body?: string | null;
          hero_image_url?: string | null;
          towns?: string[] | null;
          status?: string;
          type?: string;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          body?: string | null;
          hero_image_url?: string | null;
          towns?: string[] | null;
          status?: string;
          type?: string;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          slug: string;
          title: string;
          company_name: string;
          town: string;
          job_type: string | null;
          category: string | null;
          description: string | null;
          salary_range: string | null;
          contact_email: string;
          contact_phone: string | null;
          website_url: string | null;
          image_url: string | null;
          is_featured: boolean;
          featured_until: string | null;
          status: string;
          expires_at: string | null;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          company_name: string;
          town: string;
          job_type?: string | null;
          category?: string | null;
          description?: string | null;
          salary_range?: string | null;
          contact_email: string;
          contact_phone?: string | null;
          website_url?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          featured_until?: string | null;
          status?: string;
          expires_at?: string | null;
          address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          company_name?: string;
          town?: string;
          job_type?: string | null;
          category?: string | null;
          description?: string | null;
          salary_range?: string | null;
          contact_email?: string;
          contact_phone?: string | null;
          website_url?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          featured_until?: string | null;
          status?: string;
          expires_at?: string | null;
          address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      clubs: {
        Row: {
          id: string;
          slug: string;
          name: string;
          sport: string | null;
          town: string;
          tier: string;
          status: string;
          description: string | null;
          full_description: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          hero_image_url: string | null;
          logo_url: string | null;
          is_spotlight: boolean;
          founded_year: number | null;
          members_count: number | null;
          social_instagram: string | null;
          social_facebook: string | null;
          telegram_code: string | null;
          telegram_chat_id: string | null;
          telegram_linked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          sport?: string | null;
          town: string;
          tier?: string;
          status?: string;
          description?: string | null;
          full_description?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          hero_image_url?: string | null;
          logo_url?: string | null;
          is_spotlight?: boolean;
          founded_year?: number | null;
          members_count?: number | null;
          social_instagram?: string | null;
          social_facebook?: string | null;
          telegram_code?: string | null;
          telegram_chat_id?: string | null;
          telegram_linked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          sport?: string | null;
          town?: string;
          tier?: string;
          status?: string;
          description?: string | null;
          full_description?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          hero_image_url?: string | null;
          logo_url?: string | null;
          is_spotlight?: boolean;
          founded_year?: number | null;
          members_count?: number | null;
          social_instagram?: string | null;
          social_facebook?: string | null;
          telegram_code?: string | null;
          telegram_chat_id?: string | null;
          telegram_linked_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      club_photos: {
        Row: {
          id: string;
          club_id: string;
          url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          club_id: string;
          url: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          club_id?: string;
          url?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      club_posts: {
        Row: {
          id: string;
          club_id: string;
          content: string;
          image_url: string | null;
          images: string[] | null;
          source: string;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          club_id: string;
          content: string;
          image_url?: string | null;
          images?: string[] | null;
          source?: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          club_id?: string;
          content?: string;
          image_url?: string | null;
          images?: string[] | null;
          source?: string;
          created_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "club_posts_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
        ];
      };
      queue_items: {
        Row: {
          id: string;
          status: string | null;
        };
        Insert: {
          id?: string;
          status?: string | null;
        };
        Update: {
          id?: string;
          status?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    PostgrestVersion: "12";
  };
}
