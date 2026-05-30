import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Create a Supabase client for use in the browser
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Singleton instance for client-side
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    // Server-side: always create new instance
    return createClient();
  }

  // Client-side: use singleton
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
};

export const supabase = typeof window !== 'undefined' ? getSupabase() : null;
