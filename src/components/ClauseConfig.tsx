import React from 'react';
import { Sliders, Plus, Trash2, ShieldCheck, Scale, DollarSign, Calendar, Clock } from 'lucide-react';
import { ClauseConfigInput, CustomClauseInput, DocumentType } from '../types';

interface ClauseConfigProps {
  documentType: DocumentType;
  clauses: ClauseConfigInput;
  setClauses: React.Dispatch<React.SetStateAction<ClauseConfigInput>>;
}

export const ClauseConfig: React.FC<ClauseConfigProps> = ({
  documentType,
  clauses,
  setClauses,
}) => {
  const updateField = (field: keyof ClauseConfigInput, value: any) => {
    setClauses((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomClause = () => {
    const newClause: CustomClauseInput = {
      id: Math.random().toString(36).substring(2, 9),
      title: '',
      requirements: '',
    };
    setClauses((prev) => ({
      ...prev,
      custom_clauses: [...prev.custom_clauses, newClause],
    }));
  };

  const updateCustomClause = (
    id: string,
    field: 'title' | 'requirements',
    val: string
  ) => {
    setClauses((prev) => ({
      ...prev,
      custom_clauses: prev.custom_clauses.map((c) =>
        c.id === id ? { ...c, [field]: val } : c
      ),
    }));
  };

  const removeCustomClause = (id: string) => {
    setClauses((prev) => ({
      ...prev,
      custom_clauses: prev.custom_clauses.filter((c) => c.id !== id),
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Clause & Legal Configuration</h3>
            <p className="text-xs text-slate-500">
              Customize core legal terms, governing law, timelines, and specialized covenants
            </p>
          </div>
        </div>
      </div>

      {/* Grid of standard legal controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Purpose of Agreement / NDA */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center">
            <Scale className="w-3.5 h-3.5 mr-1 text-amber-700" />
            Purpose of Agreement / Disclosure <span className="text-rose-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={clauses.purpose || ''}
            onChange={(e) => updateField('purpose', e.target.value)}
            placeholder="e.g. Evaluating potential strategic partnership, technology development, and commercial cooperation"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            States the explicit business purpose for which proprietary data may be disclosed and utilized.
          </p>
        </div>

        {/* Jurisdiction */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
            <Scale className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Jurisdiction (State / Country)
          </label>
          <input
            type="text"
            value={clauses.jurisdiction}
            onChange={(e) => updateField('jurisdiction', e.target.value)}
            placeholder="e.g. State of California, USA"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Governing Law */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Governing Law
          </label>
          <input
            type="text"
            value={clauses.governing_law}
            onChange={(e) => updateField('governing_law', e.target.value)}
            placeholder="e.g. Laws of the State of California"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Effective Date */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Effective Date
          </label>
          <input
            type="text"
            value={clauses.effective_date}
            onChange={(e) => updateField('effective_date', e.target.value)}
            placeholder="e.g. Upon signature by both parties"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Payment Terms */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
            <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Payment Terms & Consideration
          </label>
          <input
            type="text"
            value={clauses.payment_terms || ''}
            onChange={(e) => updateField('payment_terms', e.target.value)}
            placeholder="e.g. Net 30 days upon submission of invoice; 50% upfront retainer"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Termination Notice */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
            Termination Notice Period
          </label>
          <input
            type="text"
            value={clauses.termination_notice || ''}
            onChange={(e) => updateField('termination_notice', e.target.value)}
            placeholder="e.g. 30 days prior written notice"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Confidentiality Term (NDA or general) */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Confidentiality Term
          </label>
          <input
            type="text"
            value={clauses.confidentiality_term || ''}
            onChange={(e) => updateField('confidentiality_term', e.target.value)}
            placeholder="e.g. 2 years from disclosure / Perpetual for trade secrets"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Dispute Resolution */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Dispute Resolution Mechanism
          </label>
          <input
            type="text"
            value={clauses.dispute_resolution || ''}
            onChange={(e) => updateField('dispute_resolution', e.target.value)}
            placeholder="e.g. Binding confidential arbitration under AAA rules in San Francisco, CA"
            className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
        </div>

        {/* Non-Compete (if Employment/Service/Freelance) */}
        {(documentType === 'Employment Agreement' ||
          documentType === 'Service Agreement' ||
          documentType === 'Freelance Agreement') && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Non-Compete Duration
              </label>
              <input
                type="text"
                value={clauses.non_compete_duration || ''}
                onChange={(e) => updateField('non_compete_duration', e.target.value)}
                placeholder="e.g. 12 months post-termination"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Non-Compete Geographic Scope
              </label>
              <input
                type="text"
                value={clauses.non_compete_scope || ''}
                onChange={(e) => updateField('non_compete_scope', e.target.value)}
                placeholder="e.g. Within a 50-mile radius of company headquarters"
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>
          </>
        )}
      </div>

      {/* Custom Clauses Dynamic Section */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Custom Clauses & Special Provisions ({clauses.custom_clauses.length})
            </h4>
            <p className="text-[11px] text-slate-500">
              Add user-defined covenants (e.g. Intellectual Property Assignment, Force Majeure, Audit Rights)
            </p>
          </div>

          <button
            type="button"
            onClick={addCustomClause}
            className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Custom Clause</span>
          </button>
        </div>

        {clauses.custom_clauses.map((clause, idx) => (
          <div
            key={clause.id}
            className="p-3 bg-amber-50/40 rounded-lg border border-amber-200/60 space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900">Custom Clause #{idx + 1}</span>
              <button
                type="button"
                onClick={() => removeCustomClause(clause.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={clause.title}
                onChange={(e) => updateCustomClause(clause.id, 'title', e.target.value)}
                placeholder="Clause Title (e.g. Source Code Escrow)"
                className="text-xs px-2.5 py-1.5 rounded border border-amber-300/70 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
              <input
                type="text"
                value={clause.requirements}
                onChange={(e) => updateCustomClause(clause.id, 'requirements', e.target.value)}
                placeholder="Specific instructions or legal requirements for this clause..."
                className="md:col-span-2 text-xs px-2.5 py-1.5 rounded border border-amber-300/70 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
