
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
    .btn { display: inline-block; background-color: #D4AF37; color: #FFFFFF; padding: 166px 36px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; border-radius: 50px; box-shadow: 0 10px 20px -5px rgba(212, 175, 55, 0.4); }
    
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
      'Click "New Query" and paste the Master SQL Script provided below.',
      'Click "Run". Ensure all 11 tables are created in the "Table Editor".',
      'Verify that RLS (Row Level Security) is enabled for all tables.'
    ],
    code: `-- MASTER ARCHITECTURE SCRIPT v5.1
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  "companyName" TEXT, slogan TEXT, "companyLogo" TEXT, "companyLogoUrl" TEXT,
  "primaryColor" TEXT, "secondaryColor" TEXT, "accentColor" TEXT,
  "navHomeLabel" TEXT, "navProductsLabel" TEXT, "navAboutLabel" TEXT, "navContactLabel" TEXT, "navDashboardLabel" TEXT,
  "contactEmail" TEXT, "contactPhone" TEXT, "whatsappNumber" TEXT, address TEXT,
  "socialLinks" JSONB, "footerDescription" TEXT, "footerCopyrightText" TEXT,
  "homeHeroBadge" TEXT, "homeAboutTitle" TEXT, "homeAboutDescription" TEXT, "homeAboutImage" TEXT, "homeAboutCta" TEXT,
  "homeCategorySectionTitle" TEXT, "homeCategorySectionSubtitle" TEXT, "homeNicheHeader" TEXT, "homeNicheSubheader" TEXT, "homeTrustHeader" TEXT, "homeTrustSubheader" TEXT, "homeTrustSectionTitle" TEXT,
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
  "departmentsLayout" TEXT DEFAULT 'grid', "subcategoryLayout" TEXT DEFAULT 'wrapped',
  "adminLoginHeroImage" TEXT, "adminLoginTitle" TEXT, "adminLoginSubtitle" TEXT, "adminLoginAccentEnabled" BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT, "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features TEXT[], specifications JSONB, media JSONB, "discountRules" JSONB, reviews JSONB, "createdAt" BIGINT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT, icon TEXT, image TEXT, description TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS subcategories (id TEXT PRIMARY KEY, "categoryId" TEXT, name TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS hero_slides (id TEXT PRIMARY KEY, image TEXT, type TEXT, title TEXT, subtitle TEXT, cta TEXT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS enquiries (id TEXT PRIMARY KEY, name TEXT, email TEXT, whatsapp TEXT, subject TEXT, message TEXT, "createdAt" BIGINT, status TEXT);
CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, name TEXT, email TEXT, role TEXT, permissions TEXT[], "createdAt" BIGINT, "lastActive" BIGINT, "profileImage" TEXT, phone TEXT, address TEXT, "autoWipeExempt" BOOLEAN DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS traffic_logs (id TEXT PRIMARY KEY, type TEXT, text TEXT, time TEXT, timestamp BIGINT, source TEXT);
CREATE TABLE IF NOT EXISTS product_stats ( "productId" TEXT PRIMARY KEY, views INTEGER DEFAULT 0, clicks INTEGER DEFAULT 0, shares INTEGER DEFAULT 0, "totalViewTime" NUMERIC DEFAULT 0, "lastUpdated" BIGINT );
CREATE TABLE IF NOT EXISTS training_modules (id TEXT PRIMARY KEY, title TEXT, platform TEXT, description TEXT, icon TEXT, strategies TEXT[], "actionItems" TEXT[], steps JSONB, "createdAt" BIGINT, "createdBy" TEXT);
CREATE TABLE IF NOT EXISTS product_history (id TEXT PRIMARY KEY, name TEXT, sku TEXT, price NUMERIC, "affiliateLink" TEXT, "categoryId" TEXT, "subCategoryId" TEXT, description TEXT, features TEXT[], specifications JSONB, media JSONB, "discountRules" JSONB, reviews JSONB, "createdAt" BIGINT, "createdBy" TEXT, "archivedAt" BIGINT);

-- REPAIR SCRIPT (Run this if you get 400 errors after updating)
-- ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS "autoWipeExempt" BOOLEAN DEFAULT FALSE;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS "departmentsLayout" TEXT DEFAULT 'grid';
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS "subcategoryLayout" TEXT DEFAULT 'wrapped';
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS "adminLoginHeroImage" TEXT;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS "adminLoginTitle" TEXT;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS "adminLoginSubtitle" TEXT;
-- ALTER TABLE settings ADD COLUMN IF NOT EXISTS "adminLoginAccentEnabled" BOOLEAN DEFAULT TRUE;

-- ENABLE PUBLIC READ
ALTER TABLE settings ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public Read settings" ON settings FOR SELECT USING (true);
ALTER TABLE products ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public Read products" ON products FOR SELECT USING (true);
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public Read hero" ON hero_slides FOR SELECT USING (true);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public Read cat" ON categories FOR SELECT USING (true);
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public Read sub" ON subcategories FOR SELECT USING (true);
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public Read training" ON training_modules FOR SELECT USING (true);
ALTER TABLE product_stats ENABLE ROW LEVEL SECURITY; CREATE POLICY "Public Read stats" ON product_stats FOR SELECT USING (true);

-- ENABLE ALL FOR ANON (DEMO/QUICKSTART)
CREATE POLICY "Enable all for anon" ON settings FOR ALL USING (true);
CREATE POLICY "Enable all for anon products" ON products FOR ALL USING (true);
CREATE POLICY "Enable all for anon enquiries" ON enquiries FOR ALL USING (true);
CREATE POLICY "Enable all for anon logs" ON traffic_logs FOR ALL USING (true);
CREATE POLICY "Enable all for anon admins" ON admin_users FOR ALL USING (true);
CREATE POLICY "Enable all for anon stats" ON product_stats FOR ALL USING (true);
CREATE POLICY "Enable all for anon hero" ON hero_slides FOR ALL USING (true);
CREATE POLICY "Enable all for anon cat" ON categories FOR ALL USING (true);
CREATE POLICY "Enable all for anon sub" ON subcategories FOR ALL USING (true);
CREATE POLICY "Enable all for anon history" ON product_history FOR ALL USING (true);
CREATE POLICY "Enable all for anon training" ON training_modules FOR ALL USING (true);`,
    codeLabel: 'Full System SQL Script v5.1'
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
    name: 'Main Administrator',
    email: 'admin@findara.com',
    role: 'owner',
    permissions: ['*'], // * implies all
    password: 'password123',
    createdAt: Date.now(),
    phone: '',
    address: 'Online HQ',
    profileImage: '',
    autoWipeExempt: true
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
  companyName: "Findara",
  slogan: 'Curating the Exceptional',
  companyLogo: 'F',
  companyLogoUrl: 'https://i.ibb.co/FkCdTns2/bb5w9xpud5l.png',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Journey',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',

  contactEmail: 'contact@findara.com',
  contactPhone: '+27 76 836 0325',
  whatsappNumber: '27768360325',
  address: 'Mokopane, Limpopo, 0601',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'TikTok', url: 'https://tiktok.com/', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' }
  ],
  contactFaqs: [
    {
      question: "Do you ship products directly?",
      answer: "As a curation bridge page, we direct you to verified third-party luxury retailers. Shipping and returns are handled directly by the brand you purchase from."
    },
    {
      question: "How do I book a styling consultation?",
      answer: "Please select 'Styling Consultation' in the inquiry form. Our team will coordinate a virtual or in-person session based on your location."
    },
    {
      question: "Are the luxury items authenticated?",
      answer: "Absolutely. We only affiliate with authorized retailers and brands that guarantee 100% authenticity on every piece listed."
    }
  ],

  productAcquisitionLabel: 'Secure Acquisition',
  productSpecsLabel: 'Technical Specifications',

  footerDescription: "The premier bridge page system marketing various affiliate programs. Your curated gateway to global fashion trends.",
  footerCopyrightText: "All rights reserved.",
  footerNavHeader: 'Navigation',
  footerPolicyHeader: 'Policy',

  // Home Page Content
  homeHeroBadge: 'Curator Exclusive',
  homeAboutTitle: 'The Curator\'s Journey.',
  homeAboutDescription: 'What started as a personal quest for the perfect wardrobe evolved into Findara. I believe that style shouldn\'t be a luxury, but a well-curated choice. My bridge page connects you to the pieces that define my daily style, sourced from partners I trust like Shein and beyond.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Explore My Story',
  homeCategorySectionTitle: 'Curated Departments',
  homeCategorySectionSubtitle: 'The Collection',
  homeNicheHeader: 'Shop by Niche',
  homeNicheSubheader: 'Curated Portals',
  homeTrustHeader: 'Why trust my selections?',
  homeTrustSubheader: 'Curation Integrity',
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
  aboutHeroTitle: 'My Narrative. Your Style.',
  aboutHeroSubtitle: 'Authenticity is the thread that weaves every selection together. Welcome to my curated world.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Findara Curator',
  aboutLocation: 'Cape Town, Online',

  aboutHistoryTitle: 'The Bridge System',
  aboutHistoryBody: 'I’ve always been the person friends asked for style advice. In 2024, I decided to turn that passion into a platform. Findara isn\'t just about affiliate links; it\'s about the story behind every garment. I spend hours scrolling through thousands of items to find the "hidden gems" so you don\'t have to.\n\nThis bridge system allows me to share my unique perspective on global trends while ensuring you get the best value directly from the source. Every click supports my journey in bringing high-fashion aesthetics to the everyday curator.',
  
  aboutMissionTitle: 'Marketing Mission',
  aboutMissionBody: 'To bridge the gap between you and the best global affiliate offers with transparency and taste.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'Join the Community',
  aboutCommunityBody: 'Follow our journey as we discover new trends and deals that define modern luxury.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency',
  aboutIntegrityBody: 'We are upfront about our role as an affiliate marketer. This system is built on trust and curation integrity.',
  aboutIntegrityIcon: 'Shield',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551488852-0801d863dc34?auto=format&fit=crop&q=80&w=800'
  ],

  // Contact Page Content
  contactHeroTitle: 'Connect with Us.',
  contactHeroSubtitle: 'Have questions about a specific find or our curation process? Our concierge desk is here to assist.',
  contactFormNameLabel: 'Name',
  contactFormEmailLabel: 'Email',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Transmit Message',
  
  contactInfoTitle: 'Headquarters',
  contactAddressLabel: 'Location',
  contactHoursLabel: 'Concierge Hours',
  contactHoursWeekdays: 'Monday - Friday: 09:00 - 18:00',
  contactHoursWeekends: 'Weekends: 10:00 - 14:00 (Digital Response)',

  // Legal Content
  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### COMPREHENSIVE AFFILIATE DISCLOSURE STATEMENT

