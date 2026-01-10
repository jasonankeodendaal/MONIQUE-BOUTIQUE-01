
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
-- # MASTER CONFIGURATION SCRIPT (FIXED & FULLY LOADED)
-- # Run this in Supabase SQL Editor to provision DB
-- #####################################################

-- 1. CLEANUP (Optional - removes old structure if exists to ensure clean state)
-- Uncomment the next line if you want to wipe everything and start fresh
-- drop table if exists settings, products, categories, subcategories, carousel_slides, enquiries, admin_users, product_stats, traffic_logs cascade;

-- 2. CREATE TABLES

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
  id uuid references auth.users on delete cascade primary key,
  name text, 
  email text, 
  role text default 'admin', 
  permissions jsonb default '[]', 
  password text, -- legacy field, optional
  "createdAt" bigint, 
  "lastActive" bigint, 
  "profileImage" text, 
  phone text, 
  address text
);

create table if not exists product_stats (
  "productId" text primary key,
  views numeric default 0, clicks numeric default 0, "totalViewTime" numeric default 0, "lastUpdated" bigint
);

create table if not exists traffic_logs (
  id text primary key,
  type text, text text, time text, timestamp bigint
);

-- 3. SECURITY DEFINER FUNCTIONS (Prevents Recursion in Policies)

-- Helper to check if current user is owner without recursion
create or replace function public.is_owner()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'owner'
  );
end;
$$ language plpgsql security definer;

-- Helper to check if current user is admin/owner
create or replace function public.is_admin_or_owner()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- 4. ENABLE ROW LEVEL SECURITY

alter table settings enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table carousel_slides enable row level security;
alter table enquiries enable row level security;
alter table admin_users enable row level security;
alter table product_stats enable row level security;
alter table traffic_logs enable row level security;

-- 5. POLICIES (Access Control)

-- Settings (Public Read, Admin Write)
drop policy if exists "Settings Public Read" on settings;
create policy "Settings Public Read" on settings for select using (true);

drop policy if exists "Settings Admin Write" on settings;
create policy "Settings Admin Write" on settings for all using (auth.role() = 'authenticated');

-- Products (Public Read, Admin Write)
drop policy if exists "Products Public Read" on products;
create policy "Products Public Read" on products for select using (true);

drop policy if exists "Products Admin Write" on products;
create policy "Products Admin Write" on products for all using (auth.role() = 'authenticated');

-- Categories/Sub/Slides (Public Read, Admin Write)
drop policy if exists "Categories Public Read" on categories;
create policy "Categories Public Read" on categories for select using (true);

drop policy if exists "Categories Admin Write" on categories;
create policy "Categories Admin Write" on categories for all using (auth.role() = 'authenticated');

drop policy if exists "Subcategories Public Read" on subcategories;
create policy "Subcategories Public Read" on subcategories for select using (true);

drop policy if exists "Subcategories Admin Write" on subcategories;
create policy "Subcategories Admin Write" on subcategories for all using (auth.role() = 'authenticated');

drop policy if exists "Slides Public Read" on carousel_slides;
create policy "Slides Public Read" on carousel_slides for select using (true);

drop policy if exists "Slides Admin Write" on carousel_slides;
create policy "Slides Admin Write" on carousel_slides for all using (auth.role() = 'authenticated');

-- Enquiries (Public Insert, Admin Manage)
drop policy if exists "Enquiries Public Insert" on enquiries;
create policy "Enquiries Public Insert" on enquiries for insert with check (true);

drop policy if exists "Enquiries Admin Manage" on enquiries;
create policy "Enquiries Admin Manage" on enquiries for all using (auth.role() = 'authenticated');

-- Admin Users (CRITICAL - FIXED RECURSION)
drop policy if exists "Read Self" on admin_users;
create policy "Read Self" on admin_users for select using (auth.uid() = id);

drop policy if exists "Update Self" on admin_users;
create policy "Update Self" on admin_users for update using (auth.uid() = id);

drop policy if exists "Insert Self" on admin_users;
create policy "Insert Self" on admin_users for insert with check (auth.uid() = id);

drop policy if exists "Owner Manage All" on admin_users;
create policy "Owner Manage All" on admin_users for all using ( public.is_owner() );

-- Stats/Logs
drop policy if exists "Stats Read" on product_stats;
create policy "Stats Read" on product_stats for select using (true);

drop policy if exists "Stats Public Update" on product_stats;
create policy "Stats Public Update" on product_stats for all using (true);

