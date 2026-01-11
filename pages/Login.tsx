
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, AlertCircle, Info, Chrome } from 'lucide-react';
import { useSettings } from '../App';

const Login: React.FC = () => {
  const { isLocalMode } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulation for Local Mode
    if (isLocalMode) {
      setTimeout(() => {
        setLoading(false);
        // In local mode, ProtectedRoute allows access regardless of user state
        navigate('/admin');
      }, 1500);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/admin`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 text-primary mb-6 shadow-lg">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Concierge Access</h1>
          <p className="text-slate-500 text-sm">Enter your credentials to access the curation portal.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {isLocalMode && (
           <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-3">
            <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Local Mode Active</p>
              <p className="text-blue-300 text-xs leading-relaxed">System is running offline. Any email/password will grant simulated access.</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading || isLocalMode}
            className="w-full py-4 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
             <Chrome size={18} />
             <span>Sign in with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-900 px-2 text-slate-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Identity</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-600 text-sm"
                  placeholder="admin@kasicouture.com"
                />
              </div>
            </div>
            
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-3">Passkey</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-white outline-none focus:border-primary transition-all placeholder:text-slate-600 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary text-slate-900 font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Authenticate</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-600 text-xs">Protected by enterprise-grade security protocols.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
