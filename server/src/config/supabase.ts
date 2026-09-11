import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://ibdwzdyehsqxuqccognm.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_WTrnMtD1VaSwO6W4vpIVFA_t2Zz9hSx';

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

export function getSupabaseServerStatus() {
  return {
    configured: Boolean(supabaseUrl && supabaseKey),
    url: supabaseUrl,
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}
