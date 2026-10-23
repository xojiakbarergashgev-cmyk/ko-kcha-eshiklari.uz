from aiogram import Router, F, Bot
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext

from config import ADMIN_IDS, SHOP_INFO
from utils.states import ZamerStates
from keyboards.default_kb import (
    get_phone_keyboard,
    get_location_keyboard,
    get_main_keyboard,
    get_cancel_keyboard
)
from keyboards.inline_kb import get_order_confirm_keyboard, get_admin_order_keyboard
from database.db import create_order, add_or_update_user
from data.doors_data import get_door_by_id

router = Router(name="order")

@router.message(F.text == "📐 Zamer chaqirish (Bepul)")
async def start_zamer_request(message: Message, state: FSMContext):
    """Zamer chaqirish jarayonini boshlash"""
    await state.clear()
    await state.set_state(ZamerStates.name)
    await state.update_data(
        order_type="zamer",
        door_title="Umumiy o'lchov olish (Zamer)"
    )

    user = message.from_user
    default_name = user.full_name or ""

    text = (
        "📐 <b>Mutaxassisni o'lchovga chaqirish (Bepul Zamer)</b>\n\n"
        "Mutaxassisimiz xonadoningizga kelib, eshik o'rni, devor qalinligi va o'lchamlarini "
        "aniq o'lchab beradi hamda katalogimizdagi namunalar bilan tanishtiradi.\n\n"
        "1-qadam: Iltimos, <b>Ism va Familiyangizni</b> kiriting:"
    )

    await message.answer(
        text=text,
        reply_markup=get_cancel_keyboard(),
        parse_mode="HTML"
    )

@router.callback_query(F.data.startswith("order_zamer_for:"))
async def cb_zamer_for_door(callback: CallbackQuery, state: FSMContext):
    """Katalogdagi model uchun zamer chaqirish"""
    door_id = callback.data.split(":")[1]
    door = get_door_by_id(door_id)
    title = f"{door['name']} modeli uchun zamer" if door else "Zamer chaqirish"

    await state.clear()
    await state.set_state(ZamerStates.name)
    await state.update_data(
        order_type="zamer_model",
        door_title=title,
        door_id=door_id
    )

    text = (
        f"📐 <b>{title}</b>\n\n"
        f"1-qadam: Iltimos, <b>Ismingizni</b> yozib qoldiring:"
    )

    await callback.message.answer(
        text=text,
        reply_markup=get_cancel_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data.startswith("order_model:"))
async def cb_order_model(callback: CallbackQuery, state: FSMContext):
    """Aniq modelga buyurtma rasmiylashtirish"""
    door_id = callback.data.split(":")[1]
    door = get_door_by_id(door_id)
    title = f"Xarid: {door['name']}" if door else "Eshik buyurtmasi"

    await state.clear()
    await state.set_state(ZamerStates.name)
    await state.update_data(
        order_type="direct_order",
        door_title=title,
        door_id=door_id
    )

    text = (
        f"🛒 <b>{title}</b>\n\n"
        f"1-qadam: Buyurtmani rasmiylashtirish uchun <b>Ismingizni</b> kiriting:"
    )

    await callback.message.answer(
        text=text,
        reply_markup=get_cancel_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "order_zamer_from_calc")
