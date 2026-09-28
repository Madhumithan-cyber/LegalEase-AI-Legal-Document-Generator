import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Bookmark,
  History,
  AlertCircle,
  CheckCircle2,
  Info,
  Scale,
  RefreshCw,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

import {
  DocumentType,
  PartyInput,
  ClauseConfigInput,
  GeneratedDocument,
  TemplateSummary,
  HealthStatus,
  GenerateDocumentRequest,
} from './types';

import { fetchHealth, fetchTemplates, generateDocument } from './services/api';
import { Header } from './components/Header';
import { DocumentTypeSelector } from './components/DocumentTypeSelector';
import { PartyManager } from './components/PartyManager';
import { ClauseConfig } from './components/ClauseConfig';
import { DocumentPreview } from './components/DocumentPreview';
import { TemplatesModal } from './components/TemplatesModal';
import { HistoryModal } from './components/HistoryModal';
import { GenerationProgress } from './components/GenerationProgress';

const DEFAULT_PARTIES: PartyInput[] = [
  {
    id: 'p1',
    name: 'Nexus Dynamics Technologies Inc.',
    role: 'Discloser',
    legal_type: 'Corporation',
    address: '500 Technology Way, Suite 300, Palo Alto, CA 94304',
    signatory_name: 'David Reynolds',
    signatory_title: 'Chief Executive Officer',
  },
  {
    id: 'p2',
    name: 'Aether Strategy Partners LLC',
    role: 'Recipient',
    legal_type: 'Limited Liability Company (LLC)',
    address: '101 California St, Floor 22, San Francisco, CA 94111',
    signatory_name: 'Elena Rostova',
    signatory_title: 'Managing Member',
  },
];

const DEFAULT_CLAUSES: ClauseConfigInput = {
  jurisdiction: 'State of California, United States',
  governing_law: 'Laws of the State of California',
  effective_date: 'Upon execution by both parties',
  confidentiality_term: '2 years from date of disclosure',
  non_compete_duration: '12 months',
  non_compete_scope: 'Direct competitors within California',
  payment_terms: 'Net 30 days upon invoice receipt',
  termination_notice: '30 days prior written notice',
  dispute_resolution: 'Binding confidential arbitration under AAA rules in San Francisco, CA',
  custom_clauses: [
    {
      id: 'c1',
      title: 'Injunctive Relief and Remedies',
      requirements:
        'In the event of an actual or threatened breach of confidentiality covenants, the disclosing party shall be entitled to seek immediate preliminary and permanent injunctive relief without the necessity of posting a bond.',
    },
  ],
};

