import React from 'react';
import { X, Bookmark, ArrowRight, ShieldCheck, Users, Sliders } from 'lucide-react';
import { TemplateSummary } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: TemplateSummary[];
  onSelectTemplate: (template: TemplateSummary) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Legal Agreement Templates</h2>
              <p className="text-xs text-slate-500">
                Pre-configured verified contract frameworks ready to customize and draft
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates List */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between bg-white group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      {tpl.document_type}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                    {tpl.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{tpl.recommended_parties.map((p) => p.role).join(' & ')}</span>
                    </div>
                    {tpl.default_clause_settings.jurisdiction && (
                      <div className="flex items-center space-x-1.5">
                        <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{tpl.default_clause_settings.jurisdiction}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onSelectTemplate(tpl);
                      onClose();
                    }}
                    className="w-full inline-flex items-center justify-center space-x-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    <span>Load Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
