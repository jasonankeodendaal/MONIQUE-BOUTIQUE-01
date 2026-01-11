
import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.includes('supabase.co'));

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
 * Generic Upsert for Single or Multiple Items
 */
export async function upsertData(table: string, data: any) {
  if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured' } };
  
  // Clean data: remove undefined fields to prevent DB errors
  const clean = Array.isArray(data) 
    ? data.map(item => JSON.parse(JSON.stringify(item))) 
    : JSON.parse(JSON.stringify(data));

  return await supabase.from(table).upsert(clean);
}

/**
 * Delete Item
 */
export async function deleteData(table: string, id: string) {
  if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured' } };
  return await supabase.from(table).delete().match({ id });
}

/**
 * Fetch all data for a specific table
 */
export async function fetchTableData(table: string) {
  if (!isSupabaseConfigured) {
    // Return local storage fallback if no cloud is connected
    const local = localStorage.getItem(`admin_${table}`);
    return local ? JSON.parse(local) : null;
  }
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    console.error(`Fetch error for ${table}:`, error);
    return null;
  }
  return data;
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
  
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('companyName').limit(1);
    const end = performance.now();
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Supabase Sync Active' };
  } catch (err) {
    return { status: 'offline', latency: 0, message: 'Cloud connection failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
