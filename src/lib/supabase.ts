import { createClient } from '@supabase/supabase-js'

// Vite projelerinde değişkenler import.meta.env ile çekilir
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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