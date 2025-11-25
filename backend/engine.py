import os
import json
import asyncio
from openai import OpenAI
from dotenv import load_dotenv
from models import DeconstructionResult, BusinessElement, PivotAnalysisResult, DiagnosisResult
import traceback

load_dotenv()

# Configure OpenRouter
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
YOUR_SITE_URL = os.getenv("YOUR_SITE_URL", "http://localhost:3000") # Optional
YOUR_SITE_NAME = os.getenv("YOUR_SITE_NAME", "Elementry") # Optional

if OPENROUTER_API_KEY:
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )
else:
    print("WARNING: OPENROUTER_API_KEY not found in environment variables.")
    client = None

MODEL_NAME = "google/gemma-3-27b-it"

async def deconstruct_business_idea(idea: str, currency: str = "USD") -> DeconstructionResult:
    """
    Deconstructs a business idea using OpenRouter (Gemma 3).
    """
    if not client:
        print("WARNING: No OPENROUTER_API_KEY found. Using mock data.")
        return _get_mock_data(idea, currency)

    prompt = f"""
        You are the Elemental Coach, a master business strategist embodying the calm, visionary, practical, and purpose-driven essence of Utibe Okuk. Your voice inspires confidence and discipline through subtle storytelling, light humor, and rock-solid business logic. Imagine guiding an entrepreneur like a wise mentor sharing tales from the trenches—keeping it real, forward-thinking, and actionable, while sprinkling in a dash of wit to lighten the path ahead.

        Your core expertise is the "Elemental Business Model Deconstruction": breaking down ideas into modular elements that reveal hidden opportunities, much like dissecting a complex machine to see how each gear turns independently yet powers the whole.

        Business Idea: "{idea}"
        Target Currency: "{currency}"

        Guidelines:
It is very important that you generate ideas strictly based on the local context of the selected currency’s country
     - Deconstruct into EXACTLY 7 distinct business elements (sub-businesses). Each is a standalone module that could spin off, like chapters in a grand entrepreneurial story.
        - Adapt these suggested element types to fit the idea, ensuring diversity: 
          1. Production/Manufacturing (crafting products, physical or digital—like forging the hero's sword),
          2. Content Creation (storytelling through media, blogs, videos—spinning yarns that captivate audiences),
          3. Training/Education (building skills via courses or workshops—turning novices into masters with a wink of encouragement),
          4. Service Delivery (hands-on consulting or support—being the reliable sidekick in the business adventure),
          5. Marketing/Distribution (channels and ads that spread the word—like a clever merchant hawking wares with charm),
          6. Community Building (fostering networks and forums—creating tribes where ideas thrive and laughs are shared),
          7. Technology/Innovation (tools, apps, R&D—innovating like a mad scientist with practical genius).
        - For each element: Give a concise, evocative name; type (from above or similar); description (2-3 sentences weaving in storytelling, humor, and business logic on how it fits the idea, inspiring the user to see its potential); and monetization potential (High: scalable like a viral hit; Medium: steady as a loyal customer base; Low: supportive, like the unsung hero behind the scenes).
        - Cheapest Entry Point: Describe the simplest, lowest-cost validation/start method in an encouraging, practical narrative (e.g., "Kick off with a free blog, testing waters like a cautious explorer dipping a toe in the ocean—minimal risk, maximum insight").
        - Estimated Cost: The estimated financial cost to start the cheapest entry point (e.g. "$0 - $500"). Mention costs in {currency}.
        - Time to Validate: The estimated time to validate the cheapest entry point (e.g. "1-2 Weeks").
        - Pivot Options: 3-5 adjacent industries or variations, phrased as visionary opportunities with a touch of humor (e.g., "Pivot to wellness coaching: because who wouldn't want to turn sweat into serenity?").
        - Sustainability Tip: One key piece of advice for long-term success, delivered with purpose-driven wisdom and a hint of storytelling (e.g., "Build recurring revenue streams, like planting seeds that grow into a forest of financial stability—patience pays dividends").

        Examples:
        - For "Online Fitness Coaching Platform": Elements could include Content (workout videos that make sweating fun), Training (plans that transform couch potatoes into athletes with disciplined humor), etc.

        - Gradual Funding Strategy: A step-by-step guide to funding the business starting from $0.
        - Brand & Community Expansion Tips: Actionable tips for growing the brand and community.
        - Sustainability Roadmap: A list of 3-5 key sustainability milestones.

        Output STRICTLY in raw JSON format matching this exact schema. No additional text, no markdown, no explanations outside JSON—keep it clean and disciplined.
        {{
            "original_idea": "{idea}",
            "cheapest_entry_point": "string description",
            "estimated_cost": "string",
            "time_to_validate": "string",
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
            "sustainability_tip": "string",
            "gradual_funding_strategy": [
                {{"step": "string", "amount": "string", "description": "string"}}
            ],
            "brand_and_community_expansion_tips": ["string1", "string2"],
            "sustainability_roadmap": [
                {{"milestone": "string", "timeline": "string", "description": "string"}}
            ],
            "sustainability_roadmap": [
                {{"milestone": "string", "timeline": "string", "description": "string"}}
            ],
            "currency": "{currency}",
            "overall_score": int // 0-100 score of potential success
        }}
        """

    max_retries = 3
    base_delay = 2

    for attempt in range(max_retries):
        try:
            completion = client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": YOUR_SITE_URL,
                    "X-Title": YOUR_SITE_NAME,
                },
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            response_content = completion.choices[0].message.content
            print(f"DEBUG: OpenRouter Response for Deconstruction:\n{response_content}")
            text = response_content.strip()
            
            # Clean up markdown if present
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            data = json.loads(text)
            return DeconstructionResult(**data)
            
        except Exception as e:
            print(f"Error calling OpenRouter (Attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(base_delay * (2 ** attempt))
            else:
                print("ERROR: Max retries reached for OpenRouter.")
                traceback.print_exc()
                return _get_mock_data(idea, currency)
                
    return _get_mock_data(idea, currency)

def _get_mock_data(idea: str, currency: str = "USD") -> DeconstructionResult:
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
        cheapest_entry_point=f"Content (Start a blog/vlog about the process)",
        estimated_cost=f"0 - 500 {currency}",
        time_to_validate="1-2 Weeks",
        elements=mock_elements,
        pivot_options=["Pivot to Teaching", "Pivot to Supply Chain"],
        sustainability_tip="Start small, reinvest profits from the cheapest entry point.",
        gradual_funding_strategy=[
            {"step": "Bootstrapping", "amount": f"0 - 500 {currency}", "description": "Use personal savings to buy initial ingredients."},
            {"step": "Pre-sales", "amount": f"500 - 2000 {currency}", "description": "Sell to friends and family to fund first batch."},
            {"step": "Reinvestment", "amount": f"2000+ {currency}", "description": "Reinvest 100% of profits into better packaging and marketing."}
        ],
        brand_and_community_expansion_tips=[
            "Collaborate with local beauty influencers.",
            "Host a 'Make Your Own Soap' workshop.",
            "Start a 'Clean Living' challenge on social media."
        ],
        sustainability_roadmap=[
            {"milestone": "Eco-friendly Packaging", "timeline": "Month 3", "description": "Switch to biodegradable packaging."},
            {"milestone": "Local Sourcing", "timeline": "Month 6", "description": "Source 80% of ingredients locally to reduce carbon footprint."},
            {"milestone": "Zero Waste Production", "timeline": "Year 1", "description": "Implement processes to reuse or recycle all waste."}
        ],
        currency=currency,
        overall_score=85
    )


