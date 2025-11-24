from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import DeconstructionRequest, DeconstructionResult, PivotRequest, DiagnosisRequest, StrategyRequest, StrategyUpdateRequest
from engine import deconstruct_business_idea
from auth import verify_token, sync_user_to_firestore, check_ai_limit, increment_ai_usage
from typing import Annotated
from middleware import RateLimiter
import time

app = FastAPI(title="Elemental AI API", description="The Intelligence of Gradual Growth", version="0.1.0")

# Initialize Rate Limiter
rate_limiter = RateLimiter(requests_per_minute=20)

# Simple in-memory cache with TTL (Time To Live)
# Format: {(uid, project_id): (data, timestamp)}
project_cache = {}
CACHE_TTL = 60 * 5  # 5 minutes

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://elementry.vercel.app",
    "https://www.elementry.vercel.app",
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

@app.post("/deconstruct", response_model=DeconstructionResult, dependencies=[Depends(rate_limiter)])
async def deconstruct(request: DeconstructionRequest, token_data: dict = Depends(get_token)):
    # Check limits
    if not check_ai_limit(token_data['uid']):
        raise HTTPException(status_code=403, detail="AI generation limit reached for your plan. Upgrade to Pro for more.")
    
    # Increment usage
    increment_ai_usage(token_data['uid'])
    
    result = await deconstruct_business_idea(request.idea)
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
    
    # Invalidate cache if exists
    cache_key = (token_data['uid'], project_id)
    if cache_key in project_cache:
        del project_cache[cache_key]
        
    return {"success": success}

@app.post("/dashboard/alerts/{alert_id}/dismiss")
async def dismiss_alert_endpoint(alert_id: str, token_data: dict = Depends(get_token)):
    """Dismiss an alert"""
    from firestore_utils import dismiss_alert
    
    success = dismiss_alert(token_data['uid'], alert_id)
    return {"success": success}