drop policy if exists "Logs Public Insert" on traffic_logs;
create policy "Logs Public Insert" on traffic_logs for insert with check (true);

drop policy if exists "Logs Admin Read" on traffic_logs;
create policy "Logs Admin Read" on traffic_logs for select using (auth.role() = 'authenticated');

-- 6. STORAGE
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );

drop policy if exists "Auth Upload" on storage.objects;
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'media' and auth.role() = 'authenticated' );

drop policy if exists "Auth Update" on storage.objects;
create policy "Auth Update" on storage.objects for update using ( bucket_id = 'media' and auth.role() = 'authenticated' );

drop policy if exists "Auth Delete" on storage.objects;
create policy "Auth Delete" on storage.objects for delete using ( bucket_id = 'media' and auth.role() = 'authenticated' );

-- 7. REALTIME
alter publication supabase_realtime add table settings, products, categories, subcategories, carousel_slides, enquiries, admin_users, product_stats, traffic_logs;

-- 8. TRIGGERS (Auto-Create Public Profile for Admin)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.admin_users (id, email, name, role, permissions, "createdAt")
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'owner', -- First users default to owner for safety in this template
    '["*"]'::jsonb,
    extract(epoch from now()) * 1000
  )
  on conflict (id) do nothing; -- Prevents 409 errors
  return new;
end;
$$ language plpgsql security definer;

-- Re-create trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 9. SEED DATA (Bootstrap the application)
-- Only inserts if table is empty

INSERT INTO settings (id, "companyName", "primaryColor", "secondaryColor", "accentColor", "backgroundColor", "textColor", "navHomeLabel", "navProductsLabel", "navAboutLabel", "navContactLabel", "navDashboardLabel", "contactEmail", "contactPhone", "whatsappNumber", "address", "footerDescription", "footerCopyrightText", "homeHeroBadge", "homeAboutTitle", "homeAboutDescription", "homeAboutCta", "homeCategorySectionTitle", "homeTrustSectionTitle", "productsHeroTitle", "productsHeroSubtitle", "aboutHeroTitle", "aboutHeroSubtitle", "contactHeroTitle", "contactHeroSubtitle", "disclosureTitle", "privacyTitle", "termsTitle", "productsSearchPlaceholder", "contactFormButtonText", "contactFormNameLabel", "contactFormEmailLabel", "contactFormSubjectLabel", "contactFormMessageLabel")
VALUES (
  'global_settings',
  'Kasi Couture', '#D4AF37', '#1E293B', '#F59E0B', '#FDFCFB', '#0f172a',
  'Home', 'My Picks', 'My Story', 'Ask Me', 'Portal',
  'hello@kasicouture.com', '+27 11 900 2000', '+27119002000', 'Melrose Arch, Johannesburg',
  'This isn''t just a store. It''s a collection of the things I love.', 'All rights reserved.',
  'Curated by Kasi', 'Hi, I’m the Curator.', 'For years, I struggled to find fashion that balanced authentic African heritage with modern luxury. This website is the result of that journey.', 'Read My Full Story',
  'Curated Categories', 'Why I Chose These',
  'The Edit', 'A hand-picked selection of essentials that define the Kasi Couture aesthetic.',
  'From Passion to Platform.', 'Kasi Couture is my personal curation platform.',
  'Let''s Connect.', 'Have a question about a specific piece or just want to say hi?',
  'Affiliate Disclosure', 'Privacy Policy', 'Terms of Service',
  'Find something special...', 'Send Message', 'Your Name', 'Your Email', 'Subject', 'Message'
)
ON CONFLICT (id) DO NOTHING;
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
    const { data: current } = await supabase.from('product_stats').select('*').eq('productId', productId).single();
    const now = Date.now();
    const newStats = {
      productId,
      views: (current?.views || 0) + (type === 'view' ? 1 : 0),
      clicks: (current?.clicks || 0) + (type === 'click' ? 1 : 0),
      totalViewTime: (current?.totalViewTime || 0) + timeSpent,
      lastUpdated: now
    };
    await supabase.from('product_stats').upsert(newStats);
  } catch (err) {
    console.error("Error updating stats", err);
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
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
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
    // Lightweight check
    const { error } = await supabase.from('settings').select('id').limit(1);
    const end = performance.now();
    if (error) throw error;
    return { status: 'online', latency: Math.round(end - start), message: 'Supabase Sync Active' };
  } catch (err: any) {
    return { status: 'offline', latency: 0, message: err.message || 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;
