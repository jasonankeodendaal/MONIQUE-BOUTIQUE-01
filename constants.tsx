
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
    .btn { display: inline-block; background-color: #D4AF37; color: #FFFFFF; padding: 16px 36px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; border-radius: 50px; box-shadow: 0 10px 20px -5px rgba(212, 175, 55, 0.4); }
    
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
    id: 'supabase-init',
    title: '1. Supabase Infrastructure',
    description: 'Supabase is your backend-as-a-service. It replaces a traditional server, handling your database, authentication, and file storage in one secure cloud environment.',
    illustrationId: 'rocket',
    subSteps: [
      'Visit https://supabase.com and click "Start your project".',
      'Sign in with GitHub (recommended for easier deployment later) or email.',
      'Click "New Project". Choose an Organization (create one if needed).',
      'Name: "Affiliate Bridge". Region: Select the one closest to your target audience (e.g., Cape Town, London, or N. Virginia).',
      'Database Password: Generate a strong password and STORE IT in a password manager. You cannot recover it later.',
      'Click "Create New Project" and wait 1-2 minutes for provisioning.'
    ]
  },
  {
    id: 'database',
    title: '2. Database Schema (SQL Engine)',
    description: 'We need to define the structure of your data. This script creates all necessary tables (products, settings, orders, reviews) and sets up security policies.',
    illustrationId: 'forge',
    subSteps: [
      'In your Supabase Dashboard, look at the left sidebar icon menu.',
      'Click on "SQL Editor" (icon looks like a terminal prompt >_).',
      'Click "+ New Query" at the top left.',
      'Copy the entire SQL block provided below.',
      'Paste it into the editor window.',
      'Click the green "Run" button at the bottom right.',
      'Success Check: Go to "Table Editor" (grid icon) and ensure you see tables like "settings", "products", "reviews", etc.'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v5.0 (Reviews Normalized)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT,
  "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT,
  "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navContactLabel" TEXT, "navDashboardLabel" TEXT,
  "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT,
  "socialLinks" JSONB, "footerDescription" TEXT, "footerCopyrightText" TEXT,
  "homeHeroBadge" TEXT, "homeAboutTitle" TEXT, "homeAboutDescription" TEXT, "homeAboutImage" TEXT, "homeAboutCta" TEXT,
  "homeCategorySectionTitle" TEXT, "homeCategorySectionSubtitle" TEXT, "homeTrustSectionTitle" TEXT,
  "homeTrustItem1Title" TEXT, "homeTrustItem1Desc" TEXT, "homeTrustItem1Icon" TEXT,
  "homeTrustItem2Title" TEXT, "homeTrustItem2Desc" TEXT, "homeTrustItem2Icon" TEXT,
  "homeTrustItem3Title" TEXT, "homeTrustItem3Desc" TEXT, "homeTrustItem3Icon" TEXT,
  "productsHeroTitle" TEXT, "productsHeroSubtitle" TEXT, "productsHeroImage" TEXT, "productsHeroImages" TEXT[],
  "productsSearchPlaceholder" TEXT, "aboutHeroTitle" TEXT, "aboutHeroSubtitle" TEXT, "aboutMainImage" TEXT,
  "aboutEstablishedYear" TEXT, "aboutFounderName" TEXT, "aboutLocation" TEXT,
  "aboutHistoryTitle" TEXT, "aboutHistoryBody" TEXT, "aboutMissionTitle" TEXT, "aboutMissionBody" TEXT, "aboutMissionIcon" TEXT,
  "aboutCommunityTitle" TEXT, "aboutCommunityBody" TEXT, "aboutCommunityIcon" TEXT,
  "aboutIntegrityTitle" TEXT, "aboutIntegrityBody" TEXT, "aboutIntegrityIcon" TEXT,
  "aboutSignatureImage" TEXT, "aboutGalleryImages" TEXT[],
  "contactHeroTitle" TEXT, "contactHeroSubtitle" TEXT, "contactFormNameLabel" TEXT, "contactFormEmailLabel" TEXT,
  "contactFormSubjectLabel" TEXT, "contactFormMessageLabel" TEXT, "contactFormButtonText" TEXT,
  "contactInfoTitle" TEXT, "contactAddressLabel" TEXT, "contactHoursLabel" TEXT, "contactHoursWeekdays" TEXT, "contactHoursWeekends" TEXT,
  "disclosureTitle" TEXT, "disclosureContent" TEXT, "privacyTitle" TEXT, "privacyContent" TEXT, "termsTitle" TEXT, "termsContent" TEXT,
  "emailJsServiceId" TEXT, "emailJsTemplateId" TEXT, "emailJsPublicKey" TEXT,
  "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "webhookUrl" TEXT, "pinterestTagId" TEXT,
  "enableDirectSales" BOOLEAN DEFAULT false, "currency" TEXT DEFAULT 'ZAR', 
  "yocoPublicKey" TEXT, "payfastMerchantId" TEXT, "payfastMerchantKey" TEXT, "payfastSaltPassphrase" TEXT,
  "zapierWebhookUrl" TEXT, "bankDetails" TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT,
  "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features TEXT[], specifications JSONB,
  media JSONB, "discountRules" JSONB, "createdAt" BIGINT, "createdBy" TEXT,
  "isDirectSale" BOOLEAN DEFAULT false, "stockQuantity" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, icon TEXT, image TEXT, description TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY, "categoryId" TEXT, name TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY, image TEXT, type TEXT, title TEXT, subtitle TEXT, cta TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT, email TEXT, whatsapp TEXT, subject TEXT, message TEXT, "createdAt" BIGINT, status TEXT);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, permissions TEXT[], "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT, source TEXT);
CREATE TABLE IF NOT EXISTS product_stats ( "productId" TEXT PRIMARY KEY, views INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, "totalViewTime" NUMERIC DEFAULT 0, "lastUpdated" BIGINT );

-- REVIEWS (NEW)
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  "productId" TEXT REFERENCES products(id) ON DELETE CASCADE,
  "userName" TEXT,
  rating INTEGER,
  comment TEXT,
  "createdAt" BIGINT
);

