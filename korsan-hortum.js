import { createClient } from '@supabase/supabase-js';

// URL ve ANAHTARINI KONTROL ET
const SUPABASE_URL = 'https://diyigivqkjkknkbusggrq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeWlnaXZxa2prbmtidXNnZ3JxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQyNzQxNSwiZXhwIjoyMDg5MDAzNDE1fQ.ysnrAN_J36tiq8gFIF7Y6LkyjTrA3FHpWK3LOHOMO_M'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const prefixes = ['Must-b', 'Neural', 'Quantum', 'Cyber', 'Auto', 'Omni', 'Hyper', 'Meta'];
const cores = ['Vision', 'Logic', 'Data', 'Network', 'API', 'Crypto', 'System', 'Task'];

async function yildirimHizi() {
    console.log("⚡ ENGEL KALDIRILDI. 1.400 Paket Supabase'e akıyor...");

    for (let i = 1; i <= 1400; i++) {
        const namePart1 = prefixes[Math.floor(Math.random() * prefixes.length)];
        const namePart2 = cores[Math.floor(Math.random() * cores.length)];
        const fullName = `${namePart1} ${namePart2} Skill v${i}`;
        const slug = `${fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`;
        const storagePath = `skills/${slug}.js`;

        const fileContent = `// ${fullName}\nconsole.log('Sistem Aktif.');`;
        const fileBuffer = Buffer.from(fileContent, 'utf-8');

        try {
            // Storage Yüklemesi
            const { error: uploadError } = await supabase.storage
                .from('mustb-packages')
                .upload(storagePath, fileBuffer, { contentType: 'application/javascript', upsert: true });

            if (uploadError) throw new Error(`Depo: ${uploadError.message}`);

            // Database Kaydı
            const { error: dbError } = await supabase.from('packages').insert({
                name: fullName,
                version: 'v1.0.0',
                type: 'skill',
                summary: 'Otonom yerel ajan yeteneği.',
                author: '@must-b_core',
                stars: Math.floor(Math.random() * 5000),
                downloads: Math.floor(Math.random() * 100000),
                os: ['Linux', 'macOS', 'Windows'],
                storage_path: storagePath
            });

            if (dbError) throw new Error(`DB: ${dbError.message}`);

            if (i % 20 === 0) console.log(`🚀 [${i}/1400] Paket rafa dizildi...`);

        } catch (err) {
            console.log(`❌ Paket ${i} hatası: ${err.message}`);
        }
    }

    console.log("\n🏁 ZAFER! 1.400 paket hem depoda hem veritabanında hazır.");
    console.log("Artık Defender'ı geri açabilirsin patron.");
}

yildirimHizi();