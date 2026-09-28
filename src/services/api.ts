import {
  GenerateDocumentRequest,
  GeneratedDocument,
  TemplateSummary,
  HealthStatus,
} from '../types';

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      throw new Error(`Health check failed: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    return {
      status: 'offline',
      service: 'LegalEase Client (Standalone)',
      gemini_configured: false,
      mode: 'Client Fallback Mode',
      version: '1.0.0',
    };
  }
}

export async function fetchTemplates(): Promise<TemplateSummary[]> {
  try {
    const res = await fetch('/api/templates');
    if (!res.ok) {
      throw new Error(`Templates request failed: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn('Using client-side fallback templates:', error);
    return getFallbackTemplates();
  }
}

export async function generateDocument(
  payload: GenerateDocumentRequest
): Promise<{ doc: GeneratedDocument; notice?: string }> {
  try {
    const res = await fetch('/api/generate-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const noticeHeader = res.headers.get('X-LegalEase-Notice');

    if (!res.ok) {
      let errorMsg = 'Failed to generate document';
      try {
        const errJson = await res.json();
        errorMsg = errJson.detail || errJson.message || errorMsg;
      } catch {
        errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMsg);
    }

    const doc: GeneratedDocument = await res.json();
    return { doc, notice: noticeHeader || undefined };
  } catch (error: any) {
    console.error('API call failed, generating deterministic document on client:', error);
    // If backend is completely unreachable, generate safe fallback document locally
    const fallbackDoc = generateClientFallbackDocument(payload);
    return {
      doc: fallbackDoc,
      notice: `Operating in Client Demo Mode: Backend connection error (${error.message || 'offline'}).`,
    };
  }
}

function getFallbackTemplates(): TemplateSummary[] {
  return [
    {
      id: 'nda-bilateral',
      name: 'Mutual Non-Disclosure Agreement (NDA)',
      document_type: 'NDA',
      description: 'Standard bilateral confidentiality agreement protecting proprietary information and trade secrets.',
      recommended_parties: [
        {
          role: 'Discloser',
          name: 'Acme Innovations Inc.',
          legal_type: 'Corporation',
          address: '100 Tech Blvd, Suite 400, San Francisco, CA 94105',
          signatory_name: 'Jane Doe',
          signatory_title: 'Chief Technology Officer',
        },
        {
          role: 'Recipient',
          name: 'Vertex Strategic Partners LLC',
          legal_type: 'Limited Liability Company (LLC)',
          address: '500 Market St, Floor 12, San Francisco, CA 94102',
          signatory_name: 'John Smith',
          signatory_title: 'Managing Partner',
        },
      ],
      default_clause_settings: {
        jurisdiction: 'State of California, United States',
        governing_law: 'Laws of the State of California',
        effective_date: 'Upon execution',
        confidentiality_term: '2 years from disclosure date',
        dispute_resolution: 'Binding confidential arbitration under AAA rules in San Francisco, CA',
        termination_notice: '30 days prior written notice',
      },
    },
    {
      id: 'freelance-master',
      name: 'Independent Freelance Agreement',
      document_type: 'Freelance Agreement',
      description: 'Scope of work, IP transfer, milestone payments, and independent contractor terms.',
      recommended_parties: [
        {
          role: 'Client',
          name: 'Horizon Digital Media Corp.',
          legal_type: 'Corporation',
          address: '742 Evergreen Terrace, Austin, TX 78701',
          signatory_name: 'Sarah Connor',
          signatory_title: 'VP of Operations',
        },
        {
          role: 'Contractor',
          name: 'Alex Morgan',
          legal_type: 'Individual',
          address: '123 Creative Studio Way, Austin, TX 78704',
          signatory_name: 'Alex Morgan',
          signatory_title: 'Independent Specialist',
        },
      ],
      default_clause_settings: {
        jurisdiction: 'State of Texas, United States',
        governing_law: 'Laws of the State of Texas',
        effective_date: 'Upon execution',
        payment_terms: '50% upfront deposit, 50% upon final acceptance; Net 15 days',
        dispute_resolution: 'Mediation followed by binding arbitration in Travis County, TX',
        termination_notice: '14 days written notice by either party',
      },
    },
    {
      id: 'commercial-lease',
      name: 'Residential & Commercial Lease Agreement',
      document_type: 'Lease Agreement',
      description: 'Premises, rent schedule, security deposits, and maintenance obligations.',
      recommended_parties: [
        {
          role: 'Landlord',
          name: 'Apex Property Holdings LLC',
          legal_type: 'Limited Liability Company (LLC)',
          address: '250 Commercial Way, Seattle, WA 98101',
          signatory_name: 'Robert Sterling',
          signatory_title: 'Asset Manager',
        },
        {
          role: 'Tenant',
          name: 'Elena Rostova',
          legal_type: 'Individual',
          address: '404 Pine St, Apt 3B, Seattle, WA 98101',
          signatory_name: 'Elena Rostova',
          signatory_title: 'Tenant',
        },
      ],
      default_clause_settings: {
        jurisdiction: 'State of Washington, United States',
        governing_law: 'Laws of the State of Washington and municipal codes',
        effective_date: 'First day of upcoming calendar month',
        payment_terms: '$2,500 due on the 1st of each month with a 5-day grace period',
        termination_notice: '60 days written notice prior to term expiration',
        dispute_resolution: 'King County District Court',
      },
    },
  ];
}

function generateClientFallbackDocument(req: GenerateDocumentRequest): GeneratedDocument {
  const docId = `legalease-${Math.random().toString(36).substring(2, 10)}`;
  const title = req.custom_title || `${req.document_type.toUpperCase()} AGREEMENT`;
  const parties = req.parties.map((p) => ({
    name: p.name,
    role: p.role,
    legal_type: p.legal_type,
    address: p.address,
  }));

  const nowFormatted = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const signatures = req.parties.map((p) => ({
    party_name: p.name,
    role: p.role,
    signatory_name: p.signatory_name || p.name,
    signatory_title: p.signatory_title || (p.legal_type === 'Individual' ? 'Individual' : 'Authorized Signatory'),
    date: nowFormatted,
  }));

  const pNames = req.parties.map((p) => `"${p.name}" (${p.role})`).join(' and ');
  const recitals = [
    `WHEREAS, this ${req.document_type} is made and entered into as of ${req.clauses.effective_date} by and between ${pNames};`,
    `WHEREAS, the parties desire to establish binding covenants and legal obligations under the laws of ${req.clauses.jurisdiction};`,
    `WHEREAS, both parties acknowledge receipt of good, valuable, and sufficient consideration.`,
  ];

  const sections = [
    {
      number: 1,
      heading: '1. Purpose & Mutual Covenants',
      content: `The parties mutually agree to perform all undertakings specified in this ${req.document_type} in good faith, adhering strictly to the covenants and timelines set forth herein.`,
    },
    {
      number: 2,
      heading: '2. Consideration & Performance Terms',
      content: `In consideration of the undertakings herein, parties agree to the following consideration terms: ${req.clauses.payment_terms || 'Standard agreed commercial compensation terms'}.`,
    },
    {
      number: 3,
      heading: '3. Confidentiality & Non-Disclosure',
      content: `Each party agrees to maintain in confidence all non-public proprietary information disclosed. This obligation shall endure for ${req.clauses.confidentiality_term || '2 years from execution'}.`,
    },
    {
      number: 4,
      heading: '4. Term and Termination',
      content: `This Agreement becomes effective as of ${req.clauses.effective_date}. Either party may terminate with ${req.clauses.termination_notice || '30 days prior written notice'}.`,
    },
    {
      number: 5,
      heading: '5. Dispute Resolution & Governing Law',
      content: `Any dispute arising out of this Agreement shall be resolved through ${req.clauses.dispute_resolution || 'Binding Arbitration'} under the ${req.clauses.governing_law || 'applicable laws'} of ${req.clauses.jurisdiction}.`,
    },
    {
      number: 6,
      heading: '6. Entire Agreement',
      content: `This Agreement constitutes the entire agreement between the parties and supersedes all prior oral or written negotiations.`,
    },
  ];

  return {
    id: docId,
    title,
    document_type: req.document_type,
    parties,
    recitals,
    sections,
    signatures,
    metadata: {
      jurisdiction: req.clauses.jurisdiction,
      governing_law: req.clauses.governing_law,
      effective_date: req.clauses.effective_date,
      disclaimer:
        'DISCLAIMER: LegalEase is an educational/demonstration tool. This document does not constitute legal advice and must be reviewed by a qualified attorney.',
      generated_at: new Date().toISOString(),
      model_used: 'LegalEase Client Engine (Demo Mode)',
      is_demo_mode: true,
    },
  };
}
