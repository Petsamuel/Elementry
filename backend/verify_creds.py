import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

load_dotenv()

try:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    print(f"Credential path: {cred_path}")
    if not cred_path:
        print("GOOGLE_APPLICATION_CREDENTIALS env var not set.")
        exit(1)
        
    if not os.path.exists(cred_path):
        print(f"Credential file not found at: {cred_path}")
        # Try absolute path if relative fails
        abs_path = os.path.abspath(cred_path)
        print(f"Absolute path: {abs_path}")
        if not os.path.exists(abs_path):
            exit(1)
    
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    print("Firebase Admin initialized successfully!")
except Exception as e:
    print(f"Error: {e}")
    exit(1)
