
import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.trim();
const supabaseAnonKey = rawKey.trim();

if (!supabaseUrl) {
  console.warn("%c[Supabase] URL not found.", "color: orange; font-weight: bold;");
} else {
  console.log("%c[Supabase] Configuration detected.", "color: green; font-weight: bold;");
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.includes('supabase.co'));

export const getSupabaseUrl = () => supabaseUrl;

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

// --- HELPER FUNCTIONS ---

export const fetchTableData = async (table: string) => {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.warn(`[Supabase] Error fetching ${table}:`, error.message);
      // Don't throw, just return null to trigger fallback
      return null;
    }
    return data;
  } catch (err) {
    // Catch network errors like "Failed to fetch"
    console.error(`[Supabase] Network error fetching ${table}:`, err);
    return null;
  }
};

export const upsertData = async (table: string, data: any) => {
  if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured' } };
  try {
    // Clean data: remove undefined fields
    const cleanData = JSON.parse(JSON.stringify(data));
    const result = await supabase.from(table).upsert(cleanData);
    if (result.error) throw result.error;
    return result;
  } catch (err: any) {
    console.error(`[Supabase] Error upserting to ${table}:`, err);
    return { error: err };
  }
};

export const deleteData = async (table: string, id: string) => {
  if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured' } };
  try {
    const result = await supabase.from(table).delete().eq('id', id);
    if (result.error) throw result.error;
    return result;
  } catch (err: any) {
    console.error(`[Supabase] Error deleting from ${table}:`, err);
    return { error: err };
  }
};

export const uploadMedia = async (file: File) => {
  if (!isSupabaseConfigured) throw new Error("Storage not configured");
  
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    
    return {
      url: data.publicUrl,
      name: file.name,
      type: file.type,
      size: file.size
    };
  } catch (err) {
    console.error("[Supabase] Upload failed:", err);
    throw err;
  }
};

export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  if (!isSupabaseConfigured) return null;
  try {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
      .subscribe();
  } catch (err) {
    console.error(`[Supabase] Subscription failed for ${table}:`, err);
    return null;
  }
};

export const updateProductStats = async (productId: string, type: 'view' | 'click') => {
  if (!isSupabaseConfigured) return;
  
  try {
    const { data: current } = await supabase.from('product_stats').select('*').eq('productId', productId).single();
    
    const now = Date.now();
    const stats = current || { productId, views: 0, clicks: 0, totalViewTime: 0, lastUpdated: now };
    
    if (type === 'view') stats.views = (stats.views || 0) + 1;
    if (type === 'click') stats.clicks = (stats.clicks || 0) + 1;
    stats.lastUpdated = now;

    await supabase.from('product_stats').upsert(stats);
  } catch (err) {
    // Silent fail for stats
    console.warn("[Supabase] Failed to update stats", err);
  }
};

export const measureConnection = async () => {
   if (!isSupabaseConfigured) return { status: 'offline' as const, latency: 0, message: 'Not Configured' };
   const start = performance.now();
   try {
     const { error } = await supabase.from('settings').select('id').limit(1);
     const end = performance.now();
     if (error) throw error;
     return {
        status: 'online' as const,
        latency: Math.round(end - start),
        message: 'Connected'
     };
   } catch (err: any) {
     return {
        status: 'offline' as const,
        latency: 0,
        message: err.message || 'Connection Failed'
     };
   }
};

// --- DATABASE SEEDING ---

export const seedDatabase = async (initialData: {
  settings: any;
  products: any[];
  categories: any[];
  subCategories: any[];
  slides: any[];
}) => {
  if (!isSupabaseConfigured) return { success: false, error: 'Not Configured' };

  console.log("Creating Seed Data in Supabase...");

  try {
    // 1. Settings
    const settingsWithId = { ...initialData.settings, id: 'global_settings' };
    const { error: sErr } = await supabase.from('settings').upsert(settingsWithId);
    if (sErr) throw sErr;

    // 2. Categories
    if (initialData.categories.length > 0) {
      const { error: cErr } = await supabase.from('categories').upsert(initialData.categories);
      if (cErr) throw cErr;
    }

    // 3. SubCategories
    if (initialData.subCategories.length > 0) {
      const { error: scErr } = await supabase.from('subcategories').upsert(initialData.subCategories);
      if (scErr) throw scErr;
    }

    // 4. Slides
    if (initialData.slides.length > 0) {
      const { error: hErr } = await supabase.from('carousel_slides').upsert(initialData.slides);
      if (hErr) throw hErr;
    }

    // 5. Products
    if (initialData.products.length > 0) {
      const { error: pErr } = await supabase.from('products').upsert(initialData.products);
      if (pErr) throw pErr;
    }

    console.log("Seeding Complete.");
    return { success: true };
  } catch (err: any) {
    console.error("Seeding Failed:", err);
    return { success: false, error: err.message };
  }
};


