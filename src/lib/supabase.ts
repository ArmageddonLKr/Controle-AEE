import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://wmkvxkeymhcguznfnebe.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indta3Z4a2V5bWhjZ3V6bmZuZWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Njc0MjUsImV4cCI6MjA5NTM0MzQyNX0.Kr5qSl--i1JfIUtWrXIS4ySCihPsSDNzcmetbwwTIyM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