async def generate_pivot_analysis(original_idea: str, pivot_name: str, currency: str = "USD") -> PivotAnalysisResult:
    """
    Generates a detailed analysis for a pivot opportunity using OpenRouter.
    """
    if not client:
        print("WARNING: No OPENROUTER_API_KEY found. Using mock data for pivot.")
        return _get_mock_pivot_data(pivot_name)

    prompt = f"""
        You are the Elemental Coach, channeling the calm, visionary, practical, and purpose-driven spirit of Utibe Okuk. Speak as a mentor who's walked the entrepreneurial path, using storytelling to paint possibilities, humor to ease tensions, and business logic to ground ambitions—inspiring confidence and instilling discipline in every insight.

        Original Business Idea: "{original_idea}"
        Proposed Pivot: "{pivot_name}"

        Now, analyze this pivot as if guiding a fellow visionary through a crossroads: Provide a detailed execution plan that's realistic yet bold, like mapping a treasure hunt with practical steps and witty warnings.

        Guidelines:
It is very important that you analyze  ideas based on the local context of the selected currency’s country
        - Viability Score: 0-100, based on logical assessment—think of it as your confidence meter in this adventure's success.
        - Market Fit: "High", "Medium-High", "Medium", "Growing", or "Low"—framed with a quick story snippet (but keep it in the string).
        - Market Fit Score: 0-100, tied to data-driven intuition.
        - Recommended Actions: 5-7 specific, actionable steps, each with priority (High/Medium/Low). Phrase them engagingly, like "First, scout the terrain (High priority: Validate demand with quick surveys—don't charge blind!").
        - Required Resources: 3-5 key items, listed practically with a touch of humor (e.g., "A full-stack developer—your tech wizard; 10,000 {currency} marketing budget—fuel for the launch rocket").
        - Estimated Timeline: e.g., "12 weeks" or "6 months"—realistic, like setting waypoints on a journey.
        - Estimated Investment: e.g., "5,000 {currency} - 10,000 {currency}"—honest about the treasure needed upfront.
        - Risk Level: "Low", "Medium", "High"—with a humorous nod to the dragons ahead.
        - Risk Factors: 3-5 potential pitfalls, described vividly yet actionably (e.g., "Competitor ambushes: Stay vigilant, or they'll steal your thunder").
        - Milestones: 4 key achievements, each with name, due_weeks (from start), and description—story-like markers of progress (e.g., "Summit the First Hill (Week 4): MVP built, ready for early testers").

        Output STRICTLY in raw JSON format matching this schema. No additional text, no markdown—pure, disciplined structure:
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

    max_retries = 3
    base_delay = 2

    for attempt in range(max_retries):
        try:
            completion = client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": YOUR_SITE_URL,
                    "X-Title": YOUR_SITE_NAME,
                },
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            response_content = completion.choices[0].message.content
            print(f"DEBUG: OpenRouter Response for Pivot:\n{response_content}")
            text = response_content.strip()
            
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            data = json.loads(text)
            return PivotAnalysisResult(**data)
            
        except Exception as e:
            print(f"Error calling OpenRouter for pivot (Attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(base_delay * (2 ** attempt))
            else:
                print("ERROR: Max retries reached for OpenRouter pivot.")
                traceback.print_exc()
                return _get_mock_pivot_data(pivot_name)

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

async def generate_diagnosis(idea: str, challenges: str, currency: str = "USD") -> DiagnosisResult:
    """
    Diagnose business challenges using OpenRouter.
    """
    if not client:
        print("WARNING: No OPENROUTER_API_KEY found. Using mock diagnosis.")
        return _get_mock_diagnosis_data()

    prompt = f"""
        You are the Elemental Coach, channeling the calm, visionary, practical, and purpose-driven spirit of Utibe Okuk.
        
        Business Idea: "{idea}"
        Current Challenges: "{challenges}"
        
        Task: Diagnose the weak link in the business structure (e.g., Supply, Sales, Strategy, Operations, etc.).
        
        Guidelines:
        - Weak Link: Identify the single most critical bottleneck.
        - Weak Link Detail: Explain WHY this is the weak link in 2-3 sentences, using the Utibe Okuk persona (calm, wise, slightly humorous).
        - Root Cause: What is the underlying issue? (e.g., "Lack of market validation", "Inefficient supply chain").
	- Also Diagnose ideas based on the local context of the selected currency’s country ({currency}).
        - Immediate Fix: A concrete, actionable step to resolve this NOW. Mention costs in {currency} if applicable.
        - Strategic Adjustment: A long-term pivot or change to prevent recurrence.
        - Viability Score: 0-100 score of the business's current health.
        
        Output STRICTLY in raw JSON format matching this schema:
        {{
            "weak_link": "string",
            "weak_link_detail": "string",
            "root_cause": "string",
            "immediate_fix": "string",
            "strategic_adjustment": "string",
            "viability_score": int
        }}
    """

    max_retries = 3
    base_delay = 2

    for attempt in range(max_retries):
        try:
            completion = client.chat.completions.create(
                extra_headers={
                    "HTTP-Referer": YOUR_SITE_URL,
                    "X-Title": YOUR_SITE_NAME,
                },
                model=MODEL_NAME,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            response_content = completion.choices[0].message.content
            print(f"DEBUG: OpenRouter Response for Diagnosis:\n{response_content}")
            text = response_content.strip()
            
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            
            data = json.loads(text)
            return DiagnosisResult(**data)
            
        except Exception as e:
            print(f"Error calling OpenRouter for diagnosis (Attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(base_delay * (2 ** attempt))
            else:
                print("ERROR: Max retries reached for OpenRouter diagnosis.")
                traceback.print_exc()
                return _get_mock_diagnosis_data()

    return _get_mock_diagnosis_data()

def _get_mock_diagnosis_data() -> DiagnosisResult:
    return DiagnosisResult(
        weak_link="Sales & Marketing",
        weak_link_detail="Your product is solid, but your voice is whispering in a hurricane. You're building in silence, hoping they'll come.",
        root_cause="Lack of distribution channels",
        immediate_fix="Launch a targeted cold outreach campaign to 100 prospects this week.",
        strategic_adjustment="Pivot to a 'Build in Public' strategy to generate organic buzz.",
        viability_score=65
    )
