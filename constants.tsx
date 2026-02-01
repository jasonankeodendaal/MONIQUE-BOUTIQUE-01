
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule, Article, Subscriber } from './types';

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
    description: 'We need to define the structure of your data. This script creates specific tables for public content and protected secrets.',
    illustrationId: 'forge',
    subSteps: [
      'In your Supabase Dashboard, look at the left sidebar icon menu.',
      'Click on "SQL Editor" (icon looks like a terminal prompt >_).',
      'Click "+ New Query" at the top left.',
      'Copy the entire SQL block provided below.',
      'Paste it into the editor window.',
      'Click the green "Run" button at the bottom right.',
      'Success Check: Go to "Table Editor" and ensure you see tables like "public_settings", "private_secrets", etc.'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v6.1 (Added Subscribers)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CONTENT TABLES (Public Read)
CREATE TABLE IF NOT EXISTS public_settings (
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
  -- Publicly Needed Keys (Client-side ops)
  "emailJsServiceId" TEXT, "emailJsTemplateId" TEXT, "emailJsPublicKey" TEXT,
  "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "pinterestTagId" TEXT,
  "enableDirectSales" BOOLEAN DEFAULT false, "currency" TEXT DEFAULT 'ZAR', 
  "yocoPublicKey" TEXT, "payfastMerchantId" TEXT, "payfastMerchantKey" TEXT,
  "bankDetails" TEXT,
  "vatRegistered" BOOLEAN DEFAULT false, "vatRate" NUMERIC, "vatNumber" TEXT,
  "bankName" TEXT, "accountNumber" TEXT, "branchCode" TEXT
);

-- 3. SECRETS TABLE (Admin Only)
CREATE TABLE IF NOT EXISTS private_secrets (
  id TEXT PRIMARY KEY DEFAULT 'global',
  "payfastSaltPassphrase" TEXT, 
  "zapierWebhookUrl" TEXT,
  "webhookUrl" TEXT
);

-- 4. CORE DATA TABLES
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT,
  "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features TEXT[], specifications JSONB,
  media JSONB, "discountRules" JSONB, "createdAt" BIGINT, "createdBy" TEXT,
  "isDirectSale" BOOLEAN DEFAULT false, "stockQuantity" INTEGER DEFAULT 0, "costPrice" NUMERIC DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, icon TEXT, image TEXT, description TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY, "categoryId" TEXT, name TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY, image TEXT, type TEXT, title TEXT, subtitle TEXT, cta TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT, email TEXT, whatsapp TEXT, subject TEXT, message TEXT, "createdAt" BIGINT, status TEXT);
CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, title TEXT, excerpt TEXT, content TEXT, image TEXT, date BIGINT, author TEXT);
CREATE TABLE IF NOT EXISTS subscribers (id TEXT PRIMARY KEY, email TEXT, "createdAt" BIGINT);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY, 
  name TEXT, email TEXT, role TEXT, permissions TEXT[], 
  "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT,
  "commissionRate" NUMERIC DEFAULT 0, "totalEarnings" NUMERIC DEFAULT 0, "uploadLimit" INTEGER DEFAULT 0, "canUpload" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT, source TEXT, city TEXT, "utmCampaign" TEXT, "utmMedium" TEXT, "scrollDepth" INTEGER, "sessionDuration" INTEGER, "interactionType" TEXT);
CREATE TABLE IF NOT EXISTS product_stats ( "productId" TEXT PRIMARY KEY, views INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, "totalViewTime" NUMERIC DEFAULT 0, "lastUpdated" BIGINT );
CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, "productId" TEXT REFERENCES products(id) ON DELETE CASCADE, "userName" TEXT, rating INTEGER, comment TEXT, "createdAt" BIGINT);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, "userId" TEXT, "customerName" TEXT, "customerEmail" TEXT, "shippingAddress" TEXT,
  total NUMERIC, status TEXT, "paymentMethod" TEXT, "createdAt" BIGINT,
  "courierName" TEXT, "trackingNumber" TEXT, "trackingUrl" TEXT, "affiliateId" TEXT
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY, "orderId" TEXT REFERENCES orders(id) ON DELETE CASCADE,
  "productId" TEXT, "productName" TEXT, quantity INTEGER, price NUMERIC
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  "fullName" TEXT, phone TEXT, building TEXT, street TEXT, suburb TEXT, city TEXT, province TEXT, "postalCode" TEXT, "updatedAt" BIGINT
);

