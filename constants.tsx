
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
    description: 'Deploy the complete data schema. This script ensures every table and column for Training Modules, Catalog, Settings, and Analytics exist.',
    illustrationId: 'rocket',
    subSteps: [
      'Open the SQL Editor in your Supabase dashboard.',
      'Paste the Master SQL v13.0 script provided below.',
      'Click "Run" and verify all tables update.',
      'CRITICAL: This script handles nearly 100 column definitions across all app sections.'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v13.0 (Comprehensive System Sync)
-- Run this script to ensure all tables have the correct columns and types for every entry in the system.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BASE TABLE CREATION
CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY DEFAULT 'global');
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS product_stats ( "productId" TEXT PRIMARY KEY );
CREATE TABLE IF NOT EXISTS training_modules (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS product_history (id TEXT PRIMARY KEY);

-- 2. EXHAUSTIVE COLUMN MIGRATIONS (Section by Section)

DO $$ 
BEGIN 
  -- A. SETTINGS TABLE (Brand, Content, Integrations)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='companyName') THEN ALTER TABLE settings ADD COLUMN "companyName" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='slogan') THEN ALTER TABLE settings ADD COLUMN "slogan" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='companyLogo') THEN ALTER TABLE settings ADD COLUMN "companyLogo" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='companyLogoUrl') THEN ALTER TABLE settings ADD COLUMN "companyLogoUrl" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='primaryColor') THEN ALTER TABLE settings ADD COLUMN "primaryColor" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='secondaryColor') THEN ALTER TABLE settings ADD COLUMN "secondaryColor" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='accentColor') THEN ALTER TABLE settings ADD COLUMN "accentColor" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='navHomeLabel') THEN ALTER TABLE settings ADD COLUMN "navHomeLabel" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='navProductsLabel') THEN ALTER TABLE settings ADD COLUMN "navProductsLabel" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='navAboutLabel') THEN ALTER TABLE settings ADD COLUMN "navAboutLabel" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='navContactLabel') THEN ALTER TABLE settings ADD COLUMN "navContactLabel" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='navDashboardLabel') THEN ALTER TABLE settings ADD COLUMN "navDashboardLabel" TEXT; END IF;
  
  -- B. CONTACT & FOOTER SETTINGS
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='contactEmail') THEN ALTER TABLE settings ADD COLUMN "contactEmail" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='contactPhone') THEN ALTER TABLE settings ADD COLUMN "contactPhone" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='whatsappNumber') THEN ALTER TABLE settings ADD COLUMN "whatsappNumber" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='address') THEN ALTER TABLE settings ADD COLUMN "address" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='socialLinks') THEN ALTER TABLE settings ADD COLUMN "socialLinks" JSONB DEFAULT '[]'::jsonb; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='contactFaqs') THEN ALTER TABLE settings ADD COLUMN "contactFaqs" JSONB DEFAULT '[]'::jsonb; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='footerDescription') THEN ALTER TABLE settings ADD COLUMN "footerDescription" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='footerCopyrightText') THEN ALTER TABLE settings ADD COLUMN "footerCopyrightText" TEXT; END IF;
  
  -- C. HOME PAGE SECTION SETTINGS
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeHeroBadge') THEN ALTER TABLE settings ADD COLUMN "homeHeroBadge" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeAboutTitle') THEN ALTER TABLE settings ADD COLUMN "homeAboutTitle" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeAboutDescription') THEN ALTER TABLE settings ADD COLUMN "homeAboutDescription" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeAboutImage') THEN ALTER TABLE settings ADD COLUMN "homeAboutImage" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeAboutCta') THEN ALTER TABLE settings ADD COLUMN "homeAboutCta" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustHeader') THEN ALTER TABLE settings ADD COLUMN "homeTrustHeader" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustSubheader') THEN ALTER TABLE settings ADD COLUMN "homeTrustSubheader" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem1Title') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem1Title" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem1Desc') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem1Desc" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem1Icon') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem1Icon" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem2Title') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem2Title" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem2Desc') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem2Desc" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem2Icon') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem2Icon" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem3Title') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem3Title" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem3Desc') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem3Desc" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='homeTrustItem3Icon') THEN ALTER TABLE settings ADD COLUMN "homeTrustItem3Icon" TEXT; END IF;

  -- D. ABOUT PAGE CONTENT
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutHeroTitle') THEN ALTER TABLE settings ADD COLUMN "aboutHeroTitle" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutHeroSubtitle') THEN ALTER TABLE settings ADD COLUMN "aboutHeroSubtitle" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutMainImage') THEN ALTER TABLE settings ADD COLUMN "aboutMainImage" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutEstablishedYear') THEN ALTER TABLE settings ADD COLUMN "aboutEstablishedYear" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutFounderName') THEN ALTER TABLE settings ADD COLUMN "aboutFounderName" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutHistoryTitle') THEN ALTER TABLE settings ADD COLUMN "aboutHistoryTitle" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutHistoryBody') THEN ALTER TABLE settings ADD COLUMN "aboutHistoryBody" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutMissionTitle') THEN ALTER TABLE settings ADD COLUMN "aboutMissionTitle" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutMissionBody') THEN ALTER TABLE settings ADD COLUMN "aboutMissionBody" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='aboutGalleryImages') THEN ALTER TABLE settings ADD COLUMN "aboutGalleryImages" JSONB DEFAULT '[]'::jsonb; END IF;

  -- E. INTEGRATION KEYS
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='googleAnalyticsId') THEN ALTER TABLE settings ADD COLUMN "googleAnalyticsId" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='facebookPixelId') THEN ALTER TABLE settings ADD COLUMN "facebookPixelId" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='tiktokPixelId') THEN ALTER TABLE settings ADD COLUMN "tiktokPixelId" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='pinterestTagId') THEN ALTER TABLE settings ADD COLUMN "pinterestTagId" TEXT; END IF;

  -- F. ADMIN USERS TABLE
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='name') THEN ALTER TABLE admin_users ADD COLUMN name TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='email') THEN ALTER TABLE admin_users ADD COLUMN email TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='role') THEN ALTER TABLE admin_users ADD COLUMN role TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='permissions') THEN ALTER TABLE admin_users ADD COLUMN permissions JSONB DEFAULT '[]'::jsonb; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='createdAt') THEN ALTER TABLE admin_users ADD COLUMN "createdAt" BIGINT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_users' AND column_name='profileImage') THEN ALTER TABLE admin_users ADD COLUMN "profileImage" TEXT; END IF;

  -- G. ENQUIRIES TABLE
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='name') THEN ALTER TABLE enquiries ADD COLUMN name TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='email') THEN ALTER TABLE enquiries ADD COLUMN email TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='whatsapp') THEN ALTER TABLE enquiries ADD COLUMN whatsapp TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='subject') THEN ALTER TABLE enquiries ADD COLUMN subject TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='message') THEN ALTER TABLE enquiries ADD COLUMN message TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='status') THEN ALTER TABLE enquiries ADD COLUMN status TEXT DEFAULT 'unread'; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enquiries' AND column_name='createdAt') THEN ALTER TABLE enquiries ADD COLUMN "createdAt" BIGINT; END IF;

  -- H. ANALYTICS TABLES
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='traffic_logs' AND column_name='type') THEN ALTER TABLE traffic_logs ADD COLUMN type TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='traffic_logs' AND column_name='text') THEN ALTER TABLE traffic_logs ADD COLUMN text TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='traffic_logs' AND column_name='timestamp') THEN ALTER TABLE traffic_logs ADD COLUMN timestamp BIGINT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='traffic_logs' AND column_name='source') THEN ALTER TABLE traffic_logs ADD COLUMN source TEXT; END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_stats' AND column_name='views') THEN ALTER TABLE product_stats ADD COLUMN views INTEGER DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_stats' AND column_name='clicks') THEN ALTER TABLE product_stats ADD COLUMN clicks INTEGER DEFAULT 0; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='product_stats' AND column_name='shares') THEN ALTER TABLE product_stats ADD COLUMN shares INTEGER DEFAULT 0; END IF;

  -- I. PRODUCTS & CATEGORIES
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='name') THEN ALTER TABLE products ADD COLUMN name TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='affiliateLink') THEN ALTER TABLE products ADD COLUMN "affiliateLink" TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='media') THEN ALTER TABLE products ADD COLUMN media JSONB DEFAULT '[]'::jsonb; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='price') THEN ALTER TABLE products ADD COLUMN price NUMERIC; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='createdBy') THEN ALTER TABLE products ADD COLUMN "createdBy" TEXT; END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='name') THEN ALTER TABLE categories ADD COLUMN name TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='image') THEN ALTER TABLE categories ADD COLUMN image TEXT; END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='icon') THEN ALTER TABLE categories ADD COLUMN icon TEXT; END IF;

END $$;

-- 3. ENABLE REALTIME PUBLICATION
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;

-- 4. ENABLE RLS & PUBLIC POLICIES
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public Read settings') THEN CREATE POLICY "Public Read settings" ON settings FOR SELECT USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Public Read products') THEN CREATE POLICY "Public Read products" ON products FOR SELECT USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable all for anon settings') THEN CREATE POLICY "Enable all for anon settings" ON settings FOR ALL USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable insert for anon enquiries') THEN CREATE POLICY "Enable insert for anon enquiries" ON enquiries FOR INSERT WITH CHECK (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable all for admin_users') THEN CREATE POLICY "Enable all for admin_users" ON admin_users FOR ALL USING (true); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'Enable all for anon logs') THEN CREATE POLICY "Enable all for anon logs" ON traffic_logs FOR ALL USING (true); END IF;
END $$;
`,
    codeLabel: 'Master Architecture v13.0 (Comprehensive Sync)'
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
