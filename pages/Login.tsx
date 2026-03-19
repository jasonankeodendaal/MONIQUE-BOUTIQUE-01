
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Info, Chrome, ArrowRight, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { useSettings } from '../App';

const Login: React.FC = () => {
  const { isLocalMode, settings, user, admins } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to Admin if already authenticated and is admin
  useEffect(() => {
    if (user && !loginSuccess) {
      const isAdmin = admins.some(admin => admin.email === user.email);
      if (isAdmin || isLocalMode) {
        navigate('/admin', { replace: true });
      } else {
        setError('Access Denied: Your account does not have administrator privileges.');
      }
    }
  }, [user, navigate, loginSuccess, admins, isLocalMode]);

  const handleSuccessfulAuth = () => {
    setLoginSuccess(true);
    setLoading(false);
    
    // Aesthetic delay for the "Successful" message
    setTimeout(() => {
      navigate('/admin', { replace: true });
    }, 1800);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLocalMode) {
      setTimeout(() => {
        handleSuccessfulAuth();
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      handleSuccessfulAuth();
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Incorrect email or password. Please verify your credentials.');
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLocalMode) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/admin`, 
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        },
      });
      if (error) throw error;
      // Note: OAuth redirects immediately, success is handled on the return route
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        <div className="max-w-md w-full px-6 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
           <div className="relative mb-12">
              {/* Outer Golden Glow */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-[80px] animate-pulse"></div>
              
              {/* Success Ring */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/5 backdrop-blur-xl border border-primary/40 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] animate-soft-flicker">
                 <CheckCircle2 size={70} className="text-primary" strokeWidth={1} />
              </div>
           </div>

           <div className="space-y-4">
              <span className="text-primary font-black uppercase text-[10px] tracking-[0.6em] animate-in slide-in-from-bottom-2 duration-500 delay-200 block">Identity Verified</span>
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight leading-none animate-in slide-in-from-bottom-4 duration-700 delay-300">
                Login <br/> <span className="italic font-light text-primary">Successful</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-light animate-in fade-in duration-1000 delay-500">Establishing high-fidelity link to Maison Portal...</p>
           </div>

           <div className="mt-16 w-full max-w-[240px] space-y-4">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-primary animate-[grow_1.8s_ease-in-out]"></div>
              </div>
              <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                 <ShieldCheck size={12} className="text-green-500" />
                 Secure Session Protocol Active
              </div>
           </div>
        </div>
        <style>{`
          @keyframes grow { from { width: 0%; } to { width: 100%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050A18] p-6">
      <div className="w-full max-w-[400px] space-y-8 flex flex-col items-center">
        
        {/* Top Lock Icon */}
        <div className="mb-4">
          <Lock size={32} className="text-[#E5A885] opacity-80" strokeWidth={1.5} />
        </div>

        <div className="w-full space-y-6">
          {/* Google Login Button */}
          <button 
            onClick={handleGoogleLogin}
            disabled={loading || isLocalMode}
            className="w-full py-4 bg-white text-slate-900 font-bold uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                <Chrome size={20} />
                <span>{settings.loginGoogleLabel || 'Sign in with Google'}</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800/30"></div>
            <span className="flex-shrink mx-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
              {settings.loginDividerLabel || 'OR'}
            </span>
            <div className="flex-grow border-t border-slate-800/30"></div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4 w-full">
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="email" 
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-5 bg-[#E8F0FE] border-none rounded-xl text-slate-900 outline-none transition-all placeholder:text-slate-500 text-base font-medium"
                placeholder={settings.loginEmailPlaceholder || "Email Address"}
              />
            </div>
            
            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="password" 
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-4 py-5 bg-[#E8F0FE] border-none rounded-xl text-slate-900 outline-none transition-all placeholder:text-slate-500 text-base font-medium"
                placeholder={settings.loginPasswordPlaceholder || "••••••••••••••"}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-[#E5A885] text-slate-900 rounded-xl hover:brightness-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="font-black uppercase text-xs tracking-widest">{settings.loginSubmitLabel || 'Continue'}</span>
                  <ArrowRight size={24} />
                </div>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <Link to="/" className="text-slate-500 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.3em]">
            {settings.loginBackToSite || 'Back to Site'}
          </Link>
          <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-medium">
            Secure Environment • v2.0.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
