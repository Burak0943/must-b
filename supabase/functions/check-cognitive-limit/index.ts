import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    // Create Admin Client to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Get body data
    const { api_access_token, cost } = await req.json()
    const requestCost = parseFloat(cost) || 0

    if (!api_access_token) {
      return new Response(
        JSON.stringify({ error: 'API access token is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Find user by api_access_token
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('api_access_token', api_access_token)
      .single()

    if (fetchError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid API access token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Check and Reset Daily Credit if needed
    const now = new Date()
    const lastReset = profile.last_reset_date ? new Date(profile.last_reset_date) : new Date(0)
    
    // Check if it's a new day (UTC)
    const isNewDay = now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
                    now.getUTCMonth() !== lastReset.getUTCMonth() ||
                    now.getUTCDate() !== lastReset.getUTCDate()

    let currentUsedCredit = parseFloat(profile.used_credit_today) || 0
    let updatedLastReset = profile.last_reset_date

    if (isNewDay) {
      currentUsedCredit = 0
      updatedLastReset = now.toISOString()
    }

    // 3. Check Limit
    const dailyLimit = parseFloat(profile.daily_credit_limit) || 0
    
    if (currentUsedCredit + requestCost > dailyLimit) {
      return new Response(
        JSON.stringify({ 
          error: 'Limit aşıldı', 
          used: currentUsedCredit, 
          limit: dailyLimit,
          message: 'Günlük bilişsel kredi limitinize ulaştınız. Lütfen yarın tekrar deneyin veya paketinizi yükseltin.'
        }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Update used_credit_today
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        used_credit_today: currentUsedCredit + requestCost,
        last_reset_date: updatedLastReset
      })
      .eq('id', profile.id)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        new_usage: currentUsedCredit + requestCost, 
        remaining: dailyLimit - (currentUsedCredit + requestCost) 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
