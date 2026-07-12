"""Business logic for incident analysis orchestration."""

import logging

from pydantic import ValidationError

from app.ai_client import GroqAIClient
from app.config import Settings
from app.schemas import IncidentAnalyzeRequest, IncidentAnalyzeResponse, RecommendedResources
from app.utils import (
    extract_json_object,
    normalize_incident_type,
    normalize_priority,
    normalize_reason,
    normalize_resources,
    normalize_severity,
)

logger = logging.getLogger(__name__)


class IncidentAnalysisService:
    """Coordinates validation, LLM calls, and response mapping."""

    def __init__(self, settings: Settings) -> None:
        self._ai_client = GroqAIClient(settings)

    async def analyze(self, request: IncidentAnalyzeRequest) -> IncidentAnalyzeResponse:
        """
        Analyze an incident using Groq AI and return a validated response.

        Steps:
        1. Forward incident details to the LLM client.
        2. Parse the JSON returned by the model.
        3. Validate and normalize fields with Pydantic.
        """
        logger.info(
            "Analyzing incident title=%r location=%r",
            request.title,
            request.location,
        )

        raw_output = await self._ai_client.analyze_incident(
            title=request.title,
            description=request.description,
            location=request.location,
        )

        try:
            parsed = extract_json_object(raw_output)
        except ValueError as exc:
            logger.error("Failed to parse LLM JSON output: %s", exc)
            raise ValueError("LLM returned invalid JSON.") from exc

        try:
            response = self._map_to_response(parsed)
        except ValidationError as exc:
            logger.error("LLM JSON failed schema validation: %s", exc)
            raise ValueError("LLM JSON does not match the expected schema.") from exc

        logger.info(
            "Analysis complete type=%s severity=%s priority=%s",
            response.incident_type,
            response.severity,
            response.priority,
        )
        return response

    @staticmethod
    def _map_to_response(data: dict) -> IncidentAnalyzeResponse:
        """
        Map parsed LLM JSON into the public API response model.

        Normalizes missing, null, decimal, or invalid values so every required
        field is always present with a reasonable prediction.
        """
        incident_type = normalize_incident_type(data.get("incident_type"))
        severity = normalize_severity(data.get("severity"))
        priority = normalize_priority(data.get("priority"))
        resources = RecommendedResources.model_validate(
            normalize_resources(data.get("recommended_resources"))
        )
        reason = normalize_reason(data.get("reason"), incident_type, severity, priority)

        return IncidentAnalyzeResponse(
            incident_type=incident_type,
            severity=severity,
            priority=priority,
            recommended_resources=resources,
            reason=reason,
        )
