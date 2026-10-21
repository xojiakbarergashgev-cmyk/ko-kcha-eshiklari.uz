# 🌐 Botingizni 24/7 Doimiy Ishlatish (Kompyuter O'chiq Bo'lganda Ham)

Botingiz kompyuteringiz o'chirilganda ham to'xtovsiz, 24 soat ishlab turishi uchun uni **Bulutli Serverga (Cloud Hosting)** joylashtirish kerak.

Quyida buning eng oson, tezkor va **100% BEPUL** usullari keltirilgan:

---

## 🚀 1-USUL: Render.com orqali (Eng ommabop va BEPUL)

[Render.com](https://render.com) — dasturlarni bepul serverlarda 24/7 yurgizib beradigan mashhur xizmat.

### Qadamlar:

1. **GitHub’ga kodni joylash:**
   - [github.com](https://github.com) ga kiring va yangi repository oching (masalan: `kokcha-doors-bot`).
   - Loyiha papkasidagi fayllarni GitHub’ga yuklang.

2. **Render.com ga ulanish:**
   - [render.com](https://render.com) saytiga kiring va "Sign Up with GitHub" orqali ro'yxatdan o'ting.
   - Yuqori o'ng burchakdagi **"New +"** tugmasini bosing va **"Background Worker"** yoki **"Web Service"** ni tanlang.

3. **Botingizni tanlash:**
   - O'zingizning `kokcha-doors-bot` repository'ingizni tanlang (**Connect** bosing).

4. **Sozlamalarni to'ldirish:**
   - **Name:** `kokcha-eshiklar-bot`
   - **Runtime:** `Node`
   - **Build Command:** *(bo'sh qoldiring yoki `npm install`)*
   - **Start Command:** `node bot.js`
   - **Plan:** `Free` (bepul tarif)

5. **Tokenni kiritish (Environment Variables):**
   - **"Advanced"** yoki **"Environment Variables"** bo'limiga kiring va quyidagilarni qo'shing:
     - `BOT_TOKEN` = `8943664247:AAGGV44K9UBl7Wm5kf5rP4JeSmFJ-xnMSlY`
     - `SHOP_PHONE` = `+998 90 130 10 10`
     - `SHOP_ADDRESS` = `Toshkent shahar, Sebzor 7`

6. **"Deploy" (Ishga tushirish) tugmasini bosing:**
   - Render serverlari 1-2 daqiqada botingizni o'zining serverida yoqadi.
   - **Bo'ldi!** Endi kompyuteringizni xohlagancha o'chirib qo'yishingiz mumkin, bot 24/7 Telegramda mijozlarga xizmat ko'rsataveradi!

---

## ⚡ 2-USUL: Railway.app orqali (3 daqiqada)

1. [railway.app](https://railway.app) ga kiring.
2. **"New Project"** -> **"Deploy from GitHub repo"** ni tanlang.
3. Loyihangizni tanlang. Railway papkadagi `Dockerfile` yoki `package.json` ni avtomatik taniydi va ishga tushiradi!
4. **Variables** bo'limiga `BOT_TOKEN` ni qo'ying.

---

## 🖥 3-USUL: Arzon VPS Server (Ubuntu / Linux)

Agar shaxsiy VPS serveringiz bo'lsa (oyiga $2 - $3 atrofida):

```bash
# PM2 xizmati orqali fonda to'xtovsiz yurgizish:
npm install -g pm2
pm2 start bot.js --name "kokcha-bot"
pm2 startup
pm2 save
```
Bu holda hatto server qayta yuklansa ham bot avtomatik yonadi.
