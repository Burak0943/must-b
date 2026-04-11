// Dosya Yolu: api/auth/callback.ts
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: any, res: any) {
  // 1. Supabase'den gelen tek kullanımlık kodu alıyoruz
  const { code } = req.query

  if (code) {
    // Çevresel değişkenlerini kontrol et (Vercel Panelinde ekli olmalı)
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: 'Supabase ayarları eksik!' })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // 2. Bu kodu gerçek bir oturum anahtarına (token) dönüştürüyoruz
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Başarılı giriş: `next` adresi veya varsayılan '/dashboard'
      const redirectUrl = req.query.next || '/dashboard'
      
      return res.redirect(redirectUrl)
    }
  }

  // Bir hata olursa ana siteye geri gönder
  return res.redirect('https://must-b.com')
}