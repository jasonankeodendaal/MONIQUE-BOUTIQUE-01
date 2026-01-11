
import { createClient } from '@supabase/supabase-js';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL } from '../constants';

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
 * Uploads a file directly to Supabase Storage and returns the Public URL.
 * Enforces use of the 'media' bucket.
 */
export async function uploadMedia(file: File, bucket = 'media'): Promise<string | null> {
  if (!isSupabaseConfigured) {
    console.warn("Supabase not configured. Returning ephemeral object URL.");
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    // Sanitize filename and add timestamp to prevent collisions
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
}

/**
 * Seeds the database with initial constants if tables are empty.
 * This performs the "One-Way Initial Migration".
 */
export async function seedDatabase() {
  if (!isSupabaseConfigured) return;

  console.log("Checking database state...");

  // Check if settings exist
  const { count } = await supabase.from('settings').select('*', { count: 'exact', head: true });
  
  if (count === 0) {
    console.log("Database empty. Starting one-way migration...");
    
    // 1. Settings
    await supabase.from('settings').insert([INITIAL_SETTINGS]);
    
    // 2. Categories
    await supabase.from('categories').insert(INITIAL_CATEGORIES);
    
    // 3. SubCategories
    await supabase.from('subcategories').insert(INITIAL_SUBCATEGORIES);
    
    // 4. Products
    // Sanitize products to ensure they match DB schema (e.g. handle undefineds)
    const sanitizedProducts = INITIAL_PRODUCTS.map(p => ({
       ...p,
       media: p.media || [],
       specifications: p.specifications || {},
       features: p.features || [],
       discountRules: p.discountRules || []
    }));
    await supabase.from('products').insert(sanitizedProducts);
    
    // 5. Hero Slides
    await supabase.from('hero_slides').insert(INITIAL_CAROUSEL);
    
    console.log("Migration complete. Supabase is now the Single Source of Truth.");
  }
}

/**
 * Fetch all data for a specific table.
 * Returns empty array if error or not found to prevent crashes.
 */
export async function fetchTableData(table: string) {
  if (!isSupabaseConfigured) return [];
  
  const { data, error } = await supabase.from(table).select('*');
  
  if (error) {
    console.error(`Fetch error for ${table}:`, error.message);
    return [];
  }
  return data || [];
}

/**
 * Generic Upsert for any table
 */
export async function upsertData(table: string, data: any) {
  if (!isSupabaseConfigured) return { error: { message: "Supabase not configured" } };
  
  // Remove any frontend-specific keys if necessary, or ensure schema matches
  return await supabase.from(table).upsert(data);
}

/**
 * Delete data from table
 */
export async function deleteData(table: string, id: string) {
    if (!isSupabaseConfigured) return { error: { message: "Supabase not configured" } };
    return await supabase.from(table).delete().eq('id', id);
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
