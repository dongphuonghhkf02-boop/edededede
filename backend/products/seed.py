"""
Idempotent seeding for products + product_categories collections.

We seed with the same data that previously lived in
frontend/src/data/products.ts so the catalogue page renders
immediately after fresh deployment.
"""
from __future__ import annotations

import uuid
import logging
from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase

from .utils import text_to_slug

logger = logging.getLogger(__name__)


DEFAULT_CATEGORIES = [
    {"slug": "biopesticide",  "label": "Біоінсектициди", "sort_order": 1},
    {"slug": "macro",         "label": "Макро та Мікро",   "sort_order": 2},
    {"slug": "inoculant",     "label": "Інокулянти",        "sort_order": 3},
    {"slug": "rodenticide",   "label": "Родентициди",       "sort_order": 4},
    {"slug": "organic",       "label": "Органічні добрива", "sort_order": 5},
]


PHOTOS = [
    "/Photo@2x.webp", "/Photo1@2x.webp", "/Photo2@2x.webp",
    "/Photo3@2x.webp", "/Photo4@2x.webp", "/Photo5@2x.webp",
    "/Photo6@2x.webp", "/Photo7@2x.webp", "/Photo8@2x.webp",
]

# Default rich-tab content used as template for every seeded product so the
# /product internal page works out of the box.
_DEFAULT_DESCRIPTION_HTML = """
<p><b>Проблема.</b> Протягом вегетаційного періоду рослини піддаються впливу <b>великої кількості стресових факторів</b>: пестицидні навантаження, несприятливі погодні умови, механічні пошкодження та погіршення живлення.</p>
<p><b>Рішення.</b> Комплексний біопрепарат на основі живих культур бактерій, амінокислот та мікроелементів. Активізує поділ клітин кореневої системи та стимулює поглинання елементів живлення.</p>
""".strip()

_DEFAULT_DOSAGE = {
    "title": "Дозування",
    "intro": "",
    "items": [
        {"text": "Польові культури — <b>0,5–1,0 л/га</b>"},
        {"text": "Овочеві культури — <b>0,3–0,7 л/га</b>"},
        {"text": "Плодові та ягідні — <b>0,7–1,2 л/га</b>"},
        {"text": "Кратність обробок: 2–3 рази за вегетацію"},
    ],
    "note": "Обробку проводити в ранкові або вечірні години при температурі 15–25°C, у безвітряну погоду.",
}

_DEFAULT_COMPOSITION = {
    "title": "Склад",
    "intro": "",
    "items": [
        {"text": "<b>Bacillus subtilis</b> — 1×10⁹ КУО/мл"},
        {"text": "Амінокислоти рослинного походження — 12%"},
        {"text": "Гумінові кислоти — 3%"},
        {"text": "Мікроелементи (Zn, Mn, Cu, Mo, B) — у хелатній формі"},
        {"text": "Стабілізатор pH-балансу — органічного походження"},
    ],
    "note": "",
}

_DEFAULT_COMPATIBILITY = {
    "title": "Сумісність",
    "intro": "Препарат сумісний з більшістю засобів захисту рослин та водорозчинних добрив. Рекомендовано перед змішуванням провести тест на сумісність у малих об’ємах.",
    "items": [
        {"text": "Сумісний: фунгіциди, інсектициди, водорозчинні добрива"},
        {"text": "Не сумісний: засоби з лужною реакцією (pH &gt; 8)"},
        {"text": "Інтервал застосування з гербіцидами — мінімум 5 днів"},
    ],
    "note": "",
}

_DEFAULT_SPECS = {
    "title": "Характеристика",
    "intro": "",
    "items": [
        {"text": "Форма випуску: рідкий концентрат"},
        {"text": "Колір: світло-коричневий"},
        {"text": "pH розчину: 6,5–7,5"},
        {"text": "Термін придатності: 24 місяці"},
        {"text": "Температура зберігання: +5…+25°C"},
        {"text": "Фасування: 1 л / 5 л / 10 л / 20 л"},
        {"text": "Сертифікація: придатний для органічного землеробства"},
    ],
    "note": "",
}


def _build_default_tabs():
    return {
        "description_html": _DEFAULT_DESCRIPTION_HTML,
        "dosage": dict(_DEFAULT_DOSAGE),
        "composition": dict(_DEFAULT_COMPOSITION),
        "compatibility": dict(_DEFAULT_COMPATIBILITY),
        "specs": dict(_DEFAULT_SPECS),
    }


def _build_default_description(product_name: str, short_desc: str) -> dict:
    """Return the Figma-style Опис block used as default for every seeded product."""
    return {
        "hero_image": "/tree.webp",
        "title_line1": "Відновлення",
        "title_line2": "після стресу.",
        "title_subline": "Стабільний врожай.",
        "chips": [
            {
                "icon": "lightning",
                "title": "Швидке відновлення",
                "body": "Відновлення життєдіяльності рослин після стресу протягом короткого терміну",
                "variant": "green",
            },
            {
                "icon": "eco",
                "title": "Ідеальний pH-баланс води",
                "body": "Захищає дорогі пестициди від швидкого руйнування у жорсткій воді, покращуючи їх сумісність із рослиною.",
                "variant": "dark",
            },
            {
                "icon": "drop",
                "title": "Покращення поглинання",
                "body": "Впливає на рівномірне покриття листя та засвоєння активних речовин",
                "variant": "cream",
            },
        ],
        "problem": {
            "title": "Проблема",
            "intro_html": (
                "Протягом вегетаційного періоду рослини піддаються впливу "
                "<b>великої кількості стресових факторів</b>: пестицидні навантаження, "
                "несприятливі погодні умови (температура, вологість), механічні пошкодження, "
                "градобій, погіршення живлення та ін."
            ),
            "outro_html": (
                "Це призводить до погіршення росту рослин, зниженню їх продуктивності, "
                "а іноді й до їх загибелі."
            ),
        },
        "solution": {
            "title": "Рішення",
            "intro_html": (
                f"<b>{product_name}</b> — препарат на основі живих культур бактерій, "
                "амінокислот та мікроелементів. Відновлює біохімічні процеси у рослині після "
                "впливу стресових факторів. Активізує поділ клітин кореневої системи, "
                "завдяки чому рослина через молоді кореневі волоски інтенсивно поглинає "
                "елементи живлення та вологу."
            ),
            "outro_html": (
                "Рослина <span style=\"color:#b3d217\">швидше виходить зі стресу</span> "
                "і спрямовує енергію на ріст та формування врожаю. "
                "<span style=\"color:#b3d217\">Врожай стабільніший</span> навіть у складні сезони."
            ),
        },
    }


