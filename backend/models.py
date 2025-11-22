from pydantic import BaseModel
from typing import List, Optional

class BusinessElement(BaseModel):
    name: str
    type: str  # e.g., "Production", "Service", "Content"
    description: str
    monetization_potential: str

class DeconstructionRequest(BaseModel):
    idea: str
    industry: Optional[str] = None

class DeconstructionResult(BaseModel):
    original_idea: str
    cheapest_entry_point: str
    elements: List[BusinessElement]  # Should be exactly 7
    pivot_options: List[str]
    sustainability_tip: str
    project_id: Optional[str] = None

class PivotRequest(BaseModel):
    project_id: str
    pivot_name: str
    original_idea: Optional[str] = None

class DiagnosisRequest(BaseModel):
    project_id: str
    challenges: str
    current_status: Optional[str] = None

class DiagnosisResult(BaseModel):
    weak_link: str
    weak_link_detail: str
    root_cause: str
    immediate_fix: str
    strategic_adjustment: str
    viability_score: int


class ActionUpdateRequest(BaseModel):
    completed: bool

class StatusUpdateRequest(BaseModel):
    status: str  # "active", "in_progress", "completed", "on_hold", "abandoned"

class PivotAnalysisResult(BaseModel):
    viability_score: int
    market_fit: str
    market_fit_score: int
    recommended_actions: List[dict]  # {"action": str, "priority": str}
    required_resources: List[str]
    estimated_timeline: str
    estimated_investment: str
    risk_level: str
    risk_factors: List[str]
    milestones: List[dict]  # {"name": str, "due_weeks": int, "description": str}
