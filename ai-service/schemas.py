"""
TransitOps AI Service — Pydantic Schemas
Defines request/response models for all AI endpoints.
These auto-generate Swagger documentation.
"""

from __future__ import annotations
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


# ═══════════════════════════════════════════════════════════════════════════
# Feature 1: Receipt Scanner
# ═══════════════════════════════════════════════════════════════════════════

class ReceiptData(BaseModel):
    """Extracted data from a scanned receipt."""
    date: Optional[str] = Field(None, description="Date in YYYY-MM-DD format")
    vendor_name: Optional[str] = Field(None, description="Fuel station or vendor name")
    fuel_liters: Optional[float] = Field(None, description="Liters of fuel purchased")
    total_cost: Optional[float] = Field(None, description="Total amount paid")
    currency: Optional[str] = Field(None, description="Currency code (INR, USD, etc.)")
    expense_type: Optional[str] = Field(None, description="fuel, maintenance, toll, insurance, permit, or other")
    vehicle_registration: Optional[str] = Field(None, description="Vehicle registration number if visible")
    notes: Optional[str] = Field(None, description="Additional details like odometer, payment method")


class ReceiptScanResponse(BaseModel):
    """Response from the receipt scanner endpoint."""
    success: bool = True
    data: Optional[ReceiptData] = None
    confidence: str = Field("medium", description="high, medium, or low")
    error: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# Feature 2: Natural Language Fleet Query
# ═══════════════════════════════════════════════════════════════════════════

class FleetQueryRequest(BaseModel):
    """Natural language question about fleet operations."""
    question: str = Field(..., description="Question in plain English", min_length=5, max_length=500)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {"question": "Which vehicle had the highest maintenance cost last month?"},
                {"question": "How many trips were completed this week?"},
                {"question": "Show me the top 5 drivers by safety score"},
                {"question": "What is the total fuel cost for all trucks?"},
            ]
        }
    }


class FleetQueryResponse(BaseModel):
    """Generated SQL query from a natural language question."""
    success: bool = True
    sql: Optional[str] = Field(None, description="Generated MySQL query (SELECT only)")
    explanation: Optional[str] = Field(None, description="What the query does in plain English")
    assumptions: Optional[list[str]] = Field(default_factory=list, description="Assumptions made by the AI")
    error: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# Feature 3: Smart Driver & Vehicle Recommendation
# ═══════════════════════════════════════════════════════════════════════════

class TripRequest(BaseModel):
    """Details of the trip to be assigned."""
    source: str = Field(..., description="Starting location")
    destination: str = Field(..., description="Destination location")
    cargo_weight_kg: float = Field(..., gt=0, description="Weight of cargo in kg")
    planned_distance_km: Optional[float] = Field(None, gt=0, description="Planned trip distance in km")


class VehicleCandidate(BaseModel):
    """An available vehicle that can be assigned to a trip."""
    id: int
    name: str = Field(..., description="Vehicle name/model")
    registration_number: Optional[str] = None
    type: str = Field(..., description="Truck, Van, Bus, Car, or Tanker")
    max_capacity_kg: float = Field(..., gt=0)
    odometer_km: float = Field(0, ge=0)
    avg_fuel_efficiency: Optional[float] = Field(None, ge=0, description="Average km per liter")


class DriverCandidate(BaseModel):
    """An available driver that can be assigned to a trip."""
    id: int
    name: str
    license_category: Optional[str] = None
    license_expiry: str = Field(..., description="License expiry date in YYYY-MM-DD format")
    safety_score: float = Field(..., ge=0, le=100)
    trips_completed: int = Field(0, ge=0)


class SmartAssignRequest(BaseModel):
    """Request to get AI-recommended vehicle and driver for a trip."""
    trip: TripRequest
    available_vehicles: list[VehicleCandidate] = Field(..., min_length=1)
    available_drivers: list[DriverCandidate] = Field(..., min_length=1)

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "trip": {
                        "source": "Mumbai",
                        "destination": "Pune",
                        "cargo_weight_kg": 450,
                        "planned_distance_km": 150
                    },
                    "available_vehicles": [
                        {"id": 1, "name": "Van-05", "type": "Van", "max_capacity_kg": 500, "odometer_km": 12000, "avg_fuel_efficiency": 8.5},
                        {"id": 2, "name": "Truck-12", "type": "Truck", "max_capacity_kg": 2000, "odometer_km": 45000, "avg_fuel_efficiency": 5.2}
                    ],
                    "available_drivers": [
                        {"id": 1, "name": "Alex", "license_expiry": "2027-01-15", "safety_score": 92, "trips_completed": 45},
                        {"id": 2, "name": "Priya", "license_expiry": "2026-12-01", "safety_score": 88, "trips_completed": 60}
                    ]
                }
            ]
        }
    }


class RecommendedEntity(BaseModel):
    """A recommended vehicle or driver with scoring details."""
    id: int
    name: str
    score: float = Field(..., ge=0, le=100)
    reasons: list[str] = Field(default_factory=list)


class SmartAssignResponse(BaseModel):
    """AI-recommended vehicle and driver assignment."""
    success: bool = True
    recommended_vehicle: Optional[RecommendedEntity] = None
    recommended_driver: Optional[RecommendedEntity] = None
    alternative_vehicle: Optional[RecommendedEntity] = None
    alternative_driver: Optional[RecommendedEntity] = None
    warnings: list[str] = Field(default_factory=list)
    error: Optional[str] = None


# ═══════════════════════════════════════════════════════════════════════════
# Health Check
# ═══════════════════════════════════════════════════════════════════════════

class HealthResponse(BaseModel):
    """Health check response."""
    status: str = "healthy"
    service: str = "TransitOps AI Service"
    version: str = "1.0.0"
    features: list[str] = [
        "receipt-scanner",
        "fleet-query",
        "smart-assignment",
    ]
