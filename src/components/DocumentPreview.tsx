import React, { useState } from 'react';
import {
  Download,
  Printer,
  FileText,
  Copy,
  Check,
  Edit3,
  Save,
  Plus,
  Trash2,
  Scale,
  Shield,
  Building,
  AlertTriangle,
} from 'lucide-react';
import { GeneratedDocument, DocumentSection } from '../types';
import { exportToTXT, exportToDOCX, exportToPDF, printDocument } from '../utils/export';

interface DocumentPreviewProps {
  document: GeneratedDocument;
  onUpdateDocument: (doc: GeneratedDocument) => void;
  onNewDraft: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document: doc,
  onUpdateDocument,
  onNewDraft,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(doc.title);
  const [editedSections, setEditedSections] = useState<DocumentSection[]>(doc.sections);
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [showLogoInput, setShowLogoInput] = useState(false);

  const handleCopy = () => {
    let fullText = `${doc.title}\n\n`;
    doc.parties.forEach((p) => {
      fullText += `${p.name} (${p.role}) - ${p.address}\n`;
    });
    fullText += '\n';
    if (doc.recitals) {
      doc.recitals.forEach((r) => {
        fullText += `${r}\n\n`;
      });
    }
    doc.sections.forEach((s) => {
      fullText += `${s.heading}\n${s.content}\n\n`;
    });
    doc.signatures.forEach((sig) => {
      fullText += `PARTY: ${sig.party_name} (${sig.role})\nSignature: _______________\nName: ${sig.signatory_name || sig.party_name}\n\n`;
    });
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdits = () => {
    const updated: GeneratedDocument = {
      ...doc,
      title: editedTitle,
      sections: editedSections,
    };
    onUpdateDocument(updated);
    setIsEditing(false);
  };

  const updateSectionHeading = (idx: number, heading: string) => {
    const updated = [...editedSections];
    updated[idx] = { ...updated[idx], heading };
    setEditedSections(updated);
  };

  const updateSectionContent = (idx: number, content: string) => {
    const updated = [...editedSections];
    updated[idx] = { ...updated[idx], content };
    setEditedSections(updated);
  };

  const addSection = () => {
    const nextNum = editedSections.length + 1;
    const newSec: DocumentSection = {
      number: nextNum,
      heading: `${nextNum}. Additional Provision`,
      content: 'The parties agree to the terms and specifications set forth in this provision.',
    };
    setEditedSections([...editedSections, newSec]);
  };

  const removeSection = (idx: number) => {
    const filtered = editedSections.filter((_, i) => i !== idx);
    setEditedSections(filtered);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-wrap items-center justify-between gap-3 sticky top-20 z-30 print:hidden">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-200">
            {doc.document_type}
          </span>
          {doc.metadata.is_demo_mode ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-300">
              Demo Mode Template
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300">
              Gemini AI Structured
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveEdits();
              } else {
                setEditedTitle(doc.title);
                setEditedSections(doc.sections);
                setIsEditing(true);
              }
            }}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border shadow-sm ${
              isEditing
                ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Document'}</span>
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium rounded-lg transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Export TXT */}
          <button
            onClick={() => exportToTXT(doc)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium rounded-lg transition-colors shadow-sm"
            title="Download plain text file"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>TXT</span>
          </button>

          {/* Export DOCX */}
          <button
            onClick={() => exportToDOCX(doc)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold rounded-lg transition-colors shadow-sm"
            title="Download formatted Microsoft Word document (.docx)"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>DOCX</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={() => exportToPDF(doc)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold rounded-lg transition-colors shadow-sm"
            title="Download formatted PDF document"
          >
            <Download className="w-3.5 h-3.5 text-rose-700" />
            <span>PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={printDocument}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            title="Print or Save via system dialog"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Optional Logo Branding Toggle */}
          <button
            onClick={() => setShowLogoInput(!showLogoInput)}
            className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition-colors"
            title="Add branding logo"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Letterhead</span>
          </button>
        </div>
      </div>

      {/* Optional Letterhead Logo Input */}
      {showLogoInput && (
        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg flex items-center space-x-3 text-xs print:hidden">
          <label className="font-medium text-amber-900 shrink-0">Custom Logo URL:</label>
          <input
            type="text"
            value={customLogoUrl}
            onChange={(e) => setCustomLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="flex-1 px-2.5 py-1 text-xs rounded border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
          />
          {customLogoUrl && (
            <button
              onClick={() => setCustomLogoUrl('')}
              className="text-xs text-rose-600 hover:underline"
            >
              Remove Logo
            </button>
          )}
        </div>
      )}

      {/* Formal Document Sheet (Printable Layout) */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-lg p-8 sm:p-12 max-w-4xl mx-auto font-serif text-slate-800 leading-relaxed printable-document">
        {/* Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center space-y-3">
          {customLogoUrl ? (
            <div className="flex justify-center mb-3">
              <img
                src={customLogoUrl}
                alt="Organization Logo"
                className="h-14 max-w-[200px] object-contain"
                onError={() => alert('Could not load image from provided URL.')}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-slate-400 mb-2">
              <Scale className="w-6 h-6 text-amber-700" />
              <span className="font-sans text-xs tracking-widest uppercase font-semibold text-slate-500">
                Official Legal Agreement
              </span>
            </div>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-center font-bold text-2xl uppercase tracking-wider text-slate-900 border-b border-amber-500 py-1 bg-amber-50/40 focus:outline-none font-serif"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-slate-900">
              {doc.title}
            </h1>
          )}

          <div className="text-xs font-sans text-slate-500 flex flex-wrap justify-center gap-x-6 gap-y-1 pt-1">
            <span>
              <strong>Effective Date:</strong> {doc.metadata.effective_date}
            </span>
            <span>
              <strong>Jurisdiction:</strong> {doc.metadata.jurisdiction}
            </span>
            <span>
              <strong>Governing Law:</strong> {doc.metadata.governing_law}
            </span>
          </div>
        </div>

        {/* Preamble & Contracting Parties */}
        <div className="space-y-4 mb-8 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>THIS {doc.document_type.toUpperCase()}</strong> (this &ldquo;Agreement&rdquo;) is entered into
            and made effective as of <strong>{doc.metadata.effective_date}</strong> (the &ldquo;Effective Date&rdquo;),
            by and between the following contracting parties:
          </p>

          <div className="space-y-2 pl-4 border-l-2 border-slate-300">
            {doc.parties.map((party, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-semibold text-slate-900">{party.name}</span>, a{' '}
                <span className="italic">{party.legal_type}</span> having its principal address or residence at{' '}
                <span className="italic">{party.address}</span> (hereinafter designated as the{' '}
                <strong>&ldquo;{party.role}&rdquo;</strong>){idx < doc.parties.length - 1 ? '; and' : '.'}
              </div>
            ))}
          </div>

          <p className="text-sm italic text-slate-600">
            The {doc.parties.map((p) => p.role).join(' and ')} may individually be referred to as a
            &ldquo;Party&rdquo; and collectively as the &ldquo;Parties.&rdquo;
          </p>
        </div>

        {/* Recitals */}
        {doc.recitals && doc.recitals.length > 0 && (
          <div className="space-y-3 mb-8 text-sm leading-relaxed">
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-500 mb-2">
              RECITALS
            </h3>
            {doc.recitals.map((recital, idx) => (
              <p key={idx} className="italic text-slate-700">
                {recital}
              </p>
            ))}
            <p className="font-semibold text-slate-900 pt-2">
              NOW, THEREFORE, in consideration of the mutual covenants contained herein and other good and valuable
              consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:
            </p>
          </div>
        )}

        {/* Operative Articles / Sections */}
        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-500">
              TERMS AND CONDITIONS
            </h3>
            {isEditing && (
              <button
                type="button"
                onClick={addSection}
                className="inline-flex items-center space-x-1 text-xs text-amber-700 hover:text-amber-800 font-sans font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Article</span>
              </button>
            )}
          </div>

          {(isEditing ? editedSections : doc.sections).map((section, idx) => (
            <div key={idx} className="space-y-2 group">
              {isEditing ? (
                <div className="space-y-2 p-3 bg-slate-50 rounded border border-slate-300">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => updateSectionHeading(idx, e.target.value)}
                      className="font-bold text-sm text-slate-900 border-b border-slate-300 w-full focus:outline-none focus:border-amber-600 bg-transparent font-serif"
                    />
                    <button
                      type="button"
                      onClick={() => removeSection(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-2"
                      title="Delete this section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={section.content}
                    onChange={(e) => updateSectionContent(idx, e.target.value)}
                    className="w-full text-xs text-slate-700 p-2 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>
              ) : (
                <>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{section.heading}</h4>
                  <p className="text-sm leading-relaxed text-slate-700 text-justify">{section.content}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Execution & Signatures */}
        <div className="pt-8 border-t-2 border-slate-900 mb-8 space-y-6">
          <p className="text-sm font-semibold text-slate-900">
            IN WITNESS WHEREOF, the Parties hereto have caused this {doc.document_type} to be duly executed and delivered
            by their authorized signatories as of the date first above written.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {doc.signatures.map((sig, idx) => (
              <div key={idx} className="space-y-3 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="text-xs uppercase font-sans font-bold text-slate-600">
                  For and on behalf of:
                </div>
                <div className="text-sm font-bold text-slate-900">{sig.party_name}</div>
                <div className="text-xs text-slate-500 italic">Role: {sig.role}</div>

                <div className="pt-6 border-b border-slate-400"></div>
                <div className="text-xs text-slate-600 font-sans">Authorized Signature</div>

                <div className="space-y-1 text-xs font-sans text-slate-700">
                  <div>
                    <span className="text-slate-500">Printed Name:</span>{' '}
                    <strong>{sig.signatory_name || sig.party_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Title:</span> {sig.signatory_title || 'Authorized Representative'}
                  </div>
                  <div>
                    <span className="text-slate-500">Date:</span> {sig.date || '______________________'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Educational Disclaimer */}
        <div className="pt-6 border-t border-slate-200 text-[11px] font-sans text-slate-500 space-y-1 leading-normal">
          <div className="flex items-center text-amber-800 font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            <span>Legal Notice & Educational Project Disclaimer</span>
          </div>
          <p>{doc.metadata.disclaimer}</p>
          <p className="text-[10px] text-slate-400">
            Drafted with LegalEase Engine • Model: {doc.metadata.model_used} • Generated on{' '}
            {new Date(doc.metadata.generated_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
