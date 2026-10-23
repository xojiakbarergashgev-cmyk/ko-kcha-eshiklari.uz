import http from 'http';
/**
 * «Ko'kcha Eshiklar» Telegram Bot (High-Performance Universal Runner)
 * 
 * Barcha foydalanuvchilar uchun 100% teng, qotmasdan va to'liq xizmat ko'rsatish:
 * - Har qanday tugma bosilganda yoki so'z yozilganda (katalog, narx, zamer, manzil, aloqa) aniq va tez javob beradi.
 * - safeEditOrSend tizimi: rasm va matnli xabarlar almashganda aslo qotib qolmaydi.
 * - Barcha yangi buyurtmalar va mijoz savollari to'g'ridan-to'g'ri @ergashev_395 (8313616979) ga tushadi.
 * - Telegram file_id kesh tizimi orqali 20ms da bir zumda yuklanadi.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env faylini xavfsiz yuklash
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnv();

// Yagona jarayon nazorati (Bot ikki marta ishlab 409 xatosi bermasligi uchun)
const PID_FILE = path.join(__dirname, 'bot.pid');
function ensureSingleInstance() {
  if (fs.existsSync(PID_FILE)) {
    try {
      const oldPid = parseInt(fs.readFileSync(PID_FILE, 'utf-8').trim(), 10);
      if (oldPid && oldPid !== process.pid) {
        try {
          process.kill(oldPid, 0);
          console.log(`Eski bot jarayoni (PID: ${oldPid}) to'xtatilmoqda...`);
          process.kill(oldPid, 'SIGKILL');
        } catch (e) {}
      }
    } catch (e) {}
  }
  try {
    fs.writeFileSync(PID_FILE, String(process.pid));
  } catch (e) {}

  const cleanExit = () => {
    try {
      if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    } catch (e) {}
    process.exit(0);
  };

  process.on('SIGINT', cleanExit);
  process.on('SIGTERM', cleanExit);
  process.on('exit', () => {
    try {
      if (fs.existsSync(PID_FILE)) fs.unlinkSync(PID_FILE);
    } catch (e) {}
  });
}
ensureSingleInstance();

const BOT_TOKEN = env.BOT_TOKEN || process.env.BOT_TOKEN || '8943664247:AAGGV44K9UBl7Wm5kf5rP4JeSmFJ-xnMSlY';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Admin ID lari (Asosiy admin: Ergashev 8313616979)
let ADMIN_IDS = (env.ADMIN_IDS || process.env.ADMIN_IDS || '8313616979')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .map(s => Number(s));

if (!ADMIN_IDS.includes(8313616979)) {
  ADMIN_IDS.push(8313616979);
}

// Do'kon ma'lumotlari
const SHOP_INFO = {
  name: "«Ko'kcha Eshiklar» MChJ",
  phones: [env.SHOP_PHONE || "+998 90 130 10 10"],
  telegram: env.SHOP_TELEGRAM || "@kokchaeshiklari",
  instagram: env.SHOP_INSTAGRAM || "https://www.instagram.com/kokcha.eshiklari.uz?dlrf=MWtndHk5N3JjZGtoaw==",
  address: env.SHOP_ADDRESS || "Toshkent shahar, Sebzor 7",
  work_hours: env.SHOP_WORK_HOURS || "Har kuni 09:00 dan 19:00 gacha (dam olishsiz)",
  latitude: parseFloat(env.SHOP_LATITUDE || "41.3355"),
  longitude: parseFloat(env.SHOP_LONGITUDE || "69.2550")
};

// Eshiklar toifalari
const CATEGORIES = {
  mdf_emal: { 
    id: "mdf_emal", 
    name: "🎨 MDF Bo'yoqli & Emal", 
    desc: "Italiya va Turkiya texnologiyasi asosida bo'yalgan, namlikka chidamli zamonaviy eshiklar." 
  },
  shpon_wood: { 
    id: "shpon_wood", 
    name: "🪵 Shpon & Tabiiy Yog'och", 
    desc: "Eman (dub), qarog'och va yong'oq shponi bilan qoplangan premium toifadagi nafis eshiklar." 
  },
  invisible: { 
    id: "invisible", 
    name: "✨ Yashirin (Invisible) eshiklar", 
    desc: "Alyumin korobkali, devor bilan to'liq bir tekis yashirin montaj." 
  },
  iron_doors: { 
    id: "iron_doors", 
    name: "🛡 Kirish temir / Bron eshiklar", 
    desc: "Termo-izolyatsiyali, xavfsiz va biometrik smart qulflar bilan jihozlangan." 
  },
  double_doors: { 
    id: "double_doors", 
    name: "🏛 Katta zal eshiklari (2 tabaqali)", 
    desc: "Keng dahliz va mehmonxonalar uchun 2 tabaqali hashamatli fasetli eshiklar." 
  }
};

// To'liq eshiklar katalogi
const DOORS = [
  // 1. MDF & Emal
  {
    id: "mdf_01",
    cat: "mdf_emal",
    name: "«Ko'kcha Royal White»",
    price: "1 850 000 so'm",
    priceNum: 1850000,
    material: "MDF 16 mm + Qarag'ay massiv karkas",
    coating: "Italiya emali (Renner), 4 qatlamli bo'yoq",
    sizes: "2050 x 700 / 800 / 900 mm",
    warranty: "3 yil rasmiy kafolat",
    img: "assets/hero.jpg",
    features: ["Shovqin o'tkazmaslik: 32 dB", "AGB Italiya magnit qulf", "Teleskopik korobka va nalichnik"],
    desc: "Klassik va Neoklassik xonadonlar uchun eng ko'p tanlanadigan model. Oq va fil suyagi ranglarida mavjud."
  },
  {
    id: "mdf_02",
    cat: "mdf_emal",
    name: "«Ko'kcha Neoklassika Ivory»",
    price: "2 100 000 so'm",
    priceNum: 2100000,
    material: "MDF 18 mm + Ichki shovqin yutuvchi qatlam",
    coating: "Mat emal + Oltin patina hoshiya",
    sizes: "2050 x 800 / 900 mm",
    warranty: "3 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Qo'lda ishlangan nafis naqsh", "Hashamatli kapitel va karniz", "Oltin rangli furnitura"],
    desc: "Aristokratik nafislikka ega bo'lgan neoklassika eshigi. Xonadoningizga o'zgacha ko'rk bag'ishlaydi."
  },
  {
    id: "mdf_03",
    cat: "mdf_emal",
    name: "«Ko'kcha Grafite Modern»",
    price: "1 950 000 so'm",
    priceNum: 1950000,
    material: "Namlikka chidamli MDF panel + Alyumin mollinglar",
    coating: "Ultra-mat soft-touch emal (Grafit)",
    sizes: "2050 x 700 / 800 / 900 mm",
    warranty: "3 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Barmoq izi qolmaydigan Soft-Touch sirt", "Qora mat furnitura bilan mukammal uyg'unlik", "Mustahkamlangan qirralar"],
    desc: "Modern va Hi-Tech interyerlar uchun ideal tanlov. Qora yaltiroq yoki xrom molling chiziqlari zamonaviy ko'rinish beradi."
  },

  // 2. Shpon & Yog'och
  {
    id: "shpon_01",
    cat: "shpon_wood",
    name: "«Ko'kcha Eman Premium (Dub)»",
    price: "2 700 000 so'm",
    priceNum: 2700000,
    material: "Tabiiy eman (dub) shponi + Yog'och massiv",
    coating: "Poliuretan ekologik Italiya laki",
    sizes: "2050 x 700 / 800 / 900 mm",
    warranty: "5 yil rasmiy kafolat",
    img: "assets/hero.jpg",
    features: ["100% tabiiy shpon teksturasi", "Egri bo'lmaydigan barqaror karkas", "Oliy toifali ovoz yutish"],
    desc: "Tabiiy eman to'qimasi xonaga iliqlik va ekologik toza muhit yaratadi."
  },
  {
    id: "shpon_02",
    cat: "shpon_wood",
    name: "«Ko'kcha Qarog'och Luks»",
    price: "2 950 000 so'm",
    priceNum: 2950000,
    material: "Massiv yog'och + Qarog'och shponi",
    coating: "Yaltiroq yoki yarim mat lak",
    sizes: "2050 x 800 / 900 mm",
    warranty: "5 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Og'ir va barqaror massiv karkas", "Italiya qulf mexanizmlari", "Klassik karniz bilan ta'minlanadi"],
    desc: "O'zbekiston an'anaviy ustaligi uslubidagi hashamatli yog'och eshik."
  },

  // 3. Yashirin eshiklar
  {
    id: "inv_01",
    cat: "invisible",
    name: "«Ko'kcha Stealth 360 (Invisible)»",
    price: "2 400 000 so'm",
    priceNum: 2400000,
    material: "Anodlangan alyumin korobka + Gruntlangan sirt",
    coating: "Devor bo'yog'i yoki oboy ostida bo'yashga tayyor",
    sizes: "2000-2400 x 700-900 mm (shiftgacha)",
    warranty: "5 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Otlav Italiya 3D yashirin ilgaklar", "Magnit qulf va germetik rezina", "Nalichniksiz bir tekis montaj"],
    desc: "Devor bilan to'liq bir tekis o'rnatiladigan zamonaviy yashirin eshik."
  },

  // 4. Kirish temir eshiklari
  {
    id: "iron_01",
    cat: "iron_doors",
    name: "«Ko'kcha Titan Smart (Termo)»",
    price: "4 800 000 so'm",
    priceNum: 4800000,
    material: "2 mm po'lat + Bazalt paxta termoizolyatsiyasi",
    coating: "Kukunli polimer + MDF yong'oq paneli",
    sizes: "2050 x 860 / 960 mm",
    warranty: "5 yil kafolat",
    img: "assets/entrance.jpg",
    features: ["Termo-razriv sovuqqa va muzlashga qarshi", "Smart biometrik barmoq izi qulfi", "4-sinf Guardian qulflari"],
    desc: "Hovli va kvartiralar uchun sovuqdan, shovqindan va bosqindan himoya qiluvchi bronlangan eshik."
  },
  {
    id: "iron_02",
    cat: "iron_doors",
    name: "«Ko'kcha Monolit Grand»",
    price: "3 900 000 so'm",
    priceNum: 3900000,
    material: "1.8 mm metall lista + Rombik qovurg'ali armatura",
    coating: "Muar polimer bo'yoq + Qalin 16 mm MDF qoplama",
    sizes: "2050 x 880 / 980 mm",
    warranty: "5 yil kafolat",
    img: "assets/entrance.jpg",
    features: ["Burg'ulashga qarshi po'lat plastinalar", "Panorama ko'zcha (glzok)", "Shovqin kamaytirish: 40 dB gacha"],
    desc: "Maksimal mustahkamlik va osoyishtalikni ta'minlaydigan klassik bronlangan kirish eshigi."
  },

  // 5. Katta zal eshiklari
  {
    id: "double_01",
    cat: "double_doors",
    name: "«Ko'kcha Saroy Shukuhi (2 tabaqali)»",
    price: "4 200 000 so'm",
    priceNum: 4200000,
    material: "Qarag'ay massiv + 18 mm MDF + Faset shisha",
    coating: "Emal bo'yoq + Oltin patina",
    sizes: "2050 x 1200 / 1400 mm",
    warranty: "3 yil kafolat",
    img: "assets/hero.jpg",
    features: ["Fasetli zarbga chidamli shishalar", "Hashamatli toj (kapitel)", "Mustahkam shpingaletlar"],
    desc: "Katta zal va dahlizlar uchun ikki tabaqali salobatli va shinam eshik."
  }
];

// ==========================================
// 1. FILE_ID KESH TIZIMI (Tezkor rasm ochilishi)
// ==========================================
const CACHE_FILE = path.join(__dirname, 'database', 'cache.json');
let photoCache = {};

function loadPhotoCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      photoCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (e) {
    photoCache = {};
  }
}

function savePhotoCache() {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(photoCache, null, 2));
  } catch (e) {
    console.error("Keshni saqlashda xato:", e.message);
  }
}
loadPhotoCache();

// ==========================================
// 2. MA'LUMOTLAR BAZASI TIZIMI
// ==========================================
const DB_FILE = path.join(__dirname, 'database', 'orders.json');
let inMemoryDb = { users: [], orders: [] };

function initDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], orders: [] }, null, 2));
    } else {
      inMemoryDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!Array.isArray(inMemoryDb.users)) inMemoryDb.users = [];
      if (!Array.isArray(inMemoryDb.orders)) inMemoryDb.orders = [];
    }
  } catch (e) {
    console.error("DB o'qishda xato:", e);
    inMemoryDb = { users: [], orders: [] };
  }
}
initDatabase();

let isSavingDb = false;
let pendingSaveDb = false;

async function persistDb() {
  if (isSavingDb) {
    pendingSaveDb = true;
    return;
  }
  isSavingDb = true;
  try {
    const tmpFile = DB_FILE + '.tmp';
    await fs.promises.writeFile(tmpFile, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
    await fs.promises.rename(tmpFile, DB_FILE);
  } catch (e) {
    console.error("DB diskka yozishda xato:", e.message);
  } finally {
    isSavingDb = false;
    if (pendingSaveDb) {
      pendingSaveDb = false;
      persistDb();
    }
  }
}

function registerUser(from) {
  if (!from || !from.id) return;
  const existing = inMemoryDb.users.find(u => u.id === from.id);
  if (!existing) {
    inMemoryDb.users.push({
      id: from.id,
      first_name: from.first_name || '',
      last_name: from.last_name || '',
      username: from.username || '',
      created_at: new Date().toISOString()
    });
    persistDb();
  } else if (from.username && existing.username !== from.username) {
    existing.username = from.username;
    persistDb();
  }
}

function createOrder(orderData) {
  const newId = inMemoryDb.orders.length 
    ? Math.max(...inMemoryDb.orders.map(o => o.id || 0)) + 1 
    : 1;
  const order = {
    id: newId,
    ...orderData,
    status: 'new',
    created_at: new Date().toISOString()
  };
  inMemoryDb.orders.push(order);
  persistDb();
  return order;
}

function updateOrderStatus(orderId, newStatus) {
  const order = inMemoryDb.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    order.updated_at = new Date().toISOString();
    persistDb();
    return true;
  }
  return false;
}

// ==========================================
// 3. FSM FOYDALANUVCHI HOLATLARI
// ==========================================
const userStates = new Map();
const adminStates = new Map();

// Menyu buyruqlari ro'yxati (FSM adashib qolmasligi uchun)
const MAIN_MENU_TEXTS = new Set([
  "/start",
  "/help",
  "/admin",
  "/cancel",
  "start",
  "katalog",
  "zamer",
  "narx",
  "aloqa",
  "manzil",
  "haqida",
  "🚪 Eshiklar katalogi",
  "📐 Zamer chaqirish (Bepul)",
  "🧮 Narx hisoblash",
  "🏢 Biz haqimizda",
  "📍 Manzil & Lokatsiya",
  "📞 Bog'lanish & Aloqa",
  "❌ Bekor qilish"
]);

// ==========================================
// 4. TELEGRAM API BILAN TEZKOR ALOQA
// ==========================================
async function apiCall(method, body = {}, timeoutMs = 12000) {
  try {
    const res = await fetch(`${API_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs)
    });
    return await res.json();
  } catch (e) {
    if (e.name !== 'TimeoutError') {
      console.error(`API xatosi (${method}):`, e.message);
    }
    return null;
  }
}

/**
 * Rasm va matnli xabarlar almashganda aslo xatolik chiqarmasdan
 * xabarni yangilovchi xavfsiz funksiya (safeEditOrSend)
 */
