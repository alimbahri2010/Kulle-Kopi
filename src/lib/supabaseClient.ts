import { createClient } from '@supabase/supabase-js';

// Mengambil URL dan Kunci Publik Anonim dari file .env secara aman
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Melakukan inisialisasi instance klien Supabase tunggal (Singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);