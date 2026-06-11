import scrapy


class IntakePageItem(scrapy.Item):
    spider_name = scrapy.Field()
    source_type = scrapy.Field()
    source_url = scrapy.Field()
    university_name = scrapy.Field()
    page_title = scrapy.Field()
    raw_text = scrapy.Field()
    raw_text_hash = scrapy.Field()
    extracted_at = scrapy.Field()
    records = scrapy.Field()
    confidence = scrapy.Field()
    review_status = scrapy.Field()
    metadata = scrapy.Field()