**Last Updated: January 1, 2025**

#### 1. Introduction & Transparency Commitment

Findara (hereinafter referred to as "the Site", "we", "us", or "our") is fully committed to transparency, honesty, and compliance with the Federal Trade Commission (FTC) guidelines regarding the use of endorsements and testimonials in advertising. We believe it is critical for you, our visitor, to understand the relationship between us and the product manufacturers or service providers referenced on this Site.

This Disclosure Statement is intended to inform you that we participate in various affiliate marketing programs. These programs are designed to provide a means for sites to earn advertising fees by advertising and linking to third-party merchant websites.

#### 2. The Nature of Affiliate Marketing (Bridge Page Notice)

**IMPORTANT:** Findara functions exclusively as a **Bridge Page** or "curation portfolio." 

*   **We Are Not a Retailer:** We do not manufacture, stock, warehouse, package, or ship any products.
*   **No Transactional Relationship:** We do not process payments, handle credit card information, or manage order fulfillment.
*   **The "Click-Through" Process:** When you click on a link labeled "Shop", "Buy", "View Price", "Acquire", or similar call-to-action buttons on this Site, you will be automatically redirected to a third-party merchant's website (e.g., Shein, Amazon, Nordstorm, Revolve, etc.).
*   **The Purchase:** Any purchase you make is a direct transaction between you and that third-party merchant.

