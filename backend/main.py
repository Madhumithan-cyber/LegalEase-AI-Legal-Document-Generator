"""
LegalEase – AI-Powered Legal Document Generator
FastAPI Backend Application.
"""

import os
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .schemas import (
    GenerateDocumentRequest,
    GeneratedDocumentResponse,
    TemplateSummary,
    HealthResponse,
)
from .templates import STARTER_TEMPLATES
from .generator import generate_document_ai

app = FastAPI(
    title="LegalEase API",
    description="AI-powered legal contract and agreement generation engine powered by Google Gemini",
    version="1.0.0",
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local dev and preview hosts
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def get_health():
    """Health check endpoint indicating service availability and Gemini configuration status."""
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    is_configured = bool(key and key not in ["MY_GEMINI_API_KEY", "your_gemini_api_key_here"])
    mode = "Gemini AI Online (gemini-3.8-flash)" if is_configured else "Deterministic Demo Mode"
    return HealthResponse(
        status="healthy",
        service="LegalEase Backend (FastAPI + Pydantic)",
        gemini_configured=is_configured,
        mode=mode,
        version="1.0.0",
    )


@app.get("/api/templates", response_model=List[TemplateSummary])
def get_templates():
    """Returns curated starter templates for contracts, NDAs, and agreements."""
    return STARTER_TEMPLATES


@app.get("/api/templates/{template_id}", response_model=TemplateSummary)
def get_template_by_id(template_id: str):
    """Retrieve details for a specific template."""
    for t in STARTER_TEMPLATES:
        if t.id == template_id:
            return t
    raise HTTPException(status_code=404, detail="Template not found")


@app.post("/api/generate-document", response_model=GeneratedDocumentResponse)
def generate_document_endpoint(req: GenerateDocumentRequest):
    """
    Primary legal document generation endpoint.
    Validates payload with Pydantic, passes to Gemini generator, and returns
    structured legal document with safe Demo Mode fallback.
    """
    if not req.parties:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one party must be specified to draft a legal agreement.",
        )

    doc, warning = generate_document_ai(req)
    
    # Return document response with warning headers if in demo mode
    response = JSONResponse(content=doc.model_dump())
    if warning:
        response.headers["X-LegalEase-Notice"] = warning
    return response


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host=host, port=port, reload=True)
