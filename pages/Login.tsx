
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Mail, Lock, Info, Chrome, ArrowRight } from 'lucide-react';
import { useSettings } from '../App';

const Login: React.FC = () => {
  const { isLocalMode, settings, user, loadingAuth } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to Admin if already authenticated
  useEffect(() => {
    if (!loadingAuth && user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate, loadingAuth]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulation for Local Mode
    if (isLocalMode) {
      setTimeout(() => {
        setLoading(false);
        navigate('/admin');
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange in App.tsx will trigger but navigate here for immediate feedback
      navigate('/admin');
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Incorrect email or password. Please verify your credentials.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLocalMode) return;
    setLoading(true);
    try {
      // Direct redirect to the admin hash route to ensure dashboard landing
      const redirectTo = window.location.origin + '/#/admin';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-row bg-slate-950 overflow-hidden">
      
      {/* Left Side: Visual / Brand - Now visible on all sizes */}
      <div className="w-1/2 relative overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src={settings.adminLoginHeroImage || "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000"} 
            alt="Editorial Fashion" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-4 sm:p-8 lg:p-16 w-full">
           <div className="mb-2 sm:mb-6">
             <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white font-black uppercase text-[7px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4">
                Portal
             </span>
             <h1 className="text-xl sm:text-3xl lg:text-6xl font-serif text-white leading-none tracking-tighter truncate">
                {settings.companyName}
             </h1>
             <p className="text-[10px] sm:text-sm lg:text-xl text-primary font-serif italic mt-1 sm:mt-2 line-clamp-1">
                {settings.slogan}
             </p>
           </div>
           <div className="h-px w-8 sm:w-24 bg-primary/50 mb-2 sm:mb-6"></div>
           <p className="text-slate-400 max-w-md font-light leading-relaxed text-[8px] sm:text-xs lg:text-sm line-clamp-3 lg:line-clamp-none">
             Access the central nervous system of your fashion empire. Manage collections and curate the aesthetic.
           </p>
        </div>
      </div>

      {/* Right Side: Form - Now half width on all sizes */}
      <div className="w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-4 sm:space-y-8 lg:space-y-12 relative z-10">
          <div>
            <h2 className={`text-lg sm:text-2xl lg:text-3xl font-serif text-white mb-1 lg:mb-2 flex items-center gap-2 lg:gap-3 ${settings.adminLoginAccentEnabled ? 'drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' : ''}`}>
              <Lock size={18} className="text-primary lg:w-6 lg:h-6"/> 
              <span className="truncate">{settings.adminLoginTitle || "Access"}</span>
            </h2>
            <p className="text-slate-500 text-[10px] sm:text-xs lg:text-base line-clamp-1">{settings.adminLoginSubtitle || "Authenticate to enter dashboard."}</p>
          </div>

          {error && (
            <div className="p-2 sm:p-4 bg-red-500/10 border-l-2 sm:border-l-4 border-red-500 text-red-400 text-[9px] sm:text-sm animate-in slide-in-from-left">
              {error}
            </div>
          )}

          {isLocalMode && (
             <div className="p-2 sm:p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-2 lg:gap-4 items-start">
               <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5 lg:w-5 lg:h-5" />
               <div>
                 <h4 className="text-blue-400 font-bold text-[8px] sm:text-xs uppercase tracking-widest mb-0.5 sm:mb-1">Local Mode</h4>
                 <p className="text-slate-400 text-[7px] sm:text-xs leading-tight">
                   Enter any details to simulate access.
                 </p>
               </div>
             </div>
          )}

          <div className="space-y-3 sm:space-y-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading || isLocalMode}
              className="w-full py-2.5 sm:py-4 bg-white text-slate-900 font-bold text-[8px] sm:text-xs uppercase tracking-widest rounded-lg sm:rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 lg:gap-3 disabled:opacity-50"
            >
               <Chrome size={14} className="lg:w-4 lg:h-4" />
               <span>Google</span>
            </button>

            <div className="relative flex py-1 lg:py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-2 lg:mx-4 text-slate-600 text-[7px] sm:text-[10px] font-bold uppercase tracking-widest">Credentials</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-6">
              <div className="space-y-1">
                <label className="text-[7px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors lg:w-4 lg:h-4" size={14} />
                  <input 
                    type="email" 
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 lg:pl-12 pr-4 py-2.5 lg:py-4 bg-slate-900/50 border border-slate-800 rounded-lg lg:rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-[10px] sm:text-sm"
                    placeholder="admin@brand.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[7px] sm:text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Passkey</label>
                <div className="relative group">
                  <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors lg:w-4 lg:h-4" size={14} />
                  <input 
                    type="password" 
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 lg:pl-12 pr-4 py-2.5 lg:py-4 bg-slate-900/50 border border-slate-800 rounded-lg lg:rounded-xl text-white outline-none focus:border-primary focus:bg-slate-900 transition-all placeholder:text-slate-700 text-[10px] sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 lg:py-5 bg-primary text-slate-900 font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] text-[8px] sm:text-xs rounded-lg lg:rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2 lg:gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <span className="w-3 h-3 lg:w-5 lg:h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Enter Portal</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform lg:w-4 lg:h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-slate-600 text-[7px] sm:text-[9px] uppercase tracking-widest">
              Secure • v2.0.1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
