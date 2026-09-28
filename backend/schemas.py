"""
LegalEase – Pydantic Schemas for Document Generation & API Request/Response Models.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DocumentType(str, Enum):
    NDA = "NDA"
    CONTRACT = "Contract"
    LEASE = "Lease Agreement"
    EMPLOYMENT = "Employment Agreement"
    FREELANCE = "Freelance Agreement"
    SERVICE = "Service Agreement"
    GENERAL_CONTRACT = "General Contract"


class PartyRole(str, Enum):
    DISCLOSER = "Discloser"
    RECIPIENT = "Recipient"
    LANDLORD = "Landlord"
    TENANT = "Tenant"
    EMPLOYER = "Employer"
    EMPLOYEE = "Employee"
    CONTRACTOR = "Contractor"
    CLIENT = "Client"
    SERVICE_PROVIDER = "Service Provider"
    OTHER = "Other"


class PartyLegalType(str, Enum):
    INDIVIDUAL = "Individual"
    CORPORATION = "Corporation"
    LLC = "Limited Liability Company (LLC)"
    PARTNERSHIP = "Partnership"
    SOLE_PROPRIETORSHIP = "Sole Proprietorship"
    OTHER = "Other Legal Entity"


class PartyInput(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., min_length=1, description="Legal full name of the party or business")
    role: PartyRole = Field(..., description="Role in this specific agreement")
    legal_type: PartyLegalType = Field(default=PartyLegalType.INDIVIDUAL, description="Type of legal entity")
    address: str = Field(..., min_length=1, description="Official street address or registered office")
    signatory_name: Optional[str] = Field(None, description="Authorized representative name (if entity)")
    signatory_title: Optional[str] = Field(None, description="Title of representative (e.g. CEO, Managing Partner)")


class CustomClauseInput(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=1, description="Clause title, e.g. Intellectual Property Ownership")
    requirements: str = Field(..., min_length=1, description="Specific terms, instructions, or restrictions")


class ClauseConfigInput(BaseModel):
    purpose: Optional[str] = Field("Evaluating potential business cooperation and strategic transaction", description="Primary purpose of this agreement or disclosure")
    jurisdiction: str = Field("State of California, United States", description="Applicable state/province and country")
    governing_law: str = Field("Laws of the State of California", description="Governing legal jurisdiction")
    effective_date: str = Field("Upon execution by both parties", description="Date the agreement becomes active")
    confidentiality_term: Optional[str] = Field("2 years from disclosure", description="Duration of confidentiality obligations")
    non_compete_duration: Optional[str] = Field("12 months", description="Duration of non-compete restriction (if applicable)")
    non_compete_scope: Optional[str] = Field("Direct competition within 50 miles", description="Geographic and industry scope")
    payment_terms: Optional[str] = Field("Net 30 days upon invoice receipt", description="Payment schedule, milestones, consideration")
    termination_notice: Optional[str] = Field("30 days written notice", description="Termination procedure and required notice period")
    dispute_resolution: Optional[str] = Field("Binding Arbitration under AAA rules", description="Dispute resolution mechanism")
    custom_clauses: List[CustomClauseInput] = Field(default_factory=list, description="User-defined specific clauses")


class GenerateDocumentRequest(BaseModel):
    document_type: DocumentType = Field(..., description="Type of legal document to generate")
    custom_title: Optional[str] = Field(None, description="Optional custom document title")
    parties: List[PartyInput] = Field(..., min_length=1, description="Parties entering into this agreement")
    clauses: ClauseConfigInput = Field(default_factory=ClauseConfigInput, description="Clause configuration and parameters")
    additional_notes: Optional[str] = Field(None, description="Optional context or special instructions")


class DocumentSection(BaseModel):
    number: int = Field(..., description="Numbered section order, starting at 1")
    heading: str = Field(..., description="Section title, e.g., '1. Confidentiality Obligations'")
    content: str = Field(..., description="Full legal clause text for this section")


class DocumentParty(BaseModel):
    name: str
    role: str
    legal_type: str
    address: str


class DocumentSignature(BaseModel):
    party_name: str
    role: str
    signatory_name: Optional[str] = None
    signatory_title: Optional[str] = None
    date: str = "___________"


class DocumentMetadata(BaseModel):
    jurisdiction: str
    governing_law: str
    effective_date: str
    disclaimer: str
    generated_at: str
    model_used: str
    is_demo_mode: bool = False


class GeneratedDocumentResponse(BaseModel):
    id: str
    title: str
    document_type: str
    parties: List[DocumentParty]
    recitals: List[str]
    sections: List[DocumentSection]
    signatures: List[DocumentSignature]
    metadata: DocumentMetadata
    raw_text_fallback: Optional[str] = None


class TemplateSummary(BaseModel):
    id: str
    name: str
    document_type: DocumentType
    description: str
    recommended_parties: List[Dict[str, str]]
    default_clause_settings: Dict[str, Any]


class HealthResponse(BaseModel):
    status: str
    service: str
    gemini_configured: bool
    mode: str
    version: str
