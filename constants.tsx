
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule } from './types';

// EMAIL_TEMPLATE_HTML used for the reply system in Admin.tsx
export const EMAIL_TEMPLATE_HTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9f9f9; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 20px; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
        .header img { max-height: 80px; margin-bottom: 10px; }
        .header h1 { font-family: 'Playfair Display', serif; color: #1e293b; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
        .content { color: #475569; font-size: 16px; }
        .footer { font-size: 11px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
        .cta-button { display: inline-block; padding: 12px 24px; background-color: #D4AF37; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>{{company_name}}</h1>
        </div>
        <div class="content">
          <p>Dear {{to_name}},</p>
          <div>{{message}}</div>
          <p>If you have further questions, feel free to visit our concierge portal.</p>
          <a href="{{company_website}}" class="cta-button">Visit Our Collections</a>
        </div>
        <div class="footer">
          <p>&copy; {{year}} {{company_name}} | Boutique Curation</p>
          <p>{{company_address}}</p>
        </div>
      </div>
    </body>
  </html>
`;

export const GUIDE_STEPS = [
  {
    id: 'supabase-init',
    title: '1. Supabase Infrastructure',
    description: 'Establish your cloud nerve center. Create a free account at Supabase.com and initialize a new project named "Affiliate Bridge".',
    illustrationId: 'rocket',
    subSteps: [
      'Sign in to Supabase.com.',
      'Click "New Project" and select a region (e.g., Cape Town or London).',
      'Choose a secure Database Password and save it.',
      'Wait for the database to provision (approx. 2 minutes).'
    ]
  },
  {
    id: 'database',
    title: '2. Database Schema (SQL Engine)',
    description: 'Execute the master architecture script. This version is idempotent (run-safe) and includes security policies for permissions.',
    illustrationId: 'forge',
    subSteps: [
      'Navigate to the "SQL Editor" tab in Supabase.',
      'Click "New Query" and paste the comprehensive SQL block below.',
      'Click "Run". It handles tables, RLS enablement, and basic access policies.',
      'Verify tables exist in the "Table Editor".'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v3.0 (Idempotent)

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
  "googleAnalyticsId" TEXT, "facebookPixelId" TEXT, "tiktokPixelId" TEXT, "amazonAssociateId" TEXT, "webhookUrl" TEXT, "pinterestTagId" TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT,
  "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features TEXT[], specifications JSONB,
  media JSONB, "discountRules" JSONB, reviews JSONB, "createdAt" BIGINT, "createdBy" TEXT
);

CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, icon TEXT, image TEXT, description TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY, "categoryId" TEXT, name TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY, image TEXT, type TEXT, title TEXT, subtitle TEXT, cta TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT, email TEXT, whatsapp TEXT, subject TEXT, message TEXT, "createdAt" BIGINT, status TEXT);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, permissions TEXT[], "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT, source TEXT);
CREATE TABLE IF NOT EXISTS product_stats ( "productId" TEXT PRIMARY KEY, views INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, "totalViewTime" NUMERIC DEFAULT 0, "lastUpdated" BIGINT );

-- 3. PERMISSIONS (ROW LEVEL SECURITY)
-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES (Simplified for Anon access during migration)
-- For production, replace 'true' with proper auth checks e.g. (auth.uid() IS NOT NULL)
-- Public Read Access
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read settings') THEN CREATE POLICY "Public Read settings" ON settings FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read products') THEN CREATE POLICY "Public Read products" ON products FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read categories') THEN CREATE POLICY "Public Read categories" ON categories FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read subcategories') THEN CREATE POLICY "Public Read subcategories" ON subcategories FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read hero_slides') THEN CREATE POLICY "Public Read hero_slides" ON hero_slides FOR SELECT USING (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert enquiries') THEN CREATE POLICY "Public Insert enquiries" ON enquiries FOR INSERT WITH CHECK (true); END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Insert traffic_logs') THEN CREATE POLICY "Public Insert traffic_logs" ON traffic_logs FOR INSERT WITH CHECK (true); END IF;
END $$;

-- Admin Full Access (Allowing all for now via Anon Key, adjust per security needs)
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
    END IF;
END $$;`,
    codeLabel: 'Full System SQL Script'
  },
  {
    id: 'storage',
    title: '3. Asset Vault (Storage)',
    description: 'Setup high-speed CDN hosting for your product images and videos.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to the "Storage" tab in Supabase.',
      'Create a new bucket named "media".',
      'Set bucket visibility to "Public" (Required for bridge display).',
      'In "Policies", allow all operations (SELECT, INSERT, UPDATE) for Public access.'
    ]
  },
  {
    id: 'auth',
    title: '4. Authentication (Security)',
    description: 'Configure your staff access and login protocols.',
    illustrationId: 'forge',
    subSteps: [
      'Go to "Authentication" > "Settings".',
      'Disable "Confirm Email" if you want instant staff onboarding.',
      'Add "http://localhost:3000" to Redirect URLs for local testing.',
      'Add your production Vercel URL once deployed.'
    ]
  },
  {
    id: 'environment',
    title: '5. Local Infrastructure (.env)',
    description: 'Link your local development engine to your Supabase cloud project.',
    illustrationId: 'rocket',
    subSteps: [
      'Copy "Project URL" and "Anon Key" from Settings > API.',
      'Create a file named ".env" in your project root.',
      'Paste the variables exactly as shown below.'
    ],
    code: 'VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here',
    codeLabel: '.env Variables'
  },
  {
    id: 'github',
    title: '6. Version Control (GitHub)',
    description: 'Secure your codebase and enable continuous deployment (CI/CD).',
    illustrationId: 'forge',
    subSteps: [
      'Create a new repository on GitHub (Private recommended).',
      'Run "git init" in your local project folder.',
      'Run "git remote add origin [your-repo-url]".',
      'Push your code: "git add .", "git commit", "git push".'
    ]
  },
  {
    id: 'emailjs-account',
    title: '7. EmailJS: Service Protocol',
    description: 'Configure the automated mail server to handle client inquiries.',
    illustrationId: 'rocket',
    subSteps: [
      'Create an account at EmailJS.com.',
      'Go to "Email Services" and add your Gmail or Outlook.',
      'Note the "Service ID" for your settings.'
    ]
  },
  {
    id: 'emailjs-template',
    title: '8. EmailJS: Template Engineering',
    description: 'Design the professional reply template your clients will receive.',
    illustrationId: 'forge',
    subSteps: [
      'Go to "Email Templates" > "Create New".',
      'Map these variables: {{to_name}}, {{message}}, {{subject}}, {{company_name}}.',
      'Paste the HTML code below into the "Code" editor of the template.',
      'Note the "Template ID" and "Public Key".'
    ],
    code: EMAIL_TEMPLATE_HTML,
    codeLabel: 'EmailJS HTML Template'
  },
  {
    id: 'google-analytics',
    title: '9. Marketing: Google Analytics (G4)',
    description: 'Install tracking sensors to monitor global traffic origins.',
    illustrationId: 'rocket',
    subSteps: [
      'Create a property in Google Analytics.',
      'Go to Admin > Data Streams > Web.',
      'Copy the "Measurement ID" (starts with G-).',
      'Paste into Portal > Canvas > Integrations.'
    ]
  },
  {
    id: 'meta-pixel',
    title: '10. Marketing: Meta Pixel (Facebook)',
    description: 'Enable conversion tracking for Facebook and Instagram ads.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Meta Events Manager.',
      'Create a new "Web" Data Source (Pixel).',
      'Copy the numeric "Dataset ID".',
      'Paste into the Integrations tab.'
    ]
  },
  {
    id: 'tiktok-pixel',
    title: '11. Marketing: TikTok Monitoring',
    description: 'Track viral trends and referral performance from TikTok.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to TikTok Ads Manager > Assets > Events.',
      'Create a "Web Event" and select "Manual Setup".',
      'Copy the "Pixel ID".',
      'Paste into the Integrations tab.'
    ]
  },
  {
    id: 'pinterest-tag',
    title: '12. Marketing: Pinterest Tag',
    description: 'Capture aesthetic shoppers from the Pinterest ecosystem.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Pinterest Business Hub > Ads > Conversions.',
      'Create a "Pinterest Tag".',
      'Copy the "Unique Tag ID".',
      'Paste into the Integrations tab.'
    ]
  },
  {
    id: 'vercel-deploy',
    title: '13. Deployment: Vercel Production',
    description: 'Launch your bridge page to the global web with high-performance hosting.',
    illustrationId: 'rocket',
    subSteps: [
      'Sign in to Vercel.com.',
      'Click "Add New" > "Project".',
      'Import your GitHub repository created in Step 6.',
      'Wait for the "Configure Project" screen.'
    ]
  },
  {
    id: 'vercel-env',
    title: '14. Deployment: Cloud Injectors',
    description: 'Securely inject your API keys into the production environment.',
    illustrationId: 'forge',
    subSteps: [
      'In Vercel "Environment Variables", add "VITE_SUPABASE_URL".',
      'Add "VITE_SUPABASE_ANON_KEY".',
      'Click "Deploy". Your site is now live at a .vercel.app domain.'
    ]
  },
  {
    id: 'final-polish',
    title: '15. Final Polish: Custom Domain',
    description: 'Complete your brand identity with a custom .com or .co.za domain.',
    illustrationId: 'rocket',
    subSteps: [
      'Purchase a domain (GoDaddy, Namecheap, etc.).',
      'In Vercel, go to Settings > Domains.',
      'Add your domain and update the DNS records as instructed.',
      'Test your bridge page on your new custom URL!'
    ]
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'shein-mastery',
    title: 'Shein Affiliate Blueprint: Zero to First Commission',
    platform: 'General',
    description: 'The definitive guide to launching your affiliate career with Shein. Learn the exact technical workflow to extract high-converting product data and populate your bridge page.',
    icon: 'ShoppingBag',
    strategies: [
      'The Portal Protocol: Register at shein.com/affiliate-program. Pro-Tip: If denied, apply through Awin or CJ Affiliate networks which often have higher approval rates for new bridge pages.',
      'Deep-Link Engineering: Never link to the Shein homepage. Use the "Custom Link" tool in the Shein Publisher dashboard. Paste the specific product URL to generate a "Deep Link" that tracks your unique ID for that exact item.',
      'Media Harvesting: Use the "Image Asset" tab in the dashboard to download professional studio shots. Supplement this with "User Review Photos" (with permission/attribution) to show the "Real Life" look, which increases conversion by 35%.',
      'SKU Management: Always copy the "Product ID" or "SKU" into your Bridge Page Admin. This allows you to quickly find the item again when checking for "Out of Stock" status—a critical weekly maintenance task.'
    ],
    actionItems: [
      'Apply to the Shein Publisher Portal and wait for the verification email (usually 24-48 hours).',
      'Identify 10 "Best Sellers" in the "New In" category that match your brand aesthetic.',
      'Generate 10 Deep Links and save them in a spreadsheet with the Product IDs.',
      'Add your first "Shein Trend" category to this website and upload your first 5 curated pieces.'
    ]
  },
  {
    id: 'founder-growth',
    title: 'Founder Brand: The Niche Authority',
    platform: 'General',
    description: 'Transforming from a simple link-sharer to a cult-followed authority. People don\'t buy products; they buy your taste and your lifestyle.',
    icon: 'User',
    strategies: [
      'Phase 1: The Origin Story & "The Why" - Define your specific fashion struggle (e.g., "Finding luxury quality on a budget"). This relatable conflict builds instant trust with your audience.',
      'Phase 2: Visual Semiotics - Choose a signature color palette and a recurring visual element (like a specific mirror or a specific plant in your shots). This becomes your "Visual Logo".',
      'Phase 3: The Educational Pillar - Move from "Look at this" to "Why this works". Explain color theory, fabric quality (Mulberry Silk vs Satin), and silhouette balance to prove your expertise.',
      'Phase 4: Radical Transparency - Share your affiliate disclosure as a point of pride. Explain that commissions allow you to keep the curation high-quality and unbiased.'
    ],
    actionItems: [
      'Write a 500-word "Manifesto" about your style rules and pin it as a highlight.',
      'Record a high-energy 60-second "Intro" video explaining your mission as a curator.',
      'Audit your last 10 posts: Ensure at least 3 provide pure education with no sales pitch.',
      'Create a "Behind the Curation" series showing how you pick items for the bridge page.'
    ]
  },
  {
    id: 'instagram-mastery',
    title: 'Instagram: High-Conversion Storefront',
    platform: 'Instagram',
    description: 'The premier destination for visual fashion. We focus on "Story-Selling" and "Aesthetic Cohesion" to drive traffic to your bridge links.',
    icon: 'Instagram',
    strategies: [
      'The Grid Matrix: Alternate between Outfit-of-the-day (OOTD), Flat-lays, and Aesthetic Inspo (Moodboards). This creates a "lookbook" feel rather than a catalog.',
      'Story-Selling Funnel: Use the "3-Part Story Method". Part 1: Problem (e.g., "Nothing to wear for dinner"). Part 2: Solution (The Shein Dress). Part 3: The Link (Direct CTA to bridge page).',
      'DM Automation: Use tools like ManyChat. When a user comments "WANT", automatically send them the direct product link from your bridge page via DM. This boosts engagement 10x.',
      'Reels Algorithm Hacking: Use "Transition Loops". Edit your video so the last frame matches the first. The high replay rate signals the algorithm to push your content to the Explore page.'
    ],
    actionItems: [
      'Optimize your Bio: Use keywords like "Curated Fashion" and link your Bridge Page URL.',
      'Create 5 "Highlight" categories: "Shop My Style", "Reviews", "Sale Alerts", "FAQ", "Daily Picks".',
      'Post 3 Stories daily following the "Problem-Solution-Link" framework.',
      'Setup DM automation for your top 3 performing affiliate pieces.'
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
    email: 'admin@kasicouture.com',
    role: 'owner',
    permissions: ['*'], // * implies all
    password: 'password123',
    createdAt: Date.now(),
    phone: '+27 11 900 2000',
    address: 'Johannesburg HQ',
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
  companyName: 'Kasi Couture',
  slogan: 'Curated by the Founder',
  companyLogo: 'KC',
  companyLogoUrl: 'https://i.ibb.co/5X5qJXC6/Whats-App-Image-2026-01-08-at-15-34-23-removebg-preview.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'curation@kasicouture.com',
  contactPhone: '+27 11 900 2000',
  whatsappNumber: '+27119002000',
  address: 'Melrose Arch, Johannesburg',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/kasicouture', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'Twitter', url: 'https://twitter.com/kasicouture', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3256/3256013.png' }
  ],

  footerDescription: "The digital bridge to modern luxury. Curating elite fashion and lifestyle affiliate picks for the discerning modern closet.",
  footerCopyrightText: "All rights reserved. Made with love.",

  // Home
  homeHeroBadge: 'Founder\'s Selection',
  homeAboutTitle: 'My Journey in the Silhouette.',
  homeAboutDescription: 'I founded this platform to bridge the gap between pure aesthetics and high-performance lifestyle. Every piece featured here is a testament to my personal quest for quality—refined, tested, and curated for you.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Explore My Story',
  homeCategorySectionTitle: 'Shop by Department',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'The Standard',
  homeTrustItem1Title: 'Verified Quality',
  homeTrustItem1Desc: 'Every product link is personally tested and leads to a secure, verified retailer.',
  homeTrustItem1Icon: 'ShieldCheck',
  homeTrustItem2Title: 'Human Curation',
  homeTrustItem2Desc: 'No algorithms. Only human-selected pieces that embody the founder\'s aesthetic.',
  homeTrustItem2Icon: 'Sparkles',
  homeTrustItem3Title: 'Global Vision',
  homeTrustItem3Desc: 'Sourcing the best of local design and international luxury couture.',
  homeTrustItem3Icon: 'Globe',

  // Products
  productsHeroTitle: 'The Boutique Explorer',
  productsHeroSubtitle: 'Refine your selection by department, category, or founder favorites.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search my collections...',

  // About
  aboutHeroTitle: 'The Story of the Curator.',
  aboutHeroSubtitle: 'Kasi Couture is my personal curation platform, dedicated to finding the most exquisite garments and accessories.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'The Founder',
  aboutLocation: 'South Africa',

  aboutHistoryTitle: 'A Passion for Curation',
  aboutHistoryBody: 'What began as a style blog has evolved into a premier luxury bridge page. My mission is to highlight the intricate craftsmanship of designers I truly believe in.\n\nI believe that fashion is the most immediate form of self-expression. By curating only the pieces that meet my rigorous standards for fabric, fit, and flair, I hope to simplify your journey toward an effortless wardrobe.',
  
  aboutMissionTitle: 'Elite Standards',
  aboutMissionBody: 'To provide a seamless interface for fashion enthusiasts to discover premium affiliate products.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'Style Circle',
  aboutCommunityBody: 'Join a global community of style icons who value quality over quantity.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency',
  aboutIntegrityBody: 'As an affiliate bridge page, I receive a small commission on purchases made through my links, allowing me to keep curating the best for you.',
  aboutIntegrityIcon: 'Award',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551488852-0801d863dc34?auto=format&fit=crop&q=80&w=800'
  ],

  // Contact
  contactHeroTitle: 'Tailored Assistance.',
  contactHeroSubtitle: 'Have a question about a specific curation or want to collaborate? My concierge team is ready to assist.',
  contactFormNameLabel: 'Full Identity',
  contactFormEmailLabel: 'Digital Mailbox',
  contactFormSubjectLabel: 'Inquiry Subject',
  contactFormMessageLabel: 'Your Message',
  contactFormButtonText: 'Transmit Inquiry',
  
  // New Contact Editable Fields
  contactInfoTitle: 'Headquarters',
  contactAddressLabel: 'Address',
  contactHoursLabel: 'Operating Hours',
  contactHoursWeekdays: 'Mon - Fri: 09:00 - 18:00 (SAST)',
  contactHoursWeekends: 'Sat: 09:00 - 13:00',

  // Legal
  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### Affiliate Disclosure\n\nTransparency is our foundation. This platform is a professional curation site. Most product links are affiliate links. If you click and buy, we may receive a commission at no extra cost to you.`,
  privacyTitle: 'Privacy Policy',
  privacyContent: `### Privacy Policy\n\nWe value your data privacy. We only collect information necessary for newsletter signups and direct inquiries.`,
  termsTitle: 'Terms of Service',
  termsContent: `### Terms of Service\n\nThis is a bridge page. We do not process payments or ship goods directly. All sales are handled by third-party retailers.`,

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
    title: 'The Silk Series',
    subtitle: 'Flowing silhouettes designed for the golden hour.',
    cta: 'View Collection'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Tailored Precision',
    subtitle: 'Bespoke-inspired cuts for the modern professional.',
    cta: 'Explore Suiting'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Evening Elegance',
    subtitle: 'Pieces that capture the essence of luxury after dark.',
    cta: 'Shop Evening'
  }
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
    sku: 'KC-APP-001',
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
    reviews: [
      {
        id: 'r1',
        userName: 'Amahle Z.',
        rating: 5,
        comment: 'Absolutely stunning quality. The silk feels divine.',
        createdAt: Date.now() - 10000000
      }
    ]
  }
];
