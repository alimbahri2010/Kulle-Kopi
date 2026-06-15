import { createClient } from '@supabase/supabase-js';

// Mengambil URL dan Kunci Publik Anonim dari file .env secara aman
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validasi apakah konfigurasi valid dan bukan placeholder
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('xxxx') && 
  !supabaseUrl.includes('placeholder');

// Melakukan inisialisasi instance klien Supabase tunggal (Singleton)
// Jika belum terkonfigurasi, gunakan Proxy agar tidak crash/blank screen
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'from') {
          return () => {
            const chain = {
              select: () => chain,
              insert: () => Promise.resolve({ data: null, error: null }),
              update: () => chain,
              upsert: () => Promise.resolve({ data: null, error: null }),
              delete: () => chain,
              order: () => chain,
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
              then: (resolve: any) => resolve({ data: null, error: null }),
            };
            return chain;
          };
        }
        return undefined;
      }
    }) as any);
