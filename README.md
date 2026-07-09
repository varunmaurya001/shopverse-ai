# ShopVerse AI — Backend

NestJS + TypeScript. Organized as a professional layered architecture:

```
src/
  controllers/   HTTP layer only — validates input, calls a service, returns its result
  services/      All business logic + database access
  routes/        NestJS modules — wire a controller to its service(s) and register it on the app
  middlewares/   Guards, decorators, interceptors, exception filters, JWT strategy
  config/        Database (Kysely/pg) + Redis connection setup, bundled CommonModule
  models/        Kysely table type definitions (database.model.ts) + request DTOs (models/dto/)
  adapters/      Pluggable data-source adapters for the live search/ingestion pipeline
  utils/         Small pure helpers (slugify, seeded random, currency formatting)
  app.module.ts  Root module — imports every routes/*.routes.ts
  main.ts        Bootstrap: Swagger, security headers, global pipes/filters
```

Each domain (auth, products, search, reviews, ...) has exactly one file in each
of `controllers/`, `services/`, and `routes/` — e.g. `products.controller.ts` /
`products.service.ts` / `products.routes.ts`. This keeps every layer swappable:
move a service to its own microservice later without touching its controller's
HTTP contract.

## Stack actually running

| Layer | Choice | Notes |
|---|---|---|
| Framework | NestJS (TypeScript) | |
| DB | PostgreSQL 16 | schema in `prisma/schema.sql` |
| Query layer | **Kysely** + `pg`, not Prisma | Prisma's query-engine binaries download from `binaries.prisma.sh` — unreachable in sandboxed/restricted networks. Kysely is a pure TS query builder, no native download. `prisma/schema.prisma` is kept as the canonical schema reference/diagram source. |
| Cache / queue | Redis (ioredis) + BullMQ installed | |
| Auth | JWT (real) + bcrypt + OTP (real flow, SMS delivery stubbed) + OAuth (wired, needs provider credentials) | |
| Docs | Swagger/OpenAPI at `/api/docs` | |
| Search | Postgres trigram fuzzy search (`pg_trgm`) standing in for Elasticsearch | |
| Live product data | On-demand aggregator (`services/aggregator.service.ts` + `adapters/`) | |

## Run it

```bash
npm install
cp .env.example .env               # then fill in DATABASE_URL / REDIS_HOST / JWT_SECRET etc.
psql "$DATABASE_URL" -f prisma/schema.sql     # first time only — creates all tables
npx ts-node prisma/seed.ts                     # optional demo catalog
npx ts-node scripts/fixture-store-server.ts &  # optional: local scraper test target
npm run build
node dist/src/main.js
```

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`
- Admin login (from seed): `admin@shopverse.ai` / `Admin@123`
- Demo user (from seed): `demo@shopverse.ai` / `Demo@1234`

## The "search bar" requirement — how it actually works

`GET /api/v1/search/live?q=<query>` fetches data for **only that query**, from
each configured store adapter, concurrently:

1. Results are persisted tagged with `sourceQuery = <that query>` — a fresh
   search **replaces** the previous listings for that query rather than
   accumulating unrelated rows.
2. The response's `listings` array contains **only** what was just fetched —
   never a mix of unrelated catalog products.
3. A second call for the same query within 10 minutes is served from Postgres
   (no re-fetch); `POST /search/live/refresh?q=...` forces a fresh fetch.
4. The response includes a `sources[]` array reporting per-store status
   (`ok` / `skipped` / `error` + reason) — nothing is silently faked.

### The three source types (`src/adapters/`)

| Adapter | Mode | Status without extra setup |
|---|---|---|
| `AmazonApiAdapter` | official API (PA-API 5.0, real SigV4 request signing) | Skipped — needs a real Amazon Associates PA-API key/secret/partner tag in `.env`. |
| `FlipkartApiAdapter` | official API (Flipkart Affiliate API) | Skipped — needs a real Flipkart affiliate ID/token. |
| `GenericScraperAdapter` (Croma, Tata Cliq configs) | HTTP fetch + Cheerio HTML parsing | Configured with real selectors, `reachable: false` by default — flip to `true` once deployed somewhere with legitimate network access + a data agreement with that site. |
| `GenericScraperAdapter` (Fixture Demo Store) | same scraper code, pointed at `scripts/fixture-store-server.ts` | Live — proves the fetch+parse pipeline end to end against real (if synthetic) HTML. |
| `AiFallbackExtractor` | Claude API (`api.anthropic.com`) | Real code path: if a scraper's selectors return zero results against non-empty HTML, this asks Claude to extract `{title, price, url}` directly. Needs `ANTHROPIC_API_KEY`. |

For a JS-rendered storefront, swap `GenericScraperAdapter`'s plain `fetch()`
for a headless-browser fetch (Playwright/Puppeteer) — the extraction logic
and everything downstream (persistence, freshness, comparison) stays the same.

## Future features — where they plug in

| Feature | Where it goes |
|---|---|
| Real affiliate APIs | `src/adapters/official-api.adapters.ts` — fill in `.env` credentials |
| More scraped stores | `src/adapters/scraper.adapter.ts` — add a config entry with selectors |
| Elasticsearch/OpenSearch | `src/services/search.service.ts` — same method signatures, swap the query implementation |
| Background jobs / queues | BullMQ + Redis are already installed (`bullmq`, `ioredis`) — add a `src/queues/` folder with processors |
| Admin dashboard UI | Backend already exposes everything under `/api/v1/admin/*` — build any frontend against it |
| Caching | `src/services/cache.service.ts` — generic get/set/del + pattern delete, already used by products/admin |
| Horizontal scaling | Stateless app (JWT, no server-side sessions) — safe to run multiple instances behind a load balancer |

## What's real vs. documented-as-out-of-scope

- **Fully real, running, tested end-to-end:** auth (JWT/bcrypt/OTP), RBAC, rate
  limiting, product/category/brand CRUD, price history, price-alert cron +
  notifications, recommendations, review sentiment + fake-review heuristics,
  coupons, wishlist, admin dashboard/audit log/cache flush, analytics, the
  on-demand live-search aggregator, Swagger docs, health checks.
- **Real code, inactive without credentials you'd add yourself:** Google/GitHub/Apple
  OAuth, Amazon/Flipkart official APIs, email/SMS/WhatsApp delivery, Claude-backed
  AI chat/extraction.
- **Explicitly not attempted:** Kubernetes/Terraform/multi-cloud deployment,
  Kafka/ClickHouse/TimescaleDB as separate services, a distributed crawler
  fleet, real payment processing.
