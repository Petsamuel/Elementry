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
    
    # Save as project
    from firestore_utils import create_project
    
    # Convert Pydantic model to dict
    project_data = result.dict()
    project_data['name'] = request.idea # Use idea as name for now
    
    project_id = create_project(token_data['uid'], project_data)
    
    # Add project_id to result
    result.project_id = project_id
    
    # Increment usage
    increment_ai_usage(token_data['uid'])
    
    return result

@app.get("/dashboard/stats")
async def get_dashboard_stats(token_data: dict = Depends(get_token)):
    """Get dashboard statistics for the authenticated user"""
    from firestore_utils import get_user_stats, get_user_usage_stats
    
    stats = get_user_stats(token_data['uid'])
    usage = get_user_usage_stats(token_data['uid'])
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
    
    # Save as project
    from firestore_utils import create_project
    
    # Convert Pydantic model to dict
    project_data = result.dict()
    project_data['name'] = request.idea # Use idea as name for now
    
    project_id = create_project(token_data['uid'], project_data)
    
    # Add project_id to result
    result.project_id = project_id
    
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
async def get_dashboard_projects(limit: int = 10, token_data: dict = Depends(get_token)):
    """Get recent projects for the authenticated user"""
    from firestore_utils import get_user_projects
    
    projects = get_user_projects(token_data['uid'], limit=limit)
    return {"projects": projects}

@app.delete("/dashboard/projects/{project_id}")
async def delete_project_endpoint(project_id: str, token_data: dict = Depends(get_token)):
    """Delete a project"""
    from firestore_utils import delete_project
    
    success = delete_project(token_data['uid'], project_id)
    return {"success": success}

@app.post("/dashboard/alerts/{alert_id}/dismiss")
async def dismiss_alert_endpoint(alert_id: str, token_data: dict = Depends(get_token)):
    """Dismiss an alert"""
    from firestore_utils import dismiss_alert
    
    success = dismiss_alert(token_data['uid'], alert_id)
    return {"success": success}

@app.get("/dashboard/projects/{project_id}")
async def get_project_endpoint(project_id: str, token_data: dict = Depends(get_token)):
    """Get a single project"""
    from firestore_utils import get_project
    
    project = get_project(token_data['uid'], project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.patch("/dashboard/projects/{project_id}/status")
async def update_project_status_endpoint(project_id: str, status_data: dict, token_data: dict = Depends(get_token)):
    """Update project status"""
    from firestore_utils import update_project_status
    
    status = status_data.get('status')
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    success = update_project_status(token_data['uid'], project_id, status)
    return {"success": success}

@app.get("/dashboard/overview")
async def get_dashboard_overview(token_data: dict = Depends(get_token)):
    """Get all dashboard data in a single request"""
    from firestore_utils import get_user_stats, get_user_usage_stats, get_user_alerts, get_user_projects, get_project_growth
    
    uid = token_data['uid']
    
    return {
        "stats": get_user_stats(uid),
        "usage": get_user_usage_stats(uid),
        "alerts": get_user_alerts(uid, limit=5),
        "projects": get_user_projects(uid, limit=5),
        "growth": get_project_growth(uid)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)