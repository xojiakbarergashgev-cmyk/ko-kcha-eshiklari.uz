from aiogram import Router, F
from aiogram.types import Message, FSInputFile
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext

from config import SHOP_INFO, HERO_IMAGE
from keyboards.default_kb import get_main_keyboard
from keyboards.inline_kb import get_categories_keyboard
from database.db import add_or_update_user

router = Router(name="common")

@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    """Start buyrug'i: foydalanuvchini ro'yxatga olish va salomlashish"""
    await state.clear()
    
    user = message.from_user
    await add_or_update_user(
        user_id=user.id,
        full_name=user.full_name,
        username=user.username
    )

    welcome_text = (
        f"Assalomu alaykum, hurmatli <b>{user.first_name}</b>!\n\n"
        f"🏛 <b>«Ko'kcha Eshiklar»</b> rasmiy Telegram botiga xush kelibsiz!\n\n"
        f"Biz 15 yildan buyon xonadoningiz, ofisingiz va hovlingiz uchun "
        f"premium sifatdagi, zamonaviy va mustahkam eshiklarni ishlab chiqaramiz.\n\n"
        f"🌟 <b>Bizning afzalliklarimiz:</b>\n"
        f"• 100% sifat kafolati (3 yildan 5 yilgacha)\n"
        f"• Italiya va Turkiya xomashyolari\n"
        f"• Bepul professional o'lchov (Zamer) olish\n"
        f"• Yetkazib berish va o'rnatish xizmati\n\n"
        f"👇 <i>Kerakli bo'limni tanlash uchun quyidagi menyudan foydalaning:</i>"
    )

    if HERO_IMAGE.exists():
        try:
            photo = FSInputFile(str(HERO_IMAGE))
            await message.answer_photo(
                photo=photo,
                caption=welcome_text,
                reply_markup=get_main_keyboard(),
                parse_mode="HTML"
            )
            return
        except Exception:
            pass

    await message.answer(
        text=welcome_text,
        reply_markup=get_main_keyboard(),
        parse_mode="HTML"
    )

@router.message(Command("help"))
async def cmd_help(message: Message):
    """Yordam buyrug'i"""
    help_text = (
        "ℹ️ <b>Botdan foydalanish bo'yicha qo'llanma:</b>\n\n"
        "• <b>🚪 Eshiklar katalogi</b> — MDF, Shpon, Invisible va Kirish temir eshiklari to'plamini ko'rish.\n"
        "• <b>📐 Zamer chaqirish</b> — Mutaxassisimizni uyingizga bepul o'lchov olish uchun chaqirish.\n"
        "• <b>🧮 Narx hisoblash</b> — Eshik turi, o'lchami va aksessuarlari bo'yicha taxminiy narxni hisoblovchi aqlli kalkulyator.\n"
        "• <b>🏢 Biz haqimizda</b> — Ishlab chiqarish jarayoni va kafolat shartlari.\n"
        "• <b>📍 Manzil & Lokatsiya</b> — Shourumimiz manzili va xaritasidagi nuqtasi.\n"
        "• <b>📞 Bog'lanish & Aloqa</b> — Telefon raqamlarimiz va menejer bilan to'g'ridan-to'g'ri aloqa.\n\n"
        "Agar savollaringiz bo'lsa, adminga murojaat qiling: " + SHOP_INFO["telegram"]
    )
    await message.answer(help_text, parse_mode="HTML")

