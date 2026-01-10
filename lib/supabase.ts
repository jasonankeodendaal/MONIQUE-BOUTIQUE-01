
import { createClient } from '@supabase/supabase-js';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ADMINS, INITIAL_ENQUIRIES } from '../constants';

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
-- # MASTER RESET SCRIPT - RUN THIS IN SUPABASE SQL EDITOR
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

-- 2. RESET RLS & POLICIES
alter table settings enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table carousel_slides enable row level security;
alter table enquiries enable row level security;
alter table admin_users enable row level security;
alter table product_stats enable row level security;
alter table traffic_logs enable row level security;

-- 3. PERMISSIVE POLICIES
drop policy if exists "Public access" on settings;
create policy "Public access" on settings for all using (true) with check (true);

drop policy if exists "Public access" on products;
create policy "Public access" on products for all using (true) with check (true);

drop policy if exists "Public access" on categories;
create policy "Public access" on categories for all using (true) with check (true);

drop policy if exists "Public access" on subcategories;
create policy "Public access" on subcategories for all using (true) with check (true);

drop policy if exists "Public access" on carousel_slides;
create policy "Public access" on carousel_slides for all using (true) with check (true);

drop policy if exists "Public access" on enquiries;
create policy "Public access" on enquiries for all using (true) with check (true);

drop policy if exists "Public access" on admin_users;
create policy "Public access" on admin_users for all using (true) with check (true);

drop policy if exists "Public access" on product_stats;
create policy "Public access" on product_stats for all using (true) with check (true);

drop policy if exists "Public access" on traffic_logs;
create policy "Public access" on traffic_logs for all using (true) with check (true);

-- 4. GRANT ACCESS
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;

-- 5. STORAGE BUCKET
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );

drop policy if exists "Public Upload" on storage.objects;
create policy "Public Upload" on storage.objects for insert with check ( bucket_id = 'media' );

drop policy if exists "Public Update" on storage.objects;
create policy "Public Update" on storage.objects for update using ( bucket_id = 'media' );

drop policy if exists "Public Delete" on storage.objects;
create policy "Public Delete" on storage.objects for delete using ( bucket_id = 'media' );

-- 6. ENABLE REALTIME
alter publication supabase_realtime add table settings;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table subcategories;
alter publication supabase_realtime add table carousel_slides;
alter publication supabase_realtime add table enquiries;
alter publication supabase_realtime add table admin_users;
alter publication supabase_realtime add table product_stats;
alter publication supabase_realtime add table traffic_logs;
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
