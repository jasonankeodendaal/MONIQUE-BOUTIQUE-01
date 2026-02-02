
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Declare Deno global for TypeScript compilation in non-Deno environments
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, name, role, permissions } = await req.json()

    if (!email) {
        throw new Error('Email is required')
    }

    // 1. Create the user in Supabase Auth (Send Invite)
    const { data: authData, error: authError } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
        data: { full_name: name }
    })

    if (authError) throw authError

    const userId = authData.user.id

    // 2. Insert into admin_users table (Public Profile)
    const { error: dbError } = await supabaseClient
      .from('admin_users')
      .insert({
        id: userId,
        email,
        name,
        role: role || 'admin',
        permissions: permissions || [],
        createdAt: Date.now(),
        lastActive: Date.now(),
        profileImage: '',
        phone: '',
        address: ''
      })

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ user: authData.user, message: 'User created and profile synced' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