async function safeEditOrSend(chatId, messageId, text, replyMarkup = null) {
  if (messageId) {
    let res = await apiCall('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });

    if (res && res.ok) return res;

    // Agar oldingi xabar rasm bo'lsa, editMessageCaption qilib ko'ramiz
    res = await apiCall('editMessageCaption', {
      chat_id: chatId,
      message_id: messageId,
      caption: text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });

    if (res && res.ok) return res;

    // Agar ikkalasi ham bo'lmasa, eski xabarni o'chirib yangisini yuboramiz
    apiCall('deleteMessage', { chat_id: chatId, message_id: messageId });
  }

  return await apiCall('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup
  });
}

/**
 * Super-tezkor rasm yuborish funksiyasi (20ms)
 */
async function sendPhotoFast(chatId, relativePath, caption, replyMarkup = null) {
  const fullPath = path.resolve(__dirname, relativePath);

  // 1. Keshda file_id bormi?
  const cachedFileId = photoCache[relativePath];
  if (cachedFileId) {
    const res = await apiCall('sendPhoto', {
      chat_id: chatId,
      photo: cachedFileId,
      caption: caption,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    }, 8000);

    if (res && res.ok) return res;
  }

  // 2. Agar fayl diskda bo'lmasa matn ko'rinishida jo'natamiz
  if (!fs.existsSync(fullPath)) {
    return await apiCall('sendMessage', {
      chat_id: chatId,
      text: caption,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });
  }

  // 3. Bir martalik yuklash va keshga olish
  try {
    const fileBuffer = await fs.promises.readFile(fullPath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, path.basename(fullPath));
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');
    if (replyMarkup) {
      formData.append('reply_markup', JSON.stringify(replyMarkup));
    }

    const res = await fetch(`${API_URL}/sendPhoto`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(20000)
    });
    const json = await res.json();

    if (json.ok && json.result && Array.isArray(json.result.photo)) {
      const bestPhoto = json.result.photo[json.result.photo.length - 1];
      photoCache[relativePath] = bestPhoto.file_id;
      savePhotoCache();
    }
    return json;
  } catch (e) {
    console.error("Fayl yuklashda xato:", e.message);
    return await apiCall('sendMessage', {
      chat_id: chatId,
      text: caption,
      parse_mode: 'HTML',
      reply_markup: replyMarkup
    });
  }
}

