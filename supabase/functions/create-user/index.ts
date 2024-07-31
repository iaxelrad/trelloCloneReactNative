// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.30.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
 
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  
  try {
    const { id, email_addresses, first_name, image_url } = (await req.json()).data;
    const email = email_addresses[0].email_address;
    
    const { data, error } = await supabase.from("users").insert({ id, email, first_name, avatar_url:image_url });
    
    if (error) {
      return new Response(JSON.stringify(error), { status: 400 });
    }
    
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

