
import { createClient } from '@supabase/supabase-js';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ADMINS, INITIAL_ENQUIRIES } from '../constants';

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

// Log status to help user debug connection issues
if (!supabaseUrl) {
  console.warn("%c[Supabase] URL not found.", "color: orange; font-weight: bold;");
  console.log("To fix: Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
} else if (!supabaseUrl.includes('supabase.co')) {
  console.warn("%c[Supabase] Invalid URL format.", "color: red; font-weight: bold;", supabaseUrl);
} else {
  console.log("%c[Supabase] Configuration detected.", "color: green; font-weight: bold;");
}

// STRICT CHECK: Only configured if URL is present AND contains supabase.co
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.includes('supabase.co'));

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const SUPABASE_SCHEMA = `
-- #####################################################
-- # KASI COUTURE DATABASE SETUP SCRIPT (ROBUST V2)
-- # PASTE THIS INTO SUPABASE SQL EDITOR
-- #####################################################

-- 1. Create Tables (IF NOT EXISTS)
create table if not exists settings (
  id text primary key,
  "companyName" text, "slogan" text, "companyLogo" text, "companyLogoUrl" text,
  "primaryColor" text, "secondaryColor" text, "accentColor" text,
  "navHomeLabel" text, "navProductsLabel" text, "navAboutLabel" text, "navContactLabel" text, "navDashboardLabel" text,
  "contactEmail" text, "contactPhone" text, "whatsappNumber" text, "address" text,
  "socialLinks" jsonb,
  "footerDescription" text, "footerCopyrightText" text,
  "homeHeroBadge" text, "homeAboutTitle" text, "homeAboutDescription" text, "homeAboutImage" text, "homeAboutCta" text,
  "homeCategorySectionTitle" text, "homeCategorySectionSubtitle" text, "homeTrustSectionTitle" text,
  "homeTrustItem1Title" text, "homeTrustItem1Desc" text, "homeTrustItem1Icon" text,
  "homeTrustItem2Title" text, "homeTrustItem2Desc" text, "homeTrustItem2Icon" text,
  "homeTrustItem3Title" text, "homeTrustItem3Desc" text, "homeTrustItem3Icon" text,
  "productsHeroTitle" text, "productsHeroSubtitle" text, "productsHeroImage" text, "productsHeroImages" jsonb, "productsSearchPlaceholder" text,
  "aboutHeroTitle" text, "aboutHeroSubtitle" text, "aboutMainImage" text,
  "aboutEstablishedYear" text, "aboutFounderName" text, "aboutLocation" text,
  "aboutHistoryTitle" text, "aboutHistoryBody" text,
  "aboutMissionTitle" text, "aboutMissionBody" text, "aboutMissionIcon" text,
  "aboutCommunityTitle" text, "aboutCommunityBody" text, "aboutCommunityIcon" text,
  "aboutIntegrityTitle" text, "aboutIntegrityBody" text, "aboutIntegrityIcon" text,
  "aboutSignatureImage" text, "aboutGalleryImages" jsonb,
  "contactHeroTitle" text, "contactHeroSubtitle" text, "contactFormNameLabel" text, "contactFormEmailLabel" text,
  "contactFormSubjectLabel" text, "contactFormMessageLabel" text, "contactFormButtonText" text,
  "contactInfoTitle" text, "contactAddressLabel" text, "contactHoursLabel" text, "contactHoursWeekdays" text, "contactHoursWeekends" text,
  "disclosureTitle" text, "disclosureContent" text, "privacyTitle" text, "privacyContent" text, "termsTitle" text, "termsContent" text,
  "emailJsServiceId" text, "emailJsTemplateId" text, "emailJsPublicKey" text,
  "googleAnalyticsId" text, "facebookPixelId" text, "tiktokPixelId" text, "amazonAssociateId" text, "webhookUrl" text
);

create table if not exists products (
  id text primary key,
  name text, sku text, price numeric, "affiliateLink" text,
  "categoryId" text, "subCategoryId" text, description text,
  features jsonb, specifications jsonb, media jsonb,
  "discountRules" jsonb, reviews jsonb, "createdAt" bigint
);

create table if not exists categories (
  id text primary key,
  name text, icon text, image text, description text
);

create table if not exists subcategories (
  id text primary key,
  "categoryId" text, name text
);

create table if not exists carousel_slides (
  id text primary key,
  image text, type text, title text, subtitle text, cta text
);

create table if not exists enquiries (
  id text primary key,
  name text, email text, whatsapp text, subject text, message text, "createdAt" bigint, status text
);

create table if not exists admin_users (
  id text primary key,
  name text, email text, role text, permissions jsonb, password text, "createdAt" bigint, "lastActive" bigint, "profileImage" text, phone text, address text
);

create table if not exists product_stats (
  "productId" text primary key,
  views numeric, clicks numeric, "totalViewTime" numeric, "lastUpdated" bigint
);

create table if not exists traffic_logs (
  id text primary key,
  type text, text text, time text, timestamp bigint
);

-- 2. ENABLE ROW LEVEL SECURITY
alter table settings enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table carousel_slides enable row level security;
alter table enquiries enable row level security;
alter table admin_users enable row level security;
alter table product_stats enable row level security;
alter table traffic_logs enable row level security;

-- 3. CREATE POLICIES

-- Settings
drop policy if exists "Public Read Settings" on settings;
create policy "Public Read Settings" on settings for select using (true);

drop policy if exists "Public/Admin All Settings" on settings;
create policy "Public/Admin All Settings" on settings for all using (true);

-- Products
drop policy if exists "Public Read Products" on products;
create policy "Public Read Products" on products for select using (true);

drop policy if exists "Public/Admin All Products" on products;
create policy "Public/Admin All Products" on products for all using (true);

-- Categories
drop policy if exists "Public Read Categories" on categories;
create policy "Public Read Categories" on categories for select using (true);

drop policy if exists "Public/Admin All Categories" on categories;
create policy "Public/Admin All Categories" on categories for all using (true);

-- Subcategories
drop policy if exists "Public Read Subcategories" on subcategories;
create policy "Public Read Subcategories" on subcategories for select using (true);

drop policy if exists "Public/Admin All Subcategories" on subcategories;
create policy "Public/Admin All Subcategories" on subcategories for all using (true);

-- Carousel Slides
drop policy if exists "Public Read Slides" on carousel_slides;
create policy "Public Read Slides" on carousel_slides for select using (true);

drop policy if exists "Public/Admin All Slides" on carousel_slides;
create policy "Public/Admin All Slides" on carousel_slides for all using (true);

-- Enquiries
drop policy if exists "Public Insert Enquiries" on enquiries;
create policy "Public Insert Enquiries" on enquiries for insert with check (true);

drop policy if exists "Admin All Enquiries" on enquiries;
create policy "Admin All Enquiries" on enquiries for all using (true);

-- Traffic Logs
drop policy if exists "Public Insert Logs" on traffic_logs;
create policy "Public Insert Logs" on traffic_logs for insert with check (true);

drop policy if exists "Admin All Logs" on traffic_logs;
create policy "Admin All Logs" on traffic_logs for all using (true);

-- Admin Users (Restricted)
drop policy if exists "Admin Control Users" on admin_users;
create policy "Admin Control Users" on admin_users for all using (auth.role() = 'authenticated');

-- 4. Setup Storage Buckets
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'media' );

drop policy if exists "Public Upload" on storage.objects;
create policy "Public Upload" 
on storage.objects for insert 
with check ( bucket_id = 'media' );
`;

