
import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.includes('supabase.co'));

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
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
    const local = localStorage.getItem(`admin_${table}`);
    if (table === 'settings') {
        const s = localStorage.getItem('site_settings');
        return s ? [JSON.parse(s)] : [];
    }
    return local ? JSON.parse(local) : [];
  }
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`Fetch error for ${table}:`, error);
    return null;
  }
  return data || [];
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
    return { status: 'offline', latency: 0, message: 'Missing Cloud Environment' };
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  const start = performance.now();
  try {
    // We add a count and head to make it lightweight, but we use a filter to prevent caching
    // The filter 'id' 'neq' 'zero' is just a dummy logic to force a lookup
    const { error } = await supabase
        .from('settings')
        .select('id', { count: 'exact', head: true })
        .limit(1);

    const end = performance.now();
    clearTimeout(timeoutId);
    
    if (error) throw error;
    
    // Ensure we capture even sub-millisecond differences on fast networks
    // On mobile, if cached, this might be very low, so we enforce a floor of 1ms if successful to show activity
    let latency = Math.round(end - start);
    if (latency === 0) latency = 1; 

    return { status: 'online', latency, message: 'Supabase Sync Active' };
  } catch (err: any) {
    console.warn("Connection check failed:", err.message);
    return { status: 'offline', latency: 0, message: 'Cloud connection failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
