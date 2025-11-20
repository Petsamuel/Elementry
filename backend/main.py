from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import DeconstructionRequest, DeconstructionResult
from engine import deconstruct_business_idea
from auth import verify_token, sync_user_to_firestore, check_ai_limit, increment_ai_usage
from typing import Annotated

app = FastAPI(title="Elemental AI API", description="The Intelligence of Gradual Growth", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    from datetime import datetime
    print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {request.method} {request.url.path}")
    response = await call_next(request)
    return response


async def get_token(authorization: Annotated[str, Header()]):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    token = authorization.split(" ")[1]
    decoded_token = verify_token(token)
    if not decoded_token:
        raise HTTPException(status_code=401, detail="Invalid token")
    return decoded_token

@app.get("/")
async def root():
    return {"message": "Elemental AI System Online", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/auth/sync")
async def sync_user(token_data: dict = Depends(get_token)):
    user_data = sync_user_to_firestore(token_data)
    return {"status": "success", "user": user_data}

@app.post("/deconstruct", response_model=DeconstructionResult)
async def deconstruct(request: DeconstructionRequest, token_data: dict = Depends(get_token)):
    # Check limits
    if not check_ai_limit(token_data['uid']):
        raise HTTPException(status_code=403, detail="AI generation limit reached for your plan. Upgrade to Pro for more.")

    result = await deconstruct_business_idea(request.idea)
    
    # Increment usage
    increment_ai_usage(token_data['uid'])
    
    return result

@app.get("/dashboard/stats")
async def get_dashboard_stats(token_data: dict = Depends(get_token)):
    """Get dashboard statistics for the authenticated user"""
    from firestore_utils import get_user_stats, get_user_usage_stats
    
    stats = get_user_stats(token_data['uid'])
    usage = get_user_usage_stats(token_data['uid'])
    
    return {
        "stats": stats,
        "usage": usage
    }

@app.get("/dashboard/alerts")
async def get_dashboard_alerts(token_data: dict = Depends(get_token)):
    """Get recent alerts for the authenticated user"""
    from firestore_utils import get_user_alerts
    
    alerts = get_user_alerts(token_data['uid'], limit=5)
    return {"alerts": alerts}

@app.get("/dashboard/projects")
async def get_dashboard_projects(token_data: dict = Depends(get_token)):
    """Get recent projects for the authenticated user"""
    from firestore_utils import get_user_projects
    
    projects = get_user_projects(token_data['uid'], limit=5)
    return {"projects": projects}

@app.post("/dashboard/alerts/{alert_id}/dismiss")
async def dismiss_alert_endpoint(alert_id: str, token_data: dict = Depends(get_token)):
    """Dismiss an alert"""
    from firestore_utils import dismiss_alert
    
    success = dismiss_alert(token_data['uid'], alert_id)
    return {"success": success}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)