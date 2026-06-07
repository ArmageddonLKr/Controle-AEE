// src/lib/supabase.ts
// SUPABASE — PRONTO PARA CONEXÃO
// Quando Rafaela criar a conta no Supabase:
// 1. Criar projeto em supabase.com
// 2. Copiar URL e anon key
// 3. Criar arquivo .env.local com:
//    NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
// 4. Descomentar o código abaixo e remover o export null
// 5. Rodar npm run build e fazer push para main

// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// export const supabase = createClient(supabaseUrl, supabaseKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = null as any;
export const isSupabaseConnected = false;
