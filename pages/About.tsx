
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { Target, Users, Award, Star, Quote, Sparkles, MapPin, Calendar, Heart, ArrowRight, ShoppingBag, Milestone, MessageCircle, ArrowLeft, History, Award as AwardIcon } from 'lucide-react';
import { useSettings } from '../App';
import { CustomIcons } from '../components/CustomIcons';

const About: React.FC = () => {
  const { settings, products } = useSettings();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const renderIcon = (iconName: string, defaultIcon: React.ReactNode) => {
    if (!iconName) return defaultIcon;
    const IconComponent = CustomIcons[iconName] || (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={32} /> : defaultIcon;
  };

  const curatorEssentials = products.slice(0, 3);
  const heroTitle = settings.aboutHeroTitle || "The Narrative.";

  return (
    <div className={`min-h-screen bg-[#FDFCFB] transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Editorial Split Hero */}
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-auto relative overflow-hidden">
           <img 
            src={settings.aboutMainImage} 
            alt={settings.aboutFounderName} 
            className="w-full h-full object-cover scale-105 animate-kenburns transition-transform duration-[10s]"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-950/80 lg:to-slate-950"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 lg:hidden"></div>
           
           {/* Floating Quote on Image */}
           <div className="absolute bottom-12 left-12 right-12 lg:hidden z-20">
              <p className="text-white text-xl font-serif italic leading-relaxed">
                 "{settings.aboutHeroSubtitle}"
              </p>
           </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex items-center p-8 md:p-24 relative z-10 -mt-32 lg:mt-0">
           <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-8 lg:mb-16 border border-primary/20 backdrop-blur-md">
                  <History size={14} className="animate-pulse" /> The Origin Story
              </div>
              
              <h1 className="font-serif text-white leading-[0.8] tracking-tighter mb-10 lg:mb-12 text-balance" style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)' }}>
                  {heroTitle.split(' ').map((word, i) => (
                      <span key={i} className={i % 2 !== 0 ? "italic font-light text-primary block" : "block"}>{word}</span>
                  ))}
              </h1>

              <div className="relative mb-16 pl-8 lg:pl-16 border-l-2 border-primary/40">
                 <p className="text-2xl md:text-4xl text-slate-300 font-light leading-relaxed italic text-pretty">
                    "{settings.aboutHeroSubtitle}"
                 </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 pt-10 border-t border-white/10">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Founder</span>
                    <span className="text-lg font-serif text-white block">{settings.aboutFounderName}</span>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Established</span>
                    <span className="text-lg font-serif text-white block">{settings.aboutEstablishedYear}</span>
                 </div>
                 <div className="space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Base</span>
                    <span className="text-lg font-serif text-white block">{settings.aboutLocation}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Back Button Overlay */}
        <button 
          onClick={() => navigate('/')}
          className="absolute top-10 left-10 z-50 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all hidden md:flex"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Main Narrative Section */}
      <section className="py-24 md:py-56 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-20 lg:gap-32">
            
            {/* Sidebar Sticky Info */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit order-2 lg:order-1">
                <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-50 space-y-16">
                    <div className="space-y-8 text-left">
                        <div className="flex items-center gap-4 text-primary">
                           <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                              {renderIcon(settings.aboutMissionIcon, <Target size={28}/>)}
                           </div>
                           <h4 className="text-2xl font-serif text-slate-900">{settings.aboutMissionTitle}</h4>
                        </div>
                        <p className="text-slate-500 text-base leading-relaxed font-light">{settings.aboutMissionBody}</p>
                    </div>

                    <div className="space-y-8 text-left">
                        <div className="flex items-center gap-4 text-primary">
                           <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                              {renderIcon(settings.aboutCommunityIcon, <Users size={28}/>)}
                           </div>
                           <h4 className="text-2xl font-serif text-slate-900">{settings.aboutCommunityTitle}</h4>
                        </div>
                        <p className="text-slate-500 text-base leading-relaxed font-light">{settings.aboutCommunityBody}</p>
                    </div>

                    {settings.aboutSignatureImage && (
                       <div className="pt-10 border-t border-slate-100 flex flex-col items-center">
                          <img src={settings.aboutSignatureImage} alt="Founder Signature" className="h-24 w-auto object-contain opacity-70 mb-4 hover:opacity-100 transition-opacity" />
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.5em]">The Mark of Curation</span>
                       </div>
                    )}
                </div>
            </div>

            {/* Main Story Flow */}
            <div className="lg:col-span-8 order-1 lg:order-2 text-left">
                <div className="flex items-center gap-5 mb-10">
                   <div className="h-px w-16 bg-primary"></div>
                   <span className="text-[11px] font-black uppercase tracking-0.6em text-primary">Chapter One: The Vision</span>
                </div>
                
                <h3 className="text-4xl md:text-7xl font-serif text-slate-900 mb-16 leading-[1.1] tracking-tighter text-balance">
                   {settings.aboutHistoryTitle}
                </h3>
                
                <div className="prose prose-2xl prose-slate text-slate-600 font-light leading-relaxed text-pretty mb-32 max-w-none">
                    <div className="whitespace-pre-wrap first-letter:text-8xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-8 first-letter:mt-2 first-letter:leading-none">
                        {settings.aboutHistoryBody}
                    </div>
                </div>

                {/* --- STORY TIMELINE --- */}
                <div className="mb-32">
                   <div className="flex items-center gap-4 mb-16">
                      <History className="text-primary" size={24} />
                      <h4 className="text-2xl font-serif text-slate-900">The Journey Map</h4>
                   </div>
                   
                   <div className="relative pl-12 border-l-2 border-slate-100 space-y-24">
                      {settings.aboutMilestones?.map((milestone, idx) => {
                         const isLast = idx === (settings.aboutMilestones?.length || 0) - 1;
                         return (
                            <div key={milestone.id || idx} className="relative group">
                               <div className={`absolute top-2 -left-[55px] flex items-center justify-center transition-all duration-500 shadow-lg ${isLast ? 'w-8 h-8 rounded-full bg-primary border-4 border-white -left-[56px]' : 'w-6 h-6 rounded-full bg-white border-4 border-slate-200 group-hover:border-primary'}`}>
                                  {isLast ? (
                                     <Sparkles size={12} className="text-white" />
                                  ) : (
                                     <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-primary transition-colors"></div>
                                  )}
                               </div>
                               <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-4 block">{milestone.year}</span>
                               <h4 className="text-3xl font-serif text-slate-900 mb-4 group-hover:text-primary transition-colors">{milestone.title}</h4>
                               <p className="text-slate-500 text-lg leading-relaxed font-light max-w-xl">{milestone.description}</p>
                            </div>
                         );
                      })}
                      {(!settings.aboutMilestones || settings.aboutMilestones.length === 0) && (
                         <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl italic text-sm">
                            No milestones recorded yet.
                         </div>
                      )}
                   </div>
                </div>

                {/* --- Curator's Staples --- */}
                {curatorEssentials.length > 0 && (
                  <div className="mb-32">
                     <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-8">
                        <div className="space-y-2">
                           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary block">Personal Selection</span>
                           <h4 className="text-4xl font-serif text-slate-900 tracking-tight">Wardrobe Staples</h4>
                        </div>
                        <Link to="/products" className="hidden md:flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all group">
                           Full Catalog <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform"/>
                        </Link>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {curatorEssentials.map((product) => (
                           <Link key={product.id} to={`/product/${product.id}`} className="group block">
                              <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-6 relative bg-slate-100 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                                 <img 
                                    src={product.media?.[0]?.url} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                 />
                                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                                       <ShoppingBag size={24}/>
                                    </div>
                                 </div>
                                 <div className="absolute top-6 left-6">
                                    <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-lg">
                                       Curator's Choice
                                    </div>
                                 </div>
                              </div>
                              <h5 className="text-2xl font-serif text-slate-900 mb-2 group-hover:text-primary transition-colors leading-tight">{product.name}</h5>
                              <p className="text-sm text-slate-500 line-clamp-2 font-light leading-relaxed">{product.description}</p>
                           </Link>
                        ))}
                     </div>
                  </div>
                )}

                {/* Narrative Gallery Spread */}
                {settings.aboutGalleryImages && settings.aboutGalleryImages.length > 0 && (
                  <div className="space-y-12">
                     <div className="flex items-center gap-4">
                        <Users className="text-primary" size={24} />
                        <h4 className="text-2xl font-serif text-slate-900">Visual Moments</h4>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
                        {settings.aboutGalleryImages.map((img, i) => (
                          <div key={i} className={`rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl hover:-translate-y-4 transition-transform duration-1000 border border-slate-100 ${i % 2 === 0 ? 'mt-12 md:mt-20' : ''}`}>
                             <img src={img} alt={`Narrative Moment ${i}`} className="w-full h-full object-cover aspect-[4/5] hover:scale-110 transition-transform duration-[3s]" />
                          </div>
                        ))}
                     </div>
                  </div>
                )}
            </div>
        </div>
      </section>

      {/* Trust & Transparency Block */}
      <section className="py-32 md:py-64 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"></div>
        <div className="absolute -top-60 -right-60 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
           <div className="inline-block p-6 bg-white/5 rounded-[2rem] mb-16 backdrop-blur-2xl border border-white/10 text-primary shadow-2xl">
              {renderIcon(settings.aboutIntegrityIcon, <AwardIcon size={56}/>)}
           </div>
           
           <h2 className="text-4xl md:text-8xl font-serif mb-12 tracking-tighter leading-none">
              {settings.aboutIntegrityTitle}
           </h2>
           
           <p className="text-2xl md:text-4xl font-light text-slate-400 leading-relaxed mb-20 italic text-pretty max-w-4xl mx-auto">
              "{settings.aboutIntegrityBody}"
           </p>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 md:gap-24">
              <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-slate-950 transition-all duration-500">
                    <Heart size={28}/>
                 </div>
                 <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Verified Curations</span>
              </div>
              <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-slate-950 transition-all duration-500">
                    <Calendar size={28}/>
                 </div>
                 <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Updated Daily</span>
              </div>
              <div className="flex flex-col items-center group">
                 <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-slate-950 transition-all duration-500">
                    <MapPin size={28}/>
                 </div>
                 <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Global Presence</span>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary/5">
         <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
            <h3 className="text-5xl font-serif text-slate-900 tracking-tight">The Story Continues.</h3>
            <p className="text-slate-500 text-xl font-light max-w-xl mx-auto leading-relaxed">
               I invite you to explore the collections curated through this journey. Let's find your next signature piece together.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <button 
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto px-12 py-6 bg-slate-900 text-white rounded-full font-black uppercase text-[11px] tracking-widest hover:bg-primary hover:text-slate-900 transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
               >
                  Browse Collections <ArrowRight size={18}/>
               </button>
               <button 
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 border border-slate-200 rounded-full font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
               >
                  Connect Concierge <MessageCircle size={18}/>
               </button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default About;
