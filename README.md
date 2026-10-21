# 🏛 «Ko'kcha Eshiklar» Telegram Boti

Ushbu loyiha Toshkent shahridagi mashhur **«Ko'kcha Eshiklar»** ustaxonasi va shourumi uchun maxsus ishlab chiqilgan professional, to'liq funksional Telegram botidir.

Bot zamonaviy **Python 3**, **Aiogram 3.x** va **SQLite (aiosqlite)** arxitekturasida yozilgan bo'lib, mijozlar bilan avtomatlashtirilgan muloqot, katalog taqdimoti, eshik narxini interaktiv hisoblash va bepul zamer (o'lchov olish) buyurtmalarini qabul qilishni ta'minlaydi.

---

## ✨ Asosiy Imkoniyatlar

1. **🚪 Interaktiv Eshiklar Katalogi:**
   - **MDF Bo'yoqli va Emal eshiklar** (Italiya emali, 3D naqshlar)
   - **Shpon va Tabiiy Yog'och** (Eman dub, qarog'och, yong'oq)
   - **Yashirin (Secret / Invisible) eshiklar** (devor bilan bir tekis)
   - **Kirish temir / Bronlangan eshiklar** (Termo-razriv va biometrik smart qulf)
   - **Katta zal eshiklari (2 tabaqali / Dvupolniy)** (fasetli shisha va hashamatli tojlar)
   - Har bir modelning narxi, fotosurati, o'lchamlari va rasmiy kafolati ko'rsatiladi.

2. **📐 Mutaxassisni o'lchovga chaqirish (Bepul Zamer FSM):**
   - Mijozning ismi va familiyasi
   - Telefon raqami (`request_contact` orqali bir bosishda yoki qo'lda)
   - Xaritadagi joylashuvi (`request_location` orqali GPS) yoki yozma manzil
   - Eshiklar soni va qulay vaqti
   - Ma'lumotlar bazaga saqlanadi va zudlik bilan barcha adminlarning Telegramiga yuboriladi!

3. **🧮 Aqlli Narx Kalkulyatori:**
   - Eshik turi, qoplamasi, tutqich/qulf komplekti va o'rnatish xizmatiga qarab bir zumda taxminiy narxni hisoblaydi.

4. **🏢 Shourum Manzili va Bog'lanish:**
   - Shourum manzili (Ko'kcha Darvoza ko'chasi), mo'ljal, ish vaqti va xaritadagi geolokatsiyasi.
   - Telefon raqamlari, Instagram va Telegram admin profili.

5. **🔐 Administrator Paneli (`/admin`):**
   - Jami mijozlar va buyurtmalar statistikasi
   - Oxirgi buyurtmalar ro'yxati va ularning holati (🆕 Yangi, 📞 Bog'lanildi, ✅ Bajarildi)
   - Barcha bot foydalanuvchilariga ommaviy xabar yuborish (Broadcast)

6. **💻 Interaktiv Veb Simulyator (`web_demo/`):**
   - Botni Telegramga ulamasdan oldin ham barcha funksiyalarini brauzerda sinab ko'rish imkoniyati!

---

## 🚀 O'rnatish va Ishga Tushirish

### 1-qadam: Telegramda Bot va Token olish
1. Telegramda [@BotFather](https://t.me/BotFather) botiga kiring.
2. `/newbot` buyrug'ini yuboring.
3. Botingiz nomini kiriting (masalan: `Ko'kcha Eshiklar`).
4. Botingiz username'ini kiriting (masalan: `kokcha_doors_bot`).
5. BotFather bergan **HTTP API Token**ni nusxalab oling.

### 2-qadam: Sozlamalar faylini to'ldirish
Loyiha papkasida `.env` faylini yarating:
```bash
cp .env.example .env
```
`.env` faylini ochib, o'z ma'lumotlaringizni yozing:
```env
BOT_TOKEN=7123456789:AAFoZ..._sizning_tokeningiz
ADMIN_IDS=123456789
SHOP_PHONE=+998 71 200 88 99
```
*(O'zingizning Telegram ID raqamingizni bilish uchun Telegramda [@userinfobot](https://t.me/userinfobot) ga kiring)*

### 3-qadam: Kutubxonalarni o'rnatish va yurgizish
```bash
# Virtual muhit ochish
python3 -m venv venv
source venv/bin/activate

# Kutubxonalarni o'rnatish
pip install -r requirements.txt

# Botni ishga tushirish
python3 bot.py
```

---

## 🖥 Brauzerdagi Simulyatorni Ochish

Bot qanday ishlashini to'g'ridan-to'g'ri brauzeringizda ko'rish uchun:
```bash
open web_demo/index.html
```
yoki faylni brauzeringizda oching:
`file:///Users/user/.gemini/antigravity-ide/scratch/kokcha-eshiklar-bot/web_demo/index.html`

---

## 📁 Loyiha Strukturasi

```
kokcha-eshiklar-bot/
├── bot.py                  # Asosiy ishga tushirish fayli
├── config.py               # Sozlamalar va .env o'quvchi modul
├── requirements.txt        # Kerakli Python kutubxonalari
├── .env.example            # Muhit o'zgaruvchilari namunasi
├── database/
│   ├── __init__.py
│   └── db.py               # SQLite (foydalanuvchilar, buyurtmalar, zamerlar)
├── data/
│   ├── __init__.py
│   └── doors_data.py       # Eshik modellari, narxlar va kalkulyator
├── handlers/
│   ├── __init__.py
│   ├── common.py           # /start, /help, Biz haqimizda, Manzil, Aloqa
│   ├── catalog.py          # Toifalar, modellar va rasmlar
│   ├── calculator.py       # Narx hisoblash kalkulyatori
│   ├── order.py            # Zamer chaqirish va buyurtma FSM
│   └── admin.py            # Admin paneli, buyurtmalar, xabar tarqatish
├── keyboards/
│   ├── __init__.py
│   ├── default_kb.py       # Reply klaviaturalar (Asosiy menyu, kontakt, lokatsiya)
│   └── inline_kb.py        # Inline klaviaturalar (Modellar, harakatlar)
├── assets/                 # Shourum va eshiklarning fotolari
└── web_demo/               # Interaktiv veb-namoyish va boshqaruv paneli
```
