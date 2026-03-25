import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Plus, Edit2, Trash2, Menu, Settings as SettingsIcon, Layout, Info, Upload, X, ChevronDown,
  Monitor, Smartphone, ShieldCheck, LayoutGrid, Globe, Mail, Phone, MapPin, Share2, Tag,
  ArrowRight, Video, Image, ShoppingBag, CheckCircle, Percent, LogOut, Rocket, Terminal,
  Copy, Check, Database, Server, AlertTriangle, ExternalLink, Flame, Trash, Megaphone,
  Sparkles, Loader2, Users, Key, Lock, Download, Reply, AlertOctagon, Eye, Shield, Award,
  HelpCircle, Layers, FileCode, Search, CheckSquare, Square, Target, Clock, Filter,
  FileSpreadsheet, BarChart3, TrendingUp, Activity, Zap, BarChart, Wifi, Lightbulb,
  CheckCircle2, GraduationCap, HardDrive, FilePieChart, TrendingDown, Presentation, Printer,
  History, RotateCcw, PlayCircle, Briefcase, Crown, FileText, RefreshCw, File as FileIcon,
  Facebook, Instagram, Pin, MessageCircle, SearchCode, Twitter, Linkedin, Tablet,
  MousePointerClick, ZapIcon, Inbox, Package, LayoutPanelTop, Palette, Timer, Star, User, Link as LinkIcon
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { GUIDE_STEPS, PERMISSION_TREE, TRAINING_MODULES as INITIAL_TRAINING } from '../constants';
import { Product, Category, CarouselSlide, MediaFile, SubCategory, SiteSettings, Enquiry, DiscountRule, SocialLink, AdminUser, PermissionNode, ProductStats, ContactFaq, ProductHistory, TrainingModule, Order, OrderItem, AppUser, SiteReview } from '../types';
import { useSettings } from '../App';
import { supabase, isSupabaseConfigured, uploadMedia, deleteMedia, measureConnection, fetchCurationHistory, fetchTableData, moveRecord } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { CustomIcons } from '../components/CustomIcons';
import { IconRenderer } from '../components/IconRenderer';

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

