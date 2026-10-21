"""
Ko'kcha Eshiklar katalogi ma'lumotlari
Klassik, Neoklassika, Modern, Yashirin va Temir eshiklar to'plami.
"""

CATEGORIES = {
    "mdf_emal": {
        "id": "mdf_emal",
        "name": "🎨 MDF Bo'yoqli & Emal eshiklar",
        "description": "Italiya va Turkiya texnologiyasi asosida bo'yalgan, namlikka va quyosh nuriga chidamli zamonaviy eshiklar."
    },
    "shpon_wood": {
        "id": "shpon_wood",
        "name": "🪵 Shpon & Tabiiy Yog'och",
        "description": "Eman (dub), qarog'och va yong'oq daraxti shponi bilan qoplangan premium toifadagi nafis eshiklar."
    },
    "invisible": {
        "id": "invisible",
        "name": "✨ Yashirin (Secret / Invisible) eshiklar",
        "description": "Alyumin korobkali, devor bilan bir tekis (montajdan so'ng ko'rinmaydigan), zamonaviy minimalizm uslubi."
    },
    "iron_doors": {
        "id": "iron_doors",
        "name": "🛡 Kirish temir / Bronlangan eshiklar",
        "description": "Uylar va kvartiralar uchun termo-izolyatsiyali, ko'p qatlamli, xavfsiz va mustahkam bron eshiklar."
    },
    "double_doors": {
        "id": "double_doors",
        "name": "🏛 Katta zal eshiklari (Dvupolniy)",
        "description": "Keng dahliz va mehmonxonalar uchun 2 tabaqali hashamatli naqshinkor yoki vitrajli eshiklar."
    }
}

DOORS = [
    # 1. MDF & Emal
    {
        "id": "mdf_01",
        "category_id": "mdf_emal",
        "name": "«Ko'kcha Royal White»",
        "category_name": "MDF Bo'yoqli & Emal",
        "price": 1850000,
        "price_formatted": "1 850 000 so'm",
        "material": "Yuqori zichlikdagi MDF (16 mm) + Qarag'ay karkas",
        "coating": "Italiya emali (Renner), 4 qatlamli bo'yoq",
        "colors": "Oq (Pure White), Fil suyagi (Ivory), Och kulrang",
        "standard_sizes": "2050 x 700 / 800 / 900 mm",
        "warranty": "3 yil rasmiy kafolat",
        "description": (
            "Klassik va Neoklassik interyerlar uchun eng ko'p tanlanadigan model. "
            "Suvga chidamli emal qoplamasi sarg'aymaydi, tozalash juda oson."
        ),
        "features": [
            "Shovqin o'tkazmaslik: 32 dB",
            "Magnitli shovqinsiz tilcha (AGB Italiya)",
            "Teleskopik nalichnik va korobka"
        ],
        "image_type": "hero"
    },
    {
        "id": "mdf_02",
        "category_id": "mdf_emal",
        "name": "«Ko'kcha Neoklassika Ivory»",
        "category_name": "MDF Bo'yoqli & Emal",
        "price": 2100000,
        "price_formatted": "2 100 000 so'm",
        "material": "MDF 18 mm + Ichki shovqin yutuvchi to'ldiruvchi",
        "coating": "Mat emal + Oltin patina hoshiya",
        "colors": "Krem, Yumshoq bej, Oltin patinali fil suyagi",
        "standard_sizes": "2050 x 800 / 900 mm",
        "warranty": "3 yil kafolat",
        "description": (
            "Aristokratik nafislikka ega bo'lgan neoklassika eshigi. "
            "Qo'lda ishlangan nozik naqsh va oltinrang patina interyeringizga o'zgacha hashamat bag'ishlaydi."
        ),
        "features": [
            "Naqshli karniz va kapitel o'rnatish imkoniyati",
            "Termo va shovqin izolyatsiyasi",
            "Yashirin ilgaklar bilan moslashuvchanlik"
        ],
        "image_type": "hero"
    },
    {
        "id": "mdf_03",
        "category_id": "mdf_emal",
        "name": "«Ko'kcha Grafite Modern»",
        "category_name": "MDF Bo'yoqli & Emal",
        "price": 1950000,
        "price_formatted": "1 950 000 so'm",
        "material": "Namlikka chidamli MDF panel + Alyumin mollinglar",
        "coating": "Ultra-mat soft-touch emal (Antracite / Grafit)",
        "colors": "Grafit, Qora mat, To'q kulrang",
        "standard_sizes": "2050 x 700 / 800 / 900 mm",
        "warranty": "3 yil kafolat",
        "description": (
            "Modern va Hi-Tech xonadonlar uchun ideal tanlov. Qora yaltiroq yoki xrom molling chiziqlari "
            "zamonaviy geometriyani namoyon etadi."
        ),
        "features": [
            "Barmoq izi qolmaydigan Soft-Touch sirt",
            "Qora mat furnitura bilan mukammal uyg'unlik",
            "Mustahkamlangan qirralar"
        ],
        "image_type": "hero"
    },

    # 2. Shpon & Yog'och
    {
        "id": "shpon_01",
        "category_id": "shpon_wood",
        "name": "«Ko'kcha Eman Premium (Dub)»",
        "category_name": "Shpon & Tabiiy Yog'och",
        "price": 2700000,
        "price_formatted": "2 700 000 so'm",
        "material": "Tabiiy eman (dub) radial shponi + Yog'och massiv karkas",
        "coating": "Poliuretan ekologik lak (Italiya)",
        "colors": "Tabiiy dub, Oqartirilgan dub, Qorong'i yong'oq",
        "standard_sizes": "2050 x 700 / 800 / 900 mm",
        "warranty": "5 yil rasmiy kafolat",
        "description": (
            "Tabiiy yog'och to'qimasi va nufuzi. Tabiiy eman shponi xonaga iliqlik va "
            "ekologik toza muhit yaratadi. Har bir eshikning yog'och rasmi takrorlanmasdir."
        ),
        "features": [
            "100% tabiiy shpon teksturasi",
            "Vaqt o'tishi bilan o'z shaklini yo'qotmaydigan mustahkam asos",
            "Yuqori darajadagi shovqin izolyatsiyasi"
        ],
        "image_type": "hero"
    },
    {
        "id": "shpon_02",
        "category_id": "shpon_wood",
        "name": "«Ko'kcha Qarog'och Luks»",
        "category_name": "Shpon & Tabiiy Yog'och",
        "price": 2950000,
        "price_formatted": "2 950 000 so'm",
        "material": "Massiv yog'och + Qarog'och shponi",
        "coating": "Yaltiroq yoki yarim mat lak",
        "colors": "Shokolad, Tabiiy qarog'och, To'q qahva",
        "standard_sizes": "2050 x 800 / 900 mm",
        "warranty": "5 yil kafolat",
        "description": (
            "O'zbekistonning an'anaviy yog'och ustaligi an'analarida yaratilgan premium eshik. "
            "Qarog'ochning boy to'qimasi xonangizga boy va salobatli ko'rinish beradi."
        ),
        "features": [
            "Og'ir va barqaror massiv karkas",
            "Italiya sifatidagi qulf mexanizmlari",
            "Klassik karniz bilan yetkazib beriladi"
        ],
        "image_type": "hero"
    },

    # 3. Yashirin eshiklar (Invisible)
    {
        "id": "inv_01",
        "category_id": "invisible",
        "name": "«Ko'kcha Stealth 360 (Invisible)»",
        "category_name": "Yashirin eshiklar",
        "price": 2400000,
        "price_formatted": "2 400 000 so'm",
        "material": "Anodlangan alyumin korobka + Gruntlangan polotno",
        "coating": "Bo'yashga yoki oboy yopishtirishga tayyor grunt",
        "colors": "Devor rangi ostida bo'yaladi / Oboy qilinadi",
        "standard_sizes": "2000/2100/2400 x 700/800/900 mm (shuningdek shiftgacha)",
        "warranty": "5 yil kafolat",
        "description": (
            "Nalichniksiz, devor bilan to'liq bir tekis o'rnatiladigan yashirin eshik. "
            "Sirtini devor qog'ozi (oboy), dekorativ suvoq yoki devor bo'yog'i bilan xohlagan rangga kiritishingiz mumkin."
        ),
        "features": [
            "Yashirin 3D sozlanadigan ilgaklar (Otlav Italiya)",
            "Magnit qulf va shovqinsiz germetik rezina",
            "Ichkariga (Reverse) yoki tashqariga ochilish tanlovi"
        ],
        "image_type": "hero"
    },

    # 4. Kirish temir eshiklari
    {
        "id": "iron_01",
        "category_id": "iron_doors",
        "name": "«Ko'kcha Titan Smart (Termo)»",
        "category_name": "Kirish temir eshiklar",
        "price": 4800000,
        "price_formatted": "4 800 000 so'm",
        "material": "2 mm sovuq prokatlangan po'lat + Bazalt paxta termoizolyatsiyasi",
        "coating": "Kukunli polimer (tashqari) + MDF yong'oq paneli (ichkari)",
        "colors": "Antrasit kulrang / Tabiiy yong'oq yog'ochi",
        "standard_sizes": "2050 x 860 / 960 mm (yoki individual o'lchamda)",
        "warranty": "5 yil kafolat",
        "description": (
            "Hovli va kvartiralar uchun sovuq va shovqindan himoya qiluvchi termo-razrivli bron eshik. "
            "Biometrik smart qulf (barmoq izi, kod, karta va kalit orqali ochiladi)."
        ),
        "features": [
            "3 qavatli germetik zichlagich rezina",
            "Smart biometrik qulf tizimi o'rnatilgan",
            "Zanglash va ob-havoga 100% chidamli"
        ],
        "image_type": "entrance"
    },
    {
        "id": "iron_02",
        "category_id": "iron_doors",
        "name": "«Ko'kcha Monolit Grand»",
        "category_name": "Kirish temir eshiklar",
        "price": 3900000,
        "price_formatted": "3 900 000 so'm",
        "material": "1.8 mm metall lista + Rombik qovurg'ali armatura",
        "coating": "Muar polimer bo'yoq + Qalin 16 mm MDF qoplama",
        "colors": "Qora marvarid, Bronza, Shokolad",
        "standard_sizes": "2050 x 880 / 980 mm",
        "warranty": "5 yil kafolat",
        "description": (
            "Maksimal xavfsizlik va sokinlikni ta'minlaydigan klassik bronlangan kirish eshigi. "
            "Rossiyaning 'Guardian' 4-sinf xavfsizlik qulflari bilan jihozlangan."
        ),
        "features": [
            "Burg'ulashga qarshi po'lat plastinalar",
            "Keng burchakli panorama glzok (eshik ko'zchasi)",
            "Shovqin kamaytirish: 40 dB gacha"
        ],
        "image_type": "entrance"
    },

    # 5. Katta zal eshiklari (Dvupolniy)
    {
        "id": "double_01",
        "category_id": "double_doors",
        "name": "«Ko'kcha Saroy Shukuhi (2 tabaqali)»",
        "category_name": "Katta zal eshiklari",
        "price": 4200000,
        "price_formatted": "4 200 000 so'm",
        "material": "Qarag'ay massiv karkas + 18 mm MDF + Fasetti oynalar",
        "coating": "Emal bo'yoq + Oltin patina",
        "colors": "Fil suyagi, Oq mat, Qaymoqrang",
        "standard_sizes": "2050 x 1200 / 1300 / 1400 mm (yoki buyurtma asosida)",
        "warranty": "3 yil kafolat",
        "description": (
            "Katta mehmonxona (zal) uchun ikki tabaqali shinam va salobatli eshik. "
            "Fasetli qirralarga ega bo'lgan zarbga chidamli mayin mat shishalar bilan jihozlangan."
        ),
        "features": [
            "Zarbga chidamli (Triplex / Faset) shishalar",
            "Tepa qismiga hashamatli toj (kapitel) o'rnatish imkoni",
            "Mustahkamlangan markaziy shpingalet qulflar"
        ],
        "image_type": "hero"
    }
]

def get_categories():
    """Barcha kategoriyalar ro'yxatini qaytaradi"""
    return list(CATEGORIES.values())

def get_category_by_id(cat_id: str):
    """Kategoriya ma'lumotini ID bo'yicha olish"""
    return CATEGORIES.get(cat_id)

def get_doors_by_category(category_id: str):
    """Berilgan kategoriya bo'yicha eshiklar ro'yxati"""
    return [d for d in DOORS if d["category_id"] == category_id]

def get_door_by_id(door_id: str):
    """Eshikni ID bo'yicha olish"""
    for d in DOORS:
        if d["id"] == door_id:
            return d
    return None

def calculate_custom_door_price(door_type: str, coating: str, height: int, width: int, with_lock: bool, with_install: bool):
    """
    Kalkulyator uchun taxminiy narx hisoblash funksiyasi.
    """
    base_prices = {
        "mdf": 1500000,
        "shpon": 2300000,
        "invisible": 2100000,
        "iron": 3500000,
        "double": 3400000
    }
    coating_multipliers = {
        "emal": 1.15,
        "mat_lak": 1.10,
        "shpon": 1.25,
        "grunt": 1.0,
        "polimer": 1.20
    }

    base = base_prices.get(door_type, 1600000)
    multiplier = coating_multipliers.get(coating, 1.1)

    # Standart o'lchamdan (2050x800) ortiq bo'lsa qo'shimcha koeffitsiyent
    standard_area = 2.05 * 0.8
    actual_area = (height / 1000.0) * (width / 1000.0)
    size_factor = 1.0
    if actual_area > standard_area:
        size_factor = max(1.0, actual_area / standard_area)

    total = int(base * multiplier * size_factor)

    # Qo'shimchalar
    lock_price = 250000 if with_lock else 0
    install_price = 200000 if with_install else 0

    total += lock_price + install_price

    # Ming so'mgacha yaxlitlash
    total = round(total, -3)

    return {
        "total_price": total,
        "total_formatted": f"{total:,.0f}".replace(",", " ") + " so'm",
        "lock_price": lock_price,
        "install_price": install_price,
        "base_price": int(base * multiplier * size_factor)
    }
