import json

def build_prompt(layout_json: dict, target_framework: str, meta: dict) -> str:
    layout_str = json.dumps(layout_json, indent=2)
    meta_str = json.dumps(meta, indent=2)

    return f"""
You are a world-class software developer.

Generate code for the framework: {target_framework}

Report Component Layout:
{layout_str}

Metadata:
{meta_str}

Instructions:
- Use best UI practices for the selected framework
- Ensure layout structure is respected
- Output only code, no explanation
"""
