
export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description?: string;
  createdBy?: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  createdBy?: string;
}

export interface MediaFile {
  id: string;
  url: string;
  name: string;
  type: string; // mime type
  size: number;
}

export interface DiscountRule {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface Review {
  id: string;
  productId: string; // Foreign Key
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  affiliateLink: string;
  categoryId: string;
  subCategoryId: string;
  description: string;
  features?: string[]; // Bullet points for "Why we love it"
  specifications?: Record<string, string>; // Key-value pairs like Material, Fit, etc.
  media: MediaFile[]; 
  discountRules?: DiscountRule[];
  // reviews removed for normalization
  createdAt: number;
  createdBy?: string;
  
  // Commerce
  isDirectSale?: boolean;
  stockQuantity?: number;
}

export interface ProductStats {
  productId: string;
  views: number;
  clicks: number;
  shares: number; // Added shares
  totalViewTime: number; // in seconds
  lastUpdated: number;
}

export interface CarouselSlide {
  id: string;
  image: string; // url (video or image)
  type: 'image' | 'video';
  title: string;
  subtitle: string;
  cta: string;
  createdBy?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  subject: string;
  message: string;
  createdAt: number;
  status: 'unread' | 'read' | 'archived';
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconUrl: string;
}

export interface SiteSettings {
  // Brand & Nav
  companyName: string;
  slogan: string; // Added Slogan
  companyLogo: string; // Text fallback
  companyLogoUrl?: string; // PNG Upload
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  navHomeLabel: string;
  navProductsLabel: string;
  navAboutLabel: string;
  navContactLabel: string;
  navDashboardLabel: string;

  // Contact Info
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  socialLinks: SocialLink[];

  // Footer
  footerDescription: string;
  footerCopyrightText: string;

  // Home Page Content
  homeHeroBadge: string;
  homeAboutTitle: string;
  homeAboutDescription: string;
  homeAboutImage: string;
  homeAboutCta: string;
  homeCategorySectionTitle: string;
  homeCategorySectionSubtitle: string;
  homeTrustSectionTitle: string;
  
  homeTrustItem1Title: string;
  homeTrustItem1Desc: string;
  homeTrustItem1Icon: string; 

  homeTrustItem2Title: string;
  homeTrustItem2Desc: string;
  homeTrustItem2Icon: string; 

  homeTrustItem3Title: string;
  homeTrustItem3Desc: string;
  homeTrustItem3Icon: string; 

  // Products Page Content
  productsHeroTitle: string;
  productsHeroSubtitle: string;
  productsHeroImage: string; // Legacy support
  productsHeroImages: string[]; // New: Array of images for carousel
  productsSearchPlaceholder: string;

  // About Page Content
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutMainImage: string;
  
  // New Granular About Fields
  aboutEstablishedYear: string;
  aboutFounderName: string;
  aboutLocation: string;

  aboutHistoryTitle: string;
  aboutHistoryBody: string;
  
  aboutMissionTitle: string;
  aboutMissionBody: string;
  aboutMissionIcon: string; 
  
  aboutCommunityTitle: string;
  aboutCommunityBody: string;
  aboutCommunityIcon: string; 
  
  aboutIntegrityTitle: string;
  aboutIntegrityBody: string;
  aboutIntegrityIcon: string; 

  aboutSignatureImage: string; 
  aboutGalleryImages: string[]; 

  // Contact Page Content
  contactHeroTitle: string;
  contactHeroSubtitle: string;
  contactFormNameLabel: string;
  contactFormEmailLabel: string;
  contactFormSubjectLabel: string;
  contactFormMessageLabel: string;
  contactFormButtonText: string;
  
  // New Contact Editable Fields
  contactInfoTitle: string;
  contactAddressLabel: string;
  contactHoursLabel: string;
  contactHoursWeekdays: string;
  contactHoursWeekends: string;

  // Legal Content
  disclosureTitle: string;
  disclosureContent: string;
  privacyTitle: string;
  privacyContent: string;
  termsTitle: string;
  termsContent: string;

  // Integrations
  emailJsServiceId?: string;
  emailJsTemplateId?: string;
  emailJsPublicKey?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  tiktokPixelId?: string;
  pinterestTagId?: string; // New
  amazonAssociateId?: string;
  webhookUrl?: string; // Zapier/Make

  // Commerce & Payments
  enableDirectSales: boolean;
  currency: string;
  yocoPublicKey: string;
  payfastMerchantId: string;
  payfastMerchantKey: string;
  payfastSaltPassphrase: string;
  zapierWebhookUrl: string;
  bankDetails: string;
}

export interface PermissionNode {
  id: string;
  label: string;
  description?: string;
  children?: PermissionNode[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin';
  permissions: string[]; // Array of Permission IDs (flattened)
  password?: string; // Permanent password (stored locally for demo/local mode)
  createdAt: number;
  lastActive?: number;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface TrainingModule {
  id: string;
  title: string;
  platform: string;
  description: string;
  strategies: string[];
  actionItems: string[];
  icon: string;
}

export interface SystemLog {
  id: string;
  timestamp: number;
  type: 'SYNC' | 'UPDATE' | 'DELETE' | 'ERROR' | 'AUTH';
  target: string;
  message: string;
  sizeBytes?: number;
  status: 'success' | 'failed';
}

export interface StorageStats {
  dbSize: number; // Bytes
  mediaSize: number; // Bytes
  totalRecords: number;
  mediaCount: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  total: number;
  status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'yoco' | 'payfast' | 'manual_eft';
  createdAt: number;
  items?: OrderItem[];
  // New Tracking Fields
  courierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface UserAddress {
  building?: string;
  street: string;
  suburb?: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface TrafficLog {
  id?: string;
  ip?: string;
  city?: string;
  device?: string;
  timestamp: number;
  source?: string;
  page?: string;
  type?: string;
  text?: string;
}

export interface ProductEvent {
  type: 'view' | 'click' | 'share';
  productId: string;
  timestamp: number;
  userId?: string;
}

export interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  // Global Data State
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  heroSlides: CarouselSlide[];
  enquiries: Enquiry[]; // Usually admin only, but kept in context for simplicity
  admins: AdminUser[];
  stats: ProductStats[];
  orders: Order[]; // New
  // Actions
  refreshAllData: () => Promise<void>;
  updateData: (table: string, data: any) => Promise<boolean>;
  deleteData: (table: string, id: string) => Promise<boolean>;
  // System State
  user: any;
  loadingAuth: boolean;
  isLocalMode: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  logEvent: (type: 'view' | 'click' | 'share' | 'system', label: string, source?: string) => void;
  
  // Monitoring
  connectionHealth: { status: 'online' | 'offline', latency: number, message: string } | null;
  systemLogs: SystemLog[];
  storageStats: StorageStats;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
}
