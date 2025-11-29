import json
from google import genai
from .gemini_prompts import build_prompt

client = genai.Client(api_key="AIzaSyBFTXPR420WZ_E1YIw8Xl7i7NdpqY1iQDU")  # <-- SET YOUR KEY

def generate_code(layout: dict, target: str, meta: dict) -> str:
    try:
        prompt = build_prompt(layout, target, meta)
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return resp.text.strip() if resp and resp.text else ""
    except Exception as e:
        print("Gemini Error:", e)
        return ""
