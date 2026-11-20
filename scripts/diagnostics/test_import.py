#!/usr/bin/env python3
"""Smoke test: can the FastAPI app be imported outside uvicorn?

Run it the same way the server does -- with `backend/` as the import root, so
`app.*` resolves to `backend/app`.
"""
import os
import sys

# Resolve the repository root from this file's location
# (<repo>/scripts/diagnostics/test_import.py).
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))
BACKEND = os.path.join(ROOT, "backend")

print("Testing application imports...")
print("Python version:", sys.version)
print("Import root:", BACKEND)

sys.path.insert(0, BACKEND)


def main() -> int:
    try:
        print("\n1. Importing config...")
        from app.config import get_settings

        print("[ok] Config imported")

        settings = get_settings()
        print(f"   Default locale: {settings.default_locale}")
        print(f"   Supported locales: {settings.supported_locales}")

        print("\n2. Importing routers...")
        from app.routers.analysis import router as analysis_router

        print(f"[ok] Analysis router imported ({len(analysis_router.routes)} routes)")

        from app.main import app

        print("[ok] App imported")

        print("\n3. Testing FastAPI app...")
        print(f"   App title: {app.title}")
        print(f"   App version: {app.version}")

        print("\n[ok] All imports successful!")
        return 0

    except Exception as exc:
        print(f"\n[FAIL] Import failed: {exc}")
        import traceback

        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
