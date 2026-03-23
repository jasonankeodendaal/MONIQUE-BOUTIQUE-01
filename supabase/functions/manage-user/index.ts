import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { email, password, role, fullName, id, action } = await req.json();

  try {
    if (action === 'create') {
      const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role, full_name: fullName }
      });
      if (authError) throw authError;

      if (role !== 'client') {
        const { error: dbError } = await supabaseClient.from('admin_users').upsert({
          id: authData.user.id,
          email,
          name: fullName,
          role: role,
          permissions: role === 'owner' ? ['all'] : ['view'],
          createdAt: Date.now()
        });
        if (dbError) throw dbError;
      }
      return new Response(JSON.stringify({ success: true, user: authData.user }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    } else if (action === 'update') {
      const { data: authData, error: authError } = await supabaseClient.auth.admin.updateUserById(id, {
        user_metadata: { full_name: fullName, role },
        password: password
      });
      if (authError) throw authError;
      return new Response(JSON.stringify({ success: true, user: authData.user }), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
});
