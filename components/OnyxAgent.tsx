// 1. Install Supabase: npm install @supabase/supabase-js
// 2. Create file: src/lib/onyx.js
import { createClient } from '@supabase/supabase-js';

const ONYX_SITE_ID = '2773d8e6-6090-48ca-962c-502f18443566';

// Vite / React Environment Variables
const SUPABASE_URL = import.meta.env.https://pvuhdsciwquulsetqyhu.supabase.co; 
const SUPABASE_KEY = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dWhkc2Npd3F1dWxzZXRxeWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NjYyMjAsImV4cCI6MjA4NDI0MjIyMH0.Yh_1jkgs_z2WqVD9F5EgrgVCaznwkrgSDWfluuyzEpA;
const REGION = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const SESSION_ID = Math.random().toString(36).substring(7);

export const initOnyx = () => {
  if (typeof window === 'undefined') return;

  const track = (type, payload = {}) => {
    supabase.from('events').insert({
      site_id: ONYX_SITE_ID,
      type,
      session_id: SESSION_ID,
      path: window.location.pathname,
      device: /Mobi/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      country: REGION,
      created_at: new Date().toISOString(),
      ...payload
    }).then(({ error }) => { if(error) console.error('Onyx Error:', error) });
  };

  // Tracking Logic
  track('pageview', { load_time_ms: window.performance?.now() });
  window.addEventListener('error', (e) => track('error', { metadata: { message: e.message } }));
  window.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (t) track('click', { metadata: { tag: t.tagName, text: t.innerText?.slice(0,50) } });
  });
};

// 3. In your Root Layout or App Component:
// useEffect(() => { initOnyx(); }, []);
