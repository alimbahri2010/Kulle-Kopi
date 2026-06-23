import { createClient } from "@supabase/supabase-js";

// =========================================================================
// SUPABASE CONFIGURATION
// Replace the values below with your own Supabase project settings.
// You can find these in your Supabase Dashboard under Settings > API.
// =========================================================================

// Paste your Supabase Project URL here:
const SUPABASE_URL = "https://mrcyjpytnahfizsehfja.supabase.co";

// Paste your Supabase Anon / Public API Key here:
const SUPABASE_PUBLIC_KEY = "sb_publishable_Tkx7tCMrp0tSAHF6o6jqBA_51N9nt-D";

// Initialize and export the Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