export default function App() {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'draft' | 'preview' | 'templates' | 'history'>('draft');
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Form State
  const [documentType, setDocumentType] = useState<DocumentType>('NDA');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [parties, setParties] = useState<PartyInput[]>(DEFAULT_PARTIES);
  const [clauses, setClauses] = useState<ClauseConfigInput>(DEFAULT_CLAUSES);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Generated Document & Engine State
  const [currentDocument, setCurrentDocument] = useState<GeneratedDocument | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [history, setHistory] = useState<GeneratedDocument[]>([]);

  // Initialize data on mount
  useEffect(() => {
    // 1. Health check
    fetchHealth().then((h) => setHealth(h));

    // 2. Load templates
    fetchTemplates().then((tpls) => setTemplates(tpls));

    // 3. Load saved history from localStorage
    try {
      const savedHistory = localStorage.getItem('legalease_document_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (doc: GeneratedDocument) => {
    try {
      const updated = [doc, ...history.filter((h) => h.id !== doc.id)].slice(0, 30);
      setHistory(updated);
      localStorage.setItem('legalease_document_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('legalease_document_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('legalease_document_history');
  };

  // Load a starter template
  const handleLoadTemplate = (tpl: TemplateSummary) => {
    setDocumentType(tpl.document_type);
    setCustomTitle(tpl.name);

    if (tpl.recommended_parties && tpl.recommended_parties.length > 0) {
      setParties(
        tpl.recommended_parties.map((p, idx) => ({
          id: `tpl-party-${idx}`,
          name: p.name,
          role: p.role,
          legal_type: p.legal_type,
          address: p.address,
          signatory_name: p.signatory_name || p.name,
          signatory_title: p.signatory_title || 'Authorized Representative',
        }))
      );
    }

    setClauses((prev) => ({
      ...prev,
      ...tpl.default_clause_settings,
    }));

    setNoticeMessage(`Loaded "${tpl.name}" template into Draft Studio.`);
    setTimeout(() => setNoticeMessage(null), 4000);
    setActiveTab('draft');
  };

  // Primary Document Generation Handler
  const handleGenerate = async () => {
    // Validation
    setErrorMessage(null);
    if (!parties || parties.length === 0) {
      setErrorMessage('Please specify at least one contracting party.');
      return;
    }

    const emptyParties = parties.filter((p) => !p.name.trim() || !p.address.trim());
    if (emptyParties.length > 0) {
      setErrorMessage('All parties must include a valid legal name and address.');
      return;
    }

    setIsGenerating(true);

    const payload: GenerateDocumentRequest = {
      document_type: documentType,
      custom_title: customTitle.trim() || undefined,
      parties,
      clauses,
      additional_notes: additionalNotes.trim() || undefined,
    };

    try {
      const { doc, notice } = await generateDocument(payload);
      setCurrentDocument(doc);
      saveToHistory(doc);
      setActiveTab('preview');

      if (notice) {
        setNoticeMessage(notice);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during document generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      {/* Top Navigation */}
      <Header
        health={health}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasDocument={!!currentDocument}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* College Project Demo Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 font-serif font-bold text-sm tracking-wide flex items-center">
                <Scale className="w-4 h-4 mr-1.5" />
                LegalEase AI Document Drafting Platform
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                College Project Demo
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Official full-stack architecture powered by <strong>FastAPI &amp; Pydantic</strong> backend with{' '}
              <strong>Google Gemini 3.8 Flash</strong> for structured legal JSON generation, complemented by deterministic
              Demo Mode fallbacks and multi-format exports (DOCX, PDF, TXT).
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsTemplatesOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10"
            >
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Template</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/10"
              >
                <History className="w-3.5 h-3.5 text-indigo-400" />
                <span>History ({history.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Notice / Error Banners */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start justify-between shadow-xs">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {noticeMessage && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start justify-between shadow-xs">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
            <button
              onClick={() => setNoticeMessage(null)}
              className="text-amber-700 hover:text-amber-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Draft Studio */}
        {activeTab === 'draft' && (
          <div className="space-y-6">
            {/* Step 1: Document Type Selection */}
            <DocumentTypeSelector
              selectedType={documentType}
              onSelect={setDocumentType}
              customTitle={customTitle}
              setCustomTitle={setCustomTitle}
            />

            {/* Step 2: Contracting Parties */}
            <PartyManager parties={parties} setParties={setParties} />

            {/* Step 3: Clause & Legal Configuration */}
            <ClauseConfig
              documentType={documentType}
              clauses={clauses}
              setClauses={setClauses}
            />

            {/* Step 4: Special Instructions / Context */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-2">
              <label className="block text-xs font-semibold text-slate-900">
                Additional Instructions or Background Context (Optional)
              </label>
              <p className="text-[11px] text-slate-500">
                Add any specific business context, milestones, or non-standard provisions to inform the drafting engine
              </p>
              <textarea
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Include specific software source code delivery milestones, 14-day defect cure window, or mutual non-solicitation of key engineers."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>

            {/* Draft Action Button */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Ready to draft <strong>{documentType}</strong> with {parties.length} parties and{' '}
                  {clauses.custom_clauses.length} custom clauses.
                </span>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset form fields to defaults?')) {
                      setParties(DEFAULT_PARTIES);
                      setClauses(DEFAULT_CLAUSES);
                      setCustomTitle('');
                      setAdditionalNotes('');
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Reset Form
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Legal Document</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Document Preview & Editor */}
        {activeTab === 'preview' && currentDocument && (
          <DocumentPreview
            document={currentDocument}
            onUpdateDocument={(updated) => {
              setCurrentDocument(updated);
              saveToHistory(updated);
            }}
            onNewDraft={() => setActiveTab('draft')}
          />
        )}
      </main>

      {/* Progress Overlay during Generation */}
      {isGenerating && (
        <GenerationProgress
          documentType={documentType}
          isDemoMode={!health?.gemini_configured}
        />
      )}

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        templates={templates}
        onSelectTemplate={handleLoadTemplate}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDocument={(doc) => {
          setCurrentDocument(doc);
          setActiveTab('preview');
        }}
        onDeleteHistoryItem={deleteHistoryItem}
        onClearHistory={clearHistory}
      />

      {/* Global Educational Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs space-y-2 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <span className="font-semibold text-white">LegalEase</span> – AI-Powered Legal Document Generator
            <p className="text-[11px] text-slate-500 mt-0.5">
              Developed for College Project Presentation • FastAPI + Pydantic + Google Gemini
            </p>
          </div>

          <div className="text-[11px] text-slate-500">
            <span>DISCLAIMER: For educational/project demonstration purposes only. Consult legal counsel.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
