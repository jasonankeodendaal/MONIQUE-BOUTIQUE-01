
import { CarouselSlide, Category, Product, SiteSettings, SubCategory, AdminUser, Enquiry, PermissionNode, TrainingModule } from './types';

// NOTE: INITIAL_* constants are now only used for Type reference or empty state initialization
// They are NOT seeded into local storage anymore.

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'instagram-mastery',
    title: 'Instagram: The Aesthetic Storefront',
    platform: 'Instagram',
    description: 'Master the art of the visual hook. Turn scrolling into shopping with high-fidelity aesthetics.',
    icon: 'Instagram',
    strategies: [
      'The "Story Bridge" Technique: Never post a product link without context. Post 3 stories: 1. The Problem ("Don\'t you hate when..."), 2. The Solution (The product in use), 3. The Link ("Get it here").',
      'Bio Optimization: Line 1: Who you help. Line 2: Authority/Social Proof. Line 3: CTA to your Bridge Page.',
      'Reel Pacing: 0-2s (Visual Hook), 2-5s (Context), 5-10s (Value/Aesthetic), 10s+ (Call to Action).',
      'Carousel Narrative: Slide 1 is the cover (High CTR), Slide 2-8 is value/education, Slide 9-10 is the sell.',
      'Engagement Pods: Do not use them. Instead, reply to every comment with a question to double the comment count organically.'
    ],
    actionItems: [
      'Audit your Bio: Does it clearly link to this Bridge Page?',
      'Create a "Highlights" reel for each major product category.',
      'Post a "This or That" poll on Stories to boost algorithm engagement.',
      'DM 5 new followers a "Welcome, no-sell" message to establish connection.'
    ]
  },
  {
    id: 'tiktok-growth',
    title: 'TikTok: The Virality Engine',
    platform: 'TikTok',
    description: 'Raw, unfiltered, and high-volume. The fastest way to scale brand awareness from zero.',
    icon: 'Video',
    strategies: [
      'Visual ASMR: Unboxing sounds, fabric textures, and close-ups work better than talking heads for luxury.',
      'The "Green Screen" Method: Put the product page behind you and point out specific details (Price, Fabric, Reviews).',
      'Trend Jacking: Use trending audio at 5% volume under your own voiceover to ride the wave.',
      'SEO Descriptions: TikTok is a search engine. Use 3-5 hashtags that describe the ITEM, not just #fyp.',
      'Reply with Video: When someone asks "Where to get?", reply with a video showing the checkout process on your bridge page.'
    ],
    actionItems: [
      'Post 3x daily for 14 days to test different content pillars.',
      'Search "Luxury Fashion" and comment on the top 5 videos of the day.',
      'Create a video responding to a "hate comment" (polite controversy).'
    ]
  },
  {
    id: 'pinterest-seo',
    title: 'Pinterest: Visual Search SEO',
    platform: 'Pinterest',
    description: 'The long-game. Pins live for months or years, driving passive traffic to your bridge.',
    icon: 'Pin',
    strategies: [
      'Vertical is King: Only post 2:3 or 9:16 aspect ratio images.',
      'Keyword Stuffing (The Good Kind): Title should be "Silk Dress | Summer Wedding Guest | Luxury Outfit" not just "Cute Dress".',
      'Idea Pins: Create video montages. They currently get 4x the reach of static pins.',
      'Rich Pins: Ensure your bridge page meta data is correct so Pinterest pulls the price automatically.',
      'Board Organization: Create boards for specific aesthetics ("Old Money", "Y2K", "Office Siren") not just "Clothes".'
    ],
    actionItems: [
      'Claim your website in Pinterest Business Hub.',
      'Create 5 fresh pins pointing to your "Best Sellers" category.',
      'Repin 10 relevant aesthetic photos to your main board.'
    ]
  },
  {
    id: 'whatsapp-vip',
    title: 'WhatsApp: The Concierge List',
    platform: 'WhatsApp',
    description: 'High-ticket sales happen in the DMs. Treat this as your VIP club.',
    icon: 'MessageCircle',
    strategies: [
      'The "Broadcast" Rule: Never make a group chat (GDPR/Privacy). Use Broadcast Lists.',
      'Status Scarcity: Post deals that expire in 24 hours only on WhatsApp Status.',
      'Voice Notes: Send personalized styling advice via audio. It builds massive trust.',
      'Labeling: Use WhatsApp Business labels to track "Interested", "Bought", and "VIP".'
    ],
    actionItems: [
      'Add a "Chat with Concierge" floating button to your site.',
      'Send a broadcast: "New Collection Drop - 48hrs only".'
    ]
  },
  {
    id: 'email-nurture',
    title: 'Email: The Owned Asset',
    platform: 'General',
    description: 'Social media algorithms change. Your email list is yours forever.',
    icon: 'Mail',
    strategies: [
      'The Welcome Sequence: Email 1 (Hello & Value), Email 2 (Brand Story), Email 3 (Best Sellers).',
      'Subject Lines: Curiosity ("You need to see this...") vs Clarity ("50% Off Sale"). Test both.',
      'Plain Text vs HTML: For high-ticket, plain text often feels more personal/exclusive than flashy graphics.',
      'Segmentation: Tag users by what they clicked (e.g., "Interested in Shoes") and send relevant follow-ups.'
    ],
    actionItems: [
      'Set up an automated Welcome Email using EmailJS or your provider.',
      'Add a signup form to the footer of your bridge page.'
    ]
  },
  {
    id: 'linkedin-luxury',
    title: 'LinkedIn: The Professional Wallet',
    platform: 'General',
    description: 'Underrated for high-ticket items. Target professionals with disposable income.',
    icon: 'Linkedin',
    strategies: [
      'Thought Leadership: Write about "The Psychology of Dressing for Success".',
      'Carousel PDFs: Slide decks about "Wardrobe Essentials for the Executive" perform highly.',
      'Networking: Connect with Personal Stylists and offer your curation as a resource.',
      'The "Work Wear" Angle: Focus entirely on office-appropriate luxury.'
    ],
    actionItems: [
      'Post a "Work Outfit of the Week" breakdown.',
      'Update your headline to "Curator of Professional Luxury".'
    ]
  }
];

