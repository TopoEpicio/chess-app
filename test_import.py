#!/usr/bin/env python3
import sys
import os

print("Testing application imports...")
print("Python version:", sys.version)
print("Python path:", sys.path[:3])

# Add the backend/app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend/app'))

try:
    # Test basic application imports
    print("\\n1. Importing config...")
    from backend.app.config import get_settings
    print("✅ Config imported")
    
    settings = get_settings()
    print(f"   Default locale: {settings.default_locale}")
    print(f"   Supported locales: {settings.supported_locales}")
    
    print("\\n2. Importing routers...")
    from backend.app.routers import settings_router
    print("✅ Settings router imported")
    
    from backend.app.routers.analysis import router as analysis_router
    print("✅ Analysis router imported")
    
    from backend.app.main import app
    print("✅ App imported")
    
    print("\\n3. Testing FastAPI app...")
    print(f"   App title: {app.title}")
    print(f"   App version: {app.version}")
    
    print("\\n✅ All imports successful!")
    
except Exception as e:
    print(f"\n❌ Import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
