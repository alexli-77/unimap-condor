import re
from urllib.parse import urljoin

from unimap_intake.items import IntakePageItem


EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
WHITESPACE_RE = re.compile(r"\s+")


def clean_text(value):
    return WHITESPACE_RE.sub(" ", value or "").strip()


def page_title(response):
    return clean_text(response.css("title::text").get() or "")


def visible_text(response, limit=24000):
    text = clean_text(" ".join(response.css("body *::text").getall()))
    return text[:limit]


def first_url(response, selector):
    href = response.css(selector).get()
    return urljoin(response.url, href) if href else None


def first_email(text):
    match = EMAIL_RE.search(text or "")
    return match.group(0) if match else None


def compact_lines(text):
    return [line.strip(" -|:\t") for line in re.split(r"[\n\r]+", text or "") if line.strip()]


def guess_name(text):
    lines = compact_lines(text)
    for line in lines[:4]:
        words = line.split()
        if 2 <= len(words) <= 5 and not any(char.isdigit() for char in line):
            return line
    return lines[0] if lines else ""


def build_item(
    response,
    spider_name,
    source_type,
    university_name,
    records,
    confidence=0.45,
    metadata=None,
):
    return IntakePageItem(
        spider_name=spider_name,
        source_type=source_type,
        source_url=response.url,
        university_name=university_name,
        page_title=page_title(response),
        raw_text=visible_text(response),
        records=records,
        confidence=confidence,
        review_status="draft",
        metadata=metadata or {},
    )


def unique_records(records, key_fields):
    seen = set()
    output = []
    for record in records:
        key = tuple(clean_text(str(record.get(field, ""))).lower() for field in key_fields)
        if not any(key) or key in seen:
            continue
        seen.add(key)
        output.append(record)
    return output
