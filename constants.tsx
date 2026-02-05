
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
    .brand-subtitle { color: #D4AF37; font-size: 10px; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px; font-weight: 700; display: block; }
    
    /* CONTENT */
    .content { padding: 40px; background-color: #FFFFFF; }
    .greeting { font-size: 20px; font-weight: 600; color: #1E293B; margin-bottom: 20px; font-family: 'Playfair Display', serif; }
    .message-body { font-size: 15px; color: #475569; line-height: 1.8; white-space: pre-wrap; margin-bottom: 30px; }
    
    /* BUTTON */
    .btn-container { text-align: center; margin: 35px 0; }
    .btn { display: inline-block; background-color: #D4AF37; color: #FFFFFF; padding: 18px 36px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; border-radius: 50px; box-shadow: 0 10px 20px -5px rgba(212, 175, 55, 0.4); }
    
    /* FOOTER */
    .footer { background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer-text { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
    .address { color: #cbd5e1; font-size: 10px; line-height: 1.5; margin-top: 10px; }
    .socials { margin-top: 20px; }
    .social-link { color: #D4AF37; font-size: 11px; text-decoration: none; margin: 0 10px; font-weight: 700; }
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
    title: '1. Strategic Niche Brief',
    description: 'Establish your bridge page\'s aesthetic territory. Define a high-commission niche like Luxury Home Decor or Sustainable Fashion.',
    illustrationId: 'rocket',
    subSteps: [
      'Select a high-intent niche with strong affiliate ROI.',
      'Define your unique "Curator Persona" and brand voice.',
      'Gather high-fidelity hero imagery (2000px+ width).',
      'Draft your core mission statement for the About section.'
    ]
  },
  {
    id: 'supabase-init',
    title: '2. Cloud Synchronization (Supabase)',
    description: 'Set up your real-time database infrastructure. This allows your collections and analytics to stay synced across every visitor session.',
    illustrationId: 'forge',
    subSteps: [
      'Create a free project at Supabase.com.',
      'Name your project (e.g., "Findara Bridge v1").',
      'Note your Database Password for secure access.',
      'Locate API credentials in Settings > API (URL & Anon Key).'
    ]
  },
  {
    id: 'database',
    title: '3. Master Architecture Script (SQL)',
    description: 'Deploy the complete data schema. This creates the internal tables and handles migrations for new UI features like the Login visualizer.',
    illustrationId: 'rocket',
    subSteps: [
      'Open the SQL Editor in your Supabase dashboard.',
      'Paste the Master SQL v7.0 script provided below.',
      'Click "Run" and verify 11 tables appear.',
      'This script safely adds missing columns if you are upgrading.'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v7.0 (Safe Migration & Sync Fix)
-- This script ensures all columns for Login/Pinterest/Analytics exist.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BASE TABLE CREATION
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT,
  "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT,
  "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navContactLabel" TEXT, "navDashboardLabel" TEXT,
  "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT,
  "socialLinks" JSONB, "contactFaqs" JSONB, "footerDescription" TEXT, "footerCopyrightText" TEXT,
  "footerNavHeader" TEXT, "footerPolicyHeader" TEXT,
  "homeHeroBadge" TEXT, "homeAboutTitle" TEXT, "homeAboutDescription" TEXT, "homeAboutImage" TEXT, "homeAboutCta" TEXT,
  "homeCategorySectionTitle" TEXT, "homeCategorySectionSubtitle" TEXT, "homeNicheHeader" TEXT, "homeNicheSubheader" TEXT,
  "homeTrustHeader" TEXT, "homeTrustSubheader" TEXT, "homeTrustSectionTitle" TEXT,
  "homeTrustItem1Title" TEXT, "homeTrustItem1Desc" TEXT, "homeTrustItem1Icon" TEXT,
  "homeTrustItem2Title" TEXT, "homeTrustItem2Desc" TEXT, "homeTrustItem2Icon" TEXT,
  "homeTrustItem3Title" TEXT, "homeTrustItem3Desc" TEXT, "homeTrustItem3Icon" TEXT,
  "productsHeroTitle" TEXT, "productsHeroSubtitle" TEXT, "productsHeroImage" TEXT, "productsHeroImages" TEXT[], "productsSearchPlaceholder" TEXT,
  "productAcquisitionLabel" TEXT, "productSpecsLabel" TEXT,
  "aboutHeroTitle" TEXT, "aboutHeroSubtitle" TEXT, "aboutMainImage" TEXT,
  "aboutEstablishedYear" TEXT, "aboutFounderName" TEXT, "aboutLocation" TEXT,
  "aboutHistoryTitle" TEXT, "aboutHistoryBody" TEXT, "aboutMissionTitle" TEXT, "aboutMissionBody" TEXT, "aboutMissionIcon" TEXT,
  "aboutCommunityTitle" TEXT, "aboutCommunityBody" TEXT, "aboutCommunityIcon" TEXT,
  "aboutIntegrityTitle" TEXT, "aboutIntegrityBody" TEXT, "aboutIntegrityIcon" TEXT,
  "aboutSignatureImage" TEXT, "aboutGalleryImages" TEXT[],
  "contactHeroTitle" TEXT, "contactHeroSubtitle" TEXT, "contactFormNameLabel" TEXT, "contactFormEmailLabel" TEXT, "contactFormSubjectLabel" TEXT, "contactFormMessageLabel" TEXT, "contactFormButtonText" TEXT,
  "contactInfoTitle" TEXT, "contactAddressLabel" TEXT, "contactHoursLabel" TEXT, "contactHoursWeekdays" TEXT, "contactHoursWeekends" TEXT,
  "adminLoginHeroImage" TEXT, "adminLoginTitle" TEXT, "adminLoginSubtitle" TEXT, "adminLoginAccentEnabled" BOOLEAN,
  "disclosureTitle" TEXT, "disclosureContent" TEXT, "privacyTitle" TEXT, "privacyContent" TEXT, "termsTitle" TEXT, "termsContent" TEXT,
  "emailJsServiceId" TEXT, "emailJsTemplateId" TEXT, "emailJsPublicKey" TEXT,
  "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "webhookUrl" TEXT, "pinterestTagId" TEXT
);

-- 2. SCHEMA MIGRATION (Ensure new columns exist if table was already created)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='adminLoginHeroImage') THEN
    ALTER TABLE settings ADD COLUMN "adminLoginHeroImage" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='adminLoginTitle') THEN
    ALTER TABLE settings ADD COLUMN "adminLoginTitle" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='adminLoginSubtitle') THEN
    ALTER TABLE settings ADD COLUMN "adminLoginSubtitle" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='adminLoginAccentEnabled') THEN
    ALTER TABLE settings ADD COLUMN "adminLoginAccentEnabled" BOOLEAN DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='pinterestTagId') THEN
    ALTER TABLE settings ADD COLUMN "pinterestTagId" TEXT;
  END IF;
END $$;

-- 3. ENSURE SINGLE ROW PROTOCOL
-- Delete any duplicate settings rows to prevent state-jumping
DELETE FROM settings WHERE id != (SELECT id FROM settings ORDER BY id LIMIT 1);
UPDATE settings SET id = 'global' WHERE id IS NOT NULL;

-- 4. CREATE SUPPORTING TABLES
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT, "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features TEXT[], specifications JSONB, media JSONB, "discountRules" JSONB, reviews JSONB, "createdAt" BIGINT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, icon TEXT, image TEXT, description TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY, "categoryId" TEXT, name TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY, image TEXT, type TEXT, title TEXT, subtitle TEXT, cta TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT, email TEXT, whatsapp TEXT, subject TEXT, message TEXT, "createdAt" BIGINT, status TEXT);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, permissions TEXT[], "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT, source TEXT);
CREATE TABLE IF NOT EXISTS product_stats ( "productId" TEXT PRIMARY KEY, views INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, "totalViewTime" NUMERIC DEFAULT 0, "lastUpdated" BIGINT );
CREATE TABLE IF NOT EXISTS training_modules (id TEXT PRIMARY KEY, title TEXT, platform TEXT, description TEXT, icon TEXT, strategies TEXT[], "actionItems" TEXT[], steps JSONB, "createdAt" BIGINT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS product_history (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT, "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features TEXT[], specifications JSONB, media JSONB, "discountRules" JSONB, reviews JSONB, "createdAt" BIGINT, "createdBy" TEXT, "archivedAt" BIGINT);

-- 5. ENABLE RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_history ENABLE ROW LEVEL SECURITY;

-- 6. PUBLIC POLICIES
DROP POLICY IF EXISTS "Public Read settings" ON settings;
CREATE POLICY "Public Read settings" ON settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read products" ON products;
CREATE POLICY "Public Read products" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read hero" ON hero_slides;
CREATE POLICY "Public Read hero" ON hero_slides FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read cat" ON categories;
CREATE POLICY "Public Read cat" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read sub" ON subcategories;
CREATE POLICY "Public Read sub" ON subcategories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read stats" ON product_stats;
CREATE POLICY "Public Read stats" ON product_stats FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read training" ON training_modules;
CREATE POLICY "Public Read training" ON training_modules FOR SELECT USING (true);

-- 7. FULL ANONYMOUS ACCESS (DASHBOARD)
DROP POLICY IF EXISTS "Enable all for anon settings" ON settings;
CREATE POLICY "Enable all for anon settings" ON settings FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon products" ON products;
CREATE POLICY "Enable all for anon products" ON products FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon hero" ON hero_slides;
CREATE POLICY "Enable all for anon hero" ON hero_slides FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon cat" ON categories;
CREATE POLICY "Enable all for anon cat" ON categories FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon sub" ON subcategories;
CREATE POLICY "Enable all for anon sub" ON subcategories FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon enquiries" ON enquiries;
CREATE POLICY "Enable all for anon enquiries" ON enquiries FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon logs" ON traffic_logs;
CREATE POLICY "Enable all for anon logs" ON traffic_logs FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon admins" ON admin_users;
CREATE POLICY "Enable all for anon admins" ON admin_users FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon stats" ON product_stats;
CREATE POLICY "Enable all for anon stats" ON product_stats FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon training" ON training_modules;
CREATE POLICY "Enable all for anon training" ON training_modules FOR ALL USING (true);
DROP POLICY IF EXISTS "Enable all for anon history" ON product_history;
CREATE POLICY "Enable all for anon history" ON product_history FOR ALL USING (true);`,
    codeLabel: 'Master Schema v7.0'
  },
  {
    id: 'security-auth',
    title: '4. Identity & Auth Protocol',
    description: 'Configure how your team accesses the Maison Portal. This secures your catalog from unauthorized modifications.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Authentication > Providers in Supabase.',
      'Enable "Email" for standard team access.',
      'Enable "Google" OAuth for one-click curator login.',
      'Disable "Confirm Email" if you want instant staff onboarding.'
    ]
  },
  {
    id: 'asset-vault',
    title: '5. Asset Vault (Cloud Storage)',
    description: 'Establish a high-speed CDN for your product imagery and cinematic videos.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to Storage in your Supabase dashboard.',
      'Create a new Bucket exactly named "media".',
      'Set the bucket to "Public" visibility.',
      'Create an access policy allowing all operations for testing.'
    ]
  },
  {
    id: 'local-infrastructure',
    title: '6. Environment Configuration',
    description: 'Link your bridge page engine to your cloud database using environment variables.',
    illustrationId: 'forge',
    subSteps: [
      'Create a ".env" file in your project root.',
      'Copy your Supabase URL and Public Anon Key.',
      'Paste them using the exact keys: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      'Restart your local development server.'
    ],
    code: 'VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-public-key-here',
    codeLabel: '.env Template'
  },
  {
    id: 'version-control',
    title: '7. Version Control & Git',
    description: 'Secure your codebase and enable automated production deployments through GitHub.',
    illustrationId: 'rocket',
    subSteps: [
      'Initialize Git: "git init".',
      'Create a Private Repository on GitHub.com.',
      'Link your local project to the remote GitHub repository.',
      'Push your first commit: "git push -u origin main".'
    ]
  },
  {
    id: 'email-protocol',
    title: '8. Communication Bridge (EmailJS)',
    description: 'Setup the automated communication channel for client enquiries and styling consultations.',
    illustrationId: 'forge',
    subSteps: [
      'Sign up at EmailJS.com.',
      'Connect your Gmail or professional email service.',
      'Create a new Email Template for curator notifications.',
      'Capture your Service ID, Template ID, and Public Key.'
    ]
  },
  {
    id: 'template-engineering',
    title: '9. Professional Auto-Reply',
    description: 'Design the luxury reply template your clients receive when their inquiry is synced.',
    illustrationId: 'rocket',
    subSteps: [
      'In EmailJS, use variables: {{to_name}}, {{message}}, {{company_name}}.',
      'Paste the Elite HTML code (found in constants.tsx) into the editor.',
      'Enable "Auto-reply" to acknowledge every transmission instantly.',
      'Test the flow by submitting a dummy inquiry on your contact page.'
    ]
  },
  {
    id: 'production-launch',
    title: '10. Production Deployment',
    description: 'Host your bridge page on global CDN nodes for sub-second loading speeds worldwide.',
    illustrationId: 'forge',
    subSteps: [
      'Sign into Vercel.com (or Netlify).',
      'Import your GitHub repository created in Step 7.',
      'Set Build Command to "npm run build" and Output to "dist".',
      'Deploy and note your production URL.'
    ]
  },
  {
    id: 'cloud-injectors',
    title: '11. Production Secrets',
    description: 'Securely inject your private cloud keys into the production environment.',
    illustrationId: 'rocket',
    subSteps: [
      'In Vercel, navigate to Settings > Environment Variables.',
      'Add the VITE_SUPABASE_... keys from Step 6.',
      'Trigger a "Redeploy" to apply these cloud credentials.',
      'Verify the Sync Indicator in your footer turns green.'
    ]
  },
  {
    id: 'domain-authority',
    title: '12. Brand Authority (DNS)',
    description: 'Finalize your professional identity with a custom domain name.',
    illustrationId: 'forge',
    subSteps: [
      'Purchase a domain (e.g., .com, .luxury, .store).',
      'Add the domain to your hosting provider (Vercel/Netlify).',
      'Update DNS records (A and CNAME) as instructed.',
      'Wait for SSL propagation for secure HTTPS access.'
    ]
  },
  {
    id: 'analytics-ga4',
    title: '13. Vitality Monitoring (GA4)',
    description: 'Install Google Analytics to monitor visitor origins and high-performing content.',
    illustrationId: 'rocket',
    subSteps: [
      'Create a Web Data Stream in Google Analytics.',
      'Copy the Measurement ID (G-XXXXXXXXXX).',
      'Go to Maison Portal > Canvas > Integrations and paste the ID.',
      'Confirm real-time traffic tracking in the GA4 dashboard.'
    ]
  },
  {
    id: 'meta-conversions',
    title: '14. Meta Pixel Deployment',
    description: 'Enable conversion tracking and retargeting for Instagram and Facebook ad traffic.',
    illustrationId: 'forge',
    subSteps: [
      'Create a Dataset (Pixel) in Meta Events Manager.',
      'Copy the numeric Pixel ID.',
      'Paste into the Integrations tab of your Maison Portal.',
      'Verify installation using the Meta Pixel Helper extension.'
    ]
  },
  {
    id: 'tiktok-tracking',
    title: '15. TikTok Viral Tracking',
    description: 'Capture engagement data from the high-velocity TikTok ecosystem.',
    illustrationId: 'rocket',
    subSteps: [
      'Create a Web Event in TikTok Ads Manager.',
      'Select "Manual Setup" and copy the Pixel ID.',
      'Sync it via your Maison Portal Integrations menu.',
      'Monitor trend-referral performance in your Insights tab.'
    ]
  },
  {
    id: 'pinterest-aesthetic',
    title: '16. Pinterest Conversion Tag',
    description: 'Monitor aesthetic-driven shoppers arriving from Pinterest Pins.',
    illustrationId: 'forge',
    subSteps: [
      'Generate a Pinterest Tag in your Business Hub.',
      'Copy the unique Tag ID.',
      'Apply to your site via the Canvas > Integrations menu.',
      'Track "Add to Cart" and "Click-through" events precisely.'
    ]
  },
  {
    id: 'canvas-personalization',
    title: '17. Visual Calibration (Canvas)',
    description: 'Calibrate your bridge page UI to match your curated brand identity.',
    illustrationId: 'rocket',
    subSteps: [
      'Open Maison Portal > Canvas > Identity.',
      'Upload your PNG logo and set the primary Gold/Accent colors.',
      'Update navigation labels (e.g., "The Archive" vs "Collections").',
      'Preview changes instantly on your mobile device.'
    ]
  },
  {
    id: 'catalog-deployment',
    title: '18. Catalog Strategy',
    description: 'Populate your bridge page with high-commission, personally reviewed items.',
    illustrationId: 'forge',
    subSteps: [
      'Create Departments first (e.g., Apparel, Accessories).',
      'Add items with "Why We Love It" highlights to build trust.',
      'Ensure every affiliate link includes your unique tracking tag.',
      'Use the built-in Ad Generator to create social assets for each piece.'
    ]
  },
  {
    id: 'academy-deployment',
    title: '19. Academy Masterclass',
    description: 'Utilize the training modules to master platform-specific algorithms.',
    illustrationId: 'rocket',
    subSteps: [
      'Review "Instagram Aesthetic Curation" for visual storytelling.',
      'Apply the "Pinterest Viral Pins" strategy for evergreen traffic.',
      'Execute "TikTok Trend Jacking" for rapid catalog expansion.',
      'Complete the "Elite Performance" training for ROI optimization.'
    ]
  },
  {
    id: 'maintenance-scaling',
    title: '20. Scaling & Curation Cycles',
    description: 'Establish a rhythm for catalog refreshes and analytical auditing.',
    illustrationId: 'forge',
    subSteps: [
      'Weekly: Audit the "Elite Performance Report" for drop-offs.',
      'Monthly: Trigger an "Archive Cycle" to move stale items to History.',
      'Invite "Maison Staff" members to help curate larger catalogs.',
      'Continuously update hero visuals to maintain a fresh aesthetic.'
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
    name: 'Main Curator',
    email: 'admin@findara.com',
    role: 'owner',
    permissions: ['*'], // * implies all
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
    message: 'Hi there, I love your curation! I am looking for a personal stylist for an upcoming gala. Do you offer virtual sessions?',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    status: 'unread'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: "Findara",
  slogan: 'Bridging Trends to Your Story',
  companyLogo: 'F',
  companyLogoUrl: 'https://i.ibb.co/FkCdTns2/bb5w9xpud5l.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'The Entry',
  navProductsLabel: 'My Picks',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'contact@findara.com',
  contactPhone: '+27 76 836 0325',
  whatsappNumber: '27768360325',
  address: 'Global, Digital-First',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],
  contactFaqs: [
    {
      question: "What exactly is a 'Bridge' page?",
      answer: "This is my personal curation portfolio. I find high-quality, trending items from global retailers like Shein and Amazon, and bridge them to you. You click my links, buy from the trusted merchant, and I receive a small commission at no cost to you."
    },
    {
      question: "Do you handle the shipping?",
      answer: "No. Since I am an affiliate marketer, I don't stock the items. All shipping, returns, and payments are handled by the actual retailer (like Shein or Revolve) that I link you to."
    },
    {
      question: "Why should I buy through your links?",
      answer: "I spend hours filtering through thousands of low-quality items to find the genuine 'hidden gems'. By using my links, you get the absolute best finds and support my curation journey at the same time!"
    }
  ],

  productAcquisitionLabel: 'Acquire via Partner',
  productSpecsLabel: 'Curation Details',

  footerDescription: "A personally curated gateway to global trends. My mission is to bridge the gap between overwhelmed shoppers and the hidden gems of the internet.",
  footerCopyrightText: "All rights reserved.",
  footerNavHeader: 'Journey',
  footerPolicyHeader: 'Transparency',

  // Home Page Content
  homeHeroBadge: 'Curator Selections',
  homeAboutTitle: 'The Story Behind the Finds.',
  homeAboutDescription: 'My name is Findara, and I have always had an eye for the exceptional. This bridge page is my way of sharing the global aesthetic I discover every day. Every item is hand-selected to bridge my story with your unique style.',
  homeAboutImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Journey',
  homeCategorySectionTitle: 'The Catalog',
  homeCategorySectionSubtitle: 'Hand-Picked',
  homeNicheHeader: 'Curated Portals',
  homeNicheSubheader: 'Select Your Style',
  homeTrustHeader: 'Why trust my eye?',
  homeTrustSubheader: 'Integrity First',
  homeTrustSectionTitle: 'The Curator Promise',
  
  homeTrustItem1Title: 'Official Affiliate',
  homeTrustItem1Desc: 'Verified partner with global giants like Shein and Amazon.',
  homeTrustItem1Icon: 'ShieldCheck', 

  homeTrustItem2Title: 'Personal Review',
  homeTrustItem2Desc: 'I never list an item I wouldn\'t personally wear or use.',
  homeTrustItem2Icon: 'User', 

  homeTrustItem3Title: 'Direct & Secure',
  homeTrustItem3Desc: 'Links lead directly to encrypted merchant checkouts.',
  homeTrustItem3Icon: 'Link', 

  // Products Page Content
  productsHeroTitle: 'Curated Collections',
  productsHeroSubtitle: 'Browse my latest finds from the world\'s most exciting affiliate programs.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search my archives...',

  // About Page Content
  aboutHeroTitle: 'The Curator Behind the Bridge.',
  aboutHeroSubtitle: 'Authenticity isn\'t a buzzword; it\'s the thread that weaves every one of my selections together. Welcome to my world.',
  aboutMainImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Findara Curator',
  aboutLocation: 'Global / Online',

  aboutHistoryTitle: 'How It All Started',
  aboutHistoryBody: 'I’ve always been the person friends asked for style advice. In 2024, I decided to turn that passion into a professional curation platform. Findara isn\'t just about affiliate links; it\'s about the meticulous process behind every selection.\n\nAs an affiliate marketer, I spend hours scrolling through thousands of items to find the "hidden gems" so you don\'t have to. I believe in complete transparency—this bridge system allows me to share my unique perspective on global trends while ensuring you get the best value directly from the source.\n\nEvery click supports my journey in bringing high-fashion aesthetics to the everyday shopper. I only partner with retailers that meet my strict standards for quality and trend relevance. Welcome to my narrative—I hope it helps you define yours.',
  
  aboutMissionTitle: 'Curation Mission',
  aboutMissionBody: 'To bridge the gap between you and the best global affiliate offers with transparency, style, and absolute taste.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'My Community',
  aboutCommunityBody: 'Join thousands of shoppers who follow my daily trend discoveries on TikTok and Instagram.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency Policy',
  aboutIntegrityBody: 'I am always upfront about my role as an affiliate. This site is built on trust and curation integrity.',
  aboutIntegrityIcon: 'Shield',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551488852-0801d863dc34?auto=format&fit=crop&q=80&w=800'
  ],

  // Contact Page Content
  contactHeroTitle: 'Let\'s Connect.',
  contactHeroSubtitle: 'Have questions about a specific find? My concierge desk is here to help you navigate the world of global shopping.',
  contactFormNameLabel: 'Your Name',
  contactFormEmailLabel: 'Your Email',
  contactFormSubjectLabel: 'What\'s it about?',
  contactFormMessageLabel: 'Your Message',
  contactFormButtonText: 'Send to My Desk',
  
  contactInfoTitle: 'Curation HQ',
  contactAddressLabel: 'Digital Location',
  contactHoursLabel: 'Response Hours',
  contactHoursWeekdays: 'Mon - Fri: 09:00 - 18:00',
  contactHoursWeekends: 'Weekends: Selective Response',

  // Legal Content
  disclosureTitle: 'Affiliate Transparency',
  disclosureContent: `### AFFILIATE DISCLOSURE STATEMENT

**Last Updated: 2024**

This site is a curated affiliate bridge page. We participate in various affiliate programs including SHEIN and Amazon Associates. When you click our links and make a purchase, we may receive a small commission at no additional cost to you. We only recommend items we genuinely love.`,
  
  privacyTitle: 'Your Data',
  privacyContent: `### PRIVACY POLICY

We value your privacy. We do not collect sensitive financial data; all transactions happen on third-party sites. We use basic cookies to track affiliate attribution.`,

  termsTitle: 'Usage Terms',
  termsContent: `### TERMS OF SERVICE

This site is for curation and information only. We are not the retailer. All issues with orders must be handled through the merchant where the purchase was completed.`,

  // Integrations
  emailJsServiceId: '',
  emailJsTemplateId: '',
  emailJsPublicKey: '',
  googleAnalyticsId: '',
  facebookPixelId: '',
  tiktokPixelId: '',
  amazonAssociateId: '',
  webhookUrl: '',
  pinterestTagId: ''
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Curator\'s Choice',
    subtitle: 'Personally selected silhouetts for the modern wardrobe.',
    cta: 'View My Picks'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Wardrobe', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800&h=800', description: 'Curated apparel for every occasion.' },
  { id: 'cat2', name: 'Details', icon: 'Watch', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800&h=800', description: 'The accessories that define an outfit.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Dresses' },
  { id: 'sub2', categoryId: 'cat2', name: 'Bags' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Selected Silk Wrap',
    sku: 'CUR-001',
    price: 3450,
    affiliateLink: 'https://example.com/midnight-silk',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'A luxurious 100% silk wrap dress that I discovered while scrolling for evening wear. It\'s timeless and fits perfectly.',
    features: ['100% Premium Silk', 'Adjustable Fit', 'Breathable'],
    specifications: { 'Material': 'Silk', 'Care': 'Hand Wash' },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800&h=800', name: 'Silk', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm1',
    title: 'How I Find Gems',
    platform: 'General',
    description: 'My secret workflow for filtering affiliate items.',
    strategies: ['Filter by reviews', 'Check fabric composition'],
    actionItems: ['Find 5 items today'],
    icon: 'Search',
    steps: []
  }
];
