import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, role } = req.body;
    
    // 1. Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // 2. Delete from database tables
    if (role === 'client') {
      await supabase.from('clients').delete().eq('id', id);
    } else {
      await supabase.from('admin_users').delete().eq('id', id);
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Admin user deletion error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
