

import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode } from './types';

export const PERMISSION_TREE: PermissionNode[] = [
  {
    id: 'dashboard',
    label: 'Dashboard & Reports',
    description: 'Access to the main command center.',
    children: [
      { id: 'dashboard.view', label: 'View Analytics Overview' },
      { id: 'dashboard.export', label: 'Export Reports' },
    ]
  },
  {
    id: 'sales',
    label: 'Sales & Enquiries',
    description: 'Manage incoming leads and communications.',
    children: [
      { id: 'sales.view', label: 'View Inbox' },
      { id: 'sales.reply', label: 'Reply to Enquiries' },
      { id: 'sales.status', label: 'Update Status' },
      { id: 'sales.delete', label: 'Delete Messages' },
      { id: 'sales.export', label: 'Export Enquiries' }
    ]
  },
  {
    id: 'catalog',
    label: 'Catalog Management',
    description: 'Control products and categories.',
    children: [
      { id: 'catalog.products.view', label: 'View Products' },
      { id: 'catalog.products.create', label: 'Create Products' },
      { id: 'catalog.products.edit', label: 'Edit Products' },
      { id: 'catalog.products.delete', label: 'Delete Products' },
      { id: 'catalog.categories.manage', label: 'Manage Departments' },
      { id: 'catalog.subcategories.manage', label: 'Manage Sub-Categories' },
      { id: 'catalog.ads', label: 'Generate Ad Copy' }
    ]
  },
  {
    id: 'content',
    label: 'Site Content & Visuals',
    description: 'Edit pages and visual elements.',
    children: [
      { id: 'content.hero', label: 'Manage Hero Slides' },
      { id: 'content.brand', label: 'Brand Identity (Logo/Colors)' },
      { id: 'content.nav', label: 'Navigation & Footer' },
      { id: 'content.home', label: 'Home Page Sections' },
      { id: 'content.about', label: 'About Page Story' },
      { id: 'content.contact', label: 'Contact Page Details' },
      { id: 'content.legal', label: 'Legal Pages' }
    ]
  },
  {
    id: 'system',
    label: 'System Administration',
    description: 'Advanced settings and team management.',
    children: [
      { id: 'system.team.view', label: 'View Team Members' },
      { id: 'system.team.manage', label: 'Add/Edit Members' },
      { id: 'system.team.delete', label: 'Remove Members' },
      { id: 'system.integrations', label: 'Manage Integrations (API Keys)' },
      { id: 'system.logs', label: 'View System Logs' }
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
  backgroundColor: '#FDFCFB',
  textColor: '#0f172a',
  
  navHomeLabel: 'Home',
  navProductsLabel: 'My Picks',
  navAboutLabel: 'My Story',
  navContactLabel: 'Ask Me',
  navDashboardLabel: 'Portal',

  contactEmail: 'hello@kasicouture.com',
  contactPhone: '+27 11 900 2000',
  whatsappNumber: '+27119002000',
  address: 'Melrose Arch, Johannesburg',
  socialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com/kasicouture', iconUrl: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
    { id: '2', name: 'Twitter', url: 'https://twitter.com/kasicouture', iconUrl: 'https://cdn-icons-png.flaticon.com/512/3256/3256013.png' }
  ],

  footerDescription: "This isn't just a store. It's a collection of the things I love, vetted for quality and style, brought together for the modern South African.",
  footerCopyrightText: "All rights reserved. Curated with love.",

  // Home
  homeHeroBadge: 'Curated by Kasi',
  homeAboutTitle: 'Hi, I’m the Curator.',
  homeAboutDescription: 'For years, I struggled to find fashion that balanced authentic African heritage with modern luxury. I spent months vetting suppliers, testing fabrics, and building relationships. This website is the result of that journey—a bridge to the finest pieces I trust and wear myself.',
  homeAboutImage: 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=1200',
  homeAboutCta: 'Read My Full Story',
  homeCategorySectionTitle: 'Curated Categories',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'Why I Chose These',
  
  homeTrustItem1Title: 'Personally Vetted',
  homeTrustItem1Desc: 'I do not list anything I haven’t researched. Every link leads to a trusted retailer.',
  homeTrustItem1Icon: 'ShieldCheck',

  homeTrustItem2Title: 'Authentic Style',
  homeTrustItem2Desc: 'Selected for the individual who values unique expression over fast fashion trends.',
  homeTrustItem2Icon: 'Sparkles',

  homeTrustItem3Title: 'Direct Access',
  homeTrustItem3Desc: 'I act as your bridge to global and local luxury, ensuring you get the best price.',
  homeTrustItem3Icon: 'Link',

  // Products
  productsHeroTitle: 'The Edit',
  productsHeroSubtitle: 'A hand-picked selection of essentials that define the Kasi Couture aesthetic.',
  productsHeroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
  productsHeroImages: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000',
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000'
  ],
  productsSearchPlaceholder: 'Find something special...',

  // About
  aboutHeroTitle: 'From Passion to Platform.',
  aboutHeroSubtitle: 'Kasi Couture is my personal curation platform, dedicated to finding the most exquisite garments and accessories across the continent.',
  aboutMainImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200',
  
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Your Name',
  aboutLocation: 'South Africa',

  aboutHistoryTitle: 'My Journey',
  aboutHistoryBody: 'It started with a simple frustration: finding high-quality, authentic luxury pieces was overwhelming. I was tired of scrolling through endless generic stores. \n\nI decided to become the filter. I started meeting designers, visiting showrooms, and testing materials. What you see here is not an algorithm—it is a reflection of my personal taste and rigorous standards. Every item has a story, and I am here to share it with you.',
  
  aboutMissionTitle: 'My Promise',
  aboutMissionBody: 'To only recommend products that I would be proud to own myself. Quality over quantity, always.',
  aboutMissionIcon: 'Heart',

  aboutCommunityTitle: 'The Vision',
  aboutCommunityBody: 'To build a community of like-minded individuals who appreciate the finer details of African luxury.',
  aboutCommunityIcon: 'Users',
  
  aboutIntegrityTitle: 'Transparency',
  aboutIntegrityBody: 'I believe in total honesty. As an affiliate curator, I may earn a commission when you purchase through my links. This comes at no extra cost to you, but it supports my work in finding the next hidden gem.',
  aboutIntegrityIcon: 'Award',

  aboutSignatureImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/John_Hancock_Signature.svg/1200px-John_Hancock_Signature.svg.png',
  aboutGalleryImages: [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551488852-0801d863dc34?auto=format&fit=crop&q=80&w=800'
  ],

  // Contact
  contactHeroTitle: 'Let\'s Connect.',
  contactHeroSubtitle: 'Have a question about a specific piece or just want to say hi? I read every message.',
  contactFormNameLabel: 'Your Name',
  contactFormEmailLabel: 'Your Email',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Send Message',
  
  contactInfoTitle: 'Contact Info',
  contactAddressLabel: 'Based In',
  contactHoursLabel: 'Online Hours',
  contactHoursWeekdays: 'Mon - Fri: 09:00 - 18:00',
  contactHoursWeekends: 'Sat: 10:00 - 14:00',

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
  webhookUrl: ''
};

