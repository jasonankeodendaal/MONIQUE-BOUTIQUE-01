
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { X, RefreshCcw } from 'lucide-react';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Legal from './pages/Legal';
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats, SettingsContextType, SaveStatus, SystemLog, StorageStats, TrainingModule } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, upsertData, deleteData as deleteSupabaseData, measureConnection, moveRecord } from './lib/supabase';
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
      <footer className="bg-slate-900 text-slate-400 py-10 md:py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-12 mb-8 md:mb-12 text-left">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6">
                 {settings.companyLogoUrl ? (
                  <img src={settings.companyLogoUrl} alt={settings.companyName} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white font-bold bg-primary text-lg md:text-xl">
                    {settings.companyLogo}
                  </div>
                )}
                <span className="text-white text-xl md:text-2xl font-bold tracking-tighter">{settings.companyName}</span>
              </div>
              <p className="max-w-xs leading-relaxed text-xs md:text-sm mb-6 md:mb-8 font-light">
                {settings.footerDescription}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-6 text-[10px] md:text-sm uppercase tracking-widest">{settings.footerNavHeader || 'Navigation'}</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm font-light">
                <li><Link to="/" className="hover:text-primary transition-colors">{settings.navHomeLabel}</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">{settings.navProductsLabel}</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">{settings.navAboutLabel}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 md:mb-6 text-[10px] md:text-sm uppercase tracking-widest">{settings.footerPolicyHeader || 'Policy'}</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm font-light">
                <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings.disclosureTitle}</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings.privacyTitle}</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">{settings.termsTitle}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 md:pt-8 border-t border-slate-800 text-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} {settings.companyName}. {settings.footerCopyrightText}</p>
            <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
               <button 
                  onClick={() => setShowCreatorModal(true)} 
                  className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group shadow-sm hover:shadow-md hover:border-primary/30"
                  title="Site Creator"
               >
                  <span className="text-[8px] md:text-[9px] font-bold text-slate-400 group-hover:text-white transition-colors">Site by</span>
                  <img src="https://i.ibb.co/ZR8bZRSp/JSTYP-me-Logo.png" alt="JSTYP.me" className="h-4 md:h-5 w-auto opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all" />
               </button>
               <div className="flex items-center gap-2">
                  <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${connectionHealth?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-[8px] md:text-[9px] font-mono">{connectionHealth?.latency || 0}ms</span>
               </div>
               <div className="flex items-center gap-3">
                <div 
                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500 ${
                    saveStatus === 'saved' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' :
                    saveStatus === 'error' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' :
                    saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' :
                    'bg-slate-700'
                  }`} 
                  title={`System Status: ${saveStatus}`}
                />
                <Link to={user ? "/admin" : "/login"} className="opacity-30 hover:opacity-100 hover:text-white transition-all text-[9px] md:text-[10px]">
                  Concierge Portal
                </Link>
               </div>
            </div>
          </div>
        </div>
      </footer>

      {showCreatorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="relative w-full max-md bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
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
    if (settings.googleAnalyticsId) {
       loadScript('ga-script-src', `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`);
       loadScript('ga-script-code', '', `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${settings.googleAnalyticsId}');
       `);
    }
    
    if (settings.facebookPixelId) {
        loadScript('fb-pixel', '', `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${settings.facebookPixelId}');
          fbq('track', 'PageView');
        `);
    }

    if (settings.tiktokPixelId) {
      loadScript('tiktok-pixel', '', `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${settings.tiktokPixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `);
    }

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
  
  const getTrafficSource = () => {
    if (typeof document === 'undefined') return 'Direct';
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('source') || params.get('ref');
    const referrer = document.referrer.toLowerCase();
    if (utmSource) {
      const cleanSource = utmSource.toLowerCase();
      if (cleanSource.includes('whatsapp')) return 'WhatsApp';
      if (cleanSource.includes('linkedin')) return 'LinkedIn';
      if (cleanSource.includes('tiktok')) return 'TikTok';
      if (cleanSource.includes('instagram')) return 'Instagram';
      if (cleanSource.includes('facebook') || cleanSource.includes('fb')) return 'Facebook';
      if (cleanSource.includes('twitter') || cleanSource.includes('x')) return 'X (Twitter)';
      return cleanSource.charAt(0).toUpperCase() + cleanSource.slice(1);
    }
    if (referrer.includes('facebook') || referrer.includes('fb')) return 'Facebook';
    if (referrer.includes('instagram')) return 'Instagram';
    if (referrer.includes('tiktok')) return 'TikTok';
    if (referrer.includes('pinterest')) return 'Pinterest';
    if (referrer.includes('google')) return 'Google Search';
    if (referrer.includes('twitter') || referrer.includes('t.co') || referrer.includes('x.com')) return 'X (Twitter)';
    if (referrer.includes('linkedin')) return 'LinkedIn';
    if (referrer.includes('whatsapp') || referrer.includes('wa.me')) return 'WhatsApp';
    if (referrer.length > 0) {
      try { const url = new URL(referrer); return url.hostname.replace('www.', ''); } catch (e) { return 'Referral'; }
    }
    return 'Direct';
  };

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      const source = getTrafficSource();
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname, source);
    }
    const fetchGeo = async () => {
        if (hasTrackedGeo.current || sessionStorage.getItem('geo_tracked')) return;
        const stored = localStorage.getItem('site_visitor_locations');
        const trafficSource = getTrafficSource();
        try {
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
                ip: data.ip, city: data.city, region: data.region, country: data.country_name, code: data.country_code,
                lat: data.latitude, lon: data.longitude, org: data.org, device: deviceType, browser, os, source: trafficSource, timestamp: Date.now()
            };
            const existing = JSON.parse(stored || '[]');
            const updated = [visitData, ...existing].slice(0, 50);
            localStorage.setItem('site_visitor_locations', JSON.stringify(updated));
            sessionStorage.setItem('geo_tracked', 'true');
            hasTrackedGeo.current = true;
        } catch (e) { console.warn("Geo-tracking skipped/blocked"); }
    };
    fetchGeo();
  }, [location.pathname]); 
  return null;
};

const useInactivityTimer = (logout: () => void, timeoutMs = 300000) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { logout(); }, timeoutMs);
  }, [logout, timeoutMs]);
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);
};

const useMonthlyCleanup = (isSupabaseConfigured: boolean, products: Product[], refresh: () => void) => {
  useEffect(() => {
    if (!isSupabaseConfigured || products.length === 0) return;
    
    const lastPurge = localStorage.getItem('last_purge_month');
    const now = new Date();
    const currentMonth = `${now.getMonth() + 1}-${now.getFullYear()}`;
    
    if (lastPurge !== currentMonth) {
      const executeArchive = async () => {
        const ownerId = 'owner'; // System owner ID placeholder
        const nonOwnerProducts = products.filter(p => p.createdBy && p.createdBy !== ownerId);
        
        if (nonOwnerProducts.length > 0) {
          console.log(`Executing monthly archive for ${nonOwnerProducts.length} items...`);
          for (const product of nonOwnerProducts) {
            const archivedItem = { ...product, archivedAt: Date.now() };
            await moveRecord('products', 'product_history', archivedItem);
          }
          refresh();
        }
        localStorage.setItem('last_purge_month', currentMonth);
      };
      
      executeArchive();
    }
  }, [isSupabaseConfigured, products, refresh]);
};

const getLocalState = <T,>(key: string, fallback: T): T => {
  try { const stored = localStorage.getItem(key); return stored ? JSON.parse(stored) : fallback; } catch (e) { return fallback; }
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => getLocalState('site_settings', INITIAL_SETTINGS));
  const [settingsId, setSettingsId] = useState<string>('global');
  const [products, setProducts] = useState<Product[]>(() => getLocalState('admin_products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => getLocalState('admin_categories', INITIAL_CATEGORIES));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => getLocalState('admin_subcategories', INITIAL_SUBCATEGORIES));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => getLocalState('admin_hero', INITIAL_CAROUSEL));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => getLocalState('admin_enquiries', INITIAL_ENQUIRIES));
  const [admins, setAdmins] = useState<AdminUser[]>(() => getLocalState('admin_users', INITIAL_ADMINS));
  const [stats, setStats] = useState<ProductStats[]>(() => getLocalState('admin_product_stats', []));
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>({ dbSize: 0, mediaSize: 0, totalRecords: 0, mediaCount: 0 });

  const productsRef = useRef(products);
  const statsRef = useRef(stats);
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const performLogout = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  }, []);

  useInactivityTimer(() => { if (user && !window.location.hash.includes('login')) performLogout(); });

  const calculateStorage = useCallback(() => {
      const dataSet = [settings, products, categories, subCategories, heroSlides, enquiries, admins, stats];
      const jsonString = JSON.stringify(dataSet);
      const dbBytes = new Blob([jsonString]).size;
      const totalRecs = products.length + categories.length + subCategories.length + heroSlides.length + enquiries.length + admins.length;
      let mediaBytes = 0; let mediaCnt = 0;
      products.forEach(p => { if (p.media) { p.media.forEach(m => { mediaBytes += m.size || (500 * 1024); mediaCnt++; }); } });
      heroSlides.forEach(h => { mediaBytes += 1024 * 1024; mediaCnt++; });
      categories.forEach(c => { if (c.image) { mediaBytes += 500 * 1024; mediaCnt++; } });
      setStorageStats({ dbSize: dbBytes, mediaSize: mediaBytes, totalRecords: totalRecs, mediaCount: mediaCnt });
  }, [settings, products, categories, subCategories, heroSlides, enquiries, admins, stats]);

  useEffect(() => { calculateStorage(); }, [calculateStorage]);
  useEffect(() => {
     const checkConnection = async () => { setConnectionHealth(await measureConnection()); };
     checkConnection();
     const interval = setInterval(checkConnection, 10000);
     return () => clearInterval(interval);
  }, []);

  // ARCHIVE AUTOMATION
  useMonthlyCleanup(isSupabaseConfigured, products, () => refreshAllData());

  // --- FULL REALTIME SYNC ENGINE ---
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (payload) => {
          if (payload.new) {
              const { id, ...rest } = payload.new as any;
              // CRITICAL: Merge updates instead of overwriting, and handle 'global' context
              setSettings(prev => {
                const updated = { ...prev, ...rest };
                localStorage.setItem('site_settings', JSON.stringify(updated));
                return updated;
              });
          }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
          if (payload.eventType === 'INSERT') setProducts(prev => [payload.new as Product, ...prev]);
          if (payload.eventType === 'UPDATE') setProducts(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
          if (payload.eventType === 'DELETE') setProducts(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, (payload) => {
          if (payload.eventType === 'INSERT') setCategories(prev => [payload.new as Category, ...prev]);
          if (payload.eventType === 'UPDATE') setCategories(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
          if (payload.eventType === 'DELETE') setCategories(prev => prev.filter(c => c.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subcategories' }, (payload) => {
          if (payload.eventType === 'INSERT') setSubCategories(prev => [payload.new as SubCategory, ...prev]);
          if (payload.eventType === 'UPDATE') setSubCategories(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } : s));
          if (payload.eventType === 'DELETE') setSubCategories(prev => prev.filter(s => s.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, (payload) => {
          if (payload.eventType === 'INSERT') setHeroSlides(prev => [payload.new as CarouselSlide, ...prev]);
          if (payload.eventType === 'UPDATE') setHeroSlides(prev => prev.map(s => s.id === payload.new.id ? { ...s, ...payload.new } : s));
          if (payload.eventType === 'DELETE') setHeroSlides(prev => prev.filter(s => s.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, (payload) => {
          if (payload.eventType === 'INSERT') setEnquiries(prev => [payload.new as Enquiry, ...prev]);
          if (payload.eventType === 'UPDATE') setEnquiries(prev => prev.map(e => e.id === payload.new.id ? { ...e, ...payload.new } : e));
          if (payload.eventType === 'DELETE') setEnquiries(prev => prev.filter(e => e.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_stats' }, (payload) => {
          if (payload.new) {
            setStats(prev => {
              const other = prev.filter(s => s.productId !== (payload.new as ProductStats).productId);
              return [...other, payload.new as ProductStats];
            });
          }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'training_modules' }, (payload) => {
          refreshAllData();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.debug('Supabase Realtime synchronized successfully');
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, []); // Remove dependency on settingsId to prevent unnecessary reconnects

  // --- DYNAMIC META TAG SYSTEM ---
  useEffect(() => {
    const updateMetaTags = () => {
      document.title = settings.companyName;
      
      const updateOrAddMeta = (property: string, content: string, attr = 'property') => {
        let el = document.querySelector(`meta[${attr}="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content || '');
      };

      const metaTitle = settings.companyName;
      const metaDesc = settings.slogan || settings.footerDescription;
      const metaImage = settings.companyLogoUrl || "https://i.ibb.co/FkCdTns2/bb5w9xpud5l.png";

      updateOrAddMeta('og:title', metaTitle);
      updateOrAddMeta('og:description', metaDesc);
      updateOrAddMeta('og:image', metaImage);
      updateOrAddMeta('twitter:title', metaTitle, 'name');
      updateOrAddMeta('twitter:description', metaDesc, 'name');
      updateOrAddMeta('twitter:image', metaImage, 'name');
      updateOrAddMeta('title', metaTitle, 'name');
      updateOrAddMeta('description', metaDesc, 'name');
    };

    updateMetaTags();
    
    // Favicon
    if (settings.companyLogoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = settings.companyLogoUrl;
    }
  }, [settings]);

  // --- DYNAMIC PWA MANIFEST SYSTEM ---
  useEffect(() => {
    const manifest = {
      name: settings.companyName,
      short_name: settings.companyName,
      description: settings.slogan || "Personal Luxury Wardrobe and Affiliate Bridge",
      id: "/", start_url: "/", display: "standalone", orientation: "portrait-primary", background_color: "#FDFCFB",
      theme_color: settings.primaryColor || "#D4AF37",
      icons: [{ src: settings.companyLogoUrl || "https://i.ibb.co/FkCdTns2/bb5w9xpud5l.png", sizes: "512x512", type: "image/png", purpose: "any" }]
    };
    const stringManifest = JSON.stringify(manifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    let link = document.querySelector('link[rel="manifest"]');
    if (link) link.setAttribute('href', manifestURL);
    else { const newLink = document.createElement('link'); newLink.rel = 'manifest'; newLink.href = manifestURL; document.head.appendChild(newLink); }
    return () => URL.revokeObjectURL(manifestURL);
  }, [settings]);

  useEffect(() => {
    refreshAllData();
    if (!isSupabaseConfigured) { setLoadingAuth(false); return; }
    const setupAuth = async () => {
      try {
         const { data: { session }, error } = await supabase.auth.getSession();
         if (error && error.message.includes('Refresh Token')) await supabase.auth.signOut();
         setUser(session?.user ?? null);
         const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setLoadingAuth(false); });
         setLoadingAuth(false);
      } catch (e) { setLoadingAuth(false); }
    };
    setupAuth();
  }, []);

  const addSystemLog = (type: SystemLog['type'], target: string, message: string, sizeBytes?: number, status: 'success' | 'failed' = 'success') => {
    const newLog: SystemLog = { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), type, target, message, sizeBytes, status };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const refreshAllData = async () => {
    addSystemLog('SYNC', 'ALL', 'Initiating full system refresh', 0);
    try {
      if (isSupabaseConfigured) {
        const results = await Promise.allSettled([ fetchTableData('settings'), fetchTableData('products'), fetchTableData('categories'), fetchTableData('subcategories'), fetchTableData('hero_slides'), fetchTableData('enquiries'), fetchTableData('admin_users'), fetchTableData('product_stats') ]);
        const [s, p, c, sc, hs, enq, adm, st] = results;
        if (s.status === 'fulfilled' && s.value && s.value.length > 0) { 
           const globalRow = s.value.find((r: any) => r.id === 'global') || s.value[0];
           const { id, ...rest } = globalRow; 
           setSettingsId(id); 
           setSettings(rest as SiteSettings); 
           localStorage.setItem('site_settings', JSON.stringify(rest)); 
        }
        else if (s.status === 'fulfilled' && s.value && s.value.length === 0) { await upsertData('settings', { ...settings, id: 'global' }); setSettingsId('global'); }
        if (p.status === 'fulfilled' && p.value !== null) { setProducts(p.value); localStorage.setItem('admin_products', JSON.stringify(p.value)); }
        if (c.status === 'fulfilled' && c.value !== null) { setCategories(c.value); localStorage.setItem('admin_categories', JSON.stringify(c.value)); }
        if (sc.status === 'fulfilled' && sc.value !== null) { setSubCategories(sc.value); localStorage.setItem('admin_subcategories', JSON.stringify(sc.value)); }
        if (hs.status === 'fulfilled' && hs.value !== null) { setHeroSlides(hs.value); localStorage.setItem('admin_hero', JSON.stringify(hs.value)); }
        if (enq.status === 'fulfilled' && enq.value !== null) { setEnquiries(enq.value); localStorage.setItem('admin_enquiries', JSON.stringify(enq.value)); }
        if (adm.status === 'fulfilled' && adm.value !== null) { setAdmins(adm.value); localStorage.setItem('admin_users', JSON.stringify(adm.value)); }
        if (st.status === 'fulfilled' && st.value !== null) { setStats(st.value); localStorage.setItem('admin_product_stats', JSON.stringify(st.value)); }
        addSystemLog('SYNC', 'ALL', 'Full refresh completed successfully', 0);
      } else { addSystemLog('SYNC', 'LOCAL', 'Local data reloaded', 0); }
      setSaveStatus('saved');
    } catch (e) { addSystemLog('ERROR', 'ALL', 'Data sync failed', 0, 'failed'); setSaveStatus('error'); }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving'); 
    const updated = { ...settings, ...newSettings }; 
    setSettings(updated);
    localStorage.setItem('site_settings', JSON.stringify(updated));
    if (isSupabaseConfigured) { 
      try { 
        await upsertData('settings', { ...updated, id: 'global' }); 
        setSettingsId('global');
        addSystemLog('UPDATE', 'settings', 'Global settings updated', 0); 
        setSaveStatus('saved');
      } catch (e: any) { 
        addSystemLog('ERROR', 'settings', `Cloud sync failed: ${e.message}`, 0, 'failed'); 
        setSaveStatus('error');
      } 
    } else {
      setTimeout(() => setSaveStatus('saved'), 500);
    }
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
    const updateLocalState = (prev: any[]) => { const exists = prev.some(item => item.id === data.id); return exists ? prev.map(item => item.id === data.id ? { ...item, ...data } : item) : [data, ...prev]; };
    
    // OPTIMISTIC UPDATE
    switch(table) {
        case 'products': setProducts(updateLocalState); break;
        case 'categories': setCategories(updateLocalState); break;
        case 'subcategories': setSubCategories(updateLocalState); break;
        case 'hero_slides': setHeroSlides(updateLocalState); break;
        case 'enquiries': setEnquiries(updateLocalState); break;
        case 'admin_users': setAdmins(updateLocalState); break;
    }
    
    const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.some((i: any) => i.id === data.id) ? existing.map((i: any) => i.id === data.id ? { ...i, ...data } : i) : [data, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    
    try { 
      if (isSupabaseConfigured) { 
        await upsertData(table, data); 
        addSystemLog('UPDATE', table, `Upserted ID: ${data.id?.substring(0,8)}`, 0); 
      } 
      setSaveStatus('saved'); 
      return true; 
    } 
    catch (e) { 
      addSystemLog('ERROR', table, `Update failed`, 0, 'failed'); 
      setSaveStatus('error'); 
      return false; 
    }
  };

  const deleteData = async (table: string, id: string) => {
    setSaveStatus('saving');
    const deleteLocalState = (prev: any[]) => prev.filter(item => item.id !== id);
    switch(table) {
        case 'products': setProducts(deleteLocalState); break;
        case 'categories': setCategories(deleteLocalState); break;
        case 'subcategories': setSubCategories(deleteLocalState); break;
        case 'hero_slides': setHeroSlides(deleteLocalState); break;
        case 'enquiries': setEnquiries(deleteLocalState); break;
        case 'admin_users': setAdmins(deleteLocalState); break;
    }
    const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.filter((i: any) => i.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    try { if (isSupabaseConfigured) { await deleteSupabaseData(table, id); addSystemLog('DELETE', table, `Deleted ID: ${id.substring(0,8)}`, 0); } setSaveStatus('saved'); return true; } 
    catch (e) { setSaveStatus('error'); refreshAllData(); return false; }
  };

  const logEvent = useCallback(async (type: 'view' | 'click' | 'share' | 'system', label: string, source: string = 'Direct') => {
    const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEvent = { id: eventId, type: type || 'system', text: type === 'view' ? `Page View: ${label}` : label, time: new Date().toLocaleTimeString(), timestamp: Date.now(), source: source || 'Direct' };
    if (isSupabaseConfigured) { try { await supabase.from('traffic_logs').insert([newEvent]); } catch (err) {} } 
    else { const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]'); localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50))); }
    if (label.startsWith('Product: ')) {
        const productName = label.replace('Product: ', '').trim();
        const product = productsRef.current.find(p => p.name === productName);
        if (product) {
            const currentStat = statsRef.current.find(s => s.productId === product.id) || { productId: product.id, views: 0, clicks: 0, shares: 0, totalViewTime: 0, lastUpdated: Date.now() };
            const newStat: ProductStats = { ...currentStat, views: currentStat.views + (type === 'view' ? 1 : 0), clicks: currentStat.clicks + (type === 'click' ? 1 : 0), shares: (currentStat.shares || 0) + (type === 'share' ? 1 : 0), lastUpdated: Date.now() };
            setStats(prev => { const filtered = prev.filter(s => s.productId !== product.id); return [...filtered, newStat]; });
            if (isSupabaseConfigured) { try { await upsertData('product_stats', newStat); } catch (e: any) { const { shares, ...legacyStat } = newStat as any; try { await upsertData('product_stats', legacyStat); } catch (e2) {} } } 
            else { const localStats = JSON.parse(localStorage.getItem('admin_product_stats') || '[]'); const otherStats = localStats.filter((s: any) => s.productId !== product.id); localStorage.setItem('admin_product_stats', JSON.stringify([...otherStats, newStat])); }
        }
    }
  }, []);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => { try { logEvent('system', `[CRITICAL] Runtime Exception: ${event.message}`, event.filename || 'Script'); } catch (e) {} };
    const handleGlobalRejection = (event: PromiseRejectionEvent) => { try { const reason = event.reason instanceof Error ? event.reason.message : String(event.reason); logEvent('system', `[CRITICAL] Async Failure: ${reason}`, 'Promise'); } catch (e) {} };
    window.addEventListener('error', handleGlobalError); window.addEventListener('unhandledrejection', handleGlobalRejection);
    return () => { window.removeEventListener('error', handleGlobalError); window.removeEventListener('unhandledrejection', handleGlobalRejection); };
  }, [logEvent]);

  useEffect(() => {
    const hexToRgb = (hex: string) => { const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '212, 175, 55'; };
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(settings.primaryColor));
  }, [settings.primaryColor]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, products, categories, subCategories, heroSlides, enquiries, admins, stats, refreshAllData, updateData, deleteData, user, loadingAuth, isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent, connectionHealth, systemLogs, storageStats }}>
      <Router>
        <ScrollToTop />
        <TrackingInjector />
        <TrafficTracker logEvent={logEvent} />
        <style>{` .text-primary { color: var(--primary-color); } .bg-primary { background-color: var(--primary-color); } .border-primary { border-color: var(--primary-color); } .hover\\:bg-primary:hover { background-color: var(--primary-color); } `}</style>
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
