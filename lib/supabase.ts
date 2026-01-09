
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
-- # KASI COUTURE DATABASE SETUP SCRIPT
-- # PASTE THIS INTO SUPABASE SQL EDITOR
-- # #####################################################

-- 1. Create Tables
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

-- 3. CREATE POLICIES (Public Read / Admin Full)

-- Settings: Public Read, Admin All
create policy "Public Read Settings" on settings for select using (true);
create policy "Admin Control Settings" on settings for all using (auth.role() = 'authenticated');
create policy "Public Insert Settings" on settings for insert with check (true);

-- Products: Public Read, Admin All
create policy "Public Read Products" on products for select using (true);
create policy "Admin Control Products" on products for all using (auth.role() = 'authenticated');
create policy "Public Insert Products" on products for insert with check (true);

-- Categories: Public Read, Admin All
create policy "Public Read Categories" on categories for select using (true);
create policy "Admin Control Categories" on categories for all using (auth.role() = 'authenticated');
create policy "Public Insert Categories" on categories for insert with check (true);

-- Subcategories: Public Read, Admin All
create policy "Public Read Subcategories" on subcategories for select using (true);
create policy "Admin Control Subcategories" on subcategories for all using (auth.role() = 'authenticated');
create policy "Public Insert Subcategories" on subcategories for insert with check (true);

-- Carousel Slides: Public Read, Admin All
create policy "Public Read Slides" on carousel_slides for select using (true);
create policy "Admin Control Slides" on carousel_slides for all using (auth.role() = 'authenticated');
create policy "Public Insert Slides" on carousel_slides for insert with check (true);

-- Product Stats: Public Read, Public Update (counters), Admin All
create policy "Public Read Stats" on product_stats for select using (true);
create policy "Admin Control Stats" on product_stats for all using (auth.role() = 'authenticated');
create policy "Public Update Stats" on product_stats for update using (true);
create policy "Public Insert Stats" on product_stats for insert with check (true);

-- Enquiries: Public Insert, Admin All
create policy "Public Insert Enquiries" on enquiries for insert with check (true);
create policy "Admin Control Enquiries" on enquiries for all using (auth.role() = 'authenticated');

-- Traffic Logs: Public Insert, Admin All
create policy "Public Insert Logs" on traffic_logs for insert with check (true);
create policy "Admin Control Logs" on traffic_logs for all using (auth.role() = 'authenticated');

-- Admin Users: Admin Read/All Only (No Public Access)
create policy "Admin Control Users" on admin_users for all using (auth.role() = 'authenticated');

-- 4. Setup Storage Buckets (Safe to Re-run)
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- 5. Setup Storage Policies (Safe to Re-run via Drop)
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'media' );

drop policy if exists "Admin Control" on storage.objects;
create policy "Admin Control" 
on storage.objects for all 
using ( auth.role() = 'authenticated' );
`;

const LOCAL_STORAGE_KEYS: Record<string, string> = {
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
 * Initializes the database by seeding default data if tables are empty.
 */
export async function initializeDatabase() {
  if (!isSupabaseConfigured) return;

  try {
    // 1. Settings
    const { count: settingsCount } = await supabase.from('settings').select('*', { count: 'exact', head: true });
    if (settingsCount === 0) {
      await supabase.from('settings').insert([{ ...INITIAL_SETTINGS, id: 'global_settings' }]);
    }

    // 2. Categories
    const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    if (catCount === 0) {
      await supabase.from('categories').insert(INITIAL_CATEGORIES);
    }

    // 3. Subcategories
    const { count: subCount } = await supabase.from('subcategories').select('*', { count: 'exact', head: true });
    if (subCount === 0) {
      await supabase.from('subcategories').insert(INITIAL_SUBCATEGORIES);
    }

    // 4. Products
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (prodCount === 0) {
      await supabase.from('products').insert(INITIAL_PRODUCTS);
    }

    // 5. Slides
    const { count: slideCount } = await supabase.from('carousel_slides').select('*', { count: 'exact', head: true });
    if (slideCount === 0) {
      await supabase.from('carousel_slides').insert(INITIAL_CAROUSEL);
    }

    // 6. Admin Users (Seed Data)
    const { count: adminCount } = await supabase.from('admin_users').select('*', { count: 'exact', head: true });
    if (adminCount === 0) {
      await supabase.from('admin_users').insert(INITIAL_ADMINS);
    }

    // 7. Enquiries (Seed Data)
    const { count: enqCount } = await supabase.from('enquiries').select('*', { count: 'exact', head: true });
    if (enqCount === 0) {
      await supabase.from('enquiries').insert(INITIAL_ENQUIRIES);
    }
  } catch (error) {
    console.error("Auto-initialization failed:", error);
  }
}

/**
 * Generic Upsert Function
 */
export async function upsertData(table: string, data: any) {
  if (!isSupabaseConfigured) return { data: null, error: { message: 'Supabase not configured' } };
  try {
    const { data: result, error } = await supabase.from(table).upsert(data).select();
    if (error) {
        console.warn(`Upsert warning for ${table}:`, error.message);
        return { data: null, error };
    }
    return { data: result, error: null };
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
      if (error) {
        console.warn(`Delete warning for ${table}:`, error.message);
        return { error };
      }
      return { error: null };
  } catch (e: any) {
      console.error(`Exception deleting ${table}`, e);
      return { error: e };
  }
}

/**
 * Sync Local to Cloud - Legacy Migration Helper
 */
export async function syncLocalToCloud(tableName: string, localKey: string) {
  if (!isSupabaseConfigured) return;
  
  const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
  if (localData.length === 0) return;

  console.log(`Migrating ${localData.length} items from ${localKey} to ${tableName}...`);
  
  const { error } = await supabase.from(tableName).upsert(localData);
  
  if (error) {
    console.error(`Migration error for ${tableName}:`, error);
  } else {
    console.log(`Migration success for ${tableName}`);
  }
}

/**
 * Fetch all data for a specific table with fallback
 */
export async function fetchTableData(table: string) {
  const localKey = LOCAL_STORAGE_KEYS[table] || `admin_${table}`;

  if (!isSupabaseConfigured) {
    const local = localStorage.getItem(localKey);
    return local ? JSON.parse(local) : [];
  }
  
  try {
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.warn(`Fetch error for ${table}: ${error.message}`);
        return [];
      }
      
      return data || [];
  } catch (e) {
      console.error(`Exception fetching ${table}`, e);
      return [];
  }
}

export async function uploadMedia(file: File, bucket = 'media') {
  if (!isSupabaseConfigured) return URL.createObjectURL(file);

  try {
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
  } catch (e) {
      console.error("Upload failed, falling back to blob", e);
      return URL.createObjectURL(file);
  }
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) {
    return { status: 'offline', latency: 0, message: 'Missing Cloud Environment' };
  }
  
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('companyName').limit(1);
    const end = performance.now();
    
    if (error && (error.code === '42P01' || error.code === '42501' || error.message.includes('404'))) { 
        return { status: 'online', latency: Math.round(end - start), message: 'Connected (Config Issues)' };
    }
    
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Supabase Sync Active' };
  } catch (err: any) {
    return { status: 'offline', latency: 0, message: err.message || 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
