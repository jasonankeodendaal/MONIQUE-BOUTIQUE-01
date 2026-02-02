
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule, Article, Subscriber } from './types';

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
    code: `-- MASTER ARCHITECTURE & REPAIR SCRIPT v8.0
-- Fixes "Policy Already Exists" and "Infinite Recursion" errors.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SAFETY FLUSH (Drop existing policies to prevent recursion & existence errors)
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    -- Drop policies on public tables
    FOR r IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename); 
    END LOOP;

    -- Explicitly drop storage policies to prevent Error 42710
    EXECUTE 'DROP POLICY IF EXISTS "Public Access Media" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Insert Media" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Update Media" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Public Delete Media" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "Admin Upload Media" ON storage.objects';
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
-- Public Read
CREATE POLICY "Public Read settings" ON public_settings FOR SELECT USING (true);
CREATE POLICY "Public Read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public Read hero_slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY "Public Read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Read articles" ON articles FOR SELECT USING (true);

-- Admin Full Access (Simplified for setup)
CREATE POLICY "Enable all for admin public_settings" ON public_settings FOR ALL USING (true);
CREATE POLICY "Enable all for admin products" ON products FOR ALL USING (true);
CREATE POLICY "Enable all for admin categories" ON categories FOR ALL USING (true);
CREATE POLICY "Enable all for admin subcategories" ON subcategories FOR ALL USING (true);
CREATE POLICY "Enable all for admin hero_slides" ON hero_slides FOR ALL USING (true);
CREATE POLICY "Enable all for admin enquiries" ON enquiries FOR ALL USING (true);
CREATE POLICY "Enable all for admin admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Enable all for admin traffic_logs" ON traffic_logs FOR ALL USING (true);
CREATE POLICY "Enable all for admin product_stats" ON product_stats FOR ALL USING (true);
CREATE POLICY "Enable all for admin orders" ON orders FOR ALL USING (true);
CREATE POLICY "Enable all for admin order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Enable all for admin reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "Enable all for admin articles" ON articles FOR ALL USING (true);
CREATE POLICY "Enable all for admin subscribers" ON subscribers FOR ALL USING (true);

-- Lead Capture
CREATE POLICY "Enable insert for subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Private Secrets (Auth Only)
CREATE POLICY "Authenticated Read Secrets" ON private_secrets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Update Secrets" ON private_secrets FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated Insert Secrets" ON private_secrets FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- User Profiles
CREATE POLICY "Public Read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. STORAGE BUCKET & POLICIES
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
CREATE POLICY "Admin Upload Media" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'media' );
CREATE POLICY "Admin Update Media" ON storage.objects FOR UPDATE USING ( bucket_id = 'media' );
CREATE POLICY "Admin Delete Media" ON storage.objects FOR DELETE USING ( bucket_id = 'media' );`,
    codeLabel: 'Full System Repair Script (v8.0)'
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
    id: 'sales',
    label: 'Sales & Inbox',
    description: 'Manage incoming client communications and orders.',
    children: [
      { id: 'sales.view', label: 'View Inbox' },
      { id: 'sales.manage', label: 'Manage Enquiries (Reply/Status)' },
      { id: 'sales.orders', label: 'View Orders' }
    ]
  },
  {
    id: 'catalog',
    label: 'Catalog & Products',
    description: 'Manage the product database and inventory.',
    children: [
      { id: 'catalog.view', label: 'View Product List' },
      { id: 'catalog.create', label: 'Add New Items' },
      { id: 'catalog.edit', label: 'Edit Item Details' }
    ]
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'owner',
    name: 'Main Administrator',
    email: 'admin@example.com',
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
  slogan: 'Curating Luxury, Bridging Style',
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

  footerDescription: "The premier bridge page system marketing various affiliate programs. Your curated gateway to global fashion trends.",
  footerCopyrightText: "All rights reserved.",

  homeHeroBadge: 'Affiliate Curator',
  homeAboutTitle: 'My Journey in Curation.',
  homeAboutDescription: 'I started FINDARA as a way to bridge the gap between global luxury retailers and fashion lovers who appreciate a personal touch. Every item here is hand-selected to reflect the highest standards of style and quality.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Curated Departments',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'Why Shop via FINDARA',
  
  homeTrustItem1Title: 'Verified Affiliate',
  homeTrustItem1Desc: 'Official partner with major global retailers.',
  homeTrustItem1Icon: 'ShieldCheck', 

  homeTrustItem2Title: 'Personal Review',
  homeTrustItem2Desc: 'I personally select and review every item on this bridge page.',
  homeTrustItem2Icon: 'User', 

  homeTrustItem3Title: 'Direct Links',
  homeTrustItem3Desc: 'Click through directly to the merchant for secure checkout.',
  homeTrustItem3Icon: 'Link', 

  productsHeroTitle: 'The Catalog',
  productsHeroSubtitle: 'Browse my hand-picked selections from top affiliate programs.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search selections...',

  aboutHeroTitle: 'Me & FINDARA.',
  aboutHeroSubtitle: 'A passion for fashion turned into a global bridge.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'The Curator',
  aboutLocation: 'Cape Town, South Africa',

  aboutHistoryTitle: 'The Bridge Vision',
  aboutHistoryBody: 'My name is [Name], and FINDARA is my personal project to simplify the search for luxury fashion. In an age of endless options, I believe in curation.\n\nAs an affiliate marketer, I partner with world-renowned brands to bring you pieces that aren\'t just "trendy," but timeless. Every click on this site leads you to a verified, secure retail partner, ensuring you get authentic products while supporting my independent curation journey.',
  
  aboutMissionTitle: 'Curation Mission',
  aboutMissionBody: 'To bridge the gap between discerning shoppers and the best global affiliate offers.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'Join Our Circle',
  aboutCommunityBody: 'Follow for daily find and styling secrets.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency',
  aboutIntegrityBody: 'I am proud to be an affiliate. This site is built on honest reviews and authentic recommendations.',
  aboutIntegrityIcon: 'Shield',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800'
  ],

  contactHeroTitle: 'Contact Concierge.',
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
  disclosureContent: `### AFFILIATE DISCLOSURE STATEMENT\n\nFINDARA participates in various affiliate marketing programs, which means we may get paid commissions on products purchased through our links to retailer sites. This comes at no additional cost to you.\n\nOur recommendations are always based on independent curation and personal preference.`, 
  privacyTitle: 'Privacy Policy',
  privacyContent: `### PRIVACY POLICY\n\nYour privacy is paramount. We do not sell your personal data. We use cookies to track traffic sources and improve your experience on our bridge page.`, 
  termsTitle: 'Terms of Service',
  termsContent: `### TERMS OF SERVICE\n\nBy using FINDARA, you agree that we are a curation service and not the direct seller of affiliate items. All transaction disputes must be handled via the final retailer.`, 

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
    title: 'Curated Elegance',
    subtitle: 'A personal collection of global luxury finds.',
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
