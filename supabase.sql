-- Master SQL Script for Site Settings Upgrade
-- Run this in your Supabase SQL Editor (Pilot Tab)

-- Add SEO columns to the settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS "seoTitle" TEXT,
ADD COLUMN IF NOT EXISTS "seoDescription" TEXT,
ADD COLUMN IF NOT EXISTS "seoOgImage" TEXT,
ADD COLUMN IF NOT EXISTS "enableSchemaMarkup" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "schemaType" TEXT,
ADD COLUMN IF NOT EXISTS "customSchemaJson" TEXT,
ADD COLUMN IF NOT EXISTS "localBusinessName" TEXT,
ADD COLUMN IF NOT EXISTS "localBusinessAddress" TEXT,
ADD COLUMN IF NOT EXISTS "localBusinessPhone" TEXT,
ADD COLUMN IF NOT EXISTS "localBusinessOpeningHours" TEXT,
ADD COLUMN IF NOT EXISTS "localBusinessCountry" TEXT,
ADD COLUMN IF NOT EXISTS "localBusinessLat" NUMERIC,
ADD COLUMN IF NOT EXISTS "localBusinessLng" NUMERIC,
ADD COLUMN IF NOT EXISTS "localBusinessWebsite" TEXT,
ADD COLUMN IF NOT EXISTS "localBusinessCategory" TEXT,
ADD COLUMN IF NOT EXISTS "robotsGeneratedAt" BIGINT,
ADD COLUMN IF NOT EXISTS "sitemapGeneratedAt" BIGINT,
ADD COLUMN IF NOT EXISTS "robotsStatus" TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "sitemapStatus" TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "seoAutoCleanUrls" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "seoEnableLazyLoading" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "seoRequireAltText" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "seoAutoRelatedProducts" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "seoForceHttps" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "seoEnableCanonicalTags" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "seoShowLastUpdated" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT,
ADD COLUMN IF NOT EXISTS "googleTagManagerId" TEXT,
ADD COLUMN IF NOT EXISTS "facebookPixelId" TEXT,
ADD COLUMN IF NOT EXISTS "tiktokPixelId" TEXT,
ADD COLUMN IF NOT EXISTS "pinterestTagId" TEXT,
ADD COLUMN IF NOT EXISTS "amazonAssociateId" TEXT,
ADD COLUMN IF NOT EXISTS "webhookUrl" TEXT,
ADD COLUMN IF NOT EXISTS "gscVerificationId" TEXT,
ADD COLUMN IF NOT EXISTS "customHeaderScripts" TEXT,
ADD COLUMN IF NOT EXISTS "customFooterScripts" TEXT,
ADD COLUMN IF NOT EXISTS "emailJsServiceId" TEXT,
ADD COLUMN IF NOT EXISTS "emailJsTemplateId" TEXT,
ADD COLUMN IF NOT EXISTS "emailJsPublicKey" TEXT;

-- Ensure the 'global' row exists
INSERT INTO settings (id) 
VALUES ('global') 
ON CONFLICT (id) DO NOTHING;

-- Populate SEO Defaults
UPDATE settings SET
  "seoTitle" = COALESCE("seoTitle", 'Findara'),
  "seoDescription" = COALESCE("seoDescription", 'Findara is my personal curation platform, dedicated to discovering and showcasing the most Fashion, Tech and Home accessories from across the continent.'),
  "seoOgImage" = COALESCE("seoOgImage", 'https://i.ibb.co/FkCdTns2/bb5w9xpud5l.png'),
  "googleAnalyticsId" = COALESCE("googleAnalyticsId", 'G-PP15D984GN'),
  "gscVerificationId" = COALESCE("gscVerificationId", 'sTIigqcooUP2WH9dBXRln_odKfNTrOveiyo4mSjXn0A'),
  "seoAutoCleanUrls" = COALESCE("seoAutoCleanUrls", true),
  "seoEnableLazyLoading" = COALESCE("seoEnableLazyLoading", true),
  "seoRequireAltText" = COALESCE("seoRequireAltText", true),
  "seoAutoRelatedProducts" = COALESCE("seoAutoRelatedProducts", true),
  "seoForceHttps" = COALESCE("seoForceHttps", true),
  "seoEnableCanonicalTags" = COALESCE("seoEnableCanonicalTags", true),
  "seoShowLastUpdated" = COALESCE("seoShowLastUpdated", true),
  "enableSchemaMarkup" = COALESCE("enableSchemaMarkup", false),
  "localBusinessName" = COALESCE("localBusinessName", 'Findara Luxury'),
  "localBusinessCategory" = COALESCE("localBusinessCategory", 'Retail Store'),
  "localBusinessAddress" = COALESCE("localBusinessAddress", '123 Fashion Ave, New York, NY 10001'),
  "localBusinessCountry" = COALESCE("localBusinessCountry", 'United States'),
  "localBusinessWebsite" = COALESCE("localBusinessWebsite", 'https://findara.com'),
  "localBusinessPhone" = COALESCE("localBusinessPhone", '+1 234 567 8900'),
  "localBusinessOpeningHours" = COALESCE("localBusinessOpeningHours", 'Mo-Fr 09:00-18:00'),
  "localBusinessLat" = COALESCE("localBusinessLat", 40.7128),
  "localBusinessLng" = COALESCE("localBusinessLng", -74.0060)
WHERE id = 'global';

-- Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    "productId" TEXT,
    "createdAt" BIGINT
);
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wishlist" ON wishlist FOR ALL USING (auth.uid()::text = "userId");
CREATE POLICY "Public read wishlist" ON wishlist FOR SELECT USING (true);

-- Site Reviews Table
CREATE TABLE IF NOT EXISTS site_reviews (
    id TEXT PRIMARY KEY,
    "userName" TEXT,
    rating NUMERIC,
    comment TEXT,
    "createdAt" BIGINT,
    status TEXT DEFAULT 'pending'
);
ALTER TABLE site_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert site_reviews" ON site_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read approved site_reviews" ON site_reviews FOR SELECT USING (true);
CREATE POLICY "Admin all site_reviews" ON site_reviews FOR ALL USING (true);
