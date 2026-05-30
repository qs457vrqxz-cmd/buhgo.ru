// Database types generated from schema
// Run `npx supabase gen types typescript` to regenerate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'accountant' | 'client';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'requires_attention';
export type DocumentType = 'act' | 'invoice' | 'report' | 'contract' | 'other';
export type MessageType = 'text' | 'file' | 'system';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      accountants: {
        Row: {
          id: string;
          profile_id: string;
          position: string | null;
          can_view_clients: boolean;
          can_edit_clients: boolean;
          can_view_documents: boolean;
          can_upload_documents: boolean;
          can_send_messages: boolean;
          can_view_reports: boolean;
          can_create_reports: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          position?: string | null;
          can_view_clients?: boolean;
          can_edit_clients?: boolean;
          can_view_documents?: boolean;
          can_upload_documents?: boolean;
          can_send_messages?: boolean;
          can_view_reports?: boolean;
          can_create_reports?: boolean;
          created_at?: string;
        };
        Update: {
          position?: string | null;
          can_view_clients?: boolean;
          can_edit_clients?: boolean;
          can_view_documents?: boolean;
          can_upload_documents?: boolean;
          can_send_messages?: boolean;
          can_view_reports?: boolean;
          can_create_reports?: boolean;
        };
      };
      clients: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          inn: string | null;
          ogrn: string | null;
          legal_address: string | null;
          actual_address: string | null;
          contact_person: string | null;
          assigned_accountant_id: string | null;
          tariff: string | null;
          contract_date: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          inn?: string | null;
          ogrn?: string | null;
          legal_address?: string | null;
          actual_address?: string | null;
          contact_person?: string | null;
          assigned_accountant_id?: string | null;
          tariff?: string | null;
          contract_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          company_name?: string;
          inn?: string | null;
          ogrn?: string | null;
          legal_address?: string | null;
          actual_address?: string | null;
          contact_person?: string | null;
          assigned_accountant_id?: string | null;
          tariff?: string | null;
          contract_date?: string | null;
          notes?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          company: string | null;
          service: string | null;
          message: string | null;
          source: string;
          status: LeadStatus;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          metadata: Json | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          company?: string | null;
          service?: string | null;
          message?: string | null;
          source?: string;
          status?: LeadStatus;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          metadata?: Json | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string;
          email?: string | null;
          company?: string | null;
          service?: string | null;
          message?: string | null;
          source?: string;
          status?: LeadStatus;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          metadata?: Json | null;
          assigned_to?: string | null;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          client_id: string;
          uploaded_by: string | null;
          name: string;
          description: string | null;
          file_url: string;
          file_size: number | null;
          file_type: string | null;
          document_type: DocumentType;
          status: DocumentStatus;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          uploaded_by?: string | null;
          name: string;
          description?: string | null;
          file_url: string;
          file_size?: number | null;
          file_type?: string | null;
          document_type?: DocumentType;
          status?: DocumentStatus;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          file_url?: string;
          document_type?: DocumentType;
          status?: DocumentStatus;
          metadata?: Json | null;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          client_id: string;
          accountant_id: string | null;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          accountant_id?: string | null;
          last_message_at?: string;
          created_at?: string;
        };
        Update: {
          accountant_id?: string | null;
          last_message_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          message_type: MessageType;
          content: string | null;
          file_url: string | null;
          file_name: string | null;
          file_size: number | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          message_type?: MessageType;
          content?: string | null;
          file_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          content?: string | null;
          is_read?: boolean;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          image_url: string | null;
          category: string | null;
          tags: string[] | null;
          author_id: string | null;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content: string;
          image_url?: string | null;
          category?: string | null;
          tags?: string[] | null;
          author_id?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          image_url?: string | null;
          category?: string | null;
          tags?: string[] | null;
          is_published?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: string | null;
          price_note: string | null;
          icon: string | null;
          url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price?: string | null;
          price_note?: string | null;
          icon?: string | null;
          url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          price?: string | null;
          price_note?: string | null;
          icon?: string | null;
          url?: string | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      partners: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          website_url: string | null;
          brand_color: string | null;
          bonus: string | null;
          features: string[] | null;
          our_services: string[] | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          brand_color?: string | null;
          bonus?: string | null;
          features?: string[] | null;
          our_services?: string[] | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          brand_color?: string | null;
          bonus?: string | null;
          features?: string[] | null;
          our_services?: string[] | null;
          sort_order?: number;
          is_active?: boolean;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          position: string | null;
          avatar_url: string | null;
          rating: number;
          content: string;
          date: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          company?: string | null;
          position?: string | null;
          avatar_url?: string | null;
          rating?: number;
          content: string;
          date?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          company?: string | null;
          position?: string | null;
          avatar_url?: string | null;
          rating?: number;
          content?: string;
          date?: string | null;
          is_published?: boolean;
          sort_order?: number;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          type: string;
          url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body?: string | null;
          type?: string;
          url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          body?: string | null;
          type?: string;
          url?: string | null;
          is_read?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      lead_status: LeadStatus;
      document_status: DocumentStatus;
      document_type: DocumentType;
      message_type: MessageType;
    };
  };
}
