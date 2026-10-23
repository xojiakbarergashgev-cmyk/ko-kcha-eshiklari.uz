import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent

# .env faylini yuklash
load_dotenv(BASE_DIR / ".env")

# Asosiy sozlamalar
BOT_TOKEN = os.getenv("BOT_TOKEN", "")
BOT_USERNAME = os.getenv("BOT_USERNAME", "kokcha_eshiklaruz_bot")
WEB_APP_URL = os.getenv("WEB_APP_URL", "")

# Admin ID lar ro'yxati
admin_ids_raw = os.getenv("ADMIN_IDS", "")
ADMIN_IDS = [int(admin_id.strip()) for admin_id in admin_ids_raw.split(",") if admin_id.strip().isdigit()]

# Ma'lumotlar bazasi
DATABASE_PATH = BASE_DIR / os.getenv("DATABASE_PATH", "database/kokcha_doors.db")

# Do'kon ma'lumotlari
SHOP_INFO = {
    "name": "«Ko'kcha Eshiklar» MChJ",
    "phones": [
        os.getenv("SHOP_PHONE", "+998 90 130 10 10")
    ],
    "telegram": os.getenv("SHOP_TELEGRAM", "@kokchaeshiklari"),
    "instagram": os.getenv("SHOP_INSTAGRAM", "https://www.instagram.com/kokcha.eshiklari.uz?dlrf=MWtndHk5N3JjZGtoaw=="),
    "address": os.getenv("SHOP_ADDRESS", "Toshkent shahar, Sebzor 7"),
    "work_hours": os.getenv("SHOP_WORK_HOURS", "Har kuni 09:00 dan 19:00 gacha (dam olishsiz)"),
    "latitude": float(os.getenv("SHOP_LATITUDE", "41.3355")),
    "longitude": float(os.getenv("SHOP_LONGITUDE", "69.2550")),
    "experience": "15 yildan ortiq tajriba",
    "warranty": "3 yildan 5 yilgacha rasmiy kafolat"
}

# Assets papkasi
ASSETS_DIR = BASE_DIR / "assets"
HERO_IMAGE = ASSETS_DIR / "hero.jpg"
ENTRANCE_IMAGE = ASSETS_DIR / "entrance.jpg"
