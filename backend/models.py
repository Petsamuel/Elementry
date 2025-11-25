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

class FundingStep(BaseModel):
    step: str
    amount: str
    description: str

class SustainabilityMilestone(BaseModel):
    milestone: str
    timeline: str
    description: str

class DeconstructionResult(BaseModel):
    original_idea: str
    cheapest_entry_point: str
    estimated_cost: str
    time_to_validate: str
    elements: List[BusinessElement]  # Should be exactly 7
    pivot_options: List[str]
    sustainability_tip: str
    gradual_funding_strategy: List[FundingStep]
    brand_and_community_expansion_tips: List[str]
    sustainability_roadmap: List[SustainabilityMilestone]
    project_id: Optional[str] = None
    currency: Optional[str] = "NGN"
    name: Optional[str] = None
    overall_score: Optional[int] = None

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


class MarketSizeItem(BaseModel):
    value: str
    currency: str
    description: str

class MarketSize(BaseModel):
    tam: MarketSizeItem
    sam: MarketSizeItem
    som: MarketSizeItem

class Competitor(BaseModel):
    id: str
    name: str
    strength: str
    weakness: str
    type: str

class Risk(BaseModel):
    id: str
    description: str
    impact: str
    probability: str
    mitigation: str
    status: Optional[str] = "active"

class TimelinePhase(BaseModel):
    id: str
    title: str
    description: str
    date: str
    status: str

class MarketAnalysis(BaseModel):
    marketSize: MarketSize
    competitors: List[Competitor]
    trends: List[str]
    customerSegments: List[str]


class StrategyDetailsUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    marketAnalysis: MarketAnalysis
    risks: List[Risk]
    timeline: List[TimelinePhase]
