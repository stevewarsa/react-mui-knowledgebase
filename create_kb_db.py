import sqlite3, os
pathOfDb = "c:/backup/code/react-apps/kb/kb.sqlite"
if os.path.exists(pathOfDb):
    os.remove(pathOfDb)
connection = sqlite3.connect(pathOfDb)
cursor = connection.cursor()

createEntry = "CREATE TABLE kb_entry (id integer primary key autoincrement, title text not null, description text, appl_create_dt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP));"
createTag = "CREATE TABLE kb_tag (id integer primary key autoincrement, tag_cd text not null, tag_nm text not null, appl_create_dt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP));"
createKbTag = "CREATE TABLE kb_tag_kb_entry (kb_id integer not null, tag_id integer not null, appl_create_dt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP), primary key (kb_id, tag_id));"
cursor.execute(createEntry)
cursor.execute(createTag)
cursor.execute(createKbTag)
cursor.close()
connection.close()




