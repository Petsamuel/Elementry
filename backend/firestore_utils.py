from firebase_admin import firestore
from datetime import datetime
from typing import Dict, List, Optional
import auth

def get_db():
    """Get Firestore client"""
    return auth.db

def get_user_stats(uid: str) -> Dict:
    """
    Calculate user statistics for dashboard
    Returns: {
        ideas_analyzed: int,
        revenue_streams: int,
        success_rate: float,
        active_projects: int
    }
    """
    db = get_db()
    if not db:
        return {
            "ideas_analyzed": 0,
            "revenue_streams": 0,
            "success_rate": 0,
            "active_projects": 0
        }
    
    # Get all projects for user
    projects_ref = db.collection('users').document(uid).collection('projects')
    projects = projects_ref.stream()
    
    total_projects = 0
    total_streams = 0
    total_score = 0
    active_count = 0
    
    for project in projects:
        project_data = project.to_dict()
        total_projects += 1
        total_streams += project_data.get('revenue_streams_count', 0)
        total_score += project_data.get('overall_score', 0)
        if project_data.get('status') == 'active':
            active_count += 1
    
    success_rate = (total_score / total_projects) if total_projects > 0 else 0
    
    return {
        "ideas_analyzed": total_projects,
        "revenue_streams": total_streams,
        "success_rate": round(success_rate, 1),
        "active_projects": active_count
    }

def get_user_alerts(uid: str, limit: int = 5) -> List[Dict]:
    """
    Fetch recent non-dismissed alerts for user
    """
    db = get_db()
    if not db:
        return []
    
    alerts_ref = db.collection('users').document(uid).collection('alerts')
    alerts_query = alerts_ref.where('dismissed', '==', False).order_by('created_at', direction=firestore.Query.DESCENDING).limit(limit)
    
    alerts = []
    for alert_doc in alerts_query.stream():
        alert_data = alert_doc.to_dict()
        alert_data['id'] = alert_doc.id
        # Convert timestamp to ISO string for JSON serialization
        # Convert timestamp to ISO string for JSON serialization
        if 'created_at' in alert_data and alert_data['created_at']:
            ts = alert_data['created_at']
            if hasattr(ts, 'isoformat'):
                alert_data['created_at'] = ts.isoformat()
            elif isinstance(ts, str):
                pass # Already a string
        alerts.append(alert_data)
    
    return alerts

def get_user_projects(uid: str, limit: int = 5) -> List[Dict]:
    """
    Fetch recent projects for user
    """
    db = get_db()
    if not db:
        return []
    
    projects_ref = db.collection('users').document(uid).collection('projects')
    projects_query = projects_ref.order_by('updated_at', direction=firestore.Query.DESCENDING).limit(limit)
    
    projects = []
    for project_doc in projects_query.stream():
        project_data = project_doc.to_dict()
        project_data['id'] = project_doc.id
        # Convert timestamps
        if 'created_at' in project_data and project_data['created_at']:
            ts = project_data['created_at']
            if hasattr(ts, 'isoformat'):
                project_data['created_at'] = ts.isoformat()
        if 'updated_at' in project_data and project_data['updated_at']:
            ts = project_data['updated_at']
            if hasattr(ts, 'isoformat'):
                project_data['updated_at'] = ts.isoformat()
        projects.append(project_data)
    
    return projects

def create_project(uid: str, project_data: Dict) -> str:
    """
    Create a new project for user
    Returns: project_id
    """
    db = get_db()
    if not db:
        return "mock-project-id"
    
    projects_ref = db.collection('users').document(uid).collection('projects')
    
    # Add timestamps
    project_data['created_at'] = firestore.SERVER_TIMESTAMP
    project_data['updated_at'] = firestore.SERVER_TIMESTAMP
    project_data['status'] = 'active'
    
    # Create project
    project_ref = projects_ref.document()
    project_ref.set(project_data)
    
    return project_ref.id

