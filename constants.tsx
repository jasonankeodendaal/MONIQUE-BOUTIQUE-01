
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
  // ... (keeping all training modules exactly as they are)
  {
    id: 'shein-mastery',
    title: '1. Shein Affiliate Blueprint',
    platform: 'General',
    description: 'The definitive guide to launching your affiliate career with Shein. Learn the exact technical workflow to extract high-converting product data.',
    icon: 'ShoppingBag',
    strategies: [
      'The Portal Protocol: Register at shein.com/affiliate-program. If denied, apply through Awin or CJ Affiliate.',
      'Deep-Link Engineering: Never link to the home page. Use "Custom Link" tools to point directly to specific products.',
      'Media Harvesting: Use "Image Asset" tabs to get studio shots, but prioritize "User Reviews" for authentic visuals.'
    ],
    actionItems: [
      'Apply to the Shein Publisher Portal.',
      'Generate 10 Deep Links for "New In" bestsellers.',
      'Download 5 user-generated photos for your first campaign.'
    ]
  },
  {
    id: 'founder-brand',
    title: '2. The Founder Brand',
    platform: 'General',
    description: 'Transform from a link-sharer to a tastemaker. People buy from people, not faceless pages.',
    icon: 'User',
    strategies: [
      'The Origin Story: Define your specific fashion struggle (e.g., "Luxury on a Budget").',
      'Visual Semiotics: Choose a signature color palette and recurring visual element (e.g., a specific mirror).',
      'Radical Transparency: Disclose your affiliate status proudly to build trust.'
    ],
    actionItems: [
      'Write your 500-word "Manifesto" for the About page.',
      'Record a 60-second "Meet the Curator" video.',
      'Audit your last 10 posts for consistent color grading.'
    ]
  },
  {
    id: 'bridge-psychology',
    title: '3. Bridge Page Psychology',
    platform: 'General',
    description: 'Why bridge pages convert 3x higher than direct links. Understanding the "Pre-Frame".',
    icon: 'Brain',
    strategies: [
      'The Trust Bridge: Cold traffic needs warming up. Your page acts as the endorsement.',
      'Curated Scarcity: Don\'t list everything. List the "Best 5".',
      'Speed to Value: Ensure the "Shop" button is above the fold on mobile.'
    ],
    actionItems: [
      'Review your product descriptions: Do they sound personal?',
      'Test your site load speed on mobile.',
      'Ensure every product has a "Why I Love It" bullet point.'
    ]
  },
  {
    id: 'ig-reels',
    title: '4. Reels Viral Formula',
    platform: 'Instagram',
    description: 'The fastest way to reach new audiences. Short, snappy, and trend-driven.',
    icon: 'Video',
    strategies: [
      'The Hook: The first 1.5 seconds must stop the scroll (movement or text overlay).',
      'Trending Audio: Use audio with < 5k uses but an upward arrow.',
      'The Loop: Design the video to loop seamlessly for higher watch time.'
    ],
    actionItems: [
      'Post a 7-second Reel showing 3 outfits rapidly.',
      'Use the text overlay: "You won\'t believe where I got this..."',
      'Reply to every comment in the first hour.'
    ]
  },
  {
    id: 'ig-stories',
    title: '5. Stories for Sales',
    platform: 'Instagram',
    description: 'Where the actual selling happens. Connecting with your warm audience.',
    icon: 'Smartphone',
    strategies: [
      'The Link Sticker Sandwich: Value -> Link -> Value.',
      'Polls & Engagement: "This or That" polls to prime the algorithm.',
      'Close Friends: Create a VIP list for "Early Drops".'
    ],
    actionItems: [
      'Post a "This or That" poll with two products from your bridge page.',
      'Follow up with a Link Sticker to the winner.',
      'Show your face talking about the fabric quality.'
    ]
  },
  {
    id: 'ig-bio',
    title: '6. Bio Optimization',
    platform: 'Instagram',
    description: 'Your digital business card. Converting profile visits to clicks.',
    icon: 'Fingerprint',
    strategies: [
      'The One Link: Don\'t use Linktree if you can help it. Direct to your Bridge Page.',
      'The "Help" Statement: "Helping [Target Audience] find [Result]."',
      'Highlights: Keep "New In", "Reviews", and "About" highlights fresh.'
    ],
    actionItems: [
      'Rewrite your bio to focus on the follower\'s benefit.',
      'Create a "Start Here" highlight.',
      'Add a call-to-action arrow emoji pointing to your link.'
    ]
  },
  {
    id: 'ig-dm-automation',
    title: '7. DM Automation (ManyChat)',
    platform: 'Instagram',
    description: 'Scale your responses without typing all day. "Comment LINK for the outfit details".',
    icon: 'MessageCircle',
    strategies: [
      'Keyword Triggers: Set up automation for keywords like "DRESS" or "BOOTS".',
      'The Double Opt-In: Ask them to confirm they want the link to boost engagement.',
      'Safe Delays: Add random delays to avoid spam detection.'
    ],
    actionItems: [
      'Set up a basic "Comment to DM" automation.',
      'Post a Reel with the CTA: "Comment LINK for details".',
      'Monitor the first 10 automated DMs for errors.'
    ]
  },
  {
    id: 'tiktok-duet',
    title: '8. The "Duet" Strategy',
    platform: 'TikTok',
    description: 'Leveraging other people\'s viral content to build your authority.',
    icon: 'Users',
    strategies: [
      'React & Review: Duet a fashion fail or a viral haul with your expert take.',
      'The "Cheaper Option": Duet a luxury item showing your affordable dupe.',
      'Blind Reacts: Genuine reactions to new drops.'
    ],
    actionItems: [
      'Find 3 viral fashion videos from yesterday.',
      'Duet one showing a similar item from your bridge page.',
      'Use the hashtag #duet and tag the original creator.'
    ]
  },
  {
    id: 'tiktok-seo',
    title: '9. SEO on TikTok',
    platform: 'TikTok',
    description: 'TikTok is a search engine. optimizing your content to be found.',
    icon: 'Search',
    strategies: [
      'Keyword Overlays: Put text on screen that disappears (e.g., "Summer Wedding Guest Dress").',
      'Caption Keywords: Write descriptive sentences, not just hashtags.',
      'Speech Search: Say the keywords out loud in the video.'
    ],
    actionItems: [
      'Search your niche on TikTok and note the bolded search suggestions.',
      'Create a video specifically answering a "How to style..." search query.',
      'Rename your raw video file with keywords before uploading.'
    ]
  },
  {
    id: 'tiktok-trends',
    title: '10. Trend Hacking',
    platform: 'TikTok',
    description: 'Riding the wave of "cores" (e.g., Cottagecore, Mob Wife Aesthetic).',
    icon: 'TrendingUp',
    strategies: [
      'Identify the Core: Watch the "For You" page for recurring aesthetics.',
      'Curate a Collection: Create a specific category on your bridge page for the trend.',
      'The "Get the Look": Break down a trending outfit piece by piece.'
    ],
    actionItems: [
      'Identify the current top fashion trend on TikTok.',
      'Create a "Trend Edit" section on your bridge page.',
      'Post a video: "How to get the [Trend] look on a budget."'
    ]
  },
  {
    id: 'pin-idea',
    title: '11. Idea Pins for Reach',
    platform: 'Pinterest',
    description: 'Pinterest\'s version of Stories. High organic reach for inspiration.',
    icon: 'Image',
    strategies: [
      'Step-by-Step Styling: 5 slides showing how to accessorize a dress.',
      'Video Covers: Use a video for the first slide to grab attention.',
      'No Links (Yet): Use Idea Pins to grow followers, standard pins to drive traffic.'
    ],
    actionItems: [
      'Create one Idea Pin with 5 outfit variations.',
      'Tag the products (if available in your region) or mention the link in bio.',
      'Add text overlay on every slide.'
    ]
  },
  {
    id: 'pin-seo',
    title: '12. Pinterest SEO & Rich Pins',
    platform: 'Pinterest',
    description: 'Pinterest is a visual search engine, not social media.',
    icon: 'SearchCode',
    strategies: [
      'Keyword Titles: "Black Silk Dress" is better than "Cute Outfit".',
      'Board SEO: Name your boards with search terms (e.g., "Summer 2025 Fashion").',
      'Fresh Pins: Don\'t just repin; upload new images regularly.'
    ],
    actionItems: [
      'Rename your boards to be search-friendly.',
      'Write 100-word descriptions for your top 5 pins using keywords.',
      'Apply for Rich Pins to show real-time pricing.'
    ]
  },
  {
    id: 'pin-aesthetic',
    title: '13. Board Aesthetics',
    platform: 'Pinterest',
    description: 'Curating a lifestyle, not just a catalog.',
    icon: 'Layout',
    strategies: [
      'The 80/20 Rule: 80% lifestyle/inspiration, 20% your products.',
      'Cover Images: Design uniform covers for your boards.',
      'Color Coding: Organize boards by color palette for visual appeal.'
    ],
    actionItems: [
      'Create a "Mood Board" for the current season.',
      'Pin 20 non-product aesthetic images (coffee, architecture) that match your brand.',
      'Set a cohesive cover image for your main board.'
    ]
  },
  {
    id: 'yt-shorts',
    title: '14. Fashion Haul Shorts',
    platform: 'YouTube',
    description: 'Repurpose your Reels/TikToks to tap into YouTube\'s massive search traffic.',
    icon: 'Video',
    strategies: [
      'Vertical Value: Ensure content is strictly 9:16 aspect ratio.',
      'Pinned Comment: Put your bridge page link in the pinned comment, not just description.',
      'Sound Library: Use YouTube\'s audio library to avoid copyright strikes.'
    ],
    actionItems: [
      'Upload your top 3 performing TikToks as YouTube Shorts.',
      'Add the direct link to the product in the Pinned Comment.',
      'Use #Shorts in the title.'
    ]
  },
  {
    id: 'yt-reviews',
    title: '15. Long-Form Deep Dives',
    platform: 'YouTube',
    description: 'High-intent traffic. People watching 10-minute reviews are ready to buy.',
    icon: 'Monitor',
    strategies: [
      'Honest Reviews: "The Truth About Shein Sizing".',
      'Try-On Hauls: Show how the fabric moves and fits on a real body.',
      'The "Capsule Wardrobe": How to style 5 items in 20 ways.'
    ],
    actionItems: [
      'Film a 5-minute "Honest Review" of your favorite item.',
      'Include your measurements in the description for reference.',
      'Time-stamp the video for each outfit.'
    ]
  },
  {
    id: 'fb-groups',
    title: '16. Niche Groups',
    platform: 'Facebook',
    description: 'Building a dedicated community around a specific interest.',
    icon: 'Users',
    strategies: [
      'The "Help" Approach: Join groups like "Wedding Guest Outfits" and answer questions with your links.',
      'Start Your Own: "Affordable Luxury Fashion Finds [Country]".',
      'Live Unboxings: Go live in your group when a package arrives.'
    ],
    actionItems: [
      'Join 5 fashion-related Facebook groups.',
      'Comment on 3 posts helping someone find an item (link to your bridge page).',
      'Create a private group for your "VIP" followers.'
    ]
  },
  {
    id: 'fb-marketplace',
    title: '17. Marketplace Arbitrage',
    platform: 'Facebook',
    description: 'Driving local traffic to your digital storefront.',
    icon: 'Store',
    strategies: [
      'Free Listings: List items as "Order Only" or "Link in Description".',
      'Local SEO: Target specific affluent areas in your city.',
      'The "Lookalike": "Love this designer bag? Here is the dupe."'
    ],
    actionItems: [
      'Create a listing for a popular item.',
      'Set the location to a major city center.',
      'In the description, direct them to your website for the purchase link.'
    ]
  },
  {
    id: 'wa-broadcast',
    title: '18. Broadcast Lists',
    platform: 'WhatsApp',
    description: 'The highest open rate channel. Direct access to your top customers.',
    icon: 'MessageCircle',
    strategies: [
      'The "Save My Number" Rule: They must save your number to receive broadcasts.',
      'VIP Drops: Send links to new collections 1 hour before posting on social.',
      'Personal Stylist: Offer 1-on-1 advice via chat.'
    ],
    actionItems: [
      'Add a "Join VIP List" button to your Contact page.',
      'Send a "Happy Friday" broadcast with your top pick of the week.',
      'Ask a question to provoke replies (e.g., "Gold or Silver?").'
    ]
  },
  {
    id: 'wa-status',
    title: '19. Status Updates (FOMO)',
    platform: 'WhatsApp',
    description: '24-hour ephemeral content for your contacts.',
    icon: 'Clock',
    strategies: [
      'Behind the Scenes: Show the packaging or you working on the site.',
      'Limited Time Deals: "Flash sale ends in 3 hours".',
      'Social Proof: Screenshot happy messages from clients.'
    ],
    actionItems: [
      'Post 3 photos to your Status: Outfit, Coffee, Link.',
      'Check who viewed it and personally message your warm leads.',
      'Use the "Type" status to post a text-only announcement.'
    ]
  },
  {
    id: 'linkedin-workwear',
    title: '20. The "Workwear" Angle',
    platform: 'LinkedIn',
    description: 'High-ticket affiliate marketing for the corporate world.',
    icon: 'Briefcase',
    strategies: [
      'Corporate Fashion: "How to look professional on a budget".',
      'Personal Branding: Positioning fashion as a tool for career confidence.',
      'Article Writing: Write newsletters about office style trends.'
    ],
    actionItems: [
      'Create a "Workwear Edit" category on your bridge page.',
      'Post a photo of a blazer with a caption about "Dressing for the job you want".',
      'Connect with 10 HR professionals or recruiters.'
    ]
  },
  {
    id: 'threads-fashion',
    title: '21. Fashion Threads',
    platform: 'Threads',
    description: 'Micro-blogging for fashion education and rapid-fire links.',
    icon: 'AlignLeft',
    strategies: [
      'The "Thread" Format: "10 Dresses under R500 for Summer (A Thread) 🧵".',
      'Visual Heavy: Post the photo first, link in the reply.',
      'Polls: Ask opinions on celebrity red carpet looks.'
    ],
    actionItems: [
      'Write a thread breaking down a celebrity outfit with dupe links.',
      'Reply to a trending fashion topic.',
      'Cross-post your Thread to your Instagram Story.'
    ]
  },
  {
    id: 'twitter-hot-takes',
    title: '22. Hot Takes & Commentary',
    platform: 'Twitter',
    description: 'Building authority through opinion and trend forecasting.',
    icon: 'MessageSquare',
    strategies: [
      'Trend Spotting: "Skinny jeans are out. Here is what to wear instead."',
      'Tagging Brands: Engage with the official brand accounts.',
      'Retweet with Comment: Add value to viral fashion tweets.'
    ],
    actionItems: [
      'Tweet a controversial (but harmless) fashion opinion.',
      'Search for "Need an outfit" and reply with your bridge page link.',
      'Follow 5 major fashion journalists.'
    ]
  },
  {
    id: 'email-welcome',
    title: '23. The Welcome Sequence',
    platform: 'Email',
    description: 'Automating the relationship building process.',
    icon: 'Mail',
    strategies: [
      'Email 1: The Delivery (The freebie/discount code).',
      'Email 2: The Story (Who you are and why you curate).',
      'Email 3: The Best Sellers (Direct links to top products).'
    ],
    actionItems: [
      'Set up a Mailchimp or ConvertKit free account.',
      'Create a landing page to capture emails (or use your Contact form).',
      'Write the "Welcome" email.'
    ]
  },
  {
    id: 'email-weekly',
    title: '24. The Weekly Curated Edit',
    platform: 'Email',
    description: 'Consistent value to keep your list warm.',
    icon: 'Calendar',
    strategies: [
      'The "Sunday Edit": Send a recap of the week\'s best finds.',
      'Thematic Newsletters: "Wedding Season Special" or "Cozy Knits".',
      'Exclusive Access: Give subscribers first dibs on limited stock.'
    ],
    actionItems: [
      'Plan your next 4 newsletter themes.',
      'Include at least 3 direct product links in every email.',
      'Ask subscribers to hit "Reply" to boost deliverability.'
    ]
  },
  {
    id: 'email-cart',
    title: '25. Abandoned Cart (Psychology)',
    platform: 'Email',
    description: 'Although you don\'t own the cart, you can simulate recovery.',
    icon: 'ShoppingCart',
    strategies: [
      'The "Did you see this?" Email: Re-send the link to a popular item.',
      'Scarcity: "Low stock alert on the Silk Dress".',
      'Social Proof: "See how others styled this".'
    ],
    actionItems: [
      'Segment your list by clicks (who clicked but didn\'t buy?).',
      'Send a follow-up email 24 hours after a major link drop.',
      'Include a user review in the follow-up.'
    ]
  },
  {
    id: 'seo-keywords',
    title: '26. Keyword Research',
    platform: 'SEO',
    description: 'Finding what people are actually typing into Google.',
    icon: 'Search',
    strategies: [
      'Long-Tail Keywords: "Black maxi dress for wedding guest south africa".',
      'Question Keywords: "How to style oversized blazer".',
      'Tools: Use Google Trends or AnswerThePublic.'
    ],
    actionItems: [
      'List 10 questions your target audience asks.',
      'Incorporate these phrases into your Product descriptions.',
      'Rename your product images with these keywords.'
    ]
  },
  {
    id: 'seo-articles',
    title: '27. "Best X for Y" Articles',
    platform: 'SEO',
    description: 'The highest converting content format on the web.',
    icon: 'FileText',
    strategies: [
      'Listicles: "10 Best Winter Coats under R1000".',
      'Comparison: "Silk vs Satin: Which is better?".',
      'Seasonal Guides: "The Ultimate Festival Packing List".'
    ],
    actionItems: [
      'Write one blog post/article for your About or Home page.',
      'Ensure it has at least 5 outbound links to products.',
      'Use H1 and H2 headers for readability.'
    ]
  },
  {
    id: 'snap-spotlight',
    title: '28. Quick Snaps & Spotlight',
    platform: 'Snapchat',
    description: 'Reaching Gen Z with raw, unfiltered content.',
    icon: 'Ghost',
    strategies: [
      'Spotlight: Repurpose vertical video content here.',
      'No Filter Fashion: Show the clothes in bad lighting to prove quality.',
      'Direct Links: Snapchat allows links in snaps.'
    ],
    actionItems: [
      'Post a "Get Ready With Me" on Snap.',
      'Attach your bridge page URL to the snap.',
      'Submit your best video to Spotlight.'
    ]
  },
  {
    id: 'repurposing',
    title: '29. Cross-Platform Repurposing',
    platform: 'General',
    description: 'Work smarter, not harder. One piece of content, five platforms.',
    icon: 'RefreshCcw',
    strategies: [
      'Watermark Removal: Remove TikTok logo before posting to Reels.',
      'Text Tweaks: Change the caption to suit the platform vibe.',
      'Timing: Stagger posts so followers don\'t see the same thing everywhere at once.'
    ],
    actionItems: [
      'Take one TikTok video.',
      'Post it to Reels, YouTube Shorts, and Pinterest Idea Pins.',
      'Embed it on your Bridge Page product description.'
    ]
  },
  {
    id: 'seasonal-campaigns',
    title: '30. Seasonal Campaigns',
    platform: 'General',
    description: 'Planning ahead for major retail moments.',
    icon: 'Calendar',
    strategies: [
      'Black Friday Prep: Build your list in October.',
      'Christmas Gift Guides: "Gifts for Him", "Gifts for Her".',
      'Payday Spikes: Post heavily on the 25th of the month.'
    ],
    actionItems: [
      'Create a "Gift Guide" category on your site.',
      'Schedule posts for the next Payday.',
      'Design a themed banner for your Home page.'
    ]
  },
  {
    id: 'micro-influencing',
    title: '31. Influencer Collabs',
    platform: 'General',
    description: 'Collaborating with others to grow your bridge page.',
    icon: 'Users',
    strategies: [
      'S4S (Shoutout for Shoutout): Trade stories with a peer.',
      'Guest Curation: "Guest Picks by [Name]" section.',
      'Affiliate Recruiting: Teach others to sell your products (advanced).'
    ],
    actionItems: [
      'DM 3 accounts with similar size to yours.',
      'Propose a "Style Swap" challenge.',
      'Feature another creator on your page.'
    ]
  },
  {
    id: 'data-analysis',
    title: '32. Reading the Data',
    platform: 'General',
    description: 'Using your Admin Dashboard to make decisions.',
    icon: 'BarChart',
    strategies: [
      'Click-Through Rate (CTR): If views are high but clicks low, change the button text.',
      'Bounce Rate: If high, check page speed or mobile layout.',
      'Top Performers: Double down on what works.'
    ],
    actionItems: [
      'Check your "Insights" tab in the Admin panel.',
      'Identify your lowest performing product and delete it.',
      'Find your top product and make a new video about it.'
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
  companyName: "Monique's Curated Style",
  slogan: 'Your Bridge to Global Trends',
  companyLogo: 'MC',
  companyLogoUrl: 'https://i.ibb.co/FkCdTns2/bb5w9xpud5l.png',
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
  homeHeroBadge: 'Exclusive Curation',
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
  disclosureContent: `### COMPREHENSIVE AFFILIATE DISCLOSURE STATEMENT

**Last Updated: January 1, 2025**

#### 1. Introduction & Transparency Commitment

Monique's Curated Style (hereinafter referred to as "the Site", "we", "us", or "our") is fully committed to transparency, honesty, and compliance with the Federal Trade Commission (FTC) guidelines regarding the use of endorsements and testimonials in advertising. We believe it is critical for you, our visitor, to understand the relationship between us and the product manufacturers or service providers referenced on this Site.

This Disclosure Statement is intended to inform you that we participate in various affiliate marketing programs. These programs are designed to provide a means for sites to earn advertising fees by advertising and linking to third-party merchant websites.

#### 2. The Nature of Affiliate Marketing (Bridge Page Notice)

**IMPORTANT:** Monique's Curated Style functions exclusively as a **Bridge Page** or "curation portfolio." 

*   **We Are Not a Retailer:** We do not manufacture, stock, warehouse, package, or ship any products.
*   **No Transactional Relationship:** We do not process payments, handle credit card information, or manage order fulfillment.
*   **The "Click-Through" Process:** When you click on a link labeled "Shop", "Buy", "View Price", "Acquire", or similar call-to-action buttons on this Site, you will be automatically redirected to a third-party merchant's website (e.g., Shein, Amazon, Nordstorm, Revolve, etc.).
*   **The Purchase:** Any purchase you make is a direct transaction between you and that third-party merchant.

#### 3. Compensation & Commission Structure

When you click on our affiliate links and make a qualifying purchase, we may receive a commission or referral fee. This commission is paid to us by the merchant, **at no extra cost to you**.

*   **Price Parity:** The price you pay for the product is the same whether you use our affiliate link or navigate to the merchant's site directly. Our commission is deducted from the merchant's profit margin, not added to your purchase price.
*   **Cookie Duration:** Affiliate programs use "cookies" to track your visit. If you click a link and purchase within a specific timeframe (often 24 to 30 days), we may still receive credit for the sale.

#### 4. Affiliate Program Participation

Monique's Curated Style is a participant in several affiliate advertising programs, including but not limited to:

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
Email: moniqueboutique101@gmail.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,
  
  privacyTitle: 'Privacy Policy',
  privacyContent: `### COMPREHENSIVE PRIVACY POLICY

**Last Updated: January 1, 2025**

#### 1. Introduction

Monique's Curated Style ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.

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

If you wish to exercise any of the rights set out above, please contact us at moniqueboutique101@gmail.com.

#### 10. Third-Party Links

This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements. When you leave our website, we encourage you to read the privacy policy of every website you visit.

#### 11. Contact Us

If you have any questions about this Privacy Policy, please contact us at:

Email: moniqueboutique101@gmail.com
Phone: +27 76 836 0325
Address: Mokopane, Limpopo, 0601`,

  termsTitle: 'Terms of Service',
  termsContent: `### TERMS OF SERVICE & USER AGREEMENT

**Last Updated: January 1, 2025**

#### 1. Acceptance of Terms

By accessing and using the website Monique's Curated Style (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Site's particular services, you shall be subject to any posted guidelines or rules applicable to such services. All such guidelines or rules are hereby incorporated by reference into the Terms of Service.

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

You agree to defend, indemnify and hold harmless the Site and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, or b) a breach of these Terms.

#### 9. Changes to Terms

We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

#### 10. Governing Law

These Terms shall be governed and construed in accordance with the laws of South Africa (or the primary jurisdiction of the Site owner), without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.

#### 11. Contact Us

If you have any questions about these Terms, please contact us at:

Email: moniqueboutique101@gmail.com
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