async def cb_zamer_from_calc(callback: CallbackQuery, state: FSMContext):
    """Kalkulyatordan so'ng zamerga yozilish"""
    data = await state.get_data()
    last_door = data.get("last_calculated_door", "Kalkulyator hisobi")
    last_price = data.get("last_calculated_price", "")

    title = f"Kalkulyator orqali: {last_door} ({last_price})"

    await state.set_state(ZamerStates.name)
    await state.update_data(
        order_type="zamer_calc",
        door_title=title
    )

    text = (
        f"📐 <b>Mutaxassis zamerini tasdiqlash</b>\n\n"
        f"Tanlangan eshik: <b>{last_door}</b> ({last_price})\n\n"
        f"1-qadam: Iltimos, <b>Ismingizni</b> kiriting:"
    )

    await callback.message.answer(
        text=text,
        reply_markup=get_cancel_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()

MAIN_MENU_COMMANDS = {
    "/start", "/help", "/admin", "/cancel",
    "🚪 Eshiklar katalogi", "📐 Zamer chaqirish (Bepul)",
    "🧮 Narx hisoblash", "🏢 Biz haqimizda",
    "📍 Manzil & Lokatsiya", "📞 Bog'lanish & Aloqa", "❌ Bekor qilish"
}

# FSM 1-QADAM: Ism qabul qilish
@router.message(ZamerStates.name)
async def process_name(message: Message, state: FSMContext):
    if message.text in MAIN_MENU_COMMANDS or (message.text and message.text.startswith("/")):
        await state.clear()
        if message.text == "❌ Bekor qilish" or message.text == "/cancel":
            await message.answer("Buyurtma bekor qilindi.", reply_markup=get_main_keyboard())
        return

    name = message.text.strip()
    await state.update_data(customer_name=name)
    await state.set_state(ZamerStates.phone)

    text = (
        f"Rahmat, <b>{name}</b>!\n\n"
        f"2-qadam: Siz bilan bog'lanishimiz uchun <b>telefon raqamingizni</b> yuboring.\n"
        f"«📱 Telefon raqamimni yuborish» tugmasini bosishingiz yoki <code>+998901234567</code> formatida yozishingiz mumkin:"
    )

    await message.answer(
        text=text,
        reply_markup=get_phone_keyboard(),
        parse_mode="HTML"
    )

# FSM 2-QADAM: Telefon raqami
@router.message(ZamerStates.phone)
async def process_phone(message: Message, state: FSMContext):
    if message.text in MAIN_MENU_COMMANDS or (message.text and message.text.startswith("/")):
        await state.clear()
        if message.text == "❌ Bekor qilish" or message.text == "/cancel":
            await message.answer("Buyurtma bekor qilindi.", reply_markup=get_main_keyboard())
        return

    phone = None
    if message.contact:
        phone = message.contact.phone_number
        if not phone.startswith("+"):
            phone = "+" + phone
    elif message.text:
        phone = message.text.strip()

    await state.update_data(phone_number=phone)
    await state.set_state(ZamerStates.address_or_location)

    text = (
        f"Telefon raqam qabul qilindi: <b>{phone}</b>\n\n"
        f"3-qadam: O'lchov olish yoki yetkazib berish <b>manzilingizni</b> yuboring.\n"
        f"Xaritadagi lokatsiyangizni yuborishingiz yoki manzilni yozma kiritishingiz mumkin (Masalan: Chilonzor 9, 21-uy):"
    )

    await message.answer(
        text=text,
        reply_markup=get_location_keyboard(),
        parse_mode="HTML"
    )

# FSM 3-QADAM: Manzil / Lokatsiya
@router.message(ZamerStates.address_or_location)
async def process_address(message: Message, state: FSMContext):
    if message.text in MAIN_MENU_COMMANDS or (message.text and message.text.startswith("/")):
        await state.clear()
        if message.text == "❌ Bekor qilish" or message.text == "/cancel":
            await message.answer("Buyurtma bekor qilindi.", reply_markup=get_main_keyboard())
        return

    latitude = None
    longitude = None
    address_text = None

    if message.location:
        latitude = message.location.latitude
        longitude = message.location.longitude
        address_text = f"Xarita koordinatalari: {latitude:.5f}, {longitude:.5f}"
    elif message.text:
        address_text = message.text.strip()

    await state.update_data(
        address=address_text,
        latitude=latitude,
        longitude=longitude
    )
    await state.set_state(ZamerStates.doors_count)

    text = (
        "4-qadam: Xonadoningizga taxminan <b>nechta eshik</b> kerak bo'ladi?\n"
        "(Masalan: 3 ta xonalararo, 1 ta kirish temir eshik yoki faqat raqam: 4):"
    )

    await message.answer(
        text=text,
        reply_markup=get_cancel_keyboard(),
        parse_mode="HTML"
    )

# FSM 4-QADAM: Eshiklar soni va vaqt
@router.message(ZamerStates.doors_count)
async def process_doors_count(message: Message, state: FSMContext):
    if message.text in MAIN_MENU_COMMANDS or (message.text and message.text.startswith("/")):
        await state.clear()
        if message.text == "❌ Bekor qilish" or message.text == "/cancel":
            await message.answer("Buyurtma bekor qilindi.", reply_markup=get_main_keyboard())
        return

    count_text = message.text.strip()
    await state.update_data(doors_count_text=count_text)
    await state.set_state(ZamerStates.confirm)

    data = await state.get_data()

    summary_text = (
        "📋 <b>Buyurtma ma'lumotlarini tekshiring:</b>\n\n"
        f"👤 <b>Mijoz:</b> {data.get('customer_name')}\n"
        f"📞 <b>Telefon:</b> {data.get('phone_number')}\n"
        f"🚪 <b>Yo'nalish:</b> {data.get('door_title')}\n"
        f"🔢 <b>Eshiklar miqdori:</b> {count_text}\n"
        f"📍 <b>Manzil:</b> {data.get('address')}\n\n"
        "Barcha ma'lumotlar to'g'rimi?"
    )

    await message.answer(
        text=summary_text,
        reply_markup=get_order_confirm_keyboard(),
        parse_mode="HTML"
    )

# FSM 5-QADAM: Tasdiqlash
@router.callback_query(ZamerStates.confirm, F.data == "confirm_order_yes")
async def cb_confirm_order(callback: CallbackQuery, state: FSMContext, bot: Bot):
    """Buyurtmani bazaga yozish va adminga yuborish"""
    data = await state.get_data()
    user = callback.from_user

    order_id = await create_order(
        user_id=user.id,
        order_type=data.get("order_type", "zamer"),
        customer_name=data.get("customer_name"),
        phone_number=data.get("phone_number"),
        door_title=data.get("door_title"),
        door_count=1,
        address=data.get("address"),
        latitude=data.get("latitude"),
        longitude=data.get("longitude"),
        notes=f"Eshiklar soni: {data.get('doors_count_text')}"
    )

    # Foydalanuvchini yangilash
    await add_or_update_user(
        user_id=user.id,
        full_name=data.get("customer_name"),
        username=user.username,
        phone_number=data.get("phone_number")
    )

    success_text = (
        f"🎉 <b>Buyurtmangiz muvaffaqiyatli qabul qilindi!</b>\n"
        f"🆔 Buyurtma raqami: <b>#{order_id}</b>\n\n"
        f"Tez orada «Ko'kcha Eshiklar» menejeri siz bilan <b>{data.get('phone_number')}</b> "
        f"raqami orqali bog'lanadi va o'lchov vaqtini aniqlashtiradi.\n\n"
        f"Kompaniyamizni tanlaganingiz uchun tashakkur!"
    )

    await callback.message.edit_text(success_text, parse_mode="HTML")
    await callback.message.answer("Bosh menyu:", reply_markup=get_main_keyboard())
    await state.clear()
    await callback.answer()

    # Adminga xabar jo'natish
    admin_notification = (
        f"🔔 <b>YANGI BUYURTMA #{order_id}</b>\n\n"
        f"👤 <b>Mijoz:</b> {data.get('customer_name')} (@{user.username or 'username_yoq'})\n"
        f"📞 <b>Telefon:</b> {data.get('phone_number')}\n"
        f"🚪 <b>Tanlangan:</b> {data.get('door_title')}\n"
        f"🔢 <b>Miqdori:</b> {data.get('doors_count_text')}\n"
        f"📍 <b>Manzil:</b> {data.get('address')}\n"
        f"🆔 <b>Telegram ID:</b> <code>{user.id}</code>"
    )

    for admin_id in ADMIN_IDS:
        try:
            await bot.send_message(
                chat_id=admin_id,
                text=admin_notification,
                reply_markup=get_admin_order_keyboard(order_id),
                parse_mode="HTML"
            )
            # Agar lokatsiya bo'lsa adminga lokatsiyani ham yuboramiz
            if data.get("latitude") and data.get("longitude"):
                await bot.send_location(
                    chat_id=admin_id,
                    latitude=data.get("latitude"),
                    longitude=data.get("longitude")
                )
        except Exception:
            pass

@router.callback_query(ZamerStates.confirm, F.data == "confirm_order_no")
async def cb_cancel_order(callback: CallbackQuery, state: FSMContext):
    """Buyurtmani bekor qilish"""
    await state.clear()
    await callback.message.edit_text("Buyurtma bekor qilindi.")
    await callback.message.answer("Bosh menyudasiz:", reply_markup=get_main_keyboard())
    await callback.answer()
