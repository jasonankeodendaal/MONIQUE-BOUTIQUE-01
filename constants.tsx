

import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule, Article, Subscriber } from './types';

export const GUIDE_STEPS = [
  {
    id: 'supabase-init',
    title: '1. Supabase Cloud Foundation',
    description: 'Establish your backend-as-a-service. Supabase handles your Postgres database, Authentication, and S3-compatible Storage.',
    illustrationId: 'rocket',
    subSteps: [
      'Create an account at https://supabase.com.',
      'Start a "New Project" and assign it a name (e.g., "Maison Affiliate").',
      'Select a Region close to your primary traffic source.',
      'Generate a Secure Database Password and copy it immediately.',
      'Wait for the "Project API" keys to appear on your dashboard.'
    ]
  },
  {
    id: 'database-master',
    title: '2. Master Schema & Security Repair',
    description: 'This script builds the entire data architecture. It uses Security Definer functions to prevent infinite recursion—the most common cause of Supabase 500 errors.',
    illustrationId: 'forge',
    subSteps: [
      'Navigate to the SQL Editor in your Supabase dashboard.',
      'Open a "+ New Query" tab.',
      'Copy and paste the entire SQL block below.',
      'Click "Run". Ensure all statements return "Success".',
      'This establishes 17 tables with recursion-proof Row Level Security.'
    ],
    codeLabel: 'Full System Architecture (v13.5 - Analytics & Orders Fix)',
    code: `-- 1. AGGRESSIVE POLICY CLEANUP
-- This block dynamically drops every existing policy in the public schema 
-- to prevent "Policy already exists" errors.
DO $$ 
DECLARE 
    pol RECORD; 
BEGIN 
    FOR pol IN (SELECT policyname, tablename, schemaname FROM pg_policies WHERE schemaname = 'public') 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename); 
    END LOOP; 
END $$;

-- 2. CORE SYSTEM TABLES
CREATE TABLE IF NOT EXISTS public_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT,
  "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT,
  "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navContactLabel" TEXT, "navDashboardLabel" TEXT,
  "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT, "googleMyBusinessUrl" TEXT,
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
  "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "pinterestTagId" TEXT,
  "enableDirectSales" BOOLEAN DEFAULT false, "currency" TEXT DEFAULT 'ZAR', 
  "yocoPublicKey" TEXT, "payfastMerchantId" TEXT, "payfastMerchantKey" TEXT, "bankDetails" TEXT,
  "vatRegistered" BOOLEAN DEFAULT false, "vatRate" NUMERIC, "vatNumber" TEXT,
  "bankName" TEXT, "accountNumber" TEXT, "branchCode" TEXT
);

CREATE TABLE IF NOT EXISTS private_secrets (id TEXT PRIMARY KEY DEFAULT 'global', "payfastSaltPassphrase" TEXT, "zapierWebhookUrl" TEXT, "webhookUrl" TEXT);

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
CREATE TABLE IF NOT EXISTS training_modules (id TEXT PRIMARY KEY, title TEXT, platform TEXT, description TEXT, strategies TEXT[], "actionItems" TEXT[], icon TEXT, "createdBy" TEXT);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, permissions TEXT[], 
  "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT,
  "commissionRate" NUMERIC DEFAULT 0, "totalEarnings" NUMERIC DEFAULT 0, "uploadLimit" INTEGER DEFAULT 0, "canUpload" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS product_stats ("productId" TEXT PRIMARY KEY, views INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, "totalViewTime" NUMERIC DEFAULT 0, "lastUpdated" BIGINT);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT, source TEXT, city TEXT, device TEXT, "utmCampaign" TEXT, "utmMedium" TEXT, "scrollDepth" INTEGER, "sessionDuration" INTEGER, "interactionType" TEXT);
CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, "productId" TEXT REFERENCES products(id) ON DELETE CASCADE, "userName" TEXT, rating INTEGER, comment TEXT, "createdAt" BIGINT);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, "userId" TEXT, "customerName" TEXT, "customerEmail" TEXT, "shippingAddress" TEXT,
  total NUMERIC, status TEXT, "paymentMethod" TEXT, "createdAt" BIGINT,
  "courierName" TEXT, "trackingNumber" TEXT, "trackingUrl" TEXT, "affiliateId" TEXT
);

CREATE TABLE IF NOT EXISTS order_items (id TEXT PRIMARY KEY, "orderId" TEXT REFERENCES orders(id) ON DELETE CASCADE, "productId" TEXT, "productName" TEXT, quantity INTEGER, price NUMERIC);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  "fullName" TEXT, phone TEXT, building TEXT, street TEXT, suburb TEXT, city TEXT, province TEXT, "postalCode" TEXT, "updatedAt" BIGINT
);

-- 3. RECURSION-PROOF HELPERS (SECURITY DEFINER bypasses RLS loop)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid()::text AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. RLS ACTIVATION
DO $$ DECLARE t TEXT; BEGIN 
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP 
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t); 
  END LOOP; 
END $$;

-- 5. RE-CREATE ACCESS POLICIES (Guaranteed Clean State)
-- Public Read Access
CREATE POLICY "Public_Read_Settings" ON public_settings FOR SELECT USING (true);
CREATE POLICY "Public_Read_Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public_Read_Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public_Read_Subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public_Read_Hero" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public_Read_Articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public_Read_Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public_Read_Training" ON training_modules FOR SELECT USING (true);

-- Admin Management Access
CREATE POLICY "Admin_Manage_Settings" ON public_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Subcategories" ON subcategories FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Hero" ON hero_slides FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Enquiries" ON enquiries FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Traffic" ON traffic_logs FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Stats" ON product_stats FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Orders" ON orders FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_OrderItems" ON order_items FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Reviews" ON reviews FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Articles" ON articles FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Subscribers" ON subscribers FOR ALL USING (is_admin());
CREATE POLICY "Admin_Manage_Training" ON training_modules FOR ALL USING (is_admin());

-- Specialized admin_users Table Policies
CREATE POLICY "Admin_Self_View" ON admin_users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Admin_List_View" ON admin_users FOR SELECT USING (is_admin());
CREATE POLICY "Owner_Manage_Admins" ON admin_users FOR ALL USING (is_owner());

-- Security Layer
CREATE POLICY "Owner_Only_Secrets" ON private_secrets FOR ALL USING (is_owner());

-- Public Data Submission
CREATE POLICY "Public_Insert_Subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public_Insert_Enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public_Insert_Reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public_Insert_Traffic" ON traffic_logs FOR INSERT WITH CHECK (true);

-- Public Analytics Update (Views/Clicks)
CREATE POLICY "Public_Manage_Stats" ON product_stats FOR ALL USING (true) WITH CHECK (true);

-- Customer Order Management
CREATE POLICY "Customer_Manage_Orders" ON orders FOR ALL 
USING (auth.uid()::text = "userId") 
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Customer_Manage_OrderItems" ON order_items FOR ALL 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items."orderId" AND orders."userId" = auth.uid()::text))
WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items."orderId" AND orders."userId" = auth.uid()::text));

-- Profile Control
CREATE POLICY "Profiles_Public_View" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles_User_Manage" ON profiles FOR ALL USING (auth.uid() = id);`
  },
  {
    id: 'asset-vault',
    title: '3. Asset Vault (Cloud Storage)',
    description: 'Enable media hosting for high-resolution product photos, videos, and branding assets.',
    illustrationId: 'rocket',
    subSteps: [
      'In Supabase, navigate to SQL Editor -> New Query.',
      'Copy and paste the Storage Policy SQL below.',
      'Run the query to automatically create the "media" bucket and set correct permissions.',
      'This fixes "new row violates row-level security policy" errors during upload.'
    ],
    codeLabel: 'Storage Bucket & Policy Auto-Setup',
    code: `-- 1. Create the 'media' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to prevent conflicts/duplicates
DROP POLICY IF EXISTS "Public Read Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Media" ON storage.objects;

-- 3. Create permissive policies for the 'media' bucket
-- Allow public read access to all files in 'media'
CREATE POLICY "Public Read Media"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow authenticated users (Admins) to upload to 'media'
CREATE POLICY "Authenticated Upload Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'media' );

-- Allow authenticated users (Admins) to delete from 'media'
CREATE POLICY "Authenticated Delete Media"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'media' );

-- Allow authenticated users (Admins) to update in 'media'
CREATE POLICY "Authenticated Update Media"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'media' );`
  },
  {
    id: 'auth-protocol',
    title: '4. Authentication Protocol',
    description: 'Configure how administrators and clients access their respective portals.',
    illustrationId: 'forge',
    subSteps: [
      'Go to "Authentication" > "Providers".',
      'Enable "Email" and disable "Confirm Email" for immediate setup speed.',
      'Go to "URL Configuration".',
      'Site URL: Add your final production domain (e.g., https://findara.style).',
      'Redirect URLs: Add "http://localhost:3000/**" and your production URL followed by "/**".',
      'Go to "Google" provider and paste your Client ID/Secret if using Social Login.'
    ]
  },
  {
    id: 'profile-bridge',
    title: '5. Profile & Auth Bridge',
    description: 'Syncing your Auth users with the custom Profile table to store shipping addresses.',
    illustrationId: 'rocket',
    subSteps: [
      'This step ensures when a customer registers, their address is saved automatically.',
      'In the SQL Editor, create a new query.',
      'Run the "Trigger Script" provided below.',
      'This automation creates a row in the "profiles" table every time a user confirms their email.'
    ],
    codeLabel: 'Profile Auto-Creation Trigger',
    code: `-- AUTO-PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Strict Separation: Only create profiles for customers
  IF (new.raw_user_meta_data->>'role' = 'customer') THEN
    INSERT INTO public.profiles (id, "fullName", phone, building, street, suburb, city, province, "postalCode", "updatedAt")
    VALUES (
      new.id, 
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'phone',
      '', '', '', '', '', '', -- Initialize address fields empty
      extract(epoch from now()) * 1000
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`
  },
  {
    id: 'telemetry-realtime',
    title: '6. Telemetry & Realtime API',
    description: 'Enable live traffic monitoring and instant order notifications.',
    illustrationId: 'forge',
    subSteps: [
      'Go to "Database" > "Replication".',
      'In the "Source" table list, find "traffic_logs" and "orders".',
      'Toggle the "Realtime" switch to ON for both.',
      'This allows your Admin dashboard to update live without refreshing.',
      'Go to API settings and ensure "Enable Realtime" is checked under "Settings".'
    ]
  },
  {
    id: 'environment-linking',
    title: '7. Infrastructure Link (.env)',
    description: 'Connect your local code to your cloud infrastructure via secure environment variables.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to Project Settings > API.',
      'Find the "Project URL" and the "anon public key".',
      'Open your local project in VS Code.',
      'Edit the ".env" file in the root directory.',
      'Paste the keys exactly as shown below.',
      'Restart your Vite dev server to apply changes.'
    ],
    codeLabel: '.env Secure Configuration',
    code: `VITE_SUPABASE_URL=https://your-unique-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-alphanumeric-anon-key`
  },
  {
    id: 'bootstrap-owner',
    title: '8. Bootstrap System Owner',
    description: 'Grant yourself the first "Owner" role to bypass all local-mode restrictions.',
    illustrationId: 'forge',
    subSteps: [
      'Register an account normally through the "Client Login" page on your site.',
      'Go back to Supabase SQL Editor.',
      'Run the bootstrap query below, replacing the email with your registered one.',
      'This grants you "*" permissions (all access).'
    ],
    codeLabel: 'Promote to Owner SQL',
    code: `INSERT INTO admin_users (id, name, email, role, permissions, "createdAt")
SELECT id, raw_user_meta_data->>'full_name', email, 'owner', ARRAY['*'], extract(epoch from now()) * 1000
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'owner', permissions = ARRAY['*'];`
  },
  {
    id: 'inventory-migration',
    title: '9. Inventory Migration',
    description: 'Transfer your local products and categories into the cloud database.',
    illustrationId: 'rocket',
    subSteps: [
      'Ensure you are logged in as an Owner.',
      'Navigate to the "System" tab in the Admin Portal.',
      'Wait for the "Cloud Connection" to show green status.',
      'Click the "Sync Local to Cloud" button (if visible) or simply re-save one product.',
      'The App will detect the empty cloud DB and offer to migrate all 17 tables.'
    ]
  },
  {
    id: 'admin-generator',
    title: '10. Admin Generator RPC',
    description: 'Enable creating new Admin users directly from the dashboard using a secure Database Function.',
    illustrationId: 'forge',
    subSteps: [
      'Go to the Supabase SQL Editor.',
      'Create a New Query and paste the code below.',
      'Run the query to install the `create_admin_user` function.',
      'This allows you to add staff members instantly from the "Maison" tab.'
    ],
    codeLabel: 'create_admin_user SQL Function',
    code: `-- Enable pgcrypto for hashing
create extension if not exists pgcrypto;

create or replace function create_admin_user(
  email text,
  password text,
  name text,
  role text,
  permissions text[]
)
returns text
language plpgsql
security definer
as $$
declare
  new_id uuid;
  encrypted_pw text;
begin
  -- Generate ID
  new_id := gen_random_uuid();
  
  -- Hash password
  encrypted_pw := crypt(password, gen_salt('bf'));

  -- Insert into auth.users
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_id,
    'authenticated',
    'authenticated',
    email,
    encrypted_password,
    now(),
    null,
    null,
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('full_name', name, 'role', role),
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert into public.admin_users
  insert into public.admin_users (
    id,
    name,
    email,
    role,
    permissions,
    "createdAt",
    "lastActive"
  ) values (
    new_id::text,
    name,
    email,
    role,
    permissions,
    extract(epoch from now()) * 1000,
    extract(epoch from now()) * 1000
  );

  return new_id::text;
end;
$$;`
  },
  {
    id: 'global-deployment',
    title: '11. Global Deployment (Vercel)',
    description: 'Launch your high-performance bridge page to the worldwide web.',
    illustrationId: 'forge',
    subSteps: [
      'Push your code to a private GitHub repository.',
      'Connect the repo to Vercel.com.',
      'Under "Environment Variables", add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      'Click "Deploy". Your site is now live on a global CDN.',
      'Configure a custom domain (e.g., style.com) in Vercel settings.'
    ]
  },
  {
    id: 'domain-ssl',
    title: '12. Domain & SSL Hardening',
    description: 'Secure your professional image with a custom domain and SSL encryption.',
    illustrationId: 'forge',
    subSteps: [
      'Purchase a domain from a registrar like Namecheap or Google Domains.',
      'In Vercel Dashboard, go to Settings > Domains.',
      'Add your domain (e.g., curatorfinds.com).',
      'Follow the DNS instructions provided by Vercel to point your A and CNAME records.',
      'Ensure "Force HTTPS" is enabled to guarantee SSL on every visit.'
    ],
    codeLabel: 'Vercel JSON Redirect Config',
    code: `{
  "redirects": [
    { "source": "/(.*)", "destination": "https://www.yourdomain.com/$1", "permanent": true }
  ]
}`
  },
  {
    id: 'meta-pixel',
    title: '13. Meta Pixel Implementation',
    description: 'Track ad performance and build retargeting audiences for Facebook and Instagram ads.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to Meta Events Manager and create a new Pixel/Dataset.',
      'Copy your "Pixel ID" (a numeric string).',
      'In this Admin Portal, go to Canvas > Integrations.',
      'Paste your ID into the "Meta Pixel ID" field and click Apply.',
      'Test with the "Meta Pixel Helper" browser extension.'
    ],
    codeLabel: 'Manual Pixel Init Script',
    code: `fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
fbq('track', 'ViewContent', { content_name: 'Luxury Silk Wrap' });`
  },
  {
    id: 'google-grounding',
    title: '14. Google Search Console & SEO',
    description: 'Verify your site with Google to index your curated pages and track organic search keywords.',
    illustrationId: 'forge',
    subSteps: [
      'Navigate to Google Search Console and add your domain.',
      'Choose "URL Prefix" and select "HTML Tag" verification method.',
      'Copy the meta tag and paste it into the SEO section of your Admin portal.',
      'Submit your sitemap (usually /sitemap.xml) for faster indexing.',
      'Check the "Performance" tab weekly to see which keywords drive traffic.'
    ],
    codeLabel: 'SEO Meta Verification',
    code: `<meta name="google-site-verification" content="unique-verification-code" />
<link rel="canonical" href="https://yourdomain.com/" />`
  },
  {
    id: 'tiktok-pixel',
    title: '15. TikTok Creative Center Sync',
    description: 'Measure the impact of your viral TikTok content on bridge page traffic.',
    illustrationId: 'rocket',
    subSteps: [
      'Log into TikTok Ads Manager > Assets > Events.',
      'Create a "Web Pixel" and select "Manual Setup".',
      'Copy the Pixel ID and add it to the Integrations tab here.',
      'Enable "Advanced Matching" to better track conversions across devices.',
      'Use TikTok Spark Ads to promote your top-performing curated pieces.'
    ],
    codeLabel: 'TikTok Event Tracking',
    code: `ttq.track('CompletePayment', {
  contents: [{ content_id: 'ORD-123', content_type: 'product' }],
  value: 4200, currency: 'ZAR'
});`
  },
  {
    id: 'pinterest-tag',
    title: '16. Pinterest Tag Integration',
    description: 'The ultimate tool for fashion curators. Track "Pins" and "Saves" back to your shop.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Pinterest Business Hub > Ads > Conversions.',
      'Create a "Pinterest Tag" and find your Unique Tag ID.',
      'Paste this into the Pinterest section of your Canvas editor.',
      'Use "Pin Extension" on your product detail pages to encourage social sharing.',
      'Check the "Pinterest Analytics" to see which aesthetics resonate with the community.'
    ],
    codeLabel: 'Pinterest Event Snippet',
    code: `pintrk('track', 'pagevisit');
pintrk('track', 'addtocart', {
  value: 4200.00, order_quantity: 1, currency: 'ZAR'
});`
  },
  {
    id: 'yoco-verification',
    title: '17. Yoco Payment Verification',
    description: 'Switch from "Test Mode" to "Live Mode" to start accepting real card payments.',
    illustrationId: 'rocket',
    subSteps: [
      'Login to your Yoco Dashboard > Settings > API Keys.',
      'Generate your "Live Public Key" (starts with pk_live).',
      'Paste it into the Commerce section of your Admin portal.',
      'Set up your bank account for settlements (Yoco pays out every business day).',
      'Do a R1.00 test transaction to ensure the flow is operational.'
    ],
    codeLabel: 'Live API Key Pattern',
    code: `VITE_YOCO_PUBLIC_KEY=pk_live_************************
# Ensure the key is from the LIVE toggle, not TEST.`
  },
  {
    id: 'zapier-leads',
    title: '18. Zapier Lead CRM Automation',
    description: 'Connect your bridge page to 5000+ apps like Mailchimp, Slack, or Google Sheets.',
    illustrationId: 'forge',
    subSteps: [
      'Create a new Zap at Zapier.com with the trigger "Webhooks by Zapier".',
      'Select "Catch Hook" and copy the unique URL provided.',
      'Paste this URL into the "Webhook URL" field in your Admin settings.',
      'Add an action to your Zap (e.g., "Add Subscriber to Mailchimp").',
      'Every time a customer registers or places an order, their data flows to your CRM automatically.'
    ],
    codeLabel: 'Webhook Payload Structure',
    code: `{
  "event": "new_order",
  "data": { "id": "ORD-552", "email": "customer@gmail.com", "total": 4200 }
}`
  },
  {
    id: 'link-obfuscation',
    title: '19. Affiliate Link Optimization',
    description: 'Transform ugly affiliate URLs into professional, branded links to increase CTR.',
    illustrationId: 'rocket',
    subSteps: [
      'Instead of sharing raw Amazon links, use your bridge page product URLs.',
      'Add UTM parameters to your links (e.g., ?source=ig_story) to track specific traffic spikes.',
      'Ensure "Affiliate Disclosure" is visible on all bridge pages (mandatory for legal compliance).',
      'Use the "Ad Generator" in the catalog to quickly copy perfectly formatted social captions.'
    ],
    codeLabel: 'Branded Link Structure',
    code: `https://findara.style/#/product/p1?ref=influencer_name
# Converts to -> internal acquisition logic`
  },
  {
    id: 'pwa-manifest',
    title: '20. PWA Offline Manifest',
    description: 'Allow users to "Install" your bridge page as an app on their home screen.',
    illustrationId: 'forge',
    subSteps: [
      'The manifest is generated dynamically by the app using your branding settings.',
      'Ensure your "Company Logo URL" points to a high-res (512x512) PNG.',
      'Users on iOS/Android will see an "Add to Home Screen" prompt.',
      'This increases return visitor rate by making your curation just one tap away.',
      'The service worker ensures basic page loading even with spotty internet.'
    ],
    codeLabel: 'Internal Manifest Logic',
    code: `{
  "name": "FINDARA", "display": "standalone",
  "theme_color": "#D4AF37", "start_url": "/#/",
  "icons": [{ "src": "/logo.png", "sizes": "512x512" }]
}`
  },
  {
    id: 'readiness-test',
    title: '21. Performance & Readiness',
    description: 'Final audit before scaling traffic to your new fashion destination.',
    illustrationId: 'rocket',
    subSteps: [
      'Run a Google Lighthouse report on your live URL.',
      'Verify all "Journal" links are functional and lead to engaging content.',
      'Test your "Concierge" form with a dummy message to ensure inbox delivery.',
      'Check the "Insights" tab to confirm real-time traffic logging is active.',
      'Congratulations! You are officially operational on the global stage.'
    ]
  }
];

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
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [];

