BOT_NAME = "unimap_intake"

SPIDER_MODULES = ["unimap_intake.spiders"]
NEWSPIDER_MODULE = "unimap_intake.spiders"

ROBOTSTXT_OBEY = True
CONCURRENT_REQUESTS = 4
CONCURRENT_REQUESTS_PER_DOMAIN = 1
DOWNLOAD_DELAY = 1.0
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY = 1.0
AUTOTHROTTLE_MAX_DELAY = 8.0
AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
COOKIES_ENABLED = False

USER_AGENT = (
    "UniMapCondorDataIntake/0.1 "
    "(school-selection research; contact: configure-in-settings)"
)

ITEM_PIPELINES = {
    "unimap_intake.pipelines.IntakeNormalizePipeline": 300,
}

FEED_EXPORT_ENCODING = "utf-8"
FEEDS = {
    "output/%(name)s-%(time)s.jsonl": {
        "format": "jsonlines",
        "encoding": "utf-8",
        "overwrite": True,
    }
}
