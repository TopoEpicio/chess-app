"""One-shot migration: add new columns to game_analyses table."""
from pathlib import Path
from sqlalchemy import create_engine, inspect

DATA_DIR = Path(__file__).parent / "data"
DB_PATH = DATA_DIR / "chess_trainer.db"
engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})

inspector = inspect(engine)
columns = [c["name"] for c in inspector.get_columns("game_analyses")]

new_columns = {
    "white": "VARCHAR(128)",
    "black": "VARCHAR(128)",
    "eco": "VARCHAR(8)",
    "event_date": "VARCHAR(16)",
    "opening_name": "VARCHAR(128)",
}

with engine.connect() as conn:
    for col_name, col_type in new_columns.items():
        if col_name not in columns:
            conn.exec_driver_sql(f"ALTER TABLE game_analyses ADD COLUMN {col_name} {col_type}")
            print(f"Added column: {col_name}")
        else:
            print(f"Column already exists: {col_name}")
    conn.commit()

print("Migration complete.")
