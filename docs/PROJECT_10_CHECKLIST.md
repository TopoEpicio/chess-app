# Checklist Progetto 10/10 - Chess Training App

## 📋 Indice
1. [Testing & Quality Assurance](#1-testing--quality-assurance)
2. [Database & Migrazioni](#2-database--migrazioni)
3. [CI/CD & DevOps](#3-cicd--devops)
4. [Architettura & Codice](#4-architettura--codice)
5. [Sicurezza & Compliance](#5-sicurezza--compliance)
6. [Observability & Monitoring](#6-observability--monitoring)
7. [Documentazione & DX](#7-documentazione--dx)
8. [Performance & Scalabilità](#8-performance--scalabilità)
9. [Accessibilità & UX](#9-accessibilità--ux)
10. [Checklist Esecuzione](#10-checklist-esecuzione)

---

## 1. Testing & Quality Assurance

### 1.1 Backend Testing (Target: 80% coverage)
- [ ] **Setup pytest**
  - [ ] `pytest.ini` / `pyproject.toml` config
  - [ ] `conftest.py` con fixtures: `db_session`, `client`, `auth_headers`, `sample_puzzle`, `sample_repertoire`
  - [ ] Factory pattern per test data (`factory_boy` o `pytest-factoryboy`)

- [ ] **Unit Tests** (≥80% coverage)
  - [ ] `tests/unit/models/` - Test modelli SQLAlchemy (validazioni, relazioni, property)
  - [ ] `tests/unit/services/` - Test `puzzle_generator.py`, `pgn_import.py` (mock Stockfish)
  - [ ] `tests/unit/schemas/` - Validazione Pydantic (edge cases, validatori custom)
  - [ ] `tests/unit/utils/` - Utility functions

- [ ] **Integration Tests** (≥70% coverage)
  - [ ] `tests/integration/routers/` - Tutti i 6 router (puzzles, repertoire, openings, analysis, stats)
    - [ ] Happy path CRUD
    - [ ] Error cases (404, 422, 409, 500)
    - [ ] Auth/Authorization (se presente)
    - [ ] Pagination, filtering, sorting
  - [ ] `tests/integration/database/` - Transazioni, rollback, constraints DB

- [ ] **Contract Tests**
  - [ ] Schema validation response vs OpenAPI spec
  - [ ] Backward compatibility tests

- [ ] **E2E Tests** (Critical paths)
  - [ ] Import PGN → Analisi → Salvataggio repertoire
  - [ ] Risoluzione puzzle → Aggiornamento stats
  - [ ] Creazione repertoire → Quiz mode

- [ ] **Test Tooling**
  - [ ] `pytest-cov` + `coverage-badge` in README
  - [ ] `pytest-xdist` per parallelizzazione
  - [ ] `pytest-mock` / `respx` per mock HTTP
  - [ ] Testcontainers per Postgres integration tests (CI)

### 1.2 Frontend Testing (Target: 70% coverage)
- [ ] **Setup Vitest + React Testing Library**
  - [ ] `vitest.config.ts` con coverage, jsdom, globals
  - [ ] `setupTests.ts` con cleanup, mock MSW/Stockfish
  - [ ] Test utils: `renderWithProviders`, `mockStore`

- [ ] **Unit Tests Components**
  - [ ] `components/board/ChessBoard.tsx` - Interazioni, move handling
  - [ ] `components/repertoire/RepertoireTree.tsx` - Expand/collapse, selection
  - [ ] `components/puzzles/PuzzleSolver.tsx` - Move validation, feedback
  - [ ] `components/analysis/EducationalPanel.tsx` - Rendering spiegazioni
  - [ ] `stores/repertoireStore.ts` - Actions, selectors, persistence
  - [ ] `stores/puzzleStore.ts` - State transitions, persistence
  - [ ] `engine/useStockfish.ts` - Worker lifecycle, message handling
  - [ ] `utils/repertoireParser.ts` - PGN parsing edge cases

- [ ] **Integration Tests**
  - [ ] `pages/Analysis.tsx` - Full flow: load PGN → analyze → annotate
  - [ ] `pages/Repertoire.tsx` - Tree navigation, node editing, quiz mode
  - [ ] `pages/Puzzles.tsx` - Filter, solve streak, difficulty progression

- [ ] **E2E Tests (Playwright)**
  - [ ] `e2e/smoke.spec.ts` - Home → Analysis → Puzzles → Repertoire
  - [ ] `e2e/auth.spec.ts` - Login/Register (se auth presente)
  - [ ] `e2e/offline.spec.ts` - Service worker, offline mode
  - [ ] Visual regression (Chromatic/Playwright screenshot)

- [ ] **Test Tooling**
  - [ ] MSW (Mock Service Worker) per API mocking
  - [ ] `vitest-coverage-v8` + badge README
  - [ ] `eslint-plugin-testing-library`, `eslint-plugin-vitest`

### 1.3 Quality Gates
- [ ] **Pre-commit hooks** (Husky + lint-staged)
  - [ ] Backend: `ruff check`, `ruff format`, `mypy`, `pytest --co`
  - [ ] Frontend: `eslint`, `prettier`, `tsc --noEmit`, `vitest run`
- [ ] **PR Checks** (GitHub Actions)
  - [ ] Matrix test: Python 3.11/3.12, Node 18/20
  - [ ] Coverage gate: fail se < 70% (frontend) / 80% (backend)
  - [ ] Typecheck gate: `mypy --strict`, `tsc --noEmit`
  - [ ] Lint gate: zero warnings

---

## 2. Database & Migrazioni

### 2.1 Alembic Setup
- [ ] `alembic init alembic`
- [ ] `alembic/env.py` configurato per `app.models` + `target_metadata`
- [ ] `alembic.ini` con `sqlalchemy.url` da env var
- [ ] **Initial migration** - `alembic revision --autogenerate -m "init schema"`
- [ ] **Review migration** - Verifica indici, FK, constraint, enum types

### 2.2 Schema Management
- [ ] **Naming conventions** - `naming_convention` in `Base.metadata`
- [ ] **Indici strategici** - Query patterns: `puzzle.rating`, `repertoire.user_id`, `analysis.created_at`
- [ ] **Check constraints** - `rating BETWEEN 0 AND 3000`, `cp BETWEEN -30000 AND 30000`
- [ ] **Enum types** - `PuzzleTheme`, `RepertoireColor`, `AnalysisType` come `Enum` PG / `CHECK` SQLite

### 2.3 Seeding & Fixtures
- [ ] `alembic/versions/seed_data.py` - Puzzle themes, opening ECO codes, default repertoire
- [ ] `scripts/seed_dev.py` - Dati sviluppo (puzzle sample, repertoire demo)
- [ ] `scripts/seed_prod.py` - Solo reference data (ECO codes, temi)

### 2.4 Connection Pool & Performance
- [ ] `pool_pre_ping=True`, `pool_size`, `max_overflow` da env
- [ ] `poolclass=QueuePool` (prod) / `StaticPool` (test)
- [ ] Connection retry logic con `tenacity`

### 2.5 Backup & Restore
- [ ] `scripts/backup_db.sh` - `pg_dump` / `sqlite3 .dump`
- [ ] `scripts/restore_db.sh` - Point-in-time recovery docs
- [ ] Test restore mensile documentato

---

## 3. CI/CD & DevOps

### 3.1 Containerizzazione
- [ ] **Backend Dockerfile** - Multi-stage: builder (uv/pip) → runtime (python:3.12-slim)
  - [ ] Non-root user, `readonly` rootfs
  - [ ] Healthcheck endpoint `/health`
  - [ ] `.dockerignore` (escludi `__pycache__`, `.pytest_cache`, `tests`, `alembic`)
- [ ] **Frontend Dockerfile** - Multi-stage: builder (node:20) → nginx:alpine
  - [ ] `nginx.conf` con SPA fallback, gzip, caching headers
  - [ ] Build args per `VITE_API_URL`
- [ ] **docker-compose.yml** (dev)
  - [ ] `db` (postgres:16), `backend`, `frontend`, `redis` (cache/sessions)
  - [ ] `watch` mode per hot-reload
  - [ ] Profili: `dev`, `test`, `prod`
- [ ] **docker-compose.prod.yml**
  - [ ] Secrets da `.env.prod` / Docker secrets
  - [ ] Resource limits, restart policies
  - [ ] Reverse proxy (Traefik/Caddy) con TLS auto

### 3.2 CI Pipeline (GitHub Actions)
```yaml
# .github/workflows/ci.yml
jobs:
  backend:
    - lint: ruff check, mypy --strict
    - test: pytest -x --cov --cov-fail-under=80
    - build: docker build -t backend:${{ github.sha }}
    - scan: trivy fs --severity HIGH .
  frontend:
    - lint: eslint, prettier --check
    - typecheck: tsc --noEmit
    - test: vitest run --coverage
    - build: docker build -t frontend:${{ github.sha }}
    - scan: trivy fs --severity HIGH .
  e2e:
    - needs: [backend, frontend]
    - services: postgres, redis
    - playwright install-deps
    - playwright test
  deploy-staging:
    - needs: e2e
    - if: github.ref == 'refs/heads/main'
    - deploy to staging (kubectl/helm/docker-compose)
  deploy-prod:
    - needs: deploy-staging
    - environment: production
    - manual approval
    - blue-green / rolling deploy
```

### 3.3 Release Management
- [ ] **Conventional Commits** + `commitlint`
- [ ] **Changesets** o `semantic-release` per versioning automatico
- [ ] **CHANGELOG.md** auto-generato
- [ ] **Git tags** `v{major}.{minor}.{patch}`
- [ ] **Docker image tags** - `latest`, `v1.2.3`, `sha-abc123`

### 3.4 Environments
- [ ] **Local** - `docker-compose up` (hot reload)
- [ ] **Staging** - Mirror prod, dati anonimizzati, feature flags
- [ ] **Production** - HA, monitoring, backup verified

---

## 4. Architettura & Codice

### 4.1 Backend - Schemas Centralizzati
- [ ] Spostare tutti i modelli Pydantic in `app/schemas/`
  - [ ] `schemas/puzzle.py` - `PuzzleCreate`, `PuzzleRead`, `PuzzleFilter`
  - [ ] `schemas/repertoire.py` - `NodeCreate`, `TreeRead`, `QuizRequest`
  - [ ] `schemas/analysis.py` - `AnalysisRequest`, `EngineLine`, `CoachFeedback`
  - [ ] `schemas/stats.py` - `StatsSummary`, `StreakData`, `RatingProgress`
  - [ ] `schemas/common.py` - `PaginationParams`, `Page[T]`, `ErrorResponse`
- [ ] Router usano **solo** schemas per request/response
- [ ] `response_model_exclude_unset=True` di default

### 4.2 Backend - Error Handling & Validation
- [ ] **Exception handlers** globali in `main.py`
  - [ ] `RequestValidationError` → 422 strutturato
  - [ ] `SQLAlchemyError` → 500 con correlation ID
  - [ ] `HTTPException` custom per domain errors (404, 409, 422)
- [ ] **Pydantic validators** - `field_validator`, `model_validator` per regole dominio
- [ ] **Problem Details** (RFC 7807) per error responses

### 4.3 Backend - Servizi Esterni
- [ ] **Stockfish Service** - Wrapper async con pool workers
  - [ ] `StockfishPool` - Gestione processi/thread, health check
  - [ ] Timeout, retry, fallback depth
  - [ ] Cache analisi (Redis) con TTL
- [ ] **PGN Parser** - Robusto, gestisce varianti, commenti, NAG
- [ ] **Opening Book** - SQLite/CSV lookup ottimizzato (ECO codes)

### 4.4 Frontend - State Management
- [ ] **Zustand Middleware**
  - [ ] `persist` - IndexedDB (idb) per repertoire, puzzle progress
  - [ ] `devtools` - Solo dev
  - [ ] `immer` - Immutable updates ergonomiche
- [ ] **Store Separation** - `useRepertoireStore`, `usePuzzleStore`, `useAnalysisStore`, `useUIStore`
- [ ] **Selectors tipizzati** - `useRepertoireStore.use.nodes`, `usePuzzleStore.use.currentPuzzle`

### 4.5 Frontend - API Layer
- [ ] **TanStack Query (React Query)** - Sostituisci `api/client.ts` custom
  - [ ] Query keys factory
  - [ ] Invalidation patterns
  - [ ] Optimistic updates per mutazioni
  - [ ] Retry, staleTime, cacheTime configurati
- [ ] **OpenAPI Client** - Genera da `backend/openapi.json` con `openapi-typescript-codegen` / `orval`
  - [ ] Types sincronizzati backend↔frontend
  - [ ] Zero drift contract

### 4.6 Frontend - Componenti & Patterns
- [ ] **Design System Base** - `components/ui/` (Button, Input, Modal, Card, Toast, Tooltip)
  - [ ] Tailwind + Class Variance Authority (CVA)
  - [ ] Storybook per documentazione componenti
- [ ] **Compound Components** - `RepertoireTree`, `PuzzleSolver` con context
- [ ] **Custom Hooks** - `useStockfish`, `useRepertoire`, `usePuzzleSession`, `useAnalysis`
- [ ] **Error Boundaries** - Per route e componenti critici (scacchiera, engine)
- [ ] **Suspense + Lazy Loading** - Code splitting per route (`Repertoire`, `Puzzles`, `Analysis`)

### 4.7 Type Safety End-to-End
- [ ] `tsconfig.json` - `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- [ ] `zod` schemas condivisi (backend genera, frontend consuma) o `ts-rest`
- [ ] Type tests (`tsd`, `expect-type`) per tipi critici

---

## 5. Sicurezza & Compliance

### 5.1 Autenticazione & Autorizzazione
- [ ] **Auth** - JWT (access + refresh) o Session + CSRF
  - [ ] `fastapi-users` / `authlib` backend
  - [ ] `next-auth` / `react-query` + httpOnly cookies frontend
- [ ] **RBAC** - Ruoli: `user`, `coach`, `admin`
- [ ] **Row Level Security** - Policy per repertoire, games, analysis (se multi-tenant)

### 5.2 Protezione Dati
- [ ] **HTTPS Only** - HSTS, Secure cookies
- [ ] **CSP** - `Content-Security-Policy` header (nonce per inline scripts)
- [ ] **Rate Limiting** - `slowapi` / Redis token bucket (auth, analysis, puzzle)
- [ ] **Input Sanitization** - PGN parser sicuro (no XXE, no regex DoS)
- [ ] **Secrets Management** - `.env` solo dev, Vault/Doppler/1Password prod

### 5.3 Dependency Security
- [ ] **Dependabot / Renovate** - PR automatici per CVE
- [ ] `pip-audit` / `npm audit` in CI
- [ ] `trivy` / `grype` container scanning
- [ ] `SBOM` generazione (Syft) per compliance

### 5.4 Privacy & GDPR
- [ ] **Data Export** - GDPR Art. 20 (JSON export utente)
- [ ] **Data Deletion** - GDPR Art. 17 (account deletion cascade)
- [ ] **Consent Banner** - Analytics/cookies (se usati)
- [ ] **Data Retention Policy** - Documentata, job cleanup automatico

---

## 6. Observability & Monitoring

### 6.1 Logging Strutturato
- [ ] **Backend** - `structlog` + `orjson` → JSON stdout
  - [ ] Correlation ID (request-id) propagato
  - [ ] Livelli: `debug`, `info`, `warning`, `error`, `critical`
  - [ ] Campi standard: `timestamp`, `level`, `logger`, `message`, `request_id`, `user_id`, `duration_ms`
- [ ] **Frontend** - `pino` / `loglevel` → batched endpoint `/api/logs` (sampling)

### 6.2 Metriche (Prometheus)
- [ ] **Backend** - `prometheus-fastapi-instrumentator`
  - [ ] HTTP: `requests_total`, `request_duration_seconds`, `request_size_bytes`
  - [ ] Business: `puzzles_solved_total`, `repertoire_nodes_created`, `analysis_requests_total`
  - [ ] DB: `db_query_duration`, `db_pool_usage`
  - [ ] Engine: `stockfish_eval_duration`, `stockfish_pool_utilization`
- [ ] **Frontend** - Web Vitals (LCP, FID, CLS, TTFB) + custom events

### 6.3 Tracing Distribuito
- [ ] **OpenTelemetry** - Auto-instrumentation FastAPI + React
  - [ ] Trace: HTTP request → DB query → Stockfish call
  - [ ] Exporter: OTLP → Jaeger / Tempo / Datadog
  - [ ] Frontend: `web-vitals` + `fetch`/`xhr` instrumentation

### 6.4 Alerting
- [ ] **Regole PrometheusAlert** - Error rate > 5%, p99 latency > 2s, DB pool exhausted, Stockfish pool empty
- [ ] **Notification** - PagerDuty / Opsgenie / Slack / Email
- [ ] **Runbook** - Link da alert a runbook markdown

### 6.5 Health Checks
- [ ] `GET /health` - Liveness (processo vivo)
- [ ] `GET /ready` - Readiness (DB connesso, Stockfish pool OK, Redis OK)
- [ ] `GET /health/deep` - Query test, engine test move

---

## 7. Documentazione & Developer Experience

### 7.1 Documentazione Tecnica
- [ ] **ARCHITECTURE.md** - Diagrammi (Mermaid): architettura, data flow, deployment
- [ ] **API Docs** - OpenAPI/Swagger auto da FastAPI (`/docs`, `/redoc`)
  - [ ] Esempi request/response per ogni endpoint
  - [ ] Error codes documentati
- [ ] **ADR** - `docs/adr/001-use-fastapi.md`, `002-zustand-over-redux.md`, ecc.
- [ ] **Runbooks** - `docs/runbooks/` (deploy, rollback, DB migrate, incident response)

### 7.2 Documentazione Utente
- [ ] **README.md** - Quickstart, stack, comandi dev, link docs
- [ ] **CONTRIBUTING.md** - Workflow, commit style, PR template, code review checklist
- [ ] **CHANGELOG.md** - Keep a Changelog format
- [ ] **User Guide** - `/docs/user/` (MkDocs/GitBook) - Tutorial puzzle, repertoire, analysis

### 7.3 DX Tooling
- [ ] **Makefile / Taskfile.yml** - `make dev`, `make test`, `make lint`, `make db-migrate`, `make db-seed`
- [ ] **VS Code Config** - `.vscode/settings.json`, `extensions.json`, `launch.json` (debug backend+frontend)
- [ ] **Dev Container** - `.devcontainer/devcontainer.json` (GitHub Codespaces ready)
- [ ] **Scripts Utili** - `scripts/` (db reset, seed, generate types, lint fix)

---

## 8. Performance & Scalabilità

### 8.1 Backend
- [ ] **Query Optimization**
  - [ ] `selectinload` / `joinedload` per relazioni N+1
  - [ ] Indici composti per query frequenti
  - [ ] Paginazione cursor-based (keyset) per liste grandi
- [ ] **Caching** - Redis
  - [ ] Opening book lookup (TTL 24h)
  - [ ] Puzzle daily set (TTL 12h)
  - [ ] Analysis cache (TTL 1h, key: fen+depth+multipv)
  - [ ] User stats (invalidate on write)
- [ ] **Background Jobs** - `arq` / `celery` + Redis
  - [ ] PGN import async (chunked)
  - [ ] Puzzle generation batch
  - [ ] Daily stats aggregation
  - [ ] Email notifications
- [ ] **Connection Pooling** - PgBouncer (prod)
- [ ] **Static Assets** - CDN (Cloudflare R2 / S3 + CloudFront) per frontend build

### 8.2 Frontend
- [ ] **Bundle Optimization**
  - [ ] Code splitting per route (`React.lazy` + `Suspense`)
  - [ ] Tree shaking verificato (`sideEffects: false` in package.json)
  - [ ] Chunk splitting: `vendor`, `engine`, `charts`, `ui`
  - [ ] Compression: `gzip` + `brotli` (nginx)
- [ ] **Stockfish WASM**
  - [ ] Lazy load worker (solo quando serve)
  - [ ] SharedWorker per tab multiple
  - [ ] Fallback depth progressivo
- [ ] **Virtualizzazione** - `react-window` / `tanstack-virtual` per alberi repertoire grandi, lista puzzle
- [ ] **Memoizzazione** - `React.memo`, `useMemo`, `useCallback` dove misurato utile
- [ ] **Image Optimization** - WebP/AVIF, responsive images, lazy loading

### 8.3 Database
- [ ] **Read Replicas** - Separazione read/write (se scale)
- [ ] **Partitioning** - `analysis` table per mese (se >100M righe)
- [ ] **Archiving** - Job mensile sposta vecchie analysis in tabella cold storage

---

## 9. Accessibilità & UX

### 9.1 Accessibilità (WCAG 2.1 AA)
- [ ] **Semantic HTML** - `<main>`, `<section>`, `<article>`, heading hierarchy
- [ ] **Keyboard Navigation** - Tutti i componenti interattivi (scacchiera, albero, modal)
  - [ ] Scacchiera: frecce per muovere, Enter/Space per selezionare, Escape per annullare
  - [ ] Albero repertoire: frecce su/giù, destra/sinistra expand/collapse
- [ ] **ARIA** - Labels, roles, live regions per annunci (mosse, valutazioni, errori)
- [ ] **Color Contrast** - Tema chiaro/scuro, ratio ≥ 4.5:1
- [ ] **Focus Management** - Visible focus ring, trap focus in modal, restore focus on close
- [ ] **Screen Reader** - Test con NVDA/VoiceOver: annunci mosse, eval bar, coach feedback
- [ ] **Reduced Motion** - `@media (prefers-reduced-motion)` disabilita animazioni scacchiera

### 9.2 UX & Polish
- [ ] **Loading States** - Skeleton loaders, progressive enhancement
- [ ] **Empty States** - Illustrazioni + call-to-action (no repertoire → crea, no puzzle → gioca)
- [ ] **Error States** - User-friendly, retry action, contact support link
- [ ] **Onboarding** - Tour guidato prima volta (Shepherd.js / Intro.js)
- [ ] **Keyboard Shortcuts** - Cheatsheet (?, `h`), customizzabili
- [ ] **Offline Support** - Service Worker (Workbox) - cache statico + API GET, queue mutazioni
- [ ] **PWA** - Manifest, install prompt, icon maskable

---

## 10. Checklist Esecuzione

### Sprint 0 - Foundation (Settimana 1-2)
- [ ] `.gitignore` corretto + pulizia repo history (BFG/Reviso se necessario)
- [ ] `docker-compose.yml` dev + `Dockerfile` backend/frontend
- [ ] `Makefile` / `Taskfile.yml` comandi base
- [ ] `pre-commit` + `husky` + `lint-staged`
- [ ] CI pipeline base (lint + typecheck + test smoke)
- [ ] Alembic init + migration iniziale
- [ ] Schemas Pydantic centralizzati
- [ ] TanStack Query + OpenAPI client gen setup

### Sprint 1 - Testing Backend (Settimana 3-4)
- [ ] Pytest setup + fixtures + factory
- [ ] Unit tests models + services (≥80%)
- [ ] Integration tests all routers (≥70%)
- [ ] Coverage gate in CI

### Sprint 2 - Testing Frontend (Settimana 5-6)
- [ ] Vitest + RTL setup + MSW
- [ ] Unit tests stores + hooks + utils (≥70%)
- [ ] Component tests critical paths
- [ ] Playwright E2E smoke suite
- [ ] Visual regression setup

### Sprint 3 - Auth & Security (Settimana 7-8)
- [ ] Auth system (JWT/Session)
- [ ] RBAC + RLS
- [ ] Rate limiting, CSP, security headers
- [ ] Dependency scanning in CI
- [ ] Secrets management docs

### Sprint 4 - Observability (Settimana 9-10)
- [ ] Structured logging + correlation ID
- [ ] Prometheus metrics + Grafana dashboards
- [ ] OpenTelemetry tracing
- [ ] Alert rules + runbooks
- [ ] Health checks completi

### Sprint 5 - Performance & Polish (Settimana 11-12)
- [ ] Query optimization + indici
- [ ] Redis caching layer
- [ ] Background jobs (arq/celery)
- [ ] Frontend bundle optimization
- [ ] Accessibility audit + fix
- [ ] PWA + offline support

### Sprint 6 - Docs & Release (Settimana 13-14)
- [ ] ARCHITECTURE.md + ADR
- [ ] API docs complete + esempi
- [ ] User guide + onboarding
- [ ] CHANGELOG + semantic release
- [ ] Staging deploy + load test (k6/Locust)
- [ ] Production deploy + monitoring verification

---

## 📊 Metriche di Successo (Definition of Done 10/10)

| Metrica | Target |
|---------|--------|
| Test Coverage Backend | ≥ 80% |
| Test Coverage Frontend | ≥ 70% |
| E2E Critical Paths | 100% coperti |
| TypeScript Strict | Zero errori |
| Mypy Strict | Zero errori |
| Lint (ruff/eslint) | Zero warning |
| Build Time (CI) | < 10 min |
| Deploy Frequency | On-demand / daily |
| MTTR (Mean Time To Recovery) | < 30 min |
| Availability (SLO) | 99.9% |
| p95 API Latency | < 300ms |
| Lighthouse Score | ≥ 95 (Perf, A11y, Best Practices, SEO) |
| Bundle Size (gzipped) | < 150KB initial JS |
| Security Scan (Critical/High) | 0 vulnerabilities |

---

## 🎯 Prossimo Passo Consigliato

> **Inizia da Sprint 0** - Foundation. Una volta che `docker-compose up` porta su tutto (db, backend, frontend) con hot-reload, e `make test` passa in CI, hai la base solida per tutto il resto.