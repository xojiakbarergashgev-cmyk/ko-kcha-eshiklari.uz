import aiosqlite
from datetime import datetime
from config import DATABASE_PATH

async def init_db():
    """Ma'lumotlar bazasini va jadvallarni yaratish"""
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Foydalanuvchilar jadvali
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                full_name TEXT,
                username TEXT,
                phone_number TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Buyurtmalar va Zamer so'rovlari jadvali
        await db.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                order_type TEXT, -- 'zamer', 'catalog_order', 'consultation'
                customer_name TEXT,
                phone_number TEXT,
                door_title TEXT,
                door_count INTEGER DEFAULT 1,
                address TEXT,
                latitude REAL,
                longitude REAL,
                preferred_time TEXT,
                notes TEXT,
                status TEXT DEFAULT 'new', -- 'new', 'contacted', 'completed', 'cancelled'
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        await db.commit()

async def add_or_update_user(user_id: int, full_name: str, username: str = None, phone_number: str = None):
    """Foydalanuvchini bazaga qo'shish yoki yangilash"""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("""
            INSERT INTO users (user_id, full_name, username, phone_number)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                full_name=excluded.full_name,
                username=excluded.username,
                phone_number=COALESCE(excluded.phone_number, users.phone_number)
        """, (user_id, full_name, username, phone_number))
        await db.commit()

async def create_order(
    user_id: int,
    order_type: str,
    customer_name: str,
    phone_number: str,
    door_title: str = "Umumiy o'lchov (Zamer)",
    door_count: int = 1,
    address: str = None,
    latitude: float = None,
    longitude: float = None,
    preferred_time: str = None,
    notes: str = None
) -> int:
    """Yangi buyurtma yoki zamer so'rovini saqlash"""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute("""
            INSERT INTO orders (
                user_id, order_type, customer_name, phone_number,
                door_title, door_count, address, latitude, longitude,
                preferred_time, notes, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
        """, (
            user_id, order_type, customer_name, phone_number,
            door_title, door_count, address, latitude, longitude,
            preferred_time, notes
        ))
        await db.commit()
        return cursor.lastrowid

async def get_orders(limit: int = 10, status: str = None):
    """Buyurtmalar ro'yxatini olish"""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        if status:
            cursor = await db.execute("""
                SELECT * FROM orders WHERE status = ? ORDER BY id DESC LIMIT ?
            """, (status, limit))
        else:
            cursor = await db.execute("""
                SELECT * FROM orders ORDER BY id DESC LIMIT ?
            """, (limit,))
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]

async def get_order_by_id(order_id: int):
    """Aynan bitta buyurtmani olish"""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None

async def update_order_status(order_id: int, new_status: str):
    """Buyurtma holatini yangilash"""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        await db.execute("UPDATE orders SET status = ? WHERE id = ?", (new_status, order_id))
        await db.commit()

async def get_all_user_ids():
    """Xabar tarqatish (broadcast) uchun barcha foydalanuvchilar ID larini olish"""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        cursor = await db.execute("SELECT user_id FROM users")
        rows = await cursor.fetchall()
        return [row[0] for row in rows]

async def get_bot_stats():
    """Bot statistikasini olish"""
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Jami foydalanuvchilar
        cursor = await db.execute("SELECT COUNT(*) FROM users")
        total_users = (await cursor.fetchone())[0]

        # Jami buyurtmalar
        cursor = await db.execute("SELECT COUNT(*) FROM orders")
        total_orders = (await cursor.fetchone())[0]

        # Yangi buyurtmalar
        cursor = await db.execute("SELECT COUNT(*) FROM orders WHERE status = 'new'")
        new_orders = (await cursor.fetchone())[0]

        return {
            "total_users": total_users,
            "total_orders": total_orders,
            "new_orders": new_orders
        }
