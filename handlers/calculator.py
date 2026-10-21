from aiogram import Router, F
from aiogram.types import Message, CallbackQuery
from aiogram.fsm.context import FSMContext

from utils.states import CalculatorStates, ZamerStates
from keyboards.inline_kb import (
    get_calculator_types_keyboard,
    get_calculator_coating_keyboard,
    get_calculator_addons_keyboard,
    get_calculator_result_keyboard
)
from data.doors_data import calculate_custom_door_price

router = Router(name="calculator")

@router.message(F.text == "🧮 Narx hisoblash")
async def start_calculator(message: Message, state: FSMContext):
    """Narx hisoblash kalkulyatorini boshlash"""
    await state.clear()
    await state.set_state(CalculatorStates.door_type)
    
    text = (
        "🧮 <b>«Ko'kcha Eshiklar» narx kalkulyatori</b>\n\n"
        "Xonadoningiz uchun kerakli eshik narxini o'zingiz mustaqil hisoblab ko'ring!\n\n"
        "1-qadam: Kerakli <b>eshik turini</b> tanlang:"
    )
    await message.answer(
        text=text,
        reply_markup=get_calculator_types_keyboard(),
        parse_mode="HTML"
    )

@router.callback_query(F.data == "calc_reset")
async def cb_calc_reset(callback: CallbackQuery, state: FSMContext):
    """Kalkulyatorni boshidan boshlash"""
    await state.clear()
    await state.set_state(CalculatorStates.door_type)
    
    text = (
        "🧮 <b>Narx kalkulyatori:</b>\n\n"
        "1-qadam: Kerakli <b>eshik turini</b> tanlang:"
    )
    await callback.message.edit_text(
        text=text,
        reply_markup=get_calculator_types_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "calc_back_types")
async def cb_calc_back_types(callback: CallbackQuery, state: FSMContext):
    """Eshik turiga qaytish"""
    await state.set_state(CalculatorStates.door_type)
    await callback.message.edit_text(
        text="Kerakli <b>eshik turini</b> tanlang:",
        reply_markup=get_calculator_types_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data.startswith("calc_type:"))
async def cb_calc_type_selected(callback: CallbackQuery, state: FSMContext):
    """Eshik turi tanlandi -> Qoplama tanlash"""
    door_type = callback.data.split(":")[1]
    await state.update_data(
        door_type=door_type,
        with_lock=True,
        with_install=True,
        height=2050,
        width=800
    )
    await state.set_state(CalculatorStates.coating)

    type_names = {
        "mdf": "MDF Bo'yoqli / Emal",
        "shpon": "Shpon & Tabiiy yog'och",
        "invisible": "Yashirin (Invisible)",
        "iron": "Kirish temir eshik",
        "double": "Katta zal (2 tabaqali)"
    }

    text = (
        f"Tanlangan tur: <b>{type_names.get(door_type, door_type)}</b>\n\n"
        f"2-qadam: Eshik sirtining <b>qoplama turini</b> tanlang:"
    )

    await callback.message.edit_text(
        text=text,
        reply_markup=get_calculator_coating_keyboard(door_type),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data.startswith("calc_coat:"))
async def cb_calc_coat_selected(callback: CallbackQuery, state: FSMContext):
    """Qoplama tanlandi -> Qo'shimchalar va hisoblash"""
    coating = callback.data.split(":")[1]
    await state.update_data(coating=coating)
    await state.set_state(CalculatorStates.accessories)

    data = await state.get_data()
    with_lock = data.get("with_lock", True)
    with_install = data.get("with_install", True)

    text = (
        "3-qadam: <b>Qo'shimcha xizmatlar va komplektatsiya:</b>\n\n"
        "Standart o'lcham: <b>2050 x 800 mm</b> (ko'p qavatli uylar uchun standart).\n"
        "Qulf va tutqich hamda o'rnatish xizmatini yoqish yoki o'chirish uchun tugmalarni bosing:"
    )

    await callback.message.edit_text(
        text=text,
        reply_markup=get_calculator_addons_keyboard(with_lock, with_install),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data.startswith("toggle_lock:"))
