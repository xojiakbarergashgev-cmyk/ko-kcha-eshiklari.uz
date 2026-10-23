from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from config import WEB_APP_URL

def get_main_keyboard():
    """Asosiy menyu tugmalari"""
    rows = [
        [
            KeyboardButton(text="🚪 Eshiklar katalogi"),
            KeyboardButton(text="📐 Zamer chaqirish (Bepul)")
        ],
        [
            KeyboardButton(text="🧮 Narx hisoblash"),
            KeyboardButton(text="🏢 Biz haqimizda")
        ],
        [
            KeyboardButton(text="📍 Manzil & Lokatsiya"),
            KeyboardButton(text="📞 Bog'lanish & Aloqa")
        ]
    ]

    # Agar WebApp URL kiritilgan bo'lsa, Telegram Mini App tugmasini ham qo'shamiz
    if WEB_APP_URL:
        rows.insert(0, [
            KeyboardButton(text="🌐 Interaktiv Katalog (Mini App)", web_app=WebAppInfo(url=WEB_APP_URL))
        ])

    keyboard = ReplyKeyboardMarkup(
        keyboard=rows,
        resize_keyboard=True,
        is_persistent=True,
        input_field_placeholder="Quyidagi bo'limlardan birini tanlang..."
    )
    return keyboard

def get_phone_keyboard():
    """Telefon raqamni ulashish tugmasi"""
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📱 Telefon raqamimni yuborish", request_contact=True)],
            [KeyboardButton(text="❌ Bekor qilish")]
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    return keyboard

def get_location_keyboard():
    """Lokatsiya yuborish yoki manzil yozish tugmasi"""
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📍 Xaritadagi joylashuvimni yuborish", request_location=True)],
            [KeyboardButton(text="❌ Bekor qilish")]
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    return keyboard

def get_cancel_keyboard():
    """Bekor qilish tugmasi"""
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="❌ Bekor qilish")]
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    return keyboard
