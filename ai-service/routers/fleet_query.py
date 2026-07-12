"""
TransitOps AI Service — Feature 2: Natural Language Fleet Query
Accepts a plain English question about fleet operations.
Uses Gemini to generate a safe MySQL SELECT query.
The backend executes the query — this service only generates it.
"""

import json
import re
import traceback

from fastapi import APIRouter, HTTPException
from google import genai

from config import GEMINI_API_KEY, GEMINI_MODEL_PRO, TEXT_TO_SQL_PROMPT
from schemas import FleetQueryRequest, FleetQueryResponse

router = APIRouter(prefix="/ai", tags=["Fleet Query"])

# ── Initialize Gemini Client ───────────────────────────────────────────────
client = genai.Client(api_key=GEMINI_API_KEY)

# ── Dangerous SQL patterns (safety net) ────────────────────────────────────
DANGEROUS_PATTERNS = [
    r"\bDROP\b", r"\bDELETE\b", r"\bTRUNCATE\b", r"\bALTER\b",
    r"\bINSERT\b", r"\bUPDATE\b", r"\bCREATE\b", r"\bGRANT\b",
    r"\bREVOKE\b", r"\bEXEC\b", r"\bEXECUTE\b", r"\bCALL\b",
    r"\bSET\b", r"\bLOAD\b",
]


def _clean_json_response(text: str) -> str:
    """Strip markdown code fences if the model wraps JSON in them."""
    text = text.strip()
    if text.startswith("```"):
        first_newline = text.index("\n")
        text = text[first_newline + 1:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


def _is_safe_query(sql: str) -> bool:
    """Check that the generated SQL is a read-only SELECT query."""
    sql_upper = sql.upper().strip()

    # Must start with SELECT or WITH (for CTEs)
    if not (sql_upper.startswith("SELECT") or sql_upper.startswith("WITH")):
        return False

    # Check for dangerous keywords
    for pattern in DANGEROUS_PATTERNS:
        if re.search(pattern, sql_upper):
            return False

    return True


@router.post(
    "/query",
    response_model=FleetQueryResponse,
    summary="Ask a question about your fleet in plain English",
    description=(
        "Send a natural language question like 'Which vehicle consumed the most fuel this month?' "
        "and receive a MySQL query that answers it. The backend team executes the query."
    ),
)
async def fleet_query(request: FleetQueryRequest):
    """
    Convert a natural language question into a safe MySQL SELECT query.

    The AI has knowledge of the full TransitOps database schema and generates
    accurate queries. It will NEVER generate data-modifying statements.

    The response includes the SQL query, an explanation, and any assumptions made.
    """
    try:
        # ── Call Gemini ────────────────────────────────────────────────
        response = client.models.generate_content(
            model=GEMINI_MODEL_PRO,
            contents=[
                {"role": "user", "parts": [{"text": f"{TEXT_TO_SQL_PROMPT}\n\nUser Question: {request.question}"}]}
            ],
        )

        # ── Parse response ─────────────────────────────────────────────
        raw_text = response.text
        cleaned = _clean_json_response(raw_text)
        parsed = json.loads(cleaned)

        sql = parsed.get("sql", "")
        explanation = parsed.get("explanation", "")
        assumptions = parsed.get("assumptions", [])

        # ── Safety check ───────────────────────────────────────────────
        if not sql:
            return FleetQueryResponse(
                success=False,
                error="The AI could not generate a query for this question. Try rephrasing.",
            )

        if not _is_safe_query(sql):
            return FleetQueryResponse(
                success=False,
                error="The generated query was blocked by safety filters. Only SELECT queries are allowed.",
            )

        return FleetQueryResponse(
            success=True,
            sql=sql,
            explanation=explanation,
            assumptions=assumptions,
        )

    except json.JSONDecodeError:
        return FleetQueryResponse(
            success=False,
            error="AI returned an invalid response. Please rephrase your question.",
        )
    except Exception as e:
        traceback.print_exc()
        return FleetQueryResponse(
            success=False,
            error=f"An error occurred: {str(e)}",
        )
