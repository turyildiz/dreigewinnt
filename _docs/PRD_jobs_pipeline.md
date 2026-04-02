# PRD: Automated Jobs Pipeline — Dreigewinnt.com

## Overview

Automated daily pipeline that ingests job listings from multiple sources, deduplicates them, and populates the `jobs` table in the Dreigewinnt Supabase database. The pipeline runs as a standalone Node.js/Python script on the VPS, triggered by cron.

**Goal:** Keep /jobs populated with fresh, relevant local job listings with zero manual effort.

---

## Target Locations

| Town | PLZ | Notes |
|------|-----|-------|
| Rüsselsheim | 65428 | Largest town, Opel/Stellantis HQ |
| Kelsterbach | 65451 | Adjacent to FRA airport |
| Raunheim | 65479 | Adjacent to FRA airport |
| Frankfurt Airport (FRA) | 60549 | Include explicitly — biggest employer in region |

Search radius: 5 km from each PLZ centroid (overlapping is fine — deduplication handles it).

---

## Database Target

**Supabase project:** `jhsvcmrdzwtjdbvglnjs`
**Table:** `jobs`
**Connection:** Use `SUPABASE_SERVICE_ROLE_KEY` from environment (never the anon key for writes).

### jobs table schema

```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug            text UNIQUE NOT NULL          -- generated: slugify(title + company + timestamp)
title           text NOT NULL
description     text
company_name    text NOT NULL
town            text                          -- values: ruesselsheim | kelsterbach | raunheim | null
address         text
job_type        text                          -- fulltime | parttime | minijob | apprenticeship | internship | freelance
category        text
salary_range    text
contact_email   text
contact_phone   text
website_url     text                          -- canonical link to original listing
image_url       text
business_id     uuid REFERENCES businesses(id)  -- nullable, link if company matches a known business
status          text DEFAULT 'active'         -- active | expired | rejected
is_featured     boolean DEFAULT false
featured_until  timestamptz
stripe_payment_id text
expires_at      timestamptz                   -- set from source; default now() + 30 days
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

**Deduplication key:** `(company_name, title, town)` — if a combination already exists with status='active', skip the insert (don't update, don't duplicate).

**Source tracking:** Add a `source` text column and `external_id` text column if not already present. This allows re-runs to skip already-imported listings.

```sql
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS external_id text;
CREATE UNIQUE INDEX IF NOT EXISTS jobs_source_external_id_idx ON jobs(source, external_id) WHERE external_id IS NOT NULL;
```

---

## Data Sources

### Source 1: Bundesagentur für Arbeit (BA) API ⭐ Priority 1

**Type:** Official REST API — no scraping, no auth required
**Coverage:** Every employer in Germany who reports to the Arbeitsamt — massive coverage
**Rate limit:** None documented, be polite (1 req/sec)

**Endpoint:**
```
GET https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v4/jobs
```

**Key query params:**
```
was=          (job title/keyword — leave empty for all)
wo=           (location: "Rüsselsheim", "Kelsterbach", "Raunheim", "Frankfurt Flughafen")
umkreis=5     (radius in km)
angebotsart=1 (1=jobs, 4=Ausbildung — run twice)
size=100      (results per page)
page=0        (0-indexed)
```

**Required headers:**
```
X-API-Key: jobboerse-jobsuche-v1    (static key, publicly documented)
```

**Response fields to map:**
```json
{
  "stellenangebote": [{
    "refnr": "...",           → external_id
    "titel": "...",           → title
    "beruf": "...",           → category
    "arbeitgeber": "...",     → company_name
    "arbeitsort": {
      "ort": "...",           → town (map to ruesselsheim/kelsterbach/raunheim/null)
      "strasse": "...",       → address
      "plz": "..."
    },
    "eintrittsdatum": "...",  → use as context, not expires_at
    "aktuelleVeroeffentlichungsdatum": "...",
    "modifikationsTimestamp": "...",
    "refnr": "..."            → external_id, also build website_url:
  }]
}
```

**Website URL pattern:**
`https://www.arbeitsagentur.de/jobsuche/jobdetail/{refnr}`

**Pagination:** Check `maxErgebnisse` in response, paginate with `page` param until all fetched.

**Run for each combination:**
- 4 locations × 2 angebotsart (jobs + Ausbildung) = 8 API calls per run

---