#### 3. Compensation & Commission Structure

When you click on our affiliate links and make a qualifying purchase, we may receive a commission or referral fee. This commission is paid to us by the merchant, **at no extra cost to you**.

*   **Price Parity:** The price you pay for the product is the same whether you use our affiliate link or navigate to the merchant's site directly. Our commission is deducted from the merchant's profit margin, not added to your purchase price.
*   **Cookie Duration:** Affiliate programs use "cookies" to track your visit. If you click a link and purchase within a specific timeframe (often 24 to 30 days), we may still receive credit for the sale.

#### 4. Affiliate Program Participation

Findara is a participant in several affiliate advertising programs, including but not limited to:

*   **SHEIN Affiliate Program:** We curate and link to fashion items sold on Shein.com.
*   **Amazon Services LLC Associates Program:** An affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases.
*   **Other Networks:** We may also participate in networks such as RewardStyle (LTK), CJ Affiliate, ShareASale, Awin, and others.

#### 5. Product Curation & Editorial Independence

While we receive compensation for our posts or advertisements, we always give our honest opinions, findings, beliefs, or experiences on those topics or products. The views and opinions expressed on this blog are purely the bloggers' own.

*   **Selection Process:** We curate products based on aesthetic value, trend analysis, consumer reviews, and personal taste.
*   **No Pay-to-Play:** We do not accept direct payments from brands to list "bad" products as "good." If a product is featured here, it is because we genuinely believe it offers value to our audience.
*   **Sponsored Content:** If a specific post is "Sponsored" (meaning a brand paid us a flat fee to write about them, separate from affiliate commissions), this will be clearly marked at the top of that specific page or post.

