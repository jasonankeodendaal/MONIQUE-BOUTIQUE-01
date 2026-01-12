
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Legal from './pages/Legal';
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats, SettingsContextType, SaveStatus } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, syncLocalToCloud, upsertData, deleteData as deleteSupabaseData } from './lib/supabase';
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
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
  if (isLocalMode) return <>{children}</>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Footer: React.FC = () => {
  const { settings, user, saveStatus, isLocalMode } = useSettings();
  const location = useLocation();
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') return null;

  // Sync Indicator Logic
  const getStatusColor = () => {
    if (saveStatus === 'saving') return 'bg-amber-500 animate-pulse';
    if (saveStatus === 'error') return 'bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]';
    if (!isLocalMode && saveStatus === 'saved') return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]';
    if (isLocalMode) return 'bg-blue-400';
    return 'bg-slate-600';
  };

  const getStatusLabel = () => {
    if (saveStatus === 'saving') return 'Syncing...';
    if (saveStatus === 'error') return 'Sync Failed';
    if (!isLocalMode && saveStatus === 'saved') return 'Cloud Active';
    if (isLocalMode) return 'Local Mode';
    return 'Standby';
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 text-left">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center space-x-4 group">
               {settings.companyLogoUrl ? (
                <img src={settings.companyLogoUrl} alt={settings.companyName} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-primary shadow-lg">
                  {settings.companyLogo}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white text-2xl font-serif font-bold tracking-tight">{settings.companyName}</span>
                <span className="text-[10px] text-primary uppercase font-black tracking-widest">{settings.slogan}</span>
              </div>
            </div>
            <p className="max-w-md leading-relaxed text-base font-light italic">
              "Curating lifestyle picks that define modern luxury. My mission is to bridge the gap between quality and accessibility."
            </p>
            <div className="flex gap-4">
              {settings.socialLinks?.map(link => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-slate-900 transition-all">
                  {link.iconUrl ? <img src={link.iconUrl} className="w-4 h-4 invert" /> : <span className="text-[8px] font-bold">{link.name[0]}</span>}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.3em]">Navigation</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/" className="hover:text-primary transition-colors">{settings.navHomeLabel}</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">{settings.navProductsLabel}</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">{settings.navAboutLabel}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{settings.navContactLabel}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-black mb-8 text-[10px] uppercase tracking-[0.3em]">Policy & Legal</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings.disclosureTitle}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings.privacyTitle}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{settings.termsTitle}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500">
            &copy; {new Date().getFullYear()} {settings.companyName}. {settings.footerCopyrightText}
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-950 rounded-full border border-slate-800">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${getStatusColor()}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{getStatusLabel()}</span>
            </div>
            
            <Link to={user ? "/admin" : "/login"} className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all flex items-center gap-2">
              Concierge Access <span className="opacity-30">|</span> v2.5.5
            </Link>
          </div>
        </div>
      </div>
    </footer>
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
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
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
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('facebook') || referrer.includes('fb')) return 'Facebook';
    if (referrer.includes('instagram')) return 'Instagram';
    if (referrer.includes('tiktok')) return 'TikTok';
    if (referrer.includes('pinterest')) return 'Pinterest';
    if (referrer.includes('google')) return 'Google Search';
    if (referrer.includes('twitter') || referrer.includes('t.co') || referrer.includes('x.com')) return 'Twitter';
    return referrer.length > 0 ? 'Referral' : 'Direct';
  };

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      const source = getTrafficSource();
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname, source);
    }
    const fetchGeo = async () => {
        if (hasTrackedGeo.current || sessionStorage.getItem('geo_tracked')) return;
        const trafficSource = getTrafficSource();
        try {
            const ua = navigator.userAgent;
            let deviceType = "Desktop";
            if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
            if (/iPad|Tablet/i.test(ua)) deviceType = "Tablet";
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.error) return; 
            const visitData = {
                ip: data.ip, city: data.city, region: data.region, country: data.country_name, code: data.country_code,
                lat: data.latitude, lon: data.longitude, device: deviceType, source: trafficSource, timestamp: Date.now()
            };
            const existing = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
            localStorage.setItem('site_visitor_locations', JSON.stringify([visitData, ...existing].slice(0, 50)));
            sessionStorage.setItem('geo_tracked', 'true');
            hasTrackedGeo.current = true;
        } catch (e) { console.warn("Geo-tracking skipped"); }
    };
    fetchGeo();
  }, [location.pathname]); 
  return null;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [settingsId, setSettingsId] = useState<string>('global');
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

  const productsRef = useRef(products);
  const statsRef = useRef(stats);
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const loadOrSeedLocal = <T,>(key: string, initial: T, setter: (val: T) => void) => {
      const stored = localStorage.getItem(key);
      if (stored) setter(JSON.parse(stored));
      else {
          setter(initial);
          localStorage.setItem(key, JSON.stringify(initial));
      }
  };

  const refreshAllData = async () => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured) {
        const remoteSettings = await fetchTableData('settings');
        if (!remoteSettings || remoteSettings.length === 0) {
          await upsertData('settings', { ...settings, id: 'global' });
          setSettingsId('global');
          await syncLocalToCloud('products', products);
          await syncLocalToCloud('categories', categories);
          await syncLocalToCloud('subcategories', subCategories);
          await syncLocalToCloud('hero_slides', heroSlides);
        } else {
          const { id, ...rest } = remoteSettings[0];
          setSettingsId(id);
          setSettings(rest as SiteSettings);
        }

        const [p, c, sc, hs, enq, adm, st] = await Promise.all([
          fetchTableData('products'), fetchTableData('categories'), fetchTableData('subcategories'),
          fetchTableData('hero_slides'), fetchTableData('enquiries'), fetchTableData('admin_users'),
          fetchTableData('product_stats')
        ]);

        setProducts(p); setCategories(c); setSubCategories(sc);
        setHeroSlides(hs); setEnquiries(enq); setAdmins(adm); setStats(st);
        setSaveStatus('saved');
      } else {
        loadOrSeedLocal('site_settings', INITIAL_SETTINGS, setSettings);
        loadOrSeedLocal('admin_products', INITIAL_PRODUCTS, setProducts);
        loadOrSeedLocal('admin_categories', INITIAL_CATEGORIES, setCategories);
        loadOrSeedLocal('admin_subcategories', INITIAL_SUBCATEGORIES, setSubCategories);
        loadOrSeedLocal('admin_hero', INITIAL_CAROUSEL, setHeroSlides);
        loadOrSeedLocal('admin_enquiries', INITIAL_ENQUIRIES, setEnquiries);
        loadOrSeedLocal('admin_users', INITIAL_ADMINS, setAdmins);
        loadOrSeedLocal('admin_product_stats', [], setStats);
        setSaveStatus('idle'); // Local mode shouldn't show 'saved' or 'error' normally
      }
    } catch (e) {
      console.error("Data sync failed", e);
      setSaveStatus('error');
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('site_settings', JSON.stringify(updated));
    if (isSupabaseConfigured) await upsertData('settings', { ...updated, id: settingsId });
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
    }
    const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = existing.some((i: any) => i.id === data.id) ? existing.map((i: any) => i.id === data.id ? data : i) : [data, ...existing];
    localStorage.setItem(key, JSON.stringify(updated));
    try {
      if (isSupabaseConfigured) await upsertData(table, data);
      setSaveStatus('saved');
      return true;
    } catch (e) {
      setSaveStatus('error');
      return false;
    }
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
    }
    const key = table === 'hero_slides' ? 'admin_hero' : `admin_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify(existing.filter((i: any) => i.id !== id)));
    try {
      if (isSupabaseConfigured) await deleteSupabaseData(table, id);
      setSaveStatus('saved');
      return true;
    } catch (e) {
      setSaveStatus('error');
      return false;
    }
  };

  const logEvent = useCallback(async (type: 'view' | 'click' | 'share' | 'system', label: string, source: string = 'Direct') => {
    const newEvent = { id: Date.now().toString(), type, text: label, timestamp: Date.now(), source };
    if (isSupabaseConfigured) {
      try { await supabase.from('traffic_logs').insert([newEvent]); } catch (err) {}
    } else {
      const existing = JSON.parse(localStorage.getItem('site_traffic_logs') || '[]');
      localStorage.setItem('site_traffic_logs', JSON.stringify([newEvent, ...existing].slice(0, 50)));
    }

    if (label.startsWith('Product: ')) {
        const productName = label.replace('Product: ', '').trim();
        const product = productsRef.current.find(p => p.name === productName);
        if (product) {
            const currentStat = statsRef.current.find(s => s.productId === product.id) || { productId: product.id, views: 0, clicks: 0, shares: 0, totalViewTime: 0, lastUpdated: Date.now() };
            const newStat: ProductStats = { ...currentStat, views: currentStat.views + (type === 'view' ? 1 : 0), clicks: currentStat.clicks + (type === 'click' ? 1 : 0), shares: (currentStat.shares || 0) + (type === 'share' ? 1 : 0), lastUpdated: Date.now() };
            setStats(prev => [...prev.filter(s => s.productId !== product.id), newStat]);
            if (isSupabaseConfigured) { try { await upsertData('product_stats', newStat); } catch (e) {} }
            else {
                const localStats = JSON.parse(localStorage.getItem('admin_product_stats') || '[]');
                localStorage.setItem('admin_product_stats', JSON.stringify([...localStats.filter((s: any) => s.productId !== product.id), newStat]));
            }
        }
    }
  }, []);

  useEffect(() => {
    refreshAllData();
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
      return () => subscription.unsubscribe();
    } else { setLoadingAuth(false); }
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
      settings, updateSettings, products, categories, subCategories, heroSlides, enquiries, admins, stats,
      refreshAllData, updateData, deleteData, user, loadingAuth, isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent
    }}>
      <Router>
        <ScrollToTop />
        <TrackingInjector />
        <TrafficTracker logEvent={logEvent} />
        <style>{`.text-primary { color: var(--primary-color); } .bg-primary { background-color: var(--primary-color); } .border-primary { border-color: var(--primary-color); } .hover\\:bg-primary:hover { background-color: var(--primary-color); }`}</style>
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
