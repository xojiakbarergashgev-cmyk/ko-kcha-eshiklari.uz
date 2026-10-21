from aiogram.fsm.state import State, StatesGroup

class ZamerStates(StatesGroup):
    """O'lchovga mutaxassis (Zamer) chaqirish holatlari"""
    name = State()
    phone = State()
    address_or_location = State()
    doors_count = State()
    preferred_time = State()
    confirm = State()

class CatalogOrderStates(StatesGroup):
    """Katalogdagi aniq model bo'yicha buyurtma berish"""
    door_id = State()
    name = State()
    phone = State()
    address_or_location = State()
    count = State()
    confirm = State()

class CalculatorStates(StatesGroup):
    """Narx kalkulyatori holatlari"""
    door_type = State()
    coating = State()
    dimensions = State()
    accessories = State()

class AdminBroadcastStates(StatesGroup):
    """Admin xabar tarqatish holati"""
    message = State()
    confirm = State()