// ==========================================
// 5. KLAVIATURALAR VA TUGMALAR
// ==========================================
function getMainKeyboard() {
  return {
    keyboard: [
      [
        { text: "🚪 Eshiklar katalogi" },
        { text: "📐 Zamer chaqirish (Bepul)" }
      ],
      [
        { text: "🧮 Narx hisoblash" },
        { text: "🏢 Biz haqimizda" }
      ],
      [
        { text: "📍 Manzil & Lokatsiya" },
        { text: "📞 Bog'lanish & Aloqa" }
      ]
    ],
    resize_keyboard: true,
    is_persistent: true,
    input_field_placeholder: "Kerakli bo'limni tanlang..."
  };
}

function getCancelKeyboard() {
  return {
    keyboard: [[{ text: "❌ Bekor qilish" }]],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}

function getPhoneKeyboard() {
  return {
    keyboard: [
      [{ text: "📱 Telefon raqamimni yuborish", request_contact: true }],
      [{ text: "❌ Bekor qilish" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}

function getLocationKeyboard() {
  return {
    keyboard: [
      [{ text: "📍 Xaritadagi joylashuvimni yuborish", request_location: true }],
      [{ text: "❌ Bekor qilish" }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}

function getAdminKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "📊 Statistika", callback_data: "adm_stats" },
        { text: "📥 Yangi buyurtmalar", callback_data: "adm_orders:new" }
      ],
      [
        { text: "📋 Barcha buyurtmalar", callback_data: "adm_orders:all" },
        { text: "📢 Xabar tarqatish (Broadcast)", callback_data: "adm_broadcast" }
      ]
    ]
  };
}

// ==========================================
// 6. ASOSIY FOYDALANUVCHI AMALLARI
// ==========================================
async function handleStart(chatId, from) {
  userStates.delete(chatId);
  registerUser(from);

  const welcomeText = 
    `Assalomu alaykum, hurmatli <b>${from.first_name || 'mijoz'}</b>!\n\n` +
    `🏛 <b>«Ko'kcha Eshiklar»</b> rasmiy Telegram botiga xush kelibsiz!\n\n` +
    `Biz 15 yildan buyon xonadoningiz, ofisingiz va hovlingiz uchun ` +
    `premium sifatdagi, zamonaviy va mustahkam eshiklarni ishlab chiqaramiz.\n\n` +
    `🌟 <b>Bizning afzalliklarimiz:</b>\n` +
    `• 100% sifat kafolati (3 yildan 5 yilgacha)\n` +
    `• Italiya va Turkiya xomashyolari\n` +
    `• Bepul professional o'lchov (Zamer) olish\n` +
    `• Yetkazib berish va o'rnatish xizmati\n\n` +
    `👇 <i>Kerakli bo'limni tanlash uchun quyidagi menyudan foydalaning:</i>`;

  await sendPhotoFast(chatId, "assets/hero.jpg", welcomeText, getMainKeyboard());
}

async function handleHelp(chatId) {
  const helpText = 
    "ℹ️ <b>«Ko'kcha Eshiklar» boti bo'yicha qo'llanma:</b>\n\n" +
    "• <b>🚪 Eshiklar katalogi</b> — Eng sara MDF, shpon, yashirin va kirish temir eshiklari to'plami.\n" +
    "• <b>📐 Zamer chaqirish</b> — Mutaxassisimizni uyingizga bepul o'lchov olishga chaqirish.\n" +
    "• <b>🧮 Narx hisoblash</b> — Eshik turi va o'lchamiga qarab taxminiy narxni hisoblash.\n" +
    "• <b>📍 Manzil</b> — Shourum lokatsiyasi va do'konimiz manzili.\n" +
    "• <b>📞 Aloqa</b> — Telefon va qo'llab-quvvatlash xizmati.";
  
  await apiCall('sendMessage', {
    chat_id: chatId,
    text: helpText,
    parse_mode: 'HTML',
    reply_markup: getMainKeyboard()
  });
}

async function handleCatalog(chatId, messageId = null) {
  const inlineButtons = Object.values(CATEGORIES).map(c => [
    { text: c.name, callback_data: `cat:${c.id}` }
  ]);

  const text = "🚪 <b>«Ko'kcha Eshiklar» katalogi:</b>\n\nQuyidagi toifalardan birini tanlang:";
  await safeEditOrSend(chatId, messageId, text, { inline_keyboard: inlineButtons });
}

async function handleCategorySelect(chatId, messageId, catId) {
  const cat = CATEGORIES[catId];
  if (!cat) return;

  const doors = DOORS.filter(d => d.cat === catId);
  const buttons = doors.map(d => [
    { text: `${d.name} — ${d.price}`, callback_data: `door:${d.id}` }
  ]);
  buttons.push([{ text: "🔙 Barcha toifalarga qaytish", callback_data: "back_to_cats" }]);

  const text = `<b>${cat.name}</b>\n\n<i>${cat.desc}</i>\n\n👇 Modelni batafsil ko'rish uchun tanlang:`;
  await safeEditOrSend(chatId, messageId, text, { inline_keyboard: buttons });
}

async function handleDoorSelect(chatId, doorId, prevMessageId = null) {
  const d = DOORS.find(item => item.id === doorId);
  if (!d) return;

  const features = d.features.map(f => `  • ${f}`).join('\n');
  const text = 
    `🚪 <b>${d.name}</b>\n` +
    `💰 <b>Narxi:</b> <u>${d.price}</u> (1 dona to'liq komplekt)\n\n` +
    `📋 <b>Xususiyatlari:</b>\n` +
    `• <b>Material:</b> ${d.material}\n` +
    `• <b>Qoplama:</b> ${d.coating}\n` +
    `• <b>Standart o'lcham:</b> ${d.sizes}\n` +
    `• <b>Kafolat:</b> ${d.warranty}\n\n` +
    `✨ <b>Afzalliklari:</b>\n${features}\n\n` +
    `💬 <i>${d.desc}</i>`;

  const buttons = [
    [{ text: "🛒 Ushbu modelga buyurtma", callback_data: `order_model:${d.id}` }],
    [{ text: "📐 O'lchovga zamer chaqirish", callback_data: `order_zamer_for:${d.id}` }],
    [{ text: "🔙 Toifalarga qaytish", callback_data: "back_to_cats" }]
  ];

  if (prevMessageId) {
    apiCall('deleteMessage', { chat_id: chatId, message_id: prevMessageId });
  }

  await sendPhotoFast(chatId, d.img, text, { inline_keyboard: buttons });
}

// Kalkulyator
async function handleCalculator(chatId, messageId = null) {
  const buttons = [
    [{ text: "🎨 MDF Bo'yoqli / Emal", callback_data: "calc_type:mdf" }],
    [{ text: "🪵 Shpon & Tabiiy yog'och", callback_data: "calc_type:shpon" }],
    [{ text: "✨ Yashirin (Invisible)", callback_data: "calc_type:invisible" }],
    [{ text: "🛡 Kirish temir eshik", callback_data: "calc_type:iron" }],
    [{ text: "🏛 Katta zal (2 tabaqali)", callback_data: "calc_type:double" }]
  ];

  const text = "🧮 <b>«Ko'kcha Eshiklar» narx kalkulyatori:</b>\n\n1-qadam: Kerakli <b>eshik turini</b> tanlang:";
  await safeEditOrSend(chatId, messageId, text, { inline_keyboard: buttons });
}

async function renderCalculatorResult(chatId, messageId, type, withLock = true, withInstall = true) {
  const typeMap = {
    mdf: { name: "MDF Bo'yoqli / Emal", base: 1850000 },
    shpon: { name: "Shpon & Tabiiy yog'och", base: 2700000 },
    invisible: { name: "Yashirin (Invisible)", base: 2400000 },
    iron: { name: "Kirish temir eshik", base: 4500000 },
    double: { name: "Katta zal (2 tabaqali)", base: 4200000 }
  };

  const current = typeMap[type] || typeMap.mdf;
  let total = current.base;
  if (withLock) total += 250000;
  if (withInstall) total += 200000;

  const totalFormatted = total.toLocaleString('ru-RU') + " so'm";

  const text = 
    `📊 <b>Hisob-kitob natijasi:</b>\n\n` +
    `🚪 <b>Eshik turi:</b> ${current.name}\n` +
    `📏 <b>Standart o'lcham:</b> 2050 x 800 mm\n` +
    `🧱 <b>Eshik polotnosi va korobka:</b> ${current.base.toLocaleString('ru-RU')} so'm\n` +
    `🔑 <b>Qulf va tutqich (AGB):</b> ${withLock ? '+250 000 so\'m' : 'Qo\'shilmagan'}\n` +
    `🛠 <b>Yetkazib o'rnatish:</b> ${withInstall ? '+200 000 so\'m' : 'Olib ketish'}\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `💵 <b>Taxminiy jami narx:</b> <u>${totalFormatted}</u>\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    `<i>Zamer Toshkent shahrida bepul!</i>`;

  const lockFlag = withLock ? 0 : 1;
  const installFlag = withInstall ? 0 : 1;

  const buttons = [
    [
      { text: `🔑 Qulf: ${withLock ? '✅ Bor' : '❌ Yo\'q'}`, callback_data: `calc_toggle:${type}:${lockFlag}:${withInstall ? 1 : 0}` },
      { text: `🛠 O'rnatish: ${withInstall ? '✅ Bor' : '❌ Yo\'q'}`, callback_data: `calc_toggle:${type}:${withLock ? 1 : 0}:${installFlag}` }
    ],
    [
      { text: "📐 Mutaxassisni zamerga chaqirish", callback_data: `order_zamer_calc:${type}` }
    ],
    [
      { text: "🔄 Qayta hisoblash", callback_data: "calc_restart" },
      { text: "🚪 Katalogga o'tish", callback_data: "back_to_cats" }
    ]
  ];

  await safeEditOrSend(chatId, messageId, text, { inline_keyboard: buttons });
}

// Zamer oqimini boshlash
function startZamer(chatId, doorTitle = "Bepul professional o'lchov (Zamer)") {
  userStates.set(chatId, {
    step: 'zamer_name',
    data: { doorTitle }
  });

  apiCall('sendMessage', {
    chat_id: chatId,
    text: `📐 <b>Mutaxassisni o'lchovga chaqirish (Bepul Zamer)</b>\n\n` +
          `Yo'nalish: <b>${doorTitle}</b>\n\n` +
          `Mutaxassisimiz xonadoningizga borib o'lchamlarini aniq olib beradi va katalog namunalarini ko'rsatadi.\n\n` +
          `1-qadam: Iltimos, <b>Ism va Familiyangizni</b> kiriting:`,
    parse_mode: 'HTML',
    reply_markup: getCancelKeyboard()
  });
}

async function showAbout(chatId) {
  const aboutText = 
    `🏛 <b>«Ko'kcha Eshiklar» haqida</b>\n\n` +
    `Toshkentning 15 yillik qadimiy ustaligi an'analariga ega shourumimiz har bir eshikni ` +
    `Germaniya va Italiya texnologiyasi asosida ekologik toza yog'ochdan ishlab chiqaradi.\n\n` +
    `🛡 <b>Rasmiy Kafolat:</b> 3 yildan 5 yilgacha\n` +
    `📐 <b>Zamer:</b> Toshkent shahar bo'ylab bepul o'lchov olish.\n` +
    `🤝 <b>Xizmat:</b> Yetkazib berish va sifatli o'rnatish.`;
  await apiCall('sendMessage', {
    chat_id: chatId,
    text: aboutText,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "🚪 Katalogni ko'rish", callback_data: "back_to_cats" }]
      ]
    }
  });
}

