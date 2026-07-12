"""FastAPI route definitions for the AI microservice."""

import logging

import httpx
from fastapi import APIRouter, Depends, HTTPException, status

from app.config import Settings, get_settings
from app.schemas import ErrorResponse, IncidentAnalyzeRequest, IncidentAnalyzeResponse
from app.services import IncidentAnalysisService

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Incident Analysis"])


def get_analysis_service(settings: Settings = Depends(get_settings)) -> IncidentAnalysisService:
    """Dependency injector for the incident analysis service."""
    return IncidentAnalysisService(settings)


@router.post(
    "/analyze",
    response_model=IncidentAnalyzeResponse,
    responses={
        status.HTTP_400_BAD_REQUEST: {"model": ErrorResponse},
        status.HTTP_502_BAD_GATEWAY: {"model": ErrorResponse},
        status.HTTP_504_GATEWAY_TIMEOUT: {"model": ErrorResponse},
    },
    summary="Analyze an emergency incident",
    description=(
        "Uses Groq AI to classify the incident, predict severity and priority, "
        "and recommend emergency resource allocation."
    ),
)
async def analyze_incident(
    payload: IncidentAnalyzeRequest,
    service: IncidentAnalysisService = Depends(get_analysis_service),
) -> IncidentAnalyzeResponse:
    """
    Analyze an emergency incident and return structured AI recommendations.

    This endpoint is designed for integration with Spring Boot WebClient.
    """
    try:
        return await service.analyze(payload)
    except httpx.TimeoutException as exc:
        logger.error("Groq AI request timed out: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Groq AI request timed out.",
        ) from exc
    except httpx.HTTPStatusError as exc:
        logger.error(
            "Groq AI API failure status=%s body=%s",
            exc.response.status_code,
            exc.response.text,
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Groq AI API returned an error.",
        ) from exc
    except httpx.RequestError as exc:
        logger.error("Groq AI connection error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to reach Groq AI service.",
        ) from exc
    except ValueError as exc:
        logger.error("Invalid LLM output: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error during incident analysis")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while analyzing the incident.",
        ) from exc
