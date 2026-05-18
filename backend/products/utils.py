"""
Utility helpers used across products submodules.
"""
from __future__ import annotations

import re
from typing import Any, Dict, Optional

from slugify import slugify

from .models import ProductOut, TabBlock


DEFAULT_TABS = {
    "dosage":         {"title": "Дозування",     "intro": "", "items": [], "note": ""},
    "composition":    {"title": "Склад",          "intro": "", "items": [], "note": ""},
    "compatibility":  {"title": "Сумісність",     "intro": "", "items": [], "note": ""},
    "specs":          {"title": "Характеристика", "intro": "", "items": [], "note": ""},
}


def strip_mongo_id(doc: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if doc is None:
        return None
    doc.pop("_id", None)
    return doc


def ensure_tabs(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure all 4 tab blocks exist with sensible defaults."""
    for key, default in DEFAULT_TABS.items():
        if not doc.get(key):
            doc[key] = dict(default)
        else:
            block = doc[key]
            for k, v in default.items():
                block.setdefault(k, v)
    return doc


def to_product_out(doc: Dict[str, Any]) -> ProductOut:
    doc = strip_mongo_id(dict(doc)) or {}
    ensure_tabs(doc)
    return ProductOut(**doc)


def text_to_slug(value: str) -> str:
    return slugify(value or "", lowercase=True, max_length=80) or ""


async def unique_slug(db, base: str, exclude_id: Optional[str] = None) -> str:
    """Resolve a slug that is unique within the products collection."""
    base = text_to_slug(base) or "product"
    candidate = base
    n = 1
    while True:
        q: Dict[str, Any] = {"slug": candidate}
        if exclude_id:
            q["id"] = {"$ne": exclude_id}
        exists = await db.products.find_one(q, {"_id": 0, "id": 1})
        if not exists:
            return candidate
        n += 1
        candidate = f"{base}-{n}"


def sanitize_tab(value: Any) -> Dict[str, Any]:
    """Normalize a TabBlock-like dict (also accept Pydantic models)."""
    if value is None:
        return {}
    if hasattr(value, "model_dump"):
        value = value.model_dump()
    if isinstance(value, dict):
        items = value.get("items") or []
        norm_items = []
        for it in items:
            if hasattr(it, "model_dump"):
                it = it.model_dump()
            if isinstance(it, dict):
                norm_items.append({"text": str(it.get("text", ""))})
            elif isinstance(it, str):
                norm_items.append({"text": it})
        return {
            "title": str(value.get("title", "")),
            "intro": str(value.get("intro", "")),
            "items": norm_items,
            "note": str(value.get("note", "")),
        }
    return {}


WORD_RE = re.compile(r"\w+", re.UNICODE)
