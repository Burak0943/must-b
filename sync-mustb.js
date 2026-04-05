import { createClient } from '@supabase/supabase-js';
const supabase = createClient('URL', 'SERVICE_ROLE_KEY');

const skillNames = ['WhatsApp Automator', 'Vision Core', 'Crypto Trader', 'Excel Bridge', 'Voice Synth', 'Browser Scraper', 'File Encryptor', 'Cloud Architect', 'API Gateway', 'Deep Search'];
const pluginNames = ['VS Code Extension', 'Discord Integration', 'Vercel Deployer', 'Docker Manager', 'Postgres Tuner', 'Auth Guardian', 'Theme Engine'];

async function seed() {
    console.log("🛠️ MUST-B HUB İNŞA EDİLİYOR...");
    await supabase.from('packages').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    let allItems = [];

    // 100 SKILL
    for (let i = 1; i <= 100; i++) {
        const base = skillNames[i % skillNames.length];
        allItems.push({
            name: `MUST-B ${base.toUpperCase()} #${i}`,
            type: 'skill',
            summary: `Gelişmiş ${base} yeteneği. Otonom ajanlar için optimize edilmiş Must-b çekirdeği.`,
            readme: `# ${base} v1.0.0\n\n## Giriş\nBu modül Must-b Core v4.0 üzerinde çalışır.\n\n### Özellikler:\n- Gerçek zamanlı veri akışı\n- AES-256 Şifreleme\n- Düşük gecikmeli otonom karar mekanizması.\n\n### Kurulum\nMust-b CLI üzerinden tek komutla kurulabilir.`,
            install_command: `must-b install ${base.toLowerCase().replace(/ /g, '-')}`,
            stars: Math.floor(Math.random() * 5000),
            downloads: Math.floor(Math.random() * 100000),
            storage_path: 'https://github.com/open-claw/whatsapp-bridge/archive/refs/heads/main.zip'
        });
    }

    // 50 PLUGIN
    for (let i = 1; i <= 50; i++) {
        const base = pluginNames[i % pluginNames.length];
        allItems.push({
            name: `MUST-B ${base.toUpperCase()}`,
            type: 'plugin',
            summary: `Sistem dâhilinde ${base} desteği sağlayan Must-b eklentisi.`,
            readme: `# ${base} Plugin\n\nBu eklenti sisteminizi daha yetenekli hale getirir.\n\n### Entegrasyon\nSistem ayarlarına giderek aktifleştirilebilir.`,
            install_command: `must-b plugin add ${base.toLowerCase().replace(/ /g, '-')}`,
            stars: Math.floor(Math.random() * 2000),
            downloads: Math.floor(Math.random() * 40000),
            storage_path: 'https://github.com/open-claw/vision-core/archive/refs/heads/main.zip'
        });
    }

    await supabase.from('packages').insert(allItems);
    console.log("🏁 150 ADET GERÇEK MUST-B PARÇASI RAFLARDA!");
}
seed();