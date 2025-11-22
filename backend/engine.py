import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from models import DeconstructionResult, BusinessElement, PivotAnalysisResult

load_dotenv()

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

async def deconstruct_business_idea(idea: str) -> DeconstructionResult:
    """
    Deconstructs a business idea using Google Gemini.
    """
    if not GENAI_API_KEY:
        # Fallback to mock if no key (or raise error)
        print("WARNING: No GEMINI_API_KEY found. Using mock data.")
        return _get_mock_data(idea)

    model = genai.GenerativeModel('gemini-1.5-pro')

    prompt = f"""
        You are an expert business strategist specializing in the "Elemental Business Model Deconstruction".
        Your task is to deconstruct the given business idea into EXACTLY 7 distinct business elements (sub-businesses).
        Each element represents a modular, standalone aspect that could potentially be spun off or focused on independently.

        Business Idea: "{idea}"

        Guidelines:
        - Identify EXACTLY 7 elements. Do not provide fewer or more.
        - Suggested element types (adapt as needed but cover diverse aspects): 
          1. Production/Manufacturing (creating physical/digital products),
          2. Content Creation (media, blogs, videos),
          3. Training/Education (courses, workshops),
          4. Service Delivery (consulting, support),
          5. Marketing/Distribution (sales channels, advertising),
          6. Community Building (networks, forums),
          7. Technology/Innovation (tools, apps, R&D).
        - For each element: Provide a concise name, type (from above or similar), description (2-3 sentences on how it fits the idea), and monetization potential (High: scalable revenue; Medium: steady but limited; Low: supportive role).
        - Cheapest Entry Point: The simplest, lowest-cost way to validate/start the idea (e.g., using free tools, minimal viable product).
        - Pivot Options: 3-5 adjacent industries or variations where this idea could pivot (e.g., from fitness app to wellness coaching).
        - Sustainability Tip: One key advice for long-term viability (e.g., focus on recurring revenue).

        Examples:
        - For idea "Online Fitness Coaching Platform":
          Elements might include: Content (workout videos), Training (personalized plans), Service (live sessions), etc.

        Output STRICTLY in raw JSON format matching this exact schema. No additional text, no markdown, no explanations outside JSON.
        {{
            "original_idea": "{idea}",
            "cheapest_entry_point": "string description",
            "elements": [
                {{
                    "name": "string",
                    "type": "string",
                    "description": "string",
                    "monetization_potential": "High|Medium|Low"
                }}
                // exactly 7 objects
            ],
            "pivot_options": ["string1", "string2", "string3"],  // 3-5 strings
            "sustainability_tip": "string"
        }}
        """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean up markdown if present
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        data = json.loads(text)
        return DeconstructionResult(**data)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return _get_mock_data(idea)

def _get_mock_data(idea: str) -> DeconstructionResult:
    mock_elements = [
        BusinessElement(name="Production", type="Core", description="Making the product", monetization_potential="High"),
        BusinessElement(name="Packaging", type="Branding", description="Designing the box", monetization_potential="Medium"),
        BusinessElement(name="Training", type="Education", description="Teaching others", monetization_potential="High"),
        BusinessElement(name="Resale", type="Retail", description="Selling kits", monetization_potential="Medium"),
        BusinessElement(name="Content", type="Media", description="YouTube channel", monetization_potential="High"),
        BusinessElement(name="Franchising", type="Scale", description="Licensing the model", monetization_potential="Very High"),
        BusinessElement(name="Servicing", type="Support", description="Repair and maintenance", monetization_potential="Medium"),
    ]

    return DeconstructionResult(
        original_idea=idea,
        cheapest_entry_point="Content (Start a blog/vlog about the process)",
        elements=mock_elements,
        pivot_options=["Pivot to Teaching", "Pivot to Supply Chain"],
        sustainability_tip="Start small, reinvest profits from the cheapest entry point."
    )


async def generate_pivot_analysis(original_idea: str, pivot_name: str) -> PivotAnalysisResult:
    """
    Generates a detailed analysis for a pivot opportunity using Google Gemini.
    """
    if not GENAI_API_KEY:
        print("WARNING: No GEMINI_API_KEY found. Using mock data for pivot.")
        return _get_mock_pivot_data(pivot_name)

    model = genai.GenerativeModel('gemini-1.5-pro')

    prompt = f"""
        You are an expert business strategist.
        Original Business Idea: "{original_idea}"
        Proposed Pivot: "{pivot_name}"

        Analyze this pivot opportunity and provide a detailed execution plan.
        
        Guidelines:
        - Viability Score: 0-100 assessment of success probability.
        - Market Fit: "High", "Medium-High", "Medium", "Growing", or "Low".
        - Market Fit Score: 0-100.
        - Recommended Actions: 5-7 specific, actionable steps to execute this pivot. Assign priority (High/Medium/Low).
        - Required Resources: List 3-5 key resources needed (e.g., "Full-stack Developer", "$10k Marketing Budget", "Legal Counsel").
        - Estimated Timeline: e.g., "12 weeks", "6 months".
        - Estimated Investment: e.g., "$5k - $10k".
        - Risk Level: "Low", "Medium", "High".
        - Risk Factors: 3-5 potential risks.
        - Milestones: 4 key milestones with due_weeks (offset from start) and description.

        Output STRICTLY in raw JSON format matching this schema:
        {{
            "viability_score": int,
            "market_fit": "string",
            "market_fit_score": int,
            "recommended_actions": [
                {{"action": "string", "priority": "High|Medium|Low"}}
            ],
            "required_resources": ["string", "string"],
            "estimated_timeline": "string",
            "estimated_investment": "string",
            "risk_level": "string",
            "risk_factors": ["string", "string"],
            "milestones": [
                {{"name": "string", "due_weeks": int, "description": "string"}}
            ]
        }}
        """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        data = json.loads(text)
        return PivotAnalysisResult(**data)
    except Exception as e:
        print(f"Error calling Gemini for pivot: {e}")
        return _get_mock_pivot_data(pivot_name)

def _get_mock_pivot_data(pivot_name: str) -> PivotAnalysisResult:
    return PivotAnalysisResult(
        viability_score=85,
        market_fit="Medium-High",
        market_fit_score=78,
        recommended_actions=[
            {"action": f"Validate demand for {pivot_name}", "priority": "High"},
            {"action": "Build MVP", "priority": "High"},
            {"action": "Launch marketing campaign", "priority": "Medium"}
        ],
        required_resources=["Developer", "Designer", "$500 Ad Budget"],
        estimated_timeline="12 weeks",
        estimated_investment="$5k",
        risk_level="Medium",
        risk_factors=["Competitor response", "Market adoption"],
        milestones=[
            {"name": "Validation", "due_weeks": 2, "description": "Confirm market interest"},
            {"name": "Launch", "due_weeks": 12, "description": "Release to public"}
        ]
    )
