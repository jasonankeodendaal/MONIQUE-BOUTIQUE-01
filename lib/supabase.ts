
import { createClient } from '@supabase/supabase-js';

// Robust environment variable detection
const getEnv = (key: string) => {
  return (import.meta as any).env?.[key] || (process as any).env?.[key] || '';
};

const rawUrl = getEnv('VITE_SUPABASE_URL');
const rawKey = getEnv('VITE_SUPABASE_ANON_KEY');

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.includes('supabase.co') && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

/**
 * Sync Local to Cloud - Used for first-time setup migration
 */
export async function syncLocalToCloud(table: string, data: any[]) {
  if (!isSupabaseConfigured || !data.length) return;
  const { error } = await supabase.from(table).upsert(data);
  if (error) console.error(`Sync error for ${table}:`, error);
}

/**
 * Fetch all data for a specific table
 */
export async function fetchTableData(table: string) {
  if (!isSupabaseConfigured) {
    // Return local storage fallback if no cloud is connected
    const local = localStorage.getItem(`admin_${table}`);
    if (table === 'settings') {
        const s = localStorage.getItem('site_settings');
        return s ? [JSON.parse(s)] : [];
    }
    return local ? JSON.parse(local) : [];
  }
  
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Fetch error for ${table}:`, error);
    throw error; // Let the caller handle the catch
  }
}

/**
 * Upsert data to Supabase (Insert or Update)
 */
export async function upsertData(table: string, item: any) {
  if (!isSupabaseConfigured) return false;
  const cleanItem = JSON.parse(JSON.stringify(item));
  const { error } = await supabase.from(table).upsert(cleanItem);
  if (error) {
    console.error(`Upsert error for ${table}:`, error);
    throw error;
  }
  return true;
}

/**
 * Delete data from Supabase
 */
export async function deleteData(table: string, id: string) {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
     console.error(`Delete error for ${table}:`, error);
     throw error;
  }
  return true;
}

export async function uploadMedia(file: File, bucket = 'media') {
  if (!isSupabaseConfigured) return URL.createObjectURL(file);

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl.publicUrl;
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) {
    return { status: 'offline', latency: 0, message: 'Local Mode: No Cloud Credentials' };
  }
  
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('companyName').limit(1);
    const end = performance.now();
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Cloud Connected' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Connection Timeout' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