-- 5. RLS & POLICIES
ALTER TABLE public_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    -- Public Read Access
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read settings') THEN CREATE POLICY "Public Read settings" ON public_settings FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read products') THEN CREATE POLICY "Public Read products" ON products FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read categories') THEN CREATE POLICY "Public Read categories" ON categories FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read subcategories') THEN CREATE POLICY "Public Read subcategories" ON subcategories FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read hero_slides') THEN CREATE POLICY "Public Read hero_slides" ON hero_slides FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read reviews') THEN CREATE POLICY "Public Read reviews" ON reviews FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read articles') THEN CREATE POLICY "Public Read articles" ON articles FOR SELECT USING (true); END IF;
    
    -- Public Write (Safe Tables)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert enquiries') THEN CREATE POLICY "Public Insert enquiries" ON enquiries FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert reviews') THEN CREATE POLICY "Public Insert reviews" ON reviews FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert traffic_logs') THEN CREATE POLICY "Public Insert traffic_logs" ON traffic_logs FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert orders') THEN CREATE POLICY "Public Insert orders" ON orders FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert order_items') THEN CREATE POLICY "Public Insert order_items" ON order_items FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert subscribers') THEN CREATE POLICY "Public Insert subscribers" ON subscribers FOR INSERT WITH CHECK (true); END IF;

    -- Private Secrets (Auth/Admin Only)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Read Secrets') THEN CREATE POLICY "Authenticated Read Secrets" ON private_secrets FOR SELECT USING (auth.role() = 'authenticated'); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Update Secrets') THEN CREATE POLICY "Authenticated Update Secrets" ON private_secrets FOR UPDATE USING (auth.role() = 'authenticated'); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Insert Secrets') THEN CREATE POLICY "Authenticated Insert Secrets" ON private_secrets FOR INSERT WITH CHECK (auth.role() = 'authenticated'); END IF;

    -- Profiles (User Own)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read profiles') THEN CREATE POLICY "Public Read profiles" ON profiles FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users update own profile') THEN CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users insert own profile') THEN CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id); END IF;
END $$;

-- Admin Full Access (Allow anon for setup/local, use Service Role in prod ideally or stricter policies)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon public_settings') THEN CREATE POLICY "Enable all for anon public_settings" ON public_settings FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon products') THEN CREATE POLICY "Enable all for anon products" ON products FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon categories') THEN CREATE POLICY "Enable all for anon categories" ON categories FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon subcategories') THEN CREATE POLICY "Enable all for anon subcategories" ON subcategories FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon hero_slides') THEN CREATE POLICY "Enable all for anon hero_slides" ON hero_slides FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon enquiries') THEN CREATE POLICY "Enable all for anon enquiries" ON enquiries FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon admin_users') THEN CREATE POLICY "Enable all for anon admin_users" ON admin_users FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon traffic_logs') THEN CREATE POLICY "Enable all for anon traffic_logs" ON traffic_logs FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon product_stats') THEN CREATE POLICY "Enable all for anon product_stats" ON product_stats FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon orders') THEN CREATE POLICY "Enable all for anon orders" ON orders FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon order_items') THEN CREATE POLICY "Enable all for anon order_items" ON order_items FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon reviews') THEN CREATE POLICY "Enable all for anon reviews" ON reviews FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon articles') THEN CREATE POLICY "Enable all for anon articles" ON articles FOR ALL USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon subscribers') THEN CREATE POLICY "Enable all for anon subscribers" ON subscribers FOR ALL USING (true); END IF;
END $$;

-- 6. STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Media') THEN CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING ( bucket_id = 'media' ); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Media') THEN CREATE POLICY "Public Insert Media" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'media' ); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update Media') THEN CREATE POLICY "Public Update Media" ON storage.objects FOR UPDATE USING ( bucket_id = 'media' ); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Delete Media') THEN CREATE POLICY "Public Delete Media" ON storage.objects FOR DELETE USING ( bucket_id = 'media' ); END IF;
END $$;`,
    codeLabel: 'Full System SQL Script (v6.1)'
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
      'Note: The SQL script in Step 2 has already applied the necessary permission policies for this bucket.'
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
    id: 'deploy',
    title: '6. Global Deployment (Vercel)',
    description: 'Launch your bridge page to the world. Vercel provides fast, secure hosting for React apps.',
    illustrationId: 'forge',
    subSteps: [
      'Push your code to a GitHub repository.',
      'Visit https://vercel.com and sign up/login.',
      'Click "Add New..." > "Project" > Import from GitHub.',
      'Select your repository.',
      'Environment Variables: Copy the same Name/Value pairs from your local .env file (VITE_SUPABASE_URL, etc.).',
      'Click "Deploy". Your site is now live!'
    ]
  },
  {
    id: 'emailjs-config',
    title: '7. EmailJS Configuration',
    description: 'Configure your transactional emails. Copy the templates below into your EmailJS dashboard to enable professional notifications and auto-replies.',
    illustrationId: 'forge',
    subSteps: [
      'Go to EmailJS Dashboard > Email Templates.',
      'Create a new template.',
      'Click the "Source Code" icon (< >) in the editor toolbar.',
      'Paste the specific HTML code provided below.',
      'Save. Repeat for the second template.',
      'Copy your Service ID, Template IDs, and Public Key to the "Integrations" tab in your Admin Panel.'
    ],
    code: `<!-- 1. ADMIN NOTIFICATION TEMPLATE (To You) -->
