/* eslint-disable prettier/prettier */
import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  || '';
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Returns a no-op client if not configured so the app never crashes
export const supabase = url && key
  ? createClient(url, key)
  : createClient('https://placeholder.supabase.co', 'placeholder', {
      auth: { persistSession: false },
    });

export const supabaseConfigured = Boolean(url && key);