export const TRAINING_MODULES: TrainingModule[] = [
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
  }
];

export const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'sector.sales',
    label: 'Sales & Logistics',
    description: 'Access to high-level commerce sections.',
    children: [
      { id: 'privilege.inbox', label: 'Access Inbox', description: 'View and respond to customer enquiries.' },
      { id: 'privilege.orders', label: 'Access Orders', description: 'View and manage orders and fulfillment.' },
      { id: 'privilege.audience', label: 'Access Audience', description: 'View and manage newsletter subscribers.' }
    ]
  },
  {
    id: 'sector.curation',
    label: 'Inventory & Curation',
    description: 'Manage the physical and affiliate catalog.',
    children: [
      { id: 'privilege.items', label: 'Access Items', description: 'Manage products and direct sales pricing.' },
      { id: 'privilege.depts', label: 'Access Depts', description: 'Manage departments and subcategories.' },
      { id: 'privilege.reviews', label: 'Access Reviews', description: 'Moderate customer reviews and feedback.' }
    ]
  },
  {
    id: 'sector.experience',
    label: 'Content & Experience',
    description: 'Control the aesthetic and educational experience.',
    children: [
      { id: 'privilege.visuals', label: 'Access Visuals', description: 'Control hero banners and cinematic media.' },
      { id: 'privilege.journal', label: 'Access Journal', description: 'Create and edit blog/editorial content.' },
      { id: 'privilege.academy', label: 'Access Academy', description: 'Manage affiliate training and lessons.' }
    ]
  },
  {
    id: 'sector.infrastructure',
    label: 'Infrastructure & Maison',
    description: 'Core system and staff management.',
    children: [
      { id: 'privilege.insights', label: 'Access Insights', description: 'View advanced analytics and export reports.' },
      { id: 'privilege.canvas', label: 'Access Canvas', description: 'Edit site identity, legal, and integrations.' },
      { id: 'privilege.maison', label: 'Access Maison', description: 'Manage Maison staff and privileges.' },
      { id: 'privilege.system', label: 'Access System', description: 'View technical health and system logs.' },
      { id: 'privilege.pilot', label: 'Access Pilot', description: 'Access the architectural launch blueprints.' }
    ]
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'owner',
    name: 'Main Administrator',
    email: 'admin@kasicouture.com',
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
    subject: 'Styling Consultation',
    message: 'Hi there, I am looking for a personal stylist for an upcoming gala in Cape Town. Do you offer virtual consultations?',
    createdAt: Date.now() - 86400000 * 2,
    status: 'unread'
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'FINDARA',
  slogan: 'Curating the Exceptional',
  companyLogo: 'FD',
  companyLogoUrl: 'https://i.ibb.co/wZt02bvX/Whats-App-Image-2026-01-21-at-17-44-31-removebg-preview.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'contact@findara.style',
  contactPhone: '+27 00 000 0000',
  whatsappNumber: '27000000000',
  address: 'Online, South Africa',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],

  footerDescription: "A curated bridge connecting you to global fashion trends. Hand-selected quality, vetted by experts.",
  footerCopyrightText: "All rights reserved.",

  homeHeroBadge: 'Curator & Expert',
  homeAboutTitle: 'My Story',
  homeAboutDescription: 'I started this journey to bridge the gap between global luxury retailers and style seekers who value authentic, hand-picked recommendations. This isn’t just affiliate marketing; it’s a personal catalog of the best the world has to offer.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Curated Departments',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'Why My Selections Matter',
  
  homeTrustItem1Title: 'Expert Vetting',
  homeTrustItem1Desc: 'I personally verify every partner for shipping reliability and authentic quality.',
  homeTrustItem1Icon: 'ShieldCheck', 

  homeTrustItem2Title: 'Authentic Curation',
  homeTrustItem2Desc: 'No AI filler. Every recommendation comes from my actual styling experience.',
  homeTrustItem2Icon: 'User', 

  homeTrustItem3Title: 'Direct Bridge',
  homeTrustItem3Desc: 'Clean, safe links that take you directly to verified checkout pages.',
  homeTrustItem3Icon: 'Link', 

  productsHeroTitle: 'The Catalog',
  productsHeroSubtitle: 'Browse my hand-picked selections from top affiliate programs.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d1?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d1?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search my finds...',

  aboutHeroTitle: 'The Journey',
  aboutHeroSubtitle: 'A passion for quality, bridging you to the best.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'The Curator',
  aboutLocation: 'Cape Town, South Africa',

  aboutHistoryTitle: 'My Vision for Curation',
  aboutHistoryBody: 'In a world of endless digital noise, curation is a superpower. My mission is to simplify your search for quality by providing a "bridge" to the best global affiliate offers. \n\nI don\'t just list items; I select them based on years of experience in the fashion industry. Every click here supports independent curation while ensuring you get the best price from verified luxury retailers.',
  
  aboutMissionTitle: 'Expert Mission',
  aboutMissionBody: 'To provide a high-trust gateway between discerning shoppers and the world\'s most reliable retailers.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'My Community',
  aboutCommunityBody: 'Join thousands of followers who look to this bridge for daily styling inspiration.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Affiliate Disclosure',
  aboutIntegrityBody: 'I am proud to be an affiliate. This site is built on honest reviews and authentic recommendations. I earn a small commission when you shop via my links, which keeps this bridge running.',
  aboutIntegrityIcon: 'Shield',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800'
  ],

  contactHeroTitle: 'The Concierge.',
  contactHeroSubtitle: 'Have questions about my curations or affiliate partners?',
  contactFormNameLabel: 'Name',
  contactFormEmailLabel: 'Email',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Send Inquiry',
  
  contactInfoTitle: 'Direct Contact',
  contactAddressLabel: 'Studio',
  contactHoursLabel: 'Available',
  contactHoursWeekdays: '24/7 Digital Concierge',
  contactHoursWeekends: '',

  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### AFFILIATE DISCLOSURE STATEMENT\n\nThis website participates in various affiliate marketing programs, which means we may get paid commissions on products purchased through our links to retailer sites. This comes at no additional cost to you.\n\nOur recommendations are always based on independent curation and personal preference.`, 
  privacyTitle: 'Privacy Policy',
  privacyContent: `### PRIVACY POLICY\n\nYour privacy is paramount. We do not sell your personal data. We use cookies to track traffic sources and improve your experience on our bridge page.`, 
  termsTitle: 'Terms of Service',
  termsContent: `### TERMS OF SERVICE\n\nBy using this site, you agree that we are a curation service and not the direct seller of affiliate items. All transaction disputes must be handled via the final retailer.`, 

  googleAnalyticsId: '',
  facebookPixelId: '',
  tiktokPixelId: '',
  amazonAssociateId: '',
  webhookUrl: '',
  pinterestTagId: '',

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
    title: 'Expert Curation',
    subtitle: 'My personal bridge to the world’s finest fashion finds.',
    cta: 'Browse My Picks'
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Apparel', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Luxury ready-to-wear.' },
  { id: 'cat2', name: 'Accessories', icon: 'Watch', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800', description: 'The finishing touch.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Designer Dresses' },
  { id: 'sub2', categoryId: 'cat2', name: 'Luxe Bags' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'The Signature Silk Wrap',
    sku: 'FD-SW-01',
    price: 4200,
    affiliateLink: 'https://example.com/item',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'A personal favorite. This silk wrap is the cornerstone of my current wardrobe rotation.',
    features: ['100% Mulberry Silk', 'Sustainable sourcing'],
    specifications: { 'Material': 'Silk', 'Care': 'Dry Clean' },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', name: 'Silk Dress', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now(),
    isDirectSale: false
  }
];