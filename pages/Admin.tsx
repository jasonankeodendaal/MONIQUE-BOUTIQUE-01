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
  FileBox, Lightbulb, Tablet, Laptop, CheckCircle2, SearchCode, GraduationCap, Pin, MousePointerClick, Puzzle, AtSign, Ghost, Gamepad2, HardDrive, Cpu, XCircle, DollarSign,
  Minus, FilePieChart, TrendingDown, ZapIcon, Presentation, Printer, History, RotateCcw,
  ListChecks, MoveVertical, PlayCircle
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { GUIDE_STEPS, PERMISSION_TREE, TRAINING_MODULES as INITIAL_TRAINING } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats, ContactFaq, ProductHistory, TrainingModule, TrainingStep } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, measureConnection, fetchCurationHistory, fetchTableData, moveRecord } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
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
       {label && <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>}
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
             <div className="flex-shrink-0">
                <SingleImageUploader 
                  label="" 
                  value={link.iconUrl} 
                  onChange={v => handleUpdate(link.id, 'iconUrl', v)}
                  className="w-12 h-12 rounded-xl"
                />
             </div>
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

const FaqsManager: React.FC<{ faqs: ContactFaq[]; onChange: (faqs: ContactFaq[]) => void }> = ({ faqs, onChange }) => {
  const handleAdd = () => {
    const newFaq: ContactFaq = {
      question: 'New Question',
      answer: 'New Answer'
    };
    onChange([...faqs, newFaq]);
  };

  const handleUpdate = (index: number, field: keyof ContactFaq, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Frequently Asked Questions</label>
        <button onClick={handleAdd} className="text-[10px] font-black uppercase text-primary hover:text-white flex items-center gap-1">
          <Plus size={12}/> Add FAQ
        </button>
      </div>
      
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-slate-900 p-6 rounded-[1.5rem] border border-slate-800 flex flex-col gap-4 relative animate-in fade-in slide-in-from-top-2">
             <div className="absolute top-4 right-4">
                <button onClick={() => handleRemove(idx)} className="p-2 bg-slate-800 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
             </div>
             <div className="space-y-4 pr-10">
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Question</label>
                  <input 
                    type="text" 
                    value={faq.question} 
                    onChange={e => handleUpdate(idx, 'question', e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-bold outline-none focus:border-primary transition-all"
                    placeholder="e.g. How long does shipping take?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Answer</label>
                  <textarea 
                    value={faq.answer} 
                    onChange={e => handleUpdate(idx, 'answer', e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-primary resize-none transition-all font-light leading-relaxed"
                    placeholder="Provide a helpful answer..."
                    rows={3}
                  />
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
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
  return { icon: Globe, color: 'text-white', bg: `bg-slate-700`, border: 'border-white/10' };
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
        rawData = [];
      }
      setTotalTraffic(rawData.length);
      const agg: Record<string, any> = {};
      let dev = { mobile: 0, desktop: 0, tablet: 0 };
      rawData.forEach((entry: any) => {
        if (!entry) return;
        const device = entry.device || 'Desktop';
        if (device === 'Mobile') dev.mobile++;
        else if (device === 'Tablet') dev.tablet++;
        else dev.desktop++;
        const key = `${entry.city}-${entry.region}-${entry.country}`;
        if (!agg[key]) {
          agg[key] = {
            city: entry.city || 'Unknown', region: entry.region || '', country: entry.country || 'Global',
            device, os: entry.os || 'Unknown', browser: entry.browser || 'Unknown', source: entry.source || 'Direct', count: 0, lastActive: 0
          };
        }
        agg[key].count += 1;
        agg[key].lastActive = Math.max(agg[key].lastActive, entry.timestamp || 0);
      });
      setDeviceStats(dev);
      setGeoStats(Object.values(agg).sort((a: any, b: any) => b.count - a.count).slice(0, 15));
    };
    loadDetailedGeo();
    const interval = setInterval(loadDetailedGeo, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSourceIcon = (source: string) => {
    const styles = getPlatformStyles(source);
    const IconComp = styles.icon;
    return <IconComp size={12} className={styles.color} />;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 relative min-h-[600px] bg-slate-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group flex flex-col">
        <div className="relative z-10 p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start text-left gap-4">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="relative w-3 h-3"><div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div><div className="relative w-3 h-3 bg-green-500 rounded-full"></div></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">Live Traffic Feed</span>
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Precise <span className="text-primary">Location</span></h3>
           </div>
           <div className="text-left md:text-right">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Hits</span>
              <span className="text-3xl font-bold text-white font-mono">{totalTraffic.toLocaleString()}</span>
           </div>
        </div>
        <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar p-4">
          {geoStats.map((geo, idx) => (
             <div key={idx} className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center p-5 bg-slate-800/40 rounded-3xl border border-white/5 hover:bg-slate-800 transition-colors group/item mb-4">
                <div className="col-span-1 hidden md:block">
                   <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">{idx + 1}</span>
                </div>
                <div className="col-span-7 pl-0 md:pl-2 text-left w-full">
                   <div className="font-bold text-white text-base flex items-center gap-2 truncate">
                      <MapPin size={16} className="text-primary opacity-50 group-hover/item:opacity-100 transition-opacity flex-shrink-0"/>
                      {geo.city}
                   </div>
                   <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">{geo.region}, {geo.country}</div>
                </div>
                <div className="col-span-2 text-right">
                   <div className="text-white font-mono font-bold text-lg">{geo.count}</div>
                </div>
                <div className="col-span-2 flex flex-col items-end justify-center gap-1">
                   <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
                      {getSourceIcon(geo.source)}
                      <span className="text-[8px] uppercase font-bold text-slate-400">{geo.source}</span>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-900 rounded-[2rem] border border-white/10 p-8 flex flex-col shadow-2xl text-left h-full">
         <div className="mb-8">
            <h3 className="text-white font-bold text-xl flex items-center gap-3"><Smartphone size={24} className="text-primary"/> Device Breakdown</h3>
         </div>
         <div className="space-y-6">
            {[
              { label: 'Mobile', count: deviceStats.mobile, icon: Smartphone, color: 'text-primary', bar: 'bg-primary' },
              { label: 'Desktop', count: deviceStats.desktop, icon: Monitor, color: 'text-blue-500', bar: 'bg-blue-500' },
              { label: 'Tablet', count: deviceStats.tablet, icon: Tablet, color: 'text-purple-500', bar: 'bg-purple-500' }
            ].map((d, i) => (
               <div key={i} className="bg-slate-800/50 p-6 rounded-3xl border border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 bg-slate-800 rounded-2xl ${d.color}`}><d.icon size={20}/></div>
                        <span className="text-white font-bold">{d.label}</span>
                     </div>
                     <span className="text-white font-mono font-bold">{d.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                     <div className={`h-full ${d.bar}`} style={{ width: `${totalTraffic > 0 ? (d.count / totalTraffic) * 100 : 0}%` }}></div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const GuideIllustration: React.FC<{ id?: string }> = ({ id }) => {
  if (id === 'forge') return <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden"><Terminal size={64} className="text-primary animate-pulse" /></div>;
  return <div className="relative w-full aspect-square bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center"><Rocket className="text-slate-800 w-24 h-24" /></div>;
};

const PermissionSelector: React.FC<{ permissions: string[]; onChange: (perms: string[]) => void; role: 'owner' | 'admin'; }> = ({ permissions, onChange, role }) => {
  if (role === 'owner') return <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold text-center">Owners have full system access by default.</div>;
  const togglePermission = (id: string) => {
    if (permissions.includes(id)) onChange(permissions.filter(p => p !== id));
    else onChange([...permissions, id]);
  };
  return (
    <div className="space-y-6">
      {PERMISSION_TREE.map(group => (
        <div key={group.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left">
          <div className="flex flex-col mb-4">
            <span className="text-white font-bold text-sm">{group.label}</span>
            <span className="text-slate-500 text-[10px]">{group.description}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {group.children?.map(perm => {
              const isSelected = permissions.includes(perm.id);
              return (
                <button key={perm.id} onClick={() => togglePermission(perm.id)} className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-primary/10 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                  {isSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                  <span className="text-xs font-medium">{perm.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const IconPicker: React.FC<{ selected: string; onSelect: (icon: string) => void }> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const LUCIDE_KEYS = Object.keys(LucideIcons).filter(k => /^[A-Z]/.test(k));
  const SelectedIconComponent = CustomIcons[selected] || (LucideIcons as any)[selected] || LucideIcons.Package;
  return (
    <div className="relative text-left w-full">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
        <div className="flex items-center gap-3"><SelectedIconComponent size={18} /><span className="text-xs font-bold">{selected}</span></div>
        <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-[2rem] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-white font-bold">Select Icon</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-white"><X size={20}/></button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 bg-slate-950">
               {LUCIDE_KEYS.slice(0, 100).map(name => {
                 const IconComp = (LucideIcons as any)[name];
                 return (
                   <button key={name} onClick={() => { onSelect(name); setIsOpen(false); }} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 border ${selected === name ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                     <IconComp size={24} />
                   </button>
                 );
               })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdGeneratorModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const { settings } = useSettings();
  const text = `${product.name}\n${product.description.substring(0, 100)}...\nPrice: R ${product.price}\n\nShop now: ${window.location.origin}/#/product/${product.id}`;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 animate-in fade-in">
       <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 max-w-md w-full text-left space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-white font-bold uppercase tracking-widest text-sm">Ad Generator</h3>
             <button onClick={onClose} className="p-2 text-slate-500"><X size={24} /></button>
          </div>
          <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-6">
             <img src={product.media[0]?.url} className="w-full h-full object-cover" />
          </div>
          <textarea readOnly value={text} className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs h-32 resize-none" />
          <button onClick={() => navigator.clipboard.writeText(text)} className="w-full py-4 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs">Copy Caption</button>
       </div>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; label?: string }> = ({ code, label }) => (
  <div className="relative mb-6 text-left w-full min-w-0">
    {label && <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">{label}</div>}
    <pre className="p-6 bg-black rounded-2xl text-[10px] font-mono text-slate-400 overflow-x-auto border border-slate-800"><code>{code}</code></pre>
  </div>
);

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string }> = ({ files, onFilesChange, multiple = true, label = "media" }) => {
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
           } catch (err) { console.error(err); }
        }
        const newMedia: MediaFile = { id: Math.random().toString(36).substr(2, 9), url: result, name: file.name, type: file.type, size: file.size };
        onFilesChange(multiple ? [...files, newMedia] : [newMedia]);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    });
  };
  return (
    <div className="space-y-4 text-left w-full">
      <div onClick={() => !uploading && fileInputRef.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-900/30">
        <Upload className="text-slate-400 mb-2" size={24} />
        <span className="text-[10px] font-black text-slate-500 uppercase">Add {label}</span>
        <input type="file" ref={fileInputRef} className="hidden" multiple={multiple} onChange={e => processFiles(e.target.files)} />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {files.map(f => (
          <div key={f.id} className="aspect-square rounded-xl overflow-hidden relative border border-slate-800">
             <img src={f.url} className="w-full h-full object-cover" />
             <button onClick={() => onFilesChange(files.filter(x => x.id !== f.id))} className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg text-white"><X size={12}/></button>
          </div>
        ))}
      </div>
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
          <summary className="cursor-pointer font-bold text-white mb-2 list-none flex items-center gap-2">
            <BarChart size={14} /> Google Analytics 4
          </summary>
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2">
            <p>1. Go to Google Analytics.</p>
            <p>2. Create a property. Navigate to Admin {'>'} Data Streams {'>'} Web.</p>
            <p>3. Copy the Measurement ID (starts with G-).</p>
          </div>
        </details>
     </div>
  </div>
);

interface EliteReportProps {
  onClose: () => void;
  stats: ProductStats[];
  products: Product[];
  categories: Category[];
  admins: AdminUser[];
  settings: SiteSettings;
  trafficEvents: any[];
  curatorId: string;
}

const EliteReportModal: React.FC<EliteReportProps> = ({ onClose, stats, products, categories, admins, settings, trafficEvents, curatorId }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const reportData = useMemo(() => {
    const targetProducts = (curatorId === 'all') ? products : products.filter(p => p.createdBy === curatorId);
    const targetProductIds = targetProducts.map(p => p.id);
    const targetStats = stats.filter(s => targetProductIds.includes(s.productId));
    const totalViews = targetStats.reduce((acc, s) => acc + s.views, 0);
    const totalClicks = targetStats.reduce((acc, s) => acc + s.clicks, 0);
    const ctr = (totalViews > 0) ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';
    return { totalViews, totalClicks, ctr, curatorName: (curatorId === 'all') ? 'All Curators' : (admins.find(a => a.id === curatorId)?.name || 'Curator') };
  }, [stats, products, admins, curatorId]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 overflow-y-auto">
      {isGenerating ? (
        <div className="text-center space-y-6">
           <Loader2 size={48} className="animate-spin text-primary mx-auto" />
           <p className="text-white uppercase tracking-widest font-black">Synthesizing Analytics...</p>
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden flex flex-col min-h-[90vh]">
           <div className="p-6 bg-slate-900 flex justify-between items-center text-white">
              <div className="flex items-center gap-3"><ShieldCheck className="text-primary" size={24} /><span>Elite Performance Report</span></div>
              <button onClick={onClose} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><X size={20}/></button>
           </div>
           <div className="flex-grow p-12 text-slate-900 text-left">
              <h1 className="text-4xl font-serif font-black uppercase mb-8">{settings.companyName}</h1>
              <div className="grid grid-cols-3 gap-8 mb-12">
                 <div className="p-8 bg-slate-50 rounded-3xl">
                    <span className="text-[10px] uppercase font-black text-slate-400">Impressions</span>
                    <div className="text-3xl font-bold">{reportData.totalViews.toLocaleString()}</div>
                 </div>
                 <div className="p-8 bg-slate-50 rounded-3xl">
                    <span className="text-[10px] uppercase font-black text-slate-400">Conversions</span>
                    <div className="text-3xl font-bold text-primary">{reportData.totalClicks.toLocaleString()}</div>
                 </div>
                 <div className="p-8 bg-slate-50 rounded-3xl">
                    <span className="text-[10px] uppercase font-black text-slate-400">CTR</span>
                    <div className="text-3xl font-bold">{reportData.ctr}%</div>
                 </div>
              </div>
              <p className="text-slate-400 text-xs italic">Curation statistics verified for {reportData.curatorName}.</p>
           </div>
        </div>
      )}
    </div>
  );
};

type TabId = 'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide' | 'training';

const Admin: React.FC = () => {
  const { settings, updateSettings, user, isLocalMode, saveStatus, setSaveStatus, products, categories, subCategories, heroSlides, enquiries, admins, stats, updateData, deleteData, refreshAllData, connectionHealth, systemLogs, storageStats } = useSettings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('enquiries');
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<any>(null);
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [trafficEvents, setTrafficEvents] = useState<any[]>([]);
  const [curatorFilter, setCuratorFilter] = useState<string>('all'); 
  const [showEliteReport, setShowEliteReport] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [productSearch, setProductSearch] = useState('');
  const [catalogView, setCatalogView] = useState<'active' | 'history'>('active');

  const myAdminProfile = useMemo(() => admins.find(a => a.id === user?.id || a.email === user?.email), [admins, user]);
  const isOwner = isLocalMode || (myAdminProfile?.role === 'owner');

  const displayProducts = useMemo(() => {
    const baseSet = products;
    if (isOwner && curatorFilter !== 'all') return baseSet.filter(p => p.createdBy === curatorFilter);
    return baseSet;
  }, [products, isOwner, curatorFilter]);

  const handleLogout = async () => { if (isSupabaseConfigured) await supabase.auth.signOut(); navigate('/login'); };
  const handleSaveProduct = async () => { const ok = await updateData('products', { ...productData, id: editingId || Date.now().toString(), createdAt: Date.now(), createdBy: user?.id }); if (ok) setShowProductForm(false); };
  const handleSaveCategory = async () => { const ok = await updateData('categories', { ...catData, id: editingId || Date.now().toString(), createdBy: user?.id }); if (ok) setShowCategoryForm(false); };
  const handleSaveHero = async () => { const ok = await updateData('hero_slides', { ...heroData, id: editingId || Date.now().toString(), createdBy: user?.id }); if (ok) setShowHeroForm(false); };

  const renderEnquiries = () => (
    <div className="space-y-6 text-left">
      <h2 className="text-3xl font-serif text-white">Inbox</h2>
      {enquiries.length === 0 ? <p className="text-slate-500">No enquiries.</p> : enquiries.map(e => (
        <div key={e.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
           <h4 className="text-white font-bold">{e.name}</h4>
           <p className="text-primary text-sm">{e.email}</p>
           <p className="text-slate-400 mt-4 italic">"{e.message}"</p>
           <div className="mt-6 flex gap-2">
              <button onClick={() => deleteData('enquiries', e.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={18}/></button>
           </div>
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-12 text-left">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif text-white">Insights</h2>
          <button onClick={() => setShowEliteReport(true)} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs">Generate Report</button>
       </div>
       <TrafficAreaChart trafficEvents={trafficEvents} />
       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800">
             <span className="text-[10px] uppercase font-black text-slate-500">Hits</span>
             <div className="text-3xl font-bold text-white">{storageStats.totalRecords}</div>
          </div>
       </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="space-y-6 text-left">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif text-white">Catalog</h2>
          <button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs">+ Product</button>
       </div>
       {showProductForm ? (
         <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 space-y-6">
            <SettingField label="Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
            <SettingField label="Price" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
            <SettingField label="Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
            <button onClick={handleSaveProduct} className="w-full py-4 bg-primary text-slate-900 rounded-xl font-bold uppercase text-xs">Save</button>
         </div>
       ) : (
         <div className="grid gap-4">
            {displayProducts.map(p => (
              <div key={p.id} className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <img src={p.media[0]?.url} className="w-12 h-12 object-cover rounded-lg" />
                    <div><h4 className="text-white font-bold">{p.name}</h4><p className="text-primary text-xs">R {p.price}</p></div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setProductData(p); setEditingId(p.id); setShowProductForm(true); }} className="p-3 bg-slate-800 text-white rounded-xl"><Edit2 size={16}/></button>
                    <button onClick={() => deleteData('products', p.id)} className="p-3 bg-slate-800 text-red-500 rounded-xl"><Trash2 size={16}/></button>
                 </div>
              </div>
            ))}
         </div>
       )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-32 text-left">
      <SaveIndicator status={saveStatus} />
      {showEliteReport && <EliteReportModal onClose={() => setShowEliteReport(false)} stats={stats} products={products} categories={categories} admins={admins} settings={settings} trafficEvents={trafficEvents} curatorId={curatorFilter} />}
      
      <header className="max-w-7xl mx-auto px-6 mb-12 flex justify-between items-end">
        <h1 className="text-5xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1>
        <div className="flex gap-2 p-1 bg-slate-900 rounded-2xl">
           <button onClick={() => setActiveTab('enquiries')} className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest ${activeTab === 'enquiries' ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>Inbox</button>
           <button onClick={() => setActiveTab('analytics')} className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest ${activeTab === 'analytics' ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>Insights</button>
           <button onClick={() => setActiveTab('catalog')} className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest ${activeTab === 'catalog' ? 'bg-primary text-slate-900' : 'text-slate-500'}`}>Items</button>
           <button onClick={handleLogout} className="px-6 py-3 text-red-500 font-bold uppercase text-xs">Exit</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {activeTab === 'enquiries' && renderEnquiries()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'catalog' && renderCatalog()}
      </main>
      
      <footer className="fixed bottom-0 inset-x-0 bg-slate-900/80 backdrop-blur-md border-t border-white/5 p-4 text-[10px] text-slate-500 uppercase font-black text-center">
         System Online • Maison Portal v3.0.1 • Latency: {connectionHealth?.latency}ms
      </footer>
    </div>
  );
};

export default Admin;