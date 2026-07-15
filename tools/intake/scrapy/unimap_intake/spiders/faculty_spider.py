import scrapy

from unimap_intake.spiders._helpers import (
    build_item,
    clean_text,
    first_email,
    guess_name,
    unique_records,
)


FACULTY_TITLE_RE = r"(Assistant Professor|Associate Professor|Professor of Teaching|Associate Professor of Teaching|Assistant Professor of Teaching|University Professor|Professor|Faculty Lecturer|Lecturer|Director)"


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
                email = first_email(text)
                title = self._extract_title(text)
                candidates.append(
                    {
                        "record_type": "faculty_member",
                        "name": self._clean_name(text, email, title),
                        "raw_label": text[:700],
                        "email": email,
                        "profile_url": response.urljoin(profile_href) if profile_href else "",
                        "department": "",
                        "title": title,
                        "research_areas": [],
                        "evidence_url": response.url,
                    }
                )

        email_candidates = [record for record in candidates if record.get("email")]
        if len(email_candidates) >= 5:
            candidates = email_candidates

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
        for parser in [
            self._parse_ubc_faculty_table,
            self._parse_waterloo_contacts,
            self._parse_mcgill_faculty_cards,
            self._parse_udem_person_cards,
        ]:
            records = parser(response)
            if records:
                return records
        return []

    def _parse_udem_person_cards(self, response):
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

    def _parse_ubc_faculty_table(self, response):
        records = []
        for row in response.css("tr"):
            name = clean_text(row.css(".contact-content-name::text").get() or "")
            email = clean_text(row.css('a[href^="mailto:"]::text').get() or "")
            if not name or not email:
                continue
            profile_href = row.css(".contact-content-name::attr(href)").get()
            areas = [
                clean_text(value)
                for value in row.css('td[headers*="research-areas"] a::text').getall()
                if clean_text(value)
            ]
            title = clean_text(row.css(".contact-content-job-title::text").get() or "")
            records.append(
                {
                    "record_type": "faculty_member",
                    "name": name,
                    "raw_label": clean_text(" ".join(row.css("::text").getall()))[:700],
                    "email": email,
                    "profile_url": response.urljoin(profile_href) if profile_href else "",
                    "department": "Computer Science",
                    "title": title,
                    "research_areas": areas,
                    "evidence_url": response.url,
                }
            )
        return records

    def _parse_waterloo_contacts(self, response):
        records = []
        for block in response.css(".uw-contact"):
            name = clean_text(block.css(".uw-contact__h2 a::text, .uw-contact__h2::text").get() or "")
            email = clean_text(block.css('a[href^="mailto:"]::text').get() or "")
            if not name or not email:
                continue
            profile_href = block.css(".uw-contact__h2 a::attr(href)").get()
            title = clean_text(block.css(".uw-contact__position::text").get() or "")
            text = clean_text(" ".join(block.css("::text").getall()))
            records.append(
                {
                    "record_type": "faculty_member",
                    "name": name,
                    "raw_label": text[:700],
                    "email": email,
                    "profile_url": response.urljoin(profile_href) if profile_href else "",
                    "department": "Cheriton School of Computer Science",
                    "title": title,
                    "research_areas": self._extract_research_areas(text),
                    "evidence_url": response.url,
                }
            )
        return records

    def _parse_mcgill_faculty_cards(self, response):
        records = []
        for block in response.css("div.list-group"):
            name = clean_text(block.css("h4::text").get() or "")
            email = clean_text(block.css('a:contains("Email:")::text').re_first(r"Email:\s*([^\s]+)") or "")
            if not email:
                text = clean_text(" ".join(block.css("::text").getall()))
                email = first_email(text) or ""
            if not name or not email:
                continue
            profile_href = block.css('a.list-group-item[href]:contains("Website")::attr(href)').get()
            areas = [
                clean_text(value)
                for value in block.css("a.list-group-item > div.row p::text").getall()
                if clean_text(value)
            ]
            records.append(
                {
                    "record_type": "faculty_member",
                    "name": name,
                    "raw_label": clean_text(" ".join(block.css("::text").getall()))[:700],
                    "email": email,
                    "profile_url": response.urljoin(profile_href) if profile_href else "",
                    "department": "School of Computer Science",
                    "title": "",
                    "research_areas": areas,
                    "evidence_url": response.url,
                }
            )
        return records

    def _extract_title(self, text):
        import re

        match = re.search(FACULTY_TITLE_RE, text or "")
        return match.group(0) if match else ""

    def _clean_name(self, text, email=None, title=None):
        import re

        value = text or ""
        if email and email in value:
            value = value.split(email, 1)[0]
        if title and title in value:
            value = value.split(title, 1)[0]
        value = re.sub(r"\b(Personal Page|Google Scholar|Website)\b", " ", value)
        value = re.sub(r"^[A-Z]{1,3}\s+", "", value)
        value = clean_text(value)
        return value if value else guess_name(text)

    def _extract_research_areas(self, text):
        import re

        match = re.search(r"Research (?:and teaching )?interests?\s+(.*?)(?:Publications|Link to|$)", text or "")
        if not match:
            return []
        area_text = clean_text(match.group(1))
        parts = re.split(r";|,|\s{2,}", area_text)
        return [clean_text(part) for part in parts if 3 <= len(clean_text(part)) <= 90][:8]
