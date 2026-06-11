# UniMap Condor

<p align="center">
  <img src="docs/assets/unimap-condor-logo-banner.png" alt="UniMap Condor" width="700">
</p>

UniMap Condor is an interactive university intelligence map. It combines ranking map exploration with open research, registry, and community-discovery links so students can compare universities without leaving the map too early.

The name comes from the condor: a large animal built for long-distance flight and wide-angle scanning.

## Features

- Interactive MapLibre map with OpenFreeMap styles.
- Ranking filters by source, year, and subject.
- Subject-strength mode for normalized subject signals.
- Search and point selection with a responsive details panel.
- University profile tabs:
  - Overview: city, country, establishment year, aliases, ROR/Wikidata/Wikipedia links.
  - Rankings: rank, subject, source attribution, subject-strength bars.
  - Research: OpenAlex works, citations, h-index, recent citedness, and topic signals.
  - Faculty: institution, faculty/school, department, lab, and program-level structure.
  - Recommendations: advisor-fit notes linked to the selected university, backed by Supabase with a local seed fallback.
  - Community: outbound Reddit and GTER search links.
- Personal preference profile entry for school-selection intent.
- No Google Places API dependency. Google Maps is provided as a user-controlled outbound link only.

## Data Sources

This project currently reads ranking data from the public API exposed by the referenced demonstration site:

- QS World University Rankings
- Times Higher Education
- ShanghaiRanking
- CSRankings

Additional open-data enrichment uses:

- [OpenFreeMap](https://openfreemap.org/) for map styles.
- [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors for map data.
- [OpenAlex](https://openalex.org/) for research metrics.
- [ROR](https://ror.org/) for research organization registry metadata.
- Wikidata/Wikipedia links when available through OpenAlex/ROR.

Ranking ownership remains with each original data provider. Check provider terms before public or commercial reuse.

## Quick Start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/
```

Build:

```bash
npm run build
```

## Supabase Advisor Data

The Faculty tab reads from Supabase when these variables are present:

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then apply the SQL files under `supabase/migrations`.

The schema is intentionally split into institutions, programs, faculty profiles, affiliations, program-fit notes, and sources. That keeps it flexible for later adding departments, tuition, application deadlines, emails, labs, publications, funding signals, and application-status fields without flattening everything into one brittle table.

If Supabase is not configured, the app falls back to the 15 Montreal advisor notes seeded from the local vault scan.

## Data Intake

The first Scrapy-based intake workflow lives under [tools/intake](./tools/intake).
It collects candidate faculty, program, tuition, and funding records into Supabase
staging tables as `draft` data. These records are meant for review before they
are used by the map or Fit Signals.

## Development Notes

The Vite dev server proxies external APIs to avoid browser CORS issues:

- `/api` -> `https://disc-unimap.uibk.ac.at`
- `/openalex` -> `https://api.openalex.org`
- `/ror` -> `https://api.ror.org`

For production, move these proxy routes behind your own backend or edge functions instead of calling third-party APIs directly from the browser.

## Community Links

The Community tab does not scrape Reddit or GTER content. It provides real outbound search links only. This keeps browsing fast and avoids copying community text without permission.

## Security

Never commit:

- Personal information
- API keys
- Tokens
- Passwords
- `.env` files
- Private data exports
- Raw third-party datasets unless their license explicitly allows redistribution

See [SECURITY.md](./SECURITY.md) for the full policy.

## Chinese Documentation

中文说明见 [README.zh-CN.md](./README.zh-CN.md)。

## License

MIT. See [LICENSE](./LICENSE).
