"""
TransitOps AI Service — Feature 3: Smart Driver & Vehicle Recommendation
Given a trip request and lists of available vehicles/drivers, uses a hybrid approach:
  1. Rule-based pre-filtering (hard constraints like capacity, license expiry)
  2. Scoring algorithm (soft criteria like fuel efficiency, safety score)
  3. Gemini AI for final ranking and natural-language reasoning

This ensures recommendations are both accurate AND explainable.
"""

import json
import traceback
from datetime import date, datetime

from fastapi import APIRouter
from google import genai

from config import GEMINI_API_KEY, GEMINI_MODEL, SMART_ASSIGN_PROMPT
from schemas import (
    SmartAssignRequest,
    SmartAssignResponse,
    RecommendedEntity,
)

router = APIRouter(prefix="/ai", tags=["Smart Assignment"])

# ── Initialize Gemini Client ───────────────────────────────────────────────
client = genai.Client(api_key=GEMINI_API_KEY)


def _days_until_expiry(expiry_str: str) -> int:
    """Calculate days remaining until a license expires."""
    try:
        expiry_date = datetime.strptime(expiry_str, "%Y-%m-%d").date()
        return (expiry_date - date.today()).days
    except ValueError:
        return -1  # Treat unparseable dates as expired


def _prefilter_vehicles(vehicles, cargo_weight: float):
    """Remove vehicles that physically cannot carry the cargo."""
    valid = []
    rejected_reasons = []
    for v in vehicles:
        if v.max_capacity_kg < cargo_weight:
            rejected_reasons.append(
                f"{v.name} rejected: capacity {v.max_capacity_kg}kg < cargo {cargo_weight}kg"
            )
        else:
            valid.append(v)
    return valid, rejected_reasons


def _prefilter_drivers(drivers):
    """Remove drivers with expired licenses."""
    valid = []
    rejected_reasons = []
    today = date.today()
    for d in drivers:
        days_left = _days_until_expiry(d.license_expiry)
        if days_left < 0:
            rejected_reasons.append(
                f"{d.name} rejected: license expired on {d.license_expiry}"
            )
        else:
            valid.append(d)
    return valid, rejected_reasons


def _score_vehicle(vehicle, cargo_weight: float, planned_distance: float | None) -> float:
    """Score a vehicle from 0-100 based on trip suitability."""
    score = 0.0

    # ── Capacity Fit (40 points) ───────────────────────────────────────
    # Sweet spot: 70-95% utilization
    utilization = cargo_weight / vehicle.max_capacity_kg
    if 0.70 <= utilization <= 0.95:
        score += 40.0
    elif 0.50 <= utilization < 0.70:
        score += 30.0
    elif utilization < 0.50:
        # Vehicle is too big — wasteful
        score += max(10.0, 40.0 * utilization)
    else:
        # > 95% — risky
        score += 25.0

    # ── Fuel Efficiency (30 points) ────────────────────────────────────
    if vehicle.avg_fuel_efficiency and vehicle.avg_fuel_efficiency > 0:
        # Normalize: assume 15 km/l is excellent, 3 km/l is poor
        eff_score = min(vehicle.avg_fuel_efficiency / 15.0, 1.0)
        score += 30.0 * eff_score
    else:
        score += 15.0  # Unknown — give average

    # ── Odometer / Wear (20 points) ────────────────────────────────────
    # Lower odometer = newer vehicle = better
    if vehicle.odometer_km <= 20000:
        score += 20.0
    elif vehicle.odometer_km <= 50000:
        score += 15.0
    elif vehicle.odometer_km <= 100000:
        score += 10.0
    else:
        score += 5.0

    # ── Type Match (10 points) ─────────────────────────────────────────
    if planned_distance:
        if planned_distance > 300 and vehicle.type in ("Truck", "Tanker"):
            score += 10.0
        elif planned_distance <= 300 and vehicle.type in ("Van", "Car"):
            score += 10.0
        else:
            score += 5.0
    else:
        score += 5.0

    return round(min(score, 100.0), 1)


