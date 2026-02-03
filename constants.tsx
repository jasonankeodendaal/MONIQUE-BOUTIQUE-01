
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule, Article, Subscriber } from './types';

export const GUIDE_STEPS = [
  {
    id: '1',
    title: '1. Cloud Infrastructure Initialization',
    description: 'Set up your dedicated backend using Supabase. This provides your Postgres database, user authentication system, and media storage.',
    illustrationId: 'rocket',
    subSteps: [
      'Create a free account at https://supabase.com.',
      'Start a "New Project" (e.g., "Bridge Portal").',
      'Choose a Region closest to your expected audience.',
      'Save your Database Password securely.',
      'Copy your Project URL and "anon" Public Key from Project Settings > API.'
    ]
  },
  {
    id: '2',
    title: '2. Master Schema & Security Protocol',
    description: 'Establish the entire data architecture. This script creates all tables and implements recursion-proof Row Level Security (RLS).',
    illustrationId: 'forge',
    subSteps: [
      'Open the SQL Editor in your Supabase dashboard.',
      'Create a "+ New Query".',
      'Paste the entire Master Architecture SQL block.',
      'Click "Run". Ensure all status indicators return "Success".'
    ],
    codeLabel: 'Full System Architecture (v14.0 - All-in-One)',
    code: `-- 1. ENVIRONMENT CLEANUP
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
  "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT, "faviconUrl" TEXT,
  "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT,
  "seoTitle" TEXT, "seoDescription" TEXT,
  "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navJournalLabel" TEXT, "navContactLabel" TEXT, "navPortalLabel" TEXT, "navDashboardLabel" TEXT,
  "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT, "googleMyBusinessUrl" TEXT,
  "socialLinks" JSONB, "footerDescription" TEXT, "footerCopyrightText" TEXT,
  "homeHeroBadge" TEXT, "homeAboutTitle" TEXT, "homeAboutDescription" TEXT, "homeAboutImage" TEXT, "homeAboutCta" TEXT,
  "homeCategorySectionTitle" TEXT, "homeCategorySectionSubtitle" TEXT, "homeTrustSectionTitle" TEXT,
  "homeTrustItem1Title" TEXT, "homeTrustItem1Desc" TEXT, "homeTrustItem1Icon" TEXT,
  "homeTrustItem2Title" TEXT, "homeTrustItem2Desc" TEXT, "homeTrustItem2Icon" TEXT,
  "homeTrustItem3Title" TEXT, "homeTrustItem3Desc" TEXT, "homeTrustItem3Icon" TEXT,
  "homeBottomHookTitle" TEXT, "homeBottomHookSubtitle" TEXT, "homeBottomHookButtonText" TEXT,
  "productsHeroTitle" TEXT, "productsHeroSubtitle" TEXT, "productsHeroImage" TEXT, "productsHeroImages" TEXT[],
  "productsSearchPlaceholder" TEXT, "productsEmptyHeadline" TEXT, "productsEmptyDescription" TEXT,
  "aboutHeroTitle" TEXT, "aboutHeroSubtitle" TEXT, "aboutMainImage" TEXT,
  "aboutEstablishedYear" TEXT, "aboutFounderName" TEXT, "aboutLocation" TEXT,
  "aboutHistoryTitle" TEXT, "aboutHistoryBody" TEXT, "aboutMissionTitle" TEXT, "aboutMissionBody" TEXT, "aboutMissionIcon" TEXT,
  "aboutCommunityTitle" TEXT, "aboutCommunityBody" TEXT, "aboutCommunityIcon" TEXT,
  "aboutIntegrityTitle" TEXT, "aboutIntegrityBody" TEXT, "aboutIntegrityIcon" TEXT,
  "aboutSignatureImage" TEXT, "aboutGalleryImages" TEXT[], "aboutMilestones" JSONB,
  "contactHeroTitle" TEXT, "contactHeroSubtitle" TEXT, "contactFormNameLabel" TEXT, "contactFormEmailLabel" TEXT,
  "contactFormSubjectLabel" TEXT, "contactFormMessageLabel" TEXT, "contactFormButtonText" TEXT,
  "contactInfoTitle" TEXT, "contactAddressLabel" TEXT, "contactHoursLabel" TEXT, "contactHoursWeekdays" TEXT, "contactHoursWeekends" TEXT,
  "contactSuccessTitle" TEXT, "contactSuccessMessage" TEXT,
  "disclosureTitle" TEXT, "disclosureContent" TEXT, "privacyTitle" TEXT, "privacyContent" TEXT, "termsTitle" TEXT, "termsContent" TEXT,
  "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "pinterestTagId" TEXT, "webhookUrl" TEXT,
  "enableDirectSales" BOOLEAN DEFAULT false, "currency" TEXT DEFAULT 'ZAR', 
  "yocoPublicKey" TEXT, "payfastMerchantId" TEXT, "payfastMerchantKey" TEXT, "bankDetails" TEXT,
  "vatRegistered" BOOLEAN DEFAULT false, "vatRate" NUMERIC, "vatNumber" TEXT,
  "bankName" TEXT, "accountNumber" TEXT, "branchCode" TEXT,
  "newsletterPopupTitle" TEXT, "newsletterPopupSubtitle" TEXT, "newsletterPopupBadge" TEXT
);

CREATE TABLE IF NOT EXISTS private_secrets (id TEXT PRIMARY KEY DEFAULT 'global', "payfastSaltPassphrase" TEXT, "zapierWebhookUrl" TEXT);

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

-- 3. RECURSION-PROOF HELPERS (SECURITY DEFINER)
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

-- 5. RE-CREATE ACCESS POLICIES
CREATE POLICY "Public_Read_Settings" ON public_settings FOR SELECT USING (true);
CREATE POLICY "Public_Read_Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public_Read_Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public_Read_Subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public_Read_Hero" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public_Read_Articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public_Read_Reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public_Read_Training" ON training_modules FOR SELECT USING (true);

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

CREATE POLICY "Admin_Self_View" ON admin_users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Admin_List_View" ON admin_users FOR SELECT USING (is_admin());
CREATE POLICY "Owner_Manage_Admins" ON admin_users FOR ALL USING (is_owner());

CREATE POLICY "Owner_Only_Secrets" ON private_secrets FOR ALL USING (is_owner());

CREATE POLICY "Public_Insert_Subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public_Insert_Enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public_Insert_Reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public_Insert_Traffic" ON traffic_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public_Manage_Stats" ON product_stats FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Customer_Manage_Orders" ON orders FOR ALL 
USING (auth.uid()::text = "userId") 
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Customer_Manage_OrderItems" ON order_items FOR ALL 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items."orderId" AND orders."userId" = auth.uid()::text))
WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items."orderId" AND orders."userId" = auth.uid()::text));

CREATE POLICY "Profiles_Public_View" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles_User_Manage" ON profiles FOR ALL USING (auth.uid() = id);`
  },
  {
    id: '3',
    title: '3. Media Storage Configuration',
    description: 'Enable hosting for high-resolution product photography and assets.',
    illustrationId: 'rocket',
    subSteps: [
      'In Supabase, navigate to SQL Editor.',
      'Paste and run the Storage Script to create the "media" bucket.',
      'Ensure "Public" access is enabled for read permissions.',
      'Set "Admin Upload Media" policies for authenticated users.'
    ],
    codeLabel: 'Storage Bucket Script',
    code: `INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Public Read Media" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
CREATE POLICY "Admin Upload Media" ON storage.objects FOR ALL TO authenticated WITH CHECK ( bucket_id = 'media' );`
  },
  {
    id: '4',
    title: '4. Identity & Access Protocol',
    description: 'Control how you and your clients interact with the platform.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Supabase Authentication > Providers.',
      'Enable Email and disable "Confirm Email" for instant setup.',
      'Set Site URL to your production domain.',
      'Add Redirect URLs for local development: http://localhost:3000/**.'
    ]
  },
  {
    id: '5',
    title: '5. Technical Handshake (.env)',
    description: 'Connect your frontend code to your cloud database securely.',
    illustrationId: 'rocket',
    subSteps: [
      'Open your local project code editor.',
      'Create or edit the ".env" file.',
      'Paste your Supabase URL and Anon Key.',
      'Restart your Vite development server.'
    ]
  },
  {
    id: '6',
    title: '6. Bootstrap System Owner',
    description: 'Grant yourself "Owner" privileges to bypass all restrictions.',
    illustrationId: 'forge',
    subSteps: [
      'Register via the "Client Login" page on your live site.',
      'Go to Supabase SQL Editor.',
      'Run the promo script replacing the email with your registered one.'
    ]
  },
  {
    id: '7',
    title: '7. Admin Generator (RPC)',
    description: 'Enable the ability to add staff members directly from your dashboard.',
    illustrationId: 'forge',
    subSteps: [
      'Run the SQL script for create_admin_user function.',
      'This links Auth records with DB Admin profiles simultaneously.',
      'Essential for growing your curation team.'
    ]
  },
  {
    id: '8',
    title: '8. Global Deployment & PWA',
    description: 'Launch your high-performance bridge page to the world.',
    illustrationId: 'rocket',
    subSteps: [
      'Deploy your code to Vercel or Netlify.',
      'The app will automatically generate its "PWA Manifest".',
      'Users will be prompted to "Add to Home Screen" on mobile devices.'
    ]
  },
  {
    id: '9',
    title: '9. Conversion & Pixel Tracking',
    description: 'Connect your marketing tools to track ROI from TikTok, IG, and Facebook.',
    illustrationId: 'forge',
    subSteps: [
      'Go to the "Canvas" tab in your Maison Portal.',
      'Paste your Meta Pixel and TikTok IDs.',
      'The app handles script injection automatically.'
    ]
  },
  {
    id: '10',
    title: '10. Brand Aesthetic Liquidity',
    description: 'Define your visual DNA using the Canvas settings.',
    illustrationId: 'forge',
    subSteps: [
      'Upload your PNG Logo for high-definition rendering.',
      'Set your Primary Hex Code (e.g., #D4AF37 for luxury gold).',
      'Update SEO Metadata to ensure your story ranks on Google.'
    ]
  },
  {
    id: '11',
    title: '11. Departmental Architecture',
    description: 'Structure your bridge page for effortless discovery.',
    illustrationId: 'rocket',
    subSteps: [
      'Create Categories (Departments) via the "Depts" tab.',
      'Choose high-quality Department cover images.',
      'Add Sub-Categories to refine the user search path.'
    ]
  },
  {
    id: '12',
    title: '12. Masterpiece Deployment',
    description: 'Begin populating your catalog with hand-selected items.',
    illustrationId: 'forge',
    subSteps: [
      'Use the "Items" tab to add your first product.',
      'Write evocative descriptions that match your curation style.',
      'Add Technical Specifications for high-trust conversions.'
    ]
  },
  {
    id: '13',
    title: '13. Affiliate Bridge Mechanics',
    description: 'Ensure your "Secure Acquisition" flow is flawless.',
    illustrationId: 'rocket',
    subSteps: [
      'Paste valid affiliate deep-links into the Product Form.',
      'Disable "Direct Sale" to trigger the Bridge Redirect UI.',
      'Verify links open in a new tab with your tracking parameters.'
    ]
  },
  {
    id: '14',
    title: '14. Direct Merchant Activation',
    description: 'Enable native transactions for exclusive inventory.',
    illustrationId: 'forge',
    subSteps: [
      'Input your Yoco or PayFast API keys in "Canvas > Integrations".',
      'Toggle "Enable Direct Sales" for specific premium items.',
      'Update your Banking Details for EFT fallback payments.'
    ]
  },
  {
    id: '15',
    title: '15. Editorial Authority (Journal)',
    description: 'Build trust through professional style insights.',
    illustrationId: 'forge',
    subSteps: [
      'Draft your first Journal entry in the "Journal" tab.',
      'Use Markdown to structure content with headings and lists.',
      'Choose cinematic header images for editorial impact.'
    ]
  },
  {
    id: '16',
    title: '16. Collective Growth (Newsletter)',
    description: 'Convert passing traffic into long-term subscribers.',
    illustrationId: 'rocket',
    subSteps: [
      'Customize the Newsletter Popup title in "Canvas > Brand".',
      'Set the "Audience" badge to create a sense of exclusivity.',
      'Monitor new leads in the "Audience" tab.'
    ]
  },
  {
    id: '17',
    title: '17. Concierge Inbox Protocol',
    description: 'Respond to styling inquiries and brand partnerships.',
    illustrationId: 'forge',
    subSteps: [
      'Check the "Inbox" tab daily for unread transmissions.',
      'Use the "Reply" button to trigger professional email responses.',
      'Archive completed inquiries to maintain a clean workspace.'
    ]
  },
  {
    id: '18',
    title: '18. Academy Synchronization',
    description: 'Equip your staff or yourself with affiliate strategies.',
    illustrationId: 'rocket',
    subSteps: [
      'Create Training Modules in the "Academy" tab.',
      'Define actionable strategies for Instagram/TikTok growth.',
      'Use the checklists to ensure consistency across social feeds.'
    ]
  },
  {
    id: '19',
    title: '19. Intelligence Interpretation',
    description: 'Analyze performance data to optimize curation.',
    illustrationId: 'forge',
    subSteps: [
      'Review the "Insights" dashboard for traffic spikes.',
      'Identify Top Products by view count and click-through rate.',
      'Generate an "Executive Report" PDF for performance review.'
    ]
  },
  {
    id: '20',
    title: '20. Launch Sequence & Monitoring',
    description: 'Maintain system health for high-volume traffic.',
    illustrationId: 'rocket',
    subSteps: [
      'Check the "System" tab for latency and database health.',
      'Monitor logs for any "ERROR" types during sync.',
      'You are now operational. Curate with purpose.'
    ]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Art of Timeless Curation',
    excerpt: 'Why choosing quality over quantity is the ultimate style statement in 2025.',
    content: 'In an era of disposable trends, the curated wardrobe stands as a testament to personal integrity and sustainable taste...',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    date: Date.now() - 100000000,
    author: 'Chief Curator'
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'ig-strategy',
    title: 'Instagram Conversion Flow',
    platform: 'Instagram',
    description: 'How to transition followers from Stories to Curation clicks.',
    strategies: ['High-contrast visuals', 'Urgency-based captions', 'Direct-to-bridge links'],
    actionItems: ['Record 3 story segments', 'Update bio link', 'Tag partner brands'],
    icon: 'Instagram'
  }
];