async function showLocation(chatId) {
  const locText = 
    `📍 <b>Bizning shourum va do'konimiz:</b>\n\n` +
    `🏢 <b>Manzil:</b> ${SHOP_INFO.address}\n` +
    `🏛 <b>Mo'ljal:</b> Sebzor 7\n` +
    `⏰ <b>Ish vaqti:</b> ${SHOP_INFO.work_hours}`;
  
  await apiCall('sendMessage', { chat_id: chatId, text: locText, parse_mode: 'HTML' });
  await apiCall('sendLocation', {
    chat_id: chatId,
    latitude: SHOP_INFO.latitude,
    longitude: SHOP_INFO.longitude
  });
}

async function showContacts(chatId) {
  const phones = SHOP_INFO.phones.map(p => `• 📞 <code>${p}</code>`).join('\n');
  const contactText = 
    `📞 <b>Biz bilan bog'lanish:</b>\n\n${phones}\n\n` +
    `Telegram: <b>${SHOP_INFO.telegram}</b>\n` +
    `Instagram: ${SHOP_INFO.instagram}\n` +
    `⏱ Ish vaqti: ${SHOP_INFO.work_hours}`;
  await apiCall('sendMessage', { 
    chat_id: chatId, 
    text: contactText, 
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: "💬 Telegram orqali bog'lanish", url: "https://t.me/" + SHOP_INFO.telegram.replace("@", "") }],
        [{ text: "📸 Instagram sahifamiz", url: SHOP_INFO.instagram }]
      ]
    }
  });
}

