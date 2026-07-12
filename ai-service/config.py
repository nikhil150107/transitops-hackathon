"""
TransitOps AI Service — Configuration
Loads environment variables and defines constants used across all AI endpoints.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── Gemini API ──────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"          # Fast + supports vision
GEMINI_MODEL_PRO = "gemini-2.5-flash"      # For complex reasoning (Text-to-SQL)

# ── Database Schema (for Text-to-SQL) ──────────────────────────────────────
# This mirrors the TransitOps backend database.
# The AI uses this schema to generate accurate MySQL queries.
TRANSITOPS_DB_SCHEMA = """
-- TransitOps MySQL Database Schema

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('fleet_manager', 'driver', 'safety_officer', 'financial_analyst') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    type ENUM('Truck', 'Van', 'Bus', 'Car', 'Tanker') NOT NULL,
    max_capacity_kg DECIMAL(10, 2) NOT NULL,
    odometer_km DECIMAL(12, 2) DEFAULT 0,
    acquisition_cost DECIMAL(12, 2) DEFAULT 0,
    status ENUM('Available', 'On Trip', 'In Shop', 'Retired') DEFAULT 'Available',
    region VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20),
    license_expiry DATE NOT NULL,
    contact_number VARCHAR(20),
    safety_score DECIMAL(5, 2) DEFAULT 100.00,
    trips_completed INT DEFAULT 0,
    status ENUM('Available', 'On Trip', 'Off Duty', 'Suspended') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    vehicle_id INT NOT NULL,
    driver_id INT NOT NULL,
    cargo_weight_kg DECIMAL(10, 2) NOT NULL,
    planned_distance_km DECIMAL(10, 2),
    actual_distance_km DECIMAL(10, 2),
    fuel_consumed_liters DECIMAL(10, 2),
    start_odometer DECIMAL(12, 2),
    end_odometer DECIMAL(12, 2),
    revenue DECIMAL(12, 2) DEFAULT 0,
    status ENUM('Draft', 'Dispatched', 'Completed', 'Cancelled') DEFAULT 'Draft',
    dispatched_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

CREATE TABLE maintenance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    maintenance_type ENUM('Oil Change', 'Tire Replacement', 'Engine Repair', 'Brake Service', 'General Service', 'Other') NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    status ENUM('Active', 'Closed') DEFAULT 'Active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE fuel_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    trip_id INT,
    liters DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    odometer_at_fill DECIMAL(12, 2),
    fuel_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT,
    trip_id INT,
    category ENUM('Fuel', 'Maintenance', 'Toll', 'Insurance', 'Permit', 'Other') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (trip_id) REFERENCES trips(id)
);
"""

# ── Receipt Scanner Prompt ─────────────────────────────────────────────────
RECEIPT_SCANNER_PROMPT = """You are an expert receipt and invoice data extractor for a transport/logistics company.

Analyze the uploaded image carefully and extract the following fields. Return ONLY a valid JSON object with these keys:

{
  "date": "YYYY-MM-DD format, or null if not found",
  "vendor_name": "Name of the fuel station, garage, or vendor, or null",
  "fuel_liters": "Number of liters of fuel (as a float), or null if not a fuel receipt",
  "total_cost": "Total amount paid (as a float), or null if not found",
  "currency": "Currency code like INR, USD, etc., or null",
  "expense_type": "One of: fuel, maintenance, toll, insurance, permit, other",
  "vehicle_registration": "Vehicle registration number if visible on the receipt, or null",
  "notes": "Any other relevant details like odometer reading, payment method, etc."
}

Rules:
- If the image is NOT a receipt or invoice, return: {"error": "The uploaded image does not appear to be a receipt or invoice.", "success": false}
- If a field is not visible or unclear, set it to null. Do NOT guess.
- Return ONLY the JSON object. No markdown, no explanation, no code fences.
"""

# ── Text-to-SQL System Prompt ──────────────────────────────────────────────
TEXT_TO_SQL_PROMPT = f"""You are an expert MySQL query generator for a transport fleet management system called TransitOps.

Here is the database schema:

{TRANSITOPS_DB_SCHEMA}

Your job:
1. Read the user's natural language question.
2. Generate a valid MySQL query that answers it.
3. Provide a brief explanation of what the query does.

Rules:
- Generate ONLY valid MySQL syntax (use DATE_SUB, NOW(), LIMIT, etc.).
- Never use DELETE, DROP, TRUNCATE, ALTER, UPDATE, INSERT, or any data-modifying statements. Only SELECT queries.
- Always use table aliases for readability.
- If the question is ambiguous, make reasonable assumptions and mention them in the explanation.
- If the question cannot be answered with the given schema, say so.

Return ONLY a valid JSON object:
{{
  "sql": "SELECT ...",
  "explanation": "This query ...",
  "assumptions": ["assumption 1", "assumption 2"]
}}

No markdown, no code fences, ONLY the JSON object.
"""

# ── Smart Assignment Prompt ────────────────────────────────────────────────
SMART_ASSIGN_PROMPT = """You are a fleet dispatch optimization assistant for TransitOps.

Given a trip request and lists of available vehicles and drivers, recommend the BEST vehicle and driver combination.

Scoring criteria for VEHICLES (rank by priority):
1. Capacity Fit: Vehicle capacity must be >= cargo weight. Prefer vehicles where utilization (cargo/capacity) is 70-95% (efficient use without overloading).
2. Fuel Efficiency: Prefer vehicles with higher avg_fuel_efficiency (km/liter).
3. Lower Odometer: Prefer newer/less-used vehicles.
4. Type Match: Prefer vehicle types appropriate for the distance (Trucks for long haul, Vans for short).

Scoring criteria for DRIVERS (rank by priority):
1. Safety Score: Higher is better.
2. License Validity: Must not be expired. Prefer drivers with more days remaining.
3. Experience: Prefer drivers with more trips_completed.

Return ONLY a valid JSON object:
{
  "recommended_vehicle": {
    "id": <vehicle_id>,
    "name": "<vehicle_name>",
    "score": <0-100>,
    "reasons": ["reason1", "reason2"]
  },
  "recommended_driver": {
    "id": <driver_id>,
    "name": "<driver_name>",
    "score": <0-100>,
    "reasons": ["reason1", "reason2"]
  },
  "alternative_vehicle": { ... } or null,
  "alternative_driver": { ... } or null,
  "warnings": ["any warnings like tight capacity or license expiring soon"]
}

No markdown, no code fences, ONLY the JSON object.
"""
