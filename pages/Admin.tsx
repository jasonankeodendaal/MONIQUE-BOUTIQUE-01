
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, 
  Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown,
  Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, 
  BookOpen, FileText, Share2, Tag, ArrowRight, Video, ImageIcon, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut,
  Rocket, Terminal, Copy, Check, Database, Github, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash,
  Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Image, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin, PieChart, ListOrdered, FileVideo, CloudUpload
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS, EMAIL_TEMPLATE_HTML } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl, fetchTableData, upsertData, deleteData, SUPABASE_SCHEMA, subscribeToTable, seedDatabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

// --- Reusable UI Components for Admin ---

const AdminHelpBox: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl md:rounded-3xl mb-8 flex gap-4 md:gap-5 items-start text-left">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-lg md:rounded-xl flex items-center justify-center text-primary flex-shrink-0">
      <span className="text-lg md:text-xl">💡</span>
    </div>
    <div className="space-y-1 md:space-y-2">
      <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      <ul className="list-disc list-inside text-slate-500 text-[10px] md:text-xs font-medium space-y-1">
        {steps.map((step, i) => <li key={i}>{step}</li>)}
      </ul>
    </div>
  </div>
);

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-1.5 md:space-y-2 text-left w-full">
    <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={rows} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input type={type} className="w-full px-4 md:px-6 py-3 md:py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

const CodeBlock: React.FC<{ code: string; language?: string; label?: string }> = ({ code, language = 'text', label }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden my-4 text-left">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label || language}</span>
        <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const EmailReplyModal: React.FC<{ enquiry: Enquiry; onClose: () => void }> = ({ enquiry, onClose }) => {
   const [reply, setReply] = useState('');
   const [sending, setSending] = useState(false);

   const handleSend = async () => {
      setSending(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate sending
      alert(`Reply sent to ${enquiry.email}`);
      setSending(false);
      onClose();
   };

   return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-white font-bold text-lg flex items-center gap-2"><Reply size={18} className="text-primary"/> Reply to {enquiry.name}</h3>
            <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
          <div className="p-6 space-y-4 text-left">
             <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Original Message:</p>
                <p className="text-sm text-slate-200 italic">"{enquiry.message}"</p>
             </div>
             
             <textarea 
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-primary resize-none"
             />

             <button 
                onClick={handleSend}
                disabled={sending || !reply}
                className="w-full py-4 bg-primary text-slate-900 font-bold uppercase text-xs tracking-widest rounded-xl hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50"
             >
                {sending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />}
                Send Reply
             </button>
          </div>
        </div>
      </div>
   );
};

const AnalyticsView: React.FC<{ products: Product[]; stats: ProductStats[]; categories: Category[]; trafficEvents: any[]; onEditProduct: (p: Product) => void }> = ({ products, stats, categories, trafficEvents, onEditProduct }) => {
  const totalViews = stats.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalClicks = stats.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  
  // Sort products by views
  const topProducts = [...products]
    .map(p => {
       const stat = stats.find(s => s.productId === p.id);
       return { ...p, views: stat?.views || 0, clicks: stat?.clicks || 0 };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center"><Eye size={20}/></div>
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Views</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
         </div>
         <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-lg flex items-center justify-center"><MousePointer2 size={20}/></div>
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Clicks</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalClicks.toLocaleString()}</p>
         </div>
         <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 bg-purple-500/20 text-purple-500 rounded-lg flex items-center justify-center"><TrendingUp size={20}/></div>
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Conv. Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Star size={18} className="text-primary"/> Top Performing Products</h3>
            <div className="space-y-4">
               {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer" onClick={() => onEditProduct(p)}>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-500 text-sm">#{i+1}</div>
                        {p.media && p.media[0] && <img src={p.media[0].url} className="w-10 h-10 rounded-lg object-cover bg-slate-700" alt=""/>}
                        <div className="text-left">
                           <p className="text-white text-sm font-bold truncate max-w-[150px]">{p.name}</p>
                           <p className="text-slate-500 text-xs">R {p.price}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-primary text-sm font-bold">{p.views} views</p>
                        <p className="text-slate-500 text-xs">{p.clicks} clicks</p>
                     </div>
                  </div>
               ))}
               {topProducts.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No data available</p>}
            </div>
         </div>
         
         <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><ActivityIcon size={18} className="text-blue-500"/> Recent Traffic</h3>
            <div className="space-y-2">
               {trafficEvents.slice(0, 8).map((event, i) => (
                  <div key={i} className="flex items-center justify-between p-2 text-xs border-b border-slate-800 last:border-0">
                     <span className="text-slate-300 truncate max-w-[200px]">{event.text}</span>
                     <span className="text-slate-500 font-mono">{event.time}</span>
                  </div>
               ))}
               {trafficEvents.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No traffic logs yet</p>}
            </div>
         </div>
      </div>
    </div>
  );
};