async def cb_toggle_lock(callback: CallbackQuery, state: FSMContext):
    """Qulf holatini o'zgartirish"""
    val = bool(int(callback.data.split(":")[1]))
    await state.update_data(with_lock=val)
    data = await state.get_data()
    
    await callback.message.edit_reply_markup(
        reply_markup=get_calculator_addons_keyboard(val, data.get("with_install", True))
    )
    await callback.answer()

@router.callback_query(F.data.startswith("toggle_install:"))
async def cb_toggle_install(callback: CallbackQuery, state: FSMContext):
    """O'rnatish holatini o'zgartirish"""
    val = bool(int(callback.data.split(":")[1]))
    await state.update_data(with_install=val)
    data = await state.get_data()
    
    await callback.message.edit_reply_markup(
        reply_markup=get_calculator_addons_keyboard(data.get("with_lock", True), val)
    )
    await callback.answer()

@router.callback_query(F.data == "calc_finish")
async def cb_calc_finish(callback: CallbackQuery, state: FSMContext):
    """Hisoblashni yakunlash va narxni ko'rsatish"""
    data = await state.get_data()
    door_type = data.get("door_type", "mdf")
    coating = data.get("coating", "emal")
    with_lock = data.get("with_lock", True)
    with_install = data.get("with_install", True)
    height = data.get("height", 2050)
    width = data.get("width", 800)

    result = calculate_custom_door_price(
        door_type=door_type,
        coating=coating,
        height=height,
        width=width,
        with_lock=with_lock,
        with_install=with_install
    )

    type_titles = {
        "mdf": "MDF Bo'yoqli / Emal eshik",
        "shpon": "Shpon & Tabiiy yog'och eshik",
        "invisible": "Yashirin (Invisible) eshik",
        "iron": "Kirish temir bron eshik",
        "double": "Katta zal (2 tabaqali) eshik"
    }

    result_text = (
        f"📊 <b>Hisob-kitob natijasi:</b>\n\n"
        f"🚪 <b>Eshik turi:</b> {type_titles.get(door_type, door_type)}\n"
        f"📏 <b>Standart o'lcham:</b> {height} x {width} mm\n"
        f"🧱 <b>Eshik polotnosi va korobka:</b> {result['base_price']:,.0f} so'm\n"
        f"🔑 <b>Qulf va tutqich to'plami:</b> {'+250 000 so\'m' if with_lock else 'Qo\'shilmagan'}\n"
        f"🛠 <b>Yetkazib o'rnatish xizmati:</b> {'+200 000 so\'m' if with_install else 'Olib ketish (samovivoz)'}\n\n"
        f"━━━━━━━━━━━━━━━━━━━\n"
        f"💵 <b>Taxminiy jami narx:</b> <u>{result['total_formatted']}</u>\n"
        f"━━━━━━━━━━━━━━━━━━━\n\n"
        f"<i>Eslatma: Aniq narx va xonadoningiz devor qalinligi mutaxassisimiz o'lchov (zamer) "
        f"olganidan so'ng 100% kafolatli belgilanadi. Zamer Toshkent shahrida bepul!</i>"
    )

    await state.update_data(last_calculated_price=result['total_formatted'], last_calculated_door=type_titles.get(door_type, door_type))

    await callback.message.edit_text(
        text=result_text,
        reply_markup=get_calculator_result_keyboard(),
        parse_mode="HTML"
    )
    await callback.answer()

@router.callback_query(F.data == "calc_cancel")
async def cb_calc_cancel(callback: CallbackQuery, state: FSMContext):
    """Kalkulyatorni bekor qilish"""
    await state.clear()
    await callback.message.delete()
    await callback.message.answer("Kalkulyatordan chiqildi.")
    await callback.answer()
