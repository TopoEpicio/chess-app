"""Print the CORS origins the backend is configured with.

Run from the repo root:

    python scripts\diagnostics\check_cors_settings.py
"""

import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[2] / "backend"
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from app.config import get_settings  # noqa: E402

settings = get_settings()
print("CORS origins:", settings.cors_origins)
