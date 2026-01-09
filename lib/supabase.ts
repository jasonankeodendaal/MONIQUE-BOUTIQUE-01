

import { createClient } from '@supabase/supabase-js';

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

// --- MASTER SETUP SCRIPT ---
// This script is designed to be run in the Supabase SQL Editor.
// It will:
// 1. Wipe the public schema (Clean Slate).
// 2. Create all tables.
// 3. Setup Storage buckets.
// 4. Setup RLS Policies.
// 5. SEED INITIAL DATA (Settings, Categories, Products).

export const SUPABASE_SCHEMA = `
-- ⚠️ WARNING: THIS SCRIPT WIPES THE DATABASE 'PUBLIC' SCHEMA
-- EXECUTE ONLY IF YOU WANT A FRESH START

-- 1. CLEAN SLATE
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 2. CREATE TABLES

-- Settings Table
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

-- Products Table
create table if not exists products (
  id text primary key,
  name text, sku text, price numeric, "affiliateLink" text,
  "categoryId" text, "subCategoryId" text, description text,
  features jsonb, specifications jsonb, media jsonb,
  "discountRules" jsonb, reviews jsonb, "createdAt" bigint
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

-- Carousel Slides Table
create table if not exists carousel_slides (
  id text primary key,
  image text, type text, title text, subtitle text, cta text
);

-- Enquiries Table
create table if not exists enquiries (
  id text primary key,
  name text, email text, whatsapp text, subject text, message text, "createdAt" bigint, status text
);

-- Admin Users Table
create table if not exists admin_users (
  id text primary key,
  name text, email text, role text, permissions jsonb, password text, "createdAt" bigint, "lastActive" bigint, "profileImage" text, phone text, address text
);

-- Stats Table
create table if not exists product_stats (
  "productId" text primary key,
  views numeric, clicks numeric, "totalViewTime" numeric, "lastUpdated" bigint
);

-- Traffic Logs Table
create table if not exists traffic_logs (
  id text primary key,
  type text, text text, time text, timestamp bigint
);

-- 3. SETUP STORAGE
-- Note: 'storage' schema usually exists by default in Supabase.
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- 4. ENABLE RLS & POLICIES
alter table settings enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table carousel_slides enable row level security;
alter table product_stats enable row level security;
alter table admin_users enable row level security;
alter table enquiries enable row level security;
alter table traffic_logs enable row level security;

-- Public Read Policies
create policy "Public Read Settings" on settings for select using (true);
create policy "Public Read Products" on products for select using (true);
create policy "Public Read Categories" on categories for select using (true);
create policy "Public Read Subcategories" on subcategories for select using (true);
create policy "Public Read Slides" on carousel_slides for select using (true);

-- Storage Policies
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );
drop policy if exists "Admin Control" on storage.objects;
create policy "Admin Control" on storage.objects for all using ( auth.role() = 'authenticated' );

-- Admin Write Policies (Authenticated users only)
create policy "Admin Write Settings" on settings for all using (auth.role() = 'authenticated');
create policy "Admin Write Products" on products for all using (auth.role() = 'authenticated');
create policy "Admin Write Categories" on categories for all using (auth.role() = 'authenticated');
create policy "Admin Write Subcategories" on subcategories for all using (auth.role() = 'authenticated');
create policy "Admin Write Slides" on carousel_slides for all using (auth.role() = 'authenticated');
create policy "Admin Write Enquiries" on enquiries for all using (auth.role() = 'authenticated');
create policy "Admin Write Stats" on product_stats for all using (auth.role() = 'authenticated');
create policy "Admin Write Users" on admin_users for all using (auth.role() = 'authenticated');
create policy "Admin Write Logs" on traffic_logs for all using (auth.role() = 'authenticated');
-- Allow public to INSERT enquiries (Contact form) and Traffic logs
create policy "Public Insert Enquiries" on enquiries for insert with check (true);
create policy "Public Insert Logs" on traffic_logs for insert with check (true);


-- 5. SEED INITIAL DATA (POPULATE)

-- Seed Settings
INSERT INTO settings (
  id, "companyName", "slogan", "companyLogo", "primaryColor", "secondaryColor", "accentColor",
  "navHomeLabel", "navProductsLabel", "navAboutLabel", "navContactLabel", "navDashboardLabel",
  "contactEmail", "contactPhone", "whatsappNumber", "address",
  "homeHeroBadge", "homeAboutTitle", "homeAboutDescription", "homeAboutImage", "homeAboutCta",
  "homeCategorySectionTitle", "homeCategorySectionSubtitle", 
  "productsHeroTitle", "productsHeroSubtitle", "productsHeroImage",
  "aboutHeroTitle", "aboutHeroSubtitle", "aboutMainImage",
  "aboutHistoryTitle", "aboutHistoryBody",
  "contactHeroTitle", "contactHeroSubtitle", "contactFormButtonText",
  "footerDescription", "footerCopyrightText"
) VALUES (
  'global_settings', 
  'Kasi Couture', 'Personal Luxury Wardrobe', 'KC', '#D4AF37', '#1E293B', '#F59E0B',
  'Home', 'My Picks', 'My Story', 'Ask Me', 'Portal',
  'hello@kasicouture.com', '+27 11 900 2000', '+27119002000', 'Melrose Arch, Johannesburg',
  'Curated by Kasi', 'Why I Started This Journey', 
  'I was tired of fast fashion and generic trends. I wanted pieces that told a story, that felt like they were made for me. So I started this platform to bridge the gap between discerning individuals and the world''s finest creators.',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200', 'Read My Full Story',
  'My Curated Collections', 'The Collection',
  'The Edit', 'A hand-picked selection of essentials that define the Kasi Couture aesthetic.', 
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  'From Passion to Platform.', 'Kasi Couture is my personal curation platform, dedicated to finding the most exquisite garments and accessories across the continent.',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  'My Journey', 'It started with a simple frustration: finding high-quality, authentic luxury pieces was overwhelming. I decided to become the filter.',
  'Let''s Connect.', 'Have a question about a specific piece or just want to say hi? I read every message.', 'Send Message',
  'This isn''t just a store. It''s a collection of the things I love.', 'All rights reserved.'
) ON CONFLICT (id) DO NOTHING;

-- Seed Categories
INSERT INTO categories (id, name, icon, image, description) VALUES
('cat1', 'Apparel', 'Shirt', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', 'Luxury ready-to-wear.'),
('cat2', 'Accessories', 'Watch', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800', 'The finishing touch.'),
('cat3', 'Footwear', 'Footprints', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', 'Walk in confidence.'),
('cat4', 'Home Living', 'Home', 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800', 'Couture for your space.')
ON CONFLICT (id) DO NOTHING;

-- Seed Subcategories
INSERT INTO subcategories (id, "categoryId", name) VALUES
('sub1', 'cat1', 'Silk Dresses'),
('sub2', 'cat1', 'Tailored Blazers'),
('sub3', 'cat2', 'Leather Bags'),
('sub4', 'cat3', 'Stilettos')
ON CONFLICT (id) DO NOTHING;

-- Seed Products
INSERT INTO products (
  id, name, sku, price, "affiliateLink", "categoryId", "subCategoryId", description, features, media, "createdAt"
) VALUES (
  'p1', 
  'Midnight Silk Wrap', 
  'KC-APP-001', 
  3450, 
  'https://example.com/midnight-silk', 
  'cat1', 
  'sub1', 
  'A luxurious 100% silk wrap dress that transitions perfectly from brunch to ballroom. The Midnight Silk Wrap features a flattering crossover neckline, adjustable waist tie, and a flowing skirt.', 
  '["100% Premium Mulberry Silk", "Hand-finished seams", "Adjustable wrap closure"]'::jsonb, 
  '[{"id": "m1", "url": "https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=800", "name": "Silk Dress", "type": "image/jpeg", "size": 0}]'::jsonb, 
  1709251200000
) ON CONFLICT (id) DO NOTHING;

-- Seed Carousel
INSERT INTO carousel_slides (id, image, type, title, subtitle, cta) VALUES
('1', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000', 'image', 'The Curator''s Edit', 'A personal selection of this season''s most compelling pieces.', 'View My Picks'),
('2', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000', 'image', 'Modern Heritage', 'Bridging the gap between traditional craft and contemporary style.', 'Read the Story')
ON CONFLICT (id) DO NOTHING;

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
 * Generic Upsert Function
 */
export async function upsertData(table: string, data: any) {
  if (!isSupabaseConfigured) return null;
  const { data: result, error } = await supabase.from(table).upsert(data).select();
  if (error) {
    // Graceful handling for missing tables to prevent app crash loop
    if (error.code === '42P01' || error.message?.includes('404')) {
      console.warn(`Supabase table '${table}' not found. Skipping cloud sync.`);
      return null;
    }
    console.error(`Error upserting to ${table}:`, error);
    throw error;
  }
  return result;
}

/**
 * Generic Delete Function
 */
export async function deleteData(table: string, id: string) {
  if (!isSupabaseConfigured) return null;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    if (error.code === '42P01' || error.message?.includes('404')) return null;
    console.error(`Error deleting from ${table}:`, error);
    throw error;
  }
}

/**
 * Sync Local to Cloud - Used for first-time setup migration
 */
export async function syncLocalToCloud(tableName: string, localKey: string) {
  if (!isSupabaseConfigured) return;
  
  const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
  if (localData.length === 0) return;

  console.log(`Migrating ${localData.length} items from ${localKey} to ${tableName}...`);
  
  // Batch upsert
  const { error } = await supabase.from(tableName).upsert(localData);
  
  if (error) {
    if (error.code === '42P01' || error.message?.includes('404')) {
        console.warn(`Cannot migrate ${tableName}: Table does not exist.`);
        return;
    }
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
  
  const { data, error } = await supabase.from(table).select('*');
  
  if (error) {
    // If table is missing (42P01) or REST endpoint not found (404), fallback to local without error spam
    if (error.code === '42P01' || error.message?.includes('404') || error.message?.includes('Failed to load resource')) {
      console.warn(`Table '${table}' missing or not accessible. Using local fallback.`);
    } else {
      console.warn(`Fetch warning for ${table}:`, error.message);
    }
    
    // Fallback logic
    try {
      const local = localStorage.getItem(localKey);
      return local ? JSON.parse(local) : [];
    } catch (e) {
      console.error("Local storage parse error", e);
      return [];
    }
  }
  return data;
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
    
    // If table doesn't exist, we still have a connection, just no schema
    if (error && (error.code === '42P01' || error.message.includes('404'))) { 
        return { status: 'online', latency: Math.round(end - start), message: 'Connected (Schema Missing)' };
    }
    
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Supabase Sync Active' };
  } catch (err: any) {
    return { status: 'offline', latency: 0, message: err.message || 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;