def _score_driver(driver, planned_distance: float | None) -> float:
    """Score a driver from 0-100 based on trip suitability."""
    score = 0.0

    # ── Safety Score (50 points) ───────────────────────────────────────
    score += 50.0 * (driver.safety_score / 100.0)

    # ── License Validity (25 points) ───────────────────────────────────
    days_left = _days_until_expiry(driver.license_expiry)
    if days_left > 180:
        score += 25.0
    elif days_left > 90:
        score += 20.0
    elif days_left > 30:
        score += 10.0
    else:
        score += 5.0  # License expiring very soon — risky

    # ── Experience (25 points) ─────────────────────────────────────────
    if driver.trips_completed >= 50:
        score += 25.0
    elif driver.trips_completed >= 20:
        score += 20.0
    elif driver.trips_completed >= 5:
        score += 15.0
    else:
        score += 8.0

    return round(min(score, 100.0), 1)


def _clean_json_response(text: str) -> str:
    """Strip markdown code fences if the model wraps JSON in them."""
    text = text.strip()
    if text.startswith("```"):
        first_newline = text.index("\n")
        text = text[first_newline + 1:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


@router.post(
    "/recommend-assignment",
    response_model=SmartAssignResponse,
    summary="Get AI-recommended vehicle & driver for a trip",
    description=(
        "Provide trip details and lists of available vehicles/drivers. "
        "The AI uses a hybrid scoring algorithm + Gemini reasoning to recommend "
        "the best combination with explanations."
    ),
)
async def recommend_assignment(request: SmartAssignRequest):
    """
    Smart assignment uses a 3-step approach:
    1. Pre-filter: Remove vehicles that can't carry the cargo and drivers with expired licenses.
    2. Score: Rank remaining candidates using a weighted scoring algorithm.
    3. AI Reasoning: Use Gemini to validate rankings and generate human-readable explanations.
    """
    warnings = []

    try:
        # ══════════════════════════════════════════════════════════════
        # Step 1: Pre-filter
        # ══════════════════════════════════════════════════════════════
        valid_vehicles, vehicle_rejections = _prefilter_vehicles(
            request.available_vehicles, request.trip.cargo_weight_kg
        )
        valid_drivers, driver_rejections = _prefilter_drivers(
            request.available_drivers
        )

        warnings.extend(vehicle_rejections)
        warnings.extend(driver_rejections)

        if not valid_vehicles:
            return SmartAssignResponse(
                success=False,
                error="No available vehicle can carry the specified cargo weight.",
                warnings=warnings,
            )

        if not valid_drivers:
            return SmartAssignResponse(
                success=False,
                error="No available driver has a valid (non-expired) license.",
                warnings=warnings,
            )

        # ══════════════════════════════════════════════════════════════
        # Step 2: Score all candidates
        # ══════════════════════════════════════════════════════════════
        vehicle_scores = []
        for v in valid_vehicles:
            score = _score_vehicle(v, request.trip.cargo_weight_kg, request.trip.planned_distance_km)
            vehicle_scores.append((v, score))
        vehicle_scores.sort(key=lambda x: x[1], reverse=True)

        driver_scores = []
        for d in valid_drivers:
            score = _score_driver(d, request.trip.planned_distance_km)
            driver_scores.append((d, score))
        driver_scores.sort(key=lambda x: x[1], reverse=True)

        # Add warnings for edge cases
        best_vehicle = vehicle_scores[0][0]
        utilization = request.trip.cargo_weight_kg / best_vehicle.max_capacity_kg
        if utilization > 0.95:
            warnings.append(
                f"Cargo is at {utilization * 100:.0f}% of {best_vehicle.name}'s capacity — very tight."
            )

        best_driver = driver_scores[0][0]
        days_left = _days_until_expiry(best_driver.license_expiry)
        if 0 < days_left <= 30:
            warnings.append(
                f"{best_driver.name}'s license expires in {days_left} days. Consider renewal."
            )

        # ══════════════════════════════════════════════════════════════
        # Step 3: Use Gemini for natural-language reasoning
        # ══════════════════════════════════════════════════════════════
        try:
            ai_input = {
                "trip": request.trip.model_dump(),
                "scored_vehicles": [
                    {"id": v.id, "name": v.name, "type": v.type,
                     "max_capacity_kg": v.max_capacity_kg, "score": s,
                     "odometer_km": v.odometer_km,
                     "avg_fuel_efficiency": v.avg_fuel_efficiency}
                    for v, s in vehicle_scores
                ],
                "scored_drivers": [
                    {"id": d.id, "name": d.name, "safety_score": d.safety_score,
                     "score": s, "license_expiry": d.license_expiry,
                     "trips_completed": d.trips_completed}
                    for d, s in driver_scores
                ],
            }

            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[
                    {"role": "user", "parts": [{"text": (
                        f"{SMART_ASSIGN_PROMPT}\n\n"
                        f"Here is the data:\n{json.dumps(ai_input, indent=2, default=str)}"
                    )}]}
                ],
            )

            cleaned = _clean_json_response(response.text)
            ai_result = json.loads(cleaned)

            # Build response from AI reasoning
            rec_v = ai_result.get("recommended_vehicle", {})
            rec_d = ai_result.get("recommended_driver", {})
            alt_v = ai_result.get("alternative_vehicle")
            alt_d = ai_result.get("alternative_driver")
            ai_warnings = ai_result.get("warnings", [])

            return SmartAssignResponse(
                success=True,
                recommended_vehicle=RecommendedEntity(
                    id=rec_v.get("id", vehicle_scores[0][0].id),
                    name=rec_v.get("name", vehicle_scores[0][0].name),
                    score=rec_v.get("score", vehicle_scores[0][1]),
                    reasons=rec_v.get("reasons", [f"Scored highest at {vehicle_scores[0][1]}/100"]),
                ),
                recommended_driver=RecommendedEntity(
                    id=rec_d.get("id", driver_scores[0][0].id),
                    name=rec_d.get("name", driver_scores[0][0].name),
                    score=rec_d.get("score", driver_scores[0][1]),
                    reasons=rec_d.get("reasons", [f"Scored highest at {driver_scores[0][1]}/100"]),
                ),
                alternative_vehicle=(
                    RecommendedEntity(**alt_v)
                    if alt_v and isinstance(alt_v, dict) and alt_v.get("id")
                    else (
                        RecommendedEntity(
                            id=vehicle_scores[1][0].id,
                            name=vehicle_scores[1][0].name,
                            score=vehicle_scores[1][1],
                            reasons=["Second-best scoring vehicle"],
                        ) if len(vehicle_scores) > 1 else None
                    )
                ),
                alternative_driver=(
                    RecommendedEntity(**alt_d)
                    if alt_d and isinstance(alt_d, dict) and alt_d.get("id")
                    else (
                        RecommendedEntity(
                            id=driver_scores[1][0].id,
                            name=driver_scores[1][0].name,
                            score=driver_scores[1][1],
                            reasons=["Second-best scoring driver"],
                        ) if len(driver_scores) > 1 else None
                    )
                ),
                warnings=warnings + ai_warnings,
            )

        except Exception:
            # ── Fallback: Return rule-based results without AI reasoning ──
            traceback.print_exc()
            return SmartAssignResponse(
                success=True,
                recommended_vehicle=RecommendedEntity(
                    id=vehicle_scores[0][0].id,
                    name=vehicle_scores[0][0].name,
                    score=vehicle_scores[0][1],
                    reasons=[
                        f"Best capacity fit: {request.trip.cargo_weight_kg}/{vehicle_scores[0][0].max_capacity_kg}kg "
                        f"({utilization * 100:.0f}% utilization)",
                        f"Odometer: {vehicle_scores[0][0].odometer_km} km",
                    ],
                ),
                recommended_driver=RecommendedEntity(
                    id=driver_scores[0][0].id,
                    name=driver_scores[0][0].name,
                    score=driver_scores[0][1],
                    reasons=[
                        f"Safety score: {driver_scores[0][0].safety_score}/100",
                        f"License valid for {days_left} more days",
                        f"Completed {driver_scores[0][0].trips_completed} trips",
                    ],
                ),
                alternative_vehicle=(
                    RecommendedEntity(
                        id=vehicle_scores[1][0].id,
                        name=vehicle_scores[1][0].name,
                        score=vehicle_scores[1][1],
                        reasons=["Second-best scoring vehicle"],
                    ) if len(vehicle_scores) > 1 else None
                ),
                alternative_driver=(
                    RecommendedEntity(
                        id=driver_scores[1][0].id,
                        name=driver_scores[1][0].name,
                        score=driver_scores[1][1],
                        reasons=["Second-best scoring driver"],
                    ) if len(driver_scores) > 1 else None
                ),
                warnings=warnings + ["AI reasoning unavailable — used rule-based scoring as fallback."],
            )

    except Exception as e:
        traceback.print_exc()
        return SmartAssignResponse(
            success=False,
            error=f"An error occurred: {str(e)}",
            warnings=warnings,
        )
