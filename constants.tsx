
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

// GUIDE_STEPS added to fix import error in Admin.tsx
export const GUIDE_STEPS = [
  {
    id: 'forge',
    title: 'Cloud Synchronization',
    description: 'Connect your local curation engine to a global Supabase backend for real-time inventory management and user tracking.',
    illustrationId: 'forge',
    subSteps: [
      'Create a free Supabase project at supabase.com',
      'Go to Project Settings > API and copy the Project URL and Anon Key',
      'Create a .env file in your root directory',
      'Restart your development server to sync'
    ],
    code: 'VITE_SUPABASE_URL=your_project_url\nVITE_SUPABASE_ANON_KEY=your_anon_key',
    codeLabel: '.env Configuration'
  },
  {
    id: 'deployment',
    title: 'Production Deployment',
    description: 'Deploy your bridge page to a production environment for global access.',
    illustrationId: 'rocket',
    subSteps: [
      'Connect your repository to Vercel or Netlify',
      'Configure environment variables in the provider dashboard',
      'Trigger a production build'
    ]
  }
];

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'founder-growth',
    title: 'Founder Brand: The Niche Authority',
    platform: 'General',
    description: 'Transforming from a curator to a cult-followed authority. People buy from people they trust.',
    icon: 'User',
    strategies: [
      'Phase 1: The Origin Story - Define your "Why". Why fashion? Why luxury? Share your early struggles with style to humanize the brand.',
      'Phase 2: Visual Consistency - Choose a signature look or accessory that appears in 80% of your content. This becomes your visual "logo".',
      'Phase 3: The Knowledge Pillar - Every 10 posts, share a deep-dive "Educational" piece (e.g., "The History of the Hermès Stitch").',
      'Phase 4: Vulnerability - Share the "Uncurated" moments. A messy studio or a failed outfit makes the curated moments feel more attainable.'
    ],
    actionItems: [
      'Write a 500-word personal manifesto about your style philosophy.',
      'Record a 60-second "Introduction" video for your profile pin.',
      'Identify 3 brand colors that reflect your personality, not just the market.',
      'Schedule a weekly "Coffee & Curation" live stream to answer style questions.'
    ]
  },
  {
    id: 'instagram-mastery',
    title: 'Instagram: The Aesthetic Storefront',
    platform: 'Instagram',
    description: 'The foundation of fashion affiliate marketing. High-fidelity visuals meet direct purchasing power.',
    icon: 'Instagram',
    strategies: [
      'Phase 1: Profile Optimization - Convert to Professional Account immediately to access Insights. Use a SEO-optimized handle.',
      'Phase 2: The Content Mix - Follow the 4:1 rule. 4 Value posts (Inspiration, Tips) for every 1 Hard Sell post.',
      'Phase 3: Story Selling - Use "Stories" with link stickers. Post 3 Stories daily: Morning (Routine), Noon (Curation), Night (Review).',
      'Phase 4: Reels Virality - Use the "Transition" method. Show the box, then the unboxed item, then the styled look in sync with beat drops.'
    ],
    actionItems: [
      'Create 5 "Highlight" covers that match your primary brand color.',
      'Post a "This or That" poll in Stories to boost algorithmic engagement.',
      'Setup DM Automation: Use ManyChat to auto-send links when people comment "LINK".'
    ]
  },
  {
    id: 'tiktok-growth',
    title: 'TikTok: Virality Engine',
    platform: 'TikTok',
    description: 'Unfiltered, raw, and high-volume discovery. The fastest way to scale a new brand presence.',
    icon: 'Video',
    strategies: [
      'Phase 1: The 3-Second Hook - Show the "After" result immediately before showing the process.',
      'Phase 2: Audio Hacking - Use trending audio at 5% volume under your voiceover to ride the algorithm.',
      'Phase 3: Community Management - Reply to successful comments with a video response to create a content loop.',
      'Phase 4: ASMR Unboxing - Focus on high-quality sound of tissue paper and boxes to trigger sensory engagement.'
    ],
    actionItems: [
      'Post 3x daily for the first 30 days to "train" your niche algorithm.',
      'Use the search bar to find "Best Luxury Finds" and stitch the top-performing videos.',
      'Create a pinned video explaining your bridge page and why you curate specific items.'
    ]
  },
  {
    id: 'pinterest-seo',
    title: 'Pinterest: Visual Search SEO',
    platform: 'Pinterest',
    description: 'Long-term traffic. Pins live for months, unlike social posts that die in hours.',
    icon: 'Pin',
    strategies: [
      'Phase 1: Account Structure - Claim your website in settings to get attribution. Enable "Rich Pins".',
      'Phase 2: Creative Format - 2:3 Vertical aspect ratio is mandatory. Use text overlays on images.',
      'Phase 3: Keyword Engineering - Use search terms in titles. "Minimalist Fall Wardrobe" > "My Picks".',
      'Phase 4: Board Curation - Create 10 niche boards (e.g., "Gold Jewelry Inspo") and pin 5-10 items daily.'
    ],
    actionItems: [
      'Claim your domain in Pinterest settings.',
      'Create a "Shop My Style" board as your primary showcase.',
      'Design 10 Pin templates in Canva that feature your logo and primary color.'
    ]
  },
  {
    id: 'youtube-shorts',
    title: 'YouTube Shorts: Evergreen Video',
    platform: 'General',
    description: 'Repurpose TikToks here. Google indexes these videos, appearing in search results.',
    icon: 'Youtube',
    strategies: [
      'Phase 1: The Loop - Edit your videos so the end flows perfectly into the start for high retention.',
      'Phase 2: The Pinned Comment - Put your affiliate link in the Pinned Comment, not just the description.',
      'Phase 3: Keyword Titles - Use specific titles like "Zara vs H&M Try-on Haul" for search intent.'
    ],
    actionItems: [
      'Upload 10 previous TikToks to Shorts with unique titles.',
      'Add a "Subscribe for Links" call-to-action in the last 3 seconds.',
      'Create a playlist called "Luxury Essentials" for binge-watching.'
    ]
  },
  {
    id: 'reddit-authority',
    title: 'Reddit: Community Trust',
    platform: 'General',
    description: 'The most skeptical but high-converting audience if you provide genuine value.',
    icon: 'MessageSquare',
    strategies: [
      'Phase 1: Native Engagement - Don\'t post links. Join r/fashion, r/luxury, r/streetwear and comment 20x daily.',
      'Phase 2: The "Hero" Post - Write a massive guide (e.g., "The only 5 bags you need for 2024") without links.',
      'Phase 3: Profile Link - Put your bridge page URL in your Reddit bio. People will check your profile if you are helpful.'
    ],
    actionItems: [
      'Join 10 niche subreddits related to your fashion style.',
      'Upvote and comment on 5 threads daily providing specific styling advice.',
      'Share a "No-Link" gallery of your personal wardrobe to build karma.'
    ]
  },
  {
    id: 'lemon8-curation',
    title: 'Lemon8: Aesthetic Guides',
    platform: 'General',
    description: 'A mix of Instagram and Pinterest. Heavily focused on "How-To" and "Review" carousels.',
    icon: 'Sparkles',
    strategies: [
      'Phase 1: Carousel Guides - Create "X Steps to Style Y" posts. 7 images is the sweet spot.',
      'Phase 2: The "Price Tag" Edit - Use the Lemon8 built-in tags to show prices on clothing items.',
      'Phase 3: Niche Tagging - Use #OOTD, #FashionInspo, and #LuxuryFinds consistently.'
    ],
    actionItems: [
      'Post a "What\'s in my bag" flat-lay photo.',
      'Create a "Dupes vs Originals" comparison guide.',
      'Follow 50 creators in the "Lifestyle" and "Fashion" categories.'
    ]
  },
  {
    id: 'substack-newsletter',
    title: 'Substack: The Long-form Edit',
    platform: 'General',
    description: 'Build a recurring, dedicated readership. Best for high-ticket affiliate products.',
    icon: 'Mail',
    strategies: [
      'Phase 1: The Weekly Digest - Send a Friday email: "5 Things I Loved This Week".',
      'Phase 2: Deep Dives - Write 1,000 words on the "Art of the Capsule Wardrobe".',
      'Phase 3: Exclusive Drops - Share items that are almost sold out to your subscribers first.'
    ],
    actionItems: [
      'Set up a free Substack and import your current email contacts.',
      'Write your first "Welcome" post explaining your curation criteria.',
      'Add a "Newsletter" link to your bridge page menu.'
    ]
  },
  {
    id: 'ltk-integration',
    title: 'LTK: The Influencer Engine',
    platform: 'General',
    description: 'The industry standard for fashion affiliates. Syncs directly with your shoppable photos.',
    icon: 'ShoppingBag',
    strategies: [
      'Phase 1: Application - Apply for LTK Creator status. Show high-quality, high-engagement Instagram content.',
      'Phase 2: Mirror Selfies - Simple, clear mirror selfies are the highest-converting content on LTK.',
      'Phase 3: Widget Sync - Embed your LTK feed onto your bridge page (using Custom HTML in Portal).'
    ],
    actionItems: [
      'Upload 10 high-quality "Outfits of the Day" to your LTK profile.',
      'Cross-promote your LTK link in your Instagram bio.',
      'Tag every single item in your photos, including "similar" items for sold-out pieces.'
    ]
  },
  {
    id: 'snapchat-shows',
    title: 'Snapchat: Behind the Scenes',
    platform: 'General',
    description: 'High urgency, high loyalty. Use for flash sales and limited time deals.',
    icon: 'Ghost',
    strategies: [
      'Phase 1: The Public Profile - Create a Public Profile to appear in the "Spotlight" feed.',
      'Phase 2: Raw Reality - Film your shopping trips. No filters, just real-time curation.',
      'Phase 3: Snap Maps - Tag luxury locations (e.g., Melrose Arch) to appear to local high-net-worth users.'
    ],
    actionItems: [
      'Post a "10-Second Review" of a new product to Spotlight.',
      'Add your WhatsApp link to your Snapchat Bio.',
      'Run a "Deal of the Day" series that expires in 24 hours.'
    ]
  },
  {
    id: 'quora-questions',
    title: 'Quora: Solving Style Problems',
    platform: 'General',
    description: 'Evergreen traffic from Google. Answers you write today can drive traffic for years.',
    icon: 'HelpCircle',
    strategies: [
      'Phase 1: Niche Searching - Search for "What should I wear to X?" or "Best shoes for Y?".',
      'Phase 2: Expert Answering - Write 300+ word answers with high-quality images.',
      'Phase 3: Profile Funneling - Put "Founder of Kasi Couture" in your bio with a link.'
    ],
    actionItems: [
      'Answer 2 questions daily in the "Fashion Trends" and "Personal Styling" spaces.',
      'Create a "Space" (Quora version of a group) for your brand.',
      'Request to answer top questions from luxury brand followers.'
    ]
  },
  {
    id: 'medium-blogging',
    title: 'Medium: SEO Authority',
    platform: 'General',
    description: 'Rank for high-competition keywords. Use Medium\'s domain authority to your advantage.',
    icon: 'FileText',
    strategies: [
      'Phase 1: Trend Jacking - Write about "The Rise of [New Trend]" as it happens.',
      'Phase 2: Listicles - "10 Accessories That Will Triple Your Outfit Value".',
      'Phase 3: Internal Linking - Link back to your bridge page product categories within the text.'
    ],
    actionItems: [
      'Repurpose your Substack articles for Medium.',
      'Submit your stories to large publications like "The Startup" or "Fashion Forward".',
      'Add a call-to-action at the end of every post.'
    ]
  },
  {
    id: 'discord-community',
    title: 'Discord: The VIP Lounge',
    platform: 'General',
    description: 'Create an exclusive "Inner Circle" for your top customers and fans.',
    icon: 'Gamepad2',
    strategies: [
      'Phase 1: The Walled Garden - Invite only your most active Instagram commenters.',
      'Phase 2: "Ask Me Anything" - Host weekly voice chats about upcoming fashion trends.',
      'Phase 3: Early Access - Post new curation links in Discord 1 hour before the public site.'
    ],
    actionItems: [
      'Set up channels for "Style-Advice", "New-Drops", and "Inspo".',
      'Create a "Role" for verified buyers to build prestige.',
      'Use a bot to auto-post your TikToks/Instagrams to a dedicated channel.'
    ]
  },
  {
    id: 'telegram-alerts',
    title: 'Telegram: Flash Alerts',
    platform: 'General',
    description: 'Zero algorithm interference. 100% reach to your subscribers.',
    icon: 'Send',
    strategies: [
      'Phase 1: The Signal - Send short "Price Drop Alert" messages with a direct link.',
      'Phase 2: The Poll - Ask "Should I curate more of X or Y?" to get instant feedback.',
      'Phase 3: Large File Sharing - Share high-res lookbooks as PDFs that don\'t lose quality.'
    ],
    actionItems: [
      'Start a Public Channel called "[Brand] Elite Alerts".',
      'Post a "Welcome" video explaining how the channel works.',
      'Add the Telegram link to your bridge page contact section.'
    ]
  },
  {
    id: 'facebook-groups',
    title: 'Facebook: The Community Lead',
    platform: 'General',
    description: 'Leveraging existing communities. Don\'t build your own yet; join others.',
    icon: 'Facebook',
    strategies: [
      'Phase 1: Identifying Groups - Join "Bridal South Africa" or "Corporate Chic" groups.',
      'Phase 2: The "Giving" Strategy - Answer 10 questions for every 1 link you post.',
      'Phase 3: DM Strategy - If someone asks for a recommendation, send a polite DM with your link.'
    ],
    actionItems: [
      'Find 5 active Facebook groups with over 50k members in your niche.',
      'Set up a "Facebook Page" to run "Boosted Posts" for your best curated items.',
      'Share one "Value Post" daily to these groups.'
    ]
  },
  {
    id: 'twitter-hype',
    title: 'Twitter (X): Real-time Critique',
    platform: 'General',
    description: 'Fast-paced fashion critique. Great for "Red Carpet" events and award shows.',
    icon: 'Twitter',
    strategies: [
      'Phase 1: Live Tweeting - Review outfits during events like the MET Gala or SA Fashion Week.',
      'Phase 2: Threads - Create "Outfit Breakdown" threads showing how to recreate the look.',
      'Phase 3: The "Hot Take" - Post controversial opinions on brand rebrands to spark debate.'
    ],
    actionItems: [
      'Follow 50 fashion journalists and editors.',
      'Use #FashionTwitter and #StyleThreads in every post.',
      'Set up a "List" of your competitors to track their announcements.'
    ]
  },
  {
    id: 'twitch-styling',
    title: 'Twitch: Live Styling Sessions',
    platform: 'General',
    description: 'Interactive long-form content. Build extreme loyalty through real-time chat.',
    icon: 'Activity',
    strategies: [
      'Phase 1: The "Get Ready With Me" (GRWM) - Live stream your morning styling routine.',
      'Phase 2: The Closet Audit - Critique your followers\' outfits in real-time (with their permission).',
      'Phase 3: Shop-along - Browse online stores live and discuss why you would or wouldn\'t buy items.'
    ],
    actionItems: [
      'Schedule a 2-hour "Style Sunday" stream every week.',
      'Set up "Nightbot" to auto-post your affiliate links every 15 minutes.',
      'Create a "Goal" on screen for "New Outfits Curated".'
    ]
  },
  {
    id: 'linkedin-luxury',
    title: 'LinkedIn: The Professional Buyer',
    platform: 'General',
    description: 'High-income audience. Focus on "Power Dressing" and "Corporate Luxury".',
    icon: 'Linkedin',
    strategies: [
      'Phase 1: Thought Leadership - Write about "How dressing well impacts your confidence".',
      'Phase 2: The PDF Carousel - Create multi-page "Workwear Capsule" guides.',
      'Phase 3: Engagement - Comment on "Promotion" posts with specific outfit congratulations.'
    ],
    actionItems: [
      'Post a "Monday Motivation" outfit every week.',
      'Connect with 20 Luxury Brand Managers daily.',
      'Update your LinkedIn Headline to include "Fashion Curator".'
    ]
  },
  {
    id: 'sms-marketing',
    title: 'SMS: The Direct Hit',
    platform: 'General',
    description: '98% open rates. Use for the most exclusive "Sold Out" risk items.',
    icon: 'Phone',
    strategies: [
      'Phase 1: Consent - Never send without permission. Use a "Text for VIP Access" popup.',
      'Phase 2: Scarcity - "Only 2 left! Click to grab it: [Link]".',
      'Phase 3: Personalization - Use the customer\'s name in the text.'
    ],
    actionItems: [
      'Set up a simple SMS list using a tool like Twilio or Klaviyo.',
      'Offer a "VIP Only" deal for people who join the SMS list.',
      'Send your first "Style Alert" to your top 10 clients.'
    ]
  },
  {
    id: 'whatsapp-vip',
    title: 'WhatsApp: Personal Concierge',
    platform: 'WhatsApp',
    description: 'Intimate, 1-on-1 selling. Perfect for high-ticket items.',
    icon: 'MessageCircle',
    strategies: [
      'Phase 1: Status Selling - Post new drops to your WhatsApp Status daily.',
      'Phase 2: Broadcast Lists - Send personalized "I thought of you" messages to VIPs.',
      'Phase 3: Voice Note Styling - Send 30-second audio tips on how to wear a specific piece.'
    ],
    actionItems: [
      'Create a WhatsApp Business account.',
      'Add the WhatsApp button to your site settings.',
      'Post your first "Status" update showing a "Behind the Scenes" of your curation.'
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
  webhookUrl: ''
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
