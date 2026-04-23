import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl.startsWith('https://')) {
    console.error('❌ Invalid Supabase URL: Must start with https://');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