-- COMMERCE TABLES
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, "userId" TEXT, "customerName" TEXT, "customerEmail" TEXT, "shippingAddress" TEXT,
  total NUMERIC, status TEXT, "paymentMethod" TEXT, "createdAt" BIGINT
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY, "orderId" TEXT REFERENCES orders(id) ON DELETE CASCADE,
  "productId" TEXT, "productName" TEXT, quantity INTEGER, price NUMERIC
);

-- PROFILES & TRACKING
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  "fullName" TEXT,
  phone TEXT,
  building TEXT,
  street TEXT,
  suburb TEXT,
  city TEXT,
  province TEXT,
  "postalCode" TEXT,
  "updatedAt" BIGINT
);

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS "courierName" TEXT,
ADD COLUMN IF NOT EXISTS "trackingNumber" TEXT,
ADD COLUMN IF NOT EXISTS "trackingUrl" TEXT;

-- 3. PERMISSIONS (ROW LEVEL SECURITY)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read settings') THEN CREATE POLICY "Public Read settings" ON settings FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read products') THEN CREATE POLICY "Public Read products" ON products FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read categories') THEN CREATE POLICY "Public Read categories" ON categories FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read subcategories') THEN CREATE POLICY "Public Read subcategories" ON subcategories FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read hero_slides') THEN CREATE POLICY "Public Read hero_slides" ON hero_slides FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert enquiries') THEN CREATE POLICY "Public Insert enquiries" ON enquiries FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert traffic_logs') THEN CREATE POLICY "Public Insert traffic_logs" ON traffic_logs FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert orders') THEN CREATE POLICY "Public Insert orders" ON orders FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert order_items') THEN CREATE POLICY "Public Insert order_items" ON order_items FOR INSERT WITH CHECK (true); END IF;
    
    -- Review Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read reviews') THEN CREATE POLICY "Public Read reviews" ON reviews FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert reviews') THEN CREATE POLICY "Public Insert reviews" ON reviews FOR INSERT WITH CHECK (true); END IF;

    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read profiles') THEN CREATE POLICY "Public Read profiles" ON profiles FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users update own profile') THEN CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users insert own profile') THEN CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id); END IF;
END $$;

-- Admin Full Access
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon') THEN 
        CREATE POLICY "Enable all for anon" ON settings FOR ALL USING (true);
        CREATE POLICY "Enable all for anon products" ON products FOR ALL USING (true);
        CREATE POLICY "Enable all for anon categories" ON categories FOR ALL USING (true);
        CREATE POLICY "Enable all for anon subcategories" ON subcategories FOR ALL USING (true);
        CREATE POLICY "Enable all for anon hero_slides" ON hero_slides FOR ALL USING (true);
        CREATE POLICY "Enable all for anon enquiries" ON enquiries FOR ALL USING (true);
        CREATE POLICY "Enable all for anon admin_users" ON admin_users FOR ALL USING (true);
        CREATE POLICY "Enable all for anon traffic_logs" ON traffic_logs FOR ALL USING (true);
        CREATE POLICY "Enable all for anon product_stats" ON product_stats FOR ALL USING (true);
        CREATE POLICY "Enable all for anon orders" ON orders FOR ALL USING (true);
        CREATE POLICY "Enable all for anon order_items" ON order_items FOR ALL USING (true);
        CREATE POLICY "Enable all for anon reviews" ON reviews FOR ALL USING (true);
    END IF;