export const LOCAL_STORAGE_KEYS: Record<string, string> = {
  'products': 'admin_products',
  'categories': 'admin_categories',
  'subcategories': 'admin_subcategories',
  'carousel_slides': 'admin_hero',
  'enquiries': 'admin_enquiries',
  'admin_users': 'admin_users',
  'product_stats': 'admin_product_stats',
  'settings': 'site_settings',
  'traffic_logs': 'site_traffic_logs'
};

/**
 * Helper to subscribe to Realtime changes on a specific table.
 */
export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  if (!isSupabaseConfigured) return null;
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
    .subscribe();
};

/**
 * Initializes the database by seeding default data if tables are empty.
 */
export async function initializeDatabase() {
  if (!isSupabaseConfigured) return;
  // We avoid auto-seeding here to allow the Migration Logic in App.tsx 
  // to take precedence if local data exists.
  return; 
}

/**
 * Generic Upsert Function
 */
export async function upsertData(table: string, data: any) {
  if (!isSupabaseConfigured) return { data: null, error: { message: 'Supabase not configured' } };
  try {
    // If it's an array of data
    if (Array.isArray(data)) {
      if (data.length === 0) return { data: [], error: null };
      const { data: result, error } = await supabase.from(table).upsert(data).select();
      if (error) throw error;
      return { data: result, error: null };
    } 
    // Single object
    else {
      const { data: result, error } = await supabase.from(table).upsert(data).select();
      if (error) throw error;
      return { data: result, error: null };
    }
  } catch (e: any) {
      console.error(`Exception upserting ${table}`, e);
      return { data: null, error: e };
  }
}

/**
 * Generic Delete Function
 */
export async function deleteData(table: string, id: string) {
  if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured' } };
  try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return { error: null };
  } catch (e: any) {
      console.error(`Exception deleting ${table}`, e);
      return { error: e };
  }
}

/**
 * Fetch all data for a specific table with fallback
 * Returns NULL on error to distinguish between "Empty Table" and "Connection Failure"
 */
export async function fetchTableData(table: string): Promise<any[] | null> {
  const localKey = LOCAL_STORAGE_KEYS[table] || `admin_${table}`;

  if (!isSupabaseConfigured) {
    const local = localStorage.getItem(localKey);
    return local ? JSON.parse(local) : [];
  }
  
  try {
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.error(`Fetch error for ${table}: ${error.message}`);
        // Return null to indicate FAILURE, not empty
        return null;
      }
      
      return data || [];
  } catch (e) {
      console.error(`Exception fetching ${table}`, e);
      return null;
  }
}

export interface UploadResult {
  url: string;
  type: string;
  name: string;
  size: number;
}

export async function uploadMedia(file: File, bucket = 'media'): Promise<UploadResult> {
  const fallbackUrl = URL.createObjectURL(file);
  if (!isSupabaseConfigured) return { url: fallbackUrl, type: file.type, name: file.name, size: file.size };

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return { 
      url: publicUrl.publicUrl,
      type: file.type,
      name: file.name,
      size: file.size
    };
  } catch (e) {
      console.error("Upload failed, falling back to blob", e);
      return { url: fallbackUrl, type: file.type, name: file.name, size: file.size };
  }
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) {
    return { status: 'offline', latency: 0, message: 'Missing Cloud Environment' };
  }
  
  const start = performance.now();
  try {
    // Simple check on settings table
    const { error } = await supabase.from('settings').select('id').limit(1);
    const end = performance.now();
    
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Supabase Sync Active' };
  } catch (err: any) {
    return { status: 'offline', latency: 0, message: err.message || 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
