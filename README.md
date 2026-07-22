# Chess Training App

A full-stack chess training application with puzzle solving, game analysis, opening repertoire management, and study tools.

## Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4 |
| **Backend** | Python, FastAPI, SQLAlchemy, Alembic |
| **Shared** | `@chess-app/chess-domain` — TS types, pattern detection, phase & difficulty calculation |
| **Database** | PostgreSQL 16 (dev: SQLite) |
| **Cache** | Redis 7 |
| **Engine** | Stockfish (analysis, evaluation) |
| **Infra** | Docker Compose, nginx |

## Features

- **Puzzle solving** — tactical pattern recognition with themed puzzles
- **Game analysis** — import PGN, Stockfish evaluation, position explorer
- **Opening repertoire** — build and manage your opening book with studies
- **Study tools** — organised folders, resources, and learning paths
- **Play against engine** — play Stockfish at configurable difficulty
- **Bulk import** — import games from Lichess, Chess.com, or PGN files
- **Stats & progress tracking** — performance metrics over time
- **i18n** — Italian, English, Spanish, French
- **Monitoring** — OpenTelemetry, Prometheus metrics, structured logging

## Quick start

```bash
make dev
```

Starts all services with hot reload. App available at `http://localhost:5173`.

Individual services:

```bash
make dev-db        # PostgreSQL + Redis only
make dev-backend   # Backend only (requires DB)
make dev-frontend  # Frontend only
```

## Commands

```bash
make test          # Run all tests (backend + frontend)
make lint          # Run all linters (ruff + oxlint)
make typecheck     # mypy + tsc
make format        # ruff format + prettier
make db-migrate    # Run database migrations
make db-seed       # Seed development data
make db-reset      # Drop, migrate, seed
make build         # Build Docker images
make ci            # Full CI pipeline (lint → typecheck → test)
make clean         # Clean artifacts and caches
make shell-backend # Open shell in backend container
make logs          # Tail docker-compose logs
```

## Project structure

```
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── pages/       # Route pages (Home, Analysis, Puzzles, Studio, etc.)
│   │   ├── components/  # Reusable UI components
│   │   ├── stores/      # Zustand state
│   │   ├── api/         # API client (orval-generated)
│   │   ├── engine/      # Stockfish integration
│   │   ├── repertoire/  # Opening repertoire logic
│   │   ├── mocks/       # MSW handlers
│   │   └── utils/       # Helpers
│   └── tests/           # Playwright E2E tests
├── backend/             # Python FastAPI app
│   ├── app/
│   │   ├── routers/     # API endpoints
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic (analysis, engine, etc.)
│   │   └── middleware/   # Logging, CORS, rate limiting
│   └── tests/
├── packages/
│   └── chess-domain/    # Shared TS types and domain logic
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

## Environment variables

Key settings with their defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_PASSWORD` | `chess_password` | PostgreSQL password |
| `SECRET_KEY` | `dev-secret-change-in-production` | JWT signing key |
| `CORS_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Allowed origins |
| `DATABASE_URL` | `sqlite:///data/chess_trainer.db` | Database connection |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection |

See `backend/app/config.py` for the full list.