DEFAULT_PRODUCTS = [
    dict(slug="venator",   name="Венатор",   short_desc="біологічний родентицид",                                  category="rodenticide",  photo=PHOTOS[0], price=420, default_volume="5 Л", packing="1, 5, 10 л", norm="1.5–2 л/га",   in_stock=True,  rating=4.9, reviews=100, is_hit=True),
    dict(slug="flores",    name="Флорес",    short_desc="комплексний інокулянт для бобових культур",               category="inoculant",    photo=PHOTOS[1], price=380, default_volume="5 Л", packing="1, 5, 10 л", norm="2–3 л/т",     in_stock=True,  rating=4.8, reviews=84,  is_hit=True),
    dict(slug="agrostim",  name="Агростим",  short_desc="макро та мікро елементи для обробки зернобобових",        category="macro",        photo=PHOTOS[2], price=290, default_volume="5 Л", packing="1, 5, 10 л", norm="1–2 л/га",    in_stock=True,  rating=4.7, reviews=62),
    dict(slug="gladiator", name="Гладіатор", short_desc="потужний біоінсектицид широкого спектру",                  category="biopesticide", photo=PHOTOS[3], price=510, default_volume="5 Л", packing="1, 5, 10 л", norm="0.5–1 л/га",  in_stock=True,  rating=4.9, reviews=142, is_hit=True),
    dict(slug="rodentmax", name="РодентМакс", short_desc="родентицид-приманка тривалої дії",                         category="rodenticide",  photo=PHOTOS[4], price=350, default_volume="5 Л", packing="1, 5, 10 л", norm="1–1.5 кг/га",  in_stock=True,  rating=4.6, reviews=48),
    dict(slug="biogumin",  name="Біогумін",  short_desc="органічне добриво на основі вермікомпосту",                  category="organic",      photo=PHOTOS[5], price=220, default_volume="5 Л", packing="1, 5, 10 л", norm="3–5 л/га",    in_stock=True,  rating=4.5, reviews=30),
    dict(slug="nodulin",   name="Нодулін",   short_desc="інокулянт для сої та інших бобових",                          category="inoculant",    photo=PHOTOS[6], price=410, default_volume="5 Л", packing="1, 5, 10 л", norm="2 л/т",        in_stock=False, rating=4.7, reviews=56,  is_new=True),
    dict(slug="ekobio",    name="ЕкоБіо",    short_desc="біоінсектицид для захисту садових культур",               category="biopesticide", photo=PHOTOS[7], price=480, default_volume="5 Л", packing="1, 5, 10 л", norm="1–2 л/га",    in_stock=True,  rating=4.4, reviews=22),
    dict(slug="mineral-10", name="Мінерал-10", short_desc="макро та мікро елементи для всіх типів культур",        category="macro",        photo=PHOTOS[8], price=310, default_volume="5 Л", packing="1, 5, 10 л", norm="1–3 л/га",    in_stock=True,  rating=4.8, reviews=71,  is_hit=True),
    dict(slug="kompost-plus", name="Компост-Плюс", short_desc="органічне добриво гранульоване",                       category="organic",      photo=PHOTOS[0], price=180, default_volume="5 Л", packing="5, 10, 25 кг", norm="0.5 т/га",   in_stock=True,  rating=4.6, reviews=39),
    dict(slug="rapidkil",  name="РапідКіл",  short_desc="родентицид швидкої дії",                                  category="rodenticide",  photo=PHOTOS[1], price=395, default_volume="5 Л", packing="1, 5, 10 л", norm="1–1.5 кг/га",  in_stock=True,  rating=4.5, reviews=28),
    dict(slug="fitoplant", name="ФітоПлант", short_desc="комплексне макродобриво для злакових",                    category="macro",        photo=PHOTOS[2], price=275, default_volume="5 Л", packing="1, 5, 10 л", norm="1–2 л/га",    in_stock=True,  rating=4.7, reviews=53),
    dict(slug="bioshield", name="БіоЩит",    short_desc="біоінсектицид проти ґрунтових шкідників",                 category="biopesticide", photo=PHOTOS[3], price=530, default_volume="5 Л", packing="1, 5, 10 л", norm="0.5–1 л/га",  in_stock=False, rating=4.9, reviews=117, is_new=True),
    dict(slug="rizotum",   name="Різотум",   short_desc="інокулянт для гороху та люцерни",                         category="inoculant",    photo=PHOTOS[4], price=365, default_volume="5 Л", packing="1, 5, 10 л", norm="1.5 л/т",      in_stock=True,  rating=4.6, reviews=42),
    dict(slug="vermosol",  name="ВермоСол",  short_desc="органічне добриво рідке",                                  category="organic",      photo=PHOTOS[5], price=240, default_volume="5 Л", packing="1, 5, 10 л", norm="2–4 л/га",    in_stock=True,  rating=4.5, reviews=33),
    dict(slug="ratstop",   name="РатСтоп",   short_desc="родентицид у пастках та зернах",                           category="rodenticide",  photo=PHOTOS[6], price=340, default_volume="5 Л", packing="1, 5, 10 л", norm="1 кг/га",     in_stock=True,  rating=4.4, reviews=21),
    dict(slug="microset",  name="МікроСет",  short_desc="комплекс мікроелементів для позакореневого підживлення",  category="macro",        photo=PHOTOS[7], price=320, default_volume="5 Л", packing="1, 5, 10 л", norm="1–1.5 л/га",  in_stock=True,  rating=4.8, reviews=65,  is_hit=True),
    dict(slug="biograd",   name="БіоГрад",   short_desc="біоінсектицид проти попелиці та трипсів",                category="biopesticide", photo=PHOTOS[8], price=470, default_volume="5 Л", packing="1, 5, 10 л", norm="0.5–1 л/га",  in_stock=True,  rating=4.7, reviews=58),
    dict(slug="humatpro",  name="Гумат-Pro",  short_desc="органічне добриво з гумінових кислот",                  category="organic",      photo=PHOTOS[0], price=200, default_volume="5 Л", packing="1, 5, 10 л", norm="2–3 л/га",    in_stock=True,  rating=4.6, reviews=47),
    dict(slug="azotofix",  name="АзотоФікс", short_desc="інокулянт-фіксатор азоту для бобових",                    category="inoculant",    photo=PHOTOS[1], price=425, default_volume="5 Л", packing="1, 5, 10 л", norm="1.5–2 л/т",    in_stock=True,  rating=4.9, reviews=89,  is_new=True),
]