def create_alert(uid: str, alert_data: Dict) -> str:
    """
    Create a new alert for user
    Returns: alert_id
    """
    db = get_db()
    if not db:
        return "mock-alert-id"
    
    alerts_ref = db.collection('users').document(uid).collection('alerts')
    
    # Add metadata
    alert_data['created_at'] = firestore.SERVER_TIMESTAMP
    alert_data['dismissed'] = False
    
    # Create alert
    alert_ref = alerts_ref.document()
    alert_ref.set(alert_data)
    
    return alert_ref.id

def dismiss_alert(uid: str, alert_id: str) -> bool:
    """
    Mark an alert as dismissed
    """
    db = get_db()
    if not db:
        return True
    
    alert_ref = db.collection('users').document(uid).collection('alerts').document(alert_id)
    alert_ref.update({'dismissed': True})
    
    return True

def generate_ai_alerts(uid: str, project_data: Dict) -> List[str]:
    """
    Generate AI alerts based on project analysis
    Returns: list of alert_ids
    """
    alerts = []
    project_name = project_data.get('name', 'Your idea')
    
    # Check for weak distribution
    revenue_streams = project_data.get('revenue_streams', [])
    distribution_streams = [s for s in revenue_streams if 'marketplace' in s.get('name', '').lower() or 'platform' in s.get('name', '').lower()]
    
    if len(distribution_streams) == 0:
        alert_id = create_alert(uid, {
            'type': 'warning',
            'title': 'Distribution Strategy Needed',
            'message': f'Your idea "{project_name}" may be weak on distribution channels. Consider adding marketplace or platform strategies.',
            'project_id': project_data.get('id')
        })
        alerts.append(alert_id)
    
    # Check for low scoring streams
    low_score_streams = [s for s in revenue_streams if s.get('strength_score', 100) < 50]
    if len(low_score_streams) > 3:
        alert_id = create_alert(uid, {
            'type': 'info',
            'title': 'Revenue Model Optimization',
            'message': f'Several revenue streams in "{project_name}" scored below 50. Focus on your strongest 2-3 streams for better results.',
            'project_id': project_data.get('id')
        })
        alerts.append(alert_id)
    
    # Check for high overall score
    if project_data.get('overall_score', 0) >= 85:
        alert_id = create_alert(uid, {
            'type': 'success',
            'title': 'Strong Business Model Detected',
            'message': f'Excellent! "{project_name}" has a robust revenue model with {project_data.get("overall_score")}% viability score.',
            'project_id': project_data.get('id')
        })
        alerts.append(alert_id)
    
    return alerts

def get_user_usage_stats(uid: str) -> Dict:
    """
    Get user's current usage and plan limits
    Returns: {
        plan: str,
        current_usage: int,
        limit: int,
        percentage: float
    }
    """
    db = get_db()
    if not db:
        return {
            "plan": "starter",
            "current_usage": 0,
            "limit": 10,
            "percentage": 0
        }
    
    # Get user plan
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    plan = user_doc.to_dict().get('plan', 'starter') if user_doc.exists else 'starter'
    
    # Get usage
    usage_ref = user_ref.collection('usage').document('ai_generations')
    usage_doc = usage_ref.get()
    current_usage = usage_doc.to_dict().get('count', 0) if usage_doc.exists else 0
    
    # Plan limits
    limits = {
        'starter': 10,
        'pro': 150,
        'empire': 999999
    }
    
    limit = limits.get(plan, 10)
    percentage = (current_usage / limit * 100) if limit > 0 else 0
    
    return {
        "plan": plan,
        "current_usage": current_usage,
        "limit": limit,
        "percentage": round(percentage, 1)
    }

