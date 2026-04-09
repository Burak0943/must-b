const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'mustb-hub-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const newSkills = [
  {
    "id": 1,
    "name": "👻 GHOST-OPERATOR (Physical Interface Control)",
    "version": "v1.0.0",
    "summary": "Sınırları Aşan Fiziksel Otonomi. (Physical Autonomy Beyond Digital Limits.)",
    "author": "@must-b_core",
    "stars": "99.9k",
    "downloads": "5.5m",
    "os": ["Windows", "Linux", "macOS"],
    "is_certified": true,
    "readme": "## Under the Hood (Nasıl Çalışır)\n\nGeleneksel yapay zeka asistanları API'lere mahkumdur; Must-b ise \"Local Muscle\" (Yerel Kas Gücü) mimarisiyle fiziksel donanıma hükmeder. Ghost-Operator, işletim sisteminizin Donanım Soyutlama Katmanı'na (HAL) doğrudan kanca (hook) atar. Gelişmiş bilgisayar görüşü (Computer Vision) kullanarak ekrandaki pikselleri analiz eder, X/Y koordinatlarını hesaplar ve dinamik Bezier eğrileriyle kusursuz insan hareketleri simüle eder. API desteği olmayan on yıllık legacy kurumsal yazılımları (SAP, eski ERP'ler) bile, tıpkı sizin gibi faresini oynatarak ve klavyesini kullanarak otonom şekilde yönetir.\n\n## Core Capabilities (Temel Yetenekler)\n\n- **Hardware-Level Injection**: İşletim sistemi çekirdeğine doğrudan sentetik fare ve klavye girdisi sağlama.\n- **Legacy System Mastery**: Hiçbir API veya entegrasyon gerektirmeden kapalı kutu yazılımları görsel olarak kullanabilme.\n- **Neuromotor Humanization**: Anti-bot sistemlerini atlatmak için insan reflekslerini ve mikro-titreşimleri (micro-jitter) taklit eden algoritmalar.",
    "integration_guide": "### Initialization Sequence\n`Ghost-Operator module online. Awaiting physical manifestation...`",
    "download_url": "/downloads/ghost-operator.zip"
  },
  {
    "id": 2,
    "name": "🕸️ NATIVE-SCOUT (API-less Autonomous Browser)",
    "version": "v1.0.0",
    "summary": "Web'in Doğal Avcısı. (The Apex Predator of the Web.)",
    "author": "@must-b_core",
    "stars": "88.5k",
    "downloads": "3.2m",
    "os": ["Windows", "Linux", "macOS"],
    "is_certified": true,
    "readme": "## Under the Hood (Nasıl Çalışır)\n\nDış API'lere, webhook limitlerine veya kısıtlayıcı CORS politikalarına boyun eğmez. Native-Scout yeteneği tetiklendiğinde, Must-b makinenizde izole ve hayalet bir Chromium oturumu başlatır. Hedef web sitesine kendi başına gider, dinamik JavaScript/SPA mimarilerini bir insan gibi render eder ve bekler. Captcha'ları otonom karar mekanizmalarıyla atlar ve hedef veriyi doğrudan DOM (Document Object Model) ağacından söküp alır. Veriler hiçbir bulut sunucusuna sızmadan, doğrudan Siber Kale'nizde (Cyber Fortress) şifrelenir.\n\n## Core Capabilities (Temel Yetenekler)\n\n- **Zero-Footprint Extraction**: Sunucu tarafında hiçbir kazıma (scraping) izi veya bot logu bırakmayan hayalet tarayıcı.\n- **Dynamic DOM Traversal**: Karmaşık Shadow DOM ağaçlarına sızma ve semantik veri sentezi.\n- **Absolute Evasion**: Cloudflare ve Akamai gibi katı anti-bot güvenlik duvarlarını otonom davranışlarla aşma.",
    "integration_guide": "### Initialization Sequence\n`Native-Scout module online. Awaiting target URLs...`",
    "download_url": "/downloads/native-scout.zip"
  },
  {
    "id": 3,
    "name": "💻 DEVOPS-CORE (Terminal & System Orchestration)",
    "version": "v1.0.0",
    "summary": "Sistemin Mutlak Hakimi. (Absolute Sovereign of the Local Environment.)",
    "author": "@must-b_core",
    "stars": "105k",
    "downloads": "8.1m",
    "os": ["Windows", "Linux", "macOS"],
    "is_certified": true,
    "readme": "## Under the Hood (Nasıl Çalışır)\n\nMust-b sadece kod önermez; o kodu yazar, derler ve çalıştırır. DevOps-Core eklentisi, Cognitive OS'in komut satırındaki mutlak otoritesidir. Sistem hata verdiğinde durmaz; standart hata (stderr) loglarını okur, eksik NPM veya Python bağımlılıklarını anında tespit eder, kendi kendine `install` komutlarını ateşler ve çöken süreçleri yeniden başlatır. O, arka planda çalışan ve işletim sisteminizin kök (root) dizinlerinde gezinen yorulmak bilmez bir DevOps mühendisidir.\n\n## Core Capabilities (Temel Yetenekler)\n\n- **Auto-Healing Event Loop**: Hata loglarını bilişsel döngüye sokup otonom olarak patch (yama) üreten ve sistemi kurtaran mimari.\n- **Background Daemon Management**: Zombi süreçleri tespit etme, öldürme (kill PID) ve sistem kaynaklarını yönetme.\n- **Root-Level Execution**: Güvenli Local Muscle ortamında bash/powershell betiklerini yazma ve icra etme yetkisi.",
    "integration_guide": "### Initialization Sequence\n`DevOps-Core module online. Root access established...`",
    "download_url": "/downloads/devops-core.zip"
  },
  {
    "id": 4,
    "name": "📊 DIAGNOSTICS-OTEL (Deep System Telemetry)",
    "version": "v1.0.0",
    "summary": "Bilişsel Süreçlerin Şeffaf Anatomisi. (Transparent Anatomy of Cognitive Processes.)",
    "author": "@must-b_core",
    "stars": "64.2k",
    "downloads": "2.4m",
    "os": ["Windows", "Linux", "macOS"],
    "is_certified": true,
    "readme": "## Under the Hood (Nasıl Çalışır)\n\nMust-b'nin devasa bilişsel işlemlerinin ve sistem çağrılarının anlık röntgenini çeken resmi izleme (monitoring) modülüdür. OpenTelemetry (OTel) standartları üzerine inşa edilen bu eklenti, Cloud Brain ile Local Muscle arasındaki her bir mikro-saniyeyi, RAM tahsislerini, CPU yükünü ve ağ I/O isteklerini milisaniye bazında takip eder. Siber Kale mimarisi gereği, bu teşhis verileri asla dışarıya sızdırılmaz; yalnızca lokal Dashboard'unuzda otonom anomalileri raporlamak için kullanılır.\n\n## Core Capabilities (Temel Yetenekler)\n\n- **Millisecond-Level Tracing**: Otonom görevlerin her bir mantıksal adımını ağacın köklerine kadar izleme.\n- **Resource Anomaly Detection**: İşletim sistemindeki aşırı bellek/CPU tüketimini gerçekleşmeden önce tespit eden uyarı mekanizması.\n- **Zero-Trust Local Logging**: Tüm logların bulut yerine lokal şifreli dizinlerde tutulması.",
    "integration_guide": "### Initialization Sequence\n`Diagnostics-OTel module online. Telemetry stream secured...`",
    "download_url": "/downloads/diagnostics-otel.zip"
  },
  {
    "id": 5,
    "name": "🖋️ OPEN-PROSE (Advanced Content Synthesis Engine)",
    "version": "v1.0.0",
    "summary": "Düşünceden Egemen Belgeye. (From Raw Thought to Sovereign Document.)",
    "author": "@must-b_core",
    "stars": "77.7k",
    "downloads": "4.9m",
    "os": ["Windows", "Linux", "macOS"],
    "is_certified": true,
    "readme": "## Under the Hood (Nasıl Çalışır)\n\nOpen-Prose, sıradan bir metin üreticisinin çok ötesindedir. O, Must-b'nin sentezlediği devasa pazar araştırmalarını, binlerce satırlık kod dokümantasyonlarını veya şirket raporlarını doğrudan işletim sisteminizin dosya hiyerarşisine kaydeder. Bulut tabanlı not defterlerinin karakter sınırlarına takılmaz. Elde ettiği otonom verileri saniyeler içinde kusursuz formatlanmış PDF, Markdown (MD) veya DOCX dosyalarına çevirir ve belirlediğiniz lokal dizine mühürler.\n\n## Core Capabilities (Temel Yetenekler)\n\n- **Autonomous File System Mutability**: Raporları doğrudan disk üzerindeki klasörlere yazma, değiştirme ve arşivleme yetkisi.\n- **Multi-Format Compilation**: Bilişsel verileri anında kurumsal düzeyde PDF ve Markdown belgelerine dönüştürme.\n- **Context-Aware Documentation**: Vector Vault'taki eski belgeleri okuyarak, yeni raporları şirketin kurumsal diline ve şablonlarına göre otomatik hizalama.",
    "integration_guide": "### Initialization Sequence\n`Open-Prose module online. Synthesis engine ready...`",
    "download_url": "/downloads/open-prose.zip"
  }
];

data.skills = [...newSkills, ...data.skills.slice(5)];
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('Update successful.');
