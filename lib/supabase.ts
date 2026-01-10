
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

export async function uploadMedia(file: File, bucket = 'media') {
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
  if (!isSupabaseConfigured) return { status: 'offline', latency: 0, message: 'Supabase Not Configured' };
  const start = performance.now();
  try {
    const { error } = await supabase.from('settings').select('id').limit(1);
    if (error) throw error;
    return { status: 'online', latency: Math.round(performance.now() - start), message: 'Supabase Sync Active' };
  } catch (err: any) {
    return { status: 'offline', latency: 0, message: err.message || 'Connection Failed' };
  }
}

export const getSupabaseUrl = () => supabaseUrl;

export const LOCAL_STORAGE_KEYS: Record<string, string> = {
  'products': 'admin_products',
  'categories': 'admin_categories',
  'subcategories': 'admin_subcategories',
  'carousel_slides': 'admin_hero',
  'enquiries': 'admin_enquiries',
  'settings': 'site_settings'
};

export const SUPABASE_SCHEMA = `
-- PASTE INTO SUPABASE SQL EDITOR
CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY, "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT, "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT, "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navContactLabel" TEXT, "navDashboardLabel" TEXT, "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT, "socialLinks" JSONB, "footerDescription" TEXT, "footerCopyrightText" TEXT, "homeHeroBadge" TEXT, "homeAboutTitle" TEXT, "homeAboutDescription" TEXT, "homeAboutImage" TEXT, "homeAboutCta" TEXT, "homeCategorySectionTitle" TEXT, "homeCategorySectionSubtitle" TEXT, "homeTrustSectionTitle" TEXT, "homeTrustItem1Title" TEXT, "homeTrustItem1Desc" TEXT, "homeTrustItem1Icon" TEXT, "homeTrustItem2Title" TEXT, "homeTrustItem2Desc" TEXT, "homeTrustItem2Icon" TEXT, "homeTrustItem3Title" TEXT, "homeTrustItem3Desc" TEXT, "homeTrustItem3Icon" TEXT, "productsHeroTitle" TEXT, "productsHeroSubtitle" TEXT, "productsHeroImage" TEXT, "productsHeroImages" JSONB, "productsSearchPlaceholder" TEXT, "aboutHeroTitle" TEXT, "aboutHeroSubtitle" TEXT, "aboutMainImage" TEXT, "aboutEstablishedYear" TEXT, "aboutFounderName" TEXT, "aboutLocation" TEXT, "aboutHistoryTitle" TEXT, "aboutHistoryBody" TEXT, "aboutMissionTitle" TEXT, "aboutMissionBody" TEXT, "aboutMissionIcon" TEXT, "aboutCommunityTitle" TEXT, "aboutCommunityBody" TEXT, "aboutCommunityIcon" TEXT, "aboutIntegrityTitle" TEXT, "aboutIntegrityBody" TEXT, "aboutIntegrityIcon" TEXT, "aboutSignatureImage" TEXT, "aboutGalleryImages" JSONB, "contactHeroTitle" TEXT, "contactHeroSubtitle" TEXT, "contactFormNameLabel" TEXT, "contactFormEmailLabel" TEXT, "contactFormSubjectLabel" TEXT, "contactFormMessageLabel" TEXT, "contactFormButtonText" TEXT, "contactInfoTitle" TEXT, "contactAddressLabel" TEXT, "contactHoursLabel" TEXT, "contactHoursWeekdays" TEXT, "contactHoursWeekends" TEXT, "disclosureTitle" TEXT, "disclosureContent" TEXT, "privacyTitle" TEXT, "privacyContent" TEXT, "termsTitle" TEXT, "termsContent" TEXT, "emailJsServiceId" TEXT, "emailJsTemplateId" TEXT, "emailJsPublicKey" TEXT, "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "webhookUrl" TEXT);
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT, "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features JSONB, specifications JSONB, media JSONB, "discountRules" JSONB, reviews JSONB, "createdAt" BIGINT);
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, icon TEXT, image TEXT, description TEXT);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY, "categoryId" TEXT, name TEXT);
CREATE TABLE IF NOT EXISTS carousel_slides (id TEXT PRIMARY KEY, image TEXT, type TEXT, title TEXT, subtitle TEXT, cta TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT, email TEXT, whatsapp TEXT, subject TEXT, message TEXT, "createdAt" BIGINT, status TEXT);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, permissions JSONB, password TEXT, "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON settings FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON enquiries FOR INSERT WITH CHECK (true);
-- ADD ADMIN POLICIES AS NEEDED
`;
