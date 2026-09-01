import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://zzomqsfralxrzzhxuali.supabase.co',
  'sb_publishable_5UWCTt8sJGhMbDgOUWMcdw_U58UPbQ6',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);
