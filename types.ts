
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
  altText?: string;
}

export interface DiscountRule {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
}

export interface Review {
  id: string;
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
  wasPrice?: number;
  affiliateLink: string;
  categoryId: string;
  subCategoryId: string;
  description: string;
  features?: string[]; // Bullet points for "Why we love it"
  specifications?: Record<string, string>; // Key-value pairs like Material, Fit, etc.
  media: MediaFile[]; 
  discountRules?: DiscountRule[];
  reviews?: Review[];
  tags: string[];
  createdAt: number;
  createdBy?: string;
  archivedAt?: number;
}

export interface ProductHistory extends Product {
  archivedAt: number;
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

export interface ContactFaq {
  question: string;
  answer: string;
}

export interface TrainingStep {
  title: string;
  description: string;
  mediaUrl?: string;
  type: 'image' | 'video';
}

export interface TrainingModule {
  id: string;
  title: string;
  platform: 'Instagram' | 'Pinterest' | 'TikTok' | 'WhatsApp' | 'SEO' | 'General' | 'Facebook' | 'YouTube' | 'LinkedIn' | 'Twitter' | 'Threads' | 'Snapchat' | 'Email';
  description: string;
  strategies: string[];
  actionItems: string[];
  icon: string;
  steps: TrainingStep[];
  // Added missing metadata fields for synchronization
  createdAt?: number;
  createdBy?: string;
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

  // Layout Controls
  departmentsLayout?: 'grid' | 'dropdown';
  subcategoryLayout?: 'wrapped' | 'scrollable-rows';

  // Contact Info
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  socialLinks: SocialLink[];
  contactFaqs: ContactFaq[];

  // Footer
  footerDescription: string;
  footerCopyrightText: string;
  footerNavHeader: string;
  footerPolicyHeader: string;
  footerCreatorRole: string;
  footerSocialsLabel: string;

  // Home Page Content
  homeHeroBadge: string;
  homeAboutTitle: string;
  homeAboutDescription: string;
  homeAboutImage: string;
  homeAboutCta: string;
  homeCategorySectionTitle: string;
  homeCategorySectionSubtitle: string;
  homeNicheHeader: string;
  homeNicheSubheader: string;
  homeTrustHeader: string;
  homeTrustSubheader: string;
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
  homeReadStoryBtn: string;
  homeAboutCuratorLabel: string;
  homeAboutNarrativeLabel: string;
  homeCategoryShopByLabel: string;
  homeCategoryPortfolioLabel: string;
  homeCategoryDiscoverLabel: string;

  // Products Page Content
  productsHeroTitle: string;
  productsHeroSubtitle: string;
  productsHeroImage: string; // Legacy support
  productsHeroImages: string[]; // New: Array of images for carousel
  productsHeroImagesArray?: string[]; // Consistency check
  productsSearchPlaceholder: string;

  // About Page Content
  aboutHeroTitle: string;
  aboutHeroSubtitle: string;
  aboutMainImage: string;
  
  // New Granular About Fields
  aboutEstablishedYear: string;
  aboutEstablishedDate?: number;
  aboutFounderName: string;
  aboutLocation: string;

  aboutHistoryBadge: string;
  aboutHistoryTitle: string;
  aboutHistoryBody: string;
  aboutManifestoBadge: string;
  aboutManifestoTitle: string;
  
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
  aboutEstLabel: string;
  aboutVerifiedNarrativeLabel: string;
  aboutCuratorsEditTitle: string;
  aboutCuratorsEditDesc: string;
  aboutExploreCollectionBtn: string;
  aboutPortfolioVerifiedLabel: string;

  // Contact Page Content
  contactHeroTitle: string;
  contactHeroSubtitle: string;
  contactFormNameLabel: string;
  contactFormEmailLabel: string;
  contactFormSubjectLabel: string;
  contactFormMessageLabel: string;
  contactFormButtonText: string;
  contactSuccessTitle: string;
  contactConciergeLabel: string;
  contactSuccessMessage: string;
  contactSubmitNewBtn: string;
  contactVerifiedLabel: string;
  contactWhatsappLabel: string;
  contactFollowUsLabel: string;
  contactFaqTitle: string;
  contactLastUpdatedLabel: string;
  
  // New Contact Editable Fields
  contactInfoTitle: string;
  contactAddressLabel: string;
  contactEmailLabel: string;
  contactPhoneLabel: string;
  contactHoursLabel: string;
  contactHoursWeekdays: string;
  contactHoursWeekends: string;

  // Admin Login Configuration
  adminLoginHeroImage?: string;
  adminLoginAccentEnabled?: boolean;

  // Legal Content
  disclosureTitle: string;
  disclosureContent: string;
  privacyTitle: string;
  privacyContent: string;
  termsTitle: string;
  termsContent: string;

  // Integrations & Scripts
  emailJsServiceId?: string;
  emailJsTemplateId?: string;
  emailJsPublicKey?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  tiktokPixelId?: string;
  pinterestTagId?: string; // New
  amazonAssociateId?: string;
  webhookUrl?: string; // Zapier/Make
  gscVerificationId?: string;
  customHeaderScripts?: string;
  customFooterScripts?: string;
  
  // SEO Settings
  seoTitle?: string;
  seoDescription?: string;
  seoOgImage?: string;

  // Advanced SEO & Local
  enableSchemaMarkup?: boolean;
  schemaType?: 'Organization' | 'LocalBusiness' | 'WebSite' | 'Store';
  customSchemaJson?: string;
  localBusinessName?: string;
  localBusinessAddress?: string;
  localBusinessPhone?: string;
  localBusinessOpeningHours?: string;
  localBusinessCountry?: string;
  localBusinessLat?: number;
  localBusinessLng?: number;
  localBusinessWebsite?: string;
  localBusinessCategory?: string;

  // SEO Status & Generation
  robotsGeneratedAt?: number;
  sitemapGeneratedAt?: number;
  robotsStatus?: 'valid' | 'invalid' | 'pending';
  sitemapStatus?: 'valid' | 'invalid' | 'pending';

  // Additional SEO Toggles
  seoAutoCleanUrls?: boolean;
  seoEnableLazyLoading?: boolean;
  seoRequireAltText?: boolean;
  seoAutoRelatedProducts?: boolean;
  seoForceHttps?: boolean;
  seoEnableCanonicalTags?: boolean;
  seoShowLastUpdated?: boolean;
  isMaintenanceMode?: boolean;
  
  // Maintenance & Loading
  maintenanceTitle: string;
  maintenanceMessage: string;
  loadingMessage: string;

  // Home Page Additional
  homeNicheDescription: string;
  homeTrustBadge: string;
  homeTrustTitle: string;
  homeTrustDescription: string;
  homeTrustCta: string;

  // About Page Additional
  aboutHeroBadge: string;
  aboutHeroDescription: string;
  aboutIntegrityBadge1: string;
  aboutIntegrityBadge2: string;

  // Contact Page Additional
  contactHeroBadge: string;
  contactHeroDescription: string;
  contactFormNamePlaceholder: string;
  contactFormEmailPlaceholder: string;
  contactFormSubjectPlaceholder: string;
  contactFormMessagePlaceholder: string;
  contactFormSubmitLabel: string;
  contactFormSubmittingLabel: string;
  contactFormSuccessMessage: string;
  contactSocialTitle: string;

  // Products Page Additional
  productsHeroBadge: string;
  productsHeroDescription: string;
  productsFilterAll: string;
  productsEmptyMessage: string;
  productsDeptLabel: string;
  productsAllCollectionsLabel: string;
  productsBrowseEverythingLabel: string;
  productsNichesLabel: string;
  productsClearFilterLabel: string;
  productsShowAllLabel: string;
  productsSelectionsLabel: string;
  productRefLabel: string;
  sortLatestLabel: string;
  sortPriceLowLabel: string;
  sortPriceHighLabel: string;
  sortNameLabel: string;
  emptyProductsTitle: string;
  emptyProductsResetLabel: string;

  // Product Detail Page
  productNotFoundTitle: string;
  productNotFoundCta: string;
  productPriceLabel: string;
  productSpecsLabel: string;
  productLastUpdatedLabel: string;
  productMerchantVerifiedLabel: string;
  productAcquisitionLabel: string;
  reviewSectionTitle: string;
  reviewWriteCta: string;
  reviewCountLabel: string;
  reviewRatingLabel: string;
  reviewIdentityLabel: string;
  reviewIdentityPlaceholder: string;
  reviewCommentPlaceholder: string;
  reviewSubmitLabel: string;
  reviewSubmittingLabel: string;
  emptyReviewsMessage: string;
  relatedProductsTitle: string;
  modalReturnTitle: string;
  modalCloseTitle: string;
  modalSlideLabel: string;
  modalOfLabel: string;
  sharePreviewLabel: string;
  shareTitlePrefix: string;
  shareTitleSuffix: string;
  shareSubtitle: string;
  shareLaunchLabel: string;
  shareCopiedLabel: string;
  shareCopyLinkLabel: string;
  shareSecurityLabel: string;

