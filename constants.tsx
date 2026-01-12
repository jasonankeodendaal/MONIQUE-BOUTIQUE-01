
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule } from './types';

// EMAIL_TEMPLATE_HTML added to fix import error in Admin.tsx
export const EMAIL_TEMPLATE_HTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
        .header { text-align: center; margin-bottom: 30px; }
        .footer { font-size: 12px; color: #999; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>{{company_name}}</h1>
        </div>
        <p>Dear {{to_name}},</p>
        <div>{{message}}</div>
        <div class="footer">
          <p>&copy; {{year}} {{company_name}}</p>
          <p>{{company_address}}</p>
        </div>
      </div>
    </body>
  </html>
`;

export const GUIDE_STEPS = [
  {
    id: 'database',
    title: 'Database & Schema Engine',
    description: 'The foundation of your Maison. Execute this SQL script in your Supabase SQL Editor to create the necessary tables for products, inquiries, and site settings.',
    illustrationId: 'forge',
    subSteps: [
      'Navigate to the "SQL Editor" tab in your Supabase Dashboard.',
      'Click "New Query" and paste the provided SQL block.',
      'Click "Run" to initialize all 8 core tables.',
      'Verify tables appear in the "Table Editor" sidebar.'
    ],
    code: `-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  "companyName" TEXT,
  slogan TEXT,
  "companyLogo" TEXT,
  "companyLogoUrl" TEXT,
  "primaryColor" TEXT,
  "secondaryColor" TEXT,
  "accentColor" TEXT,
  "navHomeLabel" TEXT,
  "navProductsLabel" TEXT,
  "navAboutLabel" TEXT,
  "navContactLabel" TEXT,
  "navDashboardLabel" TEXT,
  "contactEmail" TEXT,
  "contactPhone" TEXT,
  "whatsappNumber" TEXT,
  address TEXT,
  "socialLinks" JSONB,
  "footerDescription" TEXT,
  "footerCopyrightText" TEXT,
  "homeHeroBadge" TEXT,
  "homeAboutTitle" TEXT,
  "homeAboutDescription" TEXT,
  "homeAboutImage" TEXT,
  "homeAboutCta" TEXT,
  "homeCategorySectionTitle" TEXT,
  "homeCategorySectionSubtitle" TEXT,
  "homeTrustSectionTitle" TEXT,
  "homeTrustItem1Title" TEXT,
  "homeTrustItem1Desc" TEXT,
  "homeTrustItem1Icon" TEXT,
  "homeTrustItem2Title" TEXT,
  "homeTrustItem2Desc" TEXT,
  "homeTrustItem2Icon" TEXT,
  "homeTrustItem3Title" TEXT,
  "homeTrustItem3Desc" TEXT,
  "homeTrustItem3Icon" TEXT,
  "productsHeroTitle" TEXT,
  "productsHeroSubtitle" TEXT,
  "productsHeroImage" TEXT,
  "productsHeroImages" TEXT[],
  "productsSearchPlaceholder" TEXT,
  "aboutHeroTitle" TEXT,
  "aboutHeroSubtitle" TEXT,
  "aboutMainImage" TEXT,
  "aboutEstablishedYear" TEXT,
  "aboutFounderName" TEXT,
  "aboutLocation" TEXT,
  "aboutHistoryTitle" TEXT,
  "aboutHistoryBody" TEXT,
  "aboutMissionTitle" TEXT,
  "aboutMissionBody" TEXT,
  "aboutMissionIcon" TEXT,
  "aboutCommunityTitle" TEXT,
  "aboutCommunityBody" TEXT,
  "aboutCommunityIcon" TEXT,
  "aboutIntegrityTitle" TEXT,
  "aboutIntegrityBody" TEXT,
  "aboutIntegrityIcon" TEXT,
  "aboutSignatureImage" TEXT,
  "aboutGalleryImages" TEXT[],
  "contactHeroTitle" TEXT,
  "contactHeroSubtitle" TEXT,
  "contactFormNameLabel" TEXT,
  "contactFormEmailLabel" TEXT,
  "contactFormSubjectLabel" TEXT,
  "contactFormMessageLabel" TEXT,
  "contactFormButtonText" TEXT,
  "contactInfoTitle" TEXT,
  "contactAddressLabel" TEXT,
  "contactHoursLabel" TEXT,
  "contactHoursWeekdays" TEXT,
  "contactHoursWeekends" TEXT,
  "disclosureTitle" TEXT,
  "disclosureContent" TEXT,
  "privacyTitle" TEXT,
  "privacyContent" TEXT,
  "termsTitle" TEXT,
  "termsContent" TEXT,
  "emailJsServiceId" TEXT,
  "emailJsTemplateId" TEXT,
  "emailJsPublicKey" TEXT,
  "googleAnalyticsId" TEXT,
  "facebookPixelId" TEXT,
  "tiktokPixelId" TEXT,
  "amazonAssociateId" TEXT,
  "webhookUrl" TEXT,
  "pinterestTagId" TEXT
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT,
  sku TEXT,
  price NUMERIC,
  "affiliateLink" TEXT,
  "categoryId" TEXT,
  "subCategoryId" TEXT,
  description TEXT,
  features TEXT[],
  specifications JSONB,
  media JSONB,
  "discountRules" JSONB,
  reviews JSONB,
  "createdAt" BIGINT,
  "createdBy" TEXT
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT,
  icon TEXT,
  image TEXT,
  description TEXT,
  "createdBy" TEXT
);