#### 6. Limitation of Liability regarding Third-Party Products

Because we do not manufacture or sell the products:

*   **No Warranty:** We make no claims, warranties, or representations regarding the quality, safety, fit, or legality of the products listed.
*   **Customer Support:** All questions regarding shipping, returns, refunds, sizing, or damaged goods must be directed to the merchant where you completed the purchase (e.g., Shein Customer Support). We have no access to your order history or payment details.

#### 7. Contact Information

If you have any questions regarding this disclosure or our affiliate relationships, please contact us at:

**Compliance Dept.**
Email: contact@findara.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,
  
  privacyTitle: 'Privacy Policy',
  privacyContent: `### COMPREHENSIVE PRIVACY POLICY

**Last Updated: January 1, 2025**

#### 1. Introduction

Findara ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.

This policy applies to the **Bridge Page System** and curation portfolio operated by the Site.

#### 2. The Data We Collect About You

Personal data, or personal information, means any information about an individual from which that person can be identified. It does not include data where the identity has been removed (anonymous data).

We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together follows:

*   **Identity Data:** includes first name, last name, username or similar identifier.
*   **Contact Data:** includes email address and telephone number (only if voluntarily provided via our Contact Form or Newsletter signup).
*   **Technical Data:** includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.
*   **Usage Data:** includes information about how you use our website, products, and services (e.g., which affiliate links you click).
*   **Marketing and Communications Data:** includes your preferences in receiving marketing from us and your communication preferences.

**We do NOT collect:**
*   **Financial Data:** We do **not** collect or store payment card details. All transactions are processed by third-party merchants (e.g., Shein, Amazon).
*   **Sensitive Data:** We do not collect details about your race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions, trade union membership, information about your health, and genetic and biometric data.

#### 3. How Is Your Personal Data Collected?

We use different methods to collect data from and about you including through:

*   **Direct Interactions:** You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email, or otherwise. This includes personal data you provide when you:
    *   Subscribe to our service or publications;
    *   Request marketing to be sent to you;
    *   Enter a competition, promotion, or survey; or
    *   Give us feedback or contact us.
*   **Automated Technologies or Interactions:** As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this personal data by using cookies, server logs, and other similar technologies. We may also receive Technical Data about you if you visit other websites employing our cookies.
*   **Third Parties:** We may receive personal data about you from various third parties such as:
    *   Analytics providers (such as Google Analytics).
    *   Advertising networks (such as Meta/Facebook Pixel, Pinterest Tag, TikTok Pixel).

#### 4. How We Use Your Personal Data

We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:

*   **Affiliate Tracking:** To ensure that our affiliate partners (e.g., Shein) can correctly attribute sales to our referrals.
*   **Communication:** To respond to your inquiries sent via our contact forms.
*   **Improvement:** To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences.
*   **Marketing:** To send you newsletters or promotional materials (only if you have explicitly opted-in).

#### 5. Cookies and Tracking Technologies

Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.

*   **Affiliate Cookies:** When you click a "Shop" link, a tracking cookie is placed on your device by the affiliate network (not by us directly). This cookie typically lasts 30-90 days and allows the merchant to know you came from this site.
*   **Analytics Cookies:** We use Google Analytics to measure traffic and usage trends.
*   **Marketing Cookies:** We use pixels from Facebook, TikTok, and Pinterest to re-target visitors with relevant ads on those platforms.

You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly, and affiliate tracking may fail.

#### 6. Disclosure of Your Personal Data

We may share your personal data with the parties set out below:

*   **Service Providers:** Companies that provide IT and system administration services (e.g., Supabase for database hosting, Vercel for web hosting).
*   **Professional Advisers:** Lawyers, bankers, auditors, and insurers.
*   **Regulators:** Reporting processing activities to relevant authorities if required by law.
*   **Third Parties:** We may perform a business transfer (merger or acquisition) where data is an asset.

We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.

#### 7. Data Security

We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.

#### 8. Data Retention

We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting, or reporting requirements.

#### 9. Your Legal Rights (GDPR & CCPA)

Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:

*   **Request access** to your personal data.
*   **Request correction** of your personal data.
*   **Request erasure** of your personal data.
*   **Object to processing** of your personal data.
*   **Request restriction of processing** your personal data.
*   **Request transfer** of your personal data.
*   **Right to withdraw consent.**

If you wish to exercise any of the rights set out above, please contact us at contact@findara.com.

#### 10. Third-Party Links

This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.

#### 11. Contact Us

If you have any questions about this Privacy Policy, please contact us at:

Email: contact@findara.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,

  termsTitle: 'Terms of Service',
  termsContent: `### TERMS OF SERVICE & USER AGREEMENT

