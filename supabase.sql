-- MASTER ARCHITECTURE SCRIPT v8.0 (SEO, Integrations & Security Ready)
-- This script is IDEMPOTENT: You can run it multiple times without wiping your existing data.
-- It uses "IF NOT EXISTS" and "ON CONFLICT DO NOTHING" to preserve your database state.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLES
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  -- Brand Identity
  "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT,
  "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT,
  "faviconUrl" TEXT, "ogImageUrl" TEXT,
  
  -- Navigation & Layout
  "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navContactLabel" TEXT, "navDashboardLabel" TEXT,
  "navStyle" TEXT, "navStickyHeader" BOOLEAN DEFAULT TRUE,
  "departmentsLayout" TEXT, "subcategoryLayout" TEXT, "categoryCardStyle" TEXT,
  
  -- Contact & Footer
  "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT,
  "socialLinks" JSONB, "contactFaqs" JSONB, "footerDescription" TEXT, "footerCopyrightText" TEXT,
  "footerNavHeader" TEXT, "footerPolicyHeader" TEXT, "footerCreatorRole" TEXT, "footerSocialsLabel" TEXT,
  
  -- Home Page
  "homeHeroBadge" TEXT, "homeHeroTitle" TEXT, "homeHeroSubtitle" TEXT,
  "homeAboutTitle" TEXT, "homeAboutDescription" TEXT, "homeAboutImage" TEXT, "homeAboutCta" TEXT,
  "homeCategorySectionTitle" TEXT, "homeCategorySectionSubtitle" TEXT, 
  "homeNicheHeader" TEXT, "homeNicheSubheader" TEXT, "homeNicheDescription" TEXT,
  "homeTrustHeader" TEXT, "homeTrustSubheader" TEXT, "homeTrustSectionTitle" TEXT, "homeTrustBadge" TEXT, "homeTrustTitle" TEXT, "homeTrustDescription" TEXT, "homeTrustCta" TEXT,
  "homeTrustItem1Title" TEXT, "homeTrustItem1Desc" TEXT, "homeTrustItem1Icon" TEXT,
  "homeTrustItem2Title" TEXT, "homeTrustItem2Desc" TEXT, "homeTrustItem2Icon" TEXT,
  "homeTrustItem3Title" TEXT, "homeTrustItem3Desc" TEXT, "homeTrustItem3Icon" TEXT,
  "homeReadStoryBtn" TEXT, "homeAboutCuratorLabel" TEXT, "homeAboutNarrativeLabel" TEXT,
  "homeCategoryShopByLabel" TEXT, "homeCategoryPortfolioLabel" TEXT, "homeCategoryDiscoverLabel" TEXT,
  
  -- Collections Page
  "productsHeroBadge" TEXT, "productsHeroTitle" TEXT, "productsHeroSubtitle" TEXT, "productsHeroDescription" TEXT, "productsHeroImage" TEXT, "productsHeroImages" JSONB, "productsHeroImagesArray" JSONB,
  "productsSearchPlaceholder" TEXT, "productsFilterAll" TEXT, "productsEmptyMessage" TEXT,
  "productsDeptLabel" TEXT, "productsAllCollectionsLabel" TEXT, "productsBrowseEverythingLabel" TEXT, "productsNichesLabel" TEXT, "productsClearFilterLabel" TEXT, "productsShowAllLabel" TEXT, "productsSelectionsLabel" TEXT, "productRefLabel" TEXT,
  "sortLatestLabel" TEXT, "sortPriceLowLabel" TEXT, "sortPriceHighLabel" TEXT, "sortNameLabel" TEXT,
  "emptyProductsTitle" TEXT, "emptyProductsResetLabel" TEXT,
  "productNotFoundTitle" TEXT, "productNotFoundCta" TEXT, "productPriceLabel" TEXT, "productSpecsLabel" TEXT, "productLastUpdatedLabel" TEXT, "productMerchantVerifiedLabel" TEXT, "productAcquisitionLabel" TEXT,
  "reviewSectionTitle" TEXT, "reviewWriteCta" TEXT, "reviewCountLabel" TEXT, "reviewRatingLabel" TEXT, "reviewIdentityLabel" TEXT, "reviewIdentityPlaceholder" TEXT, "reviewCommentPlaceholder" TEXT, "reviewSubmitLabel" TEXT, "reviewSubmittingLabel" TEXT, "emptyReviewsMessage" TEXT,
  "relatedProductsTitle" TEXT, "modalReturnTitle" TEXT, "modalCloseTitle" TEXT, "modalSlideLabel" TEXT, "modalOfLabel" TEXT,
  "sharePreviewLabel" TEXT, "shareTitlePrefix" TEXT, "shareTitleSuffix" TEXT, "shareSubtitle" TEXT, "shareLaunchLabel" TEXT, "shareCopiedLabel" TEXT, "shareCopyLinkLabel" TEXT, "shareSecurityLabel" TEXT,
  
  -- About Page
  "aboutHeroBadge" TEXT, "aboutHeroTitle" TEXT, "aboutHeroSubtitle" TEXT, "aboutHeroDescription" TEXT, "aboutMainImage" TEXT,
  "aboutEstablishedYear" TEXT, "aboutEstablishedDate" BIGINT, "aboutFounderName" TEXT, "aboutLocation" TEXT,
  "aboutHistoryBadge" TEXT, "aboutHistoryTitle" TEXT, "aboutHistoryBody" TEXT, "aboutManifestoBadge" TEXT, "aboutManifestoTitle" TEXT,
  "aboutMissionTitle" TEXT, "aboutMissionBody" TEXT, "aboutMissionIcon" TEXT,
  "aboutCommunityTitle" TEXT, "aboutCommunityBody" TEXT, "aboutCommunityIcon" TEXT,
  "aboutIntegrityTitle" TEXT, "aboutIntegrityBody" TEXT, "aboutIntegrityIcon" TEXT, "aboutIntegrityBadge1" TEXT, "aboutIntegrityBadge2" TEXT,
  "aboutSignatureImage" TEXT, "aboutGalleryImages" JSONB, "aboutEstLabel" TEXT, "aboutVerifiedNarrativeLabel" TEXT,
  "aboutCuratorsEditTitle" TEXT, "aboutCuratorsEditDesc" TEXT, "aboutExploreCollectionBtn" TEXT, "aboutPortfolioVerifiedLabel" TEXT,
  
  -- Contact Page
  "contactHeroBadge" TEXT, "contactHeroTitle" TEXT, "contactHeroSubtitle" TEXT, "contactHeroDescription" TEXT,
  "contactFormNameLabel" TEXT, "contactFormEmailLabel" TEXT, "contactFormSubjectLabel" TEXT, "contactFormMessageLabel" TEXT, "contactFormButtonText" TEXT,
  "contactFormNamePlaceholder" TEXT, "contactFormEmailPlaceholder" TEXT, "contactFormSubjectPlaceholder" TEXT, "contactFormMessagePlaceholder" TEXT,
  "contactFormSubmitLabel" TEXT, "contactFormSubmittingLabel" TEXT, "contactFormSuccessMessage" TEXT,
  "contactSuccessTitle" TEXT, "contactConciergeLabel" TEXT, "contactSuccessMessage" TEXT, "contactSubmitNewBtn" TEXT,
  "contactVerifiedLabel" TEXT, "contactWhatsappLabel" TEXT, "contactFollowUsLabel" TEXT, "contactFaqTitle" TEXT, "contactLastUpdatedLabel" TEXT,
  "contactInfoTitle" TEXT, "contactAddressLabel" TEXT, "contactEmailLabel" TEXT, "contactPhoneLabel" TEXT, "contactHoursLabel" TEXT, "contactHoursWeekdays" TEXT, "contactHoursWeekends" TEXT, "contactSocialTitle" TEXT,
  
  -- Admin Login Experience
  "adminLoginHeroImage" TEXT, "adminLoginAccentEnabled" BOOLEAN DEFAULT FALSE,
  "adminLoginHeroBadge" TEXT, "adminLoginHeroTitle" TEXT, "adminLoginHeroDescription" TEXT,
  "adminLoginEmailLabel" TEXT, "adminLoginPasswordLabel" TEXT, "adminLoginEmailPlaceholder" TEXT, "adminLoginPasswordPlaceholder" TEXT,
  "adminLoginSubmitLabel" TEXT, "adminLoginSubmittingLabel" TEXT, "adminLoginGoogleLabel" TEXT, "adminLoginBackToSite" TEXT, "adminLoginDividerLabel" TEXT,
  
  -- Client Login Experience
  "clientLoginHeroBadge" TEXT, "clientLoginHeroTitle" TEXT, "clientLoginHeroDescription" TEXT,
  "clientLoginEmailLabel" TEXT, "clientLoginPasswordLabel" TEXT, "clientLoginEmailPlaceholder" TEXT, "clientLoginPasswordPlaceholder" TEXT,
  "clientLoginSubmitLabel" TEXT, "clientLoginSubmittingLabel" TEXT, "clientLoginGoogleLabel" TEXT, "clientLoginBackToSite" TEXT,
  "clientLoginHeroImage" TEXT, "clientLoginSuccessBadge" TEXT, "clientLoginSuccessTitlePrefix" TEXT, "clientLoginSuccessTitleSuffix" TEXT,
  "clientLoginSuccessMessage" TEXT, "clientLoginSecurityLabel" TEXT, "clientLoginDividerLabel" TEXT, "clientLoginRegistrationEnabled" BOOLEAN DEFAULT TRUE,
  
  -- Legal & Policy
  "disclosureTitle" TEXT, "disclosureContent" TEXT, "privacyTitle" TEXT, "privacyContent" TEXT, "termsTitle" TEXT, "termsContent" TEXT,
  
  -- Integrations & SEO
  "emailJsServiceId" TEXT, "emailJsTemplateId" TEXT, "emailJsPublicKey" TEXT,
  "googleAnalyticsId" TEXT, "googleTagManagerId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "pinterestTagId" TEXT, "amazonAssociateId" TEXT, "webhookUrl" TEXT, "gscVerificationId" TEXT,
  "customHeaderScripts" TEXT, "customFooterScripts" TEXT, "seoTitle" TEXT, "seoDescription" TEXT, "seoOgImage" TEXT,
  "enableSchemaMarkup" BOOLEAN DEFAULT FALSE, "schemaType" TEXT, "customSchemaJson" TEXT,
  "localBusinessName" TEXT, "localBusinessAddress" TEXT, "localBusinessPhone" TEXT, "localBusinessOpeningHours" TEXT, "localBusinessCountry" TEXT,
  "localBusinessLat" NUMERIC, "localBusinessLng" NUMERIC, "localBusinessWebsite" TEXT, "localBusinessCategory" TEXT,
  "robotsGeneratedAt" BIGINT, "sitemapGeneratedAt" BIGINT, "robotsStatus" TEXT DEFAULT 'pending', "sitemapStatus" TEXT DEFAULT 'pending',
  "seoAutoCleanUrls" BOOLEAN DEFAULT TRUE, "seoEnableLazyLoading" BOOLEAN DEFAULT TRUE, "seoRequireAltText" BOOLEAN DEFAULT FALSE, "seoAutoRelatedProducts" BOOLEAN DEFAULT TRUE,
  "seoForceHttps" BOOLEAN DEFAULT TRUE, "seoEnableCanonicalTags" BOOLEAN DEFAULT TRUE, "seoShowLastUpdated" BOOLEAN DEFAULT TRUE,
  
  -- System State
  "isMaintenanceMode" BOOLEAN DEFAULT FALSE, "maintenanceTitle" TEXT, "maintenanceMessage" TEXT, "loadingMessage" TEXT,
  "faviconUrl" TEXT, "ogImageUrl" TEXT, "navStickyHeader" BOOLEAN DEFAULT TRUE, "homeHeroTitle" TEXT, "homeHeroSubtitle" TEXT, "clientLoginRegistrationEnabled" BOOLEAN DEFAULT TRUE, "adminLoginDividerLabel" TEXT
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
CREATE TABLE IF NOT EXISTS clients (id TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, address TEXT, company TEXT, status TEXT, "profileImage" TEXT, "createdAt" BIGINT, "lastActive" BIGINT, notes TEXT, "buildingNumber" TEXT, "streetName" TEXT, "suburb" TEXT, "city" TEXT, "province" TEXT, "postalCode" TEXT, "country" TEXT, "newsletter" BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS wishlist (id TEXT PRIMARY KEY, "userId" TEXT, "productId" TEXT, "createdAt" BIGINT);
CREATE TABLE IF NOT EXISTS site_reviews (id TEXT PRIMARY KEY, "userId" TEXT, "userName" TEXT, rating NUMERIC, comment TEXT, "createdAt" BIGINT, status TEXT DEFAULT 'pending');

-- 2. INITIAL DATA & SEO DEFAULTS
INSERT INTO settings (id, "companyName", slogan, "primaryColor") 
VALUES ('global', 'My Store', 'Curated Collection', '#E5C1CD')
ON CONFLICT (id) DO NOTHING;

-- Add missing columns to settings table if they don't exist (Safety Layer)
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
ADD COLUMN IF NOT EXISTS "categoryCardStyle" TEXT,
ADD COLUMN IF NOT EXISTS "navStyle" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginHeroBadge" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginHeroTitle" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginHeroDescription" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginEmailLabel" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginPasswordLabel" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginEmailPlaceholder" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginPasswordPlaceholder" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginSubmitLabel" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginSubmittingLabel" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginGoogleLabel" TEXT,
ADD COLUMN IF NOT EXISTS "adminLoginBackToSite" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginHeroBadge" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginHeroTitle" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginHeroDescription" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginEmailLabel" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginPasswordLabel" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginEmailPlaceholder" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginPasswordPlaceholder" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginSubmitLabel" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginSubmittingLabel" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginGoogleLabel" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginBackToSite" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginHeroImage" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginSuccessBadge" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginSuccessTitlePrefix" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginSuccessTitleSuffix" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginSuccessMessage" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginSecurityLabel" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginDividerLabel" TEXT,
ADD COLUMN IF NOT EXISTS "gscVerificationId" TEXT,
ADD COLUMN IF NOT EXISTS "customHeaderScripts" TEXT,
ADD COLUMN IF NOT EXISTS "customFooterScripts" TEXT,
ADD COLUMN IF NOT EXISTS "emailJsServiceId" TEXT,
ADD COLUMN IF NOT EXISTS "emailJsTemplateId" TEXT,
ADD COLUMN IF NOT EXISTS "emailJsPublicKey" TEXT,
ADD COLUMN IF NOT EXISTS "faviconUrl" TEXT,
ADD COLUMN IF NOT EXISTS "ogImageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "navStickyHeader" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "homeHeroTitle" TEXT,
ADD COLUMN IF NOT EXISTS "homeHeroSubtitle" TEXT,
ADD COLUMN IF NOT EXISTS "clientLoginRegistrationEnabled" BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS "adminLoginDividerLabel" TEXT;

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS "emailJsWelcomeTemplateId" TEXT,
  ADD COLUMN IF NOT EXISTS "emailJsOrderTemplateId" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSaveIndicatorErrorTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSaveIndicatorErrorMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSaveIndicatorSuccessTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSaveIndicatorSuccessMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "adminUploadLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSocialNewPlatform" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSocialProfilesLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSocialAddLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSocialPlatformPlaceholder" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSocialUrlPlaceholder" TEXT,
  ADD COLUMN IF NOT EXISTS "adminSocialEmptyMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqNewQuestion" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqNewAnswer" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqAddLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqQuestionLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqAnswerLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqQuestionPlaceholder" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqAnswerPlaceholder" TEXT,
  ADD COLUMN IF NOT EXISTS "adminFaqEmptyMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficLiveLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficLocationTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficTotalHitsLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapEnlargeLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalSubtitle" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalActiveNode" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalNodeDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalCategorizedLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalSortedLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalInstructions" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalVisitorNode" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficMapModalInactiveZone" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficTableLocationHeader" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficTableHitsHeader" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficTableDeviceHeader" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficStatusOnline" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficEmptyMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "adminTrafficEmptyDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "adminDeviceBreakdownTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "adminDeviceBreakdownSubtitle" TEXT,
  ADD COLUMN IF NOT EXISTS "adminDeviceShareLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "adminPermissionOwnerMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "adminPermissionDeselectAll" TEXT,
  ADD COLUMN IF NOT EXISTS "adminPermissionSelectAll" TEXT,
  ADD COLUMN IF NOT EXISTS "reviewDefaultName" TEXT,
  ADD COLUMN IF NOT EXISTS "shareCopySuccessMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "loginHeroBadge" TEXT,
  ADD COLUMN IF NOT EXISTS "loginHeroTitle" TEXT,
  ADD COLUMN IF NOT EXISTS "loginHeroDescription" TEXT,
  ADD COLUMN IF NOT EXISTS "loginEmailLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "loginPasswordLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "loginEmailPlaceholder" TEXT,
  ADD COLUMN IF NOT EXISTS "loginPasswordPlaceholder" TEXT,
  ADD COLUMN IF NOT EXISTS "loginSubmitLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "loginSubmittingLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "loginGoogleLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "loginBackToSite" TEXT,
  ADD COLUMN IF NOT EXISTS "loginSuccessBadge" TEXT,
  ADD COLUMN IF NOT EXISTS "loginSuccessTitlePrefix" TEXT,
  ADD COLUMN IF NOT EXISTS "loginSuccessTitleSuffix" TEXT,
  ADD COLUMN IF NOT EXISTS "loginSuccessMessage" TEXT,
  ADD COLUMN IF NOT EXISTS "loginSecurityLabel" TEXT,
  ADD COLUMN IF NOT EXISTS "loginDividerLabel" TEXT;

ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS "buildingNumber" TEXT,
ADD COLUMN IF NOT EXISTS "streetName" TEXT,
ADD COLUMN IF NOT EXISTS "suburb" TEXT,
ADD COLUMN IF NOT EXISTS "city" TEXT,
ADD COLUMN IF NOT EXISTS "province" TEXT,
ADD COLUMN IF NOT EXISTS "postalCode" TEXT,
ADD COLUMN IF NOT EXISTS "country" TEXT,
ADD COLUMN IF NOT EXISTS "newsletter" BOOLEAN DEFAULT FALSE;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS "wasPrice" NUMERIC,
ADD COLUMN IF NOT EXISTS "affiliateLink" TEXT,
ADD COLUMN IF NOT EXISTS "categoryId" TEXT,
ADD COLUMN IF NOT EXISTS "subCategoryId" TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS features JSONB,
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS media JSONB,
ADD COLUMN IF NOT EXISTS "discountRules" JSONB,
ADD COLUMN IF NOT EXISTS reviews JSONB,
ADD COLUMN IF NOT EXISTS tags JSONB,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT,
ADD COLUMN IF NOT EXISTS "createdBy" TEXT,
ADD COLUMN IF NOT EXISTS "archivedAt" BIGINT;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS "orderNumber" TEXT,
ADD COLUMN IF NOT EXISTS "clientId" TEXT,
ADD COLUMN IF NOT EXISTS status TEXT,
ADD COLUMN IF NOT EXISTS items JSONB,
ADD COLUMN IF NOT EXISTS "totalAmount" NUMERIC,
ADD COLUMN IF NOT EXISTS "shippingAddress" TEXT,
ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT,
ADD COLUMN IF NOT EXISTS "updatedAt" BIGINT;

ALTER TABLE enquiries
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT,
ADD COLUMN IF NOT EXISTS status TEXT;

ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS role TEXT,
ADD COLUMN IF NOT EXISTS permissions JSONB,
ADD COLUMN IF NOT EXISTS "password" TEXT,
ADD COLUMN IF NOT EXISTS "autoWipeExempt" BOOLEAN,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT,
ADD COLUMN IF NOT EXISTS "lastActive" BIGINT,
ADD COLUMN IF NOT EXISTS "profileImage" TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

ALTER TABLE subcategories
ADD COLUMN IF NOT EXISTS "categoryId" TEXT,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

ALTER TABLE hero_slides
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS subtitle TEXT,
ADD COLUMN IF NOT EXISTS cta TEXT,
ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

ALTER TABLE traffic_logs
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS text TEXT,
ADD COLUMN IF NOT EXISTS time TEXT,
ADD COLUMN IF NOT EXISTS timestamp BIGINT,
ADD COLUMN IF NOT EXISTS source TEXT;

ALTER TABLE product_stats
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "totalViewTime" NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lastUpdated" BIGINT;

ALTER TABLE training_modules
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT,
ADD COLUMN IF NOT EXISTS strategies JSONB,
ADD COLUMN IF NOT EXISTS "actionItems" JSONB,
ADD COLUMN IF NOT EXISTS steps JSONB,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT,
ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

ALTER TABLE product_history
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS "wasPrice" NUMERIC,
ADD COLUMN IF NOT EXISTS "affiliateLink" TEXT,
ADD COLUMN IF NOT EXISTS "categoryId" TEXT,
ADD COLUMN IF NOT EXISTS "subCategoryId" TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS features JSONB,
ADD COLUMN IF NOT EXISTS specifications JSONB,
ADD COLUMN IF NOT EXISTS media JSONB,
ADD COLUMN IF NOT EXISTS "discountRules" JSONB,
ADD COLUMN IF NOT EXISTS reviews JSONB,
ADD COLUMN IF NOT EXISTS tags JSONB,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT,
ADD COLUMN IF NOT EXISTS "createdBy" TEXT,
ADD COLUMN IF NOT EXISTS "archivedAt" BIGINT;

ALTER TABLE system_logs
ADD COLUMN IF NOT EXISTS timestamp BIGINT,
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS target TEXT,
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS "sizeBytes" NUMERIC,
ADD COLUMN IF NOT EXISTS status TEXT;

ALTER TABLE wishlist
ADD COLUMN IF NOT EXISTS "userId" TEXT,
ADD COLUMN IF NOT EXISTS "productId" TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT;

ALTER TABLE site_reviews
ADD COLUMN IF NOT EXISTS "userId" TEXT,
ADD COLUMN IF NOT EXISTS "userName" TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC,
ADD COLUMN IF NOT EXISTS comment TEXT,
ADD COLUMN IF NOT EXISTS "createdAt" BIGINT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Update defaults without overwriting existing data
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

-- Ensure system administrator exists
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
    -- DROP ALL POLICIES FIRST TO ENSURE CLEAN RECREATION
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

  INSERT INTO public.clients (id, email, name, phone, "createdAt", "buildingNumber", "streetName", "suburb", "city", "province", "postalCode", "country", "newsletter")
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    EXTRACT(EPOCH FROM now()) * 1000,
    new.raw_user_meta_data->>'buildingNumber',
    new.raw_user_meta_data->>'streetName',
    new.raw_user_meta_data->>'suburb',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'province',
    new.raw_user_meta_data->>'postalCode',
    new.raw_user_meta_data->>'country',
    COALESCE((new.raw_user_meta_data->>'newsletter')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