async def seed_product_categories_if_empty(db: AsyncIOMotorDatabase) -> None:
    existing = await db.product_categories.count_documents({})
    if existing > 0:
        return
    now = datetime.now(timezone.utc).isoformat()
    docs = []
    for c in DEFAULT_CATEGORIES:
        docs.append({
            "id": str(uuid.uuid4()),
            "slug": c["slug"],
            "label": c["label"],
            "sort_order": c["sort_order"],
            "active": True,
            "created_at": now,
            "updated_at": now,
        })
    if docs:
        await db.product_categories.insert_many(docs)
        logger.info(f"[seed] product_categories: inserted {len(docs)} default categories")


async def seed_products_if_empty(db: AsyncIOMotorDatabase) -> None:
    existing = await db.products.count_documents({})
    if existing > 0:
        return
    now = datetime.now(timezone.utc).isoformat()
    docs = []
    for idx, p in enumerate(DEFAULT_PRODUCTS):
        slug = p.get("slug") or text_to_slug(p["name"])
        tabs = _build_default_tabs()
        # vary seo description from short_desc
        seo_title = f"{p['name']} — TAMIS АГРО"
        seo_desc = p["short_desc"]
        docs.append({
            "id": str(uuid.uuid4()),
            "slug": slug,
            "name": p["name"],
            "short_desc": p["short_desc"],
            "category": p["category"],
            "photo": p["photo"],
            "photos": [p["photo"]],
            "packing": p["packing"],
            "norm": p["norm"],
            "default_volume": p["default_volume"],
            "price": float(p["price"]),
            "variants": [],
            "in_stock": p["in_stock"],
            "rating": float(p["rating"]),
            "reviews": int(p["reviews"]),
            "is_hit": bool(p.get("is_hit", False)),
            "is_new": bool(p.get("is_new", False)),
            "sort_order": idx,
            "description_html": tabs["description_html"],
            "description_image": "",
            "description": _build_default_description(p["name"], p["short_desc"]),
            "dosage": tabs["dosage"],
            "composition": tabs["composition"],
            "compatibility": tabs["compatibility"],
            "specs": tabs["specs"],
            "seo_title": seo_title,
            "seo_description": seo_desc,
            "status": "published",
            "created_at": now,
            "updated_at": now,
        })
    if docs:
        await db.products.insert_many(docs)
        logger.info(f"[seed] products: inserted {len(docs)} default products")


async def backfill_product_descriptions(db: AsyncIOMotorDatabase) -> None:
    """
    One-time, idempotent migration: every existing product that is missing
    the new `description` block (or has an empty problem.intro_html) gets
    a sensible default populated using its own name + short_desc.
    Safe to call on every startup — only writes documents that need it.
    """
    cursor = db.products.find({}, {"_id": 0})
    updated = 0
    async for doc in cursor:
        desc = doc.get("description")
        needs = (
            not isinstance(desc, dict)
            or not desc.get("problem", {}).get("intro_html")
            or not desc.get("solution", {}).get("intro_html")
            or not desc.get("chips")
        )
        if not needs:
            continue
        new_desc = _build_default_description(doc.get("name", ""), doc.get("short_desc", ""))
        await db.products.update_one(
            {"id": doc["id"]},
            {"$set": {"description": new_desc, "updated_at": datetime.now(timezone.utc).isoformat()}},
        )
        updated += 1
    if updated:
        logger.info(f"[migrate] products: backfilled description on {updated} products")
