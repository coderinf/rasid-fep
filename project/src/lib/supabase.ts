import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on your schema
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: number;
          ticker: string;
          name: string;
          name_ar: string | null;
          sector: string;
          logo_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          ticker: string;
          name: string;
          name_ar?: string | null;
          sector: string;
          logo_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          ticker?: string;
          name?: string;
          name_ar?: string | null;
          sector?: string;
          logo_url?: string | null;
          created_at?: string;
        };
      };
      se_news: {
        Row: {
          id: number;
          published_at: string | null;
          url: string | null;
          content: string | null;
          sentiment_label: string | null;
          confidence: number | null;
          stocks: string | null;
          sent_to_api: boolean;
          title: string | null;
          source: string | null;
          language: string | null;
        };
        Insert: {
          id?: number;
          published_at?: string | null;
          url?: string | null;
          content?: string | null;
          sentiment_label?: string | null;
          confidence?: number | null;
          stocks?: string | null;
          sent_to_api?: boolean;
          title?: string | null;
          source?: string | null;
          language?: string | null;
        };
        Update: {
          id?: number;
          published_at?: string | null;
          url?: string | null;
          content?: string | null;
          sentiment_label?: string | null;
          confidence?: number | null;
          stocks?: string | null;
          sent_to_api?: boolean;
          title?: string | null;
          source?: string | null;
          language?: string | null;
        };
      };
      argaam_news: {
        Row: {
          id: number;
          title: string | null;
          url: string | null;
          published_at: string | null;
          content: string | null;
          sentiment_label: string | null;
          confidence: number | null;
          stocks: string | null;
          sent_to_api: boolean;
          source: string | null;
          language: string | null;
        };
        Insert: {
          id?: number;
          title?: string | null;
          url?: string | null;
          published_at?: string | null;
          content?: string | null;
          sentiment_label?: string | null;
          confidence?: number | null;
          stocks?: string | null;
          sent_to_api?: boolean;
          source?: string | null;
          language?: string | null;
        };
        Update: {
          id?: number;
          title?: string | null;
          url?: string | null;
          published_at?: string | null;
          content?: string | null;
          sentiment_label?: string | null;
          confidence?: number | null;
          stocks?: string | null;
          sent_to_api?: boolean;
          source?: string | null;
          language?: string | null;
        };
      };
      company_sentiment: {
        Row: {
          id: number;
          company_id: number;
          date: string;
          sentiment_score: number | null;
          volume: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          company_id: number;
          date: string;
          sentiment_score?: number | null;
          volume?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          company_id?: number;
          date?: string;
          sentiment_score?: number | null;
          volume?: number;
          created_at?: string;
        };
      };
      sectors: {
        Row: {
          id: number;
          name: string;
          name_ar: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          name_ar?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          name_ar?: string | null;
          created_at?: string;
        };
      };
      sector_sentiment: {
        Row: {
          id: number;
          sector_id: number;
          date: string;
          average_sentiment: number | null;
          change_from_previous: number | null;
          volume: number;
          companies_count: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          sector_id: number;
          date: string;
          average_sentiment?: number | null;
          change_from_previous?: number | null;
          volume?: number;
          companies_count?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          sector_id?: number;
          date?: string;
          average_sentiment?: number | null;
          change_from_previous?: number | null;
          volume?: number;
          companies_count?: number;
          created_at?: string;
        };
      };
    };
  };
} 