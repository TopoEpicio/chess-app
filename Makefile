# Chess Training App - Makefile
# Usage: make <target>

.PHONY: help dev build test lint typecheck format clean db-migrate db-seed db-reset logs shell-backend shell-frontend shell-db generate-api ci

# Default target
help:
	@echo "Chess Training App - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Start all services with docker-compose (hot reload)"
	@echo "  make dev-backend   - Start only backend with hot reload"
	@echo "  make dev-frontend  - Start only frontend with hot reload"
	@echo "  make dev-db        - Start only database and Redis"
	@echo ""
	@echo "Testing:"
	@echo "  make test          - Run all tests (backend + frontend)"
	@echo "  make test-backend  - Run backend tests only"
	@echo "  make test-frontend - Run frontend tests only"
	@echo "  make test-e2e      - Run E2E tests"
	@echo "  make test-coverage - Run tests with coverage report"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          - Run all linters"
	@echo "  make lint-backend  - Run backend linter (ruff)"
	@echo "  make lint-frontend - Run frontend linter (oxlint)"
	@echo "  make format        - Format code (ruff format + prettier)"
	@echo "  make typecheck     - Run type checkers (mypy + tsc)"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-migrate-create - Create new migration (usage: make db-migrate-create MSG='add column')"
	@echo "  make db-seed       - Seed development data"
	@echo "  make db-reset      - Reset database (drop + migrate + seed)"
	@echo "  make db-shell      - Open PostgreSQL shell"
	@echo ""
	@echo "Build:"
	@echo "  make build         - Build all Docker images"
	@echo "  make build-backend - Build backend image"
	@echo "  make build-frontend - Build frontend image"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean         - Clean build artifacts and caches"
	@echo "  make logs          - Show docker-compose logs"
	@echo "  make logs-backend  - Show backend logs"
	@echo "  make logs-frontend - Show frontend logs"
	@echo "  make logs-db       - Show database logs"
	@echo "  make shell-backend - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo "  make shell-db      - Open PostgreSQL shell"
	@echo "  make generate-api  - Generate API client from OpenAPI spec"
	@echo "  make ci            - Run full CI pipeline locally"

# Development
dev:
	docker-compose up --build

dev-backend:
	docker-compose up --build backend

dev-frontend:
	docker-compose up --build frontend

dev-db:
	docker-compose up -d db redis

# Testing
test: test-backend test-frontend

test-backend:
	docker-compose --profile test run --rm backend pytest -v --cov=app --cov-fail-under=80

test-frontend:
	docker-compose --profile test run --rm frontend npm run test:coverage

test-e2e:
	docker-compose --profile test run --rm frontend npm run e2e

test-coverage:
	@echo "=== Backend Coverage ==="
	@docker-compose --profile test run --rm backend pytest --cov=app --cov-report=term-missing
	@echo ""
	@echo "=== Frontend Coverage ==="
	@docker-compose --profile test run --rm frontend npm run test:coverage

# Code Quality
lint: lint-backend lint-frontend

lint-backend:
	docker-compose run --rm backend ruff check app tests

lint-frontend:
	docker-compose run --rm frontend npm run lint

format:
	docker-compose run --rm backend ruff format app tests
	docker-compose run --rm frontend npx prettier --write src

typecheck:
	docker-compose run --rm backend mypy app
	docker-compose run --rm frontend npx tsc --noEmit

# Database
db-migrate:
	docker-compose run --rm backend alembic upgrade head

db-migrate-create:
	@read -p "Migration message: " msg; \
	docker-compose run --rm backend alembic revision --autogenerate -m "$$msg"

db-seed:
	docker-compose run --rm backend python -m app.scripts.seed_dev

db-reset:
	docker-compose down -v db
	docker-compose up -d db
	sleep 5
	make db-migrate
	make db-seed

db-shell:
	docker-compose exec db psql -U chess_user -d chess_trainer

# Build
build: build-backend build-frontend

build-backend:
	docker build -t chess-backend:latest -f backend/Dockerfile backend

build-frontend:
	docker build -t chess-frontend:latest -f frontend/Dockerfile frontend

# Cleanup
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f
	rm -rf backend/__pycache__ backend/.pytest_cache backend/.mypy_cache backend/.ruff_cache
	rm -rf frontend/node_modules frontend/dist frontend/.vitest frontend/coverage
	rm -rf packages/chess-domain/node_modules packages/chess-domain/dist

# Logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f db

# Shells
shell-backend:
	docker-compose exec backend bash

shell-frontend:
	docker-compose exec frontend sh

shell-db:
	docker-compose exec db psql -U chess_user -d chess_trainer

# Generate API client
generate-api:
	cd frontend && npm run generate:api

# CI simulation
ci: lint typecheck test
	@echo "All CI checks passed!"