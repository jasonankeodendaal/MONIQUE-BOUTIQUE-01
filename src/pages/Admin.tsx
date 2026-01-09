
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
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin, PieChart, ListOrdered, FileVideo
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES, INITIAL_CAROUSEL, INITIAL_SETTINGS, PERMISSION_TREE, INITIAL_ADMINS, INITIAL_ENQUIRIES, GUIDE_STEPS, EMAIL_TEMPLATE_HTML } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl, fetchTableData, upsertData, deleteData, SUPABASE_SCHEMA } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';
import { useLiveTable } from '../hooks/useRealtime';

// --- Reusable UI Components for Admin ---

const AdminHelpBox: React.FC<{ title: string; steps: string[] }> = ({ title, steps }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl mb-8 flex gap-5 items-start text-left">
    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
      <span className="text-xl">💡</span>
    </div>
    <div className="space-y-2">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      <ul className="list-disc list-inside text-slate-500 text-xs font-medium space-y-1">
        {steps.map((step, i) => <li key={i}>{step}</li>)}
      </ul>
    </div>
  </div>
);

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={rows} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input type={type} className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

/**
 * Traffic Area Chart component
 */
const TrafficAreaChart: React.FC<{ stats?: ProductStats[] }> = ({ stats }) => {
  const [regions, setRegions] = useState<{ name: string; traffic: number; status: string; count: number }[]>([]);
  const [totalTraffic, setTotalTraffic] = useState(0);

  const aggregatedProductViews = useMemo(() => stats?.reduce((acc, s) => acc + s.views, 0) || 0, [stats]);

  useEffect(() => {
    const loadGeoData = () => {
      const rawData = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
      
      if (rawData.length === 0) {
        setRegions([]);
        setTotalTraffic(0);
        return;
      }

      setTotalTraffic(rawData.length);

      const counts: Record<string, number> = {};
      rawData.forEach((entry: any) => {
        const label = (entry.region && entry.code) 
          ? `${entry.region}, ${entry.code}` 
          : (entry.country || 'Unknown Location');
        
        counts[label] = (counts[label] || 0) + 1;
      });

      const total = rawData.length;
      const sortedRegions = Object.entries(counts)
        .map(([name, count]) => {
          const percentage = Math.round((count / total) * 100);
          
          let status = 'Stable';
          if (percentage >= 50) status = 'Dominant';
          else if (percentage >= 30) status = 'Peak';
          else if (percentage >= 15) status = 'Rising';
          else if (percentage >= 5) status = 'Active';
          else status = 'Minimal';

          return { name, traffic: percentage, status, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setRegions(sortedRegions);
    };

    loadGeoData();
    const interval = setInterval(loadGeoData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-[400px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group p-6 md:p-10">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Geographic Distribution</span>
            </div>
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Area <span className="text-primary">Traffic</span></h3>
          </div>
          <div className="text-right bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hidden md:block">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Live Ingress</span>
             <span className="text-xl font-bold text-white flex items-center gap-2">
                <Globe size={16} className="text-primary"/> 100% Real-Time
             </span>
          </div>
        </div>

        <div className="space-y-8 flex-grow">
          {regions.length > 0 ? regions.map((region, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-serif font-bold text-lg italic">0{idx + 1}</span>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide uppercase">{region.name}</h4>
                    <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">{region.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white font-black text-lg">{region.traffic}%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary rounded-full transition-all duration-[2000ms] ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" 
                  style={{ width: `${region.traffic}%`, transitionDelay: `${idx * 200}ms` }}
                />
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-50">
              <Globe size={48} className="text-slate-600 mb-4" />
              <h4 className="text-white font-bold uppercase tracking-widest">Awaiting Signal</h4>
              <p className="text-slate-500 text-xs mt-2 max-w-xs">Visit the public site to generate the first geographic traffic data points.</p>
            </div>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex gap-10">
              <div className="text-left">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Visitors</span>
                 <span className="text-2xl font-bold text-white">{totalTraffic.toLocaleString()}</span>
              </div>
              <div className="text-left border-l border-white/5 pl-10">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Page Impressions</span>
                 <span className="text-2xl font-bold text-primary">{aggregatedProductViews.toLocaleString()}</span>
              </div>
           </div>
           <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full">
              <Activity size={14} className="text-primary animate-pulse"/>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Sync Active</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Detailed Analytics View Component ---
interface AnalyticsViewProps {
  products: Product[];
  stats: ProductStats[];
  categories: Category[];
  trafficEvents: any[];
  onEditProduct: (product: Product) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ products, stats, categories, trafficEvents, onEditProduct }) => {
  const [sortField, setSortField] = useState<'views' | 'clicks' | 'ctr'>('clicks');

  const enrichedProducts = useMemo(() => {
    return products.map(p => {
      const stat = stats.find(s => s.productId === p.id) || { views: 0, clicks: 0, totalViewTime: 0, lastUpdated: 0 };
      const ctr = stat.views > 0 ? (stat.clicks / stat.views) * 100 : 0;
      const avgTime = stat.views > 0 ? stat.totalViewTime / stat.views : 0;
      return { ...p, ...stat, ctr, avgTime };
    });
  }, [products, stats]);

  const sortedProducts = useMemo(() => {
    return [...enrichedProducts].sort((a, b) => b[sortField] - a[sortField]);
  }, [enrichedProducts, sortField]);

  const totalViews = enrichedProducts.reduce((acc, p) => acc + p.views, 0);
  const totalClicks = enrichedProducts.reduce((acc, p) => acc + p.clicks, 0);
  const globalCtr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  const totalTime = enrichedProducts.reduce((acc, p) => acc + p.totalViewTime, 0);

  const categoryPerformance = useMemo(() => {
    return categories.map(cat => {
      const catProducts = enrichedProducts.filter(p => p.categoryId === cat.id);
      const catViews = catProducts.reduce((acc, p) => acc + p.views, 0);
      const catClicks = catProducts.reduce((acc, p) => acc + p.clicks, 0);
      return { ...cat, views: catViews, clicks: catClicks };
    }).sort((a, b) => b.views - a.views);
  }, [categories, enrichedProducts]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div className="space-y-2">
              <h2 className="text-3xl font-serif text-white">Intelligence Hub</h2>
              <p className="text-slate-400 text-sm">Deep dive into product performance and user behavior.</p>
           </div>
           <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2 px-4">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-300">Last 30 Days</span>
           </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Eye size={48} />
                </div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Impressions</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</span>
                    </div>
                </div>
                <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-3/4 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MousePointer2 size={48} className="text-primary" />
                </div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Outbound Clicks</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-primary">{totalClicks.toLocaleString()}</span>
                    </div>
                </div>
                <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/2 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target size={48} className="text-green-500" />
                </div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global CTR</span>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold text-white">{globalCtr.toFixed(2)}%</span>
                        <span className="text-[10px] font-bold text-green-500 flex items-center bg-green-500/10 px-1.5 py-0.5 rounded">+2.4%</span>
                    </div>
                </div>
                 <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${Math.min(globalCtr * 10, 100)}%` }}></div>
                </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Clock size={48} className="text-purple-500" />
                </div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Time</span>
                    <div className="flex items-baseline gap-2 mt-2">
                         <span className="text-3xl font-bold text-white">{(totalTime / 60).toFixed(0)}m</span>
                    </div>
                </div>
                 <div className="w-full bg-slate-800 h-1 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-2/3"></div>
                </div>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Table Area */}
            <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] border border-slate-800 p-6 md:p-8 flex flex-col h-[600px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                     <h3 className="text-white font-bold text-xl flex items-center gap-3">
                        <ListOrdered className="text-primary" size={20} />
                        Top Performing Products
                     </h3>
                     <div className="flex bg-slate-800 rounded-lg p-1 overflow-x-auto max-w-full">
                        {(['views', 'clicks', 'ctr'] as const).map(f => (
                            <button 
                                key={f}
                                onClick={() => setSortField(f)}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${sortField === f ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                     </div>
                </div>

                <div className="overflow-x-auto flex-grow custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                                <th className="pb-4 pl-4">Product</th>
                                <th className="pb-4 text-center">Price</th>
                                <th className="pb-4 text-center">Views</th>
                                <th className="pb-4 text-center">Clicks</th>
                                <th className="pb-4 text-center">CTR</th>
                                <th className="pb-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProducts.map((p, idx) => (
                                <tr key={p.id} className="group border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-600 font-serif italic w-6 text-center">{idx + 1}</span>
                                            <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-700">
                                                <img src={p.media?.[0]?.url} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-bold truncate max-w-[150px]">{p.name}</p>
                                                <p className="text-slate-500 text-[10px] uppercase font-bold">{categories.find(c => c.id === p.categoryId)?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center text-slate-400 text-xs font-mono">R {p.price}</td>
                                    <td className="py-4 text-center">
                                        <span className="text-white text-sm font-bold">{p.views}</span>
                                        <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${Math.min((p.views / (sortedProducts[0].views || 1)) * 100, 100)}%` }}></div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="text-primary text-sm font-bold">{p.clicks}</span>
                                         <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mt-1 overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${Math.min((p.clicks / (sortedProducts[0].clicks || 1)) * 100, 100)}%` }}></div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${p.ctr > 5 ? 'bg-green-500/20 text-green-500' : p.ctr > 2 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-800 text-slate-400'}`}>
                                            {p.ctr.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <button onClick={() => onEditProduct(p)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors">
                                            <Edit2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Column: Category & Traffic */}
            <div className="flex flex-col gap-8">
                 {/* Category Distribution */}
                <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 flex-1">
                     <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-3">
                        <PieChart className="text-purple-500" size={20} /> Category Share
                     </h3>
                     <div className="space-y-6">
                        {categoryPerformance.map((c, i) => (
                            <div key={c.id}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">{c.name}</span>
                                    <span className="text-white text-xs font-bold">{((c.views / (totalViews || 1)) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                                    <div className="h-full bg-purple-500" style={{ width: `${(c.views / (totalViews || 1)) * 100}%`, opacity: 1 - (i * 0.15) }}></div>
                                </div>
                                <div className="mt-1 flex justify-between text-[9px] text-slate-600 font-mono">
                                   <span>{c.views} Views</span>
                                   <span>{c.clicks} Clicks</span>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Real-time Ticker */}
                <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 flex-1 overflow-hidden relative">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-3">
                        <Activity className="text-green-500" size={20} /> Live Traffic
                    </h3>
                    <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {trafficEvents.map((log, idx) => (
                            <div key={idx} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${log.type === 'click' ? 'bg-primary' : log.type === 'view' ? 'bg-blue-500' : 'bg-slate-500'}`}></div>
                                <div>
                                    <p className="text-slate-300 text-xs line-clamp-2">{log.text}</p>
                                    <p className="text-slate-600 text-[9px] font-mono">{log.time}</p>
                                </div>
                            </div>
                        ))}
                         {trafficEvents.length === 0 && <p className="text-slate-600 text-xs italic">Waiting for events...</p>}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Geographic Map Section (Reused) */}
        <div className="mt-8">
             <TrafficAreaChart stats={stats} />
        </div>
    </div>
  );
};

// --- Added Missing Helper Components ---

const SingleImageUploader: React.FC<{ label: string; value: string; onChange: (val: string) => void; className?: string }> = ({ label, value, onChange, className }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      try {
        const result = await uploadMedia(e.target.files[0]);
        onChange(result.url);
      } catch (err) {
        alert("Upload Failed. Check connection.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const isVideo = value?.match(/\.(mp4|webm|mov)$/i);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</label>
      <div 
        className={`relative rounded-2xl overflow-hidden border-2 border-dashed transition-all group ${value ? 'border-slate-700 bg-slate-800' : 'border-slate-700 bg-slate-900 hover:bg-slate-800/50 hover:border-primary/50 cursor-pointer h-40 flex flex-col items-center justify-center'}`}
        onClick={() => !value && fileInputRef.current?.click()}
      >
         <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} accept="image/*,video/*" />
         
         {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
               <Loader2 className="animate-spin text-primary" size={32} />
            </div>
         ) : null}

         {value ? (
           <>
              {isVideo ? (
                <video src={value} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" muted />
              ) : (
                <img src={value} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
                 <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="p-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase shadow-lg hover:scale-105 transition-transform flex items-center gap-2"><RefreshCcw size={14}/> Replace</button>
                 <button onClick={(e) => { e.stopPropagation(); onChange(''); }} className="p-3 bg-red-500 text-white rounded-xl font-bold text-xs uppercase shadow-lg hover:scale-105 transition-transform flex items-center gap-2"><Trash size={14}/> Remove</button>
              </div>
           </>
         ) : (
           <div className="text-center p-6">
              <UploadCloud size={32} className="text-slate-500 mx-auto mb-2 group-hover:text-primary transition-colors" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider group-hover:text-white">Click to Upload</p>
              <p className="text-[10px] text-slate-600 mt-1">Images or Videos (MP4)</p>
           </div>
         )}
      </div>
    </div>
  );
};

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void }> = ({ files, onFilesChange }) => {
   const [isUploading, setIsUploading] = useState(false);
   
   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         setIsUploading(true);
         const newFiles: MediaFile[] = [...files];
         
         try {
           for (let i=0; i<e.target.files.length; i++) {
               const file = e.target.files[i];
               const result = await uploadMedia(file);
               newFiles.push({
                 id: Date.now().toString() + i,
                 url: result.url,
                 name: result.name,
                 type: result.type,
                 size: result.size
               });
           }
           onFilesChange(newFiles);
         } catch (err) {
           alert("Batch upload interrupted.");
         } finally {
           setIsUploading(false);
         }
      }
   };

   return (
     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
       {files.map((f, i) => (
         <div key={i} className="relative aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700 group">
            {f.type.startsWith('video') ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 text-slate-400">
                 <FileVideo size={24} className="mb-2"/>
                 <span className="text-[9px] uppercase font-black">Video</span>
              </div>
            ) : (
              <img src={f.url} className="w-full h-full object-cover" />
            )}
            
            <button onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
              <p className="text-[8px] text-white truncate text-center">{f.name}</p>
            </div>
         </div>
       ))}
       
       <label className={`aspect-square bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 cursor-pointer transition-colors relative ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {isUploading ? <Loader2 size={24} className="animate-spin mb-2 text-primary" /> : <UploadCloud size={24} className="mb-2"/>}
          <span className="text-[9px] font-black uppercase">{isUploading ? 'Uploading...' : 'Add Media'}</span>
          <input type="file" multiple className="hidden" onChange={handleUpload} accept="image/*,video/*" />
       </label>
     </div>
   );
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const commonIcons = ['Package', 'ShoppingBag', 'Tag', 'Gift', 'Truck', 'Star', 'Heart', 'Globe', 'Watch', 'Shirt', 'Smartphone', 'Laptop', 'Camera', 'Home', 'Music', 'Sun', 'Moon', 'Zap', 'Award', 'Smile'];
  return (
    <div className="relative">
       <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none text-left">
          {React.createElement((LucideIcons as any)[selected] || LucideIcons.Package, { size: 18 })}
          <span className="text-sm flex-grow">{selected}</span>
          <ChevronDown size={14} className="text-slate-500" />
       </button>
       {isOpen && (
         <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
            {commonIcons.map(icon => (
               <button key={icon} onClick={() => { onSelect(icon); setIsOpen(false); }} className={`p-2 rounded-lg flex items-center justify-center hover:bg-slate-700 ${selected === icon ? 'bg-primary text-slate-900' : 'text-slate-400'}`}>
                  {React.createElement((LucideIcons as any)[icon] || LucideIcons.HelpCircle, { size: 16 })}
               </button>
            ))}
         </div>
       )}
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; label?: string; language?: string }> = ({ code, label = 'Code', language = 'bash' }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden my-4">
       <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border-b border-slate-800">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
          <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-white transition-colors">
             {copied ? <Check size={12} className="text-green-500"/> : <Copy size={12}/>} {copied ? 'Copied' : 'Copy'}
          </button>
       </div>
       <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-slate-300 leading-relaxed">
         <code>{code}</code>
       </pre>
    </div>
  );
};

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (p: string[]) => void; role: 'owner' | 'admin' }> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 text-primary text-xs font-bold rounded-xl flex items-center gap-2"><ShieldCheck size={16}/> Owner has full system access.</div>;
  
  const toggle = (id: string) => {
    if (permissions.includes(id)) onChange(permissions.filter(p => p !== id));
    else onChange([...permissions, id]);
  };

  return (
    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
      {PERMISSION_TREE.map(node => (
        <div key={node.id} className="space-y-2">
           <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div> {node.label}
           </div>
           <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {node.children?.map(child => (
                 <label key={child.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
                    <input type="checkbox" checked={permissions.includes(child.id)} onChange={() => toggle(child.id)} className="accent-primary" />
                    <span className="text-slate-400 text-xs">{child.label}</span>
                 </label>
              ))}
           </div>
        </div>
      ))}
    </div>
  );
};

const GuideIllustration: React.FC<{ id?: string }> = ({ id }) => {
  const iconMap: Record<string, any> = {
    forge: Terminal, vault: Database, satellite: Globe, database: Server, shield: ShieldCheck, 
    identity: Key, mail: Mail, beacon: Rocket, globe: Globe2, growth: BarChart3
  };
  const Icon = iconMap[id || ''] || Info;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 flex items-center justify-center aspect-square relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
      <Icon size={120} className="text-slate-800 group-hover:text-primary/20 transition-colors duration-500" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon size={64} className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] animate-pulse" />
      </div>
    </div>
  );
};

const AdGeneratorModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
        <h3 className="text-xl font-bold text-white mb-4">Ad Generator</h3>
        <p className="text-slate-400 text-sm mb-6">Generate social media captions for <span className="text-primary">{product.name}</span>.</p>
        <div className="bg-slate-800 p-4 rounded-xl text-slate-300 text-sm italic border-l-4 border-primary mb-4">
          "Discover the {product.name}. A touch of elegance for your wardrobe. Shop now at Kasi Couture. #Luxury #Style #{product.categoryId}"
        </div>
        <button className="w-full py-3 bg-primary text-slate-900 font-bold rounded-xl uppercase text-xs tracking-widest hover:brightness-110">Copy to Clipboard</button>
      </div>
    </div>
  );
};

const EmailReplyModal: React.FC<{ enquiry: Enquiry; onClose: () => void }> = ({ enquiry, onClose }) => {
  const [message, setMessage] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
        <h3 className="text-2xl font-bold text-white mb-2">Reply to Enquiry</h3>
        <p className="text-slate-400 text-sm mb-6">Replying to <span className="text-primary">{enquiry.email}</span></p>
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl text-slate-400 text-xs italic">
            Original: "{enquiry.message}"
          </div>
          <textarea 
            rows={6}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-primary resize-none"
            placeholder="Type your reply..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-3 text-slate-400 font-bold uppercase text-xs">Cancel</button>
            <button onClick={() => { alert('Reply Sent (Simulated)'); onClose(); }} className="px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl uppercase text-xs hover:brightness-110">Send Reply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Admin Component ---

const Admin: React.FC = () => {
  const { settings, updateSettings, user, isLocalMode, setSaveStatus, refreshAllData } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide'>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | 'integrations' | null>(null);
  
  // Local state for Site Editor to prevent auto-saving
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);

  // Data States - Initialized with local, but will be refreshed by Cloud
  const [products, setProducts] = useState<Product[]>(() => JSON.parse(localStorage.getItem('admin_products') || JSON.stringify(INITIAL_PRODUCTS)));
  const [categories, setCategories] = useState<Category[]>(() => JSON.parse(localStorage.getItem('admin_categories') || JSON.stringify(INITIAL_CATEGORIES)));
  const [subCategories, setSubCategories] = useState<SubCategory[]>(() => JSON.parse(localStorage.getItem('admin_subcategories') || JSON.stringify(INITIAL_SUBCATEGORIES)));
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => JSON.parse(localStorage.getItem('admin_hero') || JSON.stringify(INITIAL_CAROUSEL)));
  
  // Use Realtime hooks for dynamic data
  const realtimeEnquiries = useLiveTable<Enquiry>('enquiries', JSON.parse(localStorage.getItem('admin_enquiries') || JSON.stringify(INITIAL_ENQUIRIES)));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(realtimeEnquiries);
  
  const [admins, setAdmins] = useState<AdminUser[]>(() => JSON.parse(localStorage.getItem('admin_users') || JSON.stringify(INITIAL_ADMINS)));
  const [stats, setStats] = useState<ProductStats[]>(() => JSON.parse(localStorage.getItem('admin_product_stats') || '[]'));
  
  // Connection State
  const [connectionHealth, setConnectionHealth] = useState<{status: 'online' | 'offline', latency: number, message: string} | null>(null);

  // Form States
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  
  // Template Modal
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);

  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});

  // Filters & Search
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Subcategory Management Local State
  const [tempSubCatName, setTempSubCatName] = useState('');

  // Discount Rule Management Local State
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });

  // Feature & Spec Management Local State
  const [tempFeature, setTempFeature] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });

  // Real Traffic State (replaces simulated) using Live Hook
  const liveTrafficEvents = useLiveTable('traffic_logs', JSON.parse(localStorage.getItem('site_traffic_logs') || '[]'));
  const trafficEvents = liveTrafficEvents.slice(0, 50);

  // Sync enquiries state with realtime updates
  useEffect(() => {
    if (realtimeEnquiries.length > 0) {
      setEnquiries(realtimeEnquiries);
    }
  }, [realtimeEnquiries]);

  // --- DATA LOADING EFFECT ---
  useEffect(() => {
    const loadData = async () => {
      if (isSupabaseConfigured) {
        const p = await fetchTableData('products');
        const c = await fetchTableData('categories');
        const s = await fetchTableData('subcategories');
        const h = await fetchTableData('carousel_slides');
        const a = await fetchTableData('admin_users');
        const st = await fetchTableData('product_stats');

        if (p) setProducts(p);
        if (c) setCategories(c);
        if (s) setSubCategories(s);
        if (h) setHeroSlides(h);
        if (a) setAdmins(a);
        if (st) setStats(st);
      }
    };
    loadData();
  }, [isSupabaseConfigured]);

  useEffect(() => {
    localStorage.setItem('admin_products', JSON.stringify(products));
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    localStorage.setItem('admin_subcategories', JSON.stringify(subCategories));
    localStorage.setItem('admin_hero', JSON.stringify(heroSlides));
    localStorage.setItem('admin_enquiries', JSON.stringify(enquiries));
    localStorage.setItem('admin_users', JSON.stringify(admins));
    localStorage.setItem('admin_product_stats', JSON.stringify(stats));
  }, [products, categories, subCategories, heroSlides, enquiries, admins, stats]);

  // Measure Connection
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
  
  const handleFactoryReset = async () => { 
      if (window.confirm("⚠️ DANGER: Factory Reset? This wipes LOCAL data.")) { 
          localStorage.clear(); 
          window.location.reload(); 
      } 
  };
  
  const handleBackup = () => { const data = { products, categories, subCategories, heroSlides, enquiries, admins, settings, stats }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup.json`; a.click(); };
  
  // Updated Save Wrapper to handle Cloud Sync Correctly
  const performSave = async (localAction: () => void, tableName?: string, data?: any, deleteId?: string) => {
    setSaveStatus('saving');
    
    // 1. Update Local State UI Immediately for responsiveness
    localAction();

    // 2. Persist to Cloud & Sync Frontend
    if (isSupabaseConfigured && tableName) {
       try {
           let result;
           if (deleteId) {
               result = await deleteData(tableName, deleteId);
           } else if (data) {
               result = await upsertData(tableName, data);
           }
           
           if (result && result.error) {
              // Show error but state is locally optimistic
              console.error("Save failed remotely:", result.error);
              setSaveStatus('error');
           } else {
              // CRITICAL: Refresh Global Context for Frontend to catch up
              await refreshAllData();
              setSaveStatus('saved');
           }
       } catch (e) {
           console.error("Save critical failure", e);
           setSaveStatus('error');
       }
    } else {
       // Simulate delay for local mode
       await new Promise(resolve => setTimeout(resolve, 600));
       setSaveStatus('saved');
    }
    
    // Reset status after a delay unless it's an error
    setTimeout(() => {
        setSaveStatus((prev: any) => prev === 'error' ? 'error' : 'idle');
    }, 2000);
  };

  // Helper for Local Editor Settings (Prevents auto-save)
  const updateTempSettings = (newSettings: Partial<SiteSettings>) => {
    setTempSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addTempSocialLink = () => updateTempSettings({ socialLinks: [...(tempSettings.socialLinks || []), { id: Date.now().toString(), name: 'New Link', url: 'https://', iconUrl: '' }] });
  const updateTempSocialLink = (id: string, field: keyof SocialLink, value: string) => updateTempSettings({ socialLinks: (tempSettings.socialLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link) });
  const removeTempSocialLink = (id: string) => updateTempSettings({ socialLinks: (tempSettings.socialLinks || []).filter(link => link.id !== id) });

  const handleOpenEditor = (section: any) => {
      // Initialize local state with current global settings when opening
      setTempSettings({...settings}); 
      setActiveEditorSection(section);
      setEditorDrawerOpen(true);
  }

  // Enquiry Logic
  const toggleEnquiryStatus = (id: string) => {
      const enquiry = enquiries.find(e => e.id === id);
      if (!enquiry) return;
      const updated = { ...enquiry, status: enquiry.status === 'read' ? 'unread' : 'read' };
      
      performSave(
          () => setEnquiries(prev => prev.map(e => e.id === id ? updated as Enquiry : e)), 
          'enquiries', 
          updated
      );
  };

  const deleteEnquiry = (id: string) => {
      performSave(
          () => setEnquiries(prev => prev.filter(e => e.id !== id)),
          'enquiries',
          null,
          id
      );
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
  
  // ... [Handlers for Products, Categories, Hero, Admins, Subcategories, Discounts, Specs remain largely the same, calling performSave] ...
  const handleSaveProduct = () => {
     let newItem: Product;
     if (editingId) {
         const existing = products.find(p => p.id === editingId);
         newItem = { ...existing!, ...productData } as Product;
     } else {
         newItem = { ...productData, id: Date.now().toString(), createdAt: Date.now() } as Product;
     }

     performSave(
         () => {
             if (editingId) setProducts(prev => prev.map(p => p.id === editingId ? newItem : p)); 
             else setProducts(prev => [newItem, ...prev]); 
             setShowProductForm(false); 
             setEditingId(null);
         },
         'products',
         newItem
     );
  };

  const handleDeleteProduct = (id: string) => {
      performSave(
          () => setProducts(prev => prev.filter(p => p.id !== id)),
          'products',
          null,
          id
      );
  };

  const handleSaveCategory = () => {
      let newItem: Category;
      if (editingId) {
          const existing = categories.find(c => c.id === editingId);
          newItem = { ...existing!, ...catData } as Category;
      } else {
          newItem = { ...catData, id: Date.now().toString() } as Category;
      }

      performSave(
          () => {
             if (editingId) setCategories(prev => prev.map(c => c.id === editingId ? newItem : c)); 
             else setCategories(prev => [...prev, newItem]); 
             setShowCategoryForm(false); 
             setEditingId(null); 
          },
          'categories',
          newItem
      );
  };

  const handleDeleteCategory = (id: string) => {
      performSave(
          () => setCategories(prev => prev.filter(c => c.id !== id)),
          'categories',
          null,
          id
      );
  };

  const handleSaveHero = () => {
      let newItem: CarouselSlide;
      if (editingId) {
          const existing = heroSlides.find(h => h.id === editingId);
          newItem = { ...existing!, ...heroData } as CarouselSlide;
      } else {
          newItem = { ...heroData, id: Date.now().toString() } as CarouselSlide;
      }

      performSave(
          () => {
             if (editingId) setHeroSlides(prev => prev.map(h => h.id === editingId ? newItem : h)); 
             else setHeroSlides(prev => [...prev, newItem]); 
             setShowHeroForm(false); 
             setEditingId(null);
          },
          'carousel_slides',
          newItem
      );
  };

  const handleDeleteHero = (id: string) => {
      performSave(
          () => setHeroSlides(prev => prev.filter(h => h.id !== id)),
          'carousel_slides',
          null,
          id
      );
  };

  // Helper for Subcategories
  const handleAddSubCategory = (categoryId: string) => {
    if (!tempSubCatName.trim()) return;
    const newSub: SubCategory = { id: Date.now().toString(), categoryId, name: tempSubCatName };
    performSave(
        () => setSubCategories(prev => [...prev, newSub]),
        'subcategories',
        newSub
    );
    setTempSubCatName('');
  };
  const handleDeleteSubCategory = (id: string) => {
      performSave(
          () => setSubCategories(prev => prev.filter(s => s.id !== id)),
          'subcategories',
          null,
          id
      );
  };

  // Helper for Discount Rules
  const handleAddDiscountRule = () => {
    if (!tempDiscountRule.value || !tempDiscountRule.description) return;
    const newRule: DiscountRule = { id: Date.now().toString(), type: tempDiscountRule.type || 'percentage', value: Number(tempDiscountRule.value), description: tempDiscountRule.description };
    setProductData({ ...productData, discountRules: [...(productData.discountRules || []), newRule] });
    setTempDiscountRule({ type: 'percentage', value: 0, description: '' });
  };
  const handleRemoveDiscountRule = (id: string) => {
    setProductData({ ...productData, discountRules: (productData.discountRules || []).filter(r => r.id !== id) });
  };

  // Helper for Features (Highlights)
  const handleAddFeature = () => {
    if (!tempFeature.trim()) return;
    setProductData(prev => ({
      ...prev,
      features: [...(prev.features || []), tempFeature]
    }));
    setTempFeature('');
  };
  
  const handleRemoveFeature = (index: number) => {
    setProductData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  // Helper for Specifications
  const handleAddSpec = () => {
    if (!tempSpec.key.trim() || !tempSpec.value.trim()) return;
    setProductData(prev => ({
      ...prev,
      specifications: { ...(prev.specifications || {}), [tempSpec.key]: tempSpec.value }
    }));
    setTempSpec({ key: '', value: '' });
  };
  
  const handleRemoveSpec = (key: string) => {
    setProductData(prev => {
      const newSpecs = { ...(prev.specifications || {}) };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };
  
  const handleSaveAdmin = async () => {
    if (!adminData.email || !adminData.password) return;
    setCreatingAdmin(true);
    setSaveStatus('saving');
    
    let newItem: AdminUser;
    if (editingId) {
        const existing = admins.find(a => a.id === editingId);
        newItem = { ...existing!, ...adminData } as AdminUser;
    } else {
        newItem = { ...adminData, id: Date.now().toString(), createdAt: Date.now() } as AdminUser;
    }

    try {
      if (!editingId && isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: adminData.email,
          password: adminData.password,
          options: { data: { name: adminData.name, role: adminData.role } }
        });
        if (error) throw error;
      }
      
      await performSave(
          () => {
             if (editingId) setAdmins(prev => prev.map(a => a.id === editingId ? newItem : a));
             else setAdmins(prev => [...prev, newItem]); 
          },
          'admin_users',
          newItem
      );
      
      setShowAdminForm(false);
      setEditingId(null);
    } catch (err: any) {
      alert(`Error saving member: ${err.message}`);
      setSaveStatus('error');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = (id: string) => {
     performSave(
         () => setAdmins(prev => prev.filter(a => a.id !== id)),
         'admin_users',
         null,
         id
     );
  };


  // --- Render Functions for Tabs ---

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
         <div className="space-y-2">
            <h2 className="text-3xl font-serif text-white">Inbox</h2>
            <p className="text-slate-400 text-sm">Manage incoming client communications.</p>
         </div>
         <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => setEnquiries(prev => prev.map(e => ({...e, status: 'read'})))} className="flex-1 md:flex-none px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">Mark All Read</button>
            <button onClick={exportEnquiries} className="flex-1 md:flex-none px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2"><FileSpreadsheet size={16}/> Export CSV</button>
         </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Search sender, email, or subject..." value={enquirySearch} onChange={e => setEnquirySearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" />
         </div>
         <div className="flex gap-2 overflow-x-auto">
            {['all', 'unread', 'read'].map(filter => (
               <button key={filter} onClick={() => setEnquiryFilter(filter as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${enquiryFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}>
                  {filter}
               </button>
            ))}
         </div>
      </div>

      {filteredEnquiries.length === 0 ? <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800 text-slate-500">No enquiries found.</div> : 
        filteredEnquiries.map(e => (
          <div key={e.id} className={`bg-slate-900 border transition-all rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 text-left ${e.status === 'unread' ? 'border-primary/30 shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3"><h4 className="text-white font-bold">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase">{new Date(e.createdAt).toLocaleDateString()}</span></div>
              <p className="text-primary text-sm font-bold">{e.email}</p>
              <div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic leading-relaxed">"{e.message}"</div>
            </div>
            <div className="flex gap-2 items-start justify-end w-full md:w-auto">
              <button onClick={() => setReplyEnquiry(e)} className="p-4 bg-primary/20 text-primary rounded-2xl hover:bg-primary hover:text-slate-900 transition-colors" title="Reply"><Reply size={20}/></button>
              <button onClick={() => toggleEnquiryStatus(e.id)} className={`p-4 rounded-2xl transition-colors ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`} title={e.status === 'read' ? 'Mark Unread' : 'Mark Read'}><CheckCircle size={20}/></button>
              <button onClick={() => deleteEnquiry(e.id)} className="p-4 bg-slate-800 text-slate-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={20}/></button>
            </div>
          </div>
        ))
      }
    </div>
  );
  
  const renderCatalog = () => (
     <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ... Catalog Render Logic ... */}
      {showProductForm ? (
        <div className="bg-slate-900 p-6 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6">
             <h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Masterpiece' : 'New Collection Item'}</h3>
             <button onClick={() => setShowProductForm(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
                <SettingField label="SKU / Reference ID" value={productData.sku || ''} onChange={v => setProductData({...productData, sku: v})} />
                <SettingField label="Price (ZAR)" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
                <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label>
                   <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value, subCategoryId: ''})}>
                      <option value="">Select Department</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sub-Category</label>
                   <select 
                      className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none disabled:opacity-50" 
                      value={productData.subCategoryId} 
                      onChange={e => setProductData({...productData, subCategoryId: e.target.value})}
                      disabled={!productData.categoryId}
                   >
                      <option value="">Select Sub-Category</option>
                      {subCategories.filter(s => s.categoryId === productData.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                </div>
                <SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" />
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
             <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Media Gallery</label>
             <FileUploader files={productData.media || []} onFilesChange={files => setProductData({...productData, media: files})} />
          </div>
          
          {/* Ensure Buttons Stack on Mobile */}
          <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-slate-800">
             <button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Save Product</button>
             <button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
             <div className="space-y-2">
                <h2 className="text-3xl font-serif text-white">Catalog</h2>
                <p className="text-slate-400 text-sm">Curate your collection of affiliate products.</p>
             </div>
             <button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="w-full md:w-auto px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3"><Plus size={18} /> Add Product</button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
             <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="text" placeholder="Search by name..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" />
             </div>
             <div className="relative min-w-[200px]">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select value={productCatFilter} onChange={e => setProductCatFilter(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer">
                   <option value="all">All Departments</option>
                   {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="grid gap-4">
            {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && (productCatFilter === 'all' || p.categoryId === productCatFilter)).map(p => (
              <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-primary/30 transition-colors group gap-4">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div>
                  <div>
                     <h4 className="text-white font-bold">{p.name}</h4>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary text-xs font-bold">R {p.price}</span>
                        <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest">• {categories.find(c => c.id === p.categoryId)?.name}</span>
                     </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button onClick={() => setSelectedAdProduct(p)} className="flex-1 md:flex-none p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-slate-900 transition-colors" title="Social Share"><Megaphone size={18}/></button>
                  <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
     </div>
  );

  const renderHero = () => (
     <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AdminHelpBox title="Hero Carousel" steps={["Use high-res 16:9 images", "Videos auto-play muted", "Text overlays automatically adjust"]} />
        {showHeroForm ? ( 
           <div className="bg-slate-900 p-6 md:p-8 rounded-[3rem] border border-slate-800 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} />
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label>
                   <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={heroData.type || 'image'} onChange={e => setHeroData({...heroData, type: e.target.value as any})}>
                     <option value="image">Image</option>
                     <option value="video">Video</option>
                   </select>
                 </div>
              </div>
              <SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" />
              <SettingField label="Call to Action" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} />
              
              <SingleImageUploader label="Media Asset" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} />

              <div className="flex gap-4">
                 <button onClick={handleSaveHero} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Save Slide</button>
                 <button onClick={() => setShowHeroForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button>
              </div>
           </div>
        ) : (
           <>
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-3xl font-serif text-white">Hero Slides</h2>
                 <button onClick={() => { setHeroData({}); setShowHeroForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3"><Plus size={18} /> Add Slide</button>
              </div>
              <div className="grid gap-6">
                 {heroSlides.map((slide, index) => (
                    <div key={slide.id} className="group relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 aspect-video flex items-end">
                       {slide.type === 'video' ? <video src={slide.image} className="absolute inset-0 w-full h-full object-cover opacity-60" muted /> : <img src={slide.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                       <div className="relative p-8 z-10 w-full flex justify-between items-end">
                          <div>
                             <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block">Slide 0{index + 1}</span>
                             <h3 className="text-2xl font-serif text-white">{slide.title}</h3>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => { setHeroData(slide); setEditingId(slide.id); setShowHeroForm(true); }} className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white hover:text-slate-900 transition-all"><Edit2 size={18}/></button>
                             <button onClick={() => handleDeleteHero(slide.id)} className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </>
        )}
     </div>
  );

  const renderCategories = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
       <AdminHelpBox title="Department Structure" steps={["Categories define the main menu", "Icons appear on the home page grid"]} />
       {showCategoryForm ? (
          <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 space-y-6">
             <SettingField label="Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} />
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label>
                <IconPicker selected={catData.icon || 'Package'} onSelect={v => setCatData({...catData, icon: v})} />
             </div>
             <SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} />
             <SingleImageUploader label="Cover Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} />
             <div className="flex gap-4 mt-8">
                <button onClick={handleSaveCategory} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Save Department</button>
                <button onClick={() => setShowCategoryForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button>
             </div>
          </div>
       ) : (
          <>
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-serif text-white">Departments</h2>
                <button onClick={() => { setCatData({}); setShowCategoryForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3"><Plus size={18} /> Add Dept</button>
             </div>
             <div className="grid gap-4">
                {categories.map(cat => (
                   <div key={cat.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                            {React.createElement((LucideIcons as any)[cat.icon] || LucideIcons.Package, { size: 20 })}
                         </div>
                         <div>
                            <h4 className="text-white font-bold">{cat.name}</h4>
                            <p className="text-xs text-slate-500">{subCategories.filter(s => s.categoryId === cat.id).length} Sub-categories</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => { setCatData(cat); setEditingId(cat.id); setShowCategoryForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button>
                         <button onClick={() => handleDeleteCategory(cat.id)} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                      </div>
                   </div>
                ))}
             </div>
          </>
       )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 fixed inset-y-0">
         <div className="p-8">
            <h1 className="text-2xl font-serif text-white tracking-tight">Maison <span className="text-primary italic">Admin</span></h1>
         </div>
         <nav className="flex-grow px-4 space-y-1">
            {[
               { id: 'enquiries', label: 'Inbox', icon: Inbox },
               { id: 'catalog', label: 'Catalog', icon: ShoppingBag },
               { id: 'hero', label: 'Hero Slides', icon: LayoutPanelTop },
               { id: 'categories', label: 'Departments', icon: LayoutGrid },
               { id: 'analytics', label: 'Intelligence', icon: BarChart3 },
               { id: 'team', label: 'Team Access', icon: Users },
               { id: 'system', label: 'System', icon: SettingsIcon },
               { id: 'guide', label: 'Setup Guide', icon: BookOpen },
            ].map(item => (
               <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
               >
                  <item.icon size={18} /> {item.label}
               </button>
            ))}
         </nav>
         <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-colors">
               <LogOut size={18} /> Logout
            </button>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow lg:ml-72 p-6 md:p-12 overflow-y-auto">
         {/* Mobile Header */}
         <div className="lg:hidden flex justify-between items-center mb-8">
            <h1 className="text-xl font-serif text-white">Admin Portal</h1>
            <div className="flex gap-4">
               <button onClick={() => setActiveTab('enquiries')} className="p-2 bg-slate-900 rounded-lg text-slate-400"><Inbox size={20}/></button>
               <button onClick={handleLogout} className="p-2 bg-slate-900 rounded-lg text-red-400"><LogOut size={20}/></button>
            </div>
         </div>

         {/* Render Active Tab */}
         {activeTab === 'enquiries' && renderEnquiries()}
         {activeTab === 'catalog' && renderCatalog()}
         {activeTab === 'hero' && renderHero()}
         {activeTab === 'categories' && renderCategories()}
         {activeTab === 'analytics' && <AnalyticsView products={products} stats={stats} categories={categories} trafficEvents={trafficEvents} onEditProduct={(p) => { setProductData(p); setEditingId(p.id); setActiveTab('catalog'); setShowProductForm(true); }} />}
         {activeTab === 'team' && (
            <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
               {showAdminForm ? (
                  <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 space-y-6">
                     <h3 className="text-2xl font-serif text-white mb-6">Team Member Access</h3>
                     <SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} />
                     <SettingField label="Email Address" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} />
                     <SettingField label="Password" value={adminData.password || ''} onChange={v => setAdminData({...adminData, password: v})} type="password" />
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Role</label>
                        <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={adminData.role || 'admin'} onChange={e => setAdminData({...adminData, role: e.target.value as any})}>
                           <option value="admin">Administrator</option>
                           <option value="owner">Owner</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Permissions</label>
                        <PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} />
                     </div>
                     <div className="flex gap-4 mt-8">
                        <button onClick={handleSaveAdmin} disabled={creatingAdmin} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20 disabled:opacity-50">
                           {creatingAdmin ? 'Creating...' : 'Save Access'}
                        </button>
                        <button onClick={() => setShowAdminForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button>
                     </div>
                  </div>
               ) : (
                  <>
                     <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-serif text-white">Team Access</h2>
                        <button onClick={() => { setAdminData({ permissions: [] }); setShowAdminForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3"><Plus size={18} /> Add Member</button>
                     </div>
                     <div className="grid gap-4">
                        {admins.map(admin => (
                           <div key={admin.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-primary/30 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                    {admin.name.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="text-white font-bold">{admin.name} <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase ml-2">{admin.role}</span></h4>
                                    <p className="text-xs text-slate-500">{admin.email}</p>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => { setAdminData(admin); setEditingId(admin.id); setShowAdminForm(true); }} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button>
                                 <button onClick={() => handleDeleteAdmin(admin.id)} className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </>
               )}
            </div>
         )}
         {activeTab === 'system' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                      <h3 className="text-xl font-serif text-white">System Health</h3>
                      <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                         <div className={`w-3 h-3 rounded-full ${connectionHealth?.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                         <div>
                            <p className="text-sm font-bold text-white">{connectionHealth?.message || 'Checking...'}</p>
                            <p className="text-xs text-slate-500 font-mono">Latency: {connectionHealth?.latency || 0}ms</p>
                         </div>
                      </div>
                   </div>
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 space-y-4">
                      <h3 className="text-xl font-serif text-white">Data Control</h3>
                      <div className="flex gap-4">
                         <button onClick={handleBackup} className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"><Download size={16}/> Backup JSON</button>
                         <button onClick={handleFactoryReset} className="flex-1 py-4 bg-red-900/20 text-red-500 border border-red-900/30 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"><Trash2 size={16}/> Reset</button>
                      </div>
                   </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800">
                    <h3 className="text-xl font-serif text-white mb-4">Environment Config</h3>
                    <CodeBlock code={JSON.stringify({ 
                       supabaseUrl: getSupabaseUrl(),
                       mode: isLocalMode ? 'Local Simulation' : 'Cloud Connected',
                       build: 'Production v2.1.0'
                    }, null, 2)} label="System Environment" language="json" />
                </div>
             </div>
         )}
         {activeTab === 'guide' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-serif text-white mb-8 text-center">Setup Guide</h2>
                    <div className="space-y-12">
                       {GUIDE_STEPS.map((step, idx) => (
                          <div key={step.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                <span className="text-9xl font-serif font-bold text-white">{idx + 1}</span>
                             </div>
                             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                   <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                   <p className="text-slate-400 text-sm leading-relaxed mb-6">{step.description}</p>
                                   {step.subSteps && (
                                      <ul className="space-y-3 mb-6">
                                         {step.subSteps.map((s, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-300">
                                               <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                               {s}
                                            </li>
                                         ))}
                                      </ul>
                                   )}
                                   {step.code && <CodeBlock code={step.code} label={step.codeLabel} />}
                                   {step.tips && (
                                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs italic">
                                         {step.tips}
                                      </div>
                                   )}
                                </div>
                                <div className="hidden md:block">
                                   <GuideIllustration id={step.illustrationId} />
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
             </div>
         )}

         {/* Modals */}
         {selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}
         {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}
      </main>
    </div>
  );
};

export default Admin;
