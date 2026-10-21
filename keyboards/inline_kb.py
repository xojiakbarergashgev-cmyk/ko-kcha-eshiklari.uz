from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from data.doors_data import CATEGORIES, get_doors_by_category

def get_categories_keyboard() -> InlineKeyboardMarkup:
    """Kategoriyalarni inline tugmalar ko'rinishida chiqarish"""
    buttons = []
    for cat_id, cat_info in CATEGORIES.items():
        buttons.append([
            InlineKeyboardButton(text=cat_info["name"], callback_data=f"cat:{cat_id}")
        ])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_doors_list_keyboard(category_id: str) -> InlineKeyboardMarkup:
    """Tanlangan kategoriya bo'yicha eshiklar ro'yxati"""
    doors = get_doors_by_category(category_id)
    buttons = []
    
    for d in doors:
        buttons.append([
            InlineKeyboardButton(
                text=f"{d['name']} — {d['price_formatted']}",
                callback_data=f"door:{d['id']}"
            )
        ])
    
    buttons.append([
        InlineKeyboardButton(text="🔙 Barcha toifalarga qaytish", callback_data="back_to_cats")
    ])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_door_detail_keyboard(door_id: str, category_id: str) -> InlineKeyboardMarkup:
    """Bitta eshik tafsilotlari ostidagi amallar tugmasi"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="🛒 Ushbu modelga buyurtma", callback_data=f"order_model:{door_id}")
            ],
            [
                InlineKeyboardButton(text="📐 O'lchovga zamer chaqirish", callback_data=f"order_zamer_for:{door_id}"),
                InlineKeyboardButton(text="💬 Maslahat olish", url="https://t.me/kokcha_eshiklari_admin")
            ],
            [
                InlineKeyboardButton(text="🔙 Kategoriya ro'yxatiga", callback_data=f"cat:{category_id}"),
                InlineKeyboardButton(text="🏠 Asosiy toifalar", callback_data="back_to_cats")
            ]
        ]
    )
    return keyboard

def get_calculator_types_keyboard() -> InlineKeyboardMarkup:
    """Kalkulyator: eshik turi tanlash"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🎨 MDF Bo'yoqli / Emal", callback_data="calc_type:mdf")],
            [InlineKeyboardButton(text="🪵 Shpon & Tabiiy yog'och", callback_data="calc_type:shpon")],
            [InlineKeyboardButton(text="✨ Yashirin (Invisible)", callback_data="calc_type:invisible")],
            [InlineKeyboardButton(text="🛡 Kirish temir eshik", callback_data="calc_type:iron")],
            [InlineKeyboardButton(text="🏛 Katta zal (2 tabaqali)", callback_data="calc_type:double")],
            [InlineKeyboardButton(text="❌ Bekor qilish", callback_data="calc_cancel")]
        ]
    )
    return keyboard

def get_calculator_coating_keyboard(door_type: str) -> InlineKeyboardMarkup:
    """Kalkulyator: qoplama va lak turi"""
    coatings = {
        "mdf": [
            ("Italiya mat emali", "calc_coat:emal"),
            ("Ultra-mat Soft-touch", "calc_coat:soft_touch"),
            ("Oltin patina bilan emal", "calc_coat:patina")
        ],
        "shpon": [
            ("Tabiiy eman (dub) shponi", "calc_coat:shpon_dub"),
            ("Qarog'och shponi", "calc_coat:shpon_elm"),
            ("Yong'oq shponi", "calc_coat:shpon_walnut")
        ],
        "invisible": [
            ("Bo'yashga tayyor gruntlangan", "calc_coat:grunt"),
            ("Zavod emal bo'yog'i", "calc_coat:emal")
        ],
        "iron": [
            ("Termo-razriv + Kukunli polimer", "calc_coat:polimer"),
            ("Polimer + Qalin MDF qoplama", "calc_coat:iron_mdf")
        ],
        "double": [
            ("Emal + Faset shisha", "calc_coat:emal_glass"),
            ("Shpon + Oltin patina", "calc_coat:shpon_patina")
        ]
    }
    
    options = coatings.get(door_type, [("Standart qoplama", "calc_coat:standard")])
    buttons = [[InlineKeyboardButton(text=label, callback_data=data)] for label, data in options]
    buttons.append([InlineKeyboardButton(text="🔙 Turini qayta tanlash", callback_data="calc_back_types")])
    return InlineKeyboardMarkup(inline_keyboard=buttons)

def get_calculator_addons_keyboard(with_lock: bool, with_install: bool) -> InlineKeyboardMarkup:
    """Kalkulyator: furnitura va o'rnatish qo'shimchalari"""
    lock_status = "✅ Qo'shilgan" if with_lock else "❌ Qo'shilmagan"
    install_status = "✅ Qo'shilgan" if with_install else "❌ Qo'shilmagan"
    
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text=f"🔑 Qulf va tutqich: {lock_status}",
                    callback_data=f"toggle_lock:{0 if with_lock else 1}"
                )
            ],
            [
                InlineKeyboardButton(
                    text=f"🛠 O'rnatish xizmati: {install_status}",
                    callback_data=f"toggle_install:{0 if with_install else 1}"
                )
            ],
            [
                InlineKeyboardButton(text="📊 Yakuniy narxni hisoblash", callback_data="calc_finish")
            ],
            [
                InlineKeyboardButton(text="🔄 Boshidan boshlash", callback_data="calc_reset")
            ]
        ]
    )
    return keyboard

def get_calculator_result_keyboard() -> InlineKeyboardMarkup:
    """Kalkulyator natijasidan so'ng harakatlar"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="📐 Mutaxassisni zamerga chaqirish", callback_data="order_zamer_from_calc")
            ],
            [
                InlineKeyboardButton(text="🔄 Boshqa modelni hisoblash", callback_data="calc_reset"),
                InlineKeyboardButton(text="🚪 Katalogga o'tish", callback_data="back_to_cats")
            ]
        ]
    )
    return keyboard

def get_order_confirm_keyboard() -> InlineKeyboardMarkup:
    """Buyurtmani tasdiqlash yoki bekor qilish"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="✅ Ma'lumotlarni tasdiqlash", callback_data="confirm_order_yes"),
                InlineKeyboardButton(text="❌ Bekor qilish", callback_data="confirm_order_no")
            ]
        ]
    )
    return keyboard

def get_admin_order_keyboard(order_id: int) -> InlineKeyboardMarkup:
    """Admin uchun buyurtma holatini boshqarish tugmalari"""
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="📞 Bog'lanildi", callback_data=f"adm_status:{order_id}:contacted"),
                InlineKeyboardButton(text="✅ Bajarildi", callback_data=f"adm_status:{order_id}:completed")
            ],
            [
                InlineKeyboardButton(text="❌ Bekor qilish", callback_data=f"adm_status:{order_id}:cancelled")
            ]
        ]
    )
    return keyboard