END $$;`,
    codeLabel: 'Full System SQL Script (v5.0)'
  },
  {
    id: 'storage',
    title: '3. Asset Vault (Storage)',
    description: 'We need a public bucket to host your images. This acts like a CDN (Content Delivery Network) for your product photos and videos.',
    illustrationId: 'rocket',
    subSteps: [
      'In Supabase, click the "Storage" icon on the left sidebar.',
      'Click "New Bucket".',
      'Name it exactly: "media" (lowercase, no spaces).',
      'Toggle "Public Bucket" to ON. This is crucial for images to display on your site.',
      'Click "Save".',
      'Select the bucket "media" -> Configuration -> Policies.',
      'Ensure "Give users access to all files" is selected or create a policy allowing SELECT, INSERT, UPDATE for role "anon".'
    ]
  },
  {
    id: 'auth',
    title: '4. Authentication (Security)',
    description: 'Set up the login system. We will disable email confirmation for now to make onboarding your first admin (yourself) faster.',
    illustrationId: 'forge',
    subSteps: [
      'Click "Authentication" on the left sidebar.',
      'Go to "Providers" > "Email" -> Disable "Confirm Email" (Optional, but speeds up testing).',
      'Go to "URL Configuration".',
      'Site URL: Add "http://localhost:3000" (for local testing).',
      'Redirect URLs: Add "http://localhost:3000/**" and "https://your-vercel-domain.vercel.app/**".',
      'Click Save.'
    ]
  },
  {
    id: 'environment',
    title: '5. Local Infrastructure (.env)',
    description: 'Connect your local code to your new cloud database using environment variables.',
    illustrationId: 'rocket',
    subSteps: [
      'In Supabase, go to Settings (cog icon) > API.',
      'Find "Project URL" and "anon" public key.',
      'Open your local project folder in VS Code.',
      'Create a file named ".env" in the root directory (same level as package.json).',
      'Paste the variables exactly as shown below, replacing values with your keys.',
      'Restart your development server (Ctrl+C, then "npm run dev") for changes to take effect.'
    ],
    code: 'VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here',
    codeLabel: '.env Variables'
  },
  {
    id: 'github',
    title: '6. Version Control (GitHub)',
    description: 'Upload your code to GitHub. This is required for Vercel to automatically deploy your site.',
    illustrationId: 'forge',
    subSteps: [
      'Go to GitHub.com and create a new repository named "affiliate-bridge".',
      'Make it "Private" if you want to keep your code hidden.',
      'In your local terminal, run: `git init`',
      'Run: `git add .` (Stages all files)',
      'Run: `git commit -m "Initial launch"`',
      'Run: `git branch -M main`',
      'Run: `git remote add origin https://github.com/yourusername/affiliate-bridge.git`',
      'Run: `git push -u origin main`'
    ]
  },
  {
    id: 'emailjs-account',
    title: '7. EmailJS: Service Protocol',
    description: 'EmailJS allows you to send emails directly from the frontend without a backend server.',
    illustrationId: 'rocket',
    subSteps: [
      'Register at EmailJS.com (Free tier is sufficient).',
      'Click "Add New Service" -> Select "Gmail".',
      'Connect your account and click "Create Service".',
      'Copy the "Service ID" (e.g., service_z49d2). You will need this for the Site Settings.'
    ]
  },
  {
    id: 'emailjs-template',
    title: '8. EmailJS: Template Engineering',
    description: 'Design the auto-reply or notification email. We use dynamic variables like {{to_name}} to personalize it.',
    illustrationId: 'forge',
    subSteps: [
      'Go to "Email Templates" > "Create New Template".',
      'Subject: `New Message from {{to_name}}`',
      'Content: Use the HTML editor or standard text. Map variables: {{message}}, {{from_name}}, {{reply_to}}.',
      'Click "Save". Copy the "Template ID" (e.g., template_8d7s).',
      'Go to "Account" (Avatar) > "API Keys" -> Copy "Public Key".'
    ],
    code: EMAIL_TEMPLATE_HTML,
    codeLabel: 'EmailJS HTML Template'
  },
  {
    id: 'google-analytics',
    title: '9. Marketing: Google Analytics (G4)',
    description: 'Track user behavior, session duration, and geographical data.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to analytics.google.com and create an account.',
      'Create a "Property". Select "Web" as the platform.',
      'Enter your website name and URL (use your Vercel URL if you have it, or a placeholder).',
      'You will get a "Measurement ID" starting with "G-".',
      'Copy this ID. You will paste it into the "Integrations" tab in your Admin dashboard.'
    ]
  },
  {
    id: 'meta-pixel',
    title: '10. Marketing: Meta Pixel (Facebook)',
    description: 'Essential for retargeting. If someone views a product but doesn\'t buy, you can show them ads later on Instagram.',
    illustrationId: 'forge',
    subSteps: [
      'Go to business.facebook.com > Events Manager.',
      'Click "Connect Data Sources" > "Web".',
      'Name your pixel "Bridge Page Pixel".',
      'Select "Manual Install" (we handle the code injection).',
      'Go to Settings and copy the "Dataset ID" (Pixel ID).',
      'Paste this into the Admin dashboard.'
    ]
  },
  {
    id: 'tiktok-pixel',
    title: '11. Marketing: TikTok Monitoring',
    description: 'TikTok is a high-conversion platform for affordable luxury and "dupes". Tracking here is vital.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to ads.tiktok.com > Assets > Events.',
      'Click "Web Events" > "Manage".',
      'Click "Set Up Web Events" > "Manual Setup".',
      'Name the pixel. Copy the "Pixel ID" shown at the top.',
      'Paste into the Integrations tab.'
    ]
  },
  {
    id: 'pinterest-tag',
    title: '12. Marketing: Pinterest Tag',
    description: 'Pinterest users have high intent. This tag tracks when they view items or click your affiliate links.',
    illustrationId: 'forge',
    subSteps: [
      'Go to ads.pinterest.com > Conversions.',
      'Click "Tag Manager".',
      'Copy the "Tag ID" (numeric string).',
      'Paste into the Integrations tab.'
    ]
  },
  {
    id: 'vercel-deploy',
    title: '13. Deployment: Vercel Production',
    description: 'Vercel is the gold standard for React hosting. It connects to GitHub and updates your site every time you save code.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to Vercel.com and sign up with GitHub.',
      'Click "Add New..." > "Project".',
      'Select your "affiliate-bridge" repository.',
      'Framework Preset: Vite (should be auto-detected).',
      'Do NOT click Deploy yet. We need environment variables.'
    ]
  },
  {
    id: 'vercel-env',
    title: '14. Deployment: Cloud Injectors',
    description: 'We must tell the production server about Supabase. Local .env files are not uploaded for security.',
    illustrationId: 'forge',
    subSteps: [
      'Expand the "Environment Variables" section in Vercel.',
      'Key: `VITE_SUPABASE_URL`, Value: (Your Supabase URL).',
      'Key: `VITE_SUPABASE_ANON_KEY`, Value: (Your Supabase Anon Key).',
      'Click "Deploy". Wait for the confetti!',
      'Your site is now live at `https://affiliate-bridge-xyz.vercel.app`.'
    ]
  },
  {
    id: 'final-polish',
    title: '15. Final Polish: Custom Domain',
    description: 'A custom domain (e.g., moniqueboutique.com) increases trust by 80%.',
    illustrationId: 'rocket',
    subSteps: [
      'Buy a domain from Namecheap, GoDaddy, or Squarespace.',
      'In Vercel, go to Project Settings > Domains.',
      'Enter your domain name.',
      'Vercel will give you "A Records" or "CNAME Records".',
      'Log into your domain registrar and update the DNS records as shown.'
    ]
  },
  {
    id: 'seo-config',
    title: '16. SEO Optimization',
    description: 'Make sure Google knows you exist. Configure your site metadata.',
    illustrationId: 'forge',
    subSteps: [
      'In the Admin Dashboard > Site Editor > Brand.',
      'Set a descriptive "Slogan" containing keywords (e.g., "Curated Luxury Fashion").',
      'Ensure "Description" in Footer settings is keyword-rich.',
      'Create a free account at Google Search Console.',
      'Submit your sitemap (usually `yourdomain.com/sitemap.xml` if generated, or just request indexing of the home page).'
    ]
  },
  {
    id: 'pwa-check',
    title: '17. PWA Validation',
    description: 'Your site is a Progressive Web App. Users can install it on their phones like a native app.',
    illustrationId: 'rocket',
    subSteps: [
      'Open your site on Chrome (Desktop).',
      'Open DevTools (F12) > Lighthouse tab.',
      'Check "Progressive Web App" and run analysis.',
      'Ensure you get a green checkmark. This confirms users can "Add to Home Screen".'
    ]
  },
  {
    id: 'dns-config',
    title: '18. Security Headers & DNS',
    description: 'Prevent spoofing and improve delivery.',
    illustrationId: 'forge',
    subSteps: [
      'In Vercel Settings > Security.',
      'Enable "Prevent Window Opener" and "Content Security Policy" if you are advanced.',
      'Otherwise, just ensure HTTPS is forced (Vercel does this by default).'
    ]
  },
  {
    id: 'security-audit',
    title: '19. Security & Access Audit',
    description: 'Ensure only YOU can access the Admin panel.',
    illustrationId: 'rocket',
    subSteps: [
      'In Supabase > Authentication > Users.',
      'Verify only your email is listed.',
      'Go to your site `/admin` and ensure all "Edit" buttons work.',
      'Test the "Logout" button.',
      'Try to access `/admin` in Incognito mode to confirm it redirects to Login.'
    ]
  },
  {
    id: 'launch-protocol',
    title: '20. Launch Protocol',
    description: 'The final checklist before announcing to the world.',
    illustrationId: 'forge',
    subSteps: [
      'Test the Contact Form (check your email).',
      'Test an Affiliate Link (click "Secure Acquisition" on a product).',
      'Test the "Share" button on a product detail page.',
      'Post your new link in your Instagram Bio and TikTok Profile.',
      'Celebrate! You are now a digital asset owner.'
    ]
  },
  {
    id: 'payment-setup',
    title: '21. Payment Setup Guide',
    description: 'Your application supports three primary payment methods for Direct Sales: Yoco, PayFast, and Manual EFT. Below are the detailed steps to acquire the necessary API keys and credentials for each service.',
    illustrationId: 'rocket',
    subSteps: [
      '1. Yoco (Card Payments): Sign up for a business account at portal.yoco.co.za. Navigate to Sell Online > Payment Gateway > API Keys. Copy the Public Key (starts with pk_test_ or pk_live_) and paste it into Site Editor > Integrations & Payments.',
      '2. PayFast (EFT & Card): Register at payfast.co.za and verify your account. Go to Settings > Integration. Copy Merchant ID and Merchant Key. Set a Passphrase under Security. Enter these into your Admin Dashboard.',
      '3. Manual EFT: In Admin > Site Editor > Integrations, scroll to Manual EFT. Enter your Bank Name, Account Holder, Account Number, Branch Code, and Reference Instructions in the Bank Details field. Save to display at checkout.'
    ]
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  // --- SOCIAL MEDIA ---
  {
    id: 'ig-bio',
    title: '1. Instagram: Bio Architecture',
    platform: 'Instagram',
    description: 'Your bio is your digital business card. Optimize it to convert profile visits into clicks within seconds.',
    strategies: [
      'Keyword Optimization: Include "Affiliate", "Fashion", or "Deals" in your name field for searchability.',
      'Link in Bio Tools: Use the Bridge Page URL as your single link to track all outbound traffic.',
      'CTA Placement: Use the last line of your bio to point down to the link with an emoji.'
    ],
    actionItems: [
      'Rewrite bio to include your niche keywords.',
      'Add a "Shop My Finds" Call-to-Action.',
      'Switch to a Creator Account for insights.'
    ],
    icon: 'Instagram'
  },
  {
    id: 'tiktok-hooks',
    title: '2. TikTok: The 3-Second Hook',
    platform: 'TikTok',
    description: 'Stop the scroll immediately. If you do not grab attention in 3 seconds, the algorithm kills your reach.',
    strategies: [
      'Visual Interrupts: Start with movement or a sudden transition.',
      'Text Overlays: Use "You won\'t believe this price" or "Amazon vs Reality" text bubbles.',
      'Controversial Takes: "Unpopular opinion: This dupe is better than the original."'
    ],
    actionItems: [
      'Film 3 videos using different visual hooks.',
      'Test text-to-speech for the opening line.',
      'Analyze watch time in analytics to see drop-off points.'
    ],
    icon: 'Video'
  },
  {
    id: 'pinterest-seo',
    title: '3. Pinterest: Visual Search Engine',
    platform: 'Pinterest',
    description: 'Pinterest is not social media; it is SEO with pictures. Pins live for months, not minutes.',
    strategies: [
      'Rich Pins: Enable Rich Pins to show real-time pricing and availability.',
      'Vertical Verticals: Always use 9:16 aspect ratio images for maximum screen real estate.',
      'Keyword Descriptions: Don\'t write "Cute dress". Write "Summer floral maxi dress for weddings".'
    ],
    actionItems: [
      'Claim your website on Pinterest Business Hub.',
      'Create a board specifically for "Bridge Page Favorites".',
      'Design 5 pins using Canva templates.'
    ],
    icon: 'Pin'
  },
  {
    id: 'ig-stories',
    title: '4. Instagram: Story Selling',
    platform: 'Instagram',
    description: 'Stories are where the loyal community buys. Use them for "low pressure" selling and behind-the-scenes.',
    strategies: [
      'Link Stickers: Place stickers near the thumb zone (bottom right) for easy clicking.',
      'Polls & Questions: Warm up the algorithm by asking "This or That?" before dropping a link.',
      'Countdown Timers: Create urgency for flash sales or limited stock drops.'
    ],
    actionItems: [
      'Post a "This or That" fashion poll.',
      'Share a raw, unedited video of a product unboxing.',
      'Create a permanent "Shop" Highlight.'
    ],
    icon: 'Instagram'
  },
  {
    id: 'ugc-mastery',
    title: '5. Social: UGC Mastery',
    platform: 'Social',
    description: 'User Generated Content feels authentic. Brands love it, and buyers trust it more than polished ads.',
    strategies: [
      'Face-to-Camera: Talk to the lens like a friend on FaceTime.',
      'Problem/Solution: Show a style struggle and how the product fixes it.',
      'ASMR Unboxing: Focus on the sounds of packaging and textures.'
    ],
    actionItems: [
      'Film a "Get Ready With Me" (GRWM) featuring an affiliate product.',
      'Create a video response to a comment asking "Where did you get that?".',
      'Tag the brand in every post to get noticed.'
    ],
    icon: 'Video'
  },
  {
    id: 'fb-community',
    title: '6. Facebook: Group Power',
    platform: 'Facebook',
    description: 'Niche Facebook groups are goldmines for high-intent traffic. Think "Wedding Guests" or "Budget Decor".',
    strategies: [
      'Value First: Answer questions about styling before dropping a link.',
      'Deal Alerts: Position your links as "Found a deal" rather than "Buy this".',
      'Marketplace Cross-Post: List items on Marketplace that point to your bridge page.'
    ],
    actionItems: [
      'Join 3 groups relevant to your niche.',
      'Post a photo of an outfit asking for feedback (soft sell).',
      'Reply to 5 posts offering styling advice.'
    ],
    icon: 'Facebook'
  },
  {
    id: 'editing-capcut',
    title: '7. Social: CapCut Editing',
    platform: 'Social',
    description: 'Editing determines retention. Use CapCut to create snappy, professional clips that keep viewers watching.',
    strategies: [
      'Match Cut: Transition between scenes on the beat of the music.',
      'Auto-Captions: 80% of people watch without sound. Always caption.',
      'Velocity Edits: Speed up boring parts, slow down the reveal.'
    ],
    actionItems: [
      'Download CapCut.',
      'Create a video using a trending CapCut template.',
      'Add auto-captions to a talking-head video.'
    ],
    icon: 'Film'
  },

  // --- MARKETPLACE ---
  {
    id: 'amazon-assoc',
    title: '8. Marketplace: Amazon Lists',
    platform: 'Marketplace',
    description: 'Amazon is the conversion king. Organize your finds into "Idea Lists" to increase basket size.',
    strategies: [
      'Themed Lists: "Date Night", "Gym Essentials", "Home Office Setup".',
      'Bounty Programs: Promote free trials (Prime, Audible) for easy fixed commissions.',
      'Cookie Duration: Remember the 24-hour cookie. Get them to click daily.'
    ],
    actionItems: [
      'Create an Amazon Idea List named "Monthly Favorites".',
      'Add 10 items to the list.',
      'Share the list link to your Instagram Story.'
    ],
    icon: 'ShoppingBag'
  },
  {
    id: 'ltk-optimization',
    title: '9. Marketplace: LTK Strategy',
    platform: 'Marketplace',
    description: 'RewardStyle (LTK) is the premier fashion app. Optimize your images for the app\'s visual feed.',
    strategies: [
      'Clean Backgrounds: LTK users prefer bright, uncluttered aesthetics.',
      'Exact Matches: Tag the exact item, not similar ones, to reduce returns.',
      'Exclusive Content: Post looks to LTK that aren\'t on Instagram to drive app downloads.'
    ],
    actionItems: [
      'Upload 3 looks to LTK.',
      'Ensure all items are tagged "Exact".',
      'Share your LTK profile link on other socials.'
    ],
    icon: 'Tag'
  },
  {
    id: 'holiday-sales',
    title: '10. Marketplace: Holiday Calendar',
    platform: 'Marketplace',
    description: 'Q4 (Oct-Dec) can make up 50% of your annual revenue. Plan content around key retail dates.',
    strategies: [
      'Black Friday Prep: Tease deals a week before they go live.',
      'Gift Guides: "For Him", "For Mom", "Under $50".',
      'Shipping Deadlines: Remind followers when the last day to order is.'
    ],
    actionItems: [
      'Create a "Gift Guide" page on your bridge site.',
      'Map out key dates: Black Friday, Cyber Monday, Valentine\'s.',
      'Pre-write captions for sale days.'
    ],
    icon: 'Calendar'
  },
  {
    id: 'compliance',
    title: '11. Marketplace: Legal Compliance',
    platform: 'Marketplace',
    description: 'Avoid getting banned. You must disclose affiliate relationships clearly and conspicuously.',
    strategies: [
      'Clear Labels: Use #ad, #sponsored, or "Commissionable Link" on every post.',
      'Above the Fold: Disclosures must be visible without clicking "more".',
      'Statement: Ensure your bridge page has a dedicated Disclosure page.'
    ],
    actionItems: [
      'Audit your last 10 posts for #ad tags.',
      'Verify your bridge page has a visible Disclaimer link.',
      'Read the Amazon Associates Operating Agreement.'
    ],
    icon: 'Shield'
  },
  {
    id: 'shein-hacks',
    title: '12. Marketplace: Shein & Fast Fashion',
    platform: 'Marketplace',
    description: 'Fast fashion relies on volume. Focus on "Hauls" and "Try-ons" to drive massive traffic.',
    strategies: [
      'Coupon Stacking: Always provide a discount code in your caption.',
      'Sizing Guides: Be the expert on fit. "Size up" or "True to size" is valuable info.',
      'Dupes: Explicitly compare expensive brands to the affordable alternative.'
    ],
    actionItems: [
      'Film a "What I Ordered vs What I Got" video.',
      'Create a collection called "Luxury Dupes".',
      'Post a dedicated coupon code graphic.'
    ],
    icon: 'ShoppingBag'
  },

  // --- SEO ---
  {
    id: 'seo-keywords',
    title: '13. SEO: Keyword Research',
    platform: 'SEO',
    description: 'Speak the language your customers type into Google. Don\'t guess; use data.',
    strategies: [
      'Long-Tail Keywords: Target "Red silk maxi dress for wedding guest" instead of "Red dress".',
      'Google Suggest: Type a product into Google and see what auto-completes.',
      'Answer the Public: Find out what questions people ask about specific fashion items.'
    ],
    actionItems: [
      'List 10 keywords relevant to your niche.',
      'Rename your product titles on the bridge page to include these keywords.',
      'Update your page Slogan.'
    ],
    icon: 'Search'
  },
  {
    id: 'seo-blogging',
    title: '14. SEO: Micro-Blogging',
    platform: 'SEO',
    description: 'Google loves text. Add 300 words of description to your bridge page "About" or product sections.',
    strategies: [
      'Storytelling: Weave the product into a lifestyle narrative.',
      'Formatting: Use H1, H2, and bullet points to make text scannable.',
      'Internal Linking: Link from your About page to your Collections page.'
    ],
    actionItems: [
      'Expand your "About Me" section to 300+ words.',
      'Write detailed descriptions for your top 3 products.',
      'Add links between categories.'
    ],
    icon: 'FileText'
  },
  {
    id: 'seo-images',
    title: '15. SEO: Image Optimization',
    platform: 'SEO',
    description: 'Google Images drives traffic. Ensure your visuals are readable by search engines.',
    strategies: [
      'Alt Text: Describe the image for accessibility and SEO (e.g., "Woman wearing gold watch").',
      'File Names: Upload files as `gold-watch.jpg`, not `IMG_9932.jpg`.',
      'Compression: Fast loading images improve search rankings.'
    ],
    actionItems: [
      'Rename your hero images before uploading.',
      'Fill in the "Description" field for all products.',
      'Run a speed test on your site.'
    ],
    icon: 'Image'
  },
  {
    id: 'seo-backlinks',
    title: '16. SEO: Building Authority',
    platform: 'SEO',
    description: 'Backlinks (other sites linking to you) tell Google you are trustworthy.',
    strategies: [
      'Guest Posting: Write style articles for smaller fashion blogs in exchange for a link.',
      'Social Signals: Shares from Pinterest and Twitter count as social signals.',
      'Press: Sign up for HARO (Help a Reporter Out) to give quotes on fashion trends.'
    ],
    actionItems: [
      'Pin every product on your site to Pinterest.',
      'Share your link on LinkedIn.',
      'Reach out to one fashion blogger for a collab.'
    ],
    icon: 'Link'
  },
  {
    id: 'seo-local',
    title: '17. SEO: Local Visibility',
    platform: 'SEO',
    description: 'Even for online businesses, local SEO helps you dominate your immediate area.',
    strategies: [
      'Google My Business: Create a profile if you offer consulting.',
      'Local Keywords: Use "Personal Stylist [City Name]" in your footer.',
      'Map Embeds: Having a location on your Contact page builds trust.'
    ],
    actionItems: [
      'Update your footer with your city and province.',
      'Create a Google My Business profile.',
      'Ask a local client for a review.'
    ],
    icon: 'MapPin'
  },

  // --- EMAIL MARKETING ---
  {
    id: 'email-welcome',
    title: '18. Email: The Welcome Flow',
    platform: 'Email',
    description: 'The first email you send has the highest open rate. Make it count.',
    strategies: [
      'Instant Value: Deliver the lead magnet (PDF, Discount) immediately.',
      'Personal Intro: Introduce yourself and your style philosophy.',
      'Expectation Setting: Tell them how often you will email them.'
    ],
    actionItems: [
      'Draft a "Welcome to the Family" email.',
      'Set up an auto-reply in EmailJS or your provider.',
      'Add a "Subscribe" CTA to your homepage.'
    ],
    icon: 'Mail'
  },
  {
    id: 'email-segmentation',
    title: '19. Email: Segmentation',
    platform: 'Email',
    description: 'Don\'t send everything to everyone. Group your subscribers to increase relevance.',
    strategies: [
      'Interest Tags: Tag users who click on "Shoes" vs "Dresses".',
      'Purchase History: Separate buyers from window shoppers.',
      'Engagement: Resend campaigns to people who didn\'t open the first time.'
    ],
    actionItems: [
      'Create two groups: "VIP Buyers" and "New Leads".',
      'Send a targeted email to VIPs only.',
      'Clean your list of inactive subscribers.'
    ],
    icon: 'Users'
  },
  {
    id: 'email-subject',
    title: '20. Email: Subject Line Psychology',
    platform: 'Email',
    description: 'The subject line is the gatekeeper. If it fails, the email content doesn\'t matter.',
    strategies: [
      'Curiosity Gap: "You won\'t believe what I found..."',
      'Urgency: "Last chance for this dupe!"',
      'Personalization: "Sarah, I picked this for you."'
    ],
    actionItems: [
      'Write 10 subject lines for your next email.',
      'A/B test two different subject lines.',
      'Use an emoji in your next subject line.'
    ],
    icon: 'PenTool'
  },
  {
    id: 'email-newsletter',
    title: '21. Email: The Weekly Roundup',
    platform: 'Email',
    description: 'Consistency builds trust. A weekly "Friday Faves" email keeps you top of mind.',
    strategies: [
      'Curated List: Share your top 5 clicks of the week.',
      'Life Update: Share a small personal story to build connection.',
      'Exclusive Codes: Share a discount code only available to subscribers.'
    ],
    actionItems: [
      'Design a simple newsletter template.',
      'Schedule your first "Weekly Edit" email.',
      'Include a "Forward to a Friend" link.'
    ],
    icon: 'Calendar'
  },
  {
    id: 'email-abandoned',
    title: '22. Email: Re-engagement',
    platform: 'Email',
    description: 'Win back people who have gone quiet or clicked but didn\'t buy.',
    strategies: [
      'The "Did you miss this?" email.',
      'Offer a limited-time bonus styling tip.',
      'Ask a question to provoke a reply.'
    ],
    actionItems: [
      'Identify subscribers inactive for 60 days.',
      'Send a "Are you still looking for [Item]?" email.',
      'Offer a personal recommendation.'
    ],
    icon: 'RefreshCw'
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
      { id: 'sales.orders', label: 'Manage Direct Orders' },
      { id: 'sales.delete', label: 'Delete Enquiries' },
      { id: 'sales.export', label: 'Export Data' }
    ]
  },
  // ... (rest of permissions)
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'owner',
    name: 'Main Administrator',
    email: 'admin@moniqueboutique.com',
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
    message: 'Hi there, I am looking for a personal stylist for an upcoming gala in Cape Town. Do you offer virtual consultations?',
    createdAt: Date.now() - 86400000 * 2,
    status: 'unread'
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Monique Boutique',
  slogan: 'Your Bridge to Global Style',
  companyLogo: 'MB',
  companyLogoUrl: 'https://i.ibb.co/5X5qJXC6/Whats-App-Image-2026-01-08-at-15-34-23-removebg-preview.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'moniqueboutique101@gmail.com',
  contactPhone: '+27 76 836 0325',
  whatsappNumber: '27768360325',
  address: 'Mokopane, Limpopo, 0601',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],

  footerDescription: "The premier bridge page system marketing various affiliate programs. Your curated gateway to Shein and global fashion trends.",
  footerCopyrightText: "All rights reserved.",

  // Home Page Content
  homeHeroBadge: 'Affiliate Curator',
  homeAboutTitle: 'Me and My Story.',
  homeAboutDescription: 'I built this bridge page to share my journey in affiliate marketing. Here I showcase my favorite finds from programs like Shein, offering you a personal look at the products I love and recommend.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Curated Departments',
  homeCategorySectionSubtitle: 'The Collection',
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
  aboutHeroTitle: 'My Story.',
  aboutHeroSubtitle: 'Welcome to my bridge page. I curate the best fashion so you don\'t have to.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Monique',
  aboutLocation: 'Online',

  aboutHistoryTitle: 'The Bridge System',
  aboutHistoryBody: 'This website is more than just a store; it is a bridge page system designed to market various affiliate programs. My passion for fashion led me to partner with brands like Shein to bring you the best deals.\n\nHere you will find my personal reviews, styling tips, and direct links to purchase the items I love.',
  
  aboutMissionTitle: 'Marketing Mission',
  aboutMissionBody: 'To bridge the gap between you and the best global affiliate offers.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'Join the Community',
  aboutCommunityBody: 'Follow my journey as I discover new trends and deals.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency',
  aboutIntegrityBody: 'I am upfront about my role as an affiliate marketer. This system is built on trust.',
  aboutIntegrityIcon: 'Shield',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551488852-0801d863dc34?auto=format&fit=crop&q=80&w=800'
  ],

  // Contact Page Content
  contactHeroTitle: 'Get in Touch.',
  contactHeroSubtitle: 'Have questions about a product or my affiliate partners?',
  contactFormNameLabel: 'Name',
  contactFormEmailLabel: 'Email',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Send Message',
  
  contactInfoTitle: 'Contact',
  contactAddressLabel: 'Location',
  contactHoursLabel: 'Hours',
  contactHoursWeekdays: 'Online 24/7',
  contactHoursWeekends: '',

  // Legal Content
  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### COMPREHENSIVE AFFILIATE DISCLOSURE STATEMENT...`, 
  privacyTitle: 'Privacy Policy',
  privacyContent: `### COMPREHENSIVE PRIVACY POLICY...`, 
  termsTitle: 'Terms of Service',
  termsContent: `### TERMS OF SERVICE & USER AGREEMENT...`, 

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

  // Commerce (New)
  enableDirectSales: false,
  currency: 'ZAR',
  yocoPublicKey: '',
  payfastMerchantId: '',
  payfastMerchantKey: '',
  payfastSaltPassphrase: '',
  zapierWebhookUrl: '',
  bankDetails: ''
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Silk Series',
    subtitle: 'Flowing silhouettes designed for the golden hour.',
    cta: 'View Collection'
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Apparel', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Luxury ready-to-wear.' },
  { id: 'cat2', name: 'Accessories', icon: 'Watch', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800', description: 'The finishing touch.' },
  { id: 'cat3', name: 'Footwear', icon: 'Footprints', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', description: 'Walk in confidence.' },
  { id: 'cat4', name: 'Home Living', icon: 'Home', image: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=800', description: 'Couture for your space.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Silk Dresses' },
  { id: 'sub2', categoryId: 'cat1', name: 'Tailored Blazers' },
  { id: 'sub3', categoryId: 'cat2', name: 'Leather Bags' },
  { id: 'sub4', categoryId: 'cat3', name: 'Stilettos' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Midnight Silk Wrap',
    sku: 'MB-APP-001',
    price: 3450,
    affiliateLink: 'https://example.com/midnight-silk',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'A luxurious 100% silk wrap dress that transitions perfectly from day to night. Personally selected for its incredible drape and timeless silhouette.',
    features: [
      '100% Premium Mulberry Silk',
      'Hand-finished french seams',
      'Adjustable wrap closure',
      'Temperature regulating'
    ],
    specifications: {
      'Material': '100% Mulberry Silk',
      'Care': 'Dry Clean Only',
      'Fit': 'True to Size'
    },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', name: 'Silk Dress', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now(),
    discountRules: [{ id: 'd1', type: 'percentage', value: 15, description: 'Season Launch' }],
    // reviews: [...] removed for relational normalization
    isDirectSale: false,
    stockQuantity: 0
  }
];
