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
    const { email, password, role, fullName, id, action } = req.body;
    
    if (!email && action === 'create') {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    if (action === 'create') {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role, full_name: fullName }
      });

      if (authError) throw authError;

      if (role !== 'client') {
        const { error: dbError } = await (supabase.from('admin_users') as any).upsert({
          id: authData.user.id,
          email,
          name: fullName,
          role: role,
          permissions: role === 'owner' ? ['all'] : ['view'],
          createdAt: Date.now()
        });
        if (dbError) throw dbError;
      }

      return res.status(200).json({ success: true, user: authData.user });
    } else if (action === 'update') {
      if (!id) return res.status(400).json({ success: false, error: 'User ID required for update' });

      const updateData: any = {
        user_metadata: { full_name: fullName, role }
      };
      if (password) updateData.password = password;

      const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(id, updateData);
      if (authError) throw authError;

      return res.status(200).json({ success: true, user: authData.user });
    }

    return res.status(400).json({ success: false, error: 'Invalid action' });
  } catch (error: any) {
    console.error('Admin user management error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Unknown error' });
  }
}
