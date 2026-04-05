/**
 * generate-data.mjs
 * Generates src/data/mustb-hub-data.json with 100 skills + 50 plugins.
 * Run: node generate-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Existing 20 skills (keep intact) ─────────────────────────────────────
const existingSkills = JSON.parse(
  fs.readFileSync(path.join(__dirname, "src/data/mustb-hub-data.json"), "utf8")
).skills.map((s) => ({ ...s, download_url: `/downloads/skill-${s.id}.zip` }));

// ── Existing 5 plugins (keep intact) ─────────────────────────────────────
const existingPlugins = JSON.parse(
  fs.readFileSync(path.join(__dirname, "src/data/mustb-hub-data.json"), "utf8")
).plugins.map((p) => ({ ...p, download_url: `/downloads/plugin-${p.id}.zip` }));

// ── Catalog for new skills 21-100 ─────────────────────────────────────────
const newSkillsCatalog = [
  ["Must-b Anthropic Claude Bridge",    "v2.0.0", "Claude 3.5 Sonnet ve Claude 3 Haiku modellerini Must-b pipeline'ına entegre eder.",          ["Linux","macOS","Windows"], true,  "Anthropic"],
  ["Must-b Pinecone Vector Store",      "v1.3.0", "Pinecone vektör veritabanına embedding yazar ve semantic arama yapar.",                        ["Linux","macOS","Windows"], true,  "Pinecone"],
  ["Must-b Supabase Realtime",          "v2.1.0", "Supabase tablolarını gerçek zamanlı dinler ve ajan tetikleyicileri çalıştırır.",              ["Linux","macOS","Windows"], false, "Supabase"],
  ["Must-b Firebase Admin Bridge",      "v1.5.0", "Firestore, Auth ve Storage'ı ajan kontrolüyle yönetir.",                                      ["Linux","macOS"],           false, "Firebase"],
  ["Must-b Vercel Deploy Agent",        "v1.2.0", "Next.js ve Vite projelerini Vercel'e tek komutla deploy eder.",                               ["Linux","macOS","Windows"], true,  "Vercel"],
  ["Must-b Cloudflare Workers Deploy",  "v1.1.0", "Cloudflare Workers ve Pages projelerini otomatik push eder.",                                  ["Linux","macOS"],           true,  "Cloudflare"],
  ["Must-b Redis Cache Manager",        "v3.0.0", "Redis key-value store üzerinde akıllı cache stratejileri uygular.",                            ["Linux","macOS","Windows"], true,  "Redis"],
  ["Must-b MongoDB Atlas Agent",        "v2.2.0", "MongoDB koleksiyonlarını sorgular, indeksler ve aggregation pipeline'ları çalıştırır.",        ["Linux","macOS","Windows"], false, "MongoDB"],
  ["Must-b Elasticsearch Search",       "v2.0.0", "Elasticsearch cluster'ına belge indeksler ve full-text / semantic arama yapar.",               ["Linux","macOS"],           true,  "Elastic"],
  ["Must-b Apache Kafka Producer",      "v1.4.0", "Kafka topic'lerine mesaj üretir ve consumer group'larını yönetir.",                            ["Linux"],                   false, "Kafka"],
  ["Must-b RabbitMQ Message Bus",       "v1.3.0", "RabbitMQ exchange ve queue'larına mesaj gönderir/alır.",                                       ["Linux","macOS"],           false, "RabbitMQ"],
  ["Must-b SendGrid Email Engine",      "v2.5.0", "SendGrid API ile transactional ve marketing e-posta gönderir.",                               ["Linux","macOS","Windows"], true,  "SendGrid"],
  ["Must-b Twilio SMS & Voice",         "v1.9.0", "Twilio üzerinden SMS, WhatsApp ve sesli arama gönderir.",                                     ["Linux","macOS","Windows"], false, "Twilio"],
  ["Must-b HubSpot CRM Sync",           "v2.0.0", "HubSpot contact, deal ve company kayıtlarını ajan hafızasıyla senkronize eder.",              ["Linux","macOS","Windows"], true,  "HubSpot"],
  ["Must-b Salesforce Integration",     "v1.7.0", "Salesforce Object'lerini okur, yazar ve Apex trigger'larını çalıştırır.",                      ["Linux","macOS"],           true,  "Salesforce"],
  ["Must-b Zendesk Support Agent",      "v1.4.0", "Zendesk ticket'larını okur, yanıtlar ve önceliklendirir.",                                    ["Linux","macOS","Windows"], false, "Zendesk"],
  ["Must-b Intercom Live Assist",       "v1.1.0", "Intercom konuşmalarına ajan yanıtları ekler ve otomatik segmentasyon yapar.",                 ["Linux","macOS"],           false, "Intercom"],
  ["Must-b Asana Task Manager",         "v1.6.0", "Asana proje ve görevlerini oluşturur, günceller ve takip eder.",                              ["Linux","macOS","Windows"], false, "Asana"],
  ["Must-b ClickUp Workspace",          "v1.3.0", "ClickUp task, space ve doc yapılarını ajan kontrolüyle yönetir.",                              ["Linux","macOS","Windows"], false, "ClickUp"],
  ["Must-b Airtable Database Bridge",   "v2.0.0", "Airtable base ve table'larından veri okur, yazar ve formül hesaplar.",                       ["Cloud","Linux"],           false, "Airtable"],
  ["Must-b Zapier Workflow Engine",     "v1.0.0", "Zapier Zap'larını programatik olarak tetikler ve veri geçişi yapar.",                         ["Cloud","Linux"],           false, "Zapier"],
  ["Must-b Make Scenario Runner",       "v1.0.0", "Make (Integromat) senaryolarını çalıştırır ve veri pipe'lar.",                                ["Cloud"],                   false, "Make"],
  ["Must-b Resend Email API",           "v1.2.0", "Resend API ile React Email şablonlarını render edip gönderir.",                               ["Linux","macOS","Windows"], true,  "Resend"],
  ["Must-b Auth0 Identity Manager",     "v2.3.0", "Auth0 kullanıcı ve rol yönetimini ajan akışına entegre eder.",                                ["Linux","macOS","Windows"], true,  "Auth0"],
  ["Must-b Clerk Auth Integration",     "v1.5.0", "Clerk oturum yönetimi ve organizasyon yapısını kontrol eder.",                                ["Linux","macOS","Windows"], false, "Clerk"],
  ["Must-b PlanetScale DB Agent",       "v1.1.0", "PlanetScale serverless MySQL veritabanına bağlanır ve migration uygular.",                    ["Linux","macOS"],           false, "PlanetScale"],
  ["Must-b Neon Serverless Postgres",   "v1.4.0", "Neon branching ve serverless Postgres endpoint'lerini yönetir.",                              ["Linux","macOS","Windows"], true,  "Neon"],
  ["Must-b InfluxDB Time-Series",       "v1.2.0", "InfluxDB'ye zaman serisi verisi yazar ve Flux sorguları çalıştırır.",                         ["Linux","macOS"],           false, "InfluxDB"],
  ["Must-b Grafana Dashboard Agent",    "v1.3.0", "Grafana dashboard'larını oluşturur, panel ekler ve alert kurar.",                             ["Linux","macOS","Windows"], true,  "Grafana"],
  ["Must-b Prometheus Metrics",         "v2.0.0", "Prometheus metriklerini push gateway üzerinden kaydeder ve PromQL sorgular.",                 ["Linux","macOS"],           false, "Prometheus"],
  ["Must-b Sentry Error Tracker",       "v2.1.0", "Sentry issue'larını listeler, önceliklendirir ve release ilişkilendirir.",                    ["Linux","macOS","Windows"], true,  "Sentry"],
  ["Must-b LogRocket Session Replay",   "v1.0.0", "LogRocket oturum replay'lerini analiz eder ve hata raporlar.",                                ["macOS","Windows"],         false, "LogRocket"],
  ["Must-b Segment Analytics",          "v1.6.0", "Segment track/identify/group event'larını ajan görevlerinden tetikler.",                       ["Linux","macOS","Windows"], false, "Segment"],
  ["Must-b Mixpanel Event Tracker",     "v1.4.0", "Mixpanel event ve funnel analizlerini ajan karar süreçlerine dahil eder.",                   ["Linux","macOS","Windows"], false, "Mixpanel"],
  ["Must-b PostHog Product Analytics",  "v1.2.0", "PostHog feature flag ve event'larını ajan akışına entegre eder.",                             ["Linux","macOS","Windows"], false, "PostHog"],
  ["Must-b CloudWatch Monitor",         "v1.5.0", "AWS CloudWatch alarm ve metric'lerini izler, kritik durumlarda aksiyon alır.",               ["Linux","macOS"],           true,  "AWS"],
  ["Must-b New Relic APM",              "v1.3.0", "New Relic trace ve metric verilerini işler, performans anomalilerini raporlar.",               ["Linux","macOS","Windows"], false, "New Relic"],
  ["Must-b PagerDuty Alerting",         "v2.0.0", "PagerDuty incident oluşturur, acknowledge eder ve eskalasyon yönetir.",                       ["Linux","macOS","Windows"], true,  "PagerDuty"],
  ["Must-b Terraform Cloud Deploy",     "v1.4.0", "Terraform Cloud workspace'lerini tetikler ve plan/apply çıktılarını ayrıştırır.",             ["Linux","macOS"],           true,  "Terraform"],
  ["Must-b Pulumi IaC Agent",           "v1.1.0", "Pulumi stack'lerini güncelleyin ve preview/up komutlarını ajan kontrolüyle çalıştırır.",      ["Linux","macOS"],           false, "Pulumi"],
  ["Must-b Ansible Playbook Runner",    "v1.3.0", "Ansible playbook'larını uzak host'larda çalıştırır ve inventory yönetir.",                    ["Linux","macOS"],           false, "Ansible"],
  ["Must-b GitHub Actions Trigger",     "v1.6.0", "GitHub Actions workflow'larını tetikler ve run sonuçlarını takip eder.",                      ["Linux","macOS","Windows"], true,  "GitHub"],
  ["Must-b GitLab CI Manager",          "v1.2.0", "GitLab pipeline'larını başlatır ve job artifact'larını indirir.",                             ["Linux","macOS"],           false, "GitLab"],
  ["Must-b CircleCI Orchestrator",      "v1.1.0", "CircleCI pipeline tetikler ve workflow durumunu raporlar.",                                   ["Linux","macOS"],           false, "CircleCI"],
  ["Must-b ArgoCD GitOps Deploy",       "v1.0.0", "ArgoCD application'larını sync eder ve Kubernetes manifest'lerini uygular.",                  ["Linux"],                   true,  "ArgoCD"],
  ["Must-b Kubernetes Operator",        "v2.0.0", "Kubernetes pod, deployment ve service kaynaklarını ajan kontrolüyle yönetir.",                ["Linux","macOS"],           true,  "Kubernetes"],
  ["Must-b Helm Chart Deployer",        "v1.3.0", "Helm chart'larını upgrade, rollback ve uninstall eder.",                                      ["Linux","macOS"],           false, "Helm"],
  ["Must-b HashiCorp Vault Secrets",    "v1.5.0", "Vault secret engine'lerden gizli bilgileri çeker ve döndürür.",                               ["Linux","macOS"],           true,  "Vault"],
  ["Must-b Okta Identity SSO",          "v1.2.0", "Okta kullanıcı ve grup yönetimini ajan akışına bağlar.",                                      ["Linux","macOS","Windows"], false, "Okta"],
  ["Must-b Microsoft Teams Bridge",     "v1.4.0", "Teams kanallarına mesaj gönderir ve Adaptive Card yayınlar.",                                 ["Linux","macOS","Windows"], false, "Microsoft"],
  ["Must-b Mailchimp Campaigns",        "v1.1.0", "Mailchimp kampanyaları oluşturur, segment tanımlar ve istatistik çeker.",                     ["Cloud","Linux"],           false, "Mailchimp"],
  ["Must-b Dropbox File Manager",       "v1.2.0", "Dropbox hesabında dosya yükler, indirir ve paylaşım linki üretir.",                          ["Linux","macOS","Windows"], false, "Dropbox"],
  ["Must-b Box Enterprise Storage",     "v1.1.0", "Box klasör ve dosyalarını yönetir, metadata etiketler.",                                      ["Linux","macOS","Windows"], false, "Box"],
  ["Must-b Cloudinary Media Manager",   "v1.5.0", "Görsel ve video dosyalarını Cloudinary'ye yükler, transform eder.",                           ["Linux","macOS","Windows"], true,  "Cloudinary"],
  ["Must-b Algolia Smart Search",       "v2.0.0", "Algolia indekslerine veri yazar ve instant search sorguları çalıştırır.",                     ["Linux","macOS","Windows"], true,  "Algolia"],
  ["Must-b Meilisearch Agent",          "v1.2.0", "Meilisearch instance'ına belge ekler ve full-text arama yapar.",                              ["Linux","macOS"],           false, "Meilisearch"],
  ["Must-b Weaviate Vector Store",      "v1.4.0", "Weaviate GraphQL API üzerinden vektör nesnesi yazar ve sorgular.",                            ["Linux","macOS","Windows"], true,  "Weaviate"],
  ["Must-b Qdrant Vector DB",           "v1.3.0", "Qdrant collection'larına point ekler ve filtered vector search yapar.",                       ["Linux","macOS"],           false, "Qdrant"],
  ["Must-b Chroma DB Manager",          "v1.1.0", "Chroma embeding collection'larını yönetir ve similarity search çalıştırır.",                  ["Linux","macOS","Windows"], false, "Chroma"],
  ["Must-b LangChain Bridge",           "v2.1.0", "LangChain chain ve agent'larını Must-b görev sistemiyle entegre eder.",                       ["Linux","macOS","Windows"], true,  "LangChain"],
  ["Must-b LlamaIndex RAG Engine",      "v1.6.0", "LlamaIndex pipeline'larını Must-b memory katmanına bağlar.",                                  ["Linux","macOS","Windows"], true,  "LlamaIndex"],
  ["Must-b Hugging Face Hub",           "v1.4.0", "Hugging Face model ve dataset'lerini indirir ve inference çalıştırır.",                       ["Linux","macOS"],           false, "HuggingFace"],
  ["Must-b Replicate AI Runner",        "v1.2.0", "Replicate model'larını API üzerinden çalıştırır ve output'larını işler.",                     ["Linux","macOS","Windows"], false, "Replicate"],
  ["Must-b Together AI Gateway",        "v1.1.0", "Together AI üzerindeki açık kaynak LLM'lere inference gönderir.",                             ["Linux","macOS","Windows"], false, "Together AI"],
  ["Must-b Groq LLM Inference",         "v1.3.0", "Groq'un ultra-hızlı inference API'sini Must-b pipeline'ına bağlar.",                         ["Linux","macOS","Windows"], true,  "Groq"],
  ["Must-b Mistral AI Connector",       "v1.2.0", "Mistral Large ve Codestral modellerini Must-b görev akışına entegre eder.",                   ["Linux","macOS","Windows"], false, "Mistral"],
  ["Must-b Cohere NLP Engine",          "v1.4.0", "Cohere Command ve Embed modellerini anlama ve sınıflandırma görevleri için kullanır.",        ["Linux","macOS","Windows"], false, "Cohere"],
  ["Must-b ElevenLabs Voice AI",        "v1.5.0", "ElevenLabs text-to-speech API ile ses sentezler ve klonlama yapar.",                          ["Linux","macOS","Windows"], true,  "ElevenLabs"],
  ["Must-b Deepgram Transcription",     "v1.3.0", "Deepgram Nova-2 ile ses dosyalarını ve canlı stream'leri metne çevirir.",                     ["Linux","macOS","Windows"], false, "Deepgram"],
  ["Must-b AssemblyAI Audio Analysis",  "v1.2.0", "AssemblyAI ile ses transkripsiyon, özetleme ve duygu analizi yapar.",                         ["Linux","macOS","Windows"], false, "AssemblyAI"],
  ["Must-b Browserless API Bridge",     "v1.1.0", "Browserless.io headless Chrome API'sine bağlanarak web automation ve screenshot alır.",       ["Linux","macOS"],           false, "Browserless"],
  ["Must-b ScrapingBee Crawler",        "v1.0.0", "ScrapingBee proxy rotasyonu ile JS-render web scraping yapar.",                               ["Linux","macOS","Windows"], false, "ScrapingBee"],
  ["Must-b Apify Scraper Platform",     "v1.1.0", "Apify Actor'larını çalıştırır ve dataset'lere veri çeker.",                                   ["Cloud","Linux"],           false, "Apify"],
  ["Must-b Firecrawl Web Reader",       "v1.2.0", "Firecrawl ile web sitelerini Markdown'a dönüştürür ve crawl eder.",                           ["Linux","macOS","Windows"], true,  "Firecrawl"],
  ["Must-b Exa Neural Search",          "v1.1.0", "Exa semantic web arama API'si ile içerik keşfeder.",                                          ["Linux","macOS","Windows"], false, "Exa"],
  ["Must-b Tavily Research Agent",      "v1.3.0", "Tavily AI araştırma API'siyle derinlemesine web araştırması yapar.",                          ["Linux","macOS","Windows"], true,  "Tavily"],
  ["Must-b Perplexity AI Query",        "v1.2.0", "Perplexity sonar modelini kullanarak gerçek zamanlı kaynaklı cevaplar üretir.",               ["Linux","macOS","Windows"], false, "Perplexity"],
  ["Must-b SerpAPI Search Engine",      "v1.4.0", "Google, Bing ve diğer arama motorlarından yapılandırılmış sonuç çeker.",                      ["Linux","macOS","Windows"], false, "SerpAPI"],
  ["Must-b Brave Search API",           "v1.0.0", "Brave Search bağımsız index'inden gizlilik odaklı web araması yapar.",                        ["Linux","macOS","Windows"], false, "Brave"],
];

// ── Catalog for new plugins 6-50 ──────────────────────────────────────────
const newPluginsCatalog = [
  ["Must-b Python Code Executor",         "v2.0.0", "Sandbox Python ortamında kod çalıştırır, paket kurar ve sonuç döndürür.",                ["Linux","macOS"],           true,  "Python"],
  ["Must-b Image Generation Engine",      "v1.4.0", "DALL-E 3 ve Stable Diffusion ile görev bazlı görsel üretir.",                            ["Linux","macOS","Windows"], true,  "OpenAI"],
  ["Must-b Audio Transcription Core",     "v1.3.0", "OpenAI Whisper ile yerel ses dosyalarını metne dönüştürür.",                              ["Linux","macOS","Windows"], false, "Whisper"],
  ["Must-b File System Explorer",         "v2.1.0", "Dosya sistemi üzerinde okuma, yazma, taşıma ve arama işlemleri yapar.",                  ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b HTTP API Request Maker",       "v1.5.0", "REST ve GraphQL API'lere kimlik doğrulama ile istek gönderir.",                           ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Email Composer & Sender",      "v1.2.0", "SMTP veya API üzerinden zengin HTML e-posta taslaklar ve gönderir.",                     ["Linux","macOS","Windows"], false, "SMTP"],
  ["Must-b Google Calendar Manager",     "v1.3.0", "Google Calendar üzerinde etkinlik oluşturur, günceller ve davet gönderir.",              ["Linux","macOS","Windows"], false, "Google"],
  ["Must-b PDF Generator & Parser",       "v1.6.0", "PDF dosyaları oluşturur, sayfa çıkarır ve metin parse eder.",                            ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Data Visualizer",              "v1.1.0", "Veri tablolarından otomatik grafik ve özet rapor üretir.",                               ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Report Generator",            "v1.2.0", "Ajan çalışma sonuçlarından şablonlu PDF/HTML raporlar oluşturur.",                       ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Cron Task Scheduler",          "v1.4.0", "Cron ifadeleriyle görevleri zamanlı çalıştırır ve log tutar.",                           ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Web Scraper Core",             "v2.0.0", "Cheerio ve Puppeteer ile web sayfalarından yapılandırılmış veri çeker.",                 ["Linux","macOS"],           true,  "Native"],
  ["Must-b Multi-Language Translator",    "v1.3.0", "Google Translate ve DeepL API ile metni 100+ dile çevirir.",                             ["Linux","macOS","Windows"], false, "Google"],
  ["Must-b Math & Statistics Engine",     "v1.1.0", "İstatistiksel analiz, regresyon ve sayısal hesaplama araçları.",                         ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b SQL Database Explorer",        "v1.5.0", "SQLite, MySQL ve PostgreSQL üzerinde natural language SQL sorgular.",                    ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Git Operations Manager",       "v1.6.0", "Git add, commit, push, merge ve rebase işlemlerini otomatikleştirir.",                   ["Linux","macOS","Windows"], true,  "Git"],
  ["Must-b Docker Build & Push",          "v1.4.0", "Docker image build eder, tag'ler ve registry'ye push eder.",                             ["Linux","macOS"],           true,  "Docker"],
  ["Must-b SSH Remote Connector",         "v1.2.0", "Uzak sunuculara SSH bağlanır, komut çalıştırır ve dosya transfer eder.",                 ["Linux","macOS"],           false, "SSH"],
  ["Must-b SFTP File Transfer",           "v1.1.0", "SFTP üzerinden dosya yükleme, indirme ve dizin listeleme yapar.",                        ["Linux","macOS"],           false, "SFTP"],
  ["Must-b Regex Pattern Processor",      "v1.0.0", "Gelişmiş regex desenleriyle metin ayıklar, doğrular ve dönüştürür.",                     ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b JSON & YAML Transformer",      "v1.2.0", "JSON/YAML verisini dönüştürür, doğrular ve şema karşılaştırır.",                         ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b CSV & Excel Parser",           "v1.3.0", "CSV ve Excel dosyalarını okur, yazar ve veri temizleme yapar.",                           ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b QR Code Generator",            "v1.0.0", "URL, metin veya vCard içerikli QR kod üretir ve PNG olarak kaydeder.",                   ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Chart & Graph Maker",          "v1.2.0", "Chart.js tabanlı çizgi, çubuk ve pasta grafiklerini SVG/PNG olarak üretir.",             ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Map & Geo Plotter",            "v1.1.0", "Koordinat verilerini harita üzerine işaretler ve statik harita görüntüsü üretir.",       ["Linux","macOS","Windows"], false, "Geo"],
  ["Must-b Push Notification Sender",     "v1.2.0", "FCM ve APNs üzerinden mobil push bildirimleri gönderir.",                               ["Linux","macOS","Windows"], false, "FCM"],
  ["Must-b Webhook Dispatcher",           "v1.4.0", "Tanımlı endpoint'lere olay tetiklendiğinde signed webhook gönderir.",                    ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Secret & Password Vault",      "v1.5.0", "AES-256 şifreli yerel secret kasası yönetir ve key rotasyonu uygular.",                  ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Rate Limiter & Throttle",      "v1.1.0", "API çağrılarına token bucket ve sliding window rate limiting uygular.",                  ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Redis Cache Plugin",           "v2.0.0", "Must-b sonuçlarını Redis'e cache'ler, TTL ve invalidation yönetir.",                     ["Linux","macOS","Windows"], true,  "Redis"],
  ["Must-b Queue Manager (BullMQ)",       "v1.4.0", "BullMQ ile görev kuyruğu oluşturur, priority ve retry yönetir.",                        ["Linux","macOS"],           false, "BullMQ"],
  ["Must-b Event Bus",                    "v1.1.0", "Ajan içi EventEmitter tabanlı asenkron olay sistemi.",                                   ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Structured Logger",            "v1.3.0", "JSON formatlı, seviye bazlı log üretir; dosya ve stream'e yazar.",                       ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Database Backup Manager",      "v1.2.0", "PostgreSQL ve MySQL veritabanlarını otomatik dump alır ve S3'e yükler.",                 ["Linux","macOS"],           false, "Native"],
  ["Must-b File Sync Engine",             "v1.0.0", "İki dizin veya uzak storage arasında dosya değişikliklerini senkronize eder.",           ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Schema Migration Tool",        "v1.2.0", "Veritabanı migration'larını sürümler, uygular ve geri alır.",                            ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Automated Test Runner",        "v1.4.0", "Jest ve Vitest test suite'lerini çalıştırır, sonuçları raporlar.",                       ["Linux","macOS","Windows"], false, "Jest"],
  ["Must-b Load & Stress Tester",         "v1.1.0", "k6 tabanlı HTTP yük testi senaryoları yazar ve çalıştırır.",                             ["Linux","macOS"],           false, "k6"],
  ["Must-b Security Vulnerability Scanner","v1.3.0","npm audit ve OWASP ZAP ile bağımlılık ve web güvenlik açıklarını tarar.",               ["Linux","macOS"],           true,  "Security"],
  ["Must-b GDPR Compliance Checker",      "v1.1.0", "Kodbase ve config'i GDPR uyumluluk açısından tarar ve rapor üretir.",                    ["Linux","macOS","Windows"], false, "Compliance"],
  ["Must-b Cloud Cost Optimizer",         "v1.2.0", "AWS ve GCP kaynaklarının maliyet analizini yapar ve tasarruf önerir.",                   ["Linux","macOS"],           true,  "Cloud"],
  ["Must-b API Usage Analytics",          "v1.0.0", "Ajan API çağrı geçmişini özetler, anomali ve maliyet spike'ı tespit eder.",             ["Linux","macOS","Windows"], false, "Native"],
  ["Must-b Token Usage Tracker",          "v1.1.0", "LLM token tüketimini takip eder, bütçe aşımında uyarı verir.",                          ["Linux","macOS","Windows"], true,  "Native"],
  ["Must-b Proxy & VPN Manager",          "v1.0.0", "HTTP/SOCKS5 proxy rotasyonu ve VPN bağlantı yönetimi yapar.",                            ["Linux","macOS"],           false, "Network"],
  ["Must-b Multi-Cloud Storage Bridge",   "v1.2.0", "S3, GCS ve Azure Blob arasında dosya kopyalama ve senkronizasyon.",                      ["Linux","macOS"],           true,  "Cloud"],
];

// ── Build item ─────────────────────────────────────────────────────────────
function buildItem(id, row, type) {
  const [name, version, summary, os, is_certified, service] = row;
  const stars = (Math.floor(Math.random() * 20000) + 500).toLocaleString("en-US").replace(/,/g,"") + (Math.random() > 0.5 ? "k" : "");
  const dl = Math.random() > 0.5
    ? (Math.floor(Math.random() * 900) + 100) + "k"
    : (Math.floor(Math.random() * 9) + 1) + "." + Math.floor(Math.random() * 9) + "m";

  const readme = `## ${name}\n\n${summary}\n\n### Özellikler\n- Tam Must-b Core entegrasyonu\n- Otomatik yeniden bağlanma ve hata yönetimi\n- Yapılandırılmış JSON loglama\n- Async/await tabanlı non-blocking API\n\n### Gereksinimler\n- Node.js 18+\n- ${service} hesabı ve API erişimi\n- Must-b Core v1.2+`;

  const integration_guide = `### ${service} Entegrasyon Kılavuzu\n\n**Adım 1 — API Anahtarı**\n${service} dashboard'undan API key alın.\n\n**Adım 2 — Must-b Config**\n\`\`\`json\n{ "${service.toUpperCase().replace(/\s/g,"_")}_API_KEY": "your-key-here" }\n\`\`\`\n\n**Adım 3 — Aktivasyon**\nMust-b gateway'i yeniden başlatın. Skill otomatik yüklenir ve hazır hale gelir.`;

  return {
    id,
    name,
    version,
    summary,
    author: "@must-b_core",
    stars: typeof stars === "string" && stars.length < 6 ? stars : Math.floor(Math.random()*15+1)+"k",
    downloads: dl,
    os,
    is_certified,
    readme,
    integration_guide,
    download_url: `/downloads/${type}-${id}.zip`,
  };
}

// ── Assemble data ──────────────────────────────────────────────────────────
const skills = [
  ...existingSkills,
  ...newSkillsCatalog.map((row, i) => buildItem(21 + i, row, "skill")),
];

const plugins = [
  ...existingPlugins,
  ...newPluginsCatalog.map((row, i) => buildItem(6 + i, row, "plugin")),
];

const output = {
  counts: {
    skills: skills.length.toLocaleString(),
    plugins: plugins.length.toLocaleString(),
  },
  skills,
  plugins,
};

const outPath = path.join(__dirname, "src/data/mustb-hub-data.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");

console.log(`✅  mustb-hub-data.json written: ${skills.length} skills, ${plugins.length} plugins`);
