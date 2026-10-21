from .common import router as common_router
from .catalog import router as catalog_router
from .calculator import router as calculator_router
from .order import router as order_router
from .admin import router as admin_router

__all__ = [
    "common_router",
    "catalog_router",
    "calculator_router",
    "order_router",
    "admin_router"
]
