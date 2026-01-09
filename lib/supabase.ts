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

export const SUPABASE_SCHEMA = `
-- #####################################################
-- # KASI COUTURE DATABASE SETUP SCRIPT
-- # PASTE THIS INTO SUPABASE SQL EDITOR
-- # DO NOT PASTE HTML (<!DOCTYPE...>) HERE
-- #####################################################

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

-- 2. Setup Storage Buckets (Safe to Re-run)
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

-- 3. Setup Storage Policies (Safe to Re-run via Drop)
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
      const local = localStorage.getItem(localKey);
      return local ? JSON.parse(local) : [];
    }
    
    console.warn(`Fetch warning for ${table}:`, error.message);
    // Try local fallback on other errors too, just in case
    const local = localStorage.getItem(localKey);
    return local ? JSON.parse(local) : [];
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