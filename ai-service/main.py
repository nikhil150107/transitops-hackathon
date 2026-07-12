"""
TransitOps AI Service
=====================
A standalone AI microservice that provides 3 intelligent features
for the TransitOps fleet management platform:

  1. POST /ai/scan-receipt     — Extract data from receipt images (Gemini Vision)
  2. POST /ai/query            — Natural language → MySQL query (Text-to-SQL)
  3. POST /ai/recommend-assignment — Smart vehicle & driver recommendation

Run with:
    uvicorn main:app --reload --port 8001

Swagger docs:
    http://localhost:8001/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import HealthResponse
from routers import receipt_scanner, fleet_query, smart_assign

# ── Create FastAPI App ─────────────────────────────────────────────────────
app = FastAPI(
    title="TransitOps AI Service",
    description=(
        "AI-powered microservice for TransitOps fleet management. "
        "Provides receipt scanning, natural language fleet analytics, "
        "and smart driver/vehicle assignment recommendations."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Middleware ────────────────────────────────────────────────────────
# Allow all origins during development. The backend team can restrict this later.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ──────────────────────────────────────────────────────
app.include_router(receipt_scanner.router)
app.include_router(fleet_query.router)
app.include_router(smart_assign.router)


# ── Health Check ───────────────────────────────────────────────────────────
@app.get("/", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint. Returns service status and available features.
    Use this to verify the AI service is running before making API calls.
    """
    return HealthResponse()