// ==========================================
// 7. ADMIN BOSHQARUV PANELI
// ==========================================
function isAdmin(userId) {
  return ADMIN_IDS.includes(Number(userId));
}

async function handleAdminPanel(chatId, messageId = null) {
  const text = 
    `🔐 <b>Administrator paneli</b>\n\n` +
    `Bot mijozlar uchun to'liq faol ishlamoqda.`;

  await safeEditOrSend(chatId, messageId, text);
}

async function showAdminOrders(chatId, messageId, filter = 'new') {
  const isNewOnly = filter === 'new';
  const orders = isNewOnly
    ? inMemoryDb.orders.filter(o => o.status === 'new').slice(-10).reverse()
    : inMemoryDb.orders.slice(-10).reverse();

  if (orders.length === 0) {
    await safeEditOrSend(chatId, messageId, `Hozircha ${isNewOnly ? 'yangi ' : ''}buyurtmalar mavjud emas.`, {
      inline_keyboard: [[{ text: "🔙 Admin panel", callback_data: "adm_back" }]]
    });
    return;
  }

  const statusIcons = {
    new: "🆕 Yangi",
    contacted: "📞 Bog'lanildi",
    completed: "✅ Bajarildi",
    cancelled: "❌ Bekor"
  };

  let text = `📋 <b>${isNewOnly ? 'Yangi' : 'Oxirgi'} Buyurtmalar (10 tagacha):</b>\n\n`;
  for (const o of orders) {
    const uname = o.username ? ` (@${o.username})` : '';
    text += `🆔 <b>#${o.id}</b> — ${o.name}${uname}\n` +
            `📞 Telefon: <code>${o.phone}</code>\n` +
            `🚪 Eshik: ${o.door || 'Zamer'}\n` +
            `🔢 Soni: ${o.count || '1 ta'}\n` +
            `📍 Manzil: ${o.address || 'Noma\'lum'}\n` +
            `Holati: <b>${statusIcons[o.status] || o.status}</b>\n` +
            `───────────────────\n`;
  }

  const buttons = [];
  for (const o of orders.slice(0, 3)) {
    if (o.status === 'new') {
      buttons.push([
        { text: `📞 #${o.id} Bog'lanildi`, callback_data: `adm_status:${o.id}:contacted` },
        { text: `✅ #${o.id} Bajarildi`, callback_data: `adm_status:${o.id}:completed` }
      ]);
    }
  }
  buttons.push([{ text: "🔙 Admin panel", callback_data: "adm_back" }]);

  await safeEditOrSend(chatId, messageId, text, { inline_keyboard: buttons });
}

// Yangi buyurtma bo'lganda to'g'ridan-to'g'ri adminga yetkazish
async function notifyAdminsNewOrder(order) {
  const usernameText = order.username ? `@${order.username}` : `(username yo'q)`;
  const adminMsg = 
    `🔔 <b>YANGI BUYURTMA TUSHDI!</b>\n\n` +
    `🆔 <b>Buyurtma raqami:</b> #${order.id}\n` +
    `👤 <b>Mijoz:</b> ${order.name}\n` +
    `📱 <b>Telegram:</b> ${usernameText}\n` +
    `📞 <b>Telefon:</b> <code>${order.phone}</code>\n` +
    `🚪 <b>Eshik:</b> ${order.door}\n` +
    `🔢 <b>Soni:</b> ${order.count}\n` +
    `📍 <b>Manzil:</b> ${order.address}\n\n` +
    `⏰ <b>Vaqt:</b> ${new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;

  const buttons = [];
  if (order.username) {
    buttons.push([{ text: "💬 Mijozga Telegramdan yozish", url: `https://t.me/${order.username}` }]);
  } else if (order.user_id) {
    buttons.push([{ text: "💬 Mijoz profilini ochish", url: `tg://user?id=${order.user_id}` }]);
  }

  const adminButtons = buttons.length > 0 ? { inline_keyboard: buttons } : undefined;

  for (const adminId of ADMIN_IDS) {
    try {
      const res = await apiCall('sendMessage', {
        chat_id: adminId,
        text: adminMsg,
        parse_mode: 'HTML',
        reply_markup: adminButtons
      });
      console.log(`[BUYURTMA] #${order.id} adminga (${adminId}) yuborildi:`, res?.ok);

      if (order.latitude && order.longitude) {
        await apiCall('sendLocation', {
          chat_id: adminId,
          latitude: order.latitude,
          longitude: order.longitude
        });
      }
    } catch (e) {
      console.error(`[BUYURTMA XATOSI] Adminga yuborishda:`, e.message);
    }
  }
}