**Last Updated: January 1, 2025**

#### 1. Acceptance of Terms

By accessing and using the website Findara (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Site's particular services, you shall be subject to any posted guidelines or rules applicable to such services. All such guidelines or rules are hereby incorporated by reference into the Terms of Service.

#### 2. Description of Service (The "Bridge Page" Model)

The Site operates as a content curation and affiliate marketing bridge page.

*   **NOT A RETAILER:** You acknowledge that this Site is **not** an online store, retailer, or manufacturer. We do not sell products directly.
*   **CURATION ONLY:** Our service is limited to the aggregation, display, review, and linking of products sold by third-party vendors.
*   **NO CONTRACT OF SALE:** No contract of sale is formed between you and the Site when you click a link. The contract of sale is formed solely between you and the third-party merchant (e.g., Shein) upon checkout on their respective platform.

#### 3. Intellectual Property Rights

*   **Our Content:** The design, layout, graphics, text, logo, and code of this Site are the intellectual property of the Site and are protected by copyright and trademark laws.
*   **Merchant Content:** Product images, prices, and descriptions displayed on this Site are the property of their respective owners (the merchants) and are used here under license or fair use principles for the purpose of affiliate promotion. You may not copy, reproduce, or distribute this content without express permission from the rights holder.

#### 4. User Conduct

You agree not to use the Site for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Site in any way that could damage the Site, the services, or the general business of the Site.

You further agree not to:
*   Harass, abuse, or threaten others or otherwise violate any person's legal rights.
*   Violate any intellectual property rights of the Site or any third party.
*   Upload or otherwise disseminate any computer viruses or other software that may damage the property of another.
*   Perpetrate any fraud.
*   Engage in or create any unlawful gambling, sweepstakes, or pyramid scheme.
*   Publish or distribute any obscene or defamatory material.

#### 5. Third-Party Links and Services

The Site may contain links to other websites ("Linked Sites"). The Linked Sites are not under the control of the Site and we are not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. The Site is providing these links to you only as a convenience, and the inclusion of any link does not imply endorsement by the Site of the site or any association with its operators.

**You acknowledge and agree that your use of third-party websites is at your own risk and subject to the terms and conditions of use for such sites.**

#### 6. Disclaimer of Warranties

THE SITE AND ITS CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

THE SITE DOES NOT WARRANT THAT:
(A) THE SITE WILL FUNCTION UNINTERRUPTED, SECURE, OR AVAILABLE AT ANY PARTICULAR TIME OR LOCATION;
(B) ANY ERRORS OR DEFECTS WILL BE CORRECTED;
(C) THE SITE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS; OR
(D) THE RESULTS OF USING THE SITE WILL MEET YOUR REQUIREMENTS.

#### 7. Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE SITE, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THIS SITE.

SPECIFICALLY, WE ARE NOT LIABLE FOR:
*   **PRODUCT DEFECTS:** Any issues with products purchased from third-party merchants (sizing, quality, damage).
*   **SHIPPING ISSUES:** Delays, lost packages, or customs fees associated with third-party orders.
*   **FINANCIAL LOSS:** Any financial loss incurred from transactions on third-party sites.

#### 8. Indemnification

You agree to defend, indemnify and hold harmless the Site and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (include but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.

#### 9. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

#### 10. Governing Law

These Terms shall be governed and construed in accordance with the laws of South Africa (or the primary jurisdiction of the Site owner), without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

#### 11. Contact Us

If you have any questions about these Terms, please contact us at:

Email: contact@findara.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,

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
  
  // Layout Controls
  departmentsLayout: 'grid',
  subcategoryLayout: 'wrapped',

  // Admin Login Configuration
  adminLoginHeroImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000',
  adminLoginTitle: 'Concierge Access',
  adminLoginSubtitle: 'Authenticate to enter the bridge dashboard.',
  adminLoginAccentEnabled: true
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Modern Curation',
    subtitle: 'Connecting you to the most influential global trends.',
    cta: 'View Collection'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'High Tech Luxury',
    subtitle: 'Smart solutions for a seamless lifestyle.',
    cta: 'Explore Devices'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Elite Vault',
    subtitle: 'Exclusive handbags and jewelry for the discerning few.',
    cta: 'Shop Accessories'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Accessories', icon: 'Handbag', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800&h=800', description: 'Curated bags and fine jewelry pieces.' },
  { id: 'cat2', name: 'Footwear', icon: 'Heel', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800&h=800', description: 'Step into high-street fashion.' },
  { id: 'cat3', name: 'Smart Life', icon: 'Watch', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800&h=800', description: 'Wearable tech and personal innovation.' },
  { id: 'cat4', name: 'Home Living', icon: 'Package', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800&h=800', description: 'Modern aesthetics for your living space.' }
];

export const INITIAL_SUBCATEGORIES: SubCategory[] = [
  { id: 'sub1', categoryId: 'cat1', name: 'Handbags' },
  { id: 'sub2', categoryId: 'cat1', name: 'Jewelry' },
  { id: 'sub3', categoryId: 'cat2', name: 'Luxury Heels' },
  { id: 'sub4', categoryId: 'cat3', name: 'Smartwatches' },
  { id: 'sub5', categoryId: 'cat4', name: 'Kitchen Tech' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Quilted Leather Crossbody',
    sku: 'F-BAG-001',
    price: 12500,
    affiliateLink: 'https://example.com/handbag',
    categoryId: 'cat1',
    subCategoryId: 'sub1',
    description: 'A timeless quilted masterpiece featuring hand-stitched leather and gold-tone hardware. A staple for any luxury collection.',
    features: ['Premium Calf Leather', 'Gold-plated hardware', 'Versatile chain strap'],
    specifications: { 'Material': 'Calf Leather', 'Style': 'Crossbody' },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800', name: 'Handbag', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  },
  {
    id: 'p2',
    name: 'Midnight Stiletto Pumps',
    sku: 'F-SHOE-002',
    price: 4200,
    affiliateLink: 'https://example.com/shoes',
    categoryId: 'cat2',
    subCategoryId: 'sub3',
    description: 'Sleek midnight black stilettos designed for ultimate poise and confidence.',
    features: ['4-inch heel', 'Suede finish', 'Ergonomic sole'],
    specifications: { 'Heel Height': '10cm', 'Material': 'Suede' },
    media: [{ id: 'm2', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800', name: 'Shoes', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  },
  {
    id: 'p3',
    name: 'Horizon Smartwatch Pro',
    sku: 'F-TECH-003',
    price: 8999,
    affiliateLink: 'https://example.com/watch',
    categoryId: 'cat3',
    subCategoryId: 'sub4',
    description: 'The intersection of technology and design. Stay connected without compromising on aesthetic.',
    features: ['OLED Display', 'Health Monitoring', '7-day Battery'],
    specifications: { 'Case': 'Titanium', 'Water Resistance': '50m' },
    media: [{ id: 'm3', url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800', name: 'Smartwatch', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  },
  {
    id: 'p4',
    name: 'Ascendance Diamond Pendant',
    sku: 'F-JEWL-004',
    price: 15000,
    affiliateLink: 'https://example.com/jewelry',
    categoryId: 'cat1',
    subCategoryId: 'sub2',
    description: 'A brilliant-cut diamond set in 18k white gold. Simply breathtaking.',
    features: ['18k White Gold', 'Conflict-free diamond', 'Certificate included'],
    specifications: { 'Carat': '0.5', 'Clarity': 'VVS1' },
    media: [{ id: 'm4', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800', name: 'Jewelry', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  },
  {
    id: 'p5',
    name: 'Smeg Retro Kettle - Cream',
    sku: 'F-HOME-005',
    price: 3499,
    affiliateLink: 'https://example.com/kettle',
    categoryId: 'cat4',
    subCategoryId: 'sub5',
    description: 'The iconic Smeg 50s style retro kettle. A perfect blend of technology and classic design.',
    features: ['Retro Aesthetic', 'Stainless steel body', 'Auto shut-off'],
    specifications: { 'Capacity': '1.7L', 'Style': '50s Retro' },
    media: [{ id: 'm5', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', name: 'Smeg Kettle', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now()
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'tm1',
    title: 'Instagram Aesthetic Curation',
    platform: 'Instagram',
    description: 'Master the art of visual storytelling on Instagram to drive high-intent traffic to your bridge page.',
    strategies: [
      'Use high-contrast editorial photography.',
      'Maintain a consistent color palette aligned with your brand.',
      'Utilize Instagram Stories for "New Drop" alerts with direct links.'
    ],
    actionItems: [
      'Create 5 "Outfit of the Day" reels.',
      'Set up your bridge page URL in bio.',
      'Engage with 20 niche-related accounts daily.'
    ],
    icon: 'Instagram',
    steps: []
  },
  {
    id: 'tm2',
    title: 'Pinterest Viral Pins Strategy',
    platform: 'Pinterest',
    description: 'Pinterest is a search engine. Learn how to create evergreen traffic using aesthetic product pins.',
    strategies: [
      'Create vertical pins (2:3 ratio) for maximum visibility.',
      'Use keywords in pin titles and descriptions (SEO).',
      'Organize pins into niche-specific boards.'
    ],
    actionItems: [
      'Design 10 high-quality pins using the Ad Generator.',
      'Schedule pins during peak engagement hours.',
      'Join 3 group boards in the fashion niche.'
    ],
    icon: 'Pin',
    steps: []
  }
];