const SettingField: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: 'text' | 'textarea' | 'color' | 'number' | 'password' | 'richtext'; placeholder?: string; rows?: number }> = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => (
  <div className="space-y-2 text-left w-full min-w-0">
    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate block">{label}</label>
    {type === 'textarea' ? (
      <textarea rows={rows} className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all resize-none font-light text-sm" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : type === 'richtext' ? (
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden text-white [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-slate-900 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[150px] [&_.ql-stroke]:stroke-slate-400 [&_.ql-fill]:fill-slate-400 [&_.ql-picker]:text-slate-400">
        <ReactQuill theme="snow" value={value} onChange={onChange} placeholder={placeholder} />
      </div>
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
        throw new Error("Supabase storage is not configured. Cannot upload media.");
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
        {faqs.length === 0 && (
          <div className="text-center p-12 border border-dashed border-slate-800 rounded-[2rem] text-slate-500 text-xs">
             <HelpCircle size={32} className="mx-auto mb-3 opacity-20"/>
             No FAQs added. Use FAQs to reduce common support enquiries.
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

const TrafficMap: React.FC<{ data: any[]; isEnlarged?: boolean; onClick?: () => void }> = ({ data, isEnlarged = false, onClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
      .then(res => res.json())
      .then(topology => {
        setWorldData(feature(topology, (topology as any).objects.countries));
      });
  }, []);

  useEffect(() => {
    if (!worldData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const projection = d3.geoMercator()
      .scale(width / (2 * Math.PI))
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append('g');

    // Draw ocean background
    g.append('rect')
      .attr('width', width * 2)
      .attr('height', height * 2)
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .attr('fill', '#020617');

    // Draw map
    g.selectAll('path')
      .data(worldData.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', '#0f172a')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 0.3)
      .attr('class', 'transition-colors duration-500 hover:fill-slate-800');

    // Add pins
    const pins = g.selectAll('circle')
      .data(data.filter(d => d.lat && d.lon))
      .enter()
      .append('circle')
      .attr('cx', d => projection([d.lon, d.lat])?.[0] || 0)
      .attr('cy', d => projection([d.lon, d.lat])?.[1] || 0)
      .attr('r', isEnlarged ? 1.5 : 0.8)
      .attr('fill', 'var(--primary-color)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.1)
      .attr('class', 'animate-pulse');

    // Add tooltips if enlarged
    if (isEnlarged) {
      pins.append('title')
        .text(d => `${d.city}, ${d.country}\n${d.device} - ${d.source}`);
    }

    // Zoom behavior for enlarged map
    if (isEnlarged) {
      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      svg.call(zoom as any);
    }

  }, [worldData, data, isEnlarged]);

  return (
    <div 
      className={`relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-white/5 ${!isEnlarged ? 'cursor-zoom-in' : ''}`}
      onClick={onClick}
    >
      <svg ref={svgRef} className="w-full h-full" />
      {!isEnlarged && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
          Click to Enlarge
        </div>
      )}
    </div>
  );
};

const TrafficAreaChart: React.FC = () => {
  const [geoStats, setGeoStats] = useState<any[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const [deviceStats, setDeviceStats] = useState<{mobile: number, desktop: number, tablet: number}>({mobile: 0, desktop: 0, tablet: 0});
  const [isMapEnlarged, setIsMapEnlarged] = useState(false);
  
  useEffect(() => {
    const loadDetailedGeo = () => {
      let data = [];
      try {
        data = JSON.parse(localStorage.getItem('site_visitor_locations') || '[]');
        if (!Array.isArray(data)) data = [];
      } catch (e) {
        console.warn("Failed to parse geo stats", e);
        data = [];
      }
      
      setRawData(data);
      setTotalTraffic(data.length);

      const agg: Record<string, any> = {};
      let dev = { mobile: 0, desktop: 0, tablet: 0 };
      
      data.forEach((entry: any) => {
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
            lastActive: 0,
            lat: entry.lat,
            lon: entry.lon
          };
        }
        agg[key].count += 1;
        agg[key].lastActive = Math.max(agg[key].lastActive, entry.timestamp || 0);
        if (entry.source && entry.source !== 'Direct') agg[key].source = entry.source;
      });

      setDeviceStats(dev);
      const sorted = Object.values(agg).sort((a: any, b: any) => (b.count - a.count)).slice(0, 15);
      setGeoStats(sorted);
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

  const categorizedData = useMemo(() => {
    const countries: Record<string, { count: number; regions: Record<string, { count: number; cities: Record<string, number> }> }> = {};
    
    rawData.forEach(entry => {
      const c = entry.country || 'Unknown';
      const r = entry.region || 'Unknown Region';
      const ci = entry.city || 'Unknown City';
      
      if (!countries[c]) countries[c] = { count: 0, regions: {} };
      countries[c].count++;
      
      if (!countries[c].regions[r]) countries[c].regions[r] = { count: 0, cities: {} };
      countries[c].regions[r].count++;
      
      countries[c].regions[r].cities[ci] = (countries[c].regions[r].cities[ci] || 0) + 1;
    });
    
    return Object.entries(countries).sort((a, b) => b[1].count - a[1].count);
  }, [rawData]);

  return (
    <div className="flex flex-col gap-12">
      <div className="relative min-h-[850px] bg-slate-900 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl group flex flex-col">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--primary-color) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 p-10 md:p-14 pb-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start text-left gap-8">
           <div className="flex-grow">
              <div className="flex items-center gap-4 mb-3">
                 <div className="relative w-4 h-4">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-4 h-4 bg-green-500 rounded-full"></div>
                 </div>
                 <span className="text-[11px] font-black uppercase tracking-[0.5em] text-green-500">Live Traffic Intelligence Feed</span>
              </div>
              <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">Global <span className="text-primary">Traffic Intelligence</span></h3>
              <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-bold">Real-time geographic distribution & interaction nodes</p>
           </div>
           
           <div className="w-full md:w-80 h-56 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group/map cursor-pointer relative" onClick={() => setIsMapEnlarged(true)}>
              <TrafficMap data={rawData} />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/map:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                 <div className="px-4 py-2 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Enlarge Intelligence Map</div>
              </div>
           </div>

           <div className="text-left md:text-right flex flex-col justify-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Global Hits</span>
              <span className="text-5xl font-bold text-white font-mono tracking-tighter">{totalTraffic.toLocaleString()}</span>
           </div>
        </div>

        {/* Enlarged Map Modal */}
        {isMapEnlarged && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black animate-in fade-in duration-300">
            <div className="relative w-full h-full bg-slate-900 border-none overflow-hidden flex flex-col">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-black italic uppercase tracking-tighter text-2xl">Global <span className="text-primary">Traffic Intelligence</span></h3>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-black">High-precision geographic distribution of all historical visitors</p>
                </div>
                <button 
                  onClick={() => setIsMapEnlarged(false)}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                <div className="flex-grow p-4 lg:p-8 relative">
                   <TrafficMap data={rawData} isEnlarged />
                   <div className="absolute bottom-12 left-12 p-4 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl hidden lg:block">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Node</span>
                      </div>
                      <div className="text-[9px] text-slate-400 leading-tight uppercase tracking-tighter">
                        Each dot represents a unique <br /> interaction session.
                      </div>
                   </div>
                </div>
                
                <div className="w-full lg:w-96 bg-slate-950/50 border-l border-white/5 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-white/5 bg-slate-900/50">
                    <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-1">Categorized Locations</h4>
                    <p className="text-slate-500 text-[9px] uppercase tracking-widest">Sorted by interaction volume</p>
                  </div>
                  <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {categorizedData.map(([country, data]: any) => (
                      <div key={country} className="space-y-2">
                        <div className="flex justify-between items-center px-2 py-1 bg-white/5 rounded-lg">
                          <span className="text-white text-[10px] font-black uppercase tracking-widest">{country}</span>
                          <span className="text-primary text-[10px] font-mono font-bold">{data.count}</span>
                        </div>
                        <div className="pl-4 space-y-1 border-l border-white/5 ml-2">
                          {Object.entries(data.regions).sort((a: any, b: any) => b[1].count - a[1].count).map(([region, rData]: any) => (
                            <div key={region} className="space-y-1">
                              <div className="flex justify-between text-[9px] text-slate-400 uppercase tracking-tighter">
                                <span>{region}</span>
                                <span>{rData.count}</span>
                              </div>
                              <div className="pl-3 space-y-0.5 opacity-60">
                                {Object.entries(rData.cities).sort((a: any, b: any) => b[1] - a[1]).map(([city, count]: any) => (
                                  <div key={city} className="flex justify-between text-[8px] text-slate-500 italic">
                                    <span>{city}</span>
                                    <span>{count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-950/50 border-t border-white/5 text-center flex justify-between items-center px-12">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Use mouse wheel to zoom • Drag to pan</span>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Visitor Node</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-800 rounded-full border border-slate-700"></div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Inactive Zone</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 flex-grow overflow-y-auto custom-scrollbar p-6 md:p-12">
          {geoStats.length > 0 ? (
            <div className="grid gap-6">
               <div className="hidden md:grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 mb-2">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6 text-left">Location (Town/City)</div>
                  <div className="col-span-2 text-right">Hits</div>
                  <div className="col-span-3 text-right">Device/Source</div>
               </div>
               {geoStats.map((geo, idx) => {
                 const isLive = (Date.now() - geo.lastActive) < 300000;
                 return (
                    <div key={idx} className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center p-8 bg-slate-800/30 rounded-[2rem] border border-white/5 hover:bg-slate-800/60 transition-all group/item gap-4 md:gap-0 hover:scale-[1.01] hover:shadow-2xl">
                       <div className="col-span-1 hidden md:block">
                          <span className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-sm font-bold text-slate-400 border border-slate-700 shadow-inner">{idx + 1}</span>
                       </div>
                       <div className="col-span-8 md:col-span-6 pl-0 md:pl-4 text-left w-full">
                          <div className="font-bold text-white text-xl flex items-center gap-3 truncate tracking-tight">
                             <MapPin size={20} className="text-primary opacity-50 group-hover/item:opacity-100 transition-opacity flex-shrink-0"/>
                             {geo.city}
                          </div>
                          <div className="text-sm text-slate-500 font-medium mt-1 truncate uppercase tracking-widest">{geo.region}, {geo.country}</div>
                       </div>
                       <div className="col-span-2 text-right w-full md:w-auto flex justify-between md:block">
                          <span className="md:hidden text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Hits:</span>
                          <div className="text-white font-mono font-bold text-2xl">{geo.count}</div>
                       </div>
                       <div className="col-span-4 md:col-span-3 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-0">
                          {isLive ? (
                             <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">Active Now</span>
                          ) : (
                             <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider whitespace-nowrap">Last Seen: {new Date(geo.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          )}
                          <div className="flex items-center gap-4 text-[11px] text-slate-500">
                             <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm">{getSourceIcon(geo.source)} <span className="uppercase font-black tracking-tighter">{geo.source}</span></div>
                             <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                                {geo.device === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                             </div>
                          </div>
                       </div>
                    </div>
                 );
               })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-20">
               <Globe size={80} className="text-slate-500 mb-6 animate-pulse" />
               <h4 className="text-white font-black uppercase tracking-[0.3em] text-xl">Awaiting Global Signal</h4>
               <p className="text-slate-500 text-sm mt-4 max-w-sm leading-relaxed">Data populates as visitors access your bridge page. High-precision nodes will appear here.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] border border-white/10 p-10 md:p-14 flex flex-col shadow-2xl text-left">
         <div className="mb-12 flex justify-between items-end">
            <div>
               <h3 className="text-white font-black text-2xl md:text-3xl italic uppercase tracking-tighter flex items-center gap-4"><Smartphone size={32} className="text-primary"/> Device <span className="text-primary">Breakdown</span></h3>
               <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold">Platform Distribution & Hardware Intelligence</p>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Active Nodes</span>
               <span className="text-3xl font-bold text-white font-mono">{totalTraffic}</span>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Mobile', count: deviceStats.mobile, icon: Smartphone, color: 'text-primary', bar: 'bg-primary', shadow: 'shadow-primary/20' },
              { label: 'Desktop', count: deviceStats.desktop, icon: Monitor, color: 'text-blue-500', bar: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
              { label: 'Tablet', count: deviceStats.tablet, icon: Tablet, color: 'text-purple-500', bar: 'bg-purple-500', shadow: 'shadow-purple-500/20' }
            ].map((d, i) => {
              const IconComp = d.icon;
              const share = (totalTraffic > 0) ? Math.round((d.count / totalTraffic) * 100) : 0;
              return (
                <div key={i} className="bg-slate-800/30 p-8 rounded-[2.5rem] border border-slate-800 hover:border-slate-600 transition-all hover:scale-[1.02] group/device">
                   <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-5">
                         <div className={`p-4 bg-slate-900 rounded-2xl ${d.color} border border-white/5 shadow-xl group-hover/device:scale-110 transition-transform`}><IconComp size={24}/></div>
                         <span className="text-white font-black uppercase tracking-widest text-sm">{d.label}</span>
                      </div>
                      <span className="text-white font-mono font-bold text-2xl">{d.count}</span>
                   </div>
                   <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div className={`h-full ${d.bar} transition-all duration-1000 ease-out ${d.shadow} shadow-lg`} style={{ width: `${ share }%` }}></div>
                   </div>
                   <div className="mt-4 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Market Share</span>
                      <span className={`text-sm font-bold ${d.color}`}>{ share }%</span>
                   </div>
                </div>
              );
            })}
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
  const [search, setSearch] = useState(''); 
  const [isOpen, setIsOpen] = useState(false); 
  const [limit, setLimit] = useState(100);
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');

  const CUSTOM_KEYS = Object.keys(CustomIcons); 
  const LUCIDE_KEYS = Object.keys(LucideIcons).filter(key => { 
    const val = (LucideIcons as any)[key]; 
    return /^[A-Z]/.test(key) && typeof val === 'function' && !key.includes('Icon') && !key.includes('Context'); 
  });
  
  const ALL_ICONS = [...CUSTOM_KEYS, ...LUCIDE_KEYS]; 
  const filtered = search ? ALL_ICONS.filter(name => name.toLowerCase().includes(search.toLowerCase())) : ALL_ICONS; 
  const displayed = filtered.slice(0, limit); 

  return (
    <div className="relative text-left w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <IconRenderer icon={selected} size={18} />
          <span className="text-xs font-bold truncate max-w-[150px]">{selected.startsWith('http') ? 'Custom Image' : selected}</span>
        </div>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
              <div>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <LayoutGrid size={18} className="text-primary"/> Icon Library
                </h3>
                <p className="text-slate-400 text-xs mt-1">Select from {filtered.length} curated icons or upload your own</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white transition-colors">
                <X size={20}/>
              </button>
            </div>

            <div className="flex border-b border-slate-800 bg-slate-900">
              <button 
                onClick={() => setActiveTab('library')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'library' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Library
              </button>
              <button 
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'custom' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Custom Upload
              </button>
            </div>

            {activeTab === 'library' ? (
              <>
                <div className="p-4 bg-slate-900 border-b border-slate-800">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-sm outline-none text-white focus:border-primary transition-all" 
                      placeholder="Search icons..." 
                      value={search} 
                      onChange={e => { setSearch(e.target.value); setLimit(100); }} 
                      autoFocus 
                    />
                  </div>
                </div>
                <div className="flex-grow overflow-y-auto p-6 custom-scrollbar bg-slate-950">
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                    {displayed.map(name => { 
                      const IconComp = CustomIcons[name] || (LucideIcons as any)[name]; 
                      if (!IconComp) return null; 
                      return (
                        <button 
                          key={name} 
                          onClick={() => { onSelect(name); setIsOpen(false); }} 
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-2 transition-all border ${selected === name ? 'bg-primary text-slate-900 border-primary shadow-lg scale-105' : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'}`}
                        >
                          <IconComp size={24} />
                          <span className="text-[9px] font-medium truncate w-full px-2 text-center opacity-70">{name}</span>
                        </button>
                      ) 
                    })}
                  </div>
                  {displayed.length < filtered.length && (
                    <button onClick={() => setLimit(prev => prev + 100)} className="w-full mt-6 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-colors">
                      Load More
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-12 bg-slate-950">
                <div className="w-full max-w-md space-y-8">
                  <div className="text-center space-y-2">
                    <h4 className="text-white font-bold">Upload Custom Icon</h4>
                    <p className="text-slate-400 text-xs">Recommended size: 64x64px. PNG or SVG preferred.</p>
                  </div>
                  
                  <SingleImageUploader 
                    label="Icon Asset" 
                    value={selected.startsWith('http') ? selected : ''} 
                    onChange={v => { onSelect(v); setIsOpen(false); }} 
                    className="h-32 w-32 mx-auto"
                  />

                  {selected.startsWith('http') && (
                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={selected} className="w-10 h-10 object-contain rounded-lg bg-slate-800 p-1" alt="Current" />
                        <span className="text-xs text-slate-400 truncate max-w-[200px]">Current Custom Icon</span>
                      </div>
                      <button 
                        onClick={() => onSelect('Package')} 
                        className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
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

  const PlatformIcon = platform.icon;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-slate-950 animate-in fade-in duration-300">
      <div className="w-full md:w-1/2 bg-black/40 border-r border-slate-800 flex flex-col h-full relative">
        <div className="p-8 flex justify-between items-center border-b border-slate-800">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Content Preview</span>
          <button onClick={onClose} className="md:hidden p-2 text-slate-500"><X size={24} /></button>
        </div>
        <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
          <div className="w-[320px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-slate-900 overflow-hidden relative">
            <div className="bg-slate-100 h-6 w-full absolute top-0 left-0 z-20 flex justify-center">
              <div className="w-20 h-4 bg-slate-900 rounded-b-xl"></div>
            </div>
            <div className="mt-8 px-4 pb-2 flex items-center gap-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-slate-200"></div>
              <span className="text-xs font-bold text-slate-900">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>
              <PlatformIcon size={14} style={{ color: platform.color }} className="ml-auto"/>
            </div>
            <div className="aspect-square bg-slate-100 relative text-left">
              <img src={product.media[0]?.url} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 text-left">
              <p className="text-[10px] text-slate-800 whitespace-pre-wrap leading-relaxed"><span className="font-bold mr-1">{settings.companyName.toLowerCase().replace(/\s/g, '_')}</span>{customText}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 bg-slate-950 flex flex-col h-full relative p-8 md:p-12 overflow-y-auto text-left">
        <button onClick={onClose} className="hidden md:block absolute top-10 right-10 p-4 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white"><X size={24} /></button>
        <div className="max-w-xl mx-auto space-y-8 w-full">
          <div>
            <h3 className="text-3xl font-serif text-white mb-2">Social <span className="text-primary italic">Manager</span></h3>
            <p className="text-slate-500 text-sm">Generate optimized assets.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {PLATFORMS.map(p => {
              const PIcon = p.icon;
              return (
                <button key={p.id} onClick={() => setPlatform(p)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all min-w-[100px] ${platform.id === p.id ? 'bg-slate-800 border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'}`}>
                  <PIcon size={24} style={{ color: (platform.id === p.id) ? '#fff' : p.color }} />
                  <span className="text-[10px] font-bold uppercase">{p.name}</span>
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Caption</label>
              <span className={`text-[10px] font-bold ${ (customText.length > platform.maxLength) ? 'text-red-500' : 'text-slate-600' }`}>{customText.length} / {platform.maxLength}</span>
            </div>
            <textarea rows={10} value={customText} onChange={e => setCustomText(e.target.value)} className="w-full p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 text-sm leading-relaxed outline-none focus:border-primary resize-none font-sans"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={handleCopy} className="col-span-2 py-4 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-white flex items-center justify-center gap-2 border border-dashed border-slate-600">
              {copied ? <Check size={16}/> : <Copy size={16}/>} 1. Copy Caption First
            </button>
            <button onClick={handleShareBundle} className="col-span-2 py-4 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              <Share2 size={16}/> 2. Share Bundle (Img + Text)
            </button>
            <div className="col-span-2 text-center text-slate-600 text-[9px] uppercase font-bold tracking-widest mt-2">Note: Many apps discard captions when sharing files. Copy text first.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CodeBlock: React.FC<{ code: string; language?: string; label?: string }> = ({ code, language = 'bash', label }) => {
  const [copied, setCopied] = useState(false); 
  const copyToClipboard = () => { 
    navigator.clipboard.writeText(code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };
  
  return (
    <div className="relative group mb-6 text-left w-full min-w-0 print:mb-0">
      {label && (
        <div className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2 print:text-black">
          <Terminal size={12}/>{label}
        </div>
      )}
      <div className="absolute top-8 right-4 z-10 print:hidden">
        <button 
          onClick={copyToClipboard} 
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/5"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="p-6 bg-black rounded-2xl text-[10px] md:text-xs font-mono text-slate-400 overflow-x-auto border border-slate-800 leading-relaxed custom-scrollbar shadow-inner w-full max-w-full print:bg-white print:text-black print:border-slate-200 print:overflow-visible print:whitespace-pre-wrap print:break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const FileUploader: React.FC<{ files: MediaFile[]; onFilesChange: (files: MediaFile[]) => void; multiple?: boolean; label?: string; accept?: string; }> = ({ files, onFilesChange, multiple = true, label = "media", accept = "image/*,video/*" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const processFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setUploading(true);
    let processedCount = 0;
    const newFiles: MediaFile[] = [];

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
          size: file.size,
          altText: ''
        };
        newFiles.push(newMedia);
        processedCount++;
        
        if (processedCount === incomingFiles.length) {
          onFilesChange(multiple ? [...files, ...newFiles] : [newFiles[0]]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAltTextChange = (id: string, altText: string) => {
    onFilesChange(files.map(f => f.id === id ? { ...f, altText } : f));
  };

  const handleDelete = async (f: MediaFile) => {
    if (isSupabaseConfigured && f.url.includes('supabase.co')) {
      try {
        await deleteMedia(f.url, 'media');
      } catch (err) {
        console.error("Failed to delete from storage", err);
      }
    }
    onFilesChange(files.filter(x => x.id !== f.id));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = files.findIndex(f => f.id === draggedId);
    const targetIndex = files.findIndex(f => f.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newFiles = [...files];
    const [draggedItem] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, draggedItem);
    
    onFilesChange(newFiles);
    setDraggedId(null);
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2">
          {files.map(f => (
            <div 
              key={f.id} 
              className={`flex flex-col gap-2 ${draggedId === f.id ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, f.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, f.id)}
              onDragEnd={() => setDraggedId(null)}
            >
              <div className="aspect-square rounded-xl overflow-hidden relative group border border-slate-800 bg-slate-900 cursor-move">
                {f.type.startsWith('video') ? (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-500"><Video size={20}/><span className="text-[8px] mt-1 uppercase font-bold">Video</span></div>
                ) : (
                   <img src={f.url} className="w-full h-full object-cover pointer-events-none" alt={f.altText || "preview"} />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button onClick={() => handleDelete(f)} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"><Trash2 size={16}/></button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Alt text (SEO)" 
                value={f.altText || ''} 
                onChange={(e) => handleAltTextChange(f.id, e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] text-white focus:ring-1 focus:ring-primary focus:border-transparent transition-all"
              />
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
            <BarChart size={14} /> Google Analytics 4
          </summary>
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2">
            <p>1. Go to <a href="https://analytics.google.com" target="_blank" className="text-white underline">Google Analytics</a>.</p>
            <p>2. Create a property. Go to Admin {'>'} Data Streams {'>'} Web.</p>
            <p>3. Copy the <strong>Measurement ID</strong> (starts with <code>G-</code>).</p>
          </div>
        </details>
        <details className="group">
           <summary className="cursor-pointer font-bold text-white mb-2 list-none flex items-center gap-2 group-open:text-primary transition-colors">
            <Target size={14} /> Meta / TikTok Pixels
          </summary>
          <div className="pl-6 space-y-2 border-l border-slate-700 ml-1.5 py-2">
            <p><strong>Meta (Facebook):</strong> Go to Events Manager {'>'} Data Sources. Create a Web Pixel. Copy the numeric <strong>Dataset ID</strong>.</p>
            <p><strong>TikTok:</strong> Go to Ads Manager {'>'} Assets {'>'} Events. Create a Web Event. Copy the <strong>Pixel ID</strong>.</p>
          </div>
        </details>
     </div>
  </div>
);

const EliteReportModal: React.FC<{ 
  onClose: () => void;
  stats: ProductStats[];
  products: Product[];
  categories: Category[];
  admins: AdminUser[];
  settings: SiteSettings;
  trafficEvents: any[];
  curatorId: string;
}> = ({ onClose, stats, products, categories, admins, settings, trafficEvents, curatorId }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d' | '1y' | '2y' | '3y'>('30d');
  
  useEffect(() => {
    const timer = setTimeout(() => setIsGenerating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const timeframeMs = useMemo(() => {
    const day = 86400000;
    switch(timeframe) {
      case '7d': return 7 * day;
      case '14d': return 14 * day;
      case '30d': return 30 * day;
      case '1y': return 365 * day;
      case '2y': return 730 * day;
      case '3y': return 1095 * day;
      default: return 30 * day;
    }
  }, [timeframe]);

  const reportData = useMemo(() => {
    const now = Date.now();
    const periodStart = now - timeframeMs;
    const prevPeriodStart = periodStart - timeframeMs;

    // 1. ISOLATE CURATOR PRODUCTS
    const targetProducts = (curatorId === 'all') 
      ? products 
      : products.filter(p => p.createdBy === curatorId);
    
    const targetProductNames = new Set(targetProducts.map(p => p.name));

    // 2. FILTER TRAFFIC LOGS BY CURATOR PRODUCTS & TIMEFRAME
    const filterLogs = (logs: any[], start: number, end: number) => {
      return logs.filter(e => {
        if (e.timestamp < start || e.timestamp > end) return false;
        if (curatorId === 'all') return true; 
        
        const logText = e.text || '';
        const isProductLog = logText.startsWith('Product: ');
        if (isProductLog) {
          const pName = logText.replace('Product: ', '').trim();
          return targetProductNames.has(pName);
        }
        return false;
      });
    };

    const currentPeriodLogs = filterLogs(trafficEvents, periodStart, now);
    const prevPeriodLogs = filterLogs(trafficEvents, prevPeriodStart, periodStart);

    const totalViews = currentPeriodLogs.filter(l => l.type === 'view').length;
    const totalClicks = currentPeriodLogs.filter(l => l.type === 'click').length;
    const totalShares = currentPeriodLogs.filter(l => l.type === 'share').length;
    
    const prevViews = prevPeriodLogs.filter(l => l.type === 'view').length;
    const growthRate = (prevViews > 0) ? (((totalViews - prevViews) / prevViews) * 100) : (totalViews > 0 ? 100 : 0);
    
    const ctr = (totalViews > 0) ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';
    const projectedNextMonth = totalViews * (1 + (growthRate / 100));

    // 3. TOP PERFORMING PRODUCTS
    const topProducts = targetProducts.map(p => {
      const pLogs = currentPeriodLogs.filter(l => l.text === `Product: ${p.name}`);
      const views = pLogs.filter(l => l.type === 'view').length;
      const clicks = pLogs.filter(l => l.type === 'click').length;
      const ctr = views > 0 ? (clicks / views) * 100 : 0;
      const categoryName = categories.find(c => c.id === p.categoryId)?.name || 'Uncategorized';
      return { ...p, views, clicks, ctr, categoryName };
    }).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    // 4. CATEGORY BREAKDOWN
    const catBreakdown = categories.map(cat => {
      const catProducts = targetProducts.filter(p => p.categoryId === cat.id);
      const catProductNames = new Set(catProducts.map(p => p.name));
      const catLogs = currentPeriodLogs.filter(l => {
        const logText = l.text || '';
        if (logText.startsWith('Product: ')) {
          return catProductNames.has(logText.replace('Product: ', '').trim());
        }
        return false;
      });
      const views = catLogs.filter(l => l.type === 'view').length;
      return { name: cat.name, views, percentage: totalViews > 0 ? (views / totalViews) * 100 : 0 };
    }).filter(c => c.views > 0).sort((a, b) => b.views - a.views);

    // 5. ELITE PERFORMANCE SCORE (0-100)
    const volScore = Math.min(100, (totalViews / 1000) * 100);
    const growthScore = Math.min(100, Math.max(0, growthRate + 50)); 
    const ctrScore = Math.min(100, (parseFloat(ctr) / 5) * 100); 
    const performanceScore = Math.round((volScore * 0.3) + (growthScore * 0.3) + (ctrScore * 0.4));

    const staffPerformance = admins.map(admin => {
      const adminProducts = products.filter(p => p.createdBy === admin.id);
      const adminProductNames = new Set(adminProducts.map(p => p.name));
      const adminLogs = trafficEvents.filter(e => {
        if (e.timestamp < periodStart) return false;
        const logText = e.text || '';
        if (logText.startsWith('Product: ')) {
          return adminProductNames.has(logText.replace('Product: ', '').trim());
        }
        return false;
      });
      const views = adminLogs.filter(l => l.type === 'view').length;
      const clicks = adminLogs.filter(l => l.type === 'click').length;
      return { name: admin.name, views, clicks, productCount: adminProducts.length };
    }).sort((a, b) => b.clicks - a.clicks);

    const curatorName = (curatorId === 'all') 
      ? 'Entire Maison' 
      : (admins.find(a => a.id === curatorId)?.name || 'Private Curator');

    return { 
      totalViews, totalClicks, totalShares, ctr, growthRate, projectedNextMonth, staffPerformance, 
      curatorName, timeframeLabel: timeframe.toUpperCase(),
      topProducts, catBreakdown, performanceScore
    };
  }, [trafficEvents, products, admins, curatorId, timeframeMs, timeframe]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-500 overflow-y-auto print:p-0 print:bg-white">
      {isGenerating ? (
        <div className="flex flex-col items-center gap-6">
           <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <FilePieChart size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
           </div>
           <div className="text-center">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-1">Synthesizing Elite Analytics</h3>
              <p className="text-slate-500 text-sm animate-pulse">Processing high-fidelity data nodes...</p>
           </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-[90vh] max-h-[95vh] print:rounded-none print:shadow-none print:min-h-0 print:m-0">
           {/* Header Controls */}
           <div className="p-6 bg-slate-900 flex flex-col md:flex-row justify-between items-center text-white flex-shrink-0 print:hidden gap-4">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="text-primary" size={24} />
                 <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest">Executive Curation Report</h3>
                    <p className="text-[10px] text-slate-400">Target: {reportData.curatorName} • Cycle: {reportData.timeframeLabel}</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4">
                 {/* TIMEFRAME SELECTOR */}
                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {(['7d', '14d', '30d', '1y', '2y', '3y'] as const).map((t) => (
                      <button 
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${timeframe === t ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>

                 <div className="h-8 w-px bg-white/10 hidden md:block"></div>

                 <div className="flex gap-3">
                    <button onClick={handlePrint} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Printer size={16}/> Print</button>
                    <button onClick={onClose} className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"><X size={20}/></button>
                 </div>
              </div>
           </div>

           {/* PDF Body Container */}
           <div className="flex-grow overflow-y-auto custom-scrollbar p-12 md:p-20 text-slate-900 text-left print:p-8 print:overflow-visible">
              {/* Branding Section */}
              <div className="flex justify-between items-start mb-20 border-b-2 border-slate-100 pb-12">
                 <div>
                    {settings.companyLogoUrl && <img src={settings.companyLogoUrl} className="h-20 w-auto mb-6 grayscale" alt="Logo" />}
                    <h1 className="text-4xl font-serif font-black tracking-tighter uppercase">{settings.companyName}</h1>
                    <p className="text-slate-500 uppercase tracking-[0.4em] font-black text-[10px] mt-1">{settings.slogan}</p>
                 </div>
                 <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="text-right">
                          <span className="text-[8px] font-black uppercase text-slate-400 block tracking-widest">Elite Score</span>
                          <span className="text-3xl font-bold text-primary">{reportData.performanceScore}/100</span>
                       </div>
                       <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
                          <svg className="w-full h-full -rotate-90">
                             <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                             <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${(reportData.performanceScore / 100) * 176} 176`} className="text-primary" />
                          </svg>
                          <Crown size={20} className="absolute text-primary" />
                       </div>
                    </div>
                    <span className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 mb-4 inline-block">Period: {reportData.timeframeLabel}</span>
                    <h2 className="text-4xl font-serif italic text-slate-300">Elite Performance</h2>
                    <p className="text-slate-400 text-sm mt-2">FY {new Date().getFullYear()} • Contextual Snapshot</p>
                    <p className="text-slate-900 font-bold mt-4 uppercase tracking-widest text-xs">Curator: {reportData.curatorName}</p>
                 </div>
              </div>

              {/* Core Vitality Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                 {[
                   { label: 'Segment Impressions', val: reportData.totalViews.toLocaleString(), icon: Eye, color: 'text-slate-900' },
                   { label: 'Direct Conversions', val: reportData.totalClicks.toLocaleString(), icon: MousePointerClick, color: 'text-primary' },
                   { label: 'Conversion Delta (CTR)', val: `${reportData.ctr}%`, icon: ZapIcon, color: 'text-slate-900' },
                   { label: 'Viral Circulation', val: reportData.totalShares.toLocaleString(), icon: Share2, color: 'text-slate-900' }
                 ].map((m, i) => (
                   <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-between h-44">
                      <m.icon size={24} className={`${m.color} opacity-80`} />
                      <div>
                         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">{m.label}</span>
                         <span className={`text-2xl md:text-3xl font-bold tracking-tight ${m.color}`}>{m.val}</span>
                      </div>
                   </div>
                 ))}
              </div>

              {/* Engagement Dynamics (Graph) */}
              <div className="grid grid-cols-12 gap-16 mb-20">
                 <div className="col-span-12 lg:col-span-7">
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
                       <BarChart3 size={20} className="text-primary"/> Engagement Intensity ({reportData.timeframeLabel})
                    </h3>
                    <div className="h-64 w-full flex items-end gap-3 px-4 border-b border-l border-slate-200 pb-2">
                       {[40, 65, 30, 85, 45, 95, 70, 55, 80, 60, 40, 75].map((h, i) => (
                          <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group transition-all hover:bg-primary/20">
                             <div className="absolute inset-x-0 bottom-0 bg-slate-900 rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[8px] font-bold bg-slate-900 text-white px-2 py-1 rounded">
                                Rel Vol: {h}%
                             </div>
                          </div>
                       ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[9px] font-black uppercase text-slate-400 tracking-widest px-4">
                       <span>Period Start</span>
                       <span>Period End</span>
                    </div>
                 </div>

                 {/* Predictive Analytics */}
                 <div className="col-span-12 lg:col-span-5 bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <Presentation className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 rotate-12" />
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-8 text-primary">Forward Guidance</h3>
                    <div className="space-y-8">
                       <div className="flex justify-between items-center pb-6 border-b border-white/10">
                          <div>
                             <span className="text-[10px] text-slate-400 uppercase font-black block mb-1">Growth Trajectory</span>
                             <div className="flex items-center gap-2">
                                { (reportData.growthRate >= 0) ? <TrendingUp size={24} className="text-green-500"/> : <TrendingDown size={24} className="text-red-500"/> }
                                <span className="text-3xl font-bold">{ Math.abs(reportData.growthRate).toFixed(1) }%</span>
                             </div>
                          </div>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${reportData.growthRate >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                             {reportData.growthRate >= 0 ? 'EXPANDING' : 'RECEDING'}
                          </span>
                       </div>

                       <div className="space-y-4">
                          <span className="text-[10px] text-slate-400 uppercase font-black block">Forecast (Next Cycle)</span>
                          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                             <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold">Estimated Engagement</span>
                                <span className="text-xs font-bold text-primary">{ Math.round(reportData.projectedNextMonth).toLocaleString() }</span>
                             </div>
                             <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary animate-[grow_2s_ease-out]" style={{ width: '85%' }}></div>
                             </div>
                             <p className="text-[8px] text-slate-500 mt-3 italic">* Calculation based on current period delta.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

               {/* Top Products & Category Breakdown */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                  <div>
                     <h3 className="text-xl font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
                        <Award size={20} className="text-primary"/> Top Performing Assets
                     </h3>
                     <div className="space-y-4">
                        {reportData.topProducts.map((p, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                                    0{i+1}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-sm truncate max-w-[180px]">{p.name}</h4>
                                    <p className="text-[10px] text-slate-400 uppercase font-black">{p.categoryName}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <span className="text-sm font-bold block">{p.clicks} Clicks</span>
                                 <span className="text-[9px] font-black text-primary uppercase tracking-widest">{p.ctr.toFixed(1)}% CTR</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h3 className="text-xl font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
                        <Layers size={20} className="text-primary"/> Category Distribution
                     </h3>
                     <div className="space-y-6">
                        {reportData.catBreakdown.map((cat, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                 <span className="text-slate-600">{cat.name}</span>
                                 <span className="text-slate-400">{cat.percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-slate-900 rounded-full transition-all duration-1000" 
                                    style={{ width: `${cat.percentage}%` }}
                                 ></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

              {/* Staff / Curator Performance (Only if global) */}
              { curatorId === 'all' && (
                 <div className="mb-20">
                    <h3 className="text-xl font-bold uppercase tracking-widest mb-10 flex items-center gap-3">
                       <Users size={20} className="text-primary"/> Relative Performance Matrix
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {reportData.staffPerformance.map((staff, idx) => (
                          <div key={idx} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-8">
                             <div className="w-20 h-20 bg-white rounded-[1.5rem] border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 shadow-sm uppercase">
                                {staff.name.charAt(0)}
                             </div>
                             <div className="flex-grow">
                                <div className="flex justify-between items-center mb-4">
                                   <h4 className="font-bold text-lg">{staff.name}</h4>
                                   <span className="text-[9px] font-black uppercase text-primary tracking-widest">{staff.productCount} Items</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Traffic</span>
                                      <span className="text-base font-bold">{staff.views.toLocaleString()}</span>
                                   </div>
                                   <div>
                                      <span className="text-[8px] font-black uppercase text-slate-400 block">Conv.</span>
                                      <span className="text-base font-bold">{staff.clicks.toLocaleString()}</span>
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* Footer Stamp */}
              <div className="pt-12 border-t border-slate-100 flex justify-between items-center opacity-40">
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    © {new Date().getFullYear()} Findara Elite Analytics System • Dynamic Report Module
                 </div>
                 <div className="flex items-center gap-4">
                    <img src="https://i.ibb.co/ZR8bZRSp/JSTYP-me-Logo.png" className="h-6 w-auto grayscale" alt="JSTYP" />
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-400">AUTHENTICATED SNAPSHOT</span>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

type TabId = 'enquiries' | 'catalog' | 'hero' | 'categories' | 'site_editor' | 'team' | 'analytics' | 'system' | 'guide' | 'training' | 'seo' | 'orders' | 'clients' | 'media' | 'reviews';

const Admin: React.FC = () => {
  const { 
    settings, updateSettings, user, saveStatus, setSaveStatus,
    products, categories, subCategories, heroSlides, enquiries, admins, stats,
    orders, clients,
    updateData, deleteData, refreshAllData, logout, connectionHealth, systemLogs, storageStats, trainingModules
  } = useSettings();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('enquiries');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [editorDrawerOpen, setEditorDrawerOpen] = useState(false);
  const [activeEditorSection, setActiveEditorSection] = useState<'brand' | 'nav' | 'home' | 'collections' | 'about' | 'contact' | 'legal' | 'integrations' | 'login' | null>(null);
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
  const [productData, setProductData] = useState<Partial<Product>>({});
  const [catData, setCatData] = useState<Partial<Category>>({});
  const [heroData, setHeroData] = useState<Partial<CarouselSlide>>({});
  const [tempSubCatName, setTempSubCatName] = useState('');
  const [tempDiscountRule, setTempDiscountRule] = useState<Partial<DiscountRule>>({ type: 'percentage', value: 0, description: '' });
  const [tempFeature, setTempFeature] = useState('');
  const [tempTag, setTempTag] = useState('');
  const [tempSpec, setTempSpec] = useState({ key: '', value: '' });
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled'>('all');
  const [clientSearch, setClientSearch] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState<Partial<Order>>({ items: [], status: 'Pending', totalAmount: 0 });
  const [tempOrderItem, setTempOrderItem] = useState<Partial<OrderItem>>({ quantity: 1, price: 0 });
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientData, setClientData] = useState<Partial<AppUser>>({});
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [curatorFilter, setCuratorFilter] = useState<string>('all'); 
  const [showEliteReport, setShowEliteReport] = useState(false);

  // Manual Purge State
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');
  const [isPurging, setIsPurging] = useState(false);

  const [catalogView, setCatalogView] = useState<'active' | 'history'>('active');
  const [historyProducts, setHistoryProducts] = useState<ProductHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Phase Overhaul: Training Management
  const [isTrainingManagementMode, setIsTrainingManagementMode] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingData, setTrainingData] = useState<Partial<TrainingModule>>({ strategies: [], actionItems: [], steps: [] });
  const [isLoadingTraining, setIsLoadingTraining] = useState(false);
  const [tempTrainingStrat, setTempTrainingStrat] = useState('');
  const [tempTrainingAction, setTempTrainingAction] = useState('');

  const myAdminProfile = useMemo(() => admins.find(a => a.id === user?.id || a.email === user?.email), [admins, user]);
  const isOwner = (myAdminProfile?.role === 'owner') || (user?.email === 'admin@findara.com');
  const userId = user?.id;

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await fetchCurationHistory();
      if (data) setHistoryProducts(data as ProductHistory[]);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (catalogView === 'history') {
      loadHistory();
    }
  }, [catalogView]);

  const displayProducts = useMemo(() => {
    const baseSet = (catalogView === 'active') ? products : historyProducts;
    if (isOwner) {
      if (curatorFilter === 'all') return baseSet;
      return baseSet.filter(p => p.createdBy === curatorFilter);
    }
    return baseSet.filter(p => !p.createdBy || p.createdBy === userId);
  }, [products, historyProducts, catalogView, isOwner, userId, curatorFilter]);

  const displayCategories = useMemo(() => isOwner ? categories : categories.filter(c => !c.createdBy || c.createdBy === userId), [categories, isOwner, userId]);
  const displayHeroSlides = useMemo(() => isOwner ? heroSlides : heroSlides.filter(s => !s.createdBy || s.createdBy === userId), [heroSlides, isOwner, userId]);
  
  const displayStats = useMemo(() => {
    const targetProductIds = displayProducts.map(p => p.id);
    return stats.filter(s => targetProductIds.includes(s.productId));
  }, [stats, displayProducts]);

  const hasPermission = (tabId: TabId) => {
    if (isOwner) return true;
    if (!myAdminProfile) return false;
    const perms = myAdminProfile.permissions || [];
    
    switch (tabId) {
      case 'enquiries': return perms.includes('sales.view');
      case 'orders': return perms.includes('sales.view');
      case 'clients': return perms.includes('sales.view');
      case 'analytics': return perms.includes('analytics.view');
      case 'catalog': return perms.includes('catalog.products.view');
      case 'media': return perms.includes('content.hero');
      case 'reviews': return perms.includes('content.reviews');
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
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
    { id: 'catalog', label: 'Items', icon: ShoppingBag },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'hero', label: 'Visuals', icon: LayoutPanelTop },
    { id: 'categories', label: 'Depts', icon: Layout },
    { id: 'site_editor', label: 'Canvas', icon: Palette },
    { id: 'team', label: 'Maison', icon: Users },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'seo', label: 'SEO Settings', icon: Globe },
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

  const handleLogout = async () => { await logout(); };
  const handleFactoryReset = async () => { if (window.confirm("⚠️ DANGER: Factory Reset? This will wipe LOCAL data.")) { localStorage.clear(); window.location.reload(); } };
  const handleBackup = () => { const data = { products, categories, subCategories, heroSlides, enquiries, admins, settings, stats }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `backup.json`; a.click(); };
  
  const handleSaveProduct = async () => { 
    if (settings?.seoRequireAltText) {
      const missingAltText = productData.media?.some(m => !m.altText || m.altText.trim() === '');
      if (missingAltText) {
        alert('Please provide alt text for all product images (SEO requirement enabled).');
        return;
      }
    }
    const newProduct = { ...productData, id: editingId || Date.now().toString(), createdAt: productData.createdAt || Date.now(), createdBy: productData.createdBy || user?.id }; 
    const ok = await updateData('products', newProduct); 
    if (ok) { setShowProductForm(false); setEditingId(null); } 
  };
  const handleSaveCategory = async () => { const newCat = { ...catData, id: editingId || Date.now().toString(), createdBy: catData.createdBy || user?.id }; const ok = await updateData('categories', newCat); if (ok) { setShowCategoryForm(false); setEditingId(null); } };
  const handleSaveHero = async () => { const newSlide = { ...heroData, id: editingId || Date.now().toString(), createdBy: heroData.createdBy || user?.id }; const ok = await updateData('hero_slides', newSlide); if (ok) { setShowHeroForm(false); setEditingId(null); } };
  const handleSaveAdmin = async () => {
    if (!adminData.email) return;
    setCreatingAdmin(true);
    try {
      const action = editingId ? 'update' : 'create';
      const response = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          id: editingId,
          email: adminData.email,
          password: adminData.password,
          role: adminData.role || 'admin',
          fullName: adminData.name
        })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      // Also update the database record for metadata
      const newAdmin = { 
        ...adminData, 
        id: result.user?.id || editingId || Date.now().toString(), 
        createdAt: adminData.createdAt || Date.now() 
      };
      // Remove password before saving to public database table
      const { password, ...dbAdmin } = newAdmin as any;
      
      const ok = await updateData('admin_users', dbAdmin);
      if (!ok) throw new Error('Failed to update admin database record');
      
      setShowAdminForm(false);
      setEditingId(null);
      setAdminData({});
      refreshAllData();
    } catch (err: any) {
      alert(`Error saving member: ${err.message}`);
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDeleteUser = async (id: string, role: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${role}? This will permanently remove their login access and data.`)) return;
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      
      refreshAllData();
    } catch (err: any) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  const handleSaveTraining = async () => {
     setSaveStatus('saving');
     const moduleToSave = {
        ...trainingData,
        id: editingId || Date.now().toString(),
        createdAt: trainingData.createdAt || Date.now(),
        createdBy: trainingData.createdBy || user?.id
     };
     try {
       const ok = await updateData('training_modules', moduleToSave);
       if (ok) {
          setShowTrainingForm(false);
          setEditingId(null);
       }
     } catch (e) {
       setSaveStatus('error');
     }
  };

  const handleManualPurge = async () => {
    if (purgeConfirmText !== 'PURGE') return;
    setIsPurging(true);
    setSaveStatus('saving');
    
    try {
      const ownerId = 'owner';
      const nonOwnerProducts = products.filter(p => p.createdBy && p.createdBy !== ownerId);
      
      if (nonOwnerProducts.length > 0) {
        for (const product of nonOwnerProducts) {
          const archivedItem = { ...product, archivedAt: Date.now() };
          await moveRecord('products', 'product_history', archivedItem);
        }
        await refreshAllData();
        alert(`Successfully archived ${nonOwnerProducts.length} curator items.`);
      } else {
        alert("No non-owner products found to archive.");
      }
    } catch (err) {
      console.error("Purge failed", err);
      setSaveStatus('error');
    } finally {
      setIsPurging(false);
      setShowPurgeModal(false);
      setPurgeConfirmText('');
    }
  };

  const toggleEnquiryStatus = async (enquiry: Enquiry) => { const updated = { ...enquiry, status: enquiry.status === 'read' ? 'unread' : 'read' }; await updateData('enquiries', updated); };
  const handleAddSubCategory = async (categoryId: string) => { if (!tempSubCatName.trim()) return; const newSub: SubCategory = { id: Date.now().toString(), categoryId, name: tempSubCatName, createdBy: user?.id }; await updateData('subcategories', newSub); setTempSubCatName(''); };
  const handleDeleteSubCategory = async (id: string) => await deleteData('subcategories', id);

  const handleAddDiscountRule = () => { if (!tempDiscountRule.value || !tempDiscountRule.description) return; const newRule: DiscountRule = { id: Date.now().toString(), type: tempDiscountRule.type || 'percentage', value: Number(tempDiscountRule.value), description: tempDiscountRule.description }; setProductData({ ...productData, discountRules: [...(productData.discountRules || []), newRule] }); setTempDiscountRule({ type: 'percentage', value: 0, description: '' }); };
  const handleRemoveDiscountRule = (id: string) => { setProductData({ ...productData, discountRules: (productData.discountRules || []).filter(r => r.id !== id) }); };
  const handleAddFeature = () => { if (!tempFeature.trim()) return; setProductData(prev => ({ ...prev, features: [...(prev.features || []), tempFeature] })); setTempFeature(''); };
  const handleRemoveFeature = (index: number) => { setProductData(prev => { const feats = (prev.features || []).filter((_, i) => i !== index); return { ...prev, features: feats }; }); };
  
  const handleAddTag = () => {
    if (!tempTag.trim()) return;
    const tag = tempTag.trim().toLowerCase();
    if (!(productData.tags || []).includes(tag)) {
      setProductData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
    }
    setTempTag('');
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setProductData(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tagToRemove) }));
  };

  const handleAddSpec = () => { if (!tempSpec.key.trim() || !tempSpec.value.trim()) return; setProductData(prev => ({ ...prev, specifications: { ...(prev.specifications || {}), [tempSpec.key]: tempSpec.value } })); setTempSpec({ key: '', value: '' }); };
  const handleRemoveSpec = (key: string) => { setProductData(prev => { const newSpecs = { ...(prev.specifications || {}) }; delete newSpecs[key]; return { ...prev, specifications: newSpecs }; }); };

  const handleOpenEditor = (section: any) => { setTempSettings({...settings}); setActiveEditorSection(section); setEditorDrawerOpen(true); };
  const updateTempSettings = (newSettings: Partial<SiteSettings>) => setTempSettings(prev => ({ ...prev, ...newSettings }));
  const exportEnquiries = () => { 
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
    const csvContent = "data:text/csv;charset=utf-8," + "Name,Email,Subject,Message,Date\n" + 
      enquiries.map(e => `${escapeCsv(e.name)},${escapeCsv(e.email)},${escapeCsv(e.subject)},${escapeCsv(e.message)},${escapeCsv(new Date(e.createdAt).toLocaleDateString())}`).join("\n"); 
    const encodedUri = encodeURI(csvContent); 
    const link = document.createElement("a"); 
    link.setAttribute("href", encodedUri); 
    link.setAttribute("download", "enquiries_export.csv"); 
    document.body.appendChild(link); 
    link.click(); 
  };
  const filteredEnquiries = enquiries.filter(e => { const matchesSearch = e.name.toLowerCase().includes(enquirySearch.toLowerCase()) || e.email.toLowerCase().includes(enquirySearch.toLowerCase()) || e.message.toLowerCase().includes(enquirySearch.toLowerCase()); const matchesStatus = enquiryFilter === 'all' || e.status === enquiryFilter; return matchesSearch && matchesStatus; });
  const filteredOrders = orders.filter(o => { const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || (clients.find(c => c.id === o.clientId)?.name || '').toLowerCase().includes(orderSearch.toLowerCase()); const matchesStatus = orderFilter === 'all' || o.status === orderFilter; return matchesSearch && matchesStatus; });
  const filteredClients = clients.filter(c => c.name?.toLowerCase().includes(clientSearch.toLowerCase()) || c.email.toLowerCase().includes(clientSearch.toLowerCase()));

  const handleSaveOrder = async () => {
    if (!orderData.clientId || !orderData.items?.length) return;
    
    let nextOrderNumber = orderData.orderNumber;
    if (!nextOrderNumber) {
      // Generate sequential order number starting from 0001
      const lastOrder = [...orders].sort((a, b) => (parseInt(b.orderNumber) || 0) - (parseInt(a.orderNumber) || 0))[0];
      const lastNum = lastOrder ? parseInt(lastOrder.orderNumber) : 0;
      nextOrderNumber = (lastNum + 1).toString().padStart(4, '0');
    }

    const newOrder: Order = {
      id: orderData.id || crypto.randomUUID(),
      orderNumber: nextOrderNumber,
      clientId: orderData.clientId,
      status: orderData.status as any,
      items: orderData.items,
      totalAmount: orderData.items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0),
      shippingAddress: orderData.shippingAddress,
      trackingNumber: orderData.trackingNumber,
      notes: orderData.notes,
      createdAt: orderData.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    await updateData('orders', newOrder);
    setShowOrderForm(false);
    setOrderData({ items: [], status: 'Pending', totalAmount: 0 });
  };

  const handleSaveClient = async () => {
    if (!clientData.email) return;
    try {
      const action = clientData.id ? 'update' : 'create';
      const response = await fetch('/api/admin/manage-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          id: clientData.id,
          email: clientData.email,
          password: clientData.password,
          role: 'client',
          fullName: clientData.name
        })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const data = { 
        ...clientData,
        id: result.user?.id || clientData.id || `client-${Date.now()}`,
        createdAt: clientData.createdAt || Date.now()
      };
      // Remove password before saving to public database table
      const { password, ...dbClient } = data as any;

      await updateData('clients', dbClient);
      setShowClientForm(false);
      setClientData({});
      refreshAllData();
    } catch (err: any) {
      alert(`Error saving client: ${err.message}`);
    }
  };

  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Orders</h2><p className="text-slate-400 text-sm">Manage client orders.</p></div>
         <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => { setOrderData({ items: [], status: 'Pending', totalAmount: 0 }); setShowOrderForm(true); }} className="flex-1 md:flex-none justify-center px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><Plus size={16}/> New Order</button>
         </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search order ID or client name..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" /></div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar">{['all', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(filter => (<button key={filter} onClick={() => setOrderFilter(filter as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${orderFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}>{filter}</button>))}</div>
      </div>
      
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xl font-serif text-white">{orderData.id ? 'Edit Order' : 'New Order'}</h3>
              <button onClick={() => setShowOrderForm(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Client</label>
                  <select value={orderData.clientId || ''} onChange={e => setOrderData({...orderData, clientId: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary">
                    <option value="">Select a client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name || c.email}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Status</label>
                  <select value={orderData.status || 'Pending'} onChange={e => setOrderData({...orderData, status: e.target.value as any})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary">
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Shipping Address</label>
                  <textarea value={orderData.shippingAddress || ''} onChange={e => setOrderData({...orderData, shippingAddress: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary min-h-[80px]" placeholder="Enter full shipping address..." />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Tracking Number</label>
                  <input type="text" value={orderData.trackingNumber || ''} onChange={e => setOrderData({...orderData, trackingNumber: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary" placeholder="e.g. 1Z9999999999999999" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Internal Notes</label>
                  <input type="text" value={orderData.notes || ''} onChange={e => setOrderData({...orderData, notes: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary" placeholder="Private notes for admins..." />
                </div>
              </div>
                
              <div className="pt-6 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-4">Order Items</h4>
                <div className="space-y-4 mb-4">
                  {orderData.items?.map((item: OrderItem, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.quantity} x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                      <button onClick={() => setOrderData({...orderData, items: orderData.items?.filter((_: any, i: number) => i !== idx)})} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                    </div>
                  ))}
                  {(!orderData.items || orderData.items.length === 0) && (
                    <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 border-dashed text-slate-500 text-sm">
                      No items added to this order yet.
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row items-end gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex-grow w-full space-y-2">
                    <input type="text" placeholder="Product Name" value={tempOrderItem.name || ''} onChange={e => setTempOrderItem({...tempOrderItem, name: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm" />
                    <div className="flex gap-2">
                      <input type="number" placeholder="Qty" value={tempOrderItem.quantity || 1} onChange={e => setTempOrderItem({...tempOrderItem, quantity: parseInt(e.target.value) || 1})} className="w-24 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm" />
                      <input type="number" placeholder="Price ($)" value={tempOrderItem.price || 0} onChange={e => setTempOrderItem({...tempOrderItem, price: parseFloat(e.target.value) || 0})} className="flex-grow px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm" />
                    </div>
                  </div>
                  <button onClick={() => {
                    if (tempOrderItem.name && tempOrderItem.price !== undefined) {
                      setOrderData({...orderData, items: [...(orderData.items || []), { ...tempOrderItem, productId: crypto.randomUUID(), sku: 'MANUAL' } as OrderItem]});
                      setTempOrderItem({ quantity: 1, price: 0 });
                    }
                  }} className="w-full md:w-auto px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 h-[88px] flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest"><Plus size={16}/> Add Item</button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-between items-center sticky bottom-0 bg-slate-900">
              <div className="text-white font-medium">
                Total: <span className="text-primary">${(orderData.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowOrderForm(false)} className="px-6 py-3 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest">Cancel</button>
                <button onClick={handleSaveOrder} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">Save Order</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(status => {
          const statusOrders = filteredOrders.filter(o => o.status === status);
          if (statusOrders.length === 0 && orderFilter !== 'all') return null;
          if (statusOrders.length === 0 && orderFilter === 'all') return null;

          return (
            <div key={status} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">{status}</h3>
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold">{statusOrders.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {statusOrders.map(order => {
                  const client = clients.find(c => c.id === order.clientId);
                  return (
                    <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-slate-700 transition-colors">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-primary font-mono text-xs font-bold">#{order.orderNumber || order.id.substring(0, 8)}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${order.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' : order.status === 'Shipped' ? 'bg-indigo-500/10 text-indigo-500' : order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{order.status}</span>
                          <span className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Client</p>
                            <p className="text-white font-medium text-sm">{client?.name || 'Unknown Client'}</p>
                            <p className="text-slate-400 text-xs">{client?.email}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Details</p>
                            <p className="text-slate-300 text-sm">{order.items.length} items</p>
                            <p className="text-white font-medium text-sm">${order.totalAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Shipping</p>
                            <p className="text-slate-300 text-xs truncate">{order.trackingNumber ? `Tracking: ${order.trackingNumber}` : 'No tracking'}</p>
                            <p className="text-slate-400 text-xs truncate">{order.shippingAddress || 'No address provided'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto justify-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                        <button onClick={() => { setOrderData(order); setShowOrderForm(true); }} className="p-3 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors"><Edit2 size={18}/></button>
                        <button onClick={() => deleteData('orders', order.id)} className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filteredOrders.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500">No orders found.</div>
        )}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Clients</h2><p className="text-slate-400 text-sm">View and manage registered clients.</p></div>
         <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => { setClientData({ name: '', email: '', phone: '', address: '', company: '', status: 'Active' }); setShowClientForm(true); }} className="flex-1 md:flex-none justify-center px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><Plus size={16}/> New Client</button>
         </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search name or email..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" /></div>
      </div>
      
      {showClientForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10">
              <h3 className="text-xl font-serif text-white">{clientData.id ? 'Edit Client Details' : 'New Client Registration'}</h3>
              <button onClick={() => setShowClientForm(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Full Name</label>
                  <input type="text" value={clientData.name || ''} onChange={e => setClientData({...clientData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary" placeholder="Client Name" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Email Address</label>
                  <input type="email" value={clientData.email || ''} onChange={e => setClientData({...clientData, email: e.target.value})} disabled={!!clientData.id} className={`w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl outline-none focus:border-primary ${clientData.id ? 'text-slate-500 cursor-not-allowed' : 'text-white'}`} placeholder="client@example.com" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Password</label>
                  <input type="password" value={clientData.password || ''} onChange={e => setClientData({...clientData, password: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Phone Number</label>
                  <input type="tel" value={clientData.phone || ''} onChange={e => setClientData({...clientData, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Company / Organization</label>
                  <input type="text" value={(clientData as any).company || ''} onChange={e => setClientData({...clientData, company: e.target.value} as any)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Status</label>
                  <select value={(clientData as any).status || 'Active'} onChange={e => setClientData({...clientData, status: e.target.value} as any)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary appearance-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="VIP">VIP</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Shipping Address</label>
                  <textarea value={clientData.address || ''} onChange={e => setClientData({...clientData, address: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary min-h-[80px]" placeholder="Enter full shipping address..." />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Internal Notes</label>
                  <textarea value={(clientData as any).notes || ''} onChange={e => setClientData({...clientData, notes: e.target.value} as any)} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-primary min-h-[80px]" placeholder="Private notes about this client..." />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-slate-900">
              <button onClick={() => setShowClientForm(false)} className="px-6 py-3 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest">Cancel</button>
              <button onClick={handleSaveClient} className="px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">Save Details</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500">No clients found.</div>
        ) : (
          filteredClients.map(client => {
            const clientOrders = orders.filter(o => o.clientId === client.id);
            const totalSpent = clientOrders.reduce((sum, o) => sum + o.totalAmount, 0);
            const lastOrder = clientOrders.sort((a, b) => b.createdAt - a.createdAt)[0];
            
            return (
              <div key={client.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-colors relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button onClick={() => { setClientData(client); setShowClientForm(true); }} className="p-2 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><Edit2 size={16}/></button>
                  <button onClick={() => handleDeleteUser(client.id, 'client')} className="p-2 bg-slate-800 text-slate-300 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16}/></button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-primary font-serif text-2xl shadow-inner">
                    {client.name?.charAt(0) || client.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{client.name || 'No Name'}</h3>
                    <p className="text-slate-400 text-xs truncate">{client.email}</p>
                    {client.phone && <p className="text-slate-500 text-xs truncate mt-0.5">{client.phone}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Orders</p>
                    <p className="text-white font-medium">{clientOrders.length}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Spent</p>
                    <p className="text-primary font-medium">${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-800/50 flex flex-col gap-2 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Joined</span>
                    <span className="text-xs text-slate-300">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Last Order</span>
                    <span className="text-xs text-slate-300">{lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderEnquiries = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Inbox</h2><p className="text-slate-400 text-sm">Manage incoming client communications.</p></div>
         <div className="flex gap-3 w-full md:w-auto">
            <button onClick={exportEnquiries} className="flex-1 md:flex-none justify-center px-6 py-3 bg-primary text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"><FileSpreadsheet size={16}/> Export CSV</button>
         </div>
      </div>
      <AdminTip title="Communication Hub">This is your central command for client interactions. All inquiries from your contact form are routed here. Use the reply button to open your device's email client, or archive messages to keep your inbox clean.</AdminTip>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
         <div className="relative flex-grow"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search sender, email, or subject..." value={enquirySearch} onChange={e => setEnquirySearch(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" /></div>
         <div className="flex gap-2 overflow-x-auto no-scrollbar">{['all', 'unread', 'read'].map(filter => (<button key={filter} onClick={() => setEnquiryFilter(filter as any)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${enquiryFilter === filter ? 'bg-primary text-slate-900' : 'bg-slate-900 text-slate-500 hover:text-white border border-slate-800'}`}>{filter}</button>))}</div>
      </div>
      { (filteredEnquiries.length === 0) ? <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] md:rounded-[3rem] border border-dashed border-slate-800 text-slate-500">No enquiries found.</div> : 
        filteredEnquiries.map(e => (
          <div key={e.id} className={`bg-slate-900 border transition-all rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 flex flex-col md:flex-row gap-6 text-left ${ (e.status === 'unread') ? 'border-primary/30 shadow-[0_10px_30px_-10px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800' }`}>
            <div className="flex-grow space-y-2 min-w-0"><div className="flex items-center gap-3"><h4 className="text-white font-bold truncate">{e.name}</h4><span className="text-[9px] font-black text-slate-500 uppercase flex-shrink-0">{new Date(e.createdAt).toLocaleDateString()}</span></div><p className="text-primary text-sm font-bold truncate">{e.email}</p><div className="p-4 bg-slate-800/50 rounded-2xl text-slate-400 text-sm italic leading-relaxed break-words">"{e.message}"</div></div>
            <div className="flex gap-2 items-start w-full md:w-auto flex-shrink-0 min-w-0">
              <button 
                onClick={() => {
                  const subject = encodeURIComponent(`Re: ${e.subject}`);
                  const body = encodeURIComponent(`Dear ${e.name},\n\nRegarding your enquiry: "${e.message}"\n\n`);
                  window.location.href = `mailto:${e.email}?subject=${subject}&body=${body}`;
                }} 
                className="flex-1 md:flex-none p-4 bg-primary/20 text-primary rounded-2xl hover:bg-primary hover:text-slate-900 transition-colors" 
                title="Reply via Email Client"
              >
                <Reply size={20}/>
              </button>
              <button onClick={() => toggleEnquiryStatus(e)} className={`flex-1 md:flex-none p-4 rounded-2xl transition-colors ${ (e.status === 'read') ? 'bg-slate-800 text-slate-500' : 'bg-green-500/20 text-green-500' }`} title={ (e.status === 'read') ? 'Mark Unread' : 'Mark Read' }><CheckCircle size={20}/></button>
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
    
    const sortedProducts = [...products].map(p => {
      const pStats = stats.find(s => s.productId === p.id) || { productId: p.id, views: 0, clicks: 0, totalViewTime: 0, shares: 0 };
      const reviewCount = p.reviews?.length || 0;
      return { ...p, ...pStats, reviewCount, ctr: (pStats.views > 0) ? ((pStats.clicks / pStats.views) * 100).toFixed(1) : 0 };
    }).sort((a, b) => ( (b.views + b.clicks) - (a.views + a.clicks) ));

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
        ctr: (views > 0) ? ((clicks / views) * 100).toFixed(1) : 0
      };
    }).sort((a, b) => (b.views - a.views));
    
    const totalViews = stats.reduce((acc, s) => acc + s.views, 0);
    const totalClicks = stats.reduce((acc, s) => acc + s.clicks, 0);
    const totalShares = stats.reduce((acc, s) => acc + (s.shares || 0), 0);
    const totalSessionTime = stats.reduce((acc, s) => acc + (s.totalViewTime || 0), 0);
    const avgSessionTime = (totalViews > 0) ? (totalSessionTime / totalViews).toFixed(1) : 0;

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
        .sort(([, a]: any, [, b]: any) => (b - a))
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
           
           <div className="flex flex-col md:flex-row gap-8 items-center">
              { isOwner && (
                <div className="relative min-w-[220px]">
                   <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest block mb-2 px-1">Curator Context</label>
                   <select 
                      value={curatorFilter} 
                      onChange={e => setCuratorFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-primary text-xs transition-all appearance-none cursor-pointer"
                   >
                      <option value="all">Entire Maison (All)</option>
                      {admins.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 bottom-3 text-slate-500 pointer-events-none" size={14} />
                </div>
              )}
              
              <button 
                onClick={() => setShowEliteReport(true)}
                className="px-8 py-4 bg-primary text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center gap-3 animate-pulse group"
              >
                <FilePieChart size={18} className="group-hover:rotate-12 transition-transform" />
                Generate Elite Performance Report
              </button>
              <div className="flex gap-12 text-right">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Footprint</span>
                  <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{totalViews.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Conversions</span>
                  <span className="text-4xl md:text-5xl font-bold text-primary tracking-tighter">{totalClicks.toLocaleString()}</span>
                </div>
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
                      className={`w-full ${ (i === peakHour) ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : 'bg-slate-800 group-hover/bar:bg-slate-600' } transition-all duration-500 rounded-t-sm`} 
                      style={{ height: `${ (count / maxHourly) * 100 }%` }}
                    ></div>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none shadow-xl z-20 whitespace-nowrap">
                      {count} Hits @ {i}:00
                    </div>
                    <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold ${ (i % 3 === 0) ? 'text-slate-500' : 'text-transparent' }`}>
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
             { label: 'Click Through Rate', value: `${ (totalViews > 0) ? ((totalClicks / totalViews) * 100).toFixed(1) : 0 }%`, icon: MousePointerClick, color: 'text-primary' },
             { label: 'Social Shares', value: totalShares, icon: Share2, color: 'text-blue-400' },
             { label: 'Avg Session Time', value: `${avgSessionTime}s`, icon: Timer, color: 'text-green-400' },
             { label: 'Verified Reviews', value: products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0), icon: Star, color: 'text-yellow-500' }
           ].map((m, i) => {
             const IconComp = m.icon;
             return (
               <div key={i} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 hover:border-primary/50 transition-colors flex flex-col justify-between h-48 shadow-lg group">
                  <div className="flex justify-between items-start">
                     <div className={`w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center ${m.color} group-hover:scale-110 transition-transform`}><IconComp size={24}/></div>
                     <IconComp size={48} className={`${m.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  </div>
                  <div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{m.label}</span><span className="text-3xl font-bold text-white">{m.value}</span></div>
               </div>
             );
           })}
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 md:p-10 shadow-xl">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h3 className="text-white font-bold text-xl flex items-center gap-3">
              <TrendingUp size={24} className="text-primary"/> Top Performing Products ({ (curatorFilter === 'all') ? 'Maison wide' : admins.find(a => a.id === curatorFilter)?.name })
            </h3>
            <button onClick={() => {
               const csv = "Rank,Product,Category,Views,Clicks,CTR,Shares\n" +
                 topProducts.map((p, i) => `${i + 1},"${p.name}",${ categories.find(c => c.id === p.categoryId)?.name || 'N/A' },${p.views},${p.clicks},${p.ctr}%,${p.shares}`).join("\n");
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
                           { categories.find(c => c.id === p.categoryId)?.name || 'N/A' }
                        </span>
                     </td>
                     <td className="py-4 text-right font-mono text-white">{p.views.toLocaleString()}</td>
                     <td className="py-4 text-right font-mono text-primary">{p.clicks.toLocaleString()}</td>
                     <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <span className="font-bold text-white">{p.ctr}%</span>
                           <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${ Math.min(parseFloat(p.ctr as string), 100) }%` }}></div>
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
               return (
                 <div key={i} className="bg-slate-900 rounded-[2.5rem] border border-slate-800 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/40 transition-all shadow-xl">
                   <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-primary shrink-0 shadow-inner group-hover:scale-110 transition-transform border border-slate-700">
                      <IconRenderer icon={cat.icon} size={40} />
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
                         <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${ (totalViews > 0) ? (cat.views / totalViews) * 100 : 0 }%` }}></div>
                      </div>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
        
        <div className="mt-8">
            <TrafficAreaChart />
        </div>

        <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-800 shadow-xl mt-8">
             <h3 className="text-white font-bold mb-12 flex items-center gap-3 text-xl"><Globe size={24} className="text-primary"/> Traffic Sources (Live & Historical)</h3>
             <div className="space-y-8">
                 {sortedSources.map((s, i) => {
                    const SIcon = s.icon;
                    return (
                      <div key={i} className="flex items-center gap-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 border shadow-xl ${s.bg} ${s.border}`}><SIcon size={24} className="text-white"/></div>
                         <div className="flex-grow">
                            <div className="flex justify-between mb-3">
                               <span className="text-base text-white font-bold">{s.label}</span>
                               <span className="text-xs text-slate-400 font-mono">{s.count} hits ({ (totalSources > 0) ? Math.round((s.count / totalSources) * 100) : 0 }%)</span>
                            </div>
                            <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                               <div className={`h-full ${s.bg} transition-all duration-1000 ease-out`} style={{ width: `${ (totalSources > 0) ? (s.count / totalSources) * 100 : 0 }%` }}></div>
                            </div>
                         </div>
                      </div>
                    );
                 })}
                 { (totalSources === 0) && <p className="text-slate-500 text-xs text-center py-4 italic">Awaiting source data...</p> }
              </div>
        </div>

        {showEliteReport && (
          <EliteReportModal 
            onClose={() => setShowEliteReport(false)}
            stats={stats}
            products={products}
            categories={categories}
            admins={admins}
            settings={settings}
            trafficEvents={trafficEvents}
            curatorId={curatorFilter}
          />
        )}
      </div>
    );
  };

  const generateSitemap = async () => {
    try {
      // In a real app, this would trigger a server-side generation or just update the timestamp
      // since our server.ts handles it dynamically.
      await updateSettings({ 
        sitemapGeneratedAt: Date.now(),
        sitemapStatus: 'valid'
      });
      alert('Sitemap generation triggered. It is now live at /sitemap.xml');
    } catch (error) {
      console.error('Error generating sitemap:', error);
      updateSettings({ sitemapStatus: 'invalid' });
      alert('Failed to generate sitemap.');
    }
  };

  const generateRobotsTxt = async () => {
    try {
      // In a real app, this would trigger a server-side generation or just update the timestamp
      // since our server.ts handles it dynamically.
      await updateSettings({ 
        robotsGeneratedAt: Date.now(),
        robotsStatus: 'valid'
      });
      alert('robots.txt generation triggered. It is now live at /robots.txt');
    } catch (error) {
      console.error('Error generating robots.txt:', error);
      updateSettings({ robotsStatus: 'invalid' });
      alert('Failed to generate robots.txt.');
    }
  };

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const getInternalLinkingSuggestions = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Simple logic: suggest linking to top categories or recent products
    const suggestions = [
      { text: 'Link to your best-selling categories from the homepage.', icon: <Layers className="w-4 h-4" /> },
      { text: 'Add "Related Products" to product pages to improve crawl depth.', icon: <ShoppingBag className="w-4 h-4" /> },
      { text: 'Ensure your About page links back to your main Products gallery.', icon: <ArrowRight className="w-4 h-4" /> }
    ];
    return suggestions;
  }, [products]);

  const renderSEO = () => {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-serif text-white mb-2 tracking-tight">Search Engine Optimization</h2>
            <p className="text-slate-400">Manage global meta tags, generate sitemaps, and connect external tools.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                {settings?.robotsGeneratedAt && (
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700 group"
                    title="View Live robots.txt"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:text-white" />
                  </a>
                )}
                <button
                  onClick={generateRobotsTxt}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all border border-slate-700 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Generate robots.txt
                </button>
              </div>
              {settings?.robotsGeneratedAt && (
                <div className="flex items-center gap-1.5 px-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${settings.robotsStatus === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] text-slate-500 font-medium">
                    Last: {new Date(settings.robotsGeneratedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                {settings?.sitemapGeneratedAt && (
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700 group"
                    title="View Live sitemap.xml"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:text-white" />
                  </a>
                )}
                <button
                  onClick={generateSitemap}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                >
                  <Globe className="w-5 h-5" />
                  Generate sitemap.xml
                </button>
              </div>
              {settings?.sitemapGeneratedAt && (
                <div className="flex items-center gap-1.5 px-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${settings.sitemapStatus === 'valid' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-[10px] text-slate-500 font-medium">
                    Last: {new Date(settings.sitemapGeneratedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl">
              <div className="space-y-8">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-indigo-300 mb-1">Why SEO Matters</h4>
                      <p className="text-xs text-indigo-200/70 leading-relaxed">
                        Search Engine Optimization (SEO) settings determine how your website appears in search engine results (like Google) and when shared on social media. Well-crafted SEO metadata improves your site's visibility, click-through rates, and overall digital presence.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Global SEO Title</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Recommended: 50–60 characters. This is the primary headline in search results.
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      value={tempSettings?.seoTitle || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, seoTitle: e.target.value })}
                      placeholder="e.g., Findara - Premium Curated Products"
                      className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        (tempSettings?.seoTitle?.length || 0) > 60 || (tempSettings?.seoTitle?.length || 0) < 40 ? 'border-amber-500/50 focus:ring-amber-500' : 'border-slate-800'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] font-medium flex items-center gap-1">
                        {(tempSettings?.seoTitle?.length || 0) < 40 ? (
                          <><Info className="w-3 h-3 text-amber-400" /> <span className="text-amber-400/80">Too short. Aim for 50-60 characters for best visibility.</span></>
                        ) : (tempSettings?.seoTitle?.length || 0) > 60 ? (
                          <><Info className="w-3 h-3 text-amber-400" /> <span className="text-amber-400/80">Too long. Google will truncate this title in search results.</span></>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400/80">Optimal length. Great for search engines!</span></>
                        )}
                      </p>
                      <p className={`text-[10px] ${
                        (tempSettings?.seoTitle?.length || 0) > 60 || (tempSettings?.seoTitle?.length || 0) < 40 ? 'text-amber-400 font-medium' : 'text-emerald-400'
                      }`}>
                        {tempSettings?.seoTitle?.length || 0} / 60 characters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Global Meta Description</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Recommended: 150–160 characters. A compelling summary to increase click-through rate.
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <textarea
                      value={tempSettings?.seoDescription || ''}
                      onChange={(e) => setTempSettings({ ...tempSettings, seoDescription: e.target.value })}
                      placeholder="A brief description of your site for search engines..."
                      rows={3}
                      className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                        (tempSettings?.seoDescription?.length || 0) > 160 || (tempSettings?.seoDescription?.length || 0) < 120 ? 'border-amber-500/50 focus:ring-amber-500' : 'border-slate-800'
                      }`}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] font-medium flex items-center gap-1">
                        {(tempSettings?.seoDescription?.length || 0) < 120 ? (
                          <><Info className="w-3 h-3 text-amber-400" /> <span className="text-amber-400/80">Too short. Compelling descriptions improve click-through rate.</span></>
                        ) : (tempSettings?.seoDescription?.length || 0) > 160 ? (
                          <><Info className="w-3 h-3 text-amber-400" /> <span className="text-amber-400/80">Too long. Keep the most important info at the start.</span></>
                        ) : (
                          <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> <span className="text-emerald-400/80">Perfect length. This will look great on Google!</span></>
                        )}
                      </p>
                      <p className={`text-[10px] ${
                        (tempSettings?.seoDescription?.length || 0) > 160 || (tempSettings?.seoDescription?.length || 0) < 120 ? 'text-amber-400 font-medium' : 'text-emerald-400'
                      }`}>
                        {tempSettings?.seoDescription?.length || 0} / 160 characters
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => updateSettings({ seoTitle: tempSettings.seoTitle, seoDescription: tempSettings.seoDescription })}
                    className="px-6 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:brightness-110 transition-all text-sm"
                  >
                    Save Global Meta Tags
                  </button>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Keyword Optimization</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Meta keywords are outdated. Focus on placing your primary keywords naturally in your Title, Headings (H1, H2), and the first 100 words of your content.
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> SEO Best Practice
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Google ignores the "meta keywords" tag. Instead, ensure your target keywords appear in:
                      </p>
                      <ul className="mt-2 space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                        <li>The first 60 characters of your <span className="text-indigo-400">Page Title</span></li>
                        <li>Your main <span className="text-indigo-400">H1 Heading</span> (only one per page)</li>
                        <li>The first paragraph of your <span className="text-indigo-400">Body Text</span></li>
                        <li>Image <span className="text-indigo-400">Alt Text</span> descriptions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                {/* Live SERP Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Live SERP Preview</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      See how your site appears in Google search results.
                    </p>
                    <div className="flex bg-slate-800 p-1 rounded-lg mt-4 w-fit">
                      <button
                        onClick={() => setPreviewMode('desktop')}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        <Monitor className="w-3 h-3" /> Desktop
                      </button>
                      <button
                        onClick={() => setPreviewMode('mobile')}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        <Smartphone className="w-3 h-3" /> Mobile
                      </button>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className={`bg-white rounded-xl p-6 shadow-sm font-sans mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[360px]' : 'max-w-[600px]'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border border-slate-200">
                          {settings?.seoOgImage ? (
                            <img src={settings.seoOgImage} alt="Favicon" className="w-full h-full object-cover" />
                          ) : (
                            <Globe className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] text-[#202124] leading-tight truncate">{settings?.localBusinessName || 'Your Website'}</div>
                          <div className="text-[12px] text-[#4d5156] leading-tight flex items-center gap-1 truncate">
                            https://{window.location.hostname} <LucideIcons.MoreVertical className="w-3 h-3 flex-shrink-0" />
                          </div>
                        </div>
                      </div>
                      <h3 className={`text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-tight ${previewMode === 'mobile' ? 'text-[18px]' : 'text-[20px]'}`}>
                        {settings?.seoTitle || 'Your Page Title'}
                      </h3>
                      <p className="text-[14px] text-[#4d5156] leading-[1.58] line-clamp-2">
                        {settings?.seoDescription || 'Your page description will appear here. Make it compelling to encourage clicks from search engine users.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Open Graph (OG) Image</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Recommended: 1200x630px (JPG/PNG). This image appears when your link is shared on social media.
                    </p>
                    <div className="mt-4 space-y-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                      <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Specifications</h4>
                      <ul className="text-[10px] text-slate-400 space-y-1 list-disc list-inside">
                        <li>Size: 1200 x 630 pixels</li>
                        <li>Format: JPG or PNG</li>
                        <li>Ratio: 1.91:1</li>
                        <li>Max file size: 8MB</li>
                      </ul>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={settings?.seoOgImage || ''}
                        onChange={(e) => updateSettings({ seoOgImage: e.target.value })}
                        placeholder="https://example.com/og-image.jpg"
                        className={`flex-grow bg-slate-950/50 border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          settings?.seoOgImage && !settings.seoOgImage.match(/^https?:\/\/.+\..+/) ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800'
                        }`}
                      />
                      {settings?.seoOgImage && (
                        <div className="w-12 h-12 rounded-lg border border-slate-800 overflow-hidden bg-slate-950 flex-shrink-0">
                          <img 
                            src={settings.seoOgImage} 
                            alt="OG Preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/1200x630/1e293b/ffffff?text=Invalid+URL')}
                          />
                        </div>
                      )}
                    </div>
                    {settings?.seoOgImage && !settings.seoOgImage.match(/^https?:\/\/.+\..+/) && (
                      <p className="text-[10px] text-red-400 font-medium mt-1 mb-3">Please enter a valid URL starting with http:// or https://</p>
                    )}
                    <div className="mt-4 p-4 bg-[#1a1a1b] border border-slate-800 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                        <Share2 className="w-3 h-3" /> Social Media Preview Example
                      </p>
                      <div className="border border-[#343536] rounded-lg overflow-hidden bg-[#1a1a1b] max-w-sm mx-auto shadow-2xl">
                        {settings?.seoOgImage ? (
                          <img src={settings.seoOgImage} className="w-full aspect-[1.91/1] object-cover" alt="Social Preview" />
                        ) : (
                          <div className="w-full aspect-[1.91/1] bg-slate-800 flex items-center justify-center text-slate-600">
                            <Globe className="w-8 h-8" />
                          </div>
                        )}
                        <div className="p-3 border-t border-[#343536]">
                          <p className="text-[10px] text-[#818384] uppercase truncate">{window.location.hostname}</p>
                          <p className="text-sm font-medium text-[#d7dadc] truncate mt-0.5">{settings?.seoTitle || 'Site Title'}</p>
                          <p className="text-xs text-[#818384] line-clamp-1 mt-0.5">{settings?.seoDescription || 'Site description goes here...'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* External Integrations */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-serif text-white mb-6">External Connections</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Google Analytics</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter your GA4 Measurement ID (G-XXXXXXXXXX).
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      value={settings?.googleAnalyticsId || ''}
                      onChange={(e) => updateSettings({ googleAnalyticsId: e.target.value })}
                      placeholder="e.g., G-XXXXXXXXXX"
                      className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        settings?.googleAnalyticsId && !settings.googleAnalyticsId.match(/^G-[A-Z0-9]{10}$/) ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800'
                      }`}
                    />
                    {settings?.googleAnalyticsId && !settings.googleAnalyticsId.match(/^G-[A-Z0-9]{10}$/) && (
                      <p className="text-[10px] text-red-400 font-medium mt-1">Invalid format. Expected G-XXXXXXXXXX</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Google Tag Manager</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter your GTM Container ID (GTM-XXXXXXX).
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      value={settings?.googleTagManagerId || ''}
                      onChange={(e) => updateSettings({ googleTagManagerId: e.target.value })}
                      placeholder="e.g., GTM-XXXXXXX"
                      className={`w-full bg-slate-950/50 border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        settings?.googleTagManagerId && !settings.googleTagManagerId.match(/^GTM-[A-Z0-9]{7,10}$/) ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800'
                      }`}
                    />
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Google Search Console</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Verification method: <span className="text-indigo-400">HTML meta tag</span>. Paste the content value or the full tag.
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <input
                      type="text"
                      value={settings?.gscVerificationId || ''}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.includes('content="')) {
                          const match = val.match(/content="([^"]+)"/);
                          if (match) val = match[1];
                        }
                        updateSettings({ gscVerificationId: val });
                      }}
                      placeholder="e.g., google-site-verification=..."
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                    <p className="text-[10px] text-slate-500 mt-2">
                      Auto-parses: &lt;meta name="google-site-verification" content="<span className="text-indigo-400">...</span>" /&gt;
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Custom Scripts</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Inject custom HTML/JS into your site's head or footer.
                    </p>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Header Scripts (Inside &lt;head&gt;)</label>
                      <textarea
                        value={settings?.customHeaderScripts || ''}
                        onChange={(e) => updateSettings({ customHeaderScripts: e.target.value })}
                        placeholder="<script>...</script>"
                        rows={4}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Footer Scripts (Before &lt;/body&gt;)</label>
                      <textarea
                        value={settings?.customFooterScripts || ''}
                        onChange={(e) => updateSettings({ customFooterScripts: e.target.value })}
                        placeholder="<script>...</script>"
                        rows={4}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced SEO & Local */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl">
              <h3 className="text-xl font-serif text-white mb-6">Advanced SEO & Local</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Structured Data (Schema)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enable JSON-LD schema markup. Select your business type and preview the generated code.
                    </p>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings?.enableSchemaMarkup ?? true}
                          onChange={(e) => updateSettings({ enableSchemaMarkup: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ml-3 text-sm font-medium text-slate-300">
                          {settings?.enableSchemaMarkup ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                    
                    {settings?.enableSchemaMarkup && (
                      <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Schema Type</label>
                            <div className="relative">
                              <select
                                value={settings?.schemaType || 'Organization'}
                                onChange={(e) => updateSettings({ schemaType: e.target.value as any })}
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                              >
                                <option value="Organization">Organization</option>
                                <option value="LocalBusiness">Local Business</option>
                                <option value="WebSite">WebSite</option>
                                <option value="Store">Store</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">JSON-LD Preview</span>
                            <button 
                              onClick={() => {
                                const schema = {
                                  "@context": "https://schema.org",
                                  "@type": settings?.schemaType || "Organization",
                                  "name": settings?.companyName || "Your Company",
                                  "url": window.location.origin
                                };
                                updateSettings({ customSchemaJson: JSON.stringify(schema, null, 2) });
                              }}
                              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest"
                            >
                              Reset to Default
                            </button>
                          </div>
                          <textarea
                            value={settings?.customSchemaJson || JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": settings?.schemaType || "Organization",
                              "name": settings?.companyName || "Your Company",
                              "url": window.location.origin
                            }, null, 2)}
                            onChange={(e) => updateSettings({ customSchemaJson: e.target.value })}
                            rows={6}
                            className="w-full bg-transparent text-emerald-400 font-mono text-[11px] outline-none resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Local SEO (NAP Details)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Expand your local presence with full Name, Address, and Phone details.
                    </p>
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Business Name</label>
                        <input
                          type="text"
                          value={settings?.localBusinessName || ''}
                          onChange={(e) => updateSettings({ localBusinessName: e.target.value })}
                          placeholder="e.g., Findara Luxury"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Business Category</label>
                        <input
                          type="text"
                          value={settings?.localBusinessCategory || ''}
                          onChange={(e) => updateSettings({ localBusinessCategory: e.target.value })}
                          placeholder="e.g., Retail Store"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Full Address</label>
                      <input
                        type="text"
                        value={settings?.localBusinessAddress || ''}
                        onChange={(e) => updateSettings({ localBusinessAddress: e.target.value })}
                        placeholder="e.g., 123 Fashion Ave, New York, NY 10001"
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Country</label>
                        <input
                          type="text"
                          value={settings?.localBusinessCountry || ''}
                          onChange={(e) => updateSettings({ localBusinessCountry: e.target.value })}
                          placeholder="e.g., United States"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Website URL</label>
                        <input
                          type="text"
                          value={settings?.localBusinessWebsite || ''}
                          onChange={(e) => updateSettings({ localBusinessWebsite: e.target.value })}
                          placeholder="e.g., https://findara.com"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Business Phone</label>
                        <input
                          type="text"
                          value={settings?.localBusinessPhone || ''}
                          onChange={(e) => updateSettings({ localBusinessPhone: e.target.value })}
                          placeholder="e.g., +1 234 567 8900"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Opening Hours</label>
                        <input
                          type="text"
                          value={settings?.localBusinessOpeningHours || ''}
                          onChange={(e) => updateSettings({ localBusinessOpeningHours: e.target.value })}
                          placeholder="e.g., Mo-Fr 09:00-18:00"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={settings?.localBusinessLat || ''}
                          onChange={(e) => updateSettings({ localBusinessLat: parseFloat(e.target.value) })}
                          placeholder="e.g., 40.7128"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={settings?.localBusinessLng || ''}
                          onChange={(e) => updateSettings({ localBusinessLng: parseFloat(e.target.value) })}
                          placeholder="e.g., -74.0060"
                          className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical SEO */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl mt-8">
              <h3 className="text-xl font-serif text-white mb-6">Technical SEO</h3>
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Internal Linking Suggestions</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Actionable tips to improve your site's crawlability and user flow.
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="space-y-3">
                      {getInternalLinkingSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0">
                            {suggestion.icon}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{suggestion.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Clean, Readable URLs</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Automatically generate SEO-friendly URLs from product and category names.
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.seoAutoCleanUrls ?? true}
                        onChange={(e) => updateSettings({ seoAutoCleanUrls: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-300">
                        {settings?.seoAutoCleanUrls !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Optimize Page Speed (Lazy Loading)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Defer loading of off-screen images to improve initial page load time.
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.seoEnableLazyLoading ?? true}
                        onChange={(e) => updateSettings({ seoEnableLazyLoading: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-300">
                        {settings?.seoEnableLazyLoading !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Require Image Alt Text</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enforce alt text descriptions for all new image uploads for accessibility and SEO.
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.seoRequireAltText ?? true}
                        onChange={(e) => updateSettings({ seoRequireAltText: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-300">
                        {settings?.seoRequireAltText !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Automatic Internal Linking</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Automatically link related products to help users and crawlers navigate.
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.seoAutoRelatedProducts ?? true}
                        onChange={(e) => updateSettings({ seoAutoRelatedProducts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-300">
                        {settings?.seoAutoRelatedProducts !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Force HTTPS</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ensure your site is always accessed securely via an SSL certificate.
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.seoForceHttps ?? true}
                        onChange={(e) => updateSettings({ seoForceHttps: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-300">
                        {settings?.seoForceHttps !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Avoid Duplicate Content</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use canonical tags to tell search engines which version of a page is the master.
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.seoEnableCanonicalTags ?? true}
                        onChange={(e) => updateSettings({ seoEnableCanonicalTags: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-300">
                        {settings?.seoEnableCanonicalTags !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

                <div className="w-full h-px bg-slate-800/50"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-bold text-white mb-1">Keep Content Fresh</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Show "Last Updated" dates on products and articles to signal fresh content.
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings?.seoShowLastUpdated ?? true}
                        onChange={(e) => updateSettings({ seoShowLastUpdated: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-medium text-slate-300">
                        {settings?.seoShowLastUpdated !== false ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* Performance & Mobile Insights */}
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl mt-8">
              <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Performance & Mobile Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Mobile Responsiveness</h4>
                      <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Optimized</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Your site uses a mobile-first Tailwind CSS architecture, ensuring content scales perfectly across all device sizes. This is a critical ranking factor for Google's mobile-first indexing.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Tap targets are at least 44x44px
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Viewport meta tag is configured
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Core Web Vitals</h4>
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Ready</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    With lazy loading enabled and optimized asset delivery, your site is structured to pass Core Web Vitals assessments (LCP, FID, CLS).
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Lazy loading enabled
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Modern image formats (WebP) supported
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Actionable Recommendations
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 text-[11px] text-slate-300">
                    <ArrowRight className="w-3 h-3 text-indigo-400 mt-0.5" />
                    <span>Compress large OG images to under 500KB for faster sharing.</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-slate-300">
                    <ArrowRight className="w-3 h-3 text-indigo-400 mt-0.5" />
                    <span>Ensure all product images have descriptive ALT text.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Checklist Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl sticky top-8">
              <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                SEO Best Practices
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Follow this checklist to ensure your site is fully optimized for search engines.
              </p>

              <div className="space-y-4">
                {[
                  { title: "Page Titles (Meta Titles)", desc: "Ensure every page has a unique, descriptive title.", done: !!settings?.seoTitle && settings.seoTitle.length >= 50 && settings.seoTitle.length <= 60 },
                  { title: "Meta Descriptions", desc: "Write compelling summaries for each page to boost click-through rates.", done: !!settings?.seoDescription && settings.seoDescription.length >= 150 && settings.seoDescription.length <= 160 },
                  { title: "Valid OG Image", desc: "Provide a valid URL for your social media preview image.", done: !!settings?.seoOgImage && !!settings.seoOgImage.match(/^https?:\/\/.+\..+/) },
                  { title: "Heading Tags (H1, H2, H3)", desc: "Structure content logically. Use only one H1 per page.", done: true },
                  { title: "XML Sitemap", desc: "Generate and submit your sitemap to Google Search Console.", done: settings?.sitemapStatus === 'valid' },
                  { title: "robots.txt File", desc: "Guide search engine crawlers on what to index.", done: settings?.robotsStatus === 'valid' },
                  { title: "Clean, Readable URLs", desc: "Use short, descriptive URLs (e.g., /products/leather-bag).", done: settings?.seoAutoCleanUrls !== false },
                  { title: "Optimize Page Speed", desc: "Compress images and minimize heavy scripts for fast loading.", done: settings?.seoEnableLazyLoading !== false },
                  { title: "Mobile-Friendly Design", desc: "Ensure your site looks and works great on all devices.", done: true },
                  { title: "Image Alt Text", desc: "Describe images for accessibility and image search SEO.", done: settings?.seoRequireAltText !== false },
                  { title: "Internal Linking", desc: "Link related pages together to help users and crawlers navigate.", done: settings?.seoAutoRelatedProducts !== false },
                  { title: "External Backlinks", desc: "Earn links from reputable sites to build domain authority.", done: false },
                  { title: "Structured Data (Schema)", desc: "Help search engines understand your content format.", done: !!settings?.enableSchemaMarkup },
                  { title: "Ensure HTTPS", desc: "Secure your site with an SSL certificate.", done: settings?.seoForceHttps !== false },
                  { title: "Fix Broken Links", desc: "Regularly check for and fix 404 errors.", done: false },
                  { title: "Avoid Duplicate Content", desc: "Ensure each page offers unique value.", done: settings?.seoEnableCanonicalTags !== false },
                  { title: "Connect Search Console", desc: "Monitor indexing status and search queries.", done: !!settings?.gscVerificationId && settings.gscVerificationId.length > 10 },
                  { title: "Connect Google Analytics", desc: "Track user behavior and traffic sources.", done: !!settings?.googleAnalyticsId && /^G-[A-Z0-9]+$/.test(settings.googleAnalyticsId) },
                  { title: "Keep Content Fresh", desc: "Regularly update your site with new, relevant information.", done: settings?.seoShowLastUpdated !== false },
                  { title: "Local SEO", desc: "Optimize your Google Business Profile if you have a physical location.", done: !!settings?.localBusinessName && !!settings?.localBusinessAddress },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${item.done ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'border-slate-700 text-transparent group-hover:border-slate-500'}`}>
                      {item.done && <Check size={10} strokeWidth={3} />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${item.done ? 'text-slate-300' : 'text-slate-400'}`}>{item.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSystem = () => {
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 B';
        const k = 1024;
        const dm = (decimals < 0) ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${ parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) } ${sizes[i]}`;
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
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ (connectionHealth?.status === 'online') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20' }`}>
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
                            className={`h-full transition-all duration-500 ${ latencyColor(connectionHealth?.latency || 0) }`} 
                            style={{ width: `${ Math.min((connectionHealth?.latency || 0) / 10, 100) }%` }}
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
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${ isSupabaseConfigured ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' }`}>
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
                       { (systemLogs.length > 0) ? systemLogs.map((log) => (
                           <tr key={log.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                               <td className="py-3 pl-4 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                               <td className="py-3">
                                   <span className={`px-2 py-1 rounded text-[10px] font-black ${
                                       (log.type === 'SYNC') ? 'bg-blue-500/20 text-blue-400' : 
                                       (log.type === 'UPDATE') ? 'bg-yellow-500/20 text-yellow-400' :
                                       (log.type === 'DELETE') ? 'bg-red-500/20 text-red-400' :
                                       (log.type === 'ERROR') ? 'bg-red-600 text-white' :
                                       'bg-slate-700 text-slate-300'
                                   }`}>
                                       {log.type}
                                   </span>
                               </td>
                               <td className="py-3 font-bold">{log.target}</td>
                               <td className="py-3 text-slate-500">{log.sizeBytes ? formatBytes(log.sizeBytes, 0) : '-'}</td>
                               <td className="py-3 pr-4 text-right">
                                   { (log.status === 'success') ? <span className="text-green-500 font-bold">OK</span> : <span className="text-red-500 font-bold">FAIL</span>}
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
              { (errorLogs.length > 0) ? (
                 errorLogs.map((err, i) => (
                    <div key={err.id} className="mb-4 border-b border-slate-900 pb-3 last:border-0 relative z-10 animate-in slide-in-from-left duration-300">
                       <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-slate-500">[{err.timestamp}]</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${ (err.type === 'RUNTIME_EXCEPTION') ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400' }`}>
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

        <div className="grid md:grid-cols-3 gap-6 text-left">
           <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-left space-y-4">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Download size={18} className="text-primary"/> Catalog Export</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Save a complete snapshot of all products, settings, and analytical data to JSON.</p>
              <button onClick={handleBackup} className="px-6 py-4 bg-slate-800 text-white rounded-xl text-xs uppercase font-black hover:bg-slate-700 transition-colors w-full flex items-center justify-center gap-2 border border-slate-700">Download Data</button>
           </div>
           
           <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 text-left space-y-4 relative group overflow-hidden">
              <History className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 -rotate-12 transition-transform group-hover:scale-110" />
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Clock size={18} className="text-primary"/> Monthly Archive</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Manually trigger the curation cycle. Moves all non-owner items to the history vault for catalog refreshment.</p>
              <button onClick={() => setShowPurgeModal(true)} className="px-6 py-4 bg-primary text-slate-900 rounded-xl text-xs uppercase font-black hover:bg-white transition-all w-full flex items-center justify-center gap-2 shadow-lg shadow-primary/10">Trigger Cycle</button>
           </div>

           <div className="bg-red-950/10 p-8 rounded-[2rem] border border-red-500/20 text-left space-y-4">
              <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Flame size={18} className="text-red-500"/> System Purge</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Immediately factory reset all local storage data. Supabase cloud data is preserved unless manually wiped.</p>
              <button onClick={handleFactoryReset} className="px-6 py-4 bg-red-600 text-white rounded-xl text-xs uppercase font-black hover:bg-red-500 transition-colors w-full flex items-center justify-center gap-2">Execute Purge</button>
           </div>
        </div>

        {/* Manual Purge High-Friction Modal */}
        {showPurgeModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
             <div className="bg-slate-900 border border-slate-800 w-full max-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-8 text-center border-b border-slate-800">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
                      <Flame size={40} className="animate-pulse" />
                   </div>
                   <h3 className="text-2xl font-serif text-white mb-2">Execute Archive Cycle?</h3>
                   <p className="text-slate-400 text-sm leading-relaxed">This will immediately move all curator-submitted items to the history vault. This action is recorded in the Maison Ledger.</p>
                </div>
                <div className="p-8 bg-slate-950">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] text-center">Type <span className="text-primary">PURGE</span> to confirm security protocol</p>
                      <input 
                        type="text" 
                        value={purgeConfirmText}
                        onChange={(e) => setPurgeConfirmText(e.target.value.toUpperCase())}
                        placeholder="SECURITY_KEY"
                        className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white text-center font-mono font-bold tracking-[0.5em] outline-none focus:border-primary transition-all uppercase placeholder:opacity-20"
                      />
                      <div className="flex gap-4 pt-4">
                         <button 
                            onClick={() => { setShowPurgeModal(false); setPurgeConfirmText(''); }}
                            className="flex-1 py-4 text-slate-500 font-bold uppercase text-xs tracking-widest hover:text-white"
                         >
                            Abort
                         </button>
                         <button 
                            disabled={ (purgeConfirmText !== 'PURGE') || isPurging }
                            onClick={handleManualPurge}
                            className={`flex-1 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${
                               (purgeConfirmText === 'PURGE') 
                               ? 'bg-red-600 text-white shadow-xl shadow-red-600/20 hover:brightness-110 active:scale-95' 
                               : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            }`}
                         >
                            {isPurging ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                            Execute
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
     </div>
    );
  };

  const renderCatalog = () => {
    const filteredBase = displayProducts.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) && 
      ( (productCatFilter === 'all') || p.categoryId === productCatFilter )
    );

    // Identify orphan items (uncategorized)
    const categorisedIds = new Set(categories.map(c => c.id));
    const orphans = filteredBase.filter(p => !p.categoryId || !categorisedIds.has(p.categoryId));

    const standardGroups = categories.map(cat => ({
      ...cat,
      items: filteredBase.filter(p => p.categoryId === cat.id)
    }));

    const groupedProducts = [...standardGroups];
    
    // Append orphans to the bottom of the list if viewing all
    if (orphans.length > 0 && productCatFilter === 'all') {
      groupedProducts.push({
        id: 'orphans',
        name: 'Uncategorized Items',
        icon: 'AlertTriangle',
        image: '',
        items: orphans
      } as any);
    }

    const filteredGroups = groupedProducts.filter(group => (group.items.length > 0) || ( (productCatFilter !== 'all') && (group.id === productCatFilter) ));

    return (
      <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        {showProductForm ? (
          <div className="bg-slate-900 p-6 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-8">
            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-6"><h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Masterpiece' : 'New Collection Item'}</h3><button onClick={() => setShowProductForm(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24}/></button></div>
            <AdminTip title="Inventory Deployment">Optimize your listing with detailed specifications and high-res media. The 'Highlights' section powers the shoppable bridge features.</AdminTip>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-6">
                 <SettingField label="Product Name" value={productData.name || ''} onChange={v => setProductData({...productData, name: v})} />
                 <SettingField label="SKU / Reference ID" value={productData.sku || ''} onChange={v => setProductData({...productData, sku: v})} />
                 <div className="grid grid-cols-2 gap-4">
                   <SettingField label="Price (ZAR)" value={productData.price?.toString() || ''} onChange={v => setProductData({...productData, price: parseFloat(v)})} type="number" />
                   <SettingField label="Was Price (Original)" value={productData.wasPrice?.toString() || ''} onChange={v => setProductData({...productData, wasPrice: parseFloat(v)})} type="number" />
                 </div>
                 <SettingField label="Affiliate Link" value={productData.affiliateLink || ''} onChange={v => setProductData({...productData, affiliateLink: v})} />
               </div>
               <div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Department</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={productData.categoryId} onChange={e => setProductData({...productData, categoryId: e.target.value, subCategoryId: ''})}><option value="">Select Department</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sub-Category</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none disabled:opacity-50" value={productData.subCategoryId} onChange={e => setProductData({...productData, subCategoryId: e.target.value})} disabled={!productData.categoryId}><option value="">Select Sub-Category</option>{subCategories.filter(s => s.categoryId === productData.categoryId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div><SettingField label="Description" value={productData.description || ''} onChange={v => setProductData({...productData, description: v})} type="richtext" /></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-slate-800">
                <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Sparkles size={18} className="text-primary"/> Highlights</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex gap-2"><input type="text" placeholder="Add highlight..." value={tempFeature} onChange={e => setTempFeature(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && handleAddFeature()} /><button onClick={handleAddFeature} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{(productData.features || []).map((feat, idx) => (<div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"><span className="text-sm text-slate-300 flex items-center gap-2"><Check size={14} className="text-primary"/> {feat}</span><button onClick={() => handleRemoveFeature(idx)} className="text-slate-500 hover:text-red-500"><X size={14}/></button></div>))}</div></div></div>
                
                <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Tag size={18} className="text-primary"/> Discovery Tags</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex gap-2"><input type="text" placeholder="Type and hit Enter..." value={tempTag} onChange={e => setTempTag(e.target.value)} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && handleAddTag()} /><button onClick={handleAddTag} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="flex flex-wrap gap-2">{(productData.tags || []).map((tag, idx) => (<div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/30 animate-in zoom-in duration-300"><span className="text-[10px] font-black uppercase tracking-widest text-primary">{tag}</span><button onClick={() => handleRemoveTag(tag)} className="text-primary/60 hover:text-primary transition-colors"><X size={10}/></button></div>))}</div>{(productData.tags || []).length === 0 && <p className="text-[10px] text-slate-600 italic uppercase tracking-widest text-center py-2">No discovery tags added</p>}</div></div>

                <div className="space-y-6"><h4 className="text-white font-bold flex items-center gap-2"><Layout size={18} className="text-primary"/> Specifications</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex gap-2"><input type="text" placeholder="Key" value={tempSpec.key} onChange={e => setTempSpec({...tempSpec, key: e.target.value})} className="w-1/3 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" /><input type="text" placeholder="Value" value={tempSpec.value} onChange={e => setTempSpec({...tempSpec, value: e.target.value})} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none focus:border-primary" onKeyDown={e => e.key === 'Enter' && handleAddSpec()} /><button onClick={handleAddSpec} className="p-3 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{Object.entries(productData.specifications || {}).map(([key, value]) => (<div key={key} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800"><div className="flex flex-col"><span className="text-[10px] font-black uppercase text-slate-500">{key}</span><span className="text-sm text-slate-300">{value}</span></div><button onClick={() => handleRemoveSpec(key)} className="text-slate-500 hover:text-red-500"><X size={14}/></button></div>))}</div></div></div>
            </div>
            <div className="pt-8 border-t border-slate-800 text-left"><h4 className="text-white font-bold mb-4 flex items-center gap-2"><Image size={18} className="text-primary"/> Media Gallery</h4><FileUploader files={productData.media || []} onFilesChange={f => setProductData({...productData, media: f})} /></div>
            <div className="pt-8 border-t border-slate-800 text-left"><h4 className="text-white font-bold mb-6 flex items-center gap-2"><Percent size={18} className="text-primary"/> Discount Rules</h4><div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-800 space-y-4"><div className="flex flex-col md:flex-row gap-4 md:items-end"><div className="flex-1"><SettingField label="Description" value={tempDiscountRule.description || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, description: v})} /></div><div className="w-full md:w-32"><SettingField label="Value" value={tempDiscountRule.value?.toString() || ''} onChange={v => setTempDiscountRule({...tempDiscountRule, value: Number(v)})} type="number" /></div><div className="w-full md:w-32 space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-4 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none text-sm" value={tempDiscountRule.type} onChange={e => setTempDiscountRule({...tempDiscountRule, type: e.target.value as any})}><option value="percentage">Percent (%)</option><option value="fixed">Fixed (R)</option></select></div><button onClick={handleAddDiscountRule} className="p-4 bg-primary text-slate-900 rounded-xl hover:bg-white transition-colors"><Plus size={20}/></button></div><div className="space-y-2">{(productData.discountRules || []).map(rule => (<div key={rule.id} className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800"><span className="text-sm text-slate-300 font-medium">{rule.description}</span><div className="flex items-center gap-4"><span className="text-xs font-bold text-primary">{rule.type === 'percentage' ? `-${rule.value}%` : `-R${rule.value}`}</span><button onClick={() => handleRemoveDiscountRule(rule.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={16}/></button></div></div>))}</div></div></div>
            <div className="flex flex-col md:flex-row gap-4 pt-8"><button onClick={handleSaveProduct} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Save Product</button><button onClick={() => setShowProductForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Cancel</button></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 text-left">
              <div className="space-y-2">
                <h2 className="text-3xl font-serif text-white">{ (catalogView === 'active') ? 'Active Collection' : 'Curation History' }</h2>
                <p className="text-slate-400 text-sm">{ (catalogView === 'active') ? 'Manage your live collections.' : 'Archives of past curation selections.' }</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                <div className="p-1 bg-slate-900 border border-slate-800 rounded-2xl flex">
                   <button 
                    onClick={() => setCatalogView('active')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ (catalogView === 'active') ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300' }`}
                   >
                     <ShoppingBag size={14}/> Active
                   </button>
                   <button 
                    onClick={() => setCatalogView('history')}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${ (catalogView === 'history') ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300' }`}
                   >
                     <History size={14}/> History
                   </button>
                </div>

                { isOwner && (
                  <div className="relative min-w-[200px]">
                    <select 
                        value={curatorFilter} 
                        onChange={e => setCuratorFilter(e.target.value)}
                        className="w-full h-full px-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white outline-none focus:border-primary text-xs transition-all appearance-none cursor-pointer"
                    >
                        <option value="all">Display All Curators</option>
                        {admins.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                  </div>
                )}
                { (catalogView === 'active') && (
                  <button onClick={() => { setProductData({}); setShowProductForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3 w-full md:w-auto justify-center">
                      <Plus size={18} /> Add Product
                  </button>
                )}
              </div>
            </div>

            { (catalogView === 'active') ? (
              <AdminTip title="Inventory Management">Products are now categorized by department for easier navigation. { isOwner ? "As an owner, you can toggle curators to manage specific catalogs." : "Use the search to quickly find items." }</AdminTip>
            ) : (
              <AdminTip title="History Vault">This section contains items that have been cycled out of the main collection. You can view their performance or permanently remove them from the maison records.</AdminTip>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-[100px] z-30 bg-slate-950 py-2">
               <div className="relative flex-grow">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <input 
                  type="text" 
                  placeholder={`Search ${catalogView} collections...`} 
                  value={productSearch} 
                  onChange={e => setProductSearch(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm placeholder:text-slate-600" 
                 />
               </div>
               <div className="relative min-w-[200px]">
                 <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <select 
                  value={productCatFilter} 
                  onChange={e => setProductCatFilter(e.target.value)} 
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                 >
                   <option value="all">All Departments</option>
                   {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
               </div>
            </div>

            { (productCatFilter === 'all') && (filteredGroups.length > 1) && (
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6 sticky top-[170px] z-20 bg-slate-950">
                  {filteredGroups.map(group => {
                     return (
                        <button 
                          key={group.id}
                          onClick={() => {
                            const el = document.getElementById(`cat-section-${group.id}`);
                            if (el) window.scrollTo({ top: el.offsetTop - 200, behavior: 'smooth' });
                          }}
                          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-primary transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <IconRenderer icon={group.icon} size={12}/> {group.name} ({group.items.length})
                        </button>
                     );
                  })}
               </div>
            )}

            <div className="space-y-12">
              { loadingHistory ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500">
                  <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                  <p className="font-bold uppercase text-[10px] tracking-widest">Retrieving Archives...</p>
                </div>
              ) : (filteredGroups.length === 0) ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-800 text-slate-500">
                  No products matching your search found.
                </div>
              ) : filteredGroups.map(group => {
                return (
                  <div key={group.id} id={`cat-section-${group.id}`} className="space-y-6">
                    <div className="flex items-center gap-4 px-4">
                       <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <IconRenderer icon={group.icon} size={20} />
                       </div>
                       <div className="flex flex-col">
                          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{group.name}</h3>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{group.items.length} { (catalogView === 'active') ? 'Curations' : 'Archives' }</span>
                       </div>
                       <div className="flex-grow h-px bg-slate-800"></div>
                    </div>
                    
                    <div className="grid gap-4">
                      {group.items.map(p => (
                        <div key={p.id} className={`bg-slate-900 p-4 md:p-6 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-primary/30 transition-colors group gap-4 ${ (catalogView === 'history') ? 'opacity-70 grayscale-[0.5]' : '' }`}>
                          <div className="flex items-center gap-6 min-w-0 text-left">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative flex-shrink-0">
                              {p.media?.[0]?.url && <img src={p.media[0].url} className="w-full h-full object-cover" />}
                              { (catalogView === 'history') && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                   <History size={16} className="text-white/50" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                 <h4 className="text-white font-bold line-clamp-1 break-words">{p.name}</h4>
                                 { (catalogView === 'history') && <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 text-[8px] font-black uppercase border border-slate-700">ARCHIVED</span> }
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-primary text-xs font-bold">R {p.price}</span>
                                <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest">
                                  • { (catalogView === 'active') ? 'SKU:' : 'Archived:' } { (catalogView === 'active') ? p.sku : new Date((p as any).archivedAt || Date.now()).toLocaleDateString() }
                                </span>
                                { (curatorFilter === 'all') && isOwner && (
                                  <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest hidden md:inline">
                                    • Curator: { admins.find(a => a.id === p.createdBy)?.name || 'Central' }
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto flex-shrink-0">
                            { (catalogView === 'active') ? (
                              <>
                                <button onClick={() => setSelectedAdProduct(p as Product)} className="flex-1 md:flex-none p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-slate-900 transition-colors" title="Social Share"><Megaphone size={18}/></button>
                                <button onClick={() => { setProductData(p as Product); setEditingId(p.id); setShowProductForm(true); }} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-colors"><Edit2 size={18}/></button>
                                <button onClick={() => deleteData('products', p.id)} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => { /* Potential Restore Action */ }} className="flex-1 md:flex-none p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-colors" title="Restore to Active"><RotateCcw size={18}/></button>
                                <button onClick={() => { if(confirm("Permanently delete this archive?")) deleteData('product_history', p.id).then(() => loadHistory()); }} className="flex-1 md:flex-none p-3 bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"><Trash size={18}/></button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const MediaTab: React.FC = () => {
    const [mediaFiles, setMediaFiles] = useState<any[]>([]);
    const [loadingMedia, setLoadingMedia] = useState(false);
    
    const fetchMedia = async () => {
      setLoadingMedia(true);
      try {
        const { listMedia } = await import('../lib/supabase');
        const files = await listMedia();
        setMediaFiles(files || []);
      } catch (err) {
        console.error("Failed to fetch media", err);
      } finally {
        setLoadingMedia(false);
      }
    };

    useEffect(() => {
      fetchMedia();
    }, []);

    const handleDeleteMedia = async (fileName: string) => {
      if (!window.confirm("Are you sure you want to delete this file?")) return;
      try {
        const { deleteMediaFiles } = await import('../lib/supabase');
        await deleteMediaFiles([fileName]);
        fetchMedia();
      } catch (err) {
        console.error("Failed to delete media", err);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
           <div className="space-y-2"><h2 className="text-3xl font-serif text-white">Media Library</h2><p className="text-slate-400 text-sm">Manage your uploaded files.</p></div>
           <div className="flex gap-3 w-full md:w-auto">
              <button onClick={fetchMedia} className="flex-1 md:flex-none justify-center px-6 py-3 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors flex items-center gap-2"><RefreshCw size={16}/> Refresh</button>
           </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Upload New Media</h3>
          <FileUploader files={[]} onFilesChange={(newFiles) => {
            fetchMedia();
          }} />
        </div>

        {loadingMedia ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaFiles.filter(f => f.name !== '.emptyFolderPlaceholder').map((file, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group relative">
                <div className="aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
                  {file.metadata?.mimetype?.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  ) : file.metadata?.mimetype?.startsWith('video/') ? (
                    <video src={file.url} className="w-full h-full object-cover" />
                  ) : (
                    <FileIcon size={32} className="text-slate-500" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-white truncate" title={file.name}>{file.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{(file.metadata?.size / 1024).toFixed(1)} KB</p>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-slate-900/80 backdrop-blur-sm text-white rounded hover:bg-primary hover:text-slate-900 transition-colors">
                    <Eye size={14} />
                  </a>
                  <button onClick={() => handleDeleteMedia(file.name)} className="p-1.5 bg-slate-900/80 backdrop-blur-sm text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {mediaFiles.filter(f => f.name !== '.emptyFolderPlaceholder').length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
                No media files found.
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const ReviewsTab: React.FC = () => {
    const { siteReviews, updateData, deleteData, refreshAllData } = useSettings();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const filteredReviews = siteReviews.filter(r => filter === 'all' || r.status === filter);

    const handleStatusChange = async (review: SiteReview, status: 'approved' | 'rejected') => {
      try {
        await updateData('site_reviews', { ...review, status });
        refreshAllData();
      } catch (err) {
        console.error("Failed to update review status", err);
      }
    };

    const handleDeleteReview = async (id: string) => {
      if (!window.confirm('Delete this review permanently?')) return;
      try {
        await deleteData('site_reviews', id);
        refreshAllData();
      } catch (err) {
        console.error("Failed to delete review", err);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
           <div className="space-y-2">
             <h2 className="text-3xl font-serif text-white">Review Management</h2>
             <p className="text-slate-400 text-sm">Approve or reject site-wide reviews.</p>
           </div>
           <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
             {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-slate-900' : 'text-slate-400 hover:text-white'}`}
               >
                 {f}
               </button>
             ))}
           </div>
        </div>

        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'} />
                    ))}
                  </div>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    review.status === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    review.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                  }`}>
                    {review.status}
                  </span>
                </div>
                <h4 className="text-white font-bold">{review.userName || 'Anonymous'}</h4>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{review.comment}"</p>
              </div>
              <div className="flex items-center gap-2">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(review, 'approved')}
                    className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                    title="Approve"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(review, 'rejected')}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-slate-700"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredReviews.length === 0 && (
            <div className="text-center py-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
              <Star size={48} className="mx-auto text-slate-800 mb-4 opacity-20" />
              <p className="text-slate-500 font-serif italic">No reviews found in this category.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHero = () => (
     <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        <AdminTip title="Hero Master Visuals">Set the tone for your bridge page with cinematic hero visuals. Videos increase dwell time by up to 40%.</AdminTip>
        {showHeroForm ? ( 
           <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-800 space-y-6">
              <div className="grid md:grid-cols-2 gap-6"><SettingField label="Title" value={heroData.title || ''} onChange={v => setHeroData({...heroData, title: v})} /><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Type</label><select className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={heroData.type} onChange={e => setHeroData({...heroData, type: e.target.value as any})}><option value="image">Image</option><option value="video">Video</option></select></div></div>
              <SettingField label="Subtitle" value={heroData.subtitle || ''} onChange={v => setHeroData({...heroData, subtitle: v})} type="textarea" />
              <SettingField label="Button Label" value={heroData.cta || ''} onChange={v => setHeroData({...heroData, cta: v})} />
              <SingleImageUploader label="Media Asset" value={heroData.image || ''} onChange={v => setHeroData({...heroData, image: v})} accept={ (heroData.type === 'video') ? "video/*" : "image/*" } />
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <SingleImageUploader label="Cover Image" value={catData.image || ''} onChange={v => setCatData({...catData, image: v})} className="h-48 w-full object-cover rounded-2xl" />
                  </div>
                  <div className="bg-slate-800/30 p-3 rounded-2xl border border-slate-800">
                    <h4 className="text-white font-bold text-[10px] mb-2 uppercase tracking-wider opacity-50">Subcategories</h4>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        placeholder="New Subcategory" 
                        value={tempSubCatName} 
                        onChange={e => setTempSubCatName(e.target.value)} 
                        className="flex-grow px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-[10px] outline-none focus:border-primary/50 transition-colors" 
                      />
                      <button 
                        onClick={() => editingId && handleAddSubCategory(editingId)} 
                        className="px-3 bg-slate-700 text-white rounded-xl hover:bg-primary hover:text-slate-900 transition-colors"
                      >
                        <Plus size={14}/>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                      {editingId && subCategories.filter(s => s.categoryId === editingId).map(s => (
                        <div key={s.id} className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-900 rounded-lg border border-slate-800">
                          <span className="text-[9px] text-slate-300">{s.name}</span>
                          <button onClick={() => handleDeleteSubCategory(s.id)} className="text-slate-500 hover:text-red-500">
                            <X size={8}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
             </div>
             </div>
             <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-800"><button onClick={handleSaveCategory} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl">Save Dept</button><button onClick={() => setShowCategoryForm(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl">Cancel</button></div>
          </div>
       ) : (
          <>
            <AdminTip title="Collections Navigation">Each department acts as a portal. Use high-fashion imagery to attract attention to specific collections.</AdminTip>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               <button onClick={() => { setCatData({ name: '', icon: '', description: '', image: '' }); setShowCategoryForm(true); setEditingId(null); }} className="w-full h-40 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-primary"><Plus size={32} /><span className="font-black text-[10px] uppercase tracking-widest">New Dept</span></button>
               {displayCategories.map(c => {
                  return (
                    <div key={c.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col relative group">
                       <div className="h-32 overflow-hidden relative"><img src={c.image} className="w-full h-full object-cover opacity-50" /><div className="absolute inset-0 flex items-center px-8 gap-4"><div className="w-12 h-12 bg-slate-800 text-primary rounded-xl flex items-center justify-center shadow-xl flex-shrink-0"><IconRenderer icon={c.icon} size={20} /></div><h4 className="font-bold text-white text-lg truncate">{c.name}</h4></div></div>
                       <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setCatData(c); setEditingId(c.id); setShowCategoryForm(true); }} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md"><Edit2 size={14}/></button><button onClick={() => deleteData('categories', c.id)} className="p-2 bg-black/50 text-white rounded-lg backdrop-blur-md hover:bg-red-500"><Trash2 size={14}/></button></div>
                    </div>
                  );
               })}
            </div>
          </>
       )}
    </div>
  );

  const renderTeam = () => {
    const principals = admins.filter(a => a.role === 'owner');
    const curators = admins.filter(a => a.role === 'admin');

    return (
     <div className="space-y-12 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 text-left">
           <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Governance</span></h2>
              <div className="flex gap-4 mt-4">
                 <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                    <Crown size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{principals.length} Principals</span>
                 </div>
                 <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
                    <Briefcase size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{curators.length} Curators</span>
                 </div>
              </div>
           </div>
           { isOwner && (
              <button onClick={() => { setAdminData({ role: 'admin', permissions: [] }); setShowAdminForm(true); setEditingId(null); }} className="px-8 py-4 bg-primary text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                 <Plus size={18}/> Recruit Member
              </button>
           )}
        </div>

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
                    
                    { isOwner && (
                      <div className="mt-8 p-6 bg-slate-800/30 rounded-[2rem] border border-slate-800 space-y-4 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-bold text-sm flex items-center gap-2">
                              <History size={16} className="text-primary"/> Monthly Archive Exemption
                            </h4>
                            <p className="text-slate-500 text-[10px] leading-relaxed mt-1 uppercase tracking-widest font-black">Owner Exclusive Control</p>
                          </div>
                          <button 
                            onClick={() => setAdminData({...adminData, autoWipeExempt: !adminData.autoWipeExempt})}
                            className={`w-14 h-7 rounded-full transition-all relative border border-white/10 ${adminData.autoWipeExempt ? 'bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]' : 'bg-slate-700'}`}
                          >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${adminData.autoWipeExempt ? 'left-8' : 'left-1'}`}></div>
                          </button>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed font-light italic">"If enabled, products curated by this member will NOT be moved to history during the automated monthly refresh cycle."</p>
                      </div>
                    )}

                    <h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4 pt-12">Credentials</h3>
                    <SettingField label="Email Identity" value={adminData.email || ''} onChange={v => setAdminData({...adminData, email: v})} />
                    <SettingField label="Password" value={adminData.password || ''} onChange={v => setAdminData({...adminData, password: v})} type="password" />
                    <div className="mt-6 p-5 bg-primary/5 border border-primary/20 rounded-2xl"><div className="flex items-start gap-3"><div className="p-2 bg-primary/10 rounded-lg text-primary mt-1"><Key size={16} /></div><div className="space-y-3"><h4 className="text-primary font-bold text-xs uppercase tracking-widest">Authentication</h4><p className="text-slate-400 text-xs leading-relaxed">Manage passkeys via the Supabase cloud dashboard.</p><a href="https://supabase.com/dashboard/project/_/auth/users" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-slate-700"><ExternalLink size={14} /> Open Cloud Auth</a></div></div></div>
                 </div>
                 <div className="space-y-6 text-left"><h3 className="text-white font-bold text-xl border-b border-slate-800 pb-4">Privileges</h3><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Role</label><select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" value={adminData.role} onChange={e => setAdminData({...adminData, role: e.target.value as any, permissions: (e.target.value === 'owner') ? ['*'] : []})}><option value="admin">Administrator</option><option value="owner">System Owner</option></select></div><label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-6 block">Access Rights</label><PermissionSelector permissions={adminData.permissions || []} onChange={p => setAdminData({...adminData, permissions: p})} role={adminData.role || 'admin'} /></div>
              </div>
              <div className="flex flex-col md:flex-row justify-end gap-4 pt-8 border-t border-slate-800"><button onClick={() => setShowAdminForm(false)} className="px-8 py-4 text-slate-400 font-bold uppercase text-xs tracking-widest">Cancel</button><button onClick={handleSaveAdmin} disabled={creatingAdmin} className="px-12 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2">{creatingAdmin ? <Loader2 size={16} className="animate-spin"/> : <ShieldCheck size={18}/>}{editingId ? 'Save' : 'Invite'}</button></div>
           </div>
        ) : (
           <div className="space-y-16">
             {/* THE PRINCIPALS SECTION */}
             <section className="animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center gap-4 mb-8">
                   <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] border-l-4 border-primary pl-4 py-1">I. The Principals</h3>
                   <div className="h-px flex-grow bg-slate-800 opacity-30"></div>
                </div>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                   {principals.map(a => {
                      const isCurrentUser = user && ( (a.id === user.id) || (a.email === user.email) );
                      return (
                        <div key={a.id} className={`bg-slate-900 p-8 rounded-[2.5rem] md:rounded-[3rem] border transition-all relative group overflow-hidden ${isCurrentUser ? 'border-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)]' : 'border-white/5 hover:border-primary/40'}`}>
                           {/* BG Decorative Crown */}
                           <Crown size={120} className="absolute -right-8 -bottom-8 opacity-[0.02] text-primary group-hover:opacity-[0.05] transition-opacity" />
                           
                           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                              <div className="relative">
                                 <div className={`w-28 h-28 rounded-[2rem] flex items-center justify-center text-4xl font-bold uppercase shadow-2xl transition-all border-2 ${isCurrentUser ? 'bg-primary text-slate-900 border-primary shadow-primary/20' : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-primary group-hover:border-primary/50'}`}>
                                    {a.profileImage ? <img src={a.profileImage} className="w-full h-full object-cover rounded-[2rem]"/> : a.name?.charAt(0)}
                                 </div>
                                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-slate-900 shadow-xl border-4 border-slate-900">
                                    <Crown size={18} />
                                 </div>
                              </div>
                              <div className="flex-grow space-y-4 min-w-0">
                                 <div>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                                       <h4 className="text-white text-2xl font-bold tracking-tight truncate max-w-full">{a.name}</h4>
                                       {isCurrentUser && <span className="px-3 py-1 bg-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">SYSTEM AUTHENTICATED</span>}
                                    </div>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Maison Principal</p>
                                 </div>
                                 <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-slate-400 text-sm">
                                    <span className="flex items-center gap-2"><Mail size={14} className="text-primary opacity-50"/> {a.email}</span>
                                    {a.phone && <span className="flex items-center gap-2"><Phone size={14} className="text-primary opacity-50"/> {a.phone}</span>}
                                 </div>
                                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                       <Shield size={12} className="text-primary" /> Root Access Active
                                    </span>
                                    { a.autoWipeExempt && (
                                       <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                          <RotateCcw size={12} /> Permanent Curation
                                       </span>
                                    )}
                                 </div>
                              </div>
                              <div className="flex flex-row md:flex-col gap-3">
                                 <button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10 group-hover:border-primary/20"><Edit2 size={20}/></button>
                                 <button onClick={() => deleteData('admin_users', a.id)} className="p-4 bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all border border-white/5" disabled={isCurrentUser}><Trash2 size={20}/></button>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
             </section>

             {/* MAISON STAFF SECTION */}
             <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4 mb-8">
                   <h3 className="text-white font-black text-xs uppercase tracking-[0.4em] border-l-4 border-slate-700 pl-4 py-1">II. Maison Staff</h3>
                   <div className="h-px flex-grow bg-slate-800 opacity-30"></div>
                </div>
                {curators.length === 0 ? (
                  <div className="py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center justify-center text-center">
                     <Users size={48} className="text-slate-800 mb-4" />
                     <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-6">No curators on duty</p>
                     <button onClick={() => { setAdminData({ role: 'admin', permissions: [] }); setShowAdminForm(true); setEditingId(null); }} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Begin Recruitment</button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                     {curators.map(a => {
                        const isCurrentUser = user && ( (a.id === user.id) || (a.email === user.email) );
                        return (
                          <div key={a.id} className={`bg-slate-900 p-6 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary/30 transition-all group ${isCurrentUser ? 'border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'border-slate-800'}`}>
                             <div className="flex flex-col md:flex-row items-center gap-8 w-full min-w-0">
                                <div className="relative shrink-0">
                                   <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 text-2xl font-bold uppercase border border-slate-700 group-hover:border-primary/50 transition-colors">
                                      {a.profileImage ? <img src={a.profileImage} className="w-full h-full object-cover rounded-3xl"/> : a.name?.charAt(0)}
                                   </div>
                                   {isCurrentUser && <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-[7px] font-black uppercase tracking-widest rounded-full shadow-lg">YOU</div>}
                                </div>
                                <div className="flex-grow text-center md:text-left min-w-0 space-y-2">
                                   <div className="flex flex-col md:flex-row items-center gap-3">
                                      <h4 className="text-white text-lg font-bold truncate">{a.name}</h4>
                                      <span className="px-3 py-0.5 rounded-full bg-slate-800 text-slate-500 border border-slate-700 text-[8px] font-black uppercase tracking-widest">CURATOR STAFF</span>
                                   </div>
                                   <div className="flex wrap justify-center md:justify-start gap-x-6 gap-y-1 text-slate-500 text-sm">
                                      <span className="flex items-center gap-2"><Mail size={12} className="text-primary opacity-40"/> {a.email}</span>
                                      {a.phone && <span className="flex items-center gap-2"><Phone size={12} className="text-primary opacity-40"/> {a.phone}</span>}
                                   </div>
                                   <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
                                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">JURISDICTION:</span>
                                      <div className="flex flex-wrap gap-2">
                                         {a.permissions.length === 0 ? (
                                           <span className="text-[8px] font-black uppercase text-red-500/50">Restricted Link</span>
                                         ) : a.permissions.map(p => (
                                           <span key={p} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-500 text-[8px] font-bold uppercase tracking-tighter">{p.split('.').pop()}</span>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto shrink-0">
                                   <button onClick={() => { setAdminData(a); setEditingId(a.id); setShowAdminForm(true); }} className="flex-1 md:flex-none p-4 bg-slate-800/50 text-slate-400 rounded-2xl hover:bg-slate-700 hover:text-white transition-all"><Edit2 size={18}/></button>
                                   <button onClick={() => deleteData('admin_users', a.id)} className="flex-1 md:flex-none p-4 bg-slate-800/50 text-slate-400 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all" disabled={isCurrentUser}><Trash2 size={18}/></button>
                                </div>
                             </div>
                          </div>
                        );
                     })}
                  </div>
                )}
             </section>
           </div>
        )}
     </div>
    );
  };

  const renderTraining = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto text-left">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
         <div className="space-y-2">
            <h2 className="text-3xl font-serif text-white">Academy</h2>
            <p className="text-slate-400 text-sm">Curation marketing mastery across {trainingModules.length} channels.</p>
         </div>
         <div className="flex items-center gap-6">
            { isOwner && (
               <div className="flex items-center gap-3 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
                  <button 
                    onClick={() => setIsTrainingManagementMode(!isTrainingManagementMode)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isTrainingManagementMode ? 'bg-primary text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {isTrainingManagementMode ? <SettingsIcon size={14}/> : <Eye size={14}/>}
                    {isTrainingManagementMode ? 'Management Active' : 'Owner Control'}
                  </button>
               </div>
            )}
            {!isTrainingManagementMode && (
              <a href="https://www.youtube.com/results?search_query=fashion+affiliate+marketing+strategy" target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-colors flex items-center gap-2">
                <Video size={16}/> Mastering the Algorithm
              </a>
            )}
            {isTrainingManagementMode && (
               <button onClick={() => { setTrainingData({ title: '', platform: 'Instagram', description: '', strategies: [], actionItems: [], steps: [], icon: 'GraduationCap' }); setEditingId(null); setShowTrainingForm(true); }} className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3">
                  <Plus size={18} /> New Module
               </button>
            )}
         </div>
      </div>

      {showTrainingForm ? (
         <div className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-800 space-y-12 animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-xl">
                     <GraduationCap size={24}/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-white">{editingId ? 'Edit Syllabus' : 'Curate New Training'}</h3>
                    <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-black">Module Engineering Console</p>
                  </div>
               </div>
               <button onClick={() => setShowTrainingForm(false)} className="p-3 bg-slate-800 text-slate-500 rounded-full hover:text-white transition-colors"><X size={24}/></button>
            </div>

            <div className="grid md:grid-cols-2 gap-12 text-left">
               <div className="space-y-8">
                  <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 border-l-2 border-primary pl-4">I. Core Metadata</h4>
                  <SettingField label="Module Title" value={trainingData.title || ''} onChange={v => setTrainingData({...trainingData, title: v})} />
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Primary Platform</label>
                        <select className="w-full px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none text-sm appearance-none cursor-pointer" value={trainingData.platform} onChange={e => setTrainingData({...trainingData, platform: e.target.value as any})}>
                           {['Instagram', 'Pinterest', 'TikTok', 'WhatsApp', 'SEO', 'Facebook', 'YouTube', 'LinkedIn', 'Threads', 'Twitter', 'Snapchat', 'Email', 'General'].map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Module Icon</label>
                        <IconPicker selected={trainingData.icon || 'GraduationCap'} onSelect={v => setTrainingData({...trainingData, icon: v})} />
                     </div>
                  </div>
                  <SettingField label="High-Level Summary" value={trainingData.description || ''} onChange={v => setTrainingData({...trainingData, description: v})} type="textarea" />
               </div>

               <div className="space-y-8">
                  <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 border-l-2 border-primary pl-4">II. Strategem & Actions</h4>
                  <div className="bg-slate-800/20 p-6 rounded-3xl border border-slate-800/50 space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Add Strategies</label>
                        <div className="flex gap-2">
                           <input type="text" value={tempTrainingStrat} onChange={e => setTempTrainingStrat(e.target.value)} onKeyDown={e => (e.key === 'Enter') && (setTrainingData({...trainingData, strategies: [...(trainingData.strategies || []), tempTrainingStrat]}), setTempTrainingStrat(''))} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" placeholder="e.g. Optimized Reel Timings" />
                           <button onClick={() => { setTrainingData({...trainingData, strategies: [...(trainingData.strategies || []), tempTrainingStrat]}); setTempTrainingStrat(''); }} className="p-3 bg-primary text-slate-900 rounded-xl"><Plus size={20}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4">{(trainingData.strategies || []).map((s, i) => (<div key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300 border border-slate-700">{s} <button onClick={() => setTrainingData({...trainingData, strategies: trainingData.strategies?.filter((_, idx) => idx !== i)})} className="hover:text-red-500"><X size={12}/></button></div>))}</div>
                     </div>
                     <div className="space-y-2 pt-6 border-t border-slate-800">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Mandatory Action Items</label>
                        <div className="flex gap-2">
                           <input type="text" value={tempTrainingAction} onChange={e => setTempTrainingAction(e.target.value)} onKeyDown={e => (e.key === 'Enter') && (setTrainingData({...trainingData, actionItems: [...(trainingData.actionItems || []), tempTrainingAction]}), setTempTrainingAction(''))} className="flex-grow px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm outline-none" placeholder="e.g. Schedule 30 Pins" />
                           <button onClick={() => { setTrainingData({...trainingData, actionItems: [...(trainingData.actionItems || []), tempTrainingAction]}); setTempTrainingAction(''); }} className="p-3 bg-primary text-slate-900 rounded-xl"><Plus size={20}/></button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4">{(trainingData.actionItems || []).map((s, i) => (<div key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300 border border-slate-700">{s} <button onClick={() => setTrainingData({...trainingData, actionItems: trainingData.actionItems?.filter((_, idx) => idx !== i)})} className="hover:text-red-500"><X size={12}/></button></div>))}</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-12 border-t border-slate-800 text-left">
               <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2 border-l-2 border-primary pl-4 mb-8">III. Dynamic Step Builder</h4>
               <div className="space-y-8">
                  {(trainingData.steps || []).map((step, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 relative group/step animate-in slide-in-from-left duration-300">
                       <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-slate-900 flex items-center justify-center font-black shadow-xl z-10 border-4 border-slate-900">
                          {idx + 1}
                       </div>
                       <div className="absolute top-6 right-6">
                          <button onClick={() => {
                             const newSteps = [...(trainingData.steps || [])];
                             newSteps.splice(idx, 1);
                             setTrainingData({...trainingData, steps: newSteps});
                          }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                       </div>
                       
                       <div className="grid lg:grid-cols-12 gap-10">
                          <div className="lg:col-span-8 space-y-6">
                             <SettingField label="Step Heading" value={step.title} onChange={v => {
                                const newSteps = [...(trainingData.steps || [])];
                                newSteps[idx] = {...newSteps[idx], title: v};
                                setTrainingData({...trainingData, steps: newSteps});
                             }} />
                             <SettingField label="Methodology Instruction" value={step.description} onChange={v => {
                                const newSteps = [...(trainingData.steps || [])];
                                newSteps[idx] = {...newSteps[idx], description: v};
                                setTrainingData({...trainingData, steps: newSteps});
                             }} type="textarea" rows={4} />
                          </div>
                          <div className="lg:col-span-4 space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">Step Modality</label>
                                <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex">
                                   <button 
                                      onClick={() => {
                                        const newSteps = [...(trainingData.steps || [])];
                                        newSteps[idx] = {...newSteps[idx], type: 'image'};
                                        setTrainingData({...trainingData, steps: newSteps});
                                      }}
                                      className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${ (step.type === 'image') ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300' }`}
                                   >
                                      <Image size={10}/> Static
                                   </button>
                                   <button 
                                      onClick={() => {
                                        const newSteps = [...(trainingData.steps || [])];
                                        newSteps[idx] = {...newSteps[idx], type: 'video'};
                                        setTrainingData({...trainingData, steps: newSteps});
                                      }}
                                      className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${ (step.type === 'video') ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300' }`}
                                   >
                                      <PlayCircle size={10}/> Dynamic
                                   </button>
                                </div>
                             </div>
                             <SingleImageUploader 
                                label="Instructional Media" 
                                value={step.mediaUrl || ''} 
                                onChange={v => {
                                   const newSteps = [...(trainingData.steps || [])];
                                   newSteps[idx] = {...newSteps[idx], mediaUrl: v};
                                   setTrainingData({...trainingData, steps: newSteps});
                                }} 
                                accept={ (step.type === 'video') ? 'video/*' : 'image/*' }
                                className="w-full h-40 rounded-3xl"
                             />
                          </div>
                       </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => setTrainingData({...trainingData, steps: [...(trainingData.steps || []), { title: '', description: '', type: 'image' }]})}
                    className="w-full py-12 border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-600 hover:text-primary hover:border-primary/50 transition-all group"
                  >
                     <Plus className="group-hover:scale-125 transition-transform" size={48}/>
                     <span className="font-black uppercase text-xs tracking-widest">Append Deployment Step</span>
                  </button>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 pt-12 border-t border-slate-800">
               <button onClick={handleSaveTraining} className="flex-1 py-6 bg-primary text-slate-900 font-black uppercase text-xs rounded-2xl shadow-2xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">Synchronize Module</button>
               <button onClick={() => setShowTrainingForm(false)} className="flex-1 py-6 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-2xl hover:text-white transition-all">Cancel Draft</button>
            </div>
         </div>
      ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            { isLoadingTraining ? (
               <div className="col-span-full py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800 flex flex-col items-center">
                  <Loader2 className="animate-spin text-primary mb-4" size={48} />
                  <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Retrieving Syllabus...</p>
               </div>
            ) : (trainingModules.length === 0) ? (
               <div className="col-span-full text-center py-32 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800 text-slate-500">
                  No specialized training nodes deployed.
               </div>
            ) : trainingModules.map((module) => {
               const isExpanded = expandedTraining === module.id;
               return (
                  <div key={module.id} className={`bg-slate-900 border transition-all duration-300 overflow-hidden flex flex-col ${isExpanded ? 'lg:col-span-3 md:col-span-2 border-primary/50 shadow-2xl shadow-primary/10 rounded-[2.5rem]' : 'border-slate-800 hover:border-slate-600 rounded-[2rem]'}`}>
                     <div className="relative group/module">
                        <button onClick={() => setExpandedTraining(isExpanded ? null : module.id)} className="w-full p-6 md:p-8 flex items-start text-left group h-full">
                           <div className="flex items-start gap-4 md:gap-6 w-full">
                              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shrink-0 transition-transform group-hover:scale-105 ${ (module.platform === 'Pinterest') ? 'bg-red-600' : (module.platform === 'TikTok') ? 'bg-black border border-slate-700' : (module.platform === 'Instagram') ? 'bg-pink-600' : (module.platform === 'WhatsApp') ? 'bg-green-500' : (module.platform === 'SEO') ? 'bg-blue-600' : 'bg-slate-800 text-slate-300' }`}><IconRenderer icon={module.icon} size={28} /></div>
                              <div className="flex-grow min-w-0">
                                 <div className="flex justify-between items-start">
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-2">{module.title}</h3>
                                    {!isExpanded && <ChevronDown size={20} className="text-slate-500 mt-1" />}
                                 </div>
                                 <p className="text-slate-500 text-xs md:text-sm line-clamp-2">{module.description}</p>
                                 {!isExpanded && (<div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Training <ArrowRight size={12}/></div>)}
                              </div>
                           </div>
                        </button>
                        
                        { isTrainingManagementMode && !isExpanded && (
                           <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/module:opacity-100 transition-opacity">
                              <button onClick={(e) => { e.stopPropagation(); setTrainingData(module); setEditingId(module.id); setShowTrainingForm(true); }} className="p-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-primary hover:text-slate-900 transition-colors shadow-xl"><Edit2 size={14}/></button>
                              <button onClick={(e) => { e.stopPropagation(); if(confirm("Purge this training module?")) deleteData('training_modules', module.id); }} className="p-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-red-500 transition-colors shadow-xl"><Trash2 size={14}/></button>
                           </div>
                        )}
                     </div>

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
                           
                           { module.steps && (module.steps.length > 0) && (
                             <div className="mt-12 pt-12 border-t border-slate-800 space-y-8">
                                <h4 className="text-white font-black text-xs uppercase tracking-[0.4em] text-center">Implementation Steps</h4>
                                <div className="grid lg:grid-cols-2 gap-6">
                                   {module.steps.map((step, idx) => (
                                     <div key={idx} className="bg-slate-800/40 rounded-3xl p-8 border border-slate-800 flex flex-col gap-6 text-left">
                                        <div className="flex items-center gap-4">
                                           <span className="w-8 h-8 rounded-xl bg-primary text-slate-900 flex items-center justify-center font-black text-sm">{idx + 1}</span>
                                           <h5 className="text-white font-bold text-lg">{step.title}</h5>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                                        {step.mediaUrl && (
                                          <div className="mt-2 rounded-2xl overflow-hidden aspect-video bg-slate-950 border border-slate-700">
                                             { (step.type === 'video') ? <video src={step.mediaUrl} className="w-full h-full object-cover" controls muted /> : <img src={step.mediaUrl} className="w-full h-full object-cover" /> }
                                          </div>
                                        )}
                                     </div>
                                   ))}
                                </div>
                             </div>
                           )}

                           <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center">
                              { isTrainingManagementMode && (
                                 <div className="flex gap-2">
                                    <button onClick={() => { setTrainingData(module); setEditingId(module.id); setShowTrainingForm(true); }} className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-all flex items-center gap-2 border border-slate-700"><Edit2 size={14}/> Edit Syllabus</button>
                                    <button onClick={() => { if(confirm("Purge module?")) deleteData('training_modules', module.id); }} className="px-6 py-3 bg-slate-800 text-red-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-slate-700"><Trash2 size={14}/> Delete</button>
                                 </div>
                              )}
                              <button onClick={() => setExpandedTraining(null)} className="ml-auto px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-colors">Complete Session</button>
                           </div>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      )}
    </div>
  );

  const renderGuide = () => (
     <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 max-w-7xl mx-auto text-left w-full px-4 md:px-0">
        {/* Minimal Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24 md:mb-40 pt-12">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                 <Zap size={14}/> Launch Protocol
              </div>
              <h2 className="text-5xl md:text-9xl font-serif text-white leading-[0.8] tracking-tighter">
                 Architecture <br/>
                 <span className="text-primary italic font-light">Blueprint</span>
              </h2>
           </div>
           <div className="flex flex-col gap-6 md:items-end">
              <p className="text-slate-500 text-sm md:text-lg max-w-md md:text-right leading-relaxed font-light">
                 A sequential roadmap for transitioning from local prototype to a fully-synced global luxury bridge page.
              </p>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-2xl"
              >
                <Printer size={16} />
                Generate PDF Report
              </button>
           </div>
        </div>

        {/* Side-by-Side Steps */}
        <div className="space-y-32 md:space-y-64 print:space-y-12">
            {GUIDE_STEPS.map((step, idx) => (
                <div key={step.id} className="group print-break-inside-avoid">
                    <div className="grid md:grid-cols-12 gap-12 md:gap-24 items-start">
                        {/* Left Side: Number & Title */}
                        <div className="md:col-span-5 space-y-8 md:sticky md:top-40 print:static print:col-span-12 print:mb-4">
                            <div className="flex items-baseline gap-4">
                               <span className="text-6xl md:text-8xl font-serif text-primary/20 group-hover:text-primary/40 transition-colors duration-500 print:text-slate-300 print:text-4xl">
                                  {String(idx + 1).padStart(2, '0')}
                               </span>
                               <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight print:text-black print:text-2xl">
                                  {step.title.split('. ')[1] || step.title}
                               </h3>
                            </div>
                            <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-light print:text-slate-600 print:text-sm">
                               {step.description}
                            </p>
                            <div className="hidden md:block print:hidden">
                               <GuideIllustration id={step.illustrationId} />
                            </div>
                        </div>

                        {/* Right Side: Substeps & Code */}
                        <div className="md:col-span-7 space-y-12 print:col-span-12 print:space-y-4">
                            { (step.subSteps) && (
                                <div className="space-y-8 print:space-y-2">
                                    {step.subSteps.map((sub, i) => (
                                        <div key={i} className="flex items-start gap-6 group/item print:gap-3">
                                            <div className="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center shrink-0 mt-1 group-hover/item:border-primary group-hover/item:bg-primary/10 transition-all print:w-4 print:h-4 print:border-slate-300">
                                               <div className="w-1.5 h-1.5 rounded-full bg-primary scale-0 group-hover/item:scale-100 transition-transform print:scale-100 print:bg-slate-400" />
                                            </div>
                                            <span className="text-slate-300 text-base md:text-lg leading-relaxed font-light print:text-black print:text-sm">
                                               {sub}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className="md:hidden mt-12 print:hidden">
                               <GuideIllustration id={step.illustrationId} />
                            </div>

                            { (step.code) && (
                               <div className="pt-8 print:pt-2">
                                  <CodeBlock code={step.code} label={step.codeLabel} />
                               </div>
                            )}
                        </div>
                    </div>
                    {idx < GUIDE_STEPS.length - 1 && (
                       <div className="mt-32 md:mt-64 h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50 print:hidden" />
                    )}
                </div>
            ))}
        </div>
     </div>
  );

  const renderSiteEditor = () => (
     <div className="space-y-6 w-full max-w-7xl mx-auto text-left">
       <AdminTip title="Canvas Editor">Control your site's visual identity. Publishing changes here will synchronize with Supabase and update for all visitors.</AdminTip>
       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
          {[ 
            {id: 'brand', label: 'Identity', icon: Globe, desc: 'Logo, Colors, Slogan'}, 
            {id: 'nav', label: 'Navigation', icon: MapPin, desc: 'Menu Labels, Layout'}, 
            {id: 'home', label: 'Home Page', icon: Layout, desc: 'Hero, About, Trust Strip'}, 
            {id: 'collections', label: 'Collections', icon: ShoppingBag, desc: 'Shop Hero, Categories Style'}, 
            {id: 'about', label: 'About Page', icon: User, desc: 'Story, Values, Gallery'}, 
            {id: 'contact', label: 'Contact Page', icon: Mail, desc: 'Info, Form, Socials'}, 
            {id: 'login', label: 'Login Page', icon: Lock, desc: 'Auth Experience visuals'},
            {id: 'legal', label: 'Legal Text', icon: Shield, desc: 'Privacy, Terms, Disclosure'}, 
            {id: 'integrations', label: 'Integrations', icon: LinkIcon, desc: 'Tracking, Webhooks'} 
          ].map(s => {
            const SIcon = s.icon;
            return ( 
              <button key={s.id} onClick={() => handleOpenEditor(s.id)} className="bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-left border border-slate-800 hover:border-primary/50 hover:bg-slate-800 transition-all group h-full flex flex-col justify-between">
                 <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-primary group-hover:text-slate-900 transition-colors shadow-lg"><SIcon size={24}/></div><div><h3 className="text-white font-bold text-xl mb-1">{s.label}</h3><p className="text-slate-500 text-xs">{s.desc}</p></div><div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest edit-hover transition-opacity">Edit Section <ArrowRight size={12}/></div>
              </button> 
            );
          })}
       </div>
       <style>{`.edit-hover { opacity: 0; } .group:hover .edit-hover { opacity: 1; }`}</style>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 md:pt-32 pb-32 w-full overflow-x-hidden print:bg-white print:pt-0 print:pb-0">
      <style>{` 
        @keyframes grow { from { height: 0; } to { height: 100%; } } 
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } } 
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-break-inside-avoid { break-inside: avoid; }
          .print-m-0 { margin: 0 !important; }
          .print-p-0 { padding: 0 !important; }
        }
      `}</style>
      <SaveIndicator status={saveStatus} />
      { (selectedAdProduct) && <AdGeneratorModal product={selectedAdProduct} onClose={() => setSelectedAdProduct(null)} /> }

      <header className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8 text-left w-full">
        <div className="flex flex-col gap-6 text-left"><div className="flex items-center gap-4"><h1 className="text-3xl md:text-6xl font-serif text-white tracking-tighter">Maison <span className="text-primary italic font-light">Portal</span></h1><div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em]">{isOwner ? 'SYSTEM OWNER' : 'ADMINISTRATOR'}</div></div></div>
        <div className="flex flex-col xl:flex-row gap-4 w-full xl:w-auto">
          <div className="relative">
            <button 
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-white hover:bg-slate-800 transition-all shadow-xl group w-full md:w-64"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-slate-900 transition-colors">
                <Menu size={18} />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Active View</span>
                <span className="text-sm font-bold uppercase tracking-widest">{visibleTabs.find(t => t.id === activeTab)?.label}</span>
              </div>
              <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${isNavOpen ? 'rotate-180' : ''}`} />
            </button>

            {isNavOpen && (
              <>
                <div className="fixed inset-0 z-[80]" onClick={() => setIsNavOpen(false)} />
                <div className="absolute top-full left-0 mt-2 w-full md:w-72 bg-white/80 backdrop-blur-2xl border border-slate-100 rounded-3xl shadow-2xl z-[90] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-2 grid gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {visibleTabs.map(tab => {
                      const TabIcon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button 
                          key={tab.id} 
                          onClick={() => { setActiveTab(tab.id); setIsNavOpen(false); }} 
                          className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-left group ${isActive ? 'bg-primary text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-slate-900/5' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                            <TabIcon size={18} />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-widest">{tab.label}</span>
                          {isActive && <Check size={14} className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full md:w-fit">
            <div className="flex gap-2">
              <Link 
                to="/" 
                className="flex flex-1 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-primary hover:text-slate-900 transition-all justify-center"
              >
                <Eye size={14} /> View Website
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-red-500 hover:text-white transition-all justify-center"
              >
                <LogOut size={14} /> Exit
              </button>
            </div>
            <button 
              onClick={() => updateSettings({ isMaintenanceMode: !settings.isMaintenanceMode })}
              className={`flex px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 transition-all w-full justify-center ${
                settings.isMaintenanceMode 
                  ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-yellow-500/50 hover:text-yellow-500'
              }`}
            >
              <AlertTriangle size={14} /> 
              <span className="flex items-center gap-1.5">
                {settings.isMaintenanceMode ? 'Maintenance: ON' : 'Maintenance Mode'}
                <span className="px-1.5 py-0.5 bg-black/20 rounded text-[7px] font-black tracking-tighter opacity-70">GLOBAL</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20 w-full overflow-x-hidden text-left">
        { (activeTab === 'enquiries') && renderEnquiries() }
        { (activeTab === 'orders') && renderOrders() }
        { (activeTab === 'clients') && renderClients() }
        { (activeTab === 'analytics') && renderAnalytics() }
        { (activeTab === 'catalog') && renderCatalog() }
        { (activeTab === 'media') && <MediaTab /> }
        { (activeTab === 'reviews') && <ReviewsTab /> }
        { (activeTab === 'hero') && renderHero() }
        { (activeTab === 'categories') && renderCategories() }
        { (activeTab === 'site_editor') && renderSiteEditor() }
        { (activeTab === 'team') && renderTeam() }
        { (activeTab === 'training') && renderTraining() }
        { (activeTab === 'system') && renderSystem() }
        { (activeTab === 'guide') && renderGuide() }
        { (activeTab === 'seo') && renderSEO() }
      </main>

      {editorDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-950 h-full overflow-y-auto border-l border-slate-800 p-6 md:p-12 text-left shadow-2xl slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                <div>
                  <h3 className="text-3xl font-serif text-white mb-2">
                    { (activeEditorSection === 'brand') && 'Brand Identity' }
                    { (activeEditorSection === 'nav') && 'Navigation & Layout' }
                    { (activeEditorSection === 'home') && 'Home Page' }
                    { (activeEditorSection === 'collections') && 'Collections Page' }
                    { (activeEditorSection === 'about') && 'About Page' }
                    { (activeEditorSection === 'contact') && 'Contact Page' }
                    { (activeEditorSection === 'login') && 'Login Experience' }
                    { (activeEditorSection === 'legal') && 'Legal & Policy' }
                    { (activeEditorSection === 'integrations') && 'Integrations' }
                  </h3>
                  <p className="text-slate-500 text-sm">Real-time configuration.</p>
                </div>
                <button onClick={() => setEditorDrawerOpen(false)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800"><X size={24} /></button>
             </div>
             <div className="space-y-8 text-left">
               { (activeEditorSection === 'brand') && (
                 <>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Core Branding</h4><SettingField label="Company Name" value={tempSettings.companyName} onChange={v => updateTempSettings({ companyName: v })} /><SettingField label="Slogan / Tagline" value={tempSettings.slogan} onChange={v => updateTempSettings({ slogan: v })} /></div>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Visual Assets</h4><div className="grid grid-cols-2 gap-6"><SettingField label="Logo Text (Fallback)" value={tempSettings.companyLogo} onChange={v => updateTempSettings({ companyLogo: v })} /><SingleImageUploader label="Logo Image (PNG)" value={tempSettings.companyLogoUrl || ''} onChange={v => updateTempSettings({ companyLogoUrl: v })} /></div></div>
                   <div className="space-y-6"><h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Palette (Hex Codes)</h4><div className="grid grid-cols-3 gap-4"><SettingField label="Primary (Gold)" value={tempSettings.primaryColor} onChange={v => updateTempSettings({ primaryColor: v })} type="color" /><SettingField label="Secondary (Dark)" value={tempSettings.secondaryColor} onChange={v => updateTempSettings({ secondaryColor: v })} type="color" /><SettingField label="Accent" value={tempSettings.accentColor} onChange={v => updateTempSettings({ accentColor: v })} type="color" /></div></div>
                 </>
               )}
               { (activeEditorSection === 'nav') && (
                  <>
                    <div className="space-y-6">
                      <h4 className="text-white font-bold">Menu Labels</h4>
                      <SettingField label="Home Label" value={tempSettings.navHomeLabel} onChange={v => updateTempSettings({ navHomeLabel: v })} />
                      <SettingField label="Collections Label" value={tempSettings.navProductsLabel} onChange={v => updateTempSettings({ navProductsLabel: v })} />
                      <SettingField label="About Label" value={tempSettings.navAboutLabel} onChange={v => updateTempSettings({ navAboutLabel: v })} />
                      <SettingField label="Contact Label" value={tempSettings.navContactLabel} onChange={v => updateTempSettings({ navContactLabel: v })} />
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold flex items-center gap-2"><Layout size={18} className="text-primary"/> Structural Overrides</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Departments Layout</label>
                          <select 
                            className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" 
                            value={tempSettings.departmentsLayout || 'grid'} 
                            onChange={e => updateTempSettings({ departmentsLayout: e.target.value as any })}
                          >
                            <option value="grid">Classic Grid (Main Section)</option>
                            <option value="dropdown">Navigation Dropdown (Header)</option>
                          </select>
                          <p className="text-[10px] text-slate-500 italic mt-1">* Dropdown mode moves department links into a hover menu in the top navigation bar.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Header Navigation Style</label>
                          <select 
                            className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" 
                            value={tempSettings.navStyle || 'classic'} 
                            onChange={e => updateTempSettings({ navStyle: e.target.value as any })}
                          >
                            <option value="classic">Classic (Centered)</option>
                            <option value="modern">Modern (Left Aligned)</option>
                            <option value="minimal">Minimal (Floating Pill)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">Footer Content</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Nav Header" value={tempSettings.footerNavHeader} onChange={v => updateTempSettings({ footerNavHeader: v })} />
                        <SettingField label="Policy Header" value={tempSettings.footerPolicyHeader} onChange={v => updateTempSettings({ footerPolicyHeader: v })} />
                      </div>
                      <SettingField label="Footer Description" value={tempSettings.footerDescription} onChange={v => updateTempSettings({ footerDescription: v })} type="textarea" />
                      <div className="mt-4">
                        <SettingField label="Copyright Text" value={tempSettings.footerCopyrightText} onChange={v => updateTempSettings({ footerCopyrightText: v })} />
                        <SettingField label="Creator Role Label" value={tempSettings.footerCreatorRole} onChange={v => updateTempSettings({ footerCreatorRole: v })} />
                        <SettingField label="Socials Label" value={tempSettings.footerSocialsLabel} onChange={v => updateTempSettings({ footerSocialsLabel: v })} />
                      </div>
                    </div>
                  </>
               )}
               { (activeEditorSection === 'home') && (
                  <>
                    <div className="space-y-6">
                      <h4 className="text-white font-bold">Hero & Niches</h4>
                      <SettingField label="Hero Badge Text" value={tempSettings.homeHeroBadge} onChange={v => updateTempSettings({ homeHeroBadge: v })} />
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Niche Header" value={tempSettings.homeNicheHeader} onChange={v => updateTempSettings({ homeNicheHeader: v })} />
                        <SettingField label="Niche Subheader" value={tempSettings.homeNicheSubheader} onChange={v => updateTempSettings({ homeNicheSubheader: v })} />
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">About Section</h4>
                      <SettingField label="Title" value={tempSettings.homeAboutTitle} onChange={v => updateTempSettings({ homeAboutTitle: v })} />
                      <SettingField label="Description" value={tempSettings.homeAboutDescription} onChange={v => updateTempSettings({ homeAboutDescription: v })} type="textarea" />
                      <SingleImageUploader label="About Section Image" value={tempSettings.homeAboutImage} onChange={v => updateTempSettings({ homeAboutImage: v })} />
                      <SettingField label="Button Text" value={tempSettings.homeAboutCta} onChange={v => updateTempSettings({ homeAboutCta: v })} />
                    </div>
                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">Category Section</h4>
                      <SettingField label="Category Section Title" value={tempSettings.homeCategorySectionTitle} onChange={v => updateTempSettings({ homeCategorySectionTitle: v })} />
                      <SettingField label="Category Section Subtitle" value={tempSettings.homeCategorySectionSubtitle} onChange={v => updateTempSettings({ homeCategorySectionSubtitle: v })} />
                    </div>
                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">Trust Signals</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Trust Header" value={tempSettings.homeTrustHeader} onChange={v => updateTempSettings({ homeTrustHeader: v })} />
                        <SettingField label="Trust Subheader" value={tempSettings.homeTrustSubheader} onChange={v => updateTempSettings({ homeTrustSubheader: v })} />
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                          <SettingField label="Item 1 Title" value={tempSettings.homeTrustItem1Title} onChange={v => updateTempSettings({ homeTrustItem1Title: v })} />
                          <SettingField label="Item 1 Desc" value={tempSettings.homeTrustItem1Desc} onChange={v => updateTempSettings({ homeTrustItem1Desc: v })} />
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label>
                          <IconPicker selected={tempSettings.homeTrustItem1Icon} onSelect={v => updateTempSettings({ homeTrustItem1Icon: v })} />
                        </div>
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                          <SettingField label="Item 2 Title" value={tempSettings.homeTrustItem2Title} onChange={v => updateTempSettings({ homeTrustItem2Title: v })} />
                          <SettingField label="Item 2 Desc" value={tempSettings.homeTrustItem2Desc} onChange={v => updateTempSettings({ homeTrustItem2Desc: v })} />
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label>
                          <IconPicker selected={tempSettings.homeTrustItem2Icon} onSelect={v => updateTempSettings({ homeTrustItem2Icon: v })} />
                        </div>
                        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                          <SettingField label="Item 3 Title" value={tempSettings.homeTrustItem3Title} onChange={v => updateTempSettings({ homeTrustItem3Title: v })} />
                          <SettingField label="Item 3 Desc" value={tempSettings.homeTrustItem3Desc} onChange={v => updateTempSettings({ homeTrustItem3Desc: v })} />
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2 block">Icon</label>
                          <IconPicker selected={tempSettings.homeTrustItem3Icon} onSelect={v => updateTempSettings({ homeTrustItem3Icon: v })} />
                        </div>
                      </div>
                      <SettingField label="Read Story Button" value={tempSettings.homeReadStoryBtn} onChange={v => updateTempSettings({ homeReadStoryBtn: v })} />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <SettingField label="About Curator Label" value={tempSettings.homeAboutCuratorLabel} onChange={v => updateTempSettings({ homeAboutCuratorLabel: v })} />
                        <SettingField label="About Narrative Label" value={tempSettings.homeAboutNarrativeLabel} onChange={v => updateTempSettings({ homeAboutNarrativeLabel: v })} />
                        <SettingField label="Category Shop By Label" value={tempSettings.homeCategoryShopByLabel} onChange={v => updateTempSettings({ homeCategoryShopByLabel: v })} />
                        <SettingField label="Category Portfolio Label" value={tempSettings.homeCategoryPortfolioLabel} onChange={v => updateTempSettings({ homeCategoryPortfolioLabel: v })} />
                        <SettingField label="Category Discover Label" value={tempSettings.homeCategoryDiscoverLabel} onChange={v => updateTempSettings({ homeCategoryDiscoverLabel: v })} />
                      </div>
                    </div>
                  </>
               )}
               { (activeEditorSection === 'collections') && (
                  <>
                    <SettingField label="Hero Title" value={tempSettings.productsHeroTitle} onChange={v => updateTempSettings({ productsHeroTitle: v })} />
                    <SettingField label="Hero Subtitle" value={tempSettings.productsHeroSubtitle} onChange={v => updateTempSettings({ productsHeroSubtitle: v })} type="textarea" />
                    
                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold flex items-center gap-2"><Layers size={18} className="text-primary"/> Discovery Layout</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Subcategory Navigation Style</label>
                          <select 
                            className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" 
                            value={tempSettings.subcategoryLayout || 'wrapped'} 
                            onChange={e => updateTempSettings({ subcategoryLayout: e.target.value as any })}
                          >
                            <option value="wrapped">Default (Wrapped Flow)</option>
                            <option value="scrollable-rows">Infinite Row Scroll (3-4 Balanced Rows)</option>
                          </select>
                          <p className="text-[10px] text-slate-500 italic mt-1">* Balanced row mode organizes subcategories into dense, high-efficiency horizontal scroll areas.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Category Card Style</label>
                          <select 
                            className="w-full px-4 md:px-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none" 
                            value={tempSettings.categoryCardStyle || 'minimal'} 
                            onChange={e => updateTempSettings({ categoryCardStyle: e.target.value as any })}
                          >
                            <option value="minimal">Minimal (Text Only)</option>
                            <option value="detailed">Detailed (Image + Description)</option>
                            <option value="glass">Glassmorphism (Frosted Overlay)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <MultiImageUploader label="Hero Carousel Images" images={tempSettings.productsHeroImages || [tempSettings.productsHeroImage]} onChange={v => updateTempSettings({ productsHeroImages: v, productsHeroImage: (v[0] || '') })} />
                      <SettingField label="Search Placeholder" value={tempSettings.productsSearchPlaceholder} onChange={v => updateTempSettings({ productsSearchPlaceholder: v })} />
                      <SettingField label="Department Label" value={tempSettings.productsDeptLabel} onChange={v => updateTempSettings({ productsDeptLabel: v })} />
                      <SettingField label="All Collections Label" value={tempSettings.productsAllCollectionsLabel} onChange={v => updateTempSettings({ productsAllCollectionsLabel: v })} />
                      <SettingField label="Browse Everything Label" value={tempSettings.productsBrowseEverythingLabel} onChange={v => updateTempSettings({ productsBrowseEverythingLabel: v })} />
                      <SettingField label="Niches Label" value={tempSettings.productsNichesLabel} onChange={v => updateTempSettings({ productsNichesLabel: v })} />
                      <SettingField label="Clear Filter Label" value={tempSettings.productsClearFilterLabel} onChange={v => updateTempSettings({ productsClearFilterLabel: v })} />
                      <SettingField label="Show All Label" value={tempSettings.productsShowAllLabel} onChange={v => updateTempSettings({ productsShowAllLabel: v })} />
                      <SettingField label="Selections Label" value={tempSettings.productsSelectionsLabel} onChange={v => updateTempSettings({ productsSelectionsLabel: v })} />
                      <SettingField label="Product Ref Label" value={tempSettings.productRefLabel} onChange={v => updateTempSettings({ productRefLabel: v })} />
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Sort Latest Label" value={tempSettings.sortLatestLabel} onChange={v => updateTempSettings({ sortLatestLabel: v })} />
                        <SettingField label="Sort Price Low Label" value={tempSettings.sortPriceLowLabel} onChange={v => updateTempSettings({ sortPriceLowLabel: v })} />
                        <SettingField label="Sort Price High Label" value={tempSettings.sortPriceHighLabel} onChange={v => updateTempSettings({ sortPriceHighLabel: v })} />
                        <SettingField label="Sort Name Label" value={tempSettings.sortNameLabel} onChange={v => updateTempSettings({ sortNameLabel: v })} />
                      </div>
                      <SettingField label="Empty State Title" value={tempSettings.emptyProductsTitle} onChange={v => updateTempSettings({ emptyProductsTitle: v })} />
                      <SettingField label="Empty State Message" value={tempSettings.productsEmptyMessage} onChange={v => updateTempSettings({ productsEmptyMessage: v })} />
                      <SettingField label="Empty State Reset Label" value={tempSettings.emptyProductsResetLabel} onChange={v => updateTempSettings({ emptyProductsResetLabel: v })} />
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">Product Detail Labels</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Buy Button Label" value={tempSettings.productAcquisitionLabel} onChange={v => updateTempSettings({ productAcquisitionLabel: v })} />
                        <SettingField label="Specs Title Label" value={tempSettings.productSpecsLabel} onChange={v => updateTempSettings({ productSpecsLabel: v })} />
                        <SettingField label="Price Label" value={tempSettings.productPriceLabel} onChange={v => updateTempSettings({ productPriceLabel: v })} />
                        <SettingField label="Last Updated Label" value={tempSettings.productLastUpdatedLabel} onChange={v => updateTempSettings({ productLastUpdatedLabel: v })} />
                        <SettingField label="Merchant Verified Label" value={tempSettings.productMerchantVerifiedLabel} onChange={v => updateTempSettings({ productMerchantVerifiedLabel: v })} />
                        <SettingField label="Not Found Title" value={tempSettings.productNotFoundTitle} onChange={v => updateTempSettings({ productNotFoundTitle: v })} />
                        <SettingField label="Not Found CTA" value={tempSettings.productNotFoundCta} onChange={v => updateTempSettings({ productNotFoundCta: v })} />
                        <SettingField label="Related Products Title" value={tempSettings.relatedProductsTitle} onChange={v => updateTempSettings({ relatedProductsTitle: v })} />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">Review Section Labels</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Section Title" value={tempSettings.reviewSectionTitle} onChange={v => updateTempSettings({ reviewSectionTitle: v })} />
                        <SettingField label="Write CTA" value={tempSettings.reviewWriteCta} onChange={v => updateTempSettings({ reviewWriteCta: v })} />
                        <SettingField label="Count Label" value={tempSettings.reviewCountLabel} onChange={v => updateTempSettings({ reviewCountLabel: v })} />
                        <SettingField label="Rating Label" value={tempSettings.reviewRatingLabel} onChange={v => updateTempSettings({ reviewRatingLabel: v })} />
                        <SettingField label="Identity Label" value={tempSettings.reviewIdentityLabel} onChange={v => updateTempSettings({ reviewIdentityLabel: v })} />
                        <SettingField label="Identity Placeholder" value={tempSettings.reviewIdentityPlaceholder} onChange={v => updateTempSettings({ reviewIdentityPlaceholder: v })} />
                        <SettingField label="Comment Placeholder" value={tempSettings.reviewCommentPlaceholder} onChange={v => updateTempSettings({ reviewCommentPlaceholder: v })} />
                        <SettingField label="Submit Label" value={tempSettings.reviewSubmitLabel} onChange={v => updateTempSettings({ reviewSubmitLabel: v })} />
                        <SettingField label="Submitting Label" value={tempSettings.reviewSubmittingLabel} onChange={v => updateTempSettings({ reviewSubmittingLabel: v })} />
                        <SettingField label="Empty Message" value={tempSettings.emptyReviewsMessage} onChange={v => updateTempSettings({ emptyReviewsMessage: v })} />
                        <SettingField label="Default Name" value={tempSettings.reviewDefaultName} onChange={v => updateTempSettings({ reviewDefaultName: v })} />
                      </div>
                    </div>
                  </>
               )}
               { (activeEditorSection === 'about') && (
                  <>
                    <SettingField label="Hero Title" value={tempSettings.aboutHeroTitle} onChange={v => updateTempSettings({ aboutHeroTitle: v })} />
                    <SettingField label="Hero Subtitle" value={tempSettings.aboutHeroSubtitle} onChange={v => updateTempSettings({ aboutHeroSubtitle: v })} type="textarea" />
                    <SingleImageUploader label="Main Hero Image" value={tempSettings.aboutMainImage} onChange={v => updateTempSettings({ aboutMainImage: v })} />
                    <div className="grid grid-cols-3 gap-4">
                      <SettingField label="Est. Year" value={tempSettings.aboutEstablishedYear} onChange={v => updateTempSettings({ aboutEstablishedYear: v })} />
                      <SettingField label="Founder" value={tempSettings.aboutFounderName} onChange={v => updateTempSettings({ aboutFounderName: v })} />
                      <SettingField label="Location" value={tempSettings.aboutLocation} onChange={v => updateTempSettings({ aboutLocation: v })} />
                    </div>
                    <SettingField label="History Title" value={tempSettings.aboutHistoryTitle} onChange={v => updateTempSettings({ aboutHistoryTitle: v })} />
                    <SettingField label="Manifesto Title" value={tempSettings.aboutManifestoTitle} onChange={v => updateTempSettings({ aboutManifestoTitle: v })} />
                    <SettingField label="History Body" value={tempSettings.aboutHistoryBody} onChange={v => updateTempSettings({ aboutHistoryBody: v })} type="textarea" rows={8} />
                    <SingleImageUploader label="Founder Signature (Transparent PNG)" value={tempSettings.aboutSignatureImage} onChange={v => updateTempSettings({ aboutSignatureImage: v })} className="h-24 w-full object-contain" />
                    <h4 className="text-white font-bold border-t border-slate-800 pt-6">Values & Gallery</h4>
                    <SettingField label="Mission Title" value={tempSettings.aboutMissionTitle} onChange={v => updateTempSettings({ aboutMissionTitle: v })} />
                    <SettingField label="Mission Body" value={tempSettings.aboutMissionBody} onChange={v => updateTempSettings({ aboutMissionBody: v })} type="textarea" />
                    <SettingField label="Community Title" value={tempSettings.aboutCommunityTitle} onChange={v => updateTempSettings({ aboutCommunityTitle: v })} />
                    <SettingField label="Community Body" value={tempSettings.aboutCommunityBody} onChange={v => updateTempSettings({ aboutCommunityBody: v })} type="textarea" />
                    <SettingField label="Integrity Title" value={tempSettings.aboutIntegrityTitle} onChange={v => updateTempSettings({ aboutIntegrityTitle: v })} />
                    <SettingField label="Integrity Body" value={tempSettings.aboutIntegrityBody} onChange={v => updateTempSettings({ aboutIntegrityBody: v })} type="textarea" />
                    <MultiImageUploader label="Gallery Images" images={tempSettings.aboutGalleryImages} onChange={v => updateTempSettings({ aboutGalleryImages: v })} />
                  </>
               )}
               { (activeEditorSection === 'contact') && (
                  <>
                    <SettingField label="Hero Title" value={tempSettings.contactHeroTitle} onChange={v => updateTempSettings({ contactHeroTitle: v })} />
                    <SettingField label="Hero Subtitle" value={tempSettings.contactHeroSubtitle} onChange={v => updateTempSettings({ contactHeroSubtitle: v })} type="textarea" />
                    <div className="grid grid-cols-2 gap-4">
                      <SettingField label="Email" value={tempSettings.contactEmail} onChange={v => updateTempSettings({ contactEmail: v })} />
                      <SettingField label="Phone" value={tempSettings.contactPhone} onChange={v => updateTempSettings({ contactPhone: v })} />
                    </div>
                    <SettingField label="WhatsApp (No Spaces)" value={tempSettings.whatsappNumber} onChange={v => updateTempSettings({ whatsappNumber: v })} />
                    <SettingField label="Physical Address" value={tempSettings.address} onChange={v => updateTempSettings({ address: v })} type="textarea" />
                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">Contact Info Labels</h4>
                      <SettingField label="Info Title" value={tempSettings.contactInfoTitle} onChange={v => updateTempSettings({ contactInfoTitle: v })} />
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Address Label" value={tempSettings.contactAddressLabel} onChange={v => updateTempSettings({ contactAddressLabel: v })} />
                        <SettingField label="Hours Label" value={tempSettings.contactHoursLabel} onChange={v => updateTempSettings({ contactHoursLabel: v })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Weekdays Hours" value={tempSettings.contactHoursWeekdays} onChange={v => updateTempSettings({ contactHoursWeekdays: v })} />
                        <SettingField label="Weekends Hours" value={tempSettings.contactHoursWeekends} onChange={v => updateTempSettings({ contactHoursWeekends: v })} />
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <FaqsManager faqs={tempSettings.contactFaqs || []} onChange={v => updateTempSettings({ contactFaqs: v })} />
                    </div>
                    <h4 className="text-white font-bold border-t border-slate-800 pt-6">Form Labels</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <SettingField label="Name Label" value={tempSettings.contactFormNameLabel} onChange={v => updateTempSettings({ contactFormNameLabel: v })} />
                      <SettingField label="Email Label" value={tempSettings.contactFormEmailLabel} onChange={v => updateTempSettings({ contactFormEmailLabel: v })} />
                      <SettingField label="Subject Label" value={tempSettings.contactFormSubjectLabel} onChange={v => updateTempSettings({ contactFormSubjectLabel: v })} />
                      <SettingField label="Message Label" value={tempSettings.contactFormMessageLabel} onChange={v => updateTempSettings({ contactFormMessageLabel: v })} />
                    </div>
                    <SettingField label="Button Text" value={tempSettings.contactFormButtonText} onChange={v => updateTempSettings({ contactFormButtonText: v })} />
                    <SettingField label="Success Title" value={tempSettings.contactSuccessTitle} onChange={v => updateTempSettings({ contactSuccessTitle: v })} />
                    <SettingField label="Success Message" value={tempSettings.contactSuccessMessage} onChange={v => updateTempSettings({ contactSuccessMessage: v })} />
                    <SettingField label="Submit New Button" value={tempSettings.contactSubmitNewBtn} onChange={v => updateTempSettings({ contactSubmitNewBtn: v })} />
                    <SettingField label="Verified Label" value={tempSettings.contactVerifiedLabel} onChange={v => updateTempSettings({ contactVerifiedLabel: v })} />
                    <SettingField label="Concierge Label" value={tempSettings.contactConciergeLabel} onChange={v => updateTempSettings({ contactConciergeLabel: v })} />
                    <SettingField label="WhatsApp Label" value={tempSettings.contactWhatsappLabel} onChange={v => updateTempSettings({ contactWhatsappLabel: v })} />
                    <SettingField label="Follow Us Label" value={tempSettings.contactFollowUsLabel} onChange={v => updateTempSettings({ contactFollowUsLabel: v })} />
                    <SettingField label="FAQ Title" value={tempSettings.contactFaqTitle} onChange={v => updateTempSettings({ contactFaqTitle: v })} />
                    <SettingField label="Last Updated Label" value={tempSettings.contactLastUpdatedLabel} onChange={v => updateTempSettings({ contactLastUpdatedLabel: v })} />
                    <h4 className="text-white font-bold border-t border-slate-800 pt-6">Socials</h4>
                    <SocialLinksManager links={tempSettings.socialLinks || []} onChange={v => updateTempSettings({ socialLinks: v })} />
                  </>
               )}
               { (activeEditorSection === 'login') && (
                  <>
                    <div className="space-y-6">
                      <h4 className="text-white font-bold flex items-center gap-2"><Lock size={18} className="text-primary"/> Hero Content</h4>
                      <SettingField label="Hero Badge" value={tempSettings.loginHeroBadge || ''} onChange={v => updateTempSettings({ loginHeroBadge: v })} />
                      <SettingField label="Login Title" value={tempSettings.loginHeroTitle || ''} onChange={v => updateTempSettings({ loginHeroTitle: v })} />
                      <SettingField label="Login Description" value={tempSettings.loginHeroDescription || ''} onChange={v => updateTempSettings({ loginHeroDescription: v })} type="textarea" />
                      <SingleImageUploader label="Login Hero Image" value={tempSettings.adminLoginHeroImage || ''} onChange={v => updateTempSettings({ adminLoginHeroImage: v })} />
                      
                      <div className="flex items-center gap-4 mt-6">
                         <input 
                            type="checkbox" 
                            checked={tempSettings.adminLoginAccentEnabled || false} 
                            onChange={e => updateTempSettings({ adminLoginAccentEnabled: e.target.checked })} 
                            className="w-5 h-5 rounded border-slate-700 bg-slate-900"
                         />
                         <span className="text-white font-bold text-sm">Enable Primary Glow Effect</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <h4 className="text-white font-bold">Form Labels & Placeholders</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Email Label" value={tempSettings.loginEmailLabel || ''} onChange={v => updateTempSettings({ loginEmailLabel: v })} />
                        <SettingField label="Email Placeholder" value={tempSettings.loginEmailPlaceholder || ''} onChange={v => updateTempSettings({ loginEmailPlaceholder: v })} />
                        <SettingField label="Password Label" value={tempSettings.loginPasswordLabel || ''} onChange={v => updateTempSettings({ loginPasswordLabel: v })} />
                        <SettingField label="Password Placeholder" value={tempSettings.loginPasswordPlaceholder || ''} onChange={v => updateTempSettings({ loginPasswordPlaceholder: v })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <SettingField label="Submit Button" value={tempSettings.loginSubmitLabel || ''} onChange={v => updateTempSettings({ loginSubmitLabel: v })} />
                        <SettingField label="Google Button" value={tempSettings.loginGoogleLabel || ''} onChange={v => updateTempSettings({ loginGoogleLabel: v })} />
                      </div>
                      <SettingField label="Divider Text" value={tempSettings.loginDividerLabel || ''} onChange={v => updateTempSettings({ loginDividerLabel: v })} />
                    </div>
                  </>
               )}
               { (activeEditorSection === 'legal') && (
                  <>
                    <div className="space-y-6">
                      <h4 className="text-white font-bold">Disclosure</h4>
                      <SettingField label="Title" value={tempSettings.disclosureTitle} onChange={v => updateTempSettings({ disclosureTitle: v })} />
                      <SettingField label="Content" value={tempSettings.disclosureContent} onChange={v => updateTempSettings({ disclosureContent: v })} type="richtext" />
                    </div>
                    <div className="space-y-6 pt-6 border-t border-slate-800">
                      <h4 className="text-white font-bold">Privacy Policy</h4>
                      <SettingField label="Title" value={tempSettings.privacyTitle} onChange={v => updateTempSettings({ privacyTitle: v })} />
                      <SettingField label="Content" value={tempSettings.privacyContent} onChange={v => updateTempSettings({ privacyContent: v })} type="richtext" />
                    </div>
                    <div className="space-y-6 pt-6 border-t border-slate-800">
                      <h4 className="text-white font-bold">Terms of Service</h4>
                      <SettingField label="Title" value={tempSettings.termsTitle} onChange={v => updateTempSettings({ termsTitle: v })} />
                      <SettingField label="Content" value={tempSettings.termsContent} onChange={v => updateTempSettings({ termsContent: v })} type="richtext" />
                    </div>
                  </>
               )}
               { (activeEditorSection === 'integrations') && (
                  <>
                    <AdminTip title="Third-Party Tracking">
                       Add your tracking IDs here. These scripts will automatically inject into the head of your site for analytics and retargeting.
                    </AdminTip>
                    <IntegrationGuide />
                    <div className="space-y-6">
                       <h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Analytics & Pixels</h4>
                       <SettingField label="Google Analytics 4 (G-XXXXXXXX)" value={tempSettings.googleAnalyticsId || ''} onChange={v => updateTempSettings({ googleAnalyticsId: v })} />
                       <SettingField label="Meta Pixel ID (Dataset ID)" value={tempSettings.facebookPixelId || ''} onChange={v => updateTempSettings({ facebookPixelId: v })} />
                       <SettingField label="TikTok Pixel ID" value={tempSettings.tiktokPixelId || ''} onChange={v => updateTempSettings({ tiktokPixelId: v })} />
                       <SettingField label="Pinterest Tag ID" value={tempSettings.pinterestTagId || ''} onChange={v => updateTempSettings({ pinterestTagId: v })} />
                       <SettingField label="Webhook URL (Zapier/Make)" value={tempSettings.webhookUrl || ''} onChange={v => updateTempSettings({ webhookUrl: v })} />
                    </div>
                    <div className="space-y-6 pt-6 border-t border-slate-800">
                       <h4 className="text-white font-bold text-lg border-b border-slate-800 pb-2">Communications</h4>
                       <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-4 text-xs text-yellow-500">
                          <strong>Note:</strong> EmailJS is currently hardcoded for reliability. Update 'constants.tsx' for custom email logic if required.
                       </div>
                    </div>
                  </>
               )}
             </div>
             <div className="flex flex-col md:flex-row gap-4 pt-12 border-t border-slate-800 mt-8">
                <button onClick={() => { updateSettings(tempSettings); setEditorDrawerOpen(false); }} className="flex-1 py-5 bg-primary text-slate-900 font-black uppercase text-xs rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/20">Publish Changes</button>
                <button onClick={() => setEditorDrawerOpen(false)} className="flex-1 py-5 bg-slate-800 text-slate-400 font-black uppercase text-xs rounded-xl hover:text-white transition-all">Discard</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;