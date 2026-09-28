import React from 'react';
import {
  ShieldAlert,
  FileSignature,
  Home,
  Briefcase,
  Laptop,
  Wrench,
  ScrollText,
} from 'lucide-react';
import { DocumentType } from '../types';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType;
  onSelect: (type: DocumentType) => void;
  customTitle: string;
  setCustomTitle: (title: string) => void;
}

interface TypeOption {
  type: DocumentType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const DOCUMENT_OPTIONS: TypeOption[] = [
  {
    type: 'NDA',
    title: 'Non-Disclosure Agreement',
    description: 'Mutual or unilateral confidentiality protection for trade secrets & proprietary data.',
    icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
  },
  {
    type: 'Freelance Agreement',
    title: 'Freelance Agreement',
    description: 'Scope of work, IP ownership, milestone payments, and independent contractor terms.',
    icon: <Laptop className="w-5 h-5 text-indigo-600" />,
  },
  {
    type: 'Lease Agreement',
    title: 'Lease Agreement',
    description: 'Residential & commercial real estate leases, rent schedules, and premises rules.',
    icon: <Home className="w-5 h-5 text-emerald-600" />,
  },
  {
    type: 'Employment Agreement',
    title: 'Employment Agreement',
    description: 'Full-time & part-time employment terms, compensation, duties, and non-compete covenants.',
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
  },
  {
    type: 'Service Agreement',
    title: 'Service Agreement',
    description: 'Professional services, SLAs, warranties, deliverables, and liability limitation.',
    icon: <Wrench className="w-5 h-5 text-cyan-600" />,
  },
  {
    type: 'Contract',
    title: 'Standard Contract',
    description: 'Bilateral commercial agreement with mutual consideration, terms, and warranties.',
    icon: <FileSignature className="w-5 h-5 text-violet-600" />,
  },
  {
    type: 'General Contract',
    title: 'General Contract',
    description: 'Versatile legal agreement adaptable for partnerships, trade, and custom covenants.',
    icon: <ScrollText className="w-5 h-5 text-slate-700" />,
  },
];

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  selectedType,
  onSelect,
  customTitle,
  setCustomTitle,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-slate-900 text-base">Select Document Type</h3>
        <p className="text-xs text-slate-500">
          Choose the formal legal structure for your agreement
        </p>
      </div>

      {/* Grid of Document Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DOCUMENT_OPTIONS.map((opt) => {
          const isSelected = selectedType === opt.type;

          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => onSelect(opt.type)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs">
                  {opt.icon}
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded">
                    Selected
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">{opt.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Title Input */}
      <div className="pt-2">
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Custom Document Title (Optional)
        </label>
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder={`Default: ${selectedType.toUpperCase()} AGREEMENT`}
          className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
        />
      </div>
    </div>
  );
};
