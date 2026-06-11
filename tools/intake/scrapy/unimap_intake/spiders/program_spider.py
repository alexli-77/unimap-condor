import re

import scrapy

from unimap_intake.spiders._helpers import build_item, clean_text, unique_records


DEGREE_RE = re.compile(
    r"\b(master|msc|m\.sc|phd|ph\.d|doctorate|bachelor|bsc|b\.sc|graduate|undergraduate)\b",
    re.I,
)


class ProgramSpider(scrapy.Spider):
    name = "program"

    def __init__(self, start_url=None, university=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not start_url:
            raise ValueError("Pass -a start_url=<program page URL>")
        self.start_urls = [start_url]
        self.university_name = university or ""

    def parse(self, response):
        records = []
        selectors = ["article", ".program", ".card", ".views-row", "tr", "li"]

        for selector in selectors:
            for block in response.css(selector):
                text = clean_text(" ".join(block.css("::text").getall()))
                if len(text) < 20 or not DEGREE_RE.search(text):
                    continue

                application_href = block.css("a::attr(href)").get()
                records.append(
                    {
                        "record_type": "program",
                        "name": text[:180],
                        "degree_level": self._degree_level(text),
                        "department": "",
                        "subjects": [],
                        "application_url": response.urljoin(application_href)
                        if application_href
                        else "",
                        "raw_label": text[:700],
                        "evidence_url": response.url,
                    }
                )

        yield build_item(
            response=response,
            spider_name=self.name,
            source_type="program",
            university_name=self.university_name,
            records=unique_records(records, ["name", "degree_level", "application_url"]),
            confidence=0.45,
            metadata={"strategy": "degree keyword block extraction"},
        )

    def _degree_level(self, text):
        lowered = text.lower()
        if any(token in lowered for token in ["phd", "ph.d", "doctorate"]):
            return "PhD"
        if any(token in lowered for token in ["master", "msc", "m.sc", "graduate"]):
            return "Master"
        if any(token in lowered for token in ["bachelor", "bsc", "b.sc", "undergraduate"]):
            return "Undergraduate"
        return ""
