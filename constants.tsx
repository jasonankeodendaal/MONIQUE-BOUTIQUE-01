
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
  },
  {
    id: 'tiktok-growth',
    title: 'TikTok: The Virality Engine',
    platform: 'TikTok',
    description: 'High-volume, raw content designed for rapid scaling. TikTok is where you build massive awareness in days, not months.',
    icon: 'Video',
    strategies: [
      'The 3-Second Hook Rule: You have 3 seconds to stop the scroll. Show the "After" (the styled look) first, then the "Before" (the package or unstyled item).',
      'ASMR Unboxing: Focus on the sounds of the Shein packaging, the fabric rustle, and the shoe clicks. Sensory content has a 40% higher completion rate.',
      'SEO Tagging: TikTok is a search engine. Use captions like "Affordable Fall Outfits 2024" rather than "My new clothes". Use 3-5 hyper-specific hashtags.',
      'The "Stitch" Strategy: Find trending fashion critiques or "How to style" videos. Stitch them with your own curation to leverage existing viral momentum.'
    ],
    actionItems: [
      'Post 3x daily for 21 days to find your "Viral Niche".',
      'Create a pinned video explaining exactly how to use your Bridge Page link.',
      'Reply to every comment with a video response to double your engagement metrics.',
      'Use the "Search Bar" to find trending "Shein Hauls" and recreate the top-performing styles.'
    ]
  },
  {
    id: 'pinterest-seo',
    title: 'Pinterest: Visual Search SEO',
    platform: 'Pinterest',
    description: 'Pinterest is a long-term traffic play. Unlike Instagram, Pins have a lifespan of 6-12 months, driving passive traffic while you sleep.',
    icon: 'Pin',
    strategies: [
      'The 2:3 Vertical Standard: All images must be vertical. Use Canva to add "Clean Typography" overlays explaining what the pin is (e.g., "5 Minimalist Work Outfits").',
      'Board Architecture: Create boards for specific "Vibes" (e.g., "Old Money Aesthetic", "Streetwear Staples"). Pin 10-20 high-quality images per board.',
      'Idea Pins for Retention: Use Pinterest Idea Pins (like Stories) to show multi-page styling guides. These are currently favored by the algorithm.',
      'Keyword Rich Descriptions: Treat your Pin descriptions like a blog post. Use keywords that people actually search for in the Pinterest search bar.'
    ],
    actionItems: [
      'Claim your Bridge Page domain in Pinterest settings for "Rich Pins" (automatic price updates).',
      'Create 10 niche boards and pin 5 items to each today.',
      'Design 10 templates in Canva that feature your brand logo and colors.',
      'Schedule 5 pins per day using a tool like Tailwind to maintain consistency.'
    ]
  },
  {
    id: 'youtube-shorts',
    title: 'YouTube Shorts: Evergreen Video',
    platform: 'General',
    description: 'Repurpose your TikToks and Reels here. YouTube Shorts are indexed by Google Search, giving you evergreen visibility.',
    icon: 'Youtube',
    strategies: [
      'Looping Content: Edit for the "Infinite Loop". If the video never feels like it ends, retention stays at 100%+, which triggers the "Shorts Shelf".',
      'The Pinned Comment Funnel: YouTube descriptions are often ignored on mobile. Always put your Bridge Page link in the "Pinned Comment" for easy access.',
      'Search-Optimized Titles: Use titles like "SHEIN Summer Dress Haul under $30" to capture search intent from Google.'
    ],
    actionItems: [
      'Upload your top 10 best-performing TikToks to YouTube Shorts.',
      'Add a custom "End Screen" graphic to your long-form videos if you have any.',
      'Check "YouTube Analytics" weekly to see which search terms are leading people to your curation.'
    ]
  },
  {
    id: 'reddit-authority',
    title: 'Reddit: Community Trust',
    platform: 'General',
    description: 'The most skeptical but high-converting audience. Focus on being a "Helpful Expert" rather than a "Salesperson".',
    icon: 'MessageSquare',
    strategies: [
      'The "No-Link" First Rule: Spend 2 weeks purely answering questions in r/fashion and r/luxury without posting links. Build "Karma" and trust.',
      'The Deep Dive Guide: Write massive text-based guides (e.g., "How to spot quality in fast fashion"). At the end, mention your site as a personal resource.',
      'Subreddit Research: Monitor r/shein and r/affiliate to see what common problems people have, then solve them on your Bridge Page.'
    ],
    actionItems: [
      'Join 10 niche fashion subreddits and contribute 3 helpful comments daily.',
      'Create a "Hero Post" guide with no links to build your account authority.',
      'Update your Reddit Bio to include a subtle link to your Bridge Page.'
    ]
  },
  {
    id: 'lemon8-curation',
    title: 'Lemon8: Aesthetic Guides',
    platform: 'General',
    description: 'A hybrid of Instagram and Pinterest. Focus on high-aesthetic "Magazine Style" carousels.',
    icon: 'Sparkles',
    strategies: [
      'The Magazine Layout: Use Lemon8 built-in templates. Add arrows, price tags, and text callouts directly onto your photos.',
      'Honest Reviews: Lemon8 users value "Realness". Post "What I ordered vs What I got" to build massive credibility.',
      'Hyper-Niche Tagging: Use the maximum number of relevant tags for every post to appear in the "For You" feed.'
    ],
    actionItems: [
      'Post your first "What\'s in my bag" or "Outfit Breakdown" carousel.',
      'Follow 50 creators in the "Lifestyle" and "Fashion" categories.',
      'Engage with 10 trending posts daily to signal your activity to the algorithm.'
    ]
  },
  {
    id: 'substack-newsletter',
    title: 'Substack: The Long-form Edit',
    platform: 'General',
    description: 'Build a recurring, dedicated readership. This is where you sell high-ticket items and build deep brand loyalty.',
    icon: 'Mail',
    strategies: [
      'The Friday Curation: Send a weekly email titled "The Weekly Edit: 5 Things I\'m Loving". This creates a predictable habit for your readers.',
      'Exclusive Insight: Share "Early Access" links or items that are almost sold out to make your subscribers feel like VIPs.',
      'Direct Reader Interaction: Use the "Threads" feature to ask your readers what they want you to curate next.'
    ],
    actionItems: [
      'Setup your Substack and import any existing email contacts.',
      'Write a "Welcome" post explaining what your newsletter offers.',
      'Set a goal to gain your first 50 subscribers by cross-promoting on Instagram.'
    ]
  },
  {
    id: 'ltk-integration',
    title: 'LTK: Influencer Industry Standard',
    platform: 'General',
    description: 'The "Gold Standard" for fashion affiliates. Syncs your shoppable photos with a global audience of shoppers.',
    icon: 'ShoppingBag',
    strategies: [
      'The Mirror Selfie Goldmine: Simple, unedited mirror selfies are the highest-converting images on LTK. Don\'t overproduce.',
      'Tagging Similar Items: If an item is sold out, tag 3-5 "Similar Picks". This ensures you don\'t lose a commission if the primary item is unavailable.',
      'The "LTK Exclusive" Badge: Tell your Instagram followers that specific links are "Only on my LTK" to drive traffic to your profile there.'
    ],
    actionItems: [
      'Apply for LTK Creator status if you have over 1k followers on Instagram.',
      'Upload 10 high-quality OOTDs with at least 5 tags per photo.',
      'Add your LTK profile link to your Bridge Page "Social Links" section.'
    ]
  },
  {
    id: 'snapchat-shows',
    title: 'Snapchat: Behind the Scenes',
    platform: 'General',
    description: 'Urgency and intimacy. Use Snapchat for "Flash Sales" and "Real-time" shopping trips.',
    icon: 'Ghost',
    strategies: [
      'The 24-Hour Timer: Post links that you claim will "Expire" or are "Limited Time Only" to trigger FOMO (Fear of Missing Out).',
      'Shopping With Me: Take your phone into stores or film yourself browsing Shein live. Talk through your thought process.',
      'Snap Map Tags: Tag popular luxury locations to appear to high-net-worth individuals browsing the map.'
    ],
    actionItems: [
      'Create a Snapchat Public Profile for "Spotlight" access.',
      'Post 5 "Spotlight" videos of your best unboxings.',
      'Add your WhatsApp number to your Snapchat bio for direct consulting inquiries.'
    ]
  },
  {
    id: 'quora-questions',
    title: 'Quora: Problem Solving',
    platform: 'General',
    description: 'Evergreen traffic from people actively looking for answers. Solve their style problems and they will follow your links.',
    icon: 'HelpCircle',
    strategies: [
      'The "Value-First" Answer: Write 500+ words answering a specific style question. Include your Bridge Page link only at the end as "Further Reading".',
      'Authority Building: Follow topics like "Fashion Trends", "Shein Reviews", and "Personal Styling". Answer 1-2 questions daily.',
      'The "Best Of" Listicles: Answer questions like "What are the best summer dresses?" with a curated list from your site.'
    ],
    actionItems: [
      'Search for "Shein Reviews" on Quora and answer the top 3 questions.',
      'Setup a Quora "Space" for your brand to aggregate your answers.',
      'Optimize your Quora profile with your Bridge Page URL.'
    ]
  },
  {
    id: 'medium-blogging',
    title: 'Medium: SEO Authority',
    platform: 'General',
    description: 'Leverage Medium\'s massive domain authority to rank for high-competition keywords on Google.',
    icon: 'FileText',
    strategies: [
      'The "Ultimate Guide" Format: Write 1,500+ word articles like "The Ultimate Guide to Shein Wedding Guest Dresses".',
      'Internal Linking: Link to your different Bridge Page categories within the text of your Medium articles.',
      'Publication Submission: Submit your fashion articles to large publications like "The Startup" to reach their thousands of followers.'
    ],
    actionItems: [
      'Repurpose your Substack articles for Medium.',
      'Include 3-5 high-quality images per article with affiliate captions.',
      'Add a "Call to Action" at the end of every post pointing to your Bridge Page.'
    ]
  },
  {
    id: 'discord-community',
    title: 'Discord: The VIP Lounge',
    platform: 'General',
    description: 'Create a walled garden for your most loyal fans. High engagement and high repeat-click rates.',
    icon: 'Gamepad2',
    strategies: [
      'The "Exclusive Drop" Channel: Create a channel where you post new finds 1 hour before social media.',
      'Live Styling Calls: Host voice chats where you help members style their own outfits in real-time.',
      'Automated Alerts: Use bots to notify your Discord members whenever you add a new product to this website.'
    ],
    actionItems: [
      'Setup your Discord server with channels for "Style-Advice" and "New-Drops".',
      'Invite your top 10 most active Instagram commenters to join the "VIP Lounge".',
      'Create "Roles" for members based on their level of interaction.'
    ]
  },
  {
    id: 'telegram-alerts',
    title: 'Telegram: Flash Alerts',
    platform: 'General',
    description: 'Direct, algorithm-free communication. 100% of your subscribers will see your messages.',
    icon: 'Send',
    strategies: [
      'The "Price Drop" Bot: Send short, punchy messages: "🚨 PRICE DROP: The Midnight Silk is now $15! [Link]".',
      'Polls for Curation: Ask your audience: "Should I curate more bags or shoes this week?". Engagement builds loyalty.',
      'Broadcast-Only Channel: Keep it clean. Only post high-value links and 1 high-quality photo.'
    ],
    actionItems: [
      'Start a Public Telegram Channel.',
      'Post a "Pinned Message" explaining how to turn on notifications for your alerts.',
      'Add the Telegram link to your Bridge Page footer.'
    ]
  },
  {
    id: 'facebook-groups',
    title: 'Facebook: Community Lead',
    platform: 'General',
    description: 'Leverage massive existing communities. Don\'t build your own yet; join others and be the helpful expert.',
    icon: 'Facebook',
    strategies: [
      'The "Style Consultant" Persona: Join groups like "Shein Addicts" and "Fashion over 30". Answer 10 posts daily with genuine advice.',
      'Native Uploads: Don\'t just share links. Upload your photos directly to Facebook, and put the link in the first comment.',
      'DM-to-Sale: If someone asks "Where is that from?", send them a polite DM with your Bridge Page link.'
    ],
    actionItems: [
      'Join 5 active Facebook groups related to your fashion niche.',
      'Post one "Value-Only" outfit inspiration daily to these groups.',
      'Setup a Facebook Page to run $5/day "Boosted Posts" for your best-performing items.'
    ]
  },
  {
    id: 'twitter-hype',
    title: 'Twitter (X): Real-time Critique',
    platform: 'General',
    description: 'Fast-paced fashion critique. Great for "Newsjacking" trending fashion events.',
    icon: 'Twitter',
    strategies: [
      'Live-Tweeting Events: Tweet your thoughts during the Met Gala or Fashion Week. Use trending hashtags to get discovered.',
      'Thread Curation: Create a thread: "1/10 The best Shein dupes I found this week. 🧵". People love scrolling through threads.',
      'Engagement with Brands: Tag the brands you curation. Sometimes they retweet, giving you massive free exposure.'
    ],
    actionItems: [
      'Follow 50 major fashion editors and journalists.',
      'Use #FashionTwitter and #StyleThreads in every post.',
      'Post 1 "Outfit Thread" every Sunday.'
    ]
  },
  {
    id: 'twitch-styling',
    title: 'Twitch: Live Styling Sessions',
    platform: 'General',
    description: 'Interactive long-form content. Build extreme loyalty through real-time chat and styling.',
    icon: 'Activity',
    strategies: [
      'The "Shop With Me" Stream: Share your screen and browse Shein live. Explain why you are skipping certain items and picking others.',
      'Closet Audits: Have viewers send in photos of their clothes, and you style them using items from your Bridge Page.',
      'Affiliate Commands: Use a bot so when someone types "!dress", it automatically posts your current favorite link.'
    ],
    actionItems: [
      'Schedule a weekly 2-hour "Style Sunday" stream.',
      'Setup Nightbot with commands for your most popular curated categories.',
      'Design custom "Overlays" for your stream that feature your Bridge Page URL.'
    ]
  },
  {
    id: 'linkedin-luxury',
    title: 'LinkedIn: The Professional Buyer',
    platform: 'General',
    description: 'High-income audience. Focus on "Power Dressing" and "Corporate Luxury".',
    icon: 'Linkedin',
    strategies: [
      'The "Confidence & Clothing" Angle: Write about how dressing well impacts your career performance and mental health.',
      'The "Workwear Capsule" PDF: Create a 5-page PDF guide and offer it for free in exchange for visiting your site.',
      'Corporate Gifting: Curate lists of "Professional Accessories" that make great corporate gifts.'
    ],
    actionItems: [
      'Update your LinkedIn Headline to "Fashion Curator & Style Strategist".',
      'Post one "Monday Motivation" outfit every week.',
      'Connect with 20 Luxury Brand Managers daily to build industry connections.'
    ]
  },
  {
    id: 'sms-marketing',
    title: 'SMS: The Direct Hit',
    platform: 'General',
    description: '98% open rates. Use for your absolute best deals and most exclusive content.',
    icon: 'Phone',
    strategies: [
      'The "VIP Only" Deal: Never send more than 1 text per week. Make it feel like an exclusive secret.',
      'Personalized Greetings: Use the subscriber\'s name: "Hey [Name], I just found the perfect dress for you... [Link]".',
      'Automated Welcome: Send an instant text with a 10% discount code (if available) when someone signs up.'
    ],
    actionItems: [
      'Setup a simple SMS list using a tool like Twilio or SimpleTexting.',
      'Add a "Text ME" button to your Bridge Page contact section.',
      'Send your first "Style Alert" to your top 10 most loyal clients.'
    ]
  },
  {
    id: 'whatsapp-vip',
    title: 'WhatsApp: Personal Concierge',
    platform: 'WhatsApp',
    description: 'The most intimate selling channel. Perfect for high-ticket items and repeat customers.',
    icon: 'MessageCircle',
    strategies: [
      'WhatsApp Status Selling: Post "Behind the scenes" photos and "New Drops" to your status daily. People view these more than stories.',
      'Broadcast Lists: Create lists of 256 people. Send them a personal voice note once a month with a style tip.',
      '1-on-1 Consultations: Offer a "15-minute quick styling" via WhatsApp for your top-tier customers.'
    ],
    actionItems: [
      'Switch to a WhatsApp Business account for professional features.',
      'Add the WhatsApp button to your Bridge Page "Identity" settings.',
      'Post your first "Status" update showing your current favorite curation.'
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
