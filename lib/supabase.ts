
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
-- # MASTER CONFIGURATION SCRIPT (COMPLETE)
-- # Run this in Supabase SQL Editor to provision DB
-- #####################################################

-- 1. CLEANUP (Optional - removes old structure if exists)
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
  password text, -- optional legacy field
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

-- 3. HELPER FUNCTIONS (Prevent Recursion)
create or replace function public.get_my_role()
returns text as $$
  select role from public.admin_users where id = auth.uid();
$$ language sql security definer;

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

-- Settings
create policy "Settings Read" on settings for select using (true);
create policy "Settings Write" on settings for all using (auth.role() = 'authenticated');

-- Products
create policy "Products Read" on products for select using (true);
create policy "Products Write" on products for all using (auth.role() = 'authenticated');

-- Categories/Sub/Slides
create policy "Public Read Cats" on categories for select using (true);
create policy "Auth Write Cats" on categories for all using (auth.role() = 'authenticated');
create policy "Public Read Subs" on subcategories for select using (true);
create policy "Auth Write Subs" on subcategories for all using (auth.role() = 'authenticated');
create policy "Public Read Slides" on carousel_slides for select using (true);
create policy "Auth Write Slides" on carousel_slides for all using (auth.role() = 'authenticated');

-- Enquiries (Public write for contact form, Admin read)
create policy "Public Insert Enquiries" on enquiries for insert with check (true);
create policy "Admin Manage Enquiries" on enquiries for all using (auth.role() = 'authenticated');

-- Admin Users (CRITICAL POLICIES)
-- Allow users to read their own data
create policy "Read Self" on admin_users for select using (auth.uid() = id);
-- Allow users to update their own data
create policy "Update Self" on admin_users for update using (auth.uid() = id);
-- Allow authenticated users to INSERT their OWN profile if it doesn't exist (Self-Healing)
create policy "Insert Self" on admin_users for insert with check (auth.uid() = id);
-- Allow 'owner' role to manage everyone else (using Security Definer function to avoid recursion)
create policy "Owner Manage All" on admin_users for all using (
  public.get_my_role() = 'owner'
);

-- Stats/Logs
create policy "Stats Read" on product_stats for select using (true);
create policy "Stats Write" on product_stats for all using (true); -- Allow public to increment views
create policy "Logs Write" on traffic_logs for insert with check (true);
create policy "Logs Read" on traffic_logs for select using (auth.role() = 'authenticated');

-- 6. STORAGE
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'media' );
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'media' and auth.role() = 'authenticated' );
create policy "Auth Update" on storage.objects for update using ( bucket_id = 'media' and auth.role() = 'authenticated' );
create policy "Auth Delete" on storage.objects for delete using ( bucket_id = 'media' and auth.role() = 'authenticated' );

-- 7. REALTIME
alter publication supabase_realtime add table settings, products, categories, subcategories, carousel_slides, enquiries, admin_users, product_stats, traffic_logs;

-- 8. TRIGGERS (Auto-Create Public Profile for Admin)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Check if profile already exists to prevent error
  if not exists (select 1 from public.admin_users where id = new.id) then
      insert into public.admin_users (id, email, name, role, permissions, "createdAt")
      values (
        new.id, 
        new.email, 
        split_part(new.email, '@', 1),
        'admin', -- Default role
        '[]',
        extract(epoch from now()) * 1000
      );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to prevent duplication error on re-run
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
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