// --- SQL SCHEMA FOR ADMIN SQL EDITOR ---

export const SUPABASE_SCHEMA = `
-- #####################################################
-- # MASTER CONFIGURATION SCRIPT
-- # Run this in Supabase SQL Editor to provision DB
-- # WARNING: THIS WILL WIPE ALL DATA AND RESET TABLES
-- #####################################################

-- 0. RESET / WIPE (Use with Caution)
DROP TABLE IF EXISTS traffic_logs CASCADE;
DROP TABLE IF EXISTS product_stats CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS carousel_slides CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- 2. CREATE TABLES

-- Settings Table
create table if not exists settings (
  id text primary key,
  "companyName" text, "slogan" text, "companyLogo" text, "companyLogoUrl" text,
  "primaryColor" text, "secondaryColor" text, "accentColor" text, "backgroundColor" text, "textColor" text,
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

-- Products Table
create table if not exists products (
  id text primary key,
  name text, sku text, price numeric, "affiliateLink" text,
  "categoryId" text, "subCategoryId" text, description text,
  features jsonb, specifications jsonb, media jsonb,
  "discountRules" jsonb, reviews jsonb, "createdAt" bigint, "createdBy" text
);

-- Categories Table
create table if not exists categories (
  id text primary key,
  name text, icon text, image text, description text
);

-- Subcategories Table
create table if not exists subcategories (
  id text primary key,
  "categoryId" text, name text
);

-- Carousel/Hero Table
create table if not exists carousel_slides (
  id text primary key,
  image text, type text, title text, subtitle text, cta text
);

-- Enquiries Table
create table if not exists enquiries (
  id text primary key,
  name text, email text, whatsapp text, subject text, message text, "createdAt" bigint, status text
);

-- Admin Users Table (Links to Supabase Auth)
create table if not exists admin_users (
  id text primary key,
  name text, email text, role text, permissions jsonb, password text, "createdAt" bigint, "lastActive" bigint, "profileImage" text, phone text, address text
);

-- Stats Table
create table if not exists product_stats (
  "productId" text primary key,
  views numeric, clicks numeric, "totalViewTime" numeric, "lastUpdated" bigint
);

-- Traffic Logs
create table if not exists traffic_logs (
  id text primary key,
  type text, text text, time text, timestamp bigint
);

-- 3. ENABLE RLS (Row Level Security)
alter table settings enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table carousel_slides enable row level security;
alter table enquiries enable row level security;
alter table admin_users enable row level security;
alter table product_stats enable row level security;
alter table traffic_logs enable row level security;

-- 4. CREATE POLICIES

create policy "Public Settings Read" on settings for select using (true);
create policy "Admin Settings Write" on settings for all using (auth.role() = 'authenticated');

create policy "Public Products Read" on products for select using (true);
create policy "Admin Products Write" on products for all using (auth.role() = 'authenticated');

create policy "Public Categories Read" on categories for select using (true);
create policy "Admin Categories Write" on categories for all using (auth.role() = 'authenticated');

create policy "Public Subcategories Read" on subcategories for select using (true);
create policy "Admin Subcategories Write" on subcategories for all using (auth.role() = 'authenticated');

create policy "Public Slides Read" on carousel_slides for select using (true);
create policy "Admin Slides Write" on carousel_slides for all using (auth.role() = 'authenticated');

create policy "Public Enquiries Insert" on enquiries for insert with check (true);
create policy "Admin Enquiries All" on enquiries for all using (auth.role() = 'authenticated');

create policy "Admin Users Access" on admin_users for all using (auth.role() = 'authenticated');

create policy "Public Stats Read" on product_stats for select using (true);
create policy "Public Stats Update" on product_stats for all using (true);

create policy "Public Logs Insert" on traffic_logs for insert with check (true);
create policy "Admin Logs Read" on traffic_logs for select using (auth.role() = 'authenticated');

-- 5. STORAGE BUCKETS
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'media' );

drop policy if exists "Admin Control" on storage.objects;
create policy "Admin Control" 
on storage.objects for all 
using ( auth.role() = 'authenticated' );
`;
