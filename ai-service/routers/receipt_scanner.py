"""
TransitOps AI Service — Feature 1: Receipt Scanner
Accepts an uploaded image of a fuel receipt, maintenance invoice, or toll slip.
Uses Gemini Vision to extract structured data (date, cost, liters, vendor, etc.).
"""

import json
import traceback

from fastapi import APIRouter, UploadFile, File, HTTPException
from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_MODEL, RECEIPT_SCANNER_PROMPT
from schemas import ReceiptScanResponse, ReceiptData

router = APIRouter(prefix="/ai", tags=["Receipt Scanner"])

# ── Initialize Gemini Client ───────────────────────────────────────────────
client = genai.Client(api_key=GEMINI_API_KEY)


def _clean_json_response(text: str) -> str:
    """Strip markdown code fences if the model wraps JSON in them."""
    text = text.strip()
    if text.startswith("```"):
        # Remove opening fence (```json or ```)
        first_newline = text.index("\n")
        text = text[first_newline + 1:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


@router.post(
    "/scan-receipt",
    response_model=ReceiptScanResponse,
    summary="Scan a receipt image and extract data",
    description=(
        "Upload an image (JPEG, PNG, WEBP) of a fuel receipt, maintenance invoice, "
        "or toll slip. The AI will extract date, vendor, cost, liters, and more."
    ),
)
async def scan_receipt(image: UploadFile = File(..., description="Receipt image file")):
    """
    Process a receipt image through Gemini Vision and return structured data.

    Supported formats: JPEG, PNG, WEBP, GIF
    Max recommended size: 10 MB
    """
    # ── Validate file type ─────────────────────────────────────────────
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {image.content_type}. Allowed: {allowed_types}",
        )

    try:
        # ── Read image bytes ───────────────────────────────────────────
        image_bytes = await image.read()

        if len(image_bytes) > 20 * 1024 * 1024:  # 20 MB limit
            raise HTTPException(status_code=400, detail="Image too large. Maximum size is 20 MB.")

        # ── Call Gemini Vision ─────────────────────────────────────────
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=[
                types.Content(
                    parts=[
                        types.Part.from_text(text=RECEIPT_SCANNER_PROMPT),
                        types.Part.from_bytes(data=image_bytes, mime_type=image.content_type),
                    ]
                )
            ],
        )

        # ── Parse the response ─────────────────────────────────────────
        raw_text = response.text
        cleaned = _clean_json_response(raw_text)
        parsed = json.loads(cleaned)

        # Check if the AI flagged the image as not a receipt
        if parsed.get("success") is False or parsed.get("error"):
            return ReceiptScanResponse(
                success=False,
                error=parsed.get("error", "Could not extract data from the image."),
                confidence="low",
            )

        # ── Determine confidence level ─────────────────────────────────
        filled_fields = sum(
            1 for v in parsed.values() if v is not None and v != ""
        )
        total_fields = 8  # Total expected fields
        if filled_fields >= 6:
            confidence = "high"
        elif filled_fields >= 3:
            confidence = "medium"
        else:
            confidence = "low"

        # ── Build response ─────────────────────────────────────────────
        receipt_data = ReceiptData(
            date=parsed.get("date"),
            vendor_name=parsed.get("vendor_name"),
            fuel_liters=parsed.get("fuel_liters"),
            total_cost=parsed.get("total_cost"),
            currency=parsed.get("currency"),
            expense_type=parsed.get("expense_type"),
            vehicle_registration=parsed.get("vehicle_registration"),
            notes=parsed.get("notes"),
        )

        return ReceiptScanResponse(
            success=True,
            data=receipt_data,
            confidence=confidence,
        )

    except json.JSONDecodeError:
        return ReceiptScanResponse(
            success=False,
            error="AI returned an invalid response. Please try again with a clearer image.",
            confidence="low",
        )
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        return ReceiptScanResponse(
            success=False,
            error=f"An error occurred while processing the receipt: {str(e)}",
            confidence="low",
        )
