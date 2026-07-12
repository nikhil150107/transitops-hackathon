"""Shared utility helpers for logging and JSON parsing."""

import json
import logging
import re
from typing import Any

# Configure root logging format used across the service.
LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"


def setup_logging(debug: bool = False) -> None:
    """Initialize application-wide logging configuration."""
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(level=level, format=LOG_FORMAT)


def extract_json_object(text: str) -> dict[str, Any]:
    """
    Extract and parse the first JSON object from LLM output.

    LLMs sometimes wrap JSON in markdown fences; this helper tolerates that
    and raises ValueError when no valid JSON object can be parsed.
    """
    cleaned = text.strip()

    # Remove optional markdown code fences.
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned, re.IGNORECASE)
    if fence_match:
        cleaned = fence_match.group(1).strip()

    # If extra prose exists, isolate the outermost JSON object.
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found in LLM response.")

    json_candidate = cleaned[start : end + 1]

    try:
        parsed = json.loads(json_candidate)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in LLM response: {exc}") from exc

    if not isinstance(parsed, dict):
        raise ValueError("LLM response JSON must be an object.")

    return parsed


VALID_INCIDENT_TYPES = {
    "FIRE",
    "MEDICAL",
    "POLICE",
    "NATURAL_DISASTER",
    "HAZMAT",
    "TRAFFIC",
    "SEARCH_RESCUE",
    "OTHER",
}

VALID_SEVERITIES = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}
VALID_PRIORITIES = {"P1", "P2", "P3", "P4"}

RESOURCE_FIELDS = (
    "fire_engines",
    "ambulances",
    "police_vehicles",
    "rescue_vehicles",
    "medical_staff",
    "firefighters",
    "police_officers",
    "rescue_personnel",
)

VEHICLE_RESOURCE_MAX = 20
PERSONNEL_RESOURCE_MAX = 80


def coerce_resource_count(value: Any, maximum: int) -> int:
    """
    Convert LLM resource values to non-negative integers.

    Null, empty, and decimal values are rounded to the nearest whole number.
    """
    if value is None or value == "":
        return 0

    if isinstance(value, bool):
        return int(value)

    if isinstance(value, int):
        count = value
    elif isinstance(value, float):
        count = round(value)
    else:
        try:
            count = round(float(str(value).strip()))
        except (TypeError, ValueError):
            return 0

    return max(0, min(count, maximum))


def normalize_incident_type(value: Any) -> str:
    """Map LLM output to one of the allowed incident type values."""
    if value is None:
        return "OTHER"

    normalized = str(value).strip().upper().replace(" ", "_").replace("-", "_")
    if normalized in VALID_INCIDENT_TYPES:
        return normalized

    aliases = {
        "FIRE_INCIDENT": "FIRE",
        "MEDICAL_EMERGENCY": "MEDICAL",
        "HEALTH": "MEDICAL",
        "LAW_ENFORCEMENT": "POLICE",
        "CRIME": "POLICE",
        "DISASTER": "NATURAL_DISASTER",
        "FLOOD": "NATURAL_DISASTER",
        "EARTHQUAKE": "NATURAL_DISASTER",
        "CHEMICAL": "HAZMAT",
        "HAZARDOUS_MATERIAL": "HAZMAT",
        "ACCIDENT": "TRAFFIC",
        "ROAD_ACCIDENT": "TRAFFIC",
        "RESCUE": "SEARCH_RESCUE",
        "MISSING_PERSON": "SEARCH_RESCUE",
        "UNKNOWN": "OTHER",
        "GENERAL": "OTHER",
    }
    return aliases.get(normalized, "OTHER")


def normalize_severity(value: Any) -> str:
    """Ensure severity is always one of the supported levels."""
    if value is None:
        return "MEDIUM"

    normalized = str(value).strip().upper()
    if normalized in VALID_SEVERITIES:
        return normalized

    if normalized in {"MINOR", "LOW_RISK"}:
        return "LOW"
    if normalized in {"MODERATE", "MODERATE_RISK"}:
        return "MEDIUM"
    if normalized in {"SEVERE", "MAJOR", "URGENT"}:
        return "HIGH"
    if normalized in {"EXTREME", "CATASTROPHIC", "EMERGENCY"}:
        return "CRITICAL"

    return "MEDIUM"


def normalize_priority(value: Any) -> str:
    """Ensure priority is always one of P1 through P4."""
    if value is None:
        return "P3"

    normalized = str(value).strip().upper()
    if normalized in VALID_PRIORITIES:
        return normalized

    if normalized.isdigit():
        mapping = {"1": "P1", "2": "P2", "3": "P3", "4": "P4"}
        return mapping.get(normalized, "P3")

    return "P3"


def normalize_resources(data: Any) -> dict[str, int]:
    """Ensure every resource field is present as a realistic non-negative integer."""
    source = data if isinstance(data, dict) else {}

    vehicle_fields = {
        "fire_engines",
        "ambulances",
        "police_vehicles",
        "rescue_vehicles",
    }

    normalized: dict[str, int] = {}
    for field in RESOURCE_FIELDS:
        maximum = VEHICLE_RESOURCE_MAX if field in vehicle_fields else PERSONNEL_RESOURCE_MAX
        normalized[field] = coerce_resource_count(source.get(field), maximum)

    return normalized


def normalize_reason(
    value: Any,
    incident_type: str,
    severity: str,
    priority: str,
) -> str:
    """Guarantee a non-empty reason string even when the LLM omits it."""
    if value is not None:
        reason = str(value).strip()
        if reason:
            return reason[:500]

    return (
        f"Classified as {incident_type} with {severity} severity and {priority} priority "
        "based on the reported incident details and likely operational needs."
    )
