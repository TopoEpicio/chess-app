import sqlite3, json

conn = sqlite3.connect(r'C:\Users\lorenzo.filippi\Desktop\chess\chess-app 2\backend\data\chess_trainer.db')
c = conn.cursor()

# Show current puzzle data
c.execute('SELECT id, theme, solution FROM puzzles')
rows = c.fetchall()
for rid, theme, solution in rows:
    print(f'Puzzle {rid}: theme={theme!r} solution={solution!r}')

# Fix puzzles theme
c.execute('SELECT id, theme FROM puzzles')
rows = c.fetchall()
for rid, theme in rows:
    try:
        parsed = json.loads(theme)
        if isinstance(parsed, list):
            print(f'  Puzzle {rid}: already list ({parsed})')
            continue
        # If it's a JSON string, wrap in array
        fixed = json.dumps([parsed])
        c.execute('UPDATE puzzles SET theme = ? WHERE id = ?', (fixed, rid))
        print(f'  Puzzle {rid}: FIXED string -> {fixed}')
    except (json.JSONDecodeError, TypeError) as e:
        fixed = json.dumps([str(theme)])
        c.execute('UPDATE puzzles SET theme = ? WHERE id = ?', (fixed, rid))
        print(f'  Puzzle {rid}: FIXED invalid ({theme!r}) -> {fixed}')

# Also fix solution field if needed
c.execute('SELECT id, solution FROM puzzles')
for rid, solution in c.fetchall():
    try:
        parsed = json.loads(solution)
        if isinstance(parsed, list):
            continue
        fixed = json.dumps([parsed])
        c.execute('UPDATE puzzles SET solution = ? WHERE id = ?', (fixed, rid))
        print(f'  Puzzle {rid}: FIXED solution -> {fixed}')
    except (json.JSONDecodeError, TypeError) as e:
        print(f'  Puzzle {rid}: ERROR with solution {solution!r}: {e}')

conn.commit()

# Verify
c.execute('SELECT id, theme, solution FROM puzzles')
print('\nAfter fix:')
for rid, theme, solution in c.fetchall():
    print(f'  Puzzle {rid}: theme={json.loads(theme)}')

conn.close()
print('\nDone!')
