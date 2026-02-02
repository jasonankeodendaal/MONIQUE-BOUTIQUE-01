
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
import ClientAuth from './pages/ClientAuth';
import ClientDashboard from './pages/ClientDashboard';
import Checkout from './pages/Checkout';
import Legal from './pages/Legal';
import Blog from './pages/Blog';
import ArticleDetail from './pages/ArticleDetail';
import CartDrawer from './components/CartDrawer';
import NewsletterPopup from './components/NewsletterPopup';
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats, SettingsContextType, SaveStatus, SystemLog, StorageStats, Order, TrafficLog, Article, Subscriber } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS, INITIAL_ARTICLES, INITIAL_SUBSCRIBERS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, upsertData, deleteData as deleteSupabaseData, measureConnection, checkAndMigrate } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { CartProvider } from './context/CartContext';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loadingAuth, isLocalMode, admins } = useSettings();
  
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
  
  // Check if user is in admin_users table
  const isAdmin = admins.some(a => a.id === user.id || a.email === user.email);
  if (!isAdmin && admins.length > 0) { // If admins exist, you must be one. If zero exist, first login will create owner.
     return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Footer: React.FC = () => {
  const { settings, user, saveStatus, connectionHealth } = useSettings();
  const location = useLocation();
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  if (location.pathname === '/login' || location.pathname === '/client-login') return null;

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
                <li><Link to="/blog" className="hover:text-primary transition-colors">Journal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Policy</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings.disclosureTitle}</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings.privacyTitle}</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">{settings.termsTitle}</Link></li>
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
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
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
            (window as any).gtag('config', settings.googleAnalyticsId, { page_path: location.pathname + location.search });
        }
        if ((window as any).fbq && settings.facebookPixelId) (window as any).fbq('track', 'PageView');
        if ((window as any).ttq && settings.tiktokPixelId) (window as any).ttq.page();
        if ((window as any).pintrk && settings.pinterestTagId) (window as any).pintrk('track', 'pagevisit');
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
    if (utmSource) return utmSource.charAt(0).toUpperCase() + utmSource.slice(1);
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('tiktok.com')) return 'TikTok';
    if (referrer.includes('instagram.com')) return 'Instagram';
    if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'Facebook';
    if (referrer.includes('google.')) return 'Google Search';
    return 'Direct';
  };

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      const source = getTrafficSource();
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname, source);
    }
    const fetchGeo = async () => {
        if (hasTrackedGeo.current || sessionStorage.getItem('geo_tracked')) return;
        try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.city) {
              sessionStorage.setItem('visitor_city', data.city);
              sessionStorage.setItem('visitor_country', data.country_name);
            }
            sessionStorage.setItem('geo_tracked', 'true');
            hasTrackedGeo.current = true;
        } catch (e) {}
    };
    fetchGeo();
  }, [location.pathname]); 
  return null;
};

const useInactivityTimer = (logout: () => void, timeoutMs = 300000) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => logout(), timeoutMs);
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