<div style="font-family: sans-serif; color: #333;">
  <h2 style="color: #D4AF37;">New Concierge Request</h2>
  <p><strong>Client:</strong> {{name}}</p>
  <p><strong>Email:</strong> {{email}}</p>
  <p><strong>WhatsApp:</strong> {{whatsapp}}</p>
  <hr style="border: 0; border-top: 1px solid #eee;">
  <h3>{{subject}}</h3>
  <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37;">
    {{message}}
  </div>
</div>

<!-- 2. CLIENT AUTO-REPLY TEMPLATE (To User) -->
<div style="font-family: 'Playfair Display', serif; text-align: center; color: #1e293b; padding: 40px;">
  <h1 style="color: #D4AF37; text-transform: uppercase; letter-spacing: 2px;">Monique Boutique</h1>
  <p style="font-size: 18px;">Dear {{name}},</p>
  <p>We have received your inquiry regarding <strong>{{subject}}</strong>.</p>
  <p>Our concierge team is reviewing your request and will be in touch shortly.</p>
  <br>
  <p style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Curating the Exceptional</p>
</div>`,
    codeLabel: 'HTML Email Templates'
  },
  // ... (Social steps)
];

// ... (TRAINING_MODULES, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES unchanged)

// Add new initial data for articles
export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Art of the Capsule Wardrobe',
    excerpt: 'How to build a timeless collection of essentials that work together seamlessly to create endless looks.',
    content: 'Building a capsule wardrobe is not just about minimalism; it is about intentionality. By selecting pieces that are versatile and high-quality, you create a foundation for personal style that transcends trends.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    date: Date.now() - 100000000,
    author: 'Curator'
  },
  {
    id: '2',
    title: 'Summer 2025 Trend Report',
    excerpt: 'What to expect from the runways of Paris and Milan this coming season.',
    content: 'From bold hues to sheer fabrics, the upcoming season promises a return to glamour. We break down the key trends you need to know.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    date: Date.now() - 200000000,
    author: 'Editor'
  },
  {
    id: '3',
    title: 'Sustainable Luxury: A Guide',
    excerpt: 'Why investing in high-quality, ethically sourced pieces is the future of fashion.',
    content: 'True luxury is sustainable. Discover brands that are prioritizing ethical production methods without compromising on style.',
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=800',
    date: Date.now() - 300000000,
    author: 'Guest'
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [];

export const TRAINING_MODULES: TrainingModule[] = [
  // ... (unchanged content)
  // --- INSTAGRAM MASTERY ---
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
    id: 'ig-stories',
    title: '2. Instagram: Stories That Sell',
    platform: 'Instagram',
    description: 'Stories are where retention happens. Build a relationship with your audience through behind-the-scenes content.',
    strategies: [
      'The 4-Slide Rule: Hook, Value, Proof, CTA.',
      'Polls & Stickers: Use interaction stickers to boost algorithmic ranking.',
      'Link Stickers: Place link stickers in the "thumb zone" (bottom right).'
    ],
    actionItems: [
      'Post 3 stories today: Morning coffee, Outfit check, Product link.',
      'Use a poll sticker to ask "This or That?".',
      'Save your best selling stories to a Highlight.'
    ],
    icon: 'Aperture'
  },
  {
    id: 'ig-reels',
    title: '3. Instagram: Reels Algorithm',
    platform: 'Instagram',
    description: 'Reels are the primary growth engine on Instagram currently. Reach non-followers effectively.',
    strategies: [
      'Trending Audio: Use audios with < 10k uses that have an upward arrow.',
      'Text Overlay: Place text within the 4:5 safe zone to avoid being cut off in the grid.',
      'Looping: Create videos that loop seamlessly to increase watch time.'
    ],
    actionItems: [
      'Find 3 trending audios.',
      'Film a 7-second Reel pointing to text bubbles.',
      'Post consistently at the same time for a week.'
    ],
    icon: 'Film'
  },
  {
    id: 'ig-dm',
    title: '4. Instagram: DM Automation',
    platform: 'Instagram',
    description: 'Convert comments into sales conversations automatically.',
    strategies: [
      'Keyword Triggers: Tell users "Comment LINK" to get the product sent to their DMs.',
      'ManyChat Basics: Set up a simple auto-reply flow.',
      'Personal Touch: Send a voice note to new high-value followers.'
    ],
    actionItems: [
      'Set up a ManyChat account (free tier).',
      'Create a trigger keyword for your latest post.',
      'Test the automation with a friend.'
    ],
    icon: 'MessageCircle'
  },
  {
    id: 'ig-seo',
    title: '5. Instagram: SEO & Hashtags',
    platform: 'Instagram',
    description: 'Stop relying on hashtags alone. Optimize your entire post for search.',
    strategies: [
      'Alt Text: Add descriptive alt text to your images before posting.',
      'Caption Keywords: Write captions that include "Summer Dress" or "Office Outfit".',
      'Hashtag Ladders: Mix broad (1M+), medium (500k), and niche (50k) tags.'
    ],
    actionItems: [
      'Research 10 keywords for your niche.',
      'Update 3 old posts with Alt Text.',
      'Create 3 hashtag groups in your notes app.'
    ],
    icon: 'Search'
  },
  {
    id: 'ig-collab',
    title: '6. Instagram: Collab Posts',
    platform: 'Instagram',
    description: 'Double your reach by leveraging other accounts\' audiences.',
    strategies: [
      'Brand Collabs: Tag the brand as a collaborator (if approved) or tag them in the photo.',
      'Peer Collabs: Team up with a creator in a complementary niche.',
      'Engagement Pods: Genuine support groups to boost initial engagement.'
    ],
    actionItems: [
      'Identify 5 peers with similar follower counts.',
      'Propose a "Style Swap" collab.',
      'Tag the brands in your outfit photo.'
    ],
    icon: 'Users'
  },

  // --- TIKTOK GROWTH ---
  {
    id: 'tiktok-hooks',
    title: '7. TikTok: The 3-Second Hook',
    platform: 'TikTok',
    description: 'Stop the scroll immediately. If you do not grab attention in 3 seconds, the algorithm kills your reach.',
    strategies: [
      'Visual Interrupts: Start with movement or a sudden transition.',
      'Text Overlays: Use "You won\'t believe this price" or "Amazon vs Reality".',
      'Controversial Takes: "Unpopular opinion: This dupe is better."'
    ],
    actionItems: [
      'Film 3 videos using different visual hooks.',
      'Test text-to-speech for the opening line.',
      'Analyze watch time in analytics.'
    ],
    icon: 'Zap'
  },
  {
    id: 'tiktok-audio',
    title: '8. TikTok: Audio Strategy',
    platform: 'TikTok',
    description: 'Sound is half the experience on TikTok. Ride the waves of viral sounds.',
    strategies: [
      'Sound Sync: Edit your cuts to the beat of the music.',
      'Original Audio: Create ASMR unboxing sounds.',
      'Volume Mixing: Lower music to 10-20% when speaking.'
    ],
    actionItems: [
      'Save 5 sounds from your For You Page.',
      'Create a video syncing 3 outfit changes to a beat.',
      'Record an ASMR packaging video.'
    ],
    icon: 'Music'
  },
  {
    id: 'tiktok-seo',
    title: '9. TikTok: Search Optimization',
    platform: 'TikTok',
    description: 'TikTok is a search engine. Get found by people looking for specific items.',
    strategies: [
      'Screen Text: Put keywords on the screen for the first 3 seconds.',
      'Spoken Keywords: Say the product name clearly in the video.',
      'Caption Structure: "The best [Product] for [Problem] in 2024".'
    ],
    actionItems: [
      'Search your niche keyword and see what auto-fills.',
      'Create a video answering a specific search query.',
      'Use 3-5 keywords in your caption.'
    ],
    icon: 'SearchCode'
  },
  {
    id: 'tiktok-stitch',
    title: '10. TikTok: Duet & Stitch',
    platform: 'TikTok',
    description: 'Piggyback on viral content to divert traffic to your page.',
    strategies: [
      'Reaction Videos: React to high-fashion runway fails or wins.',
      'Add Value: Stitch a problem video with your product as the solution.',
      'Blind Reacts: Genuine reactions to price reveals.'
    ],
    actionItems: [
      'Find a viral fashion video posted in the last 24h.',
      'Stitch it with your take.',
      'Duet a "Get Ready With Me" adding commentary.'
    ],
    icon: 'Repeat'
  },
  {
    id: 'tiktok-batch',
    title: '11. Content Batching',
    platform: 'TikTok',
    description: 'Consistency is key. Film everything in one day to stay ahead.',
    strategies: [
      'Outfit Changes: Bring 5 outfits to a location.',
      'Drafts Folder: Keep 10 videos in drafts for busy days.',
      'Scripting: Write out your hooks before you turn on the camera.'
    ],
    actionItems: [
      'Schedule a 2-hour filming block this Sunday.',
      'Prepare 5 scripts.',
      'Film and edit 5 videos to keep in drafts.'
    ],
    icon: 'Layers'
  },
  {
    id: 'tiktok-live',
    title: '12. TikTok: Going Live',
    platform: 'TikTok',
    description: 'Build deep connection and sell in real-time.',
    strategies: [
      'Q&A Session: Answer questions about sizing and fit.',
      'Try-On Haul: Live unboxing and trying on new items.',
      'Flash Sale: Exclusive discount codes for live viewers.'
    ],
    actionItems: [
      'Announce a "Live Try-On" 24 hours in advance.',
      'Go live for at least 30 minutes.',
      'Have your products ready to show on camera.'
    ],
    icon: 'Radio'
  },

  // --- PINTEREST STRATEGY ---
  {
    id: 'pin-design',
    title: '13. Pinterest: Pin Design',
    platform: 'Pinterest',
    description: 'Pinterest is a visual discovery engine. Your pins must be aesthetic and clear.',
    strategies: [
      'Vertical Aspect Ratio: Always use 2:3 (1000x1500px).',
      'Text Overlay: Large, readable fonts with good contrast.',
      'Branding: Subtle logo placement at the top or bottom.'
    ],
    actionItems: [
      'Create 3 pin templates in Canva.',
      'Design 5 pins for your top-performing product.',
      'Test a video pin.'
    ],
    icon: 'Palette'
  },
  {
    id: 'pin-seo',
    title: '14. Pinterest: Keywords',
    platform: 'Pinterest',
    description: 'Target high-intent buyers searching for specific aesthetics.',
    strategies: [
      'Pinterest Trends: Use the native tool to find rising searches.',
      'Board SEO: Name your boards "Summer Fashion" not "Stuff I like".',
      'Description: Write full sentences containing keywords.'
    ],
    actionItems: [
      'Rename your generic boards.',
      'Write a keyword-rich description for your profile.',
      'Research "OOTD" trends for the upcoming season.'
    ],
    icon: 'Hash'
  },
  {
    id: 'pin-rich',
    title: '15. Pinterest: Rich Pins',
    platform: 'Pinterest',
    description: 'Automatically pull metadata from your site to Pinterest.',
    strategies: [
      'Product Rich Pins: Show real-time pricing and availability.',
      'Article Rich Pins: Show headline and author for blog posts.',
      'Validation: Use the Pinterest Validator tool.'
    ],
    actionItems: [
      'Apply for Rich Pins in Pinterest settings.',
      'Verify your website claim.',
      'Check if price updates reflect on your pins.'
    ],
    icon: 'Tag'
  },
  {
    id: 'pin-group',
    title: '16. Group Boards',
    platform: 'Pinterest',
    description: 'Leverage established communities to get your content seen.',
    strategies: [
      'Niche Boards: Join boards specific to "Affiliate Fashion".',
      'Rules: Read and follow board rules strictly to avoid banning.',
      'Reciprocity: Re-pin others\' content to maintain good standing.'
    ],
    actionItems: [
      'Request to join 3 active group boards.',
      'Pin your best content to these boards.',
      'Engage with 5 other pins on the board.'
    ],
    icon: 'Users'
  },
  {
    id: 'pin-idea',
    title: '17. Idea Pins',
    platform: 'Pinterest',
    description: 'Pinterest\'s answer to Stories. Great for engagement.',
    strategies: [
      'Multi-Page Content: Create a 5-page guide "How to Style...".',
      'Video Integration: Use video on the first slide to grab attention.',
      'Tagging: Tag products directly in the Idea Pin.'
    ],
    actionItems: [
      'Create an Idea Pin showing "3 Ways to Wear a White Shirt".',
      'Tag the white shirt affiliate link.',
      'Include a CTA on the last slide.'
    ],
    icon: 'Lightbulb'
  },

  // --- CONTENT CREATION ---
  {
    id: 'photo-mobile',
    title: '18. Mobile Photography',
    platform: 'Content',
    description: 'You don\'t need a DSLR. Master your phone camera.',
    strategies: [
      'Lighting: Always face the window (natural light).',
      'Grid Lines: Use the rule of thirds for composition.',
      'Exposure Lock: Tap and hold to lock focus and exposure.'
    ],
    actionItems: [
      'Clean your camera lens.',
      'Take a flat-lay photo using window light.',
      'Edit exposure and contrast in Lightroom Mobile.'
    ],
    icon: 'Smartphone'
  },
  {
    id: 'video-capcut',
    title: '19. Video Editing (CapCut)',
    platform: 'Content',
    description: 'The industry standard for short-form video editing.',
    strategies: [
      'Keyframes: Add subtle zooms to static shots.',
      'Auto-Captions: Generate and style captions instantly.',
      'Overlay: Add "picture-in-picture" for reaction videos.'
    ],
    actionItems: [
      'Download CapCut.',
      'Edit a raw video clip adding a zoom effect.',
      'Export in 1080p/60fps.'
    ],
    icon: 'Scissors'
  },
  {
    id: 'aesthetic',
    title: '20. Curation & Aesthetic',
    platform: 'Content',
    description: 'A cohesive visual brand builds trust and recognition.',
    strategies: [
      'Color Palette: Stick to 3-4 core colors for your feed.',
      'Filter Consistency: Use the same preset for all photos.',
      'Mood Boarding: Plan your grid before you post.'
    ],
    actionItems: [
      'Define your brand colors.',
      'Create a mood board on Pinterest.',
      'Archive posts that clash with your new aesthetic.'
    ],
    icon: 'Sparkles'
  },
  {
    id: 'copywriting',
    title: '21. Copywriting 101',
    platform: 'Content',
    description: 'Words that sell. Move people from "nice photo" to "must buy".',
    strategies: [
      'Benefit vs Feature: "100% Silk" (Feature) vs "Feels like water on skin" (Benefit).',
      'Urgency: "Limited stock available".',
      'Storytelling: "I wore this to..."'
    ],
    actionItems: [
      'Rewrite a product description focusing on benefits.',
      'Write 3 different captions for the same product.',
      'Use power words like "Exclusive", "Secret", "Essential".'
    ],
    icon: 'PenTool'
  },
  {
    id: 'ugc',
    title: '22. User Generated Content',
    platform: 'Content',
    description: 'Authenticity wins. Content that looks real performs better.',
    strategies: [
      'Unboxing: Capture the raw excitement of opening a package.',
      'Fail Compilation: Show what didn\'t fit (builds trust).',
      'Texture Shots: Close-ups of fabric and details.'
    ],
    actionItems: [
      'Film an unboxing of your latest order.',
      'Take a macro shot of a fabric texture.',
      'Share an honest review of a product flaw.'
    ],
    icon: 'Camera'
  },

  // --- TRAFFIC & CONVERSION ---
  {
    id: 'email-list',
    title: '23. Building an Email List',
    platform: 'Traffic',
    description: 'You don\'t own your social followers. You own your email list.',
    strategies: [
      'Lead Magnet: Offer a "Free Style Guide" in exchange for email.',
      'Newsletter: Weekly curation of top finds.',
      'Welcome Sequence: Automated email delivering the freebie.'
    ],
    actionItems: [
      'Sign up for an email provider (e.g., Mailchimp).',
      'Create a simple landing page for signups.',
      'Promote your newsletter on stories.'
    ],
    icon: 'Mail'
  },
  {
    id: 'bridge-funnel',
    title: '24. The Bridge Page Funnel',
    platform: 'Traffic',
    description: 'Pre-frame the visitor before sending them to the retailer.',
    strategies: [
      'Personal Review: "Why I bought this".',
      'Context: Show how to style it.',
      'Trust Badges: "Verified Affiliate".'
    ],
    actionItems: [
      'Ensure every product on your site has a personal note.',
      'Check that your "About" page builds authority.',
      'Test your outbound links.'
    ],
    icon: 'Layout'
  },
  {
    id: 'follow-up',
    title: '25. Follow-Up Sequences',
    platform: 'Traffic',
    description: 'The money is in the follow-up. Retarget interested prospects.',
    strategies: [
      'Value Emails: Send styling tips, not just sales links.',
      'Seasonal Updates: "Fall Wardrobe Essentials".',
      'Sale Alerts: Notify list when favorites drop in price.'
    ],
    actionItems: [
      'Draft a "Weekly Favorites" email.',
      'Set a calendar reminder to check for sales.',
      'Segment your list by interest (e.g., Shoes vs Dresses).'
    ],
    icon: 'Repeat'
  },
  {
    id: 'analytics',
    title: '26. Analytics Deep Dive',
    platform: 'Traffic',
    description: 'Data driven decisions reduce wasted effort.',
    strategies: [
      'Click-Through Rate (CTR): Is your creative good?',
      'Conversion Rate: Is your bridge page effective?',
      'Traffic Source: Which platform is winning?'
    ],
    actionItems: [
      'Review your site analytics weekly.',
      'Identify your top 3 traffic sources.',
      'Double down on the top performing content format.'
    ],
    icon: 'BarChart3'
  },
  {
    id: 'link-bio',
    title: '27. Link-in-Bio Optimization',
    platform: 'Traffic',
    description: 'Reduce friction. Make it easy to find what they saw.',
    strategies: [
      'Direct Links: "Shop my Feed" section.',
      'Clear Categories: "Amazon Faves", "OOTD".',
      'Visuals: Use thumbnails for links.'
    ],
    actionItems: [
      'Audit your link-in-bio tool.',
      'Remove broken or old links.',
      'Add a "New Arrivals" button at the top.'
    ],
    icon: 'Link'
  },

  // --- BUSINESS MINDSET ---
  {
    id: 'mindset-abundance',
    title: '28. Abundance Mindset',
    platform: 'Business',
    description: 'There is enough success for everyone. Competition is proof of demand.',
    strategies: [
      'Community vs Competition: Collaborate, don\'t envy.',
      'Positive Affirmations: "I attract wealth".',
      'Gratitude: Celebrate small wins.'
    ],
    actionItems: [
      'Write down 3 things you are grateful for in your business.',
      'Comment genuinely on a "competitor\'s" post.',
      'Replace "I can\'t" with "How can I?".'
    ],
    icon: 'Sun'
  },
  {
    id: 'time-mgmt',
    title: '29. Time Management',
    platform: 'Business',
    description: 'Avoid burnout. Work smarter, not harder.',
    strategies: [
      'Pomodoro Technique: 25 min work, 5 min break.',
      'Time Blocking: Dedicated hours for engagement vs creation.',
      'Boundaries: No DMs after 8 PM.'
    ],
    actionItems: [
      'Create a weekly schedule.',
      'Turn off notifications during deep work blocks.',
      'Take one full day off social media.'
    ],
    icon: 'Clock'
  },
  {
    id: 'imposter-syndrome',
    title: '30. Imposter Syndrome',
    platform: 'Business',
    description: 'You are worthy. Everyone starts at zero.',
    strategies: [
      'Evidence Log: Keep a folder of nice comments/results.',
      'Keep Learning: Competence builds confidence.',
      'Start Ugly: Better done than perfect.'
    ],
    actionItems: [
      'Screenshot a nice comment and save it.',
      'Post something "imperfect" today.',
      'Read one chapter of a business book.'
    ],
    icon: 'Shield'
  },
  {
    id: 'goals',
    title: '31. Goal Setting',
    platform: 'Business',
    description: 'You can\'t hit a target you can\'t see.',
    strategies: [
      'SMART Goals: Specific, Measurable, Achievable, Relevant, Time-bound.',
      'Vision Board: Visual representation of goals.',
      'Reverse Engineering: Break big goals into daily tasks.'
    ],
    actionItems: [
      'Set a revenue goal for this month.',
      'Create a digital vision board for your phone wallpaper.',
      'List 3 tasks for tomorrow that move the needle.'
    ],
    icon: 'Target'
  },
  {
    id: 'finance',
    title: '32. Financial Literacy',
    platform: 'Business',
    description: 'Treat it like a business, not a hobby.',
    strategies: [
      'Track Expenses: Software subscriptions, props, ads.',
      'Reinvest: Put profit back into better gear or courses.',
      'Taxes: Save a percentage of every payout.'
    ],
    actionItems: [
      'Open a separate bank account for business.',
      'Create a spreadsheet for monthly expenses.',
      'Review your affiliate commission tiers.'
    ],
    icon: 'DollarSign'
  }
];


export const PERMISSION_TREE: PermissionNode[] = [
  // ... (unchanged content)
  {
    id: 'sales',
    label: 'Sales & Inbox',
    description: 'Manage incoming client communications and orders.',
    children: [
      { id: 'sales.view', label: 'View Inbox' },
      { id: 'sales.manage', label: 'Manage Enquiries (Reply/Status)' },
      { id: 'sales.orders', label: 'View Orders' },
      { id: 'sales.fulfillment', label: 'Manage Fulfillment (Tracking/Status)' },
      { id: 'sales.export', label: 'Export Data' }
    ]
  },
  {
    id: 'catalog',
    label: 'Catalog & Products',
    description: 'Manage the product database and inventory.',
    children: [
      { id: 'catalog.view', label: 'View Product List' },
      { id: 'catalog.create', label: 'Add New Items' },
      { id: 'catalog.edit', label: 'Edit Item Details' },
      { id: 'catalog.delete', label: 'Delete Items' },
      { id: 'catalog.direct_sales', label: 'Toggle Direct Sales' }
    ]
  },
  {
    id: 'content',
    label: 'Content Management',
    description: 'Manage hero visuals and department categories.',
    children: [
      { id: 'content.hero', label: 'Manage Hero Slides' },
      { id: 'content.categories', label: 'Manage Categories & Depts' }
    ]
  },
  {
    id: 'site',
    label: 'Site Configuration',
    description: 'Control the look, feel, and technical setup of the bridge page.',
    children: [
      { id: 'site.editor', label: 'Access Canvas Editor (General)' },
      { id: 'site.identity', label: 'Edit Identity (Logo/Colors)' },
      { id: 'site.legal', label: 'Edit Legal Pages' },
      { id: 'site.integrations', label: 'Manage Integrations & API Keys' }
    ]
  },
  {
    id: 'analytics',
    label: 'Intelligence',
    description: 'View performance metrics and insights.',
    children: [
      { id: 'analytics.view', label: 'View Analytics Dashboard' }
    ]
  },
  {
    id: 'team',
    label: 'Team Administration',
    description: 'Manage staff access.',
    children: [
      { id: 'team.view', label: 'View Staff List' },
      { id: 'team.manage', label: 'Invite & Edit Admins' }
    ]
  },
  {
    id: 'system',
    label: 'System',
    description: 'Technical monitoring and logs.',
    children: [
      { id: 'system.view', label: 'View System Health & Logs' }
    ]
  },
  {
    id: 'training',
    label: 'Training & Academy',
    description: 'Access educational materials.',
    children: [
        { id: 'training.view', label: 'View Academy' }
    ]
  }
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
    profileImage: '',
    commissionRate: 0,
    totalEarnings: 0,
    uploadLimit: 1000,
    canUpload: true
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
  companyName: 'FINDARA Fashion-Tech-Home',
  slogan: 'Your Bridge to Global Style',
  companyLogo: 'MB',
  companyLogoUrl: 'https://i.ibb.co/wZt02bvX/Whats-App-Image-2026-01-21-at-17-44-31-removebg-preview.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'contact@example.com',
  contactPhone: '+27 00 000 0000',
  whatsappNumber: '27000000000',
  address: 'Online, South Africa',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],

  footerDescription: "The premier bridge page system marketing various affiliate programs. Your curated gateway to global fashion trends.",
  footerCopyrightText: "All rights reserved.",

  // Home Page Content
  homeHeroBadge: 'Affiliate Curator',
  homeAboutTitle: 'Me and My Story.',
  homeAboutDescription: 'I built this bridge page to share my journey in affiliate marketing. Here I showcase my favorite finds, offering you a personal look at the products I love and recommend.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Curated Departments',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'Why Shop Here',
  
  homeTrustItem1Title: 'Verified Affiliate',
  homeTrustItem1Desc: 'Official partner with major global retailers.',
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
  aboutFounderName: 'Curator',
  aboutLocation: 'Online',

  aboutHistoryTitle: 'The Bridge System',
  aboutHistoryBody: 'This website is more than just a store; it is a bridge page system designed to market various affiliate programs. My passion for fashion led me to partner with top brands to bring you the best deals.\n\nHere you will find my personal reviews, styling tips, and direct links to purchase the items I love.',
  
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
  bankDetails: '',

  // Financial Defaults
  vatRate: 15,
  vatNumber: '',
  bankName: '',
  accountNumber: '',
  branchCode: ''
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
