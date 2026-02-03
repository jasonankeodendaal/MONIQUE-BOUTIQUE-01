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
import { SiteSettings, Product, Category, SubCategory, CarouselSlide, Enquiry, AdminUser, ProductStats, SettingsContextType, SaveStatus, SystemLog, StorageStats, Order, TrafficLog, Article, Subscriber, TrainingModule } from './types';
import { INITIAL_SETTINGS, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_ENQUIRIES, INITIAL_ADMINS, INITIAL_ARTICLES, INITIAL_SUBSCRIBERS, TRAINING_MODULES } from './constants';
import { supabase, isSupabaseConfigured, fetchTableData, upsertData, deleteData as deleteSupabaseData, measureConnection } from './lib/supabase';
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
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
      </div>
    </div>
  );

  if (isLocalMode) {
      const localUser = localStorage.getItem('local_admin_session');
      if (!localUser) return <Navigate to="/login" replace />;
      return <>{children}</>;
  }
  
  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = admins.some(a => a.id === user.id || a.email === user.email);
  if (!isAdmin) return <Navigate to="/account" replace />;

  return <>{children}</>;
};

const ClientRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, loadingAuth, isLocalMode, admins } = useSettings();
  
  if (loadingAuth) return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!user && !isLocalMode) return <Navigate to="/client-login" replace />;
  if (isLocalMode && !localStorage.getItem('local_client_session')) return <Navigate to="/client-login" replace />;

  const isAdmin = user && admins.some(a => a.id === user.id || a.email === user.email);
  if (isAdmin) return <Navigate to="/admin" replace />;

  return <>{children}</>;
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

  const productsRef = useRef(products);
  const statsRef = useRef(stats);
  useEffect(() => { productsRef.current = products; }, [products]);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) { try { await supabase.auth.signOut(); } catch (e) { console.warn("Logout error", e); } }
    localStorage.removeItem('local_admin_session');
    localStorage.removeItem('local_client_session');
    setUser(null);
    window.location.hash = '#/login';
  }, []);

  const fetchPublicData = async () => {
    if (!isSupabaseConfigured) return; 
    try {
      const results = await Promise.allSettled([ fetchTableData('public_settings'), fetchTableData('products'), fetchTableData('categories'), fetchTableData('subcategories'), fetchTableData('hero_slides'), fetchTableData('articles'), fetchTableData('training_modules') ]);
      const [s, p, c, sc, hs, ar, tm] = results;
      if (s.status === 'fulfilled' && s.value && s.value.length > 0) {
        const { id, ...rest } = s.value[0];
        setSettingsId(id);
        const mergedSettings = { ...settings };
        Object.keys(rest).forEach(key => { const val = (rest as any)[key]; if (val !== null) { (mergedSettings as any)[key] = val; } });
        setSettings(mergedSettings);
        localStorage.setItem('site_settings', JSON.stringify(mergedSettings));
      }
      if (p.status === 'fulfilled' && p.value !== null) { setProducts(p.value); localStorage.setItem('admin_products', JSON.stringify(p.value)); }
      if (c.status === 'fulfilled' && c.value !== null) { setCategories(c.value); localStorage.setItem('admin_categories', JSON.stringify(c.value)); }
      if (sc.status === 'fulfilled' && sc.value !== null) { setSubCategories(sc.value); localStorage.setItem('admin_subcategories', JSON.stringify(sc.value)); }
      if (hs.status === 'fulfilled' && hs.value !== null) { setHeroSlides(hs.value); localStorage.setItem('admin_hero', JSON.stringify(hs.value)); }
      if (ar.status === 'fulfilled' && ar.value !== null) { setArticles(ar.value); localStorage.setItem('admin_articles', JSON.stringify(ar.value)); }
      if (tm.status === 'fulfilled' && tm.value !== null) { setTrainingModules(tm.value); localStorage.setItem('admin_training_modules', JSON.stringify(tm.value)); }
    } catch (e) { console.error("Public data fetch failed", e); }
  };

  const fetchAdminData = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const results = await Promise.allSettled([ fetchTableData('enquiries'), fetchTableData('admin_users'), fetchTableData('product_stats'), fetchTableData('orders'), fetchTableData('private_secrets'), fetchTableData('subscribers') ]);
      const [enq, adm, st, ord, sec, subs] = results;
      if (enq.status === 'fulfilled' && enq.value !== null) { setEnquiries(enq.value); localStorage.setItem('admin_enquiries', JSON.stringify(enq.value)); }
      if (adm.status === 'fulfilled' && adm.value !== null) { setAdmins(adm.value); localStorage.setItem('admin_users', JSON.stringify(adm.value)); }
      if (st.status === 'fulfilled' && st.value !== null) { setStats(st.value); localStorage.setItem('admin_product_stats', JSON.stringify(st.value)); }
      if (ord.status === 'fulfilled' && ord.value !== null) { setOrders(ord.value); localStorage.setItem('admin_orders', JSON.stringify(ord.value)); }
      if (subs.status === 'fulfilled' && subs.value !== null) { setSubscribers(subs.value); localStorage.setItem('admin_subscribers', JSON.stringify(subs.value)); }
      if (sec.status === 'fulfilled' && sec.value && sec.value.length > 0) { const { id, ...secrets } = sec.value[0]; setSettings(prev => ({ ...prev, ...secrets })); }
    } catch (e) { console.error("Admin data fetch failed", e); }
  };

  useEffect(() => {
    let mounted = true;
    const initSequence = async () => { if (mounted) { await fetchPublicData(); setIsDataLoaded(true); } };
    initSequence();
    if (!isSupabaseConfigured) { setLoadingAuth(false); setIsDataLoaded(true); return; }
    const setupAuth = async () => {
      try {
         const { data: { session } } = await supabase.auth.getSession();
         const currentUser = session?.user ?? null;
         if (mounted) setUser(currentUser);
         if (currentUser) { await fetchAdminData(); }
         supabase.auth.onAuthStateChange(async (_event, session) => {
           if (mounted) {
             const newUser = session?.user ?? null;
             setUser(newUser);
             setLoadingAuth(false);
             if (newUser) { await fetchAdminData(); }
           }
         });
         if (mounted) setLoadingAuth(false);
      } catch (e) { if (mounted) setLoadingAuth(false); }
    };
    setupAuth();
    return () => { mounted = false; };
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    setSaveStatus('saving');
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('site_settings', JSON.stringify(updated));
    if (isSupabaseConfigured) {
      try {
        const publicPayload: any = { id: settingsId };
        Object.keys(newSettings).forEach(key => { publicPayload[key] = (newSettings as any)[key]; });
        await upsertData('public_settings', publicPayload);
      } catch (e) { console.error(e); }
    }
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  const updateData = async (table: string, data: any) => {
    setSaveStatus('saving');
    const updateLocalState = (prev: any[]) => { const exists = prev.some(item => item.id === data.id); if (exists) return prev.map(item => item.id === data.id ? data : item); return [data, ...prev]; };
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
        case 'training_modules': setTrainingModules(updateLocalState(trainingModules)); break;
    }
    try { if (isSupabaseConfigured) { await upsertData(table, data); } setSaveStatus('saved'); return true; } catch (e) { setSaveStatus('error'); return false; }
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
        case 'training_modules': setTrainingModules(deleteLocalState(trainingModules)); break;
    }
    try { if (isSupabaseConfigured) { await deleteSupabaseData(table, id); } setSaveStatus('saved'); return true; } catch (e) { setSaveStatus('error'); return false; }
  };

  const logEvent = useCallback(async (type: any, label: string, source: string = 'Direct') => {
    const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEvent: TrafficLog = { id: eventId, type, text: label, timestamp: Date.now(), source, time: new Date().toLocaleTimeString() };
    if (isSupabaseConfigured) { try { await supabase.from('traffic_logs').insert([newEvent]); } catch (err) {} }
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, products, categories, subCategories, heroSlides, enquiries, admins, stats, orders, articles, subscribers, trainingModules,
      refreshAllData: fetchPublicData, updateData, deleteData, logout, user, loadingAuth, isDataLoaded, isLocalMode: !isSupabaseConfigured, saveStatus, setSaveStatus, logEvent,
      connectionHealth, systemLogs, storageStats
    }}>
      <CartProvider>
        <Router>
          <ScrollToTop />
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
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<ArticleDetail />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </SettingsContext.Provider>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export default App;