export const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'sector.sales',
    label: 'Sales & Logistics',
    description: 'High-level commerce oversight.',
    children: [
      { id: 'privilege.inbox', label: 'Access Inbox', description: 'Handle client enquiries.' },
      { id: 'privilege.orders', label: 'Access Orders', description: 'Manage fulfillment and stock.' },
      { id: 'privilege.audience', label: 'Access Audience', description: 'Manage subscribers.' }
    ]
  },
  {
    id: 'sector.curation',
    label: 'Inventory & Depts',
    description: 'Manage the affiliate and direct catalog.',
    children: [
      { id: 'privilege.items', label: 'Access Items', description: 'Product management.' },
      { id: 'privilege.depts', label: 'Access Depts', description: 'Category management.' },
      { id: 'privilege.reviews', label: 'Access Reviews', description: 'Moderate client feedback.' }
    ]
  },
  {
    id: 'sector.experience',
    label: 'Content & Experience',
    description: 'Aesthetic and educational content.',
    children: [
      { id: 'privilege.visuals', label: 'Access Visuals', description: 'Hero banners and media.' },
      { id: 'privilege.journal', label: 'Access Journal', description: 'Editorial articles.' },
      { id: 'privilege.academy', label: 'Access Academy', description: 'Training modules.' }
    ]
  },
  {
    id: 'sector.infrastructure',
    label: 'Core Infrastructure',
    description: 'System health and site identity.',
    children: [
      { id: 'privilege.insights', label: 'Access Insights', description: 'Detailed telemetry.' },
      { id: 'privilege.canvas', label: 'Access Canvas', description: 'Identity and integrations.' },
      { id: 'privilege.maison', label: 'Access Maison', description: 'Staff management.' },
      { id: 'privilege.system', label: 'Access System', description: 'Technical health logs.' },
      { id: 'privilege.pilot', label: 'Access Pilot', description: 'Launch blueprints.' }
    ]
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'owner',
    name: 'Primary Curator',
    email: 'admin@kasicouture.com',
    role: 'owner',
    permissions: ['*'],
    password: 'password123',
    createdAt: Date.now(),
    phone: '',
    address: 'Global HQ',
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
    name: 'Sample Connection',
    email: 'hello@example.com',
    whatsapp: '',
    subject: 'Consultation',
    message: 'Welcome to your new dashboard. This is a sample inquiry.',
    createdAt: Date.now(),
    status: 'unread'
  },
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'CURATOR PORTAL',
  slogan: 'Refined Selection',
  companyLogo: 'CP',
  companyLogoUrl: 'https://i.ibb.co/wZt02bvX/Whats-App-Image-2026-01-21-at-17-44-31-removebg-preview.png',
  faviconUrl: 'https://i.ibb.co/wZt02bvX/Whats-App-Image-2026-01-21-at-17-44-31-removebg-preview.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',

  seoTitle: 'The Curator | Luxury Affiliate Bridge',
  seoDescription: 'A personal curation of vetted luxury finds and professional style insights.',

  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'The Narrative',
  navJournalLabel: 'Journal',
  navContactLabel: 'Concierge',
  navPortalLabel: 'Portal',
  navDashboardLabel: 'Maison',

  contactEmail: 'hello@curator.bridge',
  contactPhone: '+27 00 000 0000',
  whatsappNumber: '27000000000',
  address: 'Digital Office',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: '' }
  ],

  footerDescription: "Every piece hand-selected for quality, integrity, and timeless aesthetic.",
  footerCopyrightText: "All rights reserved.",

  homeHeroBadge: 'Senior Strategist',
  homeAboutTitle: 'Curation with Purpose.',
  homeAboutDescription: 'Years of industry experience distilled into a single, high-trust gateway for your aesthetic journey.',
  homeAboutImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'The Narrative',
  homeCategorySectionTitle: 'Departments',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'The Standard',
  
  homeTrustItem1Title: 'Expert Vetting',
  homeTrustItem1Desc: 'We only recommend what we physically verify.',
  homeTrustItem1Icon: 'ShieldCheck', 

  homeTrustItem2Title: 'Authentic Links',
  homeTrustItem2Desc: 'Direct connections to authorized global partners.',
  homeTrustItem2Icon: 'Sparkles', 

  homeTrustItem3Title: 'Global Reach',
  homeTrustItem3Desc: 'Bridges to the world\'s most exclusive boutiques.',
  homeTrustItem3Icon: 'Globe', 

  homeBottomHookTitle: 'The Future of Taste.',
  homeBottomHookSubtitle: 'Join a community of discerning individuals who value substance over noise.',
  homeBottomHookButtonText: 'Join the Circle',

  productsHeroTitle: 'Curated Catalog.',
  productsHeroSubtitle: 'Our latest verified finds from across the digital landscape.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [],
  productsSearchPlaceholder: 'Search the vault...',
  productsEmptyHeadline: 'Vetting in Progress',
  productsEmptyDescription: 'New items are being verified by our team. Check back shortly.',

  aboutHeroTitle: 'The Narrative.',
  aboutHeroSubtitle: 'A journey built on integrity, aesthetic vision, and the pursuit of quality.',
  aboutMainImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2025',
  aboutFounderName: 'Principal Curator',
  aboutLocation: 'Cape Town, ZA',

  aboutHistoryTitle: 'Beyond the Feed',
  aboutHistoryBody: 'My story began with a simple observation: the digital world is full of products, but starving for curation. \n\nI built this bridge page to serve as a filter. I spend the hours researching, comparing materials, and verifying retailers so that when you click a link, you do so with complete confidence.',
  
  aboutMissionTitle: 'The Mission',
  aboutMissionBody: 'To elevate the digital shopping experience through human-led vetting.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'The Collective',
  aboutCommunityBody: 'A growing community of enthusiasts who value taste over trends.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Integrity Protocol',
  aboutIntegrityBody: 'We are transparent about our affiliate partnerships. Our trust is our most valuable asset.',
  aboutIntegrityIcon: 'Award',

  aboutSignatureImage: '',
  aboutGalleryImages: [],
  aboutMilestones: [],

  contactHeroTitle: 'The Concierge.',
  contactHeroSubtitle: 'Direct access for consultations, enquiries, and brand partnerships.',
  contactFormNameLabel: 'Identity',
  contactFormEmailLabel: 'Email',
  contactFormSubjectLabel: 'Topic',
  contactFormMessageLabel: 'Inquiry',
  contactFormButtonText: 'Transmit',
  
  contactInfoTitle: 'Direct Studio',
  contactAddressLabel: 'Headquarters',
  contactHoursLabel: 'Available',
  contactHoursWeekdays: '24/7 Digital Intake',
  contactHoursWeekends: '',
  contactSuccessTitle: 'Message Transmitted',
  contactSuccessMessage: 'A dedicated representative will review your inquiry shortly.',

  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### DISCLOSURE\n\nThis site earns commissions through verified affiliate programs. This supports our research at no cost to you.`, 
  privacyTitle: 'Privacy Policy',
  privacyContent: `### PRIVACY\n\nYour data is secured and never sold to third parties.`, 
  termsTitle: 'Terms of Service',
  termsContent: `### TERMS\n\nWe are a curation service. Final transactions occur on partner sites.`, 

  enableDirectSales: false,
  currency: 'ZAR',
  yocoPublicKey: '',
  payfastMerchantId: '',
  payfastMerchantKey: '',
  payfastSaltPassphrase: '',
  zapierWebhookUrl: '',
  bankDetails: '',

  // Financial Settings (New)
  vatRegistered: false,
  vatRate: 15,
  vatNumber: '',
  bankName: '',
  accountNumber: '',
  branchCode: '',

  // Newsletter Popup
  newsletterPopupTitle: 'Exclusive Access',
  newsletterPopupSubtitle: 'Join the circle for private updates and vetted arrivals.',
  newsletterPopupBadge: 'Collectors Only'
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Curated Finds.',
    subtitle: 'Exceptional pieces, hand-selected for the discerning individual.',
    cta: 'View Collection'
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Apparel', icon: 'Dress', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800', description: 'Timeless silhouettes.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [];

export const INITIAL_PRODUCTS: Product[] = [];
