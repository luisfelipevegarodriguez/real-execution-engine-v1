import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function logToSupabase(entry) {
  const { error } = await supabase.from('execution_logs').insert(entry);
  if (error) console.error('Supabase log error:', error.message);
}

export async function getRecentLogs(limit = 20) {
  const { data } = await supabase
    .from('execution_logs')
    .select('*')
    .order('ts', { ascending: false })
    .limit(limit);
  return data;
}
