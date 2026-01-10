
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
-- # KASI COUTURE MASTER RESET SCRIPT
-- #####################################################

-- Drop everything for a fresh start
drop table if exists traffic_logs;
drop table if exists product_stats;
drop table if exists admin_users;
drop table if exists enquiries;
drop table if exists carousel_slides;
drop table if exists subcategories;
drop table if exists categories;
drop table if exists products;
drop table if exists settings;

-- 1. Create Tables
create table settings (
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

create table products (
  id text primary key,
  name text, sku text, price numeric, "affiliateLink" text,
  "categoryId" text, "subCategoryId" text, description text,
  features jsonb, specifications jsonb, media jsonb,
  "discountRules" jsonb, reviews jsonb, "createdAt" bigint
);

create table categories (
  id text primary key,
  name text, icon text, image text, description text
);

create table subcategories (
  id text primary key,
  "categoryId" text, name text
);

create table carousel_slides (
  id text primary key,
  image text, type text, title text, subtitle text, cta text
);

create table enquiries (
  id text primary key,
  name text, email text, whatsapp text, subject text, message text, "createdAt" bigint, status text
);

create table traffic_logs (
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
alter table traffic_logs enable row level security;

-- 3. CREATE POLICIES
-- Allow everything to service_role or authenticated users for this bridge page implementation
create policy "Public Access Read" on settings for select using (true);
create policy "Admin Write Settings" on settings for all using (true) with check (true);

create policy "Public Access Products" on products for select using (true);
create policy "Admin Write Products" on products for all using (true) with check (true);

create policy "Public Access Categories" on categories for select using (true);
create policy "Admin Write Categories" on categories for all using (true) with check (true);

create policy "Public Access Subcategories" on subcategories for select using (true);
create policy "Admin Write Subcategories" on subcategories for all using (true) with check (true);

create policy "Public Access Slides" on carousel_slides for select using (true);
create policy "Admin Write Slides" on carousel_slides for all using (true) with check (true);

create policy "Public Access Enquiries" on enquiries for insert with check (true);
create policy "Admin Write Enquiries" on enquiries for all using (true) with check (true);

create policy "Public Access Logs" on traffic_logs for insert with check (true);
create policy "Admin Write Logs" on traffic_logs for all using (true) with check (true);

-- 4. Storage setup
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
create policy "Public Storage Select" on storage.objects for select using (bucket_id = 'media');
create policy "Public Storage Insert" on storage.objects for insert with check (bucket_id = 'media');
create policy "Public Storage Update" on storage.objects for update using (bucket_id = 'media');
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
  const { data: result, error } = await supabase.from(table).upsert(data).select();
  return { data: result, error };
}

export async function deleteData(table: string, id: string) {
  if (!isSupabaseConfigured) return { error: { message: 'Supabase not configured' } };
  const { error } = await supabase.from(table).delete().eq('id', id);
  return { error };
}

export async function fetchTableData(table: string): Promise<any[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.from(table).select('*');
  if (error) return null;
  return data;
}

export async function uploadMedia(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage.from('media').upload(fileName, file);
  if (error) throw error;
  const { data: publicUrl } = supabase.storage.from('media').getPublicUrl(fileName);
  return { url: publicUrl.publicUrl, type: file.type, name: file.name, size: file.size };
}

export async function measureConnection() {
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('id').limit(1);
    if (error) throw error;
    return { status: 'online', latency: Math.round(performance.now() - start), message: 'Supabase Sync Active' };
  } catch (err: any) {
    return { status: 'offline', latency: 0, message: err.message || 'Connection Failed' };
  }
}
