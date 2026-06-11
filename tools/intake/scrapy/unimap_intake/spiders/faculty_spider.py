import scrapy

from unimap_intake.spiders._helpers import (
    build_item,
    clean_text,
    first_email,
    guess_name,
    unique_records,
)


class FacultySpider(scrapy.Spider):
    name = "faculty"

    def __init__(self, start_url=None, university=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not start_url:
            raise ValueError("Pass -a start_url=<faculty directory URL>")
        self.start_urls = [start_url]
        self.university_name = university or ""

    def parse(self, response):
        candidates = self._parse_known_person_cards(response)
        if candidates:
            yield build_item(
                response=response,
                spider_name=self.name,
                source_type="faculty",
                university_name=self.university_name,
                records=unique_records(candidates, ["name", "email", "profile_url"]),
                confidence=0.72,
                metadata={"strategy": "structured faculty card extraction"},
            )
            return

        candidates = []
        selectors = [
            ".individu",
            "article",
            ".views-row",
            ".person",
            ".profile",
            ".directory-item",
            ".card",
            "tr",
            "li",
        ]

        for selector in selectors:
            for block in response.css(selector):
                text = clean_text(" ".join(block.css("::text").getall()))
                lowered = text.lower()
                if len(text) < 24:
                    continue
                hrefs = " ".join(block.css("a::attr(href)").getall())
                if not (
                    "professor" in lowered
                    or "professeur" in lowered
                    or "faculty" in lowered
                    or first_email(text)
                    or "/professeur/" in hrefs
                ):
                    continue

                profile_href = block.css("a::attr(href)").get()
                if not profile_href and not first_email(text):
                    continue
                candidates.append(
                    {
                        "record_type": "faculty_member",
                        "name": guess_name(text),
                        "raw_label": text[:700],
                        "email": first_email(text),
                        "profile_url": response.urljoin(profile_href) if profile_href else "",
                        "department": "",
                        "title": "",
                        "research_areas": [],
                        "evidence_url": response.url,
                    }
                )

        yield build_item(
            response=response,
            spider_name=self.name,
            source_type="faculty",
            university_name=self.university_name,
            records=unique_records(candidates, ["name", "email", "profile_url"]),
            confidence=0.5,
            metadata={"strategy": "generic faculty directory block extraction"},
        )

    def _parse_known_person_cards(self, response):
        records = []
        for block in response.css(".individu"):
            last_name = clean_text(block.css(".nom::text").get() or "")
            first_name = clean_text(block.css(".prenom::text").get() or "")
            name = " ".join(part for part in [first_name, last_name] if part)
            text = clean_text(" ".join(block.css("::text").getall()))
            profile_href = block.css("h4 a::attr(href), .visuel a::attr(href)").get()
            title = clean_text(block.css(".fonction::text").get() or "")
            expertises = [
                clean_text(value)
                for value in block.css(".expertises span::text").getall()
                if clean_text(value)
            ]
            email = first_email(text)
            if not name and not email:
                continue
            records.append(
                {
                    "record_type": "faculty_member",
                    "name": name or guess_name(text),
                    "raw_label": text[:700],
                    "email": email,
                    "profile_url": response.urljoin(profile_href) if profile_href else "",
                    "department": "",
                    "title": title,
                    "research_areas": expertises,
                    "evidence_url": response.url,
                }
            )
        return records
