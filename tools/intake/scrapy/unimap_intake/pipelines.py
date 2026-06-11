import hashlib
from datetime import datetime, timezone

from itemadapter import ItemAdapter


class IntakeNormalizePipeline:
    def process_item(self, item, spider):
        adapter = ItemAdapter(item)
        raw_text = adapter.get("raw_text") or ""
        adapter["spider_name"] = adapter.get("spider_name") or spider.name
        adapter["raw_text_hash"] = adapter.get("raw_text_hash") or hashlib.sha256(
            raw_text.encode("utf-8")
        ).hexdigest()
        adapter["extracted_at"] = adapter.get("extracted_at") or datetime.now(
            timezone.utc
        ).isoformat()
        adapter["review_status"] = adapter.get("review_status") or "draft"
        adapter["confidence"] = adapter.get("confidence") or 0.45
        adapter["records"] = adapter.get("records") or []
        adapter["metadata"] = adapter.get("metadata") or {}
        return item
