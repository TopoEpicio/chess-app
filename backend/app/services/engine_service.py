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


class StockfishPool:
    """Simple Stockfish process pool for concurrent evaluations."""

    def __init__(self, max_workers: int = 2):
        self.max_workers = max_workers
        self._processes: list[asyncio.subprocess.Process] = []
        self._available: asyncio.Queue = asyncio.Queue()

    async def start(self):
        """Start the engine pool."""
        settings = get_settings()
        for _ in range(self.max_workers):
            proc = await asyncio.create_subprocess_exec(
                settings.stockfish_path,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            self._processes.append(proc)
            await self._available.put(proc)

    async def get_engine(self) -> asyncio.subprocess.Process:
        """Get an available engine."""
        return await self._available.get()

    async def return_engine(self, engine: asyncio.subprocess.Process):
        """Return engine to pool."""
        await self._available.put(engine)

    async def evaluate(self, fen: str, depth: int = 18, multipv: int = 3) -> dict:
        """Evaluate a position."""
        engine = await self.get_engine()
        try:
            # Set position
            engine.stdin.write(f"position fen {fen}\n".encode())
            await engine.stdin.drain()

            # Go command
            engine.stdin.write(f"go depth {depth} multipv {multipv}\n".encode())
            await engine.stdin.drain()

            # Read output until bestmove
            lines = []
            while True:
                line = await engine.stdout.readline()
                if not line:
                    break
                line = line.decode().strip()
                lines.append(line)
                if line.startswith("bestmove"):
                    break

            return {"lines": lines}
        finally:
            await self.return_engine(engine)

    async def close(self):
        """Close all engines."""
        for proc in self._processes:
            if proc.returncode is None:
                proc.terminate()
                await proc.wait()


# Global pool instance
_engine_pool: StockfishPool | None = None


async def get_engine_pool() -> StockfishPool:
    """Get or create the global engine pool."""
    global _engine_pool
    if _engine_pool is None:
        _engine_pool = StockfishPool()
        await _engine_pool.start()
    return _engine_pool


async def close_engine_pool():
    """Close the global engine pool."""
    global _engine_pool
    if _engine_pool:
        await _engine_pool.close()
        _engine_pool = None
