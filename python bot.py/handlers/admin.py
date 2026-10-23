from aiogram import Router, F, Bot
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext

from config import ADMIN_IDS
from utils.states import AdminBroadcastStates
from database.db import (
    get_bot_stats,
    get_orders,
    get_order_by_id,
    update_order_status,
    get_all_user_ids
)

router = Router(name="admin")

def is_admin(user_id: int) -> bool:
    """Foydalanuvchi admin ekanligini tekshirish"""
    return user_id in ADMIN_IDS

def get_admin_dashboard_kb():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="📊 Statistika", callback_data="adm_stats"),
                InlineKeyboardButton(text="📥 Yangi buyurtmalar", callback_data="adm_orders:new")
            ],
            [
                InlineKeyboardButton(text="📋 Barcha buyurtmalar", callback_data="adm_orders:all"),
                InlineKeyboardButton(text="📢 Xabar tarqatish (Broadcast)", callback_data="adm_broadcast")
            ]
        ]
    )

@router.message(Command("admin"))
async def cmd_admin(message: Message):
    """Admin boshqaruv paneli"""
    if not is_admin(message.from_user.id):
        await message.answer("Kechirasiz, siz ushbu buyruqdan foydalanish huquqiga ega emassiz.")
        return

    text = (
        "🔐 <b>«Ko'kcha Eshiklar» Admin paneli</b>\n\n"
        "Kerakli bo'limni tanlang:"
    )
    await message.answer(text, reply_markup=get_admin_dashboard_kb(), parse_mode="HTML")

@router.callback_query(F.data == "adm_stats")
async def cb_admin_stats(callback: CallbackQuery):
    """Statistikani chiqarish"""
    if not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat yo'q!", show_alert=True)
        return

    stats = await get_bot_stats()
    text = (
        "📊 <b>Bot Statistikasi:</b>\n\n"
        f"👥 Jami foydalanuvchilar: <b>{stats['total_users']} nafar</b>\n"
        f"📦 Jami qabul qilingan buyurtmalar: <b>{stats['total_orders']} ta</b>\n"
        f"⏳ Ko'rib chiqilishi kerak yangi buyurtmalar: <b>{stats['new_orders']} ta</b>\n"
    )

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔙 Admin menyusiga", callback_data="adm_back")]
        ]
    )
    await callback.message.edit_text(text, reply_markup=kb, parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data == "adm_back")
async def cb_admin_back(callback: CallbackQuery):
    """Admin menyusiga qaytish"""
    if not is_admin(callback.from_user.id):
        return
    text = "🔐 <b>«Ko'kcha Eshiklar» Admin paneli</b>\n\nKerakli bo'limni tanlang:"
    await callback.message.edit_text(text, reply_markup=get_admin_dashboard_kb(), parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data.startswith("adm_orders:"))
async def cb_admin_orders(callback: CallbackQuery):
    """Buyurtmalar ro'yxatini ko'rish"""
    if not is_admin(callback.from_user.id):
        return

    filter_type = callback.data.split(":")[1]
    status_filter = "new" if filter_type == "new" else None
    orders = await get_orders(limit=10, status=status_filter)

    if not orders:
        await callback.message.edit_text(
            f"Hozircha {'yangi ' if filter_type == 'new' else ''}buyurtmalar mavjud emas.",
            reply_markup=InlineKeyboardMarkup(
                inline_keyboard=[[InlineKeyboardButton(text="🔙 Admin panel", callback_data="adm_back")]]
            )
        )
        await callback.answer()
        return

    status_icons = {
        "new": "🆕 Yangi",
        "contacted": "📞 Bog'lanildi",
        "completed": "✅ Bajarildi",
        "cancelled": "❌ Bekor qilingan"
    }

    text = f"📋 <b>{'Yangi ' if filter_type == 'new' else 'Oxirgi '}Buyurtmalar (10 tagacha):</b>\n\n"
    for o in orders:
        text += (
            f"🆔 <b>#{o['id']}</b> — {o['customer_name']} (<code>{o['phone_number']}</code>)\n"
            f"   🚪 {o['door_title']}\n"
            f"   📍 {o['address'] or 'Manzil kiritilmagan'}\n"
            f"   Holati: {status_icons.get(o['status'], o['status'])}\n"
            f"   Sana: {o['created_at']}\n"
            f"─────────────────────\n"
        )

    kb = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="🔙 Admin panel", callback_data="adm_back")]
        ]
    )
    await callback.message.edit_text(text, reply_markup=kb, parse_mode="HTML")
    await callback.answer()

@router.callback_query(F.data.startswith("adm_status:"))
async def cb_change_order_status(callback: CallbackQuery):
    """Admin xabardagi tugma orqali buyurtma holatini o'zgartiradi"""
    if not is_admin(callback.from_user.id):
        await callback.answer("Ruxsat yo'q!", show_alert=True)
        return

    parts = callback.data.split(":")
    order_id = int(parts[1])
    new_status = parts[2]

    await update_order_status(order_id, new_status)
    status_text = {
        "contacted": "📞 Mijoz bilan bog'lanildi deb belgilandi.",
        "completed": "✅ Buyurtma muvaffaqiyatli bajarildi deb belgilandi.",
        "cancelled": "❌ Buyurtma bekor qilindi."
    }.get(new_status, "Holat o'zgartirildi.")

    await callback.answer(status_text, show_alert=True)
    
    # Xabarning pastki qismiga yangilangan status qo'shish
    try:
        await callback.message.edit_text(
            callback.message.text + f"\n\n👉 <i>Hozirgi holat: {new_status.upper()}</i>",
            parse_mode="HTML"
        )
    except Exception:
        pass

@router.callback_query(F.data == "adm_broadcast")
async def cb_admin_broadcast_start(callback: CallbackQuery, state: FSMContext):
    """Barcha foydalanuvchilarga xabar yuborishni boshlash"""
    if not is_admin(callback.from_user.id):
        return

    await state.set_state(AdminBroadcastStates.message)
    await callback.message.edit_text(
        "📢 <b>Xabar tarqatish:</b>\n\n"
        "Barcha foydalanuvchilarga yubormoqchi bo'lgan xabaringizni matn ko'rinishida yozing.\n"
        "Bekor qilish uchun <code>/cancel</code> yozing.",
        parse_mode="HTML"
    )
    await callback.answer()

@router.message(AdminBroadcastStates.message)
async def process_broadcast_message(message: Message, state: FSMContext, bot: Bot):
    if not is_admin(message.from_user.id):
        return

    if message.text == "/cancel":
        await state.clear()
        await message.answer("Xabar tarqatish bekor qilindi.", reply_markup=get_admin_dashboard_kb())
        return

    user_ids = await get_all_user_ids()
    sent_count = 0
    failed_count = 0

    status_msg = await message.answer(f"Xabar yuborilmoqda... (Jami: {len(user_ids)} ta)")

    for uid in user_ids:
        try:
            await bot.send_message(
                chat_id=uid,
                text=message.text,
                parse_mode="HTML"
            )
            sent_count += 1
        except Exception:
            failed_count += 1

    await state.clear()
    await status_msg.edit_text(
        f"✅ <b>Xabar tarqatish yakunlandi!</b>\n\n"
        f"Yuborildi: <b>{sent_count}</b> ta foydalanuvchiga\n"
        f"Yetib bormadi (bloklagan): <b>{failed_count}</b> ta\n",
        parse_mode="HTML"
    )
