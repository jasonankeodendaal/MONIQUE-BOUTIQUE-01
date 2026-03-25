
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule } from './types';

// EMAIL_TEMPLATE_HTML used for the reply system in Admin.tsx
export const EMAIL_TEMPLATE_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Message from {{company_name}}</title>
<style>
    /* RESET & BASICS */
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FDFCFB; color: #1E293B; -webkit-font-smoothing: antialiased; line-height: 1.6; }
    table { border-spacing: 0; width: 100%; }
    td { padding: 0; }
    img { border: 0; }
    
    /* WRAPPER */
    .wrapper { width: 100%; table-layout: fixed; background-color: #FDFCFB; padding-bottom: 60px; }
    .webkit { max-width: 600px; background-color: #FFFFFF; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.1); border: 1px solid #f1f5f9; }
    .outer { margin: 0 auto; width: 100%; max-width: 600px; }
    
    /* HEADER */
    .header { background-color: #1E293B; padding: 40px 20px; text-align: center; }
    .brand-title { color: #FFFFFF; font-family: 'Playfair Display', Times, serif; font-size: 28px; letter-spacing: 2px; text-transform: uppercase; margin: 0; font-weight: 400; }
    .brand-subtitle { color: #E5C1CD; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px; font-weight: 700; display: block; }
    
    /* CONTENT */
    .content { padding: 40px; background-color: #FFFFFF; }
    .greeting { font-size: 20px; font-weight: 600; color: #1E293B; margin-bottom: 20px; font-family: 'Playfair Display', serif; }
    .message-body { font-size: 15px; color: #475569; line-height: 1.8; white-space: pre-wrap; margin-bottom: 30px; }
    
    /* BUTTON */
    .btn-container { text-align: center; margin: 35px 0; }
    .btn { display: inline-block; background-color: #E5C1CD; color: #FFFFFF; padding: 16px 36px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; border-radius: 50px; box-shadow: 0 10px 20px -5px rgba(229, 193, 205, 0.4); }
    
    /* FOOTER */
    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .address { color: #cbd5e1; font-size: 10px; line-height: 1.5; margin-top: 10px; }
    .socials { margin-top: 20px; }
    .social-link { color: #E5C1CD; font-size: 11px; text-decoration: none; margin: 0 10px; font-weight: 700; }
</style>
</head>
<body>
<center class="wrapper">
    <div class="webkit">
        <table class="outer" align="center">
            <!-- Header -->
            <tr>
                <td class="header">
                    <h1 class="brand-title">{{company_name}}</h1>
                    <span class="brand-subtitle">Private Concierge</span>
                </td>
            </tr>
            
            <!-- Body -->
            <tr>
                <td class="content">
                    <p class="greeting">Dear {{to_name}},</p>
                    <div class="message-body">
                        {{{message}}}
                    </div>
                    <div class="btn-container">
                        <a href="{{company_website}}" class="btn">Visit Collection</a>
                    </div>
                    <p style="font-size: 13px; color: #64748b; text-align: center; font-style: italic;">
                        "Curating the exceptional for the discerning few."
                    </p>
                </td>
            </tr>
            
            <!-- Footer -->
            <tr>
                <td class="footer">
                    <p class="footer-text">&copy; {{year}} {{company_name}}</p>
                    <p class="footer-text">All Rights Reserved</p>
                    <div class="address">{{company_address}}</div>
                    <div class="socials">
                        <a href="{{company_website}}" class="social-link">Website</a>
                        <span style="color: #cbd5e1;">|</span>
                        <a href="mailto:{{reply_to}}" class="social-link">Contact Support</a>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</center>
</body>
</html>
`;

export const GUIDE_STEPS = [
  {
    id: 'mission-brief',
    title: '1. Mission & Brand Brief',
    description: 'Define your aesthetic territory. Before touching code, establish your bridge page\'s niche (e.g., Luxury Footwear, Tech Accessories).',
    illustrationId: 'rocket',
    subSteps: [
      '1. NICHE: Go to Pinterest or Instagram and search for "Luxury [Your Interest]". Identify a niche with high-ticket items (e.g., "Minimalist Home Decor").',
      '2. BRAND NAME: Use a tool like Namelix to generate a name that sounds established. Check if the .com is available.',
      '3. COLOR PALETTE: Visit Coolors.co. Generate a palette. Copy the HEX codes (e.g., #000000, #FFFFFF, #D4AF37) for your Primary and Secondary colors.',
      '4. TYPOGRAPHY: In the Maison Portal "Canvas" tab, test different font pairings. Use a Serif font for headings to evoke a "Magazine" feel.',
      '5. IMAGERY: Download 3 high-res images from Unsplash or Pexels. Search for "Editorial [Niche]" to find the right aesthetic.',
      '6. MANIFESTO: Open a doc and write why you curate these items. Focus on quality over quantity. This will be your "About" text.'
    ]
  },
  {
    id: 'supabase-init',
    title: '2. Cloud Nerve Center (Supabase)',
    description: 'Establish your cloud database infrastructure. This allows your bridge page to sync data in real-time across all devices.',
    illustrationId: 'forge',
    subSteps: [
      '1. SIGN UP: Go to https://supabase.com. Click "Start your project" and sign in with GitHub for the easiest setup.',
      '2. NEW PROJECT: Click "New Project". Name it "Maison Portal".',
      '3. PASSWORD: Click "Generate a password". COPY THIS IMMEDIATELY and save it in a safe place (you will need it for Step 6).',
      '4. REGION: In the "Region" dropdown, select the city closest to you (e.g., "Cape Town" or "London") for the fastest speed.',
      '5. PLAN: Select the "Free" tier. Click "Create new project". Wait 2 minutes for the database to provision.',
      '6. CREDENTIALS: Once ready, go to "Project Settings" (gear icon) > "API". You will see your "Project URL" and "anon public" key here.'
    ]
  },
  {
    id: 'database',
    title: '3. Architectural Blueprint (SQL)',
    description: 'Inject the master data schema into your database. This creates the tables for products, analytics, and settings.',
    illustrationId: 'rocket',
    subSteps: [
      '1. SQL EDITOR: In your Supabase sidebar, click the "SQL Editor" icon (looks like ">_").',
      '2. NEW QUERY: Click "+ New query" at the top. Name it "Master Setup".',
      '3. PASTE SCRIPT: Scroll down in this Pilot guide, copy the entire "Master SQL Script" block, and paste it into the Supabase editor.',
      '4. RUN: Click the "Run" button at the bottom right. You should see "Success. No rows returned."',
      '5. VERIFY: Click the "Table Editor" icon (grid icon) in the sidebar. You should now see tables like "products", "settings", and "clients".',
      '6. INITIAL RECORD: Click the "settings" table. Ensure there is one row with the ID "global". If not, re-run the script.'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v7.0 (SEO & Integrations Ready)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLES
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT,
  "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT,
  "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navContactLabel" TEXT, "navDashboardLabel" TEXT,
  "departmentsLayout" TEXT, "subcategoryLayout" TEXT,
  "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT,
  "socialLinks" JSONB, "contactFaqs" JSONB, "footerDescription" TEXT, "footerCopyrightText" TEXT,
  "footerNavHeader" TEXT, "footerPolicyHeader" TEXT, "footerCreatorRole" TEXT, "footerSocialsLabel" TEXT,
  "homeHeroBadge" TEXT, "homeAboutTitle" TEXT, "homeAboutDescription" TEXT, "homeAboutImage" TEXT, "homeAboutCta" TEXT,
  "homeCategorySectionTitle" TEXT, "homeCategorySectionSubtitle" TEXT, "homeNicheHeader" TEXT, "homeNicheSubheader" TEXT, "homeTrustHeader" TEXT, "homeTrustSubheader" TEXT, "homeTrustSectionTitle" TEXT,
  "homeTrustItem1Title" TEXT, "homeTrustItem1Desc" TEXT, "homeTrustItem1Icon" TEXT,
  "homeTrustItem2Title" TEXT, "homeTrustItem2Desc" TEXT, "homeTrustItem2Icon" TEXT,
  "homeTrustItem3Title" TEXT, "homeTrustItem3Desc" TEXT, "homeTrustItem3Icon" TEXT,
  "homeReadStoryBtn" TEXT, "homeAboutCuratorLabel" TEXT, "homeAboutNarrativeLabel" TEXT,
  "homeCategoryShopByLabel" TEXT, "homeCategoryPortfolioLabel" TEXT, "homeCategoryDiscoverLabel" TEXT,
  "productsHeroTitle" TEXT, "productsHeroSubtitle" TEXT, "productsHeroImage" TEXT, "productsHeroImages" JSONB, "productsHeroImagesArray" JSONB,
  "productsSearchPlaceholder" TEXT, "aboutHeroTitle" TEXT, "aboutHeroSubtitle" TEXT, "aboutMainImage" TEXT,
  "aboutEstablishedYear" TEXT, "aboutEstablishedDate" BIGINT, "aboutFounderName" TEXT, "aboutLocation" TEXT,
  "aboutHistoryBadge" TEXT, "aboutHistoryTitle" TEXT, "aboutHistoryBody" TEXT, "aboutManifestoBadge" TEXT, "aboutManifestoTitle" TEXT,
  "aboutMissionTitle" TEXT, "aboutMissionBody" TEXT, "aboutMissionIcon" TEXT,
  "aboutCommunityTitle" TEXT, "aboutCommunityBody" TEXT, "aboutCommunityIcon" TEXT,
  "aboutIntegrityTitle" TEXT, "aboutIntegrityBody" TEXT, "aboutIntegrityIcon" TEXT,
  "aboutSignatureImage" TEXT, "aboutGalleryImages" JSONB, "aboutEstLabel" TEXT, "aboutVerifiedNarrativeLabel" TEXT,
  "aboutCuratorsEditTitle" TEXT, "aboutCuratorsEditDesc" TEXT, "aboutExploreCollectionBtn" TEXT, "aboutPortfolioVerifiedLabel" TEXT,
  "contactHeroTitle" TEXT, "contactHeroSubtitle" TEXT, "contactFormNameLabel" TEXT, "contactFormEmailLabel" TEXT,
  "contactFormSubjectLabel" TEXT, "contactFormMessageLabel" TEXT, "contactFormButtonText" TEXT,
  "contactSuccessTitle" TEXT, "contactConciergeLabel" TEXT, "contactSuccessMessage" TEXT, "contactSubmitNewBtn" TEXT,
  "contactVerifiedLabel" TEXT, "contactWhatsappLabel" TEXT, "contactFollowUsLabel" TEXT, "contactFaqTitle" TEXT, "contactLastUpdatedLabel" TEXT,
  "contactInfoTitle" TEXT, "contactAddressLabel" TEXT, "contactEmailLabel" TEXT, "contactPhoneLabel" TEXT, "contactHoursLabel" TEXT, "contactHoursWeekdays" TEXT, "contactHoursWeekends" TEXT,
  "adminLoginHeroImage" TEXT, "adminLoginAccentEnabled" BOOLEAN,
  "disclosureTitle" TEXT, "disclosureContent" TEXT, "privacyTitle" TEXT, "privacyContent" TEXT, "termsTitle" TEXT, "termsContent" TEXT,
  "emailJsServiceId" TEXT, "emailJsTemplateId" TEXT, "emailJsPublicKey" TEXT,
  "googleAnalyticsId" TEXT, "googleTagManagerId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "pinterestTagId" TEXT, "amazonAssociateId" TEXT, "webhookUrl" TEXT, "gscVerificationId" TEXT,
  "customHeaderScripts" TEXT, "customFooterScripts" TEXT, "seoTitle" TEXT, "seoDescription" TEXT, "seoOgImage" TEXT,
  "enableSchemaMarkup" BOOLEAN DEFAULT FALSE, "schemaType" TEXT, "customSchemaJson" TEXT,
  "localBusinessName" TEXT, "localBusinessAddress" TEXT, "localBusinessPhone" TEXT, "localBusinessOpeningHours" TEXT, "localBusinessCountry" TEXT,
  "localBusinessLat" NUMERIC, "localBusinessLng" NUMERIC, "localBusinessWebsite" TEXT, "localBusinessCategory" TEXT,
  "robotsGeneratedAt" BIGINT, "sitemapGeneratedAt" BIGINT, "robotsStatus" TEXT DEFAULT 'pending', "sitemapStatus" TEXT DEFAULT 'pending',
  "seoAutoCleanUrls" BOOLEAN DEFAULT TRUE, "seoEnableLazyLoading" BOOLEAN DEFAULT TRUE, "seoRequireAltText" BOOLEAN DEFAULT FALSE, "seoAutoRelatedProducts" BOOLEAN DEFAULT TRUE,
  "seoForceHttps" BOOLEAN DEFAULT TRUE, "seoEnableCanonicalTags" BOOLEAN DEFAULT TRUE, "seoShowLastUpdated" BOOLEAN DEFAULT TRUE, "isMaintenanceMode" BOOLEAN DEFAULT FALSE,
  "maintenanceTitle" TEXT, "maintenanceMessage" TEXT, "loadingMessage" TEXT,
  "homeNicheDescription" TEXT, "homeTrustBadge" TEXT, "homeTrustTitle" TEXT, "homeTrustDescription" TEXT, "homeTrustCta" TEXT,
  "aboutHeroBadge" TEXT, "aboutHeroDescription" TEXT, "aboutIntegrityBadge1" TEXT, "aboutIntegrityBadge2" TEXT,
  "contactHeroBadge" TEXT, "contactHeroDescription" TEXT, "contactFormNamePlaceholder" TEXT, "contactFormEmailPlaceholder" TEXT,
  "contactFormSubjectPlaceholder" TEXT, "contactFormMessagePlaceholder" TEXT, "contactFormSubmitLabel" TEXT, "contactFormSubmittingLabel" TEXT, "contactFormSuccessMessage" TEXT, "contactSocialTitle" TEXT,
  "productsHeroBadge" TEXT, "productsHeroDescription" TEXT, "productsFilterAll" TEXT, "productsEmptyMessage" TEXT,
  "productsDeptLabel" TEXT, "productsAllCollectionsLabel" TEXT, "productsBrowseEverythingLabel" TEXT, "productsNichesLabel" TEXT, "productsClearFilterLabel" TEXT, "productsShowAllLabel" TEXT, "productsSelectionsLabel" TEXT, "productRefLabel" TEXT,
  "sortLatestLabel" TEXT, "sortPriceLowLabel" TEXT, "sortPriceHighLabel" TEXT, "sortNameLabel" TEXT,
  "emptyProductsTitle" TEXT, "emptyProductsResetLabel" TEXT,
  "productNotFoundTitle" TEXT, "productNotFoundCta" TEXT, "productPriceLabel" TEXT, "productSpecsLabel" TEXT, "productLastUpdatedLabel" TEXT, "productMerchantVerifiedLabel" TEXT, "productAcquisitionLabel" TEXT,
  "reviewSectionTitle" TEXT, "reviewWriteCta" TEXT, "reviewCountLabel" TEXT, "reviewRatingLabel" TEXT, "reviewIdentityLabel" TEXT, "reviewIdentityPlaceholder" TEXT, "reviewCommentPlaceholder" TEXT, "reviewSubmitLabel" TEXT, "reviewSubmittingLabel" TEXT, "emptyReviewsMessage" TEXT,
  "relatedProductsTitle" TEXT, "modalReturnTitle" TEXT, "modalCloseTitle" TEXT, "modalSlideLabel" TEXT, "modalOfLabel" TEXT,
  "sharePreviewLabel" TEXT, "shareTitlePrefix" TEXT, "shareTitleSuffix" TEXT, "shareSubtitle" TEXT, "shareLaunchLabel" TEXT, "shareCopiedLabel" TEXT, "shareCopyLinkLabel" TEXT, "shareSecurityLabel" TEXT,
  "loginHeroBadge" TEXT, "loginHeroTitle" TEXT, "loginHeroDescription" TEXT, "loginEmailLabel" TEXT, "loginPasswordLabel" TEXT, "loginEmailPlaceholder" TEXT, "loginPasswordPlaceholder" TEXT, "loginSubmitLabel" TEXT, "loginSubmittingLabel" TEXT, "loginGoogleLabel" TEXT, "loginBackToSite" TEXT,
  "loginSuccessBadge" TEXT, "loginSuccessTitlePrefix" TEXT, "loginSuccessTitleSuffix" TEXT, "loginSuccessMessage" TEXT, "loginSecurityLabel" TEXT, "loginDividerLabel" TEXT,
  "adminSaveIndicatorErrorTitle" TEXT, "adminSaveIndicatorErrorMessage" TEXT, "adminSaveIndicatorSuccessTitle" TEXT, "adminSaveIndicatorSuccessMessage" TEXT,
  "adminUploadLabel" TEXT, "adminSocialNewPlatform" TEXT, "adminSocialProfilesLabel" TEXT, "adminSocialAddLabel" TEXT, "adminSocialPlatformPlaceholder" TEXT, "adminSocialUrlPlaceholder" TEXT, "adminSocialEmptyMessage" TEXT,
  "adminFaqNewQuestion" TEXT, "adminFaqNewAnswer" TEXT, "adminFaqLabel" TEXT, "adminFaqAddLabel" TEXT, "adminFaqQuestionLabel" TEXT, "adminFaqAnswerLabel" TEXT, "adminFaqQuestionPlaceholder" TEXT, "adminFaqAnswerPlaceholder" TEXT, "adminFaqEmptyMessage" TEXT,
  "adminTrafficLiveLabel" TEXT, "adminTrafficLocationTitle" TEXT, "adminTrafficTotalHitsLabel" TEXT, "adminTrafficMapEnlargeLabel" TEXT, "adminTrafficMapModalTitle" TEXT, "adminTrafficMapModalSubtitle" TEXT, "adminTrafficMapModalActiveNode" TEXT, "adminTrafficMapModalNodeDescription" TEXT, "adminTrafficMapModalCategorizedLabel" TEXT, "adminTrafficMapModalSortedLabel" TEXT, "adminTrafficMapModalInstructions" TEXT, "adminTrafficMapModalVisitorNode" TEXT, "adminTrafficMapModalInactiveZone" TEXT, "adminTrafficTableLocationHeader" TEXT, "adminTrafficTableHitsHeader" TEXT, "adminTrafficTableDeviceHeader" TEXT, "adminTrafficStatusOnline" TEXT, "adminTrafficEmptyMessage" TEXT, "adminTrafficEmptyDescription" TEXT,
  "adminDeviceBreakdownTitle" TEXT, "adminDeviceBreakdownSubtitle" TEXT, "adminDeviceShareLabel" TEXT,
  "adminPermissionOwnerMessage" TEXT, "adminPermissionDeselectAll" TEXT, "adminPermissionSelectAll" TEXT,
  "reviewDefaultName" TEXT, "shareCopySuccessMessage" TEXT
);

CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "wasPrice" NUMERIC, "affiliateLink" TEXT, "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features JSONB, specifications JSONB, media JSONB, "discountRules" JSONB, reviews JSONB, tags JSONB, "createdAt" BIGINT, "createdBy" TEXT, "archivedAt" BIGINT);
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, icon TEXT, image TEXT, description TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY, "categoryId" TEXT, name TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY, image TEXT, type TEXT, title TEXT, subtitle TEXT, cta TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT, email TEXT, whatsapp TEXT, subject TEXT, message TEXT, "createdAt" BIGINT, status TEXT);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, permissions JSONB, "password" TEXT, "autoWipeExempt" BOOLEAN, "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT, source TEXT);
CREATE TABLE IF NOT EXISTS product_stats ( "productId" TEXT PRIMARY KEY, views INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, "totalViewTime" NUMERIC DEFAULT 0, "lastUpdated" BIGINT );
CREATE TABLE IF NOT EXISTS training_modules (id TEXT PRIMARY KEY, title TEXT, platform TEXT, description TEXT, icon TEXT, strategies JSONB, "actionItems" JSONB, steps JSONB, "createdAt" BIGINT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS product_history (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "wasPrice" NUMERIC, "affiliateLink" TEXT, "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features JSONB, specifications JSONB, media JSONB, "discountRules" JSONB, reviews JSONB, tags JSONB, "createdAt" BIGINT, "createdBy" TEXT, "archivedAt" BIGINT);
CREATE TABLE IF NOT EXISTS system_logs (id TEXT PRIMARY KEY, timestamp BIGINT, type TEXT, target TEXT, message TEXT, "sizeBytes" NUMERIC, status TEXT);
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, "orderNumber" TEXT, "clientId" TEXT, status TEXT, items JSONB, "totalAmount" NUMERIC, "shippingAddress" TEXT, "trackingNumber" TEXT, notes TEXT, "createdAt" BIGINT, "updatedAt" BIGINT);
CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, address TEXT, company TEXT, status TEXT, "profileImage" TEXT, "createdAt" BIGINT, "lastActive" BIGINT);
CREATE TABLE IF NOT EXISTS wishlist (id TEXT PRIMARY KEY, "userId" TEXT, "productId" TEXT, "createdAt" BIGINT);
CREATE TABLE IF NOT EXISTS site_reviews (id TEXT PRIMARY KEY, "userId" TEXT, "userName" TEXT, rating NUMERIC, comment TEXT, "createdAt" BIGINT, status TEXT DEFAULT 'pending');

-- 2. INITIAL DATA & SEO DEFAULTS
INSERT INTO settings (id, "companyName", slogan, "primaryColor") 
VALUES ('global', 'My Store', 'Curated Collection', '#E5C1CD')
ON CONFLICT (id) DO NOTHING;

-- Add SEO columns to the settings table if they don't exist
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

UPDATE settings SET
  "seoTitle" = COALESCE("seoTitle", 'My Store'),
  "seoDescription" = COALESCE("seoDescription", 'My personal curation platform, dedicated to discovering and showcasing the most Fashion, Tech and Home accessories from across the continent.'),
  "seoOgImage" = COALESCE("seoOgImage", ''),
  "googleAnalyticsId" = COALESCE("googleAnalyticsId", ''),
  "gscVerificationId" = COALESCE("gscVerificationId", ''),
  "seoAutoCleanUrls" = COALESCE("seoAutoCleanUrls", true),
  "seoEnableLazyLoading" = COALESCE("seoEnableLazyLoading", true),
  "seoRequireAltText" = COALESCE("seoRequireAltText", true),
  "seoAutoRelatedProducts" = COALESCE("seoAutoRelatedProducts", true),
  "seoForceHttps" = COALESCE("seoForceHttps", true),
  "seoEnableCanonicalTags" = COALESCE("seoEnableCanonicalTags", true),
  "seoShowLastUpdated" = COALESCE("seoShowLastUpdated", true),
  "enableSchemaMarkup" = COALESCE("enableSchemaMarkup", false),
  "localBusinessName" = COALESCE("localBusinessName", 'My Store'),
  "localBusinessCategory" = COALESCE("localBusinessCategory", 'Retail Store'),
  "localBusinessAddress" = COALESCE("localBusinessAddress", '123 Fashion Ave, New York, NY 10001'),
  "localBusinessCountry" = COALESCE("localBusinessCountry", 'United States'),
  "localBusinessWebsite" = COALESCE("localBusinessWebsite", 'https://findara.com'),
  "localBusinessPhone" = COALESCE("localBusinessPhone", '+1 234 567 8900'),
  "localBusinessOpeningHours" = COALESCE("localBusinessOpeningHours", 'Mo-Fr 09:00-18:00'),
  "localBusinessLat" = COALESCE("localBusinessLat", 40.7128),
  "localBusinessLng" = COALESCE("localBusinessLng", -74.0060)
WHERE id = 'global';

INSERT INTO admin_users (id, name, email, role, permissions)
VALUES ('admin-1', 'System Administrator', 'ankebaeleejason@gmail.com', 'owner', '["all"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. ENABLE RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_reviews ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (Idempotent)
DO $$ 
BEGIN
    -- DROP ALL POLICIES FIRST
    DROP POLICY IF EXISTS "Public Read settings" ON settings;
    DROP POLICY IF EXISTS "Public Read products" ON products;
    DROP POLICY IF EXISTS "Public Read hero" ON hero_slides;
    DROP POLICY IF EXISTS "Public Read cat" ON categories;
    DROP POLICY IF EXISTS "Public Read sub" ON subcategories;
    DROP POLICY IF EXISTS "Public Read training" ON training_modules;
    DROP POLICY IF EXISTS "Public Read stats" ON product_stats;
    DROP POLICY IF EXISTS "Enable all for anon" ON settings;
    DROP POLICY IF EXISTS "Enable all for anon products" ON products;
    DROP POLICY IF EXISTS "Enable all for anon enquiries" ON enquiries;
    DROP POLICY IF EXISTS "Enable all for anon logs" ON traffic_logs;
    DROP POLICY IF EXISTS "Enable all for anon admins" ON admin_users;
    DROP POLICY IF EXISTS "Enable all for anon stats" ON product_stats;
    DROP POLICY IF EXISTS "Enable all for anon hero" ON hero_slides;
    DROP POLICY IF EXISTS "Enable all for anon cat" ON categories;
    DROP POLICY IF EXISTS "Enable all for anon sub" ON subcategories;
    DROP POLICY IF EXISTS "Enable all for anon history" ON product_history;
    DROP POLICY IF EXISTS "Enable all for anon training" ON training_modules;
    DROP POLICY IF EXISTS "Enable all for anon system_logs" ON system_logs;
    DROP POLICY IF EXISTS "Enable all for anon orders" ON orders;
    DROP POLICY IF EXISTS "Enable all for anon clients" ON clients;
    DROP POLICY IF EXISTS "Enable all for anon wishlist" ON wishlist;
    DROP POLICY IF EXISTS "Enable all for anon site_reviews" ON site_reviews;
END $$;

-- RECREATE POLICIES
CREATE POLICY "Public Read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public Read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read hero" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public Read cat" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read sub" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public Read training" ON training_modules FOR SELECT USING (true);
CREATE POLICY "Public Read stats" ON product_stats FOR SELECT USING (true);

CREATE POLICY "Enable all for anon" ON settings FOR ALL USING (true);
CREATE POLICY "Enable all for anon products" ON products FOR ALL USING (true);
CREATE POLICY "Enable all for anon enquiries" ON enquiries FOR ALL USING (true);
CREATE POLICY "Enable all for anon logs" ON traffic_logs FOR ALL USING (true);
CREATE POLICY "Enable all for anon admins" ON admin_users FOR ALL USING (true);
CREATE POLICY "Enable all for anon stats" ON product_stats FOR ALL USING (true);
CREATE POLICY "Enable all for anon hero" ON hero_slides FOR ALL USING (true);
CREATE POLICY "Enable all for anon cat" ON categories FOR ALL USING (true);
CREATE POLICY "Enable all for anon sub" ON subcategories FOR ALL USING (true);
CREATE POLICY "Enable all for anon history" ON product_history FOR ALL USING (true);
CREATE POLICY "Enable all for anon training" ON training_modules FOR ALL USING (true);
CREATE POLICY "Enable all for anon system_logs" ON system_logs FOR ALL USING (true);
CREATE POLICY "Enable all for anon orders" ON orders FOR ALL USING (true);
CREATE POLICY "Enable all for anon clients" ON clients FOR ALL USING (true);
CREATE POLICY "Enable all for anon wishlist" ON wishlist FOR ALL USING (true);
CREATE POLICY "Enable all for anon site_reviews" ON site_reviews FOR ALL USING (true);

-- 5. AUTH SYNC TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set default role to 'client' in metadata if not present
  IF NEW.raw_user_meta_data IS NULL THEN
    NEW.raw_user_meta_data := jsonb_build_object('role', 'client');
  ELSIF NEW.raw_user_meta_data->>'role' IS NULL THEN
    NEW.raw_user_meta_data := NEW.raw_user_meta_data || jsonb_build_object('role', 'client');
  END IF;

  INSERT INTO public.clients (id, email, name, "createdAt")
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    EXTRACT(EPOCH FROM now()) * 1000
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`,
    codeLabel: 'Idempotent Master SQL Script v7.0'
  },
  {
    id: 'security-auth',
    title: '4. Guard Protocol (Auth)',
    description: 'Configure how your team accesses the Maison Portal. This secures your collections from unauthorized changes.',
    illustrationId: 'forge',
    subSteps: [
      '1. AUTH PROVIDERS: In Supabase, click "Authentication" (user icon) > "Providers".',
      '2. EMAIL: Ensure "Email" is toggled ON. Under "Confirm email", toggle it OFF for now (this allows you to test signups instantly).',
      '3. GOOGLE (Optional): If you want "Login with Google", you must set up a Google Cloud project and paste the Client ID here.',
      '4. REDIRECT URLS: Go to "URL Configuration". Under "Site URL", paste your live Vercel link (from Step 10).',
      '5. LOCAL TESTING: Under "Additional Redirect URLs", add "http://localhost:3000" so you can test login while developing.',
      '6. SAVE: Click "Save" at the bottom of the page.'
    ]
  },
  {
    id: 'asset-vault',
    title: '5. Asset Vault (Storage)',
    description: 'Prepare high-speed CDN hosting for your product imagery and cinematic videos.',
    illustrationId: 'rocket',
    subSteps: [
      '1. STORAGE: In Supabase, click "Storage" (box icon) in the sidebar.',
      '2. NEW BUCKET: Click "+ New bucket". Name it exactly "media" (lowercase).',
      '3. PUBLIC TOGGLE: Ensure the "Public bucket" toggle is ON. This is critical so images load on your website.',
      '4. POLICIES: Click "Policies" in the sidebar. Under the "media" bucket, click "New Policy" > "For full customization".',
      '5. SELECT POLICY: Name it "Public Read". Select "SELECT" only. Under "Target roles", select "anon". Enter "true" in the expression box.',
      '6. UPLOAD POLICY: Create another policy for "INSERT". Select "authenticated" role. This allows you to upload from the Admin panel.'
    ]
  },
  {
    id: 'local-infrastructure',
    title: '6. Local Infrastructure (.env)',
    description: 'Link your local development engine to your cloud project using environment variables.',
    illustrationId: 'forge',
    subSteps: [
      '1. LOCATE FILE: In your code editor (e.g., VS Code), find the file named ".env.example".',
      '2. DUPLICATE: Right-click it and select "Duplicate" or "Copy/Paste". Rename the new file to exactly ".env".',
      '3. SUPABASE URL: Go to Supabase > Settings > API. Copy the "Project URL". Paste it after "VITE_SUPABASE_URL=".',
      '4. ANON KEY: Copy the "anon public" key. Paste it after "VITE_SUPABASE_ANON_KEY=".',
      '5. SAVE: Save the file. Ensure there are no quotes or spaces around the values.',
      '6. RESTART: In your terminal, stop the server (Ctrl+C) and run "npm run dev" again. The "System Status" in your Admin footer should now be green.'
    ],
    code: 'VITE_SUPABASE_URL=https://xxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    codeLabel: '.env Credentials'
  },
  {
    id: 'version-control',
    title: '7. Version Control (GitHub)',
    description: 'Secure your codebase and enable automated production deployments.',
    illustrationId: 'rocket',
    subSteps: [
      '1. GITHUB LOGIN: Go to https://github.com and sign in. Click the "+" icon > "New repository".',
      '2. REPO SETUP: Name it "maison-portal". Set it to "Private". Click "Create repository".',
      '3. TERMINAL: In your project folder, run "git init". Then run "git add .".',
      '4. COMMIT: Run "git commit -m \'Initial Launch\'". This saves a snapshot of your code.',
      '5. REMOTE: Copy the "git remote add origin..." line from GitHub and paste it into your terminal.',
      '6. PUSH: Run "git push -u origin main". Your code is now safely stored in the cloud.'
    ]
  },
  {
    id: 'email-protocol',
    title: '8. Email Server (EmailJS)',
    description: 'Setup the automated communication bridge for client enquiries.',
    illustrationId: 'forge',
    subSteps: [
      '1. SIGN UP: Go to https://www.emailjs.com and create a free account.',
      '2. ADD SERVICE: Click "Email Services" > "Add New Service". Select "Gmail" and connect your account.',
      '3. SERVICE ID: Copy the "Service ID" (e.g., "service_xxxx"). You will need this for Step 11.',
      '4. PUBLIC KEY: Click "Account" in the sidebar. Copy your "Public Key".',
      '5. WHITELIST: In "Account" > "Security", add your Vercel domain (from Step 10) to the "Allowed Domains" list.',
      '6. TEST: Click "Test Service" to ensure EmailJS can send emails through your Gmail account.'
    ]
  },
  {
    id: 'template-engineering',
    title: '9. Response Engineering',
    description: 'Design the luxury reply template your clients receive when you answer an enquiry.',
    illustrationId: 'rocket',
    subSteps: [
      '1. CREATE TEMPLATE: In EmailJS, click "Email Templates" > "Create New Template".',
      '2. DESIGN: Use the editor to design your reply. Use {{to_name}} for the client name and {{message}} for your reply.',
      '3. LOGO: Click the "Image" icon and paste your logo URL (from Supabase Storage) to brand the email.',
      '4. SETTINGS: In the "Settings" tab of the template, set the "From Name" to your Brand Name.',
      '5. TEMPLATE ID: Click "Save". Copy the "Template ID" (e.g., "template_xxxx").',
      '6. AUTO-REPLY: (Optional) Create a second template for "Auto-Confirmation" to tell clients you received their message.'
    ]
  },
  {
    id: 'production-launch',
    title: '10. Production Launch (Vercel)',
    description: 'Deploy your bridge page to the global web for high-performance viewing.',
    illustrationId: 'forge',
    subSteps: [
      '1. VERCEL LOGIN: Go to https://vercel.com. Sign in with your GitHub account.',
      '2. IMPORT: Click "Add New" > "Project". Find your "maison-portal" repo and click "Import".',
      '3. FRAMEWORK: Vercel should auto-detect "Vite". If not, select it from the dropdown.',
      '4. BUILD SETTINGS: Ensure "Build Command" is "npm run build" and "Output Directory" is "dist".',
      '5. DEPLOY: Click "Deploy". The build will fail initially because we haven\'t added keys yet—this is normal.',
      '6. DASHBOARD: Once the build finishes (even if it fails), click "Go to Dashboard".'
    ]
  },
  {
    id: 'cloud-injectors',
    title: '11. Cloud Injectors (Secrets)',
    description: 'Securely transfer your private API keys to the production environment.',
    illustrationId: 'rocket',
    subSteps: [
      '1. SETTINGS: In your Vercel project, click "Settings" > "Environment Variables".',
      '2. SUPABASE: Add "VITE_SUPABASE_URL" and "VITE_SUPABASE_ANON_KEY" with values from Step 2.',
      '3. EMAILJS: Add "VITE_EMAILJS_SERVICE_ID", "VITE_EMAILJS_TEMPLATE_ID", and "VITE_EMAILJS_PUBLIC_KEY".',
      '4. REDEPLOY: Go to the "Deployments" tab. Click the three dots on your latest build and select "Redeploy".',
      '5. VERIFY: Once finished, click the "Visit" button. Your site should now load your products and settings.',
      '6. CONSOLE: If the site is blank, right-click > Inspect > Console to see if any API keys are missing.'
    ]
  },
  {
    id: 'domain-authority',
    title: '12. Domain Authority (DNS)',
    description: 'Finalize your brand identity with a custom .com or .luxury domain.',
    illustrationId: 'forge',
    subSteps: [
      '1. BUY DOMAIN: Purchase a domain from Namecheap, GoDaddy, or Google Domains.',
      '2. VERCEL DOMAINS: In Vercel Settings > Domains, type your domain (e.g., yourbrand.com) and click "Add".',
      '3. DNS A RECORD: In your domain registrar, add an "A" record. Host: "@", Value: "76.76.21.21".',
      '4. DNS CNAME: Add a "CNAME" record. Host: "www", Value: "cname.vercel-dns.com".',
      '5. PROPAGATION: Wait 10 minutes. Check "DNSChecker.org" to see if the records are live.',
      '6. SSL: Vercel will automatically show a "Valid" status with a green lock icon once DNS is connected.'
    ]
  },
  {
    id: 'analytics-ga4',
    title: '13. Vitality Sensors (GA4)',
    description: 'Install Google Analytics to monitor visitor origins and engagement duration.',
    illustrationId: 'rocket',
    subSteps: [
      '1. CREATE PROPERTY: Go to https://analytics.google.com. Create a new "GA4" property.',
      '2. DATA STREAM: Click "Data Streams" > "Web". Enter your domain. Copy the "Measurement ID" (G-XXXXXX).',
      '3. INTEGRATE: In your Admin > Settings > Integrations, paste the Measurement ID.',
      '4. REAL-TIME: Visit your live site. In GA4, click "Real-time" to see yourself as a visitor.',
      '5. EVENTS: GA4 will automatically track clicks. You can see these in the "Events" tab after 24 hours.',
      '6. CONVERSIONS: Mark "Contact" or "Affiliate Click" as a conversion in GA4 settings.'
    ]
  },
  {
    id: 'meta-conversions',
    title: '14. Meta Pixel Deployment',
    description: 'Enable retargeting and conversion tracking for Instagram and Facebook ads.',
    illustrationId: 'forge',
    subSteps: [
      '1. EVENTS MANAGER: Go to Facebook Business Suite > Events Manager.',
      '2. NEW PIXEL: Click "Connect Data Sources" > "Web". Name it and click "Create".',
      '3. PIXEL ID: Copy the numeric "Pixel ID" from the settings tab.',
      '4. INTEGRATE: Paste the Pixel ID into your Admin > Settings > Integrations.',
      '5. HELPER: Install the "Meta Pixel Helper" Chrome extension. Visit your site to see if it turns green.',
      '6. TEST EVENTS: Use the "Test Events" tool in Meta to verify that "ViewContent" fires when you click a product.'
    ]
  },
  {
    id: 'tiktok-tracking',
    title: '15. TikTok Viral Tracking',
    description: 'Monitor high-traffic trends and referral performance from TikTok.',
    illustrationId: 'rocket',
    subSteps: [
      '1. ADS MANAGER: Go to TikTok Ads Manager > Assets > Events.',
      '2. CREATE PIXEL: Click "Manage" under Web Events. Click "Set Up Web Events".',
      '3. MANUAL: Select "TikTok Pixel" > "Manual Setup". Copy the "Pixel ID".',
      '4. INTEGRATE: Paste the ID into your Admin > Settings > Integrations.',
      '5. HELPER: Install "TikTok Pixel Helper" to verify the pixel is active on your live site.',
      '6. OPTIMIZE: Use the "Event Builder" in TikTok to track button clicks for your affiliate links.'
    ]
  },
  {
    id: 'pinterest-aesthetic',
    title: '16. Pinterest Aesthetic Tracking',
    description: 'Capture aesthetic-driven shoppers from the Pinterest ecosystem.',
    illustrationId: 'forge',
    subSteps: [
      '1. BUSINESS HUB: Go to Pinterest Business > Ads > Conversions.',
      '2. TAG ID: Click "Install Tag". Copy the "Unique Tag ID".',
      '3. INTEGRATE: Paste the Tag ID into your Admin > Settings > Integrations.',
      '4. HELPER: Install the "Pinterest Tag Helper" extension to verify the tag is firing.',
      '5. CLAIM SITE: In Pinterest Settings > Claim, enter your domain and add the meta tag to your site.',
      '6. RICH PINS: Once claimed, your pins will automatically show price and availability.'
    ]
  },
  {
    id: 'canvas-personalization',
    title: '17. Identity Calibration (Canvas)',
    description: 'Calibrate your site\'s visual identity to match your unique curation style.',
    illustrationId: 'rocket',
    subSteps: [
      '1. CANVAS TAB: In the Admin sidebar, click "Canvas" (palette icon).',
      '2. IDENTITY: Upload your Logo, Favicon, and a "Hero Image" for the homepage.',
      '3. COLORS: Set your "Primary Color" (e.g., #000000) and "Accent Color" (e.g., #D4AF37).',
      '4. TYPOGRAPHY: Select your Heading and Body fonts. Use "Playfair Display" for a luxury feel.',
      '5. SEO: Enter your "Site Title" and "Meta Description". This is what Google shows in search results.',
      '6. PREVIEW: Click "View Site" at the top right to see your new identity in action.'
    ]
  },
  {
    id: 'catalog-deployment',
    title: '18. Catalog Strategy (Items)',
    description: 'Populate your bridge page with high-commission, personally curated items.',
    illustrationId: 'forge',
    subSteps: [
      '1. CATEGORIES: In Admin > Products, click "Categories". Add your main niches (e.g., "Watches", "Decor").',
      '2. ADD ITEM: Click "Add Product". Enter the name, price, and a "Why We Love It" description.',
      '3. AFFILIATE LINK: Paste your Amazon or Brand affiliate link. This is how you get paid.',
      '4. IMAGES: Upload 3-5 high-res images. Use the "Gallery" feature to show different angles.',
      '5. FEATURED: Toggle "Featured" ON for your best items to show them on the homepage.',
      '6. AUDIT: Click "View on Site" for each product to ensure the images and links work perfectly.'
    ]
  },
  {
    id: 'academy-deployment',
    title: '19. Growth Blueprint (Academy)',
    description: 'Utilize the training modules to master the algorithms of social platforms.',
    illustrationId: 'rocket',
    subSteps: [
      '1. ACADEMY TAB: Click "Academy" in the Admin sidebar.',
      '2. MODULES: Read the "Instagram Strategy" and "Pinterest Viral" guides.',
      '3. CONTENT PLAN: Use the "Content Calendar" template to plan 30 days of posts.',
      '4. AD GENERATOR: Use the built-in tool to create aesthetic ads for your products.',
      '5. HASHTAGS: Copy the curated hashtag lists for your niche to increase reach.',
      '6. ENGAGEMENT: Follow the "Community Growth" guide to find and engage with your target audience.'
    ]
  },
  {
    id: 'maintenance-scaling',
    title: '20. Scaling & Maintenance',
    description: 'Establish a rhythm for catalog refreshes and analytical auditing.',
    illustrationId: 'forge',
    subSteps: [
      '1. ANALYTICS: Check your "Elite Performance" report weekly to see which products are trending.',
      '2. LINK CHECK: Use a "Broken Link Checker" extension to ensure all affiliate links are still active.',
      '3. REFRESH: Add 5 new products every week to keep your audience coming back.',
      '4. BACKUP: Go to Admin > System and click "Export Catalog" to save your data as a JSON file.',
      '5. OPTIMIZE: If the site feels slow, use "TinyPNG" to compress your images before uploading.',
      '6. FEEDBACK: Read your "Enquiries" to see what items your clients are asking for.'
    ]
  },
  {
    id: 'client-ecosystem',
    title: '21. Client Ecosystem & Accounts',
    description: 'Enable the luxury membership experience for your visitors, allowing them to track orders and manage their profiles.',
    illustrationId: 'rocket',
    subSteps: [
      '1. CLIENTS TAB: Click "Clients" in the Admin sidebar.',
      '2. SIGNUP TEST: Go to your live site and sign up as a new user. Verify you appear in the Admin list.',
      '3. PROFILES: Click a client to see their "Wishlist" and "Order History".',
      '4. VIP STATUS: Manually change a client\'s status to "VIP" to give them special access.',
      '5. ENQUIRIES: When a client sends a message, it will appear in the "Enquiries" tab linked to their profile.',
      '6. EXPORT: Use the "Export Clients" button to download your email list for marketing.'
    ]
  },
  {
    id: 'order-fulfillment',
    title: '22. Order Management & Fulfillment',
    description: 'Master the workflow of converting enquiries into tracked luxury orders.',
    illustrationId: 'forge',
    subSteps: [
      '1. ENQUIRY: When a client asks about a product, click "Create Order" from the Enquiry screen.',
      '2. ORDER DETAILS: Select the product, quantity, and set the status to "Pending".',
      '3. TRACKING: Once the affiliate purchase is confirmed, update the order with a "Tracking Number".',
      '4. CLIENT VIEW: The client can now see their order status in their own "Member Portal".',
      '5. COMPLETION: Mark the order as "Delivered" once the item arrives.',
      '6. REVENUE: The "Analytics" tab will automatically update your "Estimated Revenue" based on these orders.'
    ]
  },
  {
    id: 'client-automation',
    title: '23. Client Automation (Signups)',
    description: 'Configure automated welcome emails and signup confirmations to build immediate trust with new members.',
    illustrationId: 'rocket',
    subSteps: [
      '1. WELCOME TEMPLATE: In EmailJS, create a "Welcome Protocol" template for new signups.',
      '2. CONTENT: Include a "Getting Started" guide or a link to your latest curation.',
      '3. AUTOMATION: Set up a Supabase Edge Function (or hook) to trigger the welcome email.',
      '4. PERSONALIZATION: Use the client\'s name in the email using the {{name}} variable.',
      '5. TEST: Sign up as a new user on your site and verify you receive the welcome email.',
      '6. MONITOR: Check the "Email Logs" in EmailJS to ensure all new members are being reached.'
    ]
  }
];

export const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'sales',
    label: 'Sales & Enquiries',
    description: 'Manage incoming leads and communications.',
    children: [
      { id: 'sales.view', label: 'View Enquiries' },
      { id: 'sales.manage', label: 'Manage Status (Read/Unread)' },
      { id: 'sales.delete', label: 'Delete Enquiries' },
      { id: 'sales.export', label: 'Export Data' }
    ]
  },
  {
    id: 'catalog',
    label: 'Catalog Management',
    description: 'Control products and categories.',
    children: [
      { id: 'catalog.products.view', label: 'View Products' },
      { id: 'catalog.products.manage', label: 'Add/Edit Products' },
      { id: 'catalog.products.delete', label: 'Delete Products' },
      { id: 'catalog.categories.manage', label: 'Manage Departments' },
      { id: 'catalog.ads', label: 'Generate Ads' }
    ]
  },
  {
    id: 'content',
    label: 'Site Content',
    description: 'Edit pages and visual elements.',
    children: [
      { id: 'content.hero', label: 'Hero Carousel' },
      { id: 'content.identity', label: 'Brand Identity' },
      { id: 'content.home', label: 'Home Page Sections' },
      { id: 'content.about', label: 'About Page' },
      { id: 'content.contact', label: 'Contact Page' },
      { id: 'content.legal', label: 'Legal Pages' }
    ]
  },
  {
    id: 'analytics',
    label: 'Business Intelligence',
    description: 'View traffic and performance reports.',
    children: [
      { id: 'analytics.view', label: 'View Dashboard' },
      { id: 'analytics.products', label: 'Product Performance' },
      { id: 'analytics.export', label: 'Export Reports' }
    ]
  },
  {
    id: 'system',
    label: 'System Administration',
    description: 'Advanced settings and team management.',
    children: [
      { id: 'system.team.manage', label: 'Manage Team' },
      { id: 'system.settings.core', label: 'Core Site Settings' },
      { id: 'system.reset', label: 'Factory Reset' }
    ]
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'owner',
    name: 'Main Administrator',
    email: 'admin@findara.com',
    role: 'owner',
    permissions: ['*'], // * implies all
    password: 'password123',
    createdAt: Date.now(),
    phone: '',
    address: 'Online HQ',
    profileImage: ''
  },
  {
    id: 'jason-admin',
    name: 'Jason Admin',
    email: 'ankebaeleejason@gmail.com',
    role: 'admin',
    permissions: ['*'],
    password: 'password123',
    createdAt: Date.now(),
    phone: '',
    address: 'Online HQ',
    profileImage: ''
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'e1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    whatsapp: '+27 82 555 0123',
    subject: 'Styling Consultation',
    message: 'Hi there, I am looking for a personal stylist for an upcoming gala in Cape Town. Do you offer virtual consultations?',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    status: 'unread'
  },
  {
    id: 'e2',
    name: 'Michael Nkosi',
    email: 'michael.n@example.com',
    subject: 'Product Curation Inquiry',
    message: 'I saw the Autumn Silk Series and I am interested in the bulk purchasing options for my boutique in Durban.',
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    status: 'read'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: "My Store",
  slogan: 'Curated Collection',
  companyLogo: 'M',
  companyLogoUrl: '',
  primaryColor: '#E5C1CD',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Journey',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'contact@findara.com',
  contactPhone: '+27 76 836 0325',
  whatsappNumber: '27768360325',
  address: 'Mokopane, Limpopo, 0601',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],
  contactFaqs: [
    {
      question: "Do you ship products directly?",
      answer: "As a curation bridge page, we direct you to verified third-party luxury retailers. Shipping and returns are handled directly by the brand you purchase from."
    },
    {
      question: "How do I book a styling consultation?",
      answer: "Please select 'Styling Consultation' in the inquiry form. Our team will coordinate a virtual or in-person session based on your location."
    },
    {
      question: "Are the luxury items authenticated?",
      answer: "Absolutely. We only affiliate with authorized retailers and brands that guarantee 100% authenticity on every piece listed."
    }
  ],

  footerDescription: "The premier bridge page system marketing various affiliate programs. Your curated gateway to global fashion trends.",
  footerCopyrightText: "All rights reserved.",
  footerNavHeader: 'Navigation',
  footerPolicyHeader: 'Policy',
  footerCreatorRole: 'Meet the Creator',
  footerSocialsLabel: 'Socials :',

  // Home Page Content
  homeHeroBadge: 'Curator Exclusive',
  homeAboutTitle: 'The Curator\'s Journey.',
  homeAboutDescription: 'What started as a personal quest for the perfect wardrobe evolved into this curated collection. I believe that style shouldn\'t be a luxury, but a well-curated choice. My bridge page connects you to the pieces that define my daily style, sourced from partners I trust like Shein and beyond.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Explore My Story',
  homeCategorySectionTitle: 'Curated Departments',
  homeCategorySectionSubtitle: 'The Collection',
  homeNicheHeader: 'Shop by Niche',
  homeNicheSubheader: 'Curated Portals',
  homeTrustHeader: 'Why trust my selections?',
  homeTrustSubheader: 'Curation Integrity',
  homeTrustSectionTitle: 'Why Shop Here',
  
  homeTrustItem1Title: 'Verified Affiliate',
  homeTrustItem1Desc: 'Official partner with major global retailers like Shein.',
  homeTrustItem1Icon: 'ShieldCheck', 

  homeTrustItem2Title: 'Personal Curation',
  homeTrustItem2Desc: 'I personally select and review every item on this bridge page.',
  homeTrustItem2Icon: 'User', 

  homeTrustItem3Title: 'Direct Links',
  homeTrustItem3Desc: 'Click through directly to the merchant for secure checkout.',
  homeTrustItem3Icon: 'Link', 
  homeReadStoryBtn: 'Read Full Story',
  homeAboutCuratorLabel: 'The Curator',
  homeAboutNarrativeLabel: 'The Curation Narrative',
  homeCategoryShopByLabel: 'Shop by',
  homeCategoryPortfolioLabel: 'Portfolio',
  homeCategoryDiscoverLabel: 'Discover Collection',

  // Products Page Content
  productsHeroTitle: 'Affiliate Catalog',
  productsHeroSubtitle: 'Browse my hand-picked selections from top affiliate programs.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search selections...',

  // About Page Content
  aboutHeroTitle: 'My Narrative. Your Style.',
  aboutHeroSubtitle: 'Authenticity is the thread that weaves every selection together. Welcome to my curated world.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Store Curator',
  aboutLocation: 'Cape Town, Online',

  aboutHistoryBadge: 'The Bridge System',
  aboutHistoryTitle: 'The Bridge System',
  aboutHistoryBody: 'I’ve always been the person friends asked for style advice. In 2024, I decided to turn that passion into a platform. This store isn\'t just about affiliate links; it\'s about the story behind every garment. I spend hours scrolling through thousands of items to find the "hidden gems" so you don\'t have to.\n\nThis bridge system allows me to share my unique perspective on global trends while ensuring you get the best value directly from the source. Every click supports my journey in bringing high-fashion aesthetics to the everyday curator.',
  aboutManifestoBadge: 'The Curation Manifesto',
  aboutManifestoTitle: 'The Curation Manifesto',
  
  aboutMissionTitle: 'Marketing Mission',
  aboutMissionBody: 'To bridge the gap between you and the best global affiliate offers with transparency and taste.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'Join the Community',
  aboutCommunityBody: 'Follow our journey as we discover new trends and deals that define modern luxury.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency',
  aboutIntegrityBody: 'We are upfront about our role as an affiliate marketer. This system is built on trust and curation integrity.',
  aboutIntegrityIcon: 'Shield',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551488852-0801d863dc34?auto=format&fit=crop&q=80&w=800'
  ],
  aboutEstLabel: 'Est.',
  aboutVerifiedNarrativeLabel: 'Verified Narrative',
  aboutCuratorsEditTitle: 'Curator\'s Edit',
  aboutCuratorsEditDesc: 'Hand-picked selections from the latest collections.',
  aboutExploreCollectionBtn: 'Explore Collection',
  aboutPortfolioVerifiedLabel: 'Portfolio Verified',

  // Contact Page Content
  contactHeroTitle: 'Connect with Us.',
  contactHeroSubtitle: 'Have questions about a specific find or our curation process? Our concierge desk is here to assist.',
  contactFormNameLabel: 'Name',
  contactFormEmailLabel: 'Email',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Transmit Message',
  contactSuccessTitle: 'Secure Transmission Successful',
  contactConciergeLabel: 'Concierge Online',
  contactSuccessMessage: 'Your inquiry has been encrypted and synchronized with our concierge desk. Expect a response within 24 hours.',
  contactSubmitNewBtn: 'Submit New Inquiry',
  contactVerifiedLabel: 'End-to-End Cloud Handshake Verified',
  contactWhatsappLabel: 'WhatsApp (Optional)',
  contactFollowUsLabel: 'Follow us :',
  contactLastUpdatedLabel: 'Last Updated:',
  
  contactHoursWeekdays: 'Monday - Friday: 09:00 - 18:00',
  contactHoursWeekends: 'Weekends: 10:00 - 14:00 (Digital Response)',

  // Legal Content
  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### COMPREHENSIVE AFFILIATE DISCLOSURE STATEMENT

**Last Updated: January 1, 2025**

#### 1. Introduction & Transparency Commitment

My Store (hereinafter referred to as "the Site", "we", "us", or "our") is fully committed to transparency, honesty, and compliance with the Federal Trade Commission (FTC) guidelines regarding the use of endorsements and testimonials in advertising. We believe it is critical for you, our visitor, to understand the relationship between us and the product manufacturers or service providers referenced on this Site.

This Disclosure Statement is intended to inform you that we participate in various affiliate marketing programs. These programs are designed to provide a means for sites to earn advertising fees by advertising and linking to third-party merchant websites.

#### 2. The Nature of Affiliate Marketing (Bridge Page Notice)

**IMPORTANT:** My Store functions exclusively as a **Bridge Page** or "curation portfolio." 

*   **We Are Not a Retailer:** We do not manufacture, stock, warehouse, package, or ship any products.
*   **No Transactional Relationship:** We do not process payments, handle credit card information, or manage order fulfillment.
*   **The "Click-Through" Process:** When you click on a link labeled "Shop", "Buy", "View Price", "Acquire", or similar call-to-action buttons on this Site, you will be automatically redirected to a third-party merchant's website (e.g., Shein, Amazon, Nordstorm, Revolve, etc.).
*   **The Purchase:** Any purchase you make is a direct transaction between you and that third-party merchant.

#### 3. Compensation & Commission Structure

When you click on our affiliate links and make a qualifying purchase, we may receive a commission or referral fee. This commission is paid to us by the merchant, **at no extra cost to you**.

*   **Price Parity:** The price you pay for the product is the same whether you use our affiliate link or navigate to the merchant's site directly. Our commission is deducted from the merchant's profit margin, not added to your purchase price.
*   **Cookie Duration:** Affiliate programs use "cookies" to track your visit. If you click a link and purchase within a specific timeframe (often 24 to 30 days), we may still receive credit for the sale.

#### 4. Affiliate Program Participation

My Store is a participant in several affiliate advertising programs, including but not limited to:

*   **SHEIN Affiliate Program:** We curate and link to fashion items sold on Shein.com.
*   **Amazon Services LLC Associates Program:** An affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases.
*   **Other Networks:** We may also participate in networks such as RewardStyle (LTK), CJ Affiliate, ShareASale, Awin, and others.

#### 5. Product Curation & Editorial Independence

While we receive compensation for our posts or advertisements, we always give our honest opinions, findings, beliefs, or experiences on those topics or products. The views and opinions expressed on this blog are purely the bloggers' own.

*   **Selection Process:** We curate products based on aesthetic value, trend analysis, consumer reviews, and personal taste.
*   **No Pay-to-Play:** We do not accept direct payments from brands to list "bad" products as "good." If a product is featured here, it is because we genuinely believe it offers value to our audience.
*   **Sponsored Content:** If a specific post is "Sponsored" (meaning a brand paid us a flat fee to write about them, separate from affiliate commissions), this will be clearly marked at the top of that specific page or post.

#### 6. Limitation of Liability regarding Third-Party Products

Because we do not manufacture or sell the products:

*   **No Warranty:** We make no claims, warranties, or representations regarding the quality, safety, fit, or legality of the products listed.
*   **Customer Support:** All questions regarding shipping, returns, refunds, sizing, or damaged goods must be directed to the merchant where you completed the purchase (e.g., Shein Customer Support). We have no access to your order history or payment details.

#### 7. Contact Information

If you have any questions regarding this disclosure or our affiliate relationships, please contact us at:

**Compliance Dept.**
Email: contact@findara.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,
  
  privacyTitle: 'Privacy Policy',
  privacyContent: `### COMPREHENSIVE PRIVACY POLICY

**Last Updated: January 1, 2025**

#### 1. Introduction

My Store ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.

This policy applies to the **Bridge Page System** and curation portfolio operated by the Site.

#### 2. The Data We Collect About You

Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).

We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:

*   **Identity Data:** includes first name, last name, username or similar identifier.
*   **Contact Data:** includes email address and telephone number (only if voluntarily provided via our Contact Form or Newsletter signup).
*   **Technical Data:** includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.
*   **Usage Data:** includes information about how you use our website, products, and services (e.g., which affiliate links you click).
*   **Marketing and Communications Data:** includes your preferences in receiving marketing from us and your communication preferences.

**We do NOT collect:**
*   **Financial Data:** We do **not** collect or store payment card details. All transactions are processed by third-party merchants (e.g., Shein, Amazon).
*   **Sensitive Data:** We do not collect details about your race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions, trade union membership, information about your health, and genetic and biometric data.

#### 3. How Is Your Personal Data Collected?

We use different methods to collect data from and about you including through:

*   **Direct Interactions:** You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email, or otherwise. This includes personal data you provide when you:
    *   Subscribe to our service or publications;
    *   Request marketing to be sent to you;
    *   Enter a competition, promotion, or survey; or
    *   Give us feedback or contact us.
*   **Automated Technologies or Interactions:** As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this personal data by using cookies, server logs, and other similar technologies. We may also receive Technical Data about you if you visit other websites employing our cookies.
*   **Third Parties:** We may receive personal data about you from various third parties such as:
    *   Analytics providers (such as Google Analytics).
    *   Advertising networks (such as Meta/Facebook Pixel, Pinterest Tag, TikTok Pixel).

#### 4. How We Use Your Personal Data

We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:

*   **Affiliate Tracking:** To ensure that our affiliate partners (e.g., Shein) can correctly attribute sales to our referrals.
*   **Communication:** To respond to your inquiries sent via our contact forms.
*   **Improvement:** To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences.
*   **Marketing:** To send you newsletters or promotional materials (only if you have explicitly opted-in).

#### 5. Cookies and Tracking Technologies

Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.

*   **Affiliate Cookies:** When you click a "Shop" link, a tracking cookie is placed on your device by the affiliate network (not by us directly). This cookie typically lasts 30-90 days and allows the merchant to know you came from this site.
*   **Analytics Cookies:** We use Google Analytics to measure traffic and usage trends.
*   **Marketing Cookies:** We use pixels from Facebook, TikTok, and Pinterest to re-target visitors with relevant ads on those platforms.

You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly, and affiliate tracking may fail.

#### 6. Disclosure of Your Personal Data

We may share your personal data with the parties set out below:

*   **Service Providers:** Companies that provide IT and system administration services (e.g., Supabase for database hosting, Vercel for web hosting).
*   **Professional Advisers:** Lawyers, bankers, auditors, and insurers.
*   **Regulators:** Reporting processing activities to relevant authorities if required by law.
*   **Third Parties:** We may perform a business transfer (merger or acquisition) where data is an asset.

We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.

#### 7. Data Security

We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.

#### 8. Data Retention

We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.

#### 9. Your Legal Rights (GDPR & CCPA)

Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:

*   **Request access** to your personal data.
*   **Request correction** of your personal data.
*   **Request erasure** of your personal data.
*   **Object to processing** of your personal data.
*   **Request restriction of processing** your personal data.
*   **Request transfer** of your personal data.
*   **Right to withdraw consent.**

If you wish to exercise any of the rights set out above, please contact us at contact@findara.com.

#### 10. Third-Party Links

This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.

#### 11. Contact Us

If you have any questions about this Privacy Policy, please contact us at:

Email: contact@findara.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,

  termsTitle: 'Terms of Service',
  termsContent: `### TERMS OF SERVICE & USER AGREEMENT

**Last Updated: January 1, 2025**

#### 1. Acceptance of Terms

By accessing and using the website My Store (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Site's particular services, you shall be subject to any posted guidelines or rules applicable to such services. All such guidelines or rules are hereby incorporated by reference into the Terms of Service.

#### 2. Description of Service (The "Bridge Page" Model)

The Site operates as a content curation and affiliate marketing bridge page.

*   **NOT A RETAILER:** You acknowledge that this Site is **not** an online store, retailer, or manufacturer. We do not sell products directly.
*   **CURATION ONLY:** Our service is limited to the aggregation, display, review, and linking of products sold by third-party vendors.
*   **NO CONTRACT OF SALE:** No contract of sale is formed between you and the Site when you click a link. The contract of sale is formed solely between you and the third-party merchant (e.g., Shein) upon checkout on their respective platform.

#### 3. Intellectual Property Rights

*   **Our Content:** The design, layout, graphics, text, logo, and code of this Site are the intellectual property of the Site and are protected by copyright and trademark laws.
*   **Merchant Content:** Product images, prices, and descriptions displayed on this Site are the property of their respective owners (the merchants) and are used here under license or fair use principles for the purpose of affiliate promotion. You may not copy, reproduce, or distribute this content without express permission from the rights holder.

#### 4. User Conduct

You agree not to use the Site for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Site in any way that could damage the Site, the services, or the general business of the Site.

You further agree not to:
*   Harass, abuse, or threaten others or otherwise violate any person's legal rights.
*   Violate any intellectual property rights of the Site or any third party.
*   Upload or otherwise disseminate any computer viruses or other software that may damage the property of another.
*   Perpetrate any fraud.
*   Engage in or create any unlawful gambling, sweepstakes, or pyramid scheme.
*   Publish or distribute any obscene or defamatory material.

#### 5. Third-Party Links and Services

The Site may contain links to other websites ("Linked Sites"). The Linked Sites are not under the control of the Site and we are not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. The Site is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by the Site of the site or any association with its operators.

**You acknowledge and agree that your use of third-party websites is at your own risk and subject to the terms and conditions of use for such sites.**

#### 6. Disclaimer of Warranties

THE SITE AND ITS CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

THE SITE DOES NOT WARRANT THAT:
(A) THE SITE WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION;
(B) ANY ERRORS OR DEFECTS WILL BE CORRECTED;
(C) THE SITE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR
(D) THE RESULTS OF USING THE SITE WILL MEET YOUR REQUIREMENTS.

#### 7. Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE SITE, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THIS SITE.

SPECIFICALLY, WE ARE NOT LIABLE FOR:
*   **PRODUCT DEFECTS:** Any issues with products purchased from third-party merchants (sizing, quality, damage).
*   **SHIPPING ISSUES:** Delays, lost packages, or customs fees associated with third-party orders.
*   **FINANCIAL LOSS:** Any financial loss incurred from transactions on third-party sites.

#### 8. Indemnification

You agree to defend, indemnify and hold harmless the Site and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.

#### 9. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

#### 10. Governing Law

These Terms shall be governed and construed in accordance with the laws of South Africa (or the primary jurisdiction of the Site owner), without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

#### 11. Contact Us

If you have any questions about these Terms, please contact us at:

Email: contact@findara.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,

  // Integrations
  emailJsServiceId: '',
  emailJsTemplateId: '',
  emailJsPublicKey: '',
  googleAnalyticsId: '',
  facebookPixelId: '',
  tiktokPixelId: '',
  amazonAssociateId: '',
  webhookUrl: '',
  pinterestTagId: '',
  gscVerificationId: '',
  googleTagManagerId: '',
  customHeaderScripts: '',
  customFooterScripts: '',

  // Advanced SEO & Local
  enableSchemaMarkup: true,
  schemaType: 'LocalBusiness',
  customSchemaJson: '',
  seoTitle: 'My Store | Curated Collection',
  seoDescription: 'The premier bridge page system marketing various affiliate programs. Your curated gateway to global fashion trends.',
  seoOgImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
  seoEnableCanonicalTags: true,
  seoForceHttps: true,
  seoAutoCleanUrls: true,
  seoEnableLazyLoading: true,
  seoRequireAltText: true,
  seoAutoRelatedProducts: true,
  seoShowLastUpdated: true,
  robotsGeneratedAt: 0,
  sitemapGeneratedAt: 0,
  robotsStatus: 'pending',
  sitemapStatus: 'pending',
  localBusinessName: 'My Store',
  localBusinessAddress: 'Mokopane, Limpopo, 0601',
  localBusinessPhone: '+27 76 836 0325',
  localBusinessOpeningHours: 'Mo-Fr 09:00-18:00',
  isMaintenanceMode: false,

  // Maintenance & Loading
  maintenanceTitle: 'Under Construction',
  maintenanceMessage: 'Our digital showroom is currently being curated. Please return shortly for the full experience.',
  loadingMessage: 'Curating Experience...',

  // Home Page
  homeNicheDescription: 'Discover our hand-picked collection of premium items.',
  homeTrustBadge: 'Elite Trust',
  homeTrustTitle: 'Secure Acquisition',
  homeTrustDescription: 'Every piece in our collection undergoes a rigorous verification process.',
  homeTrustCta: 'Learn More',

  // About Page
  aboutHeroBadge: 'Our Story',
  aboutHeroDescription: 'A legacy of curation and quality.',
  aboutIntegrityBadge1: 'Authenticity',
  aboutIntegrityBadge2: 'Quality',

  // Contact Page
  contactHeroBadge: 'Get In Touch',
  contactHeroDescription: 'Reach out for personalized assistance.',
  contactFormNamePlaceholder: 'John Doe',
  contactFormEmailPlaceholder: 'john@example.com',
  contactFormSubjectPlaceholder: 'Inquiry about...',
  contactFormMessagePlaceholder: 'How can we help you?',
  contactFormSubmitLabel: 'Send Message',
  contactFormSubmittingLabel: 'Sending...',
  contactFormSuccessMessage: 'Message sent successfully.',
  contactInfoTitle: 'Contact Information',
  contactAddressLabel: 'Address',
  contactEmailLabel: 'Email',
  contactPhoneLabel: 'Phone',
  contactHoursLabel: 'Hours',
  contactFaqTitle: 'Frequently Asked Questions',
  contactSocialTitle: 'Follow Us',
  reviewDefaultName: 'Guest',
  shareCopySuccessMessage: 'Link copied to clipboard.',

  // Products Page
  productsHeroBadge: 'Collection',
  productsHeroDescription: 'Explore our full range of curated assets.',
  productsFilterAll: 'All Items',
  productsEmptyMessage: 'No items found matching your criteria.',
  productsDeptLabel: 'Department',
  productsAllCollectionsLabel: 'All Collections',
  productsBrowseEverythingLabel: 'Browse Everything',
  productsNichesLabel: 'Niches',
  productsClearFilterLabel: 'Clear',
  productsShowAllLabel: 'Show All',
  productsSelectionsLabel: 'Your Selections',
  productRefLabel: 'Ref:',
  sortLatestLabel: 'Latest Arrivals',
  sortPriceLowLabel: 'Price: Low to High',
  sortPriceHighLabel: 'Price: High to Low',
  sortNameLabel: 'Name: A-Z',
  emptyProductsTitle: 'Refinement Required',
  emptyProductsResetLabel: 'Reset Discovery',

  // Product Detail Page
  productNotFoundTitle: 'Piece Not Found',
  productNotFoundCta: 'Return to Collection',
  productPriceLabel: 'Acquisition Value',
  productSpecsLabel: 'Specifications',
  productLastUpdatedLabel: 'Last Updated',
  productMerchantVerifiedLabel: 'Direct Merchant Link Verified',
  productAcquisitionLabel: 'Secure Acquisition',
  reviewSectionTitle: 'Appraisals',
  reviewWriteCta: 'Write Perspective',
  reviewCountLabel: 'Appraisals',
  reviewRatingLabel: 'Rating',
  reviewIdentityLabel: 'Identity',
  reviewIdentityPlaceholder: 'Guest',
  reviewCommentPlaceholder: 'Share your thoughts...',
  reviewSubmitLabel: 'Submit Appraisal',
  reviewSubmittingLabel: 'Processing...',
  emptyReviewsMessage: 'No appraisals yet.',
  relatedProductsTitle: 'You May Also Like',
  modalReturnTitle: 'Return to Product Details',
  modalCloseTitle: 'Close Modal',
  modalSlideLabel: 'Slide',
  modalOfLabel: 'of',
  sharePreviewLabel: 'Deploy Preview',
  shareTitlePrefix: 'Deploy',
  shareTitleSuffix: 'Advert',
  shareSubtitle: 'Asset bundling is complete. Select a channel for deployment.',
  shareLaunchLabel: 'Launch Advert Bundle',
  shareCopiedLabel: 'Copied',
  shareCopyLinkLabel: 'Manual Link Copy',
  shareSecurityLabel: 'Universal Handshake protocol active',

  // Login Page
  loginHeroBadge: 'Secure Access',
  loginHeroTitle: 'Maison Portal',
  loginHeroDescription: 'Authorized personnel only.',
  loginEmailLabel: 'Email Address',
  loginPasswordLabel: 'Password',
  loginEmailPlaceholder: 'admin@example.com',
  loginPasswordPlaceholder: '••••••••',
  loginSubmitLabel: 'Enter Portal',
  loginSubmittingLabel: 'Authenticating...',
  loginGoogleLabel: 'Continue with Google',
  loginBackToSite: 'Back to Site',
  loginSuccessBadge: 'Access Granted',
  loginSuccessTitlePrefix: 'Welcome,',
  loginSuccessTitleSuffix: 'Agent',
  loginSuccessMessage: 'Your credentials have been verified. Redirecting to your dashboard.',
  loginSecurityLabel: 'Secure session established',
  loginDividerLabel: 'or',

  // Admin UI
  adminSaveIndicatorErrorTitle: 'Connection Error',
  adminSaveIndicatorErrorMessage: 'Check cloud configuration.',
  adminSaveIndicatorSuccessTitle: 'System Synced',
  adminSaveIndicatorSuccessMessage: 'Changes successfully recorded.',
  adminUploadLabel: 'Upload',
  adminSocialNewPlatform: 'New Platform',
  adminSocialProfilesLabel: 'Social Profiles',
  adminSocialAddLabel: 'Add',
  adminSocialPlatformPlaceholder: 'Platform Name',
  adminSocialUrlPlaceholder: 'Profile URL',
  adminSocialEmptyMessage: 'No social profiles added.',
  adminFaqNewQuestion: 'New Question',
  adminFaqNewAnswer: 'New Answer',
  adminFaqLabel: 'Frequently Asked Questions',
  adminFaqAddLabel: 'Add FAQ',
  adminFaqQuestionLabel: 'Question',
  adminFaqAnswerLabel: 'Answer',
  adminFaqQuestionPlaceholder: 'e.g. How long does shipping take?',
  adminFaqAnswerPlaceholder: 'Provide a helpful answer...',
  adminFaqEmptyMessage: 'No FAQs added. Use FAQs to reduce common support enquiries.',
  adminTrafficLiveLabel: 'Live Traffic Feed',
  adminTrafficLocationTitle: 'Precise Location',
  adminTrafficTotalHitsLabel: 'Total Hits',
  adminTrafficMapEnlargeLabel: 'Click to Enlarge',
  adminTrafficMapModalTitle: 'Global Traffic Intelligence',
  adminTrafficMapModalSubtitle: 'High-precision geographic distribution of all historical visitors',
  adminTrafficMapModalActiveNode: 'Active Node',
  adminTrafficMapModalNodeDescription: 'Each dot represents a unique interaction session.',
  adminTrafficMapModalCategorizedLabel: 'Categorized Locations',
  adminTrafficMapModalSortedLabel: 'Sorted by interaction volume',
  adminTrafficMapModalInstructions: 'Use mouse wheel to zoom • Drag to pan',
  adminTrafficMapModalVisitorNode: 'Visitor Node',
  adminTrafficMapModalInactiveZone: 'Inactive Zone',
  adminTrafficTableLocationHeader: 'Location (Town/City)',
  adminTrafficTableHitsHeader: 'Hits',
  adminTrafficTableDeviceHeader: 'Device/Source',
  adminTrafficStatusOnline: 'Online',
  adminTrafficEmptyMessage: 'Awaiting Signal',
  adminTrafficEmptyDescription: 'Data populates as visitors access your bridge page.',
  adminDeviceBreakdownTitle: 'Device Breakdown',
  adminDeviceBreakdownSubtitle: 'Platform Distribution',
  adminDeviceShareLabel: 'share',
  adminPermissionOwnerMessage: 'Owners have full system access by default.',
  adminPermissionDeselectAll: 'Deselect All',
  adminPermissionSelectAll: 'Select All',
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Modern Curation',
    subtitle: 'Connecting you to the most influential global trends.',
    cta: 'View Collection'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'High Tech Luxury',
    subtitle: 'Smart solutions for a seamless lifestyle.',
    cta: 'Explore Devices'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Elite Vault',
    subtitle: 'Exclusive handbags and jewelry for the discerning few.',
    cta: 'Shop Accessories'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Accessories', icon: 'Handbag', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800&h=800', description: 'Curated bags and fine jewelry pieces.' },
  { id: 'cat2', name: 'Footwear', icon: 'Heel', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800&h=800', description: 'Step into high-street fashion.' },
  { id: 'cat3', name: 'Smart Life', icon: 'Watch', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800&h=800', description: 'Wearable tech and personal innovation.' },
  { id: 'cat4', name: 'Home Living', icon: 'Package', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=800', description: 'Modern aesthetics for your living space.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Handbags' },
  { id: 'sub2', categoryId: 'cat1', name: 'Jewelry' },
  { id: 'sub3', categoryId: 'cat2', name: 'Luxury Heels' },
  { id: 'sub4', categoryId: 'cat3', name: 'Smartwatches' },
  { id: 'sub5', categoryId: 'cat4', name: 'Kitchen Tech' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Quilted Leather Crossbody',
    sku: 'F-BAG-001',
    price: 12500,
    wasPrice: 14500,
    affiliateLink: 'https://example.com/handbag',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'A timeless quilted masterpiece featuring hand-stitched leather and gold-tone hardware. A staple for any luxury collection.',
    features: ['Premium Calf Leather', 'Gold-plated hardware', 'Versatile chain strap'],
    specifications: { 'Material': 'Calf Leather', 'Style': 'Crossbody' },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', name: 'Handbag', type: 'image/jpeg', size: 0 }],
    reviews: [
      { id: 'r1', userName: 'Sophia L.', rating: 5, comment: 'Absolutely stunning quality. The leather feels so premium and the gold hardware is the perfect touch.', createdAt: Date.now() - 86400000 * 2 },
      { id: 'r2', userName: 'Marcus T.', rating: 4, comment: 'Great bag, very versatile. Only wish the chain was a bit longer, but overall very happy.', createdAt: Date.now() - 86400000 * 5 }
    ],
    tags: [],
    createdAt: Date.now()
  },
  {
    id: 'p2',
    name: 'Midnight Stiletto Pumps',
    sku: 'F-SHOE-002',
    price: 4200,
    affiliateLink: 'https://example.com/shoes',
    categoryId: 'cat2',
    subCategoryId: 'sub3',
    description: 'Sleek midnight black stilettos designed for ultimate poise and confidence.',
    features: ['4-inch heel', 'Suede finish', 'Ergonomic sole'],
    specifications: { 'Heel Height': '10cm', 'Material': 'Suede' },
    media: [{ id: 'm2', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800', name: 'Shoes', type: 'image/jpeg', size: 0 }],
    reviews: [
      { id: 'r3', userName: 'Elena G.', rating: 5, comment: 'These heels are surprisingly comfortable for the height. I wore them all night at a gala!', createdAt: Date.now() - 86400000 * 10 }
    ],
    tags: [],
    createdAt: Date.now()
  },
  {
    id: 'p3',
    name: 'Horizon Smartwatch Pro',
    sku: 'F-TECH-003',
    price: 8999,
    wasPrice: 11000,
    affiliateLink: 'https://example.com/watch',
    categoryId: 'cat3',
    subCategoryId: 'sub4',
    description: 'The intersection of technology and design. Stay connected without compromising on aesthetic.',
    features: ['OLED Display', 'Health Monitoring', '7-day Battery'],
    specifications: { 'Case': 'Titanium', 'Water Resistance': '50m' },
    media: [{ id: 'm3', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800', name: 'Smartwatch', type: 'image/jpeg', size: 0 }],
    reviews: [
      { id: 'r4', userName: 'David K.', rating: 5, comment: 'The OLED display is crisp and the battery life actually lasts a full week. Best tech purchase this year.', createdAt: Date.now() - 86400000 * 1 }
    ],
    tags: [],
    createdAt: Date.now()
  },
  {
    id: 'p4',
    name: 'Ascendance Diamond Pendant',
    sku: 'F-JEWL-004',
    price: 15000,
    affiliateLink: 'https://example.com/jewelry',
    categoryId: 'cat1',
    subCategoryId: 'sub2',
    description: 'A brilliant-cut diamond set in 18k white gold. Simply breathtaking.',
    features: ['18k White Gold', 'Conflict-free diamond', 'Certificate included'],
    specifications: { 'Carat': '0.5', 'Clarity': 'VVS1' },
    media: [{ id: 'm4', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800', name: 'Jewelry', type: 'image/jpeg', size: 0 }],
    tags: [],
    createdAt: Date.now()
  },
  {
    id: 'p5',
    name: 'Smeg Retro Kettle - Cream',
    sku: 'F-HOME-005',
    price: 3499,
    wasPrice: 4200,
    affiliateLink: 'https://example.com/kettle',
    categoryId: 'cat4',
    subCategoryId: 'sub5',
    description: 'The iconic Smeg 50s style retro kettle. A perfect blend of technology and classic design.',
    features: ['Retro Aesthetic', 'Stainless steel body', 'Auto shut-off'],
    specifications: { 'Capacity': '1.7L', 'Style': '50s Retro' },
    media: [{ id: 'm5', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', name: 'Smeg Kettle', type: 'image/jpeg', size: 0 }],
    reviews: [
      { id: 'r5', userName: 'Olivia W.', rating: 4, comment: 'Looks amazing in my kitchen. It boils quickly, though it is a bit louder than my previous one.', createdAt: Date.now() - 86400000 * 15 }
    ],
    tags: [],
    createdAt: Date.now()
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm1',
    title: 'Instagram Aesthetic Curation',
    platform: 'Instagram',
    description: 'Master the art of visual storytelling on Instagram to drive high-intent traffic to your bridge page.',
    strategies: [
      'Use high-contrast editorial photography.',
      'Maintain a consistent color palette aligned with your brand.',
      'Utilize Instagram Stories for "New Drop" alerts with direct links.'
    ],
    actionItems: [
      'Create 5 "Outfit of the Day" reels.',
      'Set up your bridge page URL in bio.',
      'Engage with 20 niche-related accounts daily.'
    ],
    icon: 'Instagram',
    steps: []
  },
  {
    id: 'tm2',
    title: 'Pinterest Viral Pins Strategy',
    platform: 'Pinterest',
    description: 'Pinterest is a search engine. Learn how to create evergreen traffic using aesthetic product pins.',
    strategies: [
      'Create vertical pins (2:3 ratio) for maximum visibility.',
      'Use keywords in pin titles and descriptions (SEO).',
      'Organize pins into niche-specific boards.'
    ],
    actionItems: [
      'Design 10 high-quality pins using the Ad Generator.',
      'Schedule pins during peak engagement hours.',
      'Join 3 group boards in the fashion niche.'
    ],
    icon: 'Pin',
    steps: []
  }
];
