"""Groq API client for incident reasoning."""

import logging
from typing import Any

import httpx

from app.config import Settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "You are an emergency incident analysis AI. Return ONLY valid JSON."
)


class GroqAIClient:
    """Handles all HTTP communication with the Groq OpenAI-compatible API."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._endpoint = f"{settings.groq_base_url.rstrip('/')}/chat/completions"

    def _build_prompt(self, title: str, description: str, location: str) -> str:
        """
        Build a strict prompt that instructs the LLM to return only valid JSON.

        The schema mirrors the API contract expected by the Spring Boot backend.
        """
        return f"""Analyze the incident below.

Incident:
- Title: {title}
- Description: {description}
- Location: {location}

If you are unsure, make the best reasonable prediction.

Never leave any field empty.
Always return every field.
Do not use null.
Do not use decimals.
Resource counts must be realistic whole numbers for the incident scale.

Incident type must be exactly one of:
FIRE
MEDICAL
POLICE
NATURAL_DISASTER
HAZMAT
TRAFFIC
SEARCH_RESCUE
OTHER

Severity must be exactly one of: LOW, MEDIUM, HIGH, CRITICAL
Priority must be exactly one of: P1, P2, P3, P4 (P1 = most urgent)

Realistic resource guidance:
- LOW severity: typically 0-2 vehicles and 0-6 personnel per resource type
- MEDIUM severity: typically 1-4 vehicles and 2-12 personnel per resource type
- HIGH severity: typically 2-8 vehicles and 6-25 personnel per resource type
- CRITICAL severity: typically 4-15 vehicles and 10-50 personnel per resource type
- Assign 0 only when that resource type is genuinely not needed
- Personnel counts should generally meet or exceed vehicle crew requirements

Your response must be a single valid JSON object.
No markdown.
No explanations.
No code fences.

Return exactly this JSON shape with all fields populated:
{{
  "incident_type": "FIRE",
  "severity": "HIGH",
  "priority": "P1",
  "recommended_resources": {{
    "fire_engines": 0,
    "ambulances": 0,
    "police_vehicles": 0,
    "rescue_vehicles": 0,
    "medical_staff": 0,
    "firefighters": 0,
    "police_officers": 0,
    "rescue_personnel": 0
  }},
  "reason": "Brief non-empty justification for classification, severity, priority, and resources."
}}
"""

    def _build_request_payload(self, prompt: str) -> dict[str, Any]:
        """Construct the Groq OpenAI-compatible chat completions request body."""
        return {
            "model": self._settings.groq_model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        }

    async def analyze_incident(self, title: str, description: str, location: str) -> str:
        """
        Send the incident details to Groq AI and return raw text output.

        Raises:
            httpx.TimeoutException: When the upstream LLM call exceeds the timeout.
            httpx.HTTPStatusError: When the API returns a non-success status code.
            RuntimeError: When the response body does not contain usable text.
        """
        prompt = self._build_prompt(title, description, location)
        payload = self._build_request_payload(prompt)

        headers = {
            "Authorization": f"Bearer {self._settings.groq_api_key}",
            "Content-Type": "application/json",
        }

        logger.info(
            "Calling Groq AI model=%s endpoint=%s",
            self._settings.groq_model,
            self._endpoint,
        )

        async with httpx.AsyncClient(timeout=self._settings.groq_timeout_seconds) as client:
            response = await client.post(self._endpoint, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()

        text = self._extract_text_from_response(data)
        if not text:
            logger.error("Groq response missing text content: %s", data)
            raise RuntimeError("Groq AI returned an empty response.")

        logger.debug("Groq raw response: %s", text)
        return text

    @staticmethod
    def _extract_text_from_response(data: dict[str, Any]) -> str:
        """
        Parse Groq chat completions response and extract model text.

        Supports the standard choices[].message.content structure.
        """
        choices = data.get("choices", [])
        if not choices:
            return ""

        message = choices[0].get("message", {})
        content = message.get("content")

        if content is None:
            return ""

        return str(content).strip()