### Source 2: Kleinanzeigen.de ⭐ Priority 2

**Type:** HTML scraping
**URL pattern:**
```
https://www.kleinanzeigen.de/s-jobs/{town}/k0
```

**Specific search URLs:**
```
https://www.kleinanzeigen.de/s-jobs/ruesselsheim/k0
https://www.kleinanzeigen.de/s-jobs/kelsterbach/k0
https://www.kleinanzeigen.de/s-jobs/raunheim/k0
https://www.kleinanzeigen.de/s-jobs/frankfurt-flughafen/k0
https://www.kleinanzeigen.de/s-jobs/ruesselsheim+kelsterbach+raunheim/k0
```

**Scraping approach:**
- Use `playwright` (headless Chromium) — Kleinanzeigen uses JS rendering
- Alternatively try `fetch` first with a desktop `User-Agent` and parse with `cheerio` — may work for listings page

**Selectors (verify against live HTML):**
- Listing container: `article[data-adid]` or `li.aditem`
- Ad ID: `data-adid` attribute → `external_id`
- Title: `.ellipsis` or `h2.text-module-begin a`
- Company/poster: `.aditem-addon` or `.username`
- Location: `.aditem-addon--location`
- Date posted: `time[datetime]`
- Link: `a.ellipsis[href]` → prepend `https://www.kleinanzeigen.de`

**Detail page:** For each listing, optionally fetch detail page for full description and contact info. Throttle to 1 req/2sec.

**Rate limiting:** Add 2–3 second delay between requests. Rotate User-Agent strings. Do NOT hammer — max 50 listings per town per run.

**What Kleinanzeigen typically has:**
Local SME jobs, gastro/hotel jobs, minijobs, cleaning/security — complements BA which leans corporate.

---

### Source 3: Fraport AG (Frankfurt Airport) ⭐ Priority 3

**Type:** HTML scraping
**Careers page:** `https://karriere.fraport.de/jobs`
**Why:** ~80,000 employees, largest single employer in the region, constant hiring

**Scraping approach:**
- Fraport uses a custom careers portal (likely SAP SuccessFactors or Taleo)
- Load page with `playwright` → look for job listing items
- Filter for Kelsterbach/Raunheim area jobs (most Fraport jobs are at FRA terminal area, PLZ 60549)

**Fallback:** If direct scraping is blocked, use BA API with `arbeitgeber=Fraport` filter parameter (BA API supports employer search).

**town mapping:** Map Fraport jobs to `null` or a new town value `flughafen` — or set `address = "Frankfurt Airport (FRA), 60549 Frankfurt"` and `town = null`.

---

### Source 4: Stellantis / Opel Rüsselsheim

**Type:** HTML scraping
**Careers page:** `https://www.stellantis.com/de/karriere/stellenangebote` (filter: Rüsselsheim)
**Also check:** `https://career.opel.com` (may redirect to Stellantis)

**Approach:**
- Stellantis uses Workday — URL pattern typically:
  `https://stellantis.wd3.myworkdayjobs.com/de-DE/Stellantis_Careers?q=&locations=...`
- Workday has a semi-public JSON API: POST to `/{tenant}/jobs` endpoint
- Alternatively use BA API: filter by `arbeitgeber=Stellantis` or `arbeitgeber=Adam Opel`

**town mapping:** `ruesselsheim`

---

### Source 5: Klinikum Rüsselsheim / Gesundheit Rhein-Main

**Type:** HTML scraping
**Careers page:** `https://www.grm.de/karriere/stellenangebote`
**Why:** Hospital is a major employer, constant nursing/medical/admin hiring

**Approach:** Standard HTML scraping with `cheerio` — hospital sites rarely use heavy JS.

**town mapping:** `ruesselsheim`

---

### Source 6: Grohe AG

**Type:** HTML scraping
**Careers page:** `https://www.grohe.com/de_de/info/stellenangebote.html` or Workday portal
**Why:** Large manufacturing employer, Werk in Hemer but significant regional presence

**Note:** Lower priority — only include if Rüsselsheim/region jobs appear.

---

## Pipeline Architecture

### Tech Stack (recommendation)

```
Node.js (TypeScript) or Python 3.11+
playwright (for JS-rendered pages)
cheerio (for static HTML parsing)
@supabase/supabase-js (for DB writes)
node-cron or system cron (scheduling)
```

### File Structure