export const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'The Curator\'s Edit',
    subtitle: 'A personal selection of this season\'s most compelling pieces.',
    cta: 'View My Picks'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Modern Heritage',
    subtitle: 'Bridging the gap between traditional craft and contemporary style.',
    cta: 'Read the Story'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000',
    type: 'image',
    title: 'Evening Essentials',
    subtitle: 'The pieces I trust for those special nights out.',
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
    media: [{ id: 'm1', url: 'https://images.unsplash.com/photo-1539109136881-3be06109477e?auto=format&fit=crop&q=80&w=800', name: 'Silk Dress', type: 'image/jpeg', size: 0 }],
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

export const EMAIL_TEMPLATE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: 'Playfair Display', serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 60px; }
  .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 640px; border-radius: 0; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); }
  .header { background-color: #1e293b; padding: 50px 20px; text-align: center; border-bottom: 4px solid #D4AF37; }
  .logo-img { max-height: 80px; width: auto; display: block; margin: 0 auto; filter: brightness(0) invert(1); }
  .logo-text { font-size: 28px; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; }
  .body-content { padding: 50px 40px; color: #334155; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  .greeting { font-size: 20px; font-weight: bold; color: #1e293b; margin-bottom: 20px; font-family: 'Playfair Display', serif; }
  .message-box { background-color: #f8fafc; border-left: 3px solid #D4AF37; padding: 30px; margin: 30px 0; border-radius: 4px; font-size: 16px; color: #475569; line-height: 1.8; font-style: italic; }
  .btn { display: inline-block; padding: 16px 36px; background-color: #D4AF37; color: #1e293b; text-decoration: none; font-weight: 900; border-radius: 0; margin-top: 20px; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 4px 6px rgba(212, 175, 55, 0.3); }
  .showcase-header { text-align: center; margin: 50px 0 30px; position: relative; }
  .showcase-header span { background: #fff; padding: 0 20px; position: relative; z-index: 1; font-family: 'Playfair Display', serif; font-size: 24px; font-style: italic; color: #1e293b; }
  .showcase-header:after { content: ""; position: absolute; top: 50%; left: 0; right: 0; border-top: 1px solid #cbd5e1; z-index: 0; }
  .product-row { width: 100%; margin-top: 20px; }
  .product-col { width: 48%; display: inline-block; vertical-align: top; margin: 0 1%; background: #ffffff; border: 1px solid #e2e8f0; }
  .product-img { width: 100%; height: 250px; object-fit: cover; display: block; }
  .product-detail { padding: 20px; text-align: center; }
  .product-title { font-size: 16px; font-weight: bold; color: #1e293b; margin: 0 0 8px; font-family: 'Playfair Display', serif; }
  .product-link { display: inline-block; font-size: 11px; color: #D4AF37; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; text-decoration: none; border-bottom: 1px solid #D4AF37; padding-bottom: 2px; }
  .footer { background-color: #1e293b; padding: 40px 20px; text-align: center; color: #64748b; font-size: 11px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; letter-spacing: 0.5px; border-top: 1px solid #334155; }
  .footer p { margin: 8px 0; }
  .footer a { color: #D4AF37; text-decoration: none; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="main">
      <div class="header">
        <img src="{{company_logo_url}}" alt="{{company_name}}" class="logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
        <h1 class="logo-text" style="display:none;">{{company_name}}</h1>
      </div>
      
      <div class="body-content">
        <div class="greeting">Dear {{to_name}},</div>
        <p>Thank you for reaching out to <strong>{{company_name}}</strong>. We have received your enquiry regarding <strong>{{subject}}</strong>.</p>
        
        <div class="message-box">
          {{{message}}}
        </div>
        
        <p>A member of our concierge team is reviewing your request and will provide a detailed follow-up shortly. We appreciate your patience.</p>
        
        <div style="text-align: center; margin-top: 40px;">
          <a href="{{company_website}}" class="btn">Visit Portal</a>
        </div>

        <div class="showcase-header"><span>Curator's Selection</span></div>
        
        <div class="product-row">
           <!-- Dynamic Placeholders for Top Products -->
           <div class="product-col">
              <img src="{{product_1_image}}" class="product-img" alt="Selection 1">
              <div class="product-detail">
                 <div class="product-title">{{product_1_name}}</div>
                 <a href="{{product_1_link}}" class="product-link">View Item</a>
              </div>
           </div>
           <div class="product-col">
              <img src="{{product_2_image}}" class="product-img" alt="Selection 2">
              <div class="product-detail">
                 <div class="product-title">{{product_2_name}}</div>
                 <a href="{{product_2_link}}" class="product-link">View Item</a>
              </div>
           </div>
        </div>
      </div>

      <div class="footer">
        <p>&copy; {{year}} {{company_name}}. All Rights Reserved.</p>
        <p>{{company_address}}</p>
        <p><a href="{{company_website}}">www.kasicouture.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  codeLabel?: string;
  subSteps?: string[];
  tips?: string;
  illustrationId?: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'prep_env',
    title: '1. Calibrating the Studio Engine',
    description: 'The Concept: Your website is powered by a set of tools called a "Development Environment." Think of this as the heavy machinery in a fashion house—you need the right engines to turn your creative vision into a functioning digital storefront.',
    subSteps: [
      'Node.js (The Engine): Download the "LTS" version from nodejs.org. This is the electricity that runs your code locally.',
      'Git (The Archivist): Install Git from git-scm.com. It tracks every single change you make, like an automated backup system.',
      'VS Code (The Sketchpad): This is your main workspace. Install it and add the "Prettier" extension to keep your code looking "Luxury Ready."',
      'Terminal (The Command Center): You’ll use your computer’s Terminal or Command Prompt to talk directly to your website engine.'
    ],
    tips: 'Pro Tip: When installing Node.js, always choose the "LTS" (Long Term Support) version. It is the most stable and reliable for professional business applications.',
    illustrationId: 'forge'
  },
  {
    id: 'git_init',
    title: '2. Creating Your Local Vault',
    description: 'The Concept: "Version Control" is like having a time machine for your website. If you make a mistake, you can simply "roll back" to a previous version. We start by initializing a local database to store your project’s history.',
    code: `# Open your terminal in the project folder and run:
git init
git add .
git commit -m "Grand Opening: Initial Infrastructure Deployed"
git branch -M main`,
    codeLabel: 'Version Control Commands',
    subSteps: [
      'git init: Tells your computer to start tracking changes in this folder.',
      'git add .: Stages all your current files (logos, styles, logic) to be saved.',
      'git commit: Saves a "snapshot" of your site. This is your first official milestone.',
      'git branch -M main: Sets your main production path to global standards.'
    ],
    illustrationId: 'vault'
  },
  {
    id: 'github_sync',
    title: '3. Connecting to the Global Cloud',
    description: 'The Concept: GitHub is a "Cloud Vault" for your code. By syncing your local work to GitHub, you protect it from computer failure and allow other cloud services (like your hosting provider) to see and build your website automatically.',
    code: `# Replace [USERNAME] and [REPO_NAME] with your own details:
git remote add origin https://github.com/[USERNAME]/[REPO_NAME].git
git push -u origin main`,
    codeLabel: 'Cloud Synchronization Handshake',
    tips: 'Critical Security: In your GitHub repository settings, ensure the project is set to "PRIVATE." You don’t want strangers seeing your admin passwords or affiliate strategy.',
    illustrationId: 'satellite'
  },
  {
    id: 'supabase_infra',
    title: '4. Supabase: The Brain of the Maison',
    description: 'The Concept: Every store needs a memory. Supabase is your "Backend"—a database that stores your product descriptions, admin accounts, and customer inquiries. It works even when your computer is turned off.',
    subSteps: [
      'Sign Up: Go to supabase.com and create a free account.',
      'Project Creation: Click "New Project." Name it something like "Kasi-Couture-DB."',
      'The API Keys: In the "Project Settings -> API" tab, copy your "Project URL" and "anon public key." You will need these for Step 9.',
      'Region Selection: Choose a database server location closest to your target audience (e.g., Cape Town or London) for maximum speed.'
    ],
    illustrationId: 'database'
  },
  {
    id: 'supabase_sql',
    title: '5. Setting the Foundations (SQL)',
    description: 'The Concept: SQL is the language we use to tell the database how to organize itself. We are going to execute a master script that builds your Product Catalog, Settings Configuration, and Media Storage Vault in one go.',
    code: `-- MASTER SETUP SCRIPT
-- Copy and paste all of this into the Supabase SQL Editor

-- 1. DATA STRUCTURES (Tables)
create table if not exists settings (
  id text primary key,
  "companyName" text, "slogan" text, "companyLogo" text, "companyLogoUrl" text,
  "primaryColor" text, "secondaryColor" text, "accentColor" text,
  "navHomeLabel" text, "navProductsLabel" text, "navAboutLabel" text, "navContactLabel" text, "navDashboardLabel" text,
  "contactEmail" text, "contactPhone" text, "whatsappNumber" text, "address" text,
  "socialLinks" jsonb,
  "footerDescription" text, "footerCopyrightText" text,
  "homeHeroBadge" text, "homeAboutTitle" text, "homeAboutDescription" text, "homeAboutImage" text, "homeAboutCta" text,
  "homeCategorySectionTitle" text, "homeCategorySectionSubtitle" text, "homeTrustSectionTitle" text,
  "homeTrustItem1Title" text, "homeTrustItem1Desc" text, "homeTrustItem1Icon" text,
  "homeTrustItem2Title" text, "homeTrustItem2Desc" text, "homeTrustItem2Icon" text,
  "homeTrustItem3Title" text, "homeTrustItem3Desc" text, "homeTrustItem3Icon" text,
  "productsHeroTitle" text, "productsHeroSubtitle" text, "productsHeroImage" text, "productsHeroImages" jsonb, "productsSearchPlaceholder" text,
  "aboutHeroTitle" text, "aboutHeroSubtitle" text, "aboutMainImage" text,
  "aboutEstablishedYear" text, "aboutFounderName" text, "aboutLocation" text,
  "aboutHistoryTitle" text, "aboutHistoryBody" text,
  "aboutMissionTitle" text, "aboutMissionBody" text, "aboutMissionIcon" text,
  "aboutCommunityTitle" text, "aboutCommunityBody" text, "aboutCommunityIcon" text,
  "aboutIntegrityTitle" text, "aboutIntegrityBody" text, "aboutIntegrityIcon" text,
  "aboutSignatureImage" text, "aboutGalleryImages" jsonb,
  "contactHeroTitle" text, "contactHeroSubtitle" text, "contactFormNameLabel" text, "contactFormEmailLabel" text,
  "contactFormSubjectLabel" text, "contactFormMessageLabel" text, "contactFormButtonText" text,
  "contactInfoTitle" text, "contactAddressLabel" text, "contactHoursLabel" text, "contactHoursWeekdays" text, "contactHoursWeekends" text,
  "disclosureTitle" text, "disclosureContent" text, "privacyTitle" text, "privacyContent" text, "termsTitle" text, "termsContent" text,
  "emailJsServiceId" text, "emailJsTemplateId" text, "emailJsPublicKey" text,
  "googleAnalyticsId" text, "facebookPixelId" text, "tiktokPixelId" text, "amazonAssociateId" text, "webhookUrl" text
);

create table if not exists products (
  id text primary key,
  name text, sku text, price numeric, "affiliateLink" text,
  "categoryId" text, "subCategoryId" text, description text,
  features jsonb, specifications jsonb, media jsonb,
  "discountRules" jsonb, reviews jsonb, "createdAt" bigint
);

create table if not exists categories (
  id text primary key,
  name text, icon text, image text, description text
);

create table if not exists subcategories (
  id text primary key,
  "categoryId" text, name text
);

create table if not exists carousel_slides (
  id text primary key,
  image text, type text, title text, subtitle text, cta text
);

create table if not exists enquiries (
  id text primary key,
  name text, email text, whatsapp text, subject text, message text, "createdAt" bigint, status text
);

create table if not exists admin_users (
  id text primary key,
  name text, email text, role text, permissions jsonb, password text, "createdAt" bigint, "lastActive" bigint, "profileImage" text, phone text, address text
);

create table if not exists product_stats (
  "productId" text primary key,
  views numeric, clicks numeric, "totalViewTime" numeric, "lastUpdated" bigint
);

create table if not exists traffic_logs (
  id text primary key,
  type text, text text, time text, timestamp bigint
);

-- 2. MEDIA STORAGE
insert into storage.buckets (id, name, public) 
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'media' );

drop policy if exists "Admin Control" on storage.objects;
create policy "Admin Control" 
on storage.objects for all 
using ( auth.role() = 'authenticated' );`,
    codeLabel: 'Full System Provisioning Script',
    tips: 'Why this matters: This script builds the actual "rooms" of your digital house (Product Room, Settings Room, Media Closet) so your content has a permanent home.',
    illustrationId: 'shield'
  },
  {
    id: 'google_auth',
    title: '6. Security & Identity Management',
    description: 'The Concept: Instead of remembering a new password, we’ll set up Google Login. This uses enterprise-grade security (OAuth 2.0) to ensure that only you can access the Admin Portal of your website.',
    subSteps: [
      'Google Cloud: Visit the Google Cloud Console and create a new project.',
      'Credentials: Create an "OAuth 2.0 Client ID."',
      'The Callback: Add your Supabase project URL to the "Authorized Redirect URIs" list.',
      'Activation: Paste your Client ID and Secret into the Supabase "Authentication -> Providers" section and ENABLE the Google Provider.'
    ],
    illustrationId: 'identity'
  },
  {
    id: 'emailjs_config',
    title: '7. EmailJS: The Digital Concierge',
    description: 'The Concept: You need to know when customers want to talk to you. EmailJS acts as a bridge that takes messages from your website contact form and sends them directly to your personal email inbox without needing a complex mail server.',
    subSteps: [
      'Setup: Create a free account at emailjs.com.',
      'Link Inbox: Connect your Gmail or Outlook account.',
      'Design: Create an "Email Template" with variables like {{name}} and {{message}}.',
      'Integration: Copy your Public Key and Template ID into the "Canvas" tab in your Admin Portal.'
    ],
    code: EMAIL_TEMPLATE_HTML,
    codeLabel: 'Recommended Responsive HTML Template (Copy/Paste)',
    illustrationId: 'mail'
  },
  {
    id: 'vercel_deployment',
    title: '8. Vercel: Going Live to the World',
    description: 'The Concept: Vercel is your "Internet Landlord." It takes your code from GitHub and hosts it on high-speed servers globally. It also handles "Environment Variables"—the secret keys that connect your site to Supabase.',
    subSteps: [
      'Import: Login to Vercel and import your GitHub repository.',
      'Environment Variables (CRITICAL): Under "Settings," add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      'Values: Paste the keys you copied from Supabase back in Step 4.',
      'Deploy: Click "Deploy." Vercel will build your site and give you a public URL (e.g., my-curation-site.vercel.app).'
    ],
    illustrationId: 'beacon'
  },
  {
    id: 'domain_setup',
    title: '9. The Brand Stamp: Custom Domains',
    description: 'The Concept: A free URL is great for testing, but a professional brand needs a custom address (e.g., www.kasicouture.com). This is the final step in establishing your digital authority.',
    subSteps: [
      'Purchase: Buy a domain from a registrar like Namecheap or Google Domains.',
      'Connect: In Vercel, go to "Settings -> Domains" and add your new address.',
      'DNS Update: Copy the "A Record" or "CNAME" from Vercel to your domain registrar settings.',
      'Wait: It takes about 30 minutes for the internet to update (propagate) your new address.'
    ],
    tips: 'SEO Fact: Websites with custom .com or .luxury domains rank significantly higher in Google search results than free subdomains.',
    illustrationId: 'globe'
  },
  {
    id: 'tracking_pixel',
    title: '10. The Insight Engine: Analytics',
    description: 'The Concept: To make money, you need to know what your customers like. By adding a "Pixel" (like Google Analytics or Facebook Pixel), you can see which products are getting the most attention and refine your curation.',
    subSteps: [
      'Measurement: Create a Google Analytics 4 property.',
      'Tracking ID: Get your "G-XXXXXXXX" ID.',
      'Admin Portal: Go to your Maison Portal -> Canvas -> Integrations and paste the ID.',
      'Observe: Open your live site and watch the "Insights" tab in your admin dashboard to see traffic in real-time.'
    ],
    illustrationId: 'growth'
  }
];