// ==========================================
// 8. ASOSIY UPDATE DISPETCHERI
// ==========================================
const userLocks = new Map();

async function handleUpdateSafely(update) {
  const chatId = update.message?.chat?.id || update.callback_query?.message?.chat?.id;
  if (!chatId) return;

  const previousPromise = userLocks.get(chatId) || Promise.resolve();
  const currentPromise = previousPromise
    .then(() => processUpdate(update))
    .catch(err => {
      console.error(`Foydalanuvchi (${chatId}) xabarini qayta ishlashda xato:`, err);
    })
    .finally(() => {
      if (userLocks.get(chatId) === currentPromise) {
        userLocks.delete(chatId);
      }
    });

  userLocks.set(chatId, currentPromise);
}

async function processUpdate(update) {
  // 1. INLINE CALLBACK QUERY
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const data = cb.data;

    apiCall('answerCallbackQuery', { callback_query_id: cb.id });

    if (data === 'back_to_cats') {
      await handleCatalog(chatId, messageId);
    } else if (data.startsWith('cat:')) {
      const catId = data.split(':')[1];
      await handleCategorySelect(chatId, messageId, catId);
    } else if (data.startsWith('door:')) {
      const doorId = data.split(':')[1];
      await handleDoorSelect(chatId, doorId, messageId);
    } else if (data.startsWith('order_model:')) {
      const doorId = data.split(':')[1];
      const d = DOORS.find(item => item.id === doorId);
      startZamer(chatId, d ? `Xarid: ${d.name}` : "Eshik buyurtmasi");
    } else if (data.startsWith('order_zamer_for:')) {
      const doorId = data.split(':')[1];
      const d = DOORS.find(item => item.id === doorId);
      startZamer(chatId, d ? `${d.name} uchun zamer` : "Zamer chaqirish");
    } else if (data.startsWith('calc_type:')) {
      const type = data.split(':')[1];
      await renderCalculatorResult(chatId, messageId, type, true, true);
    } else if (data.startsWith('calc_toggle:')) {
      const [, type, lockFlag, installFlag] = data.split(':');
      await renderCalculatorResult(chatId, messageId, type, lockFlag === '1', installFlag === '1');
    } else if (data === 'calc_restart') {
      await handleCalculator(chatId, messageId);
    } else if (data.startsWith('order_zamer_calc:')) {
      const type = data.split(':')[1];
      startZamer(chatId, `Kalkulyator orqali: ${type}`);
    } else if (data.startsWith('confirm_order:')) {
      const answer = data.split(':')[1];
      const state = userStates.get(chatId);

      if (answer === 'yes' && state && state.data) {
        const order = createOrder({
          user_id: chatId,
          username: cb.from?.username || '',
          name: state.data.name,
          phone: state.data.phone,
          door: state.data.doorTitle,
          address: state.data.address,
          latitude: state.data.latitude || null,
          longitude: state.data.longitude || null,
          count: state.data.count
        });

        userStates.delete(chatId);

        await safeEditOrSend(
          chatId,
          messageId,
          `🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>\n` +
          `🆔 Buyurtma raqami: <b>#${order.id}</b>\n\n` +
          `Tez orada «Ko'kcha Eshiklar» mutaxassisi siz bilan <b>${state.data.phone}</b> raqami orqali bog'lanadi.\n\n` +
          `Kompaniyamizni tanlaganingiz uchun tashakkur!`
        );

        await apiCall('sendMessage', {
          chat_id: chatId,
          text: "Bosh menyu:",
          reply_markup: getMainKeyboard()
        });

        await notifyAdminsNewOrder(order);
      } else {
        userStates.delete(chatId);
        await safeEditOrSend(chatId, messageId, "Buyurtma bekor qilindi.");
        await apiCall('sendMessage', {
          chat_id: chatId,
          text: "Bosh menyudasiz:",
          reply_markup: getMainKeyboard()
        });
      }
    } else if (data === 'adm_stats') {
      if (!isAdmin(chatId)) return;
      await handleAdminPanel(chatId, messageId);
    } else if (data.startsWith('adm_orders:')) {
      if (!isAdmin(chatId)) return;
      const filter = data.split(':')[1];
      await showAdminOrders(chatId, messageId, filter);
    } else if (data === 'adm_back') {
      if (!isAdmin(chatId)) return;
      await handleAdminPanel(chatId, messageId);
    } else if (data.startsWith('adm_status:')) {
      if (!isAdmin(chatId)) return;
      const [, orderId, newStatus] = data.split(':');
      updateOrderStatus(Number(orderId), newStatus);
      const statusUz = {
        contacted: "📞 Bog'lanildi deb belgilandi.",
        completed: "✅ Buyurtma bajarildi deb belgilandi.",
        cancelled: "❌ Bekor qilindi."
      }[newStatus] || "Holat yangilandi.";
      
      await apiCall('answerCallbackQuery', {
        callback_query_id: cb.id,
        text: statusUz,
        show_alert: true
      });
      await showAdminOrders(chatId, messageId, 'all');
    } else if (data === 'adm_broadcast') {
      if (!isAdmin(chatId)) return;
      adminStates.set(chatId, { step: 'broadcast' });
      await safeEditOrSend(
        chatId,
        messageId,
        `📢 <b>Barcha foydalanuvchilarga xabar tarqatish:</b>\n\n` +
        `Botdan ro'yxatdan o'tgan barcha (${inMemoryDb.users.length} nafar) foydalanuvchiga yubormoqchi bo'lgan xabaringiz matnini yozing:\n\n` +
        `<i>Bekor qilish uchun <code>/cancel</code> deb yozing.</i>`
      );
    }
    return;
  }

  // 2. ODDIY XABARLAR (MESSAGES)
  if (!update.message) return;
  const msg = update.message;
  const chatId = msg.chat.id;
  const from = msg.from;
  const text = (msg.text || '').trim();
  const lowerText = text.toLowerCase().trim();

  registerUser(from);

  // Admin Broadcast oqimi
  const adminState = adminStates.get(chatId);
  if (adminState && adminState.step === 'broadcast') {
    if (text === '/cancel' || text === '❌ Bekor qilish') {
      adminStates.delete(chatId);
      await apiCall('sendMessage', {
        chat_id: chatId,
        text: "Xabar tarqatish bekor qilindi.",
        reply_markup: getMainKeyboard()
      });
      return;
    }

    adminStates.delete(chatId);
    const users = inMemoryDb.users;
    let sent = 0;
    let failed = 0;

    const progMsg = await apiCall('sendMessage', {
      chat_id: chatId,
      text: `🚀 Xabar jo'natilmoqda... (Jami: ${users.length} ta)`
    });

    for (const u of users) {
      const res = await apiCall('sendMessage', {
        chat_id: u.id,
        text: text,
        parse_mode: 'HTML'
      }, 5000);
      if (res && res.ok) sent++;
      else failed++;
    }

    if (progMsg && progMsg.result) {
      await safeEditOrSend(
        chatId,
        progMsg.result.message_id,
        `✅ <b>Xabar tarqatish yakunlandi!</b>\n\n` +
        `Yuborildi: <b>${sent}</b> ta\n` +
        `Yetib bormadi (bloklagan): <b>${failed}</b> ta`
      );
    }
    return;
  }

  // AGAR FOYDALANUVCHI MENYU BUYRUG'INI BOSSA — FSM to'xtatiladi
  if (MAIN_MENU_TEXTS.has(text) || text.startsWith('/')) {
    userStates.delete(chatId);
  }

  // Bekor qilish tugmasi
  if (text === "❌ Bekor qilish" || text === "/cancel") {
    userStates.delete(chatId);
    await apiCall('sendMessage', {
      chat_id: chatId,
      text: "Amal bekor qilindi. Bosh menyudasiz.",
      reply_markup: getMainKeyboard()
    });
    return;
  }

  // FSM Zamer buyurtma bosqichlari
  const state = userStates.get(chatId);
  if (state) {
    if (state.step === 'zamer_name') {
      if (!text || text.length < 2) {
        await apiCall('sendMessage', {
          chat_id: chatId,
          text: "Iltimos, ismingizni to'liqroq yozing:",
          reply_markup: getCancelKeyboard()
        });
        return;
      }
      state.data.name = text;
      state.step = 'zamer_phone';
      await apiCall('sendMessage', {
        chat_id: chatId,
        text: `Rahmat, <b>${text}</b>!\n\n` +
              `2-qadam: Siz bilan bog'lanishimiz uchun <b>telefon raqamingizni</b> yuboring:\n` +
              `Pastdagi «📱 Telefon raqamimni yuborish» tugmasini bosishingiz yoki <code>+998901234567</code> formatida yozishingiz mumkin:`,
        parse_mode: 'HTML',
        reply_markup: getPhoneKeyboard()
      });
      return;
    } else if (state.step === 'zamer_phone') {
      let phone = '';
      if (msg.contact && msg.contact.phone_number) {
        phone = msg.contact.phone_number;
      } else if (text) {
        phone = text.replace(/[^\d+]/g, '');
      }

      // O'zbekiston raqamlarini to'g'ri formatga solish
      if (/^\d{9}$/.test(phone)) {
        phone = '+998' + phone;
      } else if (/^998\d{9}$/.test(phone)) {
        phone = '+' + phone;
      } else if (!phone.startsWith('+')) {
        phone = '+' + phone;
      }

      if (phone.length < 9) {
        await apiCall('sendMessage', {
          chat_id: chatId,
          text: "Iltimos, to'g'ri telefon raqam kiriting (Masalan: <code>+998901234567</code>):",
          parse_mode: 'HTML',
          reply_markup: getPhoneKeyboard()
        });
        return;
      }

      state.data.phone = phone;
      state.step = 'zamer_addr';
      await apiCall('sendMessage', {
        chat_id: chatId,
        text: `Telefon raqamingiz qabul qilindi: <b>${state.data.phone}</b>\n\n` +
              `3-qadam: O'lchov olish yoki yetkazib berish <b>manzilingizni</b> yuboring:\n` +
              `Xaritadagi lokatsiyangizni yuborishingiz yoki yozma manzil kiritishingiz mumkin (Masalan: Chilonzor 9, 21-uy):`,
        parse_mode: 'HTML',
        reply_markup: getLocationKeyboard()
      });
      return;
    } else if (state.step === 'zamer_addr') {
      let addr = text;
      let lat = null;
      let lng = null;

      if (msg.location) {
        lat = msg.location.latitude;
        lng = msg.location.longitude;
        addr = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }

      if (!addr) {
        await apiCall('sendMessage', {
          chat_id: chatId,
          text: "Iltimos, manzilni matn ko'rinishida yozing yoki lokatsiya yuboring:",
          reply_markup: getLocationKeyboard()
        });
        return;
      }

      state.data.address = addr;
      state.data.latitude = lat;
      state.data.longitude = lng;
      state.step = 'zamer_count';

      await apiCall('sendMessage', {
        chat_id: chatId,
        text: `4-qadam: Xonadoningizga taxminan <b>nechta eshik</b> kerak bo'ladi?\n` +
              `(Masalan: 4 ta xonalararo, 1 ta kirish eshik):`,
        parse_mode: 'HTML',
        reply_markup: getCancelKeyboard()
      });
      return;
    } else if (state.step === 'zamer_count') {
      state.data.count = text || '1 dona';
      state.step = 'zamer_confirm';

      const summary = 
        `📋 <b>Buyurtma ma'lumotlarini tekshiring:</b>\n\n` +
        `👤 <b>Mijoz:</b> ${state.data.name}\n` +
        `📞 <b>Telefon:</b> ${state.data.phone}\n` +
        `🚪 <b>Yo'nalish:</b> ${state.data.doorTitle}\n` +
        `🔢 <b>Miqdori:</b> ${state.data.count}\n` +
        `📍 <b>Manzil:</b> ${state.data.address}\n\n` +
        `Barcha ma'lumotlar to'g'rimi?`;

      await apiCall('sendMessage', {
        chat_id: chatId,
        text: summary,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Tasdiqlash", callback_data: "confirm_order:yes" },
              { text: "❌ Bekor qilish", callback_data: "confirm_order:no" }
            ]
          ]
        }
      });
      return;
    } else if (state.step === 'zamer_confirm') {
      const lower = text.toLowerCase();
      if (lower === 'ha' || lower === 'xa' || lower === 'tasdiqlayman' || lower.includes('togri') || lower.includes("to'g'ri") || lower === 'ok' || lower === 'yes') {
        const order = createOrder({
          user_id: chatId,
          username: from?.username || '',
          name: state.data.name,
          phone: state.data.phone,
          door: state.data.doorTitle,
          address: state.data.address,
          latitude: state.data.latitude || null,
          longitude: state.data.longitude || null,
          count: state.data.count
        });

        userStates.delete(chatId);

        await apiCall('sendMessage', {
          chat_id: chatId,
          text: `🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>\n` +
                `🆔 Buyurtma raqami: <b>#${order.id}</b>\n\n` +
                `Tez orada «Ko'kcha Eshiklar» mutaxassisi siz bilan <b>${state.data.phone}</b> raqami orqali bog'lanadi.\n\n` +
                `Kompaniyamizni tanlaganingiz uchun tashakkur!`,
          parse_mode: 'HTML',
          reply_markup: getMainKeyboard()
        });

        await notifyAdminsNewOrder(order);
        return;
      } else if (lower === "yo'q" || lower === 'yoq' || lower === 'bekor' || lower === 'no') {
        userStates.delete(chatId);
        await apiCall('sendMessage', {
          chat_id: chatId,
          text: "Buyurtma bekor qilindi. Bosh menyudasiz.",
          reply_markup: getMainKeyboard()
        });
        return;
      } else {
        await apiCall('sendMessage', {
          chat_id: chatId,
          text: "Iltimos, buyurtmani tasdiqlash uchun quyidagi tugmalardan birini bosing yoki 'ha' deb yozing:",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Tasdiqlash", callback_data: "confirm_order:yes" },
                { text: "❌ Bekor qilish", callback_data: "confirm_order:no" }
              ]
            ]
          }
        });
        return;
      }
    }
  }

  // ==========================================
  // AQLLI BUYRUQ VA SO'ZLAR DISPETCHERI
  // Har qanday odam so'z yozsa ham, tugma bossa ham birdek tushunadi!
  // ==========================================
  if (lowerText === '/start' || lowerText === 'start' || lowerText === 'salom' || lowerText.includes('assalom')) {
    await handleStart(chatId, from);
  } else if (lowerText === '/help' || lowerText === 'help' || lowerText === 'yordam' || lowerText.includes("qo'llanma")) {
    await handleHelp(chatId);
  } else if (lowerText === '/admin' || lowerText === 'admin') {
    if (!isAdmin(chatId)) {
      await apiCall('sendMessage', {
        chat_id: chatId,
        text: "Kechirasiz, siz ushbu buyruqdan foydalanish huquqiga ega emassiz."
      });
      return;
    }
    await handleAdminPanel(chatId);
  } else if (lowerText === "🚪 eshiklar katalogi" || lowerText.includes('katalog') || lowerText.includes('eshik')) {
    await handleCatalog(chatId);
  } else if (lowerText === "📐 zamer chaqirish (bepul)" || lowerText.includes('zamer') || lowerText.includes("o'lchov") || lowerText.includes('olchov') || lowerText.includes('zakaz') || lowerText.includes('buyurtma')) {
    startZamer(chatId);
  } else if (lowerText === "🧮 narx hisoblash" || lowerText.includes('narx') || lowerText.includes('kalkulyator') || lowerText.includes('hisob') || lowerText.includes('qancha')) {
    await handleCalculator(chatId);
  } else if (lowerText === "🏢 biz haqimizda" || lowerText.includes('haqida') || lowerText.includes('ustaxona') || lowerText.includes('kompaniya')) {
    await showAbout(chatId);
  } else if (lowerText === "📍 manzil & lokatsiya" || lowerText.includes('manzil') || lowerText.includes('lokatsiya') || lowerText.includes('qayerda') || lowerText.includes('adres')) {
    await showLocation(chatId);
  } else if (lowerText === "📞 bog'lanish & aloqa" || lowerText.includes('aloqa') || lowerText.includes('telefon') || lowerText.includes('nomer') || lowerText.includes("bog'lan")) {
    await showContacts(chatId);
  } else {
    // Agar foydalanuvchi erkin savol yozsa, uni zudlik bilan @ergashev_395 ga yetkazamiz
    if (text) {
      const userDisplay = `${from.first_name || ''} ${from.last_name || ''}`.trim() || 'Mijoz';
      const userTag = from.username ? `@${from.username}` : `(ID: ${chatId})`;
      const notifyAdminText = 
        `📩 <b>MIJOZDAN XABAR KELDI:</b>\n\n` +
        `👤 <b>Kimdan:</b> ${userDisplay} ${userTag}\n` +
        `🆔 <b>Telegram ID:</b> <code>${chatId}</code>\n\n` +
        `💬 <b>Xabar matni:</b>\n<i>${text}</i>`;

      const replyButton = {
        inline_keyboard: [[
          { text: "✍️ Javob yozish", url: from.username ? `https://t.me/${from.username}` : `tg://user?id=${chatId}` }
        ]]
      };

      for (const adminId of ADMIN_IDS) {
        apiCall('sendMessage', {
          chat_id: adminId,
          text: notifyAdminText,
          parse_mode: 'HTML',
          reply_markup: replyButton
        });
      }
    }

    await apiCall('sendMessage', {
      chat_id: chatId,
      text: `Murojaatingiz qabul qilindi. Tez orada mutaxassisimiz siz bilan bog'lanadi!`,
      parse_mode: 'HTML',
      reply_markup: getMainKeyboard()
    });
  }
}

