
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
import Signature from './components/Signature';
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats, SettingsContextType, SaveStatus, SystemLog, StorageStats, Order, TrafficLog, Article, Subscriber, TrainingModule } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS, INITIAL_ARTICLES, INITIAL_SUBSCRIBERS, TRAINING_MODULES } from './constants';
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

  const isAdmin = admins.some(a => a.id === user.id || a.email === user.email);
  
  if (!isAdmin) {
      return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};

const ClientRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loadingAuth, isLocalMode, admins } = useSettings();
  
  if (loadingAuth) return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/client-login" replace />;

  const isAdmin = admins.some(a => a.id === user.id || a.email === user.email);
  if (isAdmin) {
      return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

const Footer: React.FC = () => {
  const { settings, user, saveStatus, connectionHealth, admins } = useSettings();
  const location = useLocation();
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  if (location.pathname === '/login' || location.pathname === '/client-login') return null;

  const isAdmin = isSupabaseConfigured 
    ? (user && admins.some(a => a.id === user.id || a.email === user.email))
    : true; 

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12 text-left">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                 {settings?.companyLogoUrl ? (
                  <img src={settings.companyLogoUrl} alt={settings.companyName} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded flex items-center justify-center text-white font-bold bg-primary">
                    {settings?.companyLogo || "CP"}
                  </div>
                )}
                <span className="text-white text-xl font-bold tracking-tighter">{settings?.companyName}</span>
              </div>
              <p className="max-w-xs leading-relaxed text-sm mb-8 font-light">
                {settings?.footerDescription}
              </p>
              <div className="mt-8 flex flex-col items-start gap-2">
                <Signature className="h-12 text-primary/60" />
                <span className="text-[10px] font-script text-white/20 italic">Curated with Passion</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><Link to="/" className="hover:text-primary transition-colors">{settings?.navHomeLabel}</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">{settings?.navProductsLabel}</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">{settings?.navAboutLabel}</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Journal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Policy</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><Link to="/disclosure" className="hover:text-primary transition-colors">{settings?.disclosureTitle}</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors">{settings?.privacyTitle}</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">{settings?.termsTitle}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-[0.2em] font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} {settings?.companyName}. {settings?.footerCopyrightText}</p>
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
                {(!user || isAdmin) && (
                  <Link to={user ? "/admin" : "/login"} className="opacity-30 hover:opacity-100 hover:text-white transition-all">
                    Bridge Concierge Portal
                  </Link>
                )}
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
    if (settings?.googleAnalyticsId) {
       loadScript('ga-script-src', `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`);
       loadScript('ga-script-code', '', `
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', '${settings.googleAnalyticsId}');
       `);
    }
    if (settings?.facebookPixelId) {
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
    if (settings?.tiktokPixelId) {
      loadScript('tiktok-pixel', '', `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
          ttq.load('${settings.tiktokPixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `);
    }
    if (settings?.pinterestTagId) {
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
  }, [settings?.googleAnalyticsId, settings?.facebookPixelId, settings?.tiktokPixelId, settings?.pinterestTagId]);

  useEffect(() => {
     if (typeof window !== 'undefined') {
        if ((window as any).gtag && settings?.googleAnalyticsId) {
            (window as any).gtag('config', settings.googleAnalyticsId, {
                page_path: location.pathname + location.search
            });
        }
        if ((window as any).fbq && settings?.facebookPixelId) {
            (window as any).fbq('track', 'PageView');
        }
        if ((window as any).ttq && settings?.tiktokPixelId) {
            (window as any).ttq.page();
        }
        if ((window as any).pintrk && settings?.pinterestTagId) {
            (window as any).pintrk('track', 'pagevisit');
        }
     }
  }, [location, settings]);

  return null;
};

const TrafficTracker = ({ logEvent }: { logEvent: (t: any, l: string, s?: string) => void }) => {
  const location = useLocation();
  const hasTrackedGeo = useRef(false);
  
  const getTrafficSource = () => {
    if (typeof document === 'undefined') return 'Direct';
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || params.get('source') || params.get('ref');
    if (utmSource) return utmSource;
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('tiktok')) return 'TikTok';
    if (referrer.includes('instagram')) return 'Instagram';
    if (referrer.includes('facebook')) return 'Facebook';
    if (referrer.includes('google.')) return 'Google Search';
    return referrer.length > 0 ? 'Referral' : 'Direct';
  };

  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      logEvent('view', location.pathname === '/' ? 'Bridge Home' : location.pathname, getTrafficSource());
    }
  }, [location.pathname, logEvent]); 
  return null;
};