@app.get("/dashboard/projects/{project_id}")
async def get_project_endpoint(project_id: str, token_data: dict = Depends(get_token)):
    """Get a single project with caching"""
    uid = token_data['uid']
    cache_key = (uid, project_id)
    
    # Check cache
    if cache_key in project_cache:
        data, timestamp = project_cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            return data
    
    from firestore_utils import get_project
    
    project = get_project(uid, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Update cache
    project_cache[cache_key] = (project, time.time())
    
    return project

@app.patch("/dashboard/projects/{project_id}/status")
async def update_project_status_endpoint(project_id: str, status_data: dict, token_data: dict = Depends(get_token)):
    """Update project status"""
    from firestore_utils import update_project_status
    
    status = status_data.get('status')
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    success = update_project_status(token_data['uid'], project_id, status)
    
    # Invalidate cache
    cache_key = (token_data['uid'], project_id)
    if cache_key in project_cache:
        del project_cache[cache_key]
        
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

@app.post("/pivots", dependencies=[Depends(rate_limiter)])
async def create_pivot_endpoint(request: PivotRequest, token_data: dict = Depends(get_token)):
    """Create a new pivot opportunity with AI analysis"""
    from firestore_utils import create_pivot, get_project
    from engine import generate_pivot_analysis
    
    # 1. Get original project to get the idea/context
    # Check cache first for project
    uid = token_data['uid']
    cache_key = (uid, request.project_id)
    project = None
    
    if cache_key in project_cache:
        data, timestamp = project_cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            project = data
            
    if not project:
        project = get_project(uid, request.project_id)
        if project:
            project_cache[cache_key] = (project, time.time())

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    original_idea = project.get('name', '')
    
    # 2. Generate analysis using Gemini
    analysis_result = await generate_pivot_analysis(original_idea, request.pivot_name)
    
    # 3. Prepare data
    pivot_data = request.dict()
    pivot_data['analysis'] = analysis_result.dict()
    
    # Initialize progress tracking fields
    pivot_data['analysis'].update({
        'status': 'active',
        'progress_percentage': 0,
        'actions_completed': 0,
        'actions_total': len(analysis_result.recommended_actions),
        'current_week': 0,
        'started_at': None
    })
    
    # 4. Save to Firestore
    pivot_id = create_pivot(token_data['uid'], pivot_data)
    
    return {"status": "success", "pivot_id": pivot_id}

@app.get("/pivots")
async def get_pivots_endpoint(project_id: str = None, token_data: dict = Depends(get_token)):
    """Get pivots for the authenticated user"""
    from firestore_utils import get_pivots
    
    pivots = get_pivots(token_data['uid'], project_id)
    return {"pivots": pivots}

@app.patch("/pivots/{pivot_id}/actions/{action_index}")
async def update_pivot_action_endpoint(
    pivot_id: str,
    action_index: int,
    request: dict,
    token_data: dict = Depends(get_token)
):
    """Mark a specific action as complete/incomplete"""
    from firestore_utils import update_pivot_action
    
    completed = request.get('completed', False)
    updated_pivot = update_pivot_action(token_data['uid'], pivot_id, action_index, completed)
    
    if not updated_pivot:
       raise HTTPException(status_code=404, detail="Pivot or action not found")
    
    return updated_pivot

@app.patch("/pivots/{pivot_id}/status")
async def update_pivot_status_endpoint(
    pivot_id: str,
    request: dict,
    token_data: dict = Depends(get_token)
):
    """Update pivot simulation status"""
    from firestore_utils import update_pivot_status
    
    new_status = request.get('status')
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    success = update_pivot_status(token_data['uid'], pivot_id, new_status)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid status or pivot not found")
    
    return {"success": success, "status": new_status}

@app.post("/projects/{project_id}/diagnose", dependencies=[Depends(rate_limiter)])
async def diagnose_project_endpoint(
    project_id: str,
    request: DiagnosisRequest,
    token_data: dict = Depends(get_token)
):
    """Diagnose business challenges"""
    from firestore_utils import update_project_diagnosis, get_project
    from engine import generate_diagnosis
    
    uid = token_data['uid']
    
    # Get project context
    project = get_project(uid, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    idea = project.get('name', '')
    
    # Generate diagnosis
    diagnosis_result = await generate_diagnosis(idea, request.challenges)
    
    # Save to Firestore
    success = update_project_diagnosis(uid, project_id, diagnosis_result.dict())
    
    """Delete a project"""
    from firestore_utils import delete_project
    
    success = delete_project(token_data['uid'], project_id)
    
    # Invalidate cache if exists
    cache_key = (token_data['uid'], project_id)
    if cache_key in project_cache:
        del project_cache[cache_key]
        
    return {"success": success}

@app.post("/dashboard/alerts/{alert_id}/dismiss")
async def dismiss_alert_endpoint(alert_id: str, token_data: dict = Depends(get_token)):
    """Dismiss an alert"""
    from firestore_utils import dismiss_alert
    
    success = dismiss_alert(token_data['uid'], alert_id)
    return {"success": success}

@app.get("/dashboard/projects/{project_id}")
async def get_project_endpoint(project_id: str, token_data: dict = Depends(get_token)):
    """Get a single project with caching"""
    uid = token_data['uid']
    cache_key = (uid, project_id)
    
    # Check cache
    if cache_key in project_cache:
        data, timestamp = project_cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            return data
    
    from firestore_utils import get_project
    
    project = get_project(uid, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Update cache
    project_cache[cache_key] = (project, time.time())
    
    return project

@app.patch("/dashboard/projects/{project_id}/status")
async def update_project_status_endpoint(project_id: str, status_data: dict, token_data: dict = Depends(get_token)):
    """Update project status"""
    from firestore_utils import update_project_status
    
    status = status_data.get('status')
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    success = update_project_status(token_data['uid'], project_id, status)
    
    # Invalidate cache
    cache_key = (token_data['uid'], project_id)
    if cache_key in project_cache:
        del project_cache[cache_key]
        
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

@app.post("/pivots", dependencies=[Depends(rate_limiter)])
async def create_pivot_endpoint(request: PivotRequest, token_data: dict = Depends(get_token)):
    """Create a new pivot opportunity with AI analysis"""
    from firestore_utils import create_pivot, get_project
    from engine import generate_pivot_analysis
    
    # 1. Get original project to get the idea/context
    # Check cache first for project
    uid = token_data['uid']
    cache_key = (uid, request.project_id)
    project = None
    
    if cache_key in project_cache:
        data, timestamp = project_cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            project = data
            
    if not project:
        project = get_project(uid, request.project_id)
        if project:
            project_cache[cache_key] = (project, time.time())

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    original_idea = project.get('name', '')
    
    # 2. Generate analysis using Gemini
    analysis_result = await generate_pivot_analysis(original_idea, request.pivot_name)
    
    # 3. Prepare data
    pivot_data = request.dict()
    pivot_data['analysis'] = analysis_result.dict()
    
    # Initialize progress tracking fields
    pivot_data['analysis'].update({
        'status': 'active',
        'progress_percentage': 0,
        'actions_completed': 0,
        'actions_total': len(analysis_result.recommended_actions),
        'current_week': 0,
        'started_at': None
    })
    
    # 4. Save to Firestore
    pivot_id = create_pivot(token_data['uid'], pivot_data)
    
    return {"status": "success", "pivot_id": pivot_id}

@app.get("/pivots")
async def get_pivots_endpoint(project_id: str = None, token_data: dict = Depends(get_token)):
    """Get pivots for the authenticated user"""
    from firestore_utils import get_pivots
    
    pivots = get_pivots(token_data['uid'], project_id)
    return {"pivots": pivots}

@app.patch("/pivots/{pivot_id}/actions/{action_index}")
async def update_pivot_action_endpoint(
    pivot_id: str,
    action_index: int,
    request: dict,
    token_data: dict = Depends(get_token)
):
    """Mark a specific action as complete/incomplete"""
    from firestore_utils import update_pivot_action
    
    completed = request.get('completed', False)
    updated_pivot = update_pivot_action(token_data['uid'], pivot_id, action_index, completed)
    
    if not updated_pivot:
       raise HTTPException(status_code=404, detail="Pivot or action not found")
    
    return updated_pivot

@app.patch("/pivots/{pivot_id}/status")
async def update_pivot_status_endpoint(
    pivot_id: str,
    request: dict,
    token_data: dict = Depends(get_token)
):
    """Update pivot simulation status"""
    from firestore_utils import update_pivot_status
    
    new_status = request.get('status')
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    success = update_pivot_status(token_data['uid'], pivot_id, new_status)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid status or pivot not found")
    
    return {"success": success, "status": new_status}

@app.post("/projects/{project_id}/diagnose", dependencies=[Depends(rate_limiter)])
async def diagnose_project_endpoint(
    project_id: str,
    request: DiagnosisRequest,
    token_data: dict = Depends(get_token)
):
    """Diagnose business challenges"""
    from firestore_utils import update_project_diagnosis, get_project
    from engine import generate_diagnosis
    
    uid = token_data['uid']
    
    # Get project context
    project = get_project(uid, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    idea = project.get('name', '')
    
    # Generate diagnosis
    diagnosis_result = await generate_diagnosis(idea, request.challenges)
    
    # Save to Firestore
    success = update_project_diagnosis(uid, project_id, diagnosis_result.dict())
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save diagnosis")
        
    return diagnosis_result

@app.get("/projects/{project_id}/board")
async def get_strategy_board_endpoint(project_id: str, token_data: dict = Depends(get_token)):
    """Get strategy board for a project"""
    from firestore_utils import get_strategy_board
    
    board = get_strategy_board(token_data['uid'], project_id)
    if not board:
        # Return empty structure if not found
        return {
            "columns": {
                "discovery": [],
                "validation": [],
                "growth": [],
                "success": []
            }
        }
    return board

@app.post("/projects/{project_id}/board")
async def save_strategy_board_endpoint(
    project_id: str, 
    board_data: dict, 
    token_data: dict = Depends(get_token)
):
    """Save strategy board state"""
    from firestore_utils import save_strategy_board
    
    success = save_strategy_board(token_data['uid'], project_id, board_data)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save board")
        
    return {"status": "success"}


# ============================================================================
# NEW STRATEGY ENDPOINTS
# ============================================================================

@app.post("/strategies", dependencies=[Depends(rate_limiter)])
async def create_strategy_endpoint(request: StrategyRequest, token_data: dict = Depends(get_token)):
    """Create a new strategy (pivot or fix) with AI analysis"""
    from firestore_utils import create_strategy, get_project
    from engine import generate_pivot_analysis
    
    # Get original project for context
    uid = token_data['uid']
    cache_key = (uid, request.project_id)
    project = None
    
    if cache_key in project_cache:
        data, timestamp = project_cache[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            project = data
            
    if not project:
        project = get_project(uid, request.project_id)
        if project:
            project_cache[cache_key] = (project, time.time())

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    original_idea = project.get('name', '')
    
    # Generate analysis using Gemini
    analysis_result = await generate_pivot_analysis(original_idea, request.strategy_name)
    
    # Prepare data
    strategy_data = request.dict()
    strategy_data['analysis'] = analysis_result.dict()
    strategy_data['type'] = request.strategy_type.value  # Convert enum to string
    
    # Save to Firestore
    strategy_id = create_strategy(token_data['uid'], strategy_data)
    
    return {"status": "success", "strategy_id": strategy_id}


@app.get("/strategies")
async def get_strategies_endpoint(
    project_id: str = None,
    strategy_type: str = None,  # "pivot" or "fix"
    status: str = None,  # "potential", "discovery", etc.
    token_data: dict = Depends(get_token)
):
    """Get strategies with optional filters"""
    from firestore_utils import get_strategies
    
    strategies = get_strategies(token_data['uid'], project_id, strategy_type, status)
    return {"strategies": strategies}


@app.patch("/strategies/{strategy_id}/status")
async def update_strategy_status_endpoint(
    strategy_id: str,
    request: StrategyUpdateRequest,
    token_data: dict = Depends(get_token)
):
    """Update strategy status"""
    from firestore_utils import update_pivot_status
    
    # Use update_pivot_status which now supports new status values
    new_status = request.status.value  # Convert enum to string
    success = update_pivot_status(token_data['uid'], strategy_id, new_status)
    
    if not success:
        raise HTTPException(status_code=400, detail="Invalid status or strategy not found")
    
    return {"success": success, "status": new_status}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)