-- 4. Subcategories Table
CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY,
  "categoryId" TEXT,
  name TEXT,
  "createdBy" TEXT
);

-- 5. Hero Slides Table
CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  image TEXT,
  type TEXT,
  title TEXT,
  subtitle TEXT,
  cta TEXT,
  "createdBy" TEXT
);

-- 6. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  whatsapp TEXT,
  subject TEXT,
  message TEXT,
  "createdAt" BIGINT,
  status TEXT
);

-- 7. Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT,
  permissions TEXT[],
  "createdAt" BIGINT,
  "lastActive" BIGINT,
  "profileImage" TEXT,
  phone TEXT,
  address TEXT
);

-- 8. Traffic Logs Table
CREATE TABLE IF NOT EXISTS traffic_logs (
  id TEXT PRIMARY KEY,
  type TEXT,
  text TEXT,
  time TEXT,
  timestamp BIGINT,
  source TEXT
);

-- 9. Product Stats Table
CREATE TABLE IF NOT EXISTS product_stats (
  "productId" TEXT PRIMARY KEY,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  "totalViewTime" NUMERIC DEFAULT 0,
  "lastUpdated" BIGINT
);`,
    codeLabel: 'Initial Schema (PostgreSQL)'
  },
  {
    id: 'environment',
    title: 'Cloud Synchronization',
    description: 'Connect your local curation engine to your global Supabase project for real-time inventory management.',
    illustrationId: 'rocket',
    subSteps: [
      'Go to Supabase Project Settings > API.',
      'Copy the Project URL and Anon Key.',
      'Create a .env file in your project root.',
      'The app will automatically detect these and switch to Cloud Mode.'
    ],
    code: 'VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here',
    codeLabel: '.env Configuration'
  },
  {
    id: 'storage',
    title: 'Asset Vault (Storage)',
    description: 'Enable high-speed image and video hosting for your product galleries.',
    illustrationId: 'forge',
    subSteps: [
      'In Supabase, go to the "Storage" tab.',
      'Create a new bucket named exactly "media".',
      'Set the bucket to "Public" (crucial for affiliate links).',
      'Test by uploading a logo in the Identity settings.'
    ],
    code: 'Bucket Name: media\nVisibility: Public\nAllowed MIME Types: image/*, video/*',
    codeLabel: 'Storage Parameters'
  },
  {
    id: 'emailjs',
    title: 'Concierge Automation (EmailJS)',
    description: 'Configure your automatic reply system so you can respond to inquiries directly from the Maison Portal.',
    illustrationId: 'rocket',
    subSteps: [
      'Sign up at emailjs.com.',
      'Add a Service (like Gmail or Outlook).',
      'Create a Template. Copy the IDs into the Integrations tab.',
      'Ensure template variables match: {{to_name}}, {{message}}, {{subject}}.'
    ],
    code: 'Variables Required:\n{{to_name}} - Recipient Name\n{{message}} - Your reply body\n{{subject}} - Email subject\n{{company_name}} - Your brand',
    codeLabel: 'EmailJS Template Config'
  },
  {
    id: 'tracking',
    title: 'Intelligence & Pixels',
    description: 'Install tracking sensors to monitor visitor behavior across Facebook, TikTok, and Pinterest.',
    illustrationId: 'forge',
    subSteps: [
      'Get your Measurement ID from Google Analytics G-XXXXXX.',
      'Get your Pixel IDs from Meta, TikTok, and Pinterest dashboards.',
      'Paste them into the Canvas > Integrations section.',
      'Check the Analytics tab to see live hits appearing.'
    ]
  },
  {
    id: 'deployment',
    title: 'Production Deployment',
    description: 'Deploy your bridge page to a production environment for global access.',
    illustrationId: 'rocket',
    subSteps: [
      'Connect your GitHub repository to Vercel or Netlify.',
      'Add the .env variables to the "Environment Variables" section in their dashboard.',
      'Click Deploy. Your high-conversion bridge page is live!'
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
  slogan: 'Personal Luxury Wardrobe',
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

  footerDescription: "The digital bridge to South African luxury. Curating elite fashion and lifestyle affiliate picks for the discerning modern closet.",
  footerCopyrightText: "All rights reserved. Made with love in South Africa.",

  // Home
  homeHeroBadge: 'Kasi Couture Exclusive',
  homeAboutTitle: 'Modern Heritage. Timeless Elegance.',
  homeAboutDescription: 'I founded Kasi Couture to bridge the gap between street-inspired authenticity and high-end luxury. Every piece featured here is a testament to the vibrant spirit of Johannesburg refined for the global stage.',
  homeAboutImage: 'https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Story',
  homeCategorySectionTitle: 'Shop by Department',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'The Standard',
  homeTrustItem1Title: 'Verified Luxury',
  homeTrustItem1Desc: 'Every product link is personally tested and leads to a secure, verified retailer.',
  homeTrustItem1Icon: 'ShieldCheck',
  homeTrustItem2Title: 'Curated Taste',
  homeTrustItem2Desc: 'No algorithms. Only human-selected pieces that embody the Kasi Couture aesthetic.',
  homeTrustItem2Icon: 'Sparkles',
  homeTrustItem3Title: 'Global Reach',
  homeTrustItem3Desc: 'Sourcing the best of South African design and international luxury couture.',
  homeTrustItem3Icon: 'Globe',

  // Products
  productsHeroTitle: 'Boutique Explorer',
  productsHeroSubtitle: 'Refine your selection by department, category, or trend.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Search collections...',

  // About
  aboutHeroTitle: 'The Story of the Silhouette.',
  aboutHeroSubtitle: 'Kasi Couture is my personal curation platform, dedicated to finding the most exquisite garments and accessories across the continent.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Kasi Couture',
  aboutLocation: 'South Africa',

  aboutHistoryTitle: 'A Passion for Craft',
  aboutHistoryBody: 'What began as a style blog in the heart of Soweto has evolved into a premier luxury bridge page. Our mission is to highlight the intricate craftsmanship of local and international designers.',
  
  aboutMissionTitle: 'Elite Curation',
  aboutMissionBody: 'To provide a seamless, aesthetically pleasing interface for fashion enthusiasts to discover premium affiliate products.',
  aboutMissionIcon: 'Target',

  aboutCommunityTitle: 'The Inner Circle',
  aboutCommunityBody: 'Join a global community of style icons who value quality over quantity.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency First',
  aboutIntegrityBody: 'As an affiliate bridge page, we receive a small commission on purchases made through our links, allowing us to keep curating the best for you without bias.',
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
  contactInfoTitle: 'Global HQ',
  contactAddressLabel: 'Address',
  contactHoursLabel: 'Operating Hours',
  contactHoursWeekdays: 'Mon - Fri: 09:00 - 18:00 (SAST)',
  contactHoursWeekends: 'Sat: 09:00 - 13:00',

  // Legal
  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: `### Affiliate Disclosure\n\nTransparency is our foundation. Kasi Couture is a professional curation site. Most product links are affiliate links. If you click and buy, we may receive a commission at no extra cost to you.`,
  privacyTitle: 'Privacy Policy',
  privacyContent: `### Privacy Policy\n\nWe value your data privacy. We only collect information necessary for newsletter signups and direct inquiries.`,
  termsTitle: 'Terms of Service',
  termsContent: `### Terms of Service\n\nKasi Couture is a bridge page. We do not process payments or ship goods directly. All sales are handled by third-party retailers.`,

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
    title: 'Autumn Silk Series',
    subtitle: 'Flowing silhouettes designed for the golden hour in the city.',
    cta: 'View Series'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Tailored Man',
    subtitle: 'Bespoke-inspired cuts that redefine urban professional attire.',
    cta: 'Explore Suiting'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Velvet Nights',
    subtitle: 'Evening wear that captures the essence of luxury after dark.',
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
    description: 'A luxurious 100% silk wrap dress that transitions perfectly from brunch to ballroom. The Midnight Silk Wrap features a flattering crossover neckline, adjustable waist tie, and a flowing skirt that moves with you.',
    features: [
      '100% Premium Mulberry Silk (22 Momme)',
      'Hand-finished french seams',
      'Adjustable wrap closure for custom fit',
      'Hypoallergenic and temperature regulating',
      'Hidden side pockets'
    ],
    specifications: {
      'Material': '100% Mulberry Silk',
      'Lining': 'Partially Lined',
      'Origin': 'Made in Italy',
      'Care': 'Dry Clean Only',
      'Length': 'Midi (120cm from shoulder)',
      'Fit': 'True to Size, Relaxed Fit'
    },
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', name: 'Silk Dress', type: 'image/jpeg', size: 0 }],
    createdAt: Date.now(),
    discountRules: [{ id: 'd1', type: 'percentage', value: 15, description: 'Season Launch' }],
    reviews: [
      {
        id: 'r1',
        userName: 'Amahle Z.',
        rating: 5,
        comment: 'Absolutely stunning quality. The silk feels divine against the skin and the fit is perfection.',
        createdAt: Date.now() - 10000000
      }
    ]
  }
];
