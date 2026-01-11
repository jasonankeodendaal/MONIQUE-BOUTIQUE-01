
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LogIn, Mail, Lock, AlertCircle, Chrome } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Pre-check for configuration before attempting network request
    if (!isSupabaseConfigured) {
       setError('System Error: Supabase is not configured. Please check your VITE_SUPABASE_URL environment variable.');
       setLoading(false);
       return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check if admin profile exists
      if (data.user) {
        const { data: profile } = await supabase.from('admin_users').select('role').eq('id', data.user.id).single();
        
        if (!profile) {
            // Self-healing: Create missing profile automatically
            console.log("Profile missing for existing user. Attempting client-side creation...");
            
            const newProfile = {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Admin',
                role: 'owner', // Default to owner to ensure full access for the first user
                permissions: ['*'],
                createdAt: Date.now()
            };
            
            // Attempt to insert the profile
            const { error: createError } = await supabase.from('admin_users').insert(newProfile);
            
            // Ignore 409 conflict (user already exists, possibly race condition with trigger)
            if (createError && createError.code !== '23505') { 
                 console.warn("Profile creation warning:", createError);
                 if (!createError.message.includes("permission denied")) {
                    // Log but proceed
                 }
            }
        }
      }

      navigate('/admin');
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Network Error: Unable to connect to Supabase. Please ensure your VITE_SUPABASE_URL is correct (starts with https://) and your network is active.');
      } else {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.message?.includes('NOT_FOUND') || err.message?.includes('404')) {
        setError('Configuration Error: Google Login is disabled in Supabase or the Project URL is incorrect.');
      } else {
        setError(err.message || 'Google authentication failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 shadow-2xl shadow-primary/20 border border-primary/20">
            <Lock size={28} className="md:w-8 md:h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-white mb-2 tracking-tight">Portal <span className="text-primary italic font-light">Access</span></h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-10 rounded-[2.5rem] shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-2 text-left">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Identity Mailbox</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                  placeholder="admin@kasicouture.com"
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-primary transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-slate-900 font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  Authenticate
                </>
              )}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <span className="relative px-4 bg-slate-900 text-[9px] font-black text-slate-600 uppercase tracking-widest">Or Secure With</span>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white text-slate-900 font-bold text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Chrome size={18} />
            Sign in with Google
          </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-8 w-full text-center text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
        >
          Return to Public Front
        </button>
      </div>
    </div>
  );
};

export default Login;
    