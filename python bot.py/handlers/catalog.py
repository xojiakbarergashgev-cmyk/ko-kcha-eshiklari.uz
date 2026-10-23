from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, FSInputFile
from aiogram.fsm.context import FSMContext

from config import HERO_IMAGE, ENTRANCE_IMAGE
from data.doors_data import (
    CATEGORIES,
    get_category_by_id,
    get_doors_by_category,
    get_door_by_id
)
from keyboards.inline_kb import (
    get_categories_keyboard,
    get_doors_list_keyboard,
    get_door_detail_keyboard
)

PHOTO_CACHE = {}

router = Router(name="catalog")

@router.message(F.text == "🚪 Eshiklar katalogi")
async def show_catalog_categories(message: Message):
    """Katalog bo'limlari ro'yxatini ko'rsatish"""
    text = (
        "🚪 <b>«Ko'kcha Eshiklar» katalogi:</b>\n\n"
        "Bizning ustaxonamizda tayyorlanadigan eng sara eshiklar to'plami bilan tanishing.\n"
        "Quyidagi toifalardan birini tanlang:"
    )
    await message.answer(
        text=text,
        reply_markup=get_categories_keyboard(),
        parse_mode="HTML"
    )

@router.callback_query(F.data == "back_to_cats")
async def cb_back_to_categories(callback: CallbackQuery):
    """Toifalar ro'yxatiga qaytish"""
    text = (
        "🚪 <b>Eshiklar toifalari:</b>\n\n"
        "Kerakli toifani tanlang:"
    )
    await callback.message.edit_text(
        text=text,
        reply_markup=get_categories_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data.startswith("cat:"))
async def cb_show_category_doors(callback: CallbackQuery):
    """Tanlangan toifadagi eshiklar ro'yxatini ko'rsatish"""
    cat_id = callback.data.split(":")[1]
    cat_info = get_category_by_id(cat_id)
    
    if not cat_info:
        await callback.answer("Toifa topilmadi!", show_alert=True)
        return

    text = (
        f"<b>{cat_info['name']}</b>\n\n"
        f"📝 <i>{cat_info['description']}</i>\n\n"
        f"👇 Modelni batafsil ko'rish uchun tanlang:"
    )

    await callback.message.edit_text(
        text=text,
        reply_markup=get_doors_list_keyboard(cat_id),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data.startswith("door:"))
async def cb_show_door_detail(callback: CallbackQuery):
    """Bitta eshik haqida to'liq ma'lumot va rasmini chiqarish"""
    door_id = callback.data.split(":")[1]
    door = get_door_by_id(door_id)

    if not door:
        await callback.answer("Eshik topilmadi!", show_alert=True)
        return

    features_list = "\n".join([f"  • {feat}" for feat in door["features"]])

    caption = (
        f"🚪 <b>{door['name']}</b>\n"
        f"📂 Toifa: <i>{door['category_name']}</i>\n\n"
        f"💰 <b>Narxi:</b> <u>{door['price_formatted']}</u> (1 dona to'liq komplekt)\n\n"
        f"📋 <b>Xususiyatlari:</b>\n"
        f"• <b>Material:</b> {door['material']}\n"
        f"• <b>Qoplama:</b> {door['coating']}\n"
        f"• <b>Mavjud ranglar:</b> {door['colors']}\n"
        f"• <b>Standart o'lcham:</b> {door['standard_sizes']}\n"
        f"• <b>Kafolat:</b> {door['warranty']}\n\n"
        f"✨ <b>Afzalliklari:</b>\n{features_list}\n\n"
        f"💬 <i>{door['description']}</i>"
    )

    image_path = ENTRANCE_IMAGE if door.get("image_type") == "entrance" else HERO_IMAGE

    if image_path.exists():
        try:
            cached_id = PHOTO_CACHE.get(str(image_path))
            photo = cached_id if cached_id else FSInputFile(str(image_path))
            await callback.message.delete()
            sent_msg = await callback.message.answer_photo(
                photo=photo,
                caption=caption,
                reply_markup=get_door_detail_keyboard(door["id"], door["category_id"]),
                parse_mode="HTML"
            )
            if not cached_id and sent_msg.photo:
                PHOTO_CACHE[str(image_path)] = sent_msg.photo[-1].file_id
            await callback.answer()
            return
        except Exception:
            pass

    # Agar rasm yuborib bo'lmasa, matn ko'rinishida tahrirlaymiz
    await callback.message.edit_text(
        text=caption,
        reply_markup=get_door_detail_keyboard(door["id"], door["category_id"]),
        parse_mode="HTML"
    )
    await callback.answer()
