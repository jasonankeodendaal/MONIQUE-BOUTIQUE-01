

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
    title: '1. Shein Affiliate Blueprint: Zero to First Commission',
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
    title: '2. Founder Brand: The Niche Authority',
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
    title: '3. Instagram: High-Conversion Storefront',
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
  },
  {
    id: 'tiktok-virality',
    title: '4. TikTok Virality: The Hook, Body, & CTA',
    platform: 'TikTok',
    description: 'Mastering the short-form video algorithm to generate massive organic traffic for your bridge page.',
    icon: 'Video',
    strategies: [
      'The 3-Second Rule: You must arrest attention immediately. Use visual disruptions (e.g., dropping a bag on a table) or controversial statements ("Stop buying expensive silk").',
      'Trend Surfing: Use the TikTok Creative Center to find trending audio. Apply the audio to your niche (e.g., a trending dance song used as background for a "Get Ready With Me" speed-run).',
      'Comment Section Mining: Reply to questions with video responses. This creates a "thread" that the algorithm loves and builds community trust.',
      'The "Link in Bio" CTA: Never assume people know where to go. End every video with a clear visual pointing to your profile picture and saying "Shop the Curation in Bio".'
    ],
    actionItems: [
      'Create a "pinned" video explaining exactly how to shop your bridge page.',
      'Post 3 times a day for 2 weeks to test different "Hooks" (Visual vs Audio vs Text).',
      'Engage with 10 other creators in your niche daily to warm up your account.',
      'Use the "Green Screen" effect to show the product page directly behind you while reviewing.'
    ]
  },
  {
    id: 'pinterest-seo',
    title: '5. Pinterest SEO: The Silent Traffic Engine',
    platform: 'Pinterest',
    description: 'Unlike social media, Pinterest is a search engine. Learn to position your pins to capture high-intent shoppers searching for specific styles.',
    icon: 'Pin',
    strategies: [
      'Keyword Rich Pins: Don\'t name a board "Cute". Name it "Summer Wedding Guest Dresses 2024". Use the Pinterest search bar to find auto-complete phrases—these are what people are actually searching for.',
      'Vertical Verticality: Images must be 1000x1500px (2:3 ratio). These take up more screen real estate on mobile, increasing click-through rates.',
      'Idea Pins for Reach, Static Pins for Clicks: Use Idea Pins (video/slideshow) to grow your account followers, but use standard Static Pins to drive direct link clicks to your bridge page.',
      'The "Fresh Pin" Strategy: Pinterest hates reposts. Take 5 different photos of the same dress (front, back, detail, flatlay, lifestyle) and pin them on different days.'
    ],
    actionItems: [
      'Convert your personal account to a Business Account to access Analytics.',
      'Claim your website (bridge page) in settings to get the "Verified Website" checkmark.',
      'Create 10 Boards based on specific occasions (e.g., "Date Night", "Office Chic").',
      'Schedule 5 pins per day using the native scheduler or Tailwind.'
    ]
  },
  {
    id: 'whatsapp-concierge',
    title: '6. WhatsApp Concierge: High-Touch Sales',
    platform: 'WhatsApp',
    description: 'Closing the sale through direct, personal conversation. This is the "Luxury" differentiator of your bridge page.',
    icon: 'MessageCircle',
    strategies: [
      'Status Updates as Catalogs: Post your new bridge page arrivals to your WhatsApp Status. The urgency (24h expiry) drives immediate clicks from your warmest leads (friends/family/clients).',
      'Broadcast Lists, Not Groups: Use Broadcast Lists to send updates. It looks like a personal 1-on-1 message to the receiver, whereas Groups feel spammy and intrusive.',
      'Quick Replies: Set up "Business Tools" in WhatsApp Business. Have pre-saved replies for "How do I size this?" or "Shipping times?" that link back to your bridge page FAQ.',
      'The "Saved Contact" Loop: Offer a small incentive (e.g., "Get my Fall Style Guide PDF") if they save your number. You need them to save your number to see your Status updates.'
    ],
    actionItems: [
      'Switch to WhatsApp Business App.',
      'Create a "Catalog" in WhatsApp that links individual items to your Bridge Page product URLs.',
      'Set an "Away Message" that directs people to the Bridge Page when you are sleeping.',
      'Add a "Chat with Stylist" floating button to your Bridge Page (we have this feature!).'
    ]
  },
  {
    id: 'seo-bridge',
    title: '7. SEO for Bridges: Google Ranking',
    platform: 'SEO',
    description: 'Optimizing your bridge page metadata so specific product reviews rank on Google Search.',
    icon: 'Search',
    strategies: [
      'Long-Tail Keywords: You won\'t rank for "Red Dress". You WILL rank for "Shein Burgundy Silk Wrap Dress Review South Africa". Be specific in your product titles.',
      'Meta Descriptions: Write custom descriptions for every product on your bridge page. Include the fabric, the occasion, and the fit.',
      'The Blog Hybrid: Use the "Description" field in your product admin to write mini-blog posts (300+ words). Google loves text-heavy pages.',
      'Image Alt Text: Always rename your uploaded images from "IMG_001.jpg" to "emerald-green-satin-dress-evening-wear.jpg" before uploading.'
    ],
    actionItems: [
      'Update the "Site Slogan" in Admin Settings to include your main keywords.',
      'Rename all product titles to be descriptive (Color + Material + Style + Occasion).',
      'Write a 300-word "Founder\'s Note" in the About section using your niche keywords.',
      'Test your page speed using Google PageSpeed Insights.'
    ]
  },
  {
    id: 'email-marketing',
    title: '8. Email Marketing: Owning Your Audience',
    platform: 'General',
    description: 'Social algorithms change; email lists do not. Building a newsletter is your insurance policy.',
    icon: 'Mail',
    strategies: [
      'The Lead Magnet: Offer a free "Capsule Wardrobe Checklist" PDF in exchange for their email. Put this sign-up form on your Contact page.',
      'The "Friday Drop": Send one email every Friday at 11 AM with your "Top 5 Picks of the Week". Consistency creates anticipation.',
      'Segmentation: Tag subscribers based on what they click (e.g., "Interested in Shoes" vs "Interested in Dresses"). Send relevant content to each group.',
      'Subject Line Science: Use curiosity gaps (e.g., "The one dress you need...") rather than boring labels (e.g., "Newsletter #4").'
    ],
    actionItems: [
      'Sign up for a free Mailchimp or ConvertKit account.',
      'Create a simple "Welcome Sequence" (3 emails) that introduces your brand story.',
      'Add a "Join the Inner Circle" link to your Instagram Bio.',
      'Send your first "Curator\'s Edit" email to your test list.'
    ]
  },
  {
    id: 'reels-production',
    title: '9. Reels Production: Studio Quality on Mobile',
    platform: 'Instagram',
    description: 'How to shoot, edit, and export high-quality fashion video content using just your smartphone.',
    icon: 'Film',
    strategies: [
      'Lighting 101: Always face the window. Natural light is better than any ring light. If shooting at night, use a softbox to avoid harsh shadows.',
      'The 4k Export Setting: In Instagram settings, ensure "Upload at Highest Quality" is toggled ON. Record in 4k/60fps on your phone for smooth slow-motion.',
      'Audio Synchronization: Edit to the beat. Cuts should happen exactly on the drum kick or snare hit of the song. This feels satisfying to watch.',
      'Angles & Movement: Don\'t just stand there. Move the camera towards the fabric, pan up the silhouette, or walk towards the lens.'
    ],
    actionItems: [
      'Buy a simple tripod with a bluetooth remote shutter.',
      'Download CapCut for advanced editing features not found in Instagram.',
      'Create a folder of "Trending Audio" links to use later.',
      'Batch film 5 outfits in one Sunday afternoon session.'
    ]
  },
  {
    id: 'community-building',
    title: '10. Community Building: The "Tribe" Model',
    platform: 'General',
    description: 'Moving from "Followers" to "True Fans". A community defends you, promotes you, and buys everything you recommend.',
    icon: 'Users',
    strategies: [
      'Naming Your Tribe: Give your followers a collective name (e.g., "The Chic Squad", "Luxury Hackers"). This creates a sense of belonging.',
      'UGC Incentives: Encourage followers to tag you when they buy your recommendations. Repost EVERY single tag to your Stories. This is social proof.',
      'The "Ask Me Anything" (AMA): Host a weekly Q&A on Stories. Answer fashion dilemmas. It positions you as the expert helper, not just a salesperson.',
      'Vulnerability: Share your fashion fails, not just the wins. "I bought this and it looked terrible" builds more trust than 100 perfect reviews.'
    ],
    actionItems: [
      'Create a "Client Love" highlight on Instagram for reposts.',
      'Reply to every single comment on your posts with a question to keep the conversation going.',
      'Host a "Style Audit" giveaway where you critique one follower\'s wardrobe.',
      'Start a "Sunday Chat" routine on Stories.'
    ]
  },
  {
    id: 'facebook-groups',
    title: '11. Facebook Groups: Niche Domination',
    platform: 'Facebook',
    description: 'Leveraging existing communities to drive highly targeted traffic.',
    icon: 'Facebook',
    strategies: [
      'The Helper Method: Join groups like "Wedding Guest Outfits" or "Workwear Style". Do NOT spam links. Answer questions with photos, then say "I have a list of similar items on my profile if you need it".',
      'Marketplace Arbitrage: List items on FB Marketplace (if you own the sample). When they message, say "It\'s sold, but here is the link to buy it new".',
      'Create Your Own Group: "Affordable Luxury Finds SA". You control the pinned post. You control the rules. You own the traffic.',
      'Live Shopping Events: Go live in your group showing the physical products. The raw, unedited nature of Lives converts very well.'
    ],
    actionItems: [
      'Join 5 active fashion/shopping groups in your region.',
      'Spend 1 week just commenting and liking (no links) to build reputation.',
      'Create a "Style Guide" PDF to offer as a value-add in groups.',
      'Set up your own niche Facebook Group.'
    ]
  },
  {
    id: 'influencer-outreach',
    title: '12. Influencer Outreach: Micro-Collaps',
    platform: 'General',
    description: 'Partnering with other micro-influencers to cross-pollinate audiences.',
    icon: 'Star',
    strategies: [
      'The "Style Swap": Find a creator with a similar size. You style an outfit for them, they style one for you. You both tag each other.',
      'Guest Curation: Invite a guest to curate a "Collection" on your bridge page. "The Sarah Edit". They will promote it heavily because their name is on it.',
      'Joint Lives: Go live together on Instagram (Split Screen). You instantly double your reach by tapping into their follower notification list.',
      'Affiliate for Affiliates: If you have a product, offer them a cut. Since you are doing dropshipping/affiliate, this is harder, so focus on content swaps.'
    ],
    actionItems: [
      'Identify 5 creators with 1k-10k followers who share your aesthetic.',
      'Send a genuine DM complimenting a specific piece of their content.',
      'Propose a "Style Challenge" collaboration (e.g., "1 Dress, 2 Ways").',
      'Create a "Guest Curator" graphic template.'
    ]
  },
  {
    id: 'content-batching',
    title: '13. Content Batching: Workflow Efficiency',
    platform: 'General',
    description: 'How to produce 1 month of content in 2 days. Stop the daily burnout cycle.',
    icon: 'Layers',
    strategies: [
      'The "Content Pillars" System: Rotate between 4 themes: Education, Inspiration, Personal, Promotional. Plan this on a calendar.',
      'Shoot Day Protocol: Hair and makeup once. Bring 10 outfits. Shoot all videos first (while energy is high), then photos. Change location slightly for variety.',
      'Template Library: Save your best performing caption structures and Canva layouts. Reuse them. Don\'t reinvent the wheel every post.',
      'Scheduling Tools: Use Meta Business Suite (free) to schedule posts for the week. Never post manually in real-time unless it\'s a Story.'
    ],
    actionItems: [
      'Create a content calendar spreadsheet.',
      'Dedicate every Sunday to planning and filming.',
      'Create 5 "Caption Templates" (e.g., The Story Opener, The Question Opener).',
      'Schedule next week\'s posts this Friday.'
    ]
  },
  {
    id: 'copywriting-magic',
    title: '14. Copywriting Magic: Words that Sell',
    platform: 'General',
    description: 'Writing product descriptions and captions that trigger emotional buying decisions.',
    icon: 'PenTool',
    strategies: [
      'Features vs Benefits: Don\'t say "Elastic waistband" (Feature). Say "Eat pasta comfortably without unbuttoning" (Benefit).',
      'Sensory Language: Use words like "Buttery soft", "Structured", "Flowing", "Crisp". Make them feel the fabric through the screen.',
      'Scarcity & Urgency: "Low Stock Alert" or "Selling out fast". FOMO (Fear Of Missing Out) is a powerful motivator.',
      'The "Imagine This" Technique: "Imagine walking into the boardroom wearing this..." Transport them to the future where they own the item.'
    ],
    actionItems: [
      'Rewrite your top 5 product descriptions using Sensory Language.',
      'Audit your Instagram captions: Are they benefits-focused?',
      'Create a "Power Word" list (e.g., Exclusive, Limited, Essential) to keep on your desk.',
      'A/B test two different headlines on your next two posts.'
    ]
  },
  {
    id: 'analytics-deep-dive',
    title: '15. Analytics Deep Dive: Data-Driven Growth',
    platform: 'General',
    description: 'Reading the numbers to understand what your audience actually wants (vs what you think they want).',
    icon: 'BarChart3',
    strategies: [
      'CTR (Click Through Rate): If impressions are high but clicks are low, your creative (photo/video) is good, but your CTA or Product Offer is weak.',
      'Bounce Rate: If they click the link but leave immediately, your bridge page load speed is slow or the expectation set in the video didn\'t match the landing page.',
      'Time of Day Analysis: Post when your audience is active. Check Insights > Audience > Most Active Times.',
      'The 80/20 Rule: 20% of your products will bring 80% of your revenue. Identify the winners and double down on creating content for them.'
    ],
    actionItems: [
      'Check your Bridge Page Admin Dashboard weekly.',
      'Identify your top 3 clicked products.',
      'Identify your top 3 posts by "Saves" (Saves = high intent).',
      'Kill the bottom 20% of products that get no clicks to keep the site fresh.'
    ]
  },
  {
    id: 'paid-ads-basics',
    title: '16. Paid Ads Basics: Boosting Posts',
    platform: 'General',
    description: 'Introduction to putting money behind your best organic content to scale reach.',
    icon: 'DollarSign',
    strategies: [
      'The "Organic First" Rule: Only boost posts that have already performed well organically. If your followers liked it, strangers might too.',
      'Targeting: Start with "Broad" targeting (Just Age + Gender + Location). Let the algorithm find your people.',
      'Budgeting: Start with $5 (R100) per day for 3 days. If it generates clicks cheaper than your benchmark, keep it running.',
      'The "Profile Visit" Objective: Often cheaper than "Website Clicks". Drive them to your profile, where they will see your Link in Bio.'
    ],
    actionItems: [
      'Connect your Instagram to a Facebook Ad Account.',
      'Identify your best performing Reel of the month.',
      'Boost it for 3 days with a small budget targeting "Women 25-45 Interested in Shopping".',
      'Analyze the cost-per-click.'
    ]
  },
  {
    id: 'seasonal-campaigns',
    title: '17. Seasonal Campaigns: Calendar Sync',
    platform: 'General',
    description: 'Planning your curation around global retail moments (Black Friday, Christmas, Valentine\'s).',
    icon: 'Calendar',
    strategies: [
      'The 6-Week Ramp Up: Start creating content for Christmas in early November. People browse early but buy late.',
      'Gift Guides: "Gifts for Him", "Gifts for Her", "Stocking Fillers". These perform exceptionally well in Q4.',
      'Event Dressing: "Wedding Guest Season" (Sept-Dec), "Matric Dance", "Summer Vacation". Curate specific collections for these.',
      'Clearance Cycles: When seasons change, do a "Last Chance" edit to capture bargain hunters.'
    ],
    actionItems: [
      'Mark all major holidays on your calendar.',
      'Plan 3 "Gift Guide" collections for the next major holiday.',
      'Source "Winter Coats" in Feb/March (end of season sales) or "Summer Dresses" in August (pre-season).',
      'Create a "Holiday Party" lookbook.'
    ]
  },
  {
    id: 'legal-compliance',
    title: '18. Legal & Compliance: Safe Scaling',
    platform: 'General',
    description: 'Staying on the right side of the law and platform terms of service.',
    icon: 'Shield',
    strategies: [
      'FTC/ASA Disclosure: You MUST disclose "Ad" or "Affiliate Link" clearly. Hiding it can get you banned.',
      'Image Rights: Do not steal images from other influencers. Use the official brand product photos or take your own.',
      'Platform Terms: Read the Shein Affiliate Terms. Some brands don\'t allow you to bid on their brand name keywords in Google Ads.',
      'Data Privacy: If you collect emails, you need a Privacy Policy (included in this bridge page!).'
    ],
    actionItems: [
      'Review your bio to ensure "Affiliate" or "Curator" is visible.',
      'Double check your Bridge Page footer for the Privacy Policy link.',
      'Ensure every sponsored Story includes #ad.',
      'Audit your image sources.'
    ]
  },
  {
    id: 'customer-service',
    title: '19. Customer Service: The Human Touch',
    platform: 'General',
    description: 'Handling questions and complaints even though you don\'t ship the product.',
    icon: 'Heart',
    strategies: [
      'The "Middleman" Script: "I don\'t ship the items, but I can help you find the tracking page on Shein\'s website." Be helpful, not dismissive.',
      'Sizing Advice: This is the #1 question. Be honest. "This runs small, size up." Your honesty reduces returns and increases trust.',
      'Handling Broken Links: If a user tells you a link is dead, thank them profusely and fix it immediately.',
      'Response Time: Reply to DMs within 24 hours. Momentum is key in sales.'
    ],
    actionItems: [
      'Create a "Saved Reply" for "Where is my order?".',
      'Create a "Saved Reply" for "How long is shipping?".',
      'Add a sizing guide to your Highlights.',
      'Set aside 15 mins every morning for community management.'
    ]
  },
  {
    id: 'scaling-automation',
    title: '20. Scaling & Automation: The CEO Mindset',
    platform: 'General',
    description: 'Moving from a solopreneur to a business owner. Hiring help and using software.',
    icon: 'Zap',
    strategies: [
      'Virtual Assistants (VA): Hire a VA to create your Deep Links and upload products to the Bridge Page. Your time is better spent on Content Creation.',
      'Repurposing Software: Use tools like Repurpose.io to automatically post your TikToks to YouTube Shorts and Pinterest.',
      'Affiliate Networks: Expand beyond Shein. Apply to LTK (RewardStyle) or Amazon Associates once you have traffic.',
      'Diversification: Don\'t rely on one social platform. If Instagram deletes your account, you need your Email List and Website.'
    ],
    actionItems: [
      'Document your "Product Upload Process" (SOP) so you can teach it to someone else.',
      'Look into Repurpose.io free trial.',
      'Apply to one other affiliate network this month.',
      'Schedule a monthly "CEO Date" to review finances and strategy.'
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
