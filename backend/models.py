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
