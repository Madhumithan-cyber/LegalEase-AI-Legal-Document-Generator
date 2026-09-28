"""
LegalEase – Deterministic Legal Templates & Starter Presets for Demo Mode.
Used when Gemini API key is missing or offline to guarantee college project demo continuity.
"""

import uuid
from datetime import datetime
from typing import List, Dict, Any
from .schemas import (
    DocumentType,
    PartyRole,
    PartyLegalType,
    GenerateDocumentRequest,
    GeneratedDocumentResponse,
    DocumentSection,
    DocumentParty,
    DocumentSignature,
    DocumentMetadata,
    TemplateSummary,
)

LEGAL_DISCLAIMER = (
    "DISCLAIMER: LegalEase is an educational and collegiate demonstration tool. "
    "The documents generated herein do not constitute formal legal advice and have not been "
    "tailored by an attorney. Users must have all agreements reviewed by a licensed legal professional "
    "in their applicable jurisdiction prior to execution."
)

STARTER_TEMPLATES: List[TemplateSummary] = [
    TemplateSummary(
        id="nda-bilateral",
        name="Mutual Non-Disclosure Agreement (NDA)",
        document_type=DocumentType.NDA,
        description="Standard bilateral confidentiality agreement protecting proprietary information and trade secrets.",
        recommended_parties=[
            {
                "role": PartyRole.DISCLOSER.value,
                "name": "Acme Innovations Inc.",
                "legal_type": PartyLegalType.CORPORATION.value,
                "address": "100 Tech Blvd, Suite 400, San Francisco, CA 94105",
                "signatory_name": "Jane Doe",
                "signatory_title": "Chief Technology Officer",
            },
            {
                "role": PartyRole.RECIPIENT.value,
                "name": "Vertex Strategic Partners LLC",
                "legal_type": PartyLegalType.LLC.value,
                "address": "500 Market St, Floor 12, San Francisco, CA 94102",
                "signatory_name": "John Smith",
                "signatory_title": "Managing Partner",
            },
        ],
        default_clause_settings={
            "jurisdiction": "State of California, United States",
            "governing_law": "Laws of the State of California",
            "effective_date": "Upon execution",
            "confidentiality_term": "2 years from disclosure date",
            "dispute_resolution": "Binding confidential arbitration under AAA rules in San Francisco, CA",
            "termination_notice": "30 days prior written notice",
        },
    ),
    TemplateSummary(
        id="freelance-master",
        name="Independent Freelance Agreement",
        document_type=DocumentType.FREELANCE,
        description="Clear scope of work, intellectual property transfer, milestone payments, and independent contractor terms.",
        recommended_parties=[
            {
                "role": PartyRole.CLIENT.value,
                "name": "Horizon Digital Media Corp.",
                "legal_type": PartyLegalType.CORPORATION.value,
                "address": "742 Evergreen Terrace, Austin, TX 78701",
                "signatory_name": "Sarah Connor",
                "signatory_title": "VP of Operations",
            },
            {
                "role": PartyRole.CONTRACTOR.value,
                "name": "Alex Morgan",
                "legal_type": PartyLegalType.INDIVIDUAL.value,
                "address": "123 Creative Studio Way, Austin, TX 78704",
                "signatory_name": "Alex Morgan",
                "signatory_title": "Independent Specialist",
            },
        ],
        default_clause_settings={
            "jurisdiction": "State of Texas, United States",
            "governing_law": "Laws of the State of Texas",
            "effective_date": "Upon execution",
            "payment_terms": "50% upfront deposit, 50% upon final acceptance; Net 15 days",
            "dispute_resolution": "Mediation followed by binding arbitration in Travis County, TX",
            "termination_notice": "14 days written notice by either party",
        },
    ),
    TemplateSummary(
        id="commercial-lease",
        name="Residential & Commercial Lease Agreement",
        document_type=DocumentType.LEASE,
        description="Comprehensive real estate lease covering premises, rent schedule, security deposits, and maintenance obligations.",
        recommended_parties=[
            {
                "role": PartyRole.LANDLORD.value,
                "name": "Apex Property Holdings LLC",
                "legal_type": PartyLegalType.LLC.value,
                "address": "250 Commercial Way, Seattle, WA 98101",
                "signatory_name": "Robert Sterling",
                "signatory_title": "Asset Manager",
            },
            {
                "role": PartyRole.TENANT.value,
                "name": "Elena Rostova",
                "legal_type": PartyLegalType.INDIVIDUAL.value,
                "address": "404 Pine St, Apt 3B, Seattle, WA 98101",
                "signatory_name": "Elena Rostova",
                "signatory_title": "Tenant",
            },
        ],
        default_clause_settings={
            "jurisdiction": "State of Washington, United States",
            "governing_law": "Laws of the State of Washington and municipal codes",
            "effective_date": "First day of upcoming calendar month",
            "payment_terms": "$2,500 due on the 1st of each month with a 5-day grace period",
            "termination_notice": "60 days written notice prior to term expiration",
            "dispute_resolution": "King County District Court",
        },
    ),
    TemplateSummary(
        id="employment-standard",
        name="Standard Employment Agreement",
        document_type=DocumentType.EMPLOYMENT,
        description="Full-time or part-time employment contract defining duties, compensation, at-will status, and benefits.",
        recommended_parties=[
            {
                "role": PartyRole.EMPLOYER.value,
                "name": "Beacon Health Technologies Inc.",
                "legal_type": PartyLegalType.CORPORATION.value,
                "address": "88 Science Park Drive, Boston, MA 02114",
                "signatory_name": "Dr. Michael Chen",
                "signatory_title": "Chief Executive Officer",
            },
            {
                "role": PartyRole.EMPLOYEE.value,
                "name": "David Ramirez",
                "legal_type": PartyLegalType.INDIVIDUAL.value,
                "address": "15 Commonwealth Ave, Boston, MA 02116",
                "signatory_name": "David Ramirez",
                "signatory_title": "Lead Software Engineer",
            },
        ],
        default_clause_settings={
            "jurisdiction": "Commonwealth of Massachusetts, United States",
            "governing_law": "Laws of the Commonwealth of Massachusetts",
            "effective_date": "Two weeks from date of signature",
            "confidentiality_term": "Perpetual for trade secrets; 3 years for confidential business data",
            "non_compete_duration": "12 months post-employment",
            "non_compete_scope": "Direct competitors within Massachusetts",
            "payment_terms": "Bi-weekly direct deposit at annualized rate",
            "termination_notice": "At-will employment; 2 weeks standard courtesy notice requested",
            "dispute_resolution": "Massachusetts Superior Court, Suffolk County",
        },
    ),
    TemplateSummary(
        id="service-level",
        name="Master Professional Services Agreement",
        document_type=DocumentType.SERVICE,
        description="Service agreement establishing warranties, deliverables, liability caps, and service level agreements (SLA).",
        recommended_parties=[
            {
                "role": PartyRole.SERVICE_PROVIDER.value,
                "name": "CloudSphere Solutions LLC",
                "legal_type": PartyLegalType.LLC.value,
                "address": "1200 Innovation Way, Denver, CO 80202",
                "signatory_name": "Amanda Vance",
                "signatory_title": "Managing Director",
            },
            {
                "role": PartyRole.CLIENT.value,
                "name": "Pinnacle Logistics Group",
                "legal_type": PartyLegalType.CORPORATION.value,
                "address": "450 Transportation Blvd, Denver, CO 80216",
                "signatory_name": "Marcus Vance",
                "signatory_title": "Chief Information Officer",
            },
        ],
        default_clause_settings={
            "jurisdiction": "State of Colorado, United States",
            "governing_law": "Laws of the State of Colorado",
            "effective_date": "Upon mutual signing",
            "payment_terms": "Monthly recurring billing, Net 30 payment terms with 1.5% late interest",
            "termination_notice": "60 days advance written notice for convenience",
            "dispute_resolution": "JAMS Commercial Arbitration in Denver, Colorado",
        },
    ),
    TemplateSummary(
        id="general-contract",
        name="General Commercial Contract",
        document_type=DocumentType.GENERAL_CONTRACT,
        description="Versatile multi-purpose commercial agreement adaptable for partnerships, licensing, and trade.",
        recommended_parties=[
            {
                "role": PartyRole.OTHER.value,
                "name": "First Party Commercial Group",
                "legal_type": PartyLegalType.CORPORATION.value,
                "address": "100 Business Center Drive, Chicago, IL 60601",
                "signatory_name": "Arthur Pendelton",
                "signatory_title": "Authorized Representative",
            },
            {
                "role": PartyRole.OTHER.value,
                "name": "Second Party Ventures LLC",
                "legal_type": PartyLegalType.LLC.value,
                "address": "200 Michigan Avenue, Chicago, IL 60604",
                "signatory_name": "Beatrice Stone",
                "signatory_title": "Managing Member",
            },
        ],
        default_clause_settings={
            "jurisdiction": "State of Illinois, United States",
            "governing_law": "Laws of the State of Illinois",
            "effective_date": "Date of final execution",
            "payment_terms": "Payment upon invoice within 30 calendar days",
            "termination_notice": "30 days prior written notice",
            "dispute_resolution": "Circuit Court of Cook County, Illinois",
        },
    ),
]


