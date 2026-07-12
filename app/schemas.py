"""Pydantic request and response models for the analyze API."""

from typing import Literal

from pydantic import BaseModel, Field, field_validator


class IncidentAnalyzeRequest(BaseModel):
    """Incoming incident payload from the Spring Boot backend."""

    title: str = Field(..., min_length=1, max_length=500, examples=["Building fire reported"])
    description: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        examples=["Smoke visible on the 4th floor of a residential building."],
    )
    location: str = Field(
        ...,
        min_length=1,
        max_length=500,
        examples=["123 Main Street, Downtown"],
    )

    @field_validator("title", "description", "location")
    @classmethod
    def strip_and_validate_text(cls, value: str) -> str:
        """Reject blank strings after trimming whitespace."""
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty or whitespace only.")
        return cleaned


class RecommendedResources(BaseModel):
    """Emergency resource allocation recommended by the AI."""

    fire_engines: int = Field(default=0, ge=0, le=20)
    ambulances: int = Field(default=0, ge=0, le=20)
    police_vehicles: int = Field(default=0, ge=0, le=20)
    rescue_vehicles: int = Field(default=0, ge=0, le=20)
    medical_staff: int = Field(default=0, ge=0, le=80)
    firefighters: int = Field(default=0, ge=0, le=80)
    police_officers: int = Field(default=0, ge=0, le=80)
    rescue_personnel: int = Field(default=0, ge=0, le=80)


IncidentType = Literal[
    "FIRE",
    "MEDICAL",
    "POLICE",
    "NATURAL_DISASTER",
    "HAZMAT",
    "TRAFFIC",
    "SEARCH_RESCUE",
    "OTHER",
]
SeverityLevel = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
PriorityLevel = Literal["P1", "P2", "P3", "P4"]


class IncidentAnalyzeResponse(BaseModel):
    """Structured AI analysis returned to the caller."""

    incident_type: IncidentType = Field(..., examples=["FIRE"])
    severity: SeverityLevel = Field(..., examples=["HIGH"])
    priority: PriorityLevel = Field(..., examples=["P1"])
    recommended_resources: RecommendedResources
    reason: str = Field(..., min_length=1, examples=["Active fire with trapped occupants requires immediate response."])


class ErrorResponse(BaseModel):
    """Standard error payload for API consumers."""

    detail: str
    error_code: str | None = None
