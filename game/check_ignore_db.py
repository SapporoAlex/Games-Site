import os
from dotenv import load_dotenv

load_dotenv()

ignore_db = os.getenv('IGNORE_DB') == '1'

if ignore_db:
    print("ignoring db.sqlite3...")
    
else:
    print("Including db.sqlite3...")