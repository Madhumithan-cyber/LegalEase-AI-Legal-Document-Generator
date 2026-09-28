export type DocumentType =
  | 'NDA'
  | 'Contract'
  | 'Lease Agreement'
  | 'Employment Agreement'
  | 'Freelance Agreement'
  | 'Service Agreement'
  | 'General Contract';

export type PartyRole =
  | 'Discloser'
  | 'Recipient'
  | 'Landlord'
  | 'Tenant'
  | 'Employer'
  | 'Employee'
  | 'Contractor'
  | 'Client'
  | 'Service Provider'
  | 'Other';

export type PartyLegalType =
  | 'Individual'
  | 'Corporation'
  | 'Limited Liability Company (LLC)'
  | 'Partnership'
  | 'Sole Proprietorship'
  | 'Other Legal Entity';

export interface PartyInput {
  id: string;
  name: string;
  role: PartyRole;
  legal_type: PartyLegalType;
  address: string;
  signatory_name?: string;
  signatory_title?: string;
}

export interface CustomClauseInput {
  id: string;
  title: string;
  requirements: string;
}

export interface ClauseConfigInput {
  purpose?: string;
  jurisdiction: string;
  governing_law: string;
  effective_date: string;
  confidentiality_term?: string;
  non_compete_duration?: string;
  non_compete_scope?: string;
  payment_terms?: string;
  termination_notice?: string;
  dispute_resolution?: string;
  custom_clauses: CustomClauseInput[];
}

export interface GenerateDocumentRequest {
  document_type: DocumentType;
  custom_title?: string;
  parties: PartyInput[];
  clauses: ClauseConfigInput;
  additional_notes?: string;
}

export interface DocumentSection {
  number: number;
  heading: string;
  content: string;
}

export interface DocumentParty {
  name: string;
  role: string;
  legal_type: string;
  address: string;
}

export interface DocumentSignature {
  party_name: string;
  role: string;
  signatory_name?: string;
  signatory_title?: string;
  date?: string;
}

export interface DocumentMetadata {
  jurisdiction: string;
  governing_law: string;
  effective_date: string;
  disclaimer: string;
  generated_at: string;
  model_used: string;
  is_demo_mode: boolean;
}

export interface GeneratedDocument {
  id: string;
  title: string;
  document_type: string;
  parties: DocumentParty[];
  recitals: string[];
  sections: DocumentSection[];
  signatures: DocumentSignature[];
  metadata: DocumentMetadata;
}

export interface TemplateSummary {
  id: string;
  name: string;
  document_type: DocumentType;
  description: string;
  recommended_parties: Array<{
    role: PartyRole;
    name: string;
    legal_type: PartyLegalType;
    address: string;
    signatory_name?: string;
    signatory_title?: string;
  }>;
  default_clause_settings: Partial<ClauseConfigInput>;
}

export interface HealthStatus {
  status: string;
  service: string;
  fastapi_connected?: boolean;
  gemini_configured: boolean;
  mode: string;
  version: string;
}