const getLocalState = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (e) { return fallback; }
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => getLocalState('site_settings', INITIAL_SETTINGS));
  const [settingsId, setSettingsId] = useState<string>('global');
  const [products, setProducts] = useState<Product[]>(() => getLocalState('admin_products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => getLocalState('admin_categories', INITIAL_CATEGORIES));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => getLocalState('admin_subcategories', INITIAL_SUBCATEGORIES));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => getLocalState('admin_hero', INITIAL_CAROUSEL));
  const [articles, setArticles] = useState<Article[]>(() => getLocalState('admin_articles', INITIAL_ARTICLES));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => getLocalState('admin_enquiries', INITIAL_ENQUIRIES));
  const [admins, setAdmins] = useState<AdminUser[]>(() => getLocalState('admin_users', INITIAL_ADMINS));
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => getLocalState('admin_subscribers', INITIAL_SUBSCRIBERS));
  const [stats, setStats] = useState<ProductStats[]>(() => getLocalState('admin_product_stats', []));
  const [orders, setOrders] = useState<Order[]>(() => getLocalState('admin_orders', []));

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>({ dbSize: 0, mediaSize: 0, totalRecords: 0, mediaCount: 0 });

  const productsRef = useRef(products);
  const statsRef = useRef(stats);
  const sessionStartTime = useRef(Date.now());

  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const performLogout = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  }, []);

  useInactivityTimer(() => {
    if (user && !window.location.hash.includes('login') && !window.location.hash.includes('client-login')) performLogout();
  });

  const calculateStorage = useCallback(() => {
      const dataSet = [settings, products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers];
      const jsonString = JSON.stringify(dataSet);
      const dbBytes = new Blob([jsonString]).size;
      const totalRecs = products.length + categories.length + subCategories.length + heroSlides.length + enquiries.length + admins.length + orders.length + articles.length + subscribers.length;
      setStorageStats({ dbSize: dbBytes, mediaSize: 0, totalRecords: totalRecs, mediaCount: 0 });
  }, [settings, products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers]);

  useEffect(() => { calculateStorage(); }, [calculateStorage]);

  useEffect(() => {
     const checkConnection = async () => setConnectionHealth(await measureConnection());
     checkConnection();
     const interval = setInterval(checkConnection, 15000);
     return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.title = settings.companyName || 'FINDARA';
    if (settings.companyLogoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = settings.companyLogoUrl;
    }
  }, [settings.companyName, settings.companyLogoUrl]);

  const addSystemLog = (type: SystemLog['type'], target: string, message: string, sizeBytes?: number, status: 'success' | 'failed' = 'success') => {
    const newLog: SystemLog = { id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), type, target, message, sizeBytes, status };
    setSystemLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const fetchPublicData = async () => {
    if (!isSupabaseConfigured) return; 
    try {
      const results = await Promise.allSettled([
        fetchTableData('public_settings'),
        fetchTableData('products'),
        fetchTableData('categories'),
        fetchTableData('subcategories'),
        fetchTableData('hero_slides'),
        fetchTableData('articles'),
      ]);
      const [s, p, c, sc, hs, ar] = results;
      if (s.status === 'fulfilled' && s.value && s.value.length > 0) {
        const { id, ...rest } = s.value[0];
        setSettingsId(id);
        const mergedSettings = { ...settings };
        Object.keys(rest).forEach(key => { if ((rest as any)[key] !== null) (mergedSettings as any)[key] = (rest as any)[key]; });
        setSettings(mergedSettings);
        localStorage.setItem('site_settings', JSON.stringify(mergedSettings));
      }
      if (p.status === 'fulfilled' && p.value) { setProducts(p.value); localStorage.setItem('admin_products', JSON.stringify(p.value)); }
      if (c.status === 'fulfilled' && c.value) { setCategories(c.value); localStorage.setItem('admin_categories', JSON.stringify(c.value)); }
      if (sc.status === 'fulfilled' && sc.value) { setSubCategories(sc.value); localStorage.setItem('admin_subcategories', JSON.stringify(sc.value)); }
      if (hs.status === 'fulfilled' && hs.value) { setHeroSlides(hs.value); localStorage.setItem('admin_hero', JSON.stringify(hs.value)); }
      if (ar.status === 'fulfilled' && ar.value) { setArticles(ar.value); localStorage.setItem('admin_articles', JSON.stringify(ar.value)); }
    } catch (e) { console.error("Public data fetch failed", e); }
  };

  const fetchAdminData = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const results = await Promise.allSettled([
        fetchTableData('enquiries'),
        fetchTableData('admin_users'),
        fetchTableData('product_stats'),
        fetchTableData('orders'),
        fetchTableData('private_secrets'),
        fetchTableData('subscribers')
      ]);
      const [enq, adm, st, ord, sec, subs] = results;
      if (enq.status === 'fulfilled' && enq.value) { setEnquiries(enq.value); localStorage.setItem('admin_enquiries', JSON.stringify(enq.value)); }
      if (adm.status === 'fulfilled' && adm.value) { setAdmins(adm.value); localStorage.setItem('admin_users', JSON.stringify(adm.value)); }
      if (st.status === 'fulfilled' && st.value) { setStats(st.value); localStorage.setItem('admin_product_stats', JSON.stringify(st.value)); }
      if (ord.status === 'fulfilled' && ord.value) { setOrders(ord.value); localStorage.setItem('admin_orders', JSON.stringify(ord.value)); }
      if (subs.status === 'fulfilled' && subs.value) { setSubscribers(subs.value); localStorage.setItem('admin_subscribers', JSON.stringify(subs.value)); }
      if (sec.status === 'fulfilled' && sec.value && sec.value.length > 0) {
          const { id, ...secrets } = sec.value[0];
          setSettings(prev => ({ ...prev, ...secrets }));
      }
    } catch (e) { console.error("Admin data fetch failed", e); }
  };

  const refreshAllData = async () => {
    addSystemLog('SYNC', 'ALL', 'Initiating full system refresh', 0);
    try {
      await fetchPublicData();
      if (user) await fetchAdminData();
      setIsDataLoaded(true);
      setSaveStatus('saved');
    } catch (e) {
      addSystemLog('ERROR', 'ALL', 'Data sync failed', 0, 'failed');
      setSaveStatus('error');
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;
    const initSequence = async () => {
       if (mounted) { await fetchPublicData(); setIsDataLoaded(true); }
    };
    initSequence();
    if (!isSupabaseConfigured) { setLoadingAuth(false); setIsDataLoaded(true); return; }
    const setupAuth = async () => {
      try {
         const { data: { session } } = await supabase.auth.getSession();
         const currentUser = session?.user ?? null;
         if (mounted) {
           setUser(currentUser);
           if (currentUser) await fetchAdminData();
           setLoadingAuth(false);
         }
         const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
           if (mounted) {
             const newUser = session?.user ?? null;
             setUser(newUser);
             if (newUser) await fetchAdminData();
             setLoadingAuth(false);
           }
         });
         authSubscription = subscription;
      } catch (e) { if (mounted) setLoadingAuth(false); }
    };
    setupAuth();
    return () => { mounted = false; if (authSubscription) authSubscription.unsubscribe(); };
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    const safeSettings = { ...updated };
    delete (safeSettings as any).payfastSaltPassphrase;
    delete (safeSettings as any).zapierWebhookUrl;
    delete (safeSettings as any).webhookUrl;
    localStorage.setItem('site_settings', JSON.stringify(safeSettings));
    if (isSupabaseConfigured) {
      try {
        const privateKeys = ['payfastSaltPassphrase', 'zapierWebhookUrl', 'webhookUrl'];
        const publicPayload: any = { id: settingsId };
        const privatePayload: any = { id: settingsId };
        Object.keys(newSettings).forEach(key => {
            if (privateKeys.includes(key)) privatePayload[key] = (newSettings as any)[key];
            else publicPayload[key] = (newSettings as any)[key];
        });
        if (Object.keys(publicPayload).length > 1) await upsertData('public_settings', publicPayload);
        if (Object.keys(privatePayload).length > 1) await upsertData('private_secrets', privatePayload);
        addSystemLog('UPDATE', 'settings', 'Settings synchronized', 0);
      } catch (e) { addSystemLog('ERROR', 'settings', 'Cloud sync failed', 0, 'failed'); }
    }
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
    const updateLocalState = (prev: any[]) => {
       const exists = prev.some(item => item.id === data.id);
       return exists ? prev.map(item => item.id === data.id ? data : item) : [data, ...prev];
    };
    switch(table) {
        case 'products': setProducts(updateLocalState(products)); break;
        case 'categories': setCategories(updateLocalState(categories)); break;
        case 'subcategories': setSubCategories(updateLocalState(subCategories)); break;
        case 'hero_slides': setHeroSlides(updateLocalState(heroSlides)); break;
        case 'enquiries': setEnquiries(updateLocalState(enquiries)); break;
        case 'admin_users': setAdmins(updateLocalState(admins)); break;
        case 'orders': setOrders(updateLocalState(orders)); break;
        case 'articles': setArticles(updateLocalState(articles)); break;
        case 'subscribers': setSubscribers(updateLocalState(subscribers)); break;
    }
    try {
      if (isSupabaseConfigured) await upsertData(table, data);
      setSaveStatus('saved');
      return true;
    } catch (e) { setSaveStatus('error'); return false; }
  };

  const deleteData = async (table: string, id: string) => {
    setSaveStatus('saving');
    const deleteLocalState = (prev: any[]) => prev.filter(item => item.id !== id);
    switch(table) {
        case 'products': setProducts(deleteLocalState(products)); break;
        case 'categories': setCategories(deleteLocalState(categories)); break;
        case 'subcategories': setSubCategories(deleteLocalState(subCategories)); break;
        case 'hero_slides': setHeroSlides(deleteLocalState(heroSlides)); break;
        case 'enquiries': setEnquiries(deleteLocalState(enquiries)); break;
        case 'admin_users': setAdmins(deleteLocalState(admins)); break;
        case 'orders': setOrders(deleteLocalState(orders)); break;
        case 'articles': setArticles(deleteLocalState(articles)); break;
        case 'subscribers': setSubscribers(deleteLocalState(subscribers)); break;
    }
    try {
      if (isSupabaseConfigured) await deleteSupabaseData(table, id);
      setSaveStatus('saved');
      return true;
    } catch (e) { setSaveStatus('error'); return false; }
  };

  const logEvent = useCallback(async (type: 'view' | 'click' | 'share' | 'system' | 'interaction', label: string, source: string = 'Direct', extra?: { interactionType?: string }) => {
    const city = sessionStorage.getItem('visitor_city') || undefined;
    const newEvent: TrafficLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type, text: type === 'view' ? `Page View: ${label}` : label,
      time: new Date().toLocaleTimeString(), timestamp: Date.now(), source, city,
      interactionType: extra?.interactionType
    };
    if (isSupabaseConfigured) { try { await supabase.from('traffic_logs').insert([newEvent]); } catch (err) {} }
    if (label.startsWith('Product: ')) {
        const productName = label.replace('Product: ', '').trim();
        const product = productsRef.current.find(p => p.name === productName);
        if (product) {
            const currentStat = statsRef.current.find(s => s.productId === product.id) || { productId: product.id, views: 0, clicks: 0, shares: 0, totalViewTime: 0, lastUpdated: Date.now() };
            const newStat: ProductStats = { ...currentStat, views: currentStat.views + (type === 'view' ? 1 : 0), clicks: currentStat.clicks + (type === 'click' ? 1 : 0), shares: (currentStat.shares || 0) + (type === 'share' ? 1 : 0), lastUpdated: Date.now() };
            setStats(prev => { const filtered = prev.filter(s => s.productId !== product.id); return [...filtered, newStat]; });
            if (isSupabaseConfigured) { try { await upsertData('product_stats', newStat); } catch (e) {} }
        }
    }
  }, []);

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
      settings, updateSettings, products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers,
      refreshAllData, updateData, deleteData, user, loadingAuth, isDataLoaded, isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent,
      connectionHealth, systemLogs, storageStats
    }}>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <TrackingInjector />
          <TrafficTracker logEvent={logEvent} />
          <CartDrawer />
          <NewsletterPopup />
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/client-login" element={<ClientAuth />} />
                <Route path="/account" element={<ClientDashboard />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/disclosure" element={<Legal />} />
                <Route path="/privacy" element={<Legal />} />
                <Route path="/terms" element={<Legal />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<ArticleDetail />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </SettingsContext.Provider>
  );
};

export default App;