// Permission Structure for RBAC
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

export const EMAIL_TEMPLATE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f5; padding-bottom: 60px; }
  .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); font-size: 16px; color: #334155; line-height: 1.6; }
  .header { background-color: #1e293b; padding: 40px 20px; text-align: center; }
  .logo-img { max-height: 60px; width: auto; display: block; margin: 0 auto; }
  .logo-text { font-size: 24px; font-weight: bold; color: #D4AF37; text-transform: uppercase; letter-spacing: 0.1em; margin: 0; font-family: serif; }
  .body-content { padding: 40px 30px; }
  .message-box { background-color: #f8fafc; border-left: 4px solid #D4AF37; padding: 20px; margin: 25px 0; border-radius: 4px; font-size: 15px; color: #475569; }
  .btn { display: inline-block; padding: 12px 30px; background-color: #D4AF37; color: #1e293b; text-decoration: none; font-weight: bold; border-radius: 4px; margin-top: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
  .footer { background-color: #1e293b; padding: 40px 20px; text-align: center; color: #94a3b8; font-size: 12px; }
  .footer a { color: #D4AF37; text-decoration: none; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="main">
      <div class="header">
        {{#if company_logo_url}}
          <img src="{{company_logo_url}}" alt="{{company_name}}" class="logo-img" />
        {{else}}
          <h1 class="logo-text">{{company_name}}</h1>
        {{/if}}
      </div>
      <div class="body-content">
        <p>Dear {{to_name}},</p>
        <p>Thank you for connecting with <strong>{{company_name}}</strong>.</p>
        <div class="message-box">{{{message}}}</div>
        <div style="text-align: center; margin-top: 30px;">
          <a href="{{company_website}}" class="btn">View Collection</a>
        </div>
      </div>
      <div class="footer">
        <p>&copy; {{year}} {{company_name}}. All rights reserved.</p>
        <p>{{company_address}}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

// Default Empty States for Types
export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Kasi Couture',
  slogan: 'Personal Luxury Wardrobe',
  companyLogo: 'KC',
  companyLogoUrl: '',
  primaryColor: '#D4AF37',
  secondaryColor: '#1E293B',
  accentColor: '#F59E0B',
  navHomeLabel: 'Home',
  navProductsLabel: 'Collections',
  navAboutLabel: 'My Story',
  navContactLabel: 'Concierge',
  navDashboardLabel: 'Portal',
  contactEmail: '',
  contactPhone: '',
  whatsappNumber: '',
  address: '',
  socialLinks: [],
  footerDescription: "The digital bridge to luxury. Curating elite fashion and lifestyle affiliate picks.",
  footerCopyrightText: "All rights reserved.",
  homeHeroBadge: 'Exclusive Curation',
  homeAboutTitle: 'Modern Heritage',
  homeAboutDescription: 'Bridging the gap between authenticity and luxury.',
  homeAboutImage: '',
  homeAboutCta: 'Read Story',
  homeCategorySectionTitle: 'Shop by Department',
  homeCategorySectionSubtitle: 'The Collection',
  homeTrustSectionTitle: 'The Standard',
  homeTrustItem1Title: 'Verified',
  homeTrustItem1Desc: 'Authentic products only.',
  homeTrustItem1Icon: 'ShieldCheck',
  homeTrustItem2Title: 'Curated',
  homeTrustItem2Desc: 'Hand-picked selection.',
  homeTrustItem2Icon: 'Sparkles',
  homeTrustItem3Title: 'Global',
  homeTrustItem3Desc: 'International shipping.',
  homeTrustItem3Icon: 'Globe',
  productsHeroTitle: 'The Catalog',
  productsHeroSubtitle: 'Explore the finest selection.',
  productsHeroImage: '',
  productsHeroImages: [],
  productsSearchPlaceholder: 'Search...',
  aboutHeroTitle: 'Our Story',
  aboutHeroSubtitle: 'A journey of style.',
  aboutMainImage: '',
  aboutEstablishedYear: '2024',
  aboutFounderName: 'Founder',
  aboutLocation: 'Global',
  aboutHistoryTitle: 'Origins',
  aboutHistoryBody: 'It started with a passion for fashion...',
  aboutMissionTitle: 'Mission',
  aboutMissionBody: 'To curate the best.',
  aboutMissionIcon: 'Target',
  aboutCommunityTitle: 'Community',
  aboutCommunityBody: 'Join us.',
  aboutCommunityIcon: 'Users',
  aboutIntegrityTitle: 'Integrity',
  aboutIntegrityBody: 'Transparency is key.',
  aboutIntegrityIcon: 'Award',
  aboutSignatureImage: '',
  aboutGalleryImages: [],
  contactHeroTitle: 'Contact Us',
  contactHeroSubtitle: 'We are here to help.',
  contactFormNameLabel: 'Name',
  contactFormEmailLabel: 'Email',
  contactFormSubjectLabel: 'Subject',
  contactFormMessageLabel: 'Message',
  contactFormButtonText: 'Send',
  contactInfoTitle: 'Headquarters',
  contactAddressLabel: 'Address',
  contactHoursLabel: 'Hours',
  contactHoursWeekdays: 'Mon-Fri',
  contactHoursWeekends: 'Closed',
  disclosureTitle: 'Affiliate Disclosure',
  disclosureContent: 'We may earn a commission from links on this page.',
  privacyTitle: 'Privacy Policy',
  privacyContent: 'Your data is safe.',
  termsTitle: 'Terms',
  termsContent: 'Standard terms apply.'
};

export const GUIDE_STEPS = [
  {
    id: 'prep_env',
    title: '1. Calibrating the Studio Engine',
    description: 'The Concept: Your website is powered by a set of tools called a "Development Environment." Think of this as the heavy machinery in a fashion house.',
    subSteps: ['Install Node.js (LTS)', 'Install Git', 'Install VS Code', 'Open Terminal'],
    tips: 'Always use LTS version of Node.',
    illustrationId: 'forge'
  },
  {
    id: 'supabase_infra',
    title: '4. Supabase: The Brain',
    description: 'Every store needs a memory. Supabase is your backend database.',
    subSteps: ['Create Account', 'New Project', 'Get API Keys', 'Choose Region'],
    illustrationId: 'database'
  }
];
