import sqlite3

conn = sqlite3.connect(r'C:\Users\lorenzo.filippi\Desktop\chess\chess-app 2\backend\data\chess_trainer.db')
c = conn.cursor()

# Count root folders
c.execute('SELECT COUNT(*) FROM study_folders WHERE parent_id IS NULL')
print('Root folders:', c.fetchone()[0])

# List root folders
c.execute('SELECT id, name, parent_id, sort_order FROM study_folders WHERE parent_id IS NULL ORDER BY sort_order')
for r in c.fetchall():
    print(f'  Folder id={r[0]} name={r[1]} parent_id={r[2]} sort={r[3]}')
    c.execute('SELECT COUNT(*) FROM study_folder_resources WHERE folder_id=?', (r[0],))
    rc = c.fetchone()[0]
    c.execute('SELECT COUNT(*) FROM study_folders WHERE parent_id=?', (r[0],))
    fc = c.fetchone()[0]
    print(f'    resources={rc} subfolders={fc}')

# Test the StudyResourceOut construction for each folder
c.execute('SELECT * FROM study_folder_resources')
links = c.fetchall()
c.execute('SELECT * FROM study_resources')
ress = {r[0]: r for r in c.fetchall()}

for folder_id in [2, 3]:
    print(f'\nFolder {folder_id} resources:')
    res_ids = [l[1] for l in links if l[0] == folder_id]
    for rid in res_ids:
        res = ress.get(rid)
        if res:
            print(f'  Resource {rid}: type={res[1]} name={res[2]} file_name={res[5]}')
        else:
            print(f'  Resource {rid}: NOT FOUND in study_resources!')

conn.close()
