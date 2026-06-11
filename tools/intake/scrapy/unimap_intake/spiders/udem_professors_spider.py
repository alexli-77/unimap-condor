import re

import scrapy

from unimap_intake.spiders._helpers import build_item, clean_text, unique_records


PAGE_RE = re.compile(r"/pg/(\d+)/")


class UdemProfessorsSpider(scrapy.Spider):
    name = "udem_professors"
    allowed_domains = ["recherche.umontreal.ca"]

    def __init__(self, start_url=None, university=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_urls = [
            start_url
            or "https://recherche.umontreal.ca/nos-equipes-de-recherche/"
            "repertoire-des-professeurs-et-professeures/sm/l/"
        ]
        self.university_name = university or "Université de Montréal"

    def parse(self, response):
        records = self._parse_search_results(response)
        if not records:
            records = self._parse_hiring_results(response)

        if records:
            yield build_item(
                response=response,
                spider_name=self.name,
                source_type="faculty",
                university_name=self.university_name,
                records=unique_records(records, ["name", "profile_url"]),
                confidence=0.86,
                metadata={
                    "strategy": "udem research directory faculty/member hierarchy extraction",
                    "hierarchy": ["university", "faculty_name", "department_name", "faculty_member"],
                },
            )

        if response.meta.get("expanded_pagination"):
            return

        max_page = self._max_page(response)
        if max_page <= 1:
            for href in response.css(".udemvitrine-search-results ul.pagination a::attr(href)").getall():
                yield response.follow(href, callback=self.parse, meta={"expanded_pagination": True})
            return

        for page in range(2, max_page + 1):
            yield response.follow(
                f"/nos-equipes-de-recherche/repertoire-des-professeurs-et-professeures/sm/l/pg/{page}/",
                callback=self.parse,
                meta={"expanded_pagination": True},
            )

    def _parse_search_results(self, response):
        records = []
        for row in response.css(".udemvitrine-search-results .udemvitrine-search-result"):
            name = clean_text(
                row.css(".col-md-5.col-xs-10 a.udemvitrine-goto-professeur::text").get() or ""
            )
            profile_href = row.css(
                ".col-md-5.col-xs-10 a.udemvitrine-goto-professeur::attr(href)"
            ).get()
            if not name or not profile_href:
                continue

            affiliation_text = clean_text(
                " ".join(row.css(".col-md-5.col-xs-10::text").getall())
            )
            affiliations = [self._parse_affiliation(affiliation_text)] if affiliation_text else []
            first_affiliation = affiliations[0] if affiliations else {}
            research_areas = [
                clean_text(value).strip("; ")
                for value in row.css(".col-md-6.col-xs-12 span::text").getall()
                if clean_text(value).strip("; ")
                and "professeur recrute" not in clean_text(value).lower()
            ]
            raw_label = " | ".join([name, affiliation_text, "; ".join(research_areas)]).strip(" |")

            records.append(
                {
                    "record_type": "faculty_member",
                    "name": name,
                    "raw_label": raw_label[:700],
                    "email": "",
                    "profile_url": response.urljoin(profile_href),
                    "faculty_name": first_affiliation.get("faculty", ""),
                    "department_name": first_affiliation.get("unit", ""),
                    "department": first_affiliation.get("unit", ""),
                    "affiliations": affiliations,
                    "title": "",
                    "research_areas": research_areas,
                    "evidence_url": response.url,
                }
            )
        return records

    def _parse_hiring_results(self, response):
        records = []
        for row in response.css("table.udemvitrine-professeurs-qui-recrutent tr"):
            name = clean_text(row.css("td.professor-name a::text").get() or "")
            profile_href = row.css("td.professor-name a::attr(href)").get()
            if not name or not profile_href:
                continue

            affiliation_texts = [
                clean_text(value)
                for value in row.css("td:not(.professor-name):not(.spacer) span::text").getall()
                if clean_text(value)
            ]
            affiliations = [self._parse_affiliation(value) for value in affiliation_texts]
            first_affiliation = affiliations[0] if affiliations else {}
            raw_label = " | ".join([name, *affiliation_texts])

            records.append(
                {
                    "record_type": "faculty_member",
                    "name": name,
                    "raw_label": raw_label[:700],
                    "email": "",
                    "profile_url": response.urljoin(profile_href),
                    "faculty_name": first_affiliation.get("faculty", ""),
                    "department_name": first_affiliation.get("unit", ""),
                    "department": first_affiliation.get("unit", ""),
                    "affiliations": affiliations,
                    "title": "",
                    "research_areas": [],
                    "evidence_url": response.url,
                }
            )
        return records

    def _max_page(self, response):
        pages = []
        for href in response.css(".udemvitrine-search-results ul.pagination a::attr(href)").getall():
            match = PAGE_RE.search(href or "")
            if match:
                pages.append(int(match.group(1)))
        return max(pages, default=1)

    def _parse_affiliation(self, value):
        parts = re.split(r"\s[-–]\s", value, maxsplit=1)
        faculty = clean_text(parts[0] if parts else value)
        unit = clean_text(parts[1] if len(parts) > 1 else "")
        return {"faculty": faculty, "unit": unit, "raw": value}