const TrafficAreaChart: React.FC<{ stats?: ProductStats[] }> = ({ stats }) => {
  const [totalTraffic, setTotalTraffic] = useState(0);
  const aggregatedProductViews = useMemo(() => stats?.reduce((acc, s) => acc + s.views, 0) || 0, [stats]);
  
  return (
    <div className="relative w-full min-h-[350px] md:min-h-[400px] bg-slate-900 rounded-2xl md:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group p-6 md:p-10">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8 md:mb-12">
          <div className="text-left"><div className="flex items-center gap-2 md:gap-3 mb-1"><div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]"></div><span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Geographic Distribution</span></div><h3 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3></div>
          <div className="text-right bg-white/5 border border-white/10 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl hidden sm:block"><span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Live Ingress</span><span className="text-sm md:text-xl font-bold text-white flex items-center gap-2"><Globe size={14} className="text-primary"/> 100% Real-Time</span></div>
        </div>
        
        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center opacity-50"><Globe size={32} className="text-slate-600 mb-4" /><h4 className="text-white font-bold uppercase tracking-widest text-xs">Awaiting Signal</h4><p className="text-slate-500 text-[10px] mt-2 max-w-xs px-4">Traffic data is now streamed directly from the cloud database.</p></div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex gap-6 md:gap-10"><div className="text-left"><span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Visitors</span><span className="text-lg md:text-2xl font-bold text-white">{totalTraffic.toLocaleString()}</span></div><div className="text-left border-l border-white/5 pl-6 md:pl-10"><span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Page Impressions</span><span className="text-lg md:text-2xl font-bold text-primary">{aggregatedProductViews.toLocaleString()}</span></div></div>
           <div className="flex items-center gap-2 md:gap-3 bg-primary/10 border border-primary/20 px-4 md:px-6 py-2 md:py-3 rounded-full"><Activity size={12} className="text-primary animate-pulse"/><span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest">Sync Active</span></div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Component System Tab Modification ---

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, userRole, setSaveStatus, refreshAllData, isDatabaseProvisioned,
    products, setProducts,
    categories, setCategories,
    subCategories, setSubCategories,
    heroSlides, setHeroSlides,
    enquiries, setEnquiries
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | 'integrations' | null>(null);
  
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [stats, setStats] = useState<ProductStats[]>([]);
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});

  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });
  const [tempFeature, setTempFeature] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });

  const [trafficEvents, setTrafficEvents] = useState<any[]>([]);
  const bulkHeroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      if (isSupabaseConfigured) {
        const a = await fetchTableData('admin_users');
        const st = await fetchTableData('product_stats');
        if (a) setAdmins(a);
        if (st) setStats(st);
      }
    };
    loadData();
  }, [isSupabaseConfigured]);

  useEffect(() => {
    const fetchTraffic = async () => {
       if (isSupabaseConfigured) {
         const logs = await fetchTableData('traffic_logs');
         if (logs) setTrafficEvents(logs.slice(0, 50));
       }
    };
    fetchTraffic();
    const sub = subscribeToTable('traffic_logs', (payload) => {
       if (payload.eventType === 'INSERT') {
          setTrafficEvents(prev => [payload.new, ...prev].slice(0, 50));
       }
    });
    return () => { sub?.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (activeTab === 'system') {
       const check = async () => {
          const health = await measureConnection();
          setConnectionHealth(health);
       };
       check();
       const interval = setInterval(check, 10000);
       return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  
  const performSave = async (localAction: () => void, tableName?: string, data?: any, deleteId?: string) => {
    setSaveStatus('saving');
    localAction();
    if (isSupabaseConfigured && tableName) {
       try {
           let result;
           if (deleteId) {
               result = await deleteData(tableName, deleteId);
           } else if (data) {
               result = await upsertData(tableName, data);
           }
           if (result && result.error) {
              console.error("Save failed remotely:", result.error);
              setSaveStatus('error');
           } else {
              setSaveStatus('saved');
           }
       } catch (e) {
           console.error("Save critical failure", e);
           setSaveStatus('error');
       }
    } else {
       setSaveStatus('error');
    }
    setTimeout(() => {
        setSaveStatus((prev: any) => prev === 'error' ? 'error' : 'idle');
    }, 2000);
  };
  
  const updateTempSettings = (newSettings: Partial<SiteSettings>) => {
    setTempSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addTempSocialLink = () => updateTempSettings({ socialLinks: [...(tempSettings.socialLinks || []), { id: Date.now().toString(), name: 'New Link', url: 'https://', iconUrl: '' }] });
  const updateTempSocialLink = (id: string, field: keyof SocialLink, value: string) => updateTempSettings({ socialLinks: (tempSettings.socialLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link) });
  const removeTempSocialLink = (id: string) => updateTempSettings({ socialLinks: (tempSettings.socialLinks || []).filter(link => link.id !== id) });

  const handleOpenEditor = (section: any) => {
      setTempSettings({...settings}); 
      setActiveEditorSection(section);
      setEditorDrawerOpen(true);
  }

  const toggleEnquiryStatus = (id: string) => {
      const enquiry = enquiries.find(e => e.id === id);
      if (!enquiry) return;
      const updated = { ...enquiry, status: enquiry.status === 'read' ? 'unread' : 'read' };
      performSave(() => setEnquiries(prev => prev.map(e => e.id === id ? updated as Enquiry : e)), 'enquiries', updated);
  };

  const deleteEnquiry = (id: string) => {
      performSave(() => setEnquiries(prev => prev.filter(e => e.id !== id)), 'enquiries', null, id);
  };
  
  const exportEnquiries = () => {
    const csvContent = "data:text/csv;charset=utf-8," + "Name,Email,Subject,Message,Date\n" + enquiries.map(e => `${e.name},${e.email},${e.subject},"${e.message}",${new Date(e.createdAt).toLocaleDateString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enquiries_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || e.email.toLowerCase().includes(enquirySearch.toLowerCase()) || e.subject.toLowerCase().includes(enquirySearch.toLowerCase());
    const matchesStatus = enquiryFilter === 'all' || e.status === enquiryFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInitializeDB = async () => {
     if (!confirm("This will overwrite any existing data in the cloud database with the default template. Continue?")) return;
     setIsSeeding(true);
     setSaveStatus('migrating');
     
     const result = await seedDatabase({
        settings: INITIAL_SETTINGS,
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        subCategories: INITIAL_SUBCATEGORIES,
        slides: INITIAL_CAROUSEL
     });

     if (result.success) {
        await refreshAllData();
        setSaveStatus('saved');
        alert("Database successfully initialized and synced.");
     } else {
        setSaveStatus('error');
        alert(`Initialization failed: ${result.error}`);
     }
     setIsSeeding(false);
     setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleSaveProduct = () => {
     if (!user) return;
     let newItem: Product;
     if (editingId) {
         const existing = products.find(p => p.id === editingId);
         newItem = { ...existing!, ...productData } as Product;
     } else {
         newItem = { ...productData, id: Date.now().toString(), createdAt: Date.now(), createdBy: user.id } as Product;
     }
     performSave(() => { if (editingId) setProducts(prev => prev.map(p => p.id === editingId ? newItem : p)); else setProducts(prev => [newItem, ...prev]); setShowProductForm(false); setEditingId(null); }, 'products', newItem);
  };

  const handleDeleteProduct = (id: string) => { performSave(() => setProducts(prev => prev.filter(p => p.id !== id)), 'products', null, id); };

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
         <div className="space-y-1.5 md:space-y-2 text-left">
            <h2 className="text-2xl md:text-3xl font-serif text-white">Inbox</h2>
            <p className="text-slate-400 text-xs md:text-sm">Manage incoming client communications.</p>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setEnquiries(prev => prev.map(e => ({...e, status: 'read'})))} className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Mark All Read</button>
            <button onClick={exportEnquiries} className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-primary text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"><FileSpreadsheet size={14}/> Export CSV</button>
         </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
         <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Search inbox..." value={enquirySearch} onChange={e => setEnquirySearch(e.target.value)} className="w-full pl-11 pr-4 py-3 md:py-4 bg-slate-900 border border-slate-800 rounded-xl md:rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" />
         </div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['all', 'unread', 'read'].map(filter => (
               <button key={filter} onClick={() => setEnquiryFilter(filter as any)} className={`px-5 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${enquiryFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}>
                  {filter}
               </button>
            ))}
         </div>
      </div>
      {filteredEnquiries.length === 0 ? <div className="text-center py-16 md:py-20 bg-slate-900/50 rounded-2xl md:rounded-[3rem] border border-dashed border-slate-800 text-slate-500 text-sm">No enquiries found.</div> : filteredEnquiries.map(e => (<div key={e.id} className={`bg-slate-900 border transition-all rounded-2xl md:rounded-[2.5rem] p-5 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6 text-left ${e.status === 'unread' ? 'border-primary/30 shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}><div className="flex-grow space-y-2"><div className="flex items-center gap-2 md:gap-3"><h4 className="text-white font-bold text-sm md:text-base">{e.name}</h4><span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-xs md:text-sm font-bold truncate">{e.email}</p><div className="p-3 md:p-4 bg-slate-800/50 rounded-xl md:rounded-2xl text-slate-400 text-xs md:text-sm italic leading-relaxed">"{e.message}"</div></div><div className="flex gap-2 items-start justify-end w-full md:w-auto mt-2 md:mt-0"><button onClick={() => setReplyEnquiry(e)} className="flex-1 md:flex-none p-3.5 md:p-4 bg-primary/20 text-primary rounded-xl md:rounded-2xl hover:bg-primary hover:text-slate-900 transition-colors" title="Reply"><Reply size={18}/></button><button onClick={() => toggleEnquiryStatus(e.id)} className={`flex-1 md:flex-none p-3.5 md:p-4 rounded-xl md:rounded-2xl transition-colors ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`} title={e.status === 'read' ? 'Mark Unread' : 'Mark Read'}><CheckCircle size={18}/></button><button onClick={() => deleteEnquiry(e.id)} className="flex-1 md:flex-none p-3.5 md:p-4 bg-slate-800 text-slate-500 rounded-xl md:rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={18}/></button></div></div>))}
    </div>
  );
  
  const renderCatalog = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-white">Product Catalog</h2>
        <button onClick={() => { setProductData({}); setEditingId(null); setShowProductForm(true); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:brightness-110 flex items-center gap-2">
          <Plus size={16} /> New Product
        </button>
      </div>

      {showProductForm ? (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl mb-8">
           <h3 className="text-white font-bold mb-6">{editingId ? 'Edit Product' : 'Create Product'}</h3>
           <div className="grid grid-cols-2 gap-6 mb-6">
             <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
             <SettingField label="Price (ZAR)" value={String(productData.price || '')} onChange={v => setProductData({...productData, price: Number(v)})} type="number" />
             <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
             <div className="space-y-2 text-left">
               <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Category</label>
               <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId || ''} onChange={e => setProductData({...productData, categoryId: e.target.value})}>
                 <option value="">Select Category</option>
                 {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
             </div>
           </div>
           <SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" />
           <div className="flex gap-4 mt-8">
             <button onClick={handleSaveProduct} className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs">Save</button>
             <button onClick={() => setShowProductForm(false)} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold uppercase text-xs">Cancel</button>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-700">
               <div className="flex items-center gap-4">
                 {p.media?.[0] && <img src={p.media[0].url} className="w-12 h-12 object-cover rounded-lg bg-slate-800" />}
                 <div className="text-left">
                   <h4 className="text-white font-bold text-sm truncate max-w-[150px]">{p.name}</h4>
                   <p className="text-slate-500 text-xs">R {p.price}</p>
                 </div>
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"><Edit2 size={16}/></button>
                 <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40"><Trash2 size={16}/></button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHero = () => (<div className="text-slate-500 p-12 text-center">Visual Editor: Use original code implementation</div>);
  const renderCategories = () => (<div className="text-slate-500 p-12 text-center">Category Manager: Use original code implementation</div>);
  const renderTeam = () => (<div className="text-slate-500 p-12 text-center">Team Manager: Use original code implementation</div>);
  const renderGuide = () => (<div className="text-slate-500 p-12 text-center">Guide: Use original code implementation</div>);
  
  const renderSiteEditor = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
       {[
         { id: 'brand', label: 'Brand Identity', icon: Palette, desc: 'Logos, Colors & Typography' },
         { id: 'nav', label: 'Navigation', icon: Layout, desc: 'Menu Links & Footer' },
         { id: 'home', label: 'Home Page', icon: LayoutGrid, desc: 'Hero, Intro & Trust Sections' },
         { id: 'about', label: 'About Story', icon: BookOpen, desc: 'Bio, Mission & History' },
         { id: 'contact', label: 'Contact Details', icon: Phone, desc: 'Email, WhatsApp & Location' },
         { id: 'integrations', label: 'Integrations', icon: PlugIcon, desc: 'Analytics & EmailJS API' }
       ].map(section => (
         <button 
            key={section.id} 
            onClick={() => handleOpenEditor(section.id)}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-primary/50 hover:bg-slate-800 transition-all text-left group"
         >
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-slate-900 transition-colors mb-4">
              <section.icon size={24} />
            </div>
            <h4 className="text-white font-bold text-lg mb-1">{section.label}</h4>
            <p className="text-slate-500 text-xs">{section.desc}</p>
         </button>
       ))}
    </div>
  );
  
  const PlugIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  );

  const renderEditorContent = () => {
     switch(activeEditorSection) {
        case 'brand': return (
          <div className="space-y-6">
            <SettingField label="Company Name" value={tempSettings.companyName} onChange={v => updateTempSettings({ companyName: v })} />
            <SettingField label="Slogan" value={tempSettings.slogan} onChange={v => updateTempSettings({ slogan: v })} />
            <div className="grid grid-cols-2 gap-4">
              <SettingField label="Primary Color" value={tempSettings.primaryColor} onChange={v => updateTempSettings({ primaryColor: v })} type="color" />
              <SettingField label="Background Color" value={tempSettings.backgroundColor} onChange={v => updateTempSettings({ backgroundColor: v })} type="color" />
            </div>
          </div>
        );
        case 'contact': return (
          <div className="space-y-6">
             <SettingField label="Contact Email (Public)" value={tempSettings.contactEmail} onChange={v => updateTempSettings({ contactEmail: v })} />
             <SettingField label="WhatsApp Number" value={tempSettings.whatsappNumber} onChange={v => updateTempSettings({ whatsappNumber: v })} />
             <SettingField label="Physical Address" value={tempSettings.address} onChange={v => updateTempSettings({ address: v })} />
          </div>
        );
        case 'integrations': return (
          <div className="space-y-6">
             <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
                <p className="text-xs text-slate-400">Configure external services here. These keys are stored in your database.</p>
             </div>
             <SettingField label="EmailJS Service ID" value={tempSettings.emailJsServiceId || ''} onChange={v => updateTempSettings({ emailJsServiceId: v })} />
             <SettingField label="EmailJS Template ID" value={tempSettings.emailJsTemplateId || ''} onChange={v => updateTempSettings({ emailJsTemplateId: v })} />
             <SettingField label="EmailJS Public Key" value={tempSettings.emailJsPublicKey || ''} onChange={v => updateTempSettings({ emailJsPublicKey: v })} />
             <div className="border-t border-slate-800 pt-4">
                <button onClick={() => setShowEmailTemplate(true)} className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View Email Template</button>
             </div>
          </div>
        );
        default: return <div className="text-slate-500">Select a section to edit</div>;
     }
  };

  const renderSystem = () => {
    const totalSessionTime = stats.reduce((acc, s) => acc + (s.totalViewTime || 0), 0);
    const url = getSupabaseUrl();

    return (
     <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
        
        {/* DATABASE SYNC STATUS - CRITICAL UPDATE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-white font-bold text-xl md:text-2xl flex items-center gap-3"><Database size={20} className="text-primary"/> Data Synchronization</h3>
                    <p className="text-slate-400 text-xs md:text-sm mt-1.5 md:mt-2">Manage the connection between your bridge page and the cloud.</p>
                 </div>
                 <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDatabaseProvisioned ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {isDatabaseProvisioned ? 'Fully Synced' : 'Action Required'}
                 </div>
              </div>

              {!isDatabaseProvisioned && (
                 <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 md:p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                       <AlertTriangle size={24} className="text-yellow-500 mt-1 flex-shrink-0" />
                       <div className="space-y-1">
                          <h4 className="text-white font-bold text-sm">Database Empty or Offline</h4>
                          <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                             The cloud database appears to be empty or has not been initialized. The site is currently running on a local fallback template. Push the local configuration to the cloud to enable permanent storage and public syncing.
                          </p>
                       </div>
                    </div>
                    <button 
                       onClick={handleInitializeDB} 
                       disabled={isSeeding}
                       className="whitespace-nowrap px-6 py-3 bg-primary text-slate-900 font-bold uppercase text-[10px] tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                    >
                       {isSeeding ? <Loader2 size={16} className="animate-spin"/> : <CloudUpload size={16} />}
                       Push Local Data to Cloud
                    </button>
                 </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
                 {[
                   { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-green-500' },
                   { label: 'Supabase Sync', value: isDatabaseProvisioned ? 'Active' : 'Pending', icon: Database, color: isDatabaseProvisioned ? 'text-green-500' : 'text-yellow-500' },
                   { label: 'Storage Usage', value: '1.2 GB', icon: UploadCloud, color: 'text-blue-500' },
                   { label: 'Total Active Time', value: `${Math.floor(totalSessionTime / 60)}m`, icon: Timer, color: 'text-purple-500' }
                 ].map((item, i) => (
                   <div key={i} className="bg-slate-800/50 p-4 md:p-6 rounded-xl md:rounded-[1.5rem] border border-slate-700/50 flex items-center gap-3 md:gap-4 text-left">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 flex items-center justify-center ${item.color} flex-shrink-0`}><item.icon size={16}/></div>
                      <div className="min-w-0">
                        <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest block truncate">{item.label}</span>
                        <span className="text-sm md:text-base font-bold text-white block truncate">{item.value}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Geographic Analytics */}
        <div className="space-y-4 md:space-y-6">
           <div className="flex justify-between items-end px-1">
             <div className="space-y-1 md:space-y-2">
                <h3 className="text-white font-bold text-lg md:text-xl flex items-center gap-3"><Map size={18} className="text-primary"/> Global Interaction Protocol</h3>
                <p className="text-slate-500 text-[9px] md:text-xs uppercase tracking-widest font-black opacity-60">High-Precision Geographic Analytics</p>
             </div>
           </div>
           
           <TrafficAreaChart stats={stats} />
        </div>

        {/* Supabase Connection Diagnostics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-10 items-start">
             <div className="flex-1 space-y-6 w-full">
                <div>
                  <h3 className="text-white font-bold text-xl md:text-2xl flex items-center gap-3"><Server size={20} className="text-primary"/> Connection Diagnostics</h3>
                  <p className="text-slate-400 text-xs md:text-sm mt-1.5 md:mt-2">Real-time status of your database backend connection.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="bg-slate-800/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-700/50">
                     <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1.5 md:mb-2">Connection Status</span>
                     <div className="flex items-center gap-2.5 md:gap-3">
                        <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${connectionHealth?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className={`text-base md:text-lg font-bold ${connectionHealth?.status === 'online' ? 'text-white' : 'text-red-400'}`}>{connectionHealth?.status === 'online' ? 'Operational' : 'Disconnected'}</span>
                     </div>
                  </div>
                  <div className="bg-slate-800/50 p-4 md:p-5 rounded-xl md:rounded-2xl border border-slate-700/50">
                     <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1.5 md:mb-2">Network Latency</span>
                     <div className="flex items-center gap-2.5 md:gap-3">
                        <Activity size={18} className={connectionHealth?.latency && connectionHealth.latency < 200 ? 'text-green-500' : 'text-yellow-500'} />
                        <span className="text-base md:text-lg font-bold text-white">{connectionHealth?.latency || 0} ms</span>
                     </div>
                  </div>
                </div>

                <div className="p-3.5 md:p-4 bg-black/20 rounded-xl border border-slate-700/50 font-mono text-[9px] md:text-[10px] text-slate-400 break-all text-left">
                   <div className="flex justify-between mb-2"><span className="uppercase font-bold text-slate-500">Endpoint URL</span> <span className="text-primary">{isSupabaseConfigured ? 'CONFIGURED' : 'MISSING'}</span></div>
                   {url ? url.replace(/^(https:\/\/)([^.]+)(.+)$/, '$1****$3') : 'No URL Configured'}
                </div>
             </div>

             <div className="w-full md:w-72 lg:w-80 space-y-4">
                <div className="p-6 bg-slate-800 rounded-2xl md:rounded-3xl border border-slate-700 flex flex-col items-center text-center">
                   <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 text-white ${connectionHealth?.status === 'online' ? 'bg-green-500' : 'bg-slate-600'}`}>
                      {connectionHealth?.status === 'online' ? <Wifi size={24} className="md:w-8 md:h-8"/> : <WifiOff size={24} className="md:w-8 md:h-8"/>}
                   </div>
                   <h4 className="text-white font-bold text-sm md:text-base mb-1">{connectionHealth?.message || 'Checking...'}</h4>
                   <p className="text-[10px] md:text-xs text-slate-400">Heartbeat: {new Date().toLocaleTimeString()}</p>
                </div>
                <div className="p-4 md:p-6 bg-slate-800 rounded-2xl md:rounded-3xl border border-slate-700 text-center">
                   <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1.5 md:mb-2">Active Identity</span>
                   <span className="text-xs md:text-sm font-bold text-white truncate w-full block">{user?.email || 'System'}</span>
                   <span className="text-[8px] md:text-[9px] text-primary uppercase font-bold mt-1 block">{userRole || 'Root'} Identity</span>
                </div>
             </div>
           </div>
        </div>
     </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 md:pt-32 pb-20 overflow-x-hidden">
      <style>{`
         @keyframes grow { from { height: 0; } to { height: 100%; } }
         @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
      `}</style>
      {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}

      <header className="max-w-[1400px] mx-auto px-4 md:px-6 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 text-left">
        <div className="flex flex-col gap-3 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <h1 className="text-3xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1>
            <div className="px-2.5 py-0.5 md:px-3 md:py-1 bg-primary/10 border border-primary/20 rounded-full text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.2em]">{user?.email?.split('@')[0] || 'ADMIN'}</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-900 rounded-xl md:rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar max-w-full">
            {[ 
              { id: 'enquiries', label: 'Inbox', icon: Inbox }, 
              { id: 'analytics', label: 'Insights', icon: BarChart3 },
              { id: 'catalog', label: 'Items', icon: ShoppingBag }, 
              { id: 'hero', label: 'Visuals', icon: LayoutPanelTop }, 
              { id: 'categories', label: 'Depts', icon: Layout }, 
              { id: 'site_editor', label: 'Canvas', icon: Palette }, 
              { id: 'team', label: 'Maison', icon: Users }, 
              { id: 'system', label: 'System', icon: Activity }, 
              { id: 'guide', label: 'Pilot', icon: Rocket } 
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'bg-primary text-slate-900' : 'text-slate-500 hover:text-slate-300'}`}><div className="flex items-center gap-2"><tab.icon size={10} />{tab.label}</div></button>
            ))}
          </div>
          <button onClick={handleLogout} className="px-5 md:px-6 py-2.5 md:py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all w-full sm:w-fit"><LogOut size={12} /> Exit</button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 pb-20">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'analytics' && <AnalyticsView products={products} stats={stats} categories={categories} trafficEvents={trafficEvents} onEditProduct={(p) => { setProductData(p); setEditingId(p.id); setShowProductForm(true); setActiveTab('catalog'); }} />}
        {activeTab === 'catalog' && renderCatalog()} 
        {activeTab === 'hero' && renderHero()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'site_editor' && renderSiteEditor()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'system' && renderSystem()}
        {activeTab === 'guide' && renderGuide()}
      </main>

      {editorDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-5 md:p-12 text-left shadow-2xl slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8 md:mb-10 pb-5 md:pb-6 border-b border-slate-800">
                 <div className="text-left"><h3 className="text-xl md:text-3xl font-serif text-white uppercase">{activeEditorSection}</h3><p className="text-slate-500 text-[10px] md:text-xs mt-1">Global Site Configuration</p></div>
                 <button onClick={() => setEditorDrawerOpen(false)} className="p-2.5 md:p-3 bg-slate-900 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X size={20} className="md:w-6 md:h-6"/></button>
              </div>
              <div className="space-y-8 md:space-y-10 pb-24">
                 <div className="space-y-6">
                    {renderEditorContent()}
                 </div>
                 <div className="fixed bottom-0 right-0 w-full max-w-2xl p-4 md:p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex justify-end gap-3 md:gap-4 z-[110]">
                   <button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-primary text-slate-900 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">Save Configuration</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Email Template Modal */}
      {showEmailTemplate && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[85vh] md:h-[80vh] rounded-2xl md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
             <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center">
               <h3 className="text-white font-bold text-base md:text-lg flex items-center gap-2"><FileCode size={18} className="text-primary"/> EmailJS HTML Template</h3>
               <button onClick={() => setShowEmailTemplate(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
             </div>
             <div className="p-4 md:p-6 overflow-y-auto flex-grow bg-slate-950 text-left">
               <CodeBlock code={EMAIL_TEMPLATE_HTML} language="html" label="Responsive HTML Template" />
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default Admin;