// ==========================================
// 9. TO'XTAMAYDIGAN PARALLEL POLLING SIKLI
// ==========================================
let lastUpdateId = 0;
let isPolling = true;

async function pollUpdatesLoop() {
  while (isPolling) {
    try {
      const res = await fetch(`${API_URL}/getUpdates?offset=${lastUpdateId + 1}&timeout=15`, {
        headers: { 'Connection': 'close' },
        signal: AbortSignal.timeout(25000)
      });

      if (!res.ok) {
        if (res.status === 409) {
          console.error("DIQQAT: Bot boshqa joyda ham ishlab turibdi (409 Conflict). 5 soniya kutamiz...");
          await new Promise(r => setTimeout(r, 5000));
          continue;
        }
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          if (update.update_id >= lastUpdateId) {
            lastUpdateId = update.update_id;
          }
          handleUpdateSafely(update);
        }
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

// ==========================================
// 10. KUTILMAGAN XATOLARGA QARSHI IMMUNITET
// ==========================================
process.on('uncaughtException', err => {
  console.error("Kutilmagan xato (uncaughtException):", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Qayta ishlanmagan va'da (unhandledRejection):", reason);
});

// Ishga tushirish
console.log("=========================================");
console.log("🚀 «Ko'kcha Eshiklar» Telegram boti ishga tushdi!");
console.log(`Bot: @kokcha_eshiklaruz_bot`);
console.log(`Adminlar: ${ADMIN_IDS.join(', ')}`);
console.log("Telegram xabarlari parallel rejimda qabul qilinmoqda...");
console.log("=========================================");

// Eski webhooklarni tozalab pollingni boshlash
apiCall('deleteWebhook', { drop_pending_updates: false }).then(() => {
  pollUpdatesLoop();
});

// ==========================================
// Render Web Service Health Check HTTP Server
// ==========================================
const PORT = process.env.PORT || 3000;
const healthServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    service: "Ko'kcha Eshiklar Telegram Bot",
    uptime: Math.floor(process.uptime()) + "s"
  }));
});

healthServer.listen(PORT, "0.0.0.0", () => {
  console.log("Render Web Service HTTP server listening on port " + PORT);
});