def get_project_growth(uid: str) -> List[Dict]:
    """
    Get project growth data for chart
    Returns: List of {date: str, count: int}
    """
    db = get_db()
    if not db:
        return []
    
    projects_ref = db.collection('users').document(uid).collection('projects')
    projects = projects_ref.order_by('created_at').stream()
    
    # Process projects into cumulative count by date
    growth_data = []
    cumulative_count = 0
    
    # Group by date (YYYY-MM-DD)
    date_counts = {}
    
    for project in projects:
        data = project.to_dict()
        if 'created_at' in data and data['created_at']:
            ts = data['created_at']
            date_str = None
            
            if hasattr(ts, 'date'):
                date_str = ts.date().isoformat()
            elif hasattr(ts, 'isoformat'):
                # Handle case where it might be a datetime but not have .date() (unlikely for datetime, but possible for some types)
                date_str = ts.isoformat().split('T')[0]
            elif isinstance(ts, str):
                date_str = ts.split('T')[0]
                
            if date_str:
                date_counts[date_str] = date_counts.get(date_str, 0) + 1
            
    # Sort dates
    sorted_dates = sorted(date_counts.keys())
    
    for date in sorted_dates:
        cumulative_count += date_counts[date]
        growth_data.append({
            "date": date,
            "count": cumulative_count
        })
        
    return growth_data

def delete_project(uid: str, project_id: str) -> bool:
    """
    Delete a project for user
    """
    db = get_db()
    if not db:
        return True
    
    project_ref = db.collection('users').document(uid).collection('projects').document(project_id)
    project_ref.delete()
    
    return True

def update_project_status(uid: str, project_id: str, status: str) -> bool:
    """
    Update project status
    """
    db = get_db()
    if not db:
        return True
    
    project_ref = db.collection('users').document(uid).collection('projects').document(project_id)
    project_ref.update({
        'status': status,
        'updated_at': firestore.SERVER_TIMESTAMP
    })
    
    return True

def get_project(uid: str, project_id: str) -> Optional[Dict]:
    """
    Get a single project details
    """
    db = get_db()
    if not db:
        return None
    
    project_ref = db.collection('users').document(uid).collection('projects').document(project_id)
    doc = project_ref.get()
    
    if not doc.exists:
        return None
        
    data = doc.to_dict()
    data['id'] = doc.id
    
    # Convert timestamps
    if 'created_at' in data and data['created_at']:
        ts = data['created_at']
        if hasattr(ts, 'isoformat'):
            data['created_at'] = ts.isoformat()
    if 'updated_at' in data and data['updated_at']:
        ts = data['updated_at']
        if hasattr(ts, 'isoformat'):
            data['updated_at'] = ts.isoformat()
            
    return data

def create_pivot(uid: str, pivot_data: Dict) -> str:
    """
    Create a new pivot for user
    Returns: pivot_id
    """
    db = get_db()
    if not db:
        return "mock-pivot-id"
    
    pivots_ref = db.collection('users').document(uid).collection('pivots')
    
    # Add metadata
    pivot_data['created_at'] = firestore.SERVER_TIMESTAMP
    pivot_data['status'] = 'active'
    
    # Create pivot
    pivot_ref = pivots_ref.document()
    pivot_ref.set(pivot_data)
    
    return pivot_ref.id

def get_pivots(uid: str, project_id: Optional[str] = None) -> List[Dict]:
    """
    Fetch pivots for user, optionally filtered by project_id
    """
    db = get_db()
    if not db:
        return []
    
    pivots_ref = db.collection('users').document(uid).collection('pivots')
    
    if project_id:
        query = pivots_ref.where('project_id', '==', project_id).order_by('created_at', direction=firestore.Query.DESCENDING)
    else:
        query = pivots_ref.order_by('created_at', direction=firestore.Query.DESCENDING)
    
    pivots = []
    for doc in query.stream():
        data = doc.to_dict()
        data['id'] = doc.id
        
        # Convert timestamps
        if 'created_at' in data and data['created_at']:
            ts = data['created_at']
            if hasattr(ts, 'isoformat'):
                data['created_at'] = ts.isoformat()
                
        pivots.append(data)
    
    return pivots
