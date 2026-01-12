
// Added React import to resolve namespace errors
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Legal from './pages/Legal';
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats, SettingsContextType, SaveStatus, SystemLog, StorageStats } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, upsertData, deleteData as deleteSupabaseData, measureConnection } from './lib/supabase';
import { User } from '@supabase/supabase-js';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loadingAuth, isLocalMode } = useSettings();
  if (loadingAuth) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Secure Handshake...</p>
      </div>
    </div>
  );
  if (isLocalMode) return <>{children}</>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Footer: React.FC = () => {
  const { settings, user, saveStatus, connectionHealth } = useSettings();
  const location = useLocation();
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null;

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                 {settings.companyLogoUrl ? (
                  <img src={settings.companyLogoUrl} alt={settings.companyName} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold bg-primary">
                    {settings.companyLogo}
                  </div>
                )}
                <span className="text-white text-xl font-bold tracking-tighter">{settings.companyName}</span>
              </div>
              <p className="max-w-xs leading-relaxed text-sm mb-8 font-light">
                {settings.footerDescription}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><Link to="/" className="hover:text-primary transition-colors">{settings.navHomeLabel}</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">{settings.navProductsLabel}</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">{settings.navAboutLabel}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Policy</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings.disclosureTitle}</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings.privacyTitle}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} {settings.companyName}. {settings.footerCopyrightText}</p>
            <div className="flex items-center gap-6">
               <button 
                  onClick={() => setShowCreatorModal(true)} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group shadow-sm hover:shadow-md hover:border-primary/30"
                  title="Site Creator"
               >
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors">Site by</span>
                  <img src="https://i.ibb.co/ZR8bZRSp/JSTYP-me-Logo.png" alt="JSTYP.me" className="h-5 w-auto opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
               </button>
               <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${connectionHealth?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-[9px] font-mono">{connectionHealth?.latency || 0}ms</span>
               </div>
               <div className="flex items-center gap-3">
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    saveStatus === 'saved' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' :
                    saveStatus === 'error' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' :
                    saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' :
                    'bg-slate-700'
                  }`} 
                  title={`System Status: ${saveStatus}`}
                />
                <Link to={user ? "/admin" : "/login"} className="opacity-30 hover:opacity-100 hover:text-white transition-all">
                  Bridge Concierge Portal
                </Link>
               </div>
            </div>
          </div>
        </div>
      </footer>

      {showCreatorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="relative w-full max-w-md bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
              <div className="absolute inset-0">
                 <img src="https://i.ibb.co/dsh2c2hp/unnamed.jpg" className="w-full h-full object-cover opacity-60" alt="Creator Background" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
              </div>
              <button 
                onClick={() => setShowCreatorModal(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/40 text-white rounded-full hover:bg-white hover:text-black transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
              <div className="relative z-10 p-10 text-center flex flex-col items-center">
                 <div className="w-24 h-24 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-4 flex items-center justify-center shadow-2xl">
                    <img src="https://i.ibb.co/ZR8bZRSp/JSTYP-me-Logo.png" alt="JSTYP.me" className="w-full h-auto object-contain" />
                 </div>
                 <h2 className="text-3xl font-serif text-white mb-2 tracking-tight">JSTYP.me</h2>
                 <p className="text-primary font-bold text-xs uppercase tracking-widest mb-6">Jason's solution to your problems, Yes me!</p>
                 <p className="text-slate-300 text-sm leading-relaxed mb-10 max-w-xs font-light">
                    Need a website, App or just a tool? <br/>Contact us today!
                 </p>
                 <a 
                   href="https://wa.me/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-[#25D366]/20 group"
                 >
                    <img src="https://i.ibb.co/Z1YHvjgT/image-removebg-preview-1.png" alt="WhatsApp" className="w-6 h-6 object-contain" />
                    <span className="font-bold text-sm uppercase tracking-wider">Chat on WhatsApp</span>
                 </a>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- Helper to inject external scripts ---
const loadScript = (id: string, src: string, code?: string) => {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  if (src) script.src = src;
  script.async = true;
  if (code) script.innerHTML = code;
  document.head.appendChild(script);
};

const TrackingInjector = () => {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    // Google Analytics
    if (settings.googleAnalyticsId) {
       loadScript('ga-script-src', `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`);
       loadScript('ga-script-code', '', `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${settings.googleAnalyticsId}');
       `);
    }
    
    // Facebook Pixel
    if (settings.facebookPixelId) {
        loadScript('fb-pixel', '', `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${settings.facebookPixelId}');
          fbq('track', 'PageView');
        `);
    }

    // TikTok Pixel
    if (settings.tiktokPixelId) {
      loadScript('tiktok-pixel', '', `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${settings.tiktokPixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `);
    }

    // Pinterest Tag
    if (settings.pinterestTagId) {
      loadScript('pinterest-tag', '', `
        !function(e){if(!window.pintrk){window.pintrk = function () {
        window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
          n=window.pintrk;n.queue=[],n.version="3.0";var
          t=document.createElement("script");t.async=!0,t.src=e;var
          r=document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
        pintrk('load', '${settings.pinterestTagId}');
        pintrk('page');
      `);
    }
  }, [settings.googleAnalyticsId, settings.facebookPixelId, settings.tiktokPixelId, settings.pinterestTagId]);

  // Track Page Views on route change
  useEffect(() => {
     if (typeof window !== 'undefined') {
        if ((window as any).gtag && settings.googleAnalyticsId) {
            (window as any).gtag('config', settings.googleAnalyticsId, {
                page_path: location.pathname + location.search
            });
        }
        if ((window as any).fbq && settings.facebookPixelId) {
            (window as any).fbq('track', 'PageView');
        }
        if ((window as any).ttq && settings.tiktokPixelId) {
            (window as any).ttq.page();
        }
        if ((window as any).pintrk && settings.pinterestTagId) {
            (window as any).pintrk('track', 'pagevisit');
        }
     }
  }, [location, settings.googleAnalyticsId, settings.facebookPixelId, settings.tiktokPixelId, settings.pinterestTagId]);

  return null;
};

const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string, s?: string) => void }) => {
  const location = useLocation();
  const hasTrackedGeo = useRef(false);
  const sessionTracked = useRef(false);
  
  const getTrafficSource = () => {
    if (typeof document === 'undefined') return 'Direct';
    
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('source') || params.get('ref');
    const referrer = document.referrer.toLowerCase();
    
    // Priority 1: URL Parameters (Exact detection for specific campaigns/platforms)
    if (utmSource) {
      const cleanSource = utmSource.toLowerCase();
      if (cleanSource.includes('whatsapp')) return 'WhatsApp';
      if (cleanSource.includes('linkedin')) return 'LinkedIn';
      if (cleanSource.includes('tiktok')) return 'TikTok';
      if (cleanSource.includes('instagram')) return 'Instagram';
      if (cleanSource.includes('facebook') || cleanSource.includes('fb')) return 'Facebook';
      if (cleanSource.includes('twitter') || cleanSource.includes('x')) return 'X (Twitter)';
      if (cleanSource.includes('pinterest')) return 'Pinterest';
      // Capitalize first letter of unknown sources for "new platform" detection
      return cleanSource.charAt(0).toUpperCase() + cleanSource.slice(1);
    }

    // Priority 2: Detailed Referrer Parsing
    if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'Facebook';
    if (referrer.includes('instagram.com')) return 'Instagram';
    if (referrer.includes('tiktok.com')) return 'TikTok';
    if (referrer.includes('pinterest.com') || referrer.includes('pinterest.')) return 'Pinterest';
    if (referrer.includes('google.') || referrer.includes('googleusercontent')) return 'Google Search';
    if (referrer.includes('twitter.com') || referrer.includes('t.co') || referrer.includes('x.com')) return 'X (Twitter)';
    if (referrer.includes('linkedin.com') || referrer.includes('lnkd.in')) return 'LinkedIn';
    if (referrer.includes('whatsapp') || referrer.includes('wa.me')) return 'WhatsApp';
    
    // Handle Android App Links (e.g., android-app://com.linkedin.android)
    if (referrer.startsWith('android-app://')) {
        const parts = referrer.split('//');
        if (parts[1]) {
            const appId = parts[1].split('/')[0];
            if (appId.includes('linkedin')) return 'LinkedIn';
            if (appId.includes('facebook')) return 'Facebook';
            if (appId.includes('twitter')) return 'X (Twitter)';
            if (appId.includes('instagram')) return 'Instagram';
            if (appId.includes('pinterest')) return 'Pinterest';
            if (appId.includes('google')) return 'Google';
            return appId; // Return App ID as source for new platforms
        }
    }
    
    // Handle standard websites (New Platform detection)
    if (referrer.length > 0) {
      try {
        const url = new URL(document.referrer);
        // Remove www and return hostname as the "New Platform"
        return url.hostname.replace('www.', '');
      } catch (e) {
        return 'Referral';
      }
    }
    
    return 'Direct';
  };

  useEffect(() => {
    // 1. Log View
    if (!location.pathname.startsWith('/admin')) {
      const source = getTrafficSource();
      // Only log session view ONCE per session reload, or on route change if needed
      // For general stats, logging every view is fine, but for Source stats, we want entry source
      
      // We pass the source to logEvent. logEvent handles saving.
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname, source);
    }

    // 2. Fetch Geo & Device Data (Once per session)
    const fetchGeo = async () => {
        if (hasTrackedGeo.current || sessionStorage.getItem('geo_tracked')) return;
        
        const stored = localStorage.getItem('site_visitor_locations');
        const trafficSource = getTrafficSource();

        try {
            // Get Device Info
            const ua = navigator.userAgent;
            let deviceType = "Desktop";
            if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
            if (/iPad|Tablet/i.test(ua)) deviceType = "Tablet";
            
            let browser = "Unknown";
            if (ua.indexOf("Chrome") > -1) browser = "Chrome";
            else if (ua.indexOf("Safari") > -1) browser = "Safari";
            else if (ua.indexOf("Firefox") > -1) browser = "Firefox";

            let os = "Unknown OS";
            if (ua.indexOf("Win") !== -1) os = "Windows";
            if (ua.indexOf("Mac") !== -1) os = "MacOS";
            if (ua.indexOf("Linux") !== -1) os = "Linux";
            if (ua.indexOf("Android") !== -1) os = "Android";
            if (ua.indexOf("like Mac") !== -1) os = "iOS";

            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.error) return; 

            const visitData = {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                code: data.country_code,
                lat: data.latitude,
                lon: data.longitude,
                org: data.org,
                device: deviceType,
                browser: browser,
                os: os,
                source: trafficSource,
                timestamp: Date.now()
            };

            const existing = JSON.parse(stored || '[]');
            // Keep last 50 visits locally, but logs go to DB
            const updated = [visitData, ...existing].slice(0, 50);
            localStorage.setItem('site_visitor_locations', JSON.stringify(updated));
            sessionStorage.setItem('geo_tracked', 'true');
            hasTrackedGeo.current = true;
        } catch (e) {
            console.warn("Geo-tracking skipped/blocked");
        }
    };
    
    fetchGeo();
  }, [location.pathname]); 
  return null;
};

// --- Inactivity Timer Hook ---
const useInactivityTimer = (logout: () => void, timeoutMs = 300000) => { // 5 minutes
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      console.log("Inactivity timeout. Logging out.");
      logout();
    }, timeoutMs);
  }, [logout, timeoutMs]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Init
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);
};

const App: React.FC = () => {
  // IMPORTANT: State initialized with EMPTY first to check localStorage
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [settingsId, setSettingsId] = useState<string>('global'); // Track the DB ID for settings
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(INITIAL_SUBCATEGORIES);
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(INITIAL_CAROUSEL);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [stats, setStats] = useState<ProductStats[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  // Monitoring State
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>({ dbSize: 0, mediaSize: 0, totalRecords: 0, mediaCount: 0 });

  // Refs for stable access inside logEvent
  const productsRef = useRef(products);
  const statsRef = useRef(stats);

  // Keep refs synced
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  // Logout Function
  const performLogout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, []);

  // 1. Inactivity Timer (5 minutes)
  useInactivityTimer(() => {
    if (user && !window.location.hash.includes('login')) {
       performLogout();
    }
  });

  // Calculate Storage Breakdown
  const calculateStorage = useCallback(() => {
      // 1. Calculate Database Size (Approx JSON String Length)
      const dataSet = [settings, products, categories, subCategories, heroSlides, enquiries, admins, stats];
      const jsonString = JSON.stringify(dataSet);
      const dbBytes = new Blob([jsonString]).size;
      
      const totalRecs = products.length + categories.length + subCategories.length + heroSlides.length + enquiries.length + admins.length;

      // 2. Calculate Media Size
      let mediaBytes = 0;
      let mediaCnt = 0;

      // Scan Products
      products.forEach(p => {
         if (p.media) {
           p.media.forEach(m => {
             mediaBytes += m.size || 0; // If size stored
             // Fallback estimate if size missing (e.g. 500KB per image)
             if (!m.size) mediaBytes += 500 * 1024;
             mediaCnt++;
           });
         }
      });
      // Scan Hero
      heroSlides.forEach(h => {
         mediaBytes += 1024 * 1024; // Estimate 1MB for hero
         mediaCnt++;
      });
      // Scan Categories
      categories.forEach(c => {
         if (c.image) {
            mediaBytes += 500 * 1024;
            mediaCnt++;
         }
      });

      setStorageStats({
        dbSize: dbBytes,
        mediaSize: mediaBytes,
        totalRecords: totalRecs,
        mediaCount: mediaCnt
      });
  }, [settings, products, categories, subCategories, heroSlides, enquiries, admins, stats]);

  useEffect(() => {
    calculateStorage();
  }, [calculateStorage]);

  // Global Latency Check - Runs every 10s to ensure footer is always accurate
  useEffect(() => {
     const checkConnection = async () => { 
        setConnectionHealth(await measureConnection()); 
     };
     
     // Initial check
     checkConnection();

     // Periodic check
     const interval = setInterval(checkConnection, 10000);
     return () => clearInterval(interval);
  }, []);

  // 2. Logout on Refresh / Initial Load Logic
  useEffect(() => {
    const initAuth = async () => {
       const authTimeout = setTimeout(() => {
         console.warn("Auth initialization timed out.");
         setLoadingAuth(false);
       }, 5000);

       if (isSupabaseConfigured) {
         try {
           const { data: { session }, error } = await supabase.auth.getSession();
           
           if (error && error.message.includes('Refresh Token')) {
             console.log("Stale session detected. Clearing...");
             await supabase.auth.signOut();
             setUser(null);
           } else if (session) {
             // Validate Session Email against Admin List
             // Note: We do this check reactively in the admin sync as well, 
             // but here we just restore the session object.
             setUser(session.user);
           }
         } catch (e) {
           console.error("Auth init error:", e);
           setUser(null);
         }
       }
       clearTimeout(authTimeout);
       setLoadingAuth(false);
    };
    initAuth();
  }, []);

  // Helper to load or seed local data
  const loadOrSeedLocal = <T,>(key: string, initial: T, setter: (val: T) => void) => {
      const stored = localStorage.getItem(key);
      if (stored) {
          setter(JSON.parse(stored));
      } else {
          setter(initial);
          localStorage.setItem(key, JSON.stringify(initial));
      }
  };

  const addSystemLog = (type: SystemLog['type'], target: string, message: string, sizeBytes?: number, status: 'success' | 'failed' = 'success') => {
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      target,
      message,
      sizeBytes,
      status
    };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
  };

  const refreshAllData = async () => {
    addSystemLog('SYNC', 'ALL', 'Initiating full system refresh', 0);
    try {
      if (isSupabaseConfigured) {
        // Use Promise.allSettled to ensure failure in one table doesn't hang the whole UI
        const results = await Promise.allSettled([
          fetchTableData('settings'),
          fetchTableData('products'),
          fetchTableData('categories'),
          fetchTableData('subcategories'),
          fetchTableData('hero_slides'),
          fetchTableData('enquiries'),
          fetchTableData('admin_users'),
          fetchTableData('product_stats')
        ]);

        const [s, p, c, sc, hs, enq, adm, st] = results;

        if (s.status === 'fulfilled' && s.value.length > 0) {
          const { id, ...rest } = s.value[0];
          setSettingsId(id);
          setSettings(rest as SiteSettings);
        } else if (s.status === 'fulfilled' && s.value.length === 0) {
          // Sync existing initial/local state to cloud if empty
          await upsertData('settings', { ...settings, id: 'global' });
          setSettingsId('global');
        }

        if (p.status === 'fulfilled') setProducts(p.value);
        if (c.status === 'fulfilled') setCategories(c.value);
        if (sc.status === 'fulfilled') setSubCategories(sc.value);
        if (hs.status === 'fulfilled') setHeroSlides(hs.value);
        if (enq.status === 'fulfilled') setEnquiries(enq.value);
        if (adm.status === 'fulfilled') setAdmins(adm.value);
        if (st.status === 'fulfilled') setStats(st.value);

        addSystemLog('SYNC', 'ALL', 'Full refresh completed successfully', 0);

      } else {
        // Local Mode: Use loadOrSeed helper to ensure persistence survives refresh
        loadOrSeedLocal('site_settings', INITIAL_SETTINGS, setSettings);
        loadOrSeedLocal('admin_products', INITIAL_PRODUCTS, setProducts);
        loadOrSeedLocal('admin_categories', INITIAL_CATEGORIES, setCategories);
        loadOrSeedLocal('admin_subcategories', INITIAL_SUBCATEGORIES, setSubCategories);
        loadOrSeedLocal('admin_hero', INITIAL_CAROUSEL, setHeroSlides);
        loadOrSeedLocal('admin_enquiries', INITIAL_ENQUIRIES, setEnquiries);
        loadOrSeedLocal('admin_users', INITIAL_ADMINS, setAdmins);
        loadOrSeedLocal('admin_product_stats', [], setStats);
        
        addSystemLog('SYNC', 'LOCAL', 'Local data reloaded', 0);
      }
      setSaveStatus('saved');
    } catch (e) {
      console.error("Data sync failed", e);
      addSystemLog('ERROR', 'ALL', 'Data sync failed', 0, 'failed');
      setSaveStatus('error');
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Always save local first for immediate UI feel
    localStorage.setItem('site_settings', JSON.stringify(updated));

    const payloadSize = new Blob([JSON.stringify(updated)]).size;

    if (isSupabaseConfigured) {
      try {
        await upsertData('settings', { ...updated, id: settingsId });
        addSystemLog('UPDATE', 'settings', 'Global settings updated', payloadSize);
      } catch (e) { 
        console.warn("Cloud settings sync failed");
        addSystemLog('ERROR', 'settings', 'Cloud sync failed', payloadSize, 'failed');
      }
    } else {
      addSystemLog('UPDATE', 'settings', 'Local settings updated', payloadSize);
    }
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
    const updateLocalState = (prev: any[]) => {
       const exists = prev.some(item => item.id === data.id);
       if (exists) return prev.map(item => item.id === data.id ? data : item);
       return [data, ...prev];
    };

    switch(table) {
        case 'products': setProducts(updateLocalState(products)); break;
        case 'categories': setCategories(updateLocalState(categories)); break;
        case 'subcategories': setSubCategories(updateLocalState(subCategories)); break;
        case 'hero_slides': setHeroSlides(updateLocalState(heroSlides)); break;
        case 'enquiries': setEnquiries(updateLocalState(enquiries)); break;
        case 'admin_users': setAdmins(updateLocalState(admins)); break;
    }

    // Always persist to local storage immediately
    const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.some((i: any) => i.id === data.id) 
       ? existing.map((i: any) => i.id === data.id ? data : i)
       : [data, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));

    const payloadSize = new Blob([JSON.stringify(data)]).size;

    try {
      if (isSupabaseConfigured) {
        await upsertData(table, data);
        addSystemLog('UPDATE', table, `Upserted ID: ${data.id?.substring(0,8)}`, payloadSize);
      } else {
        addSystemLog('UPDATE', table, `Local Update ID: ${data.id?.substring(0,8)}`, payloadSize);
      }
      setSaveStatus('saved');
      return true;
    } catch (e) {
      console.error(`Update failed for ${table}`, e);
      addSystemLog('ERROR', table, `Update failed: ${data.id}`, payloadSize, 'failed');
      setSaveStatus('error');
      return false;
    }
  };

  const deleteData = async (table: string, id: string) => {
    setSaveStatus('saving');
    const deleteLocalState = (prev: any[]) => prev.filter(item => item.id !== id);
    
    // Optimistic Update
    switch(table) {
        case 'products': setProducts(deleteLocalState(products)); break;
        case 'categories': setCategories(deleteLocalState(categories)); break;
        case 'subcategories': setSubCategories(deleteLocalState(subCategories)); break;
        case 'hero_slides': setHeroSlides(deleteLocalState(heroSlides)); break;
        case 'enquiries': setEnquiries(deleteLocalState(enquiries)); break;
        case 'admin_users': setAdmins(deleteLocalState(admins)); break;
    }

    // Update Local Storage immediately
    const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.filter((i: any) => i.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));

    try {
      if (isSupabaseConfigured) {
        await deleteSupabaseData(table, id);
        addSystemLog('DELETE', table, `Deleted ID: ${id.substring(0,8)}`, 0);
      } else {
        addSystemLog('DELETE', table, `Local Delete ID: ${id.substring(0,8)}`, 0);
      }
      setSaveStatus('saved');
      return true;
    } catch (e) {
      setSaveStatus('error');
      addSystemLog('ERROR', table, `Delete failed: ${id}`, 0, 'failed');
      refreshAllData(); // Revert on failure
      return false;
    }
  };

  const logEvent = useCallback(async (type: 'view' | 'click' | 'share' | 'system', label: string, source: string = 'Direct') => {
    // Robust ID generation to avoid primary key conflicts
    const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newEvent = {
      id: eventId,
      type: type || 'system',
      text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      source: source || 'Direct'
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('traffic_logs').insert([newEvent]);
        if (error) { console.warn("Traffic log skipped", error.message); }
      } catch (err) { /* Silent fail for logs */ }
    } else {
      const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]');
      localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
    }

    if (label.startsWith('Product: ')) {
        const productName = label.replace('Product: ', '').trim();
        const product = productsRef.current.find(p => p.name === productName);
        
        if (product) {
            const currentStat = statsRef.current.find(s => s.productId === product.id) || { 
                productId: product.id, 
                views: 0, 
                clicks: 0, 
                shares: 0,
                totalViewTime: 0, 
                lastUpdated: Date.now() 
            };
            const newStat: ProductStats = {
                ...currentStat,
                views: currentStat.views + (type === 'view' ? 1 : 0),
                clicks: currentStat.clicks + (type === 'click' ? 1 : 0),
                shares: (currentStat.shares || 0) + (type === 'share' ? 1 : 0),
                lastUpdated: Date.now()
            };
            
            // Sync local state
            setStats(prev => {
                const filtered = prev.filter(s => s.productId !== product.id);
                return [...filtered, newStat];
            });

            // Persist
            if (isSupabaseConfigured) {
                try {
                  // Attempt clean upsert. If column missing, it might error, so we catch it.
                  await upsertData('product_stats', newStat);
                } catch (e: any) { 
                  if (e.message?.includes('shares')) {
                    // Try without 'shares' if DB is old
                    const { shares, ...legacyStat } = newStat as any;
                    try { await upsertData('product_stats', legacyStat); } catch (e2) {}
                  }
                }
            } else {
                const localStats = JSON.parse(localStorage.getItem('admin_product_stats') || '[]');
                const otherStats = localStats.filter((s: any) => s.productId !== product.id);
                localStorage.setItem('admin_product_stats', JSON.stringify([...otherStats, newStat]));
            }
        }
    }
  }, []);

  useEffect(() => {
    refreshAllData();
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const currentUser = session?.user;
        
        // STRICT AUTHENTICATION LOGIC
        if (currentUser) {
           // 1. Fetch current admin list to check permissions
           const currentAdmins = await fetchTableData('admin_users');
           
           // 2. Check if this user is in the admin list
           const isRegisteredAdmin = currentAdmins.find((a: AdminUser) => a.email === currentUser.email);
           
           if (isRegisteredAdmin) {
              // Valid admin found
              setUser(currentUser);
           } else if (currentAdmins.length === 0) {
              // 3. FIRST LAUNCH SCENARIO: If no admins exist, the first user becomes the Owner
              const newOwner: AdminUser = {
                  id: currentUser.id,
                  email: currentUser.email || '',
                  name: currentUser.user_metadata?.name || 'System Owner',
                  role: 'owner',
                  permissions: ['*'],
                  createdAt: Date.now(),
                  lastActive: Date.now()
              };
              await upsertData('admin_users', newOwner);
              setAdmins([newOwner]);
              setUser(currentUser);
           } else {
              // 4. UNAUTHORIZED: User is logged in via Google but not in admin list
              console.warn("Unauthorized access attempt:", currentUser.email);
              await supabase.auth.signOut();
              setUser(null);
              alert("Access Denied: You are not a registered administrator for this bridge page.");
              window.location.hash = '/login';
           }
        } else {
           setUser(null);
        }
      });
      return () => subscription.unsubscribe();
    } else {
      setLoadingAuth(false);
    }
  }, []);

  // Update lastActive timestamp when user interacts
  useEffect(() => {
    if (user && isSupabaseConfigured && admins.length > 0) {
      const existingAdmin = admins.find(a => a.id === user.id || a.email === user.email);
      if (existingAdmin) {
         // Update local state first
         const updatedAdmin = { ...existingAdmin, lastActive: Date.now() };
         setAdmins(prev => prev.map(a => a.id === updatedAdmin.id ? updatedAdmin : a));
         // Fire and forget update to DB to avoid lag
         upsertData('admin_users', updatedAdmin);
      }
    }
  }, [user]);

  useEffect(() => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55';
    };
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
  }, [settings.primaryColor]);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, 
      products, categories, subCategories, heroSlides, enquiries, admins, stats,
      refreshAllData, updateData, deleteData,
      user, loadingAuth, 
      isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent,
      connectionHealth, systemLogs, storageStats
    }}>
      <Router>
        <ScrollToTop />
        <TrackingInjector />
        <TrafficTracker logEvent={logEvent} />
        <style>{`
          .text-primary { color: var(--primary-color); }
          .bg-primary { background-color: var(--primary-color); }
          .border-primary { border-color: var(--primary-color); }
          .hover\\:bg-primary:hover { background-color: var(--primary-color); }
        `}</style>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/disclosure" element={<Legal />} />
              <Route path="/privacy" element={<Legal />} />
              <Route path="/terms" element={<Legal />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </SettingsContext.Provider>
  );
};

export default App;
