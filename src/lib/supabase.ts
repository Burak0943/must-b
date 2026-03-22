import { createClient } from '@supabase/supabase-js'

// Vite projelerinde değişkenler import.meta.env ile çekilir
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[must-b] Supabase env vars are not set.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file or Vercel dashboard.\n' +
    'Auth features will be disabled until these are configured.'
  )
}

// Fall back to placeholder values so the app mounts even without env vars.
// All auth calls will fail gracefully (network error) rather than crashing on init.
export const supabase = createClient(
  supabaseUrl     ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key'
)

// Geliştiriciyi GitHub üzerinden sisteme alır
export const loginWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      // Vite projelerinde default port genelde 5173 olur, Lovable 8080 de yapmış olabilir.
      // Tarayıcıdaki localhost linkine göre burayı güncelleriz.
      redirectTo: 'http://localhost:8080/dashboard' 
    }
  });

  if (error) console.error("Giriş Hatası:", error.message);
  return data;
};