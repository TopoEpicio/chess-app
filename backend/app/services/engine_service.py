import asyncio

from app.config import get_settings


async def get_engine_status() -> dict:
    """Check Stockfish engine availability."""
    settings = get_settings()
    try:
        # Try to run stockfish with a simple command
        proc = await asyncio.create_subprocess_exec(
            settings.stockfish_path,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        # Send UCI command
        stdout, stderr = await asyncio.wait_for(
            proc.communicate(input=b"uci\nquit\n"),
            timeout=5.0,
        )

        if proc.returncode == 0 and b"id name Stockfish" in stdout:
            return {
                "status": "ok",
                "available": True,
                "version": stdout.decode().split("id name ")[1].split("\n")[0] if "id name " in stdout.decode() else "unknown",
            }
        else:
            return {
                "status": "degraded",
                "available": False,
                "error": stderr.decode() if stderr else "Stockfish not responding",
            }
    except TimeoutError:
        return {
            "status": "degraded",
            "available": False,
            "error": "Stockfish startup timeout",
        }
    except FileNotFoundError:
        return {
            "status": "degraded",
            "available": False,
            "error": "Stockfish binary not found",
        }
    except Exception as e:
        return {
            "status": "degraded",
            "available": False,
            "error": str(e),
        }