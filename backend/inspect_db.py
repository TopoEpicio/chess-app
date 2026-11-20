import sqlite3
conn = sqlite3.connect('data/chess_trainer.db')
cur = conn.cursor()
for row in cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name IN ('openings','repertoire_nodes','study_resources','study_folder_resources')"):
    print(row[0])
    print('---')
