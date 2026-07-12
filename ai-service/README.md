# TransitOps AI Service 🤖

AI-powered microservice for the TransitOps fleet management platform. Built with **FastAPI** and **Google Gemini**.

## Features

| # | Feature | Endpoint | Description |
|---|---------|----------|-------------|
| 1 | **Receipt Scanner** | `POST /ai/scan-receipt` | Upload a receipt image → get structured data (date, cost, liters, vendor) |
| 2 | **Fleet Query** | `POST /ai/query` | Ask a question in English → get a MySQL query |
| 3 | **Smart Assignment** | `POST /ai/recommend-assignment` | Get AI-recommended vehicle & driver for a trip |

---

## Quick Start

### 1. Prerequisites
- Python 3.10+
- A Google Gemini API key ([get one free here](https://aistudio.google.com))

### 2. Setup

```bash
# Navigate to the AI service directory
cd ai-service

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 3. Run the server

```bash
uvicorn main:app --reload --port 8001
```

### 4. Open Swagger Docs

Visit **http://localhost:8001/docs** to see all endpoints with interactive testing.

---

## API Reference

### `GET /` — Health Check

```bash
curl http://localhost:8001/
```

Response:
```json
{
  "status": "healthy",
  "service": "TransitOps AI Service",
  "version": "1.0.0",
  "features": ["receipt-scanner", "fleet-query", "smart-assignment"]
}
```

---

### `POST /ai/scan-receipt` — Receipt Scanner

Upload a fuel receipt, maintenance invoice, or toll slip image.

```bash
curl -X POST http://localhost:8001/ai/scan-receipt \
  -F "image=@receipt.jpg"
```

Response:
```json
{
  "success": true,
  "data": {
    "date": "2026-07-10",
    "vendor_name": "IndianOil",
    "fuel_liters": 45.5,
    "total_cost": 4823.0,
    "currency": "INR",
    "expense_type": "fuel",
    "vehicle_registration": "MH-12-AB-1234",
    "notes": "Odometer: 45,230 km"
  },
  "confidence": "high"
}
```

---

### `POST /ai/query` — Natural Language Fleet Query

Ask a question about your fleet in plain English.

```bash
curl -X POST http://localhost:8001/ai/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Which vehicle had the highest maintenance cost last month?"}'
```

Response:
```json
{
  "success": true,
  "sql": "SELECT v.vehicle_name, SUM(m.cost) AS total_cost FROM vehicles v JOIN maintenance_logs m ON v.id = m.vehicle_id WHERE m.started_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) GROUP BY v.id, v.vehicle_name ORDER BY total_cost DESC LIMIT 1;",
  "explanation": "Joins vehicles with maintenance logs from the last 30 days and finds the vehicle with the highest total maintenance cost.",
  "assumptions": ["'Last month' means the last 30 days from now."]
}
```

> ⚠️ **Important:** This endpoint generates SQL but does NOT execute it. The backend team should execute the returned query against their MySQL database.

---

### `POST /ai/recommend-assignment` — Smart Assignment

Get an AI-recommended vehicle and driver for a trip.

```bash
curl -X POST http://localhost:8001/ai/recommend-assignment \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

Response:
```json
{
  "success": true,
  "recommended_vehicle": {
    "id": 1,
    "name": "Van-05",
    "score": 92.5,
    "reasons": [
      "Best capacity fit: 90% utilization (450/500 kg)",
      "Strong fuel efficiency: 8.5 km/l",
      "Lower odometer (12,000 km) indicates less wear"
    ]
  },
  "recommended_driver": {
    "id": 1,
    "name": "Alex",
    "score": 95.0,
    "reasons": [
      "Highest safety score: 92/100",
      "License valid for 188 more days",
      "Experienced: 45 trips completed"
    ]
  },
  "alternative_vehicle": {
    "id": 2,
    "name": "Truck-12",
    "score": 55.0,
    "reasons": ["Significantly oversized for this cargo"]
  },
  "alternative_driver": {
    "id": 2,
    "name": "Priya",
    "score": 91.0,
    "reasons": ["Second-best scoring driver"]
  },
  "warnings": []
}
```

---

## Integration Guide for Backend Team

### How to call the AI Service from your backend (Node.js example)

```javascript
// Example: Call the receipt scanner from your Express.js backend
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

const AI_SERVICE_URL = 'http://localhost:8001';

// Feature 1: Scan a receipt
async function scanReceipt(imagePath) {
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));

  const response = await axios.post(`${AI_SERVICE_URL}/ai/scan-receipt`, form, {
    headers: form.getHeaders(),
  });
  return response.data;
}

// Feature 2: Ask a fleet question
async function queryFleet(question) {
  const response = await axios.post(`${AI_SERVICE_URL}/ai/query`, { question });
  // Execute the returned SQL against your MySQL database
  const sql = response.data.sql;
  // const results = await db.query(sql);  // Your DB connection
  return response.data;
}

// Feature 3: Get smart assignment recommendation
async function getRecommendation(tripData, vehicles, drivers) {
  const response = await axios.post(`${AI_SERVICE_URL}/ai/recommend-assignment`, {
    trip: tripData,
    available_vehicles: vehicles,
    available_drivers: drivers,
  });
  return response.data;
}
```

### How to call the AI Service from your backend (Java/Spring Boot example)

```java
// Feature 2: Fleet query example using RestTemplate
RestTemplate restTemplate = new RestTemplate();
String url = "http://localhost:8001/ai/query";

Map<String, String> body = Map.of("question", "Show top 5 drivers by safety score");
ResponseEntity<Map> response = restTemplate.postForEntity(url, body, Map.class);

String sql = (String) response.getBody().get("sql");
// Execute sql against your MySQL database
```

---

## Project Structure

```
ai-service/
├── main.py                  # FastAPI app entry point
├── config.py                # API keys, prompts, DB schema
├── schemas.py               # Pydantic request/response models
├── requirements.txt         # Python dependencies
├── .env                     # API key (not committed to git)
├── .env.example             # Template for .env
├── .gitignore               # Excludes .env and Python artifacts
└── routers/
    ├── __init__.py
    ├── receipt_scanner.py   # Feature 1: Receipt image → JSON
    ├── fleet_query.py       # Feature 2: English → MySQL query
    └── smart_assign.py      # Feature 3: Smart vehicle/driver pairing
```
