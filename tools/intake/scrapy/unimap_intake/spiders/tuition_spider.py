import re

import scrapy

from unimap_intake.spiders._helpers import build_item, clean_text, unique_records


MONEY_RE = re.compile(r"(?:CAD|USD|EUR|GBP|C\$|\$|€|£)\s?[0-9][0-9,.\s]*", re.I)
SIGNAL_RE = re.compile(
    r"\b(tuition|fees?|funding|scholarships?|financial aid|international students?)\b",
    re.I,
)


class TuitionSpider(scrapy.Spider):
    name = "tuition"

    def __init__(self, start_url=None, university=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not start_url:
            raise ValueError("Pass -a start_url=<tuition or funding page URL>")
        self.start_urls = [start_url]
        self.university_name = university or ""

    def parse(self, response):
        records = []
        selectors = ["article", ".content", ".card", ".views-row", "section", "tr", "li", "p"]

        for selector in selectors:
            for block in response.css(selector):
                text = clean_text(" ".join(block.css("::text").getall()))
                if len(text) < 20 or not SIGNAL_RE.search(text):
                    continue

                amounts = MONEY_RE.findall(text)
                records.append(
                    {
                        "record_type": "tuition_funding",
                        "topic": self._topic(text),
                        "amounts": amounts[:8],
                        "raw_label": text[:900],
                        "evidence_url": response.url,
                    }
                )

        yield build_item(
            response=response,
            spider_name=self.name,
            source_type="tuition_funding",
            university_name=self.university_name,
            records=unique_records(records, ["topic", "raw_label"]),
            confidence=0.4,
            metadata={"strategy": "tuition and funding keyword extraction"},
        )

    def _topic(self, text):
        lowered = text.lower()
        if "scholarship" in lowered or "funding" in lowered or "financial aid" in lowered:
            return "funding"
        if "international" in lowered:
            return "international tuition"
        return "tuition"
