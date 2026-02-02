
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
    title: '2. Database Schema (Repair & Setup)',
    description: 'This script defines your data structure. It includes a "Safety Flush" to remove any corrupted or recursive security policies before creating clean ones.',
    illustrationId: 'forge',
    subSteps: [
      'In your Supabase Dashboard, look at the left sidebar icon menu.',
      'Click on "SQL Editor" (icon looks like a terminal prompt >_).',
      'Click "+ New Query" at the top left.',
      'Copy the entire SQL block provided below.',
      'Paste it into the editor window.',
      'Click the green "Run" button at the bottom right.',
      'Success Check: Look for "Success. No rows returned" in the results area.'
    ],
    code: `-- MASTER ARCHITECTURE & REPAIR SCRIPT v7.0
-- Includes Policy Flush to fix "Infinite Recursion" errors.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SAFETY FLUSH (Drop existing policies to prevent recursion)
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    -- Loop through all policies on public tables and drop them
    FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename); 
    END LOOP; 
END $$;

-- 3. TABLE DEFINITIONS
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
  "emailJsServiceId" TEXT, "emailJsTemplateId" TEXT, "emailJsPublicKey" TEXT,
  "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "pinterestTagId" TEXT,
  "enableDirectSales" BOOLEAN DEFAULT false, "currency" TEXT DEFAULT 'ZAR', 
  "yocoPublicKey" TEXT, "payfastMerchantId" TEXT, "payfastMerchantKey" TEXT,
  "bankDetails" TEXT,
  "vatRegistered" BOOLEAN DEFAULT false, "vatRate" NUMERIC, "vatNumber" TEXT,
  "bankName" TEXT, "accountNumber" TEXT, "branchCode" TEXT
);

CREATE TABLE IF NOT EXISTS private_secrets (
  id TEXT PRIMARY KEY DEFAULT 'global',
  "payfastSaltPassphrase" TEXT, 
  "zapierWebhookUrl" TEXT,
  "webhookUrl" TEXT
);

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

-- 4. RLS ENABLING
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

-- 5. CLEAN NON-RECURSIVE POLICIES
-- These policies use 'USING (true)' to ensure no recursion loops occur during initial setup.
-- For production, you may replace 'true' with proper auth checks, but ensure you do not query the table itself.

-- Public Read
CREATE POLICY "Public Read settings" ON public_settings FOR SELECT USING (true);
CREATE POLICY "Public Read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public Read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public Read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Read articles" ON articles FOR SELECT USING (true);

-- Admin Full Access (Simplified to prevent recursion)
CREATE POLICY "Enable all for anon public_settings" ON public_settings FOR ALL USING (true);
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
CREATE POLICY "Enable all for anon articles" ON articles FOR ALL USING (true);
CREATE POLICY "Enable all for anon subscribers" ON subscribers FOR ALL USING (true);

-- Private Secrets (Auth Only)
CREATE POLICY "Authenticated Read Secrets" ON private_secrets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update Secrets" ON private_secrets FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Insert Secrets" ON private_secrets FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User Profiles
CREATE POLICY "Public Read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. STORAGE
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
-- Storage policies are handled via Storage UI or separate SQL if needed, usually defaults are fine if bucket is Public.
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Media') THEN CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING ( bucket_id = 'media' ); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert Media') THEN CREATE POLICY "Public Insert Media" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'media' ); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Update Media') THEN CREATE POLICY "Public Update Media" ON storage.objects FOR UPDATE USING ( bucket_id = 'media' ); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Delete Media') THEN CREATE POLICY "Public Delete Media" ON storage.objects FOR DELETE USING ( bucket_id = 'media' ); END IF;
END $$;`,
    codeLabel: 'Full System Repair Script (v7.0)'
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
  {
    id: 'seo-meta',
    title: '8. SEO Meta Tags & Branding',
    description: 'Optimize your site for search engines by customizing the global meta tags in the "Identity" section of the Site Editor.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to Admin > Canvas > Identity.',
      'Ensure your Company Name and Slogan are keyword-rich.',
      'Upload a high-quality OG Image (Open Graph) which appears when you share your link on social media.',
      'The system automatically injects these into the <head> of your site.'
    ]
  },
  {
    id: 'sitemap',
    title: '9. Sitemap Submission',
    description: 'Help Google index your pages faster.',
    illustrationId: 'rocket',
    subSteps: [
      'Your site automatically generates pages for /products, /about, etc.',
      'If using Vercel, a sitemap.xml is often auto-generated if configured, or you can use a free tool like xml-sitemaps.com for your live URL.',
      'Download the XML and upload it to your public/ folder if needed (for custom implementations).'
    ]
  },
  {
    id: 'gsc',
    title: '10. Google Search Console',
    description: 'The command center for your organic search presence.',
    illustrationId: 'forge',
    subSteps: [
      'Sign up for Google Search Console.',
      'Add your property (your Vercel domain).',
      'Verify ownership using the HTML tag method (add the code to index.html or via the Site Editor if supported later).',
      'Submit your sitemap URL.'
    ]
  },
  {
    id: 'social-handles',
    title: '11. Secure Social Handles',
    description: 'Brand consistency is key. Ensure your handle is the same across all platforms.',
    illustrationId: 'rocket',
    subSteps: [
      'Secure the exact match for your "Company Name" on Instagram, TikTok, Pinterest, and Facebook.',
      'Use the same profile picture (your logo) on all accounts.',
      'Add your bridge page URL to the bio of every single account.'
    ]
  },
  {
    id: 'content-post',
    title: '12. First Journal Entry',
    description: 'Content drives traffic. Write your first blog post to establish authority.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Admin > Journal.',
      'Write an article titled "Top 5 Essentials for [Current Season]".',
      'Embed links to your products within the content.',
      'Share this article link on your social media stories.'
    ]
  },
  {
    id: 'influencer',
    title: '13. Micro-Influencer Outreach',
    description: 'You don\'t need millions of followers. You need engagement.',
    illustrationId: 'rocket',
    subSteps: [
      'Identify 10 accounts with 5k-50k followers in your niche.',
      'Engage with their content for a week (genuine comments).',
      'Send a DM offering a feature on your "Journal" or a reciprocal shoutout.',
      'Do not ask for a sale immediately.'
    ]
  },
  {
    id: 'email-marketing',
    title: '14. Email Marketing Setup',
    description: 'The money is in the list. Start collecting emails immediately.',
    illustrationId: 'forge',
    subSteps: [
      'The system has a built-in subscriber capture popup.',
      'Export your subscribers from Admin > Audience.',
      'Import them into Mailchimp or ConvertKit.',
      'Set up a "Welcome Sequence" automated email for new joiners.'
    ]
  },
  {
    id: 'cart-recovery',
    title: '15. Abandoned Cart Strategy',
    description: 'Recover lost sales manually until you scale.',
    illustrationId: 'rocket',
    subSteps: [
      'Monitor your "Orders" tab for "Pending Payment" status.',
      'If an order sits for 24 hours, use the "Reply" or email function to send a friendly reminder.',
      'Offer assistance or a small discount code to close the sale.'
    ]
  },
  {
    id: 'retargeting',
    title: '16. Retargeting Pixels',
    description: 'Show ads to people who already visited your site.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Admin > Canvas > Integrations.',
      'Add your Meta (Facebook) Pixel ID.',
      'Add your TikTok Pixel ID.',
      'Even if you aren\'t running ads yet, this builds your audience data for later.'
    ]
  },
  {
    id: 'ab-testing',
    title: '17. A/B Testing Headlines',
    description: 'Optimize your conversion rate.',
    illustrationId: 'rocket',
    subSteps: [
      'Change your Home Hero "Title" and "CTA" every week.',
      'Check the Analytics dashboard to see if your "Visits" or "Clicks" improved.',
      'Keep the winner and try a new variation.'
    ]
  },
  {
    id: 'affiliate-network',
    title: '18. Join Premium Networks',
    description: 'Expand your catalog with high-ticket items.',
    illustrationId: 'forge',
    subSteps: [
      'Apply to networks like Skimlinks, LTK (RewardStyle), or Amazon Associates.',
      'Once approved, replace your product "Affiliate Links" with these tracking links to earn commissions.'
    ]
  },
  {
    id: 'audit',
    title: '19. Quarterly Performance Audit',
    description: 'Review what is working.',
    illustrationId: 'rocket',
    subSteps: [
      'Check Admin > Insights > Top Products.',
      'Remove products with 0 views/clicks to keep your store fresh.',
      'Double down on the category that gets the most traffic.'
    ]
  },
  {
    id: 'scale',
    title: '20. Scale & Automate',
    description: 'The final frontier.',
    illustrationId: 'forge',
    subSteps: [
      'Hire a Virtual Assistant (VA) to add products and manage the Admin panel.',
      'Create a "Team" account for them in Admin > Maison.',
      'Focus your time on content creation and strategy while the system runs itself.'
    ]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Art of Affiliate Curation',
    excerpt: 'How I transformed my passion for fashion into a curated bridge system that helps thousands find their style.',
    content: 'Building a bridge page is not just about links; it is about building trust. In this article, I share my journey from a fashion enthusiast to a professional affiliate curator.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    date: Date.now() - 100000000,
    author: 'Founder'
  },
  {
    id: '2',
    title: 'My Top 5 High-Conversion Finds',
    excerpt: 'A deep dive into the items that my community loves the most and why they are essential for your collection.',
    content: 'Every season has its heroes. This summer, these five pieces have stood out not just for their style, but for the incredible value they offer through our affiliate partners.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800',
    date: Date.now() - 200000000,
    author: 'Founder'
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [];

export const PERMISSION_TREE: PermissionNode[] = [
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
    email: 'admin@findara.com',
    role: 'owner',
    permissions: ['*'],
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
    subject: 'Affiliate Question',
    message: 'Hi, I love your curation! Do you have a direct link for the Summer Dress you posted on Instagram?',
    createdAt: Date.now() - 86400000 * 2,
    status: 'unread'
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'FINDARA Fashion',
  slogan: 'Curating Your Path to Style',
  companyLogo: 'FD',
  companyLogoUrl: 'https://i.ibb.co/wZt02bvX/Whats-App-Image-2026-01-21-at-17-44-31-removebg-preview.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Market',
  navAboutLabel: 'My Journey',
  navContactLabel: 'Connect',
  navDashboardLabel: 'Portal',

  contactEmail: 'contact@findara.com',
  contactPhone: '+27 00 000 0000',
  whatsappNumber: '27000000000',
  address: 'Johannesburg, South Africa',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],

  footerDescription: "The ultimate bridge page for fashion enthusiasts. I find the best deals from around the web and bring them to you.",
  footerCopyrightText: "All rights reserved.",

  homeHeroBadge: 'Official Curator',
  homeAboutTitle: 'My Story & Vision',
  homeAboutDescription: 'I started this journey to solve one problem: finding high-quality, verified fashion without the noise. Every product here is hand-picked by me after thorough research.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Journey',
  homeCategorySectionTitle: 'The Catalog',
  homeCategorySectionSubtitle: 'Select Departments',
  homeTrustSectionTitle: 'The Bridge Standard',
  
  homeTrustItem1Title: 'Expert Selection',
  homeTrustItem1Desc: 'Years of industry experience in every choice.',
  homeTrustItem1Icon: 'Award', 

  homeTrustItem2Title: 'Authentic Links',
  homeTrustItem2Desc: 'Direct connections to authorized retailers only.',
  homeTrustItem2Icon: 'ShieldCheck', 

  homeTrustItem3Title: 'Personal Support',
  homeTrustItem3Desc: 'I am here to answer your style questions.',
  homeTrustItem3Icon: 'MessageCircle', 

  productsHeroTitle: 'The Selection',
  productsHeroSubtitle: 'Quality-tested products from our premium network partners.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search the market...',

  aboutHeroTitle: 'The Curator Behind FINDARA.',
  aboutHeroSubtitle: 'Bridging the gap between luxury trends and everyday access.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Personal Curator',
  aboutLocation: 'South Africa',

  aboutHistoryTitle: 'How It All Began',
  aboutHistoryBody: 'My journey into affiliate marketing wasn\'t planned. It grew from a genuine love for finding hidden gems in the fashion world and sharing them with friends. I realized people needed a trusted "bridge" to navigate the overwhelming options online.',
  
  aboutMissionTitle: 'My Mission',
  aboutMissionBody: 'To provide a curated, transparent, and trustworthy shopping experience through professional affiliate partnerships.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'The Community',
  aboutCommunityBody: 'Join a growing group of style-conscious individuals who value quality over quantity.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency Matters',
  aboutIntegrityBody: 'I am a professional affiliate marketer. This means I earn a small commission when you purchase through my links, at no extra cost to you.',
  aboutIntegrityIcon: 'Shield',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800'
  ],

  contactHeroTitle: 'Let\'s Bridge the Gap.',
  contactHeroSubtitle: 'Questions about a specific item or interested in a brand partnership?',
  contactFormNameLabel: 'Full Name',
  contactFormEmailLabel: 'Email Identity',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Connect Now',
  
  contactInfoTitle: 'Direct Connect',
  contactAddressLabel: 'Based In',
  contactHoursLabel: 'Response Time',
  contactHoursWeekdays: 'Within 24 Hours',
  contactHoursWeekends: 'Weekends vary',

  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### OUR COMMITMENT TO TRANSPARENCY\n\nFINDARA is a professional bridge page and affiliate marketing platform...`, 
  privacyTitle: 'Privacy Policy',
  privacyContent: `### YOUR DATA PRIVACY\n\nWe value your trust and are committed to protecting your personal information...`, 
  termsTitle: 'Terms of Service',
  termsContent: `### USAGE AGREEMENT\n\nBy using this bridge page, you agree to our terms of service...`, 

  enableDirectSales: false,
  currency: 'ZAR',
  yocoPublicKey: '',
  payfastMerchantId: '',
  payfastMerchantKey: '',
  payfastSaltPassphrase: '',
  zapierWebhookUrl: '',
  bankDetails: '',
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
    title: 'The Curator Series',
    subtitle: 'Personally selected essentials for the modern lifestyle.',
    cta: 'Explore Finds'
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Curated Wear', icon: 'Dress', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Hand-picked fashion pieces.' },
  { id: 'cat2', name: 'Aesthetic Tools', icon: 'Scissors', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800', description: 'The gear I use every day.' },
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Evening Luxe' },
  { id: 'sub2', categoryId: 'cat2', name: 'Photography Gear' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Signature Silk Scarf',
    sku: 'FD-ACC-001',
    price: 850,
    affiliateLink: 'https://example.com/signature-silk',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'A timeless accessory that I personally use to elevate any outfit. Soft, durable, and ethically sourced from our partners.',
    features: [
      '100% Pure Silk',
      'Hand-rolled edges',
      'Exclusive FINDARA curation'
    ],
    specifications: {
      'Material': 'Pure Silk',
      'Size': '90cm x 90cm'
    },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', name: 'Silk Scarf', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now(),
    isDirectSale: false,
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'bridge-101',
    title: 'Bridge Page Fundamentals',
    platform: 'General',
    description: 'Learn the "Why" behind bridge pages and how they outperform direct affiliate links.',
    strategies: [
      'Trust Building: Why a personal story matters.',
      'Pre-framing: Setting expectations before the click.',
      'Value Add: Providing bonuses or insights.'
    ],
    actionItems: [
      'Draft your 500-word origin story.',
      'Identify 3 core values for your brand.',
      'Review your current affiliate links.'
    ],
    icon: 'Layout'
  }
];
