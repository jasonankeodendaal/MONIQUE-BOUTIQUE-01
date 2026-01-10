

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

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);

export const SUPABASE_SCHEMA = `
-- #####################################################
-- # MASTER CONFIGURATION SCRIPT
-- # Run this in Supabase SQL Editor to provision DB
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
  "discountRules" jsonb, reviews jsonb, "createdAt" bigint,
  "createdBy" uuid default auth.uid()
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
  id uuid references auth.users not null primary key,
  name text, email text, role text default 'admin', permissions jsonb, password text, "createdAt" bigint, "lastActive" bigint, "profileImage" text, phone text, address text
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

-- 3. POLICIES (Access Control)

-- Settings: Public Read, Auth Write
create policy "Settings Read" on settings for select using (true);
create policy "Settings Write" on settings for all using (auth.role() = 'authenticated');

-- Products: Public Read, Specific Write
create policy "Products Read" on products for select using (true);
-- Admin can only update own, Owner can update all
create policy "Products Insert" on products for insert with check (auth.role() = 'authenticated');
create policy "Products Update" on products for update using (
  auth.uid() = "createdBy" OR 
  exists (select 1 from admin_users where id = auth.uid() and role = 'owner')
);
create policy "Products Delete" on products for delete using (
  auth.uid() = "createdBy" OR 
  exists (select 1 from admin_users where id = auth.uid() and role = 'owner')
);

-- Other tables: Public Read (Storefront), Auth Write (Dashboard)
create policy "Public Read All" on categories for select using (true);
create policy "Auth Write All" on categories for all using (auth.role() = 'authenticated');

create policy "Public Read Subs" on subcategories for select using (true);
create policy "Auth Write Subs" on subcategories for all using (auth.role() = 'authenticated');

create policy "Public Read Slides" on carousel_slides for select using (true);
create policy "Auth Write Slides" on carousel_slides for all using (auth.role() = 'authenticated');

create policy "Admin Users Read" on admin_users for select using (auth.uid() = id OR exists (select 1 from admin_users where id = auth.uid() and role = 'owner'));
create policy "Admin Users Write" on admin_users for all using (auth.uid() = id OR exists (select 1 from admin_users where id = auth.uid() and role = 'owner'));

-- 4. STORAGE
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'media' and auth.role() = 'authenticated' );
create policy "Auth Update" on storage.objects for update using ( bucket_id = 'media' and auth.role() = 'authenticated' );
create policy "Auth Delete" on storage.objects for delete using ( bucket_id = 'media' and auth.role() = 'authenticated' );

-- 5. REALTIME
alter publication supabase_realtime add table settings, products, categories, subcategories, carousel_slides, enquiries, admin_users, product_stats, traffic_logs;
`;

export const subscribeToTable = (table: string, callback: (payload: any) => void) => {
  if (!isSupabaseConfigured) return null;
  return supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table: table }, callback)
    .subscribe();
};

export async function upsertData(table: string, data: any) {
  if (!isSupabaseConfigured) return { data: null, error: { message: 'Supabase not configured' } };
  try {
    const { data: result, error } = await supabase.from(table).upsert(data).select();
    if (error) throw error;
    return { data: result, error: null };
  } catch (e: any) {
      return { data: null, error: e };
  }
}

export async function deleteData(table: string, id: string) {
  if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured' } };
  try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return { error: null };
  } catch (e: any) {
      return { error: e };
  }
}

export async function fetchTableData(table: string): Promise<any[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) return null;
      return data || [];
  } catch (e) {
      return null;
  }
}

export async function updateProductStats(productId: string, type: 'view' | 'click', timeSpent = 0) {
  if (!isSupabaseConfigured) return;
  
  try {
    // Get current stats
    const { data: current } = await supabase.from('product_stats').select('*').eq('productId', productId).single();
    
    const now = Date.now();
    const newStats = {
      productId,
      views: (current?.views || 0) + (type === 'view' ? 1 : 0),
      clicks: (current?.clicks || 0) + (type === 'click' ? 1 : 0),
      totalViewTime: (current?.totalViewTime || 0) + timeSpent,
      lastUpdated: now
    };

    const { error } = await supabase.from('product_stats').upsert(newStats);
    if (error) console.error("Failed to update stats", error);
  } catch (err) {
    console.error("Error updating product stats:", err);
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
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { url: publicUrl.publicUrl, type: file.type, name: file.name, size: file.size };
  } catch (e) {
      return { url: fallbackUrl, type: file.type, name: file.name, size: file.size };
  }
}

export async function measureConnection(): Promise<{ status: 'online' | 'offline', latency: number, message: string }> {
  if (!isSupabaseConfigured) return { status: 'offline', latency: 0, message: 'Missing Cloud Environment' };
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('id').limit(1);
    const end = performance.now();
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Supabase Sync Active' };
  } catch (err: any) {
    return { status: 'offline', latency: 0, message: err.message || 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