  // Login Page
  loginHeroBadge: string;
  loginHeroTitle: string;
  loginHeroDescription: string;
  loginEmailLabel: string;
  loginPasswordLabel: string;
  loginEmailPlaceholder: string;
  loginPasswordPlaceholder: string;
  loginSubmitLabel: string;
  loginSubmittingLabel: string;
  loginGoogleLabel: string;
  loginBackToSite: string;

  loginSuccessBadge: string;
  loginSuccessTitlePrefix: string;
  loginSuccessTitleSuffix: string;
  loginSuccessMessage: string;
  loginSecurityLabel: string;
  loginDividerLabel: string;

  // Admin UI
  adminSaveIndicatorErrorTitle: string;
  adminSaveIndicatorErrorMessage: string;
  adminSaveIndicatorSuccessTitle: string;
  adminSaveIndicatorSuccessMessage: string;
  adminUploadLabel: string;
  adminSocialNewPlatform: string;
  adminSocialProfilesLabel: string;
  adminSocialAddLabel: string;
  adminSocialPlatformPlaceholder: string;
  adminSocialUrlPlaceholder: string;
  adminSocialEmptyMessage: string;
  adminFaqNewQuestion: string;
  adminFaqNewAnswer: string;
  adminFaqLabel: string;
  adminFaqAddLabel: string;
  adminFaqQuestionLabel: string;
  adminFaqAnswerLabel: string;
  adminFaqQuestionPlaceholder: string;
  adminFaqAnswerPlaceholder: string;
  adminFaqEmptyMessage: string;
  adminTrafficLiveLabel: string;
  adminTrafficLocationTitle: string;
  adminTrafficTotalHitsLabel: string;
  adminTrafficMapEnlargeLabel: string;
  adminTrafficMapModalTitle: string;
  adminTrafficMapModalSubtitle: string;
  adminTrafficMapModalActiveNode: string;
  adminTrafficMapModalNodeDescription: string;
  adminTrafficMapModalCategorizedLabel: string;
  adminTrafficMapModalSortedLabel: string;
  adminTrafficMapModalInstructions: string;
  adminTrafficMapModalVisitorNode: string;
  adminTrafficMapModalInactiveZone: string;
  adminTrafficTableLocationHeader: string;
  adminTrafficTableHitsHeader: string;
  adminTrafficTableDeviceHeader: string;
  adminTrafficStatusOnline: string;
  adminTrafficEmptyMessage: string;
  adminTrafficEmptyDescription: string;
  adminDeviceBreakdownTitle: string;
  adminDeviceBreakdownSubtitle: string;
  adminDeviceShareLabel: string;
  adminPermissionOwnerMessage: string;
  adminPermissionDeselectAll: string;
  adminPermissionSelectAll: string;
  
  reviewDefaultName: string;
  shareCopySuccessMessage: string;
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
  autoWipeExempt?: boolean; // NEW: Owner toggle to prevent monthly cleanup for specific admins
  createdAt: number;
  lastActive?: number;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

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

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'client';
  permissions?: string[];
  password?: string;
  autoWipeExempt?: boolean;
  createdAt: number;
  lastActive?: number;
  profileImage?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  shippingAddress?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
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
  clients: AppUser[];
  orders: Order[];
  stats: ProductStats[];
  trainingModules: TrainingModule[];
  // Actions
  refreshAllData: () => Promise<void>;
  updateData: (table: string, data: any) => Promise<boolean>;
  deleteData: (table: string, id: string) => Promise<boolean>;
  // System State
  user: any;
  loadingAuth: boolean;
  saveStatus: SaveStatus;
  setSaveStatus: (status: SaveStatus) => void;
  logEvent: (type: 'view' | 'click' | 'share' | 'system', label: string, source?: string) => void;
  logout: () => Promise<void>;
  
  // Monitoring
  connectionHealth: { status: 'online' | 'offline', latency: number, message: string } | null;
  systemLogs: SystemLog[];
  storageStats: StorageStats;
}
