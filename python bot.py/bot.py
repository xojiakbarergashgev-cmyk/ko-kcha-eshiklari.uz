import asyncio
import logging
import sys
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.fsm.storage.memory import MemoryStorage

from config import BOT_TOKEN, ADMIN_IDS
from database.db import init_db
from handlers import (
    common_router,
    catalog_router,
    calculator_router,
    order_router,
    admin_router
)

# Logging sozlamalari
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

async def on_startup(bot: Bot):
    """Bot ishga tushganda bajariladigan amallar"""
    logger.info("Ma'lumotlar bazasi initsializatsiya qilinmoqda...")
    await init_db()
    logger.info("Ma'lumotlar bazasi muvaffaqiyatli tayyorlandi.")

    # Adminlarga xabar yuborish
    for admin_id in ADMIN_IDS:
        try:
            await bot.send_message(
                chat_id=admin_id,
                text="🚀 <b>«Ko'kcha Eshiklar» Telegram boti muvaffaqiyatli ishga tushdi!</b>",
                parse_mode="HTML"
            )
        except Exception as e:
            logger.warning(f"Adminga ({admin_id}) xabar yetkazib bo'lmadi: {e}")

async def main():
    """Botning asosiy siklini ishga tushirish"""
    if not BOT_TOKEN or "ExampleToken" in BOT_TOKEN:
        logger.error(
            "\n" + "="*60 + "\n"
            "DIQQAT: Telegram Bot Token belgilanmagan!\n"
            "Iltimos, .env faylini ochib, BOT_TOKEN qiymatiga @BotFather dan\n"
            "olingan tokeningizni kiriting.\n"
            "Misol: BOT_TOKEN=7123456789:AAExampleToken...\n"
            + "="*60 + "\n"
        )
        sys.exit(1)

    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode="HTML")
    )
    storage = MemoryStorage()
    dp = Dispatcher(storage=storage)

    # Routerlarni ulash
    # Muhim: FSM va maxsus amallar ustun turishi uchun ketma-ketlik
    dp.include_router(admin_router)
    dp.include_router(order_router)
    dp.include_router(calculator_router)
    dp.include_router(catalog_router)
    dp.include_router(common_router)

    dp.startup.register(on_startup)

    # Eski kutilmagan yangilanishlarni o'chirib tashlash
    await bot.delete_webhook(drop_pending_updates=True)
    logger.info("Bot polling orqali ishga tushirilmoqda...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot to'xtatildi.")
