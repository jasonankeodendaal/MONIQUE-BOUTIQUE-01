
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
    // Specifically handle the Infinite Recursion error which is common when RLS policies reference themselves
    if (error.code === '42P17' || error.message?.includes('infinite recursion')) {
       console.error(`CRITICAL: Database Recursion Error on table '${table}'.`);
       console.warn("ACTION REQUIRED: Go to Admin > Pilot > Database Schema and run the updated SQL script to repair your policies.");
    } else {
       console.error(`Fetch error for ${table}:`, error);
    }
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
    throw new Error(error.message || `Failed to update ${table}`);
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

  if (error) {
    console.error('Upload Error:', error);
    throw new Error(error.message || 'Upload failed');
  }

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
        .from('public_settings')
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
    // Detect recursion error even in health check
    if (err.code === '42P17' || err.message?.includes('infinite recursion')) {
       return { status: 'offline', latency: 0, message: 'CRITICAL: DB Recursion Error. Run Repair Script.' };
    }
    console.warn("Connection check failed:", err.message);
    return { status: 'offline', latency: 0, message: 'Cloud connection failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;

/**
 * Checks if the remote DB is empty and migrates local data if so.
 * Returns true if migration occurred.
 */
export async function checkAndMigrate(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    // 1. Check if remote DB is empty (using settings table as indicator)
    const { count, error } = await supabase
      .from('public_settings')
      .select('*', { count: 'exact', head: true });

    if (error || (count !== null && count > 0)) {
      return false; // Remote has data or error, skip migration
    }

    console.log("Empty remote DB detected. Migrating local data...");

    // 2. Migration Map: LocalStorage Key -> Supabase Table
    const migrationMap = [
      { table: 'public_settings', key: 'site_settings', transform: (d: any) => ({ ...d, id: 'global' }) },
      { table: 'products', key: 'admin_products' },
      { table: 'categories', key: 'admin_categories' },
      { table: 'subcategories', key: 'admin_subcategories' },
      { table: 'hero_slides', key: 'admin_hero' },
      { table: 'enquiries', key: 'admin_enquiries' },
      { table: 'admin_users', key: 'admin_users' },
      { table: 'product_stats', key: 'admin_product_stats' },
      { table: 'orders', key: 'admin_orders' },
      { table: 'subscribers', key: 'admin_subscribers' }
    ];

    let migrated = false;

    // 3. Perform Migration
    for (const m of migrationMap) {
      const local = localStorage.getItem(m.key);
      if (local) {
        let data = JSON.parse(local);
        if (!Array.isArray(data)) data = [data]; // Settings might be object, others array
        
        if (data.length > 0) {
          if (m.transform) data = data.map(m.transform);
          
          const { error: upError } = await supabase.from(m.table).upsert(data);
          
          if (!upError) {
            console.log(`Migrated ${data.length} records to ${m.table}`);
            migrated = true;
          } else {
            console.error(`Failed to migrate ${m.table}:`, upError);
          }
        }
      }
    }
    
    return migrated;
  } catch (e) {
    console.error("Migration check failed", e);
    return false;
  }
}