@router.message(F.text == "🏢 Biz haqimizda")
async def show_about_us(message: Message):
    """Biz haqimizda ma'lumot"""
    about_text = (
        f"🏛 <b>«Ko'kcha Eshiklar» haqida</b>\n\n"
        f"Toshkentning qadimiy yog'och ustaligi markazi bo'lgan <b>Ko'kcha</b> hududidagi ustaxonamiz "
        f"15 yildan buyon minglab xonadonlarga ko'rk bag'ishlab kelmoqda.\n\n"
        f"✨ <b>Ishlab chiqarishimiz:</b>\n"
        f"Biz har bir eshikni zamonaviy Germaniya va Italiya dastgohlarida, ekologik toza materiallardan "
        f"tayyorlaymiz. Har bir eshik namlikka, harorat o'zgarishiga va vaqt sinoviga chidamli.\n\n"
        f"🛡 <b>Kafolat:</b>\n"
        f"Barcha eshiklarimizga rasmiy <b>3 yildan 5 yilgacha kafolat</b> beramiz.\n\n"
        f"🤝 <b>Xizmatlar:</b>\n"
        f"• Shaxsiy dizayn va o'lchamlar bo'yicha ishlab chiqarish\n"
        f"• Bepul professional zamer (o'lchov olish)\n"
        f"• Shovqinsiz magnit qulflar va yashirin ilgaklar\n"
        f"• Toshkent shahar bo'ylab tezkor yetkazib berish va o'rnatish\n\n"
        f"<i>Katalogimiz bilan tanishish uchun quyidagi tugmani bosing:</i>"
    )
    await message.answer(
        text=about_text,
        reply_markup=get_categories_keyboard(),
        parse_mode="HTML"
    )

@router.message(F.text == "📍 Manzil & Lokatsiya")
async def show_location(message: Message):
    """Do'kon va ustaxona manzili hamda xaritadagi lokatsiyasi"""
    location_text = (
        f"📍 <b>Bizning shourum va do'konimiz:</b>\n\n"
        f"🏢 <b>Manzil:</b> {SHOP_INFO['address']}\n"
        f"🏛 <b>Mo'ljal:</b> Sebzor 7\n"
        f"⏰ <b>Ish vaqti:</b> {SHOP_INFO['work_hours']}\n\n"
        f"Sizni shourumimizda kutib qolamiz! Kelib eshiklarimiz sifati, bo'yog'i va yig'ilishini "
        f"o'z ko'zingiz bilan ko'rishingiz mumkin."
    )
    
    await message.answer(location_text, parse_mode="HTML")
    
    # Lokatsiya yuborish
    try:
        await message.answer_location(
            latitude=SHOP_INFO["latitude"],
            longitude=SHOP_INFO["longitude"]
        )
    except Exception:
        pass

@router.message(F.text == "📞 Bog'lanish & Aloqa")
async def show_contacts(message: Message):
    """Aloqa ma'lumotlari"""
    phones = "\n".join([f"• 📞 <code>{phone}</code>" for phone in SHOP_INFO["phones"]])
    
    contacts_text = (
        f"📞 <b>Biz bilan bog'lanish:</b>\n\n"
        f"Savollaringiz, takliflaringiz yoki maxsus buyurtmalaringiz bo'lsa, "
        f"menejerlarimiz haftaning barcha kunlarida xizmatingizda!\n\n"
        f"<b>Telefon raqamlarimiz:</b>\n{phones}\n\n"
        f"<b>Telegram aloqa:</b> {SHOP_INFO['telegram']}\n"
        f"<b>Instagram sahifamiz:</b> {SHOP_INFO['instagram']}\n\n"
        f"⏱ <b>Ish vaqti:</b> {SHOP_INFO['work_hours']}"
    )
    await message.answer(contacts_text, parse_mode="HTML")

@router.message(F.text == "❌ Bekor qilish")
async def cancel_any_action(message: Message, state: FSMContext):
    """Ixtiyoriy amalni bekor qilish va bosh menyuga qaytish"""
    current_state = await state.get_state()
    if current_state is not None:
        await state.clear()
        await message.answer(
            "Amal bekor qilindi. Bosh menyudasiz.",
            reply_markup=get_main_keyboard()
        )
    else:
        await message.answer(
            "Bosh menyu:",
            reply_markup=get_main_keyboard()
        )