```
jobs-pipeline/
  src/
    sources/
      arbeitsagentur.ts    # Source 1
      kleinanzeigen.ts     # Source 2
      fraport.ts           # Source 3
      stellantis.ts        # Source 4
      klinikum.ts          # Source 5
    lib/
      supabase.ts          # DB client
      dedup.ts             # Deduplication logic
      slugify.ts           # Slug generation
      townmap.ts           # Town name → DB enum mapping
    index.ts               # Main runner
  .env
  package.json
  crontab (runs daily at 06:00 UTC)
```

### Main Runner Flow

```
for each source:
  1. fetch raw listings (API call or scrape)
  2. normalize to JobRecord shape
  3. for each job:
     a. check if (source, external_id) already exists → skip if yes
     b. check if (company_name, title, town) already exists with status=active → skip if yes
     c. map town string to DB enum value
     d. generate slug
     e. set expires_at = now() + 30 days (override with source value if available)
     f. insert into jobs table with status='active'
  4. log: X new, Y skipped, Z errors

expire old jobs:
  UPDATE jobs SET status='expired'
  WHERE expires_at < now() AND status='active' AND source IS NOT NULL
  (never auto-expire manually entered jobs where source IS NULL)
```

### JobRecord shape (normalized intermediate)

```typescript
interface JobRecord {
  external_id: string;
  source: string;            // 'arbeitsagentur' | 'kleinanzeigen' | 'fraport' | ...
  title: string;
  company_name: string;
  description?: string;
  town_raw: string;          // raw string before mapping
  town?: 'ruesselsheim' | 'kelsterbach' | 'raunheim' | null;
  address?: string;
  job_type?: 'fulltime' | 'parttime' | 'minijob' | 'apprenticeship' | 'internship' | 'freelance';
  category?: string;
  salary_range?: string;
  contact_email?: string;
  contact_phone?: string;
  website_url: string;       // canonical link to original listing
  expires_at?: Date;
}
```

### Town Mapping Rules

```
"Rüsselsheim"           → ruesselsheim
"Rüsselsheim am Main"   → ruesselsheim
"Kelsterbach"           → kelsterbach
"Raunheim"              → raunheim
"Frankfurt Flughafen"   → null (set address = "Frankfurt Airport (FRA)")
"Frankfurt"             → null (only include if within 5km radius filter)
anything else           → null
```

---

## Environment Variables

```env
SUPABASE_URL=https://jhsvcmrdzwtjdbvglnjs.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
BA_API_KEY=jobboerse-jobsuche-v1
PIPELINE_LOG_LEVEL=info
```

---

## Cron Schedule

```cron
0 5 * * *   /home/jobs-pipeline/run.sh >> /var/log/jobs-pipeline.log 2>&1
```

Run at 05:00 UTC daily (07:00 CEST). Fresh listings every morning.

---

## Error Handling & Logging

- Each source runs independently — one failure does not abort the others
- Log per-source: fetched count, inserted count, skipped count, error count
- On HTTP error: retry once after 5s, then log and continue
- On DB error: log full error with job data, continue
- Send a daily summary to Telegram chat `250412368` via Bot API:

```
📋 Jobs Pipeline — 02.04.2026 05:00
✅ Arbeitsagentur: 23 neu, 145 übersprungen
✅ Kleinanzeigen: 4 neu, 12 übersprungen
✅ Fraport: 8 neu, 34 übersprungen
⚠️ Stellantis: 0 gefunden (Seite nicht erreichbar)
🗑️ 5 abgelaufene Stellen entfernt
```

Bot token: `8613488534:AAF-PkY3y2-9Av6lbV11rfN73kOlo5ZvIKw`
Chat ID: `250412368`

---

## Out of Scope

- Paying for API access / commercial data feeds
- Scraping Indeed, StepStone, LinkedIn (aggressive anti-scraping, legal grey area)
- User-submitted jobs (handled separately via admin panel)
- Job alert emails / notifications to users
- AI rewriting of job descriptions (keep original text)

---

## Acceptance Criteria

1. Pipeline runs without manual intervention
2. No duplicate listings (same job at same company in same town)
3. Manually created jobs (source IS NULL) are never auto-expired or modified
4. Each source failure is isolated — others continue
5. Daily Telegram summary message is sent
6. Listings expire after 30 days unless source provides earlier date
7. /jobs page shows results within hours of first run
