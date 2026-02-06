
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
    id: 'mission-brief',
    title: '1. Mission & Brand Brief',
    description: 'Define your aesthetic territory. Before touching code, establish your bridge page\'s niche (e.g., Luxury Footwear, Tech Accessories).',
    illustrationId: 'rocket',
    subSteps: [
      'Select a focus niche with high affiliate commission potential.',
      'Decide on your brand voice (Minimalist, Avant-Garde, or High-Street).',
      'Prepare 3 high-resolution hero images that represent your style.',
      'Write your unique "Curator Story" for the About section.'
    ]
  },
  {
    id: 'supabase-init',
    title: '2. Cloud Nerve Center (Supabase)',
    description: 'Establish your cloud database infrastructure. This allows your bridge page to sync data in real-time across all devices.',
    illustrationId: 'forge',
    subSteps: [
      'Create a free account at Supabase.com.',
      'Initialize a new project named "Findara Bridge".',
      'Choose a strong database password (store it securely).',
      'Navigate to "Settings" > "API" to find your project credentials.'
    ]
  },
  {
    id: 'database',
    title: '3. Architectural Blueprint (SQL)',
    description: 'Inject the master data schema into your database. This creates the tables for products, analytics, and settings.',
    illustrationId: 'rocket',
    subSteps: [
      'Open the "SQL Editor" in your Supabase dashboard.',
      'Click "New Query" and paste the Idempotent Master SQL Script.',
      'Click "Run". It will safely add new columns without affecting existing data.',
      'Verify that RLS (Row Level Security) is enabled for all tables.'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v6.0 (Idempotent & Data-Safe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLES (Ensures base tables exist)
CREATE TABLE IF NOT EXISTS settings (id TEXT PRIMARY KEY DEFAULT 'global');
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS product_stats ("productId" TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS training_modules (id TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS product_history (id TEXT PRIMARY KEY);

-- 2. SCHEMA EVOLUTION (Adds missing columns conditionally)
DO $$ 
BEGIN
    -- Settings Evolution
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "companyName" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS slogan TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "companyLogo" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "companyLogoUrl" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "primaryColor" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "secondaryColor" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "accentColor" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "navHomeLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "navProductsLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "navAboutLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "navContactLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "navDashboardLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactPhone" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "whatsappNumber" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "socialLinks" JSONB;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactFaqs" JSONB;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "footerDescription" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "footerCopyrightText" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeHeroBadge" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeAboutTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeAboutDescription" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeAboutImage" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeAboutCta" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeCategorySectionTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeCategorySectionSubtitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeNicheHeader" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeNicheSubheader" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustHeader" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustSubheader" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustSectionTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem1Title" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem1Desc" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem1Icon" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem2Title" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem2Desc" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem2Icon" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem3Title" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem3Desc" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeTrustItem3Icon" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "productsHeroTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "productsHeroSubtitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "productsHeroImage" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "productsHeroImages" TEXT[];
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "productsSearchPlaceholder" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutHeroTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutHeroSubtitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutMainImage" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutEstablishedYear" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutFounderName" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutLocation" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutHistoryTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutHistoryBody" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutMissionTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutMissionBody" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutMissionIcon" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutCommunityTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutCommunityBody" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutCommunityIcon" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutIntegrityTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutIntegrityBody" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutIntegrityIcon" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutSignatureImage" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "aboutGalleryImages" TEXT[];
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactHeroTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactHeroSubtitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactFormNameLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactFormEmailLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactFormSubjectLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactFormMessageLabel" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "contactFormButtonText" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "disclosureTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "disclosureContent" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "privacyTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "privacyContent" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "termsTitle" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "termsContent" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "facebookPixelId" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "tiktokPixelId" TEXT;
    ALTER TABLE settings ADD COLUMN IF NOT EXISTS "pinterestTagId" TEXT;

    -- Products Evolution
    ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "affiliateLink" TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "subCategoryId" TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS features TEXT[];
    ALTER TABLE products ADD COLUMN IF NOT EXISTS specifications JSONB;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS media JSONB;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "discountRules" JSONB;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews JSONB;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "createdAt" BIGINT;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

    -- Categories Evolution
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon TEXT;
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS image TEXT;
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

    -- Admin Users Evolution
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS name TEXT;
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email TEXT;
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT;
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions TEXT[];
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS "createdAt" BIGINT;
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS "autoWipeExempt" BOOLEAN DEFAULT FALSE;
    ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS "profileImage" TEXT;

    -- Product Stats Evolution
    ALTER TABLE product_stats ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
    ALTER TABLE product_stats ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;
    ALTER TABLE product_stats ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0;
    ALTER TABLE product_stats ADD COLUMN IF NOT EXISTS "totalViewTime" NUMERIC DEFAULT 0;
    ALTER TABLE product_stats ADD COLUMN IF NOT EXISTS "lastUpdated" BIGINT;

    -- Training Modules Evolution
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS title TEXT;
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS platform TEXT;
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS description TEXT;
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS icon TEXT;
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS strategies TEXT[];
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS "actionItems" TEXT[];
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS steps JSONB;
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS "createdAt" BIGINT;
    ALTER TABLE training_modules ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

END $$;

-- 3. RLS & POLICIES (Idempotent creation)
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

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read settings') THEN
        CREATE POLICY "Public Read settings" ON settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read products') THEN
        CREATE POLICY "Public Read products" ON products FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Enable all for anon') THEN
        CREATE POLICY "Enable all for anon" ON settings FOR ALL USING (true);
    END IF;
    -- Note: Add additional IF NOT EXISTS blocks for other policies as needed.
END $$;`,
    codeLabel: 'Idempotent Master SQL Script v6.0'
  },
  {
    id: 'security-auth',
    title: '4. Guard Protocol (Auth)',
    description: 'Configure how your team accesses the Maison Portal. This secures your collections from unauthorized changes.',
    illustrationId: 'forge',
    subSteps: [
      'Go to "Authentication" > "Providers" in Supabase.',
      'Enable "Email" and "Google" (optional but recommended).',
      'Disable "Confirm Email" if you want instant staff onboarding.',
      'Add your production URL to "Redirect URLs" in "Auth Settings".'
    ]
  },
  {
    id: 'asset-vault',
    title: '5. Asset Vault (Storage)',
    description: 'Prepare high-speed CDN hosting for your product imagery and cinematic videos.',
    illustrationId: 'rocket',
    subSteps: [
      'Navigate to "Storage" in the Supabase dashboard.',
      'Create a new Bucket exactly named "media".',
      'Set the bucket to "Public" visibility.',
      'In "Policies", create a policy allowing SELECT, INSERT, and UPDATE for all users.'
    ]
  },
  {
    id: 'local-infrastructure',
    title: '6. Local Infrastructure (.env)',
    description: 'Link your local development engine to your cloud project using environment variables.',
    illustrationId: 'forge',
    subSteps: [
      'Create a file named ".env" in your project root folder.',
      'Copy your "Project URL" and "Anon Key" from Supabase API settings.',
      'Paste them into the .env file exactly as shown below.',
      'Restart your development server to apply the link.'
    ],
    code: 'VITE_SUPABASE_URL=https://xxxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    codeLabel: '.env Credentials'
  },
  {
    id: 'version-control',
    title: '7. Version Control (GitHub)',
    description: 'Secure your codebase and enable automated production deployments.',
    illustrationId: 'rocket',
    subSteps: [
      'Initialize a new Git repository: "git init".',
      'Create a new Private Repository on GitHub.',
      'Commit your current build: "git add .", "git commit -m \'Initial Launch\'".',
      'Push your code to the GitHub remote main branch.'
    ]
  },
  {
    id: 'email-protocol',
    title: '8. Email Server (EmailJS)',
    description: 'Setup the automated communication bridge for client enquiries.',
    illustrationId: 'forge',
    subSteps: [
      'Sign up at EmailJS.com.',
      'Connect your professional email service (Gmail, Outlook, etc.).',
      'Navigate to "Account" to find your "Public Key".',
      'Navigate to "Email Services" to find your "Service ID".'
    ]
  },
  {
    id: 'template-engineering',
    title: '9. Response Engineering',
    description: 'Design the luxury reply template your clients receive when you answer an enquiry.',
    illustrationId: 'rocket',
    subSteps: [
      'In EmailJS, create a "New Template".',
      'Mapping Variables: {{to_name}}, {{message}}, {{subject}}, {{company_name}}.',
      'Paste the Elegant HTML Code (found in constants.tsx) into the code editor.',
      'Save the template and note the "Template ID".'
    ]
  },
  {
    id: 'production-launch',
    title: '10. Production Launch (Vercel)',
    description: 'Deploy your bridge page to the global web for high-performance viewing.',
    illustrationId: 'forge',
    subSteps: [
      'Sign into Vercel.com and click "Add New Project".',
      'Import your GitHub repository created in Step 7.',
      'Configure Build Command: "npm run build" and Output: "dist".',
      'Wait for the deployment to finish and click your new URL.'
    ]
  },
  {
    id: 'cloud-injectors',
    title: '11. Cloud Injectors (Secrets)',
    description: 'Securely transfer your private API keys to the production environment.',
    illustrationId: 'rocket',
    subSteps: [
      'In Vercel, go to "Settings" > "Environment Variables".',
      'Add "VITE_SUPABASE_URL" and "VITE_SUPABASE_ANON_KEY".',
      'Redeploy your project to enable cloud synchronization.',
      'Verify the "System Status" indicator in your Admin footer is green.'
    ]
  },
  {
    id: 'domain-authority',
    title: '12. Domain Authority (DNS)',
    description: 'Finalize your brand identity with a custom .com or .luxury domain.',
    illustrationId: 'forge',
    subSteps: [
      'Purchase a domain from a registrar (GoDaddy, Namecheap).',
      'Add the domain in Vercel "Settings" > "Domains".',
      'Update your DNS records (A and CNAME) as instructed by Vercel.',
      'Wait for SSL propagation (usually 1-2 hours).'
    ]
  },
  {
    id: 'analytics-ga4',
    title: '13. Vitality Sensors (GA4)',
    description: 'Install Google Analytics to monitor visitor origins and engagement duration.',
    illustrationId: 'rocket',
    subSteps: [
      'Create a "Web Data Stream" in Google Analytics.',
      'Copy the "Measurement ID" (G-XXXXXXXXXX).',
      'Go to Maison Portal > Canvas > Integrations and paste the ID.',
      'Test live tracking via the "Realtime" view in GA4.'
    ]
  },
  {
    id: 'meta-conversions',
    title: '14. Meta Pixel Deployment',
    description: 'Enable retargeting and conversion tracking for Instagram and Facebook ads.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Meta Events Manager and Create a "Web Data Source".',
      'Copy the numeric "Pixel ID".',
      'Paste into the Integrations tab of your site editor.',
      'Verify tracking using the "Meta Pixel Helper" browser extension.'
    ]
  },
  {
    id: 'tiktok-tracking',
    title: '15. TikTok Viral Tracking',
    description: 'Monitor high-traffic trends and referral performance from TikTok.',
    illustrationId: 'rocket',
    subSteps: [
      'In TikTok Ads Manager, navigate to "Assets" > "Events".',
      'Create a "Web Event" and select "Manual Setup".',
      'Copy the generated "Pixel ID".',
      'Synchronize it via your Maison Portal Integrations tab.'
    ]
  },
  {
    id: 'pinterest-aesthetic',
    title: '16. Pinterest Aesthetic Tracking',
    description: 'Capture aesthetic-driven shoppers from the Pinterest ecosystem.',
    illustrationId: 'forge',
    subSteps: [
      'Navigate to Pinterest Business Hub > Ads > Conversions.',
      'Create a "Pinterest Tag".',
      'Copy the "Unique Tag ID".',
      'Apply it to your site via the Canvas > Integrations menu.'
    ]
  },
  {
    id: 'canvas-personalization',
    title: '17. Identity Calibration (Canvas)',
    description: 'Calibrate your site\'s visual identity to match your unique curation style.',
    illustrationId: 'rocket',
    subSteps: [
      'Open Maison Portal > Canvas > Identity.',
      'Upload your logo and select your Primary Gold/Accent colors.',
      'Set your Slogan and Navigation labels (e.g., "The Vault" vs "Collections").',
      'Preview changes instantly on your mobile device.'
    ]
  },
  {
    id: 'catalog-deployment',
    title: '18. Catalog Strategy (Items)',
    description: 'Populate your bridge page with high-commission, personally curated items.',
    illustrationId: 'forge',
    subSteps: [
      'Go to Items and create logical "Departments" first.',
      'Add products with "Why We Love It" highlights to increase trust.',
      'Ensure every "Affiliate Link" includes your unique tracking ID.',
      'Use the "Ad Generator" to create social media assets for each item.'
    ]
  },
  {
    id: 'academy-deployment',
    title: '19. Growth Blueprint (Academy)',
    description: 'Utilize the training modules to master the algorithms of social platforms.',
    illustrationId: 'rocket',
    subSteps: [
      'Review the "Instagram Aesthetic" training for visual consistency.',
      'Apply the "Pinterest Viral Pins" strategy for evergreen traffic.',
      'Follow "TikTok Trend Jacking" to capture viral fashion moments.',
      'Complete "SEO for Luxury" to rank for high-intent search terms.'
    ]
  },
  {
    id: 'maintenance-scaling',
    title: '20. Scaling & Maintenance',
    description: 'Establish a rhythm for catalog refreshes and analytical auditing.',
    illustrationId: 'forge',
    subSteps: [
      'Weekly: Audit "Elite Performance Report" for conversion drop-offs.',
      'Monthly: Trigger a "Curation Cycle" to move stale items to History.',
      'Quarterly: Backup your catalog data to JSON via System settings.',
      'Scaling: Add "Maison Staff" members as your traffic grows.'
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
    name: 'The Head Curator',
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
    message: 'Hi there, I saw your story and love your style. I am looking for a personal stylist for an upcoming gala. Do you offer virtual consultations?',
    createdAt: Date.now() - 86400000 * 2, // 2 days ago
    status: 'unread'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: "Findara",
  slogan: 'Your Trusted Style Bridge',
  companyLogo: 'F',
  companyLogoUrl: 'https://i.ibb.co/FkCdTns2/bb5w9xpud5l.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'My Picks',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'contact@findara.com',
  contactPhone: '+27 76 836 0325',
  whatsappNumber: '27768360325',
  address: 'Curated Online',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],
  contactFaqs: [
    {
      question: "Do you ship products directly?",
      answer: "No, I am a curator and affiliate marketer. I find the best deals and link you directly to verified partners like Shein. Your purchase and shipping are handled securely by them."
    },
    {
      question: "Why should I buy through your links?",
      answer: "I spend hours filtering through thousands of low-quality items to find the genuine 'hidden gems.' When you use my links, you're getting my personal stamp of approval on quality and style."
    },
    {
      question: "Are there extra costs using your links?",
      answer: "Never. In fact, I often have exclusive discount codes for my community. You get the same (or better) price, and the brand pays me a small commission for the referral."
    }
  ],

  productAcquisitionLabel: 'View on Partner Site',
  productSpecsLabel: 'Why I Selected This',

  footerDescription: "The premier bridge page for curated global trends. I find the best affiliate deals so you don't have to.",
  footerCopyrightText: "All rights reserved.",
  footerNavHeader: 'Navigation',
  footerPolicyHeader: 'Policy',

  // Home Page Content
  homeHeroBadge: 'Affiliate Curator',
  homeAboutTitle: 'My Narrative. My Curation.',
  homeAboutDescription: 'I spent years overspending on items that looked great online but failed in person. Findara is the result of my journey to find high-fashion aesthetics at everyday prices. This bridge page connects you to my personal favorites from trusted global partners like Shein, vetted for quality and true-to-style aesthetics.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Full Story',
  homeCategorySectionTitle: 'Curated Portals',
  homeCategorySectionSubtitle: 'The Edit',
  homeNicheHeader: 'The Curated Vault',
  homeNicheSubheader: 'Personal Portals',
  homeTrustHeader: 'Why trust my story?',
  homeTrustSubheader: 'Curation Integrity',
  homeTrustSectionTitle: 'The Bridge Difference',
  
  homeTrustItem1Title: 'Personally Vetted',
  homeTrustItem1Desc: 'I never link a product I wouldn\'t wear or use myself.',
  homeTrustItem1Icon: 'https://cdn-icons-png.flaticon.com/512/3260/3260814.png', 

  homeTrustItem2Title: 'Hidden Gems',
  homeTrustItem2Desc: 'I filter through the noise of global retail to find the true quality pieces.',
  homeTrustItem2Icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 

  homeTrustItem3Title: 'Direct & Secure',
  homeTrustItem3Desc: 'My links take you directly to official merchants for safe checkout.',
  homeTrustItem3Icon: 'https://cdn-icons-png.flaticon.com/512/3260/3260815.png', 

  // Products Page Content
  productsHeroTitle: 'The Curator\'s Vault',
  productsHeroSubtitle: 'My hand-picked selections from the world\'s largest trend-setters.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search my picks...',

  // About Page Content
  aboutHeroTitle: 'Authentic Curation. Real Story.',
  aboutHeroSubtitle: 'I’m not just a marketer; I’m a shopper who found a better way to style.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'The Lead Curator',
  aboutLocation: 'Cape Town & Online',

  aboutHistoryTitle: 'How It Started',
  aboutHistoryBody: 'Findara began as a simple list I shared with friends who were tired of returning low-quality online orders. In 2024, I realized that many people want the convenience of global retailers like Shein, but don\'t have the time to find the high-quality items hidden in the catalog.\n\nMy bridge system is built on one simple rule: Trust. I spend hours every week ordering, testing, and reviewing items. This platform is where I share those winners with you. Every click helps me keep this research going, bringing you the best of the web without the guesswork.',
  
  aboutMissionTitle: 'Curation Mission',
  aboutMissionBody: 'To act as your filter between overwhelming global catalogs and your personal wardrobe.',
  aboutMissionIcon: 'https://cdn-icons-png.flaticon.com/512/3260/3260814.png',

  aboutCommunityTitle: 'The Inner Circle',
  aboutCommunityBody: 'Join thousands of curators who follow my daily finds and style hacks.',
  aboutCommunityIcon: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  
  aboutIntegrityTitle: 'Transparency',
  aboutIntegrityBody: 'I am a professional affiliate marketer. My story is real, and my recommendations are backed by honest use.',
  aboutIntegrityIcon: 'https://cdn-icons-png.flaticon.com/512/3260/3260815.png',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800'
  ],

  // Contact Page Content
  contactHeroTitle: 'Contact My Concierge.',
  contactHeroSubtitle: 'Need help finding a specific piece or want to discuss styling? I\'m here to help.',
  contactFormNameLabel: 'Name',
  contactFormEmailLabel: 'Email',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Send to Curator',
  
  contactInfoTitle: 'Bridge HQ',
  contactAddressLabel: 'Location',
  contactHoursLabel: 'Response Hours',
  contactHoursWeekdays: 'Mon-Fri: 09:00 - 17:00',
  contactHoursWeekends: 'Weekends: Limited Support',

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
  pinterestTagId: ''
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'My Personal Selections',
    subtitle: 'High-fashion aesthetics meet everyday prices. Discover the hidden gems I\'ve vetted for you.',
    cta: 'Browse My Picks'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Narrative Edit',
    subtitle: 'Behind every recommendation is a story of quality testing and style exploration.',
    cta: 'Read My Story'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Wardrobe Essentials', icon: 'Dress', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800&h=800', description: 'The foundation of my personal style.' },
  { id: 'cat2', name: 'Accessories Vault', icon: 'Handbag', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800&h=800', description: 'Curated bags and fine jewelry.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Summer Dresses' },
  { id: 'sub2', categoryId: 'cat2', name: 'Designer Alternatives' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Silk Blend Slip Dress',
    sku: 'CUR-DR-001',
    price: 850,
    affiliateLink: 'https://example.com/dress',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'I found this after searching for the perfect slip dress for months. It has the weight of real silk at a fraction of the cost.',
    features: ['Vetted for true-to-size fit', 'Premium luster finish'],
    specifications: { 'Reason for Selection': 'Perfect drape' },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', name: 'Dress', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm_bridge',
    title: 'Bridge Page Conversion Mastery',
    platform: 'General',
    description: 'Learn how to turn your personal story into affiliate commissions.',
    strategies: ['Use the "I had this problem" narrative to build empathy.', 'Focus on vetting quality to overcome retail friction.'],
    actionItems: ['Write your "About" story in the Canvas.', 'Add your first 5 "Hidden Gems" to the catalog.'],
    icon: 'https://cdn-icons-png.flaticon.com/512/3260/3260814.png',
    steps: [
      { title: 'Define Your Why', description: 'Explain exactly why you started this bridge page. People buy from people they trust.', type: 'image' }
    ]
  },
  {
    id: 'tm1',
    title: 'Instagram Aesthetic Curation',
    platform: 'Instagram',
    description: 'Master visual storytelling on Instagram to drive traffic to your bridge.',
    strategies: ['Use high-contrast editorial photography.'],
    actionItems: ['Create 5 OOTD reels.'],
    icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png',
    steps: []
  }
];
