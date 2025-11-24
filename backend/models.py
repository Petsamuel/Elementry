from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class BusinessElement(BaseModel):
    name: str
    type: str  # e.g., "Production", "Service", "Content"
    description: str
    monetization_potential: str

class DeconstructionRequest(BaseModel):
    idea: str
    industry: Optional[str] = None
    currency: Optional[str] = "NGN"

class DeconstructionResult(BaseModel):
    original_idea: str
    cheapest_entry_point: str
    elements: List[BusinessElement]  # Should be exactly 7
    pivot_options: List[str]
    sustainability_tip: str
    project_id: Optional[str] = None
    currency: Optional[str] = "NGN"
    name: Optional[str] = None

class PivotRequest(BaseModel):
    project_id: str
    pivot_name: str
    original_idea: Optional[str] = None

class DiagnosisRequest(BaseModel):
    project_id: str
    challenges: str
    current_status: Optional[str] = None
    currency: Optional[str] = "NGN"

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

class StrategyType(str, Enum):
    PIVOT = "pivot"
    FIX = "fix"

class StrategyStatus(str, Enum):
    POTENTIAL = "potential"
    DISCOVERY = "discovery"
    VALIDATION = "validation"
    GROWTH = "growth"
    SUCCESS = "success"

class StrategyRequest(BaseModel):
    project_id: str
    strategy_name: str
    strategy_type: StrategyType
    description: Optional[str] = None

class StrategyUpdateRequest(BaseModel):
    status: StrategyStatus

class SettingsUpdate(BaseModel):
    currency: Optional[str] = None
    theme: Optional[str] = None
    notifications: Optional[bool] = None
    pushNotifications: Optional[bool] = None
    marketingEmails: Optional[bool] = None
    dataRetention: Optional[str] = None
    reducedMotion: Optional[bool] = None
    compactMode: Optional[bool] = None
    aiOptimization: Optional[bool] = None

