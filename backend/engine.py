import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from models import DeconstructionResult, BusinessElement

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

    model = genai.GenerativeModel('gemini-pro')

    prompt = f"""
    You are an expert business strategist using the "Elemental Business Model".
    Deconstruct the following business idea into 7 distinct business elements (sub-businesses).
    
    Idea: "{idea}"
    
    The 7 elements should cover different aspects like Production, Content, Training, Service, etc.
    Identify the "Cheapest Entry Point" (the easiest way to start with little money).
    Provide 3-5 "Pivot Options" (adjacent industries).
    
    Return the response in STRICT JSON format matching this schema:
    {{
        "original_idea": "{idea}",
        "cheapest_entry_point": "string",
        "elements": [
            {{
                "name": "string",
                "type": "string (e.g. Production, Service, Content)",
                "description": "string",
                "monetization_potential": "string (High/Medium/Low)"
            }}
        ],
        "pivot_options": ["string", "string"],
        "sustainability_tip": "string"
    }}
    
    Do not include markdown formatting (like ```json). Just the raw JSON string.
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