// Helper to deep merge settings ensuring all INITIAL_SETTINGS keys exist
const hydrateSettings = (stored: string | null): SiteSettings => {
    const base = { ...INITIAL_SETTINGS };
    if (!stored) return base;
    try {
        const parsed = JSON.parse(stored);
        // Overlay parsed on base to ensure new keys from v14 are present
        return { ...base, ...parsed };
    } catch (e) {
        return base;
    }
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => hydrateSettings(localStorage.getItem('site_settings')));
  const [settingsId, setSettingsId] = useState<string>('global');
  
  const [products, setProducts] = useState<Product[]>(() => getLocalState('admin_products', INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => getLocalState('admin_categories', INITIAL_CATEGORIES));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => getLocalState('admin_subcategories', INITIAL_SUBCATEGORIES));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => getLocalState('admin_hero', INITIAL_CAROUSEL));
  const [articles, setArticles] = useState<Article[]>(() => getLocalState('admin_articles', INITIAL_ARTICLES));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => getLocalState('admin_enquiries', INITIAL_ENQUIRIES));
  const [admins, setAdmins] = useState<AdminUser[]>(() => getLocalState('admin_users', INITIAL_ADMINS));
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() => getLocalState('admin_subscribers', INITIAL_SUBSCRIBERS));
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(() => getLocalState('admin_training_modules', TRAINING_MODULES));
  const [stats, setStats] = useState<ProductStats[]>(() => getLocalState('admin_product_stats', []));
  const [orders, setOrders] = useState<Order[]>(() => getLocalState('admin_orders', []));

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>({ dbSize: 0, mediaSize: 0, totalRecords: 0, mediaCount: 0 });

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
        fetchTableData('training_modules'),
      ]);
      const [s, p, c, sc, hs, ar, tm] = results;
      if (s.status === 'fulfilled' && s.value && s.value.length > 0) {
        const { id, ...rest } = s.value[0];
        setSettingsId(id);
        setSettings(prev => ({ ...prev, ...rest }));
      }
      if (p.status === 'fulfilled' && p.value) setProducts(p.value);
      if (c.status === 'fulfilled' && c.value) setCategories(c.value);
      if (sc.status === 'fulfilled' && sc.value) setSubCategories(sc.value);
      if (hs.status === 'fulfilled' && hs.value) setHeroSlides(hs.value);
      if (ar.status === 'fulfilled' && ar.value) setArticles(ar.value);
      if (tm.status === 'fulfilled' && tm.value) setTrainingModules(tm.value);
    } catch (e) {}
  };

  useEffect(() => {
    const init = async () => {
      await fetchPublicData();
      setIsDataLoaded(true);
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoadingAuth(false);
      } else {
        setLoadingAuth(false);
      }
    };
    init();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('site_settings', JSON.stringify(updated));
    if (isSupabaseConfigured) {
        await upsertData('public_settings', { id: settingsId, ...newSettings });
    }
    setSaveStatus('saved');
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
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
    try {
      if (isSupabaseConfigured) await deleteSupabaseData(table, id);
      setSaveStatus('saved');
      return true;
    } catch (e) {
      setSaveStatus('error');
      return false;
    }
  };

  const logEvent = useCallback(async (type: any, label: string, source: string = 'Direct') => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('traffic_logs').insert([{ type, text: label, source, timestamp: Date.now() }]);
    } catch (err) {}
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings?.primaryColor || '#D4AF37');
  }, [settings?.primaryColor]);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers, trainingModules,
      refreshAllData: fetchPublicData, updateData, deleteData, user, loadingAuth, isDataLoaded,
      isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent,
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
                <Route path="/account" element={<ClientRoute><ClientDashboard /></ClientRoute>} />
                <Route path="/checkout" element={<ClientRoute><Checkout /></ClientRoute>} />
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

function getLocalState(key: string, fallback: any) {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : fallback;
}

export default App;
