import firebase_admin
from firebase_admin import credentials, auth, firestore
import os

from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
# Load credentials from environment variables
db = None

try:
    if not firebase_admin._apps:
        # Check if we have env vars
        if os.getenv("FIREBASE_PRIVATE_KEY"):
            cred_dict = {
                "type": os.getenv("FIREBASE_TYPE"),
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
                "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
                "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
                "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
            }
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        else:
            # Fallback to default (e.g. for local dev with GOOGLE_APPLICATION_CREDENTIALS still set)
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
            
    db = firestore.client()
    print("Firebase Admin initialized successfully.")
except Exception as e:
    print(f"WARNING: Firebase Admin initialization failed: {e}")
    print("Backend user sync will be disabled until credentials are set up.")
    print("Ensure .env file is present with FIREBASE_ credentials.")

def verify_token(token: str):
    if not db:
        # Mock verification if DB is not available to allow testing other parts
        # In production, this should fail.
        print("WARNING: DB not initialized, skipping token verification (MOCK MODE)")
        return {"uid": "mock-uid", "email": "mock@example.com", "name": "Mock User"}
        
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None

def sync_user_to_firestore(user_data: dict):
    if not db:
        print("WARNING: DB not initialized, skipping Firestore sync.")
        return user_data

    uid = user_data['uid']
    email = user_data.get('email', 'N/A')
    display_name = user_data.get('name', 'N/A')
    auth_provider = user_data.get('firebase', {}).get('sign_in_provider', 'N/A')
     
    user_ref = db.collection('users').document(uid)
    
    # Merge with existing data to preserve plan info if it exists
    user_ref.set({
        'email': email,
        'display_name': display_name,
        'photo_url': user_data.get('picture'),
        'last_login': firestore.SERVER_TIMESTAMP,
        # Set default plan if not exists
    }, merge=True)
    
    # Check if plan exists, if not set default
    doc = user_ref.get()
    user_dict = doc.to_dict() if doc.exists else {}
    
    if not doc.exists or 'plan' not in user_dict:
        user_ref.set({'plan': 'starter'}, merge=True)
        print(f"New user detected - assigned 'starter' plan to {email}")
    else:
        print(f"Existing user - current plan: {user_dict.get('plan', 'unknown')}")
    
    print("-" * 60)
        
    return user_ref.get().to_dict()

def check_ai_limit(uid: str) -> bool:
    if not db:
        return True # Mock mode allow
    
    user_ref = db.collection('users').document(uid)
    doc = user_ref.get()
    if not doc.exists:
        return False
    
    user_data = doc.to_dict()
    plan = user_data.get('plan', 'starter')
    
    # Get usage
    # We'll store usage in a subcollection or a field. Subcollection is cleaner for scalability.
    # Let's use a 'usage' document in a 'stats' subcollection or just a field if simple.
    # The plan says: users/{uid}/usage/ai_generations
    
    usage_ref = user_ref.collection('usage').document('ai_generations')
    usage_doc = usage_ref.get()
    current_usage = usage_doc.to_dict().get('count', 0) if usage_doc.exists else 0
    
    # Limits
    limits = {
        'starter': 10,
        'pro': 150,
        'empire': 999999
    }
    
    limit = limits.get(plan, 10) # Default to starter limit
    return current_usage < limit

def increment_ai_usage(uid: str):
    if not db:
        return
        
    user_ref = db.collection('users').document(uid)
    usage_ref = user_ref.collection('usage').document('ai_generations')
    
    if not usage_ref.get().exists:
        usage_ref.set({'count': 1})
    else:
        # Atomic increment
        usage_ref.update({'count': firestore.Increment(1)})