def generate_deterministic_demo_document(req: GenerateDocumentRequest) -> GeneratedDocumentResponse:
    """
    Generates a deterministic, fully structured professional legal document.
    Ensures 100% test and presentation reliability when Gemini is offline or unkeyed.
    """
    doc_id = f"legalease-{uuid.uuid4().hex[:8]}"
    doc_type = req.document_type.value
    title = req.custom_title or f"{doc_type.upper()} AGREEMENT"

    # Convert parties
    doc_parties: List[DocumentParty] = []
    signatures: List[DocumentSignature] = []
    now_str = datetime.now().strftime("%B %d, %Y")

    for p in req.parties:
        doc_parties.append(
            DocumentParty(
                name=p.name,
                role=p.role.value,
                legal_type=p.legal_type.value,
                address=p.address,
            )
        )
        signatures.append(
            DocumentSignature(
                party_name=p.name,
                role=p.role.value,
                signatory_name=p.signatory_name or p.name,
                signatory_title=p.signatory_title or ("Authorized Agent" if "Individual" not in p.legal_type.value else "Individual"),
                date=now_str,
            )
        )

    # Build Recitals
    p_names = " and ".join([f"'{p.name}' ({p.role.value})" for p in req.parties])
    purpose_text = req.clauses.purpose or "evaluating and executing a potential business relationship, technical collaboration, or commercial transaction"
    recitals = [
        f"WHEREAS, this {doc_type} is entered into as of {req.clauses.effective_date} by and between {p_names};",
        f"WHEREAS, the parties wish to disclose and exchange proprietary information for the primary purpose of: {purpose_text};",
        f"WHEREAS, the parties desire to set forth their mutual understandings, representations, and legal obligations under the laws of {req.clauses.jurisdiction};",
        "WHEREAS, both parties acknowledge having received adequate consideration, the sufficiency of which is hereby mutually acknowledged.",
    ]

    # Build Sections based on Document Type
    sections: List[DocumentSection] = []
    sec_num = 1

    if req.document_type == DocumentType.NDA:
        sections.append(DocumentSection(
            number=sec_num,
            heading="1. Purpose of Disclosure & Authorized Scope",
            content=(
                f"The Confidential Information disclosed under this Agreement shall be used strictly and exclusively for the purpose of: {purpose_text}. "
                f"The Recipient shall not utilize, disclose, or exploit any portion of the Confidential Information for any other commercial, proprietary, or competitive undertaking without the express prior written consent of the Discloser."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading=f"{sec_num}. Definition of Confidential Information",
            content=(
                "For purposes of this Agreement, 'Confidential Information' includes all non-public, proprietary information, "
                "trade secrets, technical data, source code, business operations, financial figures, customer directories, and "
                "strategic roadmaps disclosed directly or indirectly by either party to the other, whether marked as proprietary or "
                "reasonably understood to be confidential given the nature of disclosure."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading=f"{sec_num}. Non-Disclosure and Standard of Care",
            content=(
                f"The Recipient shall hold all Confidential Information in strict confidence and shall not disclose such information "
                f"to any third party without prior written authorization. The Recipient agrees to use at least the degree of care it "
                f"uses to protect its own proprietary materials of like sensitivity, but in no event less than a reasonable degree of care. "
                f"This confidentiality obligation shall endure for a duration of {req.clauses.confidentiality_term or '2 years from disclosure'}."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading="3. Permitted Exclusions",
            content=(
                "Confidential Information does not encompass information that: (a) becomes publicly known through no breach of this "
                "Agreement; (b) was lawfully within Recipient's possession prior to disclosure; (c) is independently developed without reference "
                "to Discloser's information; or (d) is required to be disclosed by competent court order with timely notice given to Discloser."
            )
        ))
        sec_num += 1

    elif req.document_type in [DocumentType.FREELANCE, DocumentType.SERVICE]:
        sections.append(DocumentSection(
            number=sec_num,
            heading="1. Scope of Engagement and Deliverables",
            content=(
                "The Service Provider / Contractor agrees to perform the designated professional services in accordance with the highest "
                "industry standards, meeting agreed-upon project specifications, milestones, and deadlines in a diligent and professional manner."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading="2. Compensation & Payment Terms",
            content=(
                f"In consideration for the satisfactory performance of services, Client shall compensate Contractor according to the following "
                f"terms: {req.clauses.payment_terms or 'Net 30 days upon submission of itemized invoices'}. Overdue balances shall accrue interest "
                f"at the rate of 1.5% per month or the legal statutory ceiling, whichever is lower."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading="3. Intellectual Property Rights & Work Made for Hire",
            content=(
                "Upon full payment of all consideration owed, all copyrights, patents, work product, source files, and trade secrets developed "
                "specifically for the Client shall be deemed 'work made for hire' and shall belong exclusively to the Client, free of any encumbrances."
            )
        ))
        sec_num += 1

    elif req.document_type == DocumentType.LEASE:
        sections.append(DocumentSection(
            number=sec_num,
            heading="1. Demised Premises and Term",
            content=(
                f"Landlord hereby leases to Tenant, and Tenant leases from Landlord, the designated premises described in this Agreement, "
                f"commencing on {req.clauses.effective_date} for the agreed contractual term unless sooner terminated pursuant to the terms herein."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading="2. Rent Schedule & Security Deposit",
            content=(
                f"Tenant shall pay rent according to the following schedule: {req.clauses.payment_terms or 'Payable monthly on the 1st day of each month'}. "
                f"A security deposit shall be deposited with Landlord to guarantee full and faithful compliance with all provisions of this Lease."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading="3. Maintenance, Alterations & Occupancy Rules",
            content=(
                "Tenant agrees to keep the premises in clean, sanitary order and shall make no structural alterations without prior written consent "
                "from Landlord. Tenant shall comply with all applicable local housing and fire safety codes."
            )
        ))
        sec_num += 1

    elif req.document_type == DocumentType.EMPLOYMENT:
        sections.append(DocumentSection(
            number=sec_num,
            heading="1. Position, Responsibilities & Duties",
            content=(
                "Employee shall be employed in the designated capacity and shall devote their best efforts, business time, and attention "
                "to faithfully discharging the duties assigned by Employer and complying with all internal policies."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading="2. Salary, Benefits & Compensation",
            content=(
                f"Employer shall pay Employee consideration in accordance with the following terms: {req.clauses.payment_terms or 'Standard payroll intervals'}. "
                f"Employee shall be eligible for all standard corporate benefits, subject to plan terms."
            )
        ))
        sec_num += 1
        if req.clauses.non_compete_duration:
            sections.append(DocumentSection(
                number=sec_num,
                heading=f"3. Restrictive Covenants & Non-Compete",
                content=(
                    f"During employment and for a duration of {req.clauses.non_compete_duration} following termination, Employee shall not directly "
                    f"or indirectly engage in or assist any business that competes within the scope: {req.clauses.non_compete_scope or 'Designated market territory'}."
                )
            ))
            sec_num += 1

    else:
        # General Contract
        sections.append(DocumentSection(
            number=sec_num,
            heading="1. Purpose and Mutual Undertakings",
            content=(
                "The parties agree to carry out the transactions, deliveries, and commitments set forth herein in accordance with good faith, "
                "commercial reasonableness, and standard business practices."
            )
        ))
        sec_num += 1
        sections.append(DocumentSection(
            number=sec_num,
            heading="2. Consideration & Performance Terms",
            content=(
                f"The parties agree to the following consideration and performance schedule: {req.clauses.payment_terms or 'As mutually invoiced and agreed'}."
            )
        ))
        sec_num += 1

    # Add custom user clauses if specified
    for custom in req.clauses.custom_clauses:
        sections.append(DocumentSection(
            number=sec_num,
            heading=f"{sec_num}. {custom.title}",
            content=f"{custom.requirements} Both parties agree to strictly abide by this customized provision as a material term of this Agreement."
        ))
        sec_num += 1

    # Standard Boilerplate Clauses
    sections.append(DocumentSection(
        number=sec_num,
        heading=f"{sec_num}. Term and Termination",
        content=(
            f"This Agreement becomes effective as of {req.clauses.effective_date}. Either party may terminate this Agreement upon "
            f"{req.clauses.termination_notice or '30 days prior written notice'} or immediately in the event of an uncured material breach by the other party."
        )
    ))
    sec_num += 1

    sections.append(DocumentSection(
        number=sec_num,
        heading=f"{sec_num}. Dispute Resolution and Arbitration",
        content=(
            f"Any dispute, controversy, or claim arising under or relating to this Agreement shall be resolved through "
            f"{req.clauses.dispute_resolution or 'Binding Arbitration'} in the jurisdiction of {req.clauses.jurisdiction}. "
            f"The prevailing party shall be entitled to recover reasonable attorney fees and legal costs."
        )
    ))
    sec_num += 1

    sections.append(DocumentSection(
        number=sec_num,
        heading=f"{sec_num}. Governing Law & Severability",
        content=(
            f"This Agreement shall be construed, interpreted, and governed under the {req.clauses.governing_law or 'laws of the applicable jurisdiction'}. "
            f"If any provision is found unenforceable by a court of competent authority, the remaining provisions shall continue in full legal force."
        )
    ))
    sec_num += 1

    sections.append(DocumentSection(
        number=sec_num,
        heading=f"{sec_num}. Entire Agreement & Amendments",
        content=(
            "This document constitutes the entire agreement between the parties with respect to the subject matter hereof, superseding "
            "all prior representations, oral agreements, and understandings. No amendment shall be binding unless made in writing and executed by both parties."
        )
    ))

    metadata = DocumentMetadata(
        jurisdiction=req.clauses.jurisdiction,
        governing_law=req.clauses.governing_law,
        effective_date=req.clauses.effective_date,
        disclaimer=LEGAL_DISCLAIMER,
        generated_at=datetime.now().isoformat(),
        model_used="LegalEase Deterministic Engine (Demo Mode)",
        is_demo_mode=True,
    )

    return GeneratedDocumentResponse(
        id=doc_id,
        title=title,
        document_type=doc_type,
        parties=doc_parties,
        recitals=recitals,
        sections=sections,
        signatures=signatures,
        metadata=metadata,
        raw_text_fallback=None,
    )
