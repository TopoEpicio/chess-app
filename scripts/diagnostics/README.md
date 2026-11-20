# Diagnostic scripts (ad-hoc)

Throwaway probes kept around because they were useful while tracking down the
engine/CORS problems of November 2026. **They are not part of the test suite.**
Nothing in the app, the build, or CI imports or runs them.

The real tests live in `backend/tests/` (pytest) and `frontend/src/**/__tests__/`
(vitest). Use those for regressions; use these only for manual, live probing.

## Assumptions

* Backend is running on **http://localhost:8003** (`scripts/start-backend.bat`).
* Frontend dev server is running on **http://localhost:5173** (`scripts/start-all.bat`).
* Origin used in the CORS checks is `http://localhost:5173` (see
  `backend/app/config.py` → `cors_origins`).

## Contents

| Script | What it does |
| --- | --- |
| `test_import.py` | Imports `app.config`, `app.routers.analysis` and `app.main` with `backend/` as the import root (same as uvicorn). Run from the repo root: `python scripts\diagnostics\test_import.py`. Exits non-zero on failure. |
| `check_versions.py` | Prints the installed FastAPI / Starlette versions. |
| `check_cors_settings.py` | Prints the CORS origins the backend resolves from `app.config`. |
| `check_cors_source.py` | Prints the on-disk path of `starlette.middleware.cors`, to confirm which Starlette is actually imported. |
| `check_study_folders.py` | Dumps the study folders and their resources from `backend/data/chess_trainer.db` (path resolved relative to the script). |
| `test_cors_minimal.py` | Standalone FastAPI app with a debug `CORSMiddleware` subclass that logs the incoming `Origin`. Isolates CORS behaviour from the project app. |
| `test_cors.ps1`, `test_cors2.ps1`, `test_cors3.ps1` | PowerShell probes of the live backend with an `Origin` header. |
| `test_all.ps1` | Hits the openings/study endpoints and prints status + CORS headers. |
| `test_both.ps1` | Checks backend and frontend are both up. |
| `test_frontend.ps1` | Single request to the Vite dev server. |
| `test_wait.ps1`, `test_wait2.ps1` | Sleeps then re-probes, to tell "not started yet" apart from "actually broken". |

## Gotcha: quoting in this shell

Several earlier "CORS is missing" conclusions were false alarms. This shell
mangles quoted arguments, so `curl -H "Origin: http://localhost:5173" ...` was
sent **without** the header, and the middleware then correctly ignored a
request that had no `Origin`.

Prefer PowerShell `Invoke-WebRequest -Headers @{...}` (the `.ps1` files here) or
Python + `requests` (`.py` files here) over `curl -H` when probing CORS.
