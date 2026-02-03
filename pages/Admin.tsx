import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, 
  Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown,
  Monitor, Smartphone, User, ShieldCheck,
  LayoutGrid, Globe, Mail, Phone, Palette, Hash, MessageCircle, MapPin, 
  BookOpen, FileText, Share2, Tag, ArrowRight, Video, Image, ShoppingBag,
  LayoutPanelTop, Inbox, Calendar, MoreHorizontal, CheckCircle, Percent, LogOut,
  Rocket, Terminal, Copy, Check, Database, Github, Server, AlertTriangle, ExternalLink, RefreshCcw, Flame, Trash,
  Megaphone, Sparkles, Wand2, CopyCheck, Loader2, Users, Key, Lock, Briefcase, Download, UploadCloud, FileJson, Link as LinkIcon, Reply, Paperclip, Send, AlertOctagon,
  ArrowLeft, Eye, MessageSquare, CreditCard, Shield, Award, PenTool, Globe2, HelpCircle, PenLine, Images, Instagram, Twitter, ChevronRight, Layers, FileCode, Search, Grid,
  Maximize2, Minimize2, CheckSquare, Square, Target, Clock, Filter, FileSpreadsheet, BarChart3, TrendingUp, MousePointer2, Star, Activity, Zap, Timer, ServerCrash,
  BarChart, ZapOff, Activity as ActivityIcon, Code, Map, Wifi, WifiOff, Facebook, Linkedin,
  FileBox, Lightbulb, Tablet, Laptop, CheckCircle2, SearchCode, GraduationCap, Pin, MousePointerClick, Puzzle, AtSign, Ghost, Gamepad2, HardDrive, Cpu, XCircle, DollarSign
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { EMAIL_TEMPLATE_HTML, GUIDE_STEPS, PERMISSION_TREE, TRAINING_MODULES } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, getSupabaseUrl } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CustomIcons } from '../components/CustomIcons';

const AdminTip: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-yellow-500/5 border border-yellow-500/20 p-5 md:p-6 rounded-3xl mb-8 flex gap-4 md:gap-5 items-start text-left animate-in fade-in slide-in-from-top-2">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-600 flex-shrink-0">
      <Lightbulb size={18} className="md:w-5 md:h-5" />
    </div>
    <div className="space-y-1 min-w-0 flex-1">
      <h4 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{title}</h4>
      <div className="text-slate-400 text-xs leading-relaxed font-medium break-words">
        {children}
      </div>
    </div>
  </div>
);

const SaveIndicator: React.FC<{ status: 'idle' | 'saving' | 'saved' | 'error' }> = ({ status }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'saved' || status === 'error') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-24 right-6 z-[100] ${status === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-6 border border-white/20`}>
      <div className="p-2 bg-white/20 rounded-full">
        {status === 'error' ? <AlertOctagon size={24} /> : <CheckCircle2 size={24} />}
      </div>
      <div>
         <h4 className="font-bold text-sm uppercase tracking-widest">{status === 'error' ? 'Connection Error' : 'System Synced'}</h4>
         <p className="text-[10px] opacity-90 font-medium">{status === 'error' ? 'Check cloud configuration.' : 'Changes successfully recorded.'}</p>
      </div>
    </div>
  );
};

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full min-w-0">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={rows} className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input type={type} className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
);

const SingleImageUploader: React.FC<{ value: string; onChange: (v: string) => void; label: string; accept?: string; className?: string }> = ({ value, onChange, label, accept = "image/*", className = "h-40 w-40" }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      if (isSupabaseConfigured) {
        const url = await uploadMedia(file, 'media');
        if (url) onChange(url);
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => onChange(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Ensure Supabase storage is configured.");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || accept?.includes('video');

  return (
    <div className="space-y-2 text-left w-full min-w-0">
       <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
       <div 
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative ${className} overflow-hidden bg-slate-800 border-2 border-dashed border-slate-700 hover:border-primary/50 transition-all cursor-pointer group rounded-2xl flex-shrink-0 max-w-full`}
       >
          {uploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-primary bg-slate-900 z-10 p-2 text-center">
               <Loader2 size={24} className="animate-spin mb-2" />
               <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                 <div className="bg-primary h-full animate-[grow_2s_infinite]"></div>
               </div>
            </div>
          ) : value ? (
            <>
              {isVideo ? (
                 <video src={value} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" autoPlay muted loop playsInline />
              ) : (
                 <img src={value} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" alt="preview" />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white text-xs font-bold">
                   <Edit2 size={16}/>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
               <Image size={24} className="mb-2 opacity-50" />
               <span className="text-[8px] font-black uppercase tracking-widest text-center px-2">Upload</span>
            </div>
          )}
          <input 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            accept={accept}
            onChange={handleUpload}
            disabled={uploading}
          />
       </div>
    </div>
  );
};

const MultiImageUploader: React.FC<{ images: string[]; onChange: (images: string[]) => void; label: string }> = ({ images = [], onChange, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const processFiles = async (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setUploading(true);
    
    const newUrls: string[] = [];
    
    try {
      for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i];
        if (isSupabaseConfigured) {
          const url = await uploadMedia(file, 'media');
          if (url) newUrls.push(url);
        } else {
           const reader = new FileReader();
           await new Promise<void>((resolve) => {
             reader.onload = (e) => {
               if (e.target?.result) newUrls.push(e.target.result as string);
               resolve();
             };
             reader.readAsDataURL(file);
           });
        }
      }
      onChange([...images, ...newUrls]);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4 text-left w-full min-w-0">
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
      
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {/* Upload Button */}
        <div onClick={() => !uploading && fileInputRef.current?.click()} className="aspect-square border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 group">
          {uploading ? (
             <Loader2 size={24} className="animate-spin text-primary" />
          ) : (
             <Plus className="text-slate-400 group-hover:text-white" size={24} />
          )}
          <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={e => processFiles(e.target.files)} />
        </div>

        {images.map((url, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900">
              <img src={url} className="w-full h-full object-cover" alt="preview" />
              <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
            </div>
        ))}
      </div>
    </div>
  );
};

const SocialLinksManager: React.FC<{ links: SocialLink[]; onChange: (links: SocialLink[]) => void }> = ({ links, onChange }) => {
  const handleAdd = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      name: 'New Platform',
      url: 'https://',
      iconUrl: ''
    };
    onChange([...links, newLink]);
  };

  const handleUpdate = (id: string, field: keyof SocialLink, value: string) => {
    const updated = links.map(link => link.id === id ? { ...link, [field]: value } : link);
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    onChange(links.filter(link => link.id !== id));
  };

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Social Profiles</label>
        <button onClick={handleAdd} className="text-[10px] font-black uppercase text-primary hover:text-white flex items-center gap-1">
          <Plus size={12}/> Add
        </button>
      </div>
      
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-start">
             {/* Icon Uploader */}
             <div className="flex-shrink-0">
                <SingleImageUploader 
                  label="" 
                  value={link.iconUrl} 
                  onChange={v => handleUpdate(link.id, 'iconUrl', v)}
                  className="w-12 h-12 rounded-xl"
                />
             </div>
             
             {/* Fields */}
             <div className="flex-grow grid grid-cols-2 gap-3 w-full">
                <input 
                  type="text" 
                  value={link.name} 
                  onChange={e => handleUpdate(link.id, 'name', e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-primary"
                  placeholder="Platform Name"
                />
                <input 
                  type="text" 
                  value={link.url} 
                  onChange={e => handleUpdate(link.id, 'url', e.target.value)} 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-primary"
                  placeholder="Profile URL"
                />
             </div>

             <button onClick={() => handleRemove(link.id)} className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-colors">
               <Trash2 size={16} />
             </button>
          </div>
        ))}
        {links.length === 0 && (
          <div className="text-center p-6 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
             No social profiles added.
          </div>
        )}
      </div>
    </div>
  );
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const getPlatformStyles = (sourceName: string) => {
  const lower = (sourceName || '').toLowerCase();
  
  if (lower.includes('facebook')) return { icon: Facebook, color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/20' };
  if (lower.includes('instagram')) return { icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500', border: 'border-pink-500/20' };
  if (lower.includes('tiktok')) return { icon: () => <span className="font-black text-[8px] bg-white text-black px-1 rounded">TK</span>, color: 'text-white', bg: 'bg-slate-700', border: 'border-slate-600' };
  if (lower.includes('pinterest')) return { icon: Pin, color: 'text-red-600', bg: 'bg-red-600', border: 'border-red-600/20' };
  if (lower.includes('whatsapp')) return { icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500/20' };
  if (lower.includes('google')) return { icon: SearchCode, color: 'text-green-400', bg: 'bg-green-400', border: 'border-green-400/20' };
  if (lower.includes('twitter') || lower.includes('x (')) return { icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-500', border: 'border-sky-500/20' };
  if (lower.includes('linkedin')) return { icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-600', border: 'border-blue-600/20' };
  
  return { 
    icon: Globe, 
    color: 'text-white', 
    bg: `bg-[${stringToColor(sourceName)}]`, 
    border: 'border-white/10' 
  };
};

const TrafficAreaChart: React.FC<{ trafficEvents: any[] }> = ({ trafficEvents }) => {
  const [geoStats, setGeoStats] = useState<any[]>([]);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const [deviceStats, setDeviceStats] = useState<{mobile: number, desktop: number, tablet: number}>({mobile: 0, desktop: 0, tablet: 0});
  
  useEffect(() => {
    const loadDetailedGeo = () => {
      let rawData = [];
      try {
        rawData = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
        if (!Array.isArray(rawData)) rawData = [];
      } catch (e) {
        console.warn("Failed to parse geo stats", e);
        rawData = [];
      }
      
      setTotalTraffic(rawData.length);

      const agg: Record<string, any> = {};
      let dev = { mobile: 0, desktop: 0, tablet: 0 };
      
      rawData.forEach((entry: any) => {
        if (!entry) return;
        
        const city = entry.city || 'Unknown City';
        const region = entry.region || '';
        const country = entry.country || 'Global';
        const device = entry.device || 'Desktop';
        
        if (device === 'Mobile') dev.mobile++;
        else if (device === 'Tablet') dev.tablet++;
        else dev.desktop++;

        const key = `${city}-${region}-${country}`;
        
        if (!agg[key]) {
          agg[key] = {
            city,
            region,
            country,
            device,
            os: entry.os || 'Unknown',
            browser: entry.browser || 'Unknown',
            source: entry.source || 'Direct',
            count: 0,
            lastActive: 0
          };
        }
        agg[key].count += 1;
        agg[key].lastActive = Math.max(agg[key].lastActive, entry.timestamp || 0);
        if (entry.source && entry.source !== 'Direct') agg[key].source = entry.source;
      });

      setDeviceStats(dev);
      const sorted = Object.values(agg).sort((a: any, b: any) => b.count - a.count).slice(0, 15);
      setGeoStats(sorted);
    };

    loadDetailedGeo();
    const interval = setInterval(loadDetailedGeo, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSourceIcon = (source: string) => {
    const styles = getPlatformStyles(source);
    return <styles.icon size={12} className={styles.color} />;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 relative min-h-[600px] bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group flex flex-col">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 p-8 md:p-10 pb-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-start text-left gap-4">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="relative w-3 h-3">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-3 h-3 bg-green-500 rounded-full"></div>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Live Traffic Feed</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">Precise <span className="text-primary">Location</span></h3>
           </div>
           <div className="text-left md:text-right">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Hits</span>
              <span className="text-3xl font-bold text-white font-mono">{totalTraffic.toLocaleString()}</span>
           </div>
        </div>

        <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8">
          {geoStats.length > 0 ? (
            <div className="grid gap-4">
               <div className="hidden md:grid grid-cols-12 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6 text-left">Location (Town/City)</div>
                  <div className="col-span-2 text-right">Hits</div>
                  <div className="col-span-3 text-right">Device/Source</div>
               </div>
               {geoStats.map((geo, idx) => {
                 const isLive = (Date.now() - geo.lastActive) < 300000;
                 return (
                    <div key={idx} className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center p-5 bg-slate-800/40 rounded-3xl border border-white/5 hover:bg-slate-800 transition-colors group/item gap-2 md:gap-0">
                       <div className="col-span-1 hidden md:block">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">{idx + 1}</span>
                       </div>
                       <div className="col-span-8 md:col-span-6 pl-0 md:pl-2 text-left w-full">
                          <div className="font-bold text-white text-base flex items-center gap-2 truncate">
                             <MapPin size={16} className="text-primary opacity-50 group-hover/item:opacity-100 transition-opacity flex-shrink-0"/>
                             {geo.city}
                          </div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">{geo.region}, {geo.country}</div>
                       </div>
                       <div className="col-span-2 text-right w-full md:w-auto flex justify-between md:block">
                          <span className="md:hidden text-slate-500 text-xs font-bold uppercase">Hits:</span>
                          <div className="text-white font-mono font-bold text-lg">{geo.count}</div>
                       </div>
                       <div className="col-span-4 md:col-span-3 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t border-white/5 md:border-0">
                          {isLive ? (
                             <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest border border-green-500/20">Online</span>
                          ) : (
                             <span className="text-[10px] text-slate-600 font-bold uppercase whitespace-nowrap">Last: {new Date(geo.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          )}
                          <div className="flex items-center gap-3 text-[10px] text-slate-500">
                             <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">{getSourceIcon(geo.source)} <span className="uppercase">{geo.source}</span></div>
                             {geo.device === 'Mobile' ? <Smartphone size={12} /> : <Monitor size={12} />}
                          </div>
                       </div>
                    </div>
                 );
               })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
               <Globe size={48} className="text-slate-500 mb-4 animate-pulse" />
               <h4 className="text-white font-bold uppercase tracking-widest">Awaiting Signal</h4>
               <p className="text-slate-500 text-xs mt-2 max-w-xs">Data populates as visitors access your bridge page.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-white/10 p-8 md:p-10 flex flex-col shadow-2xl text-left h-full">
         <div className="mb-8">
            <h3 className="text-white font-bold text-xl flex items-center gap-3"><Smartphone size={24} className="text-primary"/> Device Breakdown</h3>
            <p className="text-slate-500 text-xs mt-1">Platform Distribution</p>
         </div>
         <div className="space-y-6 flex-grow">
            {[
              { label: 'Mobile', count: deviceStats.mobile, icon: Smartphone, color: 'text-primary', bar: 'bg-primary' },
              { label: 'Desktop', count: deviceStats.desktop, icon: Monitor, color: 'text-blue-500', bar: 'bg-blue-500' },
              { label: 'Tablet', count: deviceStats.tablet, icon: Tablet, color: 'text-purple-500', bar: 'bg-purple-500' }
            ].map((d, i) => (
              <div key={i} className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                       <div className={`p-3 bg-slate-800 rounded-2xl ${d.color}`}><d.icon size={20}/></div>
                       <span className="text-white font-bold text-base">{d.label}</span>
                    </div>
                    <span className="text-white font-mono font-bold text-lg">{d.count}</span>
                 </div>
                 <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full ${d.bar} transition-all duration-1000`} style={{ width: `${totalTraffic > 0 ? (d.count / totalTraffic) * 100 : 0}%` }}></div>
                 </div>
                 <div className="mt-3 text-right">
                    <span className="text-[10px] text-slate-500 font-bold">{totalTraffic > 0 ? Math.round((d.count / totalTraffic) * 100) : 0}% share</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const GuideIllustration: React.FC<{ id?: string }> = ({ id }) => {
  switch (id) {
    case 'forge':
      return (<div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden min-w-0"><div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--primary-color),transparent_70%)]" /><div className="relative z-10 flex flex-col items-center"><div className="flex gap-4 mb-8"><div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl rotate-[-12deg]"><FileCode size={32} /></div><div className="w-16 h-16 bg-primary text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl rotate-[12deg]"><Terminal size={32} /></div></div><div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-primary w-2/3 animate-[shimmer_2s_infinite]" /></div></div></div>);
    default:
      return (<div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center min-w-0"><Rocket className="text-slate-800 w-24 h-24" /></div>);
  }
};

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (perms: string[]) => void; role: 'owner' | 'admin'; }> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access by default.</div>;
  const togglePermission = (id: string) => { if (permissions.includes(id)) { onChange(permissions.filter(p => p !== id)); } else { onChange([...permissions, id]); } };
  const toggleGroup = (node: PermissionNode) => { const childIds = node.children?.map(c => c.id) || []; const allSelected = childIds.every(id => permissions.includes(id)); if (allSelected) { onChange(permissions.filter(p => !childIds.includes(p))); } else { const newPerms = [...permissions]; childIds.forEach(id => { if (!newPerms.includes(id)) newPerms.push(id); }); onChange(newPerms); } };
  return (
    <div className="space-y-6">{PERMISSION_TREE.map(group => { const childIds = group.children?.map(c => c.id) || []; const isAllSelected = childIds.every(id => permissions.includes(id)); return (<div key={group.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left"><div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3"><div className="flex flex-col"><span className="text-white font-bold text-sm">{group.label}</span><span className="text-slate-500 text-[10px]">{group.description}</span></div><button onClick={() => toggleGroup(group)} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">{isAllSelected ? 'Deselect All' : 'Select All'}</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{group.children?.map(perm => { const isSelected = permissions.includes(perm.id); return (<button key={perm.id} onClick={() => togglePermission(perm.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>{isSelected ? <CheckSquare size={16} className="text-primary flex-shrink-0" /> : <Square size={16} className="flex-shrink-0" />}<span className="text-xs font-medium">{perm.label}</span></button>); })}</div></div>); })}</div>
  );
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const [search, setSearch] = useState(''); const [isOpen, setIsOpen] = useState(false); const [limit, setLimit] = useState(100);
  const CUSTOM_KEYS = Object.keys(CustomIcons); const LUCIDE_KEYS = Object.keys(LucideIcons).filter(key => { const val = (LucideIcons as any)[key]; return /^[A-Z]/.test(key) && typeof val === 'function' && !key.includes('Icon') && !key.includes('Context'); });
  const ALL_ICONS = [...CUSTOM_KEYS, ...LUCIDE_KEYS]; const filtered = search ? ALL_ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase())) : ALL_ICONS; const displayed = filtered.slice(0, limit); const SelectedIconComponent = CustomIcons[selected] || (LucideIcons as any)[selected] || LucideIcons.Package;
  return (<div className="relative text-left w-full"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"><div className="flex items-center gap-3"><SelectedIconComponent size={18} /><span className="text-xs font-bold">{selected}</span></div><ChevronDown size={14} /></button>{isOpen && (<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"><div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"><div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800"><div><h3 className="text-white font-bold text-lg flex items-center gap-2"><Grid size={18} className="text-primary"/> Icon Library</h3><p className="text-slate-400 text-xs mt-1">Select from {filtered.length} curated icons</p></div><button onClick={() => setIsOpen(false)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors"><X size={20}/></button></div><div className="p-4 bg-slate-900 border-b border-slate-800"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none text-white focus:border-primary transition-all" placeholder="Search icons..." value={search} onChange={e => { setSearch(e.target.value); setLimit(100); }} autoFocus /></div></div><div className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-slate-950"><div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">{displayed.map(name => { const IconComp = CustomIcons[name] || (LucideIcons as any)[name]; if (!IconComp) return null; return (<button key={name} onClick={() => { onSelect(name); setIsOpen(false); }} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all border ${selected === name ? 'bg-primary text-slate-900 border-primary shadow-lg scale-105' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}><IconComp size={24} /><span className="text-[9px] font-medium truncate w-full px-2 text-center opacity-70">{name}</span></button>) })}</div>{displayed.length < filtered.length && (<button onClick={() => setLimit(prev => prev + 100)} className="w-full mt-6 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-colors">Load More</button>)}</div></div></div>)}</div>);
};

const EmailReplyModal: React.FC<{ enquiry: Enquiry; onClose: () => void }> = ({ enquiry, onClose }) => {
  const { settings, products } = useSettings();
  const [subject, setSubject] = useState(`Re: ${enquiry.subject}`);
  const [message, setMessage] = useState(`Dear ${enquiry.name},\n\nThank you for contacting ${settings.companyName}.\n\n[Your response here]\n\nBest regards,\n${settings.companyName}\n${settings.address}\n${settings.contactEmail}`);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false); const [success, setSuccess] = useState(false); const [error, setError] = useState<string | null>(null);
  const handleSend = async () => { const serviceId = settings.emailJsServiceId?.trim(); const templateId = settings.emailJsTemplateId?.trim(); const publicKey = settings.emailJsPublicKey?.trim(); if (!serviceId || !templateId || !publicKey) { setError("Email.js is not configured."); return; } setSending(true); setError(null); try { const fileLinks: string[] = []; if (attachments.length > 0) { if (!isSupabaseConfigured) throw new Error("Supabase is required for attachments."); for (const file of attachments) { const url = await uploadMedia(file, 'media'); if (url) fileLinks.push(`${file.name}: ${url}`); } } let finalMessage = message.replace(/\n/g, '<br>'); if (fileLinks.length > 0) finalMessage += `<br><br><strong>Attachments:</strong><br>${fileLinks.map(l => `<a href="${l.split(': ')[1]}">${l.split(': ')[0]}</a>`).join('<br>')}`; let logoUrl = settings.companyLogoUrl || ''; const productsHtml = ''; const socialsHtml = ''; const templateParams = { to_name: enquiry.name, to_email: enquiry.email, subject, message: finalMessage, reply_to: enquiry.email, company_name: settings.companyName, company_address: settings.address, company_website: window.location.origin, company_logo_url: logoUrl, products_html: productsHtml, socials_html: socialsHtml, year: new Date().getFullYear().toString() }; await emailjs.send(serviceId, templateId, templateParams, publicKey); setSuccess(true); setTimeout(onClose, 2000); } catch (err: any) { console.error('EmailJS Error:', err); setError(err.text || err.message); } finally { setSending(false); } };
  if (success) return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"><div className="bg-white rounded-3xl p-10 text-center animate-in zoom-in"><div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-4"><CheckCircle size={40} /></div><h3 className="text-2xl font-bold text-slate-900">Email Sent!</h3></div></div>);
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"><div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"><div className="p-6 border-b border-slate-800 flex justify-between items-center"><h3 className="text-white font-bold flex items-center gap-3"><Reply size={20} className="text-primary"/> Reply to {enquiry.name}</h3><button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24}/></button></div><div className="p-6 overflow-y-auto space-y-6 text-left">{error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}<div className="space-y-4"><div className="grid grid-cols-2 gap-4"><SettingField label="To" value={enquiry.email} onChange={() => {}} type="text" /><SettingField label="Subject" value={subject} onChange={setSubject} /></div><SettingField label="Message (HTML Support Enabled)" value={message} onChange={setMessage} type="textarea" rows={12} /><div className="space-y-2 text-left"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Paperclip size={12}/> Attachments (Requires Storage)</label><input type="file" multiple onChange={e => e.target.files && setAttachments(Array.from(e.target.files))} className="block w-full text-xs text-slate-400 file:bg-slate-800 file:text-primary file:rounded-full file:border-0 file:py-2 file:px-4" /></div></div></div><div className="p-6 border-t border-slate-800 flex justify-end gap-3"><button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest">Cancel</button><button onClick={handleSend} disabled={sending} className="px-8 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">{sending ? <Loader2 size={16} className="animate-spin"/> : <Send size={16}/>} Send Email</button></div></div></div>);
};

const PLATFORMS = [ { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C', maxLength: 2200, hashTags: true }, { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', maxLength: 63206, hashTags: false }, { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#1DA1F2', maxLength: 280, hashTags: true }, { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', maxLength: 3000, hashTags: true }, { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366', maxLength: 1000, hashTags: false } ];
const AdGeneratorModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { settings } = useSettings(); const [copied, setCopied] = useState(false); const [platform, setPlatform] = useState(PLATFORMS[0]); const [customText, setCustomText] = useState('');
  useEffect(() => { 
    const baseText = `Check out the ${product.name} from ${settings.companyName}.`; 
    const price = `Price: R ${product.price}`; 
    const link = `${window.location.origin}/#/product/${product.id}`; 
    const features = product.features ? product.features.slice(0, 3).map(f => `• ${f}`).join('\n') : ''; 
    const discount = product.discountRules?.[0];
    const discountText = discount ? (discount.type === 'percentage' ? `🔥 ${discount.value}% OFF` : `🔥 R${discount.value} OFF`) : '';

    let generated = ''; 
    switch(platform.id) { 
        case 'instagram': 
            generated = `✨ NEW DROP: ${product.name} ✨\n\n${product.description.substring(0, 100)}...\n\n💎 ${price}\n${discountText ? `${discountText}\n` : ''}\n${features}\n\n👇 SHOP NOW\nLink in bio / story!\n\n#${settings.companyName.replace(/\s/g, '')} #LuxuryFashion`; 
            break; 
        default: 
            generated = `${product.name} is now available.\n\n${product.description.substring(0, 200)}...\n\n${discountText ? `${discountText}\n` : ''}${features}\n\nShop securely here: ${link}`; 
    } 
    setCustomText(generated); 
  }, [platform, product, settings]);
  const handleCopy = () => { navigator.clipboard.writeText(customText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  
  const handleShareBundle = async () => {
    if (!navigator.share) {
      alert("Sharing not supported on this device/browser. Please copy text and save image manually.");
      return;
    }
    try {
      const link = `${window.location.origin}/#/product/${product.id}`;
      const shareData: any = { title: settings.companyName, text: customText, url: link };
      if (product.media?.[0]?.url) {
        try {
          const response = await fetch(product.media[0].url);
          const blob = await response.blob();
          const file = new File([blob], `${product.name.replace(/\s/g, '_')}.jpg`, { type: blob.type });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
             shareData.files = [file];
          }
        } catch (e) { console.warn("Could not bundle image for share", e); }
      }
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing', error);
      alert("Device sharing failed. Please use 'Save Image' and 'Copy Text' manually.");
    }
  };

  return (<div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-slate-950 animate-in fade-in duration-300"><div className="w-full md:w-1/2 bg-black/40 border-r border-slate-800 flex flex-col h-full relative"><div className="p-8 flex justify-between items-center border-b border-slate-800"><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Content Preview</span><button onClick={onClose} className="md:hidden p-2 text-slate-500"><X size={24} /></button></div><div className="flex-grow flex items-center justify-center p-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"><div className="w-[320px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden relative"><div className="bg-slate-100 h-6 w-full absolute top-0 left-0 z-20 flex justify-center"><div className="w-20 h-4 bg-slate-900 rounded-b-xl"></div></div><div className="mt-8 px-4 pb-2 flex items-center gap-2 border-b border-slate-100"><div className="w-8 h-8 rounded-full bg-slate-200"></div><span className="text-xs font-bold text-slate-900">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span><platform.icon size={14} style={{ color: platform.color }} className="ml-auto"/></div><div className="aspect-square bg-slate-100 relative text-left"><img src={product.media[0]?.url} className="w-full h-full object-cover" /></div><div className="p-4 text-left"><p className="text-[10px] text-slate-800 whitespace-pre-wrap leading-relaxed"><span className="font-bold mr-1">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>{customText}</p></div></div></div></div><div className="w-full md:w-1/2 bg-slate-950 flex flex-col h-full relative p-8 md:p-12 overflow-y-auto text-left"><button onClick={onClose} className="hidden md:block absolute top-10 right-10 p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white"><X size={24} /></button><div className="max-w-xl mx-auto space-y-8 w-full"><div><h3 className="text-3xl font-serif text-white mb-2">Social <span className="text-primary italic">Manager</span></h3><p className="text-slate-500 text-sm">Generate optimized assets.</p></div><div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">{PLATFORMS.map(p => (<button key={p.id} onClick={() => setPlatform(p)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all min-w-[100px] ${platform.id === p.id ? 'bg-slate-800 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'}`}><p.icon size={24} style={{ color: platform.id === p.id ? '#fff' : p.color }} /><span className="text-[10px] font-bold uppercase">{p.name}</span></button>))}</div><div className="space-y-2"><div className="flex justify-between"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Caption</label><span className={`text-[10px] font-bold ${customText.length > platform.maxLength ? 'text-red-500' : 'text-slate-600'}`}>{customText.length} / {platform.maxLength}</span></div><textarea rows={10} value={customText} onChange={e => setCustomText(e.target.value)} className="w-full p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm leading-relaxed outline-none focus:border-primary resize-none font-sans"/></div><div className="grid grid-cols-2 gap-4"><button onClick={handleCopy} className="col-span-2 py-4 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-white flex items-center justify-center gap-2 border border-dashed border-slate-600">{copied ? <Check size={16}/> : <Copy size={16}/>} 1. Copy Caption First</button><button onClick={handleShareBundle} className="col-span-2 py-4 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"><Share2 size={16}/> 2. Share Bundle (Img + Text)</button><div className="col-span-2 text-center text-slate-600 text-[9px] uppercase font-bold tracking-widest mt-2">Note: Many apps discard captions when sharing files. Copy text first.</div></div></div></div></div>);
};

const CodeBlock: React.FC<{ code: string; language?: string; label?: string }> = ({ code, language = 'bash', label }) => {
  const [copied, setCopied] = useState(false); const copyToClipboard = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (<div className="relative group mb-6 text-left max-w-full overflow-hidden w-full min-w-0">{label && <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2"><Terminal size={12}/>{label}</div>}<div className="absolute top-8 right-4 z-10"><button onClick={copyToClipboard} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/5">{copied ? <Check size={14} /> : <Copy size={14} />}</button></div><pre className="p-6 bg-black rounded-2xl text-[10px] md:text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800 leading-relaxed custom-scrollbar shadow-inner w-full max-w-full"><code>{code}</code></pre></div>);
};

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string; accept?: string; }> = ({ files, onFilesChange, multiple = true, label = "media", accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const processFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setUploading(true);
    Array.from(incomingFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        let result = e.target?.result as string;
        if (isSupabaseConfigured) {
           try {
             const publicUrl = await uploadMedia(file, 'media');
             if (publicUrl) result = publicUrl;
           } catch (err) { console.error("Upload failed", err); }
        }
        const newMedia: MediaFile = { 
          id: Math.random().toString(36).substr(2, 9), 
          url: result, 
          name: file.name, 
          type: file.type, 
          size: file.size 
        };
        onFilesChange(multiple ? [...files, newMedia] : [newMedia]);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <div className="space-y-4 text-left w-full min-w-0">
      <div onClick={() => !uploading && fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-slate-900/30 group min-h-[100px]">
        {uploading ? (
           <div className="flex flex-col items-center">
             <Loader2 size={24} className="animate-spin text-primary mb-2" />
             <div className="w-24 bg-slate-700 h-1 rounded-full overflow-hidden"><div className="bg-primary h-full animate-[grow_2s_infinite]"></div></div>
             <span className="text-[9px] mt-2 uppercase font-black text-slate-500">Processing...</span>
           </div>
        ) : (
           <>
            <Upload className="text-slate-400 group-hover:text-white mb-2" size={20} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Add {label}</p>
           </>
        )}
        <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} accept={accept} onChange={e => processFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 animate-in fade-in slide-in-from-bottom-2">
          {files.map(f => (
            <div key={f.id} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900">
              {f.type.startsWith('video') ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-500"><Video size={20}/><span className="text-[8px] mt-1 uppercase font-bold">Video</span></div>
              ) : (
                 <img src={f.url} className="w-full h-full object-cover" alt="preview" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => onFilesChange(files.filter(x => x.id !== f.id))} className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const IntegrationGuide: React.FC = () => (
  <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 mb-8 text-left">
     <h4 className="text-primary font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
       <Lightbulb size={16}/> Integration Setup Guide
     </h4>
     <div className="space-y-4 text-xs text-slate-400">
        <details className="group">
          <summary className="cursor-pointer font-bold text-white mb-2 list-none flex items-center gap-2 group-open:text-primary transition-colors">
            <Mail size={14} /> EmailJS (Forms)
          </summary>
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2">
            <p>1. Sign up at <a href="https://www.emailjs.com" target="_blank" className="text-white underline">EmailJS.com</a>.</p>
            <p>2. Create a new "Email Service" (e.g., Gmail) to get your <strong>Service ID</strong>.</p>
            <p>3. Create an "Email Template". Use variables like <code>{`{{name}}`}</code>, <code>{`{{message}}`}</code>. Get your <strong>Template ID</strong>.</p>
            <p>4. Go to Account &gt; API Keys to copy your <strong>Public Key</strong>.</p>
          </div>
        </details>
        <details className="group">
          <summary className="cursor-pointer font-bold text-white mb-2 list-none flex items-center gap-2 group-open:text-primary transition-colors">
            <BarChart size={14} /> Google Analytics 4
          </summary>
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2">
            <p>1. Go to <a href="https://analytics.google.com" target="_blank" className="text-white underline">Google Analytics</a>.</p>
            <p>2. Create a property. Go to Admin &gt; Data Streams &gt; Web.</p>
            <p>3. Copy the <strong>Measurement ID</strong> (starts with <code>G-</code>).</p>
          </div>
        </details>
        <details className="group">
           <summary className="cursor-pointer font-bold text-white mb-2 list-none flex items-center gap-2 group-open:text-primary transition-colors">
            <Target size={14} /> Meta / TikTok Pixels
          </summary>
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2">
            <p><strong>Meta (Facebook):</strong> Go to Events Manager &gt; Data Sources. Create a Web Pixel. Copy the numeric <strong>Dataset ID</strong>.</p>
            <p><strong>TikTok:</strong> Go to Ads Manager &gt; Assets &gt; Events. Create a Web Event. Copy the <strong>Pixel ID</strong>.</p>
          </div>
        </details>
     </div>
  </div>
);

type TabId = 'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide' | 'training';

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, isLocalMode, saveStatus, setSaveStatus,
    products, categories, subCategories, heroSlides, enquiries, admins, stats,
    updateData, deleteData, refreshAllData, connectionHealth, systemLogs, storageStats
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | 'integrations' | null>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  
  const [trafficEvents, setTrafficEvents] = useState<any[]>([]);
  const [minErrorTimestamp, setMinErrorTimestamp] = useState(0);

  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminData, setAdminData] = useState<Partial<AdminUser>>({});
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedTraining, setExpandedTraining] = useState<string | null>(null);
  const [selectedAdProduct, setSelectedAdProduct] = useState<Product | null>(null);
  const [replyEnquiry, setReplyEnquiry] = useState<Enquiry | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });
  const [tempFeature, setTempFeature] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  const myAdminProfile = useMemo(() => admins.find(a => a.id === user?.id || a.email === user?.email), [admins, user]);
  const isOwner = isLocalMode || (myAdminProfile?.role === 'owner') || (user?.email === 'admin@findara.com');
  const userId = user?.id;
  const displayProducts = useMemo(() => isOwner ? products : products.filter(p => !p.createdBy || p.createdBy === userId), [products, isOwner, userId]);
  const displayCategories = useMemo(() => isOwner ? categories : categories.filter(c => !c.createdBy || c.createdBy === userId), [categories, isOwner, userId]);
  const displayHeroSlides = useMemo(() => isOwner ? heroSlides : heroSlides.filter(s => !s.createdBy || s.createdBy === userId), [heroSlides, isOwner, userId]);
  const displayStats = useMemo(() => {
    if (isOwner) return stats;
    const myProductIds = displayProducts.map(p => p.id);
    return stats.filter(s => myProductIds.includes(s.productId));
  }, [stats, isOwner, displayProducts]);

  const hasPermission = (tabId: TabId) => {
    if (isOwner) return true;
    if (!myAdminProfile) return false;
    const perms = myAdminProfile.permissions || [];
    
    switch (tabId) {
      case 'enquiries': return perms.includes('sales.view');
      case 'analytics': return perms.includes('analytics.view');
      case 'catalog': return perms.includes('catalog.products.view');
      case 'hero': return perms.includes('content.hero');
      case 'categories': return perms.includes('catalog.categories.manage');
      case 'site_editor': return perms.some(p => p.startsWith('content.'));
      case 'team': return perms.includes('system.team.manage');
      case 'system': return perms.includes('system.settings.core');
      case 'training': return true;
      case 'guide': return true;
      default: return false;
    }
  };

  const ALL_TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'enquiries', label: 'Inbox', icon: Inbox },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
    { id: 'catalog', label: 'Items', icon: ShoppingBag },
    { id: 'hero', label: 'Visuals', icon: LayoutPanelTop },
    { id: 'categories', label: 'Depts', icon: Layout },
    { id: 'site_editor', label: 'Canvas', icon: Palette },
    { id: 'team', label: 'Maison', icon: Users },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'system', label: 'System', icon: Activity },
    { id: 'guide', label: 'Pilot', icon: Rocket }
  ];

  const visibleTabs = useMemo(() => ALL_TABS.filter(t => hasPermission(t.id)), [isOwner, myAdminProfile]);

  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.some(t => t.id === activeTab)) {
       setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  const simulateSystemError = () => {
    setTimeout(() => {
       throw new Error("Simulation: Database Handshake Timeout (504 Gateway)");
    }, 100);
  };

  useEffect(() => {
    const fetchTraffic = async () => {
       try {
         if (isSupabaseConfigured) {
            const { data } = await supabase.from('traffic_logs').select('*').limit(2000);
            if (data) setTrafficEvents(data);
         } else {
             const rawLogs = localStorage.getItem('site_traffic_logs');
             const logs = rawLogs ? JSON.parse(rawLogs) : [];
             if (Array.isArray(logs)) setTrafficEvents(logs);
         }
       } catch (e) {
         setTrafficEvents([]);
       }
    };
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);
    return () => clearInterval(interval);
  }, [isSupabaseConfigured]);

  const errorLogs = useMemo(() => {
    return trafficEvents
      .filter(e => 
        e.timestamp > minErrorTimestamp &&
        e.type === 'system' && 
        (typeof e.text === 'string' && (e.text.includes('[CRITICAL]') || e.text.includes('Error') || e.text.includes('Exception')))
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(e => ({
         id: e.id,
         timestamp: e.time,
         type: e.text.includes('Async') ? 'PROMISE_REJECTION' : 'RUNTIME_EXCEPTION',
         source: e.source,
         message: e.text.replace('[CRITICAL] ', ''),
         stack: null
      }))
      .slice(0, 50);
  }, [trafficEvents, minErrorTimestamp]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  const handleFactoryReset = async () => { if (window.confirm("⚠️ DANGER: Factory Reset? This will wipe LOCAL data.")) { localStorage.clear(); window.location.reload(); } };
  const handleBackup = () => { const data = { products, categories, subCategories, heroSlides, enquiries, admins, settings, stats }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup.json`; a.click(); };
  
  const handleSaveProduct = async () => { const newProduct = { ...productData, id: editingId || Date.now().toString(), createdAt: productData.createdAt || Date.now(), createdBy: productData.createdBy || user?.id }; const ok = await updateData('products', newProduct); if (ok) { setShowProductForm(false); setEditingId(null); } };
  const handleSaveCategory = async () => { const newCat = { ...catData, id: editingId || Date.now().toString(), createdBy: catData.createdBy || user?.id }; const ok = await updateData('categories', newCat); if (ok) { setShowCategoryForm(false); setEditingId(null); } };
  const handleSaveHero = async () => { const newSlide = { ...heroData, id: editingId || Date.now().toString(), createdBy: heroData.createdBy || user?.id }; const ok = await updateData('hero_slides', newSlide); if (ok) { setShowHeroForm(false); setEditingId(null); } };
  const handleSaveAdmin = async () => { if (!adminData.email) return; setCreatingAdmin(true); try { const newAdmin = { ...adminData, id: editingId || Date.now().toString(), createdAt: adminData.createdAt || Date.now() }; const ok = await updateData('admin_users', newAdmin); if (ok) { setShowAdminForm(false); setEditingId(null); } } catch (err: any) { alert(`Error saving member: ${err.message}`); } finally { setCreatingAdmin(false); } };

  const toggleEnquiryStatus = async (enquiry: Enquiry) => { const updated = { ...enquiry, status: enquiry.status === 'read' ? 'unread' : 'read' }; await updateData('enquiries', updated); };
  const handleAddSubCategory = async (categoryId: string) => { if (!tempSubCatName.trim()) return; const newSub: SubCategory = { id: Date.now().toString(), categoryId, name: tempSubCatName, createdBy: user?.id }; await updateData('subcategories', newSub); setTempSubCatName(''); };
  const handleDeleteSubCategory = async (id: string) => await deleteData('subcategories', id);

  const handleAddDiscountRule = () => { if (!tempDiscountRule.value || !tempDiscountRule.description) return; const newRule: DiscountRule = { id: Date.now().toString(), type: tempDiscountRule.type || 'percentage', value: Number(tempDiscountRule.value), description: tempDiscountRule.description }; setProductData({ ...productData, discountRules: [...(productData.discountRules || []), newRule] }); setTempDiscountRule({ type: 'percentage', value: 0, description: '' }); };
  const handleRemoveDiscountRule = (id: string) => { setProductData({ ...productData, discountRules: (productData.discountRules || []).filter(r => r.id !== id) }); };
  const handleAddFeature = () => { if (!tempFeature.trim()) return; setProductData(prev => ({ ...prev, features: [...(prev.features || []), tempFeature] })); setTempFeature(''); };
  const handleRemoveFeature = (index: number) => { setProductData(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) })); };
  const handleAddSpec = () => { if (!tempSpec.key.trim() || !tempSpec.value.trim()) return; setProductData(prev => ({ ...prev, specifications: { ...(prev.specifications || {}), [tempSpec.key]: tempSpec.value } })); setTempSpec({ key: '', value: '' }); };
  const handleRemoveSpec = (key: string) => { setProductData(prev => { const newSpecs = { ...(prev.specifications || {}) }; delete newSpecs[key]; return { ...prev, specifications: newSpecs }; }); };

  const handleOpenEditor = (section: any) => { setTempSettings({...settings}); setActiveEditorSection(section); setEditorDrawerOpen(true); };
  const updateTempSettings = (newSettings: Partial<SiteSettings>) => setTempSettings(prev => ({ ...prev, ...newSettings }));
  const exportEnquiries = () => { const csvContent = "data:text/csv;charset=utf-8," + "Name,Email,Subject,Message,Date\n" + enquiries.map(e => `${e.name},${e.email},${e.subject},"${e.message}",${new Date(e.createdAt).toLocaleDateString()}`).join("\n"); const encodedUri = encodeURI(csvContent); const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", "enquiries_export.csv"); document.body.appendChild(link); link.click(); };
  const filteredEnquiries = enquiries.filter(e => { const matchesSearch = e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || e.email.toLowerCase().includes(enquirySearch.toLowerCase()) || e.subject.toLowerCase().includes(enquirySearch.toLowerCase()); const matchesStatus = enquiryFilter === 'all' || e.status === enquiryFilter; return matchesSearch && matchesStatus; });

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Inbox</h2><p className="text-slate-400 text-sm">Manage incoming client communications.</p></div>
         <div className="flex gap-3 w-full md:w-auto">
            <button onClick={exportEnquiries} className="flex-1 md:flex-none justify-center px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><FileSpreadsheet size={16}/> Export CSV</button>
         </div>
      </div>
      <AdminTip title="Communication Hub">This is your central command for client interactions. All inquiries from your contact form are routed here. Use the reply button to open a pre-filled email template, or archive messages to keep your inbox clean.</AdminTip>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search sender, email, or subject..." value={enquirySearch} onChange={e => setEnquirySearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" /></div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar">{['all', 'unread', 'read'].map(filter => (<button key={filter} onClick={() => setEnquiryFilter(filter as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${enquiryFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}>{filter}</button>))}</div>
      </div>
      {filteredEnquiries.length === 0 ? <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] md:rounded-[3rem] border border-dashed border-slate-800 text-slate-500">No enquiries found.</div> : 
        filteredEnquiries.map(e => (
          <div key={e.id} className={`bg-slate-900 border transition-all rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 flex flex-col md:flex-row gap-6 text-left ${e.status === 'unread' ? 'border-primary/30 shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
            <div className="flex-grow space-y-2 min-w-0"><div className="flex items-center gap-3"><h4 className="text-white font-bold truncate">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase flex-shrink-0">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold truncate">{e.email}</p><div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic leading-relaxed break-words">"{e.message}"</div></div>
            <div className="flex gap-2 items-start w-full md:w-auto flex-shrink-0 min-w-0">
              <button onClick={() => setReplyEnquiry(e)} className="flex-1 md:flex-none p-4 bg-primary/20 text-primary rounded-2xl hover:bg-primary hover:text-slate-900 transition-colors" title="Reply"><Reply size={20}/></button>
              <button onClick={() => toggleEnquiryStatus(e)} className={`flex-1 md:flex-none p-4 rounded-2xl transition-colors ${e.status === 'read' ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500'}`} title={e.status === 'read' ? 'Mark Unread' : 'Mark Read'}><CheckCircle size={20}/></button>
              <button onClick={() => deleteData('enquiries', e.id)} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-500 rounded-2xl hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={20}/></button>
            </div>
          </div>
        ))
      }
    </div>
  );

  const renderAnalytics = () => {
    let visitorLogs: any[] = [];
    try {
      const rawLogs = localStorage.getItem('site_visitor_locations');
      visitorLogs = rawLogs ? JSON.parse(rawLogs) : [];
      if (!Array.isArray(visitorLogs)) visitorLogs = [];
    } catch (e) {
      visitorLogs = [];
    }
    
    const sortedProducts = [...displayProducts].map(p => {
      const pStats = displayStats.find(s => s.productId === p.id) || { views: 0, clicks: 0, totalViewTime: 0, shares: 0 };
      const reviewCount = p.reviews?.length || 0;
      return { ...p, ...pStats, reviewCount, ctr: pStats.views > 0 ? ((pStats.clicks / pStats.views) * 100).toFixed(1) : 0 };
    }).sort((a, b) => (b.views + b.clicks) - (a.views + a.clicks));

    const topProducts = sortedProducts.slice(0, 15);

    const categoryPerformance = categories.map(cat => {
      const catProducts = products.filter(p => p.categoryId === cat.id);
      const catProductIds = catProducts.map(p => p.id);
      const catMetrics = stats.filter(s => catProductIds.includes(s.productId));
      
      const views = catMetrics.reduce((a, b) => a + b.views, 0);
      const clicks = catMetrics.reduce((a, b) => a + b.clicks, 0);
      const shares = catMetrics.reduce((a, b) => a + (b.shares || 0), 0);
      
      return {
        ...cat,
        views,
        clicks,
        shares,
        ctr: views > 0 ? ((clicks / views) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => b.views - a.views);
    
    const totalViews = displayStats.reduce((acc, s) => acc + s.views, 0);
    const totalClicks = displayStats.reduce((acc, s) => acc + s.clicks, 0);
    const totalShares = displayStats.reduce((acc, s) => acc + (s.shares || 0), 0);
    const totalSessionTime = stats.reduce((acc, s) => acc + (s.totalViewTime || 0), 0);
    const avgSessionTime = totalViews > 0 ? (totalSessionTime / totalViews).toFixed(1) : 0;

    const totalUniqueVisitors = visitorLogs.length;

    const hourlyDistribution = new Array(24).fill(0);
    trafficEvents.forEach(evt => {
        if (evt.timestamp) {
            const hour = new Date(evt.timestamp).getHours();
            if (hour >= 0 && hour < 24) {
               hourlyDistribution[hour]++;
            }
        }
    });
    const maxHourly = Math.max(...hourlyDistribution, 1);
    const peakHour = hourlyDistribution.indexOf(Math.max(...hourlyDistribution));

    const sourceStats = trafficEvents.reduce((acc: any, log: any) => {
        const s = log.source || 'Direct';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});
    
    const totalSources = Object.values(sourceStats).reduce((a: any, b: any) => a + b, 0) as number;
    
    const sortedSources = Object.entries(sourceStats)
        .sort(([,a]: any, [,b]: any) => b - a)
        .map(([key, count]) => {
           const styles = getPlatformStyles(key);
           return {
              label: key,
              count: count as number,
              ...styles
           };
        });

    return (
      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
           <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tighter">Insights & Vitality</h2>
              <p className="text-slate-400 text-sm max-w-lg">Live data stream processing {totalUniqueVisitors} unique nodes. Peak engagement detected around {peakHour}:00 hours.</p>
           </div>
           
           <div className="flex gap-12 text-right">
              <div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Impressions</span>
                 <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{totalViews.toLocaleString()}</span>
              </div>
              <div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Total Conversions</span>
                 <span className="text-4xl md:text-5xl font-bold text-primary tracking-tighter">{totalClicks.toLocaleString()}</span>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={120} className="text-primary"/></div>
            <h3 className="text-white font-bold text-xl mb-12 flex items-center gap-3"><Clock size={24} className="text-primary"/> 24-Hour Traffic Distribution</h3>
            <div className="flex items-end gap-1 h-64 w-full border-b border-slate-800 pb-2">
               {hourlyDistribution.map((count, i) => (
                 <div key={i} className="flex-1 group/bar relative h-full flex flex-col justify-end">
                    <div 
                      className={`w-full ${i === peakHour ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : 'bg-slate-800 group-hover/bar:bg-slate-600'} transition-all duration-500 rounded-t-sm`} 
                      style={{ height: `${(count / maxHourly) * 100}%` }}
                    ></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 whitespace-nowrap">
                      {count} Hits @ {i}:00
                    </div>
                    <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold ${i % 3 === 0 ? 'text-slate-500' : 'text-transparent'}`}>
                       {i}
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Active Monitoring: Live Updates Every 5 Seconds</span>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded shadow-[0_0_8px_rgba(var(--primary-rgb),0.4)]"></div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Peak Traffic</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-800 rounded"></div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Average Load</span></div>
               </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
           {[
             { label: 'Click Through Rate', value: `${totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%`, icon: MousePointerClick, color: 'text-primary' },
             { label: 'Social Shares', value: totalShares, icon: Share2, color: 'text-blue-400' },
             { label: 'Avg Session Time', value: `${avgSessionTime}s`, icon: Timer, color: 'text-green-400' },
             { label: 'Verified Reviews', value: products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0), icon: Star, color: 'text-yellow-500' }
           ].map((m, i) => (
             <div key={i} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 hover:border-primary/50 transition-colors flex flex-col justify-between h-48 shadow-lg group">
                <div className="flex justify-between items-start">
                   <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center ${m.color} group-hover:scale-110 transition-transform`}><m.icon size={24}/></div>
                   <m.icon size={48} className={`${m.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                </div>
                <div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{m.label}</span><span className="text-3xl font-bold text-white">{m.value}</span></div>
             </div>
           ))}
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 md:p-10 shadow-xl">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-3">
              <TrendingUp size={24} className="text-primary"/> Top 15 Performing Products
            </h3>
            <button onClick={() => {
               const csv = "Rank,Product,Category,Views,Clicks,CTR,Shares\n" +
                 topProducts.map((p, i) => `${i+1},"${p.name}",${categories.find(c=>c.id===p.categoryId)?.name || 'N/A'},${p.views},${p.clicks},${p.ctr}%,${p.shares}`).join("\n");
               const blob = new Blob([csv], { type: 'text/csv' });
               const url = window.URL.createObjectURL(blob);
               const a = document.createElement('a'); a.href = url; a.download = 'top_products.csv'; a.click();
            }} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
               <Download size={14}/> Export Data
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
               <thead>
                 <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                   <th className="pb-4 pl-4">#</th>
                   <th className="pb-4">Product</th>
                   <th className="pb-4">Dept</th>
                   <th className="pb-4 text-right">Views</th>
                   <th className="pb-4 text-right">Clicks</th>
                   <th className="pb-4 text-right">CTR</th>
                   <th className="pb-4 text-right pr-4">Shares</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                 {topProducts.map((p, index) => (
                   <tr key={p.id} className="group hover:bg-slate-800/50 transition-colors">
                     <td className="py-4 pl-4 font-mono text-slate-600">{index + 1}</td>
                     <td className="py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                              {p.media?.[0]?.url && <img src={p.media[0].url} className="w-full h-full object-cover" />}
                           </div>
                           <span className="font-bold text-white truncate max-w-[150px] md:max-w-xs">{p.name}</span>
                        </div>
                     </td>
                     <td className="py-4 text-xs">
                        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                           {categories.find(c => c.id === p.categoryId)?.name || 'Uncategorized'}
                        </span>
                     </td>
                     <td className="py-4 text-right font-mono text-white">{p.views.toLocaleString()}</td>
                     <td className="py-4 text-right font-mono text-primary">{p.clicks.toLocaleString()}</td>
                     <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <span className="font-bold text-white">{p.ctr}%</span>
                           <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${Math.min(parseFloat(p.ctr as string), 100)}%` }}></div>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 text-right pr-4 font-mono text-blue-400">{p.shares?.toLocaleString() || 0}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
           <h3 className="text-white font-bold text-2xl flex items-center gap-3 px-2 border-b border-white/5 pb-4">
              <Layers size={24} className="text-primary"/> Department Performance
           </h3>
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
             {categoryPerformance.map((cat, i) => {
               const Icon = CustomIcons[cat.icon] || (LucideIcons as any)[cat.icon] || LayoutGrid;
               return (
                 <div key={i} className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/40 transition-all shadow-xl">
                   <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-primary shrink-0 shadow-inner group-hover:scale-110 transition-transform border border-slate-700">
                      <Icon size={40} />
                   </div>
                   <div className="flex-grow w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                         <h4 className="text-white font-bold text-2xl">{cat.name}</h4>
                         <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-mono font-bold text-xs border border-primary/20">{cat.ctr}% CTR</span>
                      </div>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                         <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Views</span>
                            <span className="text-white font-bold text-lg">{cat.views.toLocaleString()}</span>
                         </div>
                         <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Clicks</span>
                            <span className="text-white font-bold text-lg">{cat.clicks.toLocaleString()}</span>
                         </div>
                         <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Shares</span>
                            <span className="text-white font-bold text-lg">{cat.shares.toLocaleString()}</span>
                         </div>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${totalViews > 0 ? (cat.views / totalViews) * 100 : 0}%` }}></div>
                      </div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
        
        <div className="mt-8">
            <TrafficAreaChart trafficEvents={trafficEvents} />
        </div>

        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-800 shadow-xl mt-8">
             <h3 className="text-white font-bold mb-12 flex items-center gap-3 text-xl"><Globe size={24} className="text-primary"/> Traffic Sources (Live & Historical)</h3>
             <div className="space-y-8">
                 {sortedSources.map((s, i) => (
                    <div key={i} className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 border shadow-xl ${s.bg} ${s.border}`}><s.icon size={24} className="text-white"/></div>
                       <div className="flex-grow">
                          <div className="flex justify-between mb-3">
                             <span className="text-base text-white font-bold">{s.label}</span>
                             <span className="text-xs text-slate-400 font-mono">{s.count} hits ({totalSources > 0 ? Math.round((s.count / totalSources) * 100) : 0}%)</span>
                          </div>
                          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                             <div className={`h-full ${s.bg} transition-all duration-1000 ease-out`} style={{ width: `${totalSources > 0 ? (s.count / totalSources) * 100 : 0}%` }}></div>
                          </div>
                       </div>
                    </div>
                 ))}
                 {totalSources === 0 && <p className="text-slate-500 text-xs text-center py-4 italic">Awaiting source data...</p>}
              </div>
        </div>
      </div>
    );
  };

  const renderSystem = () => {
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const latencyColor = (l: number) => {
        if (l < 200) return 'bg-green-500';
        if (l < 500) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
     <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left w-full max-w-7xl mx-auto">
        <AdminTip title="Core Infrastructure Monitoring">
            Your bridge page is linked to a high-performance Supabase backend. All read/write operations are synchronized in real-time.
            The storage metrics below are estimates based on client-side data.
        </AdminTip>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 flex flex-col justify-between shadow-xl">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Wifi size={20} className="text-primary"/> Network Heartbeat</h3>
                        <p className="text-slate-500 text-xs mt-1">{connectionHealth?.message || 'Connecting...'}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${connectionHealth?.status === 'online' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {connectionHealth?.status || 'UNKNOWN'}
                    </div>
                 </div>
                 
                 <div className="relative pt-6">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                        <span>Latency</span>
                        <span className="text-white">{connectionHealth?.latency || 0} ms</span>
                    </div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                        <div 
                            className={`h-full transition-all duration-500 ${latencyColor(connectionHealth?.latency || 0)}`} 
                            style={{ width: `${Math.min((connectionHealth?.latency || 0) / 10, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-slate-600 font-mono">
                        <span>0ms</span>
                        <span>500ms</span>
                        <span>1s+</span>
                    </div>
                 </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 flex flex-col justify-between shadow-xl">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Server size={20} className="text-primary"/> Database Status</h3>
                        <p className="text-slate-500 text-xs mt-1">{isSupabaseConfigured ? 'Connected to Cloud' : 'Local Storage Mode'}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${isSupabaseConfigured ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                        {isSupabaseConfigured ? 'POSTGRES' : 'LOCAL'}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                        <span className="block text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Total Records</span>
                        <span className="text-xl font-bold text-white font-mono">{storageStats.totalRecords}</span>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                        <span className="block text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Endpoints</span>
                        <span className="text-xl font-bold text-white font-mono">8</span>
                    </div>
                 </div>
            </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 md:p-12 shadow-2xl">
            <h3 className="text-white font-bold text-xl mb-8 flex items-center gap-3"><HardDrive size={24} className="text-blue-500"/> Storage Anatomy</h3>
            
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                            <Database size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-200">Text Data (JSON)</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-primary">{formatBytes(storageStats.dbSize)}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-600 w-full animate-pulse opacity-50"></div> 
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Includes all product text, settings configurations, and user logs.</p>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                            <Image size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-200">Media Assets ({storageStats.mediaCount} files)</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-blue-400">{formatBytes(storageStats.mediaSize)}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
                         <div className="absolute inset-0 bg-blue-500/20"></div>
                         <div className="h-full bg-blue-500 w-1/3"></div> 
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Approximate total size of hosted images and videos.</p>
                </div>
            </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden text-left font-mono">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-xl flex items-center gap-3"><Terminal size={24} className="text-green-500"/> Sync Ledger</h3>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Live Feed</span></div>
           </div>
           
           <div className="w-full overflow-x-auto">
               <table className="w-full text-xs text-left whitespace-nowrap">
                   <thead>
                       <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-widest">
                           <th className="pb-4 pl-4">Timestamp</th>
                           <th className="pb-4">Operation</th>
                           <th className="pb-4">Target</th>
                           <th className="pb-4">Size</th>
                           <th className="pb-4 pr-4 text-right">Status</th>
                       </tr>
                   </thead>
                   <tbody className="text-slate-300">
                       {systemLogs.length > 0 ? systemLogs.map((log) => (
                           <tr key={log.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                               <td className="py-3 pl-4 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                               <td className="py-3">
                                   <span className={`px-2 py-1 rounded text-[10px] font-black ${
                                       log.type === 'SYNC' ? 'bg-blue-500/20 text-blue-400' : 
                                       log.type === 'UPDATE' ? 'bg-yellow-500/20 text-yellow-400' :
                                       log.type === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                       log.type === 'ERROR' ? 'bg-red-600 text-white' :
                                       'bg-slate-700 text-slate-300'
                                   }`}>
                                       {log.type}
                                   </span>
                               </td>
                               <td className="py-3 font-bold">{log.target}</td>
                               <td className="py-3 text-slate-500">{log.sizeBytes ? formatBytes(log.sizeBytes, 0) : '-'}</td>
                               <td className="py-3 pr-4 text-right">
                                   {log.status === 'success' ? <span className="text-green-500 font-bold">OK</span> : <span className="text-red-500 font-bold">FAIL</span>}
                               </td>
                           </tr>
                       )) : (
                           <tr>
                               <td colSpan={5} className="py-8 text-center text-slate-600 italic">No sync activity recorded in this session.</td>
                           </tr>
                       )}
                   </tbody>
               </table>
           </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden text-left">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-xl flex items-center gap-3">
                 <AlertTriangle size={24} className="text-red-500"/>
                 Global Exception Trace
              </h3>
              <div className="flex gap-2">
                 <button onClick={simulateSystemError} className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors">
                    Trigger Failure
                 </button>
                 <button onClick={() => setMinErrorTimestamp(Date.now())} className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors">
                    Clear View
                 </button>
              </div>
           </div>
           <div className="bg-black rounded-xl border border-slate-800 p-4 h-64 overflow-y-auto custom-scrollbar font-mono text-xs relative">
              <div className="absolute top-0 right-0 p-2 opacity-50 pointer-events-none">
                 <Activity size={120} className="text-slate-800"/>
              </div>
              {errorLogs.length > 0 ? (
                 errorLogs.map((err, i) => (
                    <div key={err.id} className="mb-4 border-b border-slate-900 pb-3 last:border-0 relative z-10 animate-in slide-in-from-left duration-300">
                       <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-slate-500">[{err.timestamp}]</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${err.type === 'RUNTIME_EXCEPTION' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                             {err.type}
                          </span>
                          <span className="text-slate-600">{err.source}</span>
                       </div>
                       <div className="text-slate-300 break-words pl-0 md:pl-4 font-bold">
                          {err.message}
                       </div>
                    </div>
                 ))
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                    <ShieldCheck size={32} className="mb-2 text-green-500/50"/>
                    <span className="text-green-500/50 font-bold uppercase tracking-widest">System Nominal</span>
                    <span className="text-[10px] mt-1">No active exceptions detected in the execution runtime.</span>
                 </div>
              )}
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-left">
           <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-left space-y-4">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Download size={18} className="text-primary"/> Catalog Export</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Save a complete snapshot of all products, settings, and analytical data to JSON.</p>
              <button onClick={handleBackup} className="px-6 py-4 bg-slate-800 text-white rounded-xl text-xs uppercase font-black hover:bg-slate-700 transition-colors w-full flex items-center justify-center gap-2 border border-slate-700">Download Data</button>
           </div>
           <div className="bg-red-950/10 p-8 rounded-[2rem] border border-red-500/20 text-left space-y-4">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Flame size={18} className="text-red-500"/> System Purge</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Immediately factory reset all local storage data. Supabase cloud data is preserved unless manually wiped.</p>
              <button onClick={handleFactoryReset} className="px-6 py-4 bg-red-600 text-white rounded-xl text-xs uppercase font-black hover:bg-red-500 transition-colors w-full flex items-center justify-center gap-2">Execute Purge</button>
           </div>
        </div>
     </div>
    );
  };

  const renderCatalog = () => (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
      {showProductForm ? (
        <div className="bg-slate-900 p-6 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6"><h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Masterpiece' : 'New Collection Item'}</h3><button onClick={() => setShowProductForm(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button></div>
          <AdminTip title="Inventory Deployment">Optimize your listing with detailed specifications and high-res media. The 'Highlights' section powers the shoppable bridge features.</AdminTip>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-6"><SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} /><SettingField label="SKU / Reference ID" value={productData.sku || ''} onChange={v => setProductData({...productData, sku: v})} /><SettingField label="Price (ZAR)" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" /><SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} /></div>
             <div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value, subCategoryId: ''})}><option value="">Select Department</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sub-Category</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none disabled:opacity-50" value={productData.subCategoryId} onChange={e => setProductData({...productData, subCategoryId: e.target.value})} disabled={!productData.categoryId}><option value="">Select Sub-Category</option>{subCategories.filter(s => s.categoryId === productData.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="textarea" /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
              <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Sparkles size={18} className="text-primary"/> Highlights</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex gap-2"><input type="text" placeholder="Add highlight (e.g. '100% Silk')" value={tempFeature} onChange={e => setTempFeature(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && handleAddFeature()} /><button onClick={handleAddFeature} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{(productData.features || []).map((feat, idx) => (<div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"><span className="text-sm text-slate-300 flex items-center gap-2"><Check size={14} className="text-primary"/> {feat}</span><button onClick={() => handleRemoveFeature(idx)} className="text-slate-500 hover:text-red-500"><X size={14}/></button></div>))}</div></div></div>
              <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Tag size={18} className="text-primary"/> Specifications</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex gap-2"><input type="text" placeholder="Key (e.g. Material)" value={tempSpec.key} onChange={e => setTempSpec({...tempSpec, key: e.target.value})} className="w-1/3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" /><input type="text" placeholder="Value (e.g. Silk)" value={tempSpec.value} onChange={e => setTempSpec({...tempSpec, value: e.target.value})} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && handleAddSpec()} /><button onClick={handleAddSpec} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{Object.entries(productData.specifications || {}).map(([key, value]) => (<div key={key} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"><div className="flex flex-col"><span className="text-[10px] font-black uppercase text-slate-500">{key}</span><span className="text-sm text-slate-300">{value}</span></div><button onClick={() => handleRemoveSpec(key)} className="text-slate-500 hover:text-red-500"><X size={14}/></button></div>))}</div></div></div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-left"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><Image size={18} className="text-primary"/> Media Gallery</h4><FileUploader files={productData.media || []} onFilesChange={f => setProductData({...productData, media: f})} /></div>
          <div className="pt-8 border-t border-slate-800 text-left"><h4 className="text-white font-bold mb-6 flex items-center gap-2"><Percent size={18} className="text-primary"/> Discount Rules</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex flex-col md:flex-row gap-4 md:items-end"><div className="flex-1"><SettingField label="Description" value={tempDiscountRule.description || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, description: v})} /></div><div className="w-full md:w-32"><SettingField label="Value" value={tempDiscountRule.value?.toString() || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, value: Number(v)})} type="number" /></div><div className="w-full md:w-32 space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-4 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none text-sm" value={tempDiscountRule.type} onChange={e => setTempDiscountRule({...tempDiscountRule, type: e.target.value as any})}><option value="percentage">Percent (%)</option><option value="fixed">Fixed (R)</option></select></div><button onClick={handleAddDiscountRule} className="p-4 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{(productData.discountRules || []).map(rule => (<div key={rule.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800"><span className="text-sm text-slate-300 font-medium">{rule.description}</span><div className="flex items-center gap-4"><span className="text-xs font-bold text-primary">{rule.type === 'percentage' ? `-${rule.value}%` : `-R${rule.value}`}</span><button onClick={() => handleRemoveDiscountRule(rule.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button></div></div>))}</div></div></div>
          <div className="flex flex-col md:flex-row gap-4 pt-8"><button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Save Product</button><button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 text-left"><div className="space-y-2"><h2 className="text-3xl font-serif text-white">Catalog</h2><p className="text-slate-400 text-sm">Curate your collection of affiliate products.</p></div><button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3 w-full md:w-auto justify-center"><Plus size={18} /> Add Product</button></div>
          <AdminTip title="Inventory Management">Filter by department or keyword. Use the megaphone icon to generate shareable social assets instantly.</AdminTip>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
             <div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search by name..." value={productSearch} onChange={e => setProductSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" /></div>
             <div className="relative min-w-[200px]"><Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><select value={productCatFilter} onChange={e => setProductCatFilter(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer"><option value="all">All Departments</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} /></div>
          </div>
          <div className="grid gap-4">
            {displayProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) && (productCatFilter === 'all' || p.categoryId === productCatFilter)).map(p => (
              <div key={p.id} className="bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-primary/30 transition-colors group gap-4">
                <div className="flex items-center gap-6 min-w-0 text-left"><div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative flex-shrink-0"><img src={p.media?.[0]?.url} className="w-full h-full object-cover" /></div><div className="min-w-0"><h4 className="text-white font-bold line-clamp-1 break-words">{p.name}</h4><div className="flex items-center gap-2 mt-1"><span className="text-primary text-xs font-bold">R {p.price}</span><span className="text-slate-600 text-[10px] uppercase font-black tracking-widest hidden md:inline">• {categories.find(c => c.id === p.categoryId)?.name}</span></div></div></div>
                <div className="flex gap-2 w-full md:w-auto flex-shrink-0"><button onClick={() => setSelectedAdProduct(p)} className="flex-1 md:flex-none p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-slate-900 transition-colors" title="Social Share"><Megaphone size={18}/></button><button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button><button onClick={() => deleteData('products', p.id)} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button></div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderHero = () => (
     <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        <AdminTip title="Hero Master Visuals">Set the tone for your bridge page with cinematic hero visuals. Videos increase dwell time by up to 40%.</AdminTip>
        {showHeroForm ? ( 
           <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-800 space-y-6">
              <div className="grid md:grid-cols-2 gap-6"><SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={heroData.type} onChange={e => setHeroData({...heroData, type: e.target.value as any})}><option value="image">Image</option><option value="video">Video</option></select></div></div>
              <SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" />
              <SettingField label="Button Label" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} />
              <SingleImageUploader label="Media Asset" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} accept={heroData.type === 'video' ? "video/*" : "image/*"} />
              <div className="flex gap-4"><button onClick={handleSaveHero} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Slide</button><button onClick={() => setShowHeroForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
           </div> 
        ) : ( 
           <div className="grid md:grid-cols-2 gap-6">
              <button onClick={() => { setHeroData({ title: '', subtitle: '', cta: 'Explore', image: '', type: 'image' }); setShowHeroForm(true); setEditingId(null); }} className="w-full p-8 border-2 border-dashed border-slate-800 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-primary min-h-[250px]"><Plus size={48} /><span className="font-black uppercase tracking-widest text-xs">New Hero Slide</span></button>
              {displayHeroSlides.map(s => (
                 <div key={s.id} className="relative aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden group border border-slate-800">
                    {s.type === 'video' ? <video src={s.image} className="w-full h-full object-cover" muted /> : <img src={s.image} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/60 p-6 md:p-10 flex flex-col justify-end text-left"><h4 className="text-white text-xl font-serif">{s.title}</h4><div className="flex gap-2 mt-4"><button onClick={() => { setHeroData(s); setEditingId(s.id); setShowHeroForm(true); }} className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20"><Edit2 size={16}/></button><button onClick={() => deleteData('hero_slides', s.id)} className="p-3 bg-white/10 text-white rounded-xl hover:bg-red-500"><Trash2 size={16}/></button></div></div>
                 </div>
              ))}
           </div> 
        )}
     </div>
  );

  const renderCategories = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left w-full max-w-7xl mx-auto">
       {showCategoryForm ? (
          <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-800 space-y-8">
             <AdminTip title="Department Structuring">Define your niches. Departments categorize your curations into logical shopping flows for the end user.</AdminTip>
             <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="space-y-6"><h3 className="text-white font-bold text-xl mb-4">Department Details</h3><SettingField label="Department Name" value={catData.name || ''} onChange={v => setCatData({...catData, name: v})} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Icon</label><IconPicker selected={catData.icon || 'Package'} onSelect={icon => setCatData({...catData, icon})} /></div><SettingField label="Description" value={catData.description || ''} onChange={v => setCatData({...catData, description: v})} type="textarea" /></div>
                <div className="space-y-6"><SingleImageUploader label="Cover Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} className="h-48 w-full object-cover rounded-2xl" /><div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800"><h4 className="text-white font-bold text-sm mb-4">Subcategories</h4><div className="flex gap-2 mb-4"><input type="text" placeholder="New Subcategory Name" value={tempSubCatName} onChange={e => setTempSubCatName(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" /><button onClick={() => editingId && handleAddSubCategory(editingId)} className="px-4 bg-slate-700 text-white rounded-xl hover:bg-primary hover:text-slate-900 transition-colors"><Plus size={18}/></button></div><div className="flex flex-wrap gap-2">{editingId && subCategories.filter(s => s.categoryId === editingId).map(s => (<div key={s.id} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800"><span className="text-xs text-slate-300">{s.name}</span><button onClick={() => handleDeleteSubCategory(s.id)} className="text-slate-500 hover:text-red-500"><X size={12}/></button></div>))}</div></div></div>
             </div>
             <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-800"><button onClick={handleSaveCategory} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Dept</button><button onClick={() => setShowCategoryForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
          </div>
       ) : (
          <>
            <AdminTip title="Collections Navigation">Each department acts as a portal. Use high-fashion imagery to attract attention to specific collections.</AdminTip>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               <button onClick={() => { setCatData({ name: '', icon: 'Package', description: '', image: '' }); setShowCategoryForm(true); setEditingId(null); }} className="w-full h-40 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-primary"><Plus size={32} /><span className="font-black text-[10px] uppercase tracking-widest">New Dept</span></button>
               {displayCategories.map(c => (
                  <div key={c.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col relative group">
                     <div className="h-32 overflow-hidden relative"><img src={c.image} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center px-8 gap-4"><div className="w-12 h-12 bg-slate-800 text-primary rounded-xl flex items-center justify-center shadow-xl flex-shrink-0">{React.createElement((LucideIcons as any)[c.icon] || LucideIcons.Package, { size: 20 })}</div><h4 className="font-bold text-white text-lg truncate">{c.name}</h4></div></div>
                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setCatData(c); setEditingId(c.id); setShowCategoryForm(true); }} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md"><Edit2 size={14}/></button><button onClick={() => deleteData('categories', c.id)} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md hover:bg-red-500"><Trash2 size={14}/></button></div>
                  </div>
               ))}
            </div>
          </>
       )}
    </div>
  );

  const renderTeam = () => (
     <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 text-left"><div className="text-left"><h2 className="text-3xl font-serif text-white">Maison Staffing</h2><p className="text-slate-400 text-sm mt-2">Roles and permissions for collaborative curation.</p></div><button onClick={() => { setAdminData({ role: 'admin', permissions: [] }); setShowAdminForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest w-full md:w-auto"><Plus size={16}/> New Member</button></div>
        {showAdminForm ? (
           <div className="bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-800 space-y-12 text-left">
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-start gap-4">
                 <div className="p-2 bg-blue-500/20 rounded-full text-blue-400"><Info size={20}/></div>
                 <div><h4 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-1">Identity Sync</h4><p className="text-slate-400 text-xs leading-relaxed">Ensure the email matches the Supabase Auth identity exactly.</p></div>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                 <div className="space-y-6">
                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Profile</h3>
                    <SettingField label="Full Name" value={adminData.name || ''} onChange={v => setAdminData({...adminData, name: v})} />
                    <SettingField label="Contact Number" value={adminData.phone || ''} onChange={v => setAdminData({...adminData, phone: v})} />
                    <SettingField label="Primary Address" value={adminData.address || ''} onChange={v => setAdminData({...adminData, address: v})} type="textarea" />
                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4 pt-6">Credentials</h3>
                    <SettingField label="Email Identity" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} />
                    <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-2xl"><div className="flex items-start gap-3"><div className="p-2 bg-primary/10 rounded-lg text-primary mt-1"><Key size={16} /></div><div className="space-y-3"><h4 className="text-primary font-bold text-xs uppercase tracking-widest">Authentication</h4><p className="text-slate-400 text-xs leading-relaxed">Manage passkeys via the Supabase cloud dashboard.</p><a href="https://supabase.com/dashboard/project/_/auth/users" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-slate-700"><ExternalLink size={14} /> Open Cloud Auth</a></div></div></div>
                 </div>
                 <div className="space-y-6 text-left"><h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Privileges</h3><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Role</label><select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={adminData.role} onChange={e => setAdminData({...adminData, role: e.target.value as any, permissions: e.target.value === 'owner' ? ['*'] : []})}><option value="admin">Administrator</option><option value="owner">System Owner</option></select></div><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-6 block">Access Rights</label><PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} /></div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t border-slate-800"><button onClick={() => setShowAdminForm(false)} className="px-8 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cancel</button><button onClick={handleSaveAdmin} disabled={creatingAdmin} className="px-12 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2">{creatingAdmin ? <Loader2 size={16} className="animate-spin"/> : <ShieldCheck size={18}/>}{editingId ? 'Save' : 'Invite'}</button></div>
           </div>
        ) : (
           <>
             <AdminTip title="Role Management">Manage your staff here. Only Owners can delete other members or factory reset the system.</AdminTip>
             <div className="grid gap-6">
               {admins.map(a => {
                 const isCurrentUser = user && (a.id === user.id || a.email === user.email);
                 return (
                 <div key={a.id} className={`bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/40 transition-all group ${isCurrentUser ? 'border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
                   <div className="flex flex-col md:flex-row items-center gap-8 w-full min-w-0">
                      <div className="relative flex-shrink-0"><div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-3xl font-bold uppercase border border-slate-700 shadow-inner group-hover:text-primary transition-colors">{a.profileImage ? <img src={a.profileImage} className="w-full h-full object-cover rounded-3xl"/> : a.name?.charAt(0)}</div>{isCurrentUser && <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">You</div>}</div>
                      <div className="space-y-2 flex-grow text-center md:text-left min-w-0">
                        <div className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start"><h4 className="text-white text-xl font-bold break-words">{a.name}</h4><span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${a.role === 'owner' ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-400'}`}>{a.role}</span></div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 text-slate-500 text-sm break-words"><span className="flex items-center gap-2"><Mail size={14} className="text-primary"/> {a.email}</span>{a.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-primary"/> {a.phone}</span>}</div>
                        <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2"><span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Access:</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.role === 'owner' ? 'Full System' : `${a.permissions.length} modules`}</span></div>
                      </div>
                   </div>
                   <div className="flex gap-3 w-full md:w-auto flex-shrink-0"><button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-700 hover:text-white transition-all"><Edit2 size={20}/></button><button onClick={() => deleteData('admin_users', a.id)} className="flex-1 md:flex-none p-4 bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all" disabled={isCurrentUser}><Trash2 size={20}/></button></div>
                 </div>
                 );
               })}
             </div>
           </>
        )}
     </div>
  );

  const renderTraining = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Academy</h2><p className="text-slate-400 text-sm">Curation marketing mastery across {TRAINING_MODULES.length} channels.</p></div>
         <a href="https://www.youtube.com/results?search_query=fashion+affiliate+marketing+strategy" target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-colors flex items-center gap-2"><Video size={16}/> Mastering the Algorithm</a>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TRAINING_MODULES.map((module) => {
          const isExpanded = expandedTraining === module.id;
          const Icon = CustomIcons[module.icon] || (LucideIcons as any)[module.icon] || GraduationCap;
          return (
            <div key={module.id} className={`bg-slate-900 border transition-all duration-300 overflow-hidden flex flex-col ${isExpanded ? 'lg:col-span-3 md:col-span-2 border-primary/50 shadow-2xl shadow-primary/10 rounded-[2.5rem]' : 'border-slate-800 hover:border-slate-600 rounded-[2rem]'}`}>
              <button onClick={() => setExpandedTraining(isExpanded ? null : module.id)} className="w-full p-6 md:p-8 flex items-start text-left group h-full">
                 <div className="flex items-start gap-4 md:gap-6 w-full">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shrink-0 transition-transform group-hover:scale-105 ${module.platform === 'Pinterest' ? 'bg-red-600' : module.platform === 'TikTok' ? 'bg-black border border-slate-700' : module.platform === 'Instagram' ? 'bg-pink-600' : module.platform === 'WhatsApp' ? 'bg-green-500' : module.platform === 'SEO' ? 'bg-blue-600' : 'bg-slate-800 text-slate-300'}`}><Icon size={28} /></div>
                    <div className="flex-grow min-w-0"><div className="flex justify-between items-start"><h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">{module.title}</h3>{!isExpanded && <ChevronDown size={20} className="text-slate-500 mt-1" />}</div><p className="text-slate-500 text-xs md:text-sm line-clamp-2">{module.description}</p>{!isExpanded && (<div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Training <ArrowRight size={12}/></div>)}</div>
                 </div>
              </button>
              {isExpanded && (
                <div className="px-6 md:px-10 pb-10 pt-0 animate-in fade-in">
                  <div className="w-full h-px bg-slate-800 mb-8"></div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-lg text-primary"><Target size={18}/></div><h4 className="text-sm font-bold text-white uppercase tracking-widest">Growth Blueprint</h4></div>
                      <ul className="space-y-4">{module.strategies.map((strat, idx) => (<li key={idx} className="flex items-start gap-3 text-slate-300 text-sm p-4 bg-slate-800/40 rounded-2xl border border-slate-800"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div><span className="leading-relaxed">{strat}</span></li>))}</ul>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3"><div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Rocket size={18}/></div><h4 className="text-sm font-bold text-white uppercase tracking-widest">Immediate Deployment</h4></div>
                      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">{module.actionItems.map((item, idx) => (<div key={idx} className="flex items-start gap-3 p-4 border-b border-slate-800 last:border-0 hover:bg-white/5 transition-colors group/item cursor-pointer"><div className="w-5 h-5 rounded-full border-2 border-slate-600 group-hover/item:border-green-500 group-hover/item:bg-green-500/20 transition-colors mt-0.5 shrink-0"></div><span className="text-slate-400 text-sm group-hover/item:text-slate-200 transition-colors">{item}</span></div>))}</div>
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end"><button onClick={() => setExpandedTraining(null)} className="px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-colors">Complete Session</button></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderGuide = () => (
     <div className="space-y-12 md:space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 max-w-7xl mx-auto text-left w-full overflow-hidden">
        <div className="bg-gradient-to-br from-primary/30 to-slate-950 p-8 md:p-24 rounded-[2rem] md:rounded-[4rem] border border-primary/20 relative overflow-hidden shadow-2xl">
            <Rocket className="absolute -bottom-20 -right-20 text-primary/10 w-48 h-48 md:w-96 md:h-96 rotate-12" />
            <div className="max-w-3xl relative z-10 text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8 border border-primary/30"><Zap size={14}/> Launch Protocol</div>
                <h2 className="text-3xl sm:text-4xl md:text-7xl font-serif text-white mb-4 md:mb-6 leading-none break-words">Architecture <span className="text-primary italic font-light lowercase">Blueprint</span></h2>
                <p className="text-slate-400 text-sm md:text-xl font-light leading-relaxed max-w-full">Complete the following milestones to transition from local prototype to a fully-synced global luxury bridge page.</p>
            </div>
        </div>
        <div className="grid gap-16 md:gap-32 text-left">
            {GUIDE_STEPS.map((step, idx) => (
                <div key={step.id} className="relative flex flex-col md:grid md:grid-cols-12 gap-8 md:gap-20">
                    <div className="md:col-span-1 flex flex-row md:flex-col items-center gap-4 md:gap-0">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1rem] md:rounded-[2rem] bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-primary font-black text-xl md:text-2xl shadow-2xl sticky md:top-32 static shrink-0">{idx + 1}</div>
                        <div className="md:hidden text-lg font-bold text-white">Step {idx + 1}</div>
                        <div className="hidden md:block flex-grow w-0.5 bg-gradient-to-b from-slate-800 to-transparent my-4" />
                    </div>
                    <div className="md:col-span-7 space-y-6 md:space-y-10 min-w-0 text-left">
                        <div className="space-y-4 text-left">
                            <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight break-words">{step.title}</h3>
                            <p className="text-slate-400 text-sm md:text-lg leading-relaxed">{step.description}</p>
                        </div>
                        {step.subSteps && (
                            <div className="grid gap-4 text-left">
                                {step.subSteps.map((sub, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 md:p-6 bg-slate-900/50 rounded-3xl border border-slate-800/50 hover:border-primary/30 transition-all group">
                                        <CheckCircle size={20} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                        <span className="text-slate-300 text-sm md:text-base leading-relaxed break-words w-full">{sub}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {step.code && (<CodeBlock code={step.code} label={step.codeLabel} />)}
                    </div>
                    <div className="md:col-span-4 md:sticky md:top-32 h-fit min-w-0 mt-8 md:mt-0"><GuideIllustration id={step.illustrationId} /></div>
                </div>
            ))}
        </div>
     </div>
  );

  const renderSiteEditor = () => (
     <div className="space-y-6 w-full max-w-7xl mx-auto text-left">
       <AdminTip title="Canvas Editor">Control your site's visual identity. Publishing changes here will synchronize with Supabase and update for all visitors.</AdminTip>
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
          {[ {id: 'brand', label: 'Identity', icon: Globe, desc: 'Logo, Colors, Slogan'}, {id: 'nav', label: 'Navigation', icon: MapPin, desc: 'Menu Labels, Footer'}, {id: 'home', label: 'Home Page', icon: Layout, desc: 'Hero, About, Trust Strip'}, {id: 'collections', label: 'Collections', icon: ShoppingBag, desc: 'Shop Hero, Search Text'}, {id: 'about', label: 'About Page', icon: User, desc: 'Story, Values, Gallery'}, {id: 'contact', label: 'Contact Page', icon: Mail, desc: 'Info, Form, Socials'}, {id: 'legal', label: 'Legal Text', icon: Shield, desc: 'Privacy, Terms, Disclosure'}, {id: 'integrations', label: 'Integrations', icon: LinkIcon, desc: 'EmailJS, Tracking, Webhooks'} ].map(s => ( 
            <button key={s.id} onClick={() => handleOpenEditor(s.id)} className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-left border border-slate-800 hover:border-primary/50 hover:bg-slate-800 transition-all group h-full flex flex-col justify-between">
               <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-primary group-hover:text-slate-900 transition-colors shadow-lg"><s.icon size={24}/></div><div><h3 className="text-white font-bold text-xl mb-1">{s.label}</h3><p className="text-slate-500 text-xs">{s.desc}</p></div><div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest edit-hover transition-opacity">Edit Section <ArrowRight size={12}/></div>
            </button> 
          ))}
       </div>
       <style>{`.edit-hover { opacity: 0; } .group:hover .edit-hover { opacity: 1; }`}</style>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-32 w-full overflow-x-hidden">
      <style>{` @keyframes grow { from { height: 0; } to { height: 100%; } } @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } } `}</style>
      <SaveIndicator status={saveStatus} />
      {selectedAdProduct && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} />}
      {replyEnquiry && <EmailReplyModal enquiry={replyEnquiry} onClose={() => setReplyEnquiry(null)} />}

      <header className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 text-left w-full">
        <div className="flex flex-col gap-6 text-left"><div className="flex items-center gap-4"><h1 className="text-3xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{isLocalMode ? 'LOCAL MODE' : (isOwner ? 'SYSTEM OWNER' : 'ADMINISTRATOR')}</div></div></div>
        <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-full xl:w-auto">
            {visibleTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-grow md:flex-grow-0 px-3 md:px-4 py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex flex-col md:flex-row items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}><tab.icon size={14} className="md:w-3 md:h-3" />{tab.label}</button>
            ))}
          </div>
          <button onClick={handleLogout} className="flex px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-red-500 hover:text-white transition-all w-full md:w-fit justify-center self-start"><LogOut size={14} /> Exit</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20 w-full overflow-x-hidden text-left">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'catalog' && renderCatalog()}
        {activeTab === 'hero' && renderHero()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'site_editor' && renderSiteEditor()}
        {activeTab === 'team' && renderTeam()}
        {activeTab === 'training' && renderTraining()}
        {activeTab === 'system' && renderSystem()}
        {activeTab === 'guide' && renderGuide()}
      </main>

      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-6 md:p-12 text-left shadow-2xl slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="text-3xl font-serif text-white mb-2">
                    {activeEditorSection === 'brand' && 'Brand Identity'}
                    {activeEditorSection === 'nav' && 'Navigation & Footer'}
                    {activeEditorSection === 'home' && 'Home Page'}
                    {activeEditorSection === 'collections' && 'Collections Page'}
                    {activeEditorSection === 'about' && 'About Page'}
                    {activeEditorSection === 'contact' && 'Contact Page'}
                    {activeEditorSection === 'legal' && 'Legal & Policy'}
                    {activeEditorSection === 'integrations' && 'Integrations'}
                  </h3>
                  <p className="text-slate-500 text-sm">Real-time configuration.</p>
                </div>
                <button onClick={() => setEditorDrawerOpen(false)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800"><X size={24} /></button>
             </div>
             <div className="space-y-8 text-left">
               {activeEditorSection === 'brand' && (
                 <>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Core Branding</h4><SettingField label="Company Name" value={tempSettings.companyName} onChange={v => updateTempSettings({ companyName: v })} /><SettingField label="Slogan / Tagline" value={tempSettings.slogan} onChange={v => updateTempSettings({ slogan: v })} /></div>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Visual Assets</h4><div className="grid grid-cols-2 gap-6"><SettingField label="Logo Text (Fallback)" value={tempSettings.companyLogo} onChange={v => updateTempSettings({ companyLogo: v })} /><SingleImageUploader label="Logo Image (PNG)" value={tempSettings.companyLogoUrl || ''} onChange={v => updateTempSettings({ companyLogoUrl: v })} /></div></div>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Palette (Hex Codes)</h4><div className="grid grid-cols-3 gap-4"><SettingField label="Primary (Gold)" value={tempSettings.primaryColor} onChange={v => updateTempSettings({ primaryColor: v })} type="color" /><SettingField label="Secondary (Dark)" value={tempSettings.secondaryColor} onChange={v => updateTempSettings({ secondaryColor: v })} type="color" /><SettingField label="Accent" value={tempSettings.accentColor} onChange={v => updateTempSettings({ accentColor: v })} type="color" /></div></div>
                 </>
               )}
               {activeEditorSection === 'nav' && (
                  <><SettingField label="Home Label" value={tempSettings.navHomeLabel} onChange={v => updateTempSettings({ navHomeLabel: v })} /><SettingField label="Collections Label" value={tempSettings.navProductsLabel} onChange={v => updateTempSettings({ navProductsLabel: v })} /><SettingField label="About Label" value={tempSettings.navAboutLabel} onChange={v => updateTempSettings({ navAboutLabel: v })} /><SettingField label="Contact Label" value={tempSettings.navContactLabel} onChange={v => updateTempSettings({ navContactLabel: v })} /><div className="pt-6 border-t border-slate-800"><SettingField label="Footer Description" value={tempSettings.footerDescription} onChange={v => updateTempSettings({ footerDescription: v })} type="textarea" /><div className="mt-4"><SettingField label="Copyright Text" value={tempSettings.footerCopyrightText} onChange={v => updateTempSettings({ footerCopyrightText: v })} /></div></div></>
               )}
               {activeEditorSection === 'home' && (
                  <><SettingField label="Hero Badge Text" value={tempSettings.homeHeroBadge} onChange={v => updateTempSettings({ homeHeroBadge: v })} /><div className="pt-6 border-t border-slate-800 space-y-6"><h4 className="text-white font-bold">About Section</h4><SettingField label="Title" value={tempSettings.homeAboutTitle} onChange={v => updateTempSettings({ homeAboutTitle: v })} /><SettingField label="Description" value={tempSettings.homeAboutDescription} onChange={v => updateTempSettings({ homeAboutDescription: v })} type="textarea" /><SingleImageUploader label="Section Image" value={tempSettings.homeAboutImage} onChange={v => updateTempSettings({ homeAboutImage: v })} /><SettingField label="Button Text" value={tempSettings.homeAboutCta} onChange={v => updateTempSettings({ homeAboutCta: v })} /></div><div className="pt-6 border-t border-slate-800 space-y-6"><h4 className="text-white font-bold">Trust Signals</h4><div className="grid grid-cols-1 gap-4"><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 1 Title" value={tempSettings.homeTrustItem1Title} onChange={v => updateTempSettings({ homeTrustItem1Title: v })} /><SettingField label="Item 1 Desc" value={tempSettings.homeTrustItem1Desc} onChange={v => updateTempSettings({ homeTrustItem1Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem1Icon} onSelect={v => updateTempSettings({ homeTrustItem1Icon: v })} /></div><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 2 Title" value={tempSettings.homeTrustItem2Title} onChange={v => updateTempSettings({ homeTrustItem2Title: v })} /><SettingField label="Item 2 Desc" value={tempSettings.homeTrustItem2Desc} onChange={v => updateTempSettings({ homeTrustItem2Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem2Icon} onSelect={v => updateTempSettings({ homeTrustItem2Icon: v })} /></div><div className="p-4 bg-slate-900 rounded-xl border border-slate-800"><SettingField label="Item 3 Title" value={tempSettings.homeTrustItem3Title} onChange={v => updateTempSettings({ homeTrustItem3Title: v })} /><SettingField label="Item 3 Desc" value={tempSettings.homeTrustItem3Desc} onChange={v => updateTempSettings({ homeTrustItem3Desc: v })} /><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label><IconPicker selected={tempSettings.homeTrustItem3Icon} onSelect={v => updateTempSettings({ homeTrustItem3Icon: v })} /></div></div></div></>
               )}
               {activeEditorSection === 'collections' && (
                  <><SettingField label="Hero Title" value={tempSettings.productsHeroTitle} onChange={v => updateTempSettings({ productsHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.productsHeroSubtitle} onChange={v => updateTempSettings({ productsHeroSubtitle: v })} type="textarea" /><MultiImageUploader label="Hero Carousel Images" images={tempSettings.productsHeroImages || [tempSettings.productsHeroImage]} onChange={v => updateTempSettings({ productsHeroImages: v, productsHeroImage: v[0] || '' })} /><SettingField label="Search Placeholder" value={tempSettings.productsSearchPlaceholder} onChange={v => updateTempSettings({ productsSearchPlaceholder: v })} /></>
               )}
               {activeEditorSection === 'about' && (
                  <><SettingField label="Hero Title" value={tempSettings.aboutHeroTitle} onChange={v => updateTempSettings({ aboutHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.aboutHeroSubtitle} onChange={v => updateTempSettings({ aboutHeroSubtitle: v })} type="textarea" /><SingleImageUploader label="Main Hero Image" value={tempSettings.aboutMainImage} onChange={v => updateTempSettings({ aboutMainImage: v })} /><div className="grid grid-cols-3 gap-4"><SettingField label="Est. Year" value={tempSettings.aboutEstablishedYear} onChange={v => updateTempSettings({ aboutEstablishedYear: v })} /><SettingField label="Founder" value={tempSettings.aboutFounderName} onChange={v => updateTempSettings({ aboutFounderName: v })} /><SettingField label="Location" value={tempSettings.aboutLocation} onChange={v => updateTempSettings({ aboutLocation: v })} /></div><SettingField label="History Title" value={tempSettings.aboutHistoryTitle} onChange={v => updateTempSettings({ aboutHistoryTitle: v })} /><SettingField label="History Body" value={tempSettings.aboutHistoryBody} onChange={v => updateTempSettings({ aboutHistoryBody: v })} type="textarea" rows={8} /><SingleImageUploader label="Founder Signature (Transparent PNG)" value={tempSettings.aboutSignatureImage} onChange={v => updateTempSettings({ aboutSignatureImage: v })} className="h-24 w-full object-contain" /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Values & Gallery</h4><SettingField label="Mission Title" value={tempSettings.aboutMissionTitle} onChange={v => updateTempSettings({ aboutMissionTitle: v })} /><SettingField label="Mission Body" value={tempSettings.aboutMissionBody} onChange={v => updateTempSettings({ aboutMissionBody: v })} type="textarea" /><SettingField label="Community Title" value={tempSettings.aboutCommunityTitle} onChange={v => updateTempSettings({ aboutCommunityTitle: v })} /><SettingField label="Community Body" value={tempSettings.aboutCommunityBody} onChange={v => updateTempSettings({ aboutCommunityBody: v })} type="textarea" /><SettingField label="Integrity Title" value={tempSettings.aboutIntegrityTitle} onChange={v => updateTempSettings({ aboutIntegrityTitle: v })} /><SettingField label="Integrity Body" value={tempSettings.aboutIntegrityBody} onChange={v => updateTempSettings({ aboutIntegrityBody: v })} type="textarea" /><MultiImageUploader label="Gallery Images" images={tempSettings.aboutGalleryImages} onChange={v => updateTempSettings({ aboutGalleryImages: v })} /></>
               )}
               {activeEditorSection === 'contact' && (
                  <><SettingField label="Hero Title" value={tempSettings.contactHeroTitle} onChange={v => updateTempSettings({ contactHeroTitle: v })} /><SettingField label="Hero Subtitle" value={tempSettings.contactHeroSubtitle} onChange={v => updateTempSettings({ contactHeroSubtitle: v })} type="textarea" /><div className="grid grid-cols-2 gap-4"><SettingField label="Email" value={tempSettings.contactEmail} onChange={v => updateTempSettings({ contactEmail: v })} /><SettingField label="Phone" value={tempSettings.contactPhone} onChange={v => updateTempSettings({ contactPhone: v })} /></div><SettingField label="WhatsApp (No Spaces)" value={tempSettings.whatsappNumber} onChange={v => updateTempSettings({ whatsappNumber: v })} /><SettingField label="Physical Address" value={tempSettings.address} onChange={v => updateTempSettings({ address: v })} type="textarea" /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Form Labels</h4><SettingField label="Button Text" value={tempSettings.contactFormButtonText} onChange={v => updateTempSettings({ contactFormButtonText: v })} /><h4 className="text-white font-bold border-t border-slate-800 pt-6">Social Media</h4><SocialLinksManager links={tempSettings.socialLinks || []} onChange={v => updateTempSettings({ socialLinks: v })} /></>
               )}
               {activeEditorSection === 'legal' && (
                  <><div className="space-y-6"><SettingField label="Disclosure Title" value={tempSettings.disclosureTitle} onChange={v => updateTempSettings({ disclosureTitle: v })} /><SettingField label="Disclosure Content (Markdown)" value={tempSettings.disclosureContent} onChange={v => updateTempSettings({ disclosureContent: v })} type="textarea" rows={10} /></div><div className="space-y-6 pt-6 border-t border-slate-800"><SettingField label="Privacy Title" value={tempSettings.privacyTitle} onChange={v => updateTempSettings({ privacyTitle: v })} /><SettingField label="Privacy Content (Markdown)" value={tempSettings.privacyContent} onChange={v => updateTempSettings({ privacyContent: v })} type="textarea" rows={10} /></div><div className="space-y-6 pt-6 border-t border-slate-800"><SettingField label="Terms Title" value={tempSettings.termsTitle} onChange={v => updateTempSettings({ termsTitle: v })} /><SettingField label="Terms Content (Markdown)" value={tempSettings.termsContent} onChange={v => updateTempSettings({ termsContent: v })} type="textarea" rows={10} /></div></>
               )}
               {activeEditorSection === 'integrations' && (
                  <><IntegrationGuide /><div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><Mail size={16} /> EmailJS Configuration</h4><div className="space-y-4"><SettingField label="Service ID" value={tempSettings.emailJsServiceId || ''} onChange={v => updateTempSettings({ emailJsServiceId: v })} /><SettingField label="Template ID" value={tempSettings.emailJsTemplateId || ''} onChange={v => updateTempSettings({ emailJsTemplateId: v })} /><SettingField label="Public Key" value={tempSettings.emailJsPublicKey || ''} onChange={v => updateTempSettings({ emailJsPublicKey: v })} /></div></div><div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><Globe size={16} /> Analytics & Tracking</h4><div className="space-y-4"><SettingField label="Google Analytics ID (G-XXXX)" value={tempSettings.googleAnalyticsId || ''} onChange={v => updateTempSettings({ googleAnalyticsId: v })} /><SettingField label="Facebook Pixel ID" value={tempSettings.facebookPixelId || ''} onChange={v => updateTempSettings({ facebookPixelId: v })} /><SettingField label="TikTok Pixel ID" value={tempSettings.tiktokPixelId || ''} onChange={v => updateTempSettings({ tiktokPixelId: v })} /><SettingField label="Pinterest Tag ID" value={tempSettings.pinterestTagId || ''} onChange={v => updateTempSettings({ pinterestTagId: v })} /></div></div></>
               )}
             </div>
             <div className="sticky bottom-0 bg-slate-950 pt-6 pb-2 border-t border-slate-800 mt-8 flex gap-4"><button onClick={() => { setEditorDrawerOpen(false); setTempSettings(settings); }} className="flex-1 py-4 bg-slate-800 text-slate-400 font-bold uppercase text-xs rounded-xl hover:text-white transition-colors">Cancel</button><button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="flex-1 py-4 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-colors shadow-lg shadow-primary/20">Publish Changes</button></div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-600'}`}></div>
                 <span className="text-slate-500">Supabase: <span className={isSupabaseConfigured ? 'text-green-500' : 'text-slate-400'}>{isSupabaseConfigured ? 'Synced' : 'Local'}</span></span>
              </div>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${connectionHealth?.status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]'}`}></div>
                 <span className="text-slate-500">Latency: <span className="text-white">{connectionHealth?.latency || 0}ms</span></span>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <span className="text-slate-600">Session ID: <span className="text-white font-mono">{userId?.substring(0, 8) || 'LOCAL'}</span></span>
              <button onClick={() => refreshAllData()} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                 <RefreshCcw size={12} className={saveStatus === 'saving' ? 'animate-spin' : ''} /> Force Resync
              </button>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-slate-600">Maison Portal v2.5.5</span>
              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
              <span className="text-slate-500">100% Secure Handshake</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin;