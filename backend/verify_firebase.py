import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("--- Firebase Verification Script ---")

# Check for critical environment variables
required_vars = [
    "FIREBASE_TYPE",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_CLIENT_ID",
    "FIREBASE_AUTH_URI",
    "FIREBASE_TOKEN_URI",
    "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
    "FIREBASE_CLIENT_X509_CERT_URL"
]

missing_vars = []
for var in required_vars:
    value = os.getenv(var)
    if not value:
        missing_vars.append(var)
    else:
        # Print first few chars to verify it's loaded but not leak full secret
        masked = value[:4] + "..." if len(value) > 4 else "..."
        print(f"[OK] {var}: {masked}")

if missing_vars:
    print(f"\n[ERROR] Missing environment variables: {', '.join(missing_vars)}")
    print("Please check your .env file.")
    exit(1)

print("\nAll required environment variables found.")

# Attempt to initialize Firebase
try:
    if not firebase_admin._apps:
        print("\nInitializing Firebase Admin SDK...")
        
        # Try loading from service-account.json first to verify credentials
        json_path = "service-account.json"
        if os.path.exists(json_path):
            print(f"[INFO] Found {json_path}, testing with it first...")
            cred = credentials.Certificate(json_path)
            try:
                firebase_admin.initialize_app(cred)
                print("[SUCCESS] Firebase Admin initialized with service-account.json")
                
                # Test connection - SKIPPING to debug key mismatch faster
                # db = firestore.client()
                # collections = db.collections()
                # Force a network call
                # print(f"[SUCCESS] Connected to Firestore using JSON file. Collections: {[c.id for c in collections]}")
                print("[INFO] Skipping connection test to compare keys immediately...")
                
                # If successful, we know credentials are good. Now let's debug why env vars fail.
                # We can't re-initialize app easily without deleting it, but we can compare the keys.
                
                import json
                with open(json_path) as f:
                    data = json.load(f)
                    json_key = data['private_key']
                
                env_key = os.getenv("FIREBASE_PRIVATE_KEY")
                processed_env_key = env_key.replace('\\n', '\n')
                
                print(f"\nKey Comparison:")
                print(f"JSON key length: {len(json_key)}")
                print(f"Env key length: {len(env_key)}")
                print(f"Processed env key length: {len(processed_env_key)}")
                
                if json_key == processed_env_key:
                    print("[MATCH] Processed env key matches JSON key exactly.")
                else:
                    print("[MISMATCH] Processed env key does NOT match JSON key.")
                
                # Compare other fields
                fields_to_check = [
                    ("project_id", "FIREBASE_PROJECT_ID"),
                    ("private_key_id", "FIREBASE_PRIVATE_KEY_ID"),
                    ("client_email", "FIREBASE_CLIENT_EMAIL"),
                    ("client_id", "FIREBASE_CLIENT_ID"),
                ]
                
                for json_field, env_var in fields_to_check:
                    j_val = data.get(json_field)
                    e_val = os.getenv(env_var)
                    if j_val != e_val:
                        print(f"[MISMATCH] {json_field}: JSON='{j_val}' vs Env='{e_val}'")
                    else:
                        print(f"[MATCH] {json_field}")

                # Try to initialize with Env Vars now
                print("\nAttempting to initialize with Env Vars (App 'env_test')...")
                cred_dict = {
                    "type": os.getenv("FIREBASE_TYPE"),
                    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                    "private_key": processed_env_key,
                    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
                    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
                    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
                    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
                    "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN", "googleapis.com")
                }
                
                try:
                    cred_env = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred_env, name='env_test')
                    print("[SUCCESS] Firebase Admin initialized with Env Vars (App 'env_test')")
                except Exception as e:
                    print(f"[FAIL] Failed to initialize with Env Vars: {e}")

                exit(0)

                
            except Exception as e:
                print(f"[FAIL] Failed with service-account.json: {e}")
                # Continue to try env vars
                if firebase_admin._apps:
                    firebase_admin.delete_app(firebase_admin.get_app())

        # Fallback to Env Vars (original logic)
        print("\nTesting with Environment Variables...")
        
        # Debug private key
        key = os.getenv("FIREBASE_PRIVATE_KEY")

        print(f"Raw key length: {len(key)}")
        print(f"Raw key start: {key[:30]}")
        print(f"Raw key end: {key[-30:]}")
        
        processed_key = key.replace('\\n', '\n')
        print(f"Processed key length: {len(processed_key)}")
        print(f"Processed key start: {processed_key[:30]!r}")

        cred_dict = {
            "type": os.getenv("FIREBASE_TYPE"),
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": processed_key,
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
            "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
            "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
            "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN", "googleapis.com")
        }
        
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("[SUCCESS] Firebase Admin initialized.")
    else:
        print("[INFO] Firebase Admin already initialized.")

    # Test Firestore connection
    print("\nTesting Firestore connection...")
    db = firestore.client()
    
    # Try to list collections (lightweight operation)
    collections = db.collections()
    print(f"[SUCCESS] Connected to Firestore. Collections found: {[c.id for c in collections]}")

except Exception as e:
    print(f"\n[FAIL] Error connecting to Firebase: {e}")
    import traceback
    traceback.print_exc()
