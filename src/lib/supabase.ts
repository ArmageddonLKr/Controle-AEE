// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Pega a URL e a Chave de API do arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Uma flag para sabermos no código se o Supabase está conectado
export const isSupabaseConnected